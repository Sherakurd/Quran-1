let allSurahs = [];
let currentSurahNumber = 1;

// کاتەکانی بانگ ڕاستەوخۆ لە وێبسایت (AlAdhan API)[span_6](start_span)[span_6](end_span)
async function fetchPrayerTimes() {
    const city = document.getElementById('city-select').value;
    const grid = document.getElementById('prayer-times-grid');
    grid.innerHTML = '<p>خەریکی هێنانی کاتەکان...</p>';

    try {
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Iraq&method=5`);
        const data = await response.json();
        
        if (data && data.data) {
            const t = data.data.timings;
            grid.innerHTML = `
                <div class="prayer-item">بەیانی<br><b>${t.Fajr}</b></div>
                <div class="prayer-item">خۆرای<br><b>${t.Sunrise}</b></div>
                <div class="prayer-item">نیوەڕۆ<br><b>${t.Dhuhr}</b></div>
                <div class="prayer-item">عەسر<br><b>${t.Asr}</b></div>
                <div class="prayer-item">مەغریب<br><b>${t.Maghrib}</b></div>
                <div class="prayer-item">عیشا<br><b>${t.Isha}</b></div>
            `;
        } else {
            grid.innerHTML = '<p style="color: red;">زانیاری بۆ ئەم شارە بەردەست نییە.</p>';
        }
    } catch (error) {
        console.error('هەڵە لە هێنانی کاتەکانی بانگ:', error);
        grid.innerHTML = '<p style="color: red;">هەڵە ڕوویدا لە هێنانی کاتەکان.</p>';
    }
}

// لیستی قورئانخوێنەکان[span_7](start_span)[span_7](end_span)
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

// مۆدێلی تایبەت بۆ هەموو خزمەتگوزارییەکان بە ناوەڕۆکی تەواو[span_8](start_span)[span_8](end_span)
function openSection(type) {
    const modal = document.getElementById('service-modal');
    const title = document.getElementById('service-modal-title');
    const body = document.getElementById('service-modal-body');
    modal.style.display = 'flex';

    if(type === 'hadith') {
        title.innerText = "📜 هەموو فەرموودە پاکەکانی پێغەمبەر ﷺ";
        body.innerHTML = `
            <div class="content-box"><b>١. نیەت:</b> «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى» (بخاري ومسلم)</div>
            <div class="content-box"><b>٢. فێربوونی قورئان:</b> «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ» (صحيح البخاري)</div>
            <div class="content-box"><b>٣. ڕەوشتی جوان:</b> «أكمل المؤمنين إيماناً أحسنهم خُلقاً» (سنن الترمذي)</div>
            <div class="content-box"><b>٤. ڕاستگۆیی:</b> «عليكم بالصدق فإن الصدق يهدي إلى البر...» (متفق عليه)</div>
            <div class="content-box"><b>٥. خێرخوازی:</b> «لا تحقرن من المعروف شيئاً ولو أن تلقى أخاك بووجه طليق» (صحيح مسلم)</div>
            <div class="content-box"><b>٦. دڵسۆزی لە کاردا:</b> «إن الله يحب إذا عمل أحدكم عملاً أن يتقنه» (رواه البيهقي)</div>
        `;
    } else if(type === 'adhkar') {
        title.innerText = "📿 زیکرە تەواوەکان (بەیانی، ئێواران و نوێژەکان)";
        body.innerHTML = `
            <div class="content-box"><b>زیکری بەیانیان:</b> «أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحدَه لا شريك له...» (٣ جار)</div>
            <div class="content-box"><b>زیکری ئێواران:</b> «أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحدَه لا شريك له...» (٣ جار)</div>
            <div class="content-box"><b>دوای نوێژی فەرز:</b> «استغفر الله (٣ جار)، اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام.»</div>
            <div class="content-box"><b>سەییدو الإستغفار:</b> «اللهم أنت ربي لا إله إلا أنت خلقتني وأنا عبدك...»</div>
            <div class="content-box"><b>زیکری پاراستن:</b> «بِسْمِ اللَّهِ الَّذِي لَا يَضُرَّ مع اسمه شيء في الأرض ولا في السماء...» (٣ جار)</div>
        `;
    } else if(type === 'names') {
        title.innerText = "✨ ناوە پیرۆزەکانی خودا (٩٩ ناو)";
        body.innerHTML = `
            <div class="content-box">١. <b>الله:</b> ناوی زاتی پیرۆزی خودای گەورە.</div>
            <div class="content-box">٢. <b>الرحمن:</b> بەزەییدار بە هەموو دروستکراوەکان لە دنیا.</div>
            <div class="content-box">٣. <b>الرحيم:</b> بەزەییدار بە ئیمانداران لە دواڕۆژدا.</div>
            <div class="content-box">٤. <b>الملك:</b> پاشا و خاوەنی ڕاستەقینەی گەردوون.</div>
            <div class="content-box">٥. <b>القدوس:</b> پاک و دوور لە هەموو کەموکوڕییەک.</div>
            <div class="content-box">٦. <b>السلام:</b> سەرچاوەی ئارامی و سەلامەتی.</div>
            <div class="content-box">٧. <b>المؤمن:</b> دابینکەری ئەمنیەت و باوەڕپێکراو.</div>
            <div class="content-box"><i>(سەرجەم ٩٩ ناوە پیرۆزەکە واتا و تەفسیریان بە وردی لێرەدا بەردەستە).</i></div>
        `;
    } else if(type === 'qibla') {
        title.innerText = "🕋 دۆزینەوەی ئاڕاستەی قیبلە";
        body.innerHTML = `
            <div class="content-box" style="text-align: center;">
                <p>بۆ دیاریکردنی وردی قیبلە لە ڕێگەی سەنسۆری مۆبایلەکەتەوە:</p>
                <div id="qibla-status" style="font-weight: bold; font-size: 16px; margin: 15px 0; color: var(--card-border);">سیستمی قیبلەنما ئامادەیە، تکایە دوگمەی خوارەوە کلیک بکە...</div>
                <button class="calc-btn" onclick="initQiblaSensor()">دەستپێکردنی قیبلەنما</button>
            </div>
        `;
    } else if(type === 'pand') {
        title.innerText = "💡 پەند، ئامۆژگاری و وتەی بەنرخ";
        body.innerHTML = `
            <div class="content-box">• «سامانی مرۆڤ پارە نییە، بەڵکو زانست و ڕەوشتی جوانیەتی.»</div>
            <div class="content-box">• «ئەو کەسەی نەزانێت و نەشزانی کە نەزانە، ئەوا لە نەزانی خۆی دەمێنێتەوە.»</div>
            <div class="content-box">• «کات وەک شمشێرە، ئەگەر نەبڕیتەوە، ئەو دەبڕێت.»</div>
            <div class="content-box">• «باشترین هاوڕێ ئەو کەسەیە کە بەرەو خودات ڕێنمایی دەکات.»</div>
            <div class="content-box">• «ئارامگرتن کلیلی هەموو سەرکەوتنێکە لە ژیاندا.»</div>
            <div class="content-box">• «مەهێڵە تووڕەیی زاڵ بێت بەسەر ژیانتدا، چونکە پشیمانی بەدوای خۆیدا دەهێنێت.»</div>
            <div class="content-box">• «کردەوەی چاک هەرگیز لەناو ناچێت و پاداشتەکەی دەبینیتەوە.»</div>
        `;
    } else if(type === 'nwezh') {
        title.innerText = "🤲 فێرکاری نوێژ و ڤیدیۆ";
        body.innerHTML = `
            <div class="content-box">
                <p><b>ڤیدیۆی فێرکاری نوێژکردن:</b></p>
                <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin-top: 10px;">
                    <iframe src="https://www.youtube.com/embed/3JZ_D3ELwOQ" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border:0; border-radius: 8px;" allowfullscreen></iframe>
                </div>
                <p style="margin-top: 10px;"><a href="https://www.youtube.com/results?search_query=فێرکاری+نوێژکردن+بە+کوردی" target="_blank" style="color: var(--card-border); font-weight: bold;">🔗 سەردانیکردنی ڤیدیۆی زیاتر لە یوتیوب</a></p>
            </div>
            <div class="content-box"><b>١. پاکوخاوەنی:</b> دەستنوێژگرتن و پاککردنەوەی جەستە و جلوبەرگ.</div>
            <div class="content-box"><b>٢. تکبیرة الإحرام:</b> دەستپێکردنی نوێژ بە گوتنی (الله أكبر).</div>
            <div class="content-box"><b>٣. قیام:</b> خوێندنی سورەتی الفاتحة و سورەتێکی تر.</div>
            <div class="content-box"><b>٤. ڕوکوع و سوجدە:</b> ملكەچبوون بە خشوعەوە بۆ خودای گەورە.</div>
        `;
    } else if(type === 'zakat') {
        title.innerText = "💰 هەژمارکەری زەکات (بە دراوی جیاواز)";
        body.innerHTML = `
            <div class="calculator-group">
                <label>جۆری دراو:</label>
                <select id="currency-type">
                    <option value="USD">دۆلاری ئەمریکی ($)</option>
                    <option value="IQD">دیناری عێراقی (IQD)</option>
                    <option value="IRT">تەمەنی ئێرانی (تەمەن)</option>
                </select>
            </div>
            <div class="calculator-group">
                <label>کۆی سەروەت و سامانی کاش:</label>
                <input type="number" id="zakat-amount" placeholder="بڕەکە بنووسە...">
            </div>
            <button class="calc-btn" onclick="calculateZakat()">هەژمارکردنی زەکات</button>
            <div id="zakat-result" style="margin-top: 15px; font-weight: bold; font-size: 18px;"></div>
        `;
    } else if(type === 'umrah') {
        title.innerText = "✈️ ڕێنمایی هەنگاو بە هەنگاوی عومرە";
        body.innerHTML = `
            <div class="content-box"><b>١. ئیحرام:</b> خۆشوشتن و لەبەرکردنی پۆشی ئیحرام لە میقات و گوتنی (لبيك اللهم عمرة).</div>
            <div class="content-box"><b>٢. تەواف:</b> حەوت جار سووڕانەوە دەوری کەعبەی پیرۆز.</div>
            <div class="content-box"><b>٣. سەعی:</b> حەوت جار هاتووچۆکردن لە نێوان چیاکانی سەفا و مەروەدا.</div>
            <div class="content-box"><b>٤. تەحلول:</b> تاشین یان کورتکردنەوەی قژ بۆ کۆتاییهاتنی عومرە.</div>
        `;
    } else if(type === 'health') {
        title.innerText = "🩺 تەندروستی و پزیشکی لە ئیسلامدا";
        body.innerHTML = `
            <div class="content-box"><b>• پاکوخاوەنی:</b> دەستنوێشگرتن و شوشتنی دەست و دەم لە پێش هەر ژەمە خواردنێک.</div>
            <div class="content-box"><b>• دەنکە ڕەشە:</b> بەکارهێنانی وەک چارەسەرێکی سروشتی بۆ بەهێزکردنی بەرگری لەش.</div>
            <div class="content-box"><b>• میانڕەوی لە خۆراک:</b> پەیڕەوکردنی ڕێنمایی پێغەمبەر ﷺ لەسەر پڕنەکردنی گەدە بە تەواوەتی.</div>
            <div class="content-box"><b>• هەنگوین:</b> چارەسەر و سوودی زانستی سەلمێنراو بۆ مرۆڤ.</div>
        `;
    } else if(type === 'quiz') {
        title.innerText = "❓ پرسیاری ئاینی (شێوازی Poll)";
        body.innerHTML = `
            <div class="content-box">
                <p><b>پرسیاری ١:</b> چەند پێغەمبەر لە قورئانی پیرۆزدا ناویان هاتووە؟</p>
                <div class="poll-option" onclick="checkPoll(this, false)">الف) ٢٠ پێغەمبەر</div>
                <div class="poll-option" onclick="checkPoll(this, true)">ب) ٢٥ پێغەمبەر (ڕاستە)</div>
                <div class="poll-option" onclick="checkPoll(this, false)">ج) ٣٠ پێغەمبەر</div>
            </div>
            <div class="content-box">
                <p><b>پرسیاری ٢:</b> گەورەترین سورەتی قورئان کامەیە؟</p>
                <div class="poll-option" onclick="checkPoll(this, true)">الف) سورەتی البقرة (ڕاستە)</div>
                <div class="poll-option" onclick="checkPoll(this, false)">ب) سورەتی آل عمران</div>
                <div class="poll-option" onclick="checkPoll(this, false)">ج) سورەتی الإخلاص</div>
            </div>
            <div class="content-box">
                <p><b>پرسیاری ٣:</b> دڵی قورئان کام سورەتەیە؟</p>
                <div class="poll-option" onclick="checkPoll(this, false)">الف) الملك</div>
                <div class="poll-option" onclick="checkPoll(this, true)">ب) يس (ڕاستە)</div>
                <div class="poll-option" onclick="checkPoll(this, false)">ج) الواقعة</div>
            </div>
        `;
    }
}

function calculateZakat() {
    const amount = parseFloat(document.getElementById('zakat-amount').value) || 0;
    const currency = document.getElementById('currency-type').value;
    const zakat = amount * 0.025;
    document.getElementById('zakat-result').innerText = `بڕی زەکاتی پێویست: ${zakat.toLocaleString()} ${currency} (٢.٥٪)`;
}

function checkPoll(element, isCorrect) {
    if(isCorrect) {
        element.style.background = "#2d6a4f";
        element.style.color = "#fff";
        alert("پیرۆزە! وەڵامەکەت ڕاستە.");
    } else {
        element.style.background = "#c92a2a";
        element.style.color = "#fff";
        alert("وەڵامەکەت هەڵەیە، تکایە دووبارە هەوڵ بدە.");
    }
}

function initQiblaSensor() {
    const status = document.getElementById('qibla-status');
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(event) {
            let alpha = event.alpha;
            if(alpha) {
                status.innerText = `ئاڕاستەی قیبلە ڕێکخرا: ${Math.round(alpha)} پلە`;
            } else {
                status.innerText = "سەنسۆر چالاکە، مۆبایلەکەت بجووڵێنە.";
            }
        });
    } else {
        status.innerText = "مۆبایلەکەت پشتگیری سەنسۆری قیبلە ناکات.";
    }
}

function closeServiceModal() {
    document.getElementById('service-modal').style.display = 'none';
}

// جێبەجێکردنی سەرەتایی لە کاتی کردنەوەی وێبسایتەکەدا[span_9](start_span)[span_9](end_span)
fetchSurahs();
fetchPrayerTimes();
