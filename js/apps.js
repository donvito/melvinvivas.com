// App registry: each "program" is a window. body is HTML injected into the window.
const APPS = {

  'my-computer': {
    title: 'My Computer',
    icon: 'pc',
    width: 620,
    height: 420,
    menu: true,
    status: 'Local machine',
    body: `
      <div class="explorer">
        <div class="exp-side">
          <div class="exp-side-h">System Tasks</div>
          <div class="exp-side-i" data-open="about">&rsaquo; View system information</div>
          <div class="exp-side-i" data-ext="https://www.donvitocodes.com">&rsaquo; Visit donvitocodes.com</div>
          <div class="exp-side-i" data-open="cmd">&rsaquo; Run a command</div>
        </div>
        <div class="exp-main">
          <div class="exp-group-h">Hard Disk Drives</div>
          <div class="exp-item" data-open="about"><span class="exp-ico">${icon('pc')}</span><span>Local Disk (C:)<br /><small>System — Melvin OS</small></span></div>
          <div class="exp-item" data-open="projects"><span class="exp-ico">${icon('pc')}</span><span>Projects (D:)<br /><small>Things I've shipped</small></span></div>
          <div class="exp-group-h">Devices with Removable Storage</div>
          <div class="exp-item" data-open="notepad"><span class="exp-ico">${icon('notepad')}</span><span>resume.txt<br /><small>Floppy Disk (A:)</small></span></div>
          <div class="exp-group-h">Other Places</div>
          <div class="exp-item" data-open="writing"><span class="exp-ico">${icon('docs')}</span><span>My Documents<br /><small>Blog posts &amp; writing</small></span></div>
          <div class="exp-item" data-open="ie"><span class="exp-ico">${icon('ie')}</span><span>My Network Places<br /><small>Where to find me online</small></span></div>
        </div>
      </div>`,
  },

  about: {
    title: 'About Melvin',
    icon: 'pc',
    width: 560,
    height: 460,
    menu: false,
    status: 'System Properties',
    body: `
      <div class="doc">
        <div class="doc-head">
          <img class="doc-avatar" src="https://github.com/donvito.png" alt="Melvin Vivas" />
          <div>
            <h1>Melvin Vivas</h1>
            <p class="doc-sub">AI Engineer &middot; Fractional CAIO &middot; Singapore</p>
          </div>
        </div>
        <p>Hi! I'm a software engineer with <b>25+ years</b> in banking, fintech and enterprise software.
        I run <b>DonvitoCodes</b> — an AI advisory and engineering practice where I help companies
        design AI strategy and actually ship: agents, LLM pipelines and on-prem/open-source models.</p>
        <p>Previously Technical Manager / Scrum Master at Standard Chartered Bank, modernizing Trade
        Finance platforms with Docker and Kubernetes. Speaker at NTU Singapore, PSIA and DICT Philippines.</p>
        <div class="stat-row">
          <div class="stat"><b>300+</b><span>engineers trained</span></div>
          <div class="stat"><b>50+</b><span>mentees</span></div>
          <div class="stat"><b>25+</b><span>years in tech</span></div>
        </div>
        <p>I also live-code on <a href="https://twitch.tv/donvitocodes" target="_blank">Twitch</a>,
        write on this site since 2016, and build open tools like
        <a href="https://github.com/donvito/ai-backends" target="_blank">ai-backends</a> and GAIA.</p>
        <div class="doc-actions">
          <button data-ext="https://www.linkedin.com/in/melvinvivas">LinkedIn</button>
          <button data-ext="https://github.com/donvito">GitHub</button>
          <button data-ext="https://www.donvitocodes.com">Book a call</button>
          <button data-ext="mailto:melvindave@gmail.com">Email me</button>
        </div>
      </div>`,
  },

  projects: {
    title: 'Projects (D:)',
    icon: 'folder',
    width: 620,
    height: 430,
    menu: true,
    status: '7 object(s)',
    body: `
      <div class="folder-view">
        <a class="file-row" href="https://github.com/donvito/ai-backends" target="_blank">
          <span class="file-ico">${icon('folder')}</span>
          <span class="file-name">ai-backends</span>
          <span class="file-meta">Multi-provider AI API server — Ollama, LM Studio, OpenRouter, OpenAI, Anthropic, Google</span>
        </a>
        <a class="file-row" href="https://github.com/donvito/gaia-personal-setup" target="_blank">
          <span class="file-ico">${icon('folder')}</span>
          <span class="file-name">gaia-personal-setup</span>
          <span class="file-meta">GAIA — provision and manage multiple personal AI agents (Hermes) in Docker</span>
        </a>
        <a class="file-row" href="https://github.com/donvito/raibot" target="_blank">
          <span class="file-ico">${icon('folder')}</span>
          <span class="file-name">raibot</span>
          <span class="file-meta">Chat gateway connecting Discord, Telegram, Slack &amp; Mattermost to Claude agents</span>
        </a>
        <a class="file-row" href="https://www.donvitocodes.com" target="_blank">
          <span class="file-ico">${icon('globe')}</span>
          <span class="file-name">donvitocodes.com</span>
          <span class="file-meta">AI advisory, workshops, 1-on-1 calls and daily AI news</span>
        </a>
        <a class="file-row" href="https://github.com/donvito" target="_blank">
          <span class="file-ico">${icon('folder')}</span>
          <span class="file-name">AI Dream Photo</span>
          <span class="file-meta">Production GenAI image-generation &amp; face-cloning app used by real customers</span>
        </a>
        <a class="file-row" href="https://github.com/donvito?tab=repositories&q=bolt" target="_blank">
          <span class="file-ico">${icon('folder')}</span>
          <span class="file-name">bolt-* prototypes</span>
          <span class="file-meta">Rapid AI-built apps: CRM, flights, fleet mgmt, POS, medcare...</span>
        </a>
        <a class="file-row" href="https://github.com/donvito" target="_blank">
          <span class="file-ico">${icon('globe')}</span>
          <span class="file-name">More on GitHub</span>
          <span class="file-meta">200+ public repos — everything else lives here</span>
        </a>
      </div>`,
  },

  writing: {
    title: 'My Documents — Writing',
    icon: 'docs',
    width: 640,
    height: 450,
    menu: true,
    status: 'Blog since 2016',
    body: `
      <div class="folder-view">
        <div class="folder-note">Selected posts from my tech blog — Go, Docker, AI and careers.
        <a href="https://melvinvivas.com" target="_blank">View the full archive &raquo;</a></div>
        <a class="file-row" href="https://melvinvivas.com/chatgpt-openai-natural-language-to-api-call" target="_blank"><span class="file-ico">${icon('notepad')}</span><span class="file-name">Leverage Natural Language, OpenAI, LangChain &amp; Custom APIs</span><span class="file-meta">Apr 2023</span></a>
        <a class="file-row" href="https://melvinvivas.com/chatgpt-openai-langchain-llama-index-generative-text-ai" target="_blank"><span class="file-ico">${icon('notepad')}</span><span class="file-name">Exploring Generative Text AI with OpenAI, Python &amp; LlamaIndex</span><span class="file-meta">Apr 2023</span></a>
        <a class="file-row" href="https://melvinvivas.com/new-live-coding-stream-twitch" target="_blank"><span class="file-ico">${icon('notepad')}</span><span class="file-name">I started a live coding stream on Twitch</span><span class="file-meta">Aug 2022</span></a>
        <a class="file-row" href="https://melvinvivas.com/getting-started-strapi-headless-cms-jamstack" target="_blank"><span class="file-ico">${icon('notepad')}</span><span class="file-name">Getting Started with Strapi Headless CMS</span><span class="file-meta">Nov 2021</span></a>
        <a class="file-row" href="https://melvinvivas.com/golang-jobs-in-singapore" target="_blank"><span class="file-ico">${icon('notepad')}</span><span class="file-name">Golang Developer Jobs in Singapore</span><span class="file-meta">Mar 2020</span></a>
        <a class="file-row" href="https://melvinvivas.com/how-to-encrypt-and-decrypt-data-using-aes" target="_blank"><span class="file-ico">${icon('notepad')}</span><span class="file-name">Encrypt &amp; Decrypt data using Golang and AES</span><span class="file-meta">Mar 2020</span></a>
        <a class="file-row" href="https://melvinvivas.com/aws-lambda-go-sam" target="_blank"><span class="file-ico">${icon('notepad')}</span><span class="file-name">Deploying a Go Lambda Function using AWS SAM</span><span class="file-meta">Nov 2019</span></a>
        <a class="file-row" href="https://melvinvivas.com/develop-graphql-web-apis-using-golang" target="_blank"><span class="file-ico">${icon('notepad')}</span><span class="file-name">Create a GraphQL API Server using Go</span><span class="file-meta">Sep 2019</span></a>
        <a class="file-row" href="https://melvinvivas.com/docker-elasticsearch-fluentd-nginx" target="_blank"><span class="file-ico">${icon('notepad')}</span><span class="file-name">Ingest NGINX access logs to ElasticSearch via Fluentd</span><span class="file-meta">Dec 2018</span></a>
        <a class="file-row" href="https://melvinvivas.com/go-version-1-11-modules" target="_blank"><span class="file-ico">${icon('notepad')}</span><span class="file-name">Go Modules in Go 1.11 — Goodbye GOPATH</span><span class="file-meta">Aug 2018</span></a>
        <a class="file-row" href="https://melvinvivas.com/gophercon-singapore-2018" target="_blank"><span class="file-ico">${icon('notepad')}</span><span class="file-name">The GopherCon Singapore 2018 Experience</span><span class="file-meta">May 2018</span></a>
        <a class="file-row" href="https://melvinvivas.com/secrets-management-using-docker-hashicorp-vault" target="_blank"><span class="file-ico">${icon('notepad')}</span><span class="file-name">HashiCorp Vault (Secrets Management) in Docker</span><span class="file-meta">Apr 2018</span></a>
        <a class="file-row" href="https://melvinvivas.com/neo4j-in-docker" target="_blank"><span class="file-ico">${icon('notepad')}</span><span class="file-name">My First Experience with Neo4j in Docker</span><span class="file-meta">Feb 2018</span></a>
        <a class="file-row" href="https://melvinvivas.com/docker-stack-with-the-official-elasticsearch-kibana" target="_blank"><span class="file-ico">${icon('notepad')}</span><span class="file-name">Docker Stack with ElasticSearch &amp; Kibana</span><span class="file-meta">Sep 2017</span></a>
      </div>`,
  },

  ie: {
    title: 'Internet Explorer',
    icon: 'ie',
    width: 640,
    height: 460,
    menu: false,
    status: 'Done',
    onOpen(win) { IEApp.init(win); },
    body: `
      <div class="ie">
        <div class="ie-bar">
          <span>Address</span>
          <input class="ie-url" value="https://links.melvinvivas.com" spellcheck="false" />
          <button class="ie-go">Go</button>
        </div>
        <div class="ie-page">
          <h2 class="ie-h">Favorites</h2>
          <a class="ie-link" href="https://www.donvitocodes.com" target="_blank"><span class="file-ico">${icon('globe')}</span><span><b>DonvitoCodes</b> — AI advisory, workshops &amp; daily AI news<br /><small>donvitocodes.com</small></span></a>
          <a class="ie-link" href="https://github.com/donvito" target="_blank"><span class="file-ico">${icon('pc')}</span><span><b>GitHub</b> — 200+ repos of things I build<br /><small>github.com/donvito</small></span></a>
          <a class="ie-link" href="https://www.linkedin.com/in/melvinvivas" target="_blank"><span class="file-ico">${icon('globe')}</span><span><b>LinkedIn</b> — the professional me<br /><small>linkedin.com/in/melvinvivas</small></span></a>
          <a class="ie-link" href="https://twitch.tv/donvitocodes" target="_blank"><span class="file-ico">${icon('globe')}</span><span><b>Twitch</b> — live coding, mistakes and all<br /><small>twitch.tv/donvitocodes</small></span></a>
          <a class="ie-link" href="https://melvinvivas.com" target="_blank"><span class="file-ico">${icon('notepad')}</span><span><b>Tech Blog</b> — writing since 2016<br /><small>melvinvivas.com</small></span></a>
          <a class="ie-link" href="mailto:melvindave@gmail.com"><span class="file-ico">${icon('mail')}</span><span><b>Email</b> — old school, always works<br /><small>melvindave@gmail.com</small></span></a>
          <p class="ie-tip">Tip: type a URL in the address bar and press Enter — it opens in a real tab.</p>
        </div>
      </div>`,
  },

  notepad: {
    title: 'resume.txt - Notepad',
    icon: 'notepad',
    width: 560,
    height: 460,
    menu: false,
    status: '',
    body: `
      <pre class="notepad-text">MELVIN VIVAS
AI Engineer / Fractional CAIO — Singapore
==========================================

EXPERIENCE
  2024–now   DonvitoCodes — Fractional CAIO &amp; AI Engineer
             Executive AI advisory + hands-on builds: agents,
             LLM pipelines, on-prem / open-source models.

  –2024      Standard Chartered Bank — Technical Manager /
             Scrum Master. Modernized Trade Finance apps
             (Docker, Kubernetes).

  1999–      25+ years across startups and enterprises in the
             Philippines &amp; Singapore — developer, team lead,
             technical manager.

SPEAKING / TEACHING
  NTU Singapore, PSIA, DICT Philippines
  300+ engineers trained · 50+ mentees

OPEN SOURCE
  ai-backends · gaia-personal-setup · raibot
  github.com/donvito (200+ public repos)

CONTACT
  linkedin.com/in/melvinvivas
  twitch.tv/donvitocodes
  donvitocodes.com
  melvindave@gmail.com
</pre>`,
  },

  cmd: {
    title: 'C:\\WINDOWS\\system32\\cmd.exe',
    icon: 'cmd',
    width: 540,
    height: 360,
    menu: false,
    status: '',
    onOpen(win) { CmdApp.init(win); },
    body: `<div class="cmd"><div class="cmd-out">Microsoft Windows XP [Version 5.1.2600]<br>(C) Copyright 1985-2001 Microsoft Corp.<br>&nbsp;</div><div class="cmd-line"><span class="cmd-prompt">C:\\&gt;</span><input class="cmd-in" spellcheck="false" autocomplete="off" /></div></div>`,
  },

  minesweeper: {
    title: 'Minesweeper',
    icon: 'mine',
    width: 264,
    height: 380,
    menu: false,
    status: '',
    onOpen(win) { new Minesweeper(win.querySelector('.ms-host')); },
    body: `<div class="ms-host"></div>`,
  },

  'recycle-bin': {
    title: 'Recycle Bin',
    icon: 'bin',
    width: 480,
    height: 320,
    menu: true,
    status: '1 object(s)',
    body: `
      <div class="folder-view">
        <div class="file-row"><span class="file-ico">${icon('notepad')}</span><span class="file-name">old_boring_portfolio.html</span><span class="file-meta">Deleted ${new Date().toLocaleDateString()}</span></div>
        <div class="folder-note">This is where boring websites go to die.<br />Cannot be restored. It's too late. Move on.</div>
      </div>`,
  },
};

// IE behavior: Enter in the address bar opens the URL in a real tab.
const IEApp = {
  init(win) {
    const input = win.querySelector('.ie-url');
    const go = win.querySelector('.ie-go');
    const visit = () => {
      let url = input.value.trim();
      if (!url) return;
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
      window.open(url, '_blank');
    };
    input.addEventListener('keydown', e => { if (e.key === 'Enter') visit(); e.stopPropagation(); });
    go.addEventListener('click', visit);
  },
};

// Command prompt behavior.
const CmdApp = {
  init(win) {
    const out = win.querySelector('.cmd-out');
    const input = win.querySelector('.cmd-in');
    const print = t => { out.innerHTML += t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\n/g,'<br>') + '<br>'; };
    const commands = {
      help:    'whoami     who is this guy\nver        windows version\ndir        list desktop items\nsocial     where to find me\nopen <app> open an app (about, projects, writing, ie, notepad, minesweeper, cmd, bin)\nemail      open email client\ncls        clear screen\nexit       close this window',
      whoami:  'Melvin Vivas — AI Engineer & Fractional CAIO, Singapore. 25+ yrs in tech. Builds agents, streams on Twitch, writes here.',
      ver:     'MelvinOS XP Professional [Version 1999.2600]\nBuilt from: melvinvivas.com',
      dir:     ' Volume in drive C is MELVIN\n Directory of C:\\desktop\n\n  <DIR>  My Computer\n  <DIR>  My Documents\\Writing\n  <DIR>  Projects (D:)\n  <EXE>  Internet Explorer\n  <EXE>  Minesweeper\n  <EXE>  cmd.exe\n  <TXT>  resume.txt\n  <BIN>  Recycle Bin',
      social:  'github.com/donvito\nlinkedin.com/in/melvinvivas\ntwitch.tv/donvitocodes\ndonvitocodes.com\nmelvindave@gmail.com',
      email:   'Opening your email client... ',
    };
    input.addEventListener('keydown', e => {
      e.stopPropagation();
      if (e.key !== 'Enter') return;
      const raw = input.value.trim();
      print('C:\\&gt;' + raw);
      input.value = '';
      const [cmd, ...rest] = raw.toLowerCase().split(/\s+/);
      if (!cmd) return;
      if (cmd === 'cls') { out.innerHTML = ''; return; }
      if (cmd === 'exit') { WM.close(win); return; }
      if (cmd === 'open') {
        const map = { about:'about', projects:'projects', writing:'writing', ie:'ie', notepad:'notepad', minesweeper:'minesweeper', cmd:'cmd', bin:'recycle-bin' };
        const t = map[rest[0]];
        print(t ? 'Starting ' + rest[0] + '...' : `'${rest[0]||''}' is not recognized as an app. Try: ${Object.keys(map).join(', ')}`);
        if (t) WM.openApp(t);
        return;
      }
      if (cmd === 'email') { print(commands.email); window.location.href = 'mailto:melvindave@gmail.com'; return; }
      if (commands[cmd]) { print(commands[cmd]); return; }
      print(`'${cmd}' is not recognized as an internal or external command,\noperable program or batch file. Type help.`);
    });
    win.addEventListener('mousedown', () => input.focus());
    input.focus();
  },
};

// Desktop icon layout (order = top to bottom in left column)
const DESKTOP_ICONS = [
  { app: 'my-computer', label: 'My Computer' },
  { app: 'writing', label: 'My Documents' },
  { app: 'projects', label: 'Projects' },
  { app: 'ie', label: 'Internet Explorer' },
  { app: 'notepad', label: 'resume.txt' },
  { app: 'cmd', label: 'Command Prompt' },
  { app: 'minesweeper', label: 'Minesweeper' },
  { app: 'recycle-bin', label: 'Recycle Bin' },
];

// Start menu entries
const SM_PINNED = ['ie', 'about', 'projects', 'writing', 'notepad', 'cmd', 'minesweeper'];
const SM_PLACES = [
  { app: 'writing', label: 'My Documents' },
  { app: 'projects', label: 'My Projects' },
  { app: 'my-computer', label: 'My Computer' },
  { app: 'ie', label: 'My Network Places' },
  { sep: true },
  { ext: 'https://melvinvivas.com', label: 'Tech Blog', icon: 'globe' },
  { ext: 'mailto:melvindave@gmail.com', label: 'E-mail Melvin', icon: 'mail' },
];
