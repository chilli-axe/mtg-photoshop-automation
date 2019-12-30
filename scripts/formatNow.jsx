/*
Usage:
> Move this script to C:\Program Files\Adobe\Adobe Photoshop CC 2018\Presets\Scripts (or equivalent)
> Hardcode the below path variable to point to the formatText file in your project directory
> Make the text layer you're working with the active layer (if you select another layer, it might crash photoshop lmao)
> File -> Scripts -> formatNow
*/

// Hardcode this path variable
$.evalFile("C:\\...\\scripts\\formatText.jsx");

// Build an array of italics text, starting with identifying any
// reminder text in the card's text body (anything in brackets).
var cardText = app.activeDocument.activeLayer.textItem.contents;
var reminderTextBool = true;

var italicText = [];
endIndex = 0;
while (reminderTextBool) {
  startIndex = cardText.indexOf("(", endIndex);
  if (startIndex >= 0) {
    endIndex = cardText.indexOf(")", startIndex + 1);
    italicText.push(cardText.slice(startIndex, endIndex + 1));
  } else {
    reminderTextBool = false;
  }
}

// Also attach the ability word Threshold and the cards' flavour text
// to the italics array.
const abilityWords = [
  "Adamant",
  "Addendum",
  "Battalion",
  "Bloodrush",
  "Channel",
  "Chroma",
  "Cohort",
  "Constellation",
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
  "Will of the council"
];

for (var i = 0; i < abilityWords.length; i++) {
  italicText.push(abilityWords[i] + " \u2014"); // Include em dash
}

formatText(cardText, italicText, -1, false);
