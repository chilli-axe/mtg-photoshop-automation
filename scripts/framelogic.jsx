function selectFrameLayers(typeLine, cardText, cardManaCost) {
  // TODO: Rewrite this from the ground up because good lord it's awful 

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
        var stringToSearch = breaks[i] + " " + typeLine;
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
  if (selectedNamebox == "") selectedNamebox = "Gold";

  // Check for a hybrid frame
  const splitSymbols = cardManaCost.split("}");
  var colouredSymbols = 0;
  var hybridSymbols = 0;
  for (i = 0; i < splitSymbols.length; i++) {
    if (splitSymbols[i].indexOf("W") > 0 || splitSymbols[i].indexOf("U") > 0 || splitSymbols[i].indexOf("B") > 0 || splitSymbols[i].indexOf("R") > 0 || splitSymbols[i].indexOf("G") > 0) {
      colouredSymbols++;
      if (splitSymbols[i].indexOf("/") > 0) {
        hybridSymbols++;
      }
    }
  }
  if (hybridSymbols == colouredSymbols && hybridSymbols > 0 && cardManaCost.indexOf("/P}") < 0) {
    // card is hybrid, adjust the output accordingly
    selectedBackground = selectedPinlines;
    selectedNamebox = "Land";
  }

  return [selectedBackground, selectedPinlines, selectedNamebox, isNyx, eldrazi];
}
