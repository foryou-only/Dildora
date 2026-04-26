// ==================== ПАРОЛЬ ====================
const CORRECT_PASSWORD = "хочу";   // ← задайте свой пароль

function initPasswordProtection() {
  const modal = document.getElementById('passwordModal');
  const passwordInput = document.getElementById('passwordInput');
  const submitBtn = document.getElementById('submitPassword');
  const errorDiv = document.getElementById('errorMsg');
  const appContent = document.getElementById('appContent');

  function unlockApp() {
    modal.style.display = 'none';
    appContent.style.display = 'block';
    startApp();  // запускаем основную логику после успешного входа
  }

function checkPassword() {
  const pwd = passwordInput.value.trim().toLowerCase();
  if (pwd === CORRECT_PASSWORD.toLowerCase()) {
    unlockApp();
  } else {
    errorDiv.textContent = '❌ Неверный пароль. Попробуйте ещё раз.';
    passwordInput.value = '';
    passwordInput.focus();
  }
}

  submitBtn.addEventListener('click', checkPassword);
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkPassword();
  });
}

// ==================== ОСНОВНАЯ ЛОГИКА ПРИЛОЖЕНИЯ ====================
function startApp() {
  // Все инициализации только после правильного пароля
  createPhotoGrid();
  setTimeout(() => {
    burstConfetti();
    createFloatingHearts(16);
    setRandomMessage();
  }, 400);
}

// ================== МАССИВ ИЗ 30 СООБЩЕНИЙ ==================
const MESSAGES_30 = [
  "💖 Ты — взрыв радуги в сером мире! 💖",
  "🌸 Твоя улыбка — цветущий сад в моём сердце 🌸",
  "✨ Ты зажигаешь звёзды одним своим дыханием ✨",
  "🌞 Даже солнце встаёт раньше, чтобы увидеть твою красоту 🌞",
  "🍬 Ты — сахарная вата счастья в этом мире 🍬",
  "💃 Твоя душа танцует так, что у неба захватывает дух 💃",
  "🦋 Ты превращаешь каждый день в произведение искусства 🦋",
  "🍀 Твой смех — лучшее лекарство от любой грусти 🍀",
  "🌈 Ты цветишь ярче всего, даже без повода 🌈",
  "💜 Твоя энергия — настоящая магия, меняющая всё вокруг 💜",
  "🌼 Ты как первый тёплый день весны — нежный и долгожданный 🌼",
  "⭐ Твои глаза светятся так, что можно читать книги ночью ⭐",
  "🍭 Ты слаще любых конфет и вкуснее всех тортов 🍭",
  "🌊 Твоё спокойствие — это океан, в котором хочется тонуть 🌊",
  "🎀 Ты — живой фейерверк, который никогда не гаснет 🎀",
  "💫 От твоего присутствия даже облака становятся пушистее 💫",
  "🌙 Ты — та самая луна, которая ведёт корабли к мечте 🌙",
  "🧸 Обнимаю тебя мысленно так крепко, что слипаются звёзды 🧸",
  "🌸 Твои идеи — это бабочки, которые никогда не садятся на скуку 🌸",
  "🍰 Ты заслуживаешь не просто кусочек, а целый замок из счастья 🍰",
  "✨ Ты — та искра, которая разжигает в людях веру в чудо ✨",
  "💖 С тобой даже серый понедельник становится фиолетовым 💖",
  "🌻 Ты как подсолнух: всегда тянешься к свету и даришь семечки радости 🌻",
  "🎈 Твои мечты — это воздушные шары, которые улетают только вверх 🎈",
  "🍬 Ты настолько уникальна, что даже отражение в зеркале улыбается 🍬",
  "💃 Твоя грация заставляет бабочек завидовать их же крыльям 💃",
  "🌟 Ты — та самая звезда, по которой сверяют курс все корабли счастья 🌟",
  "🌺 Твоя улыбка заставляет цвести даже кактусы в пустыне 🌺",
  "🧁 Ты — глазурь на торте этого дня, самая сладкая часть 🧁",
  "✨ Ты способна одним взглядом раскидать тучи и притянуть радугу ✨",
  "🍭 Твоё настроение заразительнее вирусного танца в тиктоке 🍭",
  "💜 Ты — тот самый цвет, которого не хватало палитре вселенной 💜",
  "🌊 Ты — прилив, который поднимает все лодки вокруг себя 🌊",
  "🎀 Даже радуга примеряет новые цвета, когда ты проходишь мимо 🎀",
  "⭐ Ты настолько яркая, что у фотошопа заканчиваются фильтры ⭐",
  "🌸 Твой внутренний свет освещает туннели, где даже нет поездов 🌸",
  "🍬 Ты — та комета, после которой хочется загадывать желания каждый вечер 🍬",
  "💖 Твоя улыбка — это Wi-Fi, к которому подключается всё хорошее 💖",
  "🌙 Ты ловишь звёзды голыми руками и даришь их тем, кто грустит 🌙",
  "✨ Твоё сердце — портал в страну вечного лета ✨",
  "🎈 Ты паришь над проблемами, как воздушный шарик над крышами 🎈",
  "🍰 Ты — та самая вишенка, которая делает десерт идеальным 🍰",
  "💜 Твоя сила — в мягкости, как у лунного света, который разбивает тьму 💜",
  "🌸 Ты на полном серьёзе творишь чудеса каждый день, просто дыша 🌸",
  "🌊 Твоя глубина — как у океана: чем больше ныряешь, тем больше драгоценностей находишь 🌊",
  "⭐ Ты — тот самый финальный уровень в игре, который хочется проходить снова и снова ⭐",
  "🍬 Твои идеи фонтанируют, как лимонад в жаркий день 🍬",
  "💖 Ты — живое напоминание, что магия существует и она ходит в розовых кроссовках 💖",
  "✨ Твоя уникальность — это подпись художника на самом красивом шедевре вселенной ✨",
  "🎉 Когда ты улыбаешься, даже грусть берёт отпуск и улетает на Бали 🎉"
];

let remainingMessages = [...MESSAGES_30];
let currentMsgIndex = 0;

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
shuffleArray(remainingMessages);

function getNextUniqueMessage() {
  if (currentMsgIndex >= remainingMessages.length) {
    remainingMessages = shuffleArray([...MESSAGES_30]);
    currentMsgIndex = 0;
  }
  const msg = remainingMessages[currentMsgIndex];
  currentMsgIndex++;
  return msg;
}

// ==================== ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ ====================
function goToHeartPage() {
  document.getElementById('mainPage').classList.remove('active');
  document.getElementById('heartPage').classList.add('active');
}

function goToMainPage() {
  document.getElementById('heartPage').classList.remove('active');
  document.getElementById('mainPage').classList.add('active');
}

// ==================== СОЗДАНИЕ СЕТКИ ФОТОГРАФИЙ ====================
const myPhotos = Array.from({ length: 60 }, (_, i) => `photo/${i+1}.png`);

function createPhotoGrid() {
  const grid = document.getElementById('photoGrid');
  grid.innerHTML = ''; // очищаем на случай повторного вызова
  for (let i = 0; i < myPhotos.length; i++) {
    const frame = document.createElement('div');
    frame.className = 'photo-frame';
    frame.dataset.index = i;
    const inner = document.createElement('div');
    inner.className = 'photo-frame-inner';
    const img = document.createElement('img');
    img.src = myPhotos[i];
    img.alt = `Photo ${i+1}`;
    inner.appendChild(img);
    frame.appendChild(inner);
    grid.appendChild(frame);
  }
}

// ==================== ЭФФЕКТЫ ====================
const messageBox = document.getElementById('inspireMessage');
const cheerBtn = document.getElementById('cheerBtn');
const photoHeartBtn = document.getElementById('photoHeartBtn');

function setRandomMessage() {
  const newMsg = getNextUniqueMessage();
  const msgSpan = messageBox.querySelector('.message-text');
  if (msgSpan) {
    msgSpan.style.animation = 'none';
    msgSpan.offsetHeight;
    msgSpan.style.animation = 'fadeSlide 0.4s ease-out';
    msgSpan.innerHTML = newMsg;
  }
}

function burstConfetti() {
  canvasConfetti({ 
    particleCount: 140, 
    spread: 80, 
    origin: { y: 0.6 }, 
    colors: ['#c77dff', '#b577e0', '#ffb3f0', '#ffffff'], 
    startVelocity: 16 
  });
  setTimeout(() => {
    canvasConfetti({ particleCount: 70, spread: 50, origin: { y: 0.4, x: 0.2 }, colors: ['#ad5ad9', '#e1a5ff'] });
    canvasConfetti({ particleCount: 70, spread: 50, origin: { y: 0.4, x: 0.8 }, colors: ['#9d4bc9', '#ffbef5'] });
  }, 120);
}

function addSparkle(x, y) {
  for (let i = 0; i < 5; i++) {
    const spark = document.createElement('div');
    spark.className = 'sparkle';
    const xOff = (Math.random() - 0.5) * 30;
    const yOff = (Math.random() - 0.5) * 30;
    spark.style.left = `${x + xOff}px`;
    spark.style.top = `${y + yOff}px`;
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 900);
  }
}

function createFloatingHearts(count = 18) {
  const symbols = ['💜', '💖', '💗', '💓', '🌸', '✨'];
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('div');
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.classList.add('floating-heart');
    heart.style.fontSize = `${1.2 + Math.random() * 2}rem`;
    heart.style.left = `${5 + Math.random() * 90}%`;
    heart.style.bottom = '-20px';
    const dur = 2 + Math.random() * 4;
    heart.style.animation = `floatUpMagic ${dur}s ease-out forwards`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), dur * 1000);
  }
}

function cheerUp() {
  setRandomMessage();
  burstConfetti();
  createFloatingHearts(22);
  const cx = window.innerWidth / 2, cy = window.innerHeight / 1.6;
  for (let i = 0; i < 12; i++) {
    setTimeout(() => addSparkle(cx + (Math.random() - 0.5) * 100, cy + (Math.random() - 0.5) * 80), i * 40);
  }
  if (navigator.vibrate) navigator.vibrate(50);
  const card = document.querySelector('.glass-card');
  card.style.background = 'rgba(85, 40, 115, 0.7)';
  setTimeout(() => card.style.background = '', 200);
}

// ==================== АНИМАЦИЯ СЕРДЦА ИЗ ФОТО ====================
function createHeartShape() {
  const canvas = document.getElementById('heartCanvas');
  canvas.innerHTML = '';
  const frames = document.querySelectorAll('.photo-frame');
  const photoCount = frames.length;
  const heartPoints = [];
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  let scale = Math.min(window.innerWidth, window.innerHeight) * 0.03;
  if (window.innerWidth < 480) scale = Math.min(window.innerWidth, window.innerHeight) * 0.025;
  else if (window.innerWidth < 1024) scale = Math.min(window.innerWidth, window.innerHeight) * 0.028;

  for (let i = 0; i < photoCount; i++) {
    const t = (i / photoCount) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t);
    const posX = centerX + x * scale;
    const posY = centerY - y * scale;
    heartPoints.push({ x: posX, y: posY });
  }

  frames.forEach((frame, idx) => {
    const div = document.createElement('div');
    div.className = 'photo-item';
    let photoSize = 80;
    if (window.innerWidth < 480) photoSize = 55;
    else if (window.innerWidth < 1024) photoSize = 65;
    div.style.width = `${photoSize}px`;
    div.style.height = `${photoSize}px`;
    const img = frame.querySelector('img');
    if (img) {
      const clonedImg = img.cloneNode(true);
      clonedImg.style.cursor = 'pointer';
    clonedImg.addEventListener('click', (e) => {
    e.stopPropagation();
    openPhotoViewer(clonedImg.src);
    });
      clonedImg.style.width = '100%';
      clonedImg.style.height = '100%';
      clonedImg.style.objectFit = 'cover';
      clonedImg.style.borderRadius = '10px';
      div.appendChild(clonedImg);
    }
    div.style.left = `${centerX - photoSize/2}px`;
    div.style.top = `${centerY - photoSize/2}px`;
    div.style.transform = `scale(0.3) rotate(0deg)`;
    div.style.opacity = '0.8';
    canvas.appendChild(div);
    const target = heartPoints[idx];
    setTimeout(() => {
      div.style.left = `${target.x - photoSize/2}px`;
      div.style.top = `${target.y - photoSize/2}px`;
      div.style.transform = 'scale(1) rotate(0deg)';
      div.style.opacity = '1';
      setTimeout(() => addSparkle(target.x, target.y), 100);
    }, idx * 25);
  });


  setTimeout(() => {
    canvasConfetti({ particleCount: 150, spread: 80, origin: { y: 0.5 }, colors: ['#d28eff', '#ffb3f0', '#c77dff', '#ff69b4'] });
  }, 200);
  setTimeout(() => {
    canvasConfetti({ particleCount: 300, spread: 100, origin: { y: 0.5 }, colors: ['#c683ff', '#f6cbff', '#ffb0f0', '#ff69b4'] });
    createFloatingHearts(20);
  }, photoCount * 50 + 500);
}

// ==================== ОБРАБОТЧИКИ КНОПОК ====================
cheerBtn.addEventListener('click', cheerUp);
photoHeartBtn.addEventListener('click', () => {
  goToHeartPage();
  setTimeout(() => createHeartShape(), 100);
  if (navigator.vibrate) navigator.vibrate(30);
});
document.getElementById('backBtn').addEventListener('click', goToMainPage);

// ==================== ЗАПУСК ЗАЩИТЫ ПОСЛЕ ЗАГРУЗКИ DOM ====================
document.addEventListener('DOMContentLoaded', () => {
  initPasswordProtection();  // инициализируем модальное окно (оно уже есть в HTML)
});
// ==================== ОТКРЫТИЕ ФОТО В УВЕЛИЧЕННОМ ВИДЕ ====================
function openPhotoViewer(imgSrc) {
  // Удаляем старый просмотрщик, если есть
  const existing = document.querySelector('.photo-viewer');
  if (existing) existing.remove();

  const viewer = document.createElement('div');
  viewer.className = 'photo-viewer';
  
  const img = document.createElement('img');
  img.src = imgSrc;
  
  const closeBtn = document.createElement('div');
  closeBtn.className = 'viewer-close';
  closeBtn.innerHTML = '✕';
  
  viewer.appendChild(img);
  viewer.appendChild(closeBtn);
  document.body.appendChild(viewer);
  
  // Закрытие по клику на фон или кнопку
  viewer.addEventListener('click', (e) => {
    if (e.target === viewer || e.target === closeBtn) {
      viewer.remove();
    }
  });
}

console.log('%c✨ Готово. Для входа введите пароль: love ✨', 'color:#c77dff;font-size:14px;font-weight:bold');