#include "json2.js";
#include "layouts.jsx";
#include "templates.jsx";
#include "constants.jsx";
#include "..\\settings.jsx";

// Settings
// Switch from the default template by uncommenting a line here
// Make sure you know what you're doing when you force the script to use a specific template
var chosenTemplate = "";
// var chosenTemplate = "znrexp";
// var chosenTemplate = "masterpiece";
// var chosenTemplate = "stargazing";
// var chosenTemplate = "womensday";
// var chosenTemplate = "universesbeyond";
// var chosenTemplate = "normal-promo";
// var chosenTemplate = "basic-theros";
// var chosenTemplate = "basic-unstable";
// var chosenTemplate = "pw-textonly";

// Toggle between these two lines to use the normal frame or box topper frame
var extended = "";
// var extended = "-extended";

// Toggle breakpoint to manually edit image before rasterising text & saving image
var breakpoint = false;
// var breakpoint = true;

function retrieve_card_name_and_artist(file) {
    /**
     * Retrieve card name and (if specified) artist from the input file.
     */
    var filename = decodeURI(file.name);
    var filename_no_ext = filename.slice(0, filename.lastIndexOf("."));

    var open_index = filename_no_ext.lastIndexOf(" (");
    var close_index = filename_no_ext.lastIndexOf(")");

    var card_name = filename_no_ext;
    var artist = "";

    if (open_index > 0 && close_index > 0) {
        // File name includes artist name - slice and dice
        artist = filename_no_ext.slice(open_index + 2, close_index);
        card_name = filename_no_ext.slice(0, open_index);
    }

    return {
        card_name: card_name,
        artist: artist,
    }
}

function call_python(cardname, filepath) {
    /**
     * Calls the Python script which queries Scryfall for card info and saves the resulting JSON dump to disk in \scripts.
     */
    if ($.os.search(/windows/i) != -1) {
        // Windows
        app.system("python \"" + filepath + "\\scripts\\get_card_info.py\" \"" + cardname + "\"");
    } else {
        // macOS
        app.system("/usr/local/bin/python3 " + filepath + "/scripts/get_card_info.py \"" + cardname + "\" >> " + filepath + "/scripts/debug.log 2>&1");
    }
}

function select_template(layout, file, file_path) {
    /**
     * Instantiate a template object based on the card layout and user settings.
     */

    var cls;
    if (layout.scryfall.layout === "adventure") {
        cls = AdventureTemplate;
    } else if (layout.type_line.indexOf("Planeswalker") >= 0) {
        cls = PlaneswalkerTemplate;
    }
    else if (layout.type_line.indexOf("Snow") >= 0) {  // frame_effects doesn't contain "snow" for pre-KHM snow cards
        cls = SnowTemplate;
    }
    else if (layout.keywords.indexOf("Mutate") >= 0) {
        cls = MutateTemplate;
    } else if (layout.frame_effects.indexOf("miracle") >= 0) {
        cls = MiracleTemplate;
    } else {
        cls = NormalTemplate;
    }

    // TODO

    return new cls(layout, file, file_path);
}

function read_json(file_path) {
    var json_file = new File(file_path + "/scripts/card.json");
    json_file.open('r');
    var json_string = json_file.read();
    json_file.close();
    return JSON.parse(JSON.parse(json_string));
}

function proxy_new(file) {
    // TODO: specify the desired template for a card in the filename?
    var file_path = File($.fileName).parent.parent.fsName;

    var ret = retrieve_card_name_and_artist(file);
    var card_name = ret.card_name;
    var artist = ret.artist;

    if (BasicLandNames.toString().indexOf(card_name) >= 0) {
        var layout = {
            artist: artist,
            name: card_name,
        };
        var template = new BasicLandTemplate(layout, file, file_path);
    } else {
        call_python(card_name, file_path);

        var scryfall = read_json(file_path);
        var layout_name = scryfall.layout;

        // instantiate layout obj (unpacks scryfall json and stores relevant parts in obj properties)
        if (layout_name in layout_map) {
            var layout = new layout_map[layout_name](scryfall, card_name);
        } else {
            throw new Error("Layout" + layout_name + " is not supported. Sorry!");
        }

        // if artist specified in file name, insert the specified artist into layout obj
        if (artist !== "") {
            layout.artist = artist;
        }

        // TODO: support manually specifying the template
        var template = select_template(layout, file, file_path);
    }

    // execute the template - insert text fields, set visibility of layers, etc. - and save to disk
    var file_name = template.execute();
    save_and_close(file_name, file_path);
}
















function proxy(file, ye) {
    var filePath = File($.fileName).parent.parent.fsName;
    $.evalFile(filePath + "/scripts/json2.js");

    // Retrieve the card's name from the given filepath
    var filename;
    if (ye == 1) filename = decodeURI(file.name);
    else filename = decodeURI(file[0].name);
    fullCardName = filename.slice(0, filename.lastIndexOf("."));

    // Retrieve the card's name and artist
    var openIndex = fullCardName.lastIndexOf(" (");
    var closeIndex = fullCardName.lastIndexOf(")");
    var cardName = ""; var cardArtist = "";
    if (openIndex < 0 || closeIndex < 0) {
        // File name didn't include the artist name - retrieve it from card.json
        cardName = fullCardName;
    } else {
        // File name includes artist name - slice and dice
        cardArtist = fullCardName.slice(openIndex + 2, closeIndex);
        cardName = fullCardName.slice(0, openIndex);
    }

    var basicNames = [
        "Plains",
        "Island",
        "Swamp",
        "Mountain",
        "Forest",
        "Wastes",
        "Snow-Covered Plains",
        "Snow-Covered Island",
        "Snow-Covered Swamp",
        "Snow-Covered Mountain",
        "Snow-Covered Forest"
    ];

    if (basicNames.toString().indexOf(cardName) >= 0) { // cardName == "Plains" || cardName == "Island" || cardName == "Swamp" || cardName == "Mountain" || cardName == "Forest" || cardName == "Wastes") {
        proxyBasic(cardName, cardArtist, ye);
    } else {
        // Run Python script to get info from Scryfall
        // Execute this with different commands, depending on operating system
        // Assumes users are only using either Windows or macOS
        // Thanks to jamesthe500 on stackoverflow for the OS-detecting code
        if ($.os.search(/windows/i) != -1) {
            // Windows
            app.system("python get_card_info.py \"" + cardName + "\"");
        } else {
            // macOS
            app.system("/usr/local/bin/python3 " + filePath + "/scripts/get_card_info.py \"" + cardName + "\" >> " + filePath + "/scripts/debug.log 2>&1");
        }

        var cardJSONFile = new File(filePath + "/scripts/card.json");
        cardJSONFile.open('r');
        var cardJSON = cardJSONFile.read();
        cardJSONFile.close();

        // Why do we have to parse this twice? To be honest only God knows lmao
        var jsonParsed = JSON.parse(JSON.parse(cardJSON));

        // Retrive card name from Scryfall in case the capitalisation in the filename was wrong
        cardName = jsonParsed.name;

        // If no artist name was supplied, use the name from Scryfall
        if (cardArtist == "") cardArtist = jsonParsed.artist;

        if (jsonParsed.layout == "normal" || jsonParsed.layout == "mutate" || jsonParsed.layout == "snow" || jsonParsed.layout == "miracle" || jsonParsed.layout == "adventure") {
            proxyNormal(jsonParsed, ye, cardName, cardArtist, expansionSymbol, jsonParsed.layout);
        } else if (jsonParsed.layout == "planeswalker" || jsonParsed.type.indexOf("Planeswalker") > 0) {
            proxyPlaneswalker(jsonParsed, ye, cardName, cardArtist, expansionSymbol);
        } else if (jsonParsed.layout == "transform") {
            if (jsonParsed.face == "front") {
                proxyNormal(jsonParsed, ye, cardName, cardArtist, expansionSymbol, "tf-front");
            } else if (jsonParsed.face == "back") {
                proxyNormal(jsonParsed, ye, cardName, cardArtist, expansionSymbol, "tf-back");
            }
        } else if (jsonParsed.layout == "modal_dfc") {
            if (jsonParsed.face == "front") {
                proxyNormal(jsonParsed, ye, cardName, cardArtist, expansionSymbol, "mdfc-front");
            } else if (jsonParsed.face == "back") {
                proxyNormal(jsonParsed, ye, cardName, cardArtist, expansionSymbol, "mdfc-back");
            }
        } else if (jsonParsed.layout == "planar") {
            proxyPlanar(jsonParsed, ye, cardName, cardArtist)
        }
    }
}

function proxyPlanar(jsonParsed, ye, cardName, cardArtist) {
    // Load in json2.js and some function files
    $.evalFile(filePath + "/scripts/json2.js");
    $.evalFile(filePath + "/scripts/formatText.jsx");
    $.evalFile(filePath + "/scripts/excessFunctions.jsx");

    templateName = "planar";
    var fileRef = new File(filePath + "/templates/" + templateName + ".psd");
    app.open(fileRef);
    var docRef = app.activeDocument;

    // Place it in the template
    if (ye == 1) app.load(file);
    else app.load(file[0]);
    backFile = app.activeDocument;
    backFile.selection.selectAll();
    backFile.selection.copy();
    backFile.close(SaveOptions.DONOTSAVECHANGES);
    docRef.paste();

    // Create a reference to the active document for convenience
    docRef = app.activeDocument;
    var textAndIcons = docRef.layers.getByName("Text and Icons");

    // Move art into position
    var artLayerFrameName = "Art Frame";
    var artLayerFrame = docRef.layers.getByName(artLayerFrameName);
    frame(docRef.layers.getByName("Layer 1"),
        artLayerFrame.bounds[0].as("px"),
        artLayerFrame.bounds[1].as("px"),
        artLayerFrame.bounds[2].as("px"),
        artLayerFrame.bounds[3].as("px"));

    // Insert artist name
    var artistLayer = docRef.layers.getByName("Legal").layers.getByName("Artist");
    docRef.activeLayer = artistLayer;
    replaceText("Artist", cardArtist);

    // Insert card name, aligning horizontally afterwards
    docRef.activeLayer = textAndIcons.layers.getByName("Card Name");
    docRef.activeLayer.textItem.contents = cardName;
    var idAlgn = charIDToTypeID("Algn");
    var desc855 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref363 = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref363.putEnumerated(idLyr, idOrdn, idTrgt);
    desc855.putReference(idnull, ref363);
    var idUsng = charIDToTypeID("Usng");
    var idADSt = charIDToTypeID("ADSt");
    var idAdCH = charIDToTypeID("AdCH");
    desc855.putEnumerated(idUsng, idADSt, idAdCH);
    executeAction(idAlgn, desc855, DialogModes.NO);

    // Split card text into static ability & chaos ability text
    var cardText = jsonParsed.text;
    if (cardText !== undefined) cardText = cardText.replace(/\n/g, "\r");
    var splitIndex = cardText.indexOf("Whenever you roll {CHAOS},");
    var cardTextArray = [cardText];
    if (splitIndex > 0) cardTextArray = [cardText.slice(0, splitIndex - 1), cardText.slice(splitIndex)];

    // Insert card name, aligning horizontally afterwards
    docRef.activeLayer = textAndIcons.layers.getByName("Typeline");
    docRef.activeLayer.textItem.contents = jsonParsed.type;
    idAlgn = charIDToTypeID("Algn");
    desc855 = new ActionDescriptor();
    idnull = charIDToTypeID("null");
    ref363 = new ActionReference();
    idLyr = charIDToTypeID("Lyr ");
    idOrdn = charIDToTypeID("Ordn");
    idTrgt = charIDToTypeID("Trgt");
    ref363.putEnumerated(idLyr, idOrdn, idTrgt);
    desc855.putReference(idnull, ref363);
    idUsng = charIDToTypeID("Usng");
    idADSt = charIDToTypeID("ADSt");
    idAdCH = charIDToTypeID("AdCH");
    desc855.putEnumerated(idUsng, idADSt, idAdCH);
    executeAction(idAlgn, desc855, DialogModes.NO);

    // Format text on static / phenomenon ability
    var reminderTextBool = true;
    var italicText = [];
    endIndex = 0;
    while (reminderTextBool) {
        startIndex = cardTextArray[0].indexOf("(", endIndex);
        if (startIndex >= 0) {
            endIndex = cardTextArray[0].indexOf(")", startIndex + 1);
            italicText.push(cardTextArray[0].slice(startIndex, endIndex + 1));
        } else {
            reminderTextBool = false;
        }
    }
    docRef.activeLayer = textAndIcons.layers.getByName("Static Ability");
    formatText(cardTextArray[0], italicText, -1, false);

    if (cardTextArray.length > 1) {
        // Plane - enable layer mask
        docRef.activeLayer = docRef.layers.getByName("Frame").layers.getByName("Text Boxes");
        enableLayerMask();

        // Format text on chaos abiltiy
        reminderTextBool = true;
        italicText = [];
        endIndex = 0;
        while (reminderTextBool) {
            startIndex = cardTextArray[1].indexOf("(", endIndex);
            if (startIndex >= 0) {
                endIndex = cardTextArray[1].indexOf(")", startIndex + 1);
                italicText.push(cardTextArray[1].slice(startIndex, endIndex + 1));
            } else {
                reminderTextBool = false;
            }
        }

        docRef.activeLayer = textAndIcons.layers.getByName("Chaos Ability");
        formatText(cardTextArray[1], italicText, -1, false);
    } else {
        // Phenomenon - disable chaos symbol layer and chaos rules text
        textAndIcons.layers.getByName("Chaos Symbol").visible = false;
        textAndIcons.layers.getByName("Chaos Ability").visible = false;
    }

    // Drop in scan from Scryfall to help line up text
    docRef.activeLayer = docRef.layers.getByName("Frame");
    var idPlc = charIDToTypeID("Plc ");
    var desc548 = new ActionDescriptor();
    var idIdnt = charIDToTypeID("Idnt");
    desc548.putInteger(idIdnt, 196);
    idnull = charIDToTypeID("null");
    desc548.putPath(idnull, new File(filePath + "/scripts/card.jpg"));
    var idFTcs = charIDToTypeID("FTcs");
    var idQCSt = charIDToTypeID("QCSt");
    var idQcsa = charIDToTypeID("Qcsa");
    desc548.putEnumerated(idFTcs, idQCSt, idQcsa);
    var idOfst = charIDToTypeID("Ofst");
    var desc549 = new ActionDescriptor();
    var idHrzn = charIDToTypeID("Hrzn");
    var idPxl = charIDToTypeID("#Pxl");
    desc549.putUnitDouble(idHrzn, idPxl, 0.500000);
    var idVrtc = charIDToTypeID("Vrtc");
    idPxl = charIDToTypeID("#Pxl");
    desc549.putUnitDouble(idVrtc, idPxl, -0.500000);
    idOfst = charIDToTypeID("Ofst");
    desc548.putObject(idOfst, idOfst, desc549);
    var idAngl = charIDToTypeID("Angl");
    var idAng = charIDToTypeID("#Ang");
    desc548.putUnitDouble(idAngl, idAng, 90.000000);
    executeAction(idPlc, desc548, DialogModes.NO);
    var scanRef = docRef.layers.getByName("Planechase Frame");
    frame(docRef.layers.getByName("card"),
        scanRef.bounds[0].as("px"),
        scanRef.bounds[1].as("px"),
        scanRef.bounds[2].as("px"),
        scanRef.bounds[3].as("px"));

    // Finish off card by aligning text & saving manually
    docRef.layers.getByName("card").move(docRef.layers.getByName("Frame"), ElementPlacement.PLACEBEFORE);
    docRef.selection.deselect();
}

function proxyBasic(cardName, cardArtist, ye) {
    $.evalFile(filePath + "/scripts/excessFunctions.jsx");

    templateName = "basic";
    if (chosenTemplate != "") fileRef = new File(filePath + "/templates/" + chosenTemplate + ".psd");
    else var fileRef = new File(filePath + "/templates/" + templateName + ".psd");
    // var fileRef = new File(filePath + "/templates/" + templateName + ".psd");
    app.open(fileRef);

    var docRef = app.activeDocument;

    // Place it in the template
    if (ye == 1) app.load(file);
    else app.load(file[0]);
    backFile = app.activeDocument;
    backFile.selection.selectAll();
    backFile.selection.copy();
    backFile.close(SaveOptions.DONOTSAVECHANGES);
    docRef.paste();

    docRef = app.activeDocument;

    // Move art into position
    var artLayerFrameName = "Basic Art Frame";
    var artLayerFrame = docRef.layers.getByName(artLayerFrameName);
    frame(docRef.layers.getByName("Layer 1"),
        artLayerFrame.bounds[0].as("px"),
        artLayerFrame.bounds[1].as("px"),
        artLayerFrame.bounds[2].as("px"),
        artLayerFrame.bounds[3].as("px"));

    docRef.layers.getByName(cardName).visible = true;
    legalLayer = docRef.layers.getByName("Legal");
    legalLayer.layers.getByName("Artist").textItem.contents = cardArtist;

    saveImage(cardName + " (" + cardArtist + ")");
}

function proxyPlaneswalker(jsonParsed, ye, cardName, cardArtist, expansionSymbol) {
    // Load in json2.js and some function files
    $.evalFile(filePath + "/scripts/json2.js");
    $.evalFile(filePath + "/scripts/formatText.jsx");
    $.evalFile(filePath + "/scripts/excessFunctions.jsx");
    $.evalFile(filePath + "/scripts/framelogic.jsx");

    var templateName = "pw" + extended;
    var fileRef = new File(filePath + "/templates/" + templateName + ".psd");
    if (chosenTemplate != "") fileRef = new File(filePath + "/templates/" + chosenTemplate + ".psd");
    app.open(fileRef);

    // Place it in the template
    if (ye == 1) app.load(file);
    else app.load(file[0]);

    backFile = app.activeDocument;
    backFile.selection.selectAll();
    backFile.selection.copy();
    backFile.close(SaveOptions.DONOTSAVECHANGES);

    // Retrieve some more info about the card.
    var typeLine = jsonParsed.type;
    var cardLoyalty = jsonParsed.loyalty;
    var cardText = jsonParsed.text;
    var cardRarity = jsonParsed.rarity;
    var cardManaCost = jsonParsed.manaCost;

    // Create a reference to the active document for convenience
    var docRef = app.activeDocument;
    var abilities = jsonParsed.text.split("\n");
    var numAbilities = 3; if (abilities.length > 3) numAbilities = 4;
    var templateRef = docRef.layers.getByName("pw-" + String(numAbilities));
    var textAndIcons = templateRef.layers.getByName("Text and Icons");
    templateRef.visible = true;

    // Select the correct layers
    selectedLayers = selectFrameLayers(jsonParsed);

    // Move art into position
    docRef.paste();
    var artLayerFrameName = "Planeswalker Art Frame";
    if (selectedLayers[4]) artLayerFrameName = "Full Art Frame";
    var artLayerFrame = docRef.layers.getByName(artLayerFrameName);
    frame(docRef.layers.getByName("Layer 1"),
        artLayerFrame.bounds[0].as("px"),
        artLayerFrame.bounds[1].as("px"),
        artLayerFrame.bounds[2].as("px"),
        artLayerFrame.bounds[3].as("px"));

    // Background
    backgroundLayer = templateRef.layers.getByName("Background");
    backgroundLayer.layers.getByName(selectedLayers[0]).visible = true;

    // Pinlines
    pinlinesLayer = templateRef.layers.getByName("Pinlines");
    pinlinesLayer.layers.getByName(selectedLayers[1]).visible = true;

    // Twins
    nameboxLayer = templateRef.layers.getByName("Name & Title Boxes");
    nameboxLayer.layers.getByName(selectedLayers[2]).visible = true;

    // Rarity gradient
    textAndIcons.layers.getByName("Expansion Symbol").textItem.contents = expansionSymbol;
    gradient(textAndIcons, cardRarity);

    // Insert basic text fields
    replaceText("Artist", cardArtist);
    insertManaCost(textAndIcons, cardManaCost);
    insertName(textAndIcons, cardName, "Card Name", false);
    insertTypeline(textAndIcons, typeLine, "Typeline", false);

    // Insert loyalty stuff
    var loyaltyGroup = templateRef.layers.getByName("Loyalty Graphics");
    startingLoyalty = loyaltyGroup.layers.getByName("Starting Loyalty");
    startingLoyalty.layers.getByName("Text").textItem.contents = cardLoyalty;

    groupNames = ["First Ability", "Second Ability", "Third Ability", "Fourth Ability"];
    for (var i = 0; i < abilities.length; i++) {
        // Select the appropriate ability group
        abilityGroup = loyaltyGroup.layers.getByName(groupNames[i]);
        var colonIndex = abilities[i].indexOf(": ");
        if (colonIndex > 0 && colonIndex < 5) {
            // Loyalty ability, not a static ability
            var loyaltyType = "";
            var loyaltyNumber;
            if (abilities[i].charAt(0) == "+") {
                // Plus abiltiy
                loyaltyNumber = abilities[i].slice(1, colonIndex);
                loyaltyType = "+";
            } else if (abilities[i].charAt(0) == "\u2212" || abilities[i].charAt(0) == "-") {
                // Minus ability
                loyaltyNumber = abilities[i].slice(1, colonIndex);
                loyaltyType = "-";
            } else if (abilities[i].charAt(0) == "0") {
                // Zero ability
                loyaltyNumber = "0";
                loyaltyType = "";
            }
            var abilityText = abilities[i].slice(colonIndex + 2, abilities[i].length);

            // Select the correct layer, paste in the ability
            var abilityTextLayer = abilityGroup.layers.getByName("Ability Text");
            // abilityTextLayer.textItem.contents = abilityText;
            docRef.activeLayer = abilityTextLayer;
            formatText(abilityText, [], -1, false);

            var loyaltyNumberGroup;
            if (loyaltyType == "") loyaltyNumberGroup = abilityGroup.layers.getByName("0");
            else loyaltyNumberGroup = abilityGroup.layers.getByName(loyaltyType);

            loyaltyNumberGroup.visible = true;
            var loyaltyText = loyaltyNumberGroup.layers.getByName("Cost");
            loyaltyText.textItem.contents = loyaltyType + loyaltyNumber;
        } else {
            // Static ability
            var staticTextLayer = abilityGroup.layers.getByName("Static Text");
            staticTextLayer.visible = true;
            staticTextLayer.textItem.contents = abilities[i];

            docRef.activeLayer = staticTextLayer;
            formatText(abilities[i], [], -1, false);

            abilityGroup.layers.getByName("Ability Text").visible = false;
            abilityGroup.layers.getByName("Colon").visible = false;
        }
    }

    if (abilities.length == 2) {
        // planeswalker with only two abilities - hide the third one
        loyaltyGroup.layers.getByName(groupNames[2]).visible = false;
    }

    // Drop in scan from Scryfall to help line up text
    docRef.activeLayer = templateRef.layers.getByName("Name & Title Boxes");
    var idPlc = charIDToTypeID("Plc ");
    var desc300 = new ActionDescriptor();
    var idIdnt = charIDToTypeID("Idnt");
    desc300.putInteger(idIdnt, 8219);
    idnull = charIDToTypeID("null");
    desc300.putPath(idnull, new File(filePath + "/scripts/card.jpg"));
    var idLnkd = charIDToTypeID("Lnkd");
    desc300.putBoolean(idLnkd, true);
    var idFTcs = charIDToTypeID("FTcs");
    var idQCSt = charIDToTypeID("QCSt");
    var idQcsa = charIDToTypeID("Qcsa");
    desc300.putEnumerated(idFTcs, idQCSt, idQcsa);
    var idOfst = charIDToTypeID("Ofst");
    var desc301 = new ActionDescriptor();
    var idHrzn = charIDToTypeID("Hrzn");
    var idPxl = charIDToTypeID("#Pxl");
    desc301.putUnitDouble(idHrzn, idPxl, 0.000000);
    var idVrtc = charIDToTypeID("Vrtc");
    idPxl = charIDToTypeID("#Pxl");
    desc301.putUnitDouble(idVrtc, idPxl, 0.000000);
    idOfst = charIDToTypeID("Ofst");
    desc300.putObject(idOfst, idOfst, desc301);
    var idWdth = charIDToTypeID("Wdth");
    var idPrc = charIDToTypeID("#Prc");
    desc300.putUnitDouble(idWdth, idPrc, 100.000000);
    var idHght = charIDToTypeID("Hght");
    idPrc = charIDToTypeID("#Prc");
    desc300.putUnitDouble(idHght, idPrc, 100.000000);
    executeAction(idPlc, desc300, DialogModes.NO);

    // fit scryfall scan to frame
    var scryfallScanFrameName = "Scryfall Scan Frame";
    var scryfallScanFrame = docRef.layers.getByName(scryfallScanFrameName);
    frame(templateRef.layers.getByName("card"),
        scryfallScanFrame.bounds[0].as("px"),
        scryfallScanFrame.bounds[1].as("px"),
        scryfallScanFrame.bounds[2].as("px"),
        scryfallScanFrame.bounds[3].as("px"));

    // Make the script error so we can finish it off by hand
    exit();
}

function proxyNormal(jsonParsed, ye, cardName, cardArtist, expansionSymbol, layout) {

    // Load in json2.js and some function files
    $.evalFile(filePath + "/scripts/json2.js");
    $.evalFile(filePath + "/scripts/formatText.jsx");
    $.evalFile(filePath + "/scripts/excessFunctions.jsx");
    $.evalFile(filePath + "/scripts/framelogic.jsx");

    var isIxalan = jsonParsed.type.indexOf("Land") >= 0 && layout == "tf-back";
    if (isIxalan) layout = "ixalan";

    var fileRef;
    if (chosenTemplate != "") fileRef = new File(filePath + "/templates/" + chosenTemplate + ".psd");
    else if (layout == "normal") fileRef = new File(filePath + "/templates/" + layout + extended + ".psd");
    // if (layout == "normal") fileRef = new File(filePath + "/templates/" + "fullartland" + ".psd");
    else fileRef = new File(filePath + "/templates/" + layout + ".psd");

    app.open(fileRef);

    // Place it in the template
    if (ye == 1) app.load(file);
    else app.load(file[0]);

    backFile = app.activeDocument;
    backFile.selection.selectAll();
    backFile.selection.copy();
    backFile.close(SaveOptions.DONOTSAVECHANGES);

    // Create a reference to the active document for convenience
    var docRef = app.activeDocument;
    var textAndIcons = docRef.layers.getByName("Text and Icons");

    // Retrieve some more info about the card.
    var typeLine = jsonParsed.type;
    var cardPower = jsonParsed.power;
    var cardTough = jsonParsed.toughness;
    var cardText = jsonParsed.text;
    var cardRarity = jsonParsed.rarity;
    var flavourText = jsonParsed.flavourText;
    var cardManaCost = jsonParsed.manaCost;

    // Run the layer selection algorithm
    selectedLayers = selectFrameLayers(jsonParsed);

    // Paste art and move it into position
    docRef.paste();
    var artLayerFrameName = "Art Frame";
    if (selectedLayers[4]) artLayerFrameName = "Full Art Frame";
    var artLayerFrame = docRef.layers.getByName(artLayerFrameName);
    frame(docRef.layers.getByName("Layer 1"),
        artLayerFrame.bounds[0].as("px"),
        artLayerFrame.bounds[1].as("px"),
        artLayerFrame.bounds[2].as("px"),
        artLayerFrame.bounds[3].as("px"));

    // Set up some layer name & other utility variables
    var cardnameLayerName = "Card Name";
    var typelineLayerName = "Typeline";
    var textLayerName = "Rules Text - Noncreature";
    var nameboxName = "Name & Title Boxes";
    var pinlinesName = "Pinlines & Textbox";
    var ptBoxGroup = "PT Box";
    var isCreature = cardPower != null && cardTough != null;
    if (isCreature) textLayerName = "Rules Text - Creature";
    var textColour = new SolidColor();
    textColour.rgb.red = 255.0; textColour.rgb.blue = 255.0; textColour.rgb.green = 255.0;
    var nyxcrown = (typeLine.indexOf("Legendary") >= 0 && typeLine.indexOf("Enchantment") >= 0) && (typeLine.indexOf("Creature") >= 0 || typeLine.indexOf("Artifact") >= 0);
    // Add a colour indicator dot when the card has no mana cost, it isn't a land
    // (or it is a creature: cornercase Dryad Arbor), and it isn't an artifact
    if ((cardManaCost == "" || cardManaCost == "{0}") &&
        (typeLine.indexOf("Land") < 0 || typeLine.indexOf("Creature") >= 0) &&
        selectedLayers[1] != "Artifact" && !selectedLayers[4]) {
        // Card needs a colour indicator
        var colourIndicator = docRef.layers.getByName("Colour Indicator");
        colourIndicator.layers.getByName(selectedLayers[1]).visible = true;

        // Shift the typeline
        textAndIcons.layers.getByName(typelineLayerName).visible = false;
        typelineLayerName = typelineLayerName + " Shift";
        textAndIcons.layers.getByName(typelineLayerName).visible = true;
    }

    // Modify a few things if the card is a transform card
    if (layout.indexOf("tf") >= 0 || layout.indexOf("mdfc-") >= 0) {
        // Shift the card name layer
        textAndIcons.layers.getByName(cardnameLayerName).visible = false;
        cardnameLayerName = cardnameLayerName + " Shift";
        textAndIcons.layers.getByName(cardnameLayerName).visible = true;

        // Select the correct twins and pinlines
        // nameboxName = nameboxName + " " + layout;
        // pinlinesName = pinlinesName + " " + layout;

        if (layout.indexOf("tf-") >= 0) {
            // Switch on the transform icon in the top left
            textAndIcons.layers.getByName("Transform Backing").visible = true;
            var transformGroup = textAndIcons.layers.getByName(layout);
            transformGroup.layers.getByName(String(jsonParsed.frame_effect)).visible = true;

            // If the card is a front face with a creature back, insert the back P/T
            if (layout == "tf-front" && jsonParsed.back_power != null && jsonParsed.back_toughness != null) {
                var flipPT = textAndIcons.layers.getByName("Flipside Power / Toughness");
                flipPT.visible = true;
                flipPT.textItem.contents = jsonParsed.back_power + "/" + jsonParsed.back_toughness;
                // Select the correct text box as well
                textLayerName = textLayerName + " Flip";

            }
        }
        else {
            // card must be a MDFC - enable the correct layers and insert info
            var mdfcGroup = textAndIcons.layers.getByName(layout);
            mdfcGroup.layers.getByName("Left").textItem.contents = jsonParsed.back.type_short;
            docRef.activeLayer = mdfcGroup.layers.getByName("Right");
            formatText(jsonParsed.back.info_short, [], -1, false);

            var topGroup = mdfcGroup.layers.getByName("Top");
            // enable the colour for this face
            var topName = selectedLayers[1];
            if (topName.length == 2) topName = "Gold";
            topGroup.layers.getByName(topName).visible = true;

            // enable the colour for the reverse face
            var bottomGroup = mdfcGroup.layers.getByName("Bottom");
            var bottomColour = selectFrameLayers(jsonParsed.back)[1];
            if (bottomColour.length == 2) bottomColour = "Gold";
            bottomGroup.layers.getByName(bottomColour).visible = true;
        }

        if ((layout == "tf-back" && !selectedLayers[4]) || (layout.indexOf("-back") >= 0 && layout != "tf-back")) {
            // Card is a back face that's not an eldrazi - make the relevant text white
            textAndIcons.layers.getByName(cardnameLayerName).textItem.color = textColour;
            textAndIcons.layers.getByName(typelineLayerName).textItem.color = textColour;
            textAndIcons.layers.getByName("Power / Toughness").textItem.color = textColour;
        }
    }

    var backgroundLayer = docRef.layers.getByName("Background");
    if (isIxalan) {
        // Switch on the correct background for ixalan style lands
        backgroundLayer.layers.getByName(selectedLayers[1]).visible = true;

    } else {
        // Nyx layer
        if (selectedLayers[3]) {
            var nyxLayer = docRef.layers.getByName("Nyx");
            nyxLayer.layers.getByName(selectedLayers[0]).visible = true;
        } else {
            // Background
            backgroundLayer.layers.getByName(selectedLayers[0]).visible = true;
        }

        // also switch on nyxcrown for legendary masterpiece cards and companion cards, but do it after the background is adjusted
        var isCompanion = (cardText.indexOf("Companion ") == 0);
        if (isCompanion) {
            // turn on companion crown layer
            docRef.layers.getByName("Companion").layers.getByName(selectedLayers[0]).visible = true;
        }
        nyxcrown = nyxcrown || (chosenTemplate == "masterpiece" && typeLine.indexOf("Legendary") >= 0) || isCompanion;

        // Pinlines
        if (typeLine.indexOf("Land") >= 0) pinlinesName = "Land " + pinlinesName;  //  && jsonParsed.layout == "normal"
        var pinlinesLayer = docRef.layers.getByName(pinlinesName);
        pinlinesLayer.layers.getByName(selectedLayers[1]).visible = true;
        if (nyxcrown) {
            app.activeDocument.activeLayer = docRef.layers.getByName(pinlinesName);
            enableLayerMask();

            // app.activeDocument.activeLayer = docRef.layers.getByName("Border");
            // enableLayerMask();

            app.activeDocument.activeLayer = docRef.layers.getByName("Shadows");
            enableLayerMask();
        }

        if (chosenTemplate == "womensday" && typeLine.indexOf("Legendary") >= 0) {
            // disable the layer mask for pinlines bc of legendary crown things
            app.activeDocument.activeLayer = docRef.layers.getByName(pinlinesName);
            enableLayerMask();
        }

        // Twins
        var nameboxLayer = docRef.layers.getByName(nameboxName);
        nameboxLayer.layers.getByName(selectedLayers[2]).visible = true;

        // Legendary crown
        if (typeLine.indexOf("Legendary") >= 0) {
            var legendaryLayer = docRef.layers.getByName("Legendary Crown");
            legendaryLayer.layers.getByName(selectedLayers[1]).visible = true;
            // legendaryLayer.layers.getByName("Effects").visible = true;
            // Switch to the legendary border
            var borderGroup = docRef.layers.getByName("Border");
            borderGroup.layers.getByName("Legendary Border").visible = true;
            borderGroup.layers.getByName("Normal Border").visible = false;

            if (nyxcrown) {
                app.activeDocument.activeLayer = legendaryLayer;  // .layers.getByName(selectedLayers[1]);
                // script listener to enable layer mask
                enableLayerMask();

                // Switch on nyx crown effects
                docRef.layers.getByName("Hollow Crown Shadow").visible = true;
            }
        }

        // PT box
        if (isCreature) {
            var ptBoxLayer = docRef.layers.getByName(ptBoxGroup);
            if (selectedLayers[0] == "Vehicle") {
                ptBoxLayer.layers.getByName("Vehicle").visible = true;
                // Set PT text to white
                textAndIcons.layers.getByName("Power / Toughness").textItem.color = textColour;
            } else {
                ptBoxLayer.layers.getByName(selectedLayers[2]).visible = true;
            }
        }
    }

    // Rarity gradient
    textAndIcons.layers.getByName("Expansion Symbol").textItem.contents = expansionSymbol;
    gradient(textAndIcons, cardRarity);

    // Insert basic text fields
    legalLayer = docRef.layers.getByName("Legal");
    legalLayer.layers.getByName("Artist").textItem.contents = cardArtist;
    // replaceText("Artist", cardArtist);
    if (!isIxalan) insertManaCost(textAndIcons, cardManaCost);
    insertName(textAndIcons, cardName, cardnameLayerName, isIxalan);
    insertTypeline(textAndIcons, typeLine, typelineLayerName, isIxalan);

    // For normal style box topper cards, make the typeline white
    if (extended != "") textAndIcons.layers.getByName(typelineLayerName).textItem.color = textColour;

    // For mutate cards, insert the mutate text into the appropriate layer & format it
    if (layout == "mutate") {
        var mutateLayer = textAndIcons.layers.getByName("Mutate");
        mutateLayer.textItem.contents = jsonParsed.mutate;
        docRef.activeLayer = mutateLayer;
        formatNow();
        // formatText(jsonParsed.mutate, [], -1, false);

        // vertically centre the text too
        verticallyAlignText("Mutate", "Mutate Reference");
    } else if (layout == "adventure") {
        // insert adventure name, mana cost, typeline, and rules text. format the adventure's rules text and fit it to the text box
        var adventureNameLayer = textAndIcons.layers.getByName("Card Name - Adventure");
        adventureNameLayer.textItem.contents = jsonParsed.name_adventure;

        var adventureTypeLayer = textAndIcons.layers.getByName("Typeline - Adventure");
        adventureTypeLayer.textItem.contents = jsonParsed.type_adventure;

        var adventureManaCostLayer = textAndIcons.layers.getByName("Mana Cost - Adventure");
        $.evalFile(filePath + "/scripts/formatText.jsx");
        docRef.activeLayer = adventureManaCostLayer;
        formatText(jsonParsed.manaCost_adventure, [], -1, false);

        var adventureRulesTextLayer = textAndIcons.layers.getByName("Rules Text - Adventure");
        adventureRulesTextLayer.textItem.contents = jsonParsed.text_adventure;
        docRef.activeLayer = adventureRulesTextLayer;
        formatNow();

        // Scale the text to fit in the text box
        var adventureTextboxRefLayerName = "Textbox Reference - Adventure";
        var adventureTextboxRef = textAndIcons.layers.getByName(adventureTextboxRefLayerName);
        var tolerance = new UnitValue(10, "px"); // 10 px tolerance from textbox reference
        var layerHeightAdventure = adventureTextboxRef.bounds[3] - adventureTextboxRef.bounds[1] - tolerance.as("cm");
        scaleTextToFitBox(adventureRulesTextLayer, layerHeightAdventure);
        verticallyAlignText("Rules Text - Adventure", adventureTextboxRefLayerName);

    }

    // P/T Text
    if (!isIxalan) {
        var ptLayer = textAndIcons.layers.getByName("Power / Toughness");
        if (isCreature) {
            alert("is creature?");
            ptLayer.textItem.contents = cardPower + "/" + cardTough;
            // also switch mpcautofill.com lines
            legalLayer.layers.getByName("Noncreature MPC Autofill").visible = false;
            legalLayer.layers.getByName("Creature MPC Autofill").visible = true;
        } else ptLayer.visible = false;
    }

    // ---------- Rules Text ----------
    var rulesTextLayer = textAndIcons.layers.getByName(textLayerName);
    if (cardText !== undefined) cardText = cardText.replace(/\n/g, "\r");
    else cardText = "";
    // rulesTextLayer.textItem.contents = cardText;

    // ---------- Italics Text ----------
    // Build an array of italics text, starting with identifying any
    // reminder text in the card's text body (anything in brackets).
    var flavourIndex = -1;
    var italicText = common_formatting(cardText);

    if (flavourText.length > 1) {
        // fix newline characters
        flavourText = flavourText.replace(/\n/g, "\r");

        // remove things between asterisks from flavour text if necessary
        var flavourTextSplit = flavourText.split("*");
        if (flavourTextSplit.length > 1) {
            // asterisks present in flavour text
            for (var i = 0; i < flavourTextSplit.length; i += 2) {
                // add the parts of the flavour text not between asterisks to italicText
                italicText.push(flavourTextSplit[i])
            }
            // reassemble flavourText without asterisks
            flavourText = flavourTextSplit.join("");
        } else {
            // if no asterisks in flavour text, push the whole flavour text string instead
            italicText.push(flavourText);
        }

        flavourIndex = cardText.length;
    }
    // Jam the rules text and flavour text together
    var completeString = "";
    if (flavourText.length > 0) {
        completeString = cardText + "\r" + flavourText;
    } else {
        completeString = cardText;
    }

    // Maybe centre justify the text box
    var centredText = flavourText.length <= 1 && cardText.length <= 70 && cardText.indexOf("\r") < 0;

    // Insert those mana symbols and italic text
    docRef.activeLayer = rulesTextLayer;
    formatText(completeString, italicText, flavourIndex, centredText);
    if (centredText) rulesTextLayer.textItem.justification = Justification.CENTER;

    // Scale the text to fit in the text box
    var textboxRef = textAndIcons.layers.getByName("Textbox Reference");
    var tolerance = new UnitValue(10, "px"); // 10 px tolerance from textbox reference
    var layerHeight = textboxRef.bounds[3] - textboxRef.bounds[1] - tolerance.as("cm");
    scaleTextToFitBox(rulesTextLayer, layerHeight);

    // Align card text in text box
    if (breakpoint) exit();
    verticallyAlignText(textLayerName, "Textbox Reference");
    if (isCreature) verticallyFixText(rulesTextLayer);

    // Write image to file and close document
    if (extended == "") saveImage(cardName);
    else saveImage(cardName + " (Extended)");
}

function insertManaCost(textAndIcons, cardManaCost) {
    var docRef = app.activeDocument;
    // textAndIcons = docRef.layers.getByName("Text and Icons");
    manaCostLayer = textAndIcons.layers.getByName("Mana Cost");
    if (cardManaCost != "") {
        $.evalFile(filePath + "/scripts/formatText.jsx");
        docRef.activeLayer = manaCostLayer;
        formatText(cardManaCost, [], -1, false);
        docRef.activeLayer.name = "Mana Cost";
        docRef.activeLayer.textItem.justification = Justification.RIGHT; // Force justification
    } else {
        manaCostLayer.visible = false;
    }
}

function insertName(textAndIcons, cardName, cardnameLayerName, isIxalan) {
    var docRef = app.activeDocument;
    // var textAndIcons = docRef.layers.getByName("Text and Icons");
    var cardnameLayer = textAndIcons.layers.getByName(cardnameLayerName);
    cardnameLayer.textItem.contents = cardName;

    if (!isIxalan && textAndIcons.layers.getByName("Mana Cost").visible) {
        // Scale down the name to fit in case it's too long
        var stepSize = new UnitValue(0.2, "pt");
        var manaCostLeftBound = textAndIcons.layers.getByName("Mana Cost").bounds[0].as("px");
        var cardnameRightBound = cardnameLayer.bounds[2].as("px");
        var cardnameFontSize = cardnameLayer.textItem.size; // returns unit value
        while (cardnameRightBound > manaCostLeftBound - 24) { // minimum 24 px gap
            cardnameFontSize = cardnameFontSize - stepSize;
            cardnameLayer.textItem.size = cardnameFontSize;
            cardnameRightBound = cardnameLayer.bounds[2].as("px");
        }
    }
}

function insertTypeline(textAndIcons, typeLine, typelineLayerName, isIxalan) {
    var docRef = app.activeDocument;
    // textAndIcons = docRef.layers.getByName("Text and Icons");
    var typelineLayer = textAndIcons.layers.getByName(typelineLayerName);
    typelineLayer.textItem.contents = typeLine;

    if (!isIxalan) {
        // Scale down the typeline to fit in case it's too long
        var stepSize = new UnitValue(0.2, "pt");
        var symbolLeftBound = textAndIcons.layers.getByName("Expansion Symbol").bounds[0].as("px");
        var typelineRightBound = typelineLayer.bounds[2].as("px");
        var typelineFontSize = typelineLayer.textItem.size; // returns unit value
        while (typelineRightBound > symbolLeftBound - 24) { // minimum 24 px gap
            typelineFontSize = typelineFontSize - stepSize;
            typelineLayer.textItem.size = typelineFontSize;
            typelineRightBound = typelineLayer.bounds[2].as("px");
        }
    }
}

function saveImage(cardName) {
    var docRef = app.activeDocument;
    // ----------Save as PNG in the out folder ----------
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
    var filename = filePath + '/out/' + cardName + '.png';
    desc3.putPath(idIn, new File(filename));
    var idCpy = charIDToTypeID("Cpy ");
    desc3.putBoolean(idCpy, true);
    executeAction(idsave, desc3, DialogModes.NO);

    // Close the thing without saving
    docRef.close(SaveOptions.DONOTSAVECHANGES);
}

function enableLayerMask() {
    // works on the active layer, I think?
    var idsetd = charIDToTypeID("setd");
    var desc3078 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref1567 = new ActionReference();
    var idLyr = charIDToTypeID("Lyr ");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref1567.putEnumerated(idLyr, idOrdn, idTrgt);
    desc3078.putReference(idnull, ref1567);
    var idT = charIDToTypeID("T   ");
    var desc3079 = new ActionDescriptor();
    var idUsrM = charIDToTypeID("UsrM");
    desc3079.putBoolean(idUsrM, true);
    var idLyr = charIDToTypeID("Lyr ");
    desc3078.putObject(idT, idLyr, desc3079);
    executeAction(idsetd, desc3078, DialogModes.NO);
}
