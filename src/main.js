// Main JS (Vanilla)
// - year in footer
// - smooth scroll for internal anchors (home sections)
// - contact form mailto fallback + subject prefill

document.addEventListener('DOMContentLoaded', () => {
	// Footer year
	const yearEl = document.getElementById('year');
	if (yearEl) yearEl.textContent = String(new Date().getFullYear());

	// Smooth scroll for in-page anchors (and "/#anchor" links when already on home)
	const smoothSelectors = [
		'a[href^="#"]',
		'a[href^="/#"]'
	];
	document.querySelectorAll(smoothSelectors.join(',')).forEach(link => {
		link.addEventListener('click', (e) => {
			const href = link.getAttribute('href') || '';
			// If it's "/#..." and we're not on home, allow navigation
			if (href.startsWith('/#') && window.location.pathname !== '/' && !window.location.pathname.endsWith('/index.html')) return;

			const id = href.replace('/#', '#');
			if (!id.startsWith('#') || id.length <= 1) return;

			const target = document.querySelector(id);
			if (!target) return;

			e.preventDefault();
			const nav = document.querySelector('.yes-navbar');
			const offset = nav ? nav.offsetHeight + 12 : 0;
			const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

			window.scrollTo({ top, behavior: 'smooth' });

			// Collapse mobile menu
			const navCollapse = document.querySelector('.navbar-collapse');
			if (navCollapse && navCollapse.classList.contains('show')) {
				const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse);
				bsCollapse.hide();
			}
		});
	});

	// Contact form
	const form = document.getElementById('contactForm');
	const statusEl = document.getElementById('formStatus');
	const mailtoFallback = document.getElementById('mailtoFallback');

	const setStatus = (text) => { if (statusEl) statusEl.textContent = text || ''; };

	const buildMailto = (data) => {
		const subject = `Richiesta info — ${data.topic || 'YES'}`;
		const lines = [
			`Nome: ${data.name}`,
			`Email: ${data.email}`,
			`Azienda: ${data.company || '-'}`,
			`Tema: ${data.topic}`,
			'',
			data.message
		];
		const body = lines.join('\n');
		return `mailto:sales@youremotionalsales.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
	};

	const applySubjectFromButtons = () => {
		document.querySelectorAll('[data-subject]').forEach(btn => {
			btn.addEventListener('click', () => {
				const subject = btn.getAttribute('data-subject');
				const topic = document.getElementById('topic');
				if (subject && topic) {
					// Set matching option, if present
					Array.from(topic.options).forEach(opt => {
						if (opt.text.trim() === subject.trim()) opt.selected = true;
					});
				}
			});
		});
	};

	applySubjectFromButtons();

	if (mailtoFallback) {
		mailtoFallback.addEventListener('click', (e) => {
			e.preventDefault();
			if (!form) return;

			const data = Object.fromEntries(new FormData(form).entries());
			window.location.href = buildMailto(data);
		});
	}

	if (!form) return;

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		setStatus('');

		// Basic validation
		if (!form.checkValidity()) {
			form.classList.add('was-validated');
			setStatus('Controlla i campi evidenziati.');
			return;
		}

		const data = Object.fromEntries(new FormData(form).entries());
		const mailto = buildMailto(data);

		setStatus('Apro il client email…');
		window.location.href = mailto;

		// Reset (soft)
		setTimeout(() => {
			form.reset();
			form.classList.remove('was-validated');
			setStatus('');
		}, 600);
	});
});
