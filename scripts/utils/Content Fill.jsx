/*
Usage:
> Move this script to C:\Program Files\Adobe\Adobe Photoshop CC 2018\Presets\Scripts (or equivalent)
> Hardcode the below path variable to point to the content_fill_empty_area.jsx file in your project directory
> Make the raster layer you want to extend the active layer
> File -> Scripts -> Content Fill
*/

// Hardcode this path variable to point to `content_fill_empty_area.jsx` in \scripts
$.evalFile("../scripts/content_fill_empty_area.jsx");
content_fill_empty_area();