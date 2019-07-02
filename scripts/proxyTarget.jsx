// Filepath to the working folder
var filePath = File($.filename).parent.parent.fsName;

// Select image to proxy
file = app.openDialog();

$.evalFile(filePath + "\\scripts\\proxy.jsx");

// Proxy the selected image
if(file[0]){
  proxy(file, 0);
}
