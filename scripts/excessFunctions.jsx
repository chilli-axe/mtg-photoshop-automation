// Resize text to fit text box
// Credit to https://stackoverflow.com/questions/28900505/extendscript-how-to-check-whether-text-content-overflows-the-containing-rectang
function scaleTextToFitBox(textLayer) {

  var fitInsideBoxDimensions = getLayerDimensions(textLayer);
  while (fitInsideBoxDimensions.height < getRealTextLayerDimensions(textLayer).height) {

    var fontSize = parseInt(textLayer.textItem.size);
    var leadSize = parseInt(textLayer.textItem.leading);
    textLayer.textItem.size = new UnitValue(fontSize - 1, "px");
    textLayer.textItem.leading = new UnitValue(leadSize - 1, "px");
  }

}

function getRealTextLayerDimensions(textLayer) {
  var textLayerCopy = textLayer.duplicate(activeDocument, ElementPlacement.INSIDE);
  textLayerCopy.rasterize(RasterizeType.TEXTCONTENTS);
  var dimensions = getLayerDimensions(textLayerCopy);

  textLayerCopy.remove();

  return dimensions;
}

function getLayerDimensions(layer) {
  return {
    width: layer.bounds[2] - layer.bounds[0],
    height: layer.bounds[3] - layer.bounds[1]
  };
}

function scaleTextToFitBoxNew(textLayer, referenceHeight) {
  // Default values: 68.5, 137
  startingFontSize = 66.5;
  stepSize = 1;

  var fontSize = startingFontSize;
  var leadSize = 2 * startingFontSize;

  var scaled = false;
  var inputWidth = new UnitValue(textLayer.textItem.width, "px");
  var number = textLayer.textItem.height;
  var inputHeight = new UnitValue(2 * (number), "px");

  while (referenceHeight < getRealTextLayerDimensions(textLayer).height) {
    scaled = true;
    textLayer.textItem.size = new UnitValue(fontSize - stepSize, "px");// Resize text to fit text box
    fontSize = fontSize - stepSize;
    textLayer.textItem.leading = new UnitValue(leadSize - 2 * stepSize, "px");
    leadSize = leadSize - 2 * stepSize;
  }
  return scaled;
}

// Credit to https://stackoverflow.com/questions/28900505/extendscript-how-to-check-whether-text-content-overflows-the-containing-rectang
function scaleTextToFitBox(textLayer) {

  var fitInsideBoxDimensions = getLayerDimensions(textLayer);
  while (fitInsideBoxDimensions.height < getRealTextLayerDimensions(textLayer).height) {

    var fontSize = parseInt(textLayer.textItem.size);
    var leadSize = parseInt(textLayer.textItem.leading);
    textLayer.textItem.size = new UnitValue(fontSize - 1, "px");
    textLayer.textItem.leading = new UnitValue(leadSize - 1, "px");
  }

}

function getRealTextLayerDimensions(textLayer) {
  var textLayerCopy = textLayer.duplicate(activeDocument, ElementPlacement.INSIDE);
  textLayerCopy.rasterize(RasterizeType.TEXTCONTENTS);
  var dimensions = getLayerDimensions(textLayerCopy);

  textLayerCopy.remove();

  return dimensions;
}

function getLayerDimensions(layer) {
  return {
    width: layer.bounds[2] - layer.bounds[0],
    height: layer.bounds[3] - layer.bounds[1]
  };
}

function scaleTextToFitBoxNew(textLayer, referenceHeight) {
  // Default values: 68.5, 137
  startingFontSize = 66.5;
  stepSize = 1;

  var fontSize = startingFontSize;
  var leadSize = 2 * startingFontSize;

  var scaled = false;
  var inputWidth = new UnitValue(textLayer.textItem.width, "px");
  var number = textLayer.textItem.height;
  var inputHeight = new UnitValue(2 * (number), "px");

  while (referenceHeight < getRealTextLayerDimensions(textLayer).height) {
    scaled = true;
    textLayer.textItem.size = new UnitValue(fontSize - stepSize, "px");
    fontSize = fontSize - stepSize;
    textLayer.textItem.leading = new UnitValue(leadSize - 2 * stepSize, "px");
    leadSize = leadSize - 2 * stepSize;
  }
  return scaled;
}

function getAllIndexes(arr, val) {
  var indexes = [],
    i = -1;
  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;
}

function arrayIndexOf2(inputArray, reqValue, startingIndex) {
  var index = -1;
  startingIndex = typeof startingIndex !== 'undefined' ? startingIndex : 0;
  for (var i = startingIndex; i < inputArray.length; i++) {
    if (inputArray[i] == reqValue) {
      index = i;
      break;
    }
  }
  return index;
}

// In an effort to keep the source code readable, any functions derived
// from photoshop's script listener have been included here

// Replace text function from an adobe forum thread I lost the link to
function replaceText(replaceThis, replaceWith) {
  var idreplace = stringIDToTypeID("replace");
  var desc22 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref3 = new ActionReference();
  var idPrpr = charIDToTypeID("Prpr");
  idreplace = stringIDToTypeID("replace");
  ref3.putProperty(idPrpr, idreplace);
  idTxLr = charIDToTypeID("TxLr");
  idOrdn = charIDToTypeID("Ordn");
  var idAl = charIDToTypeID("Al  ");
  ref3.putEnumerated(idTxLr, idOrdn, idAl);
  desc22.putReference(idnull, ref3);
  var idUsng = charIDToTypeID("Usng");
  var desc23 = new ActionDescriptor();
  var idfind = stringIDToTypeID("find");
  desc23.putString(idfind, replaceThis);
  idreplace = stringIDToTypeID("replace");
  desc23.putString(idreplace, replaceWith);
  var idcheckAll = stringIDToTypeID("checkAll");
  desc23.putBoolean(idcheckAll, true);
  var idFwd = charIDToTypeID("Fwd ");
  desc23.putBoolean(idFwd, true);
  var idcaseSensitive = stringIDToTypeID("caseSensitive");
  desc23.putBoolean(idcaseSensitive, false);
  var idwholeWord = stringIDToTypeID("wholeWord");
  desc23.putBoolean(idwholeWord, false);
  var idignoreAccents = stringIDToTypeID("ignoreAccents");
  desc23.putBoolean(idignoreAccents, true);
  var idfindReplace = stringIDToTypeID("findReplace");
  desc22.putObject(idUsng, idfindReplace, desc23);
  executeAction(idreplace, desc22, DialogModes.NO);
}

// Rasterise the text layer and vertically align it to the text box
function verticallyAlignText(textLayerName) {
  // =======================================================
  idslct = charIDToTypeID("slct");
  var desc2 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref1 = new ActionReference();
  idLyr = charIDToTypeID("Lyr ");
  ref1.putName(idLyr, textLayerName);
  desc2.putReference(idnull, ref1);
  idMkVs = charIDToTypeID("MkVs");
  desc2.putBoolean(idMkVs, false);
  executeAction(idslct, desc2, DialogModes.NO);

  // =======================================================
  var idrasterizeLayer = stringIDToTypeID("rasterizeLayer");
  var desc3 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref2 = new ActionReference();
  idLyr = charIDToTypeID("Lyr ");
  idOrdn = charIDToTypeID("Ordn");
  idTrgt = charIDToTypeID("Trgt");
  ref2.putEnumerated(idLyr, idOrdn, idTrgt);
  desc3.putReference(idnull, ref2);
  var idWhat = charIDToTypeID("What");
  var idrasterizeItem = stringIDToTypeID("rasterizeItem");
  idType = charIDToTypeID("Type");
  desc3.putEnumerated(idWhat, idrasterizeItem, idType);
  executeAction(idrasterizeLayer, desc3, DialogModes.NO);

  // =======================================================
  var idShw = charIDToTypeID("Shw ");
  var desc4 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var list1 = new ActionList();
  var ref3 = new ActionReference();
  idLyr = charIDToTypeID("Lyr ");
  ref3.putName(idLyr, textLayerName);
  list1.putReference(ref3);
  desc4.putList(idnull, list1);
  executeAction(idShw, desc4, DialogModes.NO);

  // =======================================================
  idslct = charIDToTypeID("slct");
  var desc5 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref4 = new ActionReference();
  idLyr = charIDToTypeID("Lyr ");
  ref4.putName(idLyr, "Textbox Reference");
  desc5.putReference(idnull, ref4);
  idMkVs = charIDToTypeID("MkVs");
  desc5.putBoolean(idMkVs, false);
  executeAction(idslct, desc5, DialogModes.NO);

  // =======================================================
  idsetd = charIDToTypeID("setd");
  var desc6 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref5 = new ActionReference();
  idChnl = charIDToTypeID("Chnl");
  var idfsel = charIDToTypeID("fsel");
  ref5.putProperty(idChnl, idfsel);
  desc6.putReference(idnull, ref5);
  idT = charIDToTypeID("T   ");
  var ref6 = new ActionReference();
  idChnl = charIDToTypeID("Chnl");
  idChnl = charIDToTypeID("Chnl");
  idTrsp = charIDToTypeID("Trsp");
  ref6.putEnumerated(idChnl, idChnl, idTrsp);
  desc6.putReference(idT, ref6);
  executeAction(idsetd, desc6, DialogModes.NO);

  // =======================================================
  idslct = charIDToTypeID("slct");
  var desc7 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref7 = new ActionReference();
  idLyr = charIDToTypeID("Lyr ");
  ref7.putName(idLyr, textLayerName);
  desc7.putReference(idnull, ref7);
  idMkVs = charIDToTypeID("MkVs");
  desc7.putBoolean(idMkVs, false);
  executeAction(idslct, desc7, DialogModes.NO);

  // =======================================================
  idslct = charIDToTypeID("slct");
  var desc8 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref8 = new ActionReference();
  var idmoveTool = stringIDToTypeID("moveTool");
  ref8.putClass(idmoveTool);
  desc8.putReference(idnull, ref8);
  var iddontRecord = stringIDToTypeID("dontRecord");
  desc8.putBoolean(iddontRecord, true);
  var idforceNotify = stringIDToTypeID("forceNotify");
  desc8.putBoolean(idforceNotify, true);
  executeAction(idslct, desc8, DialogModes.NO);

  // =======================================================
  var idAlgn = charIDToTypeID("Algn");
  var desc9 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref9 = new ActionReference();
  idLyr = charIDToTypeID("Lyr ");
  idOrdn = charIDToTypeID("Ordn");
  idTrgt = charIDToTypeID("Trgt");
  ref9.putEnumerated(idLyr, idOrdn, idTrgt);
  desc9.putReference(idnull, ref9);
  var idUsng = charIDToTypeID("Usng");
  var idADSt = charIDToTypeID("ADSt");
  var idAdCV = charIDToTypeID("AdCV");
  desc9.putEnumerated(idUsng, idADSt, idAdCV);
  executeAction(idAlgn, desc9, DialogModes.NO);

  // =======================================================
  var idHd = charIDToTypeID("Hd  ");
  var desc10 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var list2 = new ActionList();
  var ref10 = new ActionReference();
  idLyr = charIDToTypeID("Lyr ");
  ref10.putName(idLyr, "Textbox Reference");
  list2.putReference(ref10);
  desc10.putList(idnull, list2);
  executeAction(idHd, desc10, DialogModes.NO);
  // =======================================================
}

function verticallyFixText(textLayer) {
  // Make a selection of the text layer that's above the P/T box, then ctrl-j
  // the selection from the card text layer

  // Make selection from the reference layer
  var textAndIcons = app.activeDocument.layers.getByName("Text and Icons");
  var ptAdjustmentReference = textAndIcons.layers.getByName("PT Adjustment Reference");

  var left = ptAdjustmentReference.bounds[0];
  var top = ptAdjustmentReference.bounds[1];
  var right = ptAdjustmentReference.bounds[2];
  var bottom = ptAdjustmentReference.bounds[3];
  app.activeDocument.selection.select([[left, top], [right, top],
                                       [right, bottom], [left, bottom]]);

  // get PT Top Reference layer
  var ptTopReference = textAndIcons.layers.getByName("PT Top Reference");

  // ctrl-j the selection on the rasterised text to a new layer
  var idCpTL = charIDToTypeID("CpTL");
  executeAction(idCpTL, undefined, DialogModes.NO);
  idsetd = charIDToTypeID("setd");
  var desc5 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref4 = new ActionReference();
  idLyr = charIDToTypeID("Lyr ");
  idOrdn = charIDToTypeID("Ordn");
  idTrgt = charIDToTypeID("Trgt");
  ref4.putEnumerated(idLyr, idOrdn, idTrgt);
  desc5.putReference(idnull, ref4);
  idT = charIDToTypeID("T   ");
  var desc6 = new ActionDescriptor();
  var idNm = charIDToTypeID("Nm  ");
  desc6.putString(idNm, "Extra Bit");
  idLyr = charIDToTypeID("Lyr ");
  desc5.putObject(idT, idLyr, desc6);
  executeAction(idsetd, desc5, DialogModes.NO);

  // Find how much the rules text overlaps the PT box by
  var extraBit = textAndIcons.layers.getByName("Extra Bit");
  var pixelOverlap = extraBit.bounds[3].as("px") - ptTopReference.bounds[3].as("px");
  var pixelOverlapUnit = new UnitValue(-1 * pixelOverlap, "px");
  extraBit.visible = false;

  // Shift the rules text up by the appropriate amount so there's no overlap
  var rulesText = textAndIcons.layers.getByName("Rules Text - Creature");
  if (pixelOverlap > 0) rulesText.applyOffset(0, pixelOverlapUnit, OffsetUndefinedAreas.SETTOBACKGROUND);
}

function gradientCommon() {
  colour1 = [0.000000, 0.000000, 0.000000];
  colour2 = [0.000000, 0.000000, 0.000000];
  colourStroke = 255.000000;
  gradient(colour1, colour2, colourStroke);
}

function gradientUncommon() {
  colour1 = [199.000000, 225.000000, 241.000000];
  colour2 = [98.000000, 110.000000, 119.003891];
  colourStroke = 0.000000;
  gradient(colour1, colour2, colourStroke);
}

function gradientRare() {
  colour1 = [213.996109, 179.996109, 109.003891];
  colour2 = [145.996109, 116.000000, 67.003891];
  colourStroke = 0.000000;
  gradient(colour1, colour2, colourStroke);
}

function gradientMythic() {
  colour1 = [245.000000, 149.000000, 29.003891];
  colour2 = [191.996109, 55.003891, 38.000000];
  colourStroke = 0.000000;
  gradient(colour1, colour2, colourStroke);
}

function gradient(colour1, colour2, colourStroke) {
  strokeWidth = 6.000000;

  // =======================================================
  idsetd = charIDToTypeID("setd");
  var desc1660 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref751 = new ActionReference();
  idClr = charIDToTypeID("Clr ");
  idFrgC = charIDToTypeID("FrgC");
  ref751.putProperty(idClr, idFrgC);
  desc1660.putReference(idnull, ref751);
  idT = charIDToTypeID("T   ");
  var desc1661 = new ActionDescriptor();
  idRd = charIDToTypeID("Rd  ");
  desc1661.putDouble(idRd, colour1[0]);
  idGrn = charIDToTypeID("Grn ");
  desc1661.putDouble(idGrn, colour1[1]);
  idBl = charIDToTypeID("Bl  ");
  desc1661.putDouble(idBl, colour1[2]);
  idRGBC = charIDToTypeID("RGBC");
  desc1660.putObject(idT, idRGBC, desc1661);
  executeAction(idsetd, desc1660, DialogModes.NO);

  // =======================================================
  idExch = charIDToTypeID("Exch");
  var desc1662 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref752 = new ActionReference();
  idClr = charIDToTypeID("Clr ");
  idClrs = charIDToTypeID("Clrs");
  ref752.putProperty(idClr, idClrs);
  desc1662.putReference(idnull, ref752);
  executeAction(idExch, desc1662, DialogModes.NO);

  // =======================================================
  idsetd = charIDToTypeID("setd");
  var desc1663 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref753 = new ActionReference();
  idClr = charIDToTypeID("Clr ");
  idFrgC = charIDToTypeID("FrgC");
  ref753.putProperty(idClr, idFrgC);
  desc1663.putReference(idnull, ref753);
  idT = charIDToTypeID("T   ");
  var desc1664 = new ActionDescriptor();
  idRd = charIDToTypeID("Rd  ");
  desc1664.putDouble(idRd, colour2[0]);
  idGrn = charIDToTypeID("Grn ");
  desc1664.putDouble(idGrn, colour2[1]);
  idBl = charIDToTypeID("Bl  ");
  desc1664.putDouble(idBl, colour2[2]);
  idRGBC = charIDToTypeID("RGBC");
  desc1663.putObject(idT, idRGBC, desc1664);
  executeAction(idsetd, desc1663, DialogModes.NO);

  // =======================================================
  idExch = charIDToTypeID("Exch");
  var desc1665 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref754 = new ActionReference();
  idClr = charIDToTypeID("Clr ");
  idClrs = charIDToTypeID("Clrs");
  ref754.putProperty(idClr, idClrs);
  desc1665.putReference(idnull, ref754);
  executeAction(idExch, desc1665, DialogModes.NO);

  // =======================================================
  idslct = charIDToTypeID("slct");
  var desc605 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref146 = new ActionReference();
  idLyr = charIDToTypeID("Lyr ");
  ref146.putName(idLyr, "Text and Icons");
  desc605.putReference(idnull, ref146);
  idMkVs = charIDToTypeID("MkVs");
  desc605.putBoolean(idMkVs, false);
  executeAction(idslct, desc605, DialogModes.NO);

  // =======================================================
  idslct = charIDToTypeID("slct");
  var desc606 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref147 = new ActionReference();
  idLyr = charIDToTypeID("Lyr ");
  ref147.putName(idLyr, "Expansion Symbol");
  desc606.putReference(idnull, ref147);
  idMkVs = charIDToTypeID("MkVs");
  desc606.putBoolean(idMkVs, false);
  executeAction(idslct, desc606, DialogModes.NO);

  // =======================================================
  var idrasterizeLayer = stringIDToTypeID("rasterizeLayer");
  var desc607 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref148 = new ActionReference();
  idLyr = charIDToTypeID("Lyr ");
  idOrdn = charIDToTypeID("Ordn");
  idTrgt = charIDToTypeID("Trgt");
  ref148.putEnumerated(idLyr, idOrdn, idTrgt);
  desc607.putReference(idnull, ref148);
  var idWhat = charIDToTypeID("What");
  var idrasterizeItem = stringIDToTypeID("rasterizeItem");
  idType = charIDToTypeID("Type");
  desc607.putEnumerated(idWhat, idrasterizeItem, idType);
  executeAction(idrasterizeLayer, desc607, DialogModes.NO);

  // =======================================================
  idsetd = charIDToTypeID("setd");
  var desc608 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref149 = new ActionReference();
  var idPrpr = charIDToTypeID("Prpr");
  idLefx = charIDToTypeID("Lefx");
  ref149.putProperty(idPrpr, idLefx);
  idLyr = charIDToTypeID("Lyr ");
  idOrdn = charIDToTypeID("Ordn");
  idTrgt = charIDToTypeID("Trgt");
  ref149.putEnumerated(idLyr, idOrdn, idTrgt);
  desc608.putReference(idnull, ref149);
  idT = charIDToTypeID("T   ");
  var desc609 = new ActionDescriptor();
  var idScl = charIDToTypeID("Scl ");
  idPrc = charIDToTypeID("#Prc");
  desc609.putUnitDouble(idScl, idPrc, 200.000000);
  idFrFX = charIDToTypeID("FrFX");
  var desc610 = new ActionDescriptor();
  var idenab = charIDToTypeID("enab");
  desc610.putBoolean(idenab, true);
  var idStyl = charIDToTypeID("Styl");
  var idFStl = charIDToTypeID("FStl");
  var idInsF = charIDToTypeID("OutF");
  desc610.putEnumerated(idStyl, idFStl, idInsF);
  idPntT = charIDToTypeID("PntT");
  var idFrFl = charIDToTypeID("FrFl");
  var idSClr = charIDToTypeID("SClr");
  desc610.putEnumerated(idPntT, idFrFl, idSClr);
  var idMd = charIDToTypeID("Md  ");
  idBlnM = charIDToTypeID("BlnM");
  var idNrml = charIDToTypeID("Nrml");
  desc610.putEnumerated(idMd, idBlnM, idNrml);
  idOpct = charIDToTypeID("Opct");
  idPrc = charIDToTypeID("#Prc");
  desc610.putUnitDouble(idOpct, idPrc, 100.000000);
  var idSz = charIDToTypeID("Sz  ");
  var idPxl = charIDToTypeID("#Pxl");
  desc610.putUnitDouble(idSz, idPxl, strokeWidth);
  idClr = charIDToTypeID("Clr ");
  var desc611 = new ActionDescriptor();
  idRd = charIDToTypeID("Rd  ");
  desc611.putDouble(idRd, colourStroke);
  idGrn = charIDToTypeID("Grn ");
  desc611.putDouble(idGrn, colourStroke);
  idBl = charIDToTypeID("Bl  ");
  desc611.putDouble(idBl, colourStroke);
  idRGBC = charIDToTypeID("RGBC");
  desc610.putObject(idClr, idRGBC, desc611);
  idFrFX = charIDToTypeID("FrFX");
  desc609.putObject(idFrFX, idFrFX, desc610);
  idLefx = charIDToTypeID("Lefx");
  desc608.putObject(idT, idLefx, desc609);
  executeAction(idsetd, desc608, DialogModes.NO);

  // =======================================================
  idsetd = charIDToTypeID("setd");
  var desc612 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref150 = new ActionReference();
  idChnl = charIDToTypeID("Chnl");
  var idfsel = charIDToTypeID("fsel");
  ref150.putProperty(idChnl, idfsel);
  desc612.putReference(idnull, ref150);
  idT = charIDToTypeID("T   ");
  var ref151 = new ActionReference();
  idChnl = charIDToTypeID("Chnl");
  idChnl = charIDToTypeID("Chnl");
  idTrsp = charIDToTypeID("Trsp");
  ref151.putEnumerated(idChnl, idChnl, idTrsp);
  desc612.putReference(idT, ref151);
  executeAction(idsetd, desc612, DialogModes.NO);

  var myLayer = app.activeDocument.activeLayer;

  // =======================================================
  var idGrdn = charIDToTypeID("Grdn");
  var desc613 = new ActionDescriptor();
  var idFrom = charIDToTypeID("From");
  var desc614 = new ActionDescriptor();
  idHrzn = charIDToTypeID("Hrzn");
  idRlt = charIDToTypeID("#Rlt");
  desc614.putUnitDouble(idHrzn, idRlt, myLayer.bounds[0]/4 + myLayer.bounds[2]/4); // centre x // 1205.000000
  idVrtc = charIDToTypeID("Vrtc");
  idRlt = charIDToTypeID("#Rlt");
  desc614.putUnitDouble(idVrtc, idRlt, myLayer.bounds[1]/4 + myLayer.bounds[3]/4); // centre y // 1108.500000
  idPnt = charIDToTypeID("Pnt ");
  desc613.putObject(idFrom, idPnt, desc614);
  idT = charIDToTypeID("T   ");
  var desc615 = new ActionDescriptor();
  idHrzn = charIDToTypeID("Hrzn");
  idRlt = charIDToTypeID("#Rlt");
  desc615.putUnitDouble(idHrzn, idRlt, myLayer.bounds[0]/4 + myLayer.bounds[2]/4 - 20); // bottom left corner x // 1227.500000
  idVrtc = charIDToTypeID("Vrtc");
  idRlt = charIDToTypeID("#Rlt");
  desc615.putUnitDouble(idVrtc, idRlt, myLayer.bounds[1]/4 + myLayer.bounds[3]/4 + 20); // bottom left corner y // 1092.000000
  idPnt = charIDToTypeID("Pnt ");
  desc613.putObject(idT, idPnt, desc615);
  idType = charIDToTypeID("Type");
  var idGrdT = charIDToTypeID("GrdT");
  var idRflc = charIDToTypeID("Rflc");
  desc613.putEnumerated(idType, idGrdT, idRflc);
  var idDthr = charIDToTypeID("Dthr");
  desc613.putBoolean(idDthr, true);
  var idUsMs = charIDToTypeID("UsMs");
  desc613.putBoolean(idUsMs, true);
  var idGrad = charIDToTypeID("Grad");
  var desc616 = new ActionDescriptor();
  var idNm = charIDToTypeID("Nm  ");
  desc616.putString(idNm, "$$$/DefaultGradient/ForegroundToBackground=Foreground to Background");
  idGrdF = charIDToTypeID("GrdF");
  idGrdF = charIDToTypeID("GrdF");
  var idCstS = charIDToTypeID("CstS");
  desc616.putEnumerated(idGrdF, idGrdF, idCstS);
  var idIntr = charIDToTypeID("Intr");
  desc616.putDouble(idIntr, 4096.000000);
  idClrs = charIDToTypeID("Clrs");
  var list86 = new ActionList();
  var desc617 = new ActionDescriptor();
  idType = charIDToTypeID("Type");
  idClry = charIDToTypeID("Clry");
  idFrgC = charIDToTypeID("FrgC");
  desc617.putEnumerated(idType, idClry, idFrgC);
  idLctn = charIDToTypeID("Lctn");
  desc617.putInteger(idLctn, 0);
  idMdpn = charIDToTypeID("Mdpn");
  desc617.putInteger(idMdpn, 50);
  idClrt = charIDToTypeID("Clrt");
  list86.putObject(idClrt, desc617);
  var desc618 = new ActionDescriptor();
  idType = charIDToTypeID("Type");
  idClry = charIDToTypeID("Clry");
  var idBckC = charIDToTypeID("BckC");
  desc618.putEnumerated(idType, idClry, idBckC);
  idLctn = charIDToTypeID("Lctn");
  desc618.putInteger(idLctn, 4096);
  idMdpn = charIDToTypeID("Mdpn");
  desc618.putInteger(idMdpn, 50);
  idClrt = charIDToTypeID("Clrt");
  list86.putObject(idClrt, desc618);
  desc616.putList(idClrs, list86);
  idTrns = charIDToTypeID("Trns");
  var list87 = new ActionList();
  var desc619 = new ActionDescriptor();
  idOpct = charIDToTypeID("Opct");
  idPrc = charIDToTypeID("#Prc");
  desc619.putUnitDouble(idOpct, idPrc, 100.000000);
  idLctn = charIDToTypeID("Lctn");
  desc619.putInteger(idLctn, 0);
  idMdpn = charIDToTypeID("Mdpn");
  desc619.putInteger(idMdpn, 50);
  idTrnS = charIDToTypeID("TrnS");
  list87.putObject(idTrnS, desc619);
  var desc620 = new ActionDescriptor();
  idOpct = charIDToTypeID("Opct");
  idPrc = charIDToTypeID("#Prc");
  desc620.putUnitDouble(idOpct, idPrc, 100.000000);
  idLctn = charIDToTypeID("Lctn");
  desc620.putInteger(idLctn, 4096);
  idMdpn = charIDToTypeID("Mdpn");
  desc620.putInteger(idMdpn, 50);
  idTrnS = charIDToTypeID("TrnS");
  list87.putObject(idTrnS, desc620);
  desc616.putList(idTrns, list87);
  idGrdn = charIDToTypeID("Grdn");
  desc613.putObject(idGrad, idGrdn, desc616);
  executeAction(idGrdn, desc613, DialogModes.NO);

  // =======================================================
  idsetd = charIDToTypeID("setd");
  var desc621 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref152 = new ActionReference();
  idChnl = charIDToTypeID("Chnl");
  idfsel = charIDToTypeID("fsel");
  ref152.putProperty(idChnl, idfsel);
  desc621.putReference(idnull, ref152);
  idT = charIDToTypeID("T   ");
  idOrdn = charIDToTypeID("Ordn");
  var idNone = charIDToTypeID("None");
  desc621.putEnumerated(idT, idOrdn, idNone);
  executeAction(idsetd, desc621, DialogModes.NO);

  // =======================================================
  idslct = charIDToTypeID("slct");
  var desc622 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref153 = new ActionReference();
  idLyr = charIDToTypeID("Lyr ");
  ref153.putName(idLyr, "Legal");
  desc622.putReference(idnull, ref153);
  idMkVs = charIDToTypeID("MkVs");
  desc622.putBoolean(idMkVs, false);
  executeAction(idslct, desc622, DialogModes.NO);
}


function getAllIndexes(arr, val) {
  var indexes = [],
    i = -1;
  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;
}

function arrayIndexOf2(inputArray, reqValue, startingIndex) {
  var index = -1;
  startingIndex = typeof startingIndex !== 'undefined' ? startingIndex : 0;
  for (var i = startingIndex; i < inputArray.length; i++) {
    if (inputArray[i] == reqValue) {
      index = i;
      break;
    }
  }
  return index;
}

function frame(leftPix, topPix, rightPix, bottomPix) {
  var docRef = app.activeDocument;
  // Get width and height of art window
  var windowHeight = bottomPix - topPix;
  var windowWidth = rightPix - leftPix;

  // Get current size of art in layer
  var myLayer = docRef.layers.getByName("Layer 1");
  var imageHeight = myLayer.bounds[3] - myLayer.bounds[1];
  var imageWidth = myLayer.bounds[2] - myLayer.bounds[0];

  // Determine how much to scale the art by, such that it fits into the art window
  var percentageToScale = 100 * (Math.max(windowWidth / imageWidth.as('px'), windowHeight / imageHeight.as('px')));
  myLayer.resize(percentageToScale, percentageToScale, AnchorPosition.TOPLEFT);
  myLayer.move(activeDocument, ElementPlacement.PLACEATEND);

  // Select the art window
  var idsetd = charIDToTypeID("setd");
  var desc96 = new ActionDescriptor();
  var idnull = charIDToTypeID("null");
  var ref49 = new ActionReference();
  var idChnl = charIDToTypeID("Chnl");
  var idfsel = charIDToTypeID("fsel");
  ref49.putProperty(idChnl, idfsel);
  desc96.putReference(idnull, ref49);
  var idT = charIDToTypeID("T   ");
  var desc97 = new ActionDescriptor();
  var idTop = charIDToTypeID("Top ");
  var idPxl = charIDToTypeID("#Pxl");
  desc97.putUnitDouble(idTop, idPxl, topPix);
  var idLeft = charIDToTypeID("Left");
  var idPxl = charIDToTypeID("#Pxl");
  desc97.putUnitDouble(idLeft, idPxl, leftPix);
  var idBtom = charIDToTypeID("Btom");
  var idPxl = charIDToTypeID("#Pxl");
  desc97.putUnitDouble(idBtom, idPxl, bottomPix);
  var idRght = charIDToTypeID("Rght");
  var idPxl = charIDToTypeID("#Pxl");
  desc97.putUnitDouble(idRght, idPxl, rightPix);
  var idRctn = charIDToTypeID("Rctn");
  desc96.putObject(idT, idRctn, desc97);
  executeAction(idsetd, desc96, DialogModes.NO);

  // Align vertically to selection
  var idAlgn = charIDToTypeID("Algn");
  var desc100 = new ActionDescriptor();
  var idnull = charIDToTypeID("null");
  var ref51 = new ActionReference();
  var idLyr = charIDToTypeID("Lyr ");
  var idOrdn = charIDToTypeID("Ordn");
  var idTrgt = charIDToTypeID("Trgt");
  ref51.putEnumerated(idLyr, idOrdn, idTrgt);
  desc100.putReference(idnull, ref51);
  var idUsng = charIDToTypeID("Usng");
  var idADSt = charIDToTypeID("ADSt");
  var idAdCV = charIDToTypeID("AdCV");
  desc100.putEnumerated(idUsng, idADSt, idAdCV);
  executeAction(idAlgn, desc100, DialogModes.NO);

  // Align horizontally to selection
  var idAlgn = charIDToTypeID("Algn");
  var desc102 = new ActionDescriptor();
  var idnull = charIDToTypeID("null");
  var ref52 = new ActionReference();
  var idLyr = charIDToTypeID("Lyr ");
  var idOrdn = charIDToTypeID("Ordn");
  var idTrgt = charIDToTypeID("Trgt");
  ref52.putEnumerated(idLyr, idOrdn, idTrgt);
  desc102.putReference(idnull, ref52);
  var idUsng = charIDToTypeID("Usng");
  var idADSt = charIDToTypeID("ADSt");
  var idAdCH = charIDToTypeID("AdCH");
  desc102.putEnumerated(idUsng, idADSt, idAdCH);
  executeAction(idAlgn, desc102, DialogModes.NO);
}
