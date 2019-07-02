# MTG Autoproxy
Use Photoshop scripting to easily create custom high-quality Magic proxies for casual play.

# Example
![Here's a card I proxied using this method as an example of its capabilities](https://github.com/ndepaola/mtg-autoproxy/blob/master/Scalding%20Tarn.png?raw=true)

# What You'll Need
* A copy of Photoshop. I tested the system using CS5, but other versions may work as well.
* [The Photoshop template](https://drive.google.com/file/d/1h9Xm2j-dd-kHm0gNlP_APIlA25X40DsR/view)
* The following fonts:
  * [Beleren, Beleren Smallcaps, MPlantin and MPlantin-Italics](https://github.com/magarena/magarena/tree/master/resources/cardbuilder/fonts), for most text
  * My custom Magic symbols font NDPMTG, included in the repo.
  * [Keyrune](https://andrewgioia.github.io/Keyrune/index.html), for the expansion symbol.
 * [json2.js](https://github.com/douglascrockford/JSON-js), included but you may need to download a more recent version.
 * The included Photoshop templates.
 * The included JavaScript files.
 
 As well as the Python packages:
 * json
 * Scrython

# How to Use It
* Download and expand all files to a folder of your choice.
* Install the specified fonts.
* Edit `synthesiseTarget.jsx`, `synthesiseAll.jsx`, `borderify.jsx` and `cropArt.jsx` to reflect the path to your folder - they all have my path to the folder on my computer as default.
* I recommend moving `cropArt.jsx` into your default Photoshop script folder and assigning a key combination to it to streamline your workflow.
* Collect all of your artwork and move/paste it into the `source` folder. Ensure that the artist's name is included in brackets after the card's exact name - for example, the art image file for Lightning Bolt would be `Lightning Bolt (Christopher Rush)`.
* Open `Mask.psd`, drop your artwork into the file, and move it *behind* the black frame. 
* Position and resize your art as you desire, then execute `cropArt.jsx`, via double clicking on it in your folder or via key combination, to generate a cropped version of your art in the `crop` folder and to delete the art layer. 
* Repeat this for all cards you want to proxy.
* Open `Template.psd` and repair any broken fonts.
* When you're ready to synthesise your cards, execute the `synthesiseAll.jsx` script and let your computer do the rest of the work for you. 
* If you only want to synthesise a specific card, execute `synthesiseTarget.jsx` instead and select your card in the `crop` folder. 
* A version of the final png is also included in the `border` folder which thickens the borders around the cards, suitable for submission to websites like http://makeplayingcards.com or http://printerstudio.com. 

# Card Generation Settings
The script will generate proxies that use the following rules:
* A watermark of the expansion symbol they were originally printed in.
* Flavour text of the oldest printing with flavour text. 
* The card's most modern Oracle text for typeline and rules text.

# Limitations
As of the first release, the script can't handle:
* Non-standard card layouts, such as planeswalkers and Kamigawa flip cards. 
* Generic mana symbols of 10 or higher, as well as symbols from modern cards that aren't mana symbols (e.g. the energy symbol). 
* Frames for cards that aren't one of the following: monocoloured; two-coloured gold; 3+ coloured gold; colourless artifacts, colourless lands; mono-coloured lands; two-colour lands; 3+ colour lands.
* The script is unable to dynamically adjust the expansion symbol for rarity at the moment, and can't adjust the font size of the card name or typeline so they don't clash with the mana cost or expansion symbol, respectively.

# Customisation
Feel free to replace the rasterised card frames in the template with whichever frames you want, and move text layers to suit - your only restriction is that you can't really adjust the structure of the template much without causing the script to throw errors at you. 
