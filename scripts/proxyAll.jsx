// File path to main working directory (modern/automation)
var filePath = File($.filename).parent.parent.fsName;

// Get an array of each file in the source folder
folder = new Folder( filePath + "\\crop" );
files_array = folder.getFiles();

$.evalFile(filePath + "\\scripts\\proxy.jsx");

// Loop through each image in the crop folder and produce a proxy for it
for(var n=0;n<files_array.length;n++){
  var file = files_array[n];
  proxy(file, 1);
}
