/**
 * Lógica específica para la página de proyectos (Filtro dinámico de proyectos)
 */

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length > 0 && projectCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 1. Remover clase activa de todos los botones y agregarla al clicado
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // 2. Obtener el filtro seleccionado
                const filterValue = button.getAttribute('data-filter');

                // 3. Filtrar las tarjetas de proyectos
                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        // Mostrar tarjeta con efecto de transición
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        // Ocultar tarjeta
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300); // Esperar que termine la transición de opacidad
                    }
                });
            });
        });
        
        // Inicializar estilos de animación inline en las tarjetas para la transición suave
        projectCards.forEach(card => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        });
    }
});
