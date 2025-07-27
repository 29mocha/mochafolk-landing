// Menunggu hingga seluruh konten halaman dimuat sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', () => {
    
    // Inisialisasi ikon Lucide
    lucide.createIcons();

    // --- LOGIKA ANIMASI JARINGAN PARTIKEL (CONSTELLATION) ---
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let mouse = { x: null, y: null, radius: (canvas.height / 100) * (canvas.width / 100) };
    window.addEventListener('mousemove', (event) => { mouse.x = event.x; mouse.y = event.y; });
    window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
    class Particle {
        constructor(x, y, directionX, directionY, size, color) { this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color; }
        draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill(); }
        update() { if (this.x > canvas.width || this.x < 0) { this.directionX = -this.directionX; } if (this.y > canvas.height || this.y < 0) { this.directionY = -this.directionY; } this.x += this.directionX; this.y += this.directionY; this.draw(); }
    }
    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 12000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 1.5) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = 'rgba(229, 231, 235, 0.5)';
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width/7) * (canvas.height/7)) {
                    opacityValue = 1 - (distance/20000);
                    ctx.strokeStyle = `rgba(164, 126, 101, ${opacityValue})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    function animate() { requestAnimationFrame(animate); ctx.clearRect(0, 0, innerWidth, innerHeight); for (let i = 0; i < particlesArray.length; i++) { particlesArray[i].update(); } connect(); }
    window.addEventListener('resize', () => { canvas.width = innerWidth; canvas.height = innerHeight; mouse.radius = (canvas.height / 100) * (canvas.width / 100); init(); });
    init();
    animate();

    // --- LOGIKA UNTUK NAVIGASI SCROLL-SPY ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').substring(1) === entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 });
    sections.forEach(section => observer.observe(section));

    // --- FUNGSI BARU UNTUK EFEK HOVER JUDUL (SPOTLIGHT) ---
    function setupHeadlineHoverEffect() {
        const headline = document.getElementById('main-headline');
        if (!headline) return;

        headline.addEventListener('mousemove', (e) => {
            const rect = headline.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Mengatur posisi 'cahaya'
            headline.style.setProperty('--x', `${(x / rect.width) * 100}%`);
            headline.style.setProperty('--y', `${(y / rect.height) * 100}%`);
        });

        // Saat kursor masuk, perbesar ukuran 'cahaya'
        headline.addEventListener('mouseenter', () => {
            headline.style.setProperty('--spotlight-size', '150px');
        });

        // Saat kursor keluar, kecilkan ukuran 'cahaya' menjadi 0 agar menghilang
        headline.addEventListener('mouseleave', () => {
            headline.style.setProperty('--spotlight-size', '0px');
        });
    }

    // Panggil fungsi efek hover
    setupHeadlineHoverEffect();
});
