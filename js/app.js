(function () {
  'use strict';

  const CATEGORIES = {
    identity: {
      icon: '◉',
      key: 'catIdentity',
      keyD: 'catIdentityD',
      records: [
        { badge: 'ID', text: 'Q-Presence Credential #QP-2847' },
        { badge: 'gold', text: 'Sovereign Identity Binding' },
        { badge: 'ID', text: 'Biometric Attestation Record' }
      ],
      detail: 'Permanent, verifiable identity attestations linked through Q-Presence verification.'
    },
    governance: {
      icon: '⚖',
      key: 'catGovernance',
      keyD: 'catGovernanceD',
      records: [
        { badge: 'GOV', text: 'Proposal GR-2026-041' },
        { badge: 'gold', text: 'Council Decision #CD-891' },
        { badge: 'GOV', text: 'Approval Chain — 4 Signatures' }
      ],
      detail: 'Institutional proposals, deliberations, and execution archives permanently bound.'
    },
    infrastructure: {
      icon: '⬡',
      key: 'catInfrastructure',
      keyD: 'catInfrastructureD',
      records: [
        { badge: 'INF', text: 'Node Deployment State v4.2' },
        { badge: 'INF', text: 'Network Configuration Record' },
        { badge: 'gold', text: 'System Health Snapshot' }
      ],
      detail: 'System deployments and infrastructure changes with full operational context.'
    },
    proof: {
      icon: '◈',
      key: 'catProof',
      keyD: 'catProofD',
      records: [
        { badge: 'PRF', text: 'ChronoSeal Timestamp #CS-99201' },
        { badge: 'gold', text: 'Cryptographic Proof Bundle' },
        { badge: 'PRF', text: 'Evidence Attestation Record' }
      ],
      detail: 'Timestamped evidence bundles via ChronoSeal for sovereign verification.'
    },
    knowledge: {
      icon: '◇',
      key: 'catKnowledge',
      keyD: 'catKnowledgeD',
      records: [
        { badge: 'KNW', text: 'Verified Intelligence Report' },
        { badge: 'KNW', text: 'GraphVAULT Knowledge Node' },
        { badge: 'gold', text: 'SOVRA Analysis Record' }
      ],
      detail: 'Verified observations structured through GraphVAULT as civilization knowledge.'
    },
    compliance: {
      icon: '▣',
      key: 'catCompliance',
      keyD: 'catComplianceD',
      records: [
        { badge: 'CMP', text: 'ISO Compliance Audit Trail' },
        { badge: 'CMP', text: 'Policy Enforcement Record' },
        { badge: 'gold', text: 'Regulatory Certification' }
      ],
      detail: 'Regulatory audit trails and certification archives for accountability.'
    },
    security: {
      icon: '◎',
      key: 'catSecurity',
      keyD: 'catSecurityD',
      records: [
        { badge: 'SEC', text: 'Access Control Event Log' },
        { badge: 'SEC', text: 'Security Incident Report' },
        { badge: 'gold', text: 'Forensic Analysis Record' }
      ],
      detail: 'Access control logs and forensic records for security governance.'
    },
    historical: {
      icon: '∞',
      key: 'catHistorical',
      keyD: 'catHistoricalD',
      records: [
        { badge: 'HIS', text: 'Civilization Epoch Record' },
        { badge: 'gold', text: 'Legacy Archive — Generation I' },
        { badge: 'HIS', text: 'Permanent Memory Index' }
      ],
      detail: 'Civilization timeline entries forming the permanent memory index.'
    }
  };

  function getLang() {
    const saved = localStorage.getItem('entele-lang');
    if (saved && window.ENTELE_APP_I18N[saved]) return saved;
    const browser = (navigator.language || 'en').slice(0, 2);
    return window.ENTELE_APP_I18N[browser] ? browser : 'en';
  }

  function t(key) {
    const lang = getLang();
    const pack = window.ENTELE_APP_I18N[lang] || window.ENTELE_APP_I18N.en;
    return pack[key] || window.ENTELE_APP_I18N.en[key] || key;
  }

  function applyAppI18n() {
    document.querySelectorAll('[data-app-i18n]').forEach((el) => {
      const key = el.getAttribute('data-app-i18n');
      el.textContent = t(key);
    });
    document.documentElement.lang = getLang();
    document.documentElement.dir = getLang() === 'ar' ? 'rtl' : 'ltr';
  }

  function initExplorer() {
    const grid = document.getElementById('explorerCats');
    const detail = document.getElementById('explorerDetail');
    if (!grid) return;

    Object.entries(CATEGORIES).forEach(([id, cat], i) => {
      const el = document.createElement('div');
      el.className = 'app-record-cat' + (i === 0 ? ' active' : '');
      el.dataset.cat = id;
      el.innerHTML = `<div class="cat-icon">${cat.icon}</div><div><strong data-app-i18n="${cat.key}"></strong><span data-app-i18n="${cat.keyD}"></span></div>`;
      el.addEventListener('click', () => {
        grid.querySelectorAll('.app-record-cat').forEach((c) => c.classList.remove('active'));
        el.classList.add('active');
        showDetail(id);
      });
      grid.appendChild(el);
    });

    function showDetail(id) {
      const cat = CATEGORIES[id];
      const verified = t('verified');
      detail.innerHTML = `<p>${cat.detail}</p>${cat.records.map((r) =>
        `<div class="app-record-item"><span class="badge${r.badge === 'gold' ? ' gold' : ''}">${r.badge === 'gold' ? verified : r.badge}</span>${r.text}</div>`
      ).join('')}`;
    }

    applyAppI18n();
    showDetail('identity');
  }

  function markActiveTab() {
    const path = location.pathname.split('/').pop() || 'app.html';
    document.querySelectorAll('.app-tabbar a').forEach((a) => {
      const href = a.getAttribute('href');
      a.classList.toggle('active', href === path || (path === '' && href === 'app.html'));
    });
  }

  function init() {
    applyAppI18n();
    initExplorer();
    markActiveTab();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.ENTELE_APP = { t, getLang, applyAppI18n };
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
