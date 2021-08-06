import time
import sys
from urllib import request, error

if __name__ == "__main__":
    image_url = sys.argv[1]
    try:
        print(f"Retrieving Scryfall scan at URL: {image_url}...", end="", flush=True)
        request.urlretrieve(image_url, sys.path[0] + "/card.jpg")
    except error.HTTPError:
        input("\nError occurred while attempting to retrieve image. Press enter to exit.")
    print(" and done!", flush=True)
    time.sleep(0.1)
