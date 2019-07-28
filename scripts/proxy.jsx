function proxy(file, ye){

  var filePath = File($.filename).parent.parent.fsName;

  // Load in json2.js and some function files
  $.evalFile(filePath + "\\scripts\\json2.js");
  $.evalFile(filePath + "\\scripts\\insertManaAndItaliciseText.jsx");
  $.evalFile(filePath + "\\scripts\\insertManaCost.jsx");
  $.evalFile(filePath + "\\scripts\\excessFunctions.jsx");

  // Get the card's name
  var artPath = String(file);

  // Retrieve the card's name from the given filepath
  var reversedPath = artPath.split("").reverse().join("");
  var startIndex = artPath.length - reversedPath.indexOf("/");
  var endIndex = artPath.lastIndexOf(".");
  fullCardName = artPath.slice(startIndex,endIndex);

  // Replace apostrophes, commas and places in % format with their proper ones
  fullCardName = fullCardName.replace(/%2C/g,",");
  fullCardName = fullCardName.replace(/%27/g,"'");
  fullCardName = fullCardName.replace(/%20/g," ");
  fullCardName = fullCardName.replace(/%26/g,"&");

  // Retrieve the card's name and artist
  var openIndex  = fullCardName.lastIndexOf(" (");
  var closeIndex = fullCardName.lastIndexOf(")");
  var cardArtist = fullCardName.slice(openIndex+2,closeIndex);
  var cardName   = fullCardName.slice(0,openIndex);

  app.system("python get_card_info.py \"" + cardName + "\"");

  var cardJSONFile = new File(filePath + "\\scripts\\card.json");
  cardJSONFile.open('r');
  var cardJSON = cardJSONFile.read();
  cardJSONFile.close();

  // Why do we have to parse this twice? To be honest only God knows lmao
  var jsonParsed = JSON.parse(JSON.parse(cardJSON));

  // TODO: Select from whichever template
  var templateName = "Template"

  var fileRef = new File(filePath + "\\" + templateName + ".psd");
  app.open(fileRef);

  // Create a reference to the active document for convenience
  var docRef = app.activeDocument;

  // Place it in the template
  if(ye == 1) app.load(file);
  else app.load(file[0]);

  backFile= app.activeDocument;
  backFile.selection.selectAll();
  backFile.selection.copy();
  backFile.close(SaveOptions.DONOTSAVECHANGES);
  docRef.paste();

  // If you want to manually specify a card's flavour text, do so now

  // Retrieve some more info about the card.
  var typeLine = jsonParsed.type;
  var cardPower = jsonParsed.power;
  var cardTough = jsonParsed.toughness;
  var cardText = jsonParsed.text;
  var cardRarity = jsonParsed.rarity;
  var flavourText = jsonParsed.flavourText;

  // Create a reference to the active document for convenience
  var docRef = app.activeDocument;

  // Rarity gradient
  if(cardRarity == "uncommon"){
    gradientUncommon();
  }
  else if(cardRarity == "rare"){
    gradientRare();
  }
  else if(cardRarity == "mythic"){
    gradientMythic();
  }


  if(cardText == undefined){
    cardText == "";
  }

  var cardManaCost = jsonParsed.manaCost;

  // Build the colour identity
  var colourIdentity = "";
  var stringToSearch = cardManaCost;
  if(typeLine.indexOf("Land") >= 0) stringToSearch = stringToSearch + cardText;

  if(stringToSearch.indexOf("{W") >= 0 || stringToSearch.indexOf("W}") >= 0 || (stringToSearch.indexOf("Plains") >= 0 && typeLine.indexOf("Land") >= 0)){
    colourIdentity = colourIdentity + "W";
  }
  if(stringToSearch.indexOf("{U") >= 0 || stringToSearch.indexOf("U}") >= 0 || (stringToSearch.indexOf("Island") >= 0 && typeLine.indexOf("Land") >= 0)){
    colourIdentity = colourIdentity + "U";
  }
  if(stringToSearch.indexOf("{B") >= 0 || stringToSearch.indexOf("B}") >= 0 || (stringToSearch.indexOf("Swamp") >= 0 && typeLine.indexOf("Land") >= 0)){
    colourIdentity = colourIdentity + "B";
  }
  if(stringToSearch.indexOf("{R") >= 0 || stringToSearch.indexOf("R}") >= 0 || (stringToSearch.indexOf("Mountain") >= 0 && typeLine.indexOf("Land") >= 0)){
    colourIdentity = colourIdentity + "R";
  }
  if(stringToSearch.indexOf("{G") >= 0 || stringToSearch.indexOf("G}") >= 0 || (stringToSearch.indexOf("Forest") >= 0 && typeLine.indexOf("Land") >= 0)){
    colourIdentity = colourIdentity + "G";
  }
  //colourIdentity = "";
  // Break into two files HERE.

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
  if(typeLine.indexOf("Land") < 0){
    docRef.activeLayer.textItem.contents = cardPower + "/" + cardTough;
    //---------- Mana Cost ----------
      myManaLayer = docRef.layers.getByName("Text and Icons");
      manaCostLayer = myManaLayer.layers.getByName("Mana Cost");
      manaCostLayer.textItem.contents = cardManaCost;
      insertManaCost(cardManaCost);
  }
  else{
    docRef.activeLayer.visible = false;
  }

  // Unfuck the typeline scaling I guess
  var myLayer = docRef.layers.getByName("Text and Icons");
  var mySubLayer = myLayer.layers.getByName("Expansion Symbol");
  var symbolLeftBound = mySubLayer.bounds[0];

  var mySubLayer = myLayer.layers.getByName("Typeline");
  var typelineRightBound = mySubLayer.bounds[2];
  var typelineFontsize = 59;
  while(typelineRightBound > symbolLeftBound){
    mySubLayer.textItem.size = new UnitValue(typelineFontsize - 1, "px"); typelineFontsize = typelineFontsize - 1;
    typelineRightBound = mySubLayer.bounds[2];
  }

  // ---------- Artist ----------
  replaceText("Artist", cardArtist);
  //---------- Card Name ----------
  // Select the name layer
  var myLayer = docRef.layers.getByName("Text and Icons");
  var mySubLayer = myLayer.layers.getByName("Card Name");
  docRef.activeLayer = mySubLayer;
  docRef.activeLayer.textItem.contents = cardName;

  // ---------- Card Frame ----------

  // Determine if we have an eldrazi-style card here
  var eldrazi = false;
  if(colourIdentity.length <= 0 && typeLine.indexOf("Artifact") < 0 && typeLine.indexOf("Land") < 0) eldrazi = true;

  // Determine if we have a creature or not.
  var isCreature = false;
  if(typeLine.indexOf("Creature") >= 0){
    isCreature = true;
  }
  else{
    // Turn off the power and toughness while we're here.
    var myLayer = docRef.layers.getByName("Text and Icons");
    var mySubLayer = myLayer.layers.getByName("Power / Toughness");
    mySubLayer.visible = false;
  }

  // Nyx man
  if(typeLine.indexOf("Enchantment") >= 0 && (typeLine.indexOf("Creature") >= 0 || typeLine.indexOf("Artifact") >= 0)){
    docRef.layers.getByName("Nyx").visible = true;
  }

  // Set the background.

  var selectedBackground = "";

  // If you need to set the colour manually, now's the time my dude
  // colourIdentity = "G";

  // Check what's on our typeline.
    if(typeLine.indexOf("Artifact") >= 0){
      selectedBackground = "Artifact";
    }
    else if(typeLine.indexOf("Land") >= 0){
      selectedBackground = "Land";
      var myLayer = docRef.layers.getByName("Text and Icons");
      var mySubLayer = myLayer.layers.getByName("Mana Cost");
      mySubLayer.visible = false;
      if(cardText.indexOf(" any ") >= 0 && cardName != "Vesuva") {
        colourIdentity = "WUBRG";
      }
    }
    else if(colourIdentity.length >= 2){
      selectedBackground = "Gold";
    }
    else{
      selectedBackground = colourIdentity;
    }
  if(eldrazi) selectedBackground = "Art Border";
  var myLayer = docRef.layers.getByName("Background");
  var mySubLayer = myLayer.layers.getByName(selectedBackground);
  mySubLayer.visible = true;

  // Select the correct pinlines.
  var selectedPinlines = "Gold";
  if(colourIdentity.length == 1){
    selectedPinlines = colourIdentity;
  }
  else if(colourIdentity.length <= 0){
    if(typeLine.indexOf("Land") >= 0) selectedPinlines = "Land";
    else selectedPinlines = "Artifact";
  }
  else if(colourIdentity.length == 2){
    if(colourIdentity == "WU" || colourIdentity == "UW"){
      if(colourIdentity == "WU" || colourIdentity == "UW")
        selectedPinlines = "WU";
      }
      else if(colourIdentity == "UB" || colourIdentity == "BU"){
        selectedPinlines = "UB";
      }
      else if(colourIdentity == "BR" || colourIdentity == "RB"){
        selectedPinlines = "BR";
      }
      else if(colourIdentity == "RG" || colourIdentity == "GR"){
        selectedPinlines = "RG";
      }
      else if(colourIdentity == "GW" || colourIdentity == "WG"){
        selectedPinlines = "GW";
      }
      else if(colourIdentity == "WB" || colourIdentity == "BW"){
        selectedPinlines = "WB";
      }
      else if(colourIdentity == "BG" || colourIdentity == "GB"){
        selectedPinlines = "BG";
      }
      else if(colourIdentity == "GU" || colourIdentity == "UG"){
        selectedPinlines = "GU";
      }
      else if(colourIdentity == "UR" || colourIdentity == "RU"){
        selectedPinlines = "UR";
      }
      else if(colourIdentity == "RW" || colourIdentity == "WR"){
        selectedPinlines = "RW";
      }
  }
  else if(colourIdentity.length > 2){
    selectedPinlines = "Gold";
  }
  if(eldrazi) selectedPinlines = "Artifact";

  var pinlinesName = "Pinlines & Textbox";
  if(typeLine.indexOf("Land") >= 0 && colourIdentity.length <= 2){
    pinlinesName = "Land Pinlines & Textbox";
  }

  var myLayer = docRef.layers.getByName(pinlinesName);
  var mySubLayer = myLayer.layers.getByName(selectedPinlines);
  mySubLayer.visible = true;
  if(eldrazi) mySubLayer.fillOpacity = 70;

  // Select the correct name box and P/T box.
  var selectedNamebox = "";
  if(typeLine.indexOf("Land") >= 0 && colourIdentity.length <= 2){
    selectedNamebox = "Land";
  }
  else if(colourIdentity.length == 0){
    selectedNamebox = "Artifact";
  }
  else if(colourIdentity.length == 1){
    selectedNamebox = colourIdentity;
  }
  else if(colourIdentity.length >= 2){
    selectedNamebox = "Gold";
  }
  var myLayer = docRef.layers.getByName("Name & Title Boxes");
  if(eldrazi) selectedNamebox = "Artifact";
  var mySubLayer = myLayer.layers.getByName(selectedNamebox);
  mySubLayer.visible = true;
  if(eldrazi) mySubLayer.fillOpacity = 70;
  textLayerName = "Rules Text - Noncreature";
  if(isCreature == true){
    var myLayer = docRef.layers.getByName("PT Box");
    var mySubLayer = myLayer.layers.getByName(selectedNamebox);
    mySubLayer.visible = true;
    textLayerName = "Rules Text - Creature";
  }

  // ---------- Watermark ----------
  //var watermarkLayer = mySubLayer.layers.getByName("Watermark");
  //docRef.activeLayer = watermarkLayer;
  //docRef.activeLayer.visible = true;
  //docRef.activeLayer.textItem.contents = myGlyph;

  // ---------- Rules Text ----------
  var myLayer = docRef.layers.getByName("Text and Icons");
  var myNewLayer = myLayer.layers.getByName(textLayerName);
  docRef.activeLayer = myNewLayer;
  if(cardText !== undefined){
    cardText = cardText.replace(/\n/g,"\r");
  }
  else{
    cardText = "";
  }
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
  var flavourIndex = -1;
  italicText.push("Threshold");
  italicText.push("Landfall");
  italicText.push("Council's dilemma");
  italicText.push("Imprint");
  italicText.push("Parley");
  italicText.push("Metalcraft");
  italicText.push("Spell mastery");
  italicText.push("Tempting offer");
  italicText.push("Will of the council");
  italicText.push("Raid");
  italicText.push("Ferocious")
  italicText.push("Enrage")
  italicText.push("Kinship")
  italicText.push("Domain")

  if(flavourText.length > 1){
    flavourText = flavourText.replace(/\n/g,"\r");
    italicText.push(flavourText);
    flavourIndex = cardText.length;
  }
  // Jam the rules text and flavour text together
  if(flavourText.length > 0){
    var completeString = cardText + "\r" + flavourText;
  }
  else{
    var completeString = cardText;
  }

  // Maybe centre justify the text box
  var centredText = false;
  //if(flavourText.length <= 1 && cardText.length <= 70 && cardText.indexOf("\r") < 0) centredText = true;
  if(flavourText.length <= 1 && cardText.length <= 70) centredText = true;

  // Insert those mana symbols and italic text
  insertManaAndItaliciseText(completeString, italicText, flavourIndex, textLayerName, centredText);
  if(centredText){
    // Here we go boys
    docRef.activeLayer.textItem.justification = Justification.CENTER;
  }

  // Scale the text to fit in the text box
  // Gib reference height
  var myLayer = docRef.layers.getByName("Text and Icons");
  var myRefLayer = myLayer.layers.getByName("Textbox Reference");
  var man = new UnitValue(30, "px");
  var layerHeight = myRefLayer.bounds[3] - myRefLayer.bounds[1] - man.as("cm");

  var scaled = scaleTextToFitBoxNew(myNewLayer, layerHeight);

  verticallyAlignText(textLayerName);

  if(typeLine.indexOf("Creature") >= 0) verticallyFixText(textLayerName);

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
      var filename = filePath + '\\out\\' + cardName + '.png';
      desc3.putPath( idIn, new File( filename ) );
      var idCpy = charIDToTypeID( "Cpy " );
      desc3.putBoolean( idCpy, true );
  executeAction( idsave, desc3, DialogModes.NO );

  // Close the thing without saving
  docRef.close(SaveOptions.DONOTSAVECHANGES);
  //$.evalFile(filePath + "text/borderify.jsx");
}
