import cv2
from deepface import DeepFace

img = cv2.imread("./uploads/image.jpg")
result = DeepFace.analyze(img, actions = ['emotion'])

query = str(max(zip(result[0]['emotion'].values(),
                    result[0]['emotion'].keys()))[1])
print(query)

