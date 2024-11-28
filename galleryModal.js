export function initModal() {
    // Add modal HTML to the body dynamically
    if (!document.querySelector('.modal-overlay')) {
        document.body.insertAdjacentHTML('beforeend', `
            <div class="modal-overlay" hidden>
                <div class="modal-content">
                    <div class="modal-image-container">
                        <img src="" alt="Modal Image" class="modal-image">
                    </div>
                    <button class="modal-close" aria-label="Close">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.25 6.75L6.75 17.25"></path>
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.75 6.75L17.25 17.25"></path>
                        </svg>
                    </button>
                    <button class="modal-nav-left" aria-label="Previous">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.25 6.75L4.75 12L10.25 17.25"></path>
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.25 12H5"></path>
                        </svg>
                    </button>
                    <button class="modal-nav-right" aria-label="Next">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.75 6.75L19.25 12L13.75 17.25"></path>
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 12H4.75"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `);
    }

    const modalOverlay = document.querySelector('.modal-overlay');
    const modalImageContainer = document.querySelector('.modal-image-container');
    const modalImage = document.querySelector('.modal-image');
    const modalClose = document.querySelector('.modal-close');
    const modalNavLeft = document.querySelector('.modal-nav-left');
    const modalNavRight = document.querySelector('.modal-nav-right');

    let modalEnabledImages = document.querySelectorAll('[data-modal="true"]');
    let currentIndex = 0;

    // Open modal and display image
    function openModal(index) {
        currentIndex = index;
        modalImage.src = modalEnabledImages[index].src;
        modalOverlay.hidden = false;
        modalOverlay.style.display = "flex";
    }

    // Close modal function
    function closeModal() {
        modalOverlay.hidden = true;
        modalOverlay.style.display = "none";
    }

    // Attach event listeners to modal-enabled images
    function attachModalListeners() {
        modalEnabledImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                openModal(index);
            });
        });
    }

    // Close modal on close button click
    modalClose.addEventListener('click', closeModal);

    // Close modal when clicking outside the image
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Close modal with Escape key, navigate with left/right arrows
    window.addEventListener('keydown', (e) => {
        if (modalOverlay.hidden) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPreviousImage();
    });

    // Show next image
    function showNextImage() {
        currentIndex = (currentIndex + 1) % modalEnabledImages.length;
        modalImage.src = modalEnabledImages[currentIndex].src;
    }

    // Show previous image
    function showPreviousImage() {
        currentIndex = (currentIndex - 1 + modalEnabledImages.length) % modalEnabledImages.length;
        modalImage.src = modalEnabledImages[currentIndex].src;
    }

    // Navigation button event listeners
    modalNavLeft.addEventListener('click', (e) => {
        e.stopPropagation();
        showPreviousImage();
    });
    modalNavRight.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
    });

    // Zoom-in/out logic: container stays same, image zooms in/out
    let isZoomed = false;
    modalImage.style.cursor = 'zoom-in'; // Default cursor

    modalImage.addEventListener('mouseenter', () => {
        if (!isZoomed) {
            modalImage.style.cursor = 'zoom-in';
        }
    });

    modalImage.addEventListener('dblclick', (e) => {
        const bounds = modalImage.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;
    
        if (!isZoomed) {
            modalImage.style.cursor = 'zoom-out';
            modalImage.style.transition = 'transform 0.3s ease-in-out';
            modalImage.style.transform = 'scale(1.35)'; // Zoom in slightly
            modalImage.style.transformOrigin = `${(x / bounds.width) * 100}% ${(y / bounds.height) * 100}%`; // Zoom based on current cursor position
            isZoomed = true;
        } else {
            modalImage.style.cursor = 'zoom-in';
            modalImage.style.transform = 'scale(1)'; // Reset image to original size
            isZoomed = false;
        }
    });
    

    // When zoomed in, move the image with the cursor position
    modalImage.addEventListener('mousemove', (e) => {
        if (isZoomed) {
            // Get the mouse position relative to the image
            const bounds = modalImage.getBoundingClientRect();
            const x = e.clientX - bounds.left;
            const y = e.clientY - bounds.top;
            
            // Adjust transform-origin to follow the cursor
            modalImage.style.transformOrigin = `${(x / bounds.width) * 100}% ${(y / bounds.height) * 100}%`;
        }
    });

    //Mobile zoom
    let isTouchZoomed = false;
    let tapTimeout = null;

    modalImage.addEventListener('touchend', (e) => {
        if (tapTimeout === null) {
            // First tap: start the timer
            tapTimeout = setTimeout(() => {
                tapTimeout = null; // Reset for the next tap
            }, 300);
        } else {
            // Second tap within 300ms: double-tap detected
            clearTimeout(tapTimeout);
            tapTimeout = null;

            const bounds = modalImage.getBoundingClientRect();
            const x = e.changedTouches[0].clientX - bounds.left;
            const y = e.changedTouches[0].clientY - bounds.top;

            if (!isTouchZoomed) {
                modalImage.style.cursor = 'zoom-out';
                modalImage.style.transition = 'transform 0.3s ease-in-out';
                modalImage.style.transform = 'scale(1.35)';
                modalImage.style.transformOrigin = `${(x / bounds.width) * 100}% ${(y / bounds.height) * 100}%`;
                isTouchZoomed = true;
            } else {
                modalImage.style.cursor = 'zoom-in';
                modalImage.style.transform = 'scale(1)';
                isTouchZoomed = false;
            }
        }
    });


    // Initialize listeners
    attachModalListeners();
}
