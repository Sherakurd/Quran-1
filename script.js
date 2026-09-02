// گۆڕاوە سەرەکییەکان[span_0](start_span)[span_0](end_span)
let allSurahs = [];
let currentSurahNumber = 1;

// 1. گۆڕینی مۆدی تاریک و ڕووناک[span_1](start_span)[span_1](end_span)
const themeToggle = document.getElementById('themeToggle');
if(themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme") || document.body.getAttribute("data-theme");
    
    if (currentTheme === 'dark') {
        document.body.removeAttribute('data-theme');
        html.removeAttribute('data-theme');
        if(themeToggle) themeToggle.textContent = 'تاریک 🌙';
    } else {
        document.body.setAttribute('data-theme', 'dark');
        html.setAttribute('data-theme', 'dark');
        if(themeToggle) themeToggle.textContent = 'ڕووناک ☀️';
    }
}

// 2. کۆنتڕۆڵی مێنوی لایەنی (Sidebar)[span_2](start_span)[span_2](end_span)
const menuBtn = document.getElementById('menuBtn');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const closeSidebarBtn = document.getElementById('closeSidebar');

if(menuBtn) menuBtn.addEventListener('click', toggleSidebar);
if(closeSidebarBtn) closeSidebarBtn.addEventListener('click', toggleSidebar);
if(sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    // پشکنین بۆ ئەوەی بزانین کراوەتەوە یان داخراوە
    if (sidebar.style.left === '0px') {
        sidebar.style.left = '-280px';
        overlay.style.display = 'none';
    } else {
        sidebar.style.left = '0px';
        overlay.style.display = 'block';
    }
}

// 3. هێنانی کاتەکانی بانگ لەڕێگەی API[span_3](start_span)[span_3](end_span)
async function fetchPrayerTimes() {
    // ئەگەر ئایدی شار نەبوو با سلێمانی وەک بنچینە دابنێت
    const citySelect = document.getElementById('city-select') || document.querySelector('.prayer-controls select');
    const city = citySelect ? citySelect.value : 'Sulaymaniyah'; 
    const grid = document.querySelector('.prayer-grid') || document.getElementById('prayer-times-grid');
    
    if(!grid) return;
    grid.innerHTML = '<p>خەریکی هێنانی کاتەکان...</p>';

    try {
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Iraq&method=5`);
        const data = await response.json();
        
        if (data && data.data) {
            const t = data.data.timings;
            grid.innerHTML = `
                <div class="prayer-item">بەیانی<br><b>${t.Fajr}</b></div>
                <div class="prayer-item">خۆرەتاو<br><b>${t.Sunrise}</b></div>
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

// 4. لیستی قورئانخوێنەکان و هێنانی سوورەتەکان[span_4](start_span)[span_4](end_span)
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
    const container = document.querySelector('.grid') || document.getElementById('surahs-list');
    if(!container) return;
    
    container.innerHTML = '';
    surahs.forEach(surah => {
        const card = document.createElement('div');
        card.className = 'surah-card';
        card.onclick = () => playSurahAudio(surah.number, surah.name);
        card.innerHTML = `
            <h3>${surah.number}. ${surah.name}</h3>
            <p>${surah.englishName}</p>
            <small>مەکی/مەدەنی: ${surah.revelationType === 'Meccan' ? 'مەکی' : 'مەدەنی'} - ${surah.numberOfAyahs} ئایەت</small>
        `;
        container.appendChild(card);
    });
}

function searchSurah() {
    const searchInput = document.querySelector('.search-box input') || document.getElementById('search');
    if(!searchInput) return;
    
    const query = searchInput.value.toLowerCase();
    const filtered = allSurahs.filter(surah => 
        surah.name.toLowerCase().includes(query) || 
        surah.englishName.toLowerCase().includes(query)
    );
    displaySurahs(filtered);
}

// بەستنەوەی گەڕان بە ئینپوتەکەوە
const searchBox = document.querySelector('.search-box input');
if(searchBox) searchBox.addEventListener('input', searchSurah);


function populateRecitersDropdown() {
    const select = document.getElementById('reciter-select');
    if(!select) return;
    select.innerHTML = '';
    reciters.forEach((reciter, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.innerText = reciter.name;
        select.appendChild(option);
    });
}

// 5. لێدانی دەنگی قورئان[span_5](start_span)[span_5](end_span)
function playSurahAudio(number, name) {
    currentSurahNumber = number;
    const modalTitle = document.getElementById('modal-title');
    const audioModal = document.getElementById('audio-modal') || document.getElementById('myModal');
    
    if(modalTitle) modalTitle.innerText = `گوێبیستبوونی ${name}`;
    
    if(audioModal) {
        // ئەگەر مۆدێلەکەی پێشوو بوو ئەوا با زانیاریەکانی دەنگ پیشان بدات
        const body = audioModal.querySelector('.modal-scrollable-body');
        if(body && !document.getElementById('audio-player')) {
            audioModal.querySelector('h2').innerText = `سوورەتی ${name}`;
            body.innerHTML = `
                <div class="calculator-group">
                    <label>قورئانخوێن:</label>
                    <select id="reciter-select" onchange="changeReciter()"></select>
                </div>
                <audio id="audio-player" controls style="width: 100%; margin-top: 15px;"></audio>
            `;
            populateRecitersDropdown();
        }
        audioModal.style.display = 'flex';
    }
    
    setTimeout(loadAudioSource, 100); // دواخستنێکی کەم تا تاگی ئۆدیۆ دروست دەبێت
}

function loadAudioSource() {
    const audioPlayer = document.getElementById('audio-player');
    const select = document.getElementById('reciter-select');
    
    if(!audioPlayer) return;
    
    const selectIndex = select ? select.value : 0;
    const selectedReciter = reciters[selectIndex];
    let formattedNumber = String(currentSurahNumber).padStart(3, '0');
    
    audioPlayer.src = `${selectedReciter.server}${formattedNumber}.mp3`;
    audioPlayer.play().catch(e => console.log('Autoplay prevented', e));
}

function changeReciter() { loadAudioSource(); }

function closeAudio() {
    const audioModal = document.getElementById('audio-modal');
    const myModal = document.getElementById('myModal');
    const audioPlayer = document.getElementById('audio-player');
    
    if(audioModal) audioModal.style.display = 'none';
    if(myModal) myModal.style.display = 'none';
    if(audioPlayer) audioPlayer.pause();
}


// 6. مۆدێلی خزمەتگوزارییەکان بۆ زەکات، نوێژ، قیبلە و هتد[span_6](start_span)[span_6](end_span)
function openSection(type) {
    const modal = document.getElementById('service-modal') || document.getElementById('myModal');
    const title = document.getElementById('service-modal-title') || modal.querySelector('h2');
    const body = document.getElementById('service-modal-body') || modal.querySelector('.modal-scrollable-body');
    
    modal.style.display = 'flex';

    if(type === 'hadith') {
        title.innerText = "📜 فەرموودەکانی پێغەمبەر ﷺ (فراوان)";
        body.innerHTML = `
            <div class="content-box"><b>١. نیەت:</b> «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى» (بخاري ومسلم)</div>
            <div class="content-box"><b>٢. فێربوونی قورئان:</b> «خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ» (صحيح البخاري)</div>
            <div class="content-box"><b>٣. ڕەوشتی جوان:</b> «أكمل المؤمنين إيماناً أحسنهم خُلقاً» (سنن الترمذي)</div>
            <div class="content-box"><b>٤. ڕاستگۆیی:</b> «عليكم بالصدق فإن الصدق يهدي إلى البر...» (متفق عليه)</div>
            <div class="content-box"><b>٥. خێرخوازی:</b> «لا تحقرن من المعروف شيئاً ولو أن تلقى أخاك بووجه طليق» (صحيح مسلم)</div>
            <div class="content-box"><b>٦. دڵسۆزی لە کاردا:</b> «إن الله يحب إذا عمل أحدكم عملاً أن يتقنه» (رواه البيهقي)</div>
            <div class="content-box"><b>٧. گرنگی سڵاو:</b> «أفشوا السلام بينكم» (رواه مسلم)</div>
        `;
    } else if(type === 'adhkar') {
        title.innerText = "📿 زیکرەکان (تەواو و پڕ)";
        body.innerHTML = `
            <div class="content-box"><b>زیکری بەیانیان:</b> «أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحدَه لا شريك له...» (٣ جار)</div>
            <div class="content-box"><b>زیکری ئێواران:</b> «أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحدَه لا شريك له...» (٣ جار)</div>
            <div class="content-box"><b>دوای نوێژی فەرز:</b> «استغفر الله (٣ جار)، اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام.»</div>
            <div class="content-box"><b>سەییدو الإستغفار:</b> «اللهم أنت ربي لا إله إلا أنت خلقتني وأنا عبدك...»</div>
            <div class="content-box"><b>زیکری نووستن:</b> «باسمك ربي وضعت جنبي وبك أرفعه...»</div>
            <div class="content-box"><b>زیکری چوونە دەرەوەی ماڵ:</b> «بسم الله توكلت على الله ولا حول ولا قوة إلا بالله.»</div>
        `;
    } else if(type === 'names') {
        title.innerText = "✨ ناوە جوانەکانی خودا (٩٩ ناو)";
        body.innerHTML = `
            <div class="content-box">١. <b>الله:</b> ناوی زاتی پیرۆزی خودای گەورە.</div>
            <div class="content-box">٢. <b>الرحمن:</b> بەزەییدار بە هەموو دروستکراوەکان لە دنیا.</div>
            <div class="content-box">٣. <b>الرحيم:</b> بەزەییدار بە ئیمانداران لە دواڕۆژدا.</div>
            <div class="content-box">٤. <b>الملك:</b> پاشا و خاوەنی ڕاستەقینەی گەردوون.</div>
            <div class="content-box">٥. <b>القدوس:</b> پاک و دوور لە هەموو کەموکوڕییەک.</div>
            <div class="content-box">٦. <b>السلام:</b> سەرچاوەی ئارامی و سەلامەتی.</div>
            <div class="content-box">٧. <b>المؤمن:</b> دابینکەری ئەمنیەت و باوەڕپێکراو.</div>
            <div class="content-box">٨. <b>المهيمن:</b> چاودێر و پاسەوانی هەموو شتێک.</div>
        `;
    } else if(type === 'qibla') {
        title.innerText = "🕋 دۆزینەوەی ئاڕاستەی قیبلە";
        body.innerHTML = `
            <div class="content-box" style="text-align: center;">
                <p>بۆ دیاریکردنی وردی قیبلە لە ڕێگەی سەنسۆری ئاراستەی مۆبایلەکەتەوە:</p>
                <div id="qibla-status" style="font-weight: bold; font-size: 16px; margin: 15px 0; color: var(--card-border);">سیستمی قیبلەنما ئامادەیە، تکایە دوگمەی خوارەوە کلیک بکە...</div>
                <button class="calc-btn" onclick="initQiblaSensor()">دەستپێکردنی قیبلەنما (سەنسۆر)</button>
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
            <div class="content-box">• «ڕاستگۆیی ڕێگەی سەرکەوتنە و درۆ مرۆڤ لەناو دەبات.»</div>
        `;
    } else if(type === 'nwezh') {
        title.innerText = "🤲 فێرکاری نوێژ و ڤیدیۆی فەرمی";
        body.innerHTML = `
            <div class="content-box">
                <p><b>ڤیدیۆی فێرکاری نوێژکردن (یوتیوب):</b></p>
                <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin-top: 10px;">
                    <iframe src="https://www.youtube.com/embed/3JZ_D3ELwOQ" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border:0; border-radius: 8px;" allowfullscreen></iframe>
                </div>
                <p style="margin-top: 12px;"><a href="https://www.youtube.com/results?search_query=فێرکاری+نوێژکردن+بە+کوردی" target="_blank" style="color: var(--card-border); font-weight: bold; text-decoration: underline;">🔗 کلیک لێرە بکە بۆ بینینی ڤیدیۆی زیاتر لە یوتیوب</a></p>
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
            <div class="content-box"><b>٤. تەحلول:</b> تاشین یان کورتکردنەوەی قژ بۆ کۆتاییهاتنی عومرە و دەرچوون لە ئیحرام.</div>
        `;
    } else if(type === 'health') {
        title.innerText = "🩺 تەندروستی و پزیشکی لە ئیسلامدا";
        body.innerHTML = `
            <div class="content-box"><b>• پاکوخاوەنی:</b> دەستنوێشگرتن و شوشتنی دەست و دەم لە پێش هەر ژەمە خواردنێک.</div>
            <div class="content-box"><b>• دەنکە ڕەشە:</b> بەکارهێنانی وەک چارەسەرێکی سروشتی بۆ بەهێزکردنی بەرگری لەش.</div>
            <div class="content-box"><b>• میانڕەوی لە خۆراک:</b> پەیڕەوکردنی ڕێنمایی پێغەمبەر ﷺ لەسەر پڕنەکردنی گەدە بە تەواوەتی (یەکی سێ بەش).</div>
            <div class="content-box"><b>• هەنگوین:</b> چارەسەر و سوودی زانستی سەلمێنراو بۆ جەستەی مرۆڤ.</div>
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
    const amountInput = document.getElementById('zakat-amount');
    const currencySelect = document.getElementById('currency-type');
    const resultDiv = document.getElementById('zakat-result');
    
    if(!amountInput || !currencySelect || !resultDiv) return;
    
    const amount = parseFloat(amountInput.value) || 0;
    const currency = currencySelect.value;
    const zakat = amount * 0.025;
    resultDiv.innerText = `بڕی زەکاتی پێویست: ${zakat.toLocaleString()} ${currency} (٢.٥٪)`;
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
    if(!status) return;
    
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
    const modal1 = document.getElementById('service-modal');
    const modal2 = document.getElementById('myModal');
    const audioPlayer = document.getElementById('audio-player');
    
    if(modal1) modal1.style.display = 'none';
    if(modal2) modal2.style.display = 'none';
    if(audioPlayer) audioPlayer.pause();
}

// داخستنی پەنجەرەی مۆدێل بە کلیک کردن لە دەرەوەی پەنجەرەکە
window.addEventListener('click', (e) => {
    const modal1 = document.getElementById('service-modal');
    const modal2 = document.getElementById('myModal');
    const audioPlayer = document.getElementById('audio-player');
    
    if (e.target === modal1) {
        modal1.style.display = 'none';
        if(audioPlayer) audioPlayer.pause();
    }
    if (e.target === modal2) {
        modal2.style.display = 'none';
        if(audioPlayer) audioPlayer.pause();
    }
});

// جێبەجێکردنی سەرەتایی کاتێک وێبسایتەکە دەکرێتەوە[span_7](start_span)[span_7](end_span)
document.addEventListener('DOMContentLoaded', () => {
    fetchSurahs();
    fetchPrayerTimes();
    
    // ئەگەر ئایدی شار هەبوو، لە کاتی گۆڕینیدا بانگەکان نوێ ببنەوە
    const citySelect = document.getElementById('city-select') || document.querySelector('.prayer-controls select');
    if(citySelect) {
        citySelect.addEventListener('change', fetchPrayerTimes);
    }
    
    // بەستنەوەی دوگمەکانی خزمەتگوزاری بۆ کردنەوەی openSection
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            if(this.innerText.includes('زەکات')) openSection('zakat');
            else if(this.innerText.includes('تەسبیحات') || this.innerText.includes('زیکر')) openSection('adhkar');
            else if(this.innerText.includes('ناوەکانی خودا')) openSection('names');
        });
    });
    
    // بەستنەوەی مێنوی لایەنی بۆ خزمەتگوزارییەکان
    const sidebarItems = document.querySelectorAll('.sidebar ul li');
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            if(this.innerText.includes('زەکات')) openSection('zakat');
            else if(this.innerText.includes('تەسبیحات')) openSection('adhkar');
            else if(this.innerText.includes('قیبلەنما')) openSection('qibla');
            toggleSidebar(); // داخستنی مێنو دوای هەڵبژاردن
        });
    });
    
    // بەستنەوەی دوگمەی داخستنی مۆدێل
    const closeBtn = document.getElementById('closeModal') || document.querySelector('.close');
    if(closeBtn) {
        closeBtn.addEventListener('click', closeServiceModal);
    }
});
