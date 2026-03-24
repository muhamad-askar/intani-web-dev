document.addEventListener("DOMContentLoaded", function() {
    const targetId = 'pathbar-placeholder';
    const componentUrl = '../component/breadcrumb.html'; 

    fetch(componentUrl)
        .then(res => res.text())
        .then(data => {
            document.getElementById(targetId).innerHTML = data;
            const listContainer = document.getElementById('breadcrumb-list');

            // 1. Ambil semua parameter URL (cat, name, step, dll)
            const urlParams = new URLSearchParams(window.location.search);
            
            // 2. Loop setiap parameter yang ada di URL
            urlParams.forEach((value, key) => {
                const cleanText = decodeURIComponent(value).replace(/-/g, ' ');

                // Bikin Separator (/)
                const separator = document.createElement('span');
                separator.className = 'breadcrumb-separator';
                separator.innerText = ' / ';
                listContainer.appendChild(separator);

                // Bikin Elemen Teks/Link
                const breadcrumbItem = document.createElement('span');
                breadcrumbItem.innerText = cleanText;
                breadcrumbItem.className = 'breadcrumb-item';
                
                // Kasih fungsi klik balik (history back)
                breadcrumbItem.style.cursor = 'pointer';
                breadcrumbItem.onclick = () => window.history.back();

                listContainer.appendChild(breadcrumbItem);
            });
        });
});