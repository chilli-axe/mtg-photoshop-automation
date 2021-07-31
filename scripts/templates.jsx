#include "layouts.jsx";
#include "text_layers.jsx";
#include "constants.jsx";

/* Helper functions */

/* Class definitions */

/* Template boilerplate class
Your entrypoint to customising this project for automating your own templates. You should:
* Override the method template_file_name() to return your template's file name (without extension). It should be located in the
  directory /scripts for the project to find it correctly.
* Extend the constructor (make sure you call this.super() in the constructor). Define the text fields you need to populate in your
  template. Do this by creating new instances of the project's text field classes (see my templates for examples) and append them
  to the array self.text_layers. The constructor also needs to set the property this.art_reference to a layer in your template, and
  your card art will be scaled to match the size of this layer.
* Override the method enable_frame_layers. This method should use information about the card's layout to determine which layers to
  turn on in your template to complete the card's frame. this.layout contains information about the card's twins colour (name and title 
  boxes), pinlines and textbox colour(s), and background colour(s), so you'll be mainly using this. You also know if the card is colourless
  (as in full-art like Eldrazi cards) and whether or not the card is nyx-touched (uses the nyx background).
You should also modify the function select_template() in proxy.jsx to point to your template class(es).

var Template = Class({
    extends_: BaseTemplate,
    template_file_name: function() {
        return "";
    },
    constructor: function(layout, file, file_path) {
        this.super(layout, file, file_path);
        var docref = app.activeDocument;

        // do stuff, including setting this.art_reference
        // add text layers to the array this.text_layers (will be executed automatically)
    },
    enable_frame_layers: function () {
        var docref = app.activeDocument;

        // do stuff
    },
});
*/

var BaseTemplate = Class({
    constructor: function (layout, file, file_path) {
        /**
         * Set up variables for things which are common to all templates.
         * Classes extending this base class are expected to populate the following properties at minimum: this.art_reference
         */

        this.layout = layout;
        this.file = file;

        this.load_template(file_path);

        this.art_layer = app.activeDocument.layers.getByName(default_layer);
        this.legal = app.activeDocument.layers.getByName("Legal");
        this.text_layers = [
            new TextField(
                layer = this.legal.layers.getByName("Artist"),
                text_contents = this.layout.artist,
                text_colour = rgb_white(),
            ),
        ];
    },
    template_file_name: function () {
        /**
         * Return the file name (no extension) for the template .psd file in the /templates folder.
         */

        throw new Error("Template name not specified!");
    },
    template_suffix: function () {
        /**
         * Templates can optionally specify strings to append to the end of cards created by them.
         * For example, extended templates can be set up to automatically append " (Extended)" to the end of 
         * image file names by setting the return value of this method to "Extended";
         */

        return "";
    },
    load_template: function (file_path) {
        /**
         * Opens the template's PSD file in Photoshop.
         */

        var template_file = new File(file_path + "/templates/" + this.template_file_name() + ".psd");
        app.open(template_file);
        // TODO: if that's the file that's currently open, reset instead of opening? idk 
    },
    enable_frame_layers: function () {
        /**
         * Enable the correct layers for this card's frame.
         */

        throw new Error("Frame layers not specified!");
    },
    load_artwork: function () {
        /**
         * Loads the specified art file into the specified layer.
         */

        var prev_active_layer = app.activeDocument.activeLayer;

        app.activeDocument.activeLayer = this.art_layer;
        app.load(this.file);
        // note context switch to art file
        app.activeDocument.selection.selectAll();
        app.activeDocument.selection.copy();
        app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
        // note context switch back to template
        app.activeDocument.paste();

        // return document to previous state
        app.activeDocument.activeLayer = prev_active_layer;
    },
    execute: function () {
        /**
         * Perform actions to populate this template. Load and frame artwork, enable frame layers, and execute all text layers.
         * Returns the file name of the image w/ the template's suffix if it specified one.
         * Don't override this method! You should be able to specify the full behaviour of the template in the constructor (making 
         * sure to call this.super()) and enable_frame_layers().
         */

        this.load_artwork();
        frame_layer(this.art_layer, this.art_reference);
        this.enable_frame_layers();
        for (var i = 0; i < this.text_layers.length; i++) {
            this.text_layers[i].execute();
        }
        var file_name = this.layout.name;
        var suffix = this.template_suffix();
        if (suffix !== "") {
            file_name = file_name + " (" + suffix + ")";
        }

        return file_name;
    },
});

var NormalTemplate = Class({
    /**
     * Normal M15-style template.
     */

    // TODO: colour indicator dot and typeline shift

    extends_: BaseTemplate,
    template_file_name: function () {
        return "normal";
    },
    constructor: function (layout, file, file_path) {
        this.super(layout, file, file_path);
        var docref = app.activeDocument;

        // TODO: don't convert frame effects array to string
        this.is_creature = this.layout.power !== undefined && this.layout.toughness !== undefined;
        this.is_legendary = this.layout.frame_effects.indexOf("legendary") >= 0;
        this.is_land = this.layout.type_line.indexOf("Land") >= 0;
        this.is_companion = this.layout.frame_effects.indexOf("companion") >= 0;

        this.art_reference = docref.layers.getByName("Art Frame");
        if (this.layout.is_colourless) this.art_reference = docref.layers.getByName("Full Art Frame");
        this.noncreature_signature = this.legal.layers.getByName("Noncreature MPC Autofill");
        this.creature_signature = this.legal.layers.getByName("Creature MPC Autofill");

        // Mana cost and card name (card name is scaled until it doesn't overlap with mana cost),
        // and expansion symbol and type line (type line is scaled until it doesn't overlap with expansion symbol)
        var text_and_icons = docref.layers.getByName("Text and Icons");
        var name = text_and_icons.layers.getByName("Card Name")
        var mana_cost = text_and_icons.layers.getByName("Mana Cost");
        var expansion_symbol = text_and_icons.layers.getByName("Expansion Symbol");
        var type_line = text_and_icons.layers.getByName("Typeline")
        this.text_layers = this.text_layers.concat([
            new BasicFormattedTextField(
                layer = mana_cost,
                text_contents = this.layout.mana_cost,
                text_colour = rgb_black(),
            ),
            new ScaledTextField(
                layer = name,
                text_contents = this.layout.name,
                text_colour = name.textItem.color,
                reference_layer = mana_cost,
            ),
            new ExpansionSymbolField(
                layer = expansion_symbol,
                text_contents = expansion_symbol_character,
                rarity = this.layout.rarity,
            ),
            new ScaledTextField(
                layer = type_line,
                text_contents = this.layout.type_line,
                text_colour = type_line.textItem.color,
                reference_layer = expansion_symbol,
            ),
        ]);

        var power_toughness = text_and_icons.layers.getByName("Power / Toughness");
        if (this.is_creature) {
            // creature card - set up creature layer for rules text and insert power & toughness
            this.text_layers = this.text_layers.concat([
                new TextField(
                    layer = power_toughness,
                    text_contents = this.layout.power.toString() + "/" + this.layout.toughness.toString(),
                    text_colour = rgb_black(),
                ),
                new CreatureFormattedTextArea(
                    layer = text_and_icons.layers.getByName("Rules Text - Creature"),
                    text_contents = this.layout.oracle_text,
                    text_colour = rgb_black(),
                    flavour_text = this.layout.flavour_text,
                    reference_layer = text_and_icons.layers.getByName("Textbox Reference"),
                    is_centred = false,
                    pt_reference_layer = text_and_icons.layers.getByName("PT Adjustment Reference"),
                    pt_top_reference_layer = text_and_icons.layers.getByName("PT Top Reference"),
                ),
            ]);

            // disable noncreature signature and enable creature signature
            this.noncreature_signature.visible = false;
            this.creature_signature.visible = true;
        } else {
            // noncreature card - use the normal rules text layer and disable the power/toughness layer
            this.text_layers.push(
                new FormattedTextArea(
                    layer = text_and_icons.layers.getByName("Rules Text - Noncreature"),
                    text_contents = this.layout.oracle_text,
                    this.text_colour = rgb_black(),
                    flavour_text = this.layout.flavour_text,
                    is_centred = false,
                    reference_layer = text_and_icons.layers.getByName("Textbox Reference"),
                )
            );

            power_toughness.visible = false;
        }
    },
    enable_frame_layers: function () {
        var docref = app.activeDocument;

        // twins and pt box
        var twins = docref.layers.getByName("Name & Title Boxes");
        twins.layers.getByName(this.layout.twins).visible = true;
        if (this.is_creature) {
            var pt_box = docref.layers.getByName("PT Box");
            pt_box.layers.getByName(this.layout.twins).visible = true;
        }

        // pinlines
        var pinlines = docref.layers.getByName("Pinlines & Textbox");
        if (this.is_land) {
            pinlines = docref.layers.getByName("Land Pinlines & Textbox");
        }
        pinlines.layers.getByName(this.layout.pinlines).visible = true;

        // background
        var background = docref.layers.getByName("Background");
        if (this.layout.is_nyx) {
            background = docref.layers.getByName("Nyx");
        }
        background.layers.getByName(this.layout.background).visible = true;

        if (this.is_legendary) {
            // legendary crown
            var crown = docref.layers.getByName("Legendary Crown");
            crown.layers.getByName(this.layout.pinlines).visible = true;
            border = docref.layers.getByName("Border");
            border.layers.getByName("Normal Border").visible = false;
            border.layers.getByName("Legendary Border").visible = true;
        }

        if (this.is_companion) {
            // enable companion texture
            var companion = docref.layers.getByName("Companion");
            companion.layers.getByName(this.layout.pinlines).visible = true;
        }

        if ((this.is_legendary && this.layout.is_nyx) || this.is_companion) {
            // legendary crown on nyx background - enable the hollow crown shadow and layer mask on crown, pinlines, and shadows
            docref.activeLayer = crown;
            enable_active_layer_mask();
            docref.activeLayer = pinlines;
            enable_active_layer_mask();
            docref.activeLayer = docref.layers.getByName("Shadows");
            enable_active_layer_mask();
            docref.layers.getByName("Hollow Crown Shadow").visible = true;
        }
    },
});

var NormalExtendedTemplate = Class({
    /**
     * An extended-art version of the normal template. The layer structure of this template and NormalTemplate are identical.
     */

    // TODO: remove reminder text?
    extends_: NormalTemplate,
    template_file_name: function () {
        return "normal-extended";
    },
    template_suffix: function () {
        return "Extended";
    },
});

var SnowTemplate = Class({
    /**
     * A snow template with textures from Kaldheim's snow cards. The layer structure of this template and NormalTemplate are identical.
     */

    extends_: NormalTemplate,
    template_file_name: function () {
        return "snow";
    },
});

var MutateTemplate = Class({
    /**
     * A template for Ikoria's mutate cards.  The layer structure of this template and NormalTemplate are close to identical, but this
     * template has a couple more text and reference layers for the top half of the textbox. It also doesn't include layers for Nyx 
     * backgrounds or Companion crowns, but no mutate cards exist that would require these layers.
     */

    extends_: NormalTemplate,
    template_file_name: function () {
        return "mutate";
    },
    constructor: function (layout, file, file_path) {
        // split this.oracle_text between mutate text and actual text before calling this.super()
        var split_rules_text = layout.oracle_text.split("\n");
        layout.mutate_text = split_rules_text[0];
        layout.oracle_text = split_rules_text.slice(1, split_rules_text.length).join("\n");

        this.super(layout, file, file_path);

        var docref = app.activeDocument;
        var text_and_icons = docref.layers.getByName("Text and Icons");
        var mutate = text_and_icons.layers.getByName("Mutate");
        this.text_layers.push(
            new FormattedTextArea(
                layer = mutate,
                text_contents = this.layout.mutate_text,
                text_colour = mutate.textItem.color,
                flavour_text = this.layout.flavour_text,
                is_centred = false,
                reference_layer = text_and_icons.layers.getByName("Mutate Reference"),
            )
        );
    }
});
