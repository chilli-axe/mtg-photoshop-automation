import time
import os
import sys
import scrython
import json
import requests

# print("Argument list: " + str(sys.argv))
# print("Card name: " + " ".join(sys.argv[1:]) + ",")
# print(sys.argv[1:])

# cardname = " ".join(sys.argv[1:])

# If the card is on Scryfall with that exact name:
#print(card.name())
#print(card.card_faces()[0]["name"])
#print(card.scryfallJson)


def get_dict(card):
    # As per Scryfall documentation, insert a delay between each request
    time.sleep(0.01)

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

    # Account for Scryfall sometimes not inserting a new line for flavour text that quotes someone
    flavourText = flavourText.replace("\" —", "\"\n—")

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
    return card_json


def get_dict_tf(card, rarity):
    # As per Scryfall documentation, insert a delay between each request
    time.sleep(0.01)

    print("Found information for: " + card["name"])

    # art_url = card.image_uris(image_type='art_crop')

    # Define a json object to store the relevant information

    # Did you know that scrython is dumb and will throw an exception
    # at you if the card doesn't have a power/toughness or flavour text,
    # instead of just having the field be empty?
    # Handle missing power/toughness
    try:
        power = card["power"]
        toughness = card["toughness"]
    except KeyError:
        power = None
        toughness = None

    # Handle missing flavour text
    try:
        flavourText = card["flavor_text"]
    except KeyError:
        flavourText = ""

    # Account for Scryfall sometimes not inserting a new line for flavour text that quotes someone
    flavourText = flavourText.replace("\" —", "\"\n—")

    card_json = {
        "name": card["name"],
        "rarity": rarity,
        "manaCost": card["mana_cost"],
        "type": card["type_line"],
        "text": card["oracle_text"],
        "flavourText": flavourText,
        "power": power,
        "toughness": toughness,
        "layout": "transform",
        "colourIdentity": card["colors"]
    }
    print(card_json)
    return card_json


def get_dict_pw(card):
    # As per Scryfall documentation, insert a delay between each request
    time.sleep(0.01)

    print("Found information for: " + card.name())

    # art_url = card.image_uris(image_type='art_crop')

    # Define a json object to store the relevant information

    # Split the card text into abilities
    abilities = card.oracle_text().splitlines()
    print(abilities)

    card_json = {
        "name": card.name(),
        "rarity": card.rarity(),
        "manaCost": card.mana_cost(),
        "type": card.type_line(),
        "text": card.oracle_text(),
        "loyalty": card.loyalty(),
        "layout": "planeswalker",
        "colourIdentity": card.color_identity()
    }

    print(card.image_uris()['large'])

    img_data = requests.get(card.image_uris()['large']).content
    with open('card.jpg', 'wb') as handler:
        handler.write(img_data)

    print(card_json)
    return card_json


def save_json(card_json):
    json_dump = json.dumps(card_json)
    with open("card.json", 'w') as f:
        json.dump(json_dump, f)


if __name__ == "__main__":

    cardname = sys.argv[1]
    print("Asking Scryfall for information for: " + cardname)
    # Use Scryfall to search for this card
    time.sleep(0.05)
    card = scrython.cards.Named(fuzzy=cardname)

    if "Planeswalker" in card.type_line():
        print("Planeswalker")

        save_json(get_dict_pw(card))

    elif card.layout() == "normal":
        card_json = get_dict(card)
        save_json(card_json)
    elif card.layout() == "transform":
        print(card.card_faces()[1])
        print("Double faced")
        print(card.card_faces()[1]["name"] == cardname)


        if card.card_faces()[0]["name"] == cardname:
            # front face
            print(card.card_faces()[0])
            card_json = get_dict_tf(card.card_faces()[0], card.rarity())
            try:
                power = card.card_faces()[1]["power"]
                toughness = card.card_faces()[1]["toughness"]
                card_json["back_power"] = power
                card_json["back_toughness"] = toughness
            except KeyError:
                print("Back is not a creature")
            card_json["face"] = "front"
            save_json(card_json)
            # if card.card_faces()[0]
        elif card.card_faces()[1]["name"] == cardname:
            # back face
            print(card.card_faces()[1])
            card_json = get_dict_tf(card.card_faces()[1], card.rarity())
            card_json["face"] = "back"
            card_json["color_indicator"] = card.card_faces()[1]["color_indicator"]
            save_json(card_json)
            # back face
    else:
        print("Unsupported")
