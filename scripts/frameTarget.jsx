// File path to main working directory (modern/automation)
var filePath = File($.filename).parent.parent.fsName;
var fileRef = new File(filePath + "\\Mask.psd");
app.open(fileRef);

// Select image to frame
file = app.openDialog();

$.evalFile(filePath + "\\scripts\\frame.jsx");

// Frame the selected image
if(file[0]){
  frame(file, 0);
}
