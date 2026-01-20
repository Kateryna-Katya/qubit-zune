// ==========================================
// 1. ИНИЦИАЛИЗАЦИЯ (Иконки и плавный скролл)
// ==========================================
lucide.createIcons();

const lenis = new Lenis();
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ==========================================
// 2. МОБИЛЬНОЕ МЕНЮ
// ==========================================
const burger = document.getElementById('burger');
const overlay = document.getElementById('menu-overlay');
const menuLinks = document.querySelectorAll('.menu-link');

burger.addEventListener('click', () => {
    const isActive = burger.classList.toggle('is-active');
    overlay.classList.toggle('is-active');

    if (isActive) {
        overlay.style.display = 'flex';
        gsap.to('.menu-overlay__bg', { y: '0%', duration: 0.5, ease: 'power2.inOut' });
        gsap.to('.menu-link', { opacity: 1, y: 0, stagger: 0.1, delay: 0.2 });
        document.body.style.overflow = 'hidden';
    } else {
        gsap.to('.menu-overlay__bg', { y: '-100%', duration: 0.5, ease: 'power2.inOut', onComplete: () => {
            overlay.style.display = 'none';
        }});
        gsap.set('.menu-link', { opacity: 0, y: 30 });
        document.body.style.overflow = '';
    }
});

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('is-active');
        overlay.classList.remove('is-active');
        gsap.to('.menu-overlay__bg', { y: '-100%', duration: 0.4 });
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    });
});

// ==========================================
// 3. HERO ANIMATION (Только по словам)
// ==========================================
// SplitType разбивает текст на слова
const heroTitle = new SplitType('#hero-title', { types: 'words' });

// Оборачиваем каждое слово во внутренний span для эффекта "выплывания"
heroTitle.words.forEach(word => {
    const text = word.innerText;
    word.innerHTML = `<span class="hero-word-inner" style="display: inline-block;">${text}</span>`;
});

const heroTl = gsap.timeline({ delay: 0.4 });

heroTl.from('.hero-word-inner', {
    y: '110%',
    duration: 1,
    stagger: 0.1,
    ease: 'power4.out'
})
.from(['.hero__badge', '.hero__text', '.hero__actions'], {
    opacity: 0,
    y: 20,
    stagger: 0.15,
    duration: 0.8
}, '-=0.6');

// Легкая анимация фона Hero (оставляем для динамики)
gsap.to('.hero__nodes circle', {
    r: '+=2',
    opacity: 0.5,
    duration: 2,
    repeat: -1,
    yoyo: true,
    stagger: 0.2
});

// ==========================================
// 4. COOKIE POPUP
// ==========================================
const cookiePopup = document.getElementById('cookie-popup');
const cookieAccept = document.getElementById('cookie-accept');

if (!localStorage.getItem('qubit_cookies_accepted')) {
    setTimeout(() => {
        cookiePopup.style.display = 'flex';
        gsap.from(cookiePopup, { y: 50, opacity: 0, duration: 0.5 });
    }, 2000);
}

cookieAccept.onclick = () => {
    localStorage.setItem('qubit_cookies_accepted', 'true');
    gsap.to(cookiePopup, { opacity: 0, y: 20, onComplete: () => cookiePopup.style.display = 'none' });
};

// ==========================================
// 5. ФОРМА КОНТАКТОВ (Валидация и Капча)
// ==========================================
const contactForm = document.getElementById('ai-contact-form');
const phoneInput = document.getElementById('user-phone');
const captchaLabel = document.getElementById('captcha-question');
const captchaInput = document.getElementById('captcha');
let captchaResult;

function generateCaptcha() {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    captchaResult = a + b;
    if(captchaLabel) captchaLabel.innerText = `${a} + ${b} = ?`;
}
generateCaptcha();

if(phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (parseInt(captchaInput.value) !== captchaResult) {
            alert('Неверный ответ капчи');
            generateCaptcha();
            return;
        }

        const btn = contactForm.querySelector('button');
        btn.disabled = true;
        btn.innerHTML = 'Отправка...';

        setTimeout(() => {
            contactForm.style.display = 'none';
            document.getElementById('contact-success').style.display = 'flex';
        }, 1500);
    });
}