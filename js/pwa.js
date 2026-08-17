/* EnteleLEDGER — browser-compliant install and controlled update lifecycle */
(function installEnteleLedgerPwa() {
  "use strict";

  if (window.__enteleLedgerPwa) return;
  window.__enteleLedgerPwa = true;

  const INSTALL_DISMISS_KEY = "enteleledger:pwa-install-dismissed";
  const UPDATE_DISMISS_KEY = "enteleledger:pwa-update-dismissed";
  const COPY = {
    en: ["Install EnteleLEDGER", "Open the permanent-record portal in its own secure app window.", "Install", "Add EnteleLEDGER to your Home Screen", "In Safari, tap Share, then “Add to Home Screen”.", "EnteleLEDGER update ready", "Reload once to use the latest secure version.", "Update", "Dismiss"],
    tr: ["EnteleLEDGER’ı yükleyin", "Kalıcı kayıt portalını kendi güvenli uygulama penceresinde açın.", "Yükle", "EnteleLEDGER’ı Ana Ekrana ekleyin", "Safari’de Paylaş’a, ardından “Ana Ekrana Ekle” seçeneğine dokunun.", "EnteleLEDGER güncellemesi hazır", "En yeni güvenli sürümü kullanmak için bir kez yenileyin.", "Güncelle", "Kapat"],
    de: ["EnteleLEDGER installieren", "Öffnen Sie das permanente Aufzeichnungsportal in einem eigenen sicheren App-Fenster.", "Installieren", "EnteleLEDGER zum Home-Bildschirm hinzufügen", "Tippen Sie in Safari auf Teilen und dann auf „Zum Home-Bildschirm“.", "EnteleLEDGER-Update ist bereit", "Laden Sie einmal neu, um die neueste sichere Version zu verwenden.", "Aktualisieren", "Schließen"],
    fr: ["Installer EnteleLEDGER", "Ouvrez le portail d’enregistrement permanent dans sa propre fenêtre d’application sécurisée.", "Installer", "Ajouter EnteleLEDGER à l’écran d’accueil", "Dans Safari, touchez Partager, puis « Sur l’écran d’accueil ».", "La mise à jour EnteleLEDGER est prête", "Rechargez une fois pour utiliser la dernière version sécurisée.", "Mettre à jour", "Fermer"],
    es: ["Instalar EnteleLEDGER", "Abra el portal de registro permanente en su propia ventana de aplicación segura.", "Instalar", "Añadir EnteleLEDGER a la pantalla de inicio", "En Safari, pulse Compartir y después «Añadir a pantalla de inicio».", "La actualización de EnteleLEDGER está lista", "Recargue una vez para utilizar la versión segura más reciente.", "Actualizar", "Cerrar"],
    it: ["Installa EnteleLEDGER", "Apri il portale dei registri permanenti in una finestra app sicura dedicata.", "Installa", "Aggiungi EnteleLEDGER alla schermata Home", "In Safari, tocca Condividi e poi “Aggiungi alla schermata Home”.", "Aggiornamento EnteleLEDGER pronto", "Ricarica una volta per utilizzare la versione sicura più recente.", "Aggiorna", "Chiudi"],
    pt: ["Instalar o EnteleLEDGER", "Abra o portal de registos permanentes numa janela de aplicação segura própria.", "Instalar", "Adicionar o EnteleLEDGER ao ecrã principal", "No Safari, toque em Partilhar e depois em “Adicionar ao ecrã principal”.", "Atualização do EnteleLEDGER pronta", "Recarregue uma vez para usar a versão segura mais recente.", "Atualizar", "Fechar"],
    nl: ["EnteleLEDGER installeren", "Open het permanente-recordportaal in een eigen beveiligd appvenster.", "Installeren", "EnteleLEDGER aan het beginscherm toevoegen", "Tik in Safari op Deel en daarna op ‘Zet op beginscherm’.", "EnteleLEDGER-update is gereed", "Laad één keer opnieuw om de nieuwste beveiligde versie te gebruiken.", "Bijwerken", "Sluiten"],
    ar: ["تثبيت EnteleLEDGER", "افتح بوابة السجل الدائم في نافذة تطبيق آمنة مستقلة.", "تثبيت", "إضافة EnteleLEDGER إلى الشاشة الرئيسية", "في Safari، اضغط على مشاركة ثم «إضافة إلى الشاشة الرئيسية».", "تحديث EnteleLEDGER جاهز", "أعد التحميل مرة واحدة لاستخدام أحدث إصدار آمن.", "تحديث", "إغلاق"],
    ru: ["Установить EnteleLEDGER", "Откройте портал постоянных записей в отдельном защищённом окне приложения.", "Установить", "Добавить EnteleLEDGER на экран «Домой»", "В Safari нажмите «Поделиться», затем «На экран Домой».", "Обновление EnteleLEDGER готово", "Перезагрузите страницу один раз, чтобы использовать последнюю защищённую версию.", "Обновить", "Закрыть"],
    zh: ["安装 EnteleLEDGER", "在独立且安全的应用窗口中打开永久记录门户。", "安装", "将 EnteleLEDGER 添加到主屏幕", "在 Safari 中轻点“共享”，然后选择“添加到主屏幕”。", "EnteleLEDGER 更新已就绪", "重新载入一次即可使用最新的安全版本。", "更新", "关闭"],
    ja: ["EnteleLEDGER をインストール", "永久記録ポータルを専用の安全なアプリウィンドウで開きます。", "インストール", "EnteleLEDGER をホーム画面に追加", "Safariで共有をタップし、「ホーム画面に追加」を選択してください。", "EnteleLEDGER の更新を利用できます", "一度再読み込みすると、最新の安全なバージョンを使用できます。", "更新", "閉じる"],
    ko: ["EnteleLEDGER 설치", "영구 기록 포털을 독립된 보안 앱 창에서 엽니다.", "설치", "EnteleLEDGER를 홈 화면에 추가", "Safari에서 공유를 누른 다음 ‘홈 화면에 추가’를 선택하세요.", "EnteleLEDGER 업데이트 준비 완료", "한 번 새로고침하면 최신 보안 버전을 사용할 수 있습니다.", "업데이트", "닫기"],
    hi: ["EnteleLEDGER इंस्टॉल करें", "स्थायी रिकॉर्ड पोर्टल को उसकी अपनी सुरक्षित ऐप विंडो में खोलें।", "इंस्टॉल करें", "EnteleLEDGER को होम स्क्रीन पर जोड़ें", "Safari में साझा करें पर टैप करें, फिर “होम स्क्रीन पर जोड़ें” चुनें।", "EnteleLEDGER अपडेट तैयार है", "नवीनतम सुरक्षित संस्करण का उपयोग करने के लिए एक बार पुनः लोड करें।", "अपडेट करें", "बंद करें"],
    ur: ["EnteleLEDGER انسٹال کریں", "مستقل ریکارڈ پورٹل کو اس کی اپنی محفوظ ایپ ونڈو میں کھولیں۔", "انسٹال کریں", "EnteleLEDGER کو ہوم اسکرین میں شامل کریں", "Safari میں شیئر پر ٹیپ کریں، پھر “ہوم اسکرین میں شامل کریں” منتخب کریں۔", "EnteleLEDGER اپ ڈیٹ تیار ہے", "تازہ ترین محفوظ ورژن استعمال کرنے کے لیے ایک بار دوبارہ لوڈ کریں۔", "اپ ڈیٹ کریں", "بند کریں"],
    id: ["Instal EnteleLEDGER", "Buka portal catatan permanen dalam jendela aplikasi aman tersendiri.", "Instal", "Tambahkan EnteleLEDGER ke Layar Utama", "Di Safari, ketuk Bagikan, lalu “Tambahkan ke Layar Utama”.", "Pembaruan EnteleLEDGER siap", "Muat ulang sekali untuk menggunakan versi aman terbaru.", "Perbarui", "Tutup"],
    ms: ["Pasang EnteleLEDGER", "Buka portal rekod kekal dalam tetingkap aplikasi selamatnya sendiri.", "Pasang", "Tambah EnteleLEDGER ke Skrin Utama", "Dalam Safari, ketik Kongsi, kemudian “Tambah ke Skrin Utama”.", "Kemas kini EnteleLEDGER sedia", "Muat semula sekali untuk menggunakan versi selamat terkini.", "Kemas kini", "Tutup"],
    fa: ["نصب EnteleLEDGER", "درگاه سوابق دائمی را در پنجره امن و مستقل برنامه باز کنید.", "نصب", "افزودن EnteleLEDGER به صفحه اصلی", "در Safari روی اشتراک‌گذاری و سپس «افزودن به صفحه اصلی» بزنید.", "به‌روزرسانی EnteleLEDGER آماده است", "برای استفاده از آخرین نسخه امن، یک‌بار بازخوانی کنید.", "به‌روزرسانی", "بستن"],
    el: ["Εγκατάσταση EnteleLEDGER", "Ανοίξτε την πύλη μόνιμων αρχείων σε δικό της ασφαλές παράθυρο εφαρμογής.", "Εγκατάσταση", "Προσθήκη του EnteleLEDGER στην οθόνη Αφετηρίας", "Στο Safari, πατήστε Κοινή χρήση και μετά «Προσθήκη στην οθόνη Αφετηρίας».", "Η ενημέρωση του EnteleLEDGER είναι έτοιμη", "Κάντε μία ανανέωση για να χρησιμοποιήσετε την πιο πρόσφατη ασφαλή έκδοση.", "Ενημέρωση", "Κλείσιμο"],
    bg: ["Инсталиране на EnteleLEDGER", "Отворете портала за постоянни записи в отделен защитен прозорец на приложението.", "Инсталиране", "Добавяне на EnteleLEDGER към началния екран", "В Safari докоснете Споделяне, след това „Добавяне към началния екран“.", "Актуализацията на EnteleLEDGER е готова", "Презаредете веднъж, за да използвате най-новата защитена версия.", "Актуализиране", "Затваряне"],
    ro: ["Instalează EnteleLEDGER", "Deschide portalul de înregistrări permanente într-o fereastră de aplicație securizată separată.", "Instalează", "Adaugă EnteleLEDGER pe ecranul principal", "În Safari, atinge Partajare, apoi „Adăugați la ecranul principal”.", "Actualizarea EnteleLEDGER este pregătită", "Reîncarcă o dată pentru a utiliza cea mai nouă versiune securizată.", "Actualizează", "Închide"],
    pl: ["Zainstaluj EnteleLEDGER", "Otwórz portal trwałych zapisów w osobnym, bezpiecznym oknie aplikacji.", "Zainstaluj", "Dodaj EnteleLEDGER do ekranu początkowego", "W Safari stuknij Udostępnij, a następnie „Dodaj do ekranu początkowego”.", "Aktualizacja EnteleLEDGER jest gotowa", "Odśwież stronę raz, aby korzystać z najnowszej bezpiecznej wersji.", "Aktualizuj", "Zamknij"],
    uk: ["Установити EnteleLEDGER", "Відкрийте портал постійних записів в окремому захищеному вікні застосунку.", "Установити", "Додати EnteleLEDGER на початковий екран", "У Safari натисніть «Поширити», а потім «На початковий екран».", "Оновлення EnteleLEDGER готове", "Перезавантажте сторінку один раз, щоб використовувати найновішу захищену версію.", "Оновити", "Закрити"],
    az: ["EnteleLEDGER-ı quraşdırın", "Daimi qeyd portalını ayrıca təhlükəsiz tətbiq pəncərəsində açın.", "Quraşdır", "EnteleLEDGER-ı əsas ekrana əlavə edin", "Safari-də Paylaş düyməsinə, sonra “Əsas ekrana əlavə et” seçiminə toxunun.", "EnteleLEDGER yeniləməsi hazırdır", "Ən son təhlükəsiz versiyanı istifadə etmək üçün bir dəfə yenidən yükləyin.", "Yenilə", "Bağla"],
    ka: ["EnteleLEDGER-ის დაყენება", "გახსენით მუდმივი ჩანაწერების პორტალი ცალკე უსაფრთხო აპის ფანჯარაში.", "დაყენება", "EnteleLEDGER-ის მთავარ ეკრანზე დამატება", "Safari-ში დააჭირეთ გაზიარებას, შემდეგ „მთავარ ეკრანზე დამატებას“.", "EnteleLEDGER-ის განახლება მზადაა", "უახლესი უსაფრთხო ვერსიის გამოსაყენებლად ერთხელ განაახლეთ გვერდი.", "განახლება", "დახურვა"]
  };
  const LOCALES = new Set(Object.keys(COPY));
  const SENSITIVE_ROUTE = /^\/(?:admin|api|auth|callback|case|contact|dashboard|evidence|identity|incident|login|profile|record|register|review|secure|session|settings|upload|vault|verify|wallet|webhook)(?:\/|$|\.html$)/i;

  function getLanguage() {
    let saved = "";
    try {
      saved = localStorage.getItem("entele-lang") || "";
    } catch {
      // Local storage can be unavailable in privacy-hardened contexts.
    }
    const raw = (saved || document.documentElement.lang || navigator.language || "en")
      .toLowerCase()
      .replace("_", "-");
    if (LOCALES.has(raw)) return raw;
    const base = raw.split("-")[0];
    return LOCALES.has(base) ? base : "en";
  }

  function isSensitivePath(pathname) {
    return SENSITIVE_ROUTE.test(pathname.replace(/\/$/, "") || "/");
  }

  function isStandalone() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
  }

  function isIosSafari() {
    const userAgent = navigator.userAgent;
    const ios =
      /iphone|ipad|ipod/i.test(userAgent) ||
      (/macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1);
    return (
      ios &&
      /webkit/i.test(userAgent) &&
      !/crios|fxios|edgios|opios/i.test(userAgent)
    );
  }

  function wasDismissed(key) {
    try {
      return sessionStorage.getItem(key) === "1";
    } catch {
      return false;
    }
  }

  function ensureMeta(name, content) {
    let meta = document.head.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = content;
  }

  function ensureHeadMetadata() {
    const viewport = document.head.querySelector('meta[name="viewport"]');
    if (viewport && !viewport.content.includes("viewport-fit=cover")) {
      viewport.content = `${viewport.content}, viewport-fit=cover`;
    }
    ensureMeta("application-name", "EnteleLEDGER");
    ensureMeta("mobile-web-app-capable", "yes");
    ensureMeta("apple-mobile-web-app-capable", "yes");
    ensureMeta("apple-mobile-web-app-status-bar-style", "black-translucent");
    ensureMeta("apple-mobile-web-app-title", "EnteleLEDGER");

    const theme = document.head.querySelector('meta[name="theme-color"]');
    if (theme) theme.content = "#071b3a";

    if (!document.head.querySelector('link[rel="manifest"]')) {
      const manifest = document.createElement("link");
      manifest.rel = "manifest";
      manifest.href = "/manifest.webmanifest";
      document.head.appendChild(manifest);
    }

    if (!document.head.querySelector('link[rel="apple-touch-icon"]')) {
      const icon = document.createElement("link");
      icon.rel = "apple-touch-icon";
      icon.href = "/assets/brand/apple-touch-icon.png";
      document.head.appendChild(icon);
    }
  }

  ensureHeadMetadata();

  if (isStandalone() || isSensitivePath(location.pathname)) return;

  const copy = COPY[getLanguage()] || COPY.en;
  const [
    installTitle,
    installDescription,
    installAction,
    iosTitle,
    iosDescription,
    updateTitle,
    updateDescription,
    updateAction,
    dismissLabel
  ] = copy;

  let mode = "hidden";
  let deferredPrompt = null;
  let registration = null;
  let panel = null;
  let hadController = false;
  let updateRequested = false;
  let reloading = false;

  function installPanelStyles() {
    if (document.getElementById("enteleledger-pwa-style")) return;
    const style = document.createElement("style");
    style.id = "enteleledger-pwa-style";
    style.textContent = `
      #enteleledger-pwa-panel {
        position: fixed;
        inset-inline-start: max(16px, env(safe-area-inset-left));
        inset-block-end: max(16px, env(safe-area-inset-bottom));
        z-index: 2147483000;
        display: grid;
        grid-template-columns: 52px minmax(0, 1fr) auto auto;
        align-items: center;
        gap: 12px;
        width: min(630px, calc(100vw - 32px));
        padding: 14px;
        color: #f8fbff;
        background:
          linear-gradient(135deg, rgba(7, 27, 58, 0.98), rgba(3, 11, 23, 0.99)),
          radial-gradient(circle at 16% 10%, rgba(61, 125, 255, 0.3), transparent 46%);
        border: 1px solid rgba(212, 175, 90, 0.28);
        border-radius: 18px;
        box-shadow: 0 24px 72px rgba(0, 6, 22, 0.52), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px) saturate(135%);
        -webkit-backdrop-filter: blur(20px) saturate(135%);
        animation: enteleledgerPwaEnter 180ms ease-out both;
      }
      #enteleledger-pwa-panel[hidden] { display: none !important; }
      .enteleledger-pwa-icon-frame {
        display: grid;
        place-items: center;
        width: 52px;
        height: 52px;
        overflow: hidden;
        border: 1px solid rgba(212, 175, 90, 0.25);
        border-radius: 14px;
        background: radial-gradient(circle at 34% 24%, #174da8 0%, #071b3a 55%, #030b17 100%);
        box-shadow: 0 10px 28px rgba(0, 5, 20, 0.52), inset 0 1px 0 rgba(255, 255, 255, 0.11);
      }
      .enteleledger-pwa-icon-frame img { width: 44px; height: 44px; object-fit: contain; }
      .enteleledger-pwa-copy { display: grid; min-width: 0; gap: 4px; }
      .enteleledger-pwa-copy strong { color: #fff; font-size: 0.95rem; font-weight: 760; line-height: 1.25; letter-spacing: -0.012em; }
      .enteleledger-pwa-copy span { color: rgba(231, 241, 255, 0.79); font-size: 0.79rem; line-height: 1.45; }
      .enteleledger-pwa-action, .enteleledger-pwa-dismiss { appearance: none; border: 0; cursor: pointer; font: inherit; }
      .enteleledger-pwa-action {
        min-height: 40px;
        padding-inline: 17px;
        border-radius: 11px;
        color: #030b17;
        background: linear-gradient(135deg, #ffffff, #d4af5a);
        box-shadow: 0 9px 24px rgba(61, 125, 255, 0.27);
        font-size: 0.82rem;
        font-weight: 820;
        transition: transform 140ms ease, filter 140ms ease;
      }
      .enteleledger-pwa-action:hover { filter: brightness(1.04); transform: translateY(-1px); }
      .enteleledger-pwa-dismiss {
        display: grid;
        place-items: center;
        width: 34px;
        height: 34px;
        border-radius: 10px;
        color: rgba(237, 246, 255, 0.78);
        background: rgba(255, 255, 255, 0.07);
        font-size: 1.3rem;
        line-height: 1;
      }
      .enteleledger-pwa-dismiss:hover { color: #fff; background: rgba(255, 255, 255, 0.12); }
      .enteleledger-pwa-action:focus-visible, .enteleledger-pwa-dismiss:focus-visible { outline: 3px solid rgba(61, 125, 255, 0.86); outline-offset: 3px; }
      @keyframes enteleledgerPwaEnter { from { opacity: 0; transform: translateY(10px) scale(0.985); } to { opacity: 1; transform: translateY(0) scale(1); } }
      @media (max-width: 680px) {
        #enteleledger-pwa-panel {
          inset-inline: max(12px, env(safe-area-inset-left));
          inset-block-end: max(12px, env(safe-area-inset-bottom));
          width: auto;
          grid-template-columns: 44px minmax(0, 1fr) auto;
          gap: 10px;
          padding: 12px;
          border-radius: 16px;
        }
        .enteleledger-pwa-icon-frame { width: 44px; height: 44px; border-radius: 12px; }
        .enteleledger-pwa-icon-frame img { width: 37px; height: 37px; }
        .enteleledger-pwa-action { grid-column: 2; justify-self: start; min-height: 36px; padding-inline: 15px; }
        .enteleledger-pwa-dismiss { grid-column: 3; grid-row: 1; align-self: start; }
      }
      @media (prefers-reduced-motion: reduce) {
        #enteleledger-pwa-panel { animation: none; }
        .enteleledger-pwa-action { transition: none; }
        .enteleledger-pwa-action:hover { transform: none; }
      }
    `;
    document.head.appendChild(style);
  }

  function ensurePanel() {
    if (panel) return panel;
    installPanelStyles();
    panel = document.createElement("aside");
    panel.id = "enteleledger-pwa-panel";
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "false");
    panel.setAttribute("aria-live", "polite");
    panel.innerHTML = `
      <span class="enteleledger-pwa-icon-frame" aria-hidden="true"><img src="/assets/brand/icon-192.png" alt="" width="192" height="192" /></span>
      <span class="enteleledger-pwa-copy"><strong></strong><span></span></span>
      <button class="enteleledger-pwa-action" type="button"></button>
      <button class="enteleledger-pwa-dismiss" type="button" aria-label="${dismissLabel}">×</button>`;
    panel.querySelector(".enteleledger-pwa-action").addEventListener("click", activate);
    panel.querySelector(".enteleledger-pwa-dismiss").addEventListener("click", dismiss);
    (document.body || document.documentElement).appendChild(panel);
    return panel;
  }

  function render(nextMode) {
    if (isStandalone() || isSensitivePath(location.pathname)) nextMode = "hidden";
    mode = nextMode;
    const element = ensurePanel();
    if (mode === "hidden") {
      element.hidden = true;
      return;
    }

    const title =
      mode === "update" ? updateTitle : mode === "ios" ? iosTitle : installTitle;
    const description =
      mode === "update"
        ? updateDescription
        : mode === "ios"
          ? iosDescription
          : installDescription;
    const action = mode === "update" ? updateAction : installAction;

    element.querySelector("strong").textContent = title;
    element.querySelector(".enteleledger-pwa-copy span").textContent = description;
    const actionButton = element.querySelector(".enteleledger-pwa-action");
    actionButton.textContent = action;
    actionButton.hidden = mode === "ios";
    element.setAttribute("aria-label", title);
    element.hidden = false;
  }

  function dismiss() {
    const key = mode === "update" ? UPDATE_DISMISS_KEY : INSTALL_DISMISS_KEY;
    try {
      sessionStorage.setItem(key, "1");
    } catch {
      // Session storage can be unavailable in hardened browser modes.
    }
    render("hidden");
  }

  async function activate() {
    if (mode === "update") {
      if (!registration?.waiting) return;
      updateRequested = true;
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      return;
    }

    if (mode !== "install" || !deferredPrompt) return;
    const prompt = deferredPrompt;
    try {
      await prompt.prompt();
      await prompt.userChoice;
    } catch {
      // The browser owns the native installation dialogue.
    } finally {
      deferredPrompt = null;
      render("hidden");
    }
  }

  function showUpdate(nextRegistration) {
    if (
      !nextRegistration.waiting ||
      wasDismissed(UPDATE_DISMISS_KEY) ||
      isSensitivePath(location.pathname)
    ) {
      return;
    }
    registration = nextRegistration;
    render("update");
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    if (!wasDismissed(INSTALL_DISMISS_KEY)) render("install");
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    render("hidden");
  });

  async function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    if (!(window.isSecureContext || location.hostname === "localhost")) return;

    hadController = Boolean(navigator.serviceWorker.controller);
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!hadController || !updateRequested || reloading) return;
      reloading = true;
      location.reload();
    });

    try {
      const nextRegistration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none"
      });
      registration = nextRegistration;
      showUpdate(nextRegistration);

      nextRegistration.addEventListener("updatefound", () => {
        const worker = nextRegistration.installing;
        worker?.addEventListener("statechange", () => {
          if (
            worker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            showUpdate(nextRegistration);
          }
        });
      });

      await nextRegistration.update().catch(() => undefined);
      window.setInterval(() => {
        if (document.visibilityState === "visible") {
          void nextRegistration.update().catch(() => undefined);
        }
      }, 60 * 60 * 1000);
    } catch {
      // PWA support is progressive enhancement and must never block the site.
    }
  }

  if (isIosSafari() && !wasDismissed(INSTALL_DISMISS_KEY)) render("ios");

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => void registerServiceWorker(), {
      once: true
    });
  } else {
    void registerServiceWorker();
  }

  window.ENTELELEDGER_PWA = {
    isStandalone,
    isIos: isIosSafari,
    checkForUpdate: () => registration?.update(),
    showInstall: () => {
      if (deferredPrompt) render("install");
    }
  };
})();
