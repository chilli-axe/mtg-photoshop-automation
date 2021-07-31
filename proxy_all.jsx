#include "scripts/proxy.jsx";

// File path to main working directory
var file_path = File($.fileName).parent.fsName;
var folder = new Folder(file_path + "/art");
var files = folder.getFiles();

// Proxy all images in the folder
for (var n = 0; n < files.length; n++) {
    var file = files[n];
    // Ensure the image can be proxied, then do it
    if (file.constructor != Folder && file.name != ".DS_Store") {
        proxy_new(file);
    }
}
