// 音乐数据
const musicData = [
  {
    name: '洛春赋',
    author: '未知',
    src: './mp3/music0.mp3',
    record: './img/record0.jpg'
  },
  {
    name: 'Yesterday',
    author: '未知',
    src: './mp3/music1.mp3',
    record: './img/record1.jpg'
  },
  {
    name: '江南烟雨色',
    author: '未知',
    src: './mp3/music2.mp3',
    record: './img/record2.jpg'
  },
  {
    name: 'Vision pt.II',
    author: '未知',
    src: './mp3/music3.mp3',
    record: './img/record3.jpg'
  }
];

// 播放模式：0顺序 1随机 2单曲
let playMode = 0;
let playModeCount = 0;

// 当前播放曲目索引
let currentIndex = 0;

// 获取页面元素
const audioTag = document.getElementById('audioTag');
const musicTitle = document.getElementById('music-title');
const authorName = document.getElementById('author-name');
const recordImg = document.getElementById('record-img');
const playPauseBtn = document.getElementById('playPause');
const skipForwardBtn = document.getElementById('skipForward');
const skipBackwardBtn = document.getElementById('skipBackward');
const playModeBtn = document.getElementById('playMode');
const progressBar = document.getElementById('progress');
const progressTotal = document.getElementById('progress-total');
const playedTime = document.getElementById('playedTime');
const audioTime = document.getElementById('audioTime');
const volumeBtn = document.getElementById('volume');
const volumnTogger = document.getElementById('volumn-togger');
const musicList = document.getElementById('music-list');
const closeList = document.getElementById('close-list');
const listBtn = document.getElementById('list');
const speedBtn = document.getElementById('speed');
const mvBtn = document.getElementById('MV');

// 初始化
function init() {
  loadMusic(currentIndex);
  setupEventListeners();
}

// 加载音乐
function loadMusic(index) {
  const music = musicData[index];
  musicTitle.textContent = music.name;
  authorName.textContent = music.author;
  audioTag.src = music.src;
  recordImg.style.backgroundImage = `url('${music.record}')`;
  
  // 更新播放列表高亮
  for (let i = 0; i < musicData.length; i++) {
    const musicItem = document.getElementById('music' + i);
    if (i === index) {
      musicItem.style.color = '#42b680';
    } else {
      musicItem.style.color = 'white';
    }
  }
  
  // 切换背景
  document.getElementById('body').style.backgroundImage = `url('./img/bg${index}.png')`;
}

// 播放/暂停切换
function togglePlay() {
  if (audioTag.paused) {
    audioTag.play();
    playPauseBtn.classList.remove('icon-play');
    playPauseBtn.classList.add('icon-pause');
    recordImg.style.animationPlayState = 'running';
  } else {
    audioTag.pause();
    playPauseBtn.classList.remove('icon-pause');
    playPauseBtn.classList.add('icon-play');
    recordImg.style.animationPlayState = 'paused';
  }
}

// 播放指定曲目
function playMusic(index) {
  currentIndex = index;
  loadMusic(currentIndex);
  audioTag.play();
  playPauseBtn.classList.remove('icon-play');
  playPauseBtn.classList.add('icon-pause');
  recordImg.style.animationPlayState = 'running';
}

// 上一曲
function skipBackward() {
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = musicData.length - 1;
  }
  playMusic(currentIndex);
}

// 下一曲
function skipForward() {
  currentIndex++;
  if (currentIndex >= musicData.length) {
    currentIndex = 0;
  }
  playMusic(currentIndex);
}

// 切换播放模式
function togglePlayMode() {
  playModeCount++;
  if (playModeCount > 2) {
    playModeCount = 0;
  }
  playMode = playModeCount;
  
  // 更新模式图标
  const modeImages = ['mode1.png', 'mode2.png', 'mode3.png'];
  playModeBtn.style.backgroundImage = `url('./img/${modeImages[playMode]}')`;
  
  // 模式说明：0顺序 1随机 2单曲
  if (playMode === 1) {
    // 随机播放
  }
}

// 格式化时间
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// 更新进度条
function updateProgress() {
  const progress = (audioTag.currentTime / audioTag.duration) * 100;
  progressBar.style.width = `${progress}%`;
  playedTime.textContent = formatTime(audioTag.currentTime);
  audioTime.textContent = formatTime(audioTag.duration || 0);
}

// 跳转到指定时间播放
function seekTo(e) {
  const rect = progressTotal.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  audioTag.currentTime = percent * audioTag.duration;
}

// 音量控制
function updateVolume() {
  audioTag.volume = volumnTogger.value / 100;
  
  if (audioTag.volume === 0) {
    volumeBtn.style.backgroundImage = "url('./img/静音.png')";
  } else {
    volumeBtn.style.backgroundImage = "url('./img/音量.png')";
  }
}

// 切换静音
function toggleMute() {
  if (audioTag.volume > 0) {
    audioTag.volume = 0;
    volumnTogger.value = 0;
  } else {
    audioTag.volume = 1;
    volumnTogger.value = 100;
  }
  updateVolume();
}

// 显示/隐藏播放列表
function toggleList() {
  if (musicList.style.display === 'block') {
    musicList.style.display = 'none';
    closeList.style.display = 'none';
  } else {
    musicList.style.display = 'block';
    closeList.style.display = 'block';
  }
}

// 倍速控制
let speedIndex = 0;
const speeds = [1.0, 1.5, 2.0, 0.5, 1.0];

function changeSpeed() {
  speedIndex++;
  if (speedIndex >= speeds.length) {
    speedIndex = 0;
  }
  audioTag.playbackRate = speeds[speedIndex];
  speedBtn.textContent = speeds[speedIndex] + 'X';
}

// 音乐结束时自动播放下一曲
audioTag.addEventListener('ended', function() {
  if (playMode === 2) {
    // 单曲循环
    audioTag.currentTime = 0;
    audioTag.play();
  } else if (playMode === 1) {
    // 随机播放
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * musicData.length);
    } while (randomIndex === currentIndex);
    playMusic(randomIndex);
  } else {
    // 顺序播放
    skipForward();
  }
});

// 设置事件监听
function setupEventListeners() {
  playPauseBtn.addEventListener('click', togglePlay);
  skipForwardBtn.addEventListener('click', skipForward);
  skipBackwardBtn.addEventListener('click', skipBackward);
  playModeBtn.addEventListener('click', togglePlayMode);
  audioTag.addEventListener('timeupdate', updateProgress);
  audioTag.addEventListener('loadedmetadata', updateProgress);
  progressTotal.addEventListener('click', seekTo);
  volumeBtn.addEventListener('click', toggleMute);
  volumnTogger.addEventListener('input', updateVolume);
  listBtn.addEventListener('click', toggleList);
  closeList.addEventListener('click', toggleList);
  speedBtn.addEventListener('click', changeSpeed);
  
  // 播放列表点击
  for (let i = 0; i < musicData.length; i++) {
    const musicItem = document.getElementById('music' + i);
    musicItem.addEventListener('click', (function(index) {
      return function() {
        playMusic(index);
      };
    })(i));
  }
}

// 初始化
init();