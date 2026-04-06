import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import numpy as np
import cv2
import base64
import io

# Disease classes
CLASSES = ['Normal', 'Pneumonia', 'COVID-19', 'Tuberculosis']

# Load pretrained ResNet50
def load_model():
    model = models.resnet50(pretrained=True)
    model.fc = nn.Linear(model.fc.in_features, len(CLASSES))
    model.eval()
    return model

MODEL = load_model()

# Image preprocessing
TRANSFORM = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

def predict(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    tensor = TRANSFORM(image).unsqueeze(0)
    
    with torch.no_grad():
        outputs = MODEL(tensor)
        probabilities = torch.softmax(outputs, dim=1)[0]
        predicted_class = torch.argmax(probabilities).item()
        confidence = probabilities[predicted_class].item()
    
    results = {
        CLASSES[i]: round(probabilities[i].item() * 100, 2)
        for i in range(len(CLASSES))
    }
    
    return {
        "prediction": CLASSES[predicted_class],
        "confidence": round(confidence * 100, 2),
        "probabilities": results
    }