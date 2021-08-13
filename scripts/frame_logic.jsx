function fix_colour_pair(input) {
    // Utility function to standardise ordering of colour pairs, e.g. "UW" becomes "WU"
    const colour_pairs = [LayerNames.WU, LayerNames.UB, LayerNames.BR, LayerNames.RG, LayerNames.GW, LayerNames.WB, LayerNames.BG, LayerNames.GU, LayerNames.UR, LayerNames.RW];
    for (var colourPair in colour_pairs) {
        if (input.indexOf(colour_pairs[colourPair].charAt(0)) >= 0
            && input.indexOf(colour_pairs[colourPair].charAt(1)) >= 0) {
            return colour_pairs[colourPair];
        }
    }
}

function select_frame_layers(mana_cost, type_line, oracle_text, colour_identity_array) {
    const colours = [LayerNames.WHITE, LayerNames.BLUE, LayerNames.BLACK, LayerNames.RED, LayerNames.GREEN];
    const basic_colours = { "Plains": LayerNames.WHITE, "Island": LayerNames.BLUE, "Swamp": LayerNames.BLACK, "Mountain": LayerNames.RED, "Forest": LayerNames.GREEN };
    const hybrid_symbols = ["W/U", "U/B", "B/R", "R/G", "G/W", "W/B", "B/G", "G/U", "U/R", "R/W"];

    // Declare output variables
    var background; var pinlines; var twins;

    if (type_line.indexOf(LayerNames.LAND) >= 0) {
        // Land card
        twins = "";

        // Check if it has a basic land subtype
        var basic_identity = "";
        for (var basic in basic_colours) {
            if (type_line.indexOf(basic) >= 0) {
                // The land has this basic type on its type_line
                basic_identity = basic_identity + basic_colours[basic];
            }
        }

        if (basic_identity.length == 1) {
            // The land has exactly one basic land type. We still need to get the pinlines from the total colours the card
            // can add though (cornercase: Murmuring Bosk)
            twins = basic_identity;
        } else if (basic_identity.length == 2) {
            // The land has exactly two basic land types. Ensure they follow the correct naming convention, then
            // return the corresponding frame elements
            basic_identity = fix_colour_pair(basic_identity);
            return {
                background: LayerNames.LAND,
                pinlines: basic_identity,
                twins: LayerNames.LAND,
                is_colourless: false,
            };
        }

        // Array of rules text lines in the card
        var rules_lines = oracle_text.split('\n');
        var colours_tapped = "";

        // Iterate over rules text lines
        for (var i in rules_lines) {
            var line = rules_lines[i];

            // Identify if the card is a fetchland of some kind
            if (line.toLowerCase().indexOf("search your library") >= 0
                && line.toLowerCase().indexOf("cycling") < 0) {
                // Card is a fetchland of some kind
                // Find how many basic land types the ability mentions
                basic_identity = "";
                for (var basic in basic_colours) {
                    if (line.indexOf(basic) >= 0) {
                        // The land has this basic type in the line of rules text where it fetches
                        basic_identity = basic_identity + basic_colours[basic];
                    }
                }

                // Set the name box & pinlines based on how many basics the ability mentions
                if (basic_identity.length == 1) {
                    // One basic mentioned - the land should just be this colour
                    return {
                        background: LayerNames.LAND,
                        pinlines: basic_identity,
                        twins: basic_identity,
                        is_colourless: false,
                    };
                } else if (basic_identity.length == 2) {
                    // Two basics mentioned - the land should use the land name box and those pinlines
                    basic_identity = fix_colour_pair(basic_identity);
                    return {
                        background: LayerNames.LAND,
                        pinlines: basic_identity,
                        twins: LayerNames.LAND,
                        is_colourless: false,
                    };
                } else if (basic_identity.length == 3) {
                    // Three basic mentioned - panorama land
                    return {
                        background: LayerNames.LAND,
                        pinlines: LayerNames.LAND,
                        twins: LayerNames.LAND,
                        is_colourless: false,
                    };
                } else if (line.indexOf(LayerNames.LAND.toLowerCase()) >= 0) {
                    // Assume we get here when the land fetches for any basic
                    if (line.indexOf("tapped") < 0 || line.indexOf("untap") >= 0) {
                        // Gold fetchland
                        return {
                            background: LayerNames.LAND,
                            pinlines: LayerNames.GOLD,
                            twins: LayerNames.GOLD,
                            is_colourless: false,
                        };
                    } else {
                        // Colourless fetchland
                        return {
                            background: LayerNames.LAND,
                            pinlines: LayerNames.LAND,
                            twins: LayerNames.LAND,
                            is_colourless: false,
                        };
                    }
                }
            }

            // Check if the line adds one mana of any colour
            if ((line.toLowerCase().indexOf("add") >= 0 && line.indexOf("mana") >= 0)
                && (line.indexOf("color ") > 0 || line.indexOf("colors ") > 0
                    || line.indexOf("color.") > 0 || line.indexOf("colors.") > 0)) {
                // Identified an ability of a potentially gold land
                // If the ability doesn't include the phrases "enters the battlefield", "Remove a charge
                // counter", and "luck counter", and doesn't include the word "Sacrifice", then it's
                // considered a gold land
                if (line.indexOf("enters the battlefield") < 0 && line.indexOf("Remove a charge counter") < 0
                    && line.indexOf("Sacrifice") < 0 && line.indexOf("luck counter") < 0) {
                    // This is a gold land - use gold twins and pinlines
                    return {
                        background: LayerNames.LAND,
                        pinlines: LayerNames.GOLD,
                        twins: LayerNames.GOLD,
                        is_colourless: false,
                    };
                }
            }

            // Count how many colours of mana the card can explicitly tap to add
            var tap_index = line.indexOf("{T}");
            var colon_index = line.indexOf(":");
            if (tap_index < colon_index && line.toLowerCase().indexOf("add") >= 0) {
                // This line taps to add mana of some colour
                // Count how many colours the line can tap for, and add them all to colours_tapped
                for (var colour in colours) {
                    if (line.indexOf("{" + colours[colour] + "}") >= 0 && colours_tapped.indexOf(colours[colour]) < 0) {
                        // Add this colour to colours_tapped
                        colours_tapped = colours_tapped + colours[colour];
                    }
                }
            }
        }

        // Evaluate colours_tapped and make decisions from here
        if (colours_tapped.length == 1) {
            pinlines = colours_tapped;
            if (twins == "") twins = colours_tapped;
        } else if (colours_tapped.length == 2) {
            colours_tapped = fix_colour_pair(colours_tapped);
            pinlines = colours_tapped;
            if (twins == "") twins = LayerNames.LAND;
        } else if (colours_tapped.length > 2) {
            pinlines = LayerNames.GOLD;
            if (twins == "") twins = LayerNames.GOLD;
        } else {
            pinlines = LayerNames.LAND;
            if (twins == "") twins = LayerNames.LAND;
        }

        // Final return statement
        return {
            background: LayerNames.LAND,
            pinlines: pinlines,
            twins: twins,
            is_colourless: false,
        };
    }
    else {
        // Nonland card

        // Decide on the colour identity of the card, as far as the frame is concerned
        // e.g. Noble Hierarch's colour identity is [W, U, G], but the card is considered green, frame-wise
        var colour_identity = "";
        if (mana_cost == "" || (mana_cost == "{0}" && type_line.indexOf(LayerNames.ARTIFACT) < 0)) {
            // Card with no mana cost
            // Assume that all nonland cards with no mana cost are mono-coloured
            if (colour_identity_array === undefined || colour_identity_array.length == 0) colour_identity = "";
            // else colour_identity = colour_identity_array[0];
            else {
                colour_identity = colour_identity_array.join("");
                if (colour_identity.length == 2) colour_identity = fix_colour_pair(colour_identity);
            }
        } else {
            // The card has a non-empty mana cost
            // Loop over each colour of mana, and add it to the colour identity if it's in the mana cost
            for (var colour in colours) {
                if (mana_cost.indexOf("{" + colours[colour]) >= 0 || mana_cost.indexOf(colours[colour] + "}") >= 0) {
                    colour_identity = colour_identity + colours[colour];
                }
            }
        }

        // If the colour identity is exactly two colours, ensure it fits into the proper naming convention
        // e.g. "WU" instead of "UW"
        if (colour_identity.length == 2) {
            colour_identity = fix_colour_pair(colour_identity);
        }

        // Handle Transguild Courier case - cards that explicitly state that they're all colours
        if (oracle_text.indexOf(" is all colors.") > 0) colour_identity = "WUBRG";

        // Identify if the card is a full-art colourless card, e.g. colourless
        // Assume all non-land cards with the word "Devoid" in their rules text use the BFZ colourless frame
        var devoid = oracle_text.indexOf("Devoid") >= 0 && colour_identity.length > 0;
        if ((colour_identity.length <= 0 && type_line.indexOf(LayerNames.ARTIFACT) < 0) || devoid || (mana_cost === "" && type_line.indexOf("Eldrazi") >= 0)) {
            // colourless-style card identified
            background = LayerNames.COLOURLESS;
            pinlines = LayerNames.COLOURLESS;
            twins = LayerNames.COLOURLESS;

            // Handle devoid frame
            if (devoid) {
                // Select the name box and devoid-style background based on the colour identity
                if (colour_identity.length > 1) {
                    // Use gold namebox and devoid-style background
                    twins = LayerNames.GOLD; background = LayerNames.GOLD;
                } else {
                    // Use mono coloured namebox and devoid-style background
                    twins = colour_identity; background = colour_identity;
                }
            }

            // Return the selected elements
            return {
                background: background,
                pinlines: pinlines,
                twins: twins,
                is_colourless: true,
            };
        }

        // Identify if the card is a two-colour hybrid card
        var hybrid = false;
        if (colour_identity.length == 2) {
            for (hybrid_symbol in hybrid_symbols) {
                if (mana_cost.indexOf(hybrid_symbols[hybrid_symbol]) >= 0) {
                    // The card is two colours and has a hybrid symbol in its mana cost
                    hybrid = true; break;
                }
            }
        }

        // Select background
        if (type_line.indexOf(LayerNames.ARTIFACT) >= 0) {
            background = LayerNames.ARTIFACT;
        } else if (hybrid) {
            background = colour_identity;
        } else if (colour_identity.length >= 2) {
            background = LayerNames.GOLD;
        } else {
            background = colour_identity;
        }

        // Identify if the card is a vehicle, and override the selected background if necessary
        if (type_line.indexOf(LayerNames.VEHICLE) >= 0) {
            background = LayerNames.VEHICLE;
        }

        // Select pinlines
        if (colour_identity.length <= 0) {
            pinlines = LayerNames.ARTIFACT;
        } else if (colour_identity.length <= 2) {
            pinlines = colour_identity;
        } else pinlines = LayerNames.GOLD;

        // Select name box
        if (colour_identity.length <= 0) {
            twins = LayerNames.ARTIFACT;
        } else if (colour_identity.length == 1) {
            twins = colour_identity;
        } else if (hybrid) {
            twins = LayerNames.LAND;
        } else if (colour_identity.length >= 2) {
            twins = LayerNames.GOLD;
        }

        // Finally, return the selected layers
        return {
            background: background,
            pinlines: pinlines,
            twins: twins,
            is_colourless: false,
        };
    }
}
