// Resize text to fit text box
// Credit to https://stackoverflow.com/questions/28900505/extendscript-how-to-check-whether-text-content-overflows-the-containing-rectang
function scaleTextToFitBox(textLayer) {
    textLayer.textItem.size = new UnitValue(65, "px");
    textLayer.textItem.leading = new UnitValue(65, "px");

    var fitInsideBoxDimensions = getLayerDimensions(textLayer);
    while(fitInsideBoxDimensions.height < getRealTextLayerDimensions(textLayer).height) {
        var fontSize = parseInt(textLayer.textItem.size);
        var leadSize = parseInt(textLayer.textItem.leading);
        textLayer.textItem.size = new UnitValue(fontSize - 2, "px");
        textLayer.textItem.leading = new UnitValue(leadSize - 2, "px");
    }
}

function getRealTextLayerDimensions(textLayer) {
    var textLayerCopy = textLayer.duplicate(activeDocument, ElementPlacement.INSIDE);
    textLayerCopy.textItem.height = activeDocument.height;
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
function verticallyAlignText(){
  // =======================================================
  var idslct = charIDToTypeID( "slct" );
      var desc2 = new ActionDescriptor();
      var idnull = charIDToTypeID( "null" );
          var ref1 = new ActionReference();
          var idLyr = charIDToTypeID( "Lyr " );
          ref1.putName( idLyr, "Rules Text" );
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
              ref3.putName( idLyr, "Textbox Reference" );
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
          ref7.putName( idLyr, "Rules Text" );
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
