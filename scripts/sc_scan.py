import scrython
import requests
import config
import imageio
import numpy as np
from numpy.fft import fft2, ifft2, fftshift, ifftshift
from skimage.transform import resize
import os
from pathlib import Path
import time


homedir = str(Path(os.path.dirname(os.path.realpath(__file__))).parent)


def process_scan(card, cardname):
    # Retrieve and process the art scan for this card.
    # Throw scryfall scan through waifu2x
    print("Throwing scryfall scan through waifu2x")
    print(card["image_uris"]["art_crop"])
    r = requests.post(
        "https://api.deepai.org/api/waifu2x",
        data={
            # 'image': card.image_uris()['art_crop'],
            'image': card["image_uris"]["art_crop"]
        },
        headers={'api-key': config.TOKEN}
    )
    try:
        output_url = r.json()['output_url']
        im = imageio.imread(output_url)
        return im
    except KeyError:
        return None


def search_sc(cardname, expansion=None):
    if expansion:
        query = cardname + " set=" + expansion
        card = scrython.cards.Search(q=query).data()[0]
        print("Processing: {}, set: {}".format(cardname, expansion))
    else:
        try:
            pipe_idx = cardname.index("|")
            query = cardname[0:pipe_idx] + " set=" + cardname[pipe_idx + 1:]
            card = scrython.cards.Search(q=query).data()[0]
            print("Processing: {}, set: {}".format(cardname[0:pipe_idx], cardname[pipe_idx + 1:]))
            cardname = cardname[0:pipe_idx]
        except (ValueError, scrython.foundation.ScryfallError):
            card = scrython.cards.Named(fuzzy=cardname).scryfallJson
            print("Processing: {}".format(cardname))
    
    # Handle case of transform card
        if card["layout"] == "transform" or card["layout"] == "modal_dfc":
            card_idx = [card["card_faces"][x]["name"] for x in range(0, 2)].index(cardname)
            card["image_uris"] = {}
            card["image_uris"]["art_crop"] = card["card_faces"][card_idx]["image_uris"]["art_crop"]
            card["name"] = card["card_faces"][card_idx]["name"]

    return card


if __name__ == "__main__":
    cardname = input("Card name (exact): ")
    try:
        # If the card specifies which set to retrieve the scan from, do that
        try:
            pipe_idx = cardname.index("|")
            query = cardname[0:pipe_idx] + " set=" + cardname[pipe_idx + 1:]
            card = scrython.cards.Search(q=query).data()[0]
            print("Processing: " + cardname[0:pipe_idx] + ", set: " + cardname[pipe_idx + 1:])
            cardname = cardname[0:pipe_idx]
        except (ValueError, scrython.foundation.ScryfallError):
            card = scrython.cards.Named(fuzzy=cardname).scryfallJson
            print("Processing: " + cardname)

        # Handle case of transform card
        if card["layout"] == "transform" or card["layout"] == "modal_dfc":
            card_idx = [card["card_faces"][x]["name"] for x in range(0, 2)].index(cardname)
            card["image_uris"] = {}
            card["image_uris"]["art_crop"] = card["card_faces"][card_idx]["image_uris"]["art_crop"]
            card["name"] = card["card_faces"][card_idx]["name"]

        # If the card is on Scryfall with that exact name:
        if card["name"] == cardname:
            im = process_scan(card, cardname)
            imageio.imwrite(homedir + "/art_raw/" + cardname + " (" + card["artist"] + ").jpg", im.astype(np.uint8))
        else:
            print("Couldn't find that card.")
    except Exception as e:
        print("Exception: " + str(e))
    input("Press enter to continue.")\
