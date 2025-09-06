import os
from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
import numpy as np
import cv2
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

app = Flask(__name__)


UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

model_path = os.path.join('model', 'my_model.keras')
model = load_model(model_path)
CLASS_NAMES = ["glioma", "meningioma", "notumor", "pituitary"]

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(image_path):
    """Preprocess the image to match model input requirements"""
    # Read and resize image
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError("Could not read image")
    
   
    img = cv2.resize(img, (224, 224))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
   
    img = cv2.GaussianBlur(img, (5,5), 0)
    

    img = img.astype('float32') / 255.0
    img = np.expand_dims(img, axis=-1)  
    img = np.expand_dims(img, axis=0)   
    
    return img

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
       
        filename = secure_filename(file.filename)
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
           
            processed_img = preprocess_image(filepath)
            
            
            predictions = model.predict(processed_img)
            predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
            confidence = float(np.max(predictions[0]))
            
            
            if predicted_class == "notumor":
                result = "No Tumor Detected"
            else:
                result = f"{predicted_class.capitalize()} Tumor Detected"
            
            return jsonify({
                'prediction': result,
                'class': predicted_class,
                'confidence': confidence,
                'details': get_tumor_details(predicted_class)
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        
        finally:
        
            if os.path.exists(filepath):
                os.remove(filepath)
    
    return jsonify({'error': 'Invalid file type'}), 400

def get_tumor_details(tumor_class):
    """Return information about the detected tumor type"""
    details = {
        "glioma": {
            "description": "Glioma is a type of tumor that occurs in the brain and spinal cord.",
            "symptoms": ["Headaches", "Seizures", "Nausea", "Memory loss"],
            "treatment": ["Surgery", "Radiation therapy", "Chemotherapy"]
        },
        "meningioma": {
            "description": "Meningioma is a tumor that arises from the meninges.",
            "symptoms": ["Vision problems", "Hearing loss", "Seizures"],
            "treatment": ["Observation", "Surgery", "Radiation therapy"]
        },
        "pituitary": {
            "description": "Pituitary tumors are abnormal growths in the pituitary gland.",
            "symptoms": ["Headaches", "Vision loss", "Hormonal imbalances"],
            "treatment": ["Medication", "Surgery", "Radiation therapy"]
        },
        "notumor": {
            "description": "No tumor detected in the MRI scan.",
            "symptoms": [],
            "treatment": ["Regular checkups recommended"]
        }
    }
    return details.get(tumor_class, {})

if __name__ == '__main__':
    # For local development
    app.run(debug=True, host='0.0.0.0', port=5000)
else:
    # For production with gunicorn
    # Ensure uploads directory exists
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)