import json
import os
import sys
import time
from urllib import error, parse, request


def add_meld_info(card_json):
    """
    If the current card is a meld card, it's important to retrieve information about its faces here, since it'll be
    difficult to make another query while building the card's layout obj. For each part in all_parts, query Scryfall
    for the full card info from that part's uri.
    """

    if card_json["layout"] == "meld":
        for i in range(0, 3):
            time.sleep(0.1)
            uri = card_json["all_parts"][i]["uri"]
            part = json.loads(request.urlopen(uri).read())
            card_json["all_parts"][i]["info"] = part

    return card_json


if __name__ == "__main__":
    time.sleep(0.1)
    card_name = sys.argv[1]
    # Use Scryfall to search for this card
    card = None

    # If the card specifies which set to retrieve the scan from, do that
    try:
        pipe_idx = card_name.index("$")
        card_set = card_name[pipe_idx + 1 :]
        card_name = card_name[0:pipe_idx]
        print(f"Searching Scryfall for: {card_name}, set: {card_set}...", end="", flush=True)
        card = request.urlopen(
            f"https://api.scryfall.com/cards/named?fuzzy={parse.quote(card_name)}&set={parse.quote(card_set)}"
        ).read()

    except ValueError:
        print(f"Searching Scryfall for: {card_name}...", end="", flush=True)
        card = request.urlopen(f"https://api.scryfall.com/cards/named?fuzzy={parse.quote(card_name)}").read()
    except error.HTTPError:
        input("\nError occurred while attempting to query Scryfall. Press enter to exit.")

    print(" and done! Saving JSON...", end="", flush=True)

    card_json = add_meld_info(json.loads(card))
    json_dump = json.dumps(card_json)
    with open(sys.path[0] + "/card.json", "w") as f:
        json.dump(json_dump, f)
    print(" and done!", flush=True)

    set_code = card_json["set"].upper()
    icons_folder = sys.path[0] + "/icons"
    if not os.path.exists(icons_folder):
        os.mkdir(icons_folder)
    icon_path = icons_folder + f"/{set_code}.svg"
    if not os.path.exists(icon_path):
        try:
            print(f"Searching Scryfall for the icon for the set: {set_code}...", end="", flush=True)
            set_info = json.loads(request.urlopen(f"https://api.scryfall.com/sets/{set_code}").read())
            request.urlretrieve(set_info["icon_svg_uri"], icon_path)

        except error.HTTPError:
            input("\nError occurred while attempting to query Scryfall. Press enter to exit.")
        print(" and done!", flush=True)
    else:
        print(f"Icon for the set {set_code} already exists - not going to retrieve from Scryfall again.", flush=True)
