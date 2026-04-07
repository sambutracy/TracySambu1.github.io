(function () {
  const root = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initTheme() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') root.classList.add('light');

    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      root.classList.toggle('light');
      const nextTheme = root.classList.contains('light') ? 'light' : 'dark';
      localStorage.setItem('theme', nextTheme);
    });
  }

  function initParallax() {
    if (reduceMotion) return;
    const layers = document.querySelectorAll('[data-speed]');

    function onScroll() {
      const y = window.scrollY;
      layers.forEach((layer) => {
        const speed = Number(layer.getAttribute('data-speed') || 0);
        layer.style.transform = `translateY(${y * speed}px)`;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initTiltCards() {
    if (reduceMotion) return;
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 10).toFixed(2)}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
      });

      card.addEventListener('blur', () => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
      });
    });
  }

  function initKeyboardRoomNav() {
    const rooms = [...document.querySelectorAll('.room')];
    if (!rooms.length) return;

    window.addEventListener('keydown', (event) => {
      if (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp'].includes(event.key)) return;
      const activeIndex = rooms.findIndex((room) => {
        const r = room.getBoundingClientRect();
        return r.top <= window.innerHeight * 0.35 && r.bottom >= window.innerHeight * 0.35;
      });
      const current = activeIndex < 0 ? 0 : activeIndex;
      const nextIndex = event.key === 'ArrowDown' || event.key === 'PageDown'
        ? Math.min(current + 1, rooms.length - 1)
        : Math.max(current - 1, 0);

      rooms[nextIndex].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      rooms[nextIndex].focus({ preventScroll: true });
    });
  }

  function initThreeHero() {
    if (!window.THREE) return;

    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3.1;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const wireGeo = new THREE.IcosahedronGeometry(1.05, 1);
    const wireMat = new THREE.MeshStandardMaterial({
      color: 0x65e8ff,
      wireframe: true,
      roughness: 0.35,
      metalness: 0.2
    });

    const solidGeo = new THREE.IcosahedronGeometry(0.7, 2);
    const solidMat = new THREE.MeshPhysicalMaterial({
      color: 0xff73d9,
      transparent: true,
      opacity: 0.22,
      roughness: 0.35,
      metalness: 0.1,
      transmission: 0.3
    });

    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    const coreMesh = new THREE.Mesh(solidGeo, solidMat);
    scene.add(wireMesh, coreMesh);

    const keyLight = new THREE.PointLight(0xffffff, 1.15);
    keyLight.position.set(2, 2.5, 4);
    const fillLight = new THREE.PointLight(0x7aa1ff, 0.8);
    fillLight.position.set(-2.5, -1.2, 3);
    scene.add(keyLight, fillLight);

    let pointerX = 0;
    let pointerY = 0;

    window.addEventListener('pointermove', (event) => {
      pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    });

    function animate() {
      requestAnimationFrame(animate);
      const speed = reduceMotion ? 0.0012 : 0.003;
      wireMesh.rotation.x += speed;
      wireMesh.rotation.y += speed * 1.4;
      coreMesh.rotation.x -= speed * 0.75;
      coreMesh.rotation.y -= speed;

      wireMesh.position.x += (pointerX * 0.22 - wireMesh.position.x) * 0.05;
      wireMesh.position.y += (-pointerY * 0.16 - wireMesh.position.y) * 0.05;
      coreMesh.position.x = wireMesh.position.x * 0.7;
      coreMesh.position.y = wireMesh.position.y * 0.7;

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  initTheme();
  initParallax();
  initTiltCards();
  initKeyboardRoomNav();
  initThreeHero();
})();
