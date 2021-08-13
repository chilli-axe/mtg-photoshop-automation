#include "es-class.js";
#include "helpers.jsx";
#include "format_text.jsx";

/* Helper functions */

function scale_text_right_overlap(layer, reference_layer) {
    /**
     * Scales a text layer down (in 0.2 pt increments) until its right bound has a 24 px clearance from a reference
     * layer's left bound.
     */

    var step_size = new UnitValue(0.2, "pt");
    var reference_left_bound = reference_layer.bounds[0].as("px");
    var layer_left_bound = layer.bounds[0].as("px");
    var layer_right_bound = layer.bounds[2].as("px");
    // guard against the reference's left bound being left of the layer's left bound or the reference being malformed otherwise
    if (reference_left_bound < layer_left_bound || reference_left_bound === null || reference_left_bound === undefined) {
        return;
    }
    var layer_font_size = layer.textItem.size;  // returns unit value
    while (layer_right_bound > reference_left_bound - 24) {  // minimum 24 px gap
        layer_font_size = layer_font_size - step_size;
        layer.textItem.size = layer_font_size;
        layer_right_bound = layer.bounds[2].as("px");
    }
}

function scale_text_to_fit_reference(layer, reference_layer) {
    /**
    * Resize a given text layer's contents (in 0.25 pt increments) until it fits inside a specified reference layer.
    * The resulting text layer will have equal font and lead sizes.
    */

    var starting_font_size = layer.textItem.size;
    var step_size = new UnitValue(0.25, "pt");

    // Reduce the reference height by 64 pixels to avoid text landing on the top/bottom bevels
    var reference_height = compute_layer_dimensions(reference_layer).height - 64;

    // initialise lead and font size tracker variables to the font size of the layer's text
    var font_size = starting_font_size;
    var scaled = false;

    var layer_height = compute_text_layer_dimensions(layer).height;

    while (reference_height < layer_height) {
        scaled = true;
        // step down font and lead sizes by the step size, and update those sizes in the layer
        font_size = font_size - step_size;
        layer.textItem.size = font_size;
        layer.textItem.leading = font_size;
        layer_height = compute_text_layer_dimensions(layer).height;
    }

    return scaled;
}

// TODO: multiple layers, each with their own references, that scale down together until they all fit within their references

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
    if (layer.bounds[2].as("px") >= reference_layer.bounds[0].as("px")) {
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
        var delta = top_reference_layer.bounds[3].as("px") - extra_bit_layer.bounds[3].as("px");
        extra_bit_layer.visible = false;

        if (delta < 0) {
            layer.applyOffset(0, new UnitValue(delta, "px"), OffsetUndefinedAreas.SETTOBACKGROUND);
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
        this.text_contents = "";
        if (text_contents !== null && text_contents !== undefined) {
            this.text_contents = text_contents.replace(/\n/g, "\r");
        }
        this.text_colour = text_colour;
    },
    execute: function () {
        this.layer.visible = true;
        this.layer.textItem.contents = this.text_contents;
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
    execute: function () {
        this.super();

        // scale down the text layer until it doesn't overlap with the reference layer (e.g. card name overlapping with mana cost)
        scale_text_right_overlap(this.layer, this.reference_layer);
    }
});

var ExpansionSymbolField = Class({
    /**
     * A TextField which represents a card's expansion symbol. Expansion symbol layers have a series of clipping masks (uncommon, rare, mythic),
     * one of which will need to be enabled according to the card's rarity. A 6 px outer stroke should be applied to the layer as well, white if 
     * the card is of common rarity and black otherwise.
     */

    extends_: TextField,
    constructor: function (layer, text_contents, rarity) {
        this.super(layer, text_contents, rgb_black());

        this.rarity = rarity;
        if (rarity === rarity_bonus || rarity === rarity_special) {
            this.rarity = rarity_mythic;
        }
    },
    execute: function () {
        this.super();

        var stroke_weight = 6;  // pixels
        app.activeDocument.activeLayer = this.layer;
        if (this.rarity === rarity_common) {
            apply_stroke(stroke_weight, rgb_white());
        } else {
            var mask_layer = this.layer.parent.layers.getByName(this.rarity);
            mask_layer.visible = true;
            apply_stroke(stroke_weight, rgb_black());
        }
    }
})

var BasicFormattedTextField = Class({
    /**
     * A TextField where the contents contain some number of symbols which should be replaced with glyphs from the NDPMTG font.
     * For example, if the text contents for an instance of this class is "{2}{R}", formatting this text with NDPMTG would correctly
     * show the mana cost 2R with text contents "o2or" with characters being appropriately coloured.
     * Doesn't support flavour text or centred text. For use with fields like mana costs and planeswalker abilities.
     */

    extends_: TextField,
    execute: function () {
        this.super();

        // format text function call
        app.activeDocument.activeLayer = this.layer;
        var italic_text = generate_italics(this.text_contents);
        format_text(this.text_contents, italic_text, -1, false);
    }
});

var FormattedTextField = Class({
    /**
     * A TextField where the contents contain some number of symbols which should be replaced with glyphs from the NDPMTG font.
     * For example, if the text contents for an instance of this class is "{2}{R}", formatting this text with NDPMTG would correctly
     * show the mana cost 2R with text contents "o2or" with characters being appropriately coloured.
     * The big boy version which supports centred text and flavour text. For use with card rules text.
     */

    extends_: TextField,
    constructor: function (layer, text_contents, text_colour, flavour_text, is_centred) {
        this.super(layer, text_contents, text_colour);
        this.flavour_text = "";
        if (flavour_text !== null && flavour_text !== undefined) {
            this.flavour_text = flavour_text.replace(/\n/g, "\r");
        }
        this.is_centred = is_centred;
    },
    execute: function () {
        this.super();

        // generate italic text arrays from things in (parentheses), ability words, and the given flavour text
        var italic_text = generate_italics(this.text_contents);
        var flavour_index = -1;

        if (this.flavour_text.length > 1) {
            // remove things between asterisks from flavour text if necessary
            var flavour_text_split = this.flavour_text.split("*");
            if (flavour_text_split.length > 1) {
                // asterisks present in flavour text
                for (var i = 0; i < flavour_text_split.length; i += 2) {
                    // add the parts of the flavour text not between asterisks to italic_text
                    if (flavour_text_split[i] !== "") italic_text.push(flavour_text_split[i]);
                }
                // reassemble flavourText without asterisks
                this.flavour_text = flavour_text_split.join("");
            } else {
                // if no asterisks in flavour text, push the whole flavour text string instead
                italic_text.push(this.flavour_text);
            }
            flavour_index = this.text_contents.length;
        }

        app.activeDocument.activeLayer = this.layer;
        format_text(this.text_contents + "\r" + this.flavour_text, italic_text, flavour_index, this.is_centred);
        if (this.is_centred) {
            this.layer.textItem.justification = Justification.CENTER;
        }
    }
})

var FormattedTextArea = Class({
    /**
     * A FormattedTextField where the text is required to fit within a given area. An instance of this class will step down the font size
     * until the text fits within the reference layer's bounds (in 0.25 pt increments), then rasterise the text layer, and centre it vertically
     * with respect to the reference layer's pixels.
     */

    extends_: FormattedTextField,
    constructor: function (layer, text_contents, text_colour, flavour_text, is_centred, reference_layer) {
        this.super(layer, text_contents, text_colour, flavour_text, is_centred);
        this.reference_layer = reference_layer;
    },
    execute: function () {
        this.super();

        if (this.text_contents !== "" || this.flavour_text !== "") {
            // resize the text until it fits into the reference layer
            scale_text_to_fit_reference(this.layer, this.reference_layer);

            // rasterise and centre vertically
            vertically_align_text(this.layer, this.reference_layer);

            if (this.is_centred) {
                // ensure the layer is centred horizontally as well
                select_layer_pixels(this.reference_layer);
                app.activeDocument.activeLayer = this.layer;
                align_horizontal();
                clear_selection();
            }
        }
    }
});

var CreatureFormattedTextArea = Class({
    /**
     * A FormattedTextArea which also respects the bounds of creature card's power/toughness boxes. If the rasterised and centered text layer
     * overlaps with another specified reference layer (which should represent the bounds of the power/toughness box), the layer will be shifted
     * vertically by just enough to ensure that it doesn't overlap.
     */

    extends_: FormattedTextArea,
    constructor: function (layer, text_contents, text_colour, flavour_text, is_centred, reference_layer, pt_reference_layer, pt_top_reference_layer) {
        this.super(layer, text_contents, text_colour, flavour_text, is_centred, reference_layer);
        this.pt_reference_layer = pt_reference_layer;
        this.pt_top_reference_layer = pt_top_reference_layer;
    },
    execute: function () {
        this.super();

        // shift vertically if the text overlaps the PT box
        vertically_nudge_creature_text(this.layer, this.pt_reference_layer, this.pt_top_reference_layer);
    }
})
