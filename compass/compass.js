(function () {
  const compassFace = document.getElementById('compassFace');
  const headingDegrees = document.getElementById('headingDegrees');
  const headingDirection = document.getElementById('headingDirection');
  const coordinates = document.getElementById('coordinates');
  const statusBar = document.getElementById('statusBar');
  const permissionOverlay = document.getElementById('permissionOverlay');
  const permissionBtn = document.getElementById('permissionBtn');
  const tickMarks = document.getElementById('tickMarks');

  let currentHeading = 0;
  let targetHeading = 0;
  let animationId = null;
  let isSimulated = false;

  init();

  function init() {
    renderTickMarks();
    permissionBtn.addEventListener('click', requestPermissions);
  }

  function renderTickMarks() {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 360; i += 2) {
      const tick = document.createElement('div');
      tick.className = i % 30 === 0 ? 'tick major' : 'tick minor';
      tick.style.transform = `translateX(-50%) rotate(${i}deg)`;
      fragment.appendChild(tick);
    }
    tickMarks.appendChild(fragment);
  }

  async function requestPermissions() {
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          startCompass();
        } else {
          startSimulation();
        }
      } catch {
        startSimulation();
      }
    } else if ('DeviceOrientationEvent' in window) {
      startCompass();
    } else {
      startSimulation();
    }

    requestLocation();
    hideOverlay();
  }

  function startCompass() {
    let hasReceivedData = false;

    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);

    function handleOrientation(e) {
      let heading = null;

      if (e.webkitCompassHeading !== undefined) {
        heading = e.webkitCompassHeading;
      } else if (e.alpha !== null) {
        heading = e.absolute ? (360 - e.alpha) : (360 - e.alpha);
      }

      if (heading !== null) {
        hasReceivedData = true;
        targetHeading = heading;
        if (!animationId) startAnimation();
        setStatus('Compass active', true);
      }
    }

    setTimeout(() => {
      if (!hasReceivedData) {
        startSimulation();
      }
    }, 2000);
  }

  function startSimulation() {
    isSimulated = true;
    setStatus('Simulated mode (no sensor)', true);

    let angle = 0;
    let mouseX = window.innerWidth / 2;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
    });

    document.addEventListener('touchmove', (e) => {
      mouseX = e.touches[0].clientX;
    });

    function simulate() {
      const center = window.innerWidth / 2;
      const offset = (mouseX - center) / center;
      angle += offset * 2;
      if (angle < 0) angle += 360;
      if (angle >= 360) angle -= 360;

      targetHeading = angle;
      requestAnimationFrame(simulate);
    }

    if (!animationId) startAnimation();
    requestAnimationFrame(simulate);
  }

  function startAnimation() {
    function animate() {
      let diff = targetHeading - currentHeading;

      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      currentHeading += diff * 0.12;

      if (currentHeading < 0) currentHeading += 360;
      if (currentHeading >= 360) currentHeading -= 360;

      compassFace.style.transform = `rotate(${-currentHeading}deg)`;

      const rounded = Math.round(currentHeading);
      const display = rounded === 360 ? 0 : rounded;
      headingDegrees.textContent = String(display).padStart(3, '0');
      headingDirection.textContent = getCardinalDirection(currentHeading);

      animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);
  }

  function getCardinalDirection(deg) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      coordinates.innerHTML = '<span class="coord-label">Location unavailable</span>';
      return;
    }

    navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(5);
        const lon = pos.coords.longitude.toFixed(5);
        const latDir = pos.coords.latitude >= 0 ? 'N' : 'S';
        const lonDir = pos.coords.longitude >= 0 ? 'E' : 'W';
        coordinates.innerHTML =
          `<span class="coord-value">${Math.abs(lat)}° ${latDir}</span>` +
          `<span class="coord-value">${Math.abs(lon)}° ${lonDir}</span>`;
      },
      () => {
        coordinates.innerHTML = '<span class="coord-label">Location unavailable</span>';
      },
      { enableHighAccuracy: true }
    );
  }

  function setStatus(text, active) {
    statusBar.querySelector('.status-text').textContent = text;
    statusBar.classList.toggle('active', active);
  }

  function hideOverlay() {
    permissionOverlay.classList.add('hidden');
    setTimeout(() => {
      permissionOverlay.style.display = 'none';
    }, 400);
  }
})();
