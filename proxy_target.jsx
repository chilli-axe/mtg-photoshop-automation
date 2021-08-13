#include "scripts/proxy.jsx";

file = app.openDialog();

// Proxy the selected image
if (file[0]) {
    proxy(file[0]);
}
