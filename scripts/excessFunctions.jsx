// Resize text to fit text box
// Credit to https://stackoverflow.com/questions/28900505/extendscript-how-to-check-whether-text-content-overflows-the-containing-rectang
function scaleTextToFitBox(textLayer) {

    var fitInsideBoxDimensions = getLayerDimensions(textLayer);
    while(fitInsideBoxDimensions.height < getRealTextLayerDimensions(textLayer).height) {

        var fontSize = parseInt(textLayer.textItem.size);
        var leadSize = parseInt(textLayer.textItem.leading);
        textLayer.textItem.size = new UnitValue(fontSize - 1, "px");
        textLayer.textItem.leading = new UnitValue(leadSize - 1, "px");
    }

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

function scaleTextToFitBoxNew(textLayer, referenceHeight) {
  // Default values: 68.5, 137
  var scaled = false;
  textLayer.textItem.size = new UnitValue(68.5, "px");
  textLayer.textItem.leading = new UnitValue(137, "px");
  var inputWidth  = new UnitValue(textLayer.textItem.width, "px");
  var number = textLayer.textItem.height;
  var inputHeight = new UnitValue(2*(number),"px");
  var fontSize = 68.5; var leadSize = 137;

  while(referenceHeight < getRealTextLayerDimensions(textLayer).height) {
    scaled = true;
      textLayer.textItem.size = new UnitValue(fontSize - 0.5, "px"); fontSize = fontSize - 0.5;
      textLayer.textItem.leading = new UnitValue(leadSize - 1, "px"); leadSize = leadSize - 1;
  }
  return scaled;
}

function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}

function arrayIndexOf2(inputArray, reqValue, startingIndex){
  var index = -1;
  startingIndex = typeof startingIndex !== 'undefined' ? startingIndex : 0;
  for(var i=startingIndex;i<inputArray.length;i++){
    if(inputArray[i] == reqValue){
      index = i;
      break;
    }
  }
  return index;
}

// In an effort to keep the source code readable, any functions derived
// from photoshop's script listener have been included here

function verticallyFixText(textLayer){

  // Pulled from script listener - make a selection of the text layer that's
  // above the P/T box, then ctrl-j the selection from the card text layer
  // =======================================================
  var idsetd = charIDToTypeID( "setd" );
      var desc3 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref3 = new ActionReference();
          var idChnl = charIDToTypeID( "Chnl" );
          var idfsel = charIDToTypeID( "fsel" );
          ref3.putProperty( idChnl, idfsel );
      desc3.putReference( idnull, ref3 );
      var idT = charIDToTypeID( "T   " );
          var desc4 = new ActionDescriptor();
          var idTop = charIDToTypeID( "Top " );
          var idRlt = charIDToTypeID( "#Rlt" );
          desc4.putUnitDouble( idTop, idRlt, 1159.500000 );
          var idLeft = charIDToTypeID( "Left" );
          var idRlt = charIDToTypeID( "#Rlt" );
          desc4.putUnitDouble( idLeft, idRlt, 1046.500000 );
          var idBtom = charIDToTypeID( "Btom" );
          var idRlt = charIDToTypeID( "#Rlt" );
          desc4.putUnitDouble( idBtom, idRlt, 1776.500000 );
          var idRght = charIDToTypeID( "Rght" );
          var idRlt = charIDToTypeID( "#Rlt" );
          desc4.putUnitDouble( idRght, idRlt, 1256.500000 );
      var idRctn = charIDToTypeID( "Rctn" );
      desc3.putObject( idT, idRctn, desc4 );
  executeAction( idsetd, desc3, DialogModes.NO );

  // =======================================================
  var idCpTL = charIDToTypeID( "CpTL" );
  executeAction( idCpTL, undefined, DialogModes.NO );

  // =======================================================
  var idsetd = charIDToTypeID( "setd" );
      var desc5 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref4 = new ActionReference();
          var idLyr = charIDToTypeID( "Lyr " );
          var idOrdn = charIDToTypeID( "Ordn" );
          var idTrgt = charIDToTypeID( "Trgt" );
          ref4.putEnumerated( idLyr, idOrdn, idTrgt );
      desc5.putReference( idnull, ref4 );
      var idT = charIDToTypeID( "T   " );
          var desc6 = new ActionDescriptor();
          var idNm = charIDToTypeID( "Nm  " );
          desc6.putString( idNm, "Extra Bit" );
      var idLyr = charIDToTypeID( "Lyr " );
      desc5.putObject( idT, idLyr, desc6 );
  executeAction( idsetd, desc5, DialogModes.NO );

  // Get the bounding box of the new layer
  // bounds:
  // left: 0, right: 2
  // top: 3, bottom: 1

  var myLayer = docRef.layers.getByName("Text and Icons");
  var mySubLayer = myLayer.layers.getByName("Extra Bit");
  //docRef.activeLayer = mySubLayer;
  var bottomPos = mySubLayer.bounds[3];
  bottomPos = bottomPos.as('px');
  //alert(3744 - bottomPos.as('px'));
  var pixelOverlap = bottomPos - 3310;
  var pixelOverlapUnit = new UnitValue(-1*pixelOverlap, "px");
  //alert(pixelOverlap);
  mySubLayer.visible = false;
  mySubLayer = myLayer.layers.getByName("Rules Text - Creature");
  if(pixelOverlap > 0) mySubLayer.applyOffset(0,pixelOverlapUnit,OffsetUndefinedAreas.SETTOBACKGROUND);
  /*


  // commented copy of script listener code for future reference
  // =======================================================
var idsetd = charIDToTypeID( "setd" );
    var desc3 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref3 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idfsel = charIDToTypeID( "fsel" );
        ref3.putProperty( idChnl, idfsel );
    desc3.putReference( idnull, ref3 );
    var idT = charIDToTypeID( "T   " );
        var desc4 = new ActionDescriptor();
        var idTop = charIDToTypeID( "Top " );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc4.putUnitDouble( idTop, idRlt, 1159.500000 );
        var idLeft = charIDToTypeID( "Left" );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc4.putUnitDouble( idLeft, idRlt, 1046.500000 );
        var idBtom = charIDToTypeID( "Btom" );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc4.putUnitDouble( idBtom, idRlt, 1776.500000 );
        var idRght = charIDToTypeID( "Rght" );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc4.putUnitDouble( idRght, idRlt, 1256.500000 );
    var idRctn = charIDToTypeID( "Rctn" );
    desc3.putObject( idT, idRctn, desc4 );
executeAction( idsetd, desc3, DialogModes.NO );

// =======================================================
var idCpTL = charIDToTypeID( "CpTL" );
executeAction( idCpTL, undefined, DialogModes.NO );

// =======================================================
var idsetd = charIDToTypeID( "setd" );
    var desc5 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref4 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref4.putEnumerated( idLyr, idOrdn, idTrgt );
    desc5.putReference( idnull, ref4 );
    var idT = charIDToTypeID( "T   " );
        var desc6 = new ActionDescriptor();
        var idNm = charIDToTypeID( "Nm  " );
        desc6.putString( idNm, "Extra Bit" );
    var idLyr = charIDToTypeID( "Lyr " );
    desc5.putObject( idT, idLyr, desc6 );
executeAction( idsetd, desc5, DialogModes.NO );



  */
}

// Replace text function from an adobe forum thread I lost the link to
function replaceText (replaceThis, replaceWith) {
var idreplace = stringIDToTypeID( "replace" );
    var desc22 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref3 = new ActionReference();
        var idPrpr = charIDToTypeID( "Prpr" );
        var idreplace = stringIDToTypeID( "replace" );
        ref3.putProperty( idPrpr, idreplace );
        var idTxLr = charIDToTypeID( "TxLr" );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idAl = charIDToTypeID( "Al  " );
        ref3.putEnumerated( idTxLr, idOrdn, idAl );
    desc22.putReference( idnull, ref3 );
    var idUsng = charIDToTypeID( "Usng" );
        var desc23 = new ActionDescriptor();
        var idfind = stringIDToTypeID( "find" );
        desc23.putString( idfind, replaceThis );
        var idreplace = stringIDToTypeID( "replace" );
        desc23.putString( idreplace, replaceWith );
        var idcheckAll = stringIDToTypeID( "checkAll" );
        desc23.putBoolean( idcheckAll, true );
        var idFwd = charIDToTypeID( "Fwd " );
        desc23.putBoolean( idFwd, true );
        var idcaseSensitive = stringIDToTypeID( "caseSensitive" );
        desc23.putBoolean( idcaseSensitive, false );
        var idwholeWord = stringIDToTypeID( "wholeWord" );
        desc23.putBoolean( idwholeWord, false );
        var idignoreAccents = stringIDToTypeID( "ignoreAccents" );
        desc23.putBoolean( idignoreAccents, true );
    var idfindReplace = stringIDToTypeID( "findReplace" );
    desc22.putObject( idUsng, idfindReplace, desc23 );
executeAction( idreplace, desc22, DialogModes.NO );
};

// Rasterise the text layer and vertically align it to the text box
function verticallyAlignText(textLayerName){
  // =======================================================
  var idslct = charIDToTypeID( "slct" );
      var desc2 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref1 = new ActionReference();
          var idLyr = charIDToTypeID( "Lyr " );
          ref1.putName( idLyr, textLayerName );
      desc2.putReference( idnull, ref1 );
      var idMkVs = charIDToTypeID( "MkVs" );
      desc2.putBoolean( idMkVs, false );
  executeAction( idslct, desc2, DialogModes.NO );

  // =======================================================
  var idrasterizeLayer = stringIDToTypeID( "rasterizeLayer" );
      var desc3 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref2 = new ActionReference();
          var idLyr = charIDToTypeID( "Lyr " );
          var idOrdn = charIDToTypeID( "Ordn" );
          var idTrgt = charIDToTypeID( "Trgt" );
          ref2.putEnumerated( idLyr, idOrdn, idTrgt );
      desc3.putReference( idnull, ref2 );
      var idWhat = charIDToTypeID( "What" );
      var idrasterizeItem = stringIDToTypeID( "rasterizeItem" );
      var idType = charIDToTypeID( "Type" );
      desc3.putEnumerated( idWhat, idrasterizeItem, idType );
  executeAction( idrasterizeLayer, desc3, DialogModes.NO );

  // =======================================================
  var idShw = charIDToTypeID( "Shw " );
      var desc4 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var list1 = new ActionList();
              var ref3 = new ActionReference();
              var idLyr = charIDToTypeID( "Lyr " );
              ref3.putName( idLyr, textLayerName );
          list1.putReference( ref3 );
      desc4.putList( idnull, list1 );
  executeAction( idShw, desc4, DialogModes.NO );

  // =======================================================
  var idslct = charIDToTypeID( "slct" );
      var desc5 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref4 = new ActionReference();
          var idLyr = charIDToTypeID( "Lyr " );
          ref4.putName( idLyr, "Textbox Reference" );
      desc5.putReference( idnull, ref4 );
      var idMkVs = charIDToTypeID( "MkVs" );
      desc5.putBoolean( idMkVs, false );
  executeAction( idslct, desc5, DialogModes.NO );

  // =======================================================
  var idsetd = charIDToTypeID( "setd" );
      var desc6 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref5 = new ActionReference();
          var idChnl = charIDToTypeID( "Chnl" );
          var idfsel = charIDToTypeID( "fsel" );
          ref5.putProperty( idChnl, idfsel );
      desc6.putReference( idnull, ref5 );
      var idT = charIDToTypeID( "T   " );
          var ref6 = new ActionReference();
          var idChnl = charIDToTypeID( "Chnl" );
          var idChnl = charIDToTypeID( "Chnl" );
          var idTrsp = charIDToTypeID( "Trsp" );
          ref6.putEnumerated( idChnl, idChnl, idTrsp );
      desc6.putReference( idT, ref6 );
  executeAction( idsetd, desc6, DialogModes.NO );

  // =======================================================
  var idslct = charIDToTypeID( "slct" );
      var desc7 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref7 = new ActionReference();
          var idLyr = charIDToTypeID( "Lyr " );
          ref7.putName( idLyr, textLayerName );
      desc7.putReference( idnull, ref7 );
      var idMkVs = charIDToTypeID( "MkVs" );
      desc7.putBoolean( idMkVs, false );
  executeAction( idslct, desc7, DialogModes.NO );

  // =======================================================
  var idslct = charIDToTypeID( "slct" );
      var desc8 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref8 = new ActionReference();
          var idmoveTool = stringIDToTypeID( "moveTool" );
          ref8.putClass( idmoveTool );
      desc8.putReference( idnull, ref8 );
      var iddontRecord = stringIDToTypeID( "dontRecord" );
      desc8.putBoolean( iddontRecord, true );
      var idforceNotify = stringIDToTypeID( "forceNotify" );
      desc8.putBoolean( idforceNotify, true );
  executeAction( idslct, desc8, DialogModes.NO );

  // =======================================================
  var idAlgn = charIDToTypeID( "Algn" );
      var desc9 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref9 = new ActionReference();
          var idLyr = charIDToTypeID( "Lyr " );
          var idOrdn = charIDToTypeID( "Ordn" );
          var idTrgt = charIDToTypeID( "Trgt" );
          ref9.putEnumerated( idLyr, idOrdn, idTrgt );
      desc9.putReference( idnull, ref9 );
      var idUsng = charIDToTypeID( "Usng" );
      var idADSt = charIDToTypeID( "ADSt" );
      var idAdCV = charIDToTypeID( "AdCV" );
      desc9.putEnumerated( idUsng, idADSt, idAdCV );
  executeAction( idAlgn, desc9, DialogModes.NO );

  // =======================================================
  var idHd = charIDToTypeID( "Hd  " );
      var desc10 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var list2 = new ActionList();
              var ref10 = new ActionReference();
              var idLyr = charIDToTypeID( "Lyr " );
              ref10.putName( idLyr, "Textbox Reference" );
          list2.putReference( ref10 );
      desc10.putList( idnull, list2 );
  executeAction( idHd, desc10, DialogModes.NO );
  // =======================================================
}

function gradientUncommon(){
  // =======================================================
  var idslct = charIDToTypeID( "slct" );
    var desc655 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref163 = new ActionReference();
        var idGrTl = charIDToTypeID( "GrTl" );
        ref163.putClass( idGrTl );
    desc655.putReference( idnull, ref163 );
    var iddontRecord = stringIDToTypeID( "dontRecord" );
    desc655.putBoolean( iddontRecord, true );
    var idforceNotify = stringIDToTypeID( "forceNotify" );
    desc655.putBoolean( idforceNotify, true );
  executeAction( idslct, desc655, DialogModes.NO );

  // =======================================================
  var idsetd = charIDToTypeID( "setd" );
    var desc656 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref164 = new ActionReference();
        var idClr = charIDToTypeID( "Clr " );
        var idFrgC = charIDToTypeID( "FrgC" );
        ref164.putProperty( idClr, idFrgC );
    desc656.putReference( idnull, ref164 );
    var idT = charIDToTypeID( "T   " );
        var desc657 = new ActionDescriptor();
        var idRd = charIDToTypeID( "Rd  " );
        desc657.putDouble( idRd, 98.000000 );
        var idGrn = charIDToTypeID( "Grn " );
        desc657.putDouble( idGrn, 110.000000 );
        var idBl = charIDToTypeID( "Bl  " );
        desc657.putDouble( idBl, 119.003891 );
    var idRGBC = charIDToTypeID( "RGBC" );
    desc656.putObject( idT, idRGBC, desc657 );
  executeAction( idsetd, desc656, DialogModes.NO );

  // =======================================================
  var idExch = charIDToTypeID( "Exch" );
    var desc658 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref165 = new ActionReference();
        var idClr = charIDToTypeID( "Clr " );
        var idClrs = charIDToTypeID( "Clrs" );
        ref165.putProperty( idClr, idClrs );
    desc658.putReference( idnull, ref165 );
  executeAction( idExch, desc658, DialogModes.NO );

  // =======================================================
  var idsetd = charIDToTypeID( "setd" );
    var desc659 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref166 = new ActionReference();
        var idClr = charIDToTypeID( "Clr " );
        var idFrgC = charIDToTypeID( "FrgC" );
        ref166.putProperty( idClr, idFrgC );
    desc659.putReference( idnull, ref166 );
    var idT = charIDToTypeID( "T   " );
        var desc660 = new ActionDescriptor();
        var idRd = charIDToTypeID( "Rd  " );
        desc660.putDouble( idRd, 199.000000 );
        var idGrn = charIDToTypeID( "Grn " );
        desc660.putDouble( idGrn, 225.000000 );
        var idBl = charIDToTypeID( "Bl  " );
        desc660.putDouble( idBl, 241.000000 );
    var idRGBC = charIDToTypeID( "RGBC" );
    desc659.putObject( idT, idRGBC, desc660 );
  executeAction( idsetd, desc659, DialogModes.NO );
  gradientThis();
}

function gradientRare(){
  // =======================================================
  var idslct = charIDToTypeID( "slct" );
    var desc655 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref163 = new ActionReference();
        var idGrTl = charIDToTypeID( "GrTl" );
        ref163.putClass( idGrTl );
    desc655.putReference( idnull, ref163 );
    var iddontRecord = stringIDToTypeID( "dontRecord" );
    desc655.putBoolean( iddontRecord, true );
    var idforceNotify = stringIDToTypeID( "forceNotify" );
    desc655.putBoolean( idforceNotify, true );
  executeAction( idslct, desc655, DialogModes.NO );

  // =======================================================
  var idsetd = charIDToTypeID( "setd" );
      var desc669 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref168 = new ActionReference();
          var idClr = charIDToTypeID( "Clr " );
          var idFrgC = charIDToTypeID( "FrgC" );
          ref168.putProperty( idClr, idFrgC );
      desc669.putReference( idnull, ref168 );
      var idT = charIDToTypeID( "T   " );
          var desc670 = new ActionDescriptor();
          var idRd = charIDToTypeID( "Rd  " );
          desc670.putDouble( idRd, 145.996109 );
          var idGrn = charIDToTypeID( "Grn " );
          desc670.putDouble( idGrn, 116.000000 );
          var idBl = charIDToTypeID( "Bl  " );
          desc670.putDouble( idBl, 67.003891 );
      var idRGBC = charIDToTypeID( "RGBC" );
      desc669.putObject( idT, idRGBC, desc670 );
  executeAction( idsetd, desc669, DialogModes.NO );

  // =======================================================
  var idExch = charIDToTypeID( "Exch" );
      var desc671 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref169 = new ActionReference();
          var idClr = charIDToTypeID( "Clr " );
          var idClrs = charIDToTypeID( "Clrs" );
          ref169.putProperty( idClr, idClrs );
      desc671.putReference( idnull, ref169 );
  executeAction( idExch, desc671, DialogModes.NO );

  // =======================================================
  var idsetd = charIDToTypeID( "setd" );
      var desc672 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref170 = new ActionReference();
          var idClr = charIDToTypeID( "Clr " );
          var idFrgC = charIDToTypeID( "FrgC" );
          ref170.putProperty( idClr, idFrgC );
      desc672.putReference( idnull, ref170 );
      var idT = charIDToTypeID( "T   " );
          var desc673 = new ActionDescriptor();
          var idRd = charIDToTypeID( "Rd  " );
          desc673.putDouble( idRd, 213.996109 );
          var idGrn = charIDToTypeID( "Grn " );
          desc673.putDouble( idGrn, 179.996109 );
          var idBl = charIDToTypeID( "Bl  " );
          desc673.putDouble( idBl, 109.003891 );
      var idRGBC = charIDToTypeID( "RGBC" );
      desc672.putObject( idT, idRGBC, desc673 );
  executeAction( idsetd, desc672, DialogModes.NO );

  gradientThis();
}

function gradientMythic(){
  // =======================================================
  var idsetd = charIDToTypeID( "setd" );
      var desc1660 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref751 = new ActionReference();
          var idClr = charIDToTypeID( "Clr " );
          var idFrgC = charIDToTypeID( "FrgC" );
          ref751.putProperty( idClr, idFrgC );
      desc1660.putReference( idnull, ref751 );
      var idT = charIDToTypeID( "T   " );
          var desc1661 = new ActionDescriptor();
          var idRd = charIDToTypeID( "Rd  " );
          desc1661.putDouble( idRd, 245.000000 );
          var idGrn = charIDToTypeID( "Grn " );
          desc1661.putDouble( idGrn, 149.000000 );
          var idBl = charIDToTypeID( "Bl  " );
          desc1661.putDouble( idBl, 29.003891 );
      var idRGBC = charIDToTypeID( "RGBC" );
      desc1660.putObject( idT, idRGBC, desc1661 );
  executeAction( idsetd, desc1660, DialogModes.NO );

  // =======================================================
  var idExch = charIDToTypeID( "Exch" );
      var desc1662 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref752 = new ActionReference();
          var idClr = charIDToTypeID( "Clr " );
          var idClrs = charIDToTypeID( "Clrs" );
          ref752.putProperty( idClr, idClrs );
      desc1662.putReference( idnull, ref752 );
  executeAction( idExch, desc1662, DialogModes.NO );

  // =======================================================
  var idsetd = charIDToTypeID( "setd" );
      var desc1663 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref753 = new ActionReference();
          var idClr = charIDToTypeID( "Clr " );
          var idFrgC = charIDToTypeID( "FrgC" );
          ref753.putProperty( idClr, idFrgC );
      desc1663.putReference( idnull, ref753 );
      var idT = charIDToTypeID( "T   " );
          var desc1664 = new ActionDescriptor();
          var idRd = charIDToTypeID( "Rd  " );
          desc1664.putDouble( idRd, 191.996109 );
          var idGrn = charIDToTypeID( "Grn " );
          desc1664.putDouble( idGrn, 55.003891 );
          var idBl = charIDToTypeID( "Bl  " );
          desc1664.putDouble( idBl, 38.000000 );
      var idRGBC = charIDToTypeID( "RGBC" );
      desc1663.putObject( idT, idRGBC, desc1664 );
  executeAction( idsetd, desc1663, DialogModes.NO );

  // =======================================================
  var idExch = charIDToTypeID( "Exch" );
      var desc1665 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref754 = new ActionReference();
          var idClr = charIDToTypeID( "Clr " );
          var idClrs = charIDToTypeID( "Clrs" );
          ref754.putProperty( idClr, idClrs );
      desc1665.putReference( idnull, ref754 );
  executeAction( idExch, desc1665, DialogModes.NO );
  gradientThis()
}

function gradientThis(){
  // =======================================================
var idslct = charIDToTypeID( "slct" );
    var desc598 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref141 = new ActionReference();
        var idDcmn = charIDToTypeID( "Dcmn" );
        ref141.putOffset( idDcmn, -1 );
    desc598.putReference( idnull, ref141 );
executeAction( idslct, desc598, DialogModes.NO );

// =======================================================
var idslct = charIDToTypeID( "slct" );
    var desc604 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref145 = new ActionReference();
        var idDcmn = charIDToTypeID( "Dcmn" );
        ref145.putOffset( idDcmn, 1 );
    desc604.putReference( idnull, ref145 );
executeAction( idslct, desc604, DialogModes.NO );

// =======================================================
var idslct = charIDToTypeID( "slct" );
    var desc605 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref146 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        ref146.putName( idLyr, "Text and Icons" );
    desc605.putReference( idnull, ref146 );
    var idMkVs = charIDToTypeID( "MkVs" );
    desc605.putBoolean( idMkVs, false );
executeAction( idslct, desc605, DialogModes.NO );

// =======================================================
var idslct = charIDToTypeID( "slct" );
    var desc606 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref147 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        ref147.putName( idLyr, "Expansion Symbol" );
    desc606.putReference( idnull, ref147 );
    var idMkVs = charIDToTypeID( "MkVs" );
    desc606.putBoolean( idMkVs, false );
executeAction( idslct, desc606, DialogModes.NO );

// =======================================================
var idrasterizeLayer = stringIDToTypeID( "rasterizeLayer" );
    var desc607 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref148 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref148.putEnumerated( idLyr, idOrdn, idTrgt );
    desc607.putReference( idnull, ref148 );
    var idWhat = charIDToTypeID( "What" );
    var idrasterizeItem = stringIDToTypeID( "rasterizeItem" );
    var idType = charIDToTypeID( "Type" );
    desc607.putEnumerated( idWhat, idrasterizeItem, idType );
executeAction( idrasterizeLayer, desc607, DialogModes.NO );

// =======================================================
var idsetd = charIDToTypeID( "setd" );
    var desc608 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref149 = new ActionReference();
        var idPrpr = charIDToTypeID( "Prpr" );
        var idLefx = charIDToTypeID( "Lefx" );
        ref149.putProperty( idPrpr, idLefx );
        var idLyr = charIDToTypeID( "Lyr " );
        var idOrdn = charIDToTypeID( "Ordn" );
        var idTrgt = charIDToTypeID( "Trgt" );
        ref149.putEnumerated( idLyr, idOrdn, idTrgt );
    desc608.putReference( idnull, ref149 );
    var idT = charIDToTypeID( "T   " );
        var desc609 = new ActionDescriptor();
        var idScl = charIDToTypeID( "Scl " );
        var idPrc = charIDToTypeID( "#Prc" );
        desc609.putUnitDouble( idScl, idPrc, 200.000000 );
        var idFrFX = charIDToTypeID( "FrFX" );
            var desc610 = new ActionDescriptor();
            var idenab = charIDToTypeID( "enab" );
            desc610.putBoolean( idenab, true );
            var idStyl = charIDToTypeID( "Styl" );
            var idFStl = charIDToTypeID( "FStl" );
            var idInsF = charIDToTypeID( "InsF" );
            desc610.putEnumerated( idStyl, idFStl, idInsF );
            var idPntT = charIDToTypeID( "PntT" );
            var idFrFl = charIDToTypeID( "FrFl" );
            var idSClr = charIDToTypeID( "SClr" );
            desc610.putEnumerated( idPntT, idFrFl, idSClr );
            var idMd = charIDToTypeID( "Md  " );
            var idBlnM = charIDToTypeID( "BlnM" );
            var idNrml = charIDToTypeID( "Nrml" );
            desc610.putEnumerated( idMd, idBlnM, idNrml );
            var idOpct = charIDToTypeID( "Opct" );
            var idPrc = charIDToTypeID( "#Prc" );
            desc610.putUnitDouble( idOpct, idPrc, 100.000000 );
            var idSz = charIDToTypeID( "Sz  " );
            var idPxl = charIDToTypeID( "#Pxl" );
            desc610.putUnitDouble( idSz, idPxl, 4.000000 );
            var idClr = charIDToTypeID( "Clr " );
                var desc611 = new ActionDescriptor();
                var idRd = charIDToTypeID( "Rd  " );
                desc611.putDouble( idRd, 0.000000 );
                var idGrn = charIDToTypeID( "Grn " );
                desc611.putDouble( idGrn, 0.000000 );
                var idBl = charIDToTypeID( "Bl  " );
                desc611.putDouble( idBl, 0.000000 );
            var idRGBC = charIDToTypeID( "RGBC" );
            desc610.putObject( idClr, idRGBC, desc611 );
        var idFrFX = charIDToTypeID( "FrFX" );
        desc609.putObject( idFrFX, idFrFX, desc610 );
    var idLefx = charIDToTypeID( "Lefx" );
    desc608.putObject( idT, idLefx, desc609 );
executeAction( idsetd, desc608, DialogModes.NO );

// =======================================================
var idsetd = charIDToTypeID( "setd" );
    var desc612 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref150 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idfsel = charIDToTypeID( "fsel" );
        ref150.putProperty( idChnl, idfsel );
    desc612.putReference( idnull, ref150 );
    var idT = charIDToTypeID( "T   " );
        var ref151 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idChnl = charIDToTypeID( "Chnl" );
        var idTrsp = charIDToTypeID( "Trsp" );
        ref151.putEnumerated( idChnl, idChnl, idTrsp );
    desc612.putReference( idT, ref151 );
executeAction( idsetd, desc612, DialogModes.NO );

// =======================================================
var idGrdn = charIDToTypeID( "Grdn" );
    var desc613 = new ActionDescriptor();
    var idFrom = charIDToTypeID( "From" );
        var desc614 = new ActionDescriptor();
        var idHrzn = charIDToTypeID( "Hrzn" );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc614.putUnitDouble( idHrzn, idRlt, 1205.000000 );
        var idVrtc = charIDToTypeID( "Vrtc" );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc614.putUnitDouble( idVrtc, idRlt, 1108.500000 );
    var idPnt = charIDToTypeID( "Pnt " );
    desc613.putObject( idFrom, idPnt, desc614 );
    var idT = charIDToTypeID( "T   " );
        var desc615 = new ActionDescriptor();
        var idHrzn = charIDToTypeID( "Hrzn" );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc615.putUnitDouble( idHrzn, idRlt, 1227.500000 );
        var idVrtc = charIDToTypeID( "Vrtc" );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc615.putUnitDouble( idVrtc, idRlt, 1092.000000 );
    var idPnt = charIDToTypeID( "Pnt " );
    desc613.putObject( idT, idPnt, desc615 );
    var idType = charIDToTypeID( "Type" );
    var idGrdT = charIDToTypeID( "GrdT" );
    var idRflc = charIDToTypeID( "Rflc" );
    desc613.putEnumerated( idType, idGrdT, idRflc );
    var idDthr = charIDToTypeID( "Dthr" );
    desc613.putBoolean( idDthr, true );
    var idUsMs = charIDToTypeID( "UsMs" );
    desc613.putBoolean( idUsMs, true );
    var idGrad = charIDToTypeID( "Grad" );
        var desc616 = new ActionDescriptor();
        var idNm = charIDToTypeID( "Nm  " );
        desc616.putString( idNm, "$$$/DefaultGradient/ForegroundToBackground=Foreground to Background" );
        var idGrdF = charIDToTypeID( "GrdF" );
        var idGrdF = charIDToTypeID( "GrdF" );
        var idCstS = charIDToTypeID( "CstS" );
        desc616.putEnumerated( idGrdF, idGrdF, idCstS );
        var idIntr = charIDToTypeID( "Intr" );
        desc616.putDouble( idIntr, 4096.000000 );
        var idClrs = charIDToTypeID( "Clrs" );
            var list86 = new ActionList();
                var desc617 = new ActionDescriptor();
                var idType = charIDToTypeID( "Type" );
                var idClry = charIDToTypeID( "Clry" );
                var idFrgC = charIDToTypeID( "FrgC" );
                desc617.putEnumerated( idType, idClry, idFrgC );
                var idLctn = charIDToTypeID( "Lctn" );
                desc617.putInteger( idLctn, 0 );
                var idMdpn = charIDToTypeID( "Mdpn" );
                desc617.putInteger( idMdpn, 50 );
            var idClrt = charIDToTypeID( "Clrt" );
            list86.putObject( idClrt, desc617 );
                var desc618 = new ActionDescriptor();
                var idType = charIDToTypeID( "Type" );
                var idClry = charIDToTypeID( "Clry" );
                var idBckC = charIDToTypeID( "BckC" );
                desc618.putEnumerated( idType, idClry, idBckC );
                var idLctn = charIDToTypeID( "Lctn" );
                desc618.putInteger( idLctn, 4096 );
                var idMdpn = charIDToTypeID( "Mdpn" );
                desc618.putInteger( idMdpn, 50 );
            var idClrt = charIDToTypeID( "Clrt" );
            list86.putObject( idClrt, desc618 );
        desc616.putList( idClrs, list86 );
        var idTrns = charIDToTypeID( "Trns" );
            var list87 = new ActionList();
                var desc619 = new ActionDescriptor();
                var idOpct = charIDToTypeID( "Opct" );
                var idPrc = charIDToTypeID( "#Prc" );
                desc619.putUnitDouble( idOpct, idPrc, 100.000000 );
                var idLctn = charIDToTypeID( "Lctn" );
                desc619.putInteger( idLctn, 0 );
                var idMdpn = charIDToTypeID( "Mdpn" );
                desc619.putInteger( idMdpn, 50 );
            var idTrnS = charIDToTypeID( "TrnS" );
            list87.putObject( idTrnS, desc619 );
                var desc620 = new ActionDescriptor();
                var idOpct = charIDToTypeID( "Opct" );
                var idPrc = charIDToTypeID( "#Prc" );
                desc620.putUnitDouble( idOpct, idPrc, 100.000000 );
                var idLctn = charIDToTypeID( "Lctn" );
                desc620.putInteger( idLctn, 4096 );
                var idMdpn = charIDToTypeID( "Mdpn" );
                desc620.putInteger( idMdpn, 50 );
            var idTrnS = charIDToTypeID( "TrnS" );
            list87.putObject( idTrnS, desc620 );
        desc616.putList( idTrns, list87 );
    var idGrdn = charIDToTypeID( "Grdn" );
    desc613.putObject( idGrad, idGrdn, desc616 );
executeAction( idGrdn, desc613, DialogModes.NO );

// =======================================================
var idsetd = charIDToTypeID( "setd" );
    var desc621 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref152 = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idfsel = charIDToTypeID( "fsel" );
        ref152.putProperty( idChnl, idfsel );
    desc621.putReference( idnull, ref152 );
    var idT = charIDToTypeID( "T   " );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idNone = charIDToTypeID( "None" );
    desc621.putEnumerated( idT, idOrdn, idNone );
executeAction( idsetd, desc621, DialogModes.NO );

// =======================================================
var idslct = charIDToTypeID( "slct" );
    var desc622 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
        var ref153 = new ActionReference();
        var idLyr = charIDToTypeID( "Lyr " );
        ref153.putName( idLyr, "Legal" );
    desc622.putReference( idnull, ref153 );
    var idMkVs = charIDToTypeID( "MkVs" );
    desc622.putBoolean( idMkVs, false );
executeAction( idslct, desc622, DialogModes.NO );
}
