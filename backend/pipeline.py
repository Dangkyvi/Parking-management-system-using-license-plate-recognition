import cv2
import numpy as np


from detect import detect_plate
from recognizer import recognize_text

from preprocess import (
threshold_plate,
split_plate,
is_two_line_plate,
crop_plate,
deskew_plate
)

from postprocess import(
clean_text
)
from utils import (
    draw_result, bgr_to_rgb
)

def process_image(img):
    result_text = []

    boxes = detect_plate(img)

    if len(boxes) == 0:
        return img, "No plate detected"

    for i, points in enumerate(boxes):

        plate = crop_plate(
            img,
            points
        )

        if plate.size == 0:
            continue

        plate = deskew_plate(plate)

        if is_two_line_plate(plate):

            top, bottom = split_plate(plate)

            text_top = recognize_text(top)

            text_bottom = recognize_text(bottom)

            text = text_top + text_bottom

        else:

            text = recognize_text(plate)

        text = clean_text(text)

        result_text.append(text)

        img = draw_result(
            img,
            points,
            text
        )

    return img, result_text

