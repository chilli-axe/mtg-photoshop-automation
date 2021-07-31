import time
import sys
import json
from urllib import request, parse, error


def save_json(card_json: bytes):
    json_dump = json.dumps(json.loads(card_json))
    with open(sys.path[0] + "/card.json", 'w') as f:
        json.dump(json_dump, f)


if __name__ == "__main__":
    card_name = sys.argv[1]
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

    print(" and done! Saving JSON...", end="", flush=True)
    save_json(card)
    print(" and done!", flush=True)
    time.sleep(0.1)
