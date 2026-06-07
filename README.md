# 🐦 Standup Break

A tiny Mac menu bar app that sends a cute flying toucan across your screen to remind you to stand up and take a break.

![Standup Break demo](assets/demo.gif)

---

## Why

It's easy to sit for hours without noticing. Standup Break gives you a playful nudge — no annoying popups, just a toucan flying by.

Research shows that prolonged sitting is seriously bad for your health:

- 🫀 Raises heart disease risk by up to **147%** *(Annals of Internal Medicine, 2015)*
- 🩸 Increases blood sugar and insulin resistance
- 🔥 Slows your metabolism
- 🦴 Causes back, neck, and hip pain
- 🧠 Reduces focus and energy levels

The **WHO**, **NHS**, and **Mayo Clinic** all recommend breaking up sitting every **30–60 minutes** — even a 2-minute stand makes a difference. Standup Break makes it impossible to forget.

---

## Features

- 🐦 Cute Lottie toucan animation flies across your screen
- ⏱ Fully customizable reminder interval (5 min → 2 hours)
- 🖥 Appears over all other apps so you actually notice it
- 🔇 Silent — no sounds, no dock icon, no interruptions
- 🍎 Lives quietly in your menu bar

---

## Download

| Platform | Download |
|----------|----------|
| 🍎 Mac (Apple Silicon) | [Download `.dmg`](https://github.com/susantontr/standup-break/releases/latest) |
| 🪟 Windows (64-bit) | [Download `.exe`](https://github.com/susantontr/standup-break/releases/latest) |

**Mac:** Requires macOS 10.12+ on Apple Silicon (M1/M2/M3/M4)
**Windows:** Requires Windows 10 or later (64-bit)

### Install — Mac
1. Open the `.dmg` file
2. Drag **Standup Break** to your Applications folder
3. Try to open it

> ⚠️ **macOS "damaged" warning?** This happens because the app isn't yet enrolled in the Apple Developer Program. It's completely safe — just follow these steps to fix it:
>
> 1. Open **Terminal**
> 2. Type `xattr -cr ` (with a space at the end — don't hit Enter yet)
> 3. Open **Finder** → go to your **Applications** folder
> 4. Drag and drop **Standup Break.app** into the Terminal window (it auto-fills the path)
> 5. Now hit **Enter**
> 6. Try opening the app again ✅

### Install — Windows
1. Run the `.exe` installer
2. Follow the prompts
3. The app starts automatically and lives in your system tray (bottom-right near the clock)

---

## Usage

Once running, the app lives in your menu bar as a small 🐦 icon.

**Right-click the icon** to:
- **Show Now** — trigger the animation immediately
- **Settings…** — change how often the bird visits
- **Quit** — stop the app

---

## Built With

- [Electron](https://www.electronjs.org/)
- [Lottie Web](https://github.com/airbnb/lottie-web)
- Toucan animation by [Diogo de Freitas](https://lottiefiles.com) via LottieFiles

---

## Build From Source

```bash
# Clone the repo
git clone https://github.com/susantontr/standup-break.git
cd standup-break

# Install dependencies
npm install

# Run in development
npm start

# Build the .dmg
npm run dist
```

---

## Contributing

Got ideas? Found a bug? PRs and issues are welcome! 🙌

---

## License

MIT
