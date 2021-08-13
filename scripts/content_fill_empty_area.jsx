function content_fill_empty_area() {
    /**
     * Helper function intended to streamline the workflow of making extended art cards.
     * This script rasterises the active layer and fills all empty pixels in the canvas on the layer using content-aware fill.
     */

    // select pixels of active layer
    var id1268 = charIDToTypeID("setd");
    var desc307 = new ActionDescriptor();
    var id1269 = charIDToTypeID("null");
    var ref257 = new ActionReference();
    var id1270 = charIDToTypeID("Chnl");
    var id1271 = charIDToTypeID("fsel");
    ref257.putProperty(id1270, id1271);
    desc307.putReference(id1269, ref257);
    var id1272 = charIDToTypeID("T   ");
    var ref258 = new ActionReference();
    var id1273 = charIDToTypeID("Chnl");
    var id1274 = charIDToTypeID("Chnl");
    var id1275 = charIDToTypeID("Trsp");
    ref258.putEnumerated(id1273, id1274, id1275);
    desc307.putReference(id1272, ref258);
    executeAction(id1268, desc307, DialogModes.NO);

    // rasterise
    var docRef = app.activeDocument;
    var active_layer = docRef.activeLayer;
    active_layer.rasterize(RasterizeType.ENTIRELAYER);

    // manipulate selection - invert, expand 8px, smooth 4px
    selection = docRef.selection;
    selection.invert();
    selection.expand(new UnitValue(10, "px"));
    selection.smooth(new UnitValue(4, "px"));

    // content aware fill
    var idFl = charIDToTypeID("Fl  ");
    var desc12 = new ActionDescriptor();
    var idUsng = charIDToTypeID("Usng");
    var idFlCn = charIDToTypeID("FlCn");
    var idcontentAware = stringIDToTypeID("contentAware");
    desc12.putEnumerated(idUsng, idFlCn, idcontentAware);
    var idOpct = charIDToTypeID("Opct");
    var idPrc = charIDToTypeID("#Prc");
    desc12.putUnitDouble(idOpct, idPrc, 100.000000);
    var idMd = charIDToTypeID("Md  ");
    var idBlnM = charIDToTypeID("BlnM");
    var idNrml = charIDToTypeID("Nrml");
    desc12.putEnumerated(idMd, idBlnM, idNrml);
    executeAction(idFl, desc12, DialogModes.NO);

    selection.deselect();
}