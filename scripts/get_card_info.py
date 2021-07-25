import time
import sys
import scrython
import json
import requests
import re


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

    # Handle missing frame effect for MDFCs
    try:
        frame_effect = cardfull.scryfallJson['frame_effects'][0]
    except KeyError:
        frame_effect = ""

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
        "layout": cardfull.layout(),
        "colourIdentity": card["colors"],
        "frame_effect": frame_effect,
        "artist": cardfull.artist()
    }
    return card_json


def get_dict_pw(card):
    # As per Scryfall documentation, insert a delay between each request
    time.sleep(0.01)

    print("Found information for: " + card.name())

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


def get_dict_adventure(card):
    print("Found information for: " + card.name())
    # Handle missing power/toughness (which should never happen but fuck it i guess)
    try:
        power = card.power()
        toughness = card.toughness()
    except KeyError:
        power = None
        toughness = None

    # Handle missing flavour text
    try:
        flavourText = card.card_faces()[0]["flavor_text"]
    except KeyError:
        flavourText = ""

    # Account for Scryfall sometimes not inserting a new line for flavour text that quotes someone
    flavourText = flavourText.replace("\" —", "\"\n—")

    card_json = {
        "name": card.card_faces()[0]["name"],
        "name_adventure": card.card_faces()[1]["name"],
        "rarity": card.rarity(),
        "manaCost": card.card_faces()[0]["mana_cost"],
        "manaCost_adventure": card.card_faces()[1]["mana_cost"],
        "type": card.card_faces()[0]["type_line"],
        "type_adventure": card.card_faces()[1]["type_line"],
        "text": card.card_faces()[0]["oracle_text"],
        "text_adventure": card.card_faces()[1]["oracle_text"],
        "flavourText": flavourText,
        "power": power,
        "toughness": toughness,
        "layout": card.layout(),
        "artist": card.artist()
    }
    return card_json


def save_json(card_json):
    json_dump = json.dumps(card_json)
    print(card_json)
    with open(sys.path[0] + "/card.json", 'w') as f:
        json.dump(json_dump, f)


if __name__ == "__main__":

    cardname = sys.argv[1]
    # Use Scryfall to search for this card
    time.sleep(0.05)
    # card = scrython.cards.Named(fuzzy=cardname)
    # If the card specifies which set to retrieve the scan from, do that
    card_json = ""
    try:
        pipe_idx = cardname.index("$")
        cardset = cardname[pipe_idx + 1:]
        cardname = cardname[0:pipe_idx]
        print("Searching Scryfall for: " + cardname + ", set: " + cardset)
        card = scrython.cards.Named(fuzzy=cardname, set=cardset)
        
    except (ValueError, scrython.foundation.ScryfallError):
        print("Searching Scryfall for: " + cardname)
        card = scrython.cards.Named(fuzzy=cardname) # .scryfallJson

    if card.layout() == "transform":
        if card.card_faces()[0]["name"].lower() == cardname.lower():
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
        elif card.card_faces()[1]["name"].lower() == cardname.lower():
            # back face
            card_json = get_dict_tf(card.card_faces()[1], card)
            card_json["face"] = "back"
            try:
                card_json["color_indicator"] = card.card_faces()[1]["color_indicator"]
            except KeyError:
                card_json["color_indicator"] = None

    elif card.layout() == "modal_dfc":
        # print("recognised as mdfc {} {}".format(cardname, card.card_faces()[0]["name"]))
        back_idx = -1
        if card.card_faces()[0]["name"].lower() == cardname.lower():
            # front face
            card_json = get_dict_tf(card.card_faces()[0], card)
            back_idx = 1
            card_json["face"] = "front"
            # save_json(card_json)
        elif card.card_faces()[1]["name"].lower() == cardname.lower():
            # back face
            card_json = get_dict_tf(card.card_faces()[1], card)
            card_json["face"] = "back"
            back_idx = 0

            # if the other face is a land, get that face's rules text, split it on lines, pick the line that begins with "{T}", and save that to json
            # otherwise, get the other face's mana cost and save that to the same field in the json
            # then, take the other face's typeline, split it on spaces, and save the last type to json

        if back_idx >= 0:
            # didn't fail to identify which face of the card we're looking at - do other stuff
            back_card = card.card_faces()[back_idx]
            back_type = back_card["type_line"]

            card_json["back"] = {}

            # take these things from the back face and store them too (for framelogic)
            card_json["back"]["type"] = back_card["type_line"]
            card_json["back"]["manaCost"] = back_card["mana_cost"]
            card_json["back"]["text"] = back_card["oracle_text"]

            # attach left bit - last type in typeline
            card_json["back"]["type_short"] = back_type.split(" ")[-1]

            # attach right bit - either the card's mana cost if it's nonland, or what colour of mana it taps for if it's land
            if back_type == "Land":
                # need to stick the "{T}: add {whatever}" into json
                back_oracle = back_card["oracle_text"].split("\n")
                if len(back_oracle) > 1:
                    # look through lines in result, check for which one begins with {T}
                    for x in back_oracle:
                        if x.startswith(r"{T}"):
                            # attach this line
                            card_json["back"]["info_short"] = x
                else:
                    # just attach straight to json bc there's no point iterating over and looking for which line is the tap add mana one
                    card_json["back"]["info_short"] = back_oracle[0]
            else:
                # need to stick the mana cost into json
                card_json["back"]["info_short"] = back_card["mana_cost"]

    elif card.layout() == "adventure":
        card_json = get_dict_adventure(card)

    elif "Planeswalker" in card.type_line():
        # planeswalker
        card_json = get_dict_pw(card)

    elif card.layout() == "normal" or card.layout() == "planar":
        # normal or planar card
        card_json = get_dict(card)

        # check to see if miracle card
        try:
            if card.scryfallJson['frame_effects'][0] == "miracle":
                card_json["layout"] = "miracle"
        except KeyError:
            pass

        if card.layout() == "planar":
            img_data = requests.get(card.image_uris()['large']).content
            with open(sys.path[0] + '/card.jpg', 'wb') as handler:
                handler.write(img_data)
        elif card.oracle_text()[0:7] == "Mutate ":
            # mutate card - save the mutate text separately and pull apart the rules text
            rules_split = card.oracle_text().split("\n", 1)
            card_json["mutate"] = rules_split[0]
            card_json["text"] = rules_split[1]
            card_json["layout"] = "mutate"
        elif "Snow" in card.type_line():
            card_json["layout"] = "snow"

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

    else:
        print("Unsupported: {}".format(card.layout()))

    if card_json:
        # remove reminder text from secret lair cards
        if card.set_code() == "sld":
            while True:
                card_text_split = card_json['text'].split("(")
                if len(card_text_split) == 1:
                    break
                else:
                    card_json["text"] = card_text_split[0] + card_text_split[1].split(")")[1]
        save_json(card_json)
    else:
        print("Didn't save any results")
    # TODO: Add more card types. Sagas? Kamigawa flip cards?
