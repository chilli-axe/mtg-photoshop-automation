#include "scripts/render.jsx";

file = app.openDialog();

// Render the selected image
if (file[0]) {
    render(file[0]);
}
