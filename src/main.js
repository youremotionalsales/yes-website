(function($) {
	'use strict';
	const EMAIL_TO = 'hello@youremotionalsales.it';
	const $win = $(window);
	const $navbar = $('#mainNavbar');

	function setYear() {
		$('#year').text(new Date().getFullYear());
	}

	function toggleNavbarScrolled() {
		const scrolled = $win.scrollTop() > 12;
		$navbar.toggleClass('is-scrolled', scrolled);
	}

	function closeMobileNav() {
		const el = document.getElementById('navLinks');
		if (!el) return;
		const isShown = el.classList.contains('show');
		if (isShown) {
			const instance = bootstrap.Collapse.getOrCreateInstance(el);
			instance.hide();
		}
	}

	function smoothScrollTo(hash) {
		const $target = $(hash);
		if (!$target.length) return;
		const offset = 84; // navbar height approx
		const top = Math.max(0, $target.offset().top - offset);
		$('html, body').stop().animate({
			scrollTop: top
		}, 450);
	}

	function applySubjectFromButtons() {
		$('[data-subject]').on('click', function() {
			const subject = $(this).data('subject');
			if (!subject) return;
			$('#topic').val(subject).trigger('change');
		});
	}

	function updateMailtoFallback() {
		const name = ($('#name').val() || '').trim();
		const email = ($('#email').val() || '').trim();
		const company = ($('#company').val() || '').trim();
		const topic = ($('#topic').val() || '').trim();
		const message = ($('#message').val() || '').trim();
		const subject = topic ? `YES — ${topic}` : 'YES — Contatto';
		const bodyLines = [`Nome: ${name || '-'}`, `Email: ${email || '-'}`, `Azienda: ${company || '-'}`, '',
			(message || '').trim()
		];
		const href = `mailto:${encodeURIComponent(EMAIL_TO)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
		$('#mailtoFallback').attr('href', href);
	}

	function isValidEmail(value) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
	}

	function initContactForm() {
		const $form = $('#contactForm');
		const $status = $('#formStatus');
		$form.on('input change', 'input, textarea, select', updateMailtoFallback);
		updateMailtoFallback();
		$form.on('submit', function(e) {
			e.preventDefault();
			$status.text('');
			const name = ($('#name').val() || '').trim();
			const email = ($('#email').val() || '').trim();
			const topic = ($('#topic').val() || '').trim();
			const message = ($('#message').val() || '').trim();
			// reset UI
			$form.find('.is-invalid').removeClass('is-invalid');
			let ok = true;
			if (!name) {
				$('#name').addClass('is-invalid');
				ok = false;
			}
			if (!email || !isValidEmail(email)) {
				$('#email').addClass('is-invalid');
				ok = false;
			}
			if (!topic) {
				$('#topic').addClass('is-invalid');
				ok = false;
			}
			if (!message) {
				$('#message').addClass('is-invalid');
				ok = false;
			}
			if (!ok) {
				$status.text('Controlla i campi evidenziati.');
				return;
			}
			updateMailtoFallback();
			$status.text('Apro il tuo client email…');
			window.location.href = $('#mailtoFallback').attr('href');
		});
	}

	function initNavLinks() {
		$(document).on('click', 'a.nav-link[href^="#"], a[href^="#top"], a.btn[href^="#"]', function(e) {
			const href = $(this).attr('href');
			if (!href || href === '#') return;
			if (href.startsWith('#')) {
				e.preventDefault();
				closeMobileNav();
				smoothScrollTo(href);
			}
		});
	}

	function refreshScrollSpy() {
		const spyEl = document.body;
		const spy = bootstrap.ScrollSpy.getInstance(spyEl);
		if (spy) spy.refresh();
	}
	$(function() {
		setYear();
		toggleNavbarScrolled();
		applySubjectFromButtons();
		initContactForm();
		initNavLinks();
		refreshScrollSpy();
		$win.on('scroll', toggleNavbarScrolled);
		$win.on('resize', refreshScrollSpy);
	});
})(jQuery);
