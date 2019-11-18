import scrython
import requests
import config
import imageio
import numpy as np
from numpy.fft import fft2, ifft2, fftshift, ifftshift
from skimage.transform import resize


def process_scan(card, cardname):
    # Retrieve and process the art scan for this card.
    # Throw scryfall scan through waifu2x
    print("Throwing scryfall scan through waifu2x")
    r = requests.post(
        "https://api.deepai.org/api/waifu2x",
        data={
            'image': card.image_uris()['art_crop'],
        },
        headers={'api-key': config.TOKEN}
    )
    output_url = r.json()['output_url']
    im = imageio.imread(output_url)

    # Read in filter image
    print("Successfully upscaled image. Filtering...")
    filterimage = np.copy(imageio.imread("./filter.png"))

    # Resize filter to shape of input image
    filterimage = resize(filterimage, [im.shape[0], im.shape[1]], anti_aliasing=True, mode="edge")

    # Initialise arrays
    im_filtered = np.zeros(im.shape, dtype=np.complex_)
    im_recon = np.zeros(im.shape, dtype=np.float_)

    # Apply filter to each RGB channel individually
    for i in range(0, 3):
        im_filtered[:, :, i] = np.multiply(fftshift(fft2(im[:, :, i])), filterimage)
        im_recon[:, :, i] = ifft2(ifftshift(im_filtered[:, :, i])).real

    # Scale between 0 and 255 for uint8
    minval = np.min(im_recon)
    maxval = np.max(im_recon)
    im_recon_sc = 255*((im_recon - minval)/(maxval - minval))

    # Write image to disk, casting to uint8
    imageio.imwrite("../art_raw/" + cardname + " (" + card.artist() + ").jpg", im_recon_sc.astype(np.uint8))
    print("Successfully processed scan for {}.".format(cardname))


if __name__ == "__main__":
    cardname = input("Card name (exact): ")
    try:
        card = scrython.cards.Named(fuzzy=cardname)
        # If the card is on Scryfall with that exact name:
        if card.name() == cardname:
            process_scan(card, cardname)
        else:
            print("Couldn't find that card.")
    except Exception as e:
        print(e)
    input("Press enter to continue.")
