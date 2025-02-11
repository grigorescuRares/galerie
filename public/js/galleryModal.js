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

    // Open modal and display image (with high-quality image load)
    function openModal(index, gallery) {
        currentGallery = gallery;
        modalEnabledImages = document.querySelectorAll(`[data-modal="true"][data-device="${gallery}"]`);
        currentIndex = index;

        // Assuming high-quality images have a `data-highres` attribute containing the high-resolution image URL
        const highResSrc = modalEnabledImages[index].getAttribute('data-highres');
        modalImage.src = highResSrc || modalEnabledImages[index].src; // Fallback to the regular src if no high-res version exists

        modalOverlay.hidden = false;
        modalOverlay.style.display = "flex";
        
        // Disable body scroll
        document.body.style.overflow = 'hidden';
        document.body.classList.add('modal-open');

        updateNavButtons();
    }

    // Close modal function 
    function closeModal() {
        modalOverlay.hidden = true;
        modalOverlay.style.display = "none";
        currentGallery = null;
        document.body.style.overflow = '';
        document.body.classList.remove('modal-open');
    }

    // Update navigation buttons visibility 
    function updateNavButtons() {
        if (currentIndex === 0) {
            modalNavLeft.setAttribute('hidden', true);
        } else {
            modalNavLeft.removeAttribute('hidden');
        }

        if (currentIndex === modalEnabledImages.length - 1) {
            modalNavRight.setAttribute('hidden', true);
        } else {
            modalNavRight.removeAttribute('hidden');
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
        if (!modalImage.contains(e.target)) {
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
        const highResSrc = modalEnabledImages[currentIndex].getAttribute('data-highres');
        modalImage.src = highResSrc || modalEnabledImages[currentIndex].src; // Load high-res or fallback to normal
        updateNavButtons();
    }

    // Show previous image within the same gallery 
    function showPreviousImage() {
        if (!currentGallery || currentIndex === 0) return;
        currentIndex--;
        const highResSrc = modalEnabledImages[currentIndex].getAttribute('data-highres');
        modalImage.src = highResSrc || modalEnabledImages[currentIndex].src; // Load high-res or fallback to normal
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

    // Mobile and desktop zoom logic
    let isZoomed = false;
    modalImage.style.cursor = 'zoom-in';

    // Timing for double-tap detection on mobile
    let lastTapTime = 0;  // Track the time of the last tap

    // Prevent browser zoom behavior, but only on the modal image
    document.body.style.touchAction = 'none';  // Disable pinch zoom on the whole page

    // Mobile Double-Tap Detection
    modalImage.addEventListener('touchstart', (e) => {
        const currentTime = Date.now();
        const timeDiff = currentTime - lastTapTime;

        // Only handle double tap if there is exactly 1 touch point
        if (e.touches.length === 1 && timeDiff < 300) {
            // Trigger zoom on double-tap
            handleZoom(e);
        }

        lastTapTime = currentTime;
    });

    // Desktop Double-Click Handling
    modalImage.addEventListener('dblclick', (e) => {
        handleZoom(e);
    });

    function handleZoom(e) {
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
    }

    // Track finger movement while zoomed (mobile)
    modalImage.addEventListener('touchmove', (e) => {
        if (isZoomed && e.touches.length === 1) {
            const bounds = modalImage.getBoundingClientRect();
            const x = e.touches[0].clientX - bounds.left;
            const y = e.touches[0].clientY - bounds.top;
            modalImage.style.transformOrigin = `${(x / bounds.width) * 100}% ${(y / bounds.height) * 100}%`;
        }
    });

    // Pinch-to-zoom behavior for mobile (using touch events)
    let touchStartDistance = 0;
    let initialScale = 1;  // Keeps track of the initial scale before zooming

    modalImage.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            touchStartDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            initialScale = parseFloat(modalImage.style.transform.replace('scale(', '').replace(')', '')) || 1;
        }
    });

    modalImage.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            const touchMoveDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const scale = (touchMoveDistance / touchStartDistance) * initialScale; // Apply scaling based on pinch movement
            modalImage.style.transform = `scale(${scale})`;

            // Update transform origin to track finger movement during zoom
            const bounds = modalImage.getBoundingClientRect();
            const x = e.touches[0].clientX - bounds.left;
            const y = e.touches[0].clientY - bounds.top;
            modalImage.style.transformOrigin = `${(x / bounds.width) * 100}% ${(y / bounds.height) * 100}%`;
        }
    });

    // When pinch zoom ends
    modalImage.addEventListener('touchend', () => {
        if (isZoomed) {
            modalImage.style.transition = 'transform 0.3s ease-in-out';
            modalImage.style.transform = 'scale(1)';
            isZoomed = false;
        }
    });

    // Fix page scroll behavior when modal is open
    function toggleBodyScroll(isModalOpen) {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        } else {
            document.body.style.overflow = ''; // Allow scrolling when modal is closed
        }
    }




    // Initialize listeners
    attachModalListeners();
}
