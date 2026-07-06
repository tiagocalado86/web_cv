/* =========================================================
   Tiago Calado — Web CV
   Theme toggle · footer year · scroll reveal
   ========================================================= */

(function () {
	'use strict';

	const root = document.documentElement;
	const STORAGE_KEY = 'tc-cv-theme';

	/* ---------- Always open at the very top ---------- */
	if ('scrollRestoration' in history) {
		history.scrollRestoration = 'manual';
	}
	window.scrollTo(0, 0);
	window.addEventListener('load', function () {
		window.scrollTo(0, 0);
	});

	/* ---------- Theme ---------- */
	function getPreferredTheme() {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === 'light' || stored === 'dark') return stored;
		return window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';
	}

	function applyTheme(theme) {
		root.setAttribute('data-theme', theme);
	}

	applyTheme(getPreferredTheme());

	const toggle = document.getElementById('theme-toggle');
	if (toggle) {
		toggle.addEventListener('click', function () {
			const next =
				root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
			applyTheme(next);
			localStorage.setItem(STORAGE_KEY, next);
		});
	}

	// Follow the OS theme if the user hasn't chosen one explicitly.
	window
		.matchMedia('(prefers-color-scheme: dark)')
		.addEventListener('change', function (e) {
			if (!localStorage.getItem(STORAGE_KEY)) {
				applyTheme(e.matches ? 'dark' : 'light');
			}
		});

	/* ---------- Brand → very top ---------- */
	const brand = document.querySelector('.topbar__brand');
	if (brand) {
		brand.addEventListener('click', function (e) {
			e.preventDefault();
			const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
		});
	}

	/* ---------- Footer year ---------- */
	const yearEl = document.getElementById('year');
	if (yearEl) yearEl.textContent = String(new Date().getFullYear());

	/* ---------- Scroll progress bar ---------- */
	const progress = document.getElementById('scroll-progress');
	if (progress) {
		let ticking = false;
		const updateProgress = function () {
			const doc = document.documentElement;
			const max = doc.scrollHeight - doc.clientHeight;
			const ratio = max > 0 ? doc.scrollTop / max : 0;
			progress.style.transform = 'scaleX(' + ratio + ')';
			ticking = false;
		};
		updateProgress();
		window.addEventListener(
			'scroll',
			function () {
				if (!ticking) {
					ticking = true;
					window.requestAnimationFrame(updateProgress);
				}
			},
			{ passive: true }
		);
	}

	/* ---------- Scroll reveal ---------- */
	const revealEls = document.querySelectorAll('.reveal');

	if (!('IntersectionObserver' in window)) {
		revealEls.forEach((el) => el.classList.add('is-visible'));
		return;
	}

	const observer = new IntersectionObserver(
		function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
	);

	revealEls.forEach((el) => observer.observe(el));
})();
