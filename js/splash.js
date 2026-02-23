// ===== Splash Screen Script =====
window.addEventListener("load", () => {
  setTimeout(() => {
    const splash = document.getElementById("splash");
    const loginPage = document.getElementById("loginPage");
    if (splash) splash.style.display = "none";
    if (loginPage) loginPage.style.display = "block";
  }, 2500); // 2.5 วินาที
});
