function rgb_black() {
    /**
     * Creates and returns a SolidColour with RGB values for solid black.
     */

    var colour = new SolidColor();
    colour.rgb.red = 0;
    colour.rgb.green = 0;
    colour.rgb.blue = 0;
    return colour;
}

function rgb_white() {
    /**
     * Creates and returns a SolidColour with RGB values for solid white.
     */

    var colour = new SolidColor();
    colour.rgb.red = 255;
    colour.rgb.green = 255;
    colour.rgb.blue = 255;
    return colour;
}

function compute_layer_dimensions(layer) {
    /**
     * Return an object with the specified layer's width and height (computed from its bounds).
     */

    return {
        width: layer.bounds[2] - layer.bounds[0],
        height: layer.bounds[3] - layer.bounds[1]
    };
}

function compute_text_layer_dimensions(layer) {
    /**
     * Return an object with the specified text layer's width and height, which is achieved by rasterising
     * the layer and computing its width and height from its bounds.
     */

    var layer_copy = layer.duplicate(activeDocument, ElementPlacement.INSIDE);
    layer_copy.rasterize(RasterizeType.TEXTCONTENTS);
    var dimensions = compute_layer_dimensions(layer_copy);
    layer_copy.remove();
    return dimensions;
}

function select_layer_pixels(layer) {
    /**
     * Select the bounding box of a given layer.
     */

    var left = layer.bounds[0].as("px");
    var top = layer.bounds[1].as("px");
    var right = layer.bounds[2].as("px");
    var bottom = layer.bounds[3].as("px");

    app.activeDocument.selection.select([
        [left, top],
        [right, top],
        [right, bottom],
        [left, bottom]
    ]);
}

function clear_selection() {
    /**
     * Clear the current selection.
     */

    app.activeDocument.selection.select([]);
}

function align(align_type) {
    /**
     * Align the currently active layer with respect to the current selection, either vertically or horizontally.
     * Intended to be used with align_vertical() or align_horizontal().
     */

    var idAlgn = charIDToTypeID("Algn");
    var desc = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref.putEnumerated(idLyr, idOrdn, idTrgt);
    desc.putReference(idnull, ref);
    var idUsng = charIDToTypeID("Usng");
    var idADSt = charIDToTypeID("ADSt");
    var idAdCH = charIDToTypeID(align_type);  // align type - "AdCV" for vertical, "AdCH" for horizontal
    desc.putEnumerated(idUsng, idADSt, idAdCH);
    executeAction(idAlgn, desc, DialogModes.NO);
}

function align_vertical() {
    /**
     * Align the currently active layer vertically with respect to the current selection.
     */

    align("AdCV");
}

function align_horizontal() {
    /**
     * Align the currently active layer horizontally with respect to the current selection.
     */

    align("AdCH");
}

function frame_layer(layer, reference_layer) {
    /**
     * Scale a layer equally to the bounds of a reference layer, then centre the layer vertically and horizontally
     * within those bounds.
     */

    var layer_dimensions = compute_layer_dimensions(layer);
    var reference_dimensions = compute_layer_dimensions(reference_layer);

    // Determine how much to scale the layer by such that it fits into the reference layer's bounds
    var scale_factor = 100 * Math.max(reference_dimensions.width / layer_dimensions.width, reference_dimensions.height / layer_dimensions.height);

    layer.resize(scale_factor, scale_factor, AnchorPosition.TOPLEFT);
    layer.move(app.activeDocument, ElementPlacement.PLACEATEND);  // activeDocument -> app.activeDocument

    select_layer_pixels(reference_layer);
    app.activeDocument.activeLayer = layer;
    align_horizontal();
    align_vertical();
    clear_selection();
}

function enable_active_layer_mask() {
    /**
     * Enables the active layer's layer mask.
     */

    var idsetd = charIDToTypeID("setd");
    var desc3078 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref1567 = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref1567.putEnumerated(idLyr, idOrdn, idTrgt);
    desc3078.putReference(idnull, ref1567);
    var idT = charIDToTypeID("T   ");
    var desc3079 = new ActionDescriptor();
    var idUsrM = charIDToTypeID("UsrM");
    desc3079.putBoolean(idUsrM, true);
    var idLyr = charIDToTypeID("Lyr ");
    desc3078.putObject(idT, idLyr, desc3079);
    executeAction(idsetd, desc3078, DialogModes.NO);
}

function apply_stroke(stroke_weight, stroke_colour) {
    /**
     * Applies an outer stroke to the active layer with the specified weight and colour.
     */

    idsetd = charIDToTypeID("setd");
    var desc608 = new ActionDescriptor();
    idnull = charIDToTypeID("null");
    var ref149 = new ActionReference();
    var idPrpr = charIDToTypeID("Prpr");
    idLefx = charIDToTypeID("Lefx");
    ref149.putProperty(idPrpr, idLefx);
    idLyr = charIDToTypeID("Lyr ");
    idOrdn = charIDToTypeID("Ordn");
    idTrgt = charIDToTypeID("Trgt");
    ref149.putEnumerated(idLyr, idOrdn, idTrgt);
    desc608.putReference(idnull, ref149);
    idT = charIDToTypeID("T   ");
    var desc609 = new ActionDescriptor();
    var idScl = charIDToTypeID("Scl ");
    idPrc = charIDToTypeID("#Prc");
    desc609.putUnitDouble(idScl, idPrc, 200.000000);
    idFrFX = charIDToTypeID("FrFX");
    var desc610 = new ActionDescriptor();
    var idenab = charIDToTypeID("enab");
    desc610.putBoolean(idenab, true);
    var idStyl = charIDToTypeID("Styl");
    var idFStl = charIDToTypeID("FStl");
    var idInsF = charIDToTypeID("OutF");
    desc610.putEnumerated(idStyl, idFStl, idInsF);
    idPntT = charIDToTypeID("PntT");
    var idFrFl = charIDToTypeID("FrFl");
    var idSClr = charIDToTypeID("SClr");
    desc610.putEnumerated(idPntT, idFrFl, idSClr);
    var idMd = charIDToTypeID("Md  ");
    idBlnM = charIDToTypeID("BlnM");
    var idNrml = charIDToTypeID("Nrml");
    desc610.putEnumerated(idMd, idBlnM, idNrml);
    idOpct = charIDToTypeID("Opct");
    idPrc = charIDToTypeID("#Prc");
    desc610.putUnitDouble(idOpct, idPrc, 100.000000);
    var idSz = charIDToTypeID("Sz  ");
    var idPxl = charIDToTypeID("#Pxl");
    desc610.putUnitDouble(idSz, idPxl, stroke_weight);
    idClr = charIDToTypeID("Clr ");
    var desc611 = new ActionDescriptor();
    idRd = charIDToTypeID("Rd  ");
    desc611.putDouble(idRd, stroke_colour.rgb.red);
    idGrn = charIDToTypeID("Grn ");
    desc611.putDouble(idGrn, stroke_colour.rgb.green);
    idBl = charIDToTypeID("Bl  ");
    desc611.putDouble(idBl, stroke_colour.rgb.blue);
    idRGBC = charIDToTypeID("RGBC");
    desc610.putObject(idClr, idRGBC, desc611);
    idFrFX = charIDToTypeID("FrFX");
    desc609.putObject(idFrFX, idFrFX, desc610);
    idLefx = charIDToTypeID("Lefx");
    desc608.putObject(idT, idLefx, desc609);
    executeAction(idsetd, desc608, DialogModes.NO);
}

function save_and_close(file_name, file_path) {
    /**
     * Saves the current document to the output folder (/out/) as a PNG and closes the document without saving.
     */

    var idsave = charIDToTypeID("save");
    var desc3 = new ActionDescriptor();
    var idAs = charIDToTypeID("As  ");
    var desc4 = new ActionDescriptor();
    var idPGIT = charIDToTypeID("PGIT");
    var idPGIN = charIDToTypeID("PGIN");
    desc4.putEnumerated(idPGIT, idPGIT, idPGIN);
    var idPNGf = charIDToTypeID("PNGf");
    var idPGAd = charIDToTypeID("PGAd");
    desc4.putEnumerated(idPNGf, idPNGf, idPGAd);
    var idPNGF = charIDToTypeID("PNGF");
    desc3.putObject(idAs, idPNGF, desc4);
    var idIn = charIDToTypeID("In  ");
    var file_name_with_path = file_path + '/out/' + file_name + '.png';
    desc3.putPath(idIn, new File(file_name_with_path));
    var idCpy = charIDToTypeID("Cpy ");
    desc3.putBoolean(idCpy, true);
    executeAction(idsave, desc3, DialogModes.NO);

    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}

function strip_reminder_text(oracle_text) {
    /**
     * Strip out any reminder text that a card's oracle text has (reminder text in parentheses).
     */

    var parentheses_regex = /\(.*?\)/;
    oracle_text = oracle_text.replace(parentheses_regex, "");

    // ensure we didn't add any double whitespace by doing that
    var whitespace_regex = / +/g;
    oracle_text = oracle_text.replace(whitespace_regex, " ");

    return oracle_text;
}