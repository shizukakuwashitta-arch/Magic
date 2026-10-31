document.addEventListener('DOMContentLoaded', () => {
    const landing = document.getElementById('landing');
    const birthdayContent = document.getElementById('birthdayContent');
    const continueButton = document.getElementById('continueBtn');
    const finalMessageButton = document.getElementById('finalMessageBtn');
    const finalMessage = document.getElementById('finalMessage');
    const celebrateButton = document.getElementById('celebrateBtn');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    createStars();

    continueButton.addEventListener('click', () => {
        landing.classList.add('landing-leaving');
        window.setTimeout(() => {
            landing.hidden = true;
            birthdayContent.inert = false;
            birthdayContent.setAttribute('aria-hidden', 'false');
            birthdayContent.classList.add('birthday-content-visible');
            triggerConfetti(150);
            document.getElementById('reveal').scrollIntoView({
                behavior: reducedMotion.matches ? 'instant' : 'smooth'
            });
        }, reducedMotion.matches ? 0 : 450);
    });

    document.querySelectorAll('.sister-card').forEach((card) => {
        card.addEventListener('click', () => {
            const isExpanded = card.getAttribute('aria-expanded') === 'true';
            card.setAttribute('aria-expanded', String(!isExpanded));
            card.classList.toggle('is-open', !isExpanded);
        });
    });

    finalMessageButton.addEventListener('click', () => {
        const isOpen = finalMessageButton.getAttribute('aria-expanded') === 'true';
        finalMessageButton.setAttribute('aria-expanded', String(!isOpen));
        finalMessage.hidden = isOpen;
        if (!isOpen) {
            finalMessage.classList.add('message-visible');
            window.setTimeout(() => finalMessage.scrollIntoView({
                behavior: reducedMotion.matches ? 'instant' : 'smooth',
                block: 'center'
            }), 80);
        } else {
            finalMessage.classList.remove('message-visible');
        }
    });

    celebrateButton.addEventListener('click', () => triggerConfetti(220));

    window.addEventListener('resize', resizeCanvas, { passive: true });

    function createStars() {
        const starfield = document.getElementById('starfield');
        const fragment = document.createDocumentFragment();
        const count = window.innerWidth < 600 ? 32 : 58;

        for (let i = 0; i < count; i += 1) {
            const star = document.createElement('span');
            star.className = 'star';
            star.style.setProperty('--x', `${Math.random() * 100}%`);
            star.style.setProperty('--y', `${Math.random() * 100}%`);
            star.style.setProperty('--delay', `${Math.random() * -8}s`);
            star.style.setProperty('--duration', `${3 + Math.random() * 5}s`);
            star.style.setProperty('--size', `${1 + Math.random() * 2}px`);
            fragment.appendChild(star);
        }
        starfield.appendChild(fragment);
    }

    function resizeCanvas() {
        const canvas = document.getElementById('confetti');
        const context = canvas.getContext('2d');
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = window.innerWidth * pixelRatio;
        canvas.height = window.innerHeight * pixelRatio;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function triggerConfetti(count) {
        if (reducedMotion.matches) return;

        const canvas = document.getElementById('confetti');
        const context = canvas.getContext('2d');
        resizeCanvas();
        const pieces = Array.from({ length: count }, () => ({
            x: Math.random() * window.innerWidth,
            y: -Math.random() * window.innerHeight * 0.6,
            velocityX: (Math.random() - 0.5) * 3.8,
            velocityY: 2 + Math.random() * 4,
            size: 3 + Math.random() * 5,
            rotation: Math.random() * Math.PI,
            rotationSpeed: (Math.random() - 0.5) * 0.12,
            color: ['#f3f8ff', '#85c9ff', '#4b91d2', '#d2eaff', '#6388ff'][Math.floor(Math.random() * 5)]
        }));

        let frame = 0;
        function animate() {
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);
            let remaining = 0;
            pieces.forEach((piece) => {
                if (piece.y < window.innerHeight + 20) {
                    remaining += 1;
                    piece.x += piece.velocityX;
                    piece.y += piece.velocityY;
                    piece.velocityY += 0.025;
                    piece.rotation += piece.rotationSpeed;
                    context.save();
                    context.translate(piece.x, piece.y);
                    context.rotate(piece.rotation);
                    context.fillStyle = piece.color;
                    context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 1.8);
                    context.restore();
                }
            });
            frame += 1;
            if (remaining > 0 && frame < 360) {
                window.requestAnimationFrame(animate);
            } else {
                context.clearRect(0, 0, window.innerWidth, window.innerHeight);
            }
        }
        window.requestAnimationFrame(animate);
    }
});
