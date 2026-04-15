// Doctor Inbox functionality
import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector(".premium-table tbody");
    const doctorId = localStorage.getItem('user_id') || 1;

    let currentRequests = [];

    async function fetchRequests() {
        if (!tableBody) return;

        try {
            const response = await fetch(`${API_URL}/api/help_requests/help-requests/doctor/${doctorId}`);
            if (!response.ok) throw new Error("Failed to fetch requests");

            currentRequests = await response.json();
            displayRequests(currentRequests);
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    }

    function displayRequests(requests) {
        tableBody.innerHTML = "";

        if (requests.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='9'>No patient requests found.</td></tr>";
            return;
        }

        requests.forEach(req => {
            const tr = document.createElement("tr");
            tr.setAttribute("data-aos", "fade-up");
            const currentStatus = (req.status || "pending").trim().toLowerCase();

            tr.innerHTML = `
                <td>${req.request_id}</td>
                <td style="font-weight: 800;">${req.patient_name}</td>
                <td>${req.patient_id}</td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${req.problem_description || ""}">
                    ${req.problem_description || "N/A"}
                    ${req.already_accepted_elsewhere ? `<br><span style="color: #ff4d4d; font-size: 0.75rem; font-weight: bold;">⚠️ Already accepted by another doctor</span>` : ""}
                </td>
                <td>${req.request_date ? req.request_date.split('T')[0] : "N/A"}</td>
                <td>${req.final_date ? req.final_date.split('T')[0] : "N/A"}</td>
                <td>
                    <button onclick="showDetails(${req.request_id})" class="view-doc-btn" style="padding: 6px 14px; font-size: 0.85rem; border: none; cursor: pointer;">View Details</button>
                </td>
                <td><span class="status-badge ${currentStatus}">${currentStatus.toUpperCase()}</span></td>
                <td>
                    ${currentStatus === 'pending' ?
                    (req.already_accepted_elsewhere ?
                        `<span class="action-label" style="background: #e0e0e0; color: #666; padding: 6px 12px; border-radius: 6px; font-weight: 600;">ACCEPTED</span>` :
                        `
                            <button onclick="updateStatus(${req.request_id}, 'accept')" style="padding: 6px 12px; cursor: pointer; background: #4caf8f; color: white; border: none; border-radius: 6px; font-weight: 600; transition: 0.3s; margin-right: 5px;">Accept</button>
                            <button onclick="updateStatus(${req.request_id}, 'reject')" style="padding: 6px 12px; cursor: pointer; background: #ff4d4d; color: white; border: none; border-radius: 6px; font-weight: 600; transition: 0.3s;">Reject</button>
                            `
                    ) : `<span class="action-label">Handled</span>`}
                </td>
            `;
            tableBody.appendChild(tr);
        });

        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    window.showDetails = (requestId) => {
        const req = currentRequests.find(r => r.request_id === requestId);
        if (!req) return;

        const modal = document.getElementById("detailsModal");
        const detailsContainer = document.getElementById("modalDetails");

        detailsContainer.innerHTML = `
            <div class="detail-item">
                <label>Request ID</label>
                <span>#${req.request_id}</span>
            </div>
            <div class="detail-item">
                <label>Status</label>
                <span class="status-badge ${(req.status || 'pending').toLowerCase()}">${(req.status || 'PENDING').toUpperCase()}</span>
            </div>
            <div class="detail-item">
                <label>Patient Name</label>
                <span>${req.patient_name}</span>
            </div>
            <div class="detail-item">
                <label>Patient ID</label>
                <span>${req.patient_id}</span>
            </div>
            <div class="detail-item">
                <label>Request Date</label>
                <span>${req.request_date ? req.request_date.split('T')[0] : "N/A"}</span>
            </div>
            <div class="detail-item">
                <label>Final Date</label>
                <span>${req.final_date ? req.final_date.split('T')[0] : "N/A"}</span>
            </div>
            <div class="detail-item full-width">
                <label>Document Attached</label>
                <span>
                    ${req.document_name ?
                `<a href="${API_URL}/uploads/${encodeURIComponent(req.document_name)}" target="_blank" class="view-doc-btn" style="text-decoration: none; padding: 5px 15px; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 8px;">
                            <i class="fas fa-file-pdf"></i> View Report Content
                        </a>`
                : '<span style="color: #999;">No document uploaded</span>'
            }
                </span>
            </div>
            <div class="detail-item full-width">
                <label>Problem Description</label>
                <div style="margin-top: 0.5rem; line-height: 1.6; color: #444; background: #f9f9f9; padding: 1.25rem; border-radius: 12px; border: 1px solid #eee;">
                    ${req.problem_description || "No description provided."}
                </div>
                ${req.already_accepted_elsewhere ? `<p style="color: #ff4d4d; font-weight: bold; margin-top: 10px;">⚠️ Note: This patient has already had an appointment accepted by another doctor.</p>` : ""}
            </div>
        `;

        modal.style.display = "block";
    };

    window.closeModal = () => {
        document.getElementById("detailsModal").style.display = "none";
    };

    window.updateStatus = async (requestId, action) => {
        try {
            const response = await fetch(`${API_URL}/api/help_requests/help-requests/${requestId}/${action}`, {
                method: 'PUT'
            });
            if (response.ok) {
                alert(`Request ${action}ed!`);
                fetchRequests();
            }
        } catch (err) {
            console.error("Update Error:", err);
            alert("Failed to update status.");
        }
    };

    // Close modal when clicking outside
    window.onclick = (event) => {
        const modal = document.getElementById("detailsModal");
        if (event.target == modal) {
            closeModal();
        }
    };

    fetchRequests();

    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true
        });
    }
});
