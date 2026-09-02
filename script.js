let allSurahs = [];
let currentSurahNumber = 1;
let currentSurahName = '';

// فەرهەنگی زمانەکان (Translation Dictionary)
const translations = {
    ku: {
        main_title: "قورئانی پیرۆز و خزمەتگوزاریەکان",
        theme_btn: "🌙 / ☀️",
        search_ph: "گەڕان بەدوای سورەتدا...",
        prayer_times_title: "🕌 کاتەکانی بانگ لە شارەکانی کوردستان",
        sec_hadith: "📜 فەرموودەکانی پێغەمبەر ﷺ",
        sec_hadith_desc: "فەرموودەی پاک و ڕاستەقینە",
        sec_adhkar: "📿 زیکرەکان",
        sec_adhkar_desc: "زیکری بەیانیان، ئێواران و نوێژەکان",
        sec_names: "✨ ناوە جوانەکانی خودا",
        sec_names_desc: "٩٩ ناوە پیرۆزەکەی خودای گەورە",
        sec_qibla: "🕋 قیبلەنما",
        sec_qibla_desc: "دۆزینەوەی ئاڕاستەی کەعبەی پیرۆز",
        sec_pand: "💡 پەند و ئامۆژگاری",
        sec_pand_desc: "چیرۆک و پەندی بەسود بۆ ژیان",
        sec_nwezh: "🤲 نوێژ و زەکات",
        sec_nwezh_desc: "شێوازی نوێژکردن و هەژمارکردنی زەکات",
        sec_umrah: "✈️ ڕێنمایی عومرە",
        sec_umrah_desc: "هەنگاو بە هەنگاوی ئەنجامدانی عومرە",
        sec_health: "🩺 تەندروستی لە ئیسلامدا",
        sec_health_desc: "سوود و ڕێنمایی پزیشکی و سوننەتەکان",
        surahs_heading: "📖 سورەتەکانی قورئانی پیرۆز",
        reciter_label: "قورئانخوێن: "
    },
    en: {
        main_title: "Holy Quran & Islamic Services",
        theme_btn: "🌙 / ☀️",
        search_ph: "Search Surah...",
        prayer_times_title: "🕌 Prayer Times in Kurdistan",
        sec_hadith: "📜 Prophet's Hadiths",
        sec_hadith_desc: "Authentic sayings of the Prophet",
        sec_adhkar: "📿 Adhkar",
        sec_adhkar_desc: "Morning, evening and prayer adhkar",
        sec_names: "✨ Names of Allah",
        sec_names_desc: "99 Beautiful Names of Allah",
        sec_qibla: "🕋 Qibla Direction",
        sec_qibla_desc: "Find the direction of the Holy Kaaba",
        sec_pand: "💡 Wisdom & Advice",
        sec_pand_desc: "Useful stories and wisdom",
        sec_nwezh: "🤲 Prayer & Zakat",
        sec_nwezh_desc: "How to pray and calculate Zakat",
        sec_umrah: "✈️ Umrah Guide",
        sec_umrah_desc: "Step-by-step Umrah guide",
        sec_health: "🩺 Islamic Health",
        sec_health_desc: "Medical benefits and Sunnah guides",
        surahs_heading: "📖 Surahs of the Holy Quran",
        reciter_label: "Reciter: "
    },
    ar: {
        main_title: "القرآن الكريم والخدمات الإسلامية",
        theme_btn: "🌙 / ☀️",
        search_ph: "ابحث عن سورة...",
        prayer_times_title: "🕌 مواقيت الصلاة في مدن كوردستان",
        sec_hadith: "📜 الأحاديث النبوية",
        sec_hadith_desc: "أحاديث نبوية صحيحة",
        sec_adhkar: "📿 الأذكار",
        sec_adhkar_desc: "أذكار الصباح والمساء والصلاة",
        sec_names: "✨ أسماء الله الحسنى",
        sec_names_desc: "99 اسماً حسناً لله",
        sec_qibla: "🕋 القبلة",
        sec_qibla_desc: "معرفة اتجاه الكعبة المشرفة",
        sec_pand: "💡 حكم ومواعظ",
        sec_pand_desc: "قصص وعبر مفيدة للحياة",
        sec_nwezh: "🤲 الصلاة والزكاة",
        sec_nwezh_desc: "طريقة الصلاة وحساب الزكاة",
        sec_umrah: "✈️ دليل العمرة",
        sec_umrah_desc: "خطوات أداء العمرة بالتفصيل",
        sec_health: "🩺 الصحة في الإسلام",
        sec_health_desc: "الفوائد الطبية والسنن النبوية",
        surahs_heading: "📖 سور القرآن الكريم",
        reciter_label: "القارئ: "
    }
    // دەتوانیت بۆ زمانەکانی تریش وەکو ترکی و کورمانجی زیادی بکەیت
};

// گۆڕینی زمان
function changeLanguage(lang) {
    const texts = translations[lang] || translations["ku"];
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if(texts[key]) el.innerText = texts[key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        const key = el.getAttribute("data-i18n-placeholder");
        if(texts[key]) el.placeholder = texts[key];
    });
}

// گۆڕینی ڕەنگ و دۆخی (Dark/Light Mode)
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme");
    html.setAttribute("data-theme", currentTheme === "dark" ? "light" : "dark");
}

// لیستی ٣٠+ قورئانخوێن
const reciters = [
    { name: "مشاری عەفاسی", server: "https://server8.mp3quran.net/afs/" },
    { name: "عبدالباسط عبدالصمد (مجوّد)", server: "https://server7.mp3quran.net/abdulsamad/" },
    { name: "عبدالباسط عبدالصمد (مرتل)", server: "https://server7.mp3quran.net/basit/" },
    { name: "ماهر المعقیلی", server: "https://server12.mp3quran.net/maher/" },
    { name: "أحمد بن علی العجمی", server: "https://server10.mp3quran.net/ajm/Rewayat-Hafs-A-n-Asim/" },
    { name: "سعد الغامدی", server: "https://server7.mp3quran.net/s_gham/" },
    { name: "عبدالرحمن السدیس", server: "https://server11.mp3quran.net/sds/" },
    { name: "سعود الشریم", server: "https://server7.mp3quran.net/shur/" },
    { name: "محمد صديق المنشاوی (مجوّد)", server: "https://server10.mp3quran.net/minsh/" },
    { name: "أبو بكر الشاطري", server: "https://server11.mp3quran.net/shatri/" }
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

// کاتەکانی بانگ بۆ شارەکانی کوردستان (بە شێوازی نموونەیی خێرا)
function updatePrayerTimes() {
    const city = document.getElementById('city-select').value;
    const grid = document.getElementById('prayer-times-grid');
    
    // داتای کاتەکان بەپێی شارەکان
    const times = {
        Sulaymaniyah: { Fajr: "04:30", Dhuhr: "12:15", Asr: "15:45", Maghrib: "19:00", Isha: "20:30" },
        Erbil: { Fajr: "04:32", Dhuhr: "12:18", Asr: "15:48", Maghrib: "19:03", Isha: "20:33" },
        Duhok: { Fajr: "04:35", Dhuhr: "12:21", Asr: "15:52", Maghrib: "19:07", Isha: "20:37" },
        Halabja: { Fajr: "04:28", Dhuhr: "12:13", Asr: "15:43", Maghrib: "18:58", Isha: "20:28" },
        Kirkuk: { Fajr: "04:33", Dhuhr: "12:16", Asr: "15:46", Maghrib: "19:01", Isha: "20:31" }
    };

    const selectedTimes = times[city];
    grid.innerHTML = `
        <div class="prayer-item">بەیانی<br><b>${selectedTimes.Fajr}</b></div>
        <div class="prayer-item">نیوەڕۆ<br><b>${selectedTimes.Dhuhr}</b></div>
        <div class="prayer-item">عەسر<br><b>${selectedTimes.Asr}</b></div>
        <div class="prayer-item">مەغریب<br><b>${selectedTimes.Maghrib}</b></div>
        <div class="prayer-item">عیشا<br><b>${selectedTimes.Isha}</b></div>
    `;
}

// بەشی پەنجەرەی خزمەتگوزاریەکان (فەرموودە، زیکر، ناوەکانی خودا، قیبلە، پەند، نوێژ، عومرە، تەندروستی)
function openSection(type) {
    const modal = document.getElementById('service-modal');
    const title = document.getElementById('service-modal-title');
    const body = document.getElementById('service-modal-body');
    modal.style.display = 'flex';

    if(type === 'hadith') {
        title.innerText = "📜 فەرموودەکانی پێغەمبەر ﷺ";
        body.innerHTML = `<p>١. «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ...» (بخاري ومسلم)</p><p>٢. «خيركم من تعلم القرآن وعلمه» (بخاري)</p>`;
    } else if(type === 'adhkar') {
        title.innerText = "📿 زیکرەکان";
        body.innerHTML = `<p>• سبحان الله وبحمده (١٠٠ جار)</p><p>• استغفر الله واتوب إليه</p>`;
    } else if(type === 'names') {
        title.innerText = "✨ ناوە جوانەکانی خودا";
        body.innerHTML = `<p>1. الله - 2. الرحمن - 3. الرحيم - 4. الملك - 5. القدوس...</p>`;
    } else if(type === 'qibla') {
        title.innerText = "🕋 قیبلەنما";
        body.innerHTML = `<p>بۆ دیاریکردنی قیبلە بە وردی لە ڕێگەی GPSـی مۆبایلەکەتەوە، تکایە ڕێگە بدە وێبگەڕەکەت شوێنەکەت بەکاربهێنێت.</p>`;
    } else if(type === 'pand') {
        title.innerText = "💡 پەند و ئامۆژگاری";
        body.innerHTML = `<p>«ئەو کەسەی ڕۆژێک لە ژیانی بە فیڕۆ بدات بەبێ زانست یان کارێکی بەسوود، ئەوا ناعەدالەتی بەرامبەر کات کردووە.»</p>`;
    } else if(type === 'nwezh') {
        title.innerText = "🤲 نوێژ و زەکات";
        body.innerHTML = `<p><b>شێوازی نوێژ:</b> ڕووکردنە قیبلە، نية، تکبیرة الإحرام، خوێندنی فاتحە، رۆکوع و سجود...</p><p><b>زەکات:</b> ٢.٥٪ لەو سامانەی کە نیسابی تێپەڕاندبێت و ساڵێکی بەسەردا تێپەڕیبێت.</p>`;
    } else if(type === 'umrah') {
        title.innerText = "✈️ ڕێنمایی عومرە";
        body.innerHTML = `<p>١. ئیحرام لە میقات.<br>٢. ئەنجامدانی تەواف دەوری کەعبە (٧ جار).<br>٣. سەعی نێوان سەفا و مەروە (٧ جار).<br>٤. تاشین یان کورتکردنەوەی قژ.</p>`;
    } else if(type === 'health') {
        title.innerText = "🩺 تەندروستی لە ئیسلامدا";
        body.innerHTML = `<p>• خواردنی حەبی سەودا (حب البركة) بۆ چارەسەری هەموو نەخۆشییەک جگە لە مەرگ.<br>• زەمزەم بۆ ئەو مەبەستەی بۆی دەخورێت.<br>• دەستنوێشگرتن و پاکوخاوێنی ڕۆژانە پارێزەری لەشی مرۆڤە.</p>`;
    }
}

function closeServiceModal() {
    document.getElementById('service-modal').style.display = 'none';
}

// جێبەجێکردنی سەرەتایی
fetchSurahs();
updatePrayerTimes();
