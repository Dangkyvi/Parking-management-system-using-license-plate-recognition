import cv2
import numpy as np
from utils import (
bgr_to_rgb
)
def letterbox(
        img,
        new_shape=(1024,1024),
        color = (114,114,114)
):
    shape = img.shape[:2]

    r = min(
        new_shape[0] / shape[0],
        new_shape[1] / shape[1]
    )
    new_unpad = (
        int(round(shape[1] * r)),
        int(round(shape[0] * r)),
    )

    dw = new_shape[1] - new_unpad[0]
    dh = new_shape[0] - new_unpad[1]

    dw /= 2
    dh /= 2

    if shape[::-1] != new_unpad:
        img = cv2.resize(img,new_unpad)

    top = int(round(dh - 0.1))
    bottom = int(round(dh + 0.1))

    left = int(round(dw - 0.1))
    right = int(round(dw + 0.1))

    img = cv2.copyMakeBorder(
        img,
        top,
        bottom,
        left,
        right,
        cv2.BORDER_CONSTANT,
        value=color
    )
    return img, r, dw,dh
def preprocess_det(
        image,
        input_size
):
    orig_h, orig_w = image.shape[:2]

    img, r,dw,dh = letterbox(
        image,
        new_shape=(input_size,input_size)
    )

    img = bgr_to_rgb(img)

    img = np.transpose(
        img,
        (2, 0, 1)
    )
    img = img.astype(np.float32)

    img = img / 255.0

    img = np.expand_dims(
        img,
        axis=0
    )
    return img, r, dw, dh, orig_w,orig_h

def crop_plate(image, points):

    points = points.astype(np.float32)


    tl, tr, br, bl = points


    width_top = np.linalg.norm(tr - tl)
    width_bottom = np.linalg.norm(br - bl)

    max_width = int(max(width_top, width_bottom))


    height_left = np.linalg.norm(bl - tl)
    height_right = np.linalg.norm(br - tr)

    max_height = int(max(height_left, height_right))
    padding_w = int(max_width * 0.005)
    padding_h = int(max_height * 0.005)
    dst = np.array([
        [padding_w, padding_h],
        [max_width + padding_w - 1, padding_h],
        [max_width + padding_w - 1, max_height + padding_h - 1],
        [padding_w, max_height + padding_h - 1]
    ], dtype=np.float32)
    plate_w = max_width + padding_w * 2
    plate_h = max_height + padding_h * 2
    matrix = cv2.getPerspectiveTransform(
        points,
        dst
    )

    plate = cv2.warpPerspective(
        image,
        matrix,
        (plate_w, plate_h)
    )

    return plate

def deskew_plate(plate):

    gray = cv2.cvtColor(plate, cv2.COLOR_BGR2GRAY)

    blur = cv2.GaussianBlur(gray, (3,3), 0)

    edges = cv2.Canny(blur, 50, 150)

    lines = cv2.HoughLinesP(
        edges,
        1,
        np.pi / 180,
        threshold=50,
        minLineLength=50,
        maxLineGap=10
    )

    if lines is None:
        return plate

    angles = []

    for line in lines:

        x1, y1, x2, y2 = line[0]

        angle = np.degrees(
            np.arctan2(y2 - y1, x2 - x1)
        )


        if -30 < angle < 30:
            angles.append(angle)

    if len(angles) == 0:
        return plate

    median_angle = np.median(angles)

    if abs(median_angle) < 2:
        return plate

    (h, w) = plate.shape[:2]

    center = (w // 2, h // 2)

    M = cv2.getRotationMatrix2D(
        center,
        median_angle,
        1.0
    )

    rotated = cv2.warpAffine(
        plate,
        M,
        (w, h),
        flags=cv2.INTER_CUBIC,
        borderMode=cv2.BORDER_REPLICATE
    )

    return rotated

def threshold_plate(plate):
    gray = cv2.cvtColor(plate, cv2.COLOR_BGR2GRAY)

    thresh = cv2.adaptiveThreshold(
        gray,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        11,
        2
    )
    return thresh

def preprocess_rec(
        plate,
        size=(320,48)
):
    plate = cv2.resize(
        plate,
        size
    )

    if len(plate.shape) == 2:
        plate = cv2.cvtColor(
            plate,
            cv2.COLOR_GRAY2BGR
        )

    plate = plate.astype(np.float32)
    plate = plate / 255.0

    plate = np.transpose(
        plate,
        (2,0,1)
    )

    plate = np.expand_dims(
        plate,
        axis=0
    )

    return plate
def is_two_line_plate(plate):

    h, w = plate.shape[:2]
    ratio = h / w

    return ratio > 0.4

def split_plate(plate):

    h = plate.shape[0]
    mid = h // 2

    top = plate[:mid ,:]

    bottom = plate[mid:,:]

    return top, bottom
