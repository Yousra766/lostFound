// Scroll progress bar
const sp = document.getElementById('sp');
window.addEventListener('scroll', () => {
  const p = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  sp.style.width = p + '%';
}, { passive: true });

// Reveal on scroll
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const d = parseInt(e.target.dataset.delay || 0);
    setTimeout(() => e.target.classList.add('in'), d);
    obs.unobserve(e.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Hero icons stagger entrance then drift
const icons = document.querySelectorAll('.hi');
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

// About paragraphs stagger
const aObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    document.querySelectorAll('#abody p').forEach((p, i) => {
      setTimeout(() => p.classList.add('in'), i * 130);
    });
    aObs.unobserve(e.target);
  });
}, { threshold: 0.2 });
aObs.observe(document.getElementById('abody'));

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
