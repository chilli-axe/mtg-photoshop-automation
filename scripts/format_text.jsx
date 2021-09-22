#include "constants.jsx";
#include "helpers.jsx";

/* Locating symbols and italics in the input string */

function locate_symbols(input_string) {
    /**
     * Locate symbols in the input string, replace them with the characters we use to represent them in NDPMTG, and determine
     * the colours those characters need to be. Returns an object with the modified input string and a list of symbol indices.
     */

    var symbol_regex = /(\{.*?\})/;
    var symbol_indices = [];
    var match = null;
    while (true) {
        match = symbol_regex.exec(input_string);
        if (match === null) {
            break;
        } else {
            var symbol = match[1];
            var symbol_index = match.index;
            var symbol_chars = symbols[symbol];
            if (symbol_chars === null) {
                throw new Error("Encountered a formatted character in braces that doesn't map to characters: " + symbol);
            }

            input_string = input_string.replace(symbol, symbol_chars);
            symbol_indices.push({
                index: symbol_index,
                colours: determine_symbol_colours(symbol, symbol_chars.length),
            });
        }
    }

    return {
        input_string: input_string,
        symbol_indices: symbol_indices,
    }
}

function locate_italics(input_string, italics_strings) {
    /**
     * Locate all instances of italic strings in the input string and record their start and end indices.
     * Returns a list of italic string indices (start and end).
     */

    var italics_indices = [];
    var italics;
    var start_index;
    var end_index;

    for (var i = 0; i < italics_strings.length; i++) {
        italics = italics_strings[i];
        start_index = 0;
        end_index = 0;

        // replace symbols with their character representations in the italic string
        if (italics.indexOf("}") >= 0) {
            for (var symbol in symbols) {
                italics = italics.replace(symbol, symbols[symbol]);
            }
        }

        while (true) {
            start_index = input_string.indexOf(italics, end_index);
            end_index = start_index + italics.length;
            if (start_index < 0) {
                break;
            }
            italics_indices.push({
                start_index: start_index,
                end_index: end_index,
            });
        }
    }

    return italics_indices;
}

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
        "2": rgb_c,
    }

    // for hybrid symbols with generic mana, use the black symbol colour rather than colourless for B
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
        return [hybrid_symbol_colour_map[phyrexian_match[1]], rgb_black()];
    }

    var hybrid_regex = /^\{([2,W,U,B,R,G])\/([W,U,B,R,G])\}$/;
    var hybrid_match = symbol.match(hybrid_regex);
    if (hybrid_match !== null) {
        var colour_map = symbol_colour_map;
        if (hybrid_match[1] == "2") {
            // Use the darker colour for black's symbols for 2/B hybrid symbols
            colour_map = hybrid_symbol_colour_map;
        }
        return [
            colour_map[hybrid_match[2]],
            colour_map[hybrid_match[1]],
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

    throw new Error("Encountered a symbol that I don't know how to colour: " + symbol);
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

function format_text(input_string, italics_strings, flavour_index, is_centred) {
    /**
     * Inserts the given string into the active layer and formats it according to function parameters with symbols 
     * from the NDPMTG font.
     * @param {str} input_string The string to insert into the active layer
     * @param {Array[str]} italic_strings An array containing strings that are present in the main input string and should be italicised
     * @param {int} flavour_index The index at which linebreak spacing should be increased and any subsequent chars should be italicised (where the card's flavour text begins)
     * @param {boolean} is_centred Whether or not the input text should be centre-justified
     */

    // record the layer's justification before modifying the layer in case it's reset along the way
    var layer_justification = app.activeDocument.activeLayer.textItem.justification;

    // TODO: check that the active layer is a text layer, and raise an issue if not
    if (flavour_index > 0) {
        var quote_index = input_string.indexOf("\r", flavour_index + 3);
    }

    // Locate symbols and update the input string
    var ret = locate_symbols(input_string);
    input_string = ret.input_string;
    var symbol_indices = ret.symbol_indices;

    // Locate italics text indices
    var italics_indices = locate_italics(input_string, italics_strings);

    // Prepare action descriptor and reference variables
    var layer_font_size = app.activeDocument.activeLayer.textItem.size;
    var layer_text_colour = app.activeDocument.activeLayer.textItem.color;
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
    primary_action_descriptor.putString(idTxt, input_string);
    var primary_action_list = new ActionList();
    desc25 = new ActionDescriptor();
    var idFrom = charIDToTypeID("From");
    desc25.putInteger(idFrom, 0);
    var idT = charIDToTypeID("T   ");
    desc25.putInteger(idT, input_string.length);
    desc26 = new ActionDescriptor();
    var idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
    desc26.putString(idfontPostScriptName, font_name_mplantin);  // MPlantin font name
    var idFntN = charIDToTypeID("FntN");
    desc26.putString(idFntN, font_name_mplantin);  // MPlantin font name
    var idSz = charIDToTypeID("Sz  ");
    var idPnt = charIDToTypeID("#Pnt");
    desc26.putUnitDouble(idSz, idPnt, layer_font_size);
    var idClr = charIDToTypeID("Clr ");
    desc27 = new ActionDescriptor();
    var idRd = charIDToTypeID("Rd  ");
    desc27.putDouble(idRd, layer_text_colour.rgb.red);  // text colour.red
    var idGrn = charIDToTypeID("Grn ");
    desc27.putDouble(idGrn, layer_text_colour.rgb.green);  // text colour.green
    var idBl = charIDToTypeID("Bl  ");
    desc27.putDouble(idBl, layer_text_colour.rgb.blue);  // text colour.blue
    var idRGBC = charIDToTypeID("RGBC");
    desc26.putObject(idClr, idRGBC, desc27);
    var idHrzS = charIDToTypeID("HrzS");
    var idautoLeading = stringIDToTypeID("autoLeading");
    desc26.putBoolean(idautoLeading, false);
    var idLdng = charIDToTypeID("Ldng");
    idPnt = charIDToTypeID("#Pnt");
    desc26.putUnitDouble(idLdng, idPnt, layer_font_size);
    idTxtS = charIDToTypeID("TxtS");
    desc25.putObject(idTxtS, idTxtS, desc26);
    var current_layer_ref = desc25;

    for (i = 0; i < italics_indices.length; i++) {
        // Italics text
        var idTxtt = charIDToTypeID("Txtt");
        primary_action_list.putObject(idTxtt, current_layer_ref);
        desc125 = new ActionDescriptor();
        idFrom = charIDToTypeID("From");
        desc125.putInteger(idFrom, italics_indices[i].start_index);  // italics start index
        idT = charIDToTypeID("T   ");
        desc125.putInteger(idT, italics_indices[i].end_index);  // italics end index
        idTxtS = charIDToTypeID("TxtS");
        desc126 = new ActionDescriptor();
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

    // Format each symbol correctly
    for (i = 0; i < symbol_indices.length; i++) {
        current_layer_ref = format_symbol(
            primary_action_list = primary_action_list,
            starting_layer_ref = current_layer_ref,
            symbol_index = symbol_indices[i].index,
            symbol_colours = symbol_indices[i].colours,
            layer_font_size = layer_font_size,
        );
    }

    idTxtt = charIDToTypeID("Txtt");
    primary_action_list.putObject(idTxtt, current_layer_ref);
    primary_action_descriptor.putList(idTxtt, primary_action_list);

    // paragraph formatting
    var idparagraphStyleRange = stringIDToTypeID("paragraphStyleRange");
    var list13 = new ActionList();
    var desc141 = new ActionDescriptor();
    idFrom = charIDToTypeID("From");
    desc141.putInteger(idFrom, 0);
    idT = charIDToTypeID("T   ");
    desc141.putInteger(idT, input_string.length);  // input string length
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
    if (is_centred) {  // line break lead
        desc142.putUnitDouble(idspaceBefore, idPnt, 0);
    } else {
        desc142.putUnitDouble(idspaceBefore, idPnt, line_break_lead);
    }
    var idspaceAfter = stringIDToTypeID("spaceAfter");
    idPnt = charIDToTypeID("#Pnt");
    desc142.putUnitDouble(idspaceAfter, idPnt, 0.000000);
    var iddropCapMultiplier = stringIDToTypeID("dropCapMultiplier");
    desc142.putInteger(iddropCapMultiplier, 1);
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
    primary_action_descriptor.putList(idparagraphStyleRange, list13);
    var idkerningRange = stringIDToTypeID("kerningRange");
    var list14 = new ActionList();
    primary_action_descriptor.putList(idkerningRange, list14);
    list13 = new ActionList();

    if (input_string.indexOf("\u2022") >= 0) {
        // Modal card with bullet points - adjust the formatting slightly
        var startIndexBullet = input_string.indexOf("\u2022");
        var endIndexBullet = input_string.lastIndexOf("\u2022");
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
        desc142.putUnitDouble(idspaceBefore, idPnt, 1.0);
        idspaceAfter = stringIDToTypeID("spaceAfter");
        idPnt = charIDToTypeID("#Pnt");
        desc142.putUnitDouble(idspaceAfter, idPnt, 0.000000);
        iddefaultStyle = stringIDToTypeID("defaultStyle");
        desc143 = new ActionDescriptor();
        idfontPostScriptName = stringIDToTypeID("fontPostScriptName");
        desc143.putString(idfontPostScriptName, font_name_ndpmtg);  // NDPMTG font name
        idFntN = charIDToTypeID("FntN");
        desc143.putString(idFntN, font_name_mplantin);
        idSz = charIDToTypeID("Sz  ");
        idPnt = charIDToTypeID("#Pnt");
        desc143.putUnitDouble(idSz, idPnt, 11.998500);  // TODO: what's this?
        idautoLeading = stringIDToTypeID("autoLeading");
        desc143.putBoolean(idautoLeading, false);
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

    if (flavour_index > 0) {
        // Adjust line break spacing if there's a line break in the flavour text
        idparagraphStyleRange = stringIDToTypeID("paragraphStyleRange");
        desc141 = new ActionDescriptor();
        idFrom = charIDToTypeID("From");
        desc141.putInteger(idFrom, flavour_index + 3);
        idT = charIDToTypeID("T   ");
        desc141.putInteger(idT, flavour_index + 4);
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

    if (quote_index > 0) {
        // Adjust line break spacing if there's a line break in the flavour text
        idparagraphStyleRange = stringIDToTypeID("paragraphStyleRange");
        desc141 = new ActionDescriptor();
        idFrom = charIDToTypeID("From");
        desc141.putInteger(idFrom, quote_index + 3);
        idT = charIDToTypeID("T   ");
        desc141.putInteger(idT, input_string.length);
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

    // Reset layer's justification and disable hypenation
    app.activeDocument.activeLayer.textItem.justification = layer_justification;
    app.activeDocument.activeLayer.textItem.hyphenation = false;
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
