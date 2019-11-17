// Toggle between these two lines to use the normal frame or box topper frame
// boxtopper = "-boxtopper";
boxtopper = "";

function proxy(file, ye) {
  var expansionSymbol = ""; // Cube
  var filePath = File($.fileName).parent.parent.fsName;
  $.evalFile(filePath + "/scripts/json2.js");

  // Retrieve the card's name from the given filepath
  var filename;
  if (ye == 1) filename = decodeURI(file.name);
  else filename = decodeURI(file[0].name);
  fullCardName = filename.slice(0, filename.lastIndexOf("."));

  // Retrieve the card's name and artist
  var openIndex = fullCardName.lastIndexOf(" (");
  var closeIndex = fullCardName.lastIndexOf(")");
  var cardArtist = fullCardName.slice(openIndex + 2, closeIndex);
  const cardName = fullCardName.slice(0, openIndex);

  if (cardName == "Plains" || cardName == "Island" || cardName == "Swamp" || cardName == "Mountain" || cardName == "Forest") {
    proxyBasic(cardName, cardArtist, ye);
  } else {
    // Run Python script to get info from Scryfall
    // Execute this with different commands, depending on operating system
    // Assumes users are only using either Windows or macOS
    // Thanks to jamesthe500 on stackoverflow for the OS-detecting code
    if ($.os.search(/windows/i) != -1) {
      // Windows
      app.system("python get_card_info.py \"" + cardName + "\"");
    } else {
      // macOS
      app.system("/usr/local/bin/python3 " + filePath + "/scripts/get_card_info.py \"" + cardName + "\" >> " + filePath + "/scripts/debug.log 2>&1");
    }

    var cardJSONFile = new File(filePath + "/scripts/card.json");
    cardJSONFile.open('r');
    var cardJSON = cardJSONFile.read();
    cardJSONFile.close();

    // Why do we have to parse this twice? To be honest only God knows lmao
    var jsonParsed = JSON.parse(JSON.parse(cardJSON));

    if (jsonParsed.layout == "normal") {
      proxyNormal(jsonParsed, "normal" + boxtopper, ye, cardName, cardArtist, expansionSymbol, false);
    } else if (jsonParsed.layout == "planeswalker" || jsonParsed.type.indexOf("Planeswalker") > 0) {
      // Planeswalker yo
      proxyPlaneswalker(jsonParsed, cardName, cardArtist, expansionSymbol, ye);
    } else if (jsonParsed.layout == "transform") {
      if (jsonParsed.face == "front") {
        proxyNormal(jsonParsed, "transform-front", ye, cardName, cardArtist, expansionSymbol, true);
      } else if (jsonParsed.face == "back") {
        proxyNormal(jsonParsed, "transform-back", ye, cardName, cardArtist, expansionSymbol, false);
      }
    }
  }
}

function proxyBasic(cardName, cardArtist, ye) {
  $.evalFile(filePath + "/scripts/excessFunctions.jsx");

  templateName = "basic";
  var fileRef = new File(filePath + "/templates/" + templateName + ".psd");
  app.open(fileRef);

  var docRef = app.activeDocument;

  // Place it in the template
  if (ye == 1) app.load(file);
  else app.load(file[0]);
  backFile = app.activeDocument;
  backFile.selection.selectAll();
  backFile.selection.copy();
  backFile.close(SaveOptions.DONOTSAVECHANGES);
  docRef.paste();

  docRef = app.activeDocument;

  // Move art into position
  var artLayerFrameName = "Basic Art Frame";
  var artLayerFrame = docRef.layers.getByName(artLayerFrameName);
  frame(artLayerFrame.bounds[0].as("px"),
    artLayerFrame.bounds[1].as("px"),
    artLayerFrame.bounds[2].as("px"),
    artLayerFrame.bounds[3].as("px"))

  var myLayer = docRef.layers.getByName(cardName);
  myLayer.visible = true;

  myLayer = docRef.layers.getByName("Legal");
  var mySubLayer = myLayer.layers.getByName("Artist");
  mySubLayer.textItem.contents = cardArtist;

  saveImage(cardName + " (" + cardArtist + ")");
}

function proxyPlaneswalker(jsonParsed, cardName, cardArtist, expansionSymbol, ye) {
  // Load in json2.js and some function files
  $.evalFile(filePath + "/scripts/json2.js");
  $.evalFile(filePath + "/scripts/formatText.jsx");
  $.evalFile(filePath + "/scripts/excessFunctions.jsx");
  $.evalFile(filePath + "/scripts/framelogic.jsx");

  var abilities = jsonParsed.text.split("\n");
  var templateName = "pw-3";
  if (abilities.length > 3) templateName = "pw-4";
  if (jsonParsed.layout == "transform") templateName = templateName + "-transform";

  var fileRef = new File(filePath + "/templates/" + templateName + ".psd");
  app.open(fileRef);

  // Create a reference to the active document for convenience
  var docRef = app.activeDocument;
  var myLayer;
  var mySubLayer;

  // Place it in the template
  if (ye == 1) app.load(file);
  else app.load(file[0]);

  backFile = app.activeDocument;
  backFile.selection.selectAll();
  backFile.selection.copy();
  backFile.close(SaveOptions.DONOTSAVECHANGES);
  docRef.paste();

  // Retrieve some more info about the card.
  var typeLine = jsonParsed.type;
  var cardLoyalty = jsonParsed.loyalty;
  var cardText = jsonParsed.text;
  var cardRarity = jsonParsed.rarity;
  var cardManaCost = jsonParsed.manaCost;

  // Create a reference to the active document for convenience
  docRef = app.activeDocument;

  // Select the correct layers
  selectedLayers = selectFrameLayers(typeLine, cardText, cardManaCost);

  // Move art into position
  var artLayerFrameName = "Planeswalker Art Frame";
  if (selectedLayers[4]) artLayerFrameName = "Full Art Frame";
  var artLayerFrame = docRef.layers.getByName(artLayerFrameName);
  frame(artLayerFrame.bounds[0].as("px"),
    artLayerFrame.bounds[1].as("px"),
    artLayerFrame.bounds[2].as("px"),
    artLayerFrame.bounds[3].as("px"))

  // Background
  myLayer = docRef.layers.getByName("Background");
  mySubLayer = myLayer.layers.getByName(selectedLayers[0]);
  mySubLayer.visible = true;

  // Pinlines
  pinlinesGroup = "Pinlines";
  myLayer = docRef.layers.getByName(pinlinesGroup);
  mySubLayer = myLayer.layers.getByName(selectedLayers[1]);
  mySubLayer.visible = true;

  // Twins
  myLayer = docRef.layers.getByName("Name & Title Boxes");
  mySubLayer = myLayer.layers.getByName(selectedLayers[2]);
  mySubLayer.visible = true;

  // Rarity gradient
  myLayer = docRef.layers.getByName("Text and Icons");
  mySubLayer = myLayer.layers.getByName("Expansion Symbol");
  mySubLayer.textItem.contents = expansionSymbol;
  if (cardRarity == "mythic") gradientMythic();
  else if (cardRarity == "rare") gradientRare();
  else if (cardRarity == "uncommon") gradientUncommon();
  else gradientCommon();

  // Insert basic text fields
  replaceText("Artist", cardArtist);
  insertManaCost(cardManaCost);
  insertName(cardName);
  insertTypeline(typeLine);

  // Insert loyalty stuff
  var loyaltyGroup = docRef.layers.getByName("Loyalty Graphics");
  myLayer = loyaltyGroup.layers.getByName("Starting Loyalty");
  mySubLayer = myLayer.layers.getByName("Text");
  mySubLayer.textItem.contents = cardLoyalty;

  groupNames = ["First Ability", "Second Ability", "Third Ability", "Fourth Ability"];
  for (var i = 0; i < abilities.length; i++) {
    // Select the appropriate ability group
    myLayer = loyaltyGroup.layers.getByName(groupNames[i]);
    var colonIndex = abilities[i].indexOf(": ");
    if (colonIndex > 0 && colonIndex < 5) {
      // Loyalty ability, not a static ability
      var loyaltyType = "";
      var loyaltyNumber;
      if (abilities[i].charAt(0) == "+") {
        // Plus abiltiy
        loyaltyNumber = abilities[i].slice(1, colonIndex);
        loyaltyType = "+";
      } else if (abilities[i].charAt(0) == "\u2212" || abilities[i].charAt(0) == "-") {
        // Minus ability
        loyaltyNumber = abilities[i].slice(1, colonIndex);
        loyaltyType = "-";
      } else if (abilities[i].charAt(0) == "0") {
        // Zero ability
        loyaltyNumber = "0";
        loyaltyType = "";
      }
      var abilityText = abilities[i].slice(colonIndex + 2, abilities[i].length);

      // Select the correct layer, paste in the ability
      var abilityTextLayer = myLayer.layers.getByName("Ability Text");
      // abilityTextLayer.textItem.contents = abilityText;
      docRef.activeLayer = abilityTextLayer;
      formatText(abilityText, [], -1, false);

      var loyaltyNumberGroup;
      if (loyaltyType == "") loyaltyNumberGroup = myLayer.layers.getByName("0");
      else loyaltyNumberGroup = myLayer.layers.getByName(loyaltyType);

      loyaltyNumberGroup.visible = true;
      var loyaltyText = loyaltyNumberGroup.layers.getByName("Cost");
      loyaltyText.textItem.contents = loyaltyType + loyaltyNumber;
    } else {
      // Static ability
      var staticTextLayer = myLayer.layers.getByName("Static Text");
      staticTextLayer.visible = true;
      staticTextLayer.textItem.contents = abilities[i];

      docRef.activeLayer = staticTextLayer;
      formatText(abilities[i], [], -1, false);

      var abilityTextLayer = myLayer.layers.getByName("Ability Text");
      abilityTextLayer.visible = false;

      var colonTextLayer = myLayer.layers.getByName("Colon");
      colonTextLayer.visible = false;
    }
  }

  // Drop in scan from Scryfall to help line up text
  var idslct = charIDToTypeID("slct");
  var desc292 = new ActionDescriptor();
  var idnull = charIDToTypeID("null");
  var ref133 = new ActionReference();
  var idLyr = charIDToTypeID("Lyr ");
  ref133.putName(idLyr, "Name & Title Boxes");
  desc292.putReference(idnull, ref133);
  var idMkVs = charIDToTypeID("MkVs");
  desc292.putBoolean(idMkVs, false);
  var idLyrI = charIDToTypeID("LyrI");
  var list39 = new ActionList();
  list39.putInteger(8142);
  desc292.putList(idLyrI, list39);
  executeAction(idslct, desc292, DialogModes.NO);

  var idPlc = charIDToTypeID("Plc ");
  var desc300 = new ActionDescriptor();
  var idIdnt = charIDToTypeID("Idnt");
  desc300.putInteger(idIdnt, 8219);
  var idnull = charIDToTypeID("null");
  desc300.putPath(idnull, new File(filePath + "/scripts/card.jpg"));
  var idLnkd = charIDToTypeID("Lnkd");
  desc300.putBoolean(idLnkd, true);
  var idFTcs = charIDToTypeID("FTcs");
  var idQCSt = charIDToTypeID("QCSt");
  var idQcsa = charIDToTypeID("Qcsa");
  desc300.putEnumerated(idFTcs, idQCSt, idQcsa);
  var idOfst = charIDToTypeID("Ofst");
  var desc301 = new ActionDescriptor();
  var idHrzn = charIDToTypeID("Hrzn");
  var idPxl = charIDToTypeID("#Pxl");
  desc301.putUnitDouble(idHrzn, idPxl, 0.000000);
  var idVrtc = charIDToTypeID("Vrtc");
  var idPxl = charIDToTypeID("#Pxl");
  desc301.putUnitDouble(idVrtc, idPxl, 0.000000);
  var idOfst = charIDToTypeID("Ofst");
  desc300.putObject(idOfst, idOfst, desc301);
  var idWdth = charIDToTypeID("Wdth");
  var idPrc = charIDToTypeID("#Prc");
  desc300.putUnitDouble(idWdth, idPrc, 100.000000);
  var idHght = charIDToTypeID("Hght");
  var idPrc = charIDToTypeID("#Prc");
  desc300.putUnitDouble(idHght, idPrc, 100.000000);
  executeAction(idPlc, desc300, DialogModes.NO);

  var scanLayer = docRef.layers.getByName("card");
  scanLayer.resize(50 * app.activeDocument.width / scanLayer.bounds[0], 50 * app.activeDocument.height / scanLayer.bounds[1], AnchorPosition.MIDDLECENTER);

  // Make the script error so we can finish it off by hand
  exit();
}

function proxyNormal(jsonParsed, templateName, ye, cardName, cardArtist, expansionSymbol, tf_front) {

  // Load in json2.js and some function files
  $.evalFile(filePath + "/scripts/json2.js");
  $.evalFile(filePath + "/scripts/formatText.jsx");
  $.evalFile(filePath + "/scripts/excessFunctions.jsx");
  $.evalFile(filePath + "/scripts/framelogic.jsx");

  var fileRef = new File(filePath + "/templates/" + templateName + ".psd");
  app.open(fileRef);

  // Create a reference to the active document for convenience
  var docRef = app.activeDocument;
  var myLayer;
  var mySubLayer;

  // Place it in the template
  if (ye == 1) app.load(file);
  else app.load(file[0]);

  backFile = app.activeDocument;
  backFile.selection.selectAll();
  backFile.selection.copy();
  backFile.close(SaveOptions.DONOTSAVECHANGES);
  docRef.paste();

  // Retrieve some more info about the card.
  var typeLine = jsonParsed.type;
  var cardPower = jsonParsed.power;
  var cardTough = jsonParsed.toughness;
  var cardText = jsonParsed.text;
  var cardRarity = jsonParsed.rarity;
  var flavourText = jsonParsed.flavourText;
  var cardManaCost = jsonParsed.manaCost;

  // Create a reference to the active document for convenience
  docRef = app.activeDocument;

  // Select the correct layers
  selectedLayers = selectFrameLayers(typeLine, cardText, cardManaCost);

  if (templateName == "transform-back") {
    colourIndicator = String(jsonParsed.color_indicator)
    if (colourIndicator != 'null') {
      // colourIndicator comes out as an array - build a string from it
      colourIndicatorString = colourIndicator;
      if (colourIndicator.length > 1) {
        colourIdentities = ["WU", "UB", "BR", "RG", "GW", "WB", "BG", "GU", "UR", "RW"];
        for (var i = 0; i < colourIdentities.length; i++) {
          if (colourIndicator.indexOf(colourIdentities[i][0]) >= 0 && colourIndicator.indexOf(colourIdentities[i][1]) >= 0) {
            colourIndicatorString = colourIdentities[i];
            break;
          }
        }
      }

      var myLayer = docRef.layers.getByName("Colour Indicator");
      var mySubLayer = myLayer.layers.getByName(colourIndicatorString);
      mySubLayer.visible = true;
      for (var i = 0; i <= 2; i++) {
        selectedLayers[i] = colourIndicatorString;
      }
      selectedLayers[4] = false;
      if (colourIndicator.length > 1) {
        selectedLayers[0] = "Gold";
        selectedLayers[2] = "Gold";
      }

    }
    // TODO: Eldrazi flip card
    // else {
    //   // eldrazi flip card
    //
    // }

  }

  if (templateName.indexOf("transform") >= 0) {
    // Enable the correct double face icon
    myLayer = docRef.layers.getByName("Text and Icons");
    mySubLayer = myLayer.layers.getByName("Transform");
    var transformLayer = mySubLayer.layers.getByName(String(jsonParsed.frame_effect[0]));
    transformLayer.visible = true;
  }

  // Nyx layer
  if (selectedLayers[3]) {
    myLayer = docRef.layers.getByName("Nyx");
    myLayer.layers.getByName(selectedLayers[0]).visible = true;
  }

  // Move art into position
  var artLayerFrameName = "Art Frame";
  if (selectedLayers[4]) artLayerFrameName = "Full Art Frame";
  var artLayerFrame = docRef.layers.getByName(artLayerFrameName);
  frame(artLayerFrame.bounds[0].as("px"),
    artLayerFrame.bounds[1].as("px"),
    artLayerFrame.bounds[2].as("px"),
    artLayerFrame.bounds[3].as("px"))

  // Background
  myLayer = docRef.layers.getByName("Background");
  mySubLayer = myLayer.layers.getByName(selectedLayers[0]);
  mySubLayer.visible = true;

  // Pinlines
  pinlinesGroup = "Pinlines & Textbox";
  if (typeLine.indexOf("Land") >= 0 && jsonParsed.layout == "normal") pinlinesGroup = "Land " + pinlinesGroup;
  myLayer = docRef.layers.getByName(pinlinesGroup);
  mySubLayer = myLayer.layers.getByName(selectedLayers[1]);
  mySubLayer.visible = true;

  // Twins
  myLayer = docRef.layers.getByName("Name & Title Boxes");
  mySubLayer = myLayer.layers.getByName(selectedLayers[2]);
  mySubLayer.visible = true;

  // Legendary crown
  if (typeLine.indexOf("Legendary") >= 0) {
    myLayer = docRef.layers.getByName("Legendary Crown (Credit to barbecue)");
    mySubLayer = myLayer.layers.getByName(selectedLayers[1]);
    mySubLayer.visible = true;
    mySubLayer = myLayer.layers.getByName("Effects");
    mySubLayer.visible = true;
  }

  // PT box
  if (cardPower != null && cardTough != null) {
    myLayer = docRef.layers.getByName("PT Box");
    if (selectedLayers[2] == "Land") selectedLayers[2] = "Eldrazi";
    mySubLayer = myLayer.layers.getByName(selectedLayers[2]);
    mySubLayer.visible = true;
  }

  // Rarity gradient
  myLayer = docRef.layers.getByName("Text and Icons");
  mySubLayer = myLayer.layers.getByName("Expansion Symbol");
  mySubLayer.textItem.contents = expansionSymbol;
  if (cardRarity == "mythic") gradientMythic();
  else if (cardRarity == "rare") gradientRare();
  else if (cardRarity == "uncommon") gradientUncommon();
  else gradientCommon();

  // Insert basic text fields
  replaceText("Artist", cardArtist);
  insertManaCost(cardManaCost);
  insertName(cardName);
  insertTypeline(typeLine);

  // ---------- P / T ----------
  myLayer = docRef.layers.getByName("Text and Icons");
  mySubLayer = myLayer.layers.getByName("Power / Toughness");
  docRef.activeLayer = mySubLayer;
  if (cardPower != null && cardTough != null) {
    docRef.activeLayer.textItem.contents = cardPower + "/" + cardTough;
  } else docRef.activeLayer.visible = false;

  // ---------- Rules Text ----------
  myLayer = docRef.layers.getByName("Text and Icons");
  textLayerName = "Rules Text - Noncreature";
  if (typeLine.indexOf("Creature") >= 0) {
    textLayerName = "Rules Text - Creature";
  }
  if (tf_front && jsonParsed.back_power != null && jsonParsed.back_toughness != null) textLayerName = textLayerName + " Flip";
  var myNewLayer = myLayer.layers.getByName(textLayerName);
  docRef.activeLayer = myNewLayer;
  if (cardText !== undefined) cardText = cardText.replace(/\n/g, "\r");
  else cardText = "";
  docRef.activeLayer.textItem.contents = cardText;

  // ---------- Italics Text ----------
  // Build an array of italics text, starting with identifying any
  // reminder text in the card's text body (anything in brackets).
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
  var flavourIndex = -1;
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

  if (flavourText.length > 1) {
    flavourText = flavourText.replace(/\n/g, "\r");
    italicText.push(flavourText);
    flavourIndex = cardText.length;
  }
  // Jam the rules text and flavour text together
  var completeString = "";
  if (flavourText.length > 0) {
    completeString = cardText + "\r" + flavourText;
  } else {
    completeString = cardText;
  }

  // Maybe centre justify the text box
  var centredText = false;
  if (flavourText.length <= 1 && cardText.length <= 70 && cardText.indexOf("\r") < 0) centredText = true;

  // Insert those mana symbols and italic text
  docRef.activeLayer = myNewLayer;
  formatText(completeString, italicText, flavourIndex, centredText);
  if (centredText) docRef.activeLayer.textItem.justification = Justification.CENTER;

  // Scale the text to fit in the text box
  myLayer = docRef.layers.getByName("Text and Icons");
  var myRefLayer = myLayer.layers.getByName("Textbox Reference");
  var man = new UnitValue(10, "px"); // 10 px tolerance from textbox reference

  var layerHeight = myRefLayer.bounds[3] - myRefLayer.bounds[1] - man.as("cm");

  var scaled = scaleTextToFitBox(myNewLayer, layerHeight);

  verticallyAlignText(textLayerName);

  if (cardPower != null && cardTough != null) verticallyFixText(textLayerName);

  if (tf_front) {
    // ---------- P / T ----------
    myLayer = docRef.layers.getByName("Text and Icons");
    mySubLayer = myLayer.layers.getByName("Flipside Power / Toughness");
    docRef.activeLayer = mySubLayer;
    if (jsonParsed.back_power != null && jsonParsed.back_toughness != null) {
      docRef.activeLayer.textItem.contents = jsonParsed.back_power + "/" + jsonParsed.back_toughness;
    } else docRef.activeLayer.visible = false;
  }
  saveImage(cardName);
}

function insertManaCost(cardManaCost) {
  $.evalFile(filePath + "/scripts/formatText.jsx");
  var docRef = app.activeDocument;
  myManaLayer = docRef.layers.getByName("Text and Icons");
  manaCostLayer = myManaLayer.layers.getByName("Mana Cost");
  if (cardManaCost != "") {
    docRef.activeLayer = manaCostLayer;
    formatText(cardManaCost, [], -1, false);
    docRef.activeLayer.name = "Mana Cost";
  } else manaCostLayer.visible = false;
}

function insertName(cardName) {
  var docRef = app.activeDocument;
  var myLayer = docRef.layers.getByName("Text and Icons");
  var mySubLayer = myLayer.layers.getByName("Card Name");
  docRef.activeLayer = mySubLayer;
  docRef.activeLayer.textItem.contents = cardName;

  // Scale down the name to fit in case it's too long
  mySubLayer = myLayer.layers.getByName("Mana Cost");
  var symbolLeftBound = mySubLayer.bounds[0];

  mySubLayer = myLayer.layers.getByName("Card Name");
  var typelineRightBound = mySubLayer.bounds[2];
  var nameFontSize = mySubLayer.textItem.size;
  while (typelineRightBound > symbolLeftBound - 16) { // minimum 16 px gap
    mySubLayer.textItem.size = new UnitValue(nameFontSize - 1, "px");
    nameFontSize = nameFontSize - 1;
    typelineRightBound = mySubLayer.bounds[2];
  }
}

function insertTypeline(typeLine) {
  var docRef = app.activeDocument;
  myLayer = docRef.layers.getByName("Text and Icons");
  mySubLayer = myLayer.layers.getByName("Typeline");
  docRef.activeLayer = mySubLayer;
  docRef.activeLayer.textItem.contents = typeLine;

  // Scale down the typeline to fit in case it's too long
  mySubLayer = myLayer.layers.getByName("Expansion Symbol");
  var symbolLeftBound = mySubLayer.bounds[0];

  mySubLayer = myLayer.layers.getByName("Typeline");
  var typelineRightBound = mySubLayer.bounds[2];
  var typelineFontSize = mySubLayer.textItem.size;
  while (typelineRightBound > symbolLeftBound) {
    mySubLayer.textItem.size = new UnitValue(typelineFontSize - 1, "px");
    typelineFontSize = typelineFontSize - 1;
    typelineRightBound = mySubLayer.bounds[2];
  }
}

function saveImage(cardName) {
  var docRef = app.activeDocument;
  // ----------Save as PNG in the out folder ----------
  var idsave = charIDToTypeID("save");
  var desc3 = new ActionDescriptor();
  var idAs = charIDToTypeID("As  ");
  var desc4 = new ActionDescriptor();
  var idPGIT = charIDToTypeID("PGIT");
  var idPGIN = charIDToTypeID("PGIN");
  desc4.putEnumerated(idPGIT, idPGIT, idPGIN);
  var idPNGf = charIDToTypeID("PNGf");
  var idPGAd = charIDToTypeID("PGAd");
  desc4.putEnumerated(idPNGf, idPNGf, idPGAd);
  var idPNGF = charIDToTypeID("PNGF");
  desc3.putObject(idAs, idPNGF, desc4);
  var idIn = charIDToTypeID("In  ");
  var filename = filePath + '/out/' + cardName + '.png';
  desc3.putPath(idIn, new File(filename));
  var idCpy = charIDToTypeID("Cpy ");
  desc3.putBoolean(idCpy, true);
  executeAction(idsave, desc3, DialogModes.NO);

  // Close the thing without saving
  docRef.close(SaveOptions.DONOTSAVECHANGES);
}
