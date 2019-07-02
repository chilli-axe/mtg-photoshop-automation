import time
import os
import sys
import scrython
import json

# print("Argument list: " + str(sys.argv))
# print("Card name: " + " ".join(sys.argv[1:]) + ",")
# print(sys.argv[1:])

# cardname = " ".join(sys.argv[1:])
cardname = sys.argv[1]
print("Asking Scryfall for information for: " + cardname)
# Use Scryfall to search for this card
time.sleep(0.05)
card = scrython.cards.Named(fuzzy=cardname)
# If the card is on Scryfall with that exact name:
if card.name() == cardname:
    # As per Scryfall documentation, insert a delay between each request

    print("Found information for: " + card.name())

    # art_url = card.image_uris(image_type='art_crop')

    # Define a json object to store the relevant information

    # Did you know that scrython is dumb and will throw an exception
    # at you if the card doesn't have a power/toughness or flavour text,
    # instead of just having the field be empty?
    # Handle missing power/toughness
    try:
        power = card.power()
        toughness = card.toughness()
    except KeyError:
        power = None
        toughness = None

    # Handle missing flavour text
    try:
        flavourText = card.flavor_text()
    except KeyError:
        flavourText = ""

    print(card.prints_search_uri())

    card_json = {
        "name": card.name(),
        "rarity": card.rarity(),
        "manaCost": card.mana_cost(),
        "type": card.type_line(),
        "text": card.oracle_text(),
        "flavourText": flavourText,
        "power": power,
        "toughness": toughness,
        "layout": card.layout(),
        "colourIdentity": card.color_identity()
    }

    print(card_json)

    json_dump = json.dumps(card_json)
    with open("card.json", 'w') as f:
        json.dump(json_dump, f)
