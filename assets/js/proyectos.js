/**
 * Lógica para la Galería de Proyectos de la Fundación VITRA
 * - Filtro dinámico por categorías con conteo automático
 * - Visor interactivo (Lightbox) con navegación y detalles completos
 */

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const lightboxModal = document.getElementById('project-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxCategory = document.getElementById('lightbox-category');
    const lightboxLocation = document.getElementById('lightbox-location');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    let visibleCards = Array.from(projectCards);
    let currentIndex = 0;

    // 1. Conteo dinámico de proyectos por categoría
    filterButtons.forEach(button => {
        const filter = button.getAttribute('data-filter');
        let count = 0;
        if (filter === 'all') {
            count = projectCards.length;
        } else {
            projectCards.forEach(card => {
                if (card.getAttribute('data-category') === filter) count++;
            });
        }
        const countBadge = button.querySelector('.filter-count');
        if (countBadge) {
            countBadge.textContent = count;
        }
    });

    // 2. Filtro de tarjetas
    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');
                visibleCards = [];

                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.style.display = 'flex';
                        visibleCards.push(card);
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 250);
                    }
                });
            });
        });

        projectCards.forEach((card) => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';

            // Evento clic para abrir Lightbox
            card.addEventListener('click', () => {
                const currentVisibleIndex = visibleCards.indexOf(card);
                openLightbox(currentVisibleIndex >= 0 ? currentVisibleIndex : 0);
            });
        });
    }

    // 3. Funciones del Lightbox
    function openLightbox(index) {
        if (!lightboxModal || visibleCards.length === 0) return;
        currentIndex = index;
        updateLightboxContent();
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxContent() {
        if (visibleCards.length === 0) return;
        const currentCard = visibleCards[currentIndex];
        const img = currentCard.querySelector('.project-img');
        const title = currentCard.querySelector('.project-title');
        const badge = currentCard.querySelector('.project-badge');
        const desc = currentCard.querySelector('.project-desc');
        const location = currentCard.getAttribute('data-location') || 'Valle del Cauca';

        if (lightboxImg && img) {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || 'Proyecto Fundación VITRA';
        }
        if (lightboxTitle && title) {
            lightboxTitle.textContent = title.textContent;
        }
        if (lightboxCategory && badge) {
            lightboxCategory.textContent = badge.textContent;
            lightboxCategory.style.backgroundColor = badge.style.backgroundColor || 'var(--color-primary)';
        }
        if (lightboxDesc && desc) {
            lightboxDesc.textContent = desc.textContent;
        }
        if (lightboxLocation) {
            lightboxLocation.innerHTML = '<i class="fas fa-map-marker-alt" style="color: var(--color-primary); margin-right: 0.4rem;"></i> ' + location;
        }
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentIndex + 1} / ${visibleCards.length}`;
        }
    }

    function showNext() {
        if (visibleCards.length === 0) return;
        currentIndex = (currentIndex + 1) % visibleCards.length;
        updateLightboxContent();
    }

    function showPrev() {
        if (visibleCards.length === 0) return;
        currentIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
        updateLightboxContent();
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }

    // Soporte para teclado (ESC, Flechas Izq/Der)
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
});
