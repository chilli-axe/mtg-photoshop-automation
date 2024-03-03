#include "scripts/templates.jsx";

// Expansion symbol settings - if set to true, the system will use `default.svg` as the expansion symbol for all cards.
// If set to false, the system will use the expansion symbol that appears on the printed card. This may not look 100% correct 
// when compared to real cards.
var use_default_expansion_symbol = true;

// Specify a template to use (if the card's layout is compatible) rather than the default template
var specified_template = null;
// var specified_template = NormalExtendedTemplate;

// Specify whether to end the script when the card is finished being formatted (for manual intervention)
var exit_early = false;
// var exit_early = true;

// The prefix for the system call to Python - you may need to adjust this depending on your setup
var python_command = "python";  // Windows
if ($.os.search(/windows/i) === -1) {
    python_command = "/usr/local/bin/python3";  // macOS
}