// config
const VISIBLE_COUNT = 6;
const VISIBLE_ARC = 110;
const START_ANGLE = 0;
const radius = 170;
const default_slot_size = '90px';
const SENSITIVITY = 0.0005;
const FRICTION = 0.92;
const MIN_MOMENTUM = 0.005;

// init vars
let pos = 0;
let velocity = 0;
let animation= null;
let visible_slots = [];
let slot_meta = [];
const N = songs.length;
let name_display = null;

// init wheel
document.addEventListener('DOMContentLoaded', function () {initVisibleWheel()});

// init player
let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    referrerpolicy: 'strict-origin-when-cross-origin',
    videoId: '',
    events: {
      'onReady': function() {RandomSong()}
    }
  });
}

function initVisibleWheel() {  // initializing the wheel
  const wheelContainer = document.querySelector('.wheel');
  visible_slots = [];
  slot_meta = [];

  // generate wheel elements
  for (let i = 0; i < VISIBLE_COUNT; i++) {
    // create slot div
    const slot = document.createElement('div');
    slot.className = `slot absolute b-0 l-0`;
    slot.style.width = slot.style.height = default_slot_size;

    // slot event listeners
    slot.addEventListener('click', () => goToSong(slot.dataset.video, slot));
    slot.addEventListener('mouseenter', () => showSongName(slot.dataset.song));
    slot.addEventListener('mouseleave', () => showSongName(null));

    // create img
    const img = document.createElement('img');
    img.style.transformOrigin = 'bottom left';
    img.style.width = img.style.height = default_slot_size;
    slot.appendChild(img);

    // add to required variables
    wheelContainer.appendChild(slot);
    visible_slots.push(slot);
    slot_meta.push({ elem: slot, img, assigned_index: null });
  }
  // init render
  renderSlots(0, 0);

  // check for scrolls
  wheelContainer.addEventListener('wheel', onWheelForVisible, { passive: false });
}

function onWheelForVisible(e) { // runs when user scrolls on wheel
  e.preventDefault();
  velocity += e.deltaY * SENSITIVITY;
  if (!animation) animation = requestAnimationFrame(animateVisible);
}

function animateVisible() { // move the slots
  // move by velocity and apply friction
  pos += velocity;
  velocity *= FRICTION;

  // wrap pos around
  if (N > 0) pos = ((pos % N) + N) % N;

  // render and check if animation should keep going
  const headIndex = Math.floor(pos);
  const frac = pos - headIndex;
  renderSlots(headIndex, frac);
  animation = (Math.abs(velocity) >= MIN_MOMENTUM)? requestAnimationFrame(animateVisible) : null;
}

function renderSlots(headIndex, frac) { // Renders slots for the given song index and fraction of rotation
  const spacing = VISIBLE_ARC / Math.max(1, VISIBLE_COUNT - 1);

  for (let i = 0; i < VISIBLE_COUNT; i++) {
    const meta = slot_meta[i];
    const songIdx = ((headIndex + i % N) + N) % N; // What index should this slot be

    if (meta.assigned_index != songIdx) {
      meta.assigned_index = songIdx;
      const entry = songs[songIdx] || {};
      const file = entry.image || 'placeholder.png';
      const newSrc = `images/${file}`;
      if (!entry.no_round) meta.img.style.borderRadius = '50%';
      meta.elem.dataset.song = entry.name || '';
      meta.elem.dataset.video = entry.video || '';
      meta.img.src = newSrc;
    }

    const angle = START_ANGLE + i * spacing - frac * spacing;
    meta.img.style.transform = `rotate(${angle}deg) translateY(-${radius}px) rotate(${-angle}deg)`;
  }
}

function createCircle(slot, left, top) { // Render Circle
   var circleElement = document.createElement('div');
   circleElement.className = 'circle';
   circleElement.style.left = `${left}px`;
   circleElement.style.top = `${top}px`;
   slot.appendChild(circleElement);
}

// Utility functions for using the player
function goToSong(id, slot=null) {
  if (slot) slot.style.color = 'white';
  console.log(`Playing ID ${id}`);player.loadVideoById(id);
}
function RandomSong() {goToSong(songs[Math.floor(Math.random() * songs.length)].video)};
function showSongName(name) {
  if (!name_display) name_display = document.getElementById('name-display');
  name_display.innerHTML = (name == null)? 'Song Selection' : name;
}