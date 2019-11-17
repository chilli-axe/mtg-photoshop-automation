// File path to main working directory
var filePath = File($.fileName).parent.parent.fsName;

// Select image to borderify
file = app.openDialog();

$.evalFile(filePath + "/scripts/borderify.jsx");

// Ensure the file can be borderify'd, then do it
if (file[0]) {
  if (file.constructor != Folder) {
    borderify(file);
  }
}
