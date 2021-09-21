#include "layouts.jsx";
#include "text_layers.jsx";
#include "constants.jsx";

/* Template boilerplate class
Your entrypoint to customising this project for automating your own templates. You should write classes that extend BaseTemplate for your 
templates, and:
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
You should also modify the function select_template() in render.jsx to point to your template class(es).

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
         * Set up variables for things which are common to all templates (artwork and artist credit).
         * Classes extending this base class are expected to populate the following properties at minimum: this.art_reference
         */

        this.layout = layout;
        this.file = file;

        this.load_template(file_path);

        this.art_layer = app.activeDocument.layers.getByName(default_layer);
        this.legal = app.activeDocument.layers.getByName(LayerNames.LEGAL);
        this.text_layers = [
            new TextField(
                layer = this.legal.layers.getByName(LayerNames.ARTIST),
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

        var template_path = file_path + "/templates/" + this.template_file_name() + ".psd"
        var template_file = new File(template_path);
        try {
            app.open(template_file);
        } catch (err) {
            throw new Error(
                "\n\nFailed to open the template for this card at the following directory:\n\n"
                + template_path
                + "\n\nCheck your templates folder and try again"
            );
        }
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

        paste_file(this.art_layer, this.file);
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

/* Class definitions for Chilli_Axe templates */

var ChilliBaseTemplate = Class({
    /**
     * A BaseTemplate with a few extra features I didn't want to pollute the base template for other people with.
     */

    extends_: BaseTemplate,
    // TODO: add code for transform and mdfc stuff here (since both normal and planeswalker templates need to inherit them)
    constructor: function (layout, file, file_path) {
        this.super(layout, file, file_path);

        this.is_creature = this.layout.power !== undefined && this.layout.toughness !== undefined;
        this.is_legendary = this.layout.type_line.indexOf("Legendary") >= 0;
        this.is_land = this.layout.type_line.indexOf("Land") >= 0;
        this.is_companion = in_array(this.layout.frame_effects, "companion");
    },
    basic_text_layers: function (text_and_icons) {
        /**
         * Set up the card's mana cost, name (scaled to not overlap with mana cost), expansion symbol, and type line
         * (scaled to not overlap with the expansion symbol).
         */

        // shift name and type line if necessary (hiding the unused layer)
        var name = text_and_icons.layers.getByName(LayerNames.NAME);
        var name_selected = name;
        try {
            // handle errors for templates where name_shift does not exist
            var name_shift = text_and_icons.layers.getByName(LayerNames.NAME_SHIFT);
            if (this.name_shifted) {
                name_selected = name_shift;
                name.visible = false;
                name_shift.visible = true;
            } else {
                name_shift.visible = false;
                name.visible = true;
            }
        } catch (err) { }

        var type_line = text_and_icons.layers.getByName(LayerNames.TYPE_LINE);
        var type_line_selected = type_line;
        try {
            // handle errors for templates where type_line_shift does not exist
            var type_line_shift = text_and_icons.layers.getByName(LayerNames.TYPE_LINE_SHIFT);
            if (this.type_line_shifted) {
                type_line_selected = type_line_shift;
                type_line.visible = false;
                type_line_shift.visible = true;

                // enable colour indicator dot
                app.activeDocument.layers.getByName(LayerNames.COLOUR_INDICATOR).layers.getByName(this.layout.pinlines).visible = true;
            } else {
                type_line_shift.visible = false;
                type_line.visible = true;
            }
        } catch (err) { }

        var mana_cost = text_and_icons.layers.getByName(LayerNames.MANA_COST);
        var expansion_symbol = text_and_icons.layers.getByName(LayerNames.EXPANSION_SYMBOL);

        this.text_layers = this.text_layers.concat([
            new BasicFormattedTextField(
                layer = mana_cost,
                text_contents = this.layout.mana_cost,
                text_colour = rgb_black(),
            ),
            new ScaledTextField(
                layer = name_selected,
                text_contents = this.layout.name,
                text_colour = get_text_layer_colour(name_selected),
                reference_layer = mana_cost,
            ),
            new ExpansionSymbolField(
                layer = expansion_symbol,
                text_contents = expansion_symbol_character,
                rarity = this.layout.rarity,
            ),
            new ScaledTextField(
                layer = type_line_selected,
                text_contents = this.layout.type_line,
                text_colour = get_text_layer_colour(type_line_selected),
                reference_layer = expansion_symbol,
            ),
        ]);
    },
    enable_hollow_crown: function (crown, pinlines) {
        /**
         * Enable the hollow legendary crown for this card given layer groups for the crown and pinlines.
         */

        var docref = app.activeDocument;
        docref.activeLayer = crown;
        enable_active_layer_mask();
        docref.activeLayer = pinlines;
        enable_active_layer_mask();
        docref.activeLayer = docref.layers.getByName(LayerNames.SHADOWS);
        enable_active_layer_mask();
        docref.layers.getByName(LayerNames.HOLLOW_CROWN_SHADOW).visible = true;
    },
    paste_scryfall_scan: function (reference_layer, file_path, rotate) {
        /**
         * Downloads the card's scryfall scan, pastes it into the document next to the active layer, and frames it to fill
         * the given reference layer. Can optionally rotate the layer by 90 degrees (useful for planar cards).
         */

        var layer = insert_scryfall_scan(this.layout.scryfall_scan, file_path);
        if (rotate === true) {
            layer.rotate(90);
        }
        frame_layer(layer, reference_layer);
    }
})

var NormalTemplate = Class({
    /**
     * Normal M15-style template.
     */

    extends_: ChilliBaseTemplate,
    template_file_name: function () {
        return "normal";
    },
    rules_text_and_pt_layers: function (text_and_icons) {
        /**
         * Set up the card's rules text and power/toughness according to whether or not the card is a creature.
         * You're encouraged to override this method if a template extending this one doesn't have the option for
         * creating creature cards (e.g. miracles).
         */

        // centre the rules text if the card has no flavour text, text is all on one line, and that line is fairly short
        var is_centred = this.layout.flavour_text.length <= 1 && this.layout.oracle_text.length <= 70 && this.layout.oracle_text.indexOf("\n") < 0;

        var noncreature_copyright = this.legal.layers.getByName(LayerNames.NONCREATURE_COPYRIGHT);
        var creature_copyright = this.legal.layers.getByName(LayerNames.CREATURE_COPYRIGHT);

        var power_toughness = text_and_icons.layers.getByName(LayerNames.POWER_TOUGHNESS);
        if (this.is_creature) {
            // creature card - set up creature layer for rules text and insert power & toughness
            var rules_text = text_and_icons.layers.getByName(LayerNames.RULES_TEXT_CREATURE);
            this.text_layers = this.text_layers.concat([
                new TextField(
                    layer = power_toughness,
                    text_contents = this.layout.power.toString() + "/" + this.layout.toughness.toString(),
                    text_colour = get_text_layer_colour(power_toughness),
                ),
                new CreatureFormattedTextArea(
                    layer = rules_text,
                    text_contents = this.layout.oracle_text,
                    text_colour = get_text_layer_colour(rules_text),
                    flavour_text = this.layout.flavour_text,
                    is_centred = is_centred,
                    reference_layer = text_and_icons.layers.getByName(LayerNames.TEXTBOX_REFERENCE),
                    pt_reference_layer = text_and_icons.layers.getByName(LayerNames.PT_REFERENCE),
                    pt_top_reference_layer = text_and_icons.layers.getByName(LayerNames.PT_TOP_REFERENCE),
                ),
            ]);

            noncreature_copyright.visible = false;
            creature_copyright.visible = true;
        } else {
            // noncreature card - use the normal rules text layer and disable the power/toughness layer
            var rules_text = text_and_icons.layers.getByName(LayerNames.RULES_TEXT_NONCREATURE);
            this.text_layers.push(
                new FormattedTextArea(
                    layer = rules_text,
                    text_contents = this.layout.oracle_text,
                    text_colour = get_text_layer_colour(rules_text),
                    flavour_text = this.layout.flavour_text,
                    is_centred = is_centred,
                    reference_layer = text_and_icons.layers.getByName(LayerNames.TEXTBOX_REFERENCE),
                ),
            );

            power_toughness.visible = false;
        }
    },
    constructor: function (layout, file, file_path) {
        this.super(layout, file, file_path);

        var docref = app.activeDocument;

        this.art_reference = docref.layers.getByName(LayerNames.ART_FRAME);
        if (this.layout.is_colourless) this.art_reference = docref.layers.getByName(LayerNames.FULL_ART_FRAME);

        this.name_shifted = this.layout.transform_icon !== null && this.layout.transform_icon !== undefined;
        this.type_line_shifted = this.layout.colour_indicator !== null && this.layout.colour_indicator !== undefined;

        var text_and_icons = docref.layers.getByName(LayerNames.TEXT_AND_ICONS);
        this.basic_text_layers(text_and_icons);
        this.rules_text_and_pt_layers(text_and_icons);
    },
    enable_frame_layers: function () {
        var docref = app.activeDocument;

        // twins and pt box
        var twins = docref.layers.getByName(LayerNames.TWINS);
        twins.layers.getByName(this.layout.twins).visible = true;
        if (this.is_creature) {
            var pt_box = docref.layers.getByName(LayerNames.PT_BOX);
            pt_box.layers.getByName(this.layout.twins).visible = true;
        }

        // pinlines
        var pinlines = docref.layers.getByName(LayerNames.PINLINES_TEXTBOX);
        if (this.is_land) {
            pinlines = docref.layers.getByName(LayerNames.LAND_PINLINES_TEXTBOX);
        }
        pinlines.layers.getByName(this.layout.pinlines).visible = true;

        // background
        var background = docref.layers.getByName(LayerNames.BACKGROUND);
        if (this.layout.is_nyx) {
            background = docref.layers.getByName(LayerNames.NYX);
        }
        background.layers.getByName(this.layout.background).visible = true;

        if (this.is_legendary) {
            // legendary crown
            var crown = docref.layers.getByName(LayerNames.LEGENDARY_CROWN);
            crown.layers.getByName(this.layout.pinlines).visible = true;
            border = docref.layers.getByName(LayerNames.BORDER);
            border.layers.getByName(LayerNames.NORMAL_BORDER).visible = false;
            border.layers.getByName(LayerNames.LEGENDARY_BORDER).visible = true;
        }

        if (this.is_companion) {
            // enable companion texture
            var companion = docref.layers.getByName(LayerNames.COMPANION);
            companion.layers.getByName(this.layout.pinlines).visible = true;
        }

        if ((this.is_legendary && this.layout.is_nyx) || this.is_companion) {
            // legendary crown on nyx background - enable the hollow crown shadow and layer mask on crown, pinlines, and shadows
            this.enable_hollow_crown(crown, pinlines);
        }
    },
});

/* Classic variant */

var NormalClassicTemplate = Class({
    /**
     * A template for 7th Edition frame. Each frame is flattened into its own singular layer.
     */

    extends_: ChilliBaseTemplate,
    template_file_name: function () {
        return "normal-classic";
    },
    template_suffix: function () {
        return "Classic";
    },
    constructor: function (layout, file, file_path) {
        this.super(layout, file, file_path);

        var docref = app.activeDocument;
        this.art_reference = docref.layers.getByName(LayerNames.ART_FRAME);

        // artist
        replace_text(docref.layers.getByName(LayerNames.LEGAL).layers.getByName(LayerNames.ARTIST), "Artist", this.layout.artist);
        this.text_layers = [];

        var text_and_icons = docref.layers.getByName(LayerNames.TEXT_AND_ICONS);
        this.basic_text_layers(text_and_icons);

        // rules text
        var is_centred = this.layout.flavour_text.length <= 1 && this.layout.oracle_text.length <= 70 && this.layout.oracle_text.indexOf("\n") < 0;
        var reference_layer = text_and_icons.layers.getByName(LayerNames.TEXTBOX_REFERENCE);
        if (this.is_land) {
            reference_layer = text_and_icons.layers.getByName(LayerNames.TEXTBOX_REFERENCE_LAND);
        }
        var rules_text = text_and_icons.layers.getByName(LayerNames.RULES_TEXT);
        this.text_layers.push(
            new FormattedTextArea(
                layer = rules_text,
                text_contents = this.layout.oracle_text,
                text_colour = get_text_layer_colour(rules_text),
                flavour_text = this.layout.flavour_text,
                is_centred = is_centred,
                reference_layer = reference_layer,
            ),
        );

        // pt
        var power_toughness = text_and_icons.layers.getByName(LayerNames.POWER_TOUGHNESS);
        if (this.is_creature) {
            this.text_layers.push(
                new TextField(
                    layer = power_toughness,
                    text_contents = this.layout.power.toString() + "/" + this.layout.toughness.toString(),
                    text_colour = get_text_layer_colour(power_toughness),
                ),
            )
        } else {
            power_toughness.visible = false;
        }
    },
    enable_frame_layers: function () {
        var docref = app.activeDocument;

        var layers = docref.layers.getByName(LayerNames.NONLAND);
        var selected_layer = this.layout.background;
        if (this.is_land) {
            layers = docref.layers.getByName(LayerNames.LAND);
            selected_layer = this.layout.pinlines;
        }

        layers.layers.getByName(selected_layer).visible = true;
    }
});

/* Templates similar to NormalTemplate but with aesthetic differences */

var NormalExtendedTemplate = Class({
    /**
     * An extended-art version of the normal template. The layer structure of this template and NormalTemplate are identical.
     */

    extends_: NormalTemplate,
    template_file_name: function () {
        return "normal-extended";
    },
    template_suffix: function () {
        return "Extended";
    },
    constructor: function (layout, file, file_path) {
        // strip out reminder text for extended cards
        layout.oracle_text = strip_reminder_text(layout.oracle_text);
        this.super(layout, file, file_path);
    }
});

var WomensDayTemplate = Class({
    /**
     * The showcase template first used on the Women's Day Secret Lair. The layer structure of this template and NormalTemplate are
     * similar, but this template doesn't have any background layers, and a layer mask on the pinlines group needs to be enabled when
     * the card is legendary.
     */

    extends_: NormalTemplate,
    template_file_name: function () {
        return "womensday";
    },
    template_suffix: function () {
        return "Showcase";
    },
    constructor: function (layout, file, file_path) {
        // strip out reminder text
        layout.oracle_text = strip_reminder_text(layout.oracle_text);
        this.super(layout, file, file_path);
    },
    enable_frame_layers: function () {
        var docref = app.activeDocument;

        // twins and pt box
        var twins = docref.layers.getByName(LayerNames.TWINS);
        twins.layers.getByName(this.layout.twins).visible = true;
        if (this.is_creature) {
            var pt_box = docref.layers.getByName(LayerNames.PT_BOX);
            pt_box.layers.getByName(this.layout.twins).visible = true;
        }

        // pinlines
        var pinlines = docref.layers.getByName(LayerNames.PINLINES_TEXTBOX);
        if (this.is_land) {
            pinlines = docref.layers.getByName(LayerNames.LAND_PINLINES_TEXTBOX);
        }
        pinlines.layers.getByName(this.layout.pinlines).visible = true;

        if (this.is_legendary) {
            // legendary crown
            var crown = docref.layers.getByName(LayerNames.LEGENDARY_CROWN);
            crown.layers.getByName(this.layout.pinlines).visible = true;
            docref.activeLayer = pinlines;
            enable_active_layer_mask();
        }
    },
});

var StargazingTemplate = Class({
    /**
     * Stargazing template from Theros: Beyond Death showcase cards. The layer structure of this template and NormalTemplate are largely 
     * identical, but this template doesn't have normal background textures, only the Nyxtouched ones.
     */

    extends_: NormalTemplate,
    template_file_name: function () {
        return "stargazing";
    },
    template_suffix: function () {
        return "Stargazing";
    },
    constructor: function (layout, file, file_path) {
        layout.oracle_text = strip_reminder_text(layout.oracle_text);
        layout.is_nyx = true;
        this.super(layout, file, file_path);
    }
});

var MasterpieceTemplate = Class({
    /**
     * Kaladesh Invention template. This template has stripped-down layers compared to NormalTemplate but is otherwise similar.
     */

    extends_: NormalTemplate,
    template_file_name: function () {
        return "masterpiece";
    },
    template_suffix: function () {
        return "Masterpiece";
    },
    constructor: function (layout, file, file_name) {
        is_colourless = false;
        // force to use bronze twins and background
        layout.twins = "Bronze";
        layout.background = "Bronze";
        layout.oracle_text = strip_reminder_text(layout.oracle_text);
        this.super(layout, file, file_name);
    },
    enable_frame_layers: function () {
        this.super();
        if (this.is_legendary) {
            // always enable hollow crown for legendary cards in this template
            var crown = app.activeDocument.layers.getByName(LayerNames.LEGENDARY_CROWN);
            var pinlines = app.activeDocument.layers.getByName(LayerNames.PINLINES_TEXTBOX);
            this.enable_hollow_crown(crown, pinlines);
        }
    }
});

var ExpeditionTemplate = Class({
    /**
     * Zendikar Rising Expedition template. Doesn't have a mana cost layer, support creature cards, masks pinlines for legendary
     * cards like WomensDayTemplate, and has a single static background layer.
     */

    extends_: NormalTemplate,
    template_file_name: function () {
        return "znrexp";
    },
    template_suffix: function () {
        return "Expedition";
    },
    constructor: function (layout, file, file_path) {
        // strip out reminder text
        layout.oracle_text = strip_reminder_text(layout.oracle_text);
        this.super(layout, file, file_path);
    },
    basic_text_layers: function (text_and_icons) {
        var name = text_and_icons.layers.getByName(LayerNames.NAME);
        var expansion_symbol = text_and_icons.layers.getByName(LayerNames.EXPANSION_SYMBOL);
        var type_line = text_and_icons.layers.getByName(LayerNames.TYPE_LINE);
        this.text_layers = this.text_layers.concat([
            new TextField(
                layer = name,
                text_contents = this.layout.name,
                text_colour = get_text_layer_colour(name),
            ),
            new ExpansionSymbolField(
                layer = expansion_symbol,
                text_contents = expansion_symbol_character,
                rarity = this.layout.rarity,
            ),
            new ScaledTextField(
                layer = type_line,
                text_contents = this.layout.type_line,
                text_colour = get_text_layer_colour(type_line),
                reference_layer = expansion_symbol,
            ),
        ]);
    },
    rules_text_and_pt_layers: function (text_and_icons) {
        // overriding this because the expedition template doesn't have power/toughness layers
        var rules_text = text_and_icons.layers.getByName(LayerNames.RULES_TEXT_NONCREATURE)
        this.text_layers.push(
            new FormattedTextArea(
                layer = rules_text,
                text_contents = this.layout.oracle_text,
                text_colour = get_text_layer_colour(rules_text),
                flavour_text = this.layout.flavour_text,
                is_centred = false,
                reference_layer = text_and_icons.layers.getByName(LayerNames.TEXTBOX_REFERENCE),
            ),
        );
    },
    enable_frame_layers: function () {
        var docref = app.activeDocument;

        // twins and pt box
        var twins = docref.layers.getByName(LayerNames.TWINS);
        twins.layers.getByName(this.layout.twins).visible = true;

        // pinlines
        var pinlines = docref.layers.getByName(LayerNames.LAND_PINLINES_TEXTBOX);
        pinlines.layers.getByName(this.layout.pinlines).visible = true;

        if (this.is_legendary) {
            // legendary crown
            var crown = docref.layers.getByName(LayerNames.LEGENDARY_CROWN);
            crown.layers.getByName(this.layout.pinlines).visible = true;
            docref.activeLayer = pinlines;
            enable_active_layer_mask();
            border = docref.layers.getByName(LayerNames.BORDER);
            border.layers.getByName(LayerNames.NORMAL_BORDER).visible = false;
            border.layers.getByName(LayerNames.LEGENDARY_BORDER).visible = true;
        }
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

var MiracleTemplate = new Class({
    /**
     * A template for miracle cards. The layer structure of this template and NormalTemplate are close to identical, but this
     * template is stripped down to only include mono-coloured layers and no land layers or other special layers, but no miracle
     * cards exist that require these layers.
     */

    extends_: NormalTemplate,
    template_file_name: function () {
        return "miracle";
    },
    rules_text_and_pt_layers: function (text_and_icons) {
        // overriding this because the miracle template doesn't have power/toughness layers
        var rules_text = text_and_icons.layers.getByName(LayerNames.RULES_TEXT_NONCREATURE)
        this.text_layers.push(
            new FormattedTextArea(
                layer = rules_text,
                text_contents = this.layout.oracle_text,
                text_colour = get_text_layer_colour(rules_text),
                flavour_text = this.layout.flavour_text,
                is_centred = false,
                reference_layer = text_and_icons.layers.getByName(LayerNames.TEXTBOX_REFERENCE),
            ),
        );
    },
});


/* Double-faced card templates */

var TransformBackTemplate = Class({
    /**
     * Template for the back faces of transform cards.
     */

    extends_: NormalTemplate,
    template_file_name: function () {
        return "tf-back";
    },
    dfc_layer_group: function () {
        return LayerNames.TF_BACK;
    },
    constructor: function (layout, file, file_path) {
        this.super(layout, file, file_path);
        // set transform icon
        var transform_group = app.activeDocument.layers.getByName(LayerNames.TEXT_AND_ICONS).layers.getByName(this.dfc_layer_group());
        transform_group.layers.getByName(this.layout.transform_icon).visible = true;
    },
    basic_text_layers: function (text_and_icons) {
        // if this is an eldrazi card, set the colour of the rules text, type line, and power/toughness to black
        if (this.layout.transform_icon === LayerNames.MOON_ELDRAZI_DFC) {
            var name = text_and_icons.layers.getByName(LayerNames.NAME);
            if (this.name_shifted) {
                name = text_and_icons.layers.getByName(LayerNames.NAME_SHIFT);
            }
            var type_line = text_and_icons.layers.getByName(LayerNames.TYPE_LINE);
            if (this.type_line_shifted) {
                type_line = text_and_icons.layers.getByName(LayerNames.TYPE_LINE_SHIFT);
            }
            var power_toughness = text_and_icons.layers.getByName(LayerNames.POWER_TOUGHNESS);

            name.textItem.color = rgb_black();
            type_line.textItem.color = rgb_black();
            power_toughness.textItem.color = rgb_black();
        }

        this.super(text_and_icons);
    },
});

var TransformFrontTemplate = Class({
    /**
     * Template for the front faces of transform cards.
     */

    extends_: TransformBackTemplate,
    template_file_name: function () {
        return "tf-front";
    },
    dfc_layer_group: function () {
        return LayerNames.TF_FRONT;
    },
    constructor: function (layout, file, file_path) {
        this.other_face_is_creature = layout.other_face_power !== undefined && layout.other_face_toughness !== undefined;
        this.super(layout, file, file_path);

        // if creature on back face, set flipside power/toughness
        if (this.other_face_is_creature) {
            flipside_power_toughness = app.activeDocument.layers.getByName(LayerNames.TEXT_AND_ICONS).layers.getByName(LayerNames.FLIPSIDE_POWER_TOUGHNESS);
            this.text_layers.push(
                new TextField(
                    layer = flipside_power_toughness,
                    text_contents = this.layout.other_face_power.toString() + "/" + this.layout.other_face_toughness.toString(),
                    text_colour = get_text_layer_colour(flipside_power_toughness),
                )
            );
        };
    },
    rules_text_and_pt_layers: function (text_and_icons) {
        // overriding to select one of the four rules text layers

        // centre the rules text if the card has no flavour text, text is all on one line, and that line is fairly short
        var is_centred = this.layout.flavour_text.length <= 1 && this.layout.oracle_text.length <= 70 && this.layout.oracle_text.indexOf("\n") < 0;

        var noncreature_copyright = this.legal.layers.getByName(LayerNames.NONCREATURE_COPYRIGHT);
        var creature_copyright = this.legal.layers.getByName(LayerNames.CREATURE_COPYRIGHT);

        var power_toughness = text_and_icons.layers.getByName(LayerNames.POWER_TOUGHNESS);
        if (this.is_creature) {
            // creature card - set up creature layer for rules text and insert power & toughness
            var rules_text = text_and_icons.layers.getByName(LayerNames.RULES_TEXT_CREATURE);
            if (this.other_face_is_creature) {
                rules_text = text_and_icons.layers.getByName(LayerNames.RULES_TEXT_CREATURE_FLIP);
            }
            this.text_layers = this.text_layers.concat([
                new TextField(
                    layer = power_toughness,
                    text_contents = this.layout.power.toString() + "/" + this.layout.toughness.toString(),
                    text_colour = get_text_layer_colour(power_toughness),
                ),
                new CreatureFormattedTextArea(
                    layer = rules_text,
                    text_contents = this.layout.oracle_text,
                    text_colour = get_text_layer_colour(rules_text),
                    flavour_text = this.layout.flavour_text,
                    is_centred = is_centred,
                    reference_layer = text_and_icons.layers.getByName(LayerNames.TEXTBOX_REFERENCE),
                    pt_reference_layer = text_and_icons.layers.getByName(LayerNames.PT_REFERENCE),
                    pt_top_reference_layer = text_and_icons.layers.getByName(LayerNames.PT_TOP_REFERENCE),
                ),
            ]);

            noncreature_copyright.visible = false;
            creature_copyright.visible = true;
        } else {
            // noncreature card - use the normal rules text layer and disable the power/toughness layer
            var rules_text = text_and_icons.layers.getByName(LayerNames.RULES_TEXT_NONCREATURE);
            if (this.other_face_is_creature) {
                rules_text = text_and_icons.layers.getByName(LayerNames.RULES_TEXT_NONCREATURE_FLIP);
            }
            this.text_layers.push(
                new FormattedTextArea(
                    layer = rules_text,
                    text_contents = this.layout.oracle_text,
                    text_colour = get_text_layer_colour(rules_text),
                    flavour_text = this.layout.flavour_text,
                    is_centred = is_centred,
                    reference_layer = text_and_icons.layers.getByName(LayerNames.TEXTBOX_REFERENCE),
                ),
            );

            power_toughness.visible = false;
        }
    },
});

var IxalanTemplate = Class({
    /**
     * Template for the back faces of transforming cards from Ixalan block.
     */

    extends_: NormalTemplate,
    template_file_name: function () {
        return "ixalan";
    },
    basic_text_layers: function (text_and_icons) {
        // typeline doesn't scale down with expansion symbol, and no mana cost layer
        var name = text_and_icons.layers.getByName(LayerNames.NAME);
        var expansion_symbol = text_and_icons.layers.getByName(LayerNames.EXPANSION_SYMBOL);
        var type_line = text_and_icons.layers.getByName(LayerNames.TYPE_LINE);
        this.text_layers = this.text_layers.concat([
            new TextField(
                layer = name,
                text_contents = this.layout.name,
                text_colour = get_text_layer_colour(name),
            ),
            new ExpansionSymbolField(
                layer = expansion_symbol,
                text_contents = expansion_symbol_character,
                rarity = this.layout.rarity,
            ),
            new TextField(
                layer = type_line,
                text_contents = this.layout.type_line,
                text_colour = get_text_layer_colour(type_line),
            ),
        ]);
    },
    rules_text_and_pt_layers: function (text_and_icons) {
        // overriding this because the ixalan template doesn't have power/toughness layers
        var rules_text = text_and_icons.layers.getByName(LayerNames.RULES_TEXT_NONCREATURE);
        this.text_layers.push(
            new FormattedTextArea(
                layer = rules_text,
                text_contents = this.layout.oracle_text,
                text_colour = get_text_layer_colour(rules_text),
                flavour_text = this.layout.flavour_text,
                is_centred = false,
                reference_layer = text_and_icons.layers.getByName(LayerNames.TEXTBOX_REFERENCE),
            ),
        );
    },
    enable_frame_layers: function () {
        var background = app.activeDocument.layers.getByName(LayerNames.BACKGROUND);
        background.layers.getByName(this.layout.background).visible = true;
    },
});

var MDFCBackTemplate = Class({
    /**
     * Template for the back faces of modal double faced cards.
     */

    extends_: NormalTemplate,
    template_file_name: function () {
        return "mdfc-back";
    },
    dfc_layer_group: function () {
        return LayerNames.MDFC_BACK;
    },
    constructor: function (layout, file, file_path) {
        this.super(layout, file, file_path);
        // set visibility of top & bottom mdfc elements and set text of left & right text
        var mdfc_group = app.activeDocument.layers.getByName(LayerNames.TEXT_AND_ICONS).layers.getByName(this.dfc_layer_group());
        mdfc_group.layers.getByName(LayerNames.TOP).layers.getByName(this.layout.twins).visible = true;
        mdfc_group.layers.getByName(LayerNames.BOTTOM).layers.getByName(this.layout.other_face_twins).visible = true;
        var left = mdfc_group.layers.getByName(LayerNames.LEFT);
        var right = mdfc_group.layers.getByName(LayerNames.RIGHT);
        this.text_layers = this.text_layers.concat([
            new BasicFormattedTextField(
                layer = right,
                text_contents = this.layout.other_face_right,
                text_colour = get_text_layer_colour(right),
            ),
            new ScaledTextField(
                layer = left,
                text_contents = this.layout.other_face_left,
                text_colour = get_text_layer_colour(left),
                reference_layer = right,
            ),
        ]);

    },
});

var MDFCFrontTemplate = Class({
    /**
     * Template for the front faces of modal double faced cards.
     */

    extends_: MDFCBackTemplate,
    template_file_name: function () {
        return "mdfc-front";
    },
    dfc_layer_group: function () {
        return LayerNames.MDFC_FRONT;
    },
});

/* Templates similar to NormalTemplate with new features */

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
        var text_and_icons = docref.layers.getByName(LayerNames.TEXT_AND_ICONS);
        var mutate = text_and_icons.layers.getByName(LayerNames.MUTATE);
        this.text_layers.push(
            new FormattedTextArea(
                layer = mutate,
                text_contents = this.layout.mutate_text,
                text_colour = get_text_layer_colour(mutate),
                flavour_text = this.layout.flavour_text,
                is_centred = false,
                reference_layer = text_and_icons.layers.getByName(LayerNames.MUTATE_REFERENCE),
            )
        );
    }
});

var AdventureTemplate = Class({
    /**
     * A template for Eldraine adventure cards. The layer structure of this template and NormalTemplate are close to identical, but this
     * template has a couple more text and reference layers for the left half of the textbox. It also doesn't include layers for Nyx 
     * backgrounds or Companion crowns, but no adventure cards exist that would require these layers.
     */

    extends_: NormalTemplate,
    template_file_name: function () {
        return "adventure";
    },
    constructor: function (layout, file, file_path) {
        this.super(layout, file, file_path);

        // add adventure name, mana cost, type line, and rules text fields to this.text_layers
        var docref = app.activeDocument;
        var text_and_icons = docref.layers.getByName(LayerNames.TEXT_AND_ICONS);
        var name = text_and_icons.layers.getByName(LayerNames.NAME_ADVENTURE);
        var mana_cost = text_and_icons.layers.getByName(LayerNames.MANA_COST_ADVENTURE);
        var rules_text = text_and_icons.layers.getByName(LayerNames.RULES_TEXT_ADVENTURE);
        var type_line = text_and_icons.layers.getByName(LayerNames.TYPE_LINE_ADVENTURE);
        this.text_layers = this.text_layers.concat([
            new BasicFormattedTextField(
                layer = mana_cost,
                text_contents = this.layout.adventure.mana_cost,
                text_colour = rgb_black(),
            ),
            new ScaledTextField(
                layer = name,
                text_contents = this.layout.adventure.name,
                text_colour = get_text_layer_colour(name),
                reference_layer = mana_cost,
            ),
            new FormattedTextArea(
                layer = rules_text,
                text_contents = this.layout.adventure.oracle_text,
                text_colour = get_text_layer_colour(rules_text),
                flavour_text = "",
                is_centred = false,
                reference_layer = text_and_icons.layers.getByName(LayerNames.TEXTBOX_REFERENCE_ADVENTURE),
            ),
            new TextField(
                layer = type_line,
                text_contents = this.layout.adventure.type_line,
                text_colour = get_text_layer_colour(type_line),
            ),
        ]);
    }
});

var LevelerTemplate = Class({
    /**
     * Leveler template. No layers are scaled or positioned vertically so manual intervention is required.
     */

    extends_: NormalTemplate,
    template_file_name: function () {
        return "leveler";
    },
    rules_text_and_pt_layers: function (text_and_icons) {
        var leveler_text_group = text_and_icons.layers.getByName("Leveler Text");
        this.text_layers = this.text_layers.concat([
            new BasicFormattedTextField(
                layer = leveler_text_group.layers.getByName("Rules Text - Level Up"),
                text_contents = this.layout.level_up_text,
                text_colour = rgb_black(),
            ),
            new TextField(
                layer = leveler_text_group.layers.getByName("Top Power / Toughness"),
                text_contents = this.layout.power.toString() + "/" + this.layout.toughness.toString(),
                text_colour = rgb_black(),
            ),
            new TextField(
                layer = leveler_text_group.layers.getByName("Middle Level"),
                text_contents = this.layout.middle_level,
                text_colour = rgb_black(),
            ),
            new TextField(
                layer = leveler_text_group.layers.getByName("Middle Power / Toughness"),
                text_contents = this.layout.middle_power_toughness,
                text_colour = rgb_black(),
            ),
            new BasicFormattedTextField(
                layer = leveler_text_group.layers.getByName("Rules Text - Levels X-Y"),
                text_contents = this.layout.levels_x_y_text,
                text_colour = rgb_black(),
            ),
            new TextField(
                layer = leveler_text_group.layers.getByName("Bottom Level"),
                text_contents = this.layout.bottom_level,
                text_colour = rgb_black(),
            ),
            new TextField(
                layer = leveler_text_group.layers.getByName("Bottom Power / Toughness"),
                text_contents = this.layout.bottom_power_toughness,
                text_colour = rgb_black(),
            ),
            new BasicFormattedTextField(
                layer = leveler_text_group.layers.getByName("Rules Text - Levels Z+"),
                text_contents = this.layout.levels_z_plus_text,
                text_colour = rgb_black(),
            ),

        ]);
        exit_early = true;
    },
    enable_frame_layers: function () {
        var docref = app.activeDocument;

        // twins and pt box
        var twins = docref.layers.getByName(LayerNames.TWINS);
        twins.layers.getByName(this.layout.twins).visible = true;
        var pt_box = docref.layers.getByName(LayerNames.PT_AND_LEVEL_BOXES);
        pt_box.layers.getByName(this.layout.twins).visible = true;

        // pinlines
        var pinlines = docref.layers.getByName(LayerNames.PINLINES_TEXTBOX);
        pinlines.layers.getByName(this.layout.pinlines).visible = true;

        // background
        var background = docref.layers.getByName(LayerNames.BACKGROUND);
        background.layers.getByName(this.layout.background).visible = true;
    },
});

var SagaTemplate = Class({
    /**
     * Saga template. No layers are scaled or positioned vertically so manual intervention is required.
     */

    extends_: NormalTemplate,
    template_file_name: function () {
        return "saga";
    },
    constructor: function (layout, file, file_path) {
        this.super(layout, file, file_path);

        // paste scryfall scan
        app.activeDocument.activeLayer = app.activeDocument.layers.getByName(LayerNames.TWINS);
        this.paste_scryfall_scan(app.activeDocument.layers.getByName(LayerNames.SCRYFALL_SCAN_FRAME), file_path);
    },
    rules_text_and_pt_layers: function (text_and_icons) {
        var saga_text_group = text_and_icons.layers.getByName("Saga");
        var stages = ["I", "II", "III", "IV"];

        for (var i = 0; i < this.layout.saga_lines.length; i++) {
            var stage = stages[i];
            var stage_group = saga_text_group.layers.getByName(stage);
            stage_group.visible = true;
            this.text_layers.push(
                new BasicFormattedTextField(
                    layer = stage_group.layers.getByName("Text"),
                    text_contents = this.layout.saga_lines[i],
                    text_colour = rgb_black(),
                )
            );
        }

        exit_early = true;
    },
    enable_frame_layers: function () {
        var docref = app.activeDocument;
        var twins = docref.layers.getByName(LayerNames.TWINS);
        twins.layers.getByName(this.layout.twins).visible = true;
        var pinlines = docref.layers.getByName(LayerNames.PINLINES_AND_SAGA_STRIPE);
        pinlines.layers.getByName(this.layout.pinlines).visible = true;
        var textbox = docref.layers.getByName(LayerNames.TEXTBOX);
        textbox.layers.getByName(this.layout.background).visible = true;
        var background = docref.layers.getByName(LayerNames.BACKGROUND);
        background.layers.getByName(this.layout.background).visible = true;
    },
});

/* Planeswalker templates */

var PlaneswalkerTemplate = Class({
    /**
     * Planeswalker template - 3 or 4 loyalty abilities.
     */

    extends_: ChilliBaseTemplate,
    template_file_name: function () {
        return "pw";
    },
    constructor: function (layout, file, file_path) {
        this.super(layout, file, file_path);

        exit_early = true;

        this.art_reference = app.activeDocument.layers.getByName(LayerNames.PLANESWALKER_ART_FRAME);
        if (this.layout.is_colourless) this.art_reference = app.activeDocument.layers.getByName(LayerNames.FULL_ART_FRAME);

        var ability_array = this.layout.oracle_text.split("\n");
        var num_abilities = 3;
        if (ability_array.length > 3) num_abilities = 4;

        // docref for everything but legal and art reference is based on number of abilities
        this.docref = app.activeDocument.layers.getByName("pw-" + num_abilities.toString());
        this.docref.visible = true;

        var text_and_icons = this.docref.layers.getByName(LayerNames.TEXT_AND_ICONS);
        this.basic_text_layers(text_and_icons);

        // planeswalker ability layers
        var group_names = [LayerNames.FIRST_ABILITY, LayerNames.SECOND_ABILITY, LayerNames.THIRD_ABILITY, LayerNames.FOURTH_ABILITY];
        var loyalty_group = this.docref.layers.getByName(LayerNames.LOYALTY_GRAPHICS);
        var ability_group;

        for (var i = 0; i < ability_array.length; i++) {
            if (i === 4) break;
            ability_group = loyalty_group.layers.getByName(group_names[i]);

            var ability_text = ability_array[i];
            var static_text_layer = ability_group.layers.getByName(LayerNames.STATIC_TEXT);
            var ability_text_layer = ability_group.layers.getByName(LayerNames.ABILITY_TEXT);
            var ability_layer = ability_text_layer;
            var colon_index = ability_text.indexOf(": ");

            // determine if this is a static or activated ability by the presence of ":" in the start of the ability
            if (colon_index > 0 && colon_index < 5) {
                // activated ability

                // determine which loyalty group to enable, and set the loyalty symbol's text
                var loyalty_graphic = ability_group.layers.getByName(ability_text[0]);
                loyalty_graphic.visible = true;
                this.text_layers.push(
                    new TextField(
                        layer = loyalty_graphic.layers.getByName(LayerNames.COST),
                        text_contents = ability_text.slice(0, colon_index),
                        text_colour = rgb_white(),
                    )
                );

                ability_text = ability_text.slice(colon_index + 2);

            } else {
                // static ability
                ability_layer = static_text_layer;
                ability_text_layer.visible = false;
                static_text_layer.visible = true;
                ability_group.layers.getByName("Colon").visible = false;
            }
            this.text_layers.push(
                new BasicFormattedTextField(
                    layer = ability_layer,
                    text_contents = ability_text,
                    text_colour = get_text_layer_colour(ability_layer),
                )
            );
        }

        // starting loyalty
        this.text_layers.push(
            new TextField(
                layer = loyalty_group.layers.getByName(LayerNames.STARTING_LOYALTY).layers.getByName(LayerNames.TEXT),
                text_contents = this.layout.scryfall.loyalty,
                text_colour = rgb_white(),
            ),
        );

        // paste scryfall scan
        app.activeDocument.activeLayer = this.docref.layers.getByName(LayerNames.TEXTBOX);
        this.paste_scryfall_scan(app.activeDocument.layers.getByName(LayerNames.SCRYFALL_SCAN_FRAME), file_path);
    },
    enable_frame_layers: function () {
        // twins and pt box
        var twins = this.docref.layers.getByName(LayerNames.TWINS);
        twins.layers.getByName(this.layout.twins).visible = true;

        // pinlines
        var pinlines = this.docref.layers.getByName(LayerNames.PINLINES);
        pinlines.layers.getByName(this.layout.pinlines).visible = true;

        // background
        this.enable_background();

    },
    enable_background: function () {
        var background = this.docref.layers.getByName(LayerNames.BACKGROUND);
        background.layers.getByName(this.layout.background).visible = true;
    }
});

var PlaneswalkerExtendedTemplate = Class({
    /**
     * An extended version of PlaneswalkerTemplate. Functionally identical except for the lack of background textures.
     */

    extends_: PlaneswalkerTemplate,
    template_file_name: function () {
        return "pw-extended";
    },
    enable_background: function () { },
});

/* Misc. templates */

var PlanarTemplate = Class({
    extends_: ChilliBaseTemplate,
    template_file_name: function () {
        return "planar";
    },
    constructor: function (layout, file, file_path) {
        this.super(layout, file, file_path);
        exit_early = true;

        var docref = app.activeDocument;
        this.art_reference = docref.layers.getByName(LayerNames.ART_FRAME);
        // artist
        replace_text(docref.layers.getByName(LayerNames.LEGAL).layers.getByName(LayerNames.ARTIST), "Artist", this.layout.artist);

        // card name, type line, expansion symbol
        var text_and_icons = docref.layers.getByName(LayerNames.TEXT_AND_ICONS);
        var name = text_and_icons.layers.getByName(LayerNames.NAME);
        var type_line = text_and_icons.layers.getByName(LayerNames.TYPE_LINE);
        var expansion_symbol = text_and_icons.layers.getByName(LayerNames.EXPANSION_SYMBOL);

        // note: overwriting this.text_layers because the paintbrush symbol is part of the artist text layer, so we inserted the
        // artist name separately earlier with replace_text(), and the artist usually comes for free with this.text_layers.
        this.text_layers = [
            new TextField(
                layer = name,
                text_contents = this.layout.name,
                text_colour = get_text_layer_colour(name),
            ),
            new ScaledTextField(
                layer = type_line,
                text_contents = this.layout.type_line,
                text_colour = get_text_layer_colour(type_line),
                reference_layer = expansion_symbol,
            )
        ];

        var static_ability = text_and_icons.layers.getByName(LayerNames.STATIC_ABILITY);
        var chaos_ability = text_and_icons.layers.getByName(LayerNames.CHAOS_ABILITY);

        if (this.layout.type_line === LayerNames.PHENOMENON) {
            // phenomenon card - insert oracle text into static ability layer and disable chaos ability & layer mask on textbox
            this.text_layers.push(
                new BasicFormattedTextField(
                    layer = static_ability,
                    text_contents = this.layout.oracle_text,
                    text_colour = get_text_layer_colour(static_ability),
                )
            );
            var textbox = docref.layers.getByName(LayerNames.TEXTBOX);
            docref.activeLayer = textbox;
            disable_active_layer_mask();
            text_and_icons.layers.getByName(LayerNames.CHAOS_SYMBOL).visible = false;
            chaos_ability.visible = false;
        } else {
            // plane card - split oracle text on last line break, insert everything before it into static ability layer and the rest
            // into chaos ability layer
            var linebreak_index = this.layout.oracle_text.lastIndexOf("\n");
            this.text_layers = this.text_layers.concat([
                new BasicFormattedTextField(
                    layer = static_ability,
                    text_contents = this.layout.oracle_text.slice(0, linebreak_index),
                    text_colour = get_text_layer_colour(static_ability),
                ),
                new BasicFormattedTextField(
                    layer = chaos_ability,
                    text_contents = this.layout.oracle_text.slice(linebreak_index + 1),
                    text_colour = get_text_layer_colour(chaos_ability),
                ),
            ]);
        }

        // paste scryfall scan
        app.activeDocument.activeLayer = docref.layers.getByName(LayerNames.TEXTBOX);
        this.paste_scryfall_scan(app.activeDocument.layers.getByName(LayerNames.SCRYFALL_SCAN_FRAME), file_path, true);
    },
    enable_frame_layers: function () { },
});

var BasicLandTemplate = Class({
    /**
     * Basic land template - no text and icons (aside from legal), just a layer for each of the eleven basic lands.
     */

    extends_: BaseTemplate,
    template_file_name: function () {
        return "basic";
    },
    template_suffix: function () {
        return this.layout.artist;
    },
    constructor: function (layout, file, file_path) {
        this.super(layout, file, file_path);

        this.art_reference = app.activeDocument.layers.getByName(LayerNames.BASIC_ART_FRAME);
    },
    enable_frame_layers: function () {
        app.activeDocument.layers.getByName(this.layout.name).visible = true;
    },
});

var BasicLandTherosTemplate = Class({
    /**
     * Basic land template for the full-art Nyx basics from Theros: Beyond Death.
     */

    extends_: BasicLandTemplate,
    template_file_name: function () {
        return "basic-theros";
    },
});

var BasicLandUnstableTemplate = Class({
    /**
     * Basic land template for the borderless basics from Unstable.
     */

    extends_: BasicLandTemplate,
    template_file_name: function () {
        return "basic-unstable";
    },
});

var BasicLandClassicTemplate = Class({
    /**
     * Basic land template for 7th Edition basics.
     */

    extends_: BasicLandTemplate,
    template_file_name: function () {
        return "basic-classic";
    },
});