// Set this to the filepath to your working directory
var filePath = "G:/Documents/Proxy Project/Custom Template Proxies/JavaScript/";

// Load in json2.js, MTG JSON and some function files
$.evalFile(filePath + "json2.js");
$.evalFile(filePath + "italiciseText.jsx");
$.evalFile(filePath + "insertManaAndItaliciseText.jsx");
$.evalFile(filePath + "insertManaCost.jsx");
$.evalFile(filePath + "excessFunctions.jsx");

// Loop through each image in the crop folder and produce a proxy for it
folder = new Folder( filePath + "/crop" );
files_array = folder.getFiles();
for(var n=0;n<files_array.length;n++){
  var file = files_array[n];
    // Open the Photoshop template
    var fileRef = new File(filePath + "Template.psd");
    app.open(fileRef);

    // Create a reference to the active document for convenience
    var docRef = app.activeDocument;

   // Get the card's name
   var artPath = String(file);

   // Retrieve the card's name from the given filepath
   var reversedPath = artPath.split("").reverse().join("");
   var startIndex = artPath.length - reversedPath.indexOf("/");
   var endIndex = artPath.indexOf(".",startIndex);
   var fullCardName = artPath.slice(startIndex,endIndex);

   // Replace apostrophes, commas and places in % format with their proper ones
   fullCardName = fullCardName.replace(/%2C/g,",");
   fullCardName = fullCardName.replace(/%27/g,"'");
   fullCardName = fullCardName.replace(/%20/g," ");

   // Place it in the template
   app.load(file);
   backFile= app.activeDocument;
   backFile.selection.selectAll();
   backFile.selection.copy();
   backFile.close(SaveOptions.DONOTSAVECHANGES);
   docRef.paste();

   // Retrieve the card's name and artist
   var openIndex  = fullCardName.lastIndexOf(" (");
   var closeIndex = fullCardName.lastIndexOf(")");
   var cardArtist = fullCardName.slice(openIndex+2,closeIndex);
   var cardName   = fullCardName.slice(0,openIndex);
   var scriptFile = new File(filePath + "AllSets.json");
   scriptFile.open('r');
   var content = scriptFile.read();
   scriptFile.close();

   // Find our card name in the database
   var namePrefix = "\"name\": \"";
   var nameConcat = namePrefix.concat(cardName);
   var indicesOfName = getAllIndexes(content, nameConcat.concat("\","));

   // Grab the oldest printing of the card I think?
   var indexesOfID = [];
   var multiverseIDs = [];
   for(var i=0;i<indicesOfName.length;i++){
     indexesOfID[i] = content.lastIndexOf("\"multiverseid\": ", indicesOfName[i]);
     var indexOfComma = content.indexOf(",",indexesOfID[i]);
     multiverseIDs[i] = content.slice(indexesOfID[i]+16,indexOfComma);
   }

   // Create a copy of the multiverse ID array
   var multiverseIDsCopy = multiverseIDs.slice(0);

   // Sort the copy into ascending order (oldest to newest in terms of printing
   // age) and store that as smallestID
   var smallestID = multiverseIDsCopy.sort(function (a,b) {return a-b;});

   // Store the multiverse ID of the oldest printing as CompletelyNew
   var CompletelyNew = smallestID[0];

   // Store the index in multiverseIDs of that ID as SecondCompletelyNew
   var SecondCompletelyNew = arrayIndexOf2(multiverseIDs,CompletelyNew,0);

   // originalExpansionIndex is the index of the 3 letter code used to represent
   // the expansion that the card originally hails from
   var originalExpansionIndex = content.lastIndexOf("\"code\": \"",indicesOfName[SecondCompletelyNew]);
   var indexOfComma = content.indexOf(",",originalExpansionIndex);

   // Slice and dice to get the 3 letter expansion code
   var originalExpansion = content.slice(originalExpansionIndex + 9, indexOfComma - 1);

   // Find where the JSON for the card's entry in this set begins and ends
   var manaCostIndex = content.lastIndexOf("cmc",indicesOfName[SecondCompletelyNew]);
   var typeIndex = content.indexOf("\"types\": ",indicesOfName[SecondCompletelyNew]);
   var startingIndexOfCard = content.lastIndexOf("{",manaCostIndex);
   var endingIndexOfCard = content.indexOf("}",typeIndex);

   // Slice and dice, then parse the result, for the complete JSON.
   var jsonString = content.slice(startingIndexOfCard,endingIndexOfCard+1);

   // Grab the watermark glyph pls
   var scriptFile = new File(filePath + "symbols.json");
   scriptFile.open('r');
   var contentGlyphs = scriptFile.read();
   scriptFile.close();
   var jsonGlyphs = JSON.parse(contentGlyphs);
   var originalexpansionlowercase = originalExpansion.toLowerCase();
   var myGlyph = jsonGlyphs[originalexpansionlowercase];

   // Also retrieve the flavour text for the oldest printing with flavour text
   //var flavourText = " "; // GOD TIER LINE
   var flavourText = "";
   if(jsonString.lastIndexOf("\"flavor\": ") >= 0){
     var jsonParsed = JSON.parse(jsonString);
     flavourText = jsonParsed.flavor;
   }
   else{
     for(var i=1;i<multiverseIDs.length;i++){
       // Grab the current multiverse ID
       var multiverseThing = arrayIndexOf2(multiverseIDs,smallestID[i],0);

       // Slice and dice, my dudes
       var manaCostIndex = content.lastIndexOf("cmc",indicesOfName[multiverseThing]);
       var typeIndex = content.indexOf("\"types\": ",indicesOfName[multiverseThing]);
       var startingIndexOfCard = content.lastIndexOf("{",manaCostIndex);
       var endingIndexOfCard = content.indexOf("}",typeIndex);
       var jsonString = content.slice(startingIndexOfCard,endingIndexOfCard+1);

       // Check if this fella has flavour text at all
       if(jsonString.lastIndexOf("\"flavor\": ") >= 0){
         var jsonParsed = JSON.parse(jsonString);
         flavourText = jsonParsed.flavor;
         break;
       }
     }
   }
   var jsonParsed = JSON.parse(jsonString);

   // Retrieve some more info about the card.
   var typeLine = jsonParsed.type;
   var cardPower = jsonParsed.power;
   var cardTough = jsonParsed.toughness;
   var cardText = jsonParsed.text;
   var cardManaCost = jsonParsed.manaCost;
   if(jsonString.indexOf("colorIdentity") >= 0 && typeLine.indexOf("Artifact") < 0){
     var str = String(jsonParsed.colorIdentity);
     var regex = /[.,\s]/g;
     var colourIdentity = String(str.replace(regex,''));
   }
   else{
     var colourIdentity = "";
   }

   //---------- Card Name ----------
   // Select the name layer
   var myLayer = docRef.layers.getByName("Text and Icons");
   var mySubLayer = myLayer.layers.getByName("Card Name");
   docRef.activeLayer = mySubLayer;
   docRef.activeLayer.textItem.contents = cardName;

   // ---------- Typeline ----------
   // Select the typeline layer
   var myLayer = docRef.layers.getByName("Text and Icons");
   var mySubLayer = myLayer.layers.getByName("Typeline");
   docRef.activeLayer = mySubLayer;
   docRef.activeLayer.textItem.contents = typeLine;

   // ---------- P / T ----------
   var myLayer = docRef.layers.getByName("Text and Icons");
   var mySubLayer = myLayer.layers.getByName("Power / Toughness");
   docRef.activeLayer = mySubLayer;
   if(typeLine.indexOf("Creature") >= 0){
     docRef.activeLayer.textItem.contents = cardPower + "/" + cardTough;
   }
   else{
     docRef.activeLayer.visible = false;
   }

   // ---------- Artist ----------
   replaceText("Artist", cardArtist);

   // ---------- Card Frame ----------
   // First see if the card is land or nonland
   if(typeLine.indexOf("Land") >= 0){
     // Hide the mana cost while we're at it
     var myLayer = docRef.layers.getByName("Text and Icons");
     var mySubLayer = myLayer.layers.getByName("Mana Cost");
     docRef.activeLayer = mySubLayer;
     docRef.activeLayer.visible = false;
     // Choose the land folder
     var myLayer = docRef.layers.getByName("Land");
   }
   else{
     // ---------- Mana Cost ----------
     myManaLayer = docRef.layers.getByName("Text and Icons");
     manaCostLayer = myManaLayer.layers.getByName("Mana Cost");
     manaCostLayer.textItem.contents = cardManaCost;
     insertManaCost(cardManaCost);

     var myLayer = docRef.layers.getByName("Nonland");
     if(colourIdentity.valueOf() == "B"){
       // Change the text colour of the artist, legal and P/T layers to white
       var myTextLayer = docRef.layers.getByName("Legal");
       var myNewTextLayer = myTextLayer.layers.getByName("Artist");
       textColour = new SolidColor();
       textColour.rgb.red = 255;
       textColour.rgb.blue = 255;
       textColour.rgb.green = 255;
       myNewTextLayer.textItem.color = textColour;
       myNewTextLayer = myTextLayer.layers.getByName("Legal");
       myNewTextLayer.textItem.color = textColour;
       myTextLayer = docRef.layers.getByName("Text and Icons");
       myNewTextLayer = myTextLayer.layers.getByName("Power / Toughness");
       myNewTextLayer.textItem.color = textColour;
     }
   }
   if(colourIdentity.length > 2){
     var mySubLayer = myLayer.layers.getByName("WUBRG");
   }
   else if(colourIdentity.length <= 0){
     var mySubLayer = myLayer.layers.getByName("C");
   }
   else{
     var mySubLayer = myLayer.layers.getByName(colourIdentity);
   }
   docRef.activeLayer = mySubLayer;
   docRef.activeLayer.visible = true;

   // ---------- Watermark ----------
   var watermarkLayer = mySubLayer.layers.getByName("Watermark");
   docRef.activeLayer = watermarkLayer;
   docRef.activeLayer.visible = true;
   docRef.activeLayer.textItem.contents = myGlyph;

   // ---------- Rules Text ----------
   var myLayer = docRef.layers.getByName("Text and Icons");
   var myNewLayer = myLayer.layers.getByName("Rules Text");
   docRef.activeLayer = myNewLayer;
   cardText = cardText.replace(/\n/g,"\r");
   docRef.activeLayer.textItem.contents = cardText;

   // ---------- Italics Text ----------
   // Build an array of italics text, starting with identifying any
   // reminder text in the card's text body (anything in brackets).
   var reminderTextBool = 1;

   var italicText = []; var endIndex = 0;
   while(reminderTextBool == 1){
     var startIndex = cardText.indexOf("(",endIndex);
     if(startIndex >= 0){
       endIndex = cardText.indexOf(")",startIndex+1);
       italicText.push( cardText.slice(startIndex, endIndex+1) );
     }
     else{
       reminderTextBool = 0;
     }
   }

   // Also attach the ability word Threshold and the cards' flavour text
   // to the italics array.
   italicText.push("Threshold");
   if(flavourText.length > 1){
     italicText.push(flavourText);
   }
   // Jam the rules text and flavour text together
   if(flavourText.length > 0){
     var completeString = cardText + "\r" + flavourText;
   }
   else{
     var completeString = cardText;
   }
   //if(completeString.indexOf("{") < 0){
   //  italiciseText(completeString, italicText);
   //}
   //else{
     insertManaAndItaliciseText(completeString, italicText);
   //}

   // Maybe centre justify the text box
   if(flavourText.length <= 1 && cardText.length <= 70){
     // Here we go boys
     docRef.activeLayer.textItem.justification = Justification.CENTER;
   }




   // Scale the text to fit in the text box
   scaleTextToFitBox(myNewLayer);

   // Vertically align text — Pulled from script listener
   verticallyAlignText();

   // ----------Save as PNG in the out folder ----------
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
       var filename = filePath + '/out/' + cardName + '.png';
       desc3.putPath( idIn, new File( filename ) );
       var idCpy = charIDToTypeID( "Cpy " );
       desc3.putBoolean( idCpy, true );
   executeAction( idsave, desc3, DialogModes.NO );

   // Close the thing without saving
   docRef.close(SaveOptions.DONOTSAVECHANGES);
   $.evalFile(filePath + "borderify.jsx");
}
