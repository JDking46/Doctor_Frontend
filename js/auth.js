// Authentication handling for the Life Savers app
import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const role = document.getElementById("role").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                // Determine correct endpoint based on role
                const loginEndpoint = `${API_URL}/api/auth/login/${role}`;

                const response = await fetch(loginEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });

                if (response.ok) {
                    const data = await response.json();

                    // Store user data in localStorage
                    localStorage.setItem('user', JSON.stringify(data));
                    localStorage.setItem('role', data.role);
                    localStorage.setItem('email', data.email);
                    localStorage.setItem('user_id', data.id);

                    // Redirect based on role
                    if (data.role === 'doctor') {
                        window.location.href = '../pages/doctor-home.html';
                    } else if (data.role === 'admin') {
                        window.location.href = '../pages/admin.html';
                    } else {
                        window.location.href = '../pages/patient_home_page.html';
                    }
                } else {
                    const error = await response.json();
                    alert('Login Failed: ' + (error.detail || 'Invalid credentials'));
                }
            } catch (err) {
                console.error('Login Error:', err);
                alert('Backend not responding. Please ensure the backend server is running.');
            }
        });
    }
});

