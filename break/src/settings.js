const { ipcRenderer } = require('electron');

const select = document.getElementById('interval');
const saveBtn = document.getElementById('save');
const savedMsg = document.getElementById('saved');

// Load current setting from main process
ipcRenderer.invoke('get-interval').then((minutes) => {
  select.value = String(minutes);
});

saveBtn.addEventListener('click', () => {
  const minutes = parseInt(select.value, 10);
  ipcRenderer.invoke('set-interval', minutes).then(() => {
    ipcRenderer.send('menu-refresh');
    savedMsg.style.opacity = '1';
    setTimeout(() => { savedMsg.style.opacity = '0'; }, 2000);
  });
});
