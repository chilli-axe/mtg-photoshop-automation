#include "es-class.js";
#include "frame_logic.jsx";

/* Helper functions */

function determine_card_face(scryfall, card_name) {
    if (scryfall.card_faces[0].name == card_name) {
        return Faces.FRONT;
    } else if (scryfall.card_faces[1].name == card_name) {
        return Faces.BACK;
    }
    // TODO: error
    alert("Shit broke")
}

/* Class definitions */

var BaseLayout = Class({
    constructor: function (scryfall, card_name) {
        /**
         * Constructor for base layout parses Scryfall JSON, calls the JSON unpacker to set object parameters from the contents of the JSON (each extending 
         * class needs to implement this), and determines frame colours for the card.
         */

        this.scryfall = scryfall;
        this.card_name_raw = card_name;

        this.unpack_scryfall();

        var ret = select_frame_layers(this.oracle_text, this.type_line, this.mana_cost, this.colour_identity);

        this.twins = ret.twins;
        this.pinlines = ret.pinlines;
        this.background = ret.background;
    },
    unpack_scryfall: function () {
        /**
         * Extending classes should implement this method, unpack more information from the provided JSON, and call super(). This base method only unpacks 
         * fields which are common to all layouts.
         * At minimum, the extending class should set this.oracle_text, this.type_line, and this.mana_cost.
         */

        this.rarity = this.scryfall.rarity;
        this.artist = this.scryfall.artist;
        this.colour_identity = this.scryfall.color_identity;
    }
})

var NormalLayout = Class({
    extends_: BaseLayout,
    unpack_scryfall: function () {
        this.name = this.scryfall.name;
        this.mana_cost = this.scryfall.mana_cost;
        this.type_line = this.scryfall.type_line;
        this.oracle_text = this.scryfall.oracle_text;
        this.flavour_text = this.scryfall.flavor_text;
        this.power = this.scryfall.power;
        this.toughness = this.scryfall.toughness;
        this.colour_indicator = this.scryfall.color_indicator;  // comes as an array from scryfall

        this.super();
    }
});

var TransformLayout = Class({
    extends_: BaseLayout,
    unpack_scryfall: function () {
        // TODO: determine which face the card we're dealing with belongs to

        this.face = determine_card_face(this.scryfall, this.card_name_raw);

        this.name = this.scryfall.card_faces[this.face].name;
        this.mana_cost = this.scryfall.card_faces[this.face].mana_cost;
        this.type_line = this.scryfall.card_faces[this.face].type_line;
        this.oracle_text = this.scryfall.card_faces[this.face].oracle_text;
        this.flavour_text = this.scryfall.card_faces[this.face].flavor_text;
        this.power = this.scryfall.card_faces[this.face].power;
        this.toughness = this.scryfall.card_faces[this.face].toughness;
        this.colour_indicator = this.scryfall.card_faces[this.face].color_indicator;  // comes as an array from scryfall

        // TODO: frame effects for icon in top-left

        this.super();
    },

});

var MeldLayout = Class({
    // can we reuse transformlayout?
    extends_: BaseLayout,
    unpack_scryfall: function () {
        // TODO: determine which face the card we're dealing with belongs to

        this.face = determine_card_face(this.scryfall, this.card_name_raw);

        // TODO: save scryfall json fields as properties
        this.name = this.scryfall.card_faces[this.face].name;
        this.mana_cost = this.scryfall.card_faces[this.face].mana_cost;
        this.type_line = this.scryfall.card_faces[this.face].type_line;
        this.oracle_text = this.scryfall.card_faces[this.face].oracle_text;
        this.flavour_text = this.scryfall.card_faces[this.face].flavor_text;
        this.power = this.scryfall.card_faces[this.face].power;
        this.toughness = this.scryfall.card_faces[this.face].toughness;
        this.colour_indicator = this.scryfall.card_faces[this.face].color_indicator;  // comes as an array from scryfall

        // TODO: top and bottom colours, left and right text

        this.super();
    }
});

var ModalDoubleFacedLayout = Class({
    extends_: BaseLayout,
    unpack_scryfall: function () {
        // TODO: determine which face the card we're dealing with belongs to

        this.face = determine_card_face(scryfall, card_name);

        // TODO: save scryfall json fields as properties

        this.super();
    }
});

var AdventureLayout = Class({
    extends_: BaseLayout,
    unpack_scryfall: function () {
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

        this.flavour_text = this.scryfall.card_faces[0].flavor_text;
        this.power = this.scryfall.power;
        this.toughness = this.scryfall.toughness;
        this.rarity = this.scryfall.rarity;
        this.artist = this.scryfall.artist;

        this.super();
    }
});

var PlanarLayout = Class({
    constructor_: function () {
        this.scryfall = scryfall;
        this.rarity = this.scryfall.rarity;
        this.artist = this.scryfall.artist;
        // TODO: save scryfall json fields as properties
    }
});

var layout_map = {
    "normal": NormalLayout,
    "transform": TransformLayout,
    "meld": MeldLayout,
    "modal_dfc": ModalDoubleFacedLayout,
    "adventure": AdventureLayout,
    "planar": PlanarLayout,
}
