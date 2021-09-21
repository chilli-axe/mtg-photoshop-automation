#include "scripts/render.jsx";

// File path to main working directory
var file_path = File($.fileName).parent.fsName;

// Render all images in /art
var folder = new Folder(file_path + "/art");
var files = folder.getFiles(/.\.(jpg|jpeg|png|tif)$/i);
for (var n = 0; n < files.length; n++) {
    render(files[n]);
}
