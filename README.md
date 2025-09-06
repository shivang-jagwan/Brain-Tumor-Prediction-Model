---
title: Brain Tumor Detection
emoji: 🧠
colorFrom: blue
colorTo: red
sdk: docker
pinned: false
license: mit
---

# 🧠 Brain Tumor Detection System

An AI-powered web application that classifies brain MRI scans to detect different types of brain tumors using deep learning.

## 🎯 Features

- **Real-time MRI Analysis**: Upload brain MRI images for instant classification
- **4-Class Detection**: 
  - 🔴 **Glioma Tumor** - Brain/spinal cord tumors from glial cells
  - 🟡 **Meningioma Tumor** - Tumors from brain/spinal cord membranes
  - 🟢 **Pituitary Tumor** - Tumors in the pituitary gland
  - ⚪ **No Tumor** - Healthy brain scans
- **High Accuracy**: Custom CNN with Squeeze-and-Excitation blocks
- **Confidence Scoring**: Shows prediction confidence percentage
- **User-friendly Interface**: Clean, medical-grade web interface

## 🚀 How to Use

1. Click on **"Brain Tumor Detection"** tab in the navigation
2. Upload an MRI brain scan image (JPG, PNG, JPEG formats supported)
3. Click **"Predict"** button
4. View the classification results with confidence score and tumor information

## 🔬 Model Architecture

- **Input**: 224×224 grayscale MRI images
- **Architecture**: Custom CNN with residual connections and SE blocks
- **Framework**: TensorFlow/Keras
- **Preprocessing**: Gaussian blur, grayscale conversion, normalization
- **Output**: 4-class probability distribution

## 🛠️ Technical Stack

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **ML Framework**: TensorFlow/Keras
- **Image Processing**: OpenCV, PIL
- **Deployment**: Docker on Hugging Face Spaces

## ⚕️ Medical Disclaimer

**Important**: This tool is for educational and research purposes only. It should not be used as a substitute for professional medical diagnosis. Always consult with qualified healthcare professionals for medical decisions and diagnosis.

## 📊 Dataset Information

The model was trained on brain MRI images categorized into:
- Glioma tumors
- Meningioma tumors  
- Pituitary tumors
- No tumor (healthy)

## 🏥 About Brain Tumors

- **Glioma**: Most common type of brain tumor, originates from glial cells
- **Meningioma**: Usually benign tumors that arise from the meninges
- **Pituitary**: Tumors in the pituitary gland, can affect hormone production

---

*Developed for educational purposes in medical AI and computer vision.*