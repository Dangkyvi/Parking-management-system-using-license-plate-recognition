import cv2
import numpy as np
import re

with open("dict.txt","r") as f:
    character = [line.strip() for line in f.readlines()]

character = ["blank"] + character

def nms (
        boxes,
        scores,
        points_list,
        conf_thres ,
        iou_thres ,
):
    if len(boxes) == 0:
        return []

    indices = cv2.dnn.NMSBoxes(boxes, scores, conf_thres, iou_thres)

    results = []
    if len(indices) >0:
        for i in indices.flatten():
            results.append(
                points_list[i]
            )
    return results

def decode_detection(
        outputs,
        orig_w,
        orig_h,
        r,
        dw,
        dh,
        conf_thres
):

    predictions = np.squeeze(outputs[0])

    predictions = predictions.T

    boxes = []
    scores = []
    points_list = []

    for pred in predictions:

        conf = pred[4]

        if conf < conf_thres:
            continue


        x_center, y_center, w, h = pred[:4]

        x_center = (x_center - dw) / r
        y_center = (y_center - dh) / r

        w /= r
        h /= r

        x1 = int(x_center - w / 2)
        y1 = int(y_center - h / 2)

        x2 = int(x_center + w / 2)
        y2 = int(y_center + h / 2)

        bbox = [
            x1,
            y1,
            int(w),
            int(h)
        ]


        points = np.array([

            [pred[5], pred[6]],

            [pred[8], pred[9]],

            [pred[11], pred[12]],

            [pred[14], pred[15]]

        ], dtype=np.float32)

        points[:, 0] = (points[:, 0] - dw) / r
        points[:, 1] = (points[:, 1] - dh) / r

        points[:, 0] = np.clip(points[:, 0], 0, orig_w)
        points[:, 1] = np.clip(points[:, 1], 0, orig_h)

        boxes.append(bbox)

        scores.append(float(conf))

        points_list.append(points)

    return boxes, scores, points_list

def ctc_decode(preds):
    text = ""

    preds_idx = np.argmax(
        preds,
        axis = 1
    )

    prev_idx = -1
    for idx in preds_idx:
        if idx == 0:
            prev_idx = idx
            continue
        if idx == prev_idx:
            continue
        if idx >= len(character):
            continue

        text += character[idx]

        prev_idx = idx

    return text

def remove_special_chars(text):

    text = re.sub(r"[^a-zA-Z0-9]", " ", text)
    return text
def format_plate(text):

    text = text.replace(
        " ",
        ""
    )
    return text
def clean_text(text):
    text = text.upper()
    text = remove_special_chars(text)
    text = format_plate(text)

    return text