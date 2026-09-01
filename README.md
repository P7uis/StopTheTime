# StopTheTime

Version 1.2.12

StopTheTime is a dependency-free, fully client-side web app for running multiple stopwatches and one countdown timer at the same time.

## Features

- Multiple stopwatches with start, lap, stop, reset, names, colors, and per-stopwatch shortcuts.
- Global shortcuts: Space for Start / Stop All, L for Lap All.
- Append-only session event log exported as UTF-8 CSV with all start, stop, lap, reset, and countdown events.
- Countdown timer with Beep, Chime, Bell, Tring, Mute, volume control, Test sound, and fullscreen mode.
- Timer Picture-in-Picture window for keeping a countdown visible over other apps in supported browsers.
- Floating header menu for quick Stopwatch / Timer navigation.
- Inline `HH:MM:SS` countdown editing by clicking the time digits.
- Auto, Dark, and Light themes with local persistence.
- Local session persistence through browser refresh.
- PWA manifest and service worker for offline use after the app has loaded once.

## Local preview

Open `index.html` directly, or serve the folder over HTTP to test the service worker:

```bash
python -m http.server 4173
```

## GitHub Pages

This project is ready to publish from the repository root. In GitHub, enable Pages from the main branch and root folder.

## License

This project is licensed under the GNU General Public License v3.0. See [LICENSE](LICENSE).
