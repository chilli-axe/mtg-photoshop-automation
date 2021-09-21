#include "scripts/extend_art.jsx";

// File path to main working directory
var file_path = File($.fileName).parent.fsName;

// Extend all images in /art_raw
var folder = new Folder(file_path + "/art_raw");
var files = folder.getFiles(/.\.(jpg|jpeg|png|tif)$/i);
for (var n = 0; n < files.length; n++) {
    extend_art(files[n]);
}
