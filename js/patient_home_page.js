// Simple version using a basic for loop
function animateCounter(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;

    // A for loop that goes from start to end
    for (let i = start; i <= end; i++) {
        // We set a timer for each number so they don't all show at once
        setTimeout(() => {
            obj.innerText = i;
        }, ((i - start) * duration) / (end - start));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Initial stats - could be fetched from API
    animateCounter("patientCount", 0, 1000, 2000);
    animateCounter("doctorCount", 0, 50, 2000);
    animateCounter("successRate", 0, 99, 2000);
    animateCounter("branchCount", 0, 15, 2000);

    // Navbar Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    
    if (window.AOS) {
        window.AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
});
