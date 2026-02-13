// ==========================================
// D&M CARROZZERIA - MAIN JAVASCRIPT
// Versión Mejorada y Organizada
// ==========================================

/* ==========================================
   TABLA DE CONTENIDOS:
   1. Variables Globales
   2. Loader & Progress Bar
   3. Scroll Animations
   4. Navigation
   5. Color Lab
   6. Before/After Slider
   7. Pricing Calculator
   8. Modal System
   9. FAQ Accordion
   10. Cookie Banner
   11. WhatsApp Integration
   12. Status Checker
   13. 3D Tilt Effects
   ========================================== */


// ==========================================
// 1. VARIABLES GLOBALES
// ==========================================
var totalEstimate = 0;
var selectedParts = [];
let countersStarted = false;


// ==========================================
// 2. LOADER & PROGRESS BAR
// ==========================================
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            // Activar animación inicial del hero
            const heroReveal = document.querySelector('.hero-content .reveal');
            if (heroReveal) heroReveal.classList.add('active');
        }, 800);
    }, 1500);
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    const progressBar = document.getElementById("scroll-progress");
    if (progressBar) {
        progressBar.style.width = scrolled + "%";
    }

    // Navbar scroll effect
    const nav = document.getElementById('navbar');
    if (nav) {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
});


// ==========================================
// 3. SCROLL ANIMATIONS (Intersection Observer)
// ==========================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Si es la sección de estadísticas, iniciar contadores
            if (entry.target.closest('.stats-container')) {
                startCounters();
            }
        }
    });
}, { threshold: 0.15 });

// Observar todos los elementos con clase 'reveal'
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});


// ==========================================
// 4. NUMBER COUNTERS (Stats)
// ==========================================
function startCounters() {
    if (countersStarted) return;
    countersStarted = true;
    
    document.querySelectorAll('.stat-num').forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // milisegundos
        const step = Math.ceil(target / (duration / 16));
        
        let current = 0;
        const update = () => {
            current += step;
            if (current < target) {
                counter.innerText = current;
                requestAnimationFrame(update);
            } else {
                counter.innerText = target;
            }
        };
        update();
    });
}


// ==========================================
// 5. COLOR LAB - Cambio de Color del Auto
// ==========================================
function changeCarColor(color, name, btn) {
    const stage = document.getElementById('carStage');
    const colorName = document.getElementById('colorName');
    
    if (stage) {
        stage.style.background = color;
        stage.style.setProperty('--glow-color', color);
    }
    
    if (colorName) {
        colorName.innerText = name;
    }
    
    // Gestionar botones activos
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
}

// Cambio de Acabado (Finish)
function setFinish(type, btn) {
    const stage = document.getElementById('carStage');
    
    if (stage) {
        // Remover todas las clases de acabado previas
        stage.classList.remove('finish-matte', 'finish-metallic', 'finish-pearl');
        
        // Añadir la nueva clase (si no es standard)
        if (type !== 'standard') {
            stage.classList.add('finish-' + type);
        }
    }
    
    // Gestionar botones activos
    document.querySelectorAll('.finish-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
}


// ==========================================
// 6. BEFORE/AFTER SLIDER
// ==========================================
function moveSlider(val) {
    const imgAfter = document.getElementById('imgAfter');
    const handle = document.getElementById('sliderHandle');

    if (imgAfter) {
        imgAfter.style.width = val + "%";
    }
    
    if (handle) {
        handle.style.left = val + "%";
    }
}


// ==========================================
// 7. PRICING CALCULATOR
// ==========================================

// Función de selección de partes
window.togglePart = function(btn, price, namePart) {
    // Cambiar aspecto visual
    btn.classList.toggle('selected');
    
    // Detectar si acabamos de seleccionar o deseleccionar
    const isSelected = btn.classList.contains('selected');

    if (isSelected) {
        // SUMAR
        totalEstimate += price;
        selectedParts.push({ name: namePart, price: price });
    } else {
        // RESTAR
        totalEstimate -= price;
        // Eliminar el elemento del array
        selectedParts = selectedParts.filter(item => item.name !== namePart);
    }

    // Actualizar la pantalla
    updateDisplay();
};

// Función para actualizar la pantalla del calculador
function updateDisplay() {
    const priceElement = document.getElementById('totalPrice');
    const listElement = document.getElementById('selectedList');

    if (priceElement) {
        priceElement.innerText = totalEstimate;
    }

    if (listElement) {
        if (selectedParts.length === 0) {
            listElement.innerHTML = '<li>Nessuna parte selezionata...</li>';
        } else {
            // Generar la lista HTML
            listElement.innerHTML = selectedParts
                .map(part => `<li style="display:flex; justify-content:space-between; margin-bottom:5px;">
                                <span>${part.name}</span> 
                                <span style="color:white;">€${part.price}</span>
                        </li>`)
                .join('');
        }
    }
}

// Función de reserva por WhatsApp desde el calculador
window.bookEstimate = function() {
    // Validación: Si es 0, avisar
    if (totalEstimate === 0) {
        alert("Per favore, seleziona almeno una parte dell'auto prima di prenotare.");
        return;
    }

    // Número de WhatsApp (actualizar con tu número real)
    const numeroTaller = "391234567890"; 

    // Crear lista para el mensaje
    const listaTexto = selectedParts
        .map(p => `- ${p.name} (€${p.price})`)
        .join('%0A'); // %0A es el salto de línea en WhatsApp

    // Mensaje final
    const mensaje = 
        `🤖 *Nuovo Preventivo Online*%0A` +
        `Ho usato il calcolatore sul sito:%0A%0A` +
        `${listaTexto}%0A` +
        `------------------%0A` +
        `💰 *Stima Totale: €${totalEstimate}*%0A%0A` +
        `Vorrei prenotare un appuntamento per confermare il prezzo.`;

    // Abrir WhatsApp
    window.open(`https://wa.me/${numeroTaller}?text=${mensaje}`, '_blank');
};


// ==========================================
// 8. MODAL SYSTEM
// ==========================================
function toggleModal() {
    const modal = document.getElementById('bookingModal');
    
    if (!modal) return;
    
    if (modal.classList.contains('modal-active')) {
        modal.classList.remove('modal-active');
        setTimeout(() => modal.style.display = 'none', 300);
    } else {
        modal.style.display = 'flex';
        // Pequeño delay para permitir que display flex se aplique antes de la transición
        setTimeout(() => modal.classList.add('modal-active'), 10);
    }
}


// ==========================================
// 9. FAQ ACCORDION
// ==========================================
function toggleFaq(element) {
    // Buscar el contenedor padre (.faq-item)
    const item = element.parentElement;
    const answer = item.querySelector('.faq-answer');
    
    if (!item || !answer) return;
    
    // Alternar la clase activo
    item.classList.toggle('active');
    
    // Calcular la altura para la animación
    if (item.classList.contains('active')) {
        // Si se abre, la altura es igual al contenido
        answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
        // Si se cierra, altura cero
        answer.style.maxHeight = "0";
    }
}


// ==========================================
// 10. COOKIE BANNER
// ==========================================
function acceptCookies() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.classList.remove('show');
        banner.style.display = 'none';
    }
    localStorage.setItem('novaCookieConsent', 'accepted');
    console.log("Cookies aceptadas correctamente.");
}

function rejectCookies() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.classList.remove('show');
        banner.style.display = 'none';
    }
    localStorage.setItem('novaCookieConsent', 'rejected');
    console.log("Cookies rechazadas.");
}

// Mostrar el banner al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    // Verificar si ya hay una decisión guardada
    const decision = localStorage.getItem('novaCookieConsent');
    
    if (!decision) {
        // Si no hay decisión, mostrar el banner tras 2 segundos
        setTimeout(() => {
            const banner = document.getElementById('cookie-banner');
            if (banner) {
                banner.classList.add('show');
                banner.style.display = 'flex';
            }
        }, 2000);
    }
});


// ==========================================
// 11. WHATSAPP INTEGRATION (Modal Form)
// ==========================================
function enviarWhatsapp(e) {
    e.preventDefault(); // Evitar que se recargue la página

    // Recoger los datos del formulario
    const nombre = document.getElementById('wa_nombre')?.value || '';
    const telefono = document.getElementById('wa_telefono')?.value || '';
    const servicio = document.getElementById('wa_servicio')?.value || '';
    const mensaje = document.getElementById('wa_mensaje')?.value || '';

    // Número de WhatsApp (actualizar con tu número real)
    const numeroTaller = "391234567890"; 

    // Crear el mensaje
    const texto = 
        `👋 Ciao Carrozzeria Nova, vorrei un preventivo.%0A%0A` +
        `👤 *Nome:* ${nombre}%0A` +
        `📞 *Telefono:* ${telefono}%0A` +
        `🚗 *Servizio:* ${servicio}%0A` +
        `📝 *Note:* ${mensaje}`;

    // Abrir WhatsApp
    window.open(`https://wa.me/${numeroTaller}?text=${texto}`, '_blank');

    // Cerrar modal (intentar)
    try { 
        toggleModal(); 
    } catch(err) {
        console.log('No se pudo cerrar el modal automáticamente');
    }
}


// ==========================================
// 12. STATUS CHECKER (Horario de Apertura)
// ==========================================
function checkStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Domingo, 6 = Sábado
    const hour = now.getHours();
    
    let isOpen = false;
    
    // Lunes a Viernes 08:00-18:00
    if (day >= 1 && day <= 5 && hour >= 8 && hour < 18) {
        isOpen = true;
    }
    
    // Sábado 09:00-12:00
    if (day === 6 && hour >= 9 && hour < 12) {
        isOpen = true;
    }

    const badge = document.getElementById('status-badge');
    if (badge) {
        if (isOpen) {
            badge.style.background = '#d4edda';
            badge.style.color = '#155724';
            badge.innerText = '● APERTO';
        } else {
            badge.style.background = '#f8d7da';
            badge.style.color = '#721c24';
            badge.innerText = '● CHIUSO';
        }
    }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', checkStatus);


// ==========================================
// 13. MOBILE MENU
// ==========================================
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}


// ==========================================
// 14. 3D TILT EFFECTS (Service Cards)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.tilt-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Máximo 10 grados
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
        });
    });
});


// ==========================================
// FIN DEL SCRIPT
// ==========================================
console.log('D&M Carrozzeria - Sistema cargado correctamente ✓');