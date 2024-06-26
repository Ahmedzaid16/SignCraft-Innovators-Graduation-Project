Your README looks great! Here is the complete version with the changes incorporated:

---

# SignCraft Innovators Graduation Project  
![image](https://github.com/Ahmedzaid16/Graduation-Project/assets/84353686/f40d909b-a3a3-4280-8df4-8b18cf03b1bc)  

## Project Team
- Ahmed Mohamed Ahmed Esmail
- Ahmed Mohamed Shaban Abas
- Eslam Hamdy Ragab Abd Allah
- Abdul-Rhman Rashwan Elsaid
- Omar Ashraf Abd El-Qader Hegab
- Ghaidaa Hisham Abd El-Monem Abd El-Aziz
- Sherif Alaa Abd El-Monem Mohamed
- Mustafa Khaled Abdo Mohamed

Under the supervision of Dr. Rasha Orban and Eng: Doaa Mohamed

## Problem Statement 
1. Sign language translation systems lack accuracy.
2. The integration of computer vision, machine learning, and NLP poses complex challenges.
3. The scarcity of annotated sign language datasets in Arabic adds an additional layer of difficulty to training.
4. The need for a comprehensive solution that seamlessly combines these technologies to bridge the communication gap between the DHH community and the hearing population.

## System Introduction
Our goal is to make communication easy between those with hearing impairments using sign language and those who don't. The goal is to bridge communication gaps in places like schools, workplaces, and social settings.

## Target Users
1. **Deaf Users:**  
   - Enable deaf users to communicate easily with non-sign speakers by translating sign language to text.
2. **Normal Users:**  
   - Enable normal users to translate from text or voice to sign language to communicate with deaf users.
   - Offer educational material for users to learn sign language.

## Features
- Real-time translation of sign language gestures to text and spoken language.
- Intuitive user interface designed for both sign language users and non-sign language users.
- Customizable settings to cater to individual preferences.
- Camera integration for capturing and interpreting sign language gestures.
- High accuracy and low latency to ensure effective and natural communication.

## Dataset
The project uses the **ArabicSL-Net** dataset for training the machine learning models to recognize and interpret sign language gestures.

## Modeling

### OpenHands Sign Language Recognition
OpenHands is an open-source software toolkit designed to facilitate research in Sign Language Recognition (SLR), particularly focusing on pose-based recognition techniques. It aims to democratize SLR research by providing accessible tools and resources, fostering collaboration, and establishing standardized methods within the field.

**Key functionalities of OpenHands include:**
- **Pose-Based SLR Framework:** Enables researchers to leverage existing hand pose estimation methods (e.g., MediaPipe) to represent signs for real-time processing capabilities.
- **Standardized Datasets:** Offers carefully curated datasets for six sign languages (American, Argentinian, Chinese, Greek, Indian, and Turkish). These datasets contribute to consistency and comparability across research efforts.
- **Pre-trained Models:** Provides baseline pre-trained models for pose-based SLR on the aforementioned sign languages. Researchers can utilize these models as a foundation for further development and experimentation.
- **Self-supervised Pretraining Techniques:** Introduces methods for training models on unlabeled data. This addresses the challenge of limited availability of labeled sign language data, a common bottleneck in SLR research.

**Experimental Setup in OpenHands:**
The OpenHands project employs an experimental setup that evaluates four deep learning models for sign language recognition: Long Short-Term Memory (LSTM), Bidirectional Encoder Representations from Transformers (BERT), Spatial-Temporal Graph Convolutional Network (ST-GCN), and Sign Language Graph Convolutional Network (SL-GCN). Their approach leverages PyTorch Lightning for streamlined data processing and training pipelines. All models are optimized using the Adam optimizer.

**Model Training Parameters in OpenHands:**
- **LSTM:** Batch size: 32, Initial learning rate: 0.005
- **BERT:** Batch size: 64, Initial learning rate: 0.0001
- **ST-GCN & SL-GCN:** Batch size: 32, Initial learning rate: 0.001

**Hardware and Training Data Usage in OpenHands:**
OpenHands utilizes a single NVIDIA Tesla V100 GPU for training. Notably, they train exclusively on the provided training sets for each dataset.

### Text Processing with Octopus
We utilize the Octopus library, which provides a variety of natural language processing (NLP) capabilities. The main tasks supported include:
- **Text Diacritization:** Adding diacritical marks to Arabic text.
- **Grammatical Correction:** Identifying and correcting grammatical errors.
- **Title Generation:** Generating titles for given text.
- **Paraphrasing:** Rewriting text in a different form while maintaining the same meaning.
- **Question Answering:** Providing answers to questions based on a given context.
- **Question Generation:** Creating questions from given text.
- **Translation:** Translating text from one language to another.

The “process_text” function is the core of this modeling part. It maps each task to its corresponding prefix and uses the Octopus model to generate the desired output. The model's generation process is configured using specific options such as beam search to ensure high-quality results. We only use the Paraphrasing task to make the sentence that is coming from the translate model more understandable.

### Audio Transcription with SpeechRecognition
We focus on audio transcription using the SpeechRecognition library. The application accepts audio files in “.wav” format and processes them to extract the spoken content as text. The transcription process involves the following steps:
- **File Upload:** Users upload audio files through an HTTP request.
- **File Validation:** The application checks if the uploaded file is valid and allowed (only .wav files).
- **Transcription:** Using the SpeechRecognition library, the application reads the audio file and transcribes it using Google's speech recognition API, specifically for the Arabic language (Egyptian dialect).

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.

---
