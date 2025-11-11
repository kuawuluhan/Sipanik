document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const resultsContainer = document.getElementById("resultsContainer");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const statsContainer = document.getElementById("statsContainer");
    const statsText = document.getElementById("statsText");

    // GANTI DENGAN URL GOOGLE APPS SCRIPT ANDA
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyKg_lqp3lmLZOeMMia7yK0ZQUIzyUtORoFE2hR_y8GDkSLI7-vOQ2olyJAFAhPADPW/exec';
    
    let allData = [];

    // Fungsi untuk mengambil data dari Google Sheet
    async function fetchData() {
        showLoading(true);
        resultsContainer.innerHTML = '';
        try {
            const response = await fetch(GOOGLE_SHEET_URL);
            if (!response.ok) {
                throw new Error('Gagal mengambil data dari server.');
            }
            allData = await response.json();
            displayMessage('<i class="fas fa-info-circle"></i><br><br>Silakan masukkan kata kunci pencarian untuk mulai mencari data');
        } catch (error) {
            console.error('Error fetching data:', error);
            displayMessage('<i class="fas fa-exclamation-triangle"></i><br><br>Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.', true);
        } finally {
            showLoading(false);
        }
    }

    // Fungsi untuk menampilkan/menyembunyikan spinner
    function showLoading(isLoading) {
        loadingSpinner.style.display = isLoading ? 'block' : 'none';
    }

    // Fungsi untuk menampilkan pesan (kosong, error, dll)
    function displayMessage(message, isError = false) {
        resultsContainer.innerHTML = `<div class="empty-state ${isError ? 'error' : ''}">${message}</div>`;
        statsContainer.style.display = 'none';
    }

    // Fungsi untuk mencari data
    function handleSearch() {
        const query = searchInput.value.trim().toLowerCase();

        if (query === "") {
            resultsContainer.innerHTML = '';
            displayMessage('<i class="fas fa-info-circle"></i><br><br>Silakan masukkan kata kunci pencarian');
            return;
        }

        const filteredData = allData.filter(item => {
            const searchFields = [
                item["Nama Suami"],
                item["Nama Istri"],
                item["Ayah Suami"],
                item["Ayah Istri"],
                item["Ibu Suami"],
                item["Ibu Istri"],
                item["Hari Nikah"],
                item["Desa"],
                item["Tanggal Nikah"]
            ];

            return searchFields.some(field => 
                field && field.toLowerCase().includes(query)
            );
        });

        displayResults(filteredData);
    }

    // Fungsi untuk menampilkan hasil
    function displayResults(data) {
        resultsContainer.innerHTML = '';

        if (data.length === 0) {
            displayMessage('<i class="fas fa-search"></i><br><br>Data tidak ditemukan untuk kata kunci tersebut.<br>Coba gunakan kata kunci yang berbeda.');
            return;
        }

        statsText.textContent = `Ditemukan ${data.length} data`;
        statsContainer.style.display = 'block';

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'result-card';

            card.innerHTML = `
                <h3>
                    <i class="fas fa-ring"></i>
                    ${item["Nama Suami"]} & ${item["Nama Istri"]}
                </h3>
                <div class="data-grid">
                    <div class="data-item">
                        <strong><i class="fas fa-male"></i> Nama Suami</strong>
                        <span>${item["Nama Suami"]}</span>
                    </div>
                    <div class="data-item">
                        <strong><i class="fas fa-female"></i> Nama Istri</strong>
                        <span>${item["Nama Istri"]}</span>
                    </div>
                    <div class="data-item">
                        <strong><i class="fas fa-user"></i> Ayah Suami</strong>
                        <span>${item["Ayah Suami"]}</span>
                    </div>
                    <div class="data-item">
                        <strong><i class="fas fa-user"></i> Ayah Istri</strong>
                        <span>${item["Ayah Istri"]}</span>
                    </div>
                    <div class="data-item">
                        <strong><i class="fas fa-user"></i> Ibu Suami</strong>
                        <span>${item["Ibu Suami"]}</span>
                    </div>
                    <div class="data-item">
                        <strong><i class="fas fa-user"></i> Ibu Istri</strong>
                        <span>${item["Ibu Istri"]}</span>
                    </div>
                    <div class="data-item">
                        <strong><i class="far fa-calendar"></i> Hari Nikah</strong>
                        <span>${item["Hari Nikah"]}</span>
                    </div>
                    <div class="data-item">
                        <strong><i class="far fa-calendar-alt"></i> Tanggal Nikah</strong>
                        <span>${item["Tanggal Nikah"]}</span>
                    </div>
                    <div class="data-item">
                        <strong><i class="fas fa-map-marker-alt"></i> Desa</strong>
                        <span>${item["Desa"]}</span>
                    </div>
                    <div class="akta-info data-item">
                        <strong><i class="fas fa-certificate"></i> Nomor Akta Nikah</strong>
                        <span>${item["Nomor Akta Nikah"]}</span>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }

    // Event listeners
    searchInput.addEventListener('input', handleSearch);
    searchButton.addEventListener('click', handleSearch);
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Panggil fetchData() saat halaman pertama kali dimuat
    fetchData();
});