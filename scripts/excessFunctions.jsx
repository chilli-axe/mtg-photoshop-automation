// Change this to 50 if your art is too large when running the script
var artScaleFactor = 100;

// Resize text to fit text box
function scaleTextToFitBox(textLayer, referenceHeight) {
  // Step down font size until text fits within the text box
  startingFontSize = textLayer.textItem.size;
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
  app.activeDocument.selection.select([
    [left, top],
    [right, top],
    [right, bottom],
    [left, bottom]
  ]);

  // Only proceed here if the text layer potentially needs to be shifted up
  // (If the text isn't long enough, the code will error when attempting to ctrl J)
  if (getRealTextLayerDimensions(textLayer).width + textLayer.bounds[0] < left) return;

  // get PT Top Reference layer
  var ptTopReference = textAndIcons.layers.getByName("PT Top Reference");

  // ctrl-j the selection on the rasterised text to a new layer
  // TODO: Ensure there are pixels in the selection before running this block
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
  if (pixelOverlap > 0) textLayer.applyOffset(0, pixelOverlapUnit, OffsetUndefinedAreas.SETTOBACKGROUND);
}

function gradient(textAndIcons, rarity) {
  // Select the stroke colour
  var strokeColour = 0.000000;
  var strokeWidth = 6.000000;
  var symbolLayer = textAndIcons.layers.getByName("Expansion Symbol");

  if (rarity == "uncommon" | rarity == "rare" || rarity == "mythic") {
    // Switch on gradient layer
    // var textAndIcons = app.activeDocument.layers.getByName("Text and Icons");
    var gradientLayer = textAndIcons.layers.getByName(rarity);
    gradientLayer.visible = true;

    // Align gradient layer to the expansion symbol
    app.activeDocument.activeLayer = symbolLayer;

    // =======================================================
    var idsetd = charIDToTypeID("setd");
    var desc62 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref31 = new ActionReference();
    var idChnl = charIDToTypeID("Chnl");
    var idfsel = charIDToTypeID("fsel");
    ref31.putProperty(idChnl, idfsel);
    desc62.putReference(idnull, ref31);
    var idT = charIDToTypeID("T   ");
    var ref32 = new ActionReference();
    var idChnl = charIDToTypeID("Chnl");
    var idChnl = charIDToTypeID("Chnl");
    var idTrsp = charIDToTypeID("Trsp");
    ref32.putEnumerated(idChnl, idChnl, idTrsp);
    desc62.putReference(idT, ref32);
    executeAction(idsetd, desc62, DialogModes.NO);

    app.activeDocument.activeLayer = gradientLayer;

    // =======================================================
    var idslct = charIDToTypeID("slct");
    var desc64 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref34 = new ActionReference();
    var idmoveTool = stringIDToTypeID("moveTool");
    ref34.putClass(idmoveTool);
    desc64.putReference(idnull, ref34);
    var iddontRecord = stringIDToTypeID("dontRecord");
    desc64.putBoolean(iddontRecord, true);
    var idforceNotify = stringIDToTypeID("forceNotify");
    desc64.putBoolean(idforceNotify, true);
    executeAction(idslct, desc64, DialogModes.NO);

    // =======================================================
    var idAlgn = charIDToTypeID("Algn");
    var desc66 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref35 = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref35.putEnumerated(idLyr, idOrdn, idTrgt);
    desc66.putReference(idnull, ref35);
    var idUsng = charIDToTypeID("Usng");
    var idADSt = charIDToTypeID("ADSt");
    var idAdCV = charIDToTypeID("AdCV");
    desc66.putEnumerated(idUsng, idADSt, idAdCV);
    executeAction(idAlgn, desc66, DialogModes.NO);

    // =======================================================
    var idAlgn = charIDToTypeID("Algn");
    var desc68 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref36 = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref36.putEnumerated(idLyr, idOrdn, idTrgt);
    desc68.putReference(idnull, ref36);
    var idUsng = charIDToTypeID("Usng");
    var idADSt = charIDToTypeID("ADSt");
    var idAdCH = charIDToTypeID("AdCH");
    desc68.putEnumerated(idUsng, idADSt, idAdCH);
    executeAction(idAlgn, desc68, DialogModes.NO);

    // =======================================================
    var idsetd = charIDToTypeID("setd");
    var desc70 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref37 = new ActionReference();
    var idChnl = charIDToTypeID("Chnl");
    var idfsel = charIDToTypeID("fsel");
    ref37.putProperty(idChnl, idfsel);
    desc70.putReference(idnull, ref37);
    var idT = charIDToTypeID("T   ");
    var idOrdn = charIDToTypeID("Ordn");
    var idNone = charIDToTypeID("None");
    desc70.putEnumerated(idT, idOrdn, idNone);
    executeAction(idsetd, desc70, DialogModes.NO);
  } else {
    // Common
    strokeColour = 255.000000;
  }

  // Apply stroke
  app.activeDocument.activeLayer = symbolLayer;

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
  desc611.putDouble(idRd, strokeColour);
  idGrn = charIDToTypeID("Grn ");
  desc611.putDouble(idGrn, strokeColour);
  idBl = charIDToTypeID("Bl  ");
  desc611.putDouble(idBl, strokeColour);
  idRGBC = charIDToTypeID("RGBC");
  desc610.putObject(idClr, idRGBC, desc611);
  idFrFX = charIDToTypeID("FrFX");
  desc609.putObject(idFrFX, idFrFX, desc610);
  idLefx = charIDToTypeID("Lefx");
  desc608.putObject(idT, idLefx, desc609);
  executeAction(idsetd, desc608, DialogModes.NO);
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
  var percentageToScale = artScaleFactor * (Math.max(windowWidth / imageWidth.as('px'), windowHeight / imageHeight.as('px')));
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
