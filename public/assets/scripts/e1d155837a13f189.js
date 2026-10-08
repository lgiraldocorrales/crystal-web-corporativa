
        var slideIndex = 0;
        var autoSlideTimeout;
    
        function plusDivs(n) {
            clearTimeout(autoSlideTimeout); // Detener el carrusel automático
            showDivs(slideIndex += n);
            autoSlideTimeout = setTimeout(carousel, 2100); // Reiniciar el carrusel automático
        }
    
        function showDivs(n) {
            var i;
            var x = document.getElementsByClassName("mySlides");
            if (n >= x.length) {slideIndex = 0}
            if (n < 0) {slideIndex = x.length - 1}
            for (i = 0; i < x.length; i++) {
                x[i].style.display = "none";  
            }
            x[slideIndex].style.display = "block";  
        }
    
        function carousel() {
            showDivs(slideIndex += 1);
            autoSlideTimeout = setTimeout(carousel, 2100); // Cambia la imagen cada 1 segundo
        }
    
        showDivs(0); if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) carousel(); // Inicia el carrusel automáticamente
    