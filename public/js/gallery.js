import { initModal } from './galleryModal.js';

// Initialize Swipers
const verticalSwiper = new Swiper('#vertical-carousel', {
    slidesPerView: 1,
    navigation: {
        nextEl: '#vertical-carousel .swiper-button-next',
        prevEl: '#vertical-carousel .swiper-button-prev',
    },
});

const horizontalSwiper = new Swiper('#horizontal-carousel', {
    slidesPerView: 1,
    navigation: {
        nextEl: '#horizontal-carousel .swiper-button-next',
        prevEl: '#horizontal-carousel .swiper-button-prev',
    },
});

const squareSwiper = new Swiper('#square-carousel', {
    slidesPerView: 1,
    navigation: {
        nextEl: '#square-carousel .swiper-button-next',
        prevEl: '#square-carousel .swiper-button-prev',
    },
});

// Initialize the modal when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initModal();  // This will set up the modal functionality

    // Wait for the animation on the title to finish, then show the gallery with a fade-in effect
    document.querySelector('h1').addEventListener('animationend', function () {
        const gallery = document.querySelector('.gallery-container');
        const mobileGallery = document.querySelectorAll('#vertical-carousel, #horizontal-carousel, #square-carousel');
        // Remove the hidden class and trigger the fade-in
        gallery.classList.remove('hidden');
        gallery.classList.add('fade-in');

        // Apply the fade-in effect to each mobile gallery carousel
        mobileGallery.forEach(carousel => {
            carousel.classList.remove('hidden');
            carousel.classList.add('fade-in');
        });
    });
    
    
});
