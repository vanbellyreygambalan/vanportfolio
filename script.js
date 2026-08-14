// 3D tilt hover effect for elements marked with [data-tilt]
document.querySelectorAll('[data-tilt]').forEach((el) => {
    const maxTilt = 10; // degrees — lower than a demo card since this is a profile photo

    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const px = x / rect.width;
        const py = y / rect.height;

        const rotateY = (px - 0.5) * (maxTilt * 2);
        const rotateX = (0.5 - py) * (maxTilt * 2);

        el.style.setProperty('--r-x', `${rotateY}deg`);
        el.style.setProperty('--r-y', `${rotateX}deg`);
        el.style.setProperty('--w-x', `${px * 100}%`);
        el.style.setProperty('--w-y', `${py * 100}%`);
    });

    el.addEventListener('mouseleave', () => {
        el.style.setProperty('--r-x', `0deg`);
        el.style.setProperty('--r-y', `0deg`);
    });

    // Press/tap support so the image swap also works on touch devices,
    // where :hover doesn't reliably apply.
    el.addEventListener('pointerdown', () => el.classList.add('is-active'));
    el.addEventListener('pointerup', () => el.classList.remove('is-active'));
    el.addEventListener('pointerleave', () => el.classList.remove('is-active'));
    el.addEventListener('pointercancel', () => el.classList.remove('is-active'));
});

// Project cards: switch the visible screenshot when a shot button is
// clicked, and reveal the overlay on tap/press for touch devices.
document.querySelectorAll('.project-card').forEach((card) => {
    const shots = card.querySelectorAll('.project-shot');
    const buttons = card.querySelectorAll('.shot-btn');

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;

            buttons.forEach((b) => b.classList.toggle('is-current', b === btn));
            shots.forEach((shot) => shot.classList.toggle('is-visible', shot.dataset.shot === target));
        });
    });

    card.addEventListener('pointerdown', () => card.classList.add('is-touched'));
    card.addEventListener('pointerup', () => card.classList.remove('is-touched'));
    card.addEventListener('pointerleave', () => card.classList.remove('is-touched'));
    card.addEventListener('pointercancel', () => card.classList.remove('is-touched'));
});