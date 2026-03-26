// ========== MOBILE MENU TOGGLE ==========
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');
const navLinkItems = document.querySelectorAll('.nav-link');

function toggleMenu() {
    navLinks.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
}

// ========== SMOOTH SCROLL & ACTIVE LINK ==========
function updateActiveLink(currentHash) {
    navLinkItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentHash) {
            link.classList.add('active');
        }
    });
}

navLinkItems.forEach(link => {
    link.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active')) {
            toggleMenu();
        }
        
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                updateActiveLink(targetId);
            }
        }
    });
});

// ========== INTERSECTION OBSERVER FOR ACTIVE LINK ==========
const sections = document.querySelectorAll('section, .hero');
const options = { threshold: 0.4, rootMargin: "-70px 0px -20px 0px" };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            if (currentId) {
                updateActiveLink(`#${currentId}`);
            }
        }
    });
}, options);

sections.forEach(section => {
    if (section.id) observer.observe(section);
});

// ========== BUTTON HANDLERS ==========
const heroContactBtn = document.getElementById('heroContactBtn');
if (heroContactBtn) {
    heroContactBtn.addEventListener('click', () => {
        const contactSec = document.getElementById('contact');
        if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
        updateActiveLink('#contact');
    });
}

const heroDownloadBtn = document.getElementById('heroDownloadBtn');
if (heroDownloadBtn) {
    heroDownloadBtn.addEventListener('click', () => {
        const downloadSec = document.getElementById('download');
        if (downloadSec) downloadSec.scrollIntoView({ behavior: 'smooth' });
        updateActiveLink('#download');
    });
}

// ========== COPY EMAIL FUNCTION ==========
const copyMailBtn = document.getElementById('copyMailBtn');
if (copyMailBtn) {
    copyMailBtn.addEventListener('click', () => {
        const emailText = "support@agentsycode.com";
        navigator.clipboard.writeText(emailText).then(() => {
            const originalText = copyMailBtn.innerHTML;
            copyMailBtn.innerHTML = 'تم النسخ! ✅';
            setTimeout(() => {
                copyMailBtn.innerHTML = originalText;
            }, 2000);
        }).catch(() => {
            alert("تعذر النسخ، يرجى المحاولة يدوياً.");
        });
    });
}

// ========== DOWNLOAD BADGES HANDLER ==========
const badges = document.querySelectorAll('.badge');
badges.forEach(badge => {
    badge.addEventListener('click', () => {
        alert("سيتم توجيهك إلى متجر التطبيقات قريبًا. شكراً لاهتمامك!");
    });
});

// ========== CLOSE MENU ON RESIZE ==========
window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        toggleMenu();
    }
});

// ========== SET ACTIVE LINK ON LOAD ==========
setTimeout(() => {
    const currentActive = document.querySelector('.nav-link[href="#home"]');
    if (currentActive) currentActive.classList.add('active');
}, 100);

console.log('✅ الموقع يعمل بشكل صحيح مع دعم اللغة العربية');
