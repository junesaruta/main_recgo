(function () {

  // ----- Utilities -----
  function readSelected() {
    try {
      const raw = localStorage.getItem("selectedItem");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  // ----- Load Data -----
  const data = readSelected();

  const imgEl   = document.getElementById("itemImg");
  const nameEl  = document.getElementById("itemName");
  const priceEl = document.getElementById("price");
  const pidEl   = document.getElementById("productId");

  // ถ้าไม่มีข้อมูล → กลับหน้า home
  if (!data || !data.item_id) {
    window.location.href = "home2.html";
    return;
  }

  const item_id = data.item_id;
  const name  = data.name || "—";
  const img   = data.img || "https://placehold.co/160x160";
  const price = data.price != null ? data.price : 15;

  // ----- Bind UI -----
  nameEl.textContent  = name;
  imgEl.src           = img;
  priceEl.textContent = `${price} .-`;
  pidEl.textContent   = `Product Id : ${item_id}`;

  // ----- Back Button -----
  document.getElementById("btnBack").addEventListener("click", () => {
    window.location.href = "home2.html";
  });

  // ----- Add to Favorite -----
  document.getElementById("btnFav").addEventListener("click", () => {

    const fav = {
      item_id,
      name,
      img,
      price,
      addedAt: new Date().toISOString(),
      source: data.source || "items"
    };

    try {
      const raw = localStorage.getItem("favorites");
      const arr = raw ? JSON.parse(raw) : [];

      // กันซ้ำ
      const exists = arr.some(f => f.item_id === item_id);
      if (exists) {
        alert("รายการนี้อยู่ในรายการโปรดแล้ว");
        return;
      }

      arr.push(fav);
      localStorage.setItem("favorites", JSON.stringify(arr));
      alert("เพิ่มลงรายการโปรดแล้ว");

    } catch (e) {
      alert("ไม่สามารถบันทึกรายการโปรดได้");
    }
  });

})();
