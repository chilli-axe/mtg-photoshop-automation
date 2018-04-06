var docRef = app.activeDocument;
var fullCardName = docRef.layers[1].name;

// Create a string for the path to the working directory
var filePath = "G:/Documents/Proxy Project/Custom Template Proxies/JavaScript/";

// ----------Save as PNG in the crop folder ----------
var idsave = charIDToTypeID( "save" );
    var desc3 = new ActionDescriptor();
    var idAs = charIDToTypeID( "As  " );
        var desc4 = new ActionDescriptor();
        var idPGIT = charIDToTypeID( "PGIT" );
        var idPGIT = charIDToTypeID( "PGIT" );
        var idPGIN = charIDToTypeID( "PGIN" );
        desc4.putEnumerated( idPGIT, idPGIT, idPGIN );
        var idPNGf = charIDToTypeID( "PNGf" );
        var idPNGf = charIDToTypeID( "PNGf" );
        var idPGAd = charIDToTypeID( "PGAd" );
        desc4.putEnumerated( idPNGf, idPNGf, idPGAd );
    var idPNGF = charIDToTypeID( "PNGF" );
    desc3.putObject( idAs, idPNGF, desc4 );
    var idIn = charIDToTypeID( "In  " );
    var fileName = filePath + 'crop/' + fullCardName + '.png';
    desc3.putPath( idIn, new File( fileName ) );
    var idCpy = charIDToTypeID( "Cpy " );
    desc3.putBoolean( idCpy, true );
executeAction( idsave, desc3, DialogModes.NO );

// Delete the artwork layer 
docRef.layers[1].remove();
