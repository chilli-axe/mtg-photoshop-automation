function proxy(file, ye) {

  var filePath = File($.filename).parent.parent.fsName;

  $.evalFile(filePath + "\\scripts\\json2.js");

  // Get the card's name
  var artPath = String(file);

  // Retrieve the card's name from the given filepath
  var reversedPath = artPath.split("").reverse().join("");
  var startIndex = artPath.length - reversedPath.indexOf("/");
  var endIndex = artPath.lastIndexOf(".");
  fullCardName = decodeURI(artPath.slice(startIndex, endIndex));

  // Retrieve the card's name and artist
  var openIndex = fullCardName.lastIndexOf(" (");
  var closeIndex = fullCardName.lastIndexOf(")");
  var cardArtist = fullCardName.slice(openIndex + 2, closeIndex);
  const cardName = fullCardName.slice(0, openIndex);

  // Run Python script to get info from Scryfall
  app.system("python get_card_info.py \"" + cardName + "\"");

  var cardJSONFile = new File(filePath + "\\scripts\\card.json");
  cardJSONFile.open('r');
  var cardJSON = cardJSONFile.read();
  cardJSONFile.close();

  // Why do we have to parse this twice? To be honest only God knows lmao
  var jsonParsed = JSON.parse(JSON.parse(cardJSON));

  if (jsonParsed.layout == "normal") {
    proxyNormal(jsonParsed, "normal", ye, cardName, cardArtist, false);
  }
  else if (jsonParsed.layout == "transform") {
    if (jsonParsed.face == "front") {
      proxyNormal(jsonParsed, "transform-front", ye, cardName, cardArtist, true);
      // TODO: Handle clipping with the back p/t box


    }
  }
}

function proxyNormal(jsonParsed, templateName, ye, cardName, cardArtist, tf_front) {

  // Load in json2.js and some function files
  $.evalFile(filePath + "\\scripts\\json2.js");
  $.evalFile(filePath + "\\scripts\\insertManaAndItaliciseText.jsx");
  $.evalFile(filePath + "\\scripts\\insertManaCost.jsx");
  $.evalFile(filePath + "\\scripts\\excessFunctions.jsx");
  $.evalFile(filePath + "\\scripts\\frame.jsx");

  var fileRef = new File(filePath + "\\templates\\" + templateName + ".psd");
  app.open(fileRef);

  // Create a reference to the active document for convenience
  var docRef = app.activeDocument;

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

  // Move art into position
  if (selectedLayers[4]) positionArtFull(docRef);
  else positionArt(docRef);

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
    mySubLayer = myLayer.layers.getByName(selectedLayers[2]);
    mySubLayer.visible = true;
  }

  // Rarity gradient
  if (cardRarity == "mythic") gradientMythic();
  else if (cardRarity == "rare") gradientRare();
  else if (cardRarity == "uncommon") gradientUncommon();
  else gradientCommon();

  // ---------- Artist ----------
  replaceText("Artist", cardArtist);

  //---------- Card Name ----------
  var myLayer = docRef.layers.getByName("Text and Icons");
  var mySubLayer = myLayer.layers.getByName("Card Name");
  docRef.activeLayer = mySubLayer;
  docRef.activeLayer.textItem.contents = cardName;
  // TODO: Scale down the name to fit in case it's too long

  // ---------- Typeline ----------
  myLayer = docRef.layers.getByName("Text and Icons");
  mySubLayer = myLayer.layers.getByName("Typeline");
  docRef.activeLayer = mySubLayer;
  docRef.activeLayer.textItem.contents = typeLine;

  // Scale down the typeline to fit in case it's too long
  myLayer = docRef.layers.getByName("Text and Icons");
  mySubLayer = myLayer.layers.getByName("Expansion Symbol");
  var symbolLeftBound = mySubLayer.bounds[0];

  mySubLayer = myLayer.layers.getByName("Typeline");
  var typelineRightBound = mySubLayer.bounds[2];
  var typelineFontsize = 59;
  while (typelineRightBound > symbolLeftBound) {
    mySubLayer.textItem.size = new UnitValue(typelineFontsize - 1, "px");
    typelineFontsize = typelineFontsize - 1;
    typelineRightBound = mySubLayer.bounds[2];
  }

  // ---------- P / T ----------
  myLayer = docRef.layers.getByName("Text and Icons");
  mySubLayer = myLayer.layers.getByName("Power / Toughness");
  docRef.activeLayer = mySubLayer;
  if (cardPower != null && cardTough != null) {
    docRef.activeLayer.textItem.contents = cardPower + "/" + cardTough;
  } else docRef.activeLayer.visible = false;

  //---------- Mana Cost ----------
  myManaLayer = docRef.layers.getByName("Text and Icons");
  manaCostLayer = myManaLayer.layers.getByName("Mana Cost");
  if (cardManaCost != "") {
    manaCostLayer.textItem.contents = cardManaCost;
    insertManaCost(cardManaCost);
  } else manaCostLayer.visible = false;

  // ---------- Rules Text ----------
  myLayer = docRef.layers.getByName("Text and Icons");
  textLayerName = "Rules Text - Noncreature";
  if (typeLine.indexOf("Creature") >= 0) {
    textLayerName = "Rules Text - Creature";
  }
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
  insertManaAndItaliciseText(completeString, italicText, flavourIndex, textLayerName, centredText);
  if (centredText) {
    // Here we go boys
    docRef.activeLayer.textItem.justification = Justification.CENTER;
  }

  // Scale the text to fit in the text box
  // Gib reference height
  myLayer = docRef.layers.getByName("Text and Icons");
  var myRefLayer = myLayer.layers.getByName("Textbox Reference");
  var man = new UnitValue(10, "px");

  var layerHeight = myRefLayer.bounds[3] - myRefLayer.bounds[1] - man.as("cm");

  var scaled = scaleTextToFitBoxNew(myNewLayer, layerHeight);

  // exit();

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

  saveImage(docRef, cardName);
}


function saveImage(docRef, cardName) {
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
  var filename = filePath + '\\out\\' + cardName + '.png';
  desc3.putPath(idIn, new File(filename));
  var idCpy = charIDToTypeID("Cpy ");
  desc3.putBoolean(idCpy, true);
  executeAction(idsave, desc3, DialogModes.NO);

  // Close the thing without saving
  docRef.close(SaveOptions.DONOTSAVECHANGES);
}

function selectFrameLayers(typeLine, cardText, cardManaCost) {
  // return in the format: [background, pinlines, twins, ptbox, nyx(bool)?]

  // Build the colour identity
  var colourIdentity = "";

  if (typeLine.indexOf("Land") >= 0) {
    var breaks = cardText.split('\n');
    for (var i = 0; i < breaks.length; i++) {
      if ((breaks[i].indexOf("add") >= 0 || breaks[i].indexOf("Add") >= 0) && breaks[i].indexOf(":") >= 0) {
        if ((breaks[i].indexOf("{W") >= 0 || breaks[i].indexOf("W}") >= 0) && colourIdentity.indexOf("W") < 0) {
          colourIdentity = colourIdentity + "W";
        }
        if ((breaks[i].indexOf("{U") >= 0 || breaks[i].indexOf("U}") >= 0) && colourIdentity.indexOf("U") < 0) {
          colourIdentity = colourIdentity + "U";
        }
        if ((breaks[i].indexOf("{B") >= 0 || breaks[i].indexOf("B}") >= 0) && colourIdentity.indexOf("B") < 0) {
          colourIdentity = colourIdentity + "B";
        }
        if ((breaks[i].indexOf("{R") >= 0 || breaks[i].indexOf("R}") >= 0) && colourIdentity.indexOf("R") < 0) {
          colourIdentity = colourIdentity + "R";
        }
        if ((breaks[i].indexOf("{G") >= 0 || breaks[i].indexOf("G}") >= 0) && colourIdentity.indexOf("G") < 0) {
          colourIdentity = colourIdentity + "G";
        }
        if (breaks[i].indexOf("any") >= 0) {
          colourIdentity = "WUBRG";
          break;
        }
      } else {
        var stringToSearch = breaks[i];
        if (stringToSearch.indexOf("Plains") >= 0) {
          colourIdentity = colourIdentity + "W";
        }
        if (stringToSearch.indexOf("Island") >= 0) {
          colourIdentity = colourIdentity + "U";
        }
        if (stringToSearch.indexOf("Swamp") >= 0) {
          colourIdentity = colourIdentity + "B";
        }
        if (stringToSearch.indexOf("Mountain") >= 0) {
          colourIdentity = colourIdentity + "R";
        }
        if (stringToSearch.indexOf("Forest") >= 0) {
          colourIdentity = colourIdentity + "G";
        }
      }
    }

    if (colourIdentity.length <= 0 || colourIdentity.length == 2) {
      selectedNamebox = "Land";
    } else if (colourIdentity.length == 1) {
      selectedNamebox = colourIdentity;
    } else if (colourIdentity.length > 2) {
      selectedNamebox = "Gold";
    }

  } else {
    var stringToSearch = cardManaCost;

    if (stringToSearch.indexOf("{W") >= 0 || stringToSearch.indexOf("W}") >= 0 || (stringToSearch.indexOf("Plains") >= 0 && typeLine.indexOf("Land") >= 0)) {
      colourIdentity = colourIdentity + "W";
    }
    if (stringToSearch.indexOf("{U") >= 0 || stringToSearch.indexOf("U}") >= 0 || (stringToSearch.indexOf("Island") >= 0 && typeLine.indexOf("Land") >= 0)) {
      colourIdentity = colourIdentity + "U";
    }
    if (stringToSearch.indexOf("{B") >= 0 || stringToSearch.indexOf("B}") >= 0 || (stringToSearch.indexOf("Swamp") >= 0 && typeLine.indexOf("Land") >= 0)) {
      colourIdentity = colourIdentity + "B";
    }
    if (stringToSearch.indexOf("{R") >= 0 || stringToSearch.indexOf("R}") >= 0 || (stringToSearch.indexOf("Mountain") >= 0 && typeLine.indexOf("Land") >= 0)) {
      colourIdentity = colourIdentity + "R";
    }
    if (stringToSearch.indexOf("{G") >= 0 || stringToSearch.indexOf("G}") >= 0 || (stringToSearch.indexOf("Forest") >= 0 && typeLine.indexOf("Land") >= 0)) {
      colourIdentity = colourIdentity + "G";
    }
  }

  // ---------- Card Frame ----------
  // Determine if we have an eldrazi-style card here
  var eldrazi = false;
  if (colourIdentity.length <= 0 && typeLine.indexOf("Artifact") < 0 && typeLine.indexOf("Land") < 0) eldrazi = true;

  // Determine if we have a creature or not.
  var isCreature = false;
  if (typeLine.indexOf("Creature") >= 0) {
    isCreature = true;
  }

  // Nyx man
  var isNyx = false;
  if (typeLine.indexOf("Enchantment") >= 0 && (typeLine.indexOf("Creature") >= 0 || typeLine.indexOf("Artifact") >= 0)) {
    // docRef.layers.getByName("Nyx").visible = true;
    isNyx = true;
  }

  if (eldrazi) return ["Eldrazi", "Eldrazi", "Eldrazi", isNyx, eldrazi];

  // Set the background.
  var selectedBackground = "";

  // Check what's on our typeline.
  if (typeLine.indexOf("Artifact") >= 0) {
    selectedBackground = "Artifact";
  } else if (typeLine.indexOf("Land") >= 0) {
    selectedBackground = "Land";
    if (cardText.indexOf(" any ") >= 0) {
      colourIdentity = "WUBRG";
    }
  } else if (colourIdentity.length >= 2) {
    selectedBackground = "Gold";
  } else {
    selectedBackground = colourIdentity;
  }
  if (eldrazi) selectedBackground = "Art Border";

  // Select the correct pinlines.
  var selectedPinlines = "Gold";
  if (colourIdentity.length == 1) {
    selectedPinlines = colourIdentity;
  } else if (colourIdentity.length <= 0) {
    if (typeLine.indexOf("Land") >= 0) selectedPinlines = "Land";
    else selectedPinlines = "Artifact";
  } else if (colourIdentity.length == 2) {
    if (colourIdentity == "WU" || colourIdentity == "UW") {
      selectedPinlines = "WU";
    } else if (colourIdentity == "UB" || colourIdentity == "BU") {
      selectedPinlines = "UB";
    } else if (colourIdentity == "BR" || colourIdentity == "RB") {
      selectedPinlines = "BR";
    } else if (colourIdentity == "RG" || colourIdentity == "GR") {
      selectedPinlines = "RG";
    } else if (colourIdentity == "GW" || colourIdentity == "WG") {
      selectedPinlines = "GW";
    } else if (colourIdentity == "WB" || colourIdentity == "BW") {
      selectedPinlines = "WB";
    } else if (colourIdentity == "BG" || colourIdentity == "GB") {
      selectedPinlines = "BG";
    } else if (colourIdentity == "GU" || colourIdentity == "UG") {
      selectedPinlines = "GU";
    } else if (colourIdentity == "UR" || colourIdentity == "RU") {
      selectedPinlines = "UR";
    } else if (colourIdentity == "RW" || colourIdentity == "WR") {
      selectedPinlines = "RW";
    }
  } else if (colourIdentity.length > 2) {
    selectedPinlines = "Gold";
  }
  if (eldrazi) selectedPinlines = "Artifact";

  var pinlinesName = "Pinlines & Text Box";

  // Select the correct name box and P/T box.
  var selectedNamebox = "";

  var manaAdded = "";
  if (typeLine.indexOf("Land") >= 0) {
    var breaks = cardText.split('\n');
    for (var i = 0; i < breaks.length; i++) {
      if ((breaks[i].indexOf("add") >= 0 || breaks[i].indexOf("Add") >= 0) && breaks[i].indexOf(":") >= 0) {
        if ((breaks[i].indexOf("{W") >= 0 || breaks[i].indexOf("W}") >= 0) && manaAdded.indexOf("W") < 0) {
          manaAdded = manaAdded + "W";
        }
        if ((breaks[i].indexOf("{U") >= 0 || breaks[i].indexOf("U}") >= 0) && manaAdded.indexOf("U") < 0) {
          manaAdded = manaAdded + "U";
        }
        if ((breaks[i].indexOf("{B") >= 0 || breaks[i].indexOf("B}") >= 0) && manaAdded.indexOf("B") < 0) {
          manaAdded = manaAdded + "B";
        }
        if ((breaks[i].indexOf("{R") >= 0 || breaks[i].indexOf("R}") >= 0) && manaAdded.indexOf("R") < 0) {
          manaAdded = manaAdded + "R";
        }
        if ((breaks[i].indexOf("{G") >= 0 || breaks[i].indexOf("G}") >= 0) && manaAdded.indexOf("G") < 0) {
          manaAdded = manaAdded + "G";
        }
        if (breaks[i].indexOf("any") >= 0) {
          manaAdded = "WUBRG";
          break;
        }
      }
    }
  }

  if (typeLine.indexOf("Land") >= 0) {
    // no colour case
    if (manaAdded.length <= 0 || manaAdded.length == 2) {
      selectedNamebox = "Land";
    } else if (manaAdded.length == 1) {
      selectedNamebox = manaAdded;
    } else if (manaAdded.length == 5) {
      selectedNamebox = "Gold";
    }
  } else if (colourIdentity.length == 0) {
    selectedNamebox = "Artifact";
  } else if (colourIdentity.length == 1) {
    selectedNamebox = colourIdentity;
  } else if (colourIdentity.length >= 2) {
    selectedNamebox = "Gold";
  }

  return [selectedBackground, selectedPinlines, selectedNamebox, isNyx, eldrazi];
}
