# MTG Autoproxy
Use Photoshop scripting to easily create custom high-quality Magic proxies for casual play.

If you found this tool and/or my renders useful, you could shout me a cup of coffee if you felt like it <3

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=7LJNRSLJYCZTJ&currency_code=AUD&source=url)

[Google Drive full of MPC ready cards](https://drive.google.com/open?id=1CUaOPDZM84dk85Kvp6fGrqZVPDo4jQJo)

# Examples
Output from this project
![img1](https://i.imgur.com/hGkFpxc.jpg)

Printed through http://makeplayingcards.com
![img2](https://i.imgur.com/sMOSU84.jpg)

# Requirements
  * A copy of Photoshop. I tested the system using CS5 and CC 2018, but other versions may work as well.
  * [The Photoshop templates](https://drive.google.com/open?id=1CUaOPDZM84dk85Kvp6fGrqZVPDo4jQJo) (templates compatible with this project are located in the Automated Templates folder)
  * The following fonts:
    * [Beleren Smallcaps, MPlantin and MPlantin-Italics](https://github.com/magarena/magarena/tree/master/resources/cardbuilder/fonts) and [Beleren2016](https://magic.wizards.com/sites/all/themes/wiz_mtg/fonts/Beleren/Beleren2016-Bold.ttf),
    * My custom Magic symbols font, NDPMTG,ttf, included in the repo,
    * [Keyrune](https://andrewgioia.github.io/Keyrune/index.html) and [Mana](https://andrewgioia.github.io/Mana/), for the expansion symbol and transform symbols,
    * Relay Medium and Calibri.
  * [json2.js](https://github.com/douglascrockford/JSON-js), included but you may need to download a more recent version.
  * A standard installation of [Python 3](https://www.python.org/downloads/).

# Install and Usage Guide
* Clone to a folder of your choice, referred to as the *working directory*.
* Install the included font and the other fonts specified above.
* Download the Photoshop templates, create a folder called `templates` in the working directory, and extract them into the folder.
* Create a folder called `art` in the working directory, and another called `out`.
* Move all of your card artwork to the `art` folder. File names should be structured like `<CARDNAME> (<ARTIST NAME>).jpg`. Artist name is optional - if ommitted, it will be retrieved from Scryfall. You can optionally specify the card's set by structuring the file name like `<CARDNAME>$<SET> (<ARTIST NAME>).jpg`.
* Run the script `proxy_all` to render each card in the `art` folder, and store the results in the `out` folder. `proxy_target` does the same but for a single image.
* Modify `settings.jsx` to change how the scripts behave - change the expansion symbol; force the system to use a particular template; or force the system to stop before saving your cards and exiting so you can adjust them manually.
* **Optional**: Copy the files from `/scripts/utils` to the `Scripts` folder in your Photoshop installation. For me, this was `C:\Program Files\Adobe\Adobe Photoshop CC 2018\Presets\Scripts`. Modify the paths in those files to point to the corresponding files in `/scripts`. This enables the use of a few utility scripts which are handy when making renders manually.

# FAQ
* *I want to disable the signature in the bottom-right of the card.* The code driving the visibility of the signature layer can be found in the `NormalTemplate` and `TransformFrontTemplate` class definitions and can easily be commented out.
* *I want to change the set symbol to something else.* Head over to https://andrewgioia.github.io/Keyrune/cheatsheet.html - you can use any of these symbols for the set symbol for your cards. Copy the text of the symbol you want on the cheatsheet, then replace the expansion symbor character in quotations at the top of the file with the character you copied.
* *I'm getting an error message saying that the Python call failed and `card.json` was not created.* This is a result of the Python command not executing properly on your computer. The error message contains a copy of the command the system attempted - copy this command and try running it from the command line. You may need to adjust the command in `call_python()` in `proxy.jsx` depending on how your Python installation is configured.

# Scope
* Modern style cards, normal and extended; transform and mdfc, front and back; basic lands, normal, Theros, and Unstable styles; planeswalkers, normal and extended; mutate, adventure, miracle, and snow cards; and various flavours of fancy frames - stargazing, universes beyond, masterpiece, ZNE expedition, and womensday.
* Planeswalkers require manual intervention to position text layers and the ragged textbox divider, but are automated up until that point.
* Flavour text divider is not supported, as rules text & flavour text are formatted in the same text layer, and it would be impractical to position the flavour text divider programmatically with Adobe's JavaScript library.

# Customisation
The repo includes a set of helper functions and boilerplate classes which make automating any given template straight-forward. You'll need reference layers (check out my templates on google drive for examples) for artwork to be positioned against, and for any text layers that need to be positioned vertically within a textbox. Check out the comments at the top of `templates.jsx` for more info, and you can review how I've automated my templates there for reference as well. You'll also need to adjust the function `select_template()` in `proxy.jsx` to point to your template class(es).