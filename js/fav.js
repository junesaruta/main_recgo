// ===== Favorites page logic (no layout change) =====

(function () {
  // ---------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function safeParse(json, fallback) {
    try { return JSON.parse(json); } catch { return fallback; }
  }

  function getFavorites() {
    const raw = localStorage.getItem("favorites");
    const arr = safeParse(raw, []);
    return Array.isArray(arr) ? arr : [];
  }

  function setFavorites(arr) {
    try {
      localStorage.setItem("favorites", JSON.stringify(arr || []));
    } catch (e) {
      console.warn("[fav] cannot save favorites:", e);
    }
  }

  function setSelectedItem(obj) {
    try {
      localStorage.setItem("selectedItem", JSON.stringify(obj || {}));
    } catch (e) {
      console.warn("[fav] cannot set selectedItem:", e);
    }
  }

  function fmtPrice(v) {
    return (v === 0 || v) ? `${v} .-` : "—";
  }

  function escapeHTML(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ---------- Render ----------
  const listEl =
    $("#favList") || $(".fav-list"); // รองรับทั้ง id="favList" หรือ class="fav-list"

  function render() {
    if (!listEl) return;

    const items = getFavorites();

    if (!items.length) {
      // แสดง empty state แบบเรียบง่ายในบรรทัดเดียว (ยังคงโครง grid 4 คอลัมน์ไว้)
      listEl.innerHTML = `
        <li class="empty" style="display:grid;grid-template-columns:50px 1fr 120px 40px;">
          <span style="grid-column:1/5;color:#6b7280;">ยังไม่มีรายการโปรด</span>
        </li>`;
      return;
    }

    // เรนเดอร์ตามโครง: # | ชื่อ | ราคา | ลบ
    listEl.innerHTML = items
      .map((p, idx) => {
        const name = escapeHTML(p?.name || "—");
        const price = fmtPrice(p?.price);
        const pid = escapeHTML(p?.productId ?? "");
        // ใช้ 4 คอลัมน์ตรงตามเลย์เอาต์เดิม; ปุ่มลบเป็นคอลัมน์ที่ 4
        return `
          <li class="fav-row" data-index="${idx}" data-product-id="${pid}"
              style="display:grid;grid-template-columns:50px 1fr 120px 40px;align-items:center;gap:8px;">
            <span class="fav-idx" style="text-align:right;padding-right:6px;">${idx + 1}</span>
            <span class="fav-name" title="${name}">${name}</span>
            <span class="fav-price" style="text-align:right;">${price}</span>
            <button class="btn-del" title="ลบ" aria-label="ลบรายการโปรด"
                    style="all:unset;cursor:pointer;text-align:center;line-height:1;">✕</button>
          </li>`;
      })
      .join("");
  }

  // ---------- Events ----------
  function onListClick(e) {
    const row = e.target.closest(".fav-row");
    if (!row || !listEl.contains(row)) return;

    const idx = Number(row.dataset.index);
    const items = getFavorites();
    const target = items[idx];

    if (!target) return;

    // ถ้ากดปุ่มลบ
    if (e.target.closest(".btn-del")) {
      items.splice(idx, 1);
      setFavorites(items);
      render();
      return;
    }

    // ถ้าคลิกแถวนอกเหนือปุ่มลบ → เปิด items.html
    setSelectedItem(target);
    window.location.href = "items.html";
  }

  function bindBackButtons() {
    const backBtn = $("#btnBack") || $("#btnBackFav");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        window.location.href = "home.html";
      });
    }
  }

  // ฟังการเปลี่ยน favorites จากแท็บอื่น (ถ้ามี)
  window.addEventListener("storage", (ev) => {
    if (ev.key === "favorites") render();
  });

  // ---------- Init ----------
  document.addEventListener("DOMContentLoaded", () => {
    if (!listEl) {
      console.warn("[fav] .fav-list / #favList not found; nothing to render.");
      return;
    }
    render();
    listEl.addEventListener("click", onListClick, false);
    bindBackButtons();
  });
})();
