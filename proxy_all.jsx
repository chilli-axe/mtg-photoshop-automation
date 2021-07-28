// File path to main working directory
var filePath = File($.fileName).parent.parent.fsName;

// Get an array of each file in the source folder
folder = new Folder(filePath + "/art");
files_array = folder.getFiles();

$.evalFile(filePath + "/scripts/proxy.jsx");

// Loop through each image in the crop folder and produce a proxy for it
for (var n = 0; n < files_array.length; n++) {
  var file = files_array[n];
  // Ensure the image can be proxied, then do it
  if (file.constructor != Folder && file.name != ".DS_Store") {
    proxy(file, 1);
  }
}
