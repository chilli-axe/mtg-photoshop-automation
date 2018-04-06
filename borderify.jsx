// =======================================================
var idOpn = charIDToTypeID( "Opn " );
    var desc222 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    desc222.putPath( idnull, new File( "G:\\Documents\\Proxy Project\\Custom Template Proxies\\JavaScript\\MPCcrop.psd" ) );
executeAction( idOpn, desc222, DialogModes.NO );

// =======================================================
var idPlc = charIDToTypeID( "Plc " );
    var desc223 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var filePathString = "G:\\Documents\\Proxy Project\\Custom Template Proxies\\JavaScript\\out\\" + cardName + ".png";
    //desc223.putPath( idnull, new File( "G:\\Documents\\Proxy Project\\Custom Template Proxies\\JavaScript\\out\\Black Lotus.png" ) );
    desc223.putPath( idnull, new File( filePathString ) );
    var idFTcs = charIDToTypeID( "FTcs" );
    var idQCSt = charIDToTypeID( "QCSt" );
    var idQcsa = charIDToTypeID( "Qcsa" );
    desc223.putEnumerated( idFTcs, idQCSt, idQcsa );
    var idOfst = charIDToTypeID( "Ofst" );
        var desc224 = new ActionDescriptor();
        var idHrzn = charIDToTypeID( "Hrzn" );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc224.putUnitDouble( idHrzn, idRlt, 0.000000 );
        var idVrtc = charIDToTypeID( "Vrtc" );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc224.putUnitDouble( idVrtc, idRlt, 0.000000 );
    var idOfst = charIDToTypeID( "Ofst" );
    desc223.putObject( idOfst, idOfst, desc224 );
    var idWdth = charIDToTypeID( "Wdth" );
    var idPrc = charIDToTypeID( "#Prc" );
    desc223.putUnitDouble( idWdth, idPrc, 93.784799 );
    var idHght = charIDToTypeID( "Hght" );
    var idPrc = charIDToTypeID( "#Prc" );
    desc223.putUnitDouble( idHght, idPrc, 93.838534 );
    var idLnkd = charIDToTypeID( "Lnkd" );
    desc223.putBoolean( idLnkd, true );
executeAction( idPlc, desc223, DialogModes.NO );

// =======================================================
var idsave = charIDToTypeID( "save" );
    var desc225 = new ActionDescriptor();
    var idAs = charIDToTypeID( "As  " );
        var desc226 = new ActionDescriptor();
        var idPGIT = charIDToTypeID( "PGIT" );
        var idPGIT = charIDToTypeID( "PGIT" );
        var idPGIN = charIDToTypeID( "PGIN" );
        desc226.putEnumerated( idPGIT, idPGIT, idPGIN );
        var idPNGf = charIDToTypeID( "PNGf" );
        var idPNGf = charIDToTypeID( "PNGf" );
        var idPGAd = charIDToTypeID( "PGAd" );
        desc226.putEnumerated( idPNGf, idPNGf, idPGAd );
    var idPNGF = charIDToTypeID( "PNGF" );
    desc225.putObject( idAs, idPNGF, desc226 );
    var idIn = charIDToTypeID( "In  " );
    var filePathString = "G:\\Documents\\Proxy Project\\Custom Template Proxies\\JavaScript\\out\\border\\" + cardName + ".png";
    //desc225.putPath( idIn, new File( "G:\\Documents\\Proxy Project\\Custom Template Proxies\\JavaScript\\out\\border\\Black Lotus.png" ) );
    desc225.putPath( idIn, new File( filePathString ) );
    var idCpy = charIDToTypeID( "Cpy " );
    desc225.putBoolean( idCpy, true );
executeAction( idsave, desc225, DialogModes.NO );

// =======================================================
var idCls = charIDToTypeID( "Cls " );
    var desc227 = new ActionDescriptor();
    var idSvng = charIDToTypeID( "Svng" );
    var idYsN = charIDToTypeID( "YsN " );
    var idN = charIDToTypeID( "N   " );
    desc227.putEnumerated( idSvng, idYsN, idN );
executeAction( idCls, desc227, DialogModes.NO );
