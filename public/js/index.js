document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector(".primary-header");

    // Function to handle scroll effects
    function handleScroll() {
        // Check if the screen size is laptop or above (example: 1024px and larger)
        const isLaptopOrAbove = window.matchMedia("(min-width: 1024px)").matches;

        if (isLaptopOrAbove && window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    // Add event listener for scroll
    document.addEventListener("scroll", handleScroll);

    // Initial check in case the page is already scrolled
    handleScroll();

    
});
