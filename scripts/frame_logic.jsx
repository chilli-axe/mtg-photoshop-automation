function fixColourPair(input) {
    // Utility function to turn strings like "UW" into "WU" - it can be uncertain which
    // way it's ordered
    const colourPairs = ["WU", "UB", "BR", "RG", "GW", "WB", "BG", "GU", "UR", "RW"];
    for (var colourPair in colourPairs) {
        if (input.indexOf(colourPairs[colourPair].charAt(0)) >= 0
            && input.indexOf(colourPairs[colourPair].charAt(1)) >= 0) {
            return colourPairs[colourPair];
        }
    }
}

function select_frame_layers(mana_cost, type_line, oracle_text, colour_identity_array) {
    // return [selectedBackground, selectedPinlines, selectedNamebox, colourless];

    const colours = ["W", "U", "B", "R", "G"];
    const basicColours = { "Plains": "W", "Island": "U", "Swamp": "B", "Mountain": "R", "Forest": "G" };
    const hybridSymbols = ["W/U", "U/B", "B/R", "R/G", "G/W", "W/B", "B/G", "G/U", "U/R", "R/W"];

    // Declare output variables
    var selectedBackground; var selectedPinlines; var selectedNamebox;

    if (type_line.indexOf("Land") >= 0) {
        // Land card
        selectedNamebox = "";

        // Check if it has a basic land subtype
        var basicIdentity = "";
        for (var basic in basicColours) {
            if (type_line.indexOf(basic) >= 0) {
                // The land has this basic type on its type_line
                basicIdentity = basicIdentity + basicColours[basic];
            }
        }

        if (basicIdentity.length == 1) {
            // The land has exactly one basic land type. We still need to get the pinlines from the total colours the card
            // can add though (cornercase: Murmuring Bosk)
            selectedNamebox = basicIdentity;
        } else if (basicIdentity.length == 2) {
            // The land has exactly two basic land types. Ensure they follow the correct naming convention, then
            // return the corresponding frame elements
            basicIdentity = fixColourPair(basicIdentity);
            return {
                background: "Land",
                pinlines: basicIdentity,
                twins: "Land",
                is_colourless: false,
            };
        }

        // Array of rules text lines in the card
        var rulesLines = oracle_text.split('\n');
        var coloursTapped = "";

        // Iterate over rules text lines
        for (var i in rulesLines) {
            var line = rulesLines[i];

            // Identify if the card is a fetchland of some kind
            if (line.toLowerCase().indexOf("search your library") >= 0
                && line.toLowerCase().indexOf("cycling") < 0) {
                // Card is a fetchland of some kind
                // Find how many basic land types the ability mentions
                basicIdentity = "";
                for (var basic in basicColours) {
                    if (line.indexOf(basic) >= 0) {
                        // The land has this basic type in the line of rules text where it fetches
                        basicIdentity = basicIdentity + basicColours[basic];
                    }
                }

                // Set the name box & pinlines based on how many basics the ability mentions
                if (basicIdentity.length == 1) {
                    // One basic mentioned - the land should just be this colour
                    return {
                        background: "Land",
                        pinlines: basicIdentity,
                        twins: basicIdentity,
                        is_colourless: false,
                    };
                } else if (basicIdentity.length == 2) {
                    // Two basics mentioned - the land should use the land name box and those pinlines
                    basicIdentity = fixColourPair(basicIdentity);
                    return {
                        background: "Land",
                        pinlines: basicIdentity,
                        twins: "Land",
                        is_colourless: false,
                    };
                } else if (basicIdentity.length == 3) {
                    // Three basic mentioned - panorama land
                    return {
                        background: "Land",
                        pinlines: "Land",
                        twins: "Land",
                        is_colourless: false,
                    };
                } else if (line.indexOf("land") >= 0) {
                    // Assume we get here when the land fetches for any basic
                    if (line.indexOf("tapped") < 0 || line.indexOf("untap") >= 0) {
                        // Gold fetchland
                        return {
                            background: "Land",
                            pinlines: "Gold",
                            twins: "Gold",
                            is_colourless: false,
                        };
                    } else {
                        // Colourless fetchland
                        return {
                            background: "Land",
                            pinlines: "Land",
                            twins: "Land",
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
                        background: "Land",
                        pinlines: "Gold",
                        twins: "Gold",
                        is_colourless: false,
                    };
                }
            }

            // Count how many colours of mana the card can explicitly tap to add
            var tapIndex = line.indexOf("{T}");
            var colonIndex = line.indexOf(":");
            if (tapIndex < colonIndex && line.toLowerCase().indexOf("add") >= 0) {
                // This line taps to add mana of some colour
                // Count how many colours the line can tap for, and add them all to coloursTapped
                for (var colour in colours) {
                    if (line.indexOf("{" + colours[colour] + "}") >= 0 && coloursTapped.indexOf(colours[colour]) < 0) {
                        // Add this colour to coloursTapped
                        coloursTapped = coloursTapped + colours[colour];
                    }
                }
            }
        }

        // Evaluate coloursTapped and make decisions from here
        if (coloursTapped.length == 1) {
            selectedPinlines = coloursTapped;
            if (selectedNamebox == "") selectedNamebox = coloursTapped;
        } else if (coloursTapped.length == 2) {
            coloursTapped = fixColourPair(coloursTapped);
            selectedPinlines = coloursTapped;
            if (selectedNamebox == "") selectedNamebox = "Land";
        } else if (coloursTapped.length > 2) {
            selectedPinlines = "Gold";
            if (selectedNamebox == "") selectedNamebox = "Gold";
        } else {
            selectedPinlines = "Land";
            if (selectedNamebox == "") selectedNamebox = "Land";
        }

        // Final return statement
        return {
            background: "Land",
            pinlines: selectedPinlines,
            twins: selectedNamebox,
            is_colourless: false,
        };
    }
    else {
        // Nonland card

        // Decide on the colour identity of the card, as far as the frame is concerned
        // e.g. Noble Hierarch's colour identity is [W, U, G], but the card is considered green, frame-wise
        var colourIdentity = "";
        if (mana_cost == "" || (mana_cost == "{0}" && type_line.indexOf("Artifact") < 0)) {
            // Card with no mana cost
            // Assume that all nonland cards with no mana cost are mono-coloured
            if (colour_identity_array === undefined || colour_identity_array.length == 0) colourIdentity = "";
            // else colourIdentity = colour_identity_array[0];
            else {
                colourIdentity = colour_identity_array.join("");
                if (colourIdentity.length == 2) colourIdentity = fixColourPair(colourIdentity);
            }
        } else {
            // The card has a non-empty mana cost
            // Loop over each colour of mana, and add it to the colour identity if it's in the mana cost
            for (var colour in colours) {
                if (mana_cost.indexOf("{" + colours[colour]) >= 0 || mana_cost.indexOf(colours[colour] + "}") >= 0) {
                    colourIdentity = colourIdentity + colours[colour];
                }
            }
        }

        // If the colour identity is exactly two colours, ensure it fits into the proper naming convention
        // e.g. "WU" instead of "UW"
        if (colourIdentity.length == 2) {
            colourIdentity = fixColourPair(colourIdentity);
        }

        // Handle Transguild Courier case - cards that explicitly state that they're all colours
        if (oracle_text.indexOf(" is all colors.") > 0) colourIdentity = "WUBRG";

        // Identify if the card is a full-art colourless card, e.g. colourless
        // Assume all non-land cards with the word "Devoid" in their rules text use the BFZ colourless frame
        var devoid = oracle_text.indexOf("Devoid") >= 0 && colourIdentity.length > 0;
        if ((colourIdentity.length <= 0 && type_line.indexOf("Artifact") < 0) || devoid) {
            // colourless-style card identified
            selectedBackground = "Colourless";
            selectedPinlines = "Colourless";
            selectedNamebox = "Colourless";

            // Handle devoid frame
            if (devoid) {
                // Select the name box and devoid-style background based on the colour identity
                if (colourIdentity.length > 1) {
                    // Use gold namebox and devoid-style background
                    selectedNamebox = "Gold"; selectedBackground = "Gold";
                } else {
                    // Use mono coloured namebox and devoid-style background
                    selectedNamebox = colourIdentity; selectedBackground = colourIdentity;
                }
            }

            // Return the selected elements
            return {
                background: selectedBackground,
                pinlines: selectedPinlines,
                twins: selectedNamebox,
                is_colourless: true,
            };
        }

        // Identify if the card is a two-colour hybrid card
        var hybrid = false;
        if (colourIdentity.length == 2) {
            for (hybridSymbol in hybridSymbols) {
                if (mana_cost.indexOf(hybridSymbols[hybridSymbol]) >= 0) {
                    // The card is two colours and has a hybrid symbol in its mana cost
                    hybrid = true; break;
                }
            }
        }

        // Select background
        if (type_line.indexOf("Artifact") >= 0) {
            selectedBackground = "Artifact";
        } else if (hybrid) {
            selectedBackground = colourIdentity;
        } else if (colourIdentity.length >= 2) {
            selectedBackground = "Gold";
        } else {
            selectedBackground = colourIdentity;
        }

        // Identify if the card is a vehicle, and override the selected background if necessary
        if (type_line.indexOf("Vehicle") >= 0) {
            selectedBackground = "Vehicle";
        }

        // Select pinlines
        if (colourIdentity.length <= 0) {
            selectedPinlines = "Artifact";
        } else if (colourIdentity.length <= 2) {
            selectedPinlines = colourIdentity;
        } else selectedPinlines = "Gold";

        // Select name box
        if (colourIdentity.length <= 0) {
            selectedNamebox = "Artifact";
        } else if (colourIdentity.length == 1) {
            selectedNamebox = colourIdentity;
        } else if (hybrid) {
            selectedNamebox = "Land";
        } else if (colourIdentity.length >= 2) {
            selectedNamebox = "Gold";
        }

        // Finally, return the selected layers
        return {
            background: selectedBackground,
            pinlines: selectedPinlines,
            twins: selectedNamebox,
            is_colourless: false,
        };
    }
}
