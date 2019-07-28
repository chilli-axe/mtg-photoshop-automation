function positionArt(docRef) {
  var topPix = 212;
  var bottomPix = 1039;
  var leftPix = 104;
  var rightPix = 1240;

  // Script listener nonsense to move the art into the
  // top left corner of the window
  // =======================================================
  var idsetd = charIDToTypeID("setd");
  var desc2 = new ActionDescriptor();
  var idnull = charIDToTypeID("null");
  var ref1 = new ActionReference();
  var idChnl = charIDToTypeID("Chnl");
  var idfsel = charIDToTypeID("fsel");
  ref1.putProperty(idChnl, idfsel);
  desc2.putReference(idnull, ref1);
  var idT = charIDToTypeID("T   ");
  var desc3 = new ActionDescriptor();
  var idTop = charIDToTypeID("Top ");
  var idRlt = charIDToTypeID("#Rlt");
  desc3.putUnitDouble(idTop, idRlt, topPix);
  var idLeft = charIDToTypeID("Left");
  idRlt = charIDToTypeID("#Rlt");
  desc3.putUnitDouble(idLeft, idRlt, leftPix);
  var idBtom = charIDToTypeID("Btom");
  idRlt = charIDToTypeID("#Rlt");
  desc3.putUnitDouble(idBtom, idRlt, bottomPix);
  var idRght = charIDToTypeID("Rght");
  idRlt = charIDToTypeID("#Rlt");
  desc3.putUnitDouble(idRght, idRlt, rightPix);
  var idRctn = charIDToTypeID("Rctn");
  desc2.putObject(idT, idRctn, desc3);
  executeAction(idsetd, desc2, DialogModes.NO);

  // =======================================================
  var idslct = charIDToTypeID("slct");
  var desc13 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref7 = new ActionReference();
  var idLyr = charIDToTypeID("Lyr ");
  ref7.putName(idLyr, "Layer 1");
  desc13.putReference(idnull, ref7);
  var idMkVs = charIDToTypeID("MkVs");
  desc13.putBoolean(idMkVs, false);
  executeAction(idslct, desc13, DialogModes.NO);

  // =======================================================
  idslct = charIDToTypeID("slct");
  var desc14 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref8 = new ActionReference();
  var idmoveTool = stringIDToTypeID("moveTool");
  ref8.putClass(idmoveTool);
  desc14.putReference(idnull, ref8);
  var iddontRecord = stringIDToTypeID("dontRecord");
  desc14.putBoolean(iddontRecord, true);
  var idforceNotify = stringIDToTypeID("forceNotify");
  desc14.putBoolean(idforceNotify, true);
  executeAction(idslct, desc14, DialogModes.NO);

  // =======================================================
  var idAlgn = charIDToTypeID("Algn");
  var desc15 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref9 = new ActionReference();
  idLyr = charIDToTypeID("Lyr ");
  var idOrdn = charIDToTypeID("Ordn");
  var idTrgt = charIDToTypeID("Trgt");
  ref9.putEnumerated(idLyr, idOrdn, idTrgt);
  desc15.putReference(idnull, ref9);
  var idUsng = charIDToTypeID("Usng");
  var idADSt = charIDToTypeID("ADSt");
  var idAdTp = charIDToTypeID("AdTp");
  desc15.putEnumerated(idUsng, idADSt, idAdTp);
  executeAction(idAlgn, desc15, DialogModes.NO);

  // =======================================================
  idAlgn = charIDToTypeID("Algn");
  var desc16 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref10 = new ActionReference();
  idLyr = charIDToTypeID("Lyr ");
  idOrdn = charIDToTypeID("Ordn");
  idTrgt = charIDToTypeID("Trgt");
  ref10.putEnumerated(idLyr, idOrdn, idTrgt);
  desc16.putReference(idnull, ref10);
  idUsng = charIDToTypeID("Usng");
  idADSt = charIDToTypeID("ADSt");
  var idAdLf = charIDToTypeID("AdLf");
  desc16.putEnumerated(idUsng, idADSt, idAdLf);
  executeAction(idAlgn, desc16, DialogModes.NO);

  // Scale it up to the window size
  var windowHeight = bottomPix - topPix;
  var windowWidth = rightPix - leftPix;

  var myLayer = docRef.layers.getByName("Layer 1");
  var imageHeight = myLayer.bounds[3] - myLayer.bounds[1];
  var imageWidth = myLayer.bounds[2] - myLayer.bounds[0];

  var percentageToScale = 200 * (Math.max(windowWidth / imageWidth.as('px'), windowHeight / imageHeight.as('px')));
  myLayer.resize(percentageToScale, percentageToScale, AnchorPosition.TOPLEFT);

  // Move layer to back
  myLayer.move(activeDocument, ElementPlacement.PLACEATEND);

  // Script listener nonsense to finalise everything
  // =======================================================
  idAlgn = charIDToTypeID("Algn");
  var desc112 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref63 = new ActionReference();
  idLyr = charIDToTypeID("Lyr ");
  idOrdn = charIDToTypeID("Ordn");
  idTrgt = charIDToTypeID("Trgt");
  ref63.putEnumerated(idLyr, idOrdn, idTrgt);
  desc112.putReference(idnull, ref63);
  idUsng = charIDToTypeID("Usng");
  idADSt = charIDToTypeID("ADSt");
  var idAdCV = charIDToTypeID("AdCV");
  desc112.putEnumerated(idUsng, idADSt, idAdCV);
  executeAction(idAlgn, desc112, DialogModes.NO);

  // =======================================================
  idAlgn = charIDToTypeID("Algn");
  var desc113 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref64 = new ActionReference();
  idLyr = charIDToTypeID("Lyr ");
  idOrdn = charIDToTypeID("Ordn");
  idTrgt = charIDToTypeID("Trgt");
  ref64.putEnumerated(idLyr, idOrdn, idTrgt);
  desc113.putReference(idnull, ref64);
  idUsng = charIDToTypeID("Usng");
  idADSt = charIDToTypeID("ADSt");
  var idAdCH = charIDToTypeID("AdCH");
  desc113.putEnumerated(idUsng, idADSt, idAdCH);
  executeAction(idAlgn, desc113, DialogModes.NO);
}

function positionArtFull(docRef) {
  var topPix = 107/2 - 1;
  var bottomPix = 3468/2 + 1;
  var leftPix = 107/2 - 1;
  var rightPix = 2579/2 + 1;

  // Script listener nonsense to move the art into the
  // top left corner of the window
  // =======================================================
  var idsetd = charIDToTypeID("setd");
  var desc2 = new ActionDescriptor();
  var idnull = charIDToTypeID("null");
  var ref1 = new ActionReference();
  var idChnl = charIDToTypeID("Chnl");
  var idfsel = charIDToTypeID("fsel");
  ref1.putProperty(idChnl, idfsel);
  desc2.putReference(idnull, ref1);
  var idT = charIDToTypeID("T   ");
  var desc3 = new ActionDescriptor();
  var idTop = charIDToTypeID("Top ");
  var idRlt = charIDToTypeID("#Rlt");
  desc3.putUnitDouble(idTop, idRlt, topPix);
  var idLeft = charIDToTypeID("Left");
  idRlt = charIDToTypeID("#Rlt");
  desc3.putUnitDouble(idLeft, idRlt, leftPix);
  var idBtom = charIDToTypeID("Btom");
  idRlt = charIDToTypeID("#Rlt");
  desc3.putUnitDouble(idBtom, idRlt, bottomPix);
  var idRght = charIDToTypeID("Rght");
  idRlt = charIDToTypeID("#Rlt");
  desc3.putUnitDouble(idRght, idRlt, rightPix);
  var idRctn = charIDToTypeID("Rctn");
  desc2.putObject(idT, idRctn, desc3);
  executeAction(idsetd, desc2, DialogModes.NO);

  // =======================================================
  var idslct = charIDToTypeID("slct");
  var desc13 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref7 = new ActionReference();
  var idLyr = charIDToTypeID("Lyr ");
  ref7.putName(idLyr, "Layer 1");
  desc13.putReference(idnull, ref7);
  var idMkVs = charIDToTypeID("MkVs");
  desc13.putBoolean(idMkVs, false);
  executeAction(idslct, desc13, DialogModes.NO);

  // =======================================================
  idslct = charIDToTypeID("slct");
  var desc14 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref8 = new ActionReference();
  var idmoveTool = stringIDToTypeID("moveTool");
  ref8.putClass(idmoveTool);
  desc14.putReference(idnull, ref8);
  var iddontRecord = stringIDToTypeID("dontRecord");
  desc14.putBoolean(iddontRecord, true);
  var idforceNotify = stringIDToTypeID("forceNotify");
  desc14.putBoolean(idforceNotify, true);
  executeAction(idslct, desc14, DialogModes.NO);

  // =======================================================
  var idAlgn = charIDToTypeID("Algn");
  var desc15 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref9 = new ActionReference();
  idLyr = charIDToTypeID("Lyr ");
  var idOrdn = charIDToTypeID("Ordn");
  var idTrgt = charIDToTypeID("Trgt");
  ref9.putEnumerated(idLyr, idOrdn, idTrgt);
  desc15.putReference(idnull, ref9);
  var idUsng = charIDToTypeID("Usng");
  var idADSt = charIDToTypeID("ADSt");
  var idAdTp = charIDToTypeID("AdTp");
  desc15.putEnumerated(idUsng, idADSt, idAdTp);
  executeAction(idAlgn, desc15, DialogModes.NO);

  // =======================================================
  idAlgn = charIDToTypeID("Algn");
  var desc16 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref10 = new ActionReference();
  idLyr = charIDToTypeID("Lyr ");
  idOrdn = charIDToTypeID("Ordn");
  idTrgt = charIDToTypeID("Trgt");
  ref10.putEnumerated(idLyr, idOrdn, idTrgt);
  desc16.putReference(idnull, ref10);
  idUsng = charIDToTypeID("Usng");
  idADSt = charIDToTypeID("ADSt");
  var idAdLf = charIDToTypeID("AdLf");
  desc16.putEnumerated(idUsng, idADSt, idAdLf);
  executeAction(idAlgn, desc16, DialogModes.NO);

  // Scale it up to the window size
  var windowHeight = bottomPix - topPix;
  var windowWidth = rightPix - leftPix;

  var myLayer = docRef.layers.getByName("Layer 1");
  var imageHeight = myLayer.bounds[3] - myLayer.bounds[1];
  var imageWidth = myLayer.bounds[2] - myLayer.bounds[0];

  var percentageToScale = 200 * (Math.max(windowWidth / imageWidth.as('px'), windowHeight / imageHeight.as('px')));
  myLayer.resize(percentageToScale, percentageToScale, AnchorPosition.TOPLEFT);

  // Move layer to back
  myLayer.move(activeDocument, ElementPlacement.PLACEATEND);

  // Script listener nonsense to finalise everything
  // =======================================================
  idAlgn = charIDToTypeID("Algn");
  var desc112 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref63 = new ActionReference();
  idLyr = charIDToTypeID("Lyr ");
  idOrdn = charIDToTypeID("Ordn");
  idTrgt = charIDToTypeID("Trgt");
  ref63.putEnumerated(idLyr, idOrdn, idTrgt);
  desc112.putReference(idnull, ref63);
  idUsng = charIDToTypeID("Usng");
  idADSt = charIDToTypeID("ADSt");
  var idAdCV = charIDToTypeID("AdCV");
  desc112.putEnumerated(idUsng, idADSt, idAdCV);
  executeAction(idAlgn, desc112, DialogModes.NO);

  // =======================================================
  idAlgn = charIDToTypeID("Algn");
  var desc113 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref64 = new ActionReference();
  idLyr = charIDToTypeID("Lyr ");
  idOrdn = charIDToTypeID("Ordn");
  idTrgt = charIDToTypeID("Trgt");
  ref64.putEnumerated(idLyr, idOrdn, idTrgt);
  desc113.putReference(idnull, ref64);
  idUsng = charIDToTypeID("Usng");
  idADSt = charIDToTypeID("ADSt");
  var idAdCH = charIDToTypeID("AdCH");
  desc113.putEnumerated(idUsng, idADSt, idAdCH);
  executeAction(idAlgn, desc113, DialogModes.NO);
}
