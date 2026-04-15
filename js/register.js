import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const phone = document.getElementById("phone_number").value; // Map to 'phone'
            const password = document.getElementById("password").value;
            const confirm_password = document.getElementById("confirm_password").value;
            const role = document.getElementById("role-select").value;

            if (password !== confirm_password) {
                alert("Passwords do not match!");
                return;
            }

            try {
                let response;
                let payload = { name, email, password, phone };

                if (role === 'doctor') {
                    const profileFile = document.getElementById("profile_picture")?.files[0];
                    let profilePictureUrl = "";

                    if (profileFile) {
                        const formData = new FormData();
                        formData.append("file", profileFile);

                        const uploadRes = await fetch(`${API_URL}/api/help_requests/upload`, {
                            method: 'POST',
                            body: formData
                        });

                        if (uploadRes.ok) {
                            const uploadData = await uploadRes.json();
                            profilePictureUrl = uploadData.filename;
                        }
                    }

                    // Expand payload for doctor
                    let specializationVal = document.getElementById("specialization") ? document.getElementById("specialization").value : "General";
                    if (!specializationVal) specializationVal = "General";

                    payload = {
                        ...payload,
                        specialization: specializationVal,
                        hospital_name: "Life Savers Hospital",
                        availability: "Available",
                        profile_picture: profilePictureUrl
                    };

                    response = await fetch(`${API_URL}/api/doctors/`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                } else {
                    // Admin or Patient
                    const endpoint = role === 'admin' ? '/api/admins/' : '/api/patients/';
                    response = await fetch(`${API_URL}${endpoint}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                }

                // Handle Response
                const result = response.headers.get("content-type")?.includes("application/json") 
                               ? await response.json() 
                               : null;

                if (response.ok) {
                    alert('Registration Successful! You can now login.');
                    window.location.href = '../index.html';
                } else {
                    const errorMsg = result?.detail || result?.message || 'Registration failed';
                    alert('Error: ' + errorMsg);
                }

            } catch (error) {
                console.error('Registration Error:', error);
                alert('Connection failed. Please ensure the backend is active.');
            }
        });
    }
});
