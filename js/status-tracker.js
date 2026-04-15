// Status Tracker functionality
import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem('user_id');
    const userRole = localStorage.getItem('role');

    if (!userId || userRole !== 'patient') {
        console.error("User not logged in as patient.");
        const trackerGrid = document.querySelector('.status-grid');
        if (trackerGrid) {
            trackerGrid.innerHTML = `
                <div class="status-card" style="grid-template-columns: 1fr; text-align: center;">
                    <p style="font-size: 1.2rem; color: #666;">Please <a href="index.html" style="color: var(--accent-green); font-weight: bold;">Login</a> as a patient to view your requests.</p>
                </div>
            `;
        }
        return;
    }

    const trackerGrid = document.querySelector('.status-grid');
    if (!trackerGrid) return;

    // Show loading state
    trackerGrid.innerHTML = '<div style="text-align: center; padding: 2rem;">Loading your requests...</div>';

    try {
        const response = await fetch(`${API_URL}/api/patients/${userId}/requests/all`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch requests');
        }

        const requests = await response.json();

        if (requests.length === 0) {
            trackerGrid.innerHTML = `
                <div class="status-card" style="grid-template-columns: 1fr; text-align: center;">
                    <p style="font-size: 1.2rem; color: #666;">No appointment requests found.</p>
                </div>
            `;
            return;
        }

        trackerGrid.innerHTML = ''; // Clear loading state or static content

        requests.forEach(req => {
            const card = document.createElement('div');
            card.className = "status-card";
            card.setAttribute('data-aos', 'fade-up');

            const statusClass = `status-${req.status.toLowerCase()}`;
            const statusLabel = req.status.charAt(0).toUpperCase() + req.status.slice(1);
            
            // Format date if possible
            const dateStr = req.request_date ? new Date(req.request_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }) : 'Date not set';

            card.innerHTML = `
                <div class="doctor-info-mini">
                    <div class="doc-avatar-small">
                        <img src="./assets/care.png" alt="Doctor">
                    </div>
                    <div class="doc-details-mini">
                        <h3>Dr. ${req.doctor_name || 'Unknown'}</h3>
                        <p>Specialist</p>
                    </div>
                </div>
                <div class="request-details">
                    <span class="request-meta">Request ID: #LS-${req.request_id}</span>
                    <p class="request-note">"${req.problem_description || 'No description provided.'}"</p>
                </div>
                <div class="status-badge-container">
                    <span class="status-badge ${statusClass}">${statusLabel}</span>
                    <span class="status-date">Request Date: ${dateStr}</span>
                </div>
            `;
            trackerGrid.appendChild(card);
        });

        // Re-initialize AOS for new elements
        if (window.AOS) {
            AOS.refresh();
        }

    } catch (error) {
        console.error("Error fetching requests:", error);
        trackerGrid.innerHTML = `
            <div class="status-card" style="grid-template-columns: 1fr; text-align: center; border-color: #ffcdd2;">
                <p style="color: #c62828;">Error loading requests. Please try again later.</p>
            </div>
        `;
    }
});

