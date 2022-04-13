#include "scripts/templates.jsx";

// Expansion symbol - characters copied from Keyrune cheatsheet
var expansion_symbol_character = "";  // Cube

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