document.addEventListener("DOMContentLoaded", async function () {
    // 1. Fungsi muat komponen (Async)
    const loadComp = async (url, id) => {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Gagal muat ${url}`);
            const html = await res.text();
            const target = document.getElementById(id);
            if (target) target.innerHTML = html;
        } catch (err) {
            console.error(err);
        }
    };

    // 2. Ambil parameter URL
    const urlParams = new URLSearchParams(window.location.search);

    // 3. Muat Navbar & Breadcrumb
    await loadComp("../navigation.html", "navbar-placeholder");
    await loadComp("../component/breadcrumb/breadcrumb.html", "pathbar-placeholder");

    // --- LOGIKA BREADCRUMB ---
    const listContainer = document.getElementById("breadcrumb-list");

    if (listContainer) {
        listContainer.innerHTML = "";

        // Link Home
        const homeItem = document.createElement("a");
        homeItem.innerText = "Home";
        homeItem.href = "../home.html";
        homeItem.className = "breadcrumb-item";
        listContainer.appendChild(homeItem);

        // --- BAGIAN URUTAN RUTE ---
        let urutanTampil = ["cat", "name"];

        if (urlParams.has("trx")) {
            urutanTampil.push("trx");
        } else if (urlParams.has("toko")) {
            urutanTampil.push("toko");
            // Cek kalau lagi di halaman chat, tambahin rutenya
            if (window.location.pathname.includes("chat_page")) {
                urutanTampil.push("chat");
            }
        }

        // Jalankan perulangan rute
        urutanTampil.forEach((key) => {
            const value = urlParams.get(key) || (key === "chat" ? "Chat" : null);
            
            if (value) {
                const sep = document.createElement("span");
                sep.innerText = " / ";
                listContainer.appendChild(sep);

                const item = document.createElement("a");
                item.innerText = decodeURIComponent(value).replace(/-/g, " ");
                item.className = "breadcrumb-item";

                // --- DATA PERSISTENCE HREF ---
                const currentData = new URLSearchParams(window.location.search);

                if (key === "cat") {
                    item.href = `../katalog-page/katalog_${value.toLowerCase()}.html?cat=${value}`;
                } 
                else if (key === "name") {
                    const backData = new URLSearchParams(window.location.search);
                    backData.delete("toko");
                    backData.delete("trx");
                    backData.delete("chat");
                    item.href = `../toko-page/barang_page.html?${backData.toString()}`;
                } 
                else if (key === "toko") {
                    const backToToko = new URLSearchParams(window.location.search);
                    backToToko.delete("chat"); // Hapus chat biar balik ke level toko
                    item.href = `../toko-page/toko_page.html?${backToToko.toString()}`;
                } 
                else if (key === "trx") {
                    item.href = `../transaksi-page/${value.toLowerCase()}.html?${currentData.toString()}`;
                }
                else if (key === "chat") {
                    item.href = `chat_page.html?${currentData.toString()}`;
                }

                // Matikan link untuk level paling ujung
                const paramsPresent = urutanTampil.filter((k) => urlParams.has(k) || k === "chat");
                if (key === paramsPresent[paramsPresent.length - 1]) {
                    item.href = "#";
                    item.style.pointerEvents = "none";
                    item.style.fontWeight = "bold";
                }
                listContainer.appendChild(item);
            }
        });
    }

    // 4. Muat Container Produk
    await loadComp("../component/product-container/product-container.html", "product-placeholder");

    // --- 5. MENGISI KONTEN HALAMAN ---
    const pName = urlParams.get("name");
    const pPrice = urlParams.get("price");
    const pCat = urlParams.get("cat");
    const pImg = urlParams.get("img");
    const pDesc = urlParams.get("desc");

    const nameEl = document.getElementById("main-product-name");
    const priceEl = document.getElementById("main-product-price");
    const descEl = document.getElementById("main-product-desc");
    const imgEl = document.getElementById("main-product-img");

    if (nameEl && pName) nameEl.innerText = pName.replace(/-/g, " ");
    if (priceEl && pPrice) priceEl.innerText = pPrice;
    if (descEl && pDesc) descEl.innerText = decodeURIComponent(pDesc).replace(/-/g, " ");

    if (imgEl && pImg && pCat) {
        const folderName = pCat.toLowerCase().split("-")[0];
        const fullPath = `../asset_foto/${folderName}/${pImg}`;
        imgEl.src = fullPath;

        imgEl.onerror = () => {
            imgEl.src = "../asset_foto/placeholder.jpg";
        };
    }
});