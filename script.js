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
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // don't let this bubble up and open the modal
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

// Project modal: click a card to see a bigger view of its screenshots
(function () {
    const modal = document.getElementById('projectModal');
    if (!modal) return;

    const modalShot = modal.querySelector('.modal-shot');
    const modalTitle = modal.querySelector('.modal-title');
    const modalRole = modal.querySelector('.modal-role');
    const modalDesc = modal.querySelector('.modal-desc');
    const modalButtons = modal.querySelector('.modal-shot-buttons');
    const modalTags = modal.querySelector('.modal-tags');

    let lastFocused = null;

    function openModal(card) {
        const shots = [...card.querySelectorAll('.project-shot')];
        const title = card.querySelector('.project-info h3')?.textContent || '';
        const role = card.querySelector('.project-role')?.textContent || '';
        const desc = card.querySelector('.project-desc')?.textContent.trim() || '';
        const tags = [...card.querySelectorAll('.project-tags li')].map(li => li.textContent);
        const currentShot = card.querySelector('.project-shot.is-visible') || shots[0];

        modalTitle.textContent = title;
        modalRole.textContent = role;
        modalDesc.textContent = desc;
        modalShot.src = currentShot.src;
        modalShot.alt = currentShot.alt;

        modalTags.innerHTML = '';
        tags.forEach(t => {
            const li = document.createElement('li');
            li.textContent = t;
            modalTags.appendChild(li);
        });

        modalButtons.innerHTML = '';
        shots.forEach(shot => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = shot.alt.split(',')[0] || `View ${shot.dataset.shot}`;
            btn.classList.toggle('is-current', shot === currentShot);
            btn.addEventListener('click', () => {
                modalShot.src = shot.src;
                modalShot.alt = shot.alt;
                modalButtons.querySelectorAll('button').forEach(b => b.classList.remove('is-current'));
                btn.classList.add('is-current');
            });
            modalButtons.appendChild(btn);
        });

        lastFocused = document.activeElement;
        modal.classList.add('is-open');
        document.body.classList.add('modal-open');
        modal.querySelector('.modal-close').focus();
    }

    function closeModal() {
        modal.classList.remove('is-open');
        document.body.classList.remove('modal-open');
        if (lastFocused) lastFocused.focus();
    }

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // don't open the modal if a shot-switch button was clicked
            if (e.target.closest('.shot-btn')) return;
            openModal(card);
        });
    });

    modal.querySelectorAll('[data-close]').forEach(el => {
        el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
})();