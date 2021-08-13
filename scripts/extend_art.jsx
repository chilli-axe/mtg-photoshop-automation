function extend_art(file) {
    /**
     * Extend the given file by 10% horizontally and 5% vertically, filling the new pixels with content-aware fill, and save the
     * resulting image to /art.
     */

    var file_path = File($.fileName).parent.parent.fsName;
    var file_name = file.name;

    app.load(file);

    app.activeDocument.resizeCanvas(new UnitValue(110, "%"), new UnitValue(105, "%"), AnchorPosition.BOTTOMCENTER);

    // =======================================================
    var idslct = charIDToTypeID("slct");
    var desc179 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref34 = new ActionReference();
    var idmagicWandTool = stringIDToTypeID("magicWandTool");
    ref34.putClass(idmagicWandTool);
    desc179.putReference(idnull, ref34);
    var iddontRecord = stringIDToTypeID("dontRecord");
    desc179.putBoolean(iddontRecord, true);
    var idforceNotify = stringIDToTypeID("forceNotify");
    desc179.putBoolean(idforceNotify, true);
    executeAction(idslct, desc179, DialogModes.NO);

    // =======================================================
    var idsetd = charIDToTypeID("setd");
    var desc180 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref35 = new ActionReference();
    var idChnl = charIDToTypeID("Chnl");
    var idfsel = charIDToTypeID("fsel");
    ref35.putProperty(idChnl, idfsel);
    desc180.putReference(idnull, ref35);
    var idT = charIDToTypeID("T   ");
    var desc181 = new ActionDescriptor();
    var idHrzn = charIDToTypeID("Hrzn");
    var idRlt = charIDToTypeID("#Rlt");
    desc181.putUnitDouble(idHrzn, idRlt, 0.000000);
    var idVrtc = charIDToTypeID("Vrtc");
    var idRlt = charIDToTypeID("#Rlt");
    desc181.putUnitDouble(idVrtc, idRlt, 0.000000);
    var idPnt = charIDToTypeID("Pnt ");
    desc180.putObject(idT, idPnt, desc181);
    var idTlrn = charIDToTypeID("Tlrn");
    desc180.putInteger(idTlrn, 0);
    var idAntA = charIDToTypeID("AntA");
    desc180.putBoolean(idAntA, true);
    executeAction(idsetd, desc180, DialogModes.NO);

    // =======================================================
    var idExpn = charIDToTypeID("Expn");
    var desc185 = new ActionDescriptor();
    var idBy = charIDToTypeID("By  ");
    var idPxl = charIDToTypeID("#Pxl");
    desc185.putUnitDouble(idBy, idPxl, 8.000000);
    var idselectionModifyEffectAtCanvasBounds = stringIDToTypeID("selectionModifyEffectAtCanvasBounds");
    desc185.putBoolean(idselectionModifyEffectAtCanvasBounds, false);
    executeAction(idExpn, desc185, DialogModes.NO);

    // =======================================================
    var idSmth = charIDToTypeID("Smth");
    var desc189 = new ActionDescriptor();
    var idRds = charIDToTypeID("Rds ");
    var idPxl = charIDToTypeID("#Pxl");
    desc189.putUnitDouble(idRds, idPxl, 4.000000);
    var idselectionModifyEffectAtCanvasBounds = stringIDToTypeID("selectionModifyEffectAtCanvasBounds");
    desc189.putBoolean(idselectionModifyEffectAtCanvasBounds, false);
    executeAction(idSmth, desc189, DialogModes.NO);

    // =======================================================
    var idFl = charIDToTypeID("Fl  ");
    var desc192 = new ActionDescriptor();
    var idUsng = charIDToTypeID("Usng");
    var idFlCn = charIDToTypeID("FlCn");
    var idcontentAware = stringIDToTypeID("contentAware");
    desc192.putEnumerated(idUsng, idFlCn, idcontentAware);
    var idcontentAwareColorAdaptationFill = stringIDToTypeID("contentAwareColorAdaptationFill");
    desc192.putBoolean(idcontentAwareColorAdaptationFill, true);
    var idOpct = charIDToTypeID("Opct");
    var idPrc = charIDToTypeID("#Prc");
    desc192.putUnitDouble(idOpct, idPrc, 100.000000);
    var idMd = charIDToTypeID("Md  ");
    var idBlnM = charIDToTypeID("BlnM");
    var idNrml = charIDToTypeID("Nrml");
    desc192.putEnumerated(idMd, idBlnM, idNrml);
    executeAction(idFl, desc192, DialogModes.NO);

    // =======================================================
    var idslct = charIDToTypeID("slct");
    var desc193 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref36 = new ActionReference();
    var idmarqueeRectTool = stringIDToTypeID("marqueeRectTool");
    ref36.putClass(idmarqueeRectTool);
    desc193.putReference(idnull, ref36);
    var iddontRecord = stringIDToTypeID("dontRecord");
    desc193.putBoolean(iddontRecord, true);
    var idforceNotify = stringIDToTypeID("forceNotify");
    desc193.putBoolean(idforceNotify, true);
    executeAction(idslct, desc193, DialogModes.NO);

    // =======================================================
    var idsetd = charIDToTypeID("setd");
    var desc198 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref37 = new ActionReference();
    var idChnl = charIDToTypeID("Chnl");
    var idfsel = charIDToTypeID("fsel");
    ref37.putProperty(idChnl, idfsel);
    desc198.putReference(idnull, ref37);
    var idT = charIDToTypeID("T   ");
    var idOrdn = charIDToTypeID("Ordn");
    var idNone = charIDToTypeID("None");
    desc198.putEnumerated(idT, idOrdn, idNone);
    executeAction(idsetd, desc198, DialogModes.NO);

    // =======================================================
    var idsave = charIDToTypeID("save");
    var desc203 = new ActionDescriptor();
    var idIn = charIDToTypeID("In  ");
    desc203.putPath(idIn, new File(file_path + '/art/' + file_name));
    var idDocI = charIDToTypeID("DocI");
    desc203.putInteger(idDocI, 1592);
    var idsaveStage = stringIDToTypeID("saveStage");
    var idsaveStageType = stringIDToTypeID("saveStageType");
    var idsaveSucceeded = stringIDToTypeID("saveSucceeded");
    desc203.putEnumerated(idsaveStage, idsaveStageType, idsaveSucceeded);
    executeAction(idsave, desc203, DialogModes.NO);

    // =======================================================
    var idCls = charIDToTypeID("Cls ");
    var desc204 = new ActionDescriptor();
    var idDocI = charIDToTypeID("DocI");
    desc204.putInteger(idDocI, 1592);
    var idforceNotify = stringIDToTypeID("forceNotify");
    desc204.putBoolean(idforceNotify, true);
    executeAction(idCls, desc204, DialogModes.NO);
}
