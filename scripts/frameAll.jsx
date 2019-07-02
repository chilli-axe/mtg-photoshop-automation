// File path to main working directory (modern/automation)
var filePath = File($.filename).parent.parent.fsName;
var fileRef = new File(filePath + "\\Mask.psd");

// Get an array of each file in the source folder
folder = new Folder( filePath + "\\art" );
files_array = folder.getFiles();

$.evalFile(filePath + "\\scripts\\frame.jsx");

// Run the script on each image in the source folder
for(var n=0;n<files_array.length;n++){
  var file = files_array[n];
    app.open(fileRef);
    frame(file, 1);
}
