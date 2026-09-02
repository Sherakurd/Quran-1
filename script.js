async function fetchSurahs() {
    try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        const container = document.getElementById('surahs-list');
        
        data.data.forEach(surah => {
            const card = document.createElement('div');
            card.className = 'surah-card';
            card.innerHTML = `
                <h3>${surah.englishName}</h3>
                <p>${surah.name}</p>
                <small>ژمارەی ئایەت: ${surah.numberOfAyahs} | ${surah.revelationType}</small>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('هەڵە لە هێنانی زانیارییەکان:', error);
    }
}

fetchSurahs();
