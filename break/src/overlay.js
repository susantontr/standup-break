const path = require('path');
const fs = require('fs');

// In dev, use the local assets folder. In packaged app, use resourcesPath.
const devPath = path.join(__dirname, '..', 'assets', 'bird.json');
const birdPath = fs.existsSync(devPath)
  ? devPath
  : path.join(process.resourcesPath, 'assets', 'bird.json');

const animationData = JSON.parse(fs.readFileSync(birdPath, 'utf8'));

lottie.loadAnimation({
  container: document.getElementById('lottie-bird'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  animationData,
});
