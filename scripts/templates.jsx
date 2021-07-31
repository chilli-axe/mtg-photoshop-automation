#include "layouts.jsx";
#include "text_layers.jsx";
#include "constants.jsx";

/* Helper functions */

/* Class definitions */

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
         */

        this.load_artwork();
        frame_layer(this.art_layer, this.art_reference);
        this.enable_frame_layers();
        for (var i = 0; i < this.text_layers.length; i++) {
            this.text_layers[i].execute();
        }
    },
});

var NormalTemplate = Class({
    /**
     * Normal M15-style template.
     */

    extends_: BaseTemplate,
    template_file_name: function () {
        return "normal";
    },
    constructor: function (layout, file, file_path) {
        this.super(layout, file, file_path);
        var docref = app.activeDocument;

        this.is_creature = this.layout.power !== null && this.layout.toughness !== 0;
        this.is_legendary = this.layout.type_line.indexOf("Legendary") > 0;

        this.art_reference = docref.layers.getByName("Art Frame");
        this.noncreature_signature = this.legal.layers.getByName("Noncreature MPC Autofill");
        this.creature_signature = this.legal.layers.getByName("Creature MPC Autofill");

        // Mana cost and card name (card name is scaled until it doesn't overlap with mana cost)
        var text_and_icons = docref.layers.getByName("Text and Icons");
        var mana_cost = text_and_icons.layers.getByName("Mana Cost");
        this.text_layers.push(
            new BasicFormattedTextField(
                layer = mana_cost,
                text_contents = this.layout.mana_cost,
                text_colour = rgb_black(),
            )
        );
        this.text_layers.push(
            new ScaledTextField(
                layer = text_and_icons.layers.getByName("Card Name"),
                text_contents = this.layout.name,
                text_colour = rgb_black(),
                reference_layer = mana_cost,
            )
        );

        // Expansion symbol and typeline
        var expansion_symbol = text_and_icons.layers.getByName("Expansion Symbol");
        // TODO: expansion symbol
        this.text_layers.push(
            new ScaledTextField(
                layer = text_and_icons.layers.getByName("Typeline"),
                text_contents = this.layout.type_line,
                text_colour = rgb_black(),
                reference_layer = expansion_symbol,
            )
        );

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
                    text_colour = rgb_black(),
                    is_centred = false,
                    reference_layer = text_and_icons.layers.getByName("Textbox Reference"),
                )
            );

            power_toughness.visible = false;
        }
    },
    enable_frame_layers: function () {
        alert("Placeholder");
    },
});



/* Template boilerplate class
var Template = Class({
    extends_: BaseTemplate,
    template_file_name: function() {
        return "";
    },
    constructor: function(layout, file, file_path) {
        this.super(layout, file, file_path);
        this.docref = app.activeDocument;

        // do stuff, including setting this.art_reference
        // add text layers to the array this.text_layers (will be executed automatically)
    },
    enable_frame_layers: function () {
        this.super();

        // do stuff
    },
});
*/