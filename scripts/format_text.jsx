#include "constants.jsx";

/* Formatting for different symbol types */


function determine_symbol_colours(symbol, symbol_length) {
    /**
     * Determines the colours of a symbol (represented as Scryfall string) and returns an array of SolidColor objects.
     */

    const symbol_colour_map = {
        "W": rgb_w,
        "U": rgb_u,
        "B": rgb_c,
        "R": rgb_r,
        "G": rgb_g,
    }

    // for hybrid symbols, use the black symbol colour rather than colourless for B
    const hybrid_symbol_colour_map = {
        "W": rgb_w,
        "U": rgb_u,
        "B": rgb_b,
        "R": rgb_r,
        "G": rgb_g,
        "2": rgb_c,
    }

    if (symbol === "{E}" || symbol === "{CHAOS}") {
        // energy or chaos symbols
        return [rgb_black()];
    } else if (symbol === "{S}") {
        // snow symbol
        return [rgb_c, rgb_black(), rgb_white()];
    } else if (symbol == "{Q}") {
        // untap symbol
        return [rgb_black(), rgb_white()];
    }

    var phyrexian_regex = /^\{([W,U,B,R,G])\/P\}$/;
    var phyrexian_match = symbol.match(phyrexian_regex);
    if (phyrexian_match !== null) {
        return [symbol_colour_map[phyrexian_match[1]], rgb_black()];
    }

    var hybrid_regex = /^\{([2,W,U,B,R,G])\/([W,U,B,R,G])\}$/;
    var hybrid_match = symbol.match(hybrid_regex);
    if (hybrid_match !== null) {
        return [
            hybrid_symbol_colour_map[hybrid_match[2]],
            hybrid_symbol_colour_map[hybrid_match[1]],
            rgb_black(),
            rgb_black()
        ];
    }

    var normal_symbol_regex = /^\{([W,U,B,R,G])\}$/;
    var normal_symbol_match = symbol.match(normal_symbol_regex);
    if (normal_symbol_match !== null) {
        return [symbol_colour_map[normal_symbol_match[1]], rgb_black()];
    }

    if (symbol_length == 2) {
        return [rgb_c, rgb_black()];
    }

    // TODO: raise error
    alert(symbol);
}


function format_symbol(primary_action_list, starting_layer_ref, symbol_index, symbol_colours, layer_font_size) {
    /**
     * Formats an n-character symbol at the specified index (symbol length determined from symbol_colours).
     */

    var current_ref = starting_layer_ref;

    for (var i = 0; i < symbol_colours.length; i++) {
        idTxtt = charIDToTypeID("Txtt");
        primary_action_list.putObject(idTxtt, current_ref);
        desc1 = new ActionDescriptor();
        idFrom = charIDToTypeID("From");
        desc1.putInteger(idFrom, symbol_index + i);
        idT = charIDToTypeID("T   ");
        desc1.putInteger(idT, symbol_index + i + 1);
        idTxtS = charIDToTypeID("TxtS");
        desc2 = new ActionDescriptor();
        idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
        desc2.putString(idfontPostScriptName, font_name_ndpmtg);  // NDPMTG font name
        idFntN = charIDToTypeID("FntN");
        desc2.putString(idFntN, font_name_ndpmtg);  // NDPMTG font name
        idSz = charIDToTypeID("Sz  ");
        idPnt = charIDToTypeID("#Pnt");
        desc2.putUnitDouble(idSz, idPnt, layer_font_size);
        idautoLeading = stringIDToTypeID("autoLeading");
        desc2.putBoolean(idautoLeading, false);
        idLdng = charIDToTypeID("Ldng");
        idPnt = charIDToTypeID("#Pnt");
        desc2.putUnitDouble(idLdng, idPnt, layer_font_size);
        idClr = charIDToTypeID("Clr ");
        desc3 = new ActionDescriptor();
        idRd = charIDToTypeID("Rd  ");
        desc3.putDouble(idRd, symbol_colours[i].rgb.red);  // rgb value.red
        idGrn = charIDToTypeID("Grn ");
        desc3.putDouble(idGrn, symbol_colours[i].rgb.green);  // rgb value.green
        idBl = charIDToTypeID("Bl  ");
        desc3.putDouble(idBl, symbol_colours[i].rgb.blue);  // rgb value.blue
        idRGBC = charIDToTypeID("RGBC");
        desc2.putObject(idClr, idRGBC, desc3);
        idTxtS = charIDToTypeID("TxtS");
        desc1.putObject(idTxtS, idTxtS, desc2);

        current_ref = desc1;
    }
    return current_ref;
}

function format_text(inputString, italicStrings, flavourIndex, centredText) {
    /**
     * Inserts the given string into the active layer and formats it according to function parameters with symbols 
     * from the NDPMTG font.
     * @param {Array[str]} italic_strings An array containing strings that are present in the main input string and should be italicised
     * @param {int} flavourIndex The index at which linebreak spacing should be increased (where the card's flavour text begins)
     * @param {boolean} centredText Whether or not the input text should be centre-justified
     */

    // TODO: check that the active layer is a text layer, and raise an issue if not
    try {
        var text_colour = app.activeDocument.activeLayer.textItem.color;
    } catch (err) {
        var text_colour = rgb_black();
    }

    var phyrexianCard = false;
    var phyrexianColour = rgb_g;

    // Find and replace the mana symbols in {} in the string with their NDPMTG
    // equivalents, and note their indices and stuff

    if (flavourIndex > 0) {
        var quoteIndex = inputString.indexOf("\r", flavourIndex + 3);
    }

    var startIndex = [];
    var endIndex = [];
    // Get the start and end indices of each given string
    for (var i = 0; i < italicStrings.length; i++) {
        var currentStartIndex = inputString.indexOf(italicStrings[i]);
        if (currentStartIndex >= 0) {
            startIndex.push(currentStartIndex);
            endIndex.push(currentStartIndex + italicStrings[i].length);
        }
    }
    startIndex = startIndex.sort(function (a, b) {
        return a - b;
    });
    endIndex = endIndex.sort(function (a, b) {
        return a - b;
    });

    // Offset each instance of flavour text by how many mana symbols appear before it
    for (i = 0; i < startIndex.length; i++) {
        // Start indices
        var tempString = inputString.slice(0, startIndex[i]);
        var numLines = 0;

        for (var symbol in symbols) {
            var numOccurrences = occurrences(tempString, symbol, false);
            numLines += numOccurrences * (symbol.length - symbols[symbol].length);
        }

        if (startIndex[i] - (numLines) >= 0) {
            startIndex[i] = startIndex[i] - numLines;
        } else {
            startIndex[i] = 0;
        }

        // End indices
        tempString = inputString.slice(0, endIndex[i]);
        numLines = 0;

        for (symbol in symbols) {
            var numOccurrences = occurrences(tempString, symbol, false);
            numLines += numOccurrences * (symbol.length - symbols[symbol].length);
        }

        if (endIndex[i] - (numLines) >= 0) {
            endIndex[i] = endIndex[i] - numLines;
        } else {
            endIndex[i] = 0;
        }
    }

    var symbolIndices = [];
    var startingIndex = 0;

    // Find all instances of mana symbols in the text and replace them
    while (true) {
        // TODO: error handling if the input is malformed
        var braceIndex1 = inputString.indexOf("{", startingIndex);
        var braceIndex2 = inputString.indexOf("}", startingIndex);
        if (braceIndex1 < 0) {
            break;
        } else {
            var currentSymbol = inputString.slice(braceIndex1, braceIndex2 + 1);

            // Check if phyrexian real quick
            if (currentSymbol.indexOf("/P}") >= 0) {
                phyrexianCard = true;
                if (currentSymbol == "{W/P}") phyrexianColour = rgb_w;
                else if (currentSymbol == "{U/P}") phyrexianColour = rgb_u;
                else if (currentSymbol == "{B/P}") phyrexianColour = rgb_b;
                else if (currentSymbol == "{R/P}") phyrexianColour = rgb_r;
                else if (currentSymbol == "{G/P}") phyrexianColour = rgb_g;
            }

            for (symbol in symbols) {
                if (currentSymbol.valueOf() == symbol.valueOf()) {
                    inputString = inputString.replace(symbol, symbols[symbol]);

                    // symbolIndices.push([braceIndex1, symbols[symbol].length]);  // insert the symbol index and its length into symbolIndices
                    symbolIndices.push({
                        index: braceIndex1,
                        // size: symbols[symbol].length,
                        colours: determine_symbol_colours(currentSymbol, symbols[symbol].length),
                    })
                    startingIndex = braceIndex1 + 1;
                }
            }
        }
    }

    var layer_font_size = app.activeDocument.activeLayer.textItem.size;

    // Prepare action descriptor and reference variables
    var desc119 = new ActionDescriptor();
    idnull = charIDToTypeID("null");
    var ref101 = new ActionReference();
    var idTxLr = charIDToTypeID("TxLr");
    var idOrdn = charIDToTypeID("Ordn");
    var idTrgt = charIDToTypeID("Trgt");
    ref101.putEnumerated(idTxLr, idOrdn, idTrgt);
    desc119.putReference(idnull, ref101);
    var primary_action_descriptor = new ActionDescriptor();
    var idTxt = charIDToTypeID("Txt ");
    primary_action_descriptor.putString(idTxt, inputString);

    var primary_action_list = new ActionList();
    desc25 = new ActionDescriptor();
    var idFrom = charIDToTypeID("From");
    desc25.putInteger(idFrom, 0);
    var idT = charIDToTypeID("T   ");
    desc25.putInteger(idT, inputString.length);
    var idTxtS = charIDToTypeID("TxtS");
    desc26 = new ActionDescriptor();
    var idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
    desc26.putString(idfontPostScriptName, font_name_mplantin);  // MPlantin font name
    var idFntN = charIDToTypeID("FntN");
    desc26.putString(idFntN, font_name_mplantin);  // MPlantin font name
    var idSz = charIDToTypeID("Sz  ");
    var idPnt = charIDToTypeID("#Pnt");
    desc26.putUnitDouble(idSz, idPnt, layer_font_size);
    var idHrzS = charIDToTypeID("HrzS");
    var idautoLeading = stringIDToTypeID("autoLeading");
    desc26.putBoolean(idautoLeading, false);
    var idLdng = charIDToTypeID("Ldng");
    idPnt = charIDToTypeID("#Pnt");
    desc26.putUnitDouble(idLdng, idPnt, layer_font_size);
    var idClr = charIDToTypeID("Clr ");
    desc27 = new ActionDescriptor();
    var idRd = charIDToTypeID("Rd  ");
    desc27.putDouble(idRd, text_colour.rgb.red);  // text colour.red
    var idGrn = charIDToTypeID("Grn ");
    desc27.putDouble(idGrn, text_colour.rgb.green);  // text colour.green
    var idBl = charIDToTypeID("Bl  ");
    desc27.putDouble(idBl, text_colour.rgb.blue);  // text colour.blue
    var idRGBC = charIDToTypeID("RGBC");
    desc26.putObject(idClr, idRGBC, desc27);
    idTxtS = charIDToTypeID("TxtS");
    desc25.putObject(idTxtS, idTxtS, desc26);
    var current_layer_ref = desc25;

    if (startIndex.length > 0) {
        for (i = 0; i < startIndex.length; i++) {
            // Italics text
            var idTxtt = charIDToTypeID("Txtt");
            primary_action_list.putObject(idTxtt, current_layer_ref);
            desc125 = new ActionDescriptor();
            idFrom = charIDToTypeID("From");
            desc125.putInteger(idFrom, startIndex[i]);
            idT = charIDToTypeID("T   ");
            desc125.putInteger(idT, endIndex[i]);
            idTxtS = charIDToTypeID("TxtS");
            desc126 = new ActionDescriptor();
            var idstyleSheetHasParent = stringIDToTypeID("styleSheetHasParent");
            desc126.putBoolean(idstyleSheetHasParent, true);
            idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
            desc126.putString(idfontPostScriptName, font_name_mplantin_italic);  // MPlantin italic font name
            idFntN = charIDToTypeID("FntN");
            desc126.putString(idFntN, font_name_mplantin_italic);  // MPlantin italic font name
            var idFntS = charIDToTypeID("FntS");
            idSz = charIDToTypeID("Sz  ");
            idPnt = charIDToTypeID("#Pnt");
            desc126.putUnitDouble(idSz, idPnt, layer_font_size);
            idautoLeading = stringIDToTypeID("autoLeading");
            desc126.putBoolean(idautoLeading, false);
            idLdng = charIDToTypeID("Ldng");
            idPnt = charIDToTypeID("#Pnt");
            desc126.putUnitDouble(idLdng, idPnt, layer_font_size);
            idClr = charIDToTypeID("Clr ");
            desc127 = new ActionDescriptor();
            idRd = charIDToTypeID("Rd  ");
            desc127.putDouble(idRd, text_colour.rgb.red);  // text colour.red
            idGrn = charIDToTypeID("Grn ");
            desc127.putDouble(idGrn, text_colour.rgb.green);  // text colour.green
            idBl = charIDToTypeID("Bl  ");
            desc127.putDouble(idBl, text_colour.rgb.blue);  // text colour.blue
            idRGBC = charIDToTypeID("RGBC");
            desc126.putObject(idClr, idRGBC, desc127);
            idTxtS = charIDToTypeID("TxtS");
            desc125.putObject(idTxtS, idTxtS, desc126);
            current_layer_ref = desc125;
        }
    }

    // Format each symbol correctly
    if (symbolIndices.length > 0) {
        for (i = 0; i < symbolIndices.length; i++) {
            current_layer_ref = format_symbol(
                primary_action_list=primary_action_list,
                starting_layer_ref=current_layer_ref,
                symbol_index=symbolIndices[i].index,
                symbol_colours=symbolIndices[i].colours,
                layer_font_size=layer_font_size,
            );
        }
    }

    idTxtt = charIDToTypeID("Txtt");
    primary_action_list.putObject(idTxtt, current_layer_ref);
    var desc137 = new ActionDescriptor();
    idFrom = charIDToTypeID("From");
    desc137.putInteger(idFrom, inputString.length);
    idT = charIDToTypeID("T   ");
    desc137.putInteger(idT, inputString.length);
    idTxtS = charIDToTypeID("TxtS");
    var desc138 = new ActionDescriptor();
    idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
    desc138.putString(idfontPostScriptName, font_name_mplantin);  // MPlantin font name
    idFntN = charIDToTypeID("FntN");
    desc138.putString(idFntN, font_name_mplantin);  // MPlantin font name
    idSz = charIDToTypeID("Sz  ");
    idPnt = charIDToTypeID("#Pnt");
    desc138.putUnitDouble(idSz, idPnt, layer_font_size);
    idHrzS = charIDToTypeID("HrzS");
    idautoLeading = stringIDToTypeID("autoLeading");
    desc138.putBoolean(idautoLeading, false);
    idLdng = charIDToTypeID("Ldng");
    idPnt = charIDToTypeID("#Pnt");
    desc138.putUnitDouble(idLdng, idPnt, layer_font_size);
    idClr = charIDToTypeID("Clr ");
    var desc139 = new ActionDescriptor();
    idRd = charIDToTypeID("Rd  ");
    desc139.putDouble(idRd, text_colour.rgb.red);  // text colour.red
    idGrn = charIDToTypeID("Grn ");
    desc139.putDouble(idGrn, text_colour.rgb.green);  // text colour.green
    idBl = charIDToTypeID("Bl  ");
    desc139.putDouble(idBl, text_colour.rgb.blue);  // text colour.blue
    idTxtS = charIDToTypeID("TxtS");
    desc137.putObject(idTxtS, idTxtS, desc138);
    idTxtt = charIDToTypeID("Txtt");
    primary_action_list.putObject(idTxtt, desc137);
    primary_action_descriptor.putList(idTxtt, primary_action_list);

    var idparagraphStyleRange = stringIDToTypeID("paragraphStyleRange");
    var list13 = new ActionList();
    var desc141 = new ActionDescriptor();
    idFrom = charIDToTypeID("From");
    desc141.putInteger(idFrom, 0);
    idT = charIDToTypeID("T   ");
    desc141.putInteger(idT, inputString.length);
    var idparagraphStyle = stringIDToTypeID("paragraphStyle");
    var desc142 = new ActionDescriptor();
    var idfirstLineIndent = stringIDToTypeID("firstLineIndent");
    idPnt = charIDToTypeID("#Pnt");
    desc142.putUnitDouble(idfirstLineIndent, idPnt, 0.000000);
    var idstartIndent = stringIDToTypeID("startIndent");
    idPnt = charIDToTypeID("#Pnt");
    desc142.putUnitDouble(idstartIndent, idPnt, 0.000000);
    var idendIndent = stringIDToTypeID("endIndent");
    idPnt = charIDToTypeID("#Pnt");
    desc142.putUnitDouble(idendIndent, idPnt, 0.000000);
    var idspaceBefore = stringIDToTypeID("spaceBefore");
    idPnt = charIDToTypeID("#Pnt");
    if (centredText) {  // line break lead
        desc142.putUnitDouble(idspaceBefore, idPnt, 0);
    } else {
        desc142.putUnitDouble(idspaceBefore, idPnt, line_break_lead);
    }
    var idspaceAfter = stringIDToTypeID("spaceAfter");
    idPnt = charIDToTypeID("#Pnt");
    desc142.putUnitDouble(idspaceAfter, idPnt, 0.000000);
    var iddropCapMultiplier = stringIDToTypeID("dropCapMultiplier");
    desc142.putInteger(iddropCapMultiplier, 1);
    var idautoLeadingPercentage = stringIDToTypeID("autoLeadingPercentage");
    desc142.putDouble(idautoLeadingPercentage, 1.200000);
    var idleadingType = stringIDToTypeID("leadingType");
    idleadingType = stringIDToTypeID("leadingType");
    var idleadingBelow = stringIDToTypeID("leadingBelow");
    desc142.putEnumerated(idleadingType, idleadingType, idleadingBelow);
    var desc143 = new ActionDescriptor();
    idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
    desc143.putString(idfontPostScriptName, font_name_ndpmtg);  // NDPMTG font name
    idFntN = charIDToTypeID("FntN");
    desc143.putString(idFntN, font_name_mplantin);  // MPlantin font name
    idautoLeading = stringIDToTypeID("autoLeading");
    desc143.putBoolean(idautoLeading, false);
    idClr = charIDToTypeID("Clr ");
    var desc144 = new ActionDescriptor();
    idRd = charIDToTypeID("Rd  ");
    desc144.putDouble(idRd, text_colour.rgb.red);  // text colour.red
    idGrn = charIDToTypeID("Grn ");
    desc144.putDouble(idGrn, text_colour.rgb.green);  // text colour.green
    idBl = charIDToTypeID("Bl  ");
    desc144.putDouble(idBl, text_colour.rgb.blue);  // text colour.blue
    idRGBC = charIDToTypeID("RGBC");
    desc143.putObject(idClr, idRGBC, desc144);
    primary_action_descriptor.putList(idparagraphStyleRange, list13);
    var idkerningRange = stringIDToTypeID("kerningRange");
    var list14 = new ActionList();
    primary_action_descriptor.putList(idkerningRange, list14);

    list13 = new ActionList();

    if (inputString.indexOf("\u2022") >= 0) {
        // Modal card with bullet points - adjust the formatting slightly
        var startIndexBullet = inputString.indexOf("\u2022");
        var endIndexBullet = inputString.lastIndexOf("\u2022");
        idparagraphStyleRange = stringIDToTypeID("paragraphStyleRange");
        list13 = new ActionList();
        desc141 = new ActionDescriptor();
        idFrom = charIDToTypeID("From");
        desc141.putInteger(idFrom, startIndexBullet);
        idT = charIDToTypeID("T   ");
        desc141.putInteger(idT, endIndexBullet + 1);
        idparagraphStyle = stringIDToTypeID("paragraphStyle");
        idfirstLineIndent = stringIDToTypeID("firstLineIndent");
        idPnt = charIDToTypeID("#Pnt");
        desc142.putUnitDouble(idfirstLineIndent, idPnt, -modal_indent); // negative modal indent
        idstartIndent = stringIDToTypeID("startIndent");
        idPnt = charIDToTypeID("#Pnt");
        desc142.putUnitDouble(idstartIndent, idPnt, modal_indent); // modal indent
        idspaceBefore = stringIDToTypeID("spaceBefore");
        idPnt = charIDToTypeID("#Pnt");
        desc142.putUnitDouble(idspaceBefore, idPnt, 1.0); // 10
        idspaceAfter = stringIDToTypeID("spaceAfter");
        idPnt = charIDToTypeID("#Pnt");
        desc142.putUnitDouble(idspaceAfter, idPnt, 0.000000);
        iddropCapMultiplier = stringIDToTypeID("dropCapMultiplier");
        desc142.putInteger(iddropCapMultiplier, 1);
        idautoLeadingPercentage = stringIDToTypeID("autoLeadingPercentage");
        desc142.putDouble(idautoLeadingPercentage, 1.200000);
        idleadingType = stringIDToTypeID("leadingType");
        idleadingType = stringIDToTypeID("leadingType");
        idleadingBelow = stringIDToTypeID("leadingBelow");
        desc142.putEnumerated(idleadingType, idleadingType, idleadingBelow);
        idhyphenate = stringIDToTypeID("hyphenate");
        desc142.putBoolean(idhyphenate, false);
        idhyphenateWordSize = stringIDToTypeID("hyphenateWordSize");
        desc142.putInteger(idhyphenateWordSize, 6);
        idhyphenatePreLength = stringIDToTypeID("hyphenatePreLength");
        desc142.putInteger(idhyphenatePreLength, 2);
        idhyphenatePostLength = stringIDToTypeID("hyphenatePostLength");
        desc142.putInteger(idhyphenatePostLength, 2);
        idhyphenateLimit = stringIDToTypeID("hyphenateLimit");
        desc142.putInteger(idhyphenateLimit, 0);
        idhyphenationZone = stringIDToTypeID("hyphenationZone");
        desc142.putDouble(idhyphenationZone, 36.000000);
        idhyphenateCapitalized = stringIDToTypeID("hyphenateCapitalized");
        desc142.putBoolean(idhyphenateCapitalized, true);
        idhyphenationPreference = stringIDToTypeID("hyphenationPreference");
        desc142.putDouble(idhyphenationPreference, 0.500000);
        idjustificationWordMinimum = stringIDToTypeID("justificationWordMinimum");
        desc142.putDouble(idjustificationWordMinimum, 0.800000);
        idjustificationWordDesired = stringIDToTypeID("justificationWordDesired");
        desc142.putDouble(idjustificationWordDesired, 1.000000);
        idjustificationWordMaximum = stringIDToTypeID("justificationWordMaximum");
        desc142.putDouble(idjustificationWordMaximum, 1.330000);
        idjustificationLetterMinimum = stringIDToTypeID("justificationLetterMinimum");
        desc142.putDouble(idjustificationLetterMinimum, 0.000000);
        idjustificationLetterDesired = stringIDToTypeID("justificationLetterDesired");
        desc142.putDouble(idjustificationLetterDesired, 0.000000);
        idjustificationLetterMaximum = stringIDToTypeID("justificationLetterMaximum");
        desc142.putDouble(idjustificationLetterMaximum, 0.000000);
        idjustificationGlyphMinimum = stringIDToTypeID("justificationGlyphMinimum");
        desc142.putDouble(idjustificationGlyphMinimum, 1.000000);
        idjustificationGlyphDesired = stringIDToTypeID("justificationGlyphDesired");
        desc142.putDouble(idjustificationGlyphDesired, 1.000000);
        idjustificationGlyphMaximum = stringIDToTypeID("justificationGlyphMaximum");
        desc142.putDouble(idjustificationGlyphMaximum, 1.000000);
        idsingleWordJustification = stringIDToTypeID("singleWordJustification");
        idAlg = charIDToTypeID("Alg ");
        idJstA = charIDToTypeID("JstA");
        desc142.putEnumerated(idsingleWordJustification, idAlg, idJstA);
        idhangingRoman = stringIDToTypeID("hangingRoman");
        desc142.putBoolean(idhangingRoman, false);
        idautoTCY = stringIDToTypeID("autoTCY");
        desc142.putInteger(idautoTCY, 1);
        idkeepTogether = stringIDToTypeID("keepTogether");
        desc142.putBoolean(idkeepTogether, false);
        idburasagari = stringIDToTypeID("burasagari");
        idburasagari = stringIDToTypeID("burasagari");
        idburasagariNone = stringIDToTypeID("burasagariNone");
        desc142.putEnumerated(idburasagari, idburasagari, idburasagariNone);
        idpreferredKinsokuOrder = stringIDToTypeID("preferredKinsokuOrder");
        idpreferredKinsokuOrder = stringIDToTypeID("preferredKinsokuOrder");
        idpushIn = stringIDToTypeID("pushIn");
        desc142.putEnumerated(idpreferredKinsokuOrder, idpreferredKinsokuOrder, idpushIn);
        idkurikaeshiMojiShori = stringIDToTypeID("kurikaeshiMojiShori");
        desc142.putBoolean(idkurikaeshiMojiShori, false);
        idtextEveryLineComposer = stringIDToTypeID("textEveryLineComposer");
        desc142.putBoolean(idtextEveryLineComposer, false);
        iddefaultTabWidth = stringIDToTypeID("defaultTabWidth");
        desc142.putDouble(iddefaultTabWidth, 36.000000);
        iddefaultStyle = stringIDToTypeID("defaultStyle");
        desc143 = new ActionDescriptor();
        idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
        desc143.putString(idfontPostScriptName, font_name_ndpmtg);  // NDPMTG font name
        idFntN = charIDToTypeID("FntN");
        desc143.putString(idFntN, font_name_mplantin);
        idSz = charIDToTypeID("Sz  ");
        idPnt = charIDToTypeID("#Pnt");
        desc143.putUnitDouble(idSz, idPnt, 11.998500);
        idautoLeading = stringIDToTypeID("autoLeading");
        desc143.putBoolean(idautoLeading, false);
        idClr = charIDToTypeID("Clr ");
        desc144 = new ActionDescriptor();
        idRd = charIDToTypeID("Rd  ");
        desc144.putDouble(idRd, text_colour.rgb.red);  // text colour.red
        idGrn = charIDToTypeID("Grn ");
        desc144.putDouble(idGrn, text_colour.rgb.green);  // text colour.green
        idBl = charIDToTypeID("Bl  ");
        desc144.putDouble(idBl, text_colour.rgb.blue);  // text colour.blue
        idRGBC = charIDToTypeID("RGBC");
        desc143.putObject(idClr, idRGBC, desc144);
        idTxtS = charIDToTypeID("TxtS");
        desc142.putObject(iddefaultStyle, idTxtS, desc143);
        idparagraphStyle = stringIDToTypeID("paragraphStyle");
        desc141.putObject(idparagraphStyle, idparagraphStyle, desc142);
        idparagraphStyleRange = stringIDToTypeID("paragraphStyleRange");
        list13.putObject(idparagraphStyleRange, desc141);
        primary_action_descriptor.putList(idparagraphStyleRange, list13);
        idkerningRange = stringIDToTypeID("kerningRange");
        list14 = new ActionList();
        primary_action_descriptor.putList(idkerningRange, list14);
    }

    if (flavourIndex > 0) {
        // Adjust line break spacing if there's a line break in the flavour text
        idparagraphStyleRange = stringIDToTypeID("paragraphStyleRange");
        desc141 = new ActionDescriptor();
        idFrom = charIDToTypeID("From");
        desc141.putInteger(idFrom, flavourIndex + 3);
        idT = charIDToTypeID("T   ");
        desc141.putInteger(idT, flavourIndex + 4);
        idfirstLineIndent = stringIDToTypeID("firstLineIndent");
        idPnt = charIDToTypeID("#Pnt");
        desc142.putUnitDouble(idfirstLineIndent, idPnt, 0);
        var idimpliedFirstLineIndent = stringIDToTypeID("impliedFirstLineIndent");
        idPnt = charIDToTypeID("#Pnt");
        desc142.putUnitDouble(idimpliedFirstLineIndent, idPnt, 0);
        idstartIndent = stringIDToTypeID("startIndent");
        idPnt = charIDToTypeID("#Pnt");
        desc142.putUnitDouble(idstartIndent, idPnt, 0);
        idimpliedStartIndent = stringIDToTypeID("impliedStartIndent");
        idPnt = charIDToTypeID("#Pnt");
        desc142.putUnitDouble(idimpliedStartIndent, idPnt, 0);
        idspaceBefore = stringIDToTypeID("spaceBefore");
        idPnt = charIDToTypeID("#Pnt");
        desc142.putUnitDouble(idspaceBefore, idPnt, flavour_text_lead);  // lead size between rules text and flavour text
        idparagraphStyle = stringIDToTypeID("paragraphStyle");
        desc141.putObject(idparagraphStyle, idparagraphStyle, desc142);
        idparagraphStyleRange = stringIDToTypeID("paragraphStyleRange");
        list13.putObject(idparagraphStyleRange, desc141);
        primary_action_descriptor.putList(idparagraphStyleRange, list13);
        idkerningRange = stringIDToTypeID("kerningRange");
        list14 = new ActionList();
        primary_action_descriptor.putList(idkerningRange, list14);
    }

    if (quoteIndex > 0) {
        // Adjust line break spacing if there's a line break in the flavour text
        idparagraphStyleRange = stringIDToTypeID("paragraphStyleRange");
        desc141 = new ActionDescriptor();
        idFrom = charIDToTypeID("From");
        desc141.putInteger(idFrom, quoteIndex + 3);
        idT = charIDToTypeID("T   ");
        desc141.putInteger(idT, inputString.length);
        idspaceBefore = stringIDToTypeID("spaceBefore");
        idPnt = charIDToTypeID("#Pnt");
        desc142.putUnitDouble(idspaceBefore, idPnt, 0);
        idparagraphStyle = stringIDToTypeID("paragraphStyle");
        desc141.putObject(idparagraphStyle, idparagraphStyle, desc142);
        idparagraphStyleRange = stringIDToTypeID("paragraphStyleRange");
        list13.putObject(idparagraphStyleRange, desc141);
        primary_action_descriptor.putList(idparagraphStyleRange, list13);
        idkerningRange = stringIDToTypeID("kerningRange");
        list14 = new ActionList();
        primary_action_descriptor.putList(idkerningRange, list14);
    }

    // Push changes to document
    idsetd = charIDToTypeID("setd");
    idTxLr = charIDToTypeID("TxLr");
    desc119.putObject(idT, idTxLr, primary_action_descriptor);
    executeAction(idsetd, desc119, DialogModes.NO);
}

function generate_italics(card_text) {
    /**
     * Generates italics text array from card text to italicise all text within (parentheses) and all ability words.
     */
    var reminder_text = true;

    var italic_text = [];
    end_index = 0;
    while (reminder_text) {
        start_index = card_text.indexOf("(", end_index);
        if (start_index >= 0) {
            end_index = card_text.indexOf(")", start_index + 1);
            italic_text.push(card_text.slice(start_index, end_index + 1));
        } else {
            reminder_text = false;
        }
    }

    // Attach all ability words to the italics array
    for (var i = 0; i < ability_words.length; i++) {
        italic_text.push(ability_words[i] + " \u2014");  // Include em dash
    }

    return italic_text;
}

function format_text_wrapper() {
    /**
     * Wrapper for format_text which runs the function with the active layer's current text contents and auto-generated italics array.
     * Flavour text index and centred text not supported.
     * Super useful to add as a script action in Photoshop for making cards manually!
     */
    var card_text = app.activeDocument.activeLayer.textItem.contents;
    var italic_text = generate_italics(card_text);

    format_text(card_text, italic_text, -1, false);
}
