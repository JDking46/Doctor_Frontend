// Appointment booking functionality
import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
    const appointmentForm = document.querySelector(".booking-form"); // Fixed selector
    const params = new URLSearchParams(window.location.search);
    const doctorId = params.get('id');

    // Populate patient info from localStorage
    const userJson = localStorage.getItem('user');
    if (userJson) {
        const user = JSON.parse(userJson);
        const nameEl = document.getElementById("patientName");
        const emailEl = document.getElementById("patientEmail");
        const roleEl = document.getElementById("patientRole");

        if (nameEl) nameEl.innerText = user.name || "User";
        if (emailEl) emailEl.innerText = user.email || "...";
        if (roleEl) roleEl.innerText = user.role || "Patient";
    }

    if (appointmentForm) {
        appointmentForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            // Get patient info from localStorage
            const patientIdRaw = localStorage.getItem('user_id');
            const patientId = parseInt(patientIdRaw);

            if (!patientIdRaw || isNaN(patientId)) {
                alert("Please login first to book an appointment!");
                window.location.href = 'index.html';
                return;
            }

            const finalDate = document.getElementById("finalDate").value;
            const medicalDocInput = document.getElementById("medicalDoc");
            let docName = null;

            if (medicalDocInput.files && medicalDocInput.files.length > 0) {
                const file = medicalDocInput.files[0];
                const formData = new FormData();
                formData.append("file", file);

                try {
                    const uploadRes = await fetch(`${API_URL}/api/help_requests/upload`, {
                        method: 'POST',
                        body: formData
                    });
                    if (uploadRes.ok) {
                        const uploadData = await uploadRes.json();
                        docName = uploadData.filename;
                    }
                } catch (err) {
                    console.error("Upload Error:", err);
                }
            }

            const appointmentData = {
                doctor_id: parseInt(doctorId) || 1,
                patient_id: patientId,
                request_date: new Date().toISOString().split('T')[0],
                final_date: finalDate || null,
                document_name: docName,
                problem_description: document.getElementById("problemDescription").value,
                status: "pending"
            };

            try {
                const response = await fetch(`${API_URL}/api/help_requests/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(appointmentData)
                });

                if (response.ok) {
                    alert("Appointment request sent successfully!");
                    window.location.href = "success.html";
                } else {
                    alert("Error sending request.");
                }
            } catch (err) {
                console.error("Booking Error:", err);
                alert("Backend not responding.");
            }
        });
    }
});
