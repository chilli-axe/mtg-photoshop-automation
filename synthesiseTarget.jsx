// Filepath to the working folder
var filePath = "G:/Documents/Proxy Project/Custom Template Proxies/JavaScript/";

// Load in json2.js, MTG JSON and some function files
$.evalFile(filePath + "text/synthesise.jsx");

// Open the Photoshop template
var fileRef = new File(filePath + "Template.psd");
app.open(fileRef);

// Create a reference to the active document for convenience
var docRef = app.activeDocument;

// Allow the user to select their card artwork
file = app.openDialog();

// Process the selected file and place it in the template
if(file[0]){
   // Get the card's name
   var artPath = String(file);

   // Retrieve the card's name from the given filepath
   var reversedPath = artPath.split("").reverse().join("");
   var startIndex = artPath.length - reversedPath.indexOf("/");
   var endIndex = artPath.lastIndexOf(".");
   fullCardName = artPath.slice(startIndex,endIndex);

   // Replace apostrophes, commas and places in % format with their proper ones
   fullCardName = fullCardName.replace(/%2C/g,",");
   fullCardName = fullCardName.replace(/%27/g,"'");
   fullCardName = fullCardName.replace(/%20/g," ");
   fullCardName = fullCardName.replace(/%26/g,"&");

   // Place it in the template
   app.load(file[0]);
   backFile= app.activeDocument;
   backFile.selection.selectAll();
   backFile.selection.copy();
   backFile.close(SaveOptions.DONOTSAVECHANGES);
   docRef.paste();
}
synthesise(fullCardName);
