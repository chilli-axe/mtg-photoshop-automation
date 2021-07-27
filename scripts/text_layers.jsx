#include "es-class.js";
#include "helpers.jsx";

/* Helper functions */

function scale_text_right_overlap(layer, reference_layer) {
    /**
     * Scales a text layer down (in 0.2 pt increments) until its right bound has a 24 px clearance from a reference
     * layer's left bound.
     */
    var step_size = new UnitValue(0.2, "pt");
    var reference_left_bound = reference_layer.bounds[0];
    var layer_right_bound = typelineLayer.bounds[2];
    var layer_font_size = layer.textItem.size;  // returns unit value
    while (layer_right_bound > reference_left_bound - new UnitValue(24, "px")) {  // minimum 24 px gap
        layer_font_size = layer_font_size - step_size;
        layer.textItem.size = layer_font_size;
        layer_right_bound = layer.bounds[2];
    }
}

function scale_text_to_fit_reference(layer, reference_layer) {
    /**
    * Resize a given text layer's contents (in 0.25 pt increments) until it fits inside a specified reference layer.
    * The resulting text layer will have equal font and lead sizes.
    */

    var starting_font_size = layer.textItem.size;
    var step_size = new UnitValue(0.25, "pt");
    var reference_dimensions = compute_layer_dimensions(reference_layer);

    // Reduce the reference height by 64 pixels to avoid text landing on the top/bottom bevels
    var reference_height = reference_dimensions.height - new UnitValue(64, "px");

    // initialise lead and font size tracker variables to the font size of the layer's text
    var font_size = starting_font_size;
    var scaled = false;

    while (reference_height < compute_text_layer_dimensions(layer).height) {
        scaled = true;
        // step down font and lead sizes by the step size, and update those sizes in the layer
        font_size = font_size - step_size;
        layer.textItem.size = font_size;
        layer.textItem.leading = font_size;
    }

    return scaled;
}

function vertically_align_text(layer, reference_layer) {
    /**
     * Rasterises a given text layer and centres it vertically with respect to the bounding box of a reference layer.
     */
    layer.rasterize(RasterizeType.TEXTCONTENTS);
    select_layer_pixels(reference_layer);
    app.activeDocument.activeLayer = layer;
    align_vertical(layer);
    clear_selection();
}

function vertically_nudge_creature_text(layer, reference_layer, top_reference_layer) {
    /**
     * Vertically nudge a creature's text layer if it overlaps with the power/toughness box, determined by the given reference layers.
     */

    // if the layer needs to be nudged
    if (textLayer.bounds[2] >= reference_layer.bounds[0]) {
        select_layer_pixels(reference_layer);
        app.activeDocument.activeLayer = layer;

        // the copied bit of the text layer within the PT box will be inserted into a layer with this name
        var extra_bit_layer_name = "Extra Bit";

        // copy the contents of the active layer within the current selection to a new layer
        var idCpTL = charIDToTypeID("CpTL");
        executeAction(idCpTL, undefined, DialogModes.NO);
        idsetd = charIDToTypeID("setd");
        var desc5 = new ActionDescriptor();
        idnull = charIDToTypeID("null");
        var ref4 = new ActionReference();
        idLyr = charIDToTypeID("Lyr ");
        idOrdn = charIDToTypeID("Ordn");
        idTrgt = charIDToTypeID("Trgt");
        ref4.putEnumerated(idLyr, idOrdn, idTrgt);
        desc5.putReference(idnull, ref4);
        idT = charIDToTypeID("T   ");
        var desc6 = new ActionDescriptor();
        var idNm = charIDToTypeID("Nm  ");
        desc6.putString(idNm, extra_bit_layer_name);
        idLyr = charIDToTypeID("Lyr ");
        desc5.putObject(idT, idLyr, desc6);
        executeAction(idsetd, desc5, DialogModes.NO);

        // determine how much the rules text overlaps the power/toughness by
        var extra_bit_layer = layer.parent.layers.getByName(extra_bit_layer_name);
        var overlap = extra_bit_layer.bounds[3].as("px") - top_reference_layer.bounds[3].as("px");
        var overlap_unit = new UnitValue(-1 * overlap, "px");
        extra_bit_layer.visible = false;

        if (overlap > 0) {
            layer.applyOffset(0, overlap_unit, OffsetUndefinedAreas.SETTOBACKGROUND);
        }

        clear_selection();
    }
}

/* Class definitions */

var TextField = Class({
    /*
    A generic TextField, which allows you to set a text layer's contents and text colour.
    */
    constructor: function (layer, text_contents, text_colour) {
        this.layer = layer;
        this.text_contents = text_contents;
        this.text_colour = text_colour;
    },
    insert: function () {
        this.layer.textItem.contents = this.text_contents.replace(/\n/g, "\r");
        this.layer.textItem.color = this.text_colour;
    }
});

var ScaledTextField = Class({
    /**
     * A TextField which automatically scales down its font size (in 0.2 pt increments) until its
     * right bound no longer overlaps with a specified reference layer's left bound.
     */

    extends_: TextField,
    constructor: function (layer, text_contents, text_colour, reference_layer) {
        this.super(layer, text_contents, text_colour);
        this.reference_layer = reference_layer;
    },
    insert: function () {
        this.super();

        // scale down the text layer until it doesn't overlap with the reference layer (e.g. card name overlapping with mana cost)
        scale_text_right_overlap(layer, reference_layer);
    }
})

var FormattedTextField = Class({
    /**
     * A TextField where the contents contain some number of symbols which should be replaced with glyphs from the NDPMTG font.
     * For example, if the text contents for an instance of this class is "{2}{R}", formatting this text with NDPMTG would correctly
     * show the mana cost 2R with text contents "o2or" with characters being appropriately coloured.
     */

    extends_: TextField,
    insert: function () {
        this.super();

        // TODO: format text
    }
});

var FormattedTextArea = Class({
    /**
     * A FormattedTextField where the text is required to fit within a given area. An instance of this class will step down the font size
     * until the text fits within the reference layer's bounds (in 0.25 pt increments), then rasterise the text layer, and centre it vertically
     * with respect to the reference layer's pixels.
     */

    extends_: FormattedTextField,
    constructor: function (layer, text_contents, text_colour, reference_layer) {
        this.super(layer, text_contents, text_colour);
        this.reference_layer = reference_layer;
    },
    insert: function () {
        this.super();

        // resize the text until it fits into the reference layer
        scale_text_to_fit_reference(this.layer, this.reference_layer);

        // rasterise and centre vertically
        vertically_align_text(this.layer, this.reference_layer);
    }
});

var CreatureFormattedTextArea = Class({
    /**
     * A FormattedTextArea which also respects the bounds of creature card's power/toughness boxes. If the rasterised and centered text layer
     * overlaps with another specified reference layer (which should represent the bounds of the power/toughness box), the layer will be shifted
     * vertically by just enough to ensure that it doesn't overlap.
     */

    extends_: FormattedTextArea,
    constructor: function (layer, text_contents, text_colour, reference_layer, pt_reference_layer, pt_top_reference_layer) {
        this.super(layer, text_contents, text_colour, reference_layer);
        this.pt_reference_layer = pt_reference_layer;
        this.pt_top_reference_layer = pt_top_reference_layer;
    },
    insert: function () {
        this.super();

        // shift vertically if the text overlaps the PT box
        vertically_nudge_creature_text(this.layer, this.reference_layer, this.pt_reference_layer, this.pt_top_reference_layer);
    }
})
