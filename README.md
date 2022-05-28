# MTG Photoshop Automation
Photoshop scripting to generate high-quality Magic card renders, inserting Scryfall data into Photoshop frame templates.

Trademark and copyright Wizards of the Coast 2022. Templates for this project include Wizards of the Coast's IP, including: the Beleren font, mana symbols, set icons, background textures, and card text. Templates for this project include the appropriate copyright disclaimers. Read WotC's fan content policy here: https://company.wizards.com/en/legal/fancontentpolicy
# Example
![img1](https://i.imgur.com/4TTvpND.png)

# Requirements
  * A copy of Photoshop. I tested the system using CS5 and CC 2018, but other versions may work as well.
  * The Photoshop templates:
    * [Automated templates](https://drive.google.com/drive/folders/1_8szsVZ6-0Uoxr0XzLcYM6Zjcx89wqYR?usp=sharing), which are compatible with this project
    * [Manual templates](https://drive.google.com/drive/folders/1wAH-JKPHa5cPcMcEiyE9q46WH6PEaXnj?usp=sharing), which may also be of interest
  * The following fonts:
    * [Beleren Smallcaps, MPlantin, and MPlantin-Italics](https://github.com/magarena/magarena/tree/master/resources/cardbuilder/fonts),
    * Beleren2016:
      * I have included a copy of the font in this repo which tweaks the asterisk symbol to match how it appears in the power / toughness of real cards,
      * You can download the original from Wizards' website [here](https://magic.wizards.com/sites/all/themes/wiz_mtg/fonts/Beleren/Beleren2016-Bold.ttf),
    * My custom Magic symbols font `NDPMTG.ttf`, included in the repo,
    * [Keyrune](https://keyrune.andrewgioia.com/) and [Mana](https://mana.andrewgioia.com/), for the expansion symbol and transform symbols,
    * Relay Medium and Calibri.
  * A standard installation of [Python 3](https://www.python.org/downloads/).

# Install and Usage Guide
* Clone to a folder of your choice, referred to as the *working directory*.
* Install the included font and the other fonts specified above.
* Download the Photoshop templates, create a folder called `templates` in the working directory, and extract them into the folder.
* Create a folder called `art` in the working directory, and another called `out`.
* Move all of your card artwork to the `art` folder. File names should be structured like `<CARDNAME> (<ARTIST NAME>).jpg`. Artist name is optional - if omitted, it will be retrieved from Scryfall. You can optionally specify the card's set by structuring the file name like `<CARDNAME>$<SET> (<ARTIST NAME>).jpg`.
* Run the script `render_all` to render each card in the `art` folder, and store the results in the `out` folder. `render_target` does the same but for a single image.
* Modify `settings.jsx` to change how the scripts behave - change the expansion symbol; force the system to use a particular template; or force the system to stop before saving your cards and exiting so you can adjust them manually.
* **Optional**: Copy the files from `/scripts/utils` to the `Scripts` folder in your Photoshop installation. For me, this was `C:\Program Files\Adobe\Adobe Photoshop CC 2018\Presets\Scripts`. Modify the paths in those files to point to the corresponding files in `/scripts`. This enables the use of a few utility scripts which are handy when making renders manually.

# FAQ
* *I want to change the set symbol to something else.* Head over to https://andrewgioia.github.io/Keyrune/cheatsheet.html - you can use any of these symbols for the set symbol for your cards. Copy the text of the symbol you want on the cheatsheet, then replace the expansion symbol character in quotations at the top of the file with the character you copied.
* *I'm getting an error message saying that the Python call failed and `card.json` was not created.* This is a result of the Python command not executing properly on your computer. The error message contains a copy of the command the system attempted - copy this command and try running it from the command line to diagnose the issue. You may need to adjust the Python command defined in `settings.jsx` depending on how your computer's Python installation is configured. The default commands are:
    * Windows: `python ...`
    * macOS: `/usr/local/bin/python3 ...`

# Scope
* Modern style cards, normal and extended; transform and mdfc, front and back; basic lands, normal, Theros, and Unstable styles; planeswalkers, normal and extended; mutate, adventure, miracle, and snow cards; various flavours of fancy frames - stargazing, universes beyond, masterpiece, ZNE expedition, and womensday; planar cards, tokens, and basic lands.
* The flavour text divider is automatically positioned.
* Leveler and saga cards require manual intervention to position text layers, but are automated up until that point.
* Planeswalkers also require manual intervention to position text layers and the ragged textbox divider, but are automated up until that point.

# Customisation
The repo includes a set of helper functions and boilerplate classes which make automating any given template straight-forward. You'll need reference layers (check out my templates on google drive for examples) for artwork to be positioned against, and for any text layers that need to be positioned vertically within a textbox. Check out the comments at the top of `templates.jsx` for more info, and you can review how I've automated my templates there for reference as well. You'll also need to adjust the function `select_template()` in `render.jsx` to point to your template class(es).
