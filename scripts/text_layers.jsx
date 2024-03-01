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

    var layer_copy = layer.duplicate(activeDocument, ElementPlacement.INSIDE);
    layer_copy.rasterize(RasterizeType.TEXTCONTENTS);
    select_layer_pixels(reference_layer);
    app.activeDocument.activeLayer = layer_copy;
    align_vertical();
    clear_selection();
    var layer_dimensions = compute_text_layer_bounds(layer);
    var layer_copy_dimensions = compute_text_layer_bounds(layer_copy);
    layer.translate(0, layer_copy_dimensions[1].as("px") - layer_dimensions[1].as("px"));
    layer_copy.remove();
}

function vertically_nudge_creature_text(layer, reference_layer, top_reference_layer) {
    /**
     * Vertically nudge a creature's text layer if it overlaps with the power/toughness box, determined by the given reference layers.
     * Returns the amount by which the text layer was nudged.
     */

    // if the layer needs to be nudged
    if (layer.bounds[2].as("px") >= reference_layer.bounds[0].as("px")) {
        select_layer_pixels(reference_layer);
        var rasterised_copy = layer.duplicate();
        rasterised_copy.rasterize(RasterizeType.ENTIRELAYER);
        app.activeDocument.activeLayer = rasterised_copy;

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

        if (delta < 0) {
            layer.translate(0, new UnitValue(delta, "px"));
        }

        rasterised_copy.remove();
        extra_bit_layer.remove();
        clear_selection();

        return delta;
    }
}

/* Class definitions */

var Field = Class({
    /**
     * Interface for a Field class. The system will run the `execute` functions of all Fields in `self.text_layers` when rendering a card.
     */

    constructor: function () {
        throw new Error("This Field's constructor is not defined!");
    },
    execute: function () {
        throw new Error("This Field's execute function is not defined!")
    },
});

var ExpansionSymbolField = Class({
    /**
     * A Field which represents a card's expansion symbol. The expansion symbol is retrieved from Scryfall and stored on disk as SVG when the
     * card's information is queried, then loaded into the document here. The symbol is sized and positioned according to a reference layer
     * (typically right-justified, but centre alignment is also supported), and a 6 px outer stroke is applied. If the card is common, a white
     * stroke is applied; otherwise, a black stroke is applied, and a clipping mask for the rarity colour is aligned to the expansion symbol
     * and enabled.
     */

    extends_: Field,
    constructor: function (layer_group, set_code, rarity, file_path, justification) {       
        this.layer_group = layer_group;
        this.set_code = set_code.toUpperCase();
        if (use_default_expansion_symbol) {
            this.set_code = default_icon_name;
        }
        this.rarity = rarity;
        if (rarity === rarity_bonus || rarity === rarity_special) {
            this.rarity = rarity_mythic;
        }
        this.file_path = file_path;
        this.justification = justification;
    },
    execute: function () {
        var expansion_symbol_file = new File(file_path + icon_directory + this.set_code + dot_svg);
        var reference_layer = this.layer_group.layers.getByName(LayerNames.EXPANSION_REFERENCE);
        app.activeDocument.activeLayer = reference_layer;
        var expansion_symbol_layer = paste_file_into_new_layer(expansion_symbol_file);
        frame_layer(expansion_symbol_layer, reference_layer);

        // centre justified by default
        if (this.justification === Justification.LEFT) {
            select_layer_pixels(reference_layer);
            align_left();
            clear_selection();
        } else if (this.justification === Justification.RIGHT) {
            select_layer_pixels(reference_layer);
            align_right();
            clear_selection();
        }
        reference_layer.visible = false;

        var stroke_weight = 6;  // pixels
        app.activeDocument.activeLayer = this.layer_group;
        if (this.rarity === rarity_common) {
            apply_outer_stroke(stroke_weight, rgb_white());
        } else {
            var mask_layer = this.layer_group.parent.layers.getByName(this.rarity);
            mask_layer.visible = true;
            // ensure the gradient layer is aligned to the expansion symbol
            apply_outer_stroke(stroke_weight, rgb_black());
            app.activeDocument.activeLayer = mask_layer;
            select_layer_pixels(expansion_symbol_layer);
            align_horizontal();
            align_vertical();
            clear_selection();
        }
    }
});

var TextField = Class({
    /**
     * A generic TextField which allows you to set a text layer's contents and text colour.
     */

    extends_: Field,
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
    determine_italics_text_and_flavour_index: function() {
        /**
         * Returns an array of italic text for the instance's text contents and the index at which flavour text begins.
         * Within flavour text, any text between asterisks should not be italicised, and the asterisks should not be included
         * in the rendered flavour text.
         */

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
        return {
            flavour_index: flavour_index,
            italic_text: italic_text,
        }
    },
    execute: function () {
        this.super();

        // generate italic text arrays from things in (parentheses), ability words, and the given flavour text
        var ret = this.determine_italics_text_and_flavour_index();
        var flavour_index = ret.flavour_index;
        var italic_text = ret.italic_text;

        app.activeDocument.activeLayer = this.layer;
        format_text(this.text_contents + "\r" + this.flavour_text, italic_text, flavour_index, this.is_centred);
        if (this.is_centred) {
            this.layer.textItem.justification = Justification.CENTER;
        }
    }
});

var FormattedTextArea = Class({
    /**
     * A FormattedTextField where the text is required to fit within a given area. An instance of this class will step down the font size
     * until the text fits within the reference layer's bounds (in 0.25 pt increments), then rasterise the text layer, and centre it vertically
     * with respect to the reference layer's pixels.
     * Positions the flavour text divider after sizing the text to the given area.
     */

    extends_: FormattedTextField,
    constructor: function (layer, text_contents, text_colour, flavour_text, is_centred, reference_layer, divider_layer) {
        this.super(layer, text_contents, text_colour, flavour_text, is_centred);
        this.reference_layer = reference_layer;
        this.divider_layer = divider_layer;
    },
    insert_divider: function() {
        /**
         * Inserts the flavour text divider between rules text and flavour text. 
         * The position of the divider is calculated by creating two copies of `this.layer`, rendering `this.text_contents` in the first copy 
         * and `this.flavour_text` in the second copy, then finding the midpoint between the bottom of the first copy and the top of the second copy.
         * This method is slighty imperfect because of how the shape of the text layer can affect how flavour text is positioned, but should be close enough.
         */

        if (this.flavour_text.length !== "") {
            var ret = this.determine_italics_text_and_flavour_index();
            var flavour_index = ret.flavour_index;
            var italic_text = ret.italic_text;

            var layer_bounds = compute_text_layer_bounds(this.layer);

            var layer_text_contents = this.layer.duplicate();
            layer_text_contents.textItem.contents = this.text_contents;
            layer_text_contents.textItem.spaceBefore = new UnitValue(line_break_lead, "px");
            app.activeDocument.activeLayer = layer_text_contents;
            format_text(this.text_contents, italic_text, -1, this.is_centred);
            layer_text_contents.rasterize(RasterizeType.ENTIRELAYER);
            text_contents_bottom = layer_text_contents.bounds[3].as("px");

            var layer_flavour_text = this.layer.duplicate();
            layer_flavour_text.textItem.contents = this.flavour_text;
            layer_flavour_text.textItem.spaceBefore = new UnitValue(line_break_lead, "px");
            app.activeDocument.activeLayer = layer_flavour_text;
            format_text(this.flavour_text, italic_text, flavour_index, this.is_centred);
            layer_flavour_text.rasterize(RasterizeType.ENTIRELAYER);
            layer_flavour_text.translate(0, layer_bounds[3].as("px") - layer_flavour_text.bounds[3].as("px"));
            var flavour_text_top = layer_flavour_text.bounds[1].as("px");

            var divider_y_midpoint = (text_contents_bottom + flavour_text_top) / 2;

            layer_text_contents.remove();
            layer_flavour_text.remove();

            app.activeDocument.activeLayer = this.divider_layer;
            this.divider_layer.visible = true;

            app.activeDocument.selection.select([
                [0, divider_y_midpoint - 1],
                [1, divider_y_midpoint - 1],
                [1, divider_y_midpoint + 1],
                [0, divider_y_midpoint + 1]
            ]);
            align_vertical();
            clear_selection();
        }
    },
    execute: function () {
        this.super();

        if (this.text_contents !== "" || this.flavour_text !== "") {
            // resize the text until it fits into the reference layer
            scale_text_to_fit_reference(this.layer, this.reference_layer);

            // centre vertically
            vertically_align_text(this.layer, this.reference_layer);

            this.insert_divider();
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
    constructor: function (layer, text_contents, text_colour, flavour_text, is_centred, reference_layer, divider_layer, pt_reference_layer, pt_top_reference_layer) {
        this.super(layer, text_contents, text_colour, flavour_text, is_centred, reference_layer, divider_layer);
        this.pt_reference_layer = pt_reference_layer;
        this.pt_top_reference_layer = pt_top_reference_layer;
    },
    execute: function () {
        this.super();

        // shift vertically if the text overlaps the PT box
        var delta = vertically_nudge_creature_text(this.layer, this.pt_reference_layer, this.pt_top_reference_layer);
        if (delta < 0) {
            this.divider_layer.translate(0, new UnitValue(delta, "px"));
        }
    }
});
