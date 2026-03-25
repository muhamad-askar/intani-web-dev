async function loadLayout() {
  try {
    const navResponse = await fetch("/navigation.html");
    const navData = await navResponse.text();
    const navPlaceholder = document.getElementById("navbar-placeholder");
    if (navPlaceholder) navPlaceholder.innerHTML = navData;

    const footerResponse = await fetch("/footer.html");
    const footerData = await footerResponse.text();
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) footerPlaceholder.innerHTML = footerData;

    initSearch();
  } catch (error) {
    console.error("Gagal memuat layout:", error);
  }
}

function initSearch() {
  const inputSearch = document.getElementById("input-search");
  if (!inputSearch) return;

  const dropdownSaran = document.createElement("div");
  dropdownSaran.id = "dropdown-saran";
  document.body.appendChild(dropdownSaran);

  const dataSaran = [
    "Benih Tomat Super",
    "Benih Cabai Rawit",
    "Pupuk Kompos Organik",
    "Cangkul Baja",
    "Pestisida Alami",
    "Bibit Padi Unggul",
    "Selang Air Irigasi",
    "Traktor Mini",
  ];

  function updatePosisiDropdown() {
    const rect = inputSearch.getBoundingClientRect();
    dropdownSaran.style.top = rect.bottom + window.scrollY + "px";
    dropdownSaran.style.left = rect.left + window.scrollX + "px";
    dropdownSaran.style.width = rect.width + "px";
  }

  inputSearch.addEventListener("input", function () {
    const teks = this.value.toLowerCase();
    dropdownSaran.innerHTML = "";

    if (teks.length > 0) {
      const hasilFilter = dataSaran.filter((item) =>
        item.toLowerCase().startsWith(teks),
      );
      if (hasilFilter.length > 0) {
        updatePosisiDropdown();
        dropdownSaran.style.display = "block";
        hasilFilter.forEach((item) => {
          const divItem = document.createElement("div");
          divItem.classList.add("item-saran");
          divItem.innerText = item;
          divItem.addEventListener("click", function () {
            inputSearch.value = item;
            dropdownSaran.style.display = "none";
          });
          dropdownSaran.appendChild(divItem);
        });
      } else {
        dropdownSaran.style.display = "none";
      }
    } else {
      dropdownSaran.style.display = "none";
    }
  });

  document.addEventListener("click", function (e) {
    if (!inputSearch.contains(e.target) && !dropdownSaran.contains(e.target)) {
      dropdownSaran.style.display = "none";
    }
  });

  window.addEventListener("resize", () => {
    if (dropdownSaran.style.display === "block") updatePosisiDropdown();
  });
}

document.addEventListener("DOMContentLoaded", loadLayout);
