// Fetches and displays doctors in the doctors grid
import { API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
    const doctorsGrid = document.querySelector(".doctors-grid");
    const loadingMessage = document.getElementById("loadingMessage");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");

    let allDoctors = [];

    async function fetchDoctors() {
        try {
            const response = await fetch(`${API_URL}/api/doctors/`);
            if (!response.ok) throw new Error("Failed to fetch doctors");

            allDoctors = await response.json();
            displayDoctors(allDoctors);
        } catch (error) {
            console.error("Error fetching doctors:", error);
            if (loadingMessage) {
                loadingMessage.innerHTML = `Error loading doctors. Please ensure the backend is running at ${API_URL}`;
                loadingMessage.style.color = "#ff4d4d";
            }
        }
    }

    function displayDoctors(doctors) {
        if (!doctorsGrid) return;

        // Clear grid
        doctorsGrid.innerHTML = "";

        if (doctors.length === 0) {
            doctorsGrid.innerHTML = "<p style='text-align: center; grid-column: 1/-1; padding: 2rem; color: #888;'>No doctors found matching your search.</p>";
            return;
        }

        doctors.forEach(doctor => {
            const doctorCard = document.createElement("div");
            doctorCard.className = "doctor-card";
            doctorCard.setAttribute("data-aos", "fade-up");

            const assets = ["quality.png", "care.png", "consultation.png"];
            const randomAsset = assets[Math.floor(Math.random() * assets.length)];
            const profilePic = doctor.profile_picture ? `${API_URL}/uploads/${doctor.profile_picture}` : `./assets/${randomAsset}`;

            doctorCard.innerHTML = `
                <img src="${profilePic}" alt="${doctor.name}" onerror="this.src='./assets/consultation.png'">
                <div>
                    <h2>${doctor.name}</h2>
                    <p class="specialty">${doctor.specialization || "General Physician"}</p>
                    <p class="hospital">${doctor.hospital_name || "Life Savers Hospital"}</p>
                    <button class="book-btn" onclick="window.location.href='appointment.html?id=${doctor.doctor_id}'">Book Appointment</button>
                </div>
            `;
            doctorsGrid.appendChild(doctorCard);
        });

        // Re-initialize AOS for new elements
        if (window.AOS) {
            window.AOS.refresh();
        }
    }

    // Search functionality logic
    const handleSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        const filteredDoctors = allDoctors.filter(doctor => {
            return (
                doctor.name.toLowerCase().includes(query) ||
                (doctor.specialization && doctor.specialization.toLowerCase().includes(query)) ||
                (doctor.hospital_name && doctor.hospital_name.toLowerCase().includes(query))
            );
        });
        displayDoctors(filteredDoctors);
    };

    if (searchBtn) {
        searchBtn.addEventListener("click", handleSearch);
    }

    if (searchInput) {
        searchInput.addEventListener("input", handleSearch);
    }

    fetchDoctors();
});
