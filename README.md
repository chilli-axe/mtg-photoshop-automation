# MTG Autoproxy
Use Photoshop scripting to easily create custom high-quality Magic proxies for casual play.

# Example
![img1](https://github.com/ndepaola/mtg-autoproxy/blob/master/Scalding%20Tarn.png?raw=true)
![img2](https://github.com/ndepaola/mtg-autoproxy/blob/master/IMG_1927.jpg)

# What You'll Need
* A copy of Photoshop. I tested the system using CS5, but other versions may work as well.
* [The Photoshop template](https://drive.google.com/file/d/1h9Xm2j-dd-kHm0gNlP_APIlA25X40DsR/view)
* The following fonts:
  * [Beleren, Beleren Smallcaps, MPlantin and MPlantin-Italics](https://github.com/magarena/magarena/tree/master/resources/cardbuilder/fonts), for most text
  * My custom Magic symbols font NDPMTG, included in the repo.
  * [Keyrune](https://andrewgioia.github.io/Keyrune/index.html), for the expansion symbol.
 * [json2.js](https://github.com/douglascrockford/JSON-js), included but you may need to download a more recent version.
 
 As well as the Python packages (I tested the script using Python 3.6.3):
 * json
 * Scrython

# How to Use It
* Clone to a folder of your choice.
* Install the included font and the other fonts specified above. 
* Download the Photoshop template and move it into the main directory.
* Move all of your card artwork to the `art` folder. File names should be structured as `<CARDNAME> (<ARTIST NAME>).jpg`.
* Run the script `Frame All` to position each art piece in the art window, and store the results in the `crop` folder. `Frame Target` does the same but only for a specific art image.
* Run the script `Proxy All` to render each card in the `crop` folder, and store the results in the `out` folder. `Proxy Target` does the same but only for a specific framed image.
* Run the script `Borderify All` to pad each card render with a black border, such that it's ready to order through sites like makeplayingcards.com, and store the results in the `border` folder inside the `out` folder. `Borderify Target` does the same but only for a specific render.
I included sample files in the `art`, `crop`, `out`, and `border` folders to show how the process works. 

# Limitations
As of this release, the script can't handle:
* Non-standard card layouts, such as planeswalkers and Kamigawa flip cards. 
* Occasionally the information on Scryfall's API is formatted slightly incorrectly, meaning that some mistakes are possible. These are rare, and so far are limited to things like not colouring a Phyrexian mana symbol in rules text, or not inserting a new line in flavour text where it's quoting a character.
* Ability keywords, like `Threshold` and `Fateful Hour` are hardcoded, and any instances of these keywords in the rules text are italicised. Not all keywords have been listed, but adding additional ones is easy. Just haven't gotten around to it yet.  

# Customisation
Feel free to replace the rasterised card frames in the template with whichever frames you want, and move text layers to suit - your only restriction is that you can't really adjust the structure of the template much without causing the script to throw errors at you. 
