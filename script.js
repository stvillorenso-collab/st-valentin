(function () {
  const heartsLayer = document.querySelector(".hearts");

  const prenomSpan = document.getElementById("prenom");
  const signatureSpan = document.getElementById("signature"); // ok si inexistant
  const btnChangerNom = document.getElementById("btnChangerNom");
  const btnMinPlayer = document.getElementById("btnMinPlayer");
  const playerInner = document.getElementById("playerInner");


  const btnReveal = document.getElementById("btnReveal");
  const secret = document.getElementById("secret");
  const btnConfetti = document.getElementById("btnConfetti");

  // ===== Letter elements =====
  const btnType = document.getElementById("btnType");
  const btnTypeFast = document.getElementById("btnTypeFast");
  const btnTypeReset = document.getElementById("btnTypeReset");
  const typedText = document.getElementById("typedText");
  const typingStatus = document.getElementById("typingStatus");
  const caret = document.getElementById("caret");

  // ===== Playlist elements =====
  const btnPlaylist = document.getElementById("btnPlaylist");
  const playerUI = document.getElementById("playerUI");
  const audioPlayer = document.getElementById("audioPlayer");
  const btnPlayPause = document.getElementById("btnPlayPause");
  const btnStop = document.getElementById("btnStop");
  const volume = document.getElementById("volume");

  // ===== Modal elements =====
  const modal = document.getElementById("modal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalClose = document.getElementById("modalClose");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");

  // ===== Helpers =====
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function spawnHeart(x, y, size, durationMs, driftX) {
    if (!heartsLayer) return;
    const h = document.createElement("div");
    h.className = "heart";
    h.style.left = x + "px";
    h.style.top = y + "px";
    h.style.width = size + "px";
    h.style.height = size + "px";
    h.style.opacity = (0.25 + Math.random() * 0.55).toFixed(2);
    h.style.animationDuration = durationMs + "ms";
    h.style.transform = "translateX(" + driftX + "px) rotate(45deg)";
    heartsLayer.appendChild(h);

    window.setTimeout(() => h.remove(), durationMs + 120);
  }

  function burstHearts(count) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < count; i++) {
      const x = Math.random() * w;
      const y = h + 20 + Math.random() * 120;
      const size = clamp(10 + Math.random() * 18, 10, 26);
      const duration = clamp(3800 + Math.random() * 2800, 3500, 7200);
      const drift = (Math.random() - 0.5) * 120;
      spawnHeart(x, y, size, duration, drift);
    }
  }

  function startHeartStream() {
    burstHearts(10);
    window.setInterval(() => burstHearts(6), 1600);
  }

  // ===== Reveal on scroll =====
  const revealEls = Array.from(document.querySelectorAll(".reveal"));
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) e.target.classList.add("visible");
      }
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  // ===== Name changer =====
  if (btnChangerNom) {
    btnChangerNom.addEventListener("click", () => {
      const p = prompt("Son prénom (ou surnom) :", prenomSpan ? prenomSpan.textContent : "");
      if (p && prenomSpan) prenomSpan.textContent = p.trim();

      const s = prompt("Ton prénom (signature en bas) :", signatureSpan ? signatureSpan.textContent : "");
      if (s && signatureSpan) signatureSpan.textContent = s.trim();
    });
  }

  // ===== Surprise =====
  if (btnReveal && secret) {
    btnReveal.addEventListener("click", () => {
      secret.hidden = false;
      secret.scrollIntoView({ behavior: "smooth", block: "center" });
      burstHearts(22);
    });
  }
  if (btnConfetti) btnConfetti.addEventListener("click", () => burstHearts(28));

  // ===== Typewriter Letter =====
  const letterMessage =
`Hey ❤️

            Merci d’être toi. Merci d’être là. Merci d'avoir été si forte 
            cette dernière année. Je sais que tu te remets en question beaucoup depuis
            l'hopital, mais je veux que tu saches que tu vas y arriver.
            Ne t'inquiète pas du lendemain, car à chaque jour suffit sa peine.
            Personne ne peut ajouter une coudée à sa vie même s'il le voulait.
            Le Dieu qui restaure, le Dieu qui guérit, le Dieu qui relève,
            va prendre soin de toi comme il l'a toujours fait. Par moment c'est plus facile
            à dire qu'à faire, mais ma confiance en lui est inébranlable et je sais
            que c'est un DIeu qui tient ses promesses. Je veux que tu continues
            d'être toi même, d'avoir cette confiance en lui et ce même si
            tout te semble perdu, même si tu penses que tu vas pas y arriver.
            Notre Dieu va prendre soin de toi. Je sais qu'on est au plus mal de notre 
            relation, mais je veux que tu saches que je vais toujours rester à tes
            côtés. L'avenir est incertaine, mais Dieu est certain. Je veux que tu saches
            que tu peux toujous compter sur moi et que je ferai mon maximum pour
            être là, pour te soutenir et te montrer que tu es entendue et que tu n'est pas
            toute seule. Je m'excuse si j'ai pris autant de temps à realiser
            que je te perdais à chaque fois que je voulais défendre de quoi
            qui en valait pas la peine. Je sais que tu veux prendre du temps
            pour toi, et si jamais tu souhaites qu'on prenne du temps ensemble
            afin qu'on puisse patir sur de nouvelles bases, je suis là. Je 
            t'aime et je souhaite qu'on puisse continuer à construire de quoi de solide 
            ensemble why not passer notre vie ensemble. Je t'aime Steph.
          💗

— (Lorenso)`;

  let typingTimer = null;
  let typingIndex = 0;
  let typingSpeedMs = 28;
  let typingActive = false;

  function setTypingStatus(text) {
    if (typingStatus) typingStatus.textContent = text;
  }

  function stopTyping() {
    if (typingTimer) window.clearTimeout(typingTimer);
    typingTimer = null;
    typingActive = false;
  }

  function typeNextChar() {
    if (!typedText) return;

    if (typingIndex >= letterMessage.length) {
      stopTyping();
      setTypingStatus("terminée");
      burstHearts(16);
      return;
    }

    typedText.textContent += letterMessage.charAt(typingIndex);
    typingIndex++;
    typingTimer = window.setTimeout(typeNextChar, typingSpeedMs);
  }

  function startTyping() {
    if (!typedText) return;
    if (typingActive) return;

    typingActive = true;
    setTypingStatus("écriture...");
    if (caret) caret.style.display = "inline-block";
    typeNextChar();
  }

  function resetTyping() {
    stopTyping();
    typingIndex = 0;
    if (typedText) typedText.textContent = "";
    setTypingStatus("prête");
    if (caret) caret.style.display = "inline-block";
  }

  if (btnType) btnType.addEventListener("click", () => startTyping());
  if (btnTypeFast) btnTypeFast.addEventListener("click", () => { typingSpeedMs = 10; });
  if (btnTypeReset) btnTypeReset.addEventListener("click", () => { typingSpeedMs = 28; resetTyping(); });

  // ===== Playlist (audio) =====
  function showPlayer() {
    if (playerUI) playerUI.hidden = false;
  }
  function setPlayerMinimized(min) {
  if (!playerInner) return;
  playerInner.classList.toggle("is-min", !!min);

  // optionnel: mémoriser l’état
  try { localStorage.setItem("player_min", min ? "1" : "0"); } catch(e) {}
}

function togglePlayerMin() {
  if (!playerInner) return;
  const isMin = playerInner.classList.contains("is-min");
  setPlayerMinimized(!isMin);
}

if (btnMinPlayer) {
  btnMinPlayer.addEventListener("click", () => {
    togglePlayerMin();
  });
}

/* Restaure l’état au chargement */
try {
  const saved = localStorage.getItem("player_min");
  if (saved === "1") setPlayerMinimized(true);
} catch(e) {}

  function updatePlayBtn() {
    if (!btnPlayPause || !audioPlayer) return;
    btnPlayPause.textContent = audioPlayer.paused ? "Play" : "Pause";
  }

  if (audioPlayer) {
    audioPlayer.volume = volume ? Number(volume.value) : 0.8;
    audioPlayer.addEventListener("play", updatePlayBtn);
    audioPlayer.addEventListener("pause", updatePlayBtn);
    audioPlayer.addEventListener("ended", updatePlayBtn);
  }

  if (btnPlaylist) {
    btnPlaylist.addEventListener("click", () => {
      showPlayer();
      burstHearts(10);
    });
  }

  if (btnPlayPause && audioPlayer) {
    btnPlayPause.addEventListener("click", async () => {
      showPlayer();
      try {
        if (audioPlayer.paused) {
          await audioPlayer.play();
          burstHearts(8);
        } else {
          audioPlayer.pause();
        }
      } catch (e) {
        alert("Ajoute un fichier mp3 dans /music/song.mp3 puis réessaie 🙂");
      }
      updatePlayBtn();
    });
  }

  if (btnStop && audioPlayer) {
    btnStop.addEventListener("click", () => {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      updatePlayBtn();
    });
  }

  if (volume && audioPlayer) {
    volume.addEventListener("input", () => {
      audioPlayer.volume = Number(volume.value);
    });
  }

  // ===== Modal for cards =====
  function openModal(imgSrc, title, text) {
    if (!modal || !modalImg || !modalTitle || !modalText) return;

    modalImg.src = imgSrc;
    modalTitle.textContent = title || "";
    modalText.textContent = text || "";

    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal || !modalImg) return;

    modal.hidden = true;
    modalImg.src = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", (e) => {
      // click sur "Lire plus" ne doit pas ouvrir le modal
      if (e.target && e.target.closest(".read-more")) return;
      if (modal && modal.hidden === false) return;

      const img = card.querySelector(".card-media img");
      const title = card.querySelector(".card-body h3") ? card.querySelector(".card-body h3").textContent : "";
      const text = card.querySelector(".card-body p") ? card.querySelector(".card-body p").textContent : "";

      if (img) openModal(img.getAttribute("src"), title, text);
    });
  });

  if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);
  if (modalClose) modalClose.addEventListener("click", closeModal);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // ===== Hero slideshow (timing + preload) =====
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  let slideIndex = 0;
  const SLIDE_MS = 3500; // ✅ rythme plus constant

  function preloadHeroImages() {
    const urls = slides
      .map(s => s.querySelector("img"))
      .filter(Boolean)
      .map(img => img.getAttribute("src"))
      .filter(Boolean);

    urls.forEach((src) => {
      const im = new Image();
      im.src = src;
    });
  }

  function showSlide(i){
    if (!slides.length) return;
    slides.forEach(s => s.classList.remove("active"));
    const safeIndex = ((i % slides.length) + slides.length) % slides.length;
    slides[safeIndex].classList.add("active");
    slideIndex = safeIndex;
  }

  if (slides.length > 1) {
    preloadHeroImages();
    showSlide(0);

    window.setInterval(() => {
      showSlide(slideIndex + 1);
    }, SLIDE_MS);
  }

  // ===== Lire plus (Souvenirs) - FIX : clamp-text =====
  function setupReadMore() {
    const cards = Array.from(document.querySelectorAll(".card"));

    cards.forEach(card => {
      const p = card.querySelector(".clamp-text"); // ✅ FIX
      const btn = card.querySelector(".read-more");
      if (!p || !btn) return;

      // montrer/cacher le bouton seulement si nécessaire
      requestAnimationFrame(() => {
        const isOverflowing = p.scrollHeight > p.clientHeight + 2;
        btn.hidden = !isOverflowing;
      });

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const expanded = p.classList.toggle("expanded");
        btn.textContent = expanded ? "Réduire" : "Lire plus";
        btn.setAttribute("aria-expanded", expanded ? "true" : "false");
      });
    });
  }

  setupReadMore();

  // ===== Surprise gallery: view in modal =====
document.querySelectorAll(".btn-view").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const imgSrc = btn.getAttribute("data-img");
    const title = btn.getAttribute("data-title") || "";
    const text = btn.getAttribute("data-text") || "";
    openModal(imgSrc, title, text);
  });
});

document.querySelectorAll(".surprise-img").forEach(img => {
  img.addEventListener("click", () => {
    openModal(img.getAttribute("src"), "Surprise 💗", "");
  });
});

  // Start
  startHeartStream();
})();
