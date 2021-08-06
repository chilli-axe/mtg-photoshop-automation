#include "scripts/extend_art.jsx";

// File path to main working directory
var file_path = File($.fileName).parent.fsName;

// Get an array of each file in the source folder
folder = new Folder(file_path + "/art_raw");
files_array = folder.getFiles();

// Run the script on each image in the source folder
for (var n = 0; n < files_array.length; n++) {
    var file = files_array[n];

    // Ensure the image can be extended, then do it
    if (file.constructor != Folder && file.name != ".DS_Store") {
        extend_art(file);
    }
}
