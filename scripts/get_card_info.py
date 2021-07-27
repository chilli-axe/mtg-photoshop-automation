import time
import sys
import scrython
import json


def save_json(card_json):
    json_dump = json.dumps(card_json)
    with open(sys.path[0] + "/card.json", 'w') as f:
        json.dump(json_dump, f)


if __name__ == "__main__":

    cardname = sys.argv[1]
    # Use Scryfall to search for this card
    time.sleep(0.05)
    # If the card specifies which set to retrieve the scan from, do that
    try:
        pipe_idx = cardname.index("|")
        cardset = cardname[pipe_idx + 1:]
        cardname = cardname[0:pipe_idx]
        print("Searching Scryfall for: " + cardname + ", set: " + cardset)
        card = scrython.cards.Named(fuzzy=cardname, set=cardset)
        
    except (ValueError, scrython.foundation.ScryfallError):
        print("Searching Scryfall for: " + cardname)
        card = scrython.cards.Named(fuzzy=cardname)

    print("Saving JSON...")
    save_json(card.scryfallJson)
