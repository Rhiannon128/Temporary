(function() {
  const container = document.getElementById('scene');
  if (!container) return;

  // If a hero video is present we will use the video as the background
  // instead of rendering the Three.js wave scene. This lets users supply
  // their own MP4 and keeps the video visible on the page.
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    container.style.display = 'none';
    return;
  }

  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0a);
  scene.fog = new THREE.FogExp2(0x0a0a0a, 0.035);

  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 4, 8);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.4;
  controls.maxPolarAngle = Math.PI / 2.1;
  controls.minPolarAngle = Math.PI / 3;

  // Terrain geometry
  const geometry = new THREE.PlaneGeometry(30, 30, 64, 64);
  const posAttribute = geometry.attributes.position;

  // Simple noise function
  function noise(x, z) {
    return Math.sin(x * 0.5) * Math.cos(z * 0.5) * 0.8 +
           Math.sin(x * 1.2 + z * 0.8) * 0.3 +
           Math.cos(x * 0.3 - z * 1.1) * 0.4;
  }

  for (let i = 0; i < posAttribute.count; i++) {
    const x = posAttribute.getX(i);
    const z = posAttribute.getY(i); // PlaneGeometry uses Y as up before rotation
    const y = noise(x, z);
    posAttribute.setZ(i, y);
  }
  geometry.computeVertexNormals();

  // Wireframe material (aesthetic grid)
  const material = new THREE.MeshBasicMaterial({
    color: 0x2a3b4c,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });

  const terrain = new THREE.Mesh(geometry, material);
  terrain.rotation.x = -Math.PI / 2;
  scene.add(terrain);

  // Second layer (denser, different color)
  const geo2 = new THREE.PlaneGeometry(30, 30, 32, 32);
  const pos2 = geo2.attributes.position;
  for (let i = 0; i < pos2.count; i++) {
    const x = pos2.getX(i);
    const z = pos2.getY(i);
    pos2.setZ(i, noise(x, z) - 0.5);
  }
  geo2.computeVertexNormals();
  const mat2 = new THREE.MeshBasicMaterial({
    color: 0x1a2a3a,
    wireframe: true,
    transparent: true,
    opacity: 0.2
  });
  const terrain2 = new THREE.Mesh(geo2, mat2);
  terrain2.rotation.x = -Math.PI / 2;
  scene.add(terrain2);

  // Floating particles
  const particlesGeo = new THREE.BufferGeometry();
  const particleCount = 80;
  const pPos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    pPos[i] = (Math.random() - 0.5) * 20;
    pPos[i+1] = Math.random() * 6;
    pPos[i+2] = (Math.random() - 0.5) * 20;
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const particlesMat = new THREE.PointsMaterial({
    color: 0x4fc3f7,
    size: 0.06,
    transparent: true,
    opacity: 0.6
  });
  const particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation loop
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.005;

    // Gentle terrain wave
    const pos = terrain.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i);
      const y = noise(x + time * 0.3, z + time * 0.2);
      pos.setZ(i, y);
    }
    pos.needsUpdate = true;

    // Particles float up
    const pp = particles.geometry.attributes.position;
    for (let i = 1; i < pp.count * 3; i += 3) {
      pp.array[i] += 0.005;
      if (pp.array[i] > 6) pp.array[i] = 0;
    }
    pp.needsUpdate = true;

    controls.update();
    renderer.render(scene, camera);
  }
  animate();
})();
