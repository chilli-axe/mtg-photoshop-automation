#include "scripts/extend_art.jsx";

// Select image to borderify
file = app.openDialog();

// Ensure the file can be borderify'd, then do it
if (file[0]) {
    if (file[0].constructor != Folder) {
        extend_art(file[0]);
    }
}
