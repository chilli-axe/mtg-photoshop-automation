function contentExtend(file, ye) {
  // File path to main working directory
  var filePath = File($.fileName).parent.parent.fsName;
  $.evalFile(filePath + "/scripts/excessFunctions.jsx");

  var fileRef = new File(filePath + "/templates/MPCcrop.psd");

  app.open(fileRef);

  // Place it in the template
  var fileName;
  if (ye == 1) {
    app.load(file);
    fileName = file.name;
  } else {
    app.load(file[0]);
    fileName = file[0].name;
  }

  backFile = app.activeDocument;
  backFile.selection.selectAll();
  backFile.selection.copy();
  backFile.close(SaveOptions.DONOTSAVECHANGES);

  var docRef = app.activeDocument;

  // Paste and scale up to fill frame at correct size
  docRef.paste();
  var cardFrameName = "Card Size";
  var cardFrame = docRef.layers.getByName(cardFrameName);
  frame(docRef.layers.getByName("Layer 1"),
    cardFrame.bounds[0].as("px"),
    cardFrame.bounds[1].as("px"),
    cardFrame.bounds[2].as("px"),
    cardFrame.bounds[3].as("px"));

  // Content aware fill the border - from script listener
  var idslct = charIDToTypeID("slct");
  var desc6 = new ActionDescriptor();
  var idnull = charIDToTypeID("null");
  var ref5 = new ActionReference();
  var idLyr = charIDToTypeID("Lyr ");
  ref5.putName(idLyr, "bleeding area");
  desc6.putReference(idnull, ref5);
  var idMkVs = charIDToTypeID("MkVs");
  desc6.putBoolean(idMkVs, false);
  var idLyrI = charIDToTypeID("LyrI");
  var list1 = new ActionList();
  list1.putInteger(14);
  desc6.putList(idLyrI, list1);
  executeAction(idslct, desc6, DialogModes.NO);

  var idsetd = charIDToTypeID("setd");
  var desc8 = new ActionDescriptor();
  var idnull = charIDToTypeID("null");
  var ref6 = new ActionReference();
  var idChnl = charIDToTypeID("Chnl");
  var idfsel = charIDToTypeID("fsel");
  ref6.putProperty(idChnl, idfsel);
  desc8.putReference(idnull, ref6);
  var idT = charIDToTypeID("T   ");
  var ref7 = new ActionReference();
  var idChnl = charIDToTypeID("Chnl");
  var idChnl = charIDToTypeID("Chnl");
  var idTrsp = charIDToTypeID("Trsp");
  ref7.putEnumerated(idChnl, idChnl, idTrsp);
  desc8.putReference(idT, ref7);
  executeAction(idsetd, desc8, DialogModes.NO);

  // Expand selection by 4 pixels
  var idExpn = charIDToTypeID("Expn");
  var desc12 = new ActionDescriptor();
  var idBy = charIDToTypeID("By  ");
  var idPxl = charIDToTypeID("#Pxl");
  desc12.putUnitDouble(idBy, idPxl, 4.000000);
  var idselectionModifyEffectAtCanvasBounds = stringIDToTypeID("selectionModifyEffectAtCanvasBounds");
  desc12.putBoolean(idselectionModifyEffectAtCanvasBounds, false);
  executeAction(idExpn, desc12, DialogModes.NO);

  // Smooth selection by 4 pixels
  var idSmth = charIDToTypeID("Smth");
  var desc16 = new ActionDescriptor();
  var idRds = charIDToTypeID("Rds ");
  var idPxl = charIDToTypeID("#Pxl");
  desc16.putUnitDouble(idRds, idPxl, 4.000000);
  var idselectionModifyEffectAtCanvasBounds = stringIDToTypeID("selectionModifyEffectAtCanvasBounds");
  desc16.putBoolean(idselectionModifyEffectAtCanvasBounds, false);
  executeAction(idSmth, desc16, DialogModes.NO);

  // Switch to card layer
  var idslct = charIDToTypeID("slct");
  var desc18 = new ActionDescriptor();
  var idnull = charIDToTypeID("null");
  var ref9 = new ActionReference();
  var idLyr = charIDToTypeID("Lyr ");
  ref9.putName(idLyr, "Layer 1");
  desc18.putReference(idnull, ref9);
  var idMkVs = charIDToTypeID("MkVs");
  desc18.putBoolean(idMkVs, false);
  var idLyrI = charIDToTypeID("LyrI");
  var list3 = new ActionList();
  list3.putInteger(115);
  desc18.putList(idLyrI, list3);
  executeAction(idslct, desc18, DialogModes.NO);

  // Hide bleed edge layer
  var idHd = charIDToTypeID("Hd  ");
  var desc81 = new ActionDescriptor();
  var idnull = charIDToTypeID("null");
  var list5 = new ActionList();
  var ref36 = new ActionReference();
  var idLyr = charIDToTypeID("Lyr ");
  ref36.putName(idLyr, "bleeding area");
  list5.putReference(ref36);
  desc81.putList(idnull, list5);
  executeAction(idHd, desc81, DialogModes.NO);

  // Content aware fill
  var idFl = charIDToTypeID("Fl  ");
  var desc22 = new ActionDescriptor();
  var idUsng = charIDToTypeID("Usng");
  var idFlCn = charIDToTypeID("FlCn");
  var idcontentAware = stringIDToTypeID("contentAware");
  desc22.putEnumerated(idUsng, idFlCn, idcontentAware);
  var idcontentAwareColorAdaptationFill = stringIDToTypeID("contentAwareColorAdaptationFill");
  desc22.putBoolean(idcontentAwareColorAdaptationFill, true);
  var idOpct = charIDToTypeID("Opct");
  var idPrc = charIDToTypeID("#Prc");
  desc22.putUnitDouble(idOpct, idPrc, 100.000000);
  var idMd = charIDToTypeID("Md  ");
  var idBlnM = charIDToTypeID("BlnM");
  var idNrml = charIDToTypeID("Nrml");
  desc22.putEnumerated(idMd, idBlnM, idNrml);
  executeAction(idFl, desc22, DialogModes.NO);

  //*/

  // Resize to 600 DPI
  var idImgS = charIDToTypeID("ImgS");
  var desc113 = new ActionDescriptor();
  var idWdth = charIDToTypeID("Wdth");
  var idPrc = charIDToTypeID("#Prc");
  desc113.putUnitDouble(idWdth, idPrc, 30.000000);
  var idscaleStyles = stringIDToTypeID("scaleStyles");
  desc113.putBoolean(idscaleStyles, true);
  var idCnsP = charIDToTypeID("CnsP");
  desc113.putBoolean(idCnsP, true);
  var idIntr = charIDToTypeID("Intr");
  var idIntp = charIDToTypeID("Intp");
  var idautomaticInterpolation = stringIDToTypeID("automaticInterpolation");
  desc113.putEnumerated(idIntr, idIntp, idautomaticInterpolation);
  executeAction(idImgS, desc113, DialogModes.NO);


  // ----------Save in the out folder (in the source format) ----------
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
  var filename = filePath + '/out/border/' + fileName;
  desc3.putPath(idIn, new File(filename));
  var idCpy = charIDToTypeID("Cpy ");
  desc3.putBoolean(idCpy, true);
  executeAction(idsave, desc3, DialogModes.NO);

  // Close the thing without saving
  docRef.close(SaveOptions.DONOTSAVECHANGES);
}
