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
        width: layer.bounds[2].as("px") - layer.bounds[0].as("px"),
        height: layer.bounds[3].as("px") - layer.bounds[1].as("px"),
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

    select_layer_pixels(reference_layer);
    app.activeDocument.activeLayer = layer;
    align_horizontal();
    align_vertical();
    clear_selection();
}

function set_active_layer_mask(visible) {
    /**
     * Set the visibility of the active layer's layer mask.
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
    desc3079.putBoolean(idUsrM, visible);
    var idLyr = charIDToTypeID("Lyr ");
    desc3078.putObject(idT, idLyr, desc3079);
    executeAction(idsetd, desc3078, DialogModes.NO);
}

function enable_active_layer_mask() {
    /**
     * Enables the active layer's layer mask.
     */

    set_active_layer_mask(true);
}

function disable_active_layer_mask() {
    /**
     * Disables the active layer's layer mask.
     */

    set_active_layer_mask(false);
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
     * If this would empty the string, instead return the original string.
     */

    var oracle_text_stripped = oracle_text;
    var parentheses_regex = /\(.*?\)/;
    oracle_text_stripped = oracle_text_stripped.replace(parentheses_regex, "");

    // ensure we didn't add any double whitespace by doing that
    var whitespace_regex = / +/g;
    oracle_text_stripped = oracle_text_stripped.replace(whitespace_regex, " ");
    if (oracle_text_stripped !== "") {
        return oracle_text_stripped;
    }
    return oracle_text;
}

function get_text_layer_colour(layer) {
    /**
     * Occasionally, Photoshop has issues with retrieving the colour of a text layer. This helper guards
     * against errors and null values by defaulting to rgb_black() in the event of a problem.
     */

    var text_layer_colour;
    try {
        text_layer_colour = layer.textItem.color;
        if (text_layer_colour === undefined || text_layer_colour === null) {
            text_layer_colour = rgb_black();
        }
    } catch (err) {
        text_layer_colour = rgb_black();
    }
    return text_layer_colour;
}

function create_new_layer(layer_name) {
    /**
     * Creates a new layer below the currently active layer. The layer will be visible.
     */
    if (layer_name === undefined) {
        layername = "Layer";
    }

    // create new layer at top of layers
    var active_layer = app.activeDocument.activeLayer;
    var layer = app.activeDocument.artLayers.add();

    // name it & set blend mode to normal
    layer.name = layer_name;
    layer.blendMode = BlendMode.NORMAL;
    layer.visible = true;

    // Move the layer below
    layer.moveAfter(active_layer);

    return layer;
}

function array_index(array, thing) {
    /**
     * Get the first index of thing in array, since Extendscript doesn't come with this.
     */

    if (array !== null && array !== undefined) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === thing) {
                return i;
            }
        }
    }
    return -1;
}

function in_array(array, thing) {
    /**
     * Returns true if thing in array.
     */

    return array_index(array, thing) >= 0;
}

function replace_text(layer, replace_this, replace_with) {
    /**
     * Replace all instances of `replace_this` in the specified layer with `replace_with`.
     */

    app.activeDocument.activeLayer = layer;
    var idreplace = stringIDToTypeID("replace");
    var desc22 = new ActionDescriptor();
    idnull = charIDToTypeID("null");
    var ref3 = new ActionReference();
    var idPrpr = charIDToTypeID("Prpr");
    idreplace = stringIDToTypeID("replace");
    ref3.putProperty(idPrpr, idreplace);
    idTxLr = charIDToTypeID("TxLr");
    idOrdn = charIDToTypeID("Ordn");
    var idAl = charIDToTypeID("Al  ");
    ref3.putEnumerated(idTxLr, idOrdn, idAl);
    desc22.putReference(idnull, ref3);
    var idUsng = charIDToTypeID("Usng");
    var desc23 = new ActionDescriptor();
    var idfind = stringIDToTypeID("find");
    desc23.putString(idfind, replace_this);
    idreplace = stringIDToTypeID("replace");
    desc23.putString(idreplace, replace_with);
    var idcheckAll = stringIDToTypeID("checkAll");
    desc23.putBoolean(idcheckAll, true);
    var idFwd = charIDToTypeID("Fwd ");
    desc23.putBoolean(idFwd, true);
    var idcaseSensitive = stringIDToTypeID("caseSensitive");
    desc23.putBoolean(idcaseSensitive, false);
    var idwholeWord = stringIDToTypeID("wholeWord");
    desc23.putBoolean(idwholeWord, false);
    var idignoreAccents = stringIDToTypeID("ignoreAccents");
    desc23.putBoolean(idignoreAccents, true);
    var idfindReplace = stringIDToTypeID("findReplace");
    desc22.putObject(idUsng, idfindReplace, desc23);
    executeAction(idreplace, desc22, DialogModes.NO);
}

function paste_file(layer, file) {
    /**
     * Pastes the given file into the specified layer.
     */

    var prev_active_layer = app.activeDocument.activeLayer;
    app.activeDocument.activeLayer = layer;
    app.load(file);
    // note context switch to art file
    app.activeDocument.selection.selectAll();
    app.activeDocument.selection.copy();
    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    // note context switch back to template
    app.activeDocument.paste();

    // return document to previous state
    app.activeDocument.activeLayer = prev_active_layer;
}

function paste_file_into_new_layer(file) {
    /**
     * Wrapper for paste_file which creates a new layer for the file next to the active layer. Returns the new layer.
     */

    var new_layer = create_new_layer("New Layer");
    paste_file(new_layer, file);
    return new_layer;
}

function retrieve_scryfall_scan(image_url, file_path) {
    /**
     * Calls the Python script which queries Scryfall for full-res scan and saves the resulting jpeg to disk in \scripts.
     * Returns a File object for the scan if the Python call was successful, or raises an error if it wasn't.
     */

    // default to Windows command
    var python_command = "python \"" + file_path + "/scripts/get_card_scan.py\" \"" + image_url + "\"";
    if ($.os.search(/windows/i) === -1) {
        // macOS
        python_command = "/usr/local/bin/python3 \"" + file_path + "/scripts/get_card_scan.py\" \"" + image_url + "\" >> " + file_path + "/scripts/debug.log 2>&1";
    }
    app.system(python_command);
    return new File(file_path + image_file_path);
}

function insert_scryfall_scan(image_url, file_path) {
    /**
     * Downloads the specified scryfall scan and inserts it into a new layer next to the active layer. Returns the new layer.
     */

    var scryfall_scan = retrieve_scryfall_scan(image_url, file_path);
    return paste_file_into_new_layer(scryfall_scan);
}