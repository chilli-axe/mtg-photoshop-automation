#include "es-class.js";
#include "frame_logic.jsx";
#include "constants.jsx";

/* Helper functions */

function determine_card_face(scryfall, card_name) {
    if (scryfall.card_faces[0].name == card_name) {
        return Faces.FRONT;
    } else if (scryfall.card_faces[1].name == card_name) {
        return Faces.BACK;
    }
    throw new Error("Shit broke");
}

/* Class definitions */

var BaseLayout = Class({
    constructor: function (scryfall, card_name) {
        /**
         * Constructor for base layout calls the JSON unpacker to set object parameters from the contents of the JSON (each extending 
         * class needs to implement this) and determines frame colours for the card.
         */

        this.scryfall = scryfall;
        this.card_name_raw = card_name;

        this.unpack_scryfall();
        this.set_card_class();

        var ret = select_frame_layers(this.mana_cost, this.type_line, this.oracle_text, this.colour_identity);

        this.twins = ret.twins;
        this.pinlines = ret.pinlines;
        this.background = ret.background;
        this.is_nyx = in_array(this.frame_effects, "nyxtouched")
        this.is_colourless = ret.is_colourless;
    },
    unpack_scryfall: function () {
        /**
         * Extending classes should implement this method, unpack more information from the provided JSON, and call super(). This base method only unpacks 
         * fields which are common to all layouts.
         * At minimum, the extending class should set this.name, this.oracle_text, this.type_line, and this.mana_cost.
         */

        this.rarity = this.scryfall.rarity;
        this.artist = this.scryfall.artist;
        this.colour_identity = this.scryfall.color_identity;
        this.keywords = [];
        if (this.scryfall.keywords !== undefined) {
            this.keywords = this.scryfall.keywords;
        }
        this.frame_effects = [];
        if (this.scryfall.frame_effects !== undefined) {
            this.frame_effects = this.scryfall.frame_effects;
        }
    },
    get_default_class: function () {
        throw new Error("Default card class not defined!");
    },
    set_card_class: function () {
        /**
         * Set the card's class (finer grained than layout). Used when selecting a template.
         */

        this.card_class = this.get_default_class();
        if (this.get_default_class() === transform_front_class && this.face === Faces.BACK) {
            this.card_class = transform_back_class;
            if (this.type_line.indexOf("Land") >= 0) {
                this.card_class = ixalan_class;
            }
        } else if (this.get_default_class() === mdfc_front_class && this.face === Faces.BACK) {
            this.card_class = mdfc_back_class;
        }
        else if (this.type_line.indexOf("Planeswalker") >= 0) {
            this.card_class = planeswalker_class;
        }
        else if (this.type_line.indexOf("Snow") >= 0) {  // frame_effects doesn't contain "snow" for pre-KHM snow cards
            this.card_class = snow_class;
        }
        else if (in_array(this.keywords, "Mutate")) {
            this.card_class = mutate_class;
        } else if (in_array(this.frame_effects, "miracle")) {
            this.card_class = miracle_class;
        }
    }
})

var NormalLayout = Class({
    extends_: BaseLayout,
    unpack_scryfall: function () {
        this.super();

        this.name = this.scryfall.name;
        this.mana_cost = this.scryfall.mana_cost;
        this.type_line = this.scryfall.type_line;
        this.oracle_text = this.scryfall.oracle_text.replace(/\u2212/g, "-");  // for planeswalkers
        this.flavour_text = "";
        if (this.scryfall.flavor_text !== undefined) {
            this.flavour_text = this.scryfall.flavor_text;
        }
        this.power = this.scryfall.power;
        this.toughness = this.scryfall.toughness;
        this.colour_indicator = this.scryfall.color_indicator;

        this.scryfall_scan = this.scryfall.image_uris.large;
    },
    get_default_class: function () {
        return normal_class;
    },
});

var TransformLayout = Class({
    extends_: BaseLayout,
    unpack_scryfall: function () {
        this.super();

        this.face = determine_card_face(this.scryfall, this.card_name_raw);
        this.other_face = -1 * (this.face - 1);

        this.name = this.scryfall.card_faces[this.face].name;
        this.mana_cost = this.scryfall.card_faces[this.face].mana_cost;
        this.type_line = this.scryfall.card_faces[this.face].type_line;
        this.oracle_text = this.scryfall.card_faces[this.face].oracle_text.replace(/\u2212/g, "-");  // for planeswalkers
        this.flavour_text = "";
        if (this.scryfall.card_faces[this.face].flavor_text !== undefined) {
            this.flavour_text = this.scryfall.card_faces[this.face].flavor_text;
        }
        this.power = this.scryfall.card_faces[this.face].power;
        this.other_face_power = this.scryfall.card_faces[this.other_face].power;
        this.toughness = this.scryfall.card_faces[this.face].toughness;
        this.other_face_toughness = this.scryfall.card_faces[this.other_face].toughness;
        this.colour_indicator = this.scryfall.card_faces[this.face].color_indicator;
        this.transform_icon = this.scryfall.frame_effects[0];  // TODO: safe to assume the first frame effect will be the transform icon?

        this.scryfall_scan = this.scryfall.card_faces[this.face].image_uris.large;
    },
    get_default_class: function () {
        return transform_front_class;
    },

});

var MeldLayout = Class({
    // can we reuse transformlayout?
    extends_: NormalLayout,
    unpack_scryfall: function () {
        this.super();

        // determine if this card is a meld part or a meld result
        this.face = Faces.FRONT;
        var all_parts = this.scryfall.all_parts
        var meld_result_name = "";
        var meld_result_idx = 0;
        for (var i = 0; i < all_parts.length; i++) {
            if (all_parts[i].component === "meld_result") {
                meld_result_name = all_parts[i].name;
                meld_result_idx = i;
                break;
            }
        }
        if (this.name === meld_result_name) {
            this.face = Faces.BACK;
        } else {
            // retrieve power and toughness of meld result
            this.other_face_power = this.scryfall.all_parts[meld_result_idx].info.power;
            this.other_face_toughness = this.scryfall.all_parts[meld_result_idx].info.toughness;
        }
        this.transform_icon = this.scryfall.frame_effects[0];  // TODO: safe to assume the first frame effect will be the transform icon?

        this.scryfall_scan = this.scryfall.image_uris.large;
    },
    get_default_class: function () {
        return transform_front_class;
    },
});

var ModalDoubleFacedLayout = Class({
    extends_: BaseLayout,
    unpack_scryfall: function () {
        this.super();

        this.face = determine_card_face(this.scryfall, this.card_name_raw);
        this.other_face = -1 * (this.face - 1);

        this.name = this.scryfall.card_faces[this.face].name;
        this.mana_cost = this.scryfall.card_faces[this.face].mana_cost;
        this.type_line = this.scryfall.card_faces[this.face].type_line;
        this.oracle_text = this.scryfall.card_faces[this.face].oracle_text.replace(/\u2212/g, "-");  // for planeswalkers
        this.flavour_text = "";
        if (this.scryfall.card_faces[this.face].flavor_text !== undefined) {
            this.flavour_text = this.scryfall.card_faces[this.face].flavor_text;
        }
        this.power = this.scryfall.card_faces[this.face].power;
        this.toughness = this.scryfall.card_faces[this.face].toughness;
        this.colour_indicator = this.scryfall.card_faces[this.face].color_indicator;  // comes as an array from scryfall
        this.transform_icon = "modal_dfc";  // set here so the card name is shifted

        // mdfc banner things
        this.other_face_twins = select_frame_layers(
            this.scryfall.card_faces[this.other_face].mana_cost,
            this.scryfall.card_faces[this.other_face].type_line,
            this.scryfall.card_faces[this.other_face].oracle_text,
            this.scryfall.card_faces[this.other_face].color_identity,
        ).twins;
        var other_face_type_line_split = this.scryfall.card_faces[this.other_face].type_line.split(" ");
        this.other_face_left = other_face_type_line_split[other_face_type_line_split.length - 1];
        this.other_face_right = this.scryfall.card_faces[this.other_face].mana_cost;
        if (this.scryfall.card_faces[this.other_face].type_line.indexOf("Land") >= 0) {
            // other face is a land - right MDFC banner text should say what colour of mana the land taps for
            var other_face_oracle_text_split = this.scryfall.card_faces[this.other_face].oracle_text.split("\n");
            var other_face_mana_text = this.scryfall.card_faces[this.other_face].oracle_text;
            if (other_face_oracle_text_split.length > 1) {
                // iterate over rules text lines until the line that adds mana is identified
                for (var i = 0; i < other_face_oracle_text_split.length; i++) {
                    if (other_face_oracle_text_split[i].slice(0, 3) === "{T}") {
                        other_face_mana_text = other_face_oracle_text_split[i];
                        break;
                    }
                }
            }
            // truncate anything in the mana text after the first sentence (e.g. "{T}: Add {G}. You lose 2 life." -> "{T}: Add {G}.")
            // not necessary as of 06/08/21 but figured it was reasonable future proofing
            this.other_face_right = other_face_mana_text.split(".")[0] + ".";
        }

        this.scryfall_scan = this.scryfall.card_faces[this.face].image_uris.large;
    },
    get_default_class: function () {
        return mdfc_front_class;
    },
});

var AdventureLayout = Class({
    extends_: BaseLayout,
    unpack_scryfall: function () {
        this.super();

        this.name = this.scryfall.card_faces[0].name;
        this.mana_cost = this.scryfall.card_faces[0].mana_cost;
        this.type_line = this.scryfall.card_faces[0].type_line;
        this.oracle_text = this.scryfall.card_faces[0].oracle_text;

        this.adventure = {
            name: this.scryfall.card_faces[1].name,
            mana_cost: this.scryfall.card_faces[1].mana_cost,
            type_line: this.scryfall.card_faces[1].type_line,
            oracle_text: this.scryfall.card_faces[1].oracle_text,
        };

        this.flavour_text = "";
        if (this.scryfall.card_faces[0].flavor_text !== undefined) {
            this.flavour_text = this.scryfall.card_faces[0].flavor_text;
        }
        this.power = this.scryfall.power;
        this.toughness = this.scryfall.toughness;
        this.rarity = this.scryfall.rarity;
        this.artist = this.scryfall.artist;

        this.scryfall_scan = this.scryfall.image_uris.large;
    },
    get_default_class: function () {
        return adventure_class;
    },
});

var LevelerLayout = Class({
    extends_: NormalLayout,
    unpack_scryfall: function () {
        this.super();

        // unpack oracle text into: level text, levels x-y text, levels z+ text, middle level, 
        // middle level power/toughness, bottom level, and bottom level power/toughness
        var leveler_regex = /^([^]*)\nLEVEL (\d*-\d*)\n(\d*\/\d*)\n([^]*)\n?LEVEL (\d*\+)\n(\d*\/\d*)\n([^]*)?$/;
        var leveler_match = this.oracle_text.match(leveler_regex);
        this.level_up_text = leveler_match[1];
        this.middle_level = leveler_match[2];
        this.middle_power_toughness = leveler_match[3];
        this.levels_x_y_text = leveler_match[4];
        this.bottom_level = leveler_match[5];
        this.bottom_power_toughness = leveler_match[6];
        this.levels_z_plus_text = leveler_match[7];
    },
    get_default_class: function () {
        return leveler_class;
    }
});

var SagaLayout = Class({
    extends_: NormalLayout,
    unpack_scryfall: function () {
        this.super();

        // // unpack oracle text into saga lines
        this.saga_lines = this.oracle_text.split("\n").slice(1);
        for (var i = 0; i < this.saga_lines.length; i++) {
            this.saga_lines[i] = this.saga_lines[i].split(" \u2014 ")[1];
        }
    },
    get_default_class: function () {
        return saga_class;
    }
});

var PlanarLayout = Class({
    extends_: BaseLayout,
    unpack_scryfall: function () {
        this.super();

        this.name = this.scryfall.name;
        this.mana_cost = "";
        this.type_line = this.scryfall.type_line;
        this.oracle_text = this.scryfall.oracle_text;
        this.rarity = this.scryfall.rarity;
        this.artist = this.scryfall.artist;

        this.scryfall_scan = this.scryfall.image_uris.large;
    },
    get_default_class: function () {
        return planar_class;
    },
});

var layout_map = {
    "normal": NormalLayout,
    "transform": TransformLayout,
    "meld": MeldLayout,
    "modal_dfc": ModalDoubleFacedLayout,
    "adventure": AdventureLayout,
    "leveler": LevelerLayout,
    "saga": SagaLayout,
    "planar": PlanarLayout,
}
