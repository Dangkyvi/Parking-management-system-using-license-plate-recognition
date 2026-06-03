import cv2
import numpy as np
import onnxruntime as ort

from preprocess import (
    preprocess_rec
)
from postprocess import (
    ctc_decode,
    clean_text
)

class PlateRecognizer:
    def __init__(
            self,
            model_path = "models/ppocr_rec.onnx"
    ):
        self.session = ort.InferenceSession(
            model_path,
            providers=["CPUExecutionProvider"]
        )

        self.input_name = self.session.get_inputs()[0].name

    def recognize(self, plate):

        input_tensor = preprocess_rec(plate)

        outputs = self.session.run(
            None,
            {self.input_name: input_tensor}
        )

        preds = outputs[0]

        preds = np.squeeze(preds, axis=0)

        text = ctc_decode(preds)

        text = clean_text(text)
        return text

recognizer = PlateRecognizer()

def recognize_text(plate):
    return recognizer.recognize(plate)
