// TODO: consistency between camelcase and snakecase

var json_file_path = "/scripts/card.json";

// Card classes - finer grained than Scryfall layouts
var normal_class = "normal";
var transform_front_class = "transform_front";
var transform_back_class = "transform_back";
var ixalan_class = "ixalan";
var mdfc_front_class = "mdfc_front";
var mdfc_back_class = "mdfc_back";
var mutate_class = "mutate";
var adventure_class = "adventure";
var miracle_class = "miracle";
var planeswalker_class = "planeswalker";
var snow_class = "snow";
var basic_class = "basic";
var planar_class = "planar";


// Layer names
var LayerNames = {
    WHITE: "W",
    BLUE: "U",
    BLACK: "B",
    RED: "R",
    GREEN: "G",
    WU: "WU",
    UB: "UB",
    BR: "BR",
    RG: "RG",
    GW: "GW",
    WB: "WB",
    BG: "BG",
    GU: "GU",
    UR: "UR",
    RW: "RW",
    ARTIFACT: "Artifact",
    COLOURLESS: "Colourless",
    LAND: "Land",
    GOLD: "Gold",
    VEHICLE: "Vehicle",
};

var default_layer = "Layer 1";

var BasicLandNames = [
    "Plains",
    "Island",
    "Swamp",
    "Mountain",
    "Forest",
    "Wastes",
    "Snow-Covered Plains",
    "Snow-Covered Island",
    "Snow-Covered Swamp",
    "Snow-Covered Mountain",
    "Snow-Covered Forest"
];

// Card faces
var Faces = {
    FRONT: 0,
    BACK: 1,
}

// Font names
var font_name_mplantin = "MPlantin";
var font_name_mplantin_italic = "MPlantin-Italic";
var font_name_ndpmtg = "NDPMTG";

// Font spacing
var modal_indent = 5.7;
var line_break_lead = 2.4;
var flavour_text_lead = 4.4;

// Symbol colours
var rgb_c = new SolidColor();
rgb_c.rgb.red = 204;
rgb_c.rgb.green = 194;
rgb_c.rgb.blue = 193;

var rgb_w = new SolidColor();
rgb_w.rgb.red = 255;
rgb_w.rgb.green = 251;
rgb_w.rgb.blue = 214;

var rgb_u = new SolidColor();
rgb_u.rgb.red = 170;
rgb_u.rgb.green = 224;
rgb_u.rgb.blue = 250;

var rgb_b = new SolidColor();
rgb_b.rgb.red = 159;
rgb_b.rgb.green = 146;
rgb_b.rgb.blue = 143;

var rgb_r = new SolidColor();
rgb_r.rgb.red = 249;
rgb_r.rgb.green = 169;
rgb_r.rgb.blue = 143;

var rgb_g = new SolidColor();
rgb_g.rgb.red = 154;
rgb_g.rgb.green = 211;
rgb_g.rgb.blue = 175;

// NDPMTG font dictionary to translate Scryfall symbols to font character sequences
var symbols = {
    "{W/P}": "Qp",
    "{U/P}": "Qp",
    "{B/P}": "Qp",
    "{R/P}": "Qp",
    "{G/P}": "Qp",
    "{E}": "e",
    "{T}": "ot",
    "{X}": "ox",
    "{0}": "o0",
    "{1}": "o1",
    "{2}": "o2",
    "{3}": "o3",
    "{4}": "o4",
    "{5}": "o5",
    "{6}": "o6",
    "{7}": "o7",
    "{8}": "o8",
    "{9}": "o9",
    "{10}": "oA",
    "{11}": "oB",
    "{12}": "oC",
    "{13}": "oD",
    "{14}": "oE",
    "{15}": "oF",
    "{16}": "oG",
    "{20}": "oK",
    "{W}": "ow",
    "{U}": "ou",
    "{B}": "ob",
    "{R}": "or",
    "{G}": "og",
    "{C}": "oc",
    "{W/U}": "QqLS",
    "{U/B}": "QqMT",
    "{B/R}": "QqNU",
    "{R/G}": "QqOV",
    "{G/W}": "QqPR",
    "{W/B}": "QqLT",
    "{B/G}": "QqNV",
    "{G/U}": "QqPS",
    "{U/R}": "QqMU",
    "{R/W}": "QqOR",
    "{2/W}": "QqWR",
    "{2/U}": "QqWS",
    "{2/B}": "QqWT",
    "{2/R}": "QqWU",
    "{2/G}": "QqWV",
    "{S}": "omn",
    "{Q}": "ol",
    "{CHAOS}": "?"
};

// Ability words which should be italicised in formatted text
var ability_words = [
    "Adamant",
    "Addendum",
    "Battalion",
    "Bloodrush",
    "Channel",
    "Chroma",
    "Cohort",
    "varellation",
    "Converge",
    "Council's dilemma",
    "Delirium",
    "Domain",
    "Eminence",
    "Enrage",
    "Fateful hour",
    "Ferocious",
    "Formidable",
    "Grandeur",
    "Hellbent",
    "Heroic",
    "Imprint",
    "Inspired",
    "Join forces",
    "Kinship",
    "Landfall",
    "Lieutenant",
    "Metalcraft",
    "Morbid",
    "Parley",
    "Radiance",
    "Raid",
    "Rally",
    "Revolt",
    "Spell mastery",
    "Strive",
    "Sweep",
    "Tempting offer",
    "Threshold",
    "Undergrowth",
    "Will of the council",
    "Magecraft",

    // AFR ability words
    "Antimagic Cone",
    "Fear Ray",
    "Pack tactics",
    "Acid Breath",
    "Teleport",
    "Lightning Breath",
    "Wild Magic Surge",
    "Two-Weapon Fighting",
    "Archery",
    "Bear Form",
    "Mage Hand",
    "Cure Wounds",
    "Dispel Magic",
    "Gentle Reprise",
    "Beacon of Hope",
    "Displacement",
    "Drag Below",
    "Siege Monster",
    "Dark One's Own Luck",
    "Climb Over",
    "Tie Up",
    "Rappel Down",
    "Rejuvenation",
    "Engulf",
    "Dissolve",
    "Poison Breath",
    "Tragic Backstory",
    "Cunning Action",
    "Stunning Strike",
    "Circle of Death",
    "Bardic Inspiration",
    "Song of Rest",
    "Sneak Attack",
    "Tail Spikes",
    "Dominate Monster",
    "Flurry of Blows",
    "Divine Intervention",
    "Split",
    "Magical Tinkering",
    "Keen Senses",
    "Grant an Advantage",
    "Smash the Chest",
    "Pry It Open",
    "Fire Breath",
    "Cone of Cold",
    "Brave the Stench",
    "Search the Body",
    "Bewitching Whispers",
    "Whispers of the Grave",
    "Animate Walking Statue",
    "Trapped!",
    "Invoke Duplicity",
    "Combat Inspiration",
    "Cold Breath",
    "Life Drain",
    "Fight the Current",
    "Find a Crossing",
    "Intimidate Them",
    "Fend Them Off",
    "Smash It",
    "Lift the Curse",
    "Steal Its Eyes",
    "Break Their Chains",
    "Interrogate Them",
    "Foil Their Scheme",
    "Learn Their Secrets",
    "Journey On",
    "Make Camp",
    "Rouse the Party",
    "Set Off Traps",
    "Form a Party",
    "Start a Brawl",
    "Make a Retreat",
    "Stand and Fight",
    "Distract the Guards",
    "Hide",
    "Charge Them",
    "Befriend Them",
];

// Card rarities
rarity_common = "common";
rarity_uncommon = "uncommon";
rarity_rare = "rare";
rarity_mythic = "mythic";
rarity_special = "special";
rarity_bonus = "bonus";