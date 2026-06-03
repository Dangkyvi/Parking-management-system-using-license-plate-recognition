import onnxruntime as ort

session = ort.InferenceSession("models/best_keypoint_plate_detection.onnx")

print("Model loaded!")
input_info = session.get_inputs()[0]

print(input_info.shape)