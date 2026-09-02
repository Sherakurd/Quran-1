let allSurahs = [];

async function fetchSurahs() {
    try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        allSurahs = data.data;
        displaySurahs(allSurahs);
    } catch (error) {
        console.error('هەڵە لە هێنانی زانیارییەکان:', error);
    }
}

function displaySurahs(surahs) {
    const container = document.getElementById('surahs-list');
    container.innerHTML = '';
    
    surahs.forEach(surah => {
        const card = document.createElement('div');
        card.className = 'surah-card';
        card.onclick = () => playSurahAudio(surah.number, surah.name);
        card.innerHTML = `
            <h3>${surah.name}</h3>
            <p>${surah.englishName} (${surah.englishNameTranslation})</p>
            <small>ژمارەی ئایەت: ${surah.numberOfAyahs} | جۆر: ${surah.revelationType === 'Meccan' ? 'مەککی' : 'مەدەنی'}</small>
        `;
        container.appendChild(card);
    });
}

// سیستمی گەڕان
function searchSurah() {
    const query = document.getElementById('search').value.toLowerCase();
    const filtered = allSurahs.filter(surah => 
        surah.name.toLowerCase().includes(query) || 
        surah.englishName.toLowerCase().includes(query) ||
        surah.number.toString().includes(query)
    );
    displaySurahs(filtered);
}

// کردنەوەی پەنجەرەی لێدانی دەنگ (بەکارهێنانی قورئان خوێن ئەفدوڵ جیهانی یان مشاری عەفاسی)
function playSurahAudio(surahNumber, surahName) {
    const modal = document.getElementById('audio-modal');
    const modalTitle = document.getElementById('modal-title');
    const audioPlayer = document.getElementById('audio-player');
    
    modalTitle.innerText = `گوێبیستبوونی ${surahName}`;
    
    // ڕێکخستنی لینکی دەنگی سورەتەکان (لێرەدا دەنگی شێخ مشاری عەفاسی بەکارهاتووە وەک نموونە)
    let formattedNumber = String(surahNumber).padStart(3, '0');
    audioPlayer.src = `https://server8.mp3quran.net/afs/${formattedNumber}.mp3`;
    
    modal.style.display = 'flex';
    audioPlayer.play();
}

// داخستنی پەنجەرەی دەنگ
function closeAudio() {
    const modal = document.getElementById('audio-modal');
    const audioPlayer = document.getElementById('audio-player');
    modal.style.display = 'none';
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
}

fetchSurahs();
