function formatText(inputString, italicStrings, flavourIndex, centredText) {
  // Make sure to select the layer you want to insert mana symbols into before
  // running this function
  try {
    var rgbTextColour = app.activeDocument.activeLayer.textItem.color.rgb;
    var textColour = [];
    textColour[0] = rgbTextColour.red;
    textColour[1] = rgbTextColour.green;
    textColour[2] = rgbTextColour.blue;
  } catch (err) {
    var textColour = [];
    textColour[0] = 0;
    textColour[1] = 0;
    textColour[2] = 0;
  }

  const selectedFont = "NDPMTG";
  const primaryFont = "MPlantin";

  var rgbC = [204, 194, 193];
  var rgbW = [255, 251, 214];
  var rgbU = [170, 224, 250];
  var rgbB = [159, 146, 143];
  var rgbR = [249, 169, 143];
  var rgbG = [154, 211, 175];

  var phyrexianCard = false;
  var phyrexianColour = rgbG;

  // Find and replace the mana symbols in {} in the string with their NDPMTG
  // equivalents, and note their indices and stuff

  // Dictionary of symbols as they appear in oracle text, and their
  // corresponding symbols to look correct in NDPMTG font
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
    "{2/G}": "QqWV",
    "{S}": "omn",
    "{Q}": "ol"
  };

  if (flavourIndex > 0) {
    var quoteIndex = inputString.indexOf("\r", flavourIndex + 3);
  }

  var startIndex = [];
  var endIndex = [];
  // Get the start and end indices of each given string
  for (var i = 0; i < italicStrings.length; i++) {
    var currentStartIndex = inputString.indexOf(italicStrings[i]);
    if (currentStartIndex >= 0) {
      startIndex.push(currentStartIndex);
      endIndex.push(currentStartIndex + italicStrings[i].length);
    }
  }
  startIndex = startIndex.sort(function(a, b) {
    return a - b;
  });
  endIndex = endIndex.sort(function(a, b) {
    return a - b;
  });

  // Offset each instance of flavour text by how many mana symbols appear before it
  // Replacing mana symbols before detecting flavour text doesn't seem to work
  for (i = 0; i < startIndex.length; i++) {
    // Start indices
    var tempString = inputString.slice(0, startIndex[i]);
    var numLines = 0;

    for (var symbol in symbols) {
      var numOccurrences = occurrences(tempString, symbol, false);
      numLines += numOccurrences * (symbol.length - symbols[symbol].length);
    }

    if (startIndex[i] - (numLines) >= 0) {
      startIndex[i] = startIndex[i] - numLines;
    } else {
      startIndex[i] = 0;
    }

    // End indices
    tempString = inputString.slice(0, endIndex[i]);
    numLines = 0;

    for (symbol in symbols) {
      var numOccurrences = occurrences(tempString, symbol, false);
      numLines += numOccurrences * (symbol.length - symbols[symbol].length);
    }

    if (endIndex[i] - (numLines) >= 0) {
      endIndex[i] = endIndex[i] - numLines;
    } else {
      endIndex[i] = 0;
    }
  }

  var symbolIndices = [];
  var currentMinimum = 0;
  var startingIndex = 0;

  // Find all instances of mana symbols in the text and replace them
  while (true) {
    var braceIndex1 = inputString.indexOf("{", startingIndex);
    var braceIndex2 = inputString.indexOf("}", startingIndex);
    if (braceIndex1 < 0) {
      break;
    } else {
      var currentSymbol = inputString.slice(braceIndex1, braceIndex2 + 1);

      // Check if phyrexian real quick
      if (currentSymbol.indexOf("/P}") >= 0) {
        phyrexianCard = true;
        if (currentSymbol == "{W/P}") phyrexianColour = rgbW;
        else if (currentSymbol == "{U/P}") phyrexianColour = rgbU;
        else if (currentSymbol == "{B/P}") phyrexianColour = rgbB;
        else if (currentSymbol == "{R/P}") phyrexianColour = rgbR;
        else if (currentSymbol == "{G/P}") phyrexianColour = rgbG;
      }

      for (symbol in symbols) {
        if (currentSymbol.valueOf() == symbol.valueOf()) {
          inputString = inputString.replace(symbol, symbols[symbol]);
          symbolIndices.push(braceIndex1);
          startingIndex = braceIndex1 + 1;
        }
      }
    }
  }

  function arrayIndexOf(inputArray, reqValue, startingIndex) {
    var index = -1;
    startingIndex = typeof startingIndex !== 'undefined' ? startingIndex : 0;
    for (var i = startingIndex; i < inputArray.length; i++) {
      if (inputArray[i] == reqValue) {
        index = inputArray[i];
        break;
      }
    }
    return index;
  }

  function occurrences(string, substring, allowOverlapping) {
    string += "";
    substring += "";
    if (substring.length <= 0) return (string.length + 1);
    var n = 0,
      pos = 0,
      step = allowOverlapping ? 1 : substring.length;

    while (true) {
      pos = string.indexOf(substring, pos);
      if (pos >= 0) {
        ++n;
        pos += step;
      } else break;
    }
    return n;
  }

  var myFontSize = app.activeDocument.activeLayer.textItem.size;

  // Prepare action descriptor and reference variables
  var desc119 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref101 = new ActionReference();
  var idTxLr = charIDToTypeID("TxLr");
  var idOrdn = charIDToTypeID("Ordn");
  var idTrgt = charIDToTypeID("Trgt");
  ref101.putEnumerated(idTxLr, idOrdn, idTrgt);
  desc119.putReference(idnull, ref101);
  var desc120 = new ActionDescriptor();
  var idTxt = charIDToTypeID("Txt ");
  desc120.putString(idTxt, inputString);

  var list12 = new ActionList();
  desc25 = new ActionDescriptor();
  var idFrom = charIDToTypeID("From");
  desc25.putInteger(idFrom, 0);
  var idT = charIDToTypeID("T   ");
  desc25.putInteger(idT, inputString.length);
  var idTxtS = charIDToTypeID("TxtS");
  desc26 = new ActionDescriptor();
  var idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
  desc26.putString(idfontPostScriptName, primaryFont);
  var idFntN = charIDToTypeID("FntN");
  desc26.putString(idFntN, primaryFont);
  var idSz = charIDToTypeID("Sz  ");
  var idPnt = charIDToTypeID("#Pnt");
  desc26.putUnitDouble(idSz, idPnt, myFontSize);
  var idHrzS = charIDToTypeID("HrzS");
  var idautoLeading = stringIDToTypeID("autoLeading");
  desc26.putBoolean(idautoLeading, false);
  var idLdng = charIDToTypeID("Ldng");
  idPnt = charIDToTypeID("#Pnt");
  desc26.putUnitDouble(idLdng, idPnt, myFontSize);
  var idClr = charIDToTypeID("Clr ");
  desc27 = new ActionDescriptor();
  var idRd = charIDToTypeID("Rd  ");
  desc27.putDouble(idRd, textColour[0]);
  var idGrn = charIDToTypeID("Grn ");
  desc27.putDouble(idGrn, textColour[1]);
  var idBl = charIDToTypeID("Bl  ");
  desc27.putDouble(idBl, textColour[2]);
  var idRGBC = charIDToTypeID("RGBC");
  desc26.putObject(idClr, idRGBC, desc27);
  idTxtS = charIDToTypeID("TxtS");
  desc25.putObject(idTxtS, idTxtS, desc26);
  var currentLayerReference = desc25;

  if (startIndex.length > 0) {
    for (i = 0; i < startIndex.length; i++) {
      // Italics text
      var idTxtt = charIDToTypeID("Txtt");
      list12.putObject(idTxtt, currentLayerReference);
      desc125 = new ActionDescriptor();
      idFrom = charIDToTypeID("From");
      desc125.putInteger(idFrom, startIndex[i]);
      idT = charIDToTypeID("T   ");
      desc125.putInteger(idT, endIndex[i]);
      idTxtS = charIDToTypeID("TxtS");
      desc126 = new ActionDescriptor();
      var idstyleSheetHasParent = stringIDToTypeID("styleSheetHasParent");
      desc126.putBoolean(idstyleSheetHasParent, true);
      idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
      desc126.putString(idfontPostScriptName, "MPlantin-Italic");
      idFntN = charIDToTypeID("FntN");
      desc126.putString(idFntN, "MPlantin-Italic");
      var idFntS = charIDToTypeID("FntS");
      idSz = charIDToTypeID("Sz  ");
      idPnt = charIDToTypeID("#Pnt");
      desc126.putUnitDouble(idSz, idPnt, myFontSize);
      idautoLeading = stringIDToTypeID("autoLeading");
      desc126.putBoolean(idautoLeading, false);
      idLdng = charIDToTypeID("Ldng");
      idPnt = charIDToTypeID("#Pnt");
      desc126.putUnitDouble(idLdng, idPnt, myFontSize);
      idClr = charIDToTypeID("Clr ");
      desc127 = new ActionDescriptor();
      idRd = charIDToTypeID("Rd  ");
      desc127.putDouble(idRd, textColour[0]);
      idGrn = charIDToTypeID("Grn ");
      desc127.putDouble(idGrn, textColour[1]);
      idBl = charIDToTypeID("Bl  ");
      desc127.putDouble(idBl, textColour[2]);
      idRGBC = charIDToTypeID("RGBC");
      desc126.putObject(idClr, idRGBC, desc127);
      idTxtS = charIDToTypeID("TxtS");
      desc125.putObject(idTxtS, idTxtS, desc126);
      currentLayerReference = desc125;
    }
  }

  // Format each symbol correctly
  if (symbolIndices.length > 0) {
    for (i = 0; i < symbolIndices.length; i++) {

      // Determine what sort of symbol it is, then handle it accordingly
      if (inputString.slice(symbolIndices[i], symbolIndices[i] + 1) == "e") {
        // Energy symbol
        // =======================================================
        var idTxtt = charIDToTypeID("Txtt");
        list12.putObject(idTxtt, currentLayerReference);
        desc129 = new ActionDescriptor();
        idFrom = charIDToTypeID("From");
        desc129.putInteger(idFrom, symbolIndices[i]);
        idT = charIDToTypeID("T   ");
        desc129.putInteger(idT, symbolIndices[i] + 1);
        idTxtS = charIDToTypeID("TxtS");
        desc130 = new ActionDescriptor();
        idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
        desc130.putString(idfontPostScriptName, selectedFont);
        idSz = charIDToTypeID("Sz  ");
        idPnt = charIDToTypeID("#Pnt");
        desc130.putUnitDouble(idSz, idPnt, myFontSize);
        idautoLeading = stringIDToTypeID("autoLeading");
        desc130.putBoolean(idautoLeading, false);
        idLdng = charIDToTypeID("Ldng");
        idPnt = charIDToTypeID("#Pnt");
        desc130.putUnitDouble(idLdng, idPnt, myFontSize);
        idTxtS = charIDToTypeID("TxtS");
        desc129.putObject(idTxtS, idTxtS, desc130);
        currentLayerReference = desc129;

      } else if (inputString.slice(symbolIndices[i] + 1, symbolIndices[i] + 2) == "q") {
        // Hybrid mana
        // Symbol 1 colour
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

        // Symbol 2 colour
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
        idTxtt = charIDToTypeID("Txtt");
        list12.putObject(idTxtt, currentLayerReference);
        var desc712 = new ActionDescriptor();
        idFrom = charIDToTypeID("From");
        desc712.putInteger(idFrom, symbolIndices[i]);
        idT = charIDToTypeID("T   ");
        desc712.putInteger(idT, symbolIndices[i] + 1);
        idTxtS = charIDToTypeID("TxtS");
        var desc713 = new ActionDescriptor();
        idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
        desc713.putString(idfontPostScriptName, selectedFont);
        idFntN = charIDToTypeID("FntN");
        desc713.putString(idFntN, selectedFont);
        idSz = charIDToTypeID("Sz  ");
        idPnt = charIDToTypeID("#Pnt");
        desc713.putUnitDouble(idSz, idPnt, myFontSize);
        idautoLeading = stringIDToTypeID("autoLeading");
        desc713.putBoolean(idautoLeading, false);
        idLdng = charIDToTypeID("Ldng");
        idPnt = charIDToTypeID("#Pnt");
        desc713.putUnitDouble(idLdng, idPnt, myFontSize);
        idClr = charIDToTypeID("Clr ");
        var desc714 = new ActionDescriptor();
        idRd = charIDToTypeID("Rd  ");
        desc714.putDouble(idRd, rgbValue2[0]);
        idGrn = charIDToTypeID("Grn ");
        desc714.putDouble(idGrn, rgbValue2[1]);
        idBl = charIDToTypeID("Bl  ");
        desc714.putDouble(idBl, rgbValue2[2]);
        idRGBC = charIDToTypeID("RGBC");
        desc713.putObject(idClr, idRGBC, desc714);
        idTxtS = charIDToTypeID("TxtS");
        desc712.putObject(idTxtS, idTxtS, desc713);

        // Character 2
        idTxtt = charIDToTypeID("Txtt");
        list12.putObject(idTxtt, desc712);
        var desc716 = new ActionDescriptor();
        idFrom = charIDToTypeID("From");
        desc716.putInteger(idFrom, symbolIndices[i] + 1);
        idT = charIDToTypeID("T   ");
        desc716.putInteger(idT, symbolIndices[i] + 2);
        idTxtS = charIDToTypeID("TxtS");
        var desc717 = new ActionDescriptor();
        idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
        desc717.putString(idfontPostScriptName, selectedFont);
        idFntN = charIDToTypeID("FntN");
        desc717.putString(idFntN, selectedFont);
        idSz = charIDToTypeID("Sz  ");
        idPnt = charIDToTypeID("#Pnt");
        desc717.putUnitDouble(idSz, idPnt, myFontSize);
        idautoLeading = stringIDToTypeID("autoLeading");
        desc717.putBoolean(idautoLeading, false);
        idLdng = charIDToTypeID("Ldng");
        idPnt = charIDToTypeID("#Pnt");
        desc717.putUnitDouble(idLdng, idPnt, myFontSize);
        idClr = charIDToTypeID("Clr ");
        var desc718 = new ActionDescriptor();
        idRd = charIDToTypeID("Rd  ");
        desc718.putDouble(idRd, rgbValue1[0]);
        idGrn = charIDToTypeID("Grn ");
        desc718.putDouble(idGrn, rgbValue1[1]);
        idBl = charIDToTypeID("Bl  ");
        desc718.putDouble(idBl, rgbValue1[2]);
        idRGBC = charIDToTypeID("RGBC");
        desc717.putObject(idClr, idRGBC, desc718);
        idTxtS = charIDToTypeID("TxtS");
        desc716.putObject(idTxtS, idTxtS, desc717);

        // Character 3
        idTxtt = charIDToTypeID("Txtt");
        list12.putObject(idTxtt, desc716);
        var desc720 = new ActionDescriptor();
        idFrom = charIDToTypeID("From");
        desc720.putInteger(idFrom, symbolIndices[i] + 2);
        idT = charIDToTypeID("T   ");
        desc720.putInteger(idT, symbolIndices[i] + 3);
        idTxtS = charIDToTypeID("TxtS");
        var desc721 = new ActionDescriptor();
        idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
        desc721.putString(idfontPostScriptName, selectedFont);
        idFntN = charIDToTypeID("FntN");
        desc721.putString(idFntN, selectedFont);
        idSz = charIDToTypeID("Sz  ");
        idPnt = charIDToTypeID("#Pnt");
        desc721.putUnitDouble(idSz, idPnt, myFontSize);
        idautoLeading = stringIDToTypeID("autoLeading");
        desc721.putBoolean(idautoLeading, false);
        idLdng = charIDToTypeID("Ldng");
        idPnt = charIDToTypeID("#Pnt");
        desc721.putUnitDouble(idLdng, idPnt, myFontSize);
        idClr = charIDToTypeID("Clr ");
        var desc722 = new ActionDescriptor();
        idRd = charIDToTypeID("Rd  ");
        desc722.putDouble(idRd, 0.000000);
        idGrn = charIDToTypeID("Grn ");
        desc722.putDouble(idGrn, 0.000000);
        idBl = charIDToTypeID("Bl  ");
        desc722.putDouble(idBl, 0.000000);
        idRGBC = charIDToTypeID("RGBC");
        desc721.putObject(idClr, idRGBC, desc722);
        idTxtS = charIDToTypeID("TxtS");
        desc720.putObject(idTxtS, idTxtS, desc721);

        // Character 4
        idTxtt = charIDToTypeID("Txtt");
        list12.putObject(idTxtt, desc720);
        var desc724 = new ActionDescriptor();
        idFrom = charIDToTypeID("From");
        desc724.putInteger(idFrom, symbolIndices[i] + 3);
        idT = charIDToTypeID("T   ");
        desc724.putInteger(idT, symbolIndices[i] + 4);
        idTxtS = charIDToTypeID("TxtS");
        var desc725 = new ActionDescriptor();
        idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
        desc725.putString(idfontPostScriptName, selectedFont);
        idFntN = charIDToTypeID("FntN");
        desc725.putString(idFntN, selectedFont);
        idSz = charIDToTypeID("Sz  ");
        idPnt = charIDToTypeID("#Pnt");
        desc725.putUnitDouble(idSz, idPnt, myFontSize);
        idautoLeading = stringIDToTypeID("autoLeading");
        desc725.putBoolean(idautoLeading, false);
        idLdng = charIDToTypeID("Ldng");
        idPnt = charIDToTypeID("#Pnt");
        desc725.putUnitDouble(idLdng, idPnt, myFontSize);
        idClr = charIDToTypeID("Clr ");
        var desc726 = new ActionDescriptor();
        idRd = charIDToTypeID("Rd  ");
        desc726.putDouble(idRd, 0.000000);
        idGrn = charIDToTypeID("Grn ");
        desc726.putDouble(idGrn, 0.000000);
        idBl = charIDToTypeID("Bl  ");
        desc726.putDouble(idBl, 0.000000);
        idRGBC = charIDToTypeID("RGBC");
        desc725.putObject(idClr, idRGBC, desc726);
        idTxtS = charIDToTypeID("TxtS");
        desc724.putObject(idTxtS, idTxtS, desc725);
        idTxtt = charIDToTypeID("Txtt");
        list12.putObject(idTxtt, desc724);
        desc724.putList(idTxtt, list12);
        currentLayerReference = desc724;

      } else if (inputString.slice(symbolIndices[i], symbolIndices[i] + 3) == "omn") {
        // Snow mana symbol

        // Character 1
        idTxtt = charIDToTypeID("Txtt");
        list12.putObject(idTxtt, currentLayerReference);
        var desc712 = new ActionDescriptor();
        idFrom = charIDToTypeID("From");
        desc712.putInteger(idFrom, symbolIndices[i]);
        idT = charIDToTypeID("T   ");
        desc712.putInteger(idT, symbolIndices[i] + 1);
        idTxtS = charIDToTypeID("TxtS");
        var desc713 = new ActionDescriptor();
        idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
        desc713.putString(idfontPostScriptName, selectedFont);
        idFntN = charIDToTypeID("FntN");
        desc713.putString(idFntN, selectedFont);
        idSz = charIDToTypeID("Sz  ");
        idPnt = charIDToTypeID("#Pnt");
        desc713.putUnitDouble(idSz, idPnt, myFontSize);
        idautoLeading = stringIDToTypeID("autoLeading");
        desc713.putBoolean(idautoLeading, false);
        idLdng = charIDToTypeID("Ldng");
        idPnt = charIDToTypeID("#Pnt");
        desc713.putUnitDouble(idLdng, idPnt, myFontSize);
        idClr = charIDToTypeID("Clr ");
        var desc714 = new ActionDescriptor();
        idRd = charIDToTypeID("Rd  ");
        desc714.putDouble(idRd, rgbC[0]);
        idGrn = charIDToTypeID("Grn ");
        desc714.putDouble(idGrn, rgbC[1]);
        idBl = charIDToTypeID("Bl  ");
        desc714.putDouble(idBl, rgbC[2]);
        idRGBC = charIDToTypeID("RGBC");
        desc713.putObject(idClr, idRGBC, desc714);
        idTxtS = charIDToTypeID("TxtS");
        desc712.putObject(idTxtS, idTxtS, desc713);

        // Character 2
        idTxtt = charIDToTypeID("Txtt");
        list12.putObject(idTxtt, desc712);
        var desc716 = new ActionDescriptor();
        idFrom = charIDToTypeID("From");
        desc716.putInteger(idFrom, symbolIndices[i] + 1);
        idT = charIDToTypeID("T   ");
        desc716.putInteger(idT, symbolIndices[i] + 2);
        idTxtS = charIDToTypeID("TxtS");
        var desc717 = new ActionDescriptor();
        idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
        desc717.putString(idfontPostScriptName, selectedFont);
        idFntN = charIDToTypeID("FntN");
        desc717.putString(idFntN, selectedFont);
        idSz = charIDToTypeID("Sz  ");
        idPnt = charIDToTypeID("#Pnt");
        desc717.putUnitDouble(idSz, idPnt, myFontSize);
        idautoLeading = stringIDToTypeID("autoLeading");
        desc717.putBoolean(idautoLeading, false);
        idLdng = charIDToTypeID("Ldng");
        idPnt = charIDToTypeID("#Pnt");
        desc717.putUnitDouble(idLdng, idPnt, myFontSize);
        idClr = charIDToTypeID("Clr ");
        var desc718 = new ActionDescriptor();
        idRd = charIDToTypeID("Rd  ");
        desc718.putDouble(idRd, 0.000000);
        idGrn = charIDToTypeID("Grn ");
        desc718.putDouble(idGrn, 0.000000);
        idBl = charIDToTypeID("Bl  ");
        desc718.putDouble(idBl, 0.000000);
        idRGBC = charIDToTypeID("RGBC");
        desc717.putObject(idClr, idRGBC, desc718);
        idTxtS = charIDToTypeID("TxtS");
        desc716.putObject(idTxtS, idTxtS, desc717);

        // Character 3
        idTxtt = charIDToTypeID("Txtt");
        list12.putObject(idTxtt, desc716);
        var desc720 = new ActionDescriptor();
        idFrom = charIDToTypeID("From");
        desc720.putInteger(idFrom, symbolIndices[i] + 2);
        idT = charIDToTypeID("T   ");
        desc720.putInteger(idT, symbolIndices[i] + 3);
        idTxtS = charIDToTypeID("TxtS");
        var desc721 = new ActionDescriptor();
        idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
        desc721.putString(idfontPostScriptName, selectedFont);
        idFntN = charIDToTypeID("FntN");
        desc721.putString(idFntN, selectedFont);
        idSz = charIDToTypeID("Sz  ");
        idPnt = charIDToTypeID("#Pnt");
        desc721.putUnitDouble(idSz, idPnt, myFontSize);
        idautoLeading = stringIDToTypeID("autoLeading");
        desc721.putBoolean(idautoLeading, false);
        idLdng = charIDToTypeID("Ldng");
        idPnt = charIDToTypeID("#Pnt");
        desc721.putUnitDouble(idLdng, idPnt, myFontSize);
        idClr = charIDToTypeID("Clr ");
        var desc722 = new ActionDescriptor();
        idRd = charIDToTypeID("Rd  ");
        desc722.putDouble(idRd, 255.000000);
        idGrn = charIDToTypeID("Grn ");
        desc722.putDouble(idGrn, 255.000000);
        idBl = charIDToTypeID("Bl  ");
        desc722.putDouble(idBl, 255.000000);
        idRGBC = charIDToTypeID("RGBC");
        desc721.putObject(idClr, idRGBC, desc722);
        idTxtS = charIDToTypeID("TxtS");
        desc720.putObject(idTxtS, idTxtS, desc721);

        idTxtt = charIDToTypeID("Txtt");
        list12.putObject(idTxtt, desc720);
        desc720.putList(idTxtt, list12);
        currentLayerReference = desc720;
      } else {
        // Handle normal symbols, composed of two characters
        // Backing circle of the specified colour, followed by a black char

        // Determine the colour of the symbol
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

        // If the text contains a Phyrexian mana symbol, change the colour of
        // this symbol to the previously noted Phyrexian colour
        if (inputString.slice(symbolIndices[i], symbolIndices[i] + 2) == "Qp" && phyrexianCard) {
          rgbValue = phyrexianColour;
        }

        // Untap symbols have black backing circles and white untap symbols
        var rgbBlack = 0.000000;
        if (inputString.slice(symbolIndices[i], symbolIndices[i] + 2) == "ol") {
          rgbValue = [rgbBlack, rgbBlack, rgbBlack];
          rgbBlack = 255.000000;
        }

        // Character 1
        idTxtt = charIDToTypeID("Txtt");
        list12.putObject(idTxtt, currentLayerReference);
        desc129 = new ActionDescriptor();
        idFrom = charIDToTypeID("From");
        desc129.putInteger(idFrom, symbolIndices[i]);
        idT = charIDToTypeID("T   ");
        desc129.putInteger(idT, symbolIndices[i] + 1);
        idTxtS = charIDToTypeID("TxtS");
        desc130 = new ActionDescriptor();
        idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
        desc130.putString(idfontPostScriptName, selectedFont);
        idFntN = charIDToTypeID("FntN");
        desc130.putString(idFntN, selectedFont);
        idSz = charIDToTypeID("Sz  ");
        idPnt = charIDToTypeID("#Pnt");
        desc130.putUnitDouble(idSz, idPnt, myFontSize);
        idautoLeading = stringIDToTypeID("autoLeading");
        desc130.putBoolean(idautoLeading, false);
        idLdng = charIDToTypeID("Ldng");
        idPnt = charIDToTypeID("#Pnt");
        desc130.putUnitDouble(idLdng, idPnt, myFontSize);
        idClr = charIDToTypeID("Clr ");
        desc131 = new ActionDescriptor();
        idRd = charIDToTypeID("Rd  ");
        desc131.putDouble(idRd, rgbValue[0]);
        idGrn = charIDToTypeID("Grn ");
        desc131.putDouble(idGrn, rgbValue[1]);
        idBl = charIDToTypeID("Bl  ");
        desc131.putDouble(idBl, rgbValue[2]);
        idRGBC = charIDToTypeID("RGBC");
        desc130.putObject(idClr, idRGBC, desc131);
        idTxtS = charIDToTypeID("TxtS");
        desc129.putObject(idTxtS, idTxtS, desc130);

        // Character 2
        idTxtt = charIDToTypeID("Txtt");
        list12.putObject(idTxtt, desc129);
        desc133 = new ActionDescriptor();
        idFrom = charIDToTypeID("From");
        desc133.putInteger(idFrom, symbolIndices[i] + 1);
        idT = charIDToTypeID("T   ");
        desc133.putInteger(idT, symbolIndices[i] + 2);
        idTxtS = charIDToTypeID("TxtS");
        desc134 = new ActionDescriptor();
        idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
        desc134.putString(idfontPostScriptName, selectedFont);
        idFntN = charIDToTypeID("FntN");
        desc134.putString(idFntN, selectedFont);
        idSz = charIDToTypeID("Sz  ");
        idPnt = charIDToTypeID("#Pnt");
        desc134.putUnitDouble(idSz, idPnt, myFontSize);
        idautoLeading = stringIDToTypeID("autoLeading");
        desc134.putBoolean(idautoLeading, false);
        idLdng = charIDToTypeID("Ldng");
        idPnt = charIDToTypeID("#Pnt");
        desc134.putUnitDouble(idLdng, idPnt, myFontSize);
        idClr = charIDToTypeID("Clr ");
        var desc135 = new ActionDescriptor();
        idRd = charIDToTypeID("Rd  ");
        desc135.putDouble(idRd, rgbBlack);
        idGrn = charIDToTypeID("Grn ");
        desc135.putDouble(idGrn, rgbBlack);
        idBl = charIDToTypeID("Bl  ");
        desc135.putDouble(idBl, rgbBlack);
        idRGBC = charIDToTypeID("RGBC");
        desc134.putObject(idClr, idRGBC, desc135);
        idTxtS = charIDToTypeID("TxtS");
        desc133.putObject(idTxtS, idTxtS, desc134);
        currentLayerReference = desc133;
      }
    }
  }

  idTxtt = charIDToTypeID("Txtt");
  list12.putObject(idTxtt, currentLayerReference);
  var desc137 = new ActionDescriptor();
  idFrom = charIDToTypeID("From");
  desc137.putInteger(idFrom, inputString.length);
  idT = charIDToTypeID("T   ");
  desc137.putInteger(idT, inputString.length);
  idTxtS = charIDToTypeID("TxtS");
  var desc138 = new ActionDescriptor();
  idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
  desc138.putString(idfontPostScriptName, primaryFont);
  idFntN = charIDToTypeID("FntN");
  desc138.putString(idFntN, primaryFont);
  idSz = charIDToTypeID("Sz  ");
  idPnt = charIDToTypeID("#Pnt");
  desc138.putUnitDouble(idSz, idPnt, myFontSize);
  idHrzS = charIDToTypeID("HrzS");
  idautoLeading = stringIDToTypeID("autoLeading");
  desc138.putBoolean(idautoLeading, false);
  idLdng = charIDToTypeID("Ldng");
  idPnt = charIDToTypeID("#Pnt");
  desc138.putUnitDouble(idLdng, idPnt, myFontSize);
  idClr = charIDToTypeID("Clr ");
  var desc139 = new ActionDescriptor();
  idRd = charIDToTypeID("Rd  ");
  desc139.putDouble(idRd, textColour[0]);
  idGrn = charIDToTypeID("Grn ");
  desc139.putDouble(idGrn, textColour[1]);
  idBl = charIDToTypeID("Bl  ");
  desc139.putDouble(idBl, textColour[2]);
  idTxtS = charIDToTypeID("TxtS");
  desc137.putObject(idTxtS, idTxtS, desc138);
  idTxtt = charIDToTypeID("Txtt");
  list12.putObject(idTxtt, desc137);
  desc120.putList(idTxtt, list12);

  // Set spacing between line breaks
  var spacingMan = 16.428175;
  if (centredText == true) spacingMan = 0;

  var idparagraphStyleRange = stringIDToTypeID("paragraphStyleRange");
  var list13 = new ActionList();
  var desc141 = new ActionDescriptor();
  idFrom = charIDToTypeID("From");
  desc141.putInteger(idFrom, 0);
  idT = charIDToTypeID("T   ");
  desc141.putInteger(idT, inputString.length);
  var idparagraphStyle = stringIDToTypeID("paragraphStyle");
  var desc142 = new ActionDescriptor();
  var idfirstLineIndent = stringIDToTypeID("firstLineIndent");
  idPnt = charIDToTypeID("#Pnt");
  desc142.putUnitDouble(idfirstLineIndent, idPnt, 0.000000);
  var idstartIndent = stringIDToTypeID("startIndent");
  idPnt = charIDToTypeID("#Pnt");
  desc142.putUnitDouble(idstartIndent, idPnt, 0.000000);
  var idendIndent = stringIDToTypeID("endIndent");
  idPnt = charIDToTypeID("#Pnt");
  desc142.putUnitDouble(idendIndent, idPnt, 0.000000);
  var idspaceBefore = stringIDToTypeID("spaceBefore");
  idPnt = charIDToTypeID("#Pnt");
  desc142.putUnitDouble(idspaceBefore, idPnt, spacingMan);
  var idspaceAfter = stringIDToTypeID("spaceAfter");
  idPnt = charIDToTypeID("#Pnt");
  desc142.putUnitDouble(idspaceAfter, idPnt, 0.000000);
  var iddropCapMultiplier = stringIDToTypeID("dropCapMultiplier");
  desc142.putInteger(iddropCapMultiplier, 1);
  var idautoLeadingPercentage = stringIDToTypeID("autoLeadingPercentage");
  desc142.putDouble(idautoLeadingPercentage, 1.200000);
  var idleadingType = stringIDToTypeID("leadingType");
  idleadingType = stringIDToTypeID("leadingType");
  var idleadingBelow = stringIDToTypeID("leadingBelow");
  desc142.putEnumerated(idleadingType, idleadingType, idleadingBelow);
  var desc143 = new ActionDescriptor();
  idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
  desc143.putString(idfontPostScriptName, selectedFont);
  idFntN = charIDToTypeID("FntN");
  desc143.putString(idFntN, primaryFont);
  idautoLeading = stringIDToTypeID("autoLeading");
  desc143.putBoolean(idautoLeading, false);
  idClr = charIDToTypeID("Clr ");
  var desc144 = new ActionDescriptor();
  idRd = charIDToTypeID("Rd  ");
  desc144.putDouble(idRd, textColour[0]);
  idGrn = charIDToTypeID("Grn ");
  desc144.putDouble(idGrn, textColour[1]);
  idBl = charIDToTypeID("Bl  ");
  desc144.putDouble(idBl, textColour[2]);
  idRGBC = charIDToTypeID("RGBC");
  desc143.putObject(idClr, idRGBC, desc144);
  desc120.putList(idparagraphStyleRange, list13);
  var idkerningRange = stringIDToTypeID("kerningRange");
  var list14 = new ActionList();
  desc120.putList(idkerningRange, list14);

  list13 = new ActionList();

  if (inputString.indexOf("\u2022") >= 0) {
    // Modal card with bullet points - adjust the formatting slightly
    var startIndexBullet = inputString.indexOf("\u2022");
    var endIndexBullet = inputString.lastIndexOf("\u2022");
    idparagraphStyleRange = stringIDToTypeID("paragraphStyleRange");
    list13 = new ActionList();
    desc141 = new ActionDescriptor();
    idFrom = charIDToTypeID("From");
    desc141.putInteger(idFrom, startIndexBullet);
    idT = charIDToTypeID("T   ");
    desc141.putInteger(idT, endIndexBullet + 1);
    idparagraphStyle = stringIDToTypeID("paragraphStyle");
    idfirstLineIndent = stringIDToTypeID("firstLineIndent");
    idPnt = charIDToTypeID("#Pnt");
    desc142.putUnitDouble(idfirstLineIndent, idPnt, -41.000000);
    idstartIndent = stringIDToTypeID("startIndent");
    idPnt = charIDToTypeID("#Pnt");
    desc142.putUnitDouble(idstartIndent, idPnt, 41.000000);
    idspaceBefore = stringIDToTypeID("spaceBefore");
    idPnt = charIDToTypeID("#Pnt");
    desc142.putUnitDouble(idspaceBefore, idPnt, 10.000000);
    idspaceAfter = stringIDToTypeID("spaceAfter");
    idPnt = charIDToTypeID("#Pnt");
    desc142.putUnitDouble(idspaceAfter, idPnt, 0.000000);
    iddropCapMultiplier = stringIDToTypeID("dropCapMultiplier");
    desc142.putInteger(iddropCapMultiplier, 1);
    idautoLeadingPercentage = stringIDToTypeID("autoLeadingPercentage");
    desc142.putDouble(idautoLeadingPercentage, 1.200000);
    idleadingType = stringIDToTypeID("leadingType");
    idleadingType = stringIDToTypeID("leadingType");
    idleadingBelow = stringIDToTypeID("leadingBelow");
    desc142.putEnumerated(idleadingType, idleadingType, idleadingBelow);
    idhyphenate = stringIDToTypeID("hyphenate");
    desc142.putBoolean(idhyphenate, false);
    idhyphenateWordSize = stringIDToTypeID("hyphenateWordSize");
    desc142.putInteger(idhyphenateWordSize, 6);
    idhyphenatePreLength = stringIDToTypeID("hyphenatePreLength");
    desc142.putInteger(idhyphenatePreLength, 2);
    idhyphenatePostLength = stringIDToTypeID("hyphenatePostLength");
    desc142.putInteger(idhyphenatePostLength, 2);
    idhyphenateLimit = stringIDToTypeID("hyphenateLimit");
    desc142.putInteger(idhyphenateLimit, 0);
    idhyphenationZone = stringIDToTypeID("hyphenationZone");
    desc142.putDouble(idhyphenationZone, 36.000000);
    idhyphenateCapitalized = stringIDToTypeID("hyphenateCapitalized");
    desc142.putBoolean(idhyphenateCapitalized, true);
    idhyphenationPreference = stringIDToTypeID("hyphenationPreference");
    desc142.putDouble(idhyphenationPreference, 0.500000);
    idjustificationWordMinimum = stringIDToTypeID("justificationWordMinimum");
    desc142.putDouble(idjustificationWordMinimum, 0.800000);
    idjustificationWordDesired = stringIDToTypeID("justificationWordDesired");
    desc142.putDouble(idjustificationWordDesired, 1.000000);
    idjustificationWordMaximum = stringIDToTypeID("justificationWordMaximum");
    desc142.putDouble(idjustificationWordMaximum, 1.330000);
    idjustificationLetterMinimum = stringIDToTypeID("justificationLetterMinimum");
    desc142.putDouble(idjustificationLetterMinimum, 0.000000);
    idjustificationLetterDesired = stringIDToTypeID("justificationLetterDesired");
    desc142.putDouble(idjustificationLetterDesired, 0.000000);
    idjustificationLetterMaximum = stringIDToTypeID("justificationLetterMaximum");
    desc142.putDouble(idjustificationLetterMaximum, 0.000000);
    idjustificationGlyphMinimum = stringIDToTypeID("justificationGlyphMinimum");
    desc142.putDouble(idjustificationGlyphMinimum, 1.000000);
    idjustificationGlyphDesired = stringIDToTypeID("justificationGlyphDesired");
    desc142.putDouble(idjustificationGlyphDesired, 1.000000);
    idjustificationGlyphMaximum = stringIDToTypeID("justificationGlyphMaximum");
    desc142.putDouble(idjustificationGlyphMaximum, 1.000000);
    idsingleWordJustification = stringIDToTypeID("singleWordJustification");
    idAlg = charIDToTypeID("Alg ");
    idJstA = charIDToTypeID("JstA");
    desc142.putEnumerated(idsingleWordJustification, idAlg, idJstA);
    idhangingRoman = stringIDToTypeID("hangingRoman");
    desc142.putBoolean(idhangingRoman, false);
    idautoTCY = stringIDToTypeID("autoTCY");
    desc142.putInteger(idautoTCY, 1);
    idkeepTogether = stringIDToTypeID("keepTogether");
    desc142.putBoolean(idkeepTogether, false);
    idburasagari = stringIDToTypeID("burasagari");
    idburasagari = stringIDToTypeID("burasagari");
    idburasagariNone = stringIDToTypeID("burasagariNone");
    desc142.putEnumerated(idburasagari, idburasagari, idburasagariNone);
    idpreferredKinsokuOrder = stringIDToTypeID("preferredKinsokuOrder");
    idpreferredKinsokuOrder = stringIDToTypeID("preferredKinsokuOrder");
    idpushIn = stringIDToTypeID("pushIn");
    desc142.putEnumerated(idpreferredKinsokuOrder, idpreferredKinsokuOrder, idpushIn);
    idkurikaeshiMojiShori = stringIDToTypeID("kurikaeshiMojiShori");
    desc142.putBoolean(idkurikaeshiMojiShori, false);
    idtextEveryLineComposer = stringIDToTypeID("textEveryLineComposer");
    desc142.putBoolean(idtextEveryLineComposer, false);
    iddefaultTabWidth = stringIDToTypeID("defaultTabWidth");
    desc142.putDouble(iddefaultTabWidth, 36.000000);
    iddefaultStyle = stringIDToTypeID("defaultStyle");
    desc143 = new ActionDescriptor();
    idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
    desc143.putString(idfontPostScriptName, selectedFont);
    idFntN = charIDToTypeID("FntN");
    desc143.putString(idFntN, primaryFont);
    idSz = charIDToTypeID("Sz  ");
    idPnt = charIDToTypeID("#Pnt");
    desc143.putUnitDouble(idSz, idPnt, 11.998500);
    idautoLeading = stringIDToTypeID("autoLeading");
    desc143.putBoolean(idautoLeading, false);
    idClr = charIDToTypeID("Clr ");
    desc144 = new ActionDescriptor();
    idRd = charIDToTypeID("Rd  ");
    desc144.putDouble(idRd, textColour[0]);
    idGrn = charIDToTypeID("Grn ");
    desc144.putDouble(idGrn, textColour[1]);
    idBl = charIDToTypeID("Bl  ");
    desc144.putDouble(idBl, textColour[2]);
    idRGBC = charIDToTypeID("RGBC");
    desc143.putObject(idClr, idRGBC, desc144);
    idTxtS = charIDToTypeID("TxtS");
    desc142.putObject(iddefaultStyle, idTxtS, desc143);
    idparagraphStyle = stringIDToTypeID("paragraphStyle");
    desc141.putObject(idparagraphStyle, idparagraphStyle, desc142);
    idparagraphStyleRange = stringIDToTypeID("paragraphStyleRange");
    list13.putObject(idparagraphStyleRange, desc141);
    desc120.putList(idparagraphStyleRange, list13);
    idkerningRange = stringIDToTypeID("kerningRange");
    list14 = new ActionList();
    desc120.putList(idkerningRange, list14);
  }

  if (flavourIndex > 0) {
    // Adjust line break spacing if there's a line break in the flavour text
    idparagraphStyleRange = stringIDToTypeID("paragraphStyleRange");
    desc141 = new ActionDescriptor();
    idFrom = charIDToTypeID("From");
    desc141.putInteger(idFrom, flavourIndex + 3);
    idT = charIDToTypeID("T   ");
    desc141.putInteger(idT, flavourIndex + 4);
    idfirstLineIndent = stringIDToTypeID( "firstLineIndent" );
    idPnt = charIDToTypeID( "#Pnt" );
    desc142.putUnitDouble( idfirstLineIndent, idPnt, 0 );
    var idimpliedFirstLineIndent = stringIDToTypeID( "impliedFirstLineIndent" );
    idPnt = charIDToTypeID( "#Pnt" );
    desc142.putUnitDouble( idimpliedFirstLineIndent, idPnt, 0 );
    idstartIndent = stringIDToTypeID( "startIndent" );
    idPnt = charIDToTypeID( "#Pnt" );
    desc142.putUnitDouble( idstartIndent, idPnt, 0 );
    idimpliedStartIndent = stringIDToTypeID( "impliedStartIndent" );
    idPnt = charIDToTypeID( "#Pnt" );
    desc142.putUnitDouble( idimpliedStartIndent, idPnt, 0 );
    idspaceBefore = stringIDToTypeID("spaceBefore");
    idPnt = charIDToTypeID("#Pnt");
    desc142.putUnitDouble(idspaceBefore, idPnt, 34);
    idparagraphStyle = stringIDToTypeID("paragraphStyle");
    desc141.putObject(idparagraphStyle, idparagraphStyle, desc142);
    idparagraphStyleRange = stringIDToTypeID("paragraphStyleRange");
    list13.putObject(idparagraphStyleRange, desc141);
    desc120.putList(idparagraphStyleRange, list13);
    idkerningRange = stringIDToTypeID("kerningRange");
    list14 = new ActionList();
    desc120.putList(idkerningRange, list14);
  }

  if (quoteIndex > 0) {
    // Adjust line break spacing if there's a line break in the flavour text
    idparagraphStyleRange = stringIDToTypeID("paragraphStyleRange");
    desc141 = new ActionDescriptor();
    idFrom = charIDToTypeID("From");
    desc141.putInteger(idFrom, quoteIndex + 3);
    idT = charIDToTypeID("T   ");
    desc141.putInteger(idT, inputString.length);
    idspaceBefore = stringIDToTypeID("spaceBefore");
    idPnt = charIDToTypeID("#Pnt");
    desc142.putUnitDouble(idspaceBefore, idPnt, 0);
    idparagraphStyle = stringIDToTypeID("paragraphStyle");
    desc141.putObject(idparagraphStyle, idparagraphStyle, desc142);
    idparagraphStyleRange = stringIDToTypeID("paragraphStyleRange");
    list13.putObject(idparagraphStyleRange, desc141);
    desc120.putList(idparagraphStyleRange, list13);
    idkerningRange = stringIDToTypeID("kerningRange");
    list14 = new ActionList();
    desc120.putList(idkerningRange, list14);
  }

  // Push changes to document
  idsetd = charIDToTypeID("setd");
  idTxLr = charIDToTypeID("TxLr");
  desc119.putObject(idT, idTxLr, desc120);
  executeAction(idsetd, desc119, DialogModes.NO);
}
