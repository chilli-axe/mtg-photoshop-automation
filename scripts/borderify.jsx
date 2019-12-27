function borderify(file) {
  // File path to main working directory
  var filePath = File($.fileName).parent.parent.fsName;

  // =======================================================
  var idOpn = charIDToTypeID("Opn ");
  var desc21 = new ActionDescriptor();
  var idnull = charIDToTypeID("null");
  desc21.putPath(idnull, new File(filePath + "/templates/MPCcrop.psd"));
  executeAction(idOpn, desc21, DialogModes.NO);

  // =======================================================
  var idPlc = charIDToTypeID("Plc ");
  var desc22 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  desc22.putPath(idnull, new File(String(file)));
  var idFTcs = charIDToTypeID("FTcs");
  var idQCSt = charIDToTypeID("QCSt");
  var idQcsa = charIDToTypeID("Qcsa");
  desc22.putEnumerated(idFTcs, idQCSt, idQcsa);
  var idOfst = charIDToTypeID("Ofst");
  var desc23 = new ActionDescriptor();
  var idHrzn = charIDToTypeID("Hrzn");
  var idRlt = charIDToTypeID("#Rlt");
  desc23.putUnitDouble(idHrzn, idRlt, 0.000000);
  var idVrtc = charIDToTypeID("Vrtc");
  idRlt = charIDToTypeID("#Rlt");
  desc23.putUnitDouble(idVrtc, idRlt, -0.000000);
  idOfst = charIDToTypeID("Ofst");
  desc22.putObject(idOfst, idOfst, desc23);
  var idWdth = charIDToTypeID("Wdth");
  var idPrc = charIDToTypeID("#Prc");
  desc22.putUnitDouble(idWdth, idPrc, 93.859572);
  // desc22.putUnitDouble( idWdth, idPrc, 112.55 );
  var idHght = charIDToTypeID("Hght");
  idPrc = charIDToTypeID("#Prc");
  desc22.putUnitDouble(idHght, idPrc, 93.855091);
  // desc22.putUnitDouble( idHght, idPrc, 112.55 );
  var idLnkd = charIDToTypeID("Lnkd");
  desc22.putBoolean(idLnkd, true);
  executeAction(idPlc, desc22, DialogModes.NO);

  // =======================================================
  var idmove = charIDToTypeID("move");
  var desc24 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref15 = new ActionReference();
  var idLyr = charIDToTypeID("Lyr ");
  var idOrdn = charIDToTypeID("Ordn");
  var idTrgt = charIDToTypeID("Trgt");
  ref15.putEnumerated(idLyr, idOrdn, idTrgt);
  desc24.putReference(idnull, ref15);
  var idT = charIDToTypeID("T   ");
  var ref16 = new ActionReference();
  idLyr = charIDToTypeID("Lyr ");
  ref16.putIndex(idLyr, 3);
  desc24.putReference(idT, ref16);
  var idAdjs = charIDToTypeID("Adjs");
  desc24.putBoolean(idAdjs, false);
  var idVrsn = charIDToTypeID("Vrsn");
  desc24.putInteger(idVrsn, 5);
  executeAction(idmove, desc24, DialogModes.NO);

  // Flatten the image and brighten it up a little
  app.activeDocument.flatten();
  // =======================================================
  var idMk = charIDToTypeID("Mk  ");
  var desc34 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref22 = new ActionReference();
  var idAdjL = charIDToTypeID("AdjL");
  ref22.putClass(idAdjL);
  desc34.putReference(idnull, ref22);
  var idUsng = charIDToTypeID("Usng");
  var desc35 = new ActionDescriptor();
  var idType = charIDToTypeID("Type");
  var desc36 = new ActionDescriptor();
  var idpresetKind = stringIDToTypeID("presetKind");
  var idpresetKindType = stringIDToTypeID("presetKindType");
  var idpresetKindDefault = stringIDToTypeID("presetKindDefault");
  desc36.putEnumerated(idpresetKind, idpresetKindType, idpresetKindDefault);
  var idExps = charIDToTypeID("Exps");
  desc36.putDouble(idExps, 0.000000);
  idOfst = charIDToTypeID("Ofst");
  desc36.putDouble(idOfst, 0.000000);
  var idgammaCorrection = stringIDToTypeID("gammaCorrection");
  desc36.putDouble(idgammaCorrection, 1.000000);
  idExps = charIDToTypeID("Exps");
  desc35.putObject(idType, idExps, desc36);
  idAdjL = charIDToTypeID("AdjL");
  desc34.putObject(idUsng, idAdjL, desc35);
  executeAction(idMk, desc34, DialogModes.NO);

  // You can toggle comments here to do some minor brightness/gamma adjusting
  // I don't think it's necessary but if you want your cards a touch lighter
  // then you might use it
  // =======================================================
  var idsetd = charIDToTypeID("setd");
  var desc37 = new ActionDescriptor();
  idnull = charIDToTypeID("null");
  var ref23 = new ActionReference();
  idAdjL = charIDToTypeID("AdjL");
  idOrdn = charIDToTypeID("Ordn");
  idTrgt = charIDToTypeID("Trgt");
  ref23.putEnumerated(idAdjL, idOrdn, idTrgt);
  desc37.putReference(idnull, ref23);
  idT = charIDToTypeID("T   ");
  var desc38 = new ActionDescriptor();
  idpresetKind = stringIDToTypeID("presetKind");
  idpresetKindType = stringIDToTypeID("presetKindType");
  var idpresetKindCustom = stringIDToTypeID("presetKindCustom");
  desc38.putEnumerated(idpresetKind, idpresetKindType, idpresetKindCustom);
  idExps = charIDToTypeID("Exps");
  // desc38.putDouble( idExps, 0.330000 );
  desc38.putDouble(idExps, 0.000000);
  idgammaCorrection = stringIDToTypeID("gammaCorrection");
  // desc38.putDouble( idgammaCorrection, 1.040000 );
  desc38.putDouble(idgammaCorrection, 1.000000);
  idExps = charIDToTypeID("Exps");
  desc37.putObject(idT, idExps, desc38);
  executeAction(idsetd, desc37, DialogModes.NO);
  // =======================================================

  // =======================================================
  var idsave = charIDToTypeID("save");
  var desc25 = new ActionDescriptor();
  var idAs = charIDToTypeID("As  ");
  var desc26 = new ActionDescriptor();
  var idPGIT = charIDToTypeID("PGIT");
  idPGIT = charIDToTypeID("PGIT");
  var idPGIN = charIDToTypeID("PGIN");
  desc26.putEnumerated(idPGIT, idPGIT, idPGIN);
  var idPNGf = charIDToTypeID("PNGf");
  idPNGf = charIDToTypeID("PNGf");
  var idPGAd = charIDToTypeID("PGAd");
  desc26.putEnumerated(idPNGf, idPNGf, idPGAd);
  var idPNGF = charIDToTypeID("PNGF");
  desc25.putObject(idAs, idPNGF, desc26);
  var idIn = charIDToTypeID("In  ");
  desc25.putPath(idIn, new File(filePath + "/out/border/" + file.name));
  var idCpy = charIDToTypeID("Cpy ");
  desc25.putBoolean(idCpy, true);
  executeAction(idsave, desc25, DialogModes.NO);

  // =======================================================
  var idCls = charIDToTypeID("Cls ");
  var desc27 = new ActionDescriptor();
  var idSvng = charIDToTypeID("Svng");
  var idYsN = charIDToTypeID("YsN ");
  var idN = charIDToTypeID("N   ");
  desc27.putEnumerated(idSvng, idYsN, idN);
  executeAction(idCls, desc27, DialogModes.NO);
}
