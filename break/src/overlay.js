const animationData = require('../assets/bird.json');

lottie.loadAnimation({
  container: document.getElementById('lottie-bird'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  animationData,
});
