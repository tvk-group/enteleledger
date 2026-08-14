(function () {
  'use strict';

  const LANGS = [
    { code: 'en', name: 'English' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'it', name: 'Italiano' },
    { code: 'es', name: 'Español' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'pl', name: 'Polski' },
    { code: 'pt', name: 'Português' },
    { code: 'ro', name: 'Română' },
    { code: 'sv', name: 'Svenska' },
    { code: 'da', name: 'Dansk' },
    { code: 'fi', name: 'Suomi' },
    { code: 'cs', name: 'Čeština' },
    { code: 'sk', name: 'Slovenčina' },
    { code: 'hu', name: 'Magyar' },
    { code: 'el', name: 'Ελληνικά' },
    { code: 'bg', name: 'Български' },
    { code: 'ru', name: 'Русский' },
    { code: 'uk', name: 'Українська' },
    { code: 'ar', name: 'العربية', rtl: true },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'hi', name: 'हिन्दी' }
  ];

  const RECORD_SAMPLES = {
    identity: [
      { badge: 'ID', text: 'Q-Presence Credential #QP-2847' },
      { badge: 'ID', text: 'Biometric Attestation Record' },
      { badge: 'gold', text: 'Sovereign Identity Binding' },
      { badge: 'ID', text: 'Multi-Factor Verification Log' }
    ],
    governance: [
      { badge: 'GOV', text: 'Proposal GR-2026-041 — Infrastructure' },
      { badge: 'gold', text: 'Council Decision Record #CD-891' },
      { badge: 'GOV', text: 'Approval Chain — 4 Signatures' },
      { badge: 'GOV', text: 'Execution Archive — Complete' }
    ],
    infrastructure: [
      { badge: 'INF', text: 'Node Deployment State v4.2' },
      { badge: 'INF', text: 'Network Configuration Record' },
      { badge: 'gold', text: 'System Health Snapshot' },
      { badge: 'INF', text: 'Infrastructure Change Log' }
    ],
    proof: [
      { badge: 'PRF', text: 'ChronoSeal Timestamp #CS-99201' },
      { badge: 'gold', text: 'Cryptographic Proof Bundle' },
      { badge: 'PRF', text: 'Evidence Attestation Record' },
      { badge: 'PRF', text: 'Sovereign Proof Chain Link' }
    ],
    knowledge: [
      { badge: 'KNW', text: 'Verified Intelligence Report' },
      { badge: 'KNW', text: 'GraphVAULT Knowledge Node' },
      { badge: 'gold', text: 'SOVRA Analysis Record' },
      { badge: 'KNW', text: 'Structured Observation Archive' }
    ],
    compliance: [
      { badge: 'CMP', text: 'ISO Compliance Audit Trail' },
      { badge: 'CMP', text: 'Policy Enforcement Record' },
      { badge: 'gold', text: 'Regulatory Certification' },
      { badge: 'CMP', text: 'Compliance Review Archive' }
    ],
    security: [
      { badge: 'SEC', text: 'Access Control Event Log' },
      { badge: 'SEC', text: 'Security Incident Report' },
      { badge: 'gold', text: 'Forensic Analysis Record' },
      { badge: 'SEC', text: 'Threat Detection Archive' }
    ],
    historical: [
      { badge: 'HIS', text: 'Civilization Epoch Record' },
      { badge: 'gold', text: 'Legacy Archive — Generation I' },
      { badge: 'HIS', text: 'Historical Timeline Entry' },
      { badge: 'HIS', text: 'Permanent Memory Index' }
    ]
  };

  let currentLang = 'en';
  let flowStep = 0;

  function getNested(obj, path) {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
  }

  function applyTranslations(lang) {
    const t = window.ENTELE_I18N[lang] || window.ENTELE_I18N.en;
    currentLang = lang;

    document.documentElement.lang = lang;
    document.documentElement.dir = LANGS.find(l => l.code === lang)?.rtl ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = getNested(t, key);
      if (val === null) return;
      if (key === 'hero.sub' || key === 'core.hub') {
        el.innerHTML = String(val).replace(/\n/g, '<br>');
      } else {
        el.textContent = val;
      }
    });

    document.querySelectorAll('.lang-menu a').forEach(a => {
      a.classList.toggle('active', a.dataset.lang === lang);
    });

    localStorage.setItem('entele-lang', lang);
    updateExplorerDetail(getActiveCategory());
    if (window.ENTELE_APP && window.ENTELE_APP.applyAppI18n) {
      window.ENTELE_APP.applyAppI18n();
    }
  }

  function buildLangMenu() {
    const menu = document.getElementById('langMenu');
    LANGS.forEach(l => {
      const a = document.createElement('a');
      a.href = '#';
      a.dataset.lang = l.code;
      a.textContent = l.name;
      a.setAttribute('role', 'menuitem');
      a.addEventListener('click', e => {
        e.preventDefault();
        applyTranslations(l.code);
        menu.classList.remove('open');
      });
      menu.appendChild(a);
    });
  }

  function getActiveCategory() {
    const active = document.querySelector('.explorer-card.active');
    return active ? active.dataset.cat : 'identity';
  }

  function updateExplorerDetail(cat) {
    const t = window.ENTELE_I18N[currentLang] || window.ENTELE_I18N.en;
    const titleKey = `explorer.c${['identity','governance','infrastructure','proof','knowledge','compliance','security','historical'].indexOf(cat) + 1}`;
    const detailKey = `explorer.detail.${cat}`;

    document.getElementById('detailTitle').textContent = getNested(t, titleKey) || cat;
    document.getElementById('detailDesc').textContent = getNested(t, detailKey) || '';

    const container = document.getElementById('detailRecords');
    const samples = RECORD_SAMPLES[cat] || RECORD_SAMPLES.identity;
    const recordTexts = getNested(t, `explorer.records.${cat}`) || [];

    container.innerHTML = samples.map((s, i) => {
      const badgeClass = s.badge === 'gold' ? 'badge gold' : 'badge';
      const badgeLabel = s.badge === 'gold' ? (getNested(t, 'explorer.badge.verified') || 'VERIFIED') : s.badge;
      const text = recordTexts[i] || s.text;
      return `<div class="record-item"><span class="${badgeClass}">${badgeLabel}</span>${text}</div>`;
    }).join('');
  }

  function initExplorer() {
    document.querySelectorAll('.explorer-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.explorer-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        updateExplorerDetail(card.dataset.cat);
      });
    });
    updateExplorerDetail('identity');
  }

  function animateFlow() {
    const steps = document.querySelectorAll('.flow-step');
    steps.forEach((s, i) => s.classList.toggle('active', i === flowStep));
    flowStep = (flowStep + 1) % steps.length;
  }

  function initMemoryCorePulses() {
    const core = document.getElementById('memoryCore');
    if (!core) return;
    const hub = core.querySelector('.core-hub');
    const hubRect = () => hub.getBoundingClientRect();
    const coreRect = () => core.getBoundingClientRect();

    function spawnPulse(fromNode) {
      const pulse = document.createElement('div');
      pulse.className = 'record-pulse';
      const nodeRect = fromNode.getBoundingClientRect();
      const cRect = coreRect();
      const hRect = hubRect();

      const startX = nodeRect.left + nodeRect.width / 2 - cRect.left;
      const startY = nodeRect.top + nodeRect.height / 2 - cRect.top;
      const endX = hRect.left + hRect.width / 2 - cRect.left;
      const endY = hRect.top + hRect.height / 2 - cRect.top;

      pulse.style.left = startX + 'px';
      pulse.style.top = startY + 'px';
      core.appendChild(pulse);

      const duration = 2000;
      const start = performance.now();

      function animate(now) {
        const t = Math.min((now - start) / duration, 1);
        const ease = t * (2 - t);
        pulse.style.left = (startX + (endX - startX) * ease) + 'px';
        pulse.style.top = (startY + (endY - startY) * ease) + 'px';
        pulse.style.opacity = 1 - t * 0.5;
        if (t < 1) requestAnimationFrame(animate);
        else pulse.remove();
      }
      requestAnimationFrame(animate);
    }

    const nodes = core.querySelectorAll('.core-node');
    let idx = 0;
    setInterval(() => {
      spawnPulse(nodes[idx % nodes.length]);
      idx++;
    }, 1200);
  }

  function initLangToggle() {
    const btn = document.getElementById('langBtn');
    const menu = document.getElementById('langMenu');
    btn.addEventListener('click', () => menu.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!e.target.closest('.lang')) menu.classList.remove('open');
    });
  }

  function init() {
    buildLangMenu();
    initExplorer();
    initLangToggle();
    initMemoryCorePulses();
    setInterval(animateFlow, 1800);
    animateFlow();

    const saved = localStorage.getItem('entele-lang');
    applyTranslations(saved && window.ENTELE_I18N[saved] ? saved : 'en');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


/* Shared SOVRA AI Advisor — centrally governed by sovra.network. */
(function loadSovraAdvisor() {
  if (document.getElementById("sovra-ai-advisor-loader")) return;
  const script = document.createElement("script");
  script.id = "sovra-ai-advisor-loader";
  script.src = "https://www.sovra.network/assets/sovra-advisor.js";
  script.dataset.api = "https://www.sovra.network/api/advisor";
  script.dataset.site = "EnteleLEDGER";
  script.dataset.accent = "#355cff";
  script.dataset.context = "public";
  script.dataset.support = "mailto:contact@enteleledger.com";
  script.dataset.privacy = "https://www.sovra.network/advisor-privacy/";
  script.async = true;
  (document.body || document.head).appendChild(script);
})();
