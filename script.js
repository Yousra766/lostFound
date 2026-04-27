// 1. Scroll progress logic
const sp = document.getElementById('sp');
window.addEventListener('scroll', () => {
    const p = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    if (sp) sp.style.width = p + '%';
}, { passive: true });

// 2. Reveal elements on scroll (Intersection Observer)
const obsOptions = {
    threshold: 0.12
};

const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        
        const delay = parseInt(e.target.dataset.delay || 0);
        setTimeout(() => {
            e.target.classList.add('in');
        }, delay);
        
        obs.unobserve(e.target);
    });
}, obsOptions);

document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// 3. About paragraphs staggered animation
const abody = document.getElementById('abody');
if (abody) {
    const aObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            
            const paragraphs = e.target.querySelectorAll('p');
            paragraphs.forEach((p, i) => {
                setTimeout(() => p.classList.add('in'), i * 130);
            });
            
            aObs.unobserve(e.target);
        });
    }, { threshold: 0.2 });

    aObs.observe(abody);
}

// 4. Hero icons logic (stagger entrance then drift)
// Note: This part assumes you have elements with class '.hi'
const icons = document.querySelectorAll('.hi');
if (icons.length > 0) {
    icons.forEach((el, i) => {
        el.style.animationDelay = (0.25 + i * 0.07) + 's';
        el.style.animationDuration = '0.45s';
    });

    setTimeout(() => {
        icons.forEach((el, i) => {
            el.style.animation = `iconDrift ${3.2 + (i % 4) * 0.5}s ease-in-out infinite`;
            el.style.animationDelay = (i * 0.15) + 's';
            el.style.opacity = '1';
        });
    }, 1600);
}