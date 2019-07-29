function insertManaCost(inputString, blackColour) {

  const selectedFont = "NDPMTG";
  const manaFontSize = 80.000

  var rgbC = [204, 194, 193];
  var rgbW = [255, 251, 214];
  var rgbU = [170, 224, 250];
  var rgbB = [159, 146, 143];
  var rgbR = [249, 169, 143];
  var rgbG = [154, 211, 175];

  var phyrexianCard = false;
  var phyrexianColour = rgbG;

  const symbols = {
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
    "{2/G}": "QqWV"
  };
  var symbolIndices = [];

  for (var symbol in symbols) {
    for (var q = 0; q < 50; q++) {
      var indexOfThing = inputString.indexOf(symbol);
      if (indexOfThing >= 0) {
        inputString = inputString.replace(symbol, symbols[symbol]);
        // Check for phyrexian mana
        if (symbol.indexOf("/P}" >= 0)) {
          phyrexianCard = true;
          if (symbol == "{W/P}") phyrexianColour = rgbW;
          else if (symbol == "{U/P}") phyrexianColour = rgbU;
          else if (symbol == "{B/P}") phyrexianColour = rgbB;
          else if (symbol == "{R/P}") phyrexianColour = rgbR;
          else if (symbol == "{G/P}") phyrexianColour = rgbG;
        }

        for (var l = 0; l < symbolIndices.length; l++) {
          if (symbolIndices[l] > indexOfThing) {
            symbolIndices[l] = symbolIndices[l] - (symbol.length - symbols[symbol].length);
          }
        }
        symbolIndices.push(indexOfThing);
      }
    }
  }

  symbolIndices = symbolIndices.sort(function(a, b) {
    return a - b;
  });

  // =======================================================
  // Select the Mana Cost layer
  var idslct = charIDToTypeID("slct");
  var desc328 = new ActionDescriptor();
  var idnull = charIDToTypeID("null");
  var ref43 = new ActionReference();
  var idLyr = charIDToTypeID("Lyr ");
  ref43.putName(idLyr, "Mana Cost");
  desc328.putReference(idnull, ref43);
  var idMkVs = charIDToTypeID("MkVs");
  desc328.putBoolean(idMkVs, false);
  executeAction(idslct, desc328, DialogModes.NO);

  // Prepare some things to allow us to edit the layer
  var idsetd = charIDToTypeID("setd");
  var desc329 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref44 = new ActionReference();
  var idTxLr = charIDToTypeID("TxLr");
  var idOrdn = charIDToTypeID("Ordn");
  var idTrgt = charIDToTypeID("Trgt");
  ref44.putEnumerated(idTxLr, idOrdn, idTrgt);
  desc329.putReference(idnull, ref44);
  var idT = charIDToTypeID("T   ");
  var desc330 = new ActionDescriptor();
  var idTxt = charIDToTypeID("Txt ");
  desc330.putString(idTxt, inputString);

  var currentLayerReference = new ActionDescriptor();
  var originIndex = 0;
  var list31 = new ActionList();

  for (var i = 0; i < symbolIndices.length; i++) {

    if (inputString.slice(symbolIndices[i] + 1, symbolIndices[i] + 2) == "q") {
      // Hybrid mana
      // Symbol 1
      var rgbValue1 = rgbC;
      if (inputString.slice(symbolIndices[i] + 2, symbolIndices[i] + 3) == "L") {
        rgbValue1 = rgbW;
      } else if (inputString.slice(symbolIndices[i] + 2, symbolIndices[i] + 3) == "M") {
        rgbValue1 = rgbU;
      } else if (inputString.slice(symbolIndices[i] + 2, symbolIndices[i] + 3) == "N") {
        rgbValue1 = rgbC;
      } else if (inputString.slice(symbolIndices[i] + 2, symbolIndices[i] + 3) == "O") {
        rgbValue1 = rgbR;
      } else if (inputString.slice(symbolIndices[i] + 2, symbolIndices[i] + 3) == "P") {
        rgbValue1 = rgbG;
      }

      // Symbol 2
      var rgbValue2 = rgbC;
      if (inputString.slice(symbolIndices[i] + 3, symbolIndices[i] + 4) == "R") {
        rgbValue2 = rgbW;
      } else if (inputString.slice(symbolIndices[i] + 3, symbolIndices[i] + 4) == "S") {
        rgbValue2 = rgbU;
      } else if (inputString.slice(symbolIndices[i] + 3, symbolIndices[i] + 4) == "T") {
        rgbValue2 = rgbC;
      } else if (inputString.slice(symbolIndices[i] + 3, symbolIndices[i] + 4) == "U") {
        rgbValue2 = rgbR;
      } else if (inputString.slice(symbolIndices[i] + 3, symbolIndices[i] + 4) == "V") {
        rgbValue2 = rgbG;
      }

      // Character 1
      var desc712 = new ActionDescriptor();
      var idFrom = charIDToTypeID("From");
      desc712.putInteger(idFrom, symbolIndices[i]);
      var idT = charIDToTypeID("T   ");
      desc712.putInteger(idT, symbolIndices[i] + 1);
      var idTxtS = charIDToTypeID("TxtS");
      var desc713 = new ActionDescriptor();
      var idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
      desc713.putString(idfontPostScriptName, selectedFont);
      var idFntN = charIDToTypeID("FntN");
      desc713.putString(idFntN, selectedFont);
      var idSz = charIDToTypeID("Sz  ");
      idPnt = charIDToTypeID("#Pnt");
      desc713.putUnitDouble(idSz, idPnt, manaFontSize);
      var idClr = charIDToTypeID("Clr ");
      var desc714 = new ActionDescriptor();
      var idRd = charIDToTypeID("Rd  ");
      desc714.putDouble(idRd, rgbValue2[0]);
      var idGrn = charIDToTypeID("Grn ");
      desc714.putDouble(idGrn, rgbValue2[1]);
      var idBl = charIDToTypeID("Bl  ");
      desc714.putDouble(idBl, rgbValue2[2]);
      var idRGBC = charIDToTypeID("RGBC");
      desc713.putObject(idClr, idRGBC, desc714);
      var idTxtS = charIDToTypeID("TxtS");
      desc712.putObject(idTxtS, idTxtS, desc713);

      // Character 2
      var idTxtt = charIDToTypeID("Txtt");
      list31.putObject(idTxtt, desc712);
      var desc716 = new ActionDescriptor();
      var idFrom = charIDToTypeID("From");
      desc716.putInteger(idFrom, symbolIndices[i] + 1);
      var idT = charIDToTypeID("T   ");
      desc716.putInteger(idT, symbolIndices[i] + 2);
      var idTxtS = charIDToTypeID("TxtS");
      var desc717 = new ActionDescriptor();
      var idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
      desc717.putString(idfontPostScriptName, selectedFont);
      var idFntN = charIDToTypeID("FntN");
      desc717.putString(idFntN, selectedFont);
      var idSz = charIDToTypeID("Sz  ");
      idPnt = charIDToTypeID("#Pnt");
      desc717.putUnitDouble(idSz, idPnt, manaFontSize);
      var idClr = charIDToTypeID("Clr ");
      var desc718 = new ActionDescriptor();
      var idRd = charIDToTypeID("Rd  ");
      desc718.putDouble(idRd, rgbValue1[0]);
      var idGrn = charIDToTypeID("Grn ");
      desc718.putDouble(idGrn, rgbValue1[1]);
      var idBl = charIDToTypeID("Bl  ");
      desc718.putDouble(idBl, rgbValue1[2]);
      var idRGBC = charIDToTypeID("RGBC");
      desc717.putObject(idClr, idRGBC, desc718);
      var idTxtS = charIDToTypeID("TxtS");
      desc716.putObject(idTxtS, idTxtS, desc717);

      // Character 3
      var idTxtt = charIDToTypeID("Txtt");
      list31.putObject(idTxtt, desc716);
      var desc720 = new ActionDescriptor();
      var idFrom = charIDToTypeID("From");
      desc720.putInteger(idFrom, symbolIndices[i] + 2);
      var idT = charIDToTypeID("T   ");
      desc720.putInteger(idT, symbolIndices[i] + 3);
      var idTxtS = charIDToTypeID("TxtS");
      var desc721 = new ActionDescriptor();
      var idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
      desc721.putString(idfontPostScriptName, selectedFont);
      var idFntN = charIDToTypeID("FntN");
      desc721.putString(idFntN, selectedFont);
      var idSz = charIDToTypeID("Sz  ");
      idPnt = charIDToTypeID("#Pnt");
      desc721.putUnitDouble(idSz, idPnt, manaFontSize);
      var idClr = charIDToTypeID("Clr ");
      var desc722 = new ActionDescriptor();
      var idRd = charIDToTypeID("Rd  ");
      desc722.putDouble(idRd, 0.000);
      var idGrn = charIDToTypeID("Grn ");
      desc722.putDouble(idGrn, 0.000);
      var idBl = charIDToTypeID("Bl  ");
      desc722.putDouble(idBl, 0.000);
      var idRGBC = charIDToTypeID("RGBC");
      desc721.putObject(idClr, idRGBC, desc722);
      var idTxtS = charIDToTypeID("TxtS");
      desc720.putObject(idTxtS, idTxtS, desc721);

      // Character 4
      var idTxtt = charIDToTypeID("Txtt");
      list31.putObject(idTxtt, desc720);
      var desc343 = new ActionDescriptor();
      var idFrom = charIDToTypeID("From");
      desc343.putInteger(idFrom, symbolIndices[i] + 3);
      var idT = charIDToTypeID("T   ");
      desc343.putInteger(idT, symbolIndices[i] + 4);
      var idTxtS = charIDToTypeID("TxtS");
      var desc344 = new ActionDescriptor();
      var idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
      desc344.putString(idfontPostScriptName, selectedFont);
      var idFntN = charIDToTypeID("FntN");
      desc344.putString(idFntN, selectedFont);
      var idSz = charIDToTypeID("Sz  ");
      idPnt = charIDToTypeID("#Pnt");
      desc344.putUnitDouble(idSz, idPnt, manaFontSize);
      var idClr = charIDToTypeID("Clr ");
      var desc726 = new ActionDescriptor();
      var idRd = charIDToTypeID("Rd  ");
      desc726.putDouble(idRd, 0.000000);
      var idGrn = charIDToTypeID("Grn ");
      desc726.putDouble(idGrn, 0.000000);
      var idBl = charIDToTypeID("Bl  ");
      desc726.putDouble(idBl, 0.000000);
      var idRGBC = charIDToTypeID("RGBC");
      desc344.putObject(idClr, idRGBC, desc726);
      var idTxtS = charIDToTypeID("TxtS");
      var idTxtS = charIDToTypeID("TxtS");
      desc343.putObject(idTxtS, idTxtS, desc344);
      currentLayerReference = desc343;

    } else {
      // Normal style of mana symbol
      // Colour of current symbol
      var rgbValue = rgbC;
      if (inputString.slice(symbolIndices[i] + 1, symbolIndices[i] + 2) == "w") {
        rgbValue = rgbW;
      } else if (inputString.slice(symbolIndices[i] + 1, symbolIndices[i] + 2) == "u") {
        rgbValue = rgbU;
      } else if (inputString.slice(symbolIndices[i] + 1, symbolIndices[i] + 2) == "b") {
        rgbValue = rgbC;
      } else if (inputString.slice(symbolIndices[i] + 1, symbolIndices[i] + 2) == "r") {
        rgbValue = rgbR;
      } else if (inputString.slice(symbolIndices[i] + 1, symbolIndices[i] + 2) == "g") {
        rgbValue = rgbG;
      }

      // Handle phyrexian colours
      if (inputString.slice(symbolIndices[i], symbolIndices[i] + 2) == "Qp" && phyrexianCard) rgbValue = phyrexianColour;

      // Character 1
      var desc339 = new ActionDescriptor();
      var idFrom = charIDToTypeID("From");
      desc339.putInteger(idFrom, symbolIndices[i]);
      var idT = charIDToTypeID("T   ");
      desc339.putInteger(idT, symbolIndices[i] + 1);
      var idTxtS = charIDToTypeID("TxtS");
      var desc340 = new ActionDescriptor();
      var idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
      desc340.putString(idfontPostScriptName, selectedFont);
      var idFntN = charIDToTypeID("FntN");
      desc340.putString(idFntN, selectedFont);
      var idSz = charIDToTypeID("Sz  ");
      idPnt = charIDToTypeID("#Pnt");
      desc340.putUnitDouble(idSz, idPnt, manaFontSize);
      var idClr = charIDToTypeID("Clr ");
      var desc341 = new ActionDescriptor();
      var idRd = charIDToTypeID("Rd  ");
      desc341.putDouble(idRd, rgbValue[0]);
      var idGrn = charIDToTypeID("Grn ");
      desc341.putDouble(idGrn, rgbValue[1]);
      var idBl = charIDToTypeID("Bl  ");
      desc341.putDouble(idBl, rgbValue[2]);
      var idRGBC = charIDToTypeID("RGBC");
      desc340.putObject(idClr, idRGBC, desc341);
      var idTxtS = charIDToTypeID("TxtS");
      desc339.putObject(idTxtS, idTxtS, desc340);

      // Character 2
      var idTxtt = charIDToTypeID("Txtt");
      list31.putObject(idTxtt, desc339);
      var desc343 = new ActionDescriptor();
      var idFrom = charIDToTypeID("From");
      desc343.putInteger(idFrom, symbolIndices[i] + 1);
      var idT = charIDToTypeID("T   ");
      desc343.putInteger(idT, symbolIndices[i] + 2);
      var idTxtS = charIDToTypeID("TxtS");
      var desc344 = new ActionDescriptor();
      var idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
      desc344.putString(idfontPostScriptName, selectedFont);
      var idFntN = charIDToTypeID("FntN");
      desc344.putString(idFntN, selectedFont);
      var idSz = charIDToTypeID("Sz  ");
      idPnt = charIDToTypeID("#Pnt");
      desc344.putUnitDouble(idSz, idPnt, manaFontSize);
      var idClr = charIDToTypeID("Clr ");
      var desc345 = new ActionDescriptor();
      var idRd = charIDToTypeID("Rd  ");
      desc345.putDouble(idRd, 0.000000);
      var idGrn = charIDToTypeID("Grn ");
      desc345.putDouble(idGrn, 0.000000);
      var idBl = charIDToTypeID("Bl  ");
      desc345.putDouble(idBl, 0.000000);
      var idRGBC = charIDToTypeID("RGBC");
      desc344.putObject(idClr, idRGBC, desc345);
      var idTxtS = charIDToTypeID("TxtS");
      desc343.putObject(idTxtS, idTxtS, desc344);
      currentLayerReference = desc343;
    }
    var idTxtt = charIDToTypeID("Txtt");
    list31.putObject(idTxtt, currentLayerReference);
  }

  // Finalise and push to layer
  desc330.putList(idTxtt, list31);
  var idTxLr = charIDToTypeID("TxLr");
  desc329.putObject(idT, idTxLr, desc330);
  executeAction(idsetd, desc329, DialogModes.NO);
}
