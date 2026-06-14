const NEWS_API_KEY = '8234e73e169849c8a7ab29c2f4ed11e9';
const YT_API_KEY = 'AIzaSyAgzTJu13IzbeeL3zWDfagHjn1BAE9UwYo';

// Enter key handle karne ke liye
function handleEnter(event) {
    if (event.key === 'Enter') {
        searchNews();
    }
}

async function fetchNews(query = 'India') {
    const grid = document.getElementById('news-grid');
    const ticker = document.getElementById('ticker-text');
    document.getElementById('main-title').innerText = `Results for: ${query}`;
    grid.innerHTML = "Fetching news...";

    const url = `https://newsapi.org/v2/everything?q=${query}&language=hi&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.articles && data.articles.length > 0) {
            // News Cards
            grid.innerHTML = data.articles.slice(0, 8).map(a => `
                <div class="card" onclick="window.open('${a.url}', '_blank')">
                    <img src="${a.urlToImage || 'https://via.placeholder.com/300'}" alt="News">
                    <div class="card-content">
                        <h4>${a.title}</h4>
                        <p style="color:#dd3333; font-weight:bold;">Read More →</p>
                    </div>
                </div>
            `).join('');
            
            // Ticker Update
            ticker.innerHTML = data.articles.slice(0, 5).map(a => `🔥 ${a.title}`).join(' &nbsp;&nbsp;&nbsp;&nbsp; ');
        } else {
            grid.innerHTML = "No results found.";
        }
    } catch(e) { grid.innerHTML = "Error loading news."; }
}

async function fetchVideos() {
    const container = document.getElementById('shorts-container');
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=latest+trending+news+india+shorts&type=video&videoDuration=short&key=${YT_API_KEY}`;
    
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.items) {
            container.innerHTML = data.items.map(v => `
                <div class="short-card" onclick="window.open('https://www.youtube.com/shorts/${v.id.videoId}', '_blank')">
                    <img src="${v.snippet.thumbnails.high.url}">
                    <p>${v.snippet.title.substring(0, 25)}...</p>
                </div>`).join('');
        }
    } catch(e) { console.error("YT Error:", e); }
}

function searchNews() {
    const q = document.getElementById('search-input').value;
    if(q) fetchNews(q);
}

document.getElementById('dark-mode-toggle').onclick = () => document.body.classList.toggle('dark-mode');

window.onload = () => {
    fetchNews();
    fetchVideos();
};