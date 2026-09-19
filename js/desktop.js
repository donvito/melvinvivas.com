// Window manager + boot/welcome/shutdown sequences.
const WM = {
  zTop: 10,
  cascade: 0,
  open: new Map(), // appId -> window element
  els: {},

  init() {
    this.els.desktop = document.getElementById('desktop');
    this.els.windows = document.getElementById('windows');
    this.els.taskButtons = document.getElementById('task-buttons');
    this.buildIcons();
    this.buildStartMenu();
    this.bindChrome();
    this.clock();
    setInterval(() => this.clock(), 1000);
    this.bootSequence();
  },

  // ---------- boot / welcome / shutdown ----------

  bootSequence() {
    const boot = document.getElementById('boot');
    const welcome = document.getElementById('welcome');
    const desktop = this.els.desktop;

    const toWelcome = () => {
      if (!boot.isConnected) return;
      boot.remove();
      welcome.classList.remove('hidden');
      // XP auto-logs a single user in after a short pause; tile click speeds it up.
      welcome._timer = setTimeout(login, 1600);
    };
    const login = () => {
      if (!welcome.isConnected) return;
      clearTimeout(welcome._timer);
      welcome.remove();
      desktop.classList.remove('hidden');
    };

    setTimeout(toWelcome, 2400);
    boot.addEventListener('click', toWelcome);
    document.getElementById('user-tile').addEventListener('click', login);
  },

  shutdown(kind) {
    document.getElementById('shutdown-dialog').classList.add('hidden');
    const shutting = document.getElementById('shutting-down');
    const off = document.getElementById('off');
    if (kind === 'restart') {
      shutting.classList.remove('hidden');
      setTimeout(() => location.reload(), 1400);
      return;
    }
    shutting.classList.remove('hidden');
    setTimeout(() => {
      shutting.classList.add('hidden');
      off.classList.remove('hidden');
    }, 1600);
  },

  // ---------- desktop icons ----------

  buildIcons() {
    const host = document.getElementById('desktop-icons');
    DESKTOP_ICONS.forEach(({ app, label }) => {
      const el = document.createElement('div');
      el.className = 'desk-icon';
      el.dataset.app = app;
      el.innerHTML = `<span class="di-img">${icon(APPS[app].icon)}</span><span class="di-label">${label}</span>`;
      const isTouch = 'ontouchstart' in window;
      el.addEventListener(isTouch ? 'click' : 'dblclick', () => this.openApp(app));
      if (!isTouch) el.addEventListener('click', e => {
        e.stopPropagation();
        document.querySelectorAll('.desk-icon.selected').forEach(i => i.classList.remove('selected'));
        el.classList.add('selected');
      });
      host.appendChild(el);
    });
    this.els.desktop.addEventListener('click', e => {
      if (!e.target.closest('.desk-icon'))
        document.querySelectorAll('.desk-icon.selected').forEach(i => i.classList.remove('selected'));
    });
  },

  // ---------- start menu / taskbar ----------

  buildStartMenu() {
    const pinned = document.getElementById('sm-pinned');
    const places = document.getElementById('sm-places');
    SM_PINNED.forEach(app => {
      const a = document.createElement('div');
      a.className = 'sm-item';
      a.innerHTML = `<span class="sm-ico-img">${icon(APPS[app].icon)}</span><span><b>${APPS[app].title.replace(' - Notepad', '').replace('C:\\WINDOWS\\system32\\', '')}</b></span>`;
      a.addEventListener('click', () => { this.toggleStart(false); this.openApp(app); });
      pinned.appendChild(a);
    });
    SM_PLACES.forEach(p => {
      if (p.sep) { const s = document.createElement('div'); s.className = 'sm-sep'; places.appendChild(s); return; }
      const a = document.createElement('div');
      a.className = 'sm-item sm-item-sm';
      a.innerHTML = `<span class="sm-ico-img sm-ico-img-sm">${icon(p.app ? APPS[p.app].icon : p.icon)}</span><span>${p.label}</span>`;
      a.addEventListener('click', () => {
        this.toggleStart(false);
        if (p.app) this.openApp(p.app); else window.open(p.ext, p.ext.startsWith('mailto') ? '_self' : '_blank');
      });
      places.appendChild(a);
    });
  },

  bindChrome() {
    document.getElementById('start-button').addEventListener('click', e => {
      e.stopPropagation();
      this.toggleStart();
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('#start-menu') && !e.target.closest('#start-button'))
        this.toggleStart(false);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.toggleStart(false);
      // keep OS keys (delete/backspace/arrows) out of window inputs
      if (e.target.matches('input')) return;
    });
    document.getElementById('btn-shutdown').addEventListener('click', () => {
      this.toggleStart(false);
      document.getElementById('shutdown-dialog').classList.remove('hidden');
    });
    document.getElementById('btn-logoff').addEventListener('click', () => location.reload());
    document.getElementById('opt-off').addEventListener('click', () => this.shutdown('off'));
    document.getElementById('opt-restart').addEventListener('click', () => this.shutdown('restart'));
    document.getElementById('opt-standby').addEventListener('click', () => {
      const off = document.getElementById('off');
      off.querySelector('.off-text').innerHTML = 'stand by mode is<br>just a myth.';
      off.classList.remove('hidden');
      setTimeout(() => off.classList.add('hidden'), 1400);
    });
    document.getElementById('opt-cancel').addEventListener('click', () =>
      document.getElementById('shutdown-dialog').classList.add('hidden'));
    document.getElementById('power-button').addEventListener('click', () => location.reload());
    // delegate data-open / data-ext inside any window
    this.els.windows.addEventListener('click', e => {
      const opener = e.target.closest('[data-open]');
      if (opener) { this.openApp(opener.dataset.open); return; }
      const ext = e.target.closest('[data-ext]');
      if (ext) window.open(ext.dataset.ext, ext.dataset.ext.startsWith('mailto') ? '_self' : '_blank');
    });
  },

  toggleStart(force) {
    const m = document.getElementById('start-menu');
    const show = force !== undefined ? force : m.classList.contains('hidden');
    m.classList.toggle('hidden', !show);
    document.getElementById('start-button').classList.toggle('pressed', show);
  },

  clock() {
    const el = document.getElementById('clock');
    if (el.isConnected)
      el.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  },

  // ---------- windows ----------

  openApp(appId) {
    const app = APPS[appId];
    if (!app) return;
    if (this.open.has(appId)) {
      const w = this.open.get(appId);
      w.classList.remove('minimized');
      this.focus(w);
      this.syncTasks();
      return;
    }

    const win = document.createElement('div');
    win.className = 'window';
    win.dataset.app = appId;
    const small = window.innerWidth < 640;
    const w = Math.min(app.width, window.innerWidth - 8);
    const h = Math.min(app.height, window.innerHeight - 60);
    const off = (this.cascade++ % 8) * 24;
    win.style.width = w + 'px';
    win.style.height = h + 'px';
    win.style.left = Math.max(4, (window.innerWidth - w) / 2 + off - 60) + 'px';
    win.style.top = Math.max(4, 30 + off) + 'px';
    win.innerHTML = `
      <div class="title-bar">
        <span class="tb-icon">${icon(app.icon)}</span>
        <span class="tb-title">${app.title}</span>
        <span class="tb-btns">
          <button class="tb-btn tb-min" title="Minimize"></button>
          <button class="tb-btn tb-max" title="Maximize"></button>
          <button class="tb-btn tb-close" title="Close"></button>
        </span>
      </div>
      ${app.menu ? '<div class="win-menu"><span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span>F<u>a</u>vorites</span><span><u>T</u>ools</span><span><u>H</u>elp</span></div>' : ''}
      <div class="win-body">${app.body}</div>
      ${app.status !== undefined && app.status !== '' ? `<div class="win-status">${app.status}</div>` : ''}`;

    win.querySelector('.tb-close').addEventListener('click', () => this.close(win));
    win.querySelector('.tb-min').addEventListener('click', () => this.minimize(win));
    win.querySelector('.tb-max').addEventListener('click', () => this.toggleMax(win));
    win.addEventListener('mousedown', () => this.focus(win));
    this.makeDraggable(win, win.querySelector('.title-bar'));
    win.querySelector('.title-bar').addEventListener('dblclick', e => {
      if (!e.target.closest('.tb-btn')) this.toggleMax(win);
    });

    this.els.windows.appendChild(win);
    this.open.set(appId, win);
    if (small) this.toggleMax(win);
    this.focus(win);
    this.syncTasks();
    if (app.onOpen) app.onOpen(win);
  },

  close(win) {
    this.open.delete(win.dataset.app);
    win.remove();
    this.syncTasks();
    // focus whatever is on top now
    let top = null, z = -1;
    this.els.windows.querySelectorAll('.window:not(.minimized)').forEach(w => {
      const zc = +w.style.zIndex || 0;
      if (zc > z) { z = zc; top = w; }
    });
    if (top) this.focus(top);
  },

  minimize(win) {
    win.classList.add('minimized');
    win.classList.remove('active');
    this.syncTasks();
  },

  toggleMax(win) {
    win.classList.toggle('maximized');
  },

  focus(win) {
    document.querySelectorAll('.window.active').forEach(w => w.classList.remove('active'));
    win.classList.add('active');
    win.style.zIndex = ++this.zTop;
    this.syncTasks();
  },

  syncTasks() {
    const host = this.els.taskButtons;
    host.innerHTML = '';
    this.open.forEach((win, appId) => {
      const b = document.createElement('button');
      b.className = 'task-btn';
      if (win.classList.contains('active') && !win.classList.contains('minimized')) b.classList.add('active');
      b.innerHTML = `<span class="task-ico">${icon(APPS[appId].icon)}</span><span class="task-label">${APPS[appId].title}</span>`;
      b.addEventListener('click', () => {
        if (win.classList.contains('minimized')) {
          win.classList.remove('minimized');
          this.focus(win);
        } else if (win.classList.contains('active')) {
          this.minimize(win);
        } else {
          this.focus(win);
        }
      });
      host.appendChild(b);
    });
  },

  makeDraggable(win, handle) {
    let sx, sy, ox, oy, dragging = false;
    handle.addEventListener('pointerdown', e => {
      if (e.target.closest('.tb-btn') || win.classList.contains('maximized')) return;
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      ox = win.offsetLeft; oy = win.offsetTop;
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener('pointermove', e => {
      if (!dragging) return;
      const x = Math.min(Math.max(ox + e.clientX - sx, -win.offsetWidth + 60), window.innerWidth - 60);
      const y = Math.min(Math.max(oy + e.clientY - sy, 0), window.innerHeight - 80);
      win.style.left = x + 'px';
      win.style.top = y + 'px';
    });
    handle.addEventListener('pointerup', () => (dragging = false));
    handle.addEventListener('pointercancel', () => (dragging = false));
  },
};

document.addEventListener('DOMContentLoaded', () => WM.init());
