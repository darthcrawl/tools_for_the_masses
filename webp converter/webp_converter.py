from PIL import Image
import os

# Created by Gokstad.us
directory = os.path.dirname(os.path.realpath(__file__))

for filename in os.listdir(directory):
    if filename.endswith('.webp'):
        with Image.open(os.path.join(directory, filename)) as img:
            jpg_filename = filename[:-5] + '.jpg'g
            img.convert('RGB').save(os.path.join(directory, jpg_filename), 'JPEG')

print("Conversion completed.")
