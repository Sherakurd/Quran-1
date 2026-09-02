let allSurahs = [];
let currentSurahNumber = 1;
let currentSurahName = '';

// سیستمی کاتەکانی بانگ بە پێی API فەرمی (AlAdhan API) بۆ شارەکانی کوردستان
async function fetchPrayerTimes() {
    const city = document.getElementById('city-select').value;
    const grid = document.getElementById('prayer-times-grid');
    grid.innerHTML = '<p>تکایە چاوەڕوانبە...</p>';

    try {
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Iraq&method=3`);
        const data = await response.json();
        const timings = data.data.timings;

        grid.innerHTML = `
            <div class="prayer-item">بەیانی<br><b>${timings.Fajr}</b></div>
            <div class="prayer-item">خۆرای<br><b>${timings.Sunrise}</b></div>
            <div class="prayer-item">نیوەڕۆ<br><b>${timings.Dhuhr}</b></div>
            <div class="prayer-item">عەسر<br><b>${timings.Asr}</b></div>
            <div class="prayer-item">مەغریب<br><b>${timings.Maghrib}</b></div>
            <div class="prayer-item">عیشا<br><b>${timings.Isha}</b></div>
        `;
    } catch (error) {
        grid.innerHTML = '<p>هەڵە لە هێنانی کاتەکانی بانگ!</p>';
    }
}

// لیستی قورئانخوێنەکان
const reciters = [
    { name: "مشاری عەفاسی", server: "https://server8.mp3quran.net/afs/" },
    { name: "عبدالباسط عبدالصمد (مجوّد)", server: "https://server7.mp3quran.net/abdulsamad/" },
    { name: "ماهر المعقیلی", server: "https://server12.mp3quran.net/maher/" },
    { name: "أحمد بن علی العجمی", server: "https://server10.mp3quran.net/ajm/Rewayat-Hafs-A-n-Asim/" },
    { name: "سعد الغامدی", server: "https://server7.mp3quran.net/s_gham/" },
    { name: "عبدالرحمن السدیس", server: "https://server11.mp3quran.net/sds/" }
];

async function fetchSurahs() {
    try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        allSurahs = data.data;
        displaySurahs(allSurahs);
        populateRecitersDropdown();
    } catch (error) {
        console.error('هەڵە:', error);
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
            <p>${surah.englishName}</p>
            <small>ژمارەی ئایەت: ${surah.numberOfAyahs}</small>
        `;
        container.appendChild(card);
    });
}

function searchSurah() {
    const query = document.getElementById('search').value.toLowerCase();
    const filtered = allSurahs.filter(surah => 
        surah.name.toLowerCase().includes(query) || 
        surah.englishName.toLowerCase().includes(query)
    );
    displaySurahs(filtered);
}

function populateRecitersDropdown() {
    const select = document.getElementById('reciter-select');
    select.innerHTML = '';
    reciters.forEach((reciter, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.innerText = reciter.name;
        select.appendChild(option);
    });
}

function playSurahAudio(number, name) {
    currentSurahNumber = number;
    currentSurahName = name;
    document.getElementById('modal-title').innerText = `گوێبیستبوونی ${name}`;
    document.getElementById('audio-modal').style.display = 'flex';
    loadAudioSource();
}

function loadAudioSource() {
    const audioPlayer = document.getElementById('audio-player');
    const selectIndex = document.getElementById('reciter-select').value;
    const selectedReciter = reciters[selectIndex];
    let formattedNumber = String(currentSurahNumber).padStart(3, '0');
    audioPlayer.src = `${selectedReciter.server}${formattedNumber}.mp3`;
    audioPlayer.play();
}

function changeReciter() { loadAudioSource(); }

function closeAudio() {
    const modal = document.getElementById('audio-modal');
    const audioPlayer = document.getElementById('audio-player');
    modal.style.display = 'none';
    audioPlayer.pause();
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme");
    html.setAttribute("data-theme", currentTheme === "dark" ? "light" : "dark");
}

// پەنجەرەی خزمەتگوزارییەکان (Modal) بە ناوەڕۆکی تەواو
function openSection(type) {
    const modal = document.getElementById('service-modal');
    const title = document.getElementById('service-modal-title');
    const body = document.getElementById('service-modal-body');
    modal.style.display = 'flex';

    if(type === 'hadith') {
        title.innerText = "📜 فەرموودەکانی پێغەمبەر ﷺ";
        body.innerHTML = `
            <p><b>١.</b> «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى» (بخاري ومسلم)</p>
            <p><b>٢.</b> «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ» (صحيح البخاري)</p>
            <p><b>٣.</b> «الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ» (متفق عليه)</p>
        `;
    } else if(type === 'adhkar') {
        title.innerText = "📿 زیکرەکان";
        body.innerHTML = `
            <p><b>زیکری بەیانیان:</b> «أصبحنا وأصبح الملك لله، والحمد لله...»</p>
            <p><b>زیکری ئێواران:</b> «أمسينا وأمسى الملك لله...»</p>
            <p><b>پاش نوێژ:</b> «استغفر الله (٣ جار)، اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام»</p>
        `;
    } else if(type === 'names') {
        title.innerText = "✨ ناوە جوانەکانی خودا (الأسماء الحسنى)";
        body.innerHTML = `<p>اللّه، الرحمن، الرحيم، الملك، القدوس، السلام، المؤمن، المهيمن، العزيز، الجبار، المتكبر، الخالق، البارئ، المصصور، الغفار، القهار، الوهاب، الرزاق، الفتاح، العليم... (٩٩ ناوی پیرۆز).</p>`;
    } else if(type === 'qibla') {
        title.innerText = "🕋 دیاریکردنی قیبلە";
        body.innerHTML = `<p>بۆ دۆزینەوەی ئاڕاستەی قیبلە بە باوەڕپێکراوی، تکایە لە مۆبایلەکەتدا خزمەتگوزاری (Location / GPS) چالاک بکە و لە شوێنێکی کراوەدا ڕوو بکە ئاڕاستەی باشووری ڕۆژاوا (کەعبەی پیرۆز لە شاری مەککەیە).</p>`;
    } else if(type === 'pand') {
        title.innerText = "💡 پەند و ئامۆژگاری بەسوود";
        body.innerHTML = `
            <p>• «سامانی مرۆڤ پارە نییە، بەڵکو ڕەوشت و ئاکاری جوانیەتی.»</p>
            <p>• «کات وەک شمشێرە، ئەگەر بڕەیتەوە ئەو دەبڕێت.»</p>
            <p>• «باشترین کەس ئەو کەسەیە کە سوودی بۆ خەڵکی هەبێت.»</p>
        `;
    } else if(type === 'nwezh') {
        title.innerText = "🤲 فێرکاری نوێژ و زەکات";
        body.innerHTML = `
            <p><b>شێوازی نوێژ:</b> پێکهاتووە لە دەستنوێژگرتن، ڕووکردنە قیبلە، نية، تکبیرة الإحرام، خوێندنی سورەتی الفاتحة، ڕوکوع، سوجدە و تشهد.</p>
            <p><b>زەکات:</b> بڕی ٢.٥٪ لەو سامان و پلارەی کە گەیشتبێتە ڕادەی (نیساب) و ساڵێکی تەواوی بەسەردا تێپەڕیبێت.</p>
        `;
    } else if(type === 'umrah') {
        title.innerText = "✈️ ڕێنمایی هەنگاو بە هەنگاوی عومرە";
        body.innerHTML = `
            <p><b>١. ئیحرام:</b> خۆشوشتن و لەبەرکردنی جلس پۆشی ئیحرام لە میقات و گوتنی نیەتی عومرە.</p>
            <p><b>٢. تەواف:</b> حەوت جار سووڕانەوە دەوری کەعبەی پیرۆز.</p>
            <p><b>٣. سەعی:</b> حەوت جار هاتووچۆ کردن نێوان چیاکانی سەفا و مەروە.</p>
            <p><b>٤. هەڵاواردن:</b> تاشین یان کورتکردنەوەی قژ بۆ کۆتایی هێنان بە ئیحرام.</p>
        `;
    } else if(type === 'health') {
        title.innerText = "🩺 تەندروستی و پزیشکی لە ئیسلامدا";
        body.innerHTML = `
            <p>• گرنگیدان بە پاکوخاوێنی و دەستنوێشگرتن کە ڕێگری لە بڵاوبوونەوەی میکرۆب دەکات.</p>
            <p>• سوودەکانی هەنگوین و دەنکە ڕەشە (حبة البركة) بۆ بەهێزکردنی بەرگری لەش.</p>
            <p>• میانڕەوی لە خواردن و خواردنەوە وەک پێغەمبەر ﷺ فەرموویەتی: «ما ملأ آدمي وعاءً شراًّ من بطن...».</p>
        `;
    }
}

function closeServiceModal() {
    document.getElementById('service-modal').style.display = 'none';
}

// جێبەجێکردنی سەرەتایی
fetchSurahs();
fetchPrayerTimes();
