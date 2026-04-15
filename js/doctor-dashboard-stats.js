// Doctor Dashboard Statistics functionality
import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
    const doctorId = localStorage.getItem('user_id') || 1; // Use logged in ID

    const totalAcceptedEl = document.getElementById("totalAccepted");
    const appointmentsList = document.querySelector(".appointments-list");

    async function fetchDashboardData() {
        try {
            // Fetch requests for this doctor
            const response = await fetch(`${API_URL}/api/help_requests/help-requests/doctor/${doctorId}`);
            if (!response.ok) throw new Error("Failed to fetch dashboard data");

            const requests = await response.json();

            // Update stats
            const accepted = requests.filter(r => r.status === 'accepted');
            if (totalAcceptedEl) totalAcceptedEl.innerText = accepted.length;

            // Update list
            if (appointmentsList) {
                appointmentsList.innerHTML = "";
                if (requests.length === 0) {
                    appointmentsList.innerHTML = "<p>No patients found.</p>";
                } else {
                    requests.slice(0, 5).forEach(req => { // Show last 5
                        const item = document.createElement("div");
                        item.className = "appointment-item";
                        item.innerHTML = `
                            <div class="patient-info">
                                <img src="https://ui-avatars.com/api/?name=${req.patient_name}&background=random" alt="Patient" class="patient-img">
                                <div class="patient-details">
                                    <h4>${req.patient_name}</h4>
                                    <p>${req.status === 'accepted' ? 'Accepted on ' + req.request_date.split('T')[0] : 'Pending Request'}</p>
                                </div>
                            </div>
                            <span class="status-badge ${req.status}">${req.status.toUpperCase()}</span>
                        `;
                        appointmentsList.appendChild(item);
                    });
                }
            }
        } catch (error) {
            console.error("Dashboard Stats Error:", error);
        }
    }

    fetchDashboardData();

    // Initialize AOS
    if (window.AOS) {
        window.AOS.init({ duration: 1000, easing: 'ease-in-out', once: true });
    }
});
