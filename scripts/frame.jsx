function positionArt(docRef) {
  var topPix = 423;
  var bottomPix = 2078;
  var leftPix = 208;
  var rightPix = 2479;
  frame(docRef, topPix, bottomPix, leftPix, rightPix);
}

function positionArtFull(docRef) {
  var topPix = 107;
  var bottomPix = 3468;
  var leftPix = 107;
  var rightPix = 2579;
  frame(docRef, topPix, bottomPix, leftPix, rightPix);
}

function positionArtBasic(docRef) {
  var topPix = 0;
  var bottomPix = 4012;
  var leftPix = 0;
  var rightPix = 3287;
  frame(docRef, topPix, bottomPix, leftPix, rightPix);
}

function frame(docRef, topPix, bottomPix, leftPix, rightPix) {
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
