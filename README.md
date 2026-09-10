# macOS Dynamic Notch App (Electron + React + Tailwind CSS)

Aplikasi Dynamic Island / Notch Bar untuk macOS yang dibuat dengan **React 18**, **Tailwind CSS**, dan dibungkus dengan **Electron**.

![Dynamic Notch Preview](https://raw.githubusercontent.com/placeholder/notch.png)

## Fitur Utama

- **Frameless & Transparent Window**: Jendela transparan tanpa title bar yang menempel presisi di notch kamera MacBook.
- **Smart Click-Through (Mouse Pass-Through)**: Saat mode ringkas (*collapsed*), area transparan di sekitar notch tidak menghalangi klik pada Menu Bar macOS menggunakan API `win.setIgnoreMouseEvents(true, { forward: true })`.
- **Dynamic Expansion Animation**: Transisi mulus berbasis spring animation saat di-hover atau di-klik.
- **Interactive Widgets**:
  - **Media Player**: Live audio visualizer equalizer, informasi lagu/artis, progress bar interaktif, kontrol playback (Play/Pause/Skip), dan slider volume.
  - **System Monitor**: Live monitor beban CPU (Apple Silicon), RAM Usage (Unified Memory), dan status Baterai/Pengisian daya.
  - **Quick Actions**: Tombol Focus / Do Not Disturb, Toggle Mute Mikrofon, True Tone, dan tombol Keluar.
  - **Pin Mode**: Mengunci notch tetap terbuka tanpa harus terus menahan kursor di atasnya.
- **macOS Native Integration**:
  - Always-on-top level `screen-saver` (selalu di atas menu bar & aplikasi fullscreen).
  - Terlihat di semua Virtual Desktop / Spaces (`setVisibleOnAllWorkspaces`).
  - Tidak muncul di Dock atau Mission Control sehingga bertindak murni seperti daemon/status item.

---

## Struktur Proyek

```
notch/
├── electron.vite.config.ts    # Konfigurasi Electron-Vite
├── package.json
├── tailwind.config.js         # Konfigurasi styling & keyframe animations
├── src/
│   ├── main/
│   │   └── index.ts           # Electron Main Process (Window setup & IPC)
│   ├── preload/
│   │   ├── index.ts           # Context Bridge IPC
│   │   └── index.d.ts         # TypeScript window.notchAPI typings
│   └── renderer/
│       ├── index.html
│       └── src/
│           ├── main.tsx
│           ├── index.css      # Tailwind & custom wave animations
│           ├── App.tsx        # Dynamic Notch Bar controller
│           └── components/
│               ├── MediaWidget.tsx
│               ├── SystemWidget.tsx
│               └── QuickActionsWidget.tsx
```

---

## Cara Menjalankan & Mengembangkan

### Mode Pengembangan (Development)
```bash
npm run dev
```

---

## Cara Build, Install, dan Uninstall di macOS

### 1. Build Aplikasi
Proyek ini sudah dilengkapi dengan `electron-builder` untuk menghasilkan installer macOS native:

- **Build DMG Installer & App Bundle**:
  ```bash
  npm run build:mac
  ```
  File installer akan dihasilkan di folder `dist/`:
  - `dist/NotchBar-1.0.0-arm64.dmg` (File installer DMG)
  - `dist/mac-arm64/NotchBar.app` (Aplikasi standalone)

- **Build Unpacked App (Cepat)**:
  ```bash
  npm run build:unpack
  ```
  Menghasilkan folder `dist/mac-arm64/NotchBar.app` tanpa proses kompresi DMG.

---

### 2. Cara Install
Anda memiliki 2 opsi untuk meng-install aplikasi ini ke Mac:

- **Opsi A: Menggunakan file `.dmg`**:
  1. Buka folder `dist/` di Finder.
  2. Klik dua kali file `NotchBar-1.0.0-arm64.dmg`.
  3. Seret (drag & drop) ikon **NotchBar** ke dalam folder **Applications**.

- **Opsi B: Langsung Copy ke Applications via Terminal**:
  ```bash
  cp -R dist/mac-arm64/NotchBar.app /Applications/
  ```

Setelah terinstall, Anda bisa membuka **NotchBar** langsung dari Spotlight Search (`Cmd + Spasi`) atau Launchpad.

---

### 3. Cara Uninstall
Untuk menghapus aplikasi dari Mac Anda:

1. **Hentikan Aplikasi Terlebih Dahulu**:
   Buka tab **Actions** di notch lalu klik **Keluar**, atau jalankan perintah di terminal:
   ```bash
   pkill -9 -f NotchBar
   ```

2. **Hapus dari Folder Applications**:
   - Buka Finder > Masuk ke folder **Applications** > Cari **NotchBar** > Klik kanan lalu pilih **Move to Trash (Pindahkan ke Tong Sampah)**.
   - Atau lewat terminal:
     ```bash
     rm -rf /Applications/NotchBar.app
     ```

3. **(Opsional) Bersihkan Data Cache / Preferences**:
   ```bash
   rm -rf "$HOME/Library/Application Support/notch-app"
   ```

---

## Cara Kerja Teknis di macOS

1. **Penempatan di Area Notch**:
   Posisi dihitung otomatis dari layar utama:
   ```ts
   const primaryDisplay = screen.getPrimaryDisplay()
   const x = Math.round(primaryDisplay.bounds.x + (primaryDisplay.bounds.width - WINDOW_WIDTH) / 2)
   const y = primaryDisplay.bounds.y
   ```

2. **Melayang di Atas Menu Bar**:
   ```ts
   win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
   win.setAlwaysOnTop(true, 'screen-saver', 1)
   ```

3. **Mouse Event Forwarding**:
   - Saat mouse masuk ke widget: `window.notchAPI.setIgnoreMouseEvents(false)`
   - Saat mouse keluar: `window.notchAPI.setIgnoreMouseEvents(true, true)`
# notch
# notch
