// Set this to the filepath to your working directory
var filePath = "G:/Documents/Proxy Project/Custom Template Proxies/JavaScript/";
$.evalFile(filePath + "text/synthesise.jsx");
// Loop through each image in the crop folder and produce a proxy for it
folder = new Folder( filePath + "/crop" );
files_array = folder.getFiles();
for(var n=0;n<files_array.length;n++){
  var file = files_array[n];
    // Open the Photoshop template
    var fileRef = new File(filePath + "Template.psd");
    app.open(fileRef);
    // Create a reference to the active document for convenience
    var docRef = app.activeDocument;

   // Get the card's name
   var artPath = String(file);

   // Retrieve the card's name from the given filepath
   var reversedPath = artPath.split("").reverse().join("");
   var startIndex = artPath.length - reversedPath.indexOf("/");
   var endIndex = artPath.lastIndexOf(".");
   var fullCardName = artPath.slice(startIndex,endIndex);

   // Replace apostrophes, commas and places in % format with their proper ones
   fullCardName = fullCardName.replace(/%2C/g,",");
   fullCardName = fullCardName.replace(/%27/g,"'");
   fullCardName = fullCardName.replace(/%20/g," ");
   fullCardName = fullCardName.replace(/%26/g,"&");
   fullCardName = fullCardName.replace(/%C3%A1/g,"á");

   // Place it in the template
   app.load(file);
   backFile = app.activeDocument;
   backFile.selection.selectAll();
   backFile.selection.copy();
   backFile.close(SaveOptions.DONOTSAVECHANGES);
   docRef.paste();

   synthesise(fullCardName);
}
