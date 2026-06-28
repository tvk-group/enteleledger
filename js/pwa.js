/* EnteleLEDGER — PWA install prompt + service worker registration */
(function () {
  const APP_URL = "https://www.enteleledger.com/app.html";

  let deferredPrompt = null;

  function isStandalone() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
  }

  function isIos() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }

  function registerSw() {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
    });
  }

  function mountInstallUi() {
    if (isStandalone()) return;

    const btn = document.getElementById("pwa-install-btn");
    const iosHint = document.getElementById("pwa-ios-hint");
    const banner = document.getElementById("pwa-install-banner");
    const bannerBtn = document.getElementById("pwa-install-banner-btn");

    if (isIos() && iosHint) iosHint.hidden = false;

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (btn) btn.hidden = false;
      if (banner) banner.hidden = false;
    });

    async function triggerInstall() {
      if (!deferredPrompt) {
        window.location.href = APP_URL;
        return;
      }
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      if (btn) btn.hidden = true;
      if (banner) banner.hidden = true;
    }

    if (btn) btn.addEventListener("click", triggerInstall);
    if (bannerBtn) bannerBtn.addEventListener("click", triggerInstall);
  }

  registerSw();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountInstallUi);
  } else {
    mountInstallUi();
  }

  window.ENTELE_PWA = { isStandalone, isIos, getAppUrl: () => APP_URL };
})();
