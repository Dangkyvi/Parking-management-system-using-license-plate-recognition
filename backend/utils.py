import cv2
import numpy as np

def draw_box(
        image,
        box,
        color = (0,255,0),
        thickness = 2
):
    x1, y1, x2, y2 = map(int, box)

    cv2.rectangle(image, (x1, y1), (x2, y2), color, thickness)

    return image

def draw_text(
        image,
        text,
        position,
        color = (0,255,0),
        scale = 0.8,
        thickness = 2
):
    cv2.putText(
        image,
        text,
        position,
        cv2.FONT_HERSHEY_SIMPLEX,
        scale,
        color,
        thickness,
    )
    return image

def draw_result(
        image,
        points,
        text
):
    points = points.astype(np.int32)

    points = points.reshape((-1, 1, 2))

    cv2.polylines(
        image,
        [points],
        True,
        (0,255,0),
        2
    )

    x, y = points[0][0]

    image = draw_text(
        image,
        text,
        (x, y - 10)
    )

    return image

def rgb_to_bgr(image):
    return cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

def bgr_to_rgb(image):
    return cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
