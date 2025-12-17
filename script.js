const API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const RANDOM_API_URL = 'https://www.themealdb.com/api/json/v1/1/random.php';

document.addEventListener('DOMContentLoaded', () => {
    // Jalankan Intro
    const introOverlay = document.getElementById('intro-overlay');
    const appContent = document.querySelector('.app-content');
    const loadingLogo = document.getElementById('loading-logo');
    const headerLogo = document.getElementById('header-logo');

    // Mulai load data resep
    loadRandomRecipes();

    // Animasi Loading Screen (3 detik)
    setTimeout(() => {
        // Efek Logo Mengecil ke Atas
        loadingLogo.style.transform = 'scale(0.2) translateY(-500px)';
        loadingLogo.style.opacity = '0';
        
        // Sembunyikan Overlay
        introOverlay.style.opacity = '0';
        
        // Munculkan Halaman Utama
        appContent.classList.add('visible');
        headerLogo.classList.add('active');

        setTimeout(() => {
            introOverlay.style.display = 'none';
        }, 1000);
    }, 3000);
});

// FUNGSI PENCARIAN
async function searchRecipe() {
    const input = document.getElementById('searchInput');
    const container = document.getElementById('resultsContainer');
    const term = input.value.trim();

    if (!term) return;

    container.innerHTML = '<p style="text-align:center; color: #d4af37;">Mencari dalam arsip eksklusif...</p>';

    try {
        const response = await fetch(API_URL + term);
        const data = await response.json();
        renderSearch(data.meals);
    } catch (err) {
        container.innerHTML = '<p>Maaf, terjadi masalah koneksi.</p>';
    }
}

function renderSearch(meals) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '';

    if (!meals) {
        container.innerHTML = '<p style="text-align:center">Hidangan tidak ditemukan dalam koleksi kami.</p>';
        return;
    }

    meals.forEach(meal => {
        const div = document.createElement('div');
        div.className = 'recipe-result';
        div.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div>
                <h3>${meal.strMeal}</h3>
                <p>${meal.strArea} | ${meal.strCategory}</p>
                <a href="${meal.strYoutube}" target="_blank">LIHAT VIDEO PREPARASI</a>
            </div>
        `;
        container.appendChild(div);
    });
}

// FUNGSI RANDOM CAROUSEL
async function loadRandomRecipes() {
    const track = document.getElementById('randomRecipeCarousel');
    
    // Mengambil 5 resep acak
    for (let i = 0; i < 5; i++) {
        try {
            const res = await fetch(RANDOM_API_URL);
            const data = await res.json();
            const meal = data.meals[0];
            
            const card = document.createElement('div');
            card.className = 'random-card';
            card.innerHTML = `
                <h3>${meal.strMeal}</h3>
                <p>Spesialisasi: ${meal.strArea}</p>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <p style="font-size: 0.85em; opacity: 0.8;">${meal.strInstructions.substring(0, 120)}...</p>
            `;
            track.appendChild(card);
        } catch (e) { console.error(e); }
    }
    
    // Jalankan Auto-Slide
    let slideIndex = 0;
    setInterval(() => {
        slideIndex = (slideIndex + 1) % 5;
        track.style.transform = `translateX(-${slideIndex * 100}%)`;
    }, 5000);
}
