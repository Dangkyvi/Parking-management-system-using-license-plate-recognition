import cv2
import onnxruntime as ort

from preprocess import (
preprocess_det
)
from postprocess import (
decode_detection,
nms
)

class PlateDetector:
    def __init__(
            self,
            model_path = "models/best_keypoint_plate_detection.onnx",
            input_size = 1024,
            conf_thres = 0.5,
            iou_thres = 0.5
    ):
        self.session = ort.InferenceSession(
            model_path,
            providers=['CPUExecutionProvider']
        )

        self.input_name = self.session.get_inputs()[0].name

        self.input_size = input_size
        self.conf_thres = conf_thres
        self.iou_thres = iou_thres

    def detect(self, img):
        (
            input_tensor,
            r,
            dw,
            dh,
            orig_w,
            orig_h
        ) = preprocess_det(img, self.input_size)
        outputs = self.session.run(
            None,
            {
                self.input_name: input_tensor
            }
        )

        boxes, scores, points_list = decode_detection(
            outputs,
            orig_w,
            orig_h,
            r,
            dw,
            dh,
            self.conf_thres
        )
        if len(boxes) == 0:
            print(" No plates detected")
            return []
        results = nms(
            boxes,
            scores,
            points_list,
            self.conf_thres,
            self.iou_thres
        )

        return results

detector = PlateDetector()

def detect_plate(img):

    return detector.detect(img)
