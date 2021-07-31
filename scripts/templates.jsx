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
        this.text_layers = {
            artist: new TextField(
                layer=app.activeDocument.layers.getByName("Legal").layers.getByName("Artist"),
                text_contents=this.layout.artist,
                text_colour=rgb_white(),
            ),
        }


    },
    template_file_name: function() {
        /**
         * Return the file name (no extension) for the template .psd file in the /templates folder.
         */

        throw new Error("Template name not specified!");
    },
    load_template: function(file_path) {
        /**
         * Opens the template's PSD file in Photoshop.
         */

        var template_file = new File(file_path + "/templates/" + this.template_file_name() + ".psd");
        app.open(template_file);
        // TODO: if that's the file that's currently open, reset instead of opening? idk 
    },
    load_artwork: function() {
        /**
         * Loads the specified art file into the specified layer.
         */

        var prev_active_layer = app.activeDocument.activeLayer;

        app.activeDocument.activeLayer = this.art_layer;
        app.load(this.file[0]);
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
         * Perform actions to populate this template which are common to all templates.
         */

        this.load_artwork();
        frame_layer(this.art_layer, this.art_reference);
        this.text_layers.artist.execute();
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
    constructor: function(layout, file, file_path) {
        this.super(layout, file, file_path);
        var docref = app.activeDocument;

        this.art_reference = docref.layers.getByName("Art Frame");

        // Mana cost and card name (card name is scaled until it doesn't overlap with mana cost)
        var text_and_icons = docref.layers.getByName("Text and Icons");
        var mana_cost = text_and_icons.layers.getByName("Mana Cost");
        this.text_layers.mana_cost = new BasicFormattedTextField(
            layer=mana_cost,
            text_contents=this.layout.mana_cost,
            text_colour=rgb_black(),
        );
        this.text_layers.name = new ScaledTextField(
            layer=text_and_icons.layers.getByName("Card Name"),
            text_contents=this.layout.name,
            text_colour=rgb_black(),
            reference_layer=mana_cost,
        )
    },
    execute: function () {
        this.super();

        // Execute mana cost and name (in that order)
        this.text_layers.mana_cost.execute();
        this.text_layers.name.execute();
    }
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
    },
    execute: function () {
        this.super();

        // do stuff
    },
});
*/