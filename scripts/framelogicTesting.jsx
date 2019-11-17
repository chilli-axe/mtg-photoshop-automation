// Read in relevant files
var filePath = File($.filename).parent.parent.fsName;
$.evalFile(filePath + "/scripts/json2.js");
$.evalFile(filePath + "/scripts/proxy.jsx");
$.evalFile(filePath + "/scripts/framelogic.jsx");

// Declare the test cases
// function selectFrameLayers(typeLine, cardText, cardManaCost)
// return [selectedBackground, selectedPinlines, selectedNamebox, isNyx, eldrazi];
const testcases = {
  // Basic test cases - mono coloured, normal frame cards
  "Healing Salve":    ["W", "W", "W", false, false],
  "Ancestral Recall": ["U", "U", "U", false, false],
  "Dark Ritual":      ["B", "B", "B", false, false],
  "Lightning Bolt":   ["R", "R", "R", false, false],
  "Giant Growth":     ["G", "G", "G", false, false],

  // Two coloured, normal frame cards
  "Azorius Charm":    ["Gold", "WU", "Gold", false, false],
  "Dimir Charm":      ["Gold", "UB", "Gold", false, false],
  "Rakdos Charm":     ["Gold", "BR", "Gold", false, false],
  "Gruul Charm":      ["Gold", "RG", "Gold", false, false],
  "Selesnya Charm":   ["Gold", "GW", "Gold", false, false],
  "Orzhov Charm":     ["Gold", "WB", "Gold", false, false],
  "Golgari Charm":    ["Gold", "BG", "Gold", false, false],
  "Simic Charm":      ["Gold", "GU", "Gold", false, false],
  "Izzet Charm":      ["Gold", "UR", "Gold", false, false],
  "Boros Charm":      ["Gold", "RW", "Gold", false, false],

  // Tri coloured, normal frame cards
  "Esper Charm":      ["Gold", "Gold", "Gold", false, false],
  "Grixis Charm":     ["Gold", "Gold", "Gold", false, false],
  "Jund Charm":       ["Gold", "Gold", "Gold", false, false],
  "Naya Charm":       ["Gold", "Gold", "Gold", false, false],
  "Bant Charm":       ["Gold", "Gold", "Gold", false, false],
  "Abzan Charm":      ["Gold", "Gold", "Gold", false, false],
  "Jeskai Charm":     ["Gold", "Gold", "Gold", false, false],
  "Sultai Charm":     ["Gold", "Gold", "Gold", false, false],
  "Mardu Charm":      ["Gold", "Gold", "Gold", false, false],
  "Temur Charm":      ["Gold", "Gold", "Gold", false, false],

  "Vesuva":           ["Land", "Land", "Land", false, false],

  // TODO: More cases
  // City of Brass
  // Gemstone Cavern
  // Castle Ardenvale, etc.
  // Command Tower
  // Witch's Cottage, etc.
  // Emrakul, the Aeons Torn
  // Baleful Strix
  // Golgari Guildmage, etc.
  // Spectral Procession, etc.
  // Tolarian Academy, etc.
  // Frontier Bivouac, etc.
};

$.writeln("Starting testing:");
for(var testcase in testcases) {
  // Test the current test case
  if (testLogic(testcase, testcases[testcase])) {
    $.writeln("Test case passed: " + testcase);
  }
  else {
    $.writeln("Test case failed: " + testcase);
  }
}
$.writeln("Finished testing.")

function testLogic(cardname, expectedLayers) {
  // Run Python script to get info from Scryfall
  app.system("python get_card_info.py \"" + cardname + "\"");

  var cardJSONFile = new File(filePath + "/scripts/card.json");
  cardJSONFile.open('r');
  var cardJSON = cardJSONFile.read();
  cardJSONFile.close();

  // Why do we have to parse this twice? To be honest only God knows lmao
  var jsonParsed = JSON.parse(JSON.parse(cardJSON));

  // Function call
  selectedLayers = selectFrameLayers(jsonParsed.type, jsonParsed.text, jsonParsed.manaCost);

  // Compare against expected layers, and return true/false
  if(expectedLayers.length != selectedLayers.length) return false;
  for (var i = 0; i < selectedLayers.length; i++) {
    if (selectedLayers[i] != expectedLayers[i]) return false;
  }
  return true;

}
