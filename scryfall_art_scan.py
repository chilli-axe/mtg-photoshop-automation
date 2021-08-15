import time
import json
from urllib import request, parse, error
from scripts import config
import requests
from os import path


def process_scan(card_name, artist, image_url):
    # todo: rewrite to only rely on urllib
    r = requests.post(
        "https://api.deepai.org/api/waifu2x",
        data={'image': image_url},
        headers={'api-key': config.TOKEN}
    )
    try:
        output_url = r.json()['output_url']
        request.urlretrieve(
            output_url, path.join(path.dirname(path.realpath(__file__)), "art", f"{card_name} ({artist}).jpg")
        )
    except KeyError:
        raise Exception("whoops")


def get_card_art_url(card_name, card_json) -> str:
    if "card_faces" in card_json.keys():
        for i in range(0, 2):
            if card_json["card_faces"]["name"] == card_name:
                return card_json["card_faces"][i]["image_uris"]["art_crop"]
    else:
        return card_json["image_uris"]["art_crop"]


if __name__ == "__main__":
    card_name = input("Card name (exact): ")
    # Use Scryfall to search for this card
    card = None

    # If the card specifies which set to retrieve the scan from, do that
    try:
        pipe_idx = card_name.index("$")
        card_set = card_name[pipe_idx + 1:]
        card_name = card_name[0:pipe_idx]
        print(f"Searching Scryfall for: {card_name}, set: {card_set}...", end="", flush=True)
        card = request.urlopen(
            f"https://api.scryfall.com/cards/named?fuzzy={parse.quote(card_name)}&set={parse.quote(card_set)}"
        ).read()

    except ValueError:
        print(f"Searching Scryfall for: {card_name}...", end="", flush=True)
        card = request.urlopen(
            f"https://api.scryfall.com/cards/named?fuzzy={parse.quote(card_name)}"
        ).read()
    except error.HTTPError:
        input("\nError occurred while attempting to query Scryfall. Press enter to exit.")

    print(" and done! Waifu2x'ing...", end="", flush=True)

    card_json = json.loads(card)
    image_url = get_card_art_url(card_name, card_json)
    process_scan(card_name, card_json["artist"], image_url)
    print(" and done!", flush=True)
    time.sleep(0.1)
