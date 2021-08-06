#include "helpers.jsx";

function borderify(file) {
    /**
     * Adds a print bleed edge (solid black) to a given file and saves it to /out/border.
     */

    // File path to main working directory
    var file_path = File($.fileName).parent.parent.fsName;

    // paste the file into the mpccrop template and frame against the Card Size layer
    app.open(new File(file_path + "/templates/MPCcrop.psd"));
    var layer = paste_file_into_new_layer(file);
    frame_layer(layer, app.activeDocument.layers.getByName("Card Size"));

    // save and close
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
    var file_name_with_path = file_path + '/out/border/' + file.name;
    desc3.putPath(idIn, new File(file_name_with_path));
    var idCpy = charIDToTypeID("Cpy ");
    desc3.putBoolean(idCpy, true);
    executeAction(idsave, desc3, DialogModes.NO);
    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}
