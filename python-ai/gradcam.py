import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
import numpy as np
import cv2
import base64
import io
from model import MODEL, TRANSFORM

def generate_gradcam(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    original = np.array(image.resize((224, 224)))
    tensor = TRANSFORM(image).unsqueeze(0)
    tensor.requires_grad_(True)

    # Hook to capture gradients
    gradients = []
    activations = []

    def backward_hook(module, grad_input, grad_output):
        gradients.append(grad_output[0])

    def forward_hook(module, input, output):
        activations.append(output)

    # Register hooks on last conv layer
    target_layer = MODEL.layer4[-1].conv3
    forward_handle = target_layer.register_forward_hook(forward_hook)
    backward_handle = target_layer.register_backward_hook(backward_hook)

    # Forward pass
    output = MODEL(tensor)
    pred_class = output.argmax(dim=1).item()

    # Backward pass
    MODEL.zero_grad()
    output[0, pred_class].backward()

    # Remove hooks
    forward_handle.remove()
    backward_handle.remove()

    # Generate heatmap
    gradient = gradients[0].detach().numpy()[0]
    activation = activations[0].detach().numpy()[0]

    weights = np.mean(gradient, axis=(1, 2))
    cam = np.zeros(activation.shape[1:], dtype=np.float32)

    for i, w in enumerate(weights):
        cam += w * activation[i]

    cam = np.maximum(cam, 0)
    cam = cv2.resize(cam, (224, 224))
    cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)

    # Overlay heatmap on original image
    heatmap = cv2.applyColorMap(
        np.uint8(255 * cam), cv2.COLORMAP_JET
    )
    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)
    overlay = cv2.addWeighted(original, 0.6, heatmap, 0.4, 0)

    # Convert to base64
    pil_img = Image.fromarray(overlay)
    buffer = io.BytesIO()
    pil_img.save(buffer, format='PNG')
    encoded = base64.b64encode(buffer.getvalue()).decode('utf-8')

    return encoded