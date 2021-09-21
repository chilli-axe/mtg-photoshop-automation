#include "scripts/borderify.jsx";

// File path to main working directory
var file_path = File($.fileName).parent.fsName;

// Borderify all images in /out
var folder = new Folder(file_path + "/out");
var files = folder.getFiles(/.\.(jpg|jpeg|png|tif)$/i);
for (var n = 0; n < files.length; n++) {
    borderify(files[n]);
}
