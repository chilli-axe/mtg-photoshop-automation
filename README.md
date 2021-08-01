# MTG Autoproxy
Use Photoshop scripting to easily create custom high-quality Magic proxies for casual play.

If you found this tool and/or my renders useful, you could shout me a cup of coffee if you felt like it <3

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=7LJNRSLJYCZTJ&currency_code=AUD&source=url)

[Google Drive full of MPC ready cards](https://drive.google.com/open?id=1CUaOPDZM84dk85Kvp6fGrqZVPDo4jQJo)

# Examples
[Video demonstration](https://www.youtube.com/watch?v=jSuH7CY8HIM)

Output from this project
![img1](https://i.imgur.com/hGkFpxc.jpg)

Printed through http://makeplayingcards.com
![img2](https://i.imgur.com/sMOSU84.jpg)

# What You'll Need
  * A copy of Photoshop. I tested the system using CS5 and CC 2018, but other versions may work as well.
  * [The Photoshop templates](https://drive.google.com/open?id=1CUaOPDZM84dk85Kvp6fGrqZVPDo4jQJo) (download the desired templates in the Automated folder - hopefully the filenames are self-explanatory)
  * The following fonts:
    * [Beleren Smallcaps, MPlantin and MPlantin-Italics](https://github.com/magarena/magarena/tree/master/resources/cardbuilder/fonts) and [Beleren2016](https://magic.wizards.com/sites/all/themes/wiz_mtg/fonts/Beleren/Beleren2016-Bold.ttf),
    * My custom Magic symbols font NDPMTG, included in the repo,
    * [Keyrune](https://andrewgioia.github.io/Keyrune/index.html) and [Mana](https://andrewgioia.github.io/Mana/), for the expansion symbol and transform symbols,
    * Relay Medium and Calibri.
  * [json2.js](https://github.com/douglascrockford/JSON-js), included but you may need to download a more recent version.
  * A standard installation of Python 3.

# Install and Usage Guide
* Clone to a folder of your choice, referred to as the *working directory*.
* Install the included font and the other fonts specified above.
* Download the Photoshop templates, create a folder called `templates` in the working directory, and extract them into the folder.
* Create a folder called `art` in the working directory, and another called `out`.
* Move all of your card artwork to the `art` folder. File names should be structured as `<CARDNAME> (<ARTIST NAME>).jpg`. Artist name is optional - if ommitted, it will be retrieved from Scryfall.
* Run the script `proxy_all` to render each card in the `art` folder, and store the results in the `out` folder. `proxy_target` does the same but for a single image.
* Comment or modify `settings.jsx` to change how the scripts behave.

# FAQ
* *When I load the template, Photoshop tells me I'm  missing a font called MTG2016.* Try updating your templates - this should be fixed for everyone now. Feel free to raise an issue if it's not though!
* *I want to disable the signature in the bottom-right of the card.* TODO
* *I want to change the set symbol to something else.* Head over to https://andrewgioia.github.io/Keyrune/cheatsheet.html - you can use any of these symbols for the set symbol for your cards. Copy the text of the symbol you want on the cheatsheet, then hop into `settings.jsx` and look about 10 lines down. Replace the square character in quotations with the character you copied.
* *I'm getting an error that looks like `"error 23: ) does not have a value. Line: 1"`* Seems like this issue arises from PS running the Python script in a different directory - check out `call_python()` in `proxy.jsx` and make sure the command it's calling matches how Python should be invoked on your computer. Fairly sure I've fixed this for most people as of August 2021 but you never know.

# Scope
* Modern style cards, normal and extended; transform and mdfc, front and back; basic lands, normal, Theros, and Unstable styles; planeswalkers, normal and extended; mutate, adventure, miracle, and snow cards; and various flavours of fancy frames - stargazing, universes beyond, masterpiece, ZNE expedition, and womensday.
* Planeswalkers require manual intervention to position text layers and the ragged textbox divider, but are automated up until that point.

# Customisation
The repo includes a set of helper functions and boilerplate classes which make automating any given template straight-forward. You'll need reference layers (check out my templates on google drive for examples) for artwork to be positioned against, and for any text layers that need to be positioned vertically within a textbox. Check out the comments at the top of `templates.jsx` for more info, and you can review how I've automated my templates there for reference as well. You'll also need to adjust the function `select_template()` in `proxy.jsx` to point to your template class(es).