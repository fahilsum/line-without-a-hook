const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const lyricsTrack = document.getElementById('lyrics-track');


// Lirik + waktu mulai (detik)
const lyrics = [
  {time:0.30, text:"I don't really give a damn about the way you touch me"},
  {time:3.21, text:"When we're alone"},
  {time:5.34, text:"You can hold my hand"},
  {time:7.40, text:"If no one's home"},
  {time:9.41, text:"Do you like it when I'm away?"},
  {time:12.40, text:"If I went and hurt my body, baby"},
  {time:14.32, text:"Would you love me the same?"},
  {time:16.00, text:"I can feel all my bones coming back"},
  {time:18.48, text:"And I'm craving motion"},
  {time:21.26, text:"Mama never really learned how to live by herself"},
  {time:24.34, text:"It's a curse"},
  {time:26.21, text:"And it's growing"},
  {time:28.22, text:"You're a pond and I'm an ocean"},
  {time:31.46, text:"Oh, all my emotions"},
  {time:36.31, text:"Feel like explosions when you are around"},
  {time:41.35, text:"And I've found a way to kill the sounds, oh"},
  {time:47.47, text:"Oh, baby, I am a wreck when I'm without you"},
  {time:53.12, text:"I need you here to stay"},
  {time:56.13, text:"I broke all my bones that day I found you"},
  {time:61.00, text:"Crying at the lake"},
  {time:63.15, text:"Was it something I said to make you feel like you're a burden?"},
  {time:69.35, text:"Oh, and if I could take it all back"},
  {time:73.00, text:"I swear that I would pull you from the tide"},
  {time:84.00, text:"Oh, whoa, whoa, whoa"},
  {time:85.28, text:"I said no, I said no"},
  {time:89.00, text:"Listen close, it's a no"},
  {time:93.11, text:"The wind is a-pounding on my back"},
  {time:96.33, text:"And I found hope in a heart attack"},
  {time:100.22, text:"Oh, at last, it is past"},
  {time:104.00, text:"Now I've got it, and you can't have it"},
  {time:108.31, text:"Oh, baby, I am a wreck when I'm without you"},
  {time:113.45, text:"I need you here to stay"},
  {time:117.11, text:"I broke all my bones that day I found you"},
  {time:121.41, text:"Crying at the lake"},
  {time:123.45, text:"Was it something I said to make you feel like you're a burden? Oh"},
  {time:130.45, text:"And if I could take it all back"},
  {time:133.41, text:"I swear that I would pull you from the tide"},
  {time:146.26, text:"Darling, when I'm fast asleep"},
  {time:149.35, text:"I've seen this person watching me"},
  {time:153.25, text:"Saying, 'Is it worth it? Is it worth it? Tell me, is it worth it?'"},
  {time:175.45, text:"'Cause there is something, and there is nothing"},
  {time:179.34, text:"There is nothing in between"},
  {time:183.11, text:"And in my eyes, there is a tiny dancer"},
  {time:188.25, text:"Watching over me, he's singing"},
  {time:192.00, text:"'She's a, she's a lady, and I am just a boy'"},
  {time:198.11, text:"He's singing, 'She's a, she's a lady, and I am just a line without a hook'"},
  {time:207.10, text:"Oh, baby, I am a wreck when I'm without you"},
  {time:212.25, text:"I need you here to stay"},
  {time:215.35, text:"Broke all my bones that day I found you"},
  {time:220.15, text:"Crying at the lake"},
  {time:222.15, text:"Was it something I said to make you feel like you're a burden? Oh"},
  {time:229.31, text:"And if I could take it all back"},
  {time:232.15, text:"I swear that I would pull you from the tide"}
];

// Render lirik
lyrics.forEach(line => {
  const h2 = document.createElement('h2');
  h2.textContent = line.text;
  lyricsTrack.appendChild(h2);
});

// Format mm:ss
function formatTime(sec){
  const m = Math.floor(sec/60);
  const s = Math.floor(sec%60);
  return `${m}:${s<10?'0':''}${s}`;
}

// Update total duration
audio.addEventListener('loadedmetadata', ()=>{ totalTimeEl.textContent = formatTime(audio.duration); });

// Play / Pause
playBtn.addEventListener('click', ()=>{
  if(audio.paused){
    audio.play();
    playBtn.textContent='⏸️';
  }else{
    audio.pause();
    playBtn.textContent='▶️';
  }
});

// Update progress & highlight
audio.addEventListener('timeupdate', ()=>{
  const current = audio.currentTime;
  currentTimeEl.textContent = formatTime(current);
  progress.style.width = (current/audio.duration*100)+'%';

  const allH2 = lyricsTrack.querySelectorAll('h2');
  let currentIndex = 0;
  for(let i=0;i<lyrics.length;i++){
    if(current >= lyrics[i].time && (i===lyrics.length-1 || current < lyrics[i+1].time)){
      currentIndex = i;
      allH2.forEach(h=>h.classList.remove('current'));
      allH2[i].classList.add('current');
      break;
    }
  }

  // scroll track
  const containerHeight = document.getElementById('lyrics-container').clientHeight;
  const offset = allH2[currentIndex].offsetTop;
  const track = lyricsTrack;
  const trackHeight = lyricsTrack.scrollHeight;
  let translateY = offset - containerHeight/2 + allH2[currentIndex].offsetHeight/2;

  // Batasi translate agar tidak over-scroll
  translateY = Math.max(0, Math.min(translateY, trackHeight - containerHeight));
  track.style.transform = `translateY(-${translateY}px)`;
});

// Seek by progress bar
progressBar.addEventListener('click', e=>{
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  audio.currentTime = (clickX / rect.width) * audio.duration;
});


//lingkaran

const handle = document.getElementById('progress-handle');

// Update progress & handle secara sinkron dengan audio
audio.addEventListener('timeupdate', ()=>{
  const current = audio.currentTime;
  const duration = audio.duration;
  const percent = (current / duration) * 100;

  // update progress bar
  progress.style.width = percent + '%';

  // update handle
  handle.style.left = percent + '%';

  // update waktu
  currentTimeEl.textContent = formatTime(current);

  // === Highlight lirik & scroll tetap sama seperti sebelumnya ===
  const allH2 = lyricsTrack.querySelectorAll('h2');
  let currentIndex = 0;
  for(let i=0;i<lyrics.length;i++){
    if(current >= lyrics[i].time && (i===lyrics.length-1 || current < lyrics[i+1].time)){
      currentIndex = i;
      allH2.forEach(h=>h.classList.remove('current'));
      allH2[i].classList.add('current');
      break;
    }
  }

  const containerHeight = document.getElementById('lyrics-container').clientHeight;
  const offset = allH2[currentIndex].offsetTop;
  const track = lyricsTrack;
  const trackHeight = lyricsTrack.scrollHeight;
  let translateY = offset - containerHeight/2 + allH2[currentIndex].offsetHeight/2;
  translateY = Math.max(0, Math.min(translateY, trackHeight - containerHeight));
  track.style.transform = `translateY(-${translateY}px)`;
});


//tombol repeat song
const repeatBtn = document.getElementById('repeat');
let isRepeat = false;

repeatBtn.addEventListener('click', () => {
  isRepeat = !isRepeat;
  audio.loop = isRepeat;
  repeatBtn.textContent = isRepeat ? '🔂' : '🔁' ;
  repeatBtn.style.color = isRepeat ? 'red' : 'black'; // indikator repeat aktif
});
