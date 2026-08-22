/**
 * Lógica Javascript común para el sitio web de la Fundación Vitra
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Menú móvil tipo hamburguesa
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Cambiar el icono de hamburguesa a cerrar (X) si está activo
            const icon = navToggle.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Cerrar menú al hacer clic en un enlace
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // 2. Efecto scroll en la cabecera (Header Scrolled)
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Ejecutar al cargar para verificar posición inicial

    // 3. Resaltar página activa en la navegación
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const menuLinks = document.querySelectorAll('.nav-link');
    
    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 4. Animaciones de aparición al hacer scroll (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Dejar de observar una vez animado
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        
        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback si el navegador no soporta IntersectionObserver
        revealElements.forEach(element => {
            element.classList.add('active');
        });
    }

    // 5. Testimonios slider (Carrusel simple automático)
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    if (testimonialSlides.length > 1) {
        let currentSlide = 0;
        
        const showSlide = (index) => {
            testimonialSlides.forEach(slide => slide.style.display = 'none');
            testimonialSlides[index].style.display = 'block';
        };
        
        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % testimonialSlides.length;
            showSlide(currentSlide);
        };
        
        // Inicializar
        showSlide(currentSlide);
        
        // Intervalo de 5 segundos
        setInterval(nextSlide, 5000);
    }

    // 6. Copiar datos bancarios con Toast flotante
    const copyButtons = document.querySelectorAll('[data-copy]');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy');
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast('¡Datos copiados al portapapeles!');
                }).catch(() => {
                    fallbackCopyText(textToCopy);
                });
            } else {
                fallbackCopyText(textToCopy);
            }
        });
    });

    function fallbackCopyText(text) {
        const tempInput = document.createElement('textarea');
        tempInput.value = text;
        tempInput.style.position = 'fixed';
        tempInput.style.left = '-9999px';
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
            document.execCommand('copy');
            showToast('¡Datos copiados al portapapeles!');
        } catch (err) {
            prompt('Copia estos datos manualmente:', text);
        }
        document.body.removeChild(tempInput);
    }

    function showToast(message) {
        let toast = document.querySelector('.toast-msg');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-msg';
            toast.innerHTML = '<i class="fas fa-check-circle" style="color: var(--color-secondary);"></i> <span></span>';
            document.body.appendChild(toast);
        }
        toast.querySelector('span').textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }
});
