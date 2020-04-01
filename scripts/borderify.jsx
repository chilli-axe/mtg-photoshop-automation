function borderify(file, ye) {
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

  // For manual card editing after placing it into the frame, place a breakpoint here

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
