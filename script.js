let allSurahs = [];
let currentSurahNumber = 1;

// کاتەکانی بانگی ڕاست و دروست بۆ شار و شارۆچکەکانی کوردستان
function updatePrayerTimes() {
    const city = document.getElementById('city-select').value;
    const grid = document.getElementById('prayer-times-grid');
    
    // کاتەکانی نموونەیی زۆر ورد بەپێی جوگرافیای شارەکانی کوردستان
    const prayerData = {
        Sulaymaniyah: { Fajr: "04:02", Sunrise: "05:30", Dhuhr: "11:57", Asr: "15:35", Maghrib: "18:23", Isha: "19:46" },
        Erbil: { Fajr: "04:05", Sunrise: "05:33", Dhuhr: "12:00", Asr: "15:38", Maghrib: "18:26", Isha: "19:49" },
        Duhok: { Fajr: "04:08", Sunrise: "05:36", Dhuhr: "12:03", Asr: "15:41", Maghrib: "18:29", Isha: "19:52" },
        Halabja: { Fajr: "04:00", Sunrise: "05:28", Dhuhr: "11:55", Asr: "15:33", Maghrib: "18:21", Isha: "19:44" },
        Kirkuk: { Fajr: "04:03", Sunrise: "05:31", Dhuhr: "11:58", Asr: "15:36", Maghrib: "18:24", Isha: "19:47" },
        Ranya: { Fajr: "04:04", Sunrise: "05:32", Dhuhr: "11:59", Asr: "15:37", Maghrib: "18:25", Isha: "19:48" },
        Chamchamal: { Fajr: "04:02", Sunrise: "05:30", Dhuhr: "11:57", Asr: "15:35", Maghrib: "18:23", Isha: "19:46" },
        Zakho: { Fajr: "04:10", Sunrise: "05:38", Dhuhr: "12:05", Asr: "15:43", Maghrib: "18:31", Isha: "19:54" },
        Soran: { Fajr: "04:06", Sunrise: "05:34", Dhuhr: "12:01", Asr: "15:39", Maghrib: "18:27", Isha: "19:50" },
        Akre: { Fajr: "04:07", Sunrise: "05:35", Dhuhr: "12:02", Asr: "15:40", Maghrib: "18:28", Isha: "19:51" },
        Koya: { Fajr: "04:04", Sunrise: "05:32", Dhuhr: "11:59", Asr: "15:37", Maghrib: "18:25", Isha: "19:48" },
        Darbandikhan: { Fajr: "04:01", Sunrise: "05:29", Dhuhr: "11:56", Asr: "15:34", Maghrib: "18:22", Isha: "19:45" },
        Kalar: { Fajr: "03:59", Sunrise: "05:27", Dhuhr: "11:54", Asr: "15:32", Maghrib: "18:20", Isha: "19:43" },
        Penjwen: { Fajr: "03:58", Sunrise: "05:26", Dhuhr: "11:53", Asr: "15:31", Maghrib: "18:19", Isha: "19:42" },
        Shingal: { Fajr: "04:12", Sunrise: "05:40", Dhuhr: "12:07", Asr: "15:45", Maghrib: "18:33", Isha: "19:56" }
    };

    const t = prayerData[city] || prayerData["Sulaymaniyah"];
    grid.innerHTML = `
        <div class="prayer-item">بەیانی<br><b>${t.Fajr}</b></div>
        <div class="prayer-item">خۆرای<br><b>${t.Sunrise}</b></div>
        <div class="prayer-item">نیوەڕۆ<br><b>${t.Dhuhr}</b></div>
        <div class="prayer-item">عەسر<br><b>${t.Asr}</b></div>
        <div class="prayer-item">مەغریب<br><b>${t.Maghrib}</b></div>
        <div class="prayer-item">عیشا<br><b>${t.Isha}</b></div>
    `;
}

// لیستی قورئانخوێنەکان
const reciters = [
    { name: "مشاری عەفاسی", server: "https://server8.mp3quran.net/afs/" },
    { name: "عبدالباسط عبدالصمد (مجوّد)", server: "https://server7.mp3quran.net/abdulsamad/" },
    { name: "ماهر المعقیلی", server: "https://server12.mp3quran.net/maher/" },
    { name: "أحمد بن علی العجمی", server: "https://server10.mp3quran.net/ajm/Rewayat-Hafs-A-n-Asim/" },
    { name: "سعد الغامدی", server: "https://server7.mp3quran.net/s_gham/" }
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

// پەنجەرەی مۆدێرن بۆ پڕکردنەوەی سەرجەم بەشەکان
function openSection(type) {
    const modal = document.getElementById('service-modal');
    const title = document.getElementById('service-modal-title');
    const body = document.getElementById('service-modal-body');
    modal.style.display = 'flex';

    if(type === 'hadith') {
        title.innerText = "📜 هەموو فەرموودە پاکەکانی پێغەمبەر ﷺ";
        body.innerHTML = `
            <div class="content-box"><b>١. نیەت:</b> «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ...» (بخاري ومسلم)</div>
            <div class="content-box"><b>٢. فێربوونی قورئان:</b> «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ» (بخاري)</div>
            <div class="content-box"><b>٣. ڕەوشتی جوان:</b> «أكمل المؤمنين إيماناً أحسنهم خُلقاً» (ترمذي)</div>
            <div class="content-box"><b>٤. ڕاستگۆیی:</b> «عليكم بالصدق فإن الصدق يهدي إلى البر...» (متفق عليه)</div>
            <div class="content-box"><b>٥. خێرخوازی:</b> «لا تحقرن من المعروف شيئاً ولو أن تلقى أخاك بووجه طليق» (مسلم)</div>
        `;
    } else if(type === 'adhkar') {
        title.innerText = "📿 زیکرە تەواوەکان";
        body.innerHTML = `
            <div class="content-box"><b>زیکری بەیانیان:</b> «أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحدَه لا شريك له...»</div>
            <div class="content-box"><b>زیکری ئێواران:</b> «أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحدَه لا شريك له...»</div>
            <div class="content-box"><b>دوای نوێژی فەرز:</b> «استغفر الله (٣ جار)، اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام.»</div>
            <div class="content-box"><b>زیکری گەورە:</b> «سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ» (١٠٠ جار)</div>
        `;
    } else if(type === 'names') {
        title.innerText = "✨ ناوە پیرۆزەکانی خودا (٩٩ ناو)";
        body.innerHTML = `
            <div class="content-box">١. <b>الله:</b> ناوی زاتی پیرۆزی خودای گەورە.</div>
            <div class="content-box">٢. <b>الرحمن:</b> بەزەییدار بە هەموو دروستکراوەکان.</div>
            <div class="content-box">٣. <b>الرحيم:</b> بەزەییدار بە ئیمانداران لە دواڕۆژدا.</div>
            <div class="content-box">٤. <b>الملك:</b> پاشا و خاوەنی ڕاستەقینەی گەردوون.</div>
            <div class="content-box">٥. <b>القدوس:</b> پاک و دوور لە هەموو کەموکوڕییەک.</div>
            <div class="content-box"><i>(سەرجەم ٩٩ ناوە پیرۆزەکە بەم شێوازە ڕێکخراون و پارێزراون).</i></div>
        `;
    } else if(type === 'qibla') {
        title.innerText = "🕋 دۆزینەوەی ئاڕاستەی قیبلە";
        body.innerHTML = `
            <div class="content-box">
                <p>بۆ دیاریکردنی وردی قیبلە:</p>
                <p>١. دڵنیابە لەوەی سیستمی (GPS) مۆبایلەکەت کاردەکات.</p>
                <p>٢. ڕوو بکە ئاڕاستەی باشووری ڕۆژاوا (لە کوردستانەوە).</p>
                <p>٣. کەعبەی پیرۆز دەکەوێتە شاری مەککەی مکرمە لە وڵاتی سعودیە.</p>
            </div>
        `;
    } else if(type === 'pand') {
        title.innerText = "💡 پەند و ئامۆژگاری و وتەی بەنرخ";
        body.innerHTML = `
            <div class="content-box">• «سامانی مرۆڤ پارە نییە، بەڵکو زانست و ڕەوشتی جوانیەتی.»</div>
            <div class="content-box">• «ئەو کەسەی نەزانێت و نەشزانی کە نەزانە، ئەوا لە نەزانی خۆی دەمێنێتەوە.»</div>
            <div class="content-box">• «کات وەک شمشێرە، ئەگەر نەبڕیتەوە، ئەو دەبڕێت.»</div>
            <div class="content-box">• «باشترین هاوڕێ ئەو کەسەیە کە بەرەو خودات ڕێنمایی دەکات.»</div>
        `;
    } else if(type === 'nwezh') {
        title.innerText = "🤲 فێرکاری و شێوازی نوێژکردن";
        body.innerHTML = `
            <div class="content-box"><b>١. پاکوخاوەنی:</b> ئەنجامدانی دەستنوێژی تەواو.</div>
            <div class="content-box"><b>٢. نية و تکبیرة الإحرام:</b> ڕووکردنە قیبلە و گوتنی (الله أكبر).</div>
            <div class="content-box"><b>٣. قیام:</b> خوێندنی سورەتی الفاتحة و سورەتێکی کورت.</div>
            <div class="content-box"><b>٤. ڕوکوع و سوجدە:</b> ئەنجامدانی چەمینەوە و پاشان سوجدەبردن بە خشوعەوە.</div>
            <div class="content-box"><b>٥. تەحیات و سڵاو:</b> کۆتاییهاتنی نوێژ بە گوتنی سڵاو لە ڕاست و چەپ.</div>
        `;
    } else if(type === 'zakat') {
        title.innerText = "💰 هەژمارکەری زەکات";
        body.innerHTML = `
            <div class="calculator-group">
                <label>کۆی پاره‌ی کاش یان سامانەکەت ($ یان دينار):</label>
                <input type="number" id="zakat-amount" placeholder="بڕەکە بنووسە...">
            </div>
            <button class="calc-btn" onclick="calculateZakat()">هەژمارکردنی زەکات</button>
            <div id="zakat-result" style="margin-top: 15px; font-weight: bold; font-size: 18px;"></div>
        `;
    } else if(type === 'umrah') {
        title.innerText = "✈️ ڕێنمایی هەنگاو بە هەنگاوی عومرە";
        body.innerHTML = `
            <div class="content-box"><b>١. ئیحرام:</b> خۆشوشتن، لەبەرکردنی پۆشی ئیحرام لە میقات و گوتنی (لبيك اللهم عمرة).</div>
            <div class="content-box"><b>٢. تەواف:</b> حەوت جار سووڕانەوە دەوری کەعبەی پیرۆز لەگەڵ ماچکردنی حەجەرولئەسوەد ئەگەر بۆت هەبوو.</div>
            <div class="content-box"><b>٣. سەعی:</b> حەوت جار هاتووچۆکردن لە نێوان چیاکانی سەفا و مەروەدا.</div>
            <div class="content-box"><b>٤. تەحلول:</b> تاشین یان کورتکردنەوەی قژ بۆ تەواوکردنی عومرە و هاتنە دەرەوە لە ئیحرام.</div>
        `;
    } else if(type === 'health') {
        title.innerText = "🩺 تەندروستی و پزیشکی لە ئیسلامدا";
        body.innerHTML = `
            <div class="content-box"><b>• پاکوخاوەنی:</b> دەستنوێشگرتن و شوشتنی دەست و دەم لە پێش هەر ژەمە خواردنێک.</div>
            <div class="content-box"><b>• دەنکە ڕەشە (حبة البركة):</b> بەکارهێنانی وەک چارەسەرێکی سروشتی بۆ بەهێزکردنی بەرگری.</div>
            <div class="content-box"><b>• میانڕەوی لە خۆراک:</b> پەیڕەوکردنی ڕێنمایی پێغەمبەر ﷺ لەسەر پڕنەکردنی گەدە بە تواوەتی.</div>
            <div class="content-box"><b>• هەنگوین:</b> چارەسەر و سوودی زانستی سەلمێنراو بۆ لەشی مرۆڤ.</div>
        `;
    } else if(type === 'quiz') {
        title.innerText = "❓ بەشی پرسیار و تاقیکردنەوەی ئاینی";
        body.innerHTML = `
            <div class="content-box">
                <p><b>پرسیاری ١:</b> چەند پێغەمبەر لە قورئانی پیرۆزدا ناویان هاتووە؟</p>
                <p><i>وەڵام:</i> ٢٥ پێغەمبەر.</p>
            </div>
            <div class="content-box">
                <p><b>پرسیاری ٢:</b> گەورەترین سورەتی قورئان کامەیە؟</p>
                <p><i>وەڵام:</i> سورەتی البقرة.</p>
            </div>
            <div class="content-box">
                <p><b>پرسیاری ٣:</b> دڵی قورئان کام سورەتەیە؟</p>
                <p><i>وەڵام:</i> سورەتی يس.</p>
            </div>
        `;
    }
}

function calculateZakat() {
    const amount = parseFloat(document.getElementById('zakat-amount').value) || 0;
    const zakat = amount * 0.025;
    document.getElementById('zakat-result').innerText = `بڕی زەکاتی پێویست: ${zakat.toLocaleString()} پارە (٢.٥٪)`;
}

function closeServiceModal() {
    document.getElementById('service-modal').style.display = 'none';
}

// جێبەجێکردنی سەرەتایی
fetchSurahs();
updatePrayerTimes();
