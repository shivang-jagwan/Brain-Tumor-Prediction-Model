document.addEventListener('DOMContentLoaded', function () {
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');


    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(targetPage).classList.add('active');
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });

    document.getElementById('upload-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const fileInput = document.getElementById('file-input');
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
    
        try {
            
            const submitBtn = document.querySelector('#upload-form button');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Analyzing...';
            
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
    
            if (result.error) {
                alert(result.error);
            } else {
         
                const uploadedImg = document.getElementById('uploaded-image');
                if (result.image_url) {
                    uploadedImg.src = result.image_url;
                } else {
                 
                    uploadedImg.src = URL.createObjectURL(fileInput.files[0]);
                }
                uploadedImg.style.display = 'block';
                
 
                document.getElementById('prediction-result').innerHTML = `
                    <strong>Prediction:</strong> ${result.prediction}
                `;
                document.getElementById('confidence-result').innerHTML = `
                    <strong>Confidence:</strong> ${(result.confidence * 100).toFixed(2)}%
                `;

                const detailsBtn = document.getElementById('details-button');
                detailsBtn.style.display = 'block';
                detailsBtn.onclick = function() {
                    displayTumorDetails(result.prediction_class || result.prediction);
                };
            }
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            const submitBtn = document.querySelector('#upload-form button');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Analyze MRI Scan';
        }
    });

W
    function displayTumorDetails(tumorType) {
        const details = getTumorDetails(tumorType);
        document.getElementById('tumor-description').textContent = details.description;
        
        const symptomsList = document.getElementById('tumor-symptoms');
        symptomsList.innerHTML = '';
        details.symptoms.forEach(symptom => {
            const li = document.createElement('li');
            li.textContent = symptom;
            symptomsList.appendChild(li);
        });
        
        const treatmentList = document.getElementById('tumor-treatment');
        treatmentList.innerHTML = '';
        details.treatment.forEach(treatment => {
            const li = document.createElement('li');
            li.textContent = treatment;
            treatmentList.appendChild(li);
        });
        
        document.getElementById('details-section').style.display = 'block';
    }

    // Tumor details data
    function getTumorDetails(tumorType) {
        const details = {
            "glioma": {
                description: "Glioma is a type of tumor that occurs in the brain and spinal cord, arising from glial cells.",
                symptoms: ["Headaches", "Nausea or vomiting", "Memory loss", "Seizures", "Personality changes"],
                treatment: ["Surgery", "Radiation therapy", "Chemotherapy", "Targeted drug therapy"]
            },
            "meningioma": {
                description: "Meningioma is a tumor that arises from the meninges, the membranes that surround the brain and spinal cord.",
                symptoms: ["Vision problems", "Hearing loss", "Memory difficulties", "Seizures", "Weakness in limbs"],
                treatment: ["Observation for small tumors", "Surgical removal", "Radiation therapy", "Medications to control symptoms"]
            },
            "pituitary": {
                description: "Pituitary tumors are abnormal growths in the pituitary gland, which controls hormone production.",
                symptoms: ["Headaches", "Vision loss", "Hormonal imbalances", "Fatigue", "Unexplained weight changes"],
                treatment: ["Medication to regulate hormones", "Surgical removal", "Radiation therapy", "Regular monitoring"]
            },
            "notumor": {
                description: "No tumor was detected in the MRI scan.",
                symptoms: [],
                treatment: ["Regular checkups recommended", "Maintain healthy lifestyle", "Monitor for any neurological symptoms"]
            }
        };
        
        // Normalize tumor type for lookup
        const normalizedType = tumorType.toLowerCase().includes('glioma') ? 'glioma' :
                              tumorType.toLowerCase().includes('meningioma') ? 'meningioma' :
                              tumorType.toLowerCase().includes('pituitary') ? 'pituitary' : 'notumor';
        
        return details[normalizedType] || details['notumor'];
    }
});