import time
import sys
import scrython
import json
import requests


def get_dict(card):
    # As per Scryfall documentation, insert a delay between each request
    time.sleep(0.01)

    print("Found information for: " + card.name())
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
    flavourText = flavourText.replace("\"—", "\"\n—")
    # TODO: Make this more robust. This still sometimes misses and hecks up the formatting on cards.

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
        "colourIdentity": card.color_identity(),
        "artist": card.artist()
    }
    return card_json


def get_dict_tf(card, cardfull):
    # As per Scryfall documentation, insert a delay between each request
    time.sleep(0.01)

    print("Found information for: " + card["name"])
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
        "rarity": cardfull.rarity(),
        "manaCost": card["mana_cost"],
        "type": card["type_line"],
        "text": card["oracle_text"],
        "flavourText": flavourText,
        "power": power,
        "toughness": toughness,
        "layout": "transform",
        "colourIdentity": card["colors"],
        "frame_effect": cardfull.scryfallJson['frame_effects'][0],
        "artist": cardfull.artist()
    }
    print(card_json)
    return card_json


def get_dict_pw(card):
    # As per Scryfall documentation, insert a delay between each request
    time.sleep(0.01)

    print("Found information for: " + card.name())

    # Split the card text into abilities
    abilities = card.oracle_text().splitlines()

    card_json = {
        "name": card.name(),
        "rarity": card.rarity(),
        "manaCost": card.mana_cost(),
        "type": card.type_line(),
        "text": card.oracle_text(),
        "loyalty": card.loyalty(),
        "layout": "planeswalker",
        "colourIdentity": card.color_identity(),
        "artist": card.artist()
    }

    img_data = requests.get(card.image_uris()['large']).content
    with open(sys.path[0] + '/card.jpg', 'wb') as handler:
        handler.write(img_data)
    return card_json


def save_json(card_json):
    json_dump = json.dumps(card_json)
    print(card_json)
    with open(sys.path[0] + "/card.json", 'w') as f:
        json.dump(json_dump, f)


if __name__ == "__main__":

    cardname = sys.argv[1]
    print("Asking Scryfall for information for: " + cardname)
    # Use Scryfall to search for this card
    time.sleep(0.05)
    card = scrython.cards.Named(fuzzy=cardname)

    if card.layout() == "transform":
        if card.card_faces()[0]["name"] == cardname:
            # front face
            card_json = get_dict_tf(card.card_faces()[0], card)
            try:
                power = card.card_faces()[1]["power"]
                toughness = card.card_faces()[1]["toughness"]
                card_json["back_power"] = power
                card_json["back_toughness"] = toughness
            except KeyError:
                pass
            card_json["face"] = "front"
            save_json(card_json)
        elif card.card_faces()[1]["name"] == cardname:
            # back face
            card_json = get_dict_tf(card.card_faces()[1], card)
            card_json["face"] = "back"
            try:
                card_json["color_indicator"] = card.card_faces()[1]["color_indicator"]
            except KeyError:
                card_json["color_indicator"] = None

            save_json(card_json)

    elif "Planeswalker" in card.type_line():
        # planeswalker
        save_json(get_dict_pw(card))

    elif card.layout() == "normal" or card.layout() == "planar":
        # normal or planar card
        card_json = get_dict(card)
        save_json(card_json)

        if card.layout() == "planar":
            img_data = requests.get(card.image_uris()['large']).content
            with open(sys.path[0] + '/card.jpg', 'wb') as handler:
                handler.write(img_data)

    elif card.layout() == "meld":
        card_json = get_dict(card)
        card_json["frame_effect"] = "mooneldrazidfc"
        card_json["layout"] = "transform"
        if "meld them" in card_json["text"] or "Melds with" in card_json["text"]:
            card_json["face"] = "front"
            # get the power and toughness of the backside
            meldbackidx = [card.all_parts()[x]["component"] for x in range(0, len(card.all_parts()))].index("meld_result")
            meldbackname = card.all_parts()[meldbackidx]["name"]
            meldback = scrython.cards.Named(fuzzy=meldbackname)

            # assume meld cards flip into creatures
            power = meldback.power()
            toughness = meldback.toughness()
            card_json["back_power"] = power
            card_json["back_toughness"] = toughness
        else:
            card_json["face"] = "back"
            card_json["colourIdentity"] = card.colors()
        save_json(card_json)

    else:
        print("Unsupported")
    # TODO: Add more card types. Meld? Sagas?
