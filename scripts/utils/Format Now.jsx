/*
Usage:
> Move this script to C:\Program Files\Adobe\Adobe Photoshop CC 2018\Presets\Scripts (or equivalent)
> Hardcode the below path variable to point to the formatText file in your project directory
> Make the text layer you're working with the active layer (if you select another layer, it might crash photoshop lmao)
> File -> Scripts -> Format Now
*/

// Hardcode this path variable to point to `format_text.jsx` in \scripts
$.evalFile("../scripts/format_text.jsx");
format_text_wrapper();