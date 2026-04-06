# X-Ray Analyzer AI System

An AI-powered medical imaging system that analyzes chest X-ray images to detect lung diseases and provides explainable results using deep learning.


# Overview

The X-Ray Analyzer is a full-stack AI application that:

* Accepts chest X-ray image uploads
* Uses a deep learning model to classify diseases
* Generates Grad-CAM heatmaps for explainability
* Stores and displays diagnostic reports


# Diseases Detected

* Pneumonia
* COVID-19
* Tuberculosis
* Normal

---

# Architecture

Frontend → React
Backend → Spring Boot
AI Engine → Python (Deep Learning Model)


User → React UI → Spring Boot API → Python AI Model → Prediction + Heatmap → UI Display


# Tech Stack

# Frontend

* React (Vite)
* Tailwind / CSS
* Axios / Fetch API

# Backend

* Spring Boot
* REST APIs
* JPA / Hibernate
* SQL Server / MySQL

# AI Service

* Python
* PyTorch / TensorFlow
* OpenCV
* Grad-CAM


# Key Features

*  Deep Learning-based disease classification
*  Explainable AI using Grad-CAM
*  Confidence score output
*  Report storage and retrieval
*  Full-stack integration (React + Spring Boot + Python)


Configure in `application.properties`:

spring.datasource.url=YOUR_DB_URL
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD


# Output Example

* Prediction: Pneumonia
* Confidence: 92%
* Heatmap: Highlighted infected lung regions


# Real-World Impact

* Assists doctors in diagnosis
* Useful in low-resource healthcare settings
* Provides explainable AI decisions
* Helps in faster screening during pandemics


# Future Improvements

* PDF report generation
* Multi-image batch processing
* Cloud deployment (AWS / Azure)
* Model accuracy improvements


# Author

**Avinash Shankar**
**Githinkumaran G**

