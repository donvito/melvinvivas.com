// Classic 9x9, 10-mine Minesweeper.
class Minesweeper {
  constructor(host) {
    this.host = host;
    this.N = 9; this.M = 10;
    this.reset();
  }

  reset() {
    this.over = false;
    this.won = false;
    this.flags = 0;
    this.revealed = 0;
    this.time = 0;
    this.started = false;
    clearInterval(this.timer);
    this.grid = Array.from({ length: this.N }, () =>
      Array.from({ length: this.N }, () => ({ mine: false, open: false, flag: false, n: 0 }))
    );
    this.render();
  }

  plant(safeR, safeC) {
    let placed = 0;
    while (placed < this.M) {
      const r = Math.floor(Math.random() * this.N), c = Math.floor(Math.random() * this.N);
      if (this.grid[r][c].mine || (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1)) continue;
      this.grid[r][c].mine = true; placed++;
    }
    for (let r = 0; r < this.N; r++) for (let c = 0; c < this.N; c++) {
      this.grid[r][c].n = this.neighbors(r, c).filter(([x, y]) => this.grid[x][y].mine).length;
    }
  }

  neighbors(r, c) {
    const out = [];
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < this.N && nc >= 0 && nc < this.N) out.push([nr, nc]);
    }
    return out;
  }

  open(r, c) {
    if (this.over) return;
    const cell = this.grid[r][c];
    if (cell.open || cell.flag) return;
    if (!this.started) {
      this.started = true;
      this.plant(r, c);
      this.timer = setInterval(() => { this.time = Math.min(999, this.time + 1); this.sync(); }, 1000);
    }
    cell.open = true;
    if (cell.mine) { this.lose(r, c); return; }
    this.revealed++;
    if (cell.n === 0) this.neighbors(r, c).forEach(([x, y]) => { if (!this.grid[x][y].open) this.open(x, y); });
    if (this.revealed === this.N * this.N - this.M) this.win();
    this.sync();
  }

  lose(r, c) {
    this.over = true;
    clearInterval(this.timer);
    this.boom = [r, c];
    for (let i = 0; i < this.N; i++) for (let j = 0; j < this.N; j++)
      if (this.grid[i][j].mine) this.grid[i][j].open = true;
    this.sync();
  }

  win() {
    this.over = true; this.won = true;
    clearInterval(this.timer);
    this.sync();
  }

  toggleFlag(r, c) {
    if (this.over) return;
    const cell = this.grid[r][c];
    if (cell.open) return;
    cell.flag = !cell.flag;
    this.flags += cell.flag ? 1 : -1;
    this.sync();
  }

  render() {
    this.host.innerHTML = `
      <div class="ms-head">
        <span class="ms-count" data-ms="mines">010</span>
        <button class="ms-face" data-ms="face">🙂</button>
        <span class="ms-count" data-ms="time">000</span>
      </div>
      <div class="ms-grid" data-ms="grid"></div>`;
    const grid = this.host.querySelector('[data-ms=grid]');
    grid.addEventListener('contextmenu', e => e.preventDefault());
    for (let r = 0; r < this.N; r++) for (let c = 0; c < this.N; c++) {
      const b = document.createElement('button');
      b.className = 'ms-cell';
      b.dataset.r = r; b.dataset.c = c;
      b.addEventListener('click', () => this.open(r, c));
      b.addEventListener('contextmenu', e => { e.preventDefault(); this.toggleFlag(r, c); });
      grid.appendChild(b);
    }
    this.host.querySelector('[data-ms=face]').addEventListener('click', () => this.reset());
    this.sync();
  }

  sync() {
    const pad = n => String(Math.max(0, n)).padStart(3, '0');
    this.host.querySelector('[data-ms=mines]').textContent = pad(this.M - this.flags);
    this.host.querySelector('[data-ms=time]').textContent = pad(this.time);
    this.host.querySelector('[data-ms=face]').textContent = this.over ? (this.won ? '😎' : '😵') : '🙂';
    const colors = ['', '#0000f5', '#007b00', '#f50000', '#00007b', '#7b0000', '#007b7b', '#000', '#7b7b7b'];
    this.host.querySelectorAll('.ms-cell').forEach(b => {
      const { r, c } = b.dataset;
      const cell = this.grid[r][c];
      b.classList.toggle('open', cell.open);
      if (cell.open) {
        if (cell.mine) {
          b.textContent = '💣';
          if (this.boom && this.boom[0] == r && this.boom[1] == c) b.classList.add('boom');
        } else {
          b.textContent = cell.n || '';
          b.style.color = colors[cell.n];
        }
      } else {
        b.textContent = cell.flag ? '🚩' : '';
      }
    });
  }
}
