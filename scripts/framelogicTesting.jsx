// Read in relevant files
var filePath = File($.fileName).parent.parent.fsName;
$.evalFile(filePath + "/scripts/json2.js");
$.evalFile(filePath + "/scripts/proxy.jsx");
$.evalFile(filePath + "/scripts/framelogic.jsx");

// Declare the test cases
// function selectFrameLayers(typeLine, cardText, cardManaCost)
// return [selectedBackground, selectedPinlines, selectedNamebox, isNyx, eldrazi];
const testcases = {
  // Basic test cases - mono coloured, normal frame cards
  "Healing Salve":               ["W", "W", "W", false, false],
  "Ancestral Recall":            ["U", "U", "U", false, false],
  "Dark Ritual":                 ["B", "B", "B", false, false],
  "Lightning Bolt":              ["R", "R", "R", false, false],
  "Giant Growth":                ["G", "G", "G", false, false],

  // Mono coloured cards with 2/C in their cost
  "Spectral Procession":         ["W", "W", "W", false, false],
  "Advice from the Fae":         ["U", "U", "U", false, false],
  "Beseech the Queen":           ["B", "B", "B", false, false],
  "Flame Javelin":               ["R", "R", "R", false, false],
  "Tower Above":                 ["G", "G", "G", false, false],

  // Pacts
  "Intervention Pact":           ["W", "W", "W", false, false],
  "Pact of Negation":            ["U", "U", "U", false, false],
  "Slaughter Pact":              ["B", "B", "B", false, false],
  "Pact of the Titan":           ["R", "R", "R", false, false],
  "Summoner's Pact":             ["G", "G", "G", false, false],

  // Enchantment creatures
  "Heliod, God of the Sun":      ["W", "W", "W", true ,false],
  "Thassa, God of the Sea":      ["U", "U", "U", true ,false],
  "Erebos, God of the Dead":     ["B", "B", "B", true ,false],
  "Purphoros, God of the Forge": ["R", "R", "R", true ,false],
  "Nylea, God of the Hunt":      ["G", "G", "G", true ,false],

  // Suspend cards with no mana cost
  "Restore Balance":             ["W", "W", "W", false, false],
  "Ancestral Vision":            ["U", "U", "U", false, false],
  "Living End":                  ["B", "B", "B", false, false],
  "Wheel of Fate":               ["R", "R", "R", false, false],
  "Hypergenesis":                ["G", "G", "G", false, false],
  "Lotus Bloom":                 ["Artifact", "Artifact", "Artifact", false, false],

  // Two coloured, normal frame cards
  "Azorius Charm":               ["Gold", "WU", "Gold", false, false],
  "Dimir Charm":                 ["Gold", "UB", "Gold", false, false],
  "Rakdos Charm":                ["Gold", "BR", "Gold", false, false],
  "Gruul Charm":                 ["Gold", "RG", "Gold", false, false],
  "Selesnya Charm":              ["Gold", "GW", "Gold", false, false],
  "Orzhov Charm":                ["Gold", "WB", "Gold", false, false],
  "Golgari Charm":               ["Gold", "BG", "Gold", false, false],
  "Simic Charm":                 ["Gold", "GU", "Gold", false, false],
  "Izzet Charm":                 ["Gold", "UR", "Gold", false, false],
  "Boros Charm":                 ["Gold", "RW", "Gold", false, false],

  // Two coloured, hybrid frame cards
  "Godhead of Awe":              ["WU", "WU", "Land", false, false],
  "Ghastlord of Fugue":          ["UB", "UB", "Land", false, false],
  "Demigod of Revenge":          ["BR", "BR", "Land", false, false],
  "Deus of Calamity":            ["RG", "RG", "Land", false, false],
  "Oversoul of Dusk":            ["GW", "GW", "Land", false, false],
  "Divinity of Pride":           ["WB", "WB", "Land", false, false],
  "Deity of Scars":              ["BG", "BG", "Land", false, false],
  "Overbeing of Myth":           ["GU", "GU", "Land", false, false],
  "Dominus of Fealty":           ["UR", "UR", "Land", false, false],
  "Nobilis of War":              ["RW", "RW", "Land", false, false],

  // Transform cards
  "Insectile Aberration":        ["U", "U", "U", false, false],
  "Ravager of the Fells":        ["Gold", "RG", "Gold", false, false],


  // Tri coloured, normal frame cards
  "Esper Charm":                 ["Gold", "Gold", "Gold", false, false],
  "Grixis Charm":                ["Gold", "Gold", "Gold", false, false],
  "Jund Charm":                  ["Gold", "Gold", "Gold", false, false],
  "Naya Charm":                  ["Gold", "Gold", "Gold", false, false],
  "Bant Charm":                  ["Gold", "Gold", "Gold", false, false],
  "Abzan Charm":                 ["Gold", "Gold", "Gold", false, false],
  "Jeskai Charm":                ["Gold", "Gold", "Gold", false, false],
  "Sultai Charm":                ["Gold", "Gold", "Gold", false, false],
  "Mardu Charm":                 ["Gold", "Gold", "Gold", false, false],
  "Temur Charm":                 ["Gold", "Gold", "Gold", false, false],

  // Eldrazi
  "Emrakul, the Aeons Torn":     ["Eldrazi", "Eldrazi", "Eldrazi", false, true],
  "Scion of Ugin":               ["Eldrazi", "Eldrazi", "Eldrazi", false, true],

  // Colourless artifacts
  "Herald's Horn":               ["Artifact", "Artifact", "Artifact", false, false],
  "Black Lotus":                 ["Artifact", "Artifact", "Artifact", false, false],
  "Mox Pearl":                   ["Artifact", "Artifact", "Artifact", false, false],
  "Mox Sapphire":                ["Artifact", "Artifact", "Artifact", false, false],
  "Mox Jet":                     ["Artifact", "Artifact", "Artifact", false, false],
  "Mox Ruby":                    ["Artifact", "Artifact", "Artifact", false, false],
  "Mox Emerald":                 ["Artifact", "Artifact", "Artifact", false, false],

  // Mono coloured artifacts
  "The Circle of Loyalty":       ["Artifact", "W", "W", false, false],
  "The Magic Mirror":            ["Artifact", "U", "U", false, false],
  "The Cauldron of Eternity":    ["Artifact", "B", "B", false, false],
  "Embercleave":                 ["Artifact", "R", "R", false, false],
  "The Great Henge":             ["Artifact", "G", "G", false, false],

  // Two coloured artifacts
  "Filigree Angel":              ["Artifact", "WU", "Gold", false, false],
  "Time Sieve":                  ["Artifact", "UB", "Gold", false, false],
  "Demonspine Whip":             ["Artifact", "BR", "Gold", false, false],
  "Mage Slayer":                 ["Artifact", "RG", "Gold", false, false],
  "Behemoth Sledge":             ["Artifact", "GW", "Gold", false, false],
  "Tainted Sigil":               ["Artifact", "WB", "Gold", false, false],
  "Shardless Agent":             ["Artifact", "GU", "Gold", false, false],
  "Etherium-Horn Sorcerer":      ["Artifact", "UR", "Gold", false, false],

  // Tri coloured artifacts
  "Sphinx of the Steel Wind":    ["Artifact", "Gold", "Gold", false, false],
  "Thopter Foundry":             ["Artifact", "Gold", "Gold", false, false],

  // Five colour artifacts
  "Sphinx of the Guildpact":     ["Artifact", "Gold", "Gold", false, false],
  "Reaper King":                 ["Artifact", "Gold", "Gold", false, false],

  // Colourless lands with varying rules texts
  "Vesuva":                      ["Land", "Land", "Land", false, false],
  "Evolving Wilds":              ["Land", "Land", "Land", false, false],
  "Karn's Bastion":              ["Land", "Land", "Land", false, false],
  "Hall of Heliod's Generosity": ["Land", "Land", "Land", false, false],
  "Academy Ruins":               ["Land", "Land", "Land", false, false],
  "Volrath's Stronghold":        ["Land", "Land", "Land", false, false],
  "Gemstone Caverns":            ["Land", "Land", "Land", false, false],
  "Glacial Chasm":               ["Land", "Land", "Land", false, false],
  "Ash Barrens":                 ["Land", "Land", "Land", false, false],
  "Crumbling Vestige":           ["Land", "Land", "Land", false, false],
  "Blighted Steppe":             ["Land", "Land", "Land", false, false],
  "Blighted Cataract":           ["Land", "Land", "Land", false, false],
  "Blighted Fen":                ["Land", "Land", "Land", false, false],
  "Blighted Gorge":              ["Land", "Land", "Land", false, false],
  "Blighted Woodland":           ["Land", "Land", "Land", false, false],
  "Maze's End":                  ["Land", "Land", "Land", false, false],
  "Inventors' Fair":             ["Land", "Land", "Land", false, false],
  "Myriad Landscape":            ["Land", "Land", "Land", false, false],
  "Crystal Quarry":              ["Land", "Gold", "Gold", false, false],

  // Panoramas
  "Esper Panorama":              ["Land", "Land", "Land", false, false],
  "Grixis Panorama":             ["Land", "Land", "Land", false, false],
  "Jund Panorama":               ["Land", "Land", "Land", false, false],
  "Naya Panorama":               ["Land", "Land", "Land", false, false],
  "Bant Panorama":               ["Land", "Land", "Land", false, false],

  // Mono coloured lands that specifically add their colour of mana
  "Castle Ardenvale":            ["Land", "W", "W", false, false],
  "Castle Vantress":             ["Land", "U", "U", false, false],
  "Castle Locthwain":            ["Land", "B", "B", false, false],
  "Castle Embereth":             ["Land", "R", "R", false, false],
  "Castle Garenbrig":            ["Land", "G", "G", false, false],
  "Serra's Sanctum":             ["Land", "W", "W", false, false],
  "Tolarian Academy":            ["Land", "U", "U", false, false],
  "Cabal Coffers":               ["Land", "B", "B", false, false],
  "Gaea's Cradle":               ["Land", "G", "G", false, false],

  // Mono coloured lands with basic lands subtype
  "Idyllic Grange":              ["Land", "W", "W", false, false],
  "Mystic Sanctuary":            ["Land", "U", "U", false, false],
  "Witch's Cottage":             ["Land", "B", "B", false, false],
  "Dwarven Mine":                ["Land", "R", "R", false, false],
  "Gingerbread Cabin":           ["Land", "G", "G", false, false],

  // Vivid lands
  "Vivid Meadow":                ["Land", "W", "W", false, false],
  "Vivid Creek":                 ["Land", "U", "U", false, false],
  "Vivid Marsh":                 ["Land", "B", "B", false, false],
  "Vivid Crag":                  ["Land", "R", "R", false, false],
  "Vivid Grove":                 ["Land", "G", "G", false, false],

  // Two coloured lands that specifically add their colours of mana
  "Celestial Colonnade":         ["Land", "WU", "Land", false, false],
  "Creeping Tar Pit":            ["Land", "UB", "Land", false, false],
  "Lavaclaw Reaches":            ["Land", "BR", "Land", false, false],
  "Raging Ravine":               ["Land", "RG", "Land", false, false],
  "Stirring Wildwood":           ["Land", "GW", "Land", false, false],
  "Shambling Vent":              ["Land", "WB", "Land", false, false],
  "Hissing Quagmire":            ["Land", "BG", "Land", false, false],
  "Lumbering Falls":             ["Land", "GU", "Land", false, false],
  "Wandering Fumarole":          ["Land", "UR", "Land", false, false],
  "Needle Spires":               ["Land", "RW", "Land", false, false],

  // Two coloured lands with basic land subtypes
  "Hallowed Fountain":           ["Land", "WU", "Land", false, false],
  "Watery Grave":                ["Land", "UB", "Land", false, false],
  "Blood Crypt":                 ["Land", "BR", "Land", false, false],
  "Stomping Ground":             ["Land", "RG", "Land", false, false],
  "Temple Garden":               ["Land", "GW", "Land", false, false],
  "Godless Shrine":              ["Land", "WB", "Land", false, false],
  "Overgrown Tomb":              ["Land", "BG", "Land", false, false],
  "Breeding Pool":               ["Land", "GU", "Land", false, false],
  "Steam Vents":                 ["Land", "UR", "Land", false, false],
  "Sacred Foundry":              ["Land", "RW", "Land", false, false],

  // Onslaught/Zendikar fetchlands
  "Flooded Stand":               ["Land", "WU", "Land", false, false],
  "Polluted Delta":              ["Land", "UB", "Land", false, false],
  "Bloodstained Mire":           ["Land", "BR", "Land", false, false],
  "Wooded Foothills":            ["Land", "RG", "Land", false, false],
  "Windswept Heath":             ["Land", "GW", "Land", false, false],
  "Marsh Flats":                 ["Land", "WB", "Land", false, false],
  "Verdant Catacombs":           ["Land", "BG", "Land", false, false],
  "Misty Rainforest":            ["Land", "GU", "Land", false, false],
  "Scalding Tarn":               ["Land", "UR", "Land", false, false],
  "Arid Mesa":                   ["Land", "RW", "Land", false, false],

  // Other wildcards
  "Krosan Verge":                ["Land", "GW", "Land", false, false],
  "Murmuring Bosk":              ["Land", "Gold", "G", false, false],
  "Dryad Arbor":                 ["Land", "G", "G", false, false],

  // Tri colour lands
  "Arcane Sanctum":              ["Land", "Gold", "Gold", false, false],
  "Crumbling Necropolis":        ["Land", "Gold", "Gold", false, false],
  "Savage Lands":                ["Land", "Gold", "Gold", false, false],
  "Jungle Shrine":               ["Land", "Gold", "Gold", false, false],
  "Seaside Citadel":             ["Land", "Gold", "Gold", false, false],
  "Sandsteppe Citadel":          ["Land", "Gold", "Gold", false, false],
  "Mystic Monastery":            ["Land", "Gold", "Gold", false, false],
  "Opulent Palace":              ["Land", "Gold", "Gold", false, false],
  "Nomad Outpost":               ["Land", "Gold", "Gold", false, false],
  "Frontier Bivouac":            ["Land", "Gold", "Gold", false, false],

  // Gold lands with varying rules text
  "Prismatic Vista":             ["Land", "Gold", "Gold", false, false],
  "Fabled Passage":              ["Land", "Gold", "Gold", false, false],
  "Aether Hub":                  ["Land", "Gold", "Gold", false, false],
  "City of Brass":               ["Land", "Gold", "Gold", false, false],
  "Mana Confluence":             ["Land", "Gold", "Gold", false, false],
  "Ally Encampment":             ["Land", "Gold", "Gold", false, false],
  "Command Tower":               ["Land", "Gold", "Gold", false, false],

  // TODO: Planeswalkers? Might be unnecessary

};

var file = new File(filePath + "/scripts/test.log");
file.open("w");
file.write("Starting testing:\n");
var result;
for(var testcase in testcases) {
  // Test the current test case
  result = testLogic(testcase, testcases[testcase]);
  if (result[0]) {
    file.write("Test case passed: " + testcase)
  }
  else {
    file.write("Test case failed: " + testcase + "\n");
    file.write("Expected [" + testcases[testcase] + "], returned [" + result[1] + "].");
  }
  file.write("\n");
}
file.write("Finished testing.");
file.close();

function testLogic(cardname, expectedLayers) {
  // Run Python script to get info from Scryfall
  // Execute this with different commands, depending on operating system
  // Assumes users are only using either Windows or macOS
  // Thanks to jamesthe500 on stackoverflow for the OS-detecting code
  if ($.os.search(/windows/i) != -1) {
    // Windows
    app.system("python get_card_info.py \"" + cardname + "\"");
  } else {
    // macOS
    app.system("/usr/local/bin/python3 " + filePath + "/scripts/get_card_info.py \"" + cardname + "\" >> " + filePath + "/scripts/debug.log 2>&1");
  }

  var cardJSONFile = new File(filePath + "/scripts/card.json");
  cardJSONFile.open('r');
  var cardJSON = cardJSONFile.read();
  cardJSONFile.close();

  // Why do we have to parse this twice? To be honest only God knows lmao
  var jsonParsed = JSON.parse(JSON.parse(cardJSON));

  // Function call
  selectedLayers = selectFrameLayers(jsonParsed);

  // Compare against expected layers, and return true/false
  if(expectedLayers.length != selectedLayers.length) return [false, selectedLayers];
  for (var i = 0; i < selectedLayers.length; i++) {
    if (selectedLayers[i] != expectedLayers[i]) {

      return [false, selectedLayers];
    }
  }
  return [true];
}
