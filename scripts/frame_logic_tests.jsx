#include "json2.js";
#include "render.jsx";
#include "constants.jsx";
#include "frame_logic.jsx";

var file_path = File($.fileName).parent.parent.fsName;

/* Test cases */
// Frame array: [background, pinlines, twins, is_nyx, is_colourless]
const test_cases = {
    // Basic test cases - mono coloured, normal frame cards
    "Healing Salve": { layout: NormalLayout, frame: [LayerNames.WHITE, LayerNames.WHITE, LayerNames.WHITE, false, false] },
    "Ancestral Recall": { layout: NormalLayout, frame: [LayerNames.BLUE, LayerNames.BLUE, LayerNames.BLUE, false, false] },
    "Dark Ritual": { layout: NormalLayout, frame: [LayerNames.BLACK, LayerNames.BLACK, LayerNames.BLACK, false, false] },
    "Lightning Bolt": { layout: NormalLayout, frame: [LayerNames.RED, LayerNames.RED, LayerNames.RED, false, false] },
    "Giant Growth": { layout: NormalLayout, frame: [LayerNames.GREEN, LayerNames.GREEN, LayerNames.GREEN, false, false] },

    // Mono coloured cards with 2/C in their cost
    "Spectral Procession": { layout: NormalLayout, frame: [LayerNames.WHITE, LayerNames.WHITE, LayerNames.WHITE, false, false] },
    "Advice from the Fae": { layout: NormalLayout, frame: [LayerNames.BLUE, LayerNames.BLUE, LayerNames.BLUE, false, false] },
    "Beseech the Queen": { layout: NormalLayout, frame: [LayerNames.BLACK, LayerNames.BLACK, LayerNames.BLACK, false, false] },
    "Flame Javelin": { layout: NormalLayout, frame: [LayerNames.RED, LayerNames.RED, LayerNames.RED, false, false] },
    "Tower Above": { layout: NormalLayout, frame: [LayerNames.GREEN, LayerNames.GREEN, LayerNames.GREEN, false, false] },

    // Pacts
    "Intervention Pact": { layout: NormalLayout, frame: [LayerNames.WHITE, LayerNames.WHITE, LayerNames.WHITE, false, false] },
    "Pact of Negation": { layout: NormalLayout, frame: [LayerNames.BLUE, LayerNames.BLUE, LayerNames.BLUE, false, false] },
    "Slaughter Pact": { layout: NormalLayout, frame: [LayerNames.BLACK, LayerNames.BLACK, LayerNames.BLACK, false, false] },
    "Pact of the Titan": { layout: NormalLayout, frame: [LayerNames.RED, LayerNames.RED, LayerNames.RED, false, false] },
    "Summoner's Pact": { layout: NormalLayout, frame: [LayerNames.GREEN, LayerNames.GREEN, LayerNames.GREEN, false, false] },

    // Enchantment creatures
    "Heliod, God of the Sun": { layout: NormalLayout, frame: [LayerNames.WHITE, LayerNames.WHITE, LayerNames.WHITE, true, false] },
    "Thassa, God of the Sea": { layout: NormalLayout, frame: [LayerNames.BLUE, LayerNames.BLUE, LayerNames.BLUE, true, false] },
    "Erebos, God of the Dead": { layout: NormalLayout, frame: [LayerNames.BLACK, LayerNames.BLACK, LayerNames.BLACK, true, false] },
    "Purphoros, God of the Forge": { layout: NormalLayout, frame: [LayerNames.RED, LayerNames.RED, LayerNames.RED, true, false] },
    "Nylea, God of the Hunt": { layout: NormalLayout, frame: [LayerNames.GREEN, LayerNames.GREEN, LayerNames.GREEN, true, false] },

    // Suspend cards with no mana cost
    "Restore Balance": { layout: NormalLayout, frame: [LayerNames.WHITE, LayerNames.WHITE, LayerNames.WHITE, false, false] },
    "Ancestral Vision": { layout: NormalLayout, frame: [LayerNames.BLUE, LayerNames.BLUE, LayerNames.BLUE, false, false] },
    "Living End": { layout: NormalLayout, frame: [LayerNames.BLACK, LayerNames.BLACK, LayerNames.BLACK, false, false] },
    "Wheel of Fate": { layout: NormalLayout, frame: [LayerNames.RED, LayerNames.RED, LayerNames.RED, false, false] },
    "Hypergenesis": { layout: NormalLayout, frame: [LayerNames.GREEN, LayerNames.GREEN, LayerNames.GREEN, false, false] },
    "Lotus Bloom": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.ARTIFACT, LayerNames.ARTIFACT, false, false] },

    // Two coloured, normal frame cards
    "Azorius Charm": { layout: NormalLayout, frame: [LayerNames.GOLD, LayerNames.WU, LayerNames.GOLD, false, false] },
    "Dimir Charm": { layout: NormalLayout, frame: [LayerNames.GOLD, LayerNames.UB, LayerNames.GOLD, false, false] },
    "Rakdos Charm": { layout: NormalLayout, frame: [LayerNames.GOLD, LayerNames.BR, LayerNames.GOLD, false, false] },
    "Gruul Charm": { layout: NormalLayout, frame: [LayerNames.GOLD, LayerNames.RG, LayerNames.GOLD, false, false] },
    "Selesnya Charm": { layout: NormalLayout, frame: [LayerNames.GOLD, LayerNames.GW, LayerNames.GOLD, false, false] },
    "Orzhov Charm": { layout: NormalLayout, frame: [LayerNames.GOLD, LayerNames.WB, LayerNames.GOLD, false, false] },
    "Golgari Charm": { layout: NormalLayout, frame: [LayerNames.GOLD, LayerNames.BG, LayerNames.GOLD, false, false] },
    "Simic Charm": { layout: NormalLayout, frame: [LayerNames.GOLD, LayerNames.GU, LayerNames.GOLD, false, false] },
    "Izzet Charm": { layout: NormalLayout, frame: [LayerNames.GOLD, LayerNames.UR, LayerNames.GOLD, false, false] },
    "Boros Charm": { layout: NormalLayout, frame: [LayerNames.GOLD, LayerNames.RW, LayerNames.GOLD, false, false] },

    // Two coloured, hybrid frame cards
    "Godhead of Awe": { layout: NormalLayout, frame: [LayerNames.WU, LayerNames.WU, LayerNames.LAND, false, false] },
    "Ghastlord of Fugue": { layout: NormalLayout, frame: [LayerNames.UB, LayerNames.UB, LayerNames.LAND, false, false] },
    "Demigod of Revenge": { layout: NormalLayout, frame: [LayerNames.BR, LayerNames.BR, LayerNames.LAND, false, false] },
    "Deus of Calamity": { layout: NormalLayout, frame: [LayerNames.RG, LayerNames.RG, LayerNames.LAND, false, false] },
    "Oversoul of Dusk": { layout: NormalLayout, frame: [LayerNames.GW, LayerNames.GW, LayerNames.LAND, false, false] },
    "Divinity of Pride": { layout: NormalLayout, frame: [LayerNames.WB, LayerNames.WB, LayerNames.LAND, false, false] },
    "Deity of Scars": { layout: NormalLayout, frame: [LayerNames.BG, LayerNames.BG, LayerNames.LAND, false, false] },
    "Overbeing of Myth": { layout: NormalLayout, frame: [LayerNames.GU, LayerNames.GU, LayerNames.LAND, false, false] },
    "Dominus of Fealty": { layout: NormalLayout, frame: [LayerNames.UR, LayerNames.UR, LayerNames.LAND, false, false] },
    "Nobilis of War": { layout: NormalLayout, frame: [LayerNames.RW, LayerNames.RW, LayerNames.LAND, false, false] },

    // Transform cards
    "Insectile Aberration": { layout: TransformLayout, frame: [LayerNames.BLUE, LayerNames.BLUE, LayerNames.BLUE, false, false] },
    "Ravager of the Fells": { layout: TransformLayout, frame: [LayerNames.GOLD, LayerNames.RG, LayerNames.GOLD, false, false] },
    "Brisela, Voice of Nightmares": { layout: MeldLayout, frame: [LayerNames.COLOURLESS, LayerNames.COLOURLESS, LayerNames.COLOURLESS, false, true] },

    // Tri coloured, normal frame cards
    "Esper Charm": { layout: NormalLayout, frame: [LayerNames.GOLD, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Grixis Charm": { layout: NormalLayout, frame: [LayerNames.GOLD, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Jund Charm": { layout: NormalLayout, frame: [LayerNames.GOLD, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Naya Charm": { layout: NormalLayout, frame: [LayerNames.GOLD, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Bant Charm": { layout: NormalLayout, frame: [LayerNames.GOLD, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Abzan Charm": { layout: NormalLayout, frame: [LayerNames.GOLD, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Jeskai Charm": { layout: NormalLayout, frame: [LayerNames.GOLD, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Sultai Charm": { layout: NormalLayout, frame: [LayerNames.GOLD, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Mardu Charm": { layout: NormalLayout, frame: [LayerNames.GOLD, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Temur Charm": { layout: NormalLayout, frame: [LayerNames.GOLD, LayerNames.GOLD, LayerNames.GOLD, false, false] },

    // Eldrazi
    "Emrakul, the Aeons Torn": { layout: NormalLayout, frame: [LayerNames.COLOURLESS, LayerNames.COLOURLESS, LayerNames.COLOURLESS, false, true] },
    "Scion of Ugin": { layout: NormalLayout, frame: [LayerNames.COLOURLESS, LayerNames.COLOURLESS, LayerNames.COLOURLESS, false, true] },

    // Colourless artifacts
    "Herald's Horn": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.ARTIFACT, LayerNames.ARTIFACT, false, false] },
    "Black Lotus": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.ARTIFACT, LayerNames.ARTIFACT, false, false] },
    "Mox Pearl": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.ARTIFACT, LayerNames.ARTIFACT, false, false] },
    "Mox Sapphire": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.ARTIFACT, LayerNames.ARTIFACT, false, false] },
    "Mox Jet": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.ARTIFACT, LayerNames.ARTIFACT, false, false] },
    "Mox Ruby": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.ARTIFACT, LayerNames.ARTIFACT, false, false] },
    "Mox Emerald": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.ARTIFACT, LayerNames.ARTIFACT, false, false] },

    // Mono coloured artifacts
    "The Circle of Loyalty": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.WHITE, LayerNames.WHITE, false, false] },
    "The Magic Mirror": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.BLUE, LayerNames.BLUE, false, false] },
    "The Cauldron of Eternity": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.BLACK, LayerNames.BLACK, false, false] },
    "Embercleave": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.RED, LayerNames.RED, false, false] },
    "The Great Henge": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.GREEN, LayerNames.GREEN, false, false] },

    // Two coloured artifacts
    "Filigree Angel": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.WU, LayerNames.GOLD, false, false] },
    "Time Sieve": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.UB, LayerNames.GOLD, false, false] },
    "Demonspine Whip": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.BR, LayerNames.GOLD, false, false] },
    "Mage Slayer": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.RG, LayerNames.GOLD, false, false] },
    "Behemoth Sledge": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.GW, LayerNames.GOLD, false, false] },
    "Tainted Sigil": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.WB, LayerNames.GOLD, false, false] },
    "Shardless Agent": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.GU, LayerNames.GOLD, false, false] },
    "Etherium-Horn Sorcerer": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.UR, LayerNames.GOLD, false, false] },

    // Tri coloured artifacts
    "Sphinx of the Steel Wind": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Thopter Foundry": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.GOLD, LayerNames.GOLD, false, false] },

    // Five colour artifacts
    "Sphinx of the Guildpact": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Reaper King": { layout: NormalLayout, frame: [LayerNames.ARTIFACT, LayerNames.GOLD, LayerNames.GOLD, false, false] },

    // Colourless lands with varying rules texts
    "Vesuva": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Evolving Wilds": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Karn's Bastion": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Hall of Heliod's Generosity": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Academy Ruins": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Volrath's Stronghold": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Gemstone Caverns": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Glacial Chasm": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Ash Barrens": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Crumbling Vestige": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Blighted Steppe": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Blighted Cataract": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Blighted Fen": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Blighted Gorge": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Blighted Woodland": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Maze's End": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Inventors' Fair": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Myriad Landscape": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Crystal Quarry": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GOLD, LayerNames.GOLD, false, false] },

    // Panoramas
    "Esper Panorama": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Grixis Panorama": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Jund Panorama": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Naya Panorama": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },
    "Bant Panorama": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.LAND, LayerNames.LAND, false, false] },

    // Mono coloured lands that specifically add their colour of mana
    "Castle Ardenvale": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.WHITE, LayerNames.WHITE, false, false] },
    "Castle Vantress": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.BLUE, LayerNames.BLUE, false, false] },
    "Castle Locthwain": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.BLACK, LayerNames.BLACK, false, false] },
    "Castle Embereth": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.RED, LayerNames.RED, false, false] },
    "Castle Garenbrig": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GREEN, LayerNames.GREEN, false, false] },
    "Serra's Sanctum": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.WHITE, LayerNames.WHITE, false, false] },
    "Tolarian Academy": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.BLUE, LayerNames.BLUE, false, false] },
    "Cabal Coffers": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.BLACK, LayerNames.BLACK, false, false] },
    "Gaea's Cradle": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GREEN, LayerNames.GREEN, false, false] },

    // Mono coloured lands with basic lands subtype
    "Idyllic Grange": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.WHITE, LayerNames.WHITE, false, false] },
    "Mystic Sanctuary": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.BLUE, LayerNames.BLUE, false, false] },
    "Witch's Cottage": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.BLACK, LayerNames.BLACK, false, false] },
    "Dwarven Mine": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.RED, LayerNames.RED, false, false] },
    "Gingerbread Cabin": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GREEN, LayerNames.GREEN, false, false] },

    // Vivid lands
    "Vivid Meadow": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.WHITE, LayerNames.WHITE, false, false] },
    "Vivid Creek": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.BLUE, LayerNames.BLUE, false, false] },
    "Vivid Marsh": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.BLACK, LayerNames.BLACK, false, false] },
    "Vivid Crag": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.RED, LayerNames.RED, false, false] },
    "Vivid Grove": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GREEN, LayerNames.GREEN, false, false] },

    // Two coloured lands that specifically add their colours of mana
    "Celestial Colonnade": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.WU, LayerNames.LAND, false, false] },
    "Creeping Tar Pit": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.UB, LayerNames.LAND, false, false] },
    "Lavaclaw Reaches": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.BR, LayerNames.LAND, false, false] },
    "Raging Ravine": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.RG, LayerNames.LAND, false, false] },
    "Stirring Wildwood": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GW, LayerNames.LAND, false, false] },
    "Shambling Vent": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.WB, LayerNames.LAND, false, false] },
    "Hissing Quagmire": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.BG, LayerNames.LAND, false, false] },
    "Lumbering Falls": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GU, LayerNames.LAND, false, false] },
    "Wandering Fumarole": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.UR, LayerNames.LAND, false, false] },
    "Needle Spires": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.RW, LayerNames.LAND, false, false] },

    // Two coloured lands with basic land subtypes
    "Hallowed Fountain": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.WU, LayerNames.LAND, false, false] },
    "Watery Grave": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.UB, LayerNames.LAND, false, false] },
    "Blood Crypt": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.BR, LayerNames.LAND, false, false] },
    "Stomping Ground": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.RG, LayerNames.LAND, false, false] },
    "Temple Garden": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GW, LayerNames.LAND, false, false] },
    "Godless Shrine": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.WB, LayerNames.LAND, false, false] },
    "Overgrown Tomb": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.BG, LayerNames.LAND, false, false] },
    "Breeding Pool": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GU, LayerNames.LAND, false, false] },
    "Steam Vents": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.UR, LayerNames.LAND, false, false] },
    "Sacred Foundry": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.RW, LayerNames.LAND, false, false] },

    // Onslaught/Zendikar fetchlands
    "Flooded Stand": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.WU, LayerNames.LAND, false, false] },
    "Polluted Delta": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.UB, LayerNames.LAND, false, false] },
    "Bloodstained Mire": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.BR, LayerNames.LAND, false, false] },
    "Wooded Foothills": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.RG, LayerNames.LAND, false, false] },
    "Windswept Heath": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GW, LayerNames.LAND, false, false] },
    "Marsh Flats": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.WB, LayerNames.LAND, false, false] },
    "Verdant Catacombs": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.BG, LayerNames.LAND, false, false] },
    "Misty Rainforest": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GU, LayerNames.LAND, false, false] },
    "Scalding Tarn": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.UR, LayerNames.LAND, false, false] },
    "Arid Mesa": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.RW, LayerNames.LAND, false, false] },

    // Other wildcards
    "Krosan Verge": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GW, LayerNames.LAND, false, false] },
    "Murmuring Bosk": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GOLD, LayerNames.GREEN, false, false] },
    "Dryad Arbor": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GREEN, LayerNames.GREEN, false, false] },

    // Tri colour lands
    "Arcane Sanctum": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Crumbling Necropolis": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Savage Lands": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Jungle Shrine": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Seaside Citadel": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Sandsteppe Citadel": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Mystic Monastery": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Opulent Palace": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Nomad Outpost": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Frontier Bivouac": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GOLD, LayerNames.GOLD, false, false] },

    // Gold lands with varying rules text
    "Prismatic Vista": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Fabled Passage": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Aether Hub": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "City of Brass": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Mana Confluence": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Ally Encampment": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GOLD, LayerNames.GOLD, false, false] },
    "Command Tower": { layout: NormalLayout, frame: [LayerNames.LAND, LayerNames.GOLD, LayerNames.GOLD, false, false] },
};

function layout_to_list(layout) {
    return [layout.background, layout.pinlines, layout.twins, layout.is_nyx, layout.is_colourless];
}

function test_logic(card_name, expected_layers) {
    var scryfall = call_python(card_name, file_path);

    // Function call
    var layout = new expected_layers.layout(scryfall, card_name);
    var layers = layout_to_list(layout);

    // Compare against expected layers, and return true/false
    if (layers.length != expected_layers.frame.length) return [false, layers];
    for (var i = 0; i < layers.length; i++) {
        if (layers[i] != expected_layers.frame[i]) {

            return [false, layers];
        }
    }
    return [true];
}

/* Test suite entry point */

var log_file = new File(file_path + "/scripts/test.log");
log_file.open(LayerNames.WHITE);
log_file.write("Starting testing:\n");
var result;
var test_counter = 1;
for (var test_case in test_cases) {
    // Test the current test case
    log_file.write("[Test " + test_counter.toString() + "] " + test_case + ": ")
    result = test_logic(test_case, test_cases[test_case]);
    if (result[0]) {
        log_file.write("PASSED")
    }
    else {
        log_file.write("FAILED: " + test_case + " - expected [" + test_cases[test_case].frame + "], returned [" + result[1] + "]");
    }
    log_file.write("\n");
    test_counter++;
}
log_file.write("Finished testing.");
log_file.close();
