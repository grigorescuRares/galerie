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
                    <button class="modal-nav-left" aria-label="Previous" hidden>
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.25 6.75L4.75 12L10.25 17.25"></path>
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.25 12H5"></path>
                        </svg>
                    </button>
                    <button class="modal-nav-right" aria-label="Next" hidden>
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
    const modalImage = document.querySelector('.modal-image');
    const modalClose = document.querySelector('.modal-close');
    const modalNavLeft = document.querySelector('.modal-nav-left');
    const modalNavRight = document.querySelector('.modal-nav-right');

    let modalEnabledImages = document.querySelectorAll('[data-modal="true"]');
    let currentGallery = null;
    let currentIndex = 0;

    // Open modal and display image
    function openModal(index, gallery) {
        currentGallery = gallery;
        modalEnabledImages = document.querySelectorAll(`[data-modal="true"][data-device="${gallery}"]`);
        currentIndex = index;
        modalImage.src = modalEnabledImages[index].src;
        modalOverlay.hidden = false;
        modalOverlay.style.display = "flex";
        
        // Disable body scroll
        document.body.style.overflow = 'hidden';

        // Add 'modal-open' class to body to disable menu button interaction
        document.body.classList.add('modal-open');

        updateNavButtons();
    }

    // Close modal function
    function closeModal() {
        modalOverlay.hidden = true;
        modalOverlay.style.display = "none";
        currentGallery = null;

        // Re-enable body scroll
        document.body.style.overflow = '';

        // Remove 'modal-open' class to restore menu button interaction
        document.body.classList.remove('modal-open');
    }

    // Update navigation button visibility
    function updateNavButtons() {
        if (currentIndex === 0) {
            modalNavLeft.setAttribute('hidden', true); // Disable left button
        } else {
            modalNavLeft.removeAttribute('hidden'); // Enable left button
        }

        if (currentIndex === modalEnabledImages.length - 1) {
            modalNavRight.setAttribute('hidden', true); // Disable right button
        } else {
            modalNavRight.removeAttribute('hidden'); // Enable right button
        }
    }

    // Attach event listeners to modal-enabled images
    function attachModalListeners() {
        document.querySelectorAll('[data-modal="true"]').forEach((img, index) => {
            const gallery = img.getAttribute('data-device');
            img.addEventListener('click', () => {
                const galleryImages = document.querySelectorAll(`[data-modal="true"][data-device="${gallery}"]`);
                const galleryIndex = Array.from(galleryImages).indexOf(img);
                openModal(galleryIndex, gallery);
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

    // Close modal with Escape key
    window.addEventListener('keydown', (e) => {
        if (modalOverlay.hidden) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight' && !modalNavRight.hidden) showNextImage();
        if (e.key === 'ArrowLeft' && !modalNavLeft.hidden) showPreviousImage();
    });

    // Show next image within the same gallery
    function showNextImage() {
        if (!currentGallery || currentIndex === modalEnabledImages.length - 1) return;
        currentIndex++;
        modalImage.src = modalEnabledImages[currentIndex].src;
        updateNavButtons();
    }

    // Show previous image within the same gallery
    function showPreviousImage() {
        if (!currentGallery || currentIndex === 0) return;
        currentIndex--;
        modalImage.src = modalEnabledImages[currentIndex].src;
        updateNavButtons();
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

    // Your zoom-in/out logic
    let isZoomed = false;
    modalImage.style.cursor = 'zoom-in';

    modalImage.addEventListener('dblclick', (e) => {
        const bounds = modalImage.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;

        if (!isZoomed) {
            modalImage.style.cursor = 'zoom-out';
            modalImage.style.transition = 'transform 0.3s ease-in-out';
            modalImage.style.transform = 'scale(1.35)';
            modalImage.style.transformOrigin = `${(x / bounds.width) * 100}% ${(y / bounds.height) * 100}%`;
            isZoomed = true;
        } else {
            modalImage.style.cursor = 'zoom-in';
            modalImage.style.transform = 'scale(1)';
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

    // Initialize listeners
    attachModalListeners();
}
