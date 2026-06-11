  const songs = [
    { title:"Electronic Sunrise", artist:"SoundHelix", src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", art:"https://picsum.photos/seed/music1/300/300", color:"#7c3aed" },
    { title:"Midnight Drive",     artist:"SoundHelix", src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", art:"https://picsum.photos/seed/music2/300/300", color:"#0ea5e9" },
    { title:"Neon Dreams",        artist:"SoundHelix", src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", art:"https://picsum.photos/seed/music3/300/300", color:"#ec4899" },
    { title:"Urban Groove",       artist:"SoundHelix", src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", art:"https://picsum.photos/seed/music4/300/300", color:"#10b981" },
    { title:"Crystal Waters",     artist:"SoundHelix", src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3", art:"https://picsum.photos/seed/music5/300/300", color:"#f59e0b" },
    { title:"City Lights",        artist:"SoundHelix", src:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3", art:"https://picsum.photos/seed/music6/300/300", color:"#ef4444" },
  ];

  let currentIndex = 0, isPlaying = false, isShuffle = false;
  let isRepeat = false, isMuted = false, volume = 0.8, isDragging = false;

  const audio         = document.getElementById("audio");
  const albumArt      = document.getElementById("albumArt");
  const artGlow       = document.getElementById("artGlow");
  const songTitle     = document.getElementById("songTitle");
  const songArtist    = document.getElementById("songArtist");
  const currentTimeEl = document.getElementById("currentTime");
  const totalTimeEl   = document.getElementById("totalTime");
  const progressFill  = document.getElementById("progressFill");
  const progressThumb = document.getElementById("progressThumb");
  const progressWrap  = document.getElementById("progressWrap");
  const playBtn       = document.getElementById("playBtn");
  const playIcon      = document.getElementById("playIcon");
  const pauseIcon     = document.getElementById("pauseIcon");
  const volFill       = document.getElementById("volFill");
  const volWrap       = document.getElementById("volWrap");
  const volLabel      = document.getElementById("volLabel");
  const volIcon       = document.getElementById("volIcon");
  const muteIcon      = document.getElementById("muteIcon");
  const playlistEl    = document.getElementById("playlist");
  const autoplayCheck = document.getElementById("autoplayCheck");

  function fmt(s) {
    if (isNaN(s)) return "0:00";
    return Math.floor(s/60) + ":" + Math.floor(s%60).toString().padStart(2,"0");
  }

  function loadSong(i) {
    const s = songs[i];
    audio.src = s.src;
    albumArt.src = s.art;
    songTitle.textContent  = s.title;
    songArtist.textContent = s.artist;
    artGlow.style.background = s.color;
    document.body.style.background = `linear-gradient(135deg,${s.color}44,#302b63,#0f0c29)`;
    progressFill.style.width = "0%";
    progressThumb.style.left = "0%";
    currentTimeEl.textContent = "0:00";
    totalTimeEl.textContent   = "0:00";
    buildPlaylist();
  }

  function play()  { audio.play(); isPlaying=true;  playIcon.style.display="none";  pauseIcon.style.display="block"; albumArt.classList.add("spinning");    buildPlaylist(); }
  function pause() { audio.pause();isPlaying=false; playIcon.style.display="block"; pauseIcon.style.display="none";  albumArt.classList.remove("spinning"); buildPlaylist(); }
  function togglePlay() { isPlaying ? pause() : play(); }

  function nextSong() {
    currentIndex = isShuffle
      ? (function(){ let r; do{r=Math.floor(Math.random()*songs.length);}while(r===currentIndex&&songs.length>1); return r; })()
      : (currentIndex+1) % songs.length;
    loadSong(currentIndex);
    if (isPlaying) play();
  }

  function prevSong() {
    if (audio.currentTime > 3) { audio.currentTime=0; return; }
    currentIndex = (currentIndex-1+songs.length) % songs.length;
    loadSong(currentIndex);
    if (isPlaying) play();
  }

  audio.addEventListener("timeupdate", () => {
    if (isDragging || !audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = pct + "%";
    progressThumb.style.left = pct + "%";
    currentTimeEl.textContent = fmt(audio.currentTime);
  });

  audio.addEventListener("loadedmetadata", () => { totalTimeEl.textContent = fmt(audio.duration); });

  audio.addEventListener("ended", () => {
    if (isRepeat) { audio.currentTime=0; play(); }
    else if (autoplayCheck.checked) { nextSong(); play(); }
    else pause();
  });

  function seekTo(e) {
    const r = progressWrap.getBoundingClientRect();
    const pct = Math.max(0, Math.min((e.clientX-r.left)/r.width, 1));
    audio.currentTime = pct * audio.duration;
    progressFill.style.width = (pct*100)+"%";
    progressThumb.style.left = (pct*100)+"%";
  }

  progressWrap.addEventListener("mousedown",  e => { isDragging=true; seekTo(e); });
  document.addEventListener("mousemove",      e => { if(isDragging) seekTo(e); });
  document.addEventListener("mouseup",        ()  => { isDragging=false; });
  progressWrap.addEventListener("touchstart", e => { isDragging=true; seekTo(e.touches[0]); });
  document.addEventListener("touchmove",      e => { if(isDragging) seekTo(e.touches[0]); });
  document.addEventListener("touchend",       ()  => { isDragging=false; });

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    audio.volume = isMuted ? 0 : volume;
    volFill.style.width = (volume*100)+"%";
    volLabel.textContent = Math.round(volume*100)+"%";
  }

  volWrap.addEventListener("click", e => {
    const r = volWrap.getBoundingClientRect();
    setVolume((e.clientX-r.left)/r.width);
  });

  document.getElementById("muteBtn").addEventListener("click", () => {
    isMuted = !isMuted;
    audio.volume = isMuted ? 0 : volume;
    volIcon.style.display  = isMuted ? "none"  : "block";
    muteIcon.style.display = isMuted ? "block" : "none";
  });

  document.getElementById("shuffleBtn").addEventListener("click", () => {
    isShuffle = !isShuffle;
    document.getElementById("shuffleBtn").classList.toggle("btn-active", isShuffle);
  });

  document.getElementById("repeatBtn").addEventListener("click", () => {
    isRepeat = !isRepeat;
    document.getElementById("repeatBtn").classList.toggle("btn-active", isRepeat);
  });

  document.getElementById("playBtn").addEventListener("click", togglePlay);
  document.getElementById("nextBtn").addEventListener("click", nextSong);
  document.getElementById("prevBtn").addEventListener("click", prevSong);

  document.addEventListener("keydown", e => {
    if (e.target.tagName === "INPUT") return;
    if (e.key === " ")            { e.preventDefault(); togglePlay(); }
    else if (e.key==="ArrowRight") nextSong();
    else if (e.key==="ArrowLeft")  prevSong();
    else if (e.key==="ArrowUp")    { e.preventDefault(); setVolume(volume+0.1); }
    else if (e.key==="ArrowDown")  { e.preventDefault(); setVolume(volume-0.1); }
    else if (e.key==="m"||e.key==="M") document.getElementById("muteBtn").click();
  });

  function buildPlaylist() {
    playlistEl.innerHTML = "";
    document.getElementById("playlistCount").textContent = songs.length + " songs";
    songs.forEach((s, i) => {
      const li = document.createElement("li");
      li.className = "playlist-item" + (i===currentIndex ? " active" : "");
      li.innerHTML = `
        <img class="pl-thumb" src="${s.art}" alt="${s.title}"/>
        <div class="pl-info">
          <div class="pl-title">${s.title}</div>
          <div class="pl-artist">${s.artist}</div>
        </div>
        ${i===currentIndex && isPlaying
          ? `<div class="pl-playing"><div class="pl-bar"></div><div class="pl-bar"></div><div class="pl-bar"></div></div>`
          : `<span class="pl-duration">${s.duration||"--:--"}</span>`}`;
      li.addEventListener("click", () => { currentIndex=i; loadSong(i); play(); });
      playlistEl.appendChild(li);
    });
  }

  // Preload durations
  songs.forEach((s, i) => {
    const t = new Audio(); t.src = s.src;
    t.addEventListener("loadedmetadata", () => {
      s.duration = fmt(t.duration);
      const el = playlistEl.querySelector(`.playlist-item:nth-child(${i+1}) .pl-duration`);
      if (el) el.textContent = s.duration;
    });
  });

  setVolume(0.8);
  loadSong(0);
  buildPlaylist();
</script>
