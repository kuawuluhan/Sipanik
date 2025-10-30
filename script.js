document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const resultsContainer = document.getElementById("resultsContainer");
    const loadingSpinner = document.getElementById("loadingSpinner");

    // --- PENTING: GANTI DENGAN URL WEB APP GOOGLE SCRIPT ANDA ---
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbyKg_lqp3lmLZOeMMia7yK0ZQUIzyUtORoFE2hR_y8GDkSLI7-vOQ2olyJAFAhPADPW/exec';
    
    let allData = []; // Variabel untuk menyimpan semua data dari spreadsheet

    // Fungsi untuk mengambil data dari Google Sheet
    async function fetchData() {
        showLoading(true);
        resultsContainer.innerHTML = ''; // Kosongkan hasil
        try {
            const response = await fetch(GOOGLE_SHEET_URL);
            if (!response.ok) {
                throw new Error('Gagal mengambil data dari server.');
            }
            allData = await response.json();
            displayMessage("Silakan masukkan data pencarian.");
        } catch (error) {
            console.error('Error fetching data:', error);
            displayMessage("Terjadi kesalahan saat memuat data. Coba lagi nanti.", true);
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
        resultsContainer.innerHTML = `<p class="empty-state ${isError ? 'error' : ''}">${message}</p>`;
    }

    // Fungsi untuk mencari data
    function handleSearch() {
        const query = searchInput.value.trim().toLowerCase();

        // Jika query kosong, kosongkan hasil
        if (query === "") {
            resultsContainer.innerHTML = '';
            displayMessage("Silakan masukkan data pencarian.");
            return;
        }

        // Filter data berdasarkan query
        const filteredData = allData.filter(item => {
            return (
                item["Nama Suami"].toLowerCase().includes(query) ||
                item["Nama Istri"].toLowerCase().includes(query) ||
                item["Ayah Suami"].toLowerCase().includes(query) ||
                item["Ayah Istri"].toLowerCase().includes(query) ||
                item["Ibu Suami"].toLowerCase().includes(query) ||
                item["Ibu Istri"].toLowerCase().includes(query) ||
                item["Ibu Istri"].toLowerCase().includes(query) ||
                item["Hari Nikah"].toLowerCase().includes(query) ||
                item["Desa"].toLowerCase().includes(query) ||
                item["Tanggal Nikah"].toLowerCase().includes(query)
            );
        });

        displayResults(filteredData);
    }

    // Fungsi untuk menampilkan hasil
    function displayResults(data) {
        resultsContainer.innerHTML = ''; // Kosongkan hasil sebelumnya

        if (data.length === 0) {
            displayMessage("Data tidak ditemukan.");
            return;
        }

        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'result-card';

            card.innerHTML = `
                <h3>Data Pasangan: ${item["Nama Suami"]} & ${item["Nama Istri"]}</h3>
                <div class="data-grid">
                    <div class="data-item">
                        <strong>Nama Suami:</strong>
                        <span>${item["Nama Suami"]}</span>
                    </div>
                    <div class="data-item">
                        <strong>Nama Istri:</strong>
                        <span>${item["Nama Istri"]}</span>
                    </div>
                    <div class="data-item">
                        <strong>Ayah Suami:</strong>
                        <span>${item["Ayah Suami"]}</span>
                    </div>
                    <div class="data-item">
                        <strong>Ayah Istri:</strong>
                        <span>${item["Ayah Istri"]}</span>
                    </div>
                    <div class="data-item">
                        <strong>Ibu Suami:</strong>
                        <span>${item["Ibu Suami"]}</span>
                    </div>
                    <div class="data-item">
                        <strong>Ibu Istri:</strong>
                        <span>${item["Ibu Istri"]}</span>
                    </div>

                    <div class="data-item">
                        <strong>Hari Nikah:</strong>
                        <span>${item["Hari Nikah"]}</span>
                    </div>
                    <div class="data-item">
                        <strong>Tanggal Nikah:</strong>
                        <span>${item["Tanggal Nikah"]}</span>
                    </div>
                    <div class="data-item">
                        <strong>Desa:</strong>
                        <span>${item["Desa"]}</span>
                    </div>
                    
                    <div class="akta-info data-item">
                        <strong>Nomor Akta Nikah:</strong>
                        <span>${item["Nomor Akta Nikah"]}</span>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }

    // Tambahkan event listener untuk input
    // Menggunakan 'input' agar pencarian dinamis saat mengetik
    searchInput.addEventListener('input', handleSearch);

    // Panggil fetchData() saat halaman pertama kali dimuat
    fetchData();
});

