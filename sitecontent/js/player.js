let track_name = document.querySelector(".songtitle");
let track_cover = document.querySelector(".album-cover");
let track_link = document.querySelector(".album-link");
let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");
let seek_slider = document.querySelector(".seek_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");
let volume_slider = document.querySelector(".volume_slider");

let track_index = 0;
let isPlaying = false;
let updateTimer;
let cover_folder = 'images/covers/';
let curr_track = document.getElementById("music");

// Run on start
setTimeout(() => { playpauseTrack(); }, 1000);
document.addEventListener("keydown", function(event) {
  if (event.code === "Space") {event.preventDefault(); playpauseTrack()
  }});

// Song list
let track_list = [
  {name: "RINGTONE - Jamie Paige",path: "https://qalc.s-ul.eu/I31qh0H0",img:"ringtone.png", link: "https://jamiepaige.bandcamp.com/track/ringtone"},
  {name: "HEAT ABNORMAL - Iyowa (Shannon Remix)",path: "https://qalc.s-ul.eu/7KpUjANH",img:"shannon.png", link: "https://youtu.be/uvE93fKltmY"},
  {name: "WINRAR - AQUASINE",path: "https://qalc.s-ul.eu/zFgqCNyJ",img:"winrar.png", link: "https://youtu.be/hOng39K6KIM"},
  {name: "CADMIUM COLORS - Jamie Paige",path: "https://qalc.s-ul.eu/4KHpaE47",img:"cadmium.png", link: "https://youtu.be/1U6qefKcOrg"},
  {name: "I LOVE BEING PART OF THE ECONOMY, IT'S WHAT I WAS BORN TO DO - 3xBlast",path: "https://qalc.s-ul.eu/oW9TUByM",img:"economy.png", link: "https://youtu.be/RDtaLeU_FK0"},
  {name: "HEAT ABNORMAL - Iyowa (Suisoh Cover)",path: "https://qalc.s-ul.eu/EvxnHrNF",img:"suisoh.png", link: "https://youtu.be/Kc0-AC3sUKc"}
];

// Default volume
curr_track.volume = 0.1;

function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}

function loadTrack(index) {
  clearInterval(updateTimer);
  resetValues();

  curr_track.src = track_list[index].path;
  curr_track.load();

  // Set anme
  track_name.textContent = `[${index + 1}/${track_list.length}]: ${track_list[index].name}`;
  
  // Set album cover image source
  track_cover.src = cover_folder+track_list[index].img;
  track_cover.alt = `Album cover for ${track_list[index].name}`;

  // set link
  track_link.href = track_list[index].link;

  // Remove previous ended event listener to avoid duplicates
  curr_track.removeEventListener("ended", nextTrack);
  curr_track.addEventListener("ended", nextTrack);

  // Remove any previous canplay listener to avoid duplicates
  curr_track.removeEventListener("canplay", onCanPlay);

  // Add canplay listener
  curr_track.addEventListener("canplay", onCanPlay);

  updateTimer = setInterval(seekUpdate, 1000);
}

function resetValues() {
  curr_time.textContent = "0:00";
  total_duration.textContent = "0:00";
  seek_slider.value = 0;
}

function playpauseTrack() {
  isPlaying ? pauseTrack() : playTrack();
}

function playTrack() {
  curr_track.play();
  isPlaying = true;
  playpause_btn.innerHTML = "<img class='ctrlimg' src='https://file.garden/Zztv0a9yEhr5pmEq/pause.png'></img>";
}

function onCanPlay() {
  // Remove this event listener immediately after firing
  curr_track.removeEventListener("canplay", onCanPlay);

  // Only auto play if the track is supposed to be playing
  if (isPlaying) {
    curr_track.play();
  }
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  playpause_btn.innerHTML = "<img class='ctrlimg' src='https://file.garden/Zztv0a9yEhr5pmEq/play.png'></img>";
}

function nextTrack() {
  track_index = (track_index + 1) % track_list.length;
  isPlaying = true;
  loadTrack(track_index);
}

function prevTrack() {
  track_index = (track_index - 1 + track_list.length) % track_list.length;
  loadTrack(track_index);
  playTrack();
}

function seekTo() {
  let seekto = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekto;
}

let lastSeekPosition = -1;
function seekUpdate() {
  if (!isNaN(curr_track.duration)) {
    let seekPosition = curr_track.currentTime * (100 / curr_track.duration);
      seek_slider.value = seekPosition;
      lastSeekPosition = seekPosition;

      let currentMinutes = Math.floor(curr_track.currentTime / 60);
      let currentSeconds = Math.floor(curr_track.currentTime % 60);
      let durationMinutes = Math.floor(curr_track.duration / 60);
      let durationSeconds = Math.floor(curr_track.duration % 60);

      if (currentSeconds < 10) currentSeconds = "0" + currentSeconds;
      if (durationSeconds < 10) durationSeconds = "0" + durationSeconds;

      curr_time.textContent = `${currentMinutes}:${currentSeconds}`;
      total_duration.textContent = `${durationMinutes}:${durationSeconds}`;
  }
}

// Initial load
loadTrack(track_index);
