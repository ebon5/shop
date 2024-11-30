document.addEventListener('DOMContentLoaded', function() {

    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const carouselItems = document.querySelectorAll('.carousel-item');
    
    let currentIndex = 0;
    const totalItems = carouselItems.length;
    const autoSlideInterval = 3000; 
    let autoSlide;
    
    // Function to update carousel position
    function updateCarousel() {
        const offset = -currentIndex * 100;
        carouselWrapper.style.transform = `translateX(${offset}%)`;
    }
    
    // Move to the next slide automatically
    function moveToNextSlide() {
        currentIndex = (currentIndex >= totalItems - 1) ? 0 : currentIndex + 1;
        updateCarousel();
    }
    
    // Start the auto-slide feature
    function startAutoSlide() {
        autoSlide = setInterval(moveToNextSlide, autoSlideInterval);
    }
    
    startAutoSlide();
    
    // Hamburger menu functionality
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

});
