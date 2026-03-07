// ==================== CONFIGURATION ====================
const CONFIG = {
    boot: {
        logs: [
            "INITIALIZING CYBER NEXUS KERNEL v3.0...",
            "LOADING MODULES: [NET] [SEC] [CRYPTO] [AI]",
            "MOUNTING FILE SYSTEMS... OK",
            "CHECKING MEMORY INTEGRITY... VERIFIED",
            "CONNECTING TO SATELLITE NETWORK... ESTABLISHED",
            "DECRYPTING QUANTUM KEY... SUCCESS",
            "INITIALIZING NEURAL INTERFACE... READY",
            "STARTING DESKTOP ENVIRONMENT..."
        ],
        logDelay: 350
    },
    typerscene: {
        examples: {
            python: `import asyncio
import dataclasses
from typing import List, Dict

@dataclasses.dataclass
class NetworkNode:
    id: int
    ip: str
    status: str = "active"
    
async def scan_network(nodes: List[NetworkNode]) -> Dict:
    results = {}
    for node in nodes:
        await asyncio.sleep(0.01)
        results[node.ip] = "ONLINE" if node.status == "active" else "OFFLINE"
    return results

async def main():
    nodes = [
        NetworkNode(1, "192.168.1.100"),
        NetworkNode(2, "192.168.1.101"),
        NetworkNode(3, "192.168.1.102")
    ]
    scan_results = await scan_network(nodes)
    print(f"Scan complete: {scan_results}")

if __name__ == "__main__":
    asyncio.run(main())`,
            javascript: `class CyberSystem {
    constructor(name) {
        this.name = name;
        this.modules = new Map();
        this.status = 'initializing';
    }

    async initialize() {
        console.log(\`Initializing \${this.name}...\`);
        await this.loadModules();
        this.status = 'ready';
        return this;
    }

    loadModules() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.modules.set('network', { active: true });
                this.modules.set('security', { active: true });
                this.modules.set('crypto', { active: true });
                resolve();
            }, 1000);
        });
    }

    getStatus() {
        return {
            name: this.name,
            status: this.status,
            modules: Array.from(this.modules.keys())
        };
    }
}

const system = new CyberSystem('NEXUS-CORE');
system.initialize().then(() => {
    console.log('System ready:', system.getStatus());
});`,
            cpp: `#include <iostream>
#include <vector>
#include <string>
#include <memory>

class CyberModule {
private:
    std::string name;
    bool active;
    int priority;

public:
    CyberModule(const std::string& n, int p) 
        : name(n), active(false), priority(p) {}

    void activate() {
        active = true;
        std::cout << "Module " << name << " activated\\n";
    }

    bool isActive() const { return active; }
    int getPriority() const { return priority; }
};

class System {
private:
    std::vector<std::shared_ptr<CyberModule>> modules;

public:
    void addModule(const std::string& name, int priority) {
        modules.push_back(
            std::make_shared<CyberModule>(name, priority)
        );
    }

    void initializeAll() {
        for (auto& module : modules) {
            module->activate();
        }
    }
};

int main() {
    System sys;
    sys.addModule("NETWORK", 1);
    sys.addModule("SECURITY", 2);
    sys.addModule("CRYPTO", 3);
    sys.initializeAll();
    return 0;
}`
        },
        chunkSpeed: 1,
        cursorBlinkSpeed: 1000
    }
};

// ==================== UTILITY FUNCTIONS ====================
const Utils = {
    throttle(func, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                return func.apply(this, args);
            }
        };
    },

    debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    createElement(tag, className, innerHTML = '') {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (innerHTML) el.innerHTML = innerHTML;
        return el;
    }
};

// ==================== SYNTAX HIGHLIGHTER ====================
const SyntaxHighlighter = {
    patterns: {
        keyword: /\b(import|from|class|def|async|await|if|else|for|while|return|const|let|var|function|new|this|include|using|namespace|public|private)\b/g,
        type: /\b(int|str|bool|float|List|Dict|void|string|auto|const)\b/g,
        string: /(["'`])(?:(?=(\\?))\2.)*?\1/g,
        number: /\b\d+(\.\d+)?\b/g,
        comment: /(\/\/.*|#.*|\/\*[\s\S]*?\*\/)/g,
        function: /\b([a-zA-Z_]\w*)\s*(?=\()/g,
        punctuation: /[{}()\[\];.,:]/g
    },

    highlight(code) {
        let highlighted = this.escapeHtml(code);
        highlighted = highlighted.replace(this.patterns.comment, '<span class="comment">$&</span>');
        highlighted = highlighted.replace(this.patterns.string, '<span class="str">$&</span>');
        highlighted = highlighted.replace(this.patterns.keyword, '<span class="kw">$&</span>');
        highlighted = highlighted.replace(this.patterns.type, '<span class="type">$&</span>');
        highlighted = highlighted.replace(this.patterns.number, '<span class="num">$&</span>');
        highlighted = highlighted.replace(this.patterns.function, '<span class="fn">$&</span>');
        highlighted = highlighted.replace(this.patterns.punctuation, '<span class="punct">$&</span>');
        return highlighted;
    },

    escapeHtml(text) {
        const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
};

// ==================== WINDOW MANAGER ====================
class WindowManager {
    constructor() {
        this.windows = new Map();
        this.zIndex = 100;
        this.activeWindow = null;
    }

    create(appName, appConfig) {
        if (this.windows.has(appName)) {
            return this.windows.get(appName);
        }
        const win = this._buildWindow(appName, appConfig);
        this.windows.set(appName, win);
        document.getElementById('desktop').appendChild(win.element);
        this.focus(win);
        return win;
    }

    _buildWindow(appName, appConfig) {
        const element = Utils.createElement('div', 'window active');
        element.style.left = (100 + Utils.random(0, 200)) + 'px';
        element.style.top = (50 + Utils.random(0, 100)) + 'px';
        element.style.zIndex = ++this.zIndex;

        const header = this._buildHeader(appName, appConfig.title);
        const content = Utils.createElement('div', 'window-content');

        element.appendChild(header);
        element.appendChild(content);

        const win = { element, header, content, appName, minimized: false, maximized: false };

        this._setupDragging(win);
        this._setupControls(win);

        if (appConfig.render) {
            appConfig.render(content);
        }

        return win;
    }

    _buildHeader(appName, title) {
        const header = Utils.createElement('div', 'window-header');
        header.innerHTML = `
            <div class="window-title">${title}</div>
            <div class="window-controls">
                <button class="window-btn minimize" aria-label="Minimize">−</button>
                <button class="window-btn maximize" aria-label="Maximize">□</button>
                <button class="window-btn close" aria-label="Close">×</button>
            </div>
        `;
        return header;
    }

    _setupDragging(win) {
        let isDragging = false;
        let initialX, initialY;

        win.header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('window-btn')) return;
            isDragging = true;
            initialX = e.clientX - win.element.offsetLeft;
            initialY = e.clientY - win.element.offsetTop;
            this.focus(win);
            e.preventDefault();
        });

        const moveHandler = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            win.element.style.left = (e.clientX - initialX) + 'px';
            win.element.style.top = (e.clientY - initialY) + 'px';
        };

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', () => { isDragging = false; });
    }

    _setupControls(win) {
        win.header.querySelector('.close').addEventListener('click', () => this.close(win));
        win.header.querySelector('.minimize').addEventListener('click', () => this.minimize(win));
        win.header.querySelector('.maximize').addEventListener('click', () => this.maximize(win));
    }

    close(win) {
        if (win.content.cleanup) win.content.cleanup();
        win.element.remove();
        this.windows.delete(win.appName);
        const icon = document.querySelector(`[data-app="${win.appName}"]`);
        if (icon) icon.classList.remove('active');
    }

    minimize(win) {
        win.minimized = !win.minimized;
        win.element.classList.toggle('minimized', win.minimized);
    }

    maximize(win) {
        win.maximized = !win.maximized;
        win.element.classList.toggle('maximized', win.maximized);
    }

    focus(win) {
        if (this.activeWindow) this.activeWindow.element.style.zIndex = this.zIndex;
        win.element.style.zIndex = ++this.zIndex;
        this.activeWindow = win;
    }
}

// ==================== TYPERSCENE APP ====================
class TyperScene {
    constructor(container) {
        this.container = container;
        this.rawText = CONFIG.typerscene.examples.python;
        this.displayText = '';
        this.pointer = 0;
        this.isTyping = false;
        this.typingInterval = null;
        this.currentLanguage = 'python';
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="typerscene-container">
                <div class="typer-controls">
                    <button class="typer-btn" data-action="start">▶ Start</button>
                    <button class="typer-btn" data-action="stop">⏸ Stop</button>
                    <button class="typer-btn" data-action="reset">↻ Reset</button>
                    <select class="typer-select" data-action="language">
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="cpp">C++</option>
                    </select>
                </div>
                <div class="typer-screen-wrap">
                    <div class="typer-screen" id="typer-screen"></div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        const controls = this.container.querySelector('.typer-controls');
        controls.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;
            switch(action) {
                case 'start': this.start(); break;
                case 'stop': this.stop(); break;
                case 'reset': this.reset(); break;
            }
        });
        controls.addEventListener('change', (e) => {
            if (e.target.dataset.action === 'language') this.changeLanguage(e.target.value);
        });
        this._keyHandler = (e) => {
            if (!this.container.isConnected) return;
            if (!this.container.closest('.window.active')) return;
            if (e.key === 'Escape') this.stop();
            else if (!this.isTyping && e.key.length === 1) this.typeChunk();
        };
        document.addEventListener('keydown', this._keyHandler);
        // Cleanup: stop interval + remove global keydown listener when window is closed
        this.container.cleanup = () => {
            this.stop();
            document.removeEventListener('keydown', this._keyHandler);
        };
    }

    start() {
        if (this.isTyping) return;
        this.isTyping = true;
        SystemState.setBoost('typerscene', { cpu: [15, 32], ram: [10, 24], diskio: [5, 16] });
        this.typingInterval = setInterval(() => {
            const t = SystemState.getThrottle(['cpu','ram']);
            if (Math.random() < t) {
                this.typeChunk();
                if (this.pointer >= this.rawText.length) this.stop();
            }
        }, 50);
    }

    stop() {
        this.isTyping = false;
        if (this.typingInterval) { clearInterval(this.typingInterval); this.typingInterval = null; }
        // idle when not typing
        SystemState.setBoost('typerscene', { cpu: [1, 4], ram: [1, 3] });
    }

    reset() {
        this.stop();
        this.pointer = 0;
        this.displayText = '';
        this.updateDisplay();
    }

    typeChunk() {
        const chunkSize = Utils.random(1, 3);
        const chunk = this.rawText.slice(this.pointer, this.pointer + chunkSize);
        this.displayText += chunk;
        this.pointer += chunkSize;
        this.updateDisplay();
    }

    updateDisplay() {
        const screen = document.getElementById('typer-screen');
        if (!screen) return;
        const highlighted = SyntaxHighlighter.highlight(this.displayText);
        screen.innerHTML = highlighted + '<span class="typer-cursor"></span>';
        screen.scrollTop = screen.scrollHeight;
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        this.rawText = CONFIG.typerscene.examples[lang] || '';
        this.reset();
    }
}

// ==================== SECRET OVERLAY ====================
function showSecretOverlay(className, html, duration = 4000) {
    const existing = document.querySelector('.secret-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = `secret-overlay ${className}`;
    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    const dismiss = () => {
        overlay.style.animation = 'overlayFadeOut 0.4s ease forwards';
        setTimeout(() => overlay.remove(), 400);
    };

    setTimeout(dismiss, duration);
    overlay.addEventListener('click', dismiss);
}

// ==================== SHORTCUT MANAGER ====================
// register(key, count, windowMs, callback)
// windowMs = all 'count' presses must happen within this many milliseconds
const ShortcutManager = {
    sequences: {},

    register(key, count, windowMs, callback) {
        const id = `${key}_${count}`;
        this.sequences[id] = { key: key.toLowerCase(), count, windowMs, callback, presses: [] };
    },

    handleKey(e) {
        // Ignore key-repeat events (e.g. holding Space)
        if (e.repeat) return;

        const now = Date.now();
        const lkey = e.key.toLowerCase();
        // Derive layout-independent key from e.code for letter keys
        // e.code: 'KeyZ' → 'z', 'KeyX' → 'x', etc. — works regardless of keyboard language
        const codeKey = (e.code && e.code.startsWith('Key'))
            ? e.code.slice(3).toLowerCase()
            : null;

        Object.values(this.sequences).forEach(seq => {
            if (seq.key !== lkey && seq.key !== codeKey) return;

            // Drop presses older than the allowed window
            seq.presses = seq.presses.filter(t => now - t < seq.windowMs);
            seq.presses.push(now);

            if (seq.presses.length >= seq.count) {
                // Verify the FIRST press of this batch is also within the window
                const oldest = seq.presses[seq.presses.length - seq.count];
                if (now - oldest < seq.windowMs) {
                    seq.presses = [];
                    seq.callback();
                }
            }
        });
    }
};

// --- Register all secret shortcuts ---
// windowMs is calculated automatically: count * MS_PER_PRESS
// MS_PER_PRESS = how many milliseconds each press is "allowed" to take
const MS_PER_PRESS = 500; // comfortable but intentional — adjust if needed
const w = (count) => count * MS_PER_PRESS;

ShortcutManager.register('control', 3, w(3), () => {
    showSecretOverlay('overlay-denied', `
        <div class="so-big-icon">🚫</div>
        <div class="so-title">ACCESS DENIED</div>
        <div class="so-sub">INSUFFICIENT CLEARANCE LEVEL</div>
        <div class="so-code">ERROR CODE: 403-OMEGA-7</div>
        <div class="so-code">THIS INCIDENT HAS BEEN LOGGED</div>
    `, 4000);
});

ShortcutManager.register('shift', 3, w(3), () => {
    showSecretOverlay('overlay-accepted', `
        <div class="so-big-icon">✅</div>
        <div class="so-title">ACCESS ACCEPTED</div>
        <div class="so-sub">WELCOME BACK, AGENT</div>
        <div class="so-code">CLEARANCE: LEVEL 5 — OMEGA BLACK</div>
        <div class="so-code">ALL SYSTEMS UNLOCKED</div>
    `, 4000);
});

ShortcutManager.register('alt', 3, w(3), () => {
    const overlay = document.createElement('div');
    overlay.className = 'secret-overlay overlay-destruct';
    let count = 5;
    overlay.innerHTML = `
        <div class="so-big-icon">☢️</div>
        <div class="so-title">SELF-DESTRUCT INITIATED</div>
        <div class="so-countdown" id="so-countdown">5</div>
        <div class="so-sub">ALL CLASSIFIED DATA WILL BE PURGED</div>
        <div class="so-code">PRESS ANYWHERE TO ABORT</div>
    `;
    document.body.appendChild(overlay);
    const cd = overlay.querySelector('#so-countdown');
    const interval = setInterval(() => {
        count--;
        cd.textContent = count;
        if (count <= 0) {
            clearInterval(interval);
            overlay.innerHTML = `
                <div class="so-big-icon">✋</div>
                <div class="so-title">SEQUENCE ABORTED</div>
                <div class="so-sub">FAILSAFE PROTOCOL ENGAGED</div>
                <div class="so-code">DATA INTEGRITY PRESERVED</div>
            `;
            setTimeout(() => overlay.remove(), 2500);
        }
    }, 1000);
    overlay.addEventListener('click', () => { clearInterval(interval); overlay.remove(); });
});

ShortcutManager.register('z', 3, w(3), () => {
    showSecretOverlay('overlay-encrypt', `
        <div class="so-big-icon">🔐</div>
        <div class="so-title">ENCRYPTING ALL FILES</div>
        <div class="so-sub">AES-256-GCM ENCRYPTION IN PROGRESS</div>
        <div class="so-enc-progress"><div class="so-enc-fill"></div></div>
        <div class="so-code">SECURING: /classified /financial /personal</div>
        <div class="so-code">DO NOT DISCONNECT</div>
    `, 5000);
});

ShortcutManager.register('x', 4, w(4), () => {
    showSecretOverlay('overlay-fbi', `
        <div class="so-fbi-badge">🏛️</div>
        <div class="so-fbi-label">FEDERAL BUREAU OF INVESTIGATION</div>
        <div class="so-title">⚠️ FBI MONITORING DETECTED ⚠️</div>
        <div class="so-sub">YOUR SESSION IS BEING TRACED</div>
        <div class="so-code">CASE NUMBER: 2024-CYB-774521-A</div>
        <div class="so-code">IP ADDRESS LOGGED — COUNTERMEASURES ACTIVE</div>
        <div class="so-code">BOUNCING THROUGH 47 PROXY NODES...</div>
    `, 5000);
});

ShortcutManager.register(' ', 5, w(5), () => {
    showSecretOverlay('overlay-satellite', `
        <div class="so-big-icon">🛰️</div>
        <div class="so-title">SATELLITE UPLINK ESTABLISHED</div>
        <div class="so-sub">KEYHOLE-19 ORBITAL PLATFORM CONNECTED</div>
        <div class="so-code">BANDWIDTH: 47.2 TB/s</div>
        <div class="so-code">LAT: 23.4°N | LONG: 54.7°E | ALT: 400km</div>
        <div class="so-code">ENCRYPTION: QUANTUM-SAFE LATTICE</div>
    `, 4000);
});

ShortcutManager.register('q', 3, w(3), () => {
    showSecretOverlay('overlay-trace', `
        <div class="so-big-icon">🌐</div>
        <div class="so-title">CONNECTION TRACE ACTIVE</div>
        <div class="so-sub">ROUTING THROUGH 47 ANONYMOUS NODES</div>
        <div class="so-trace-list">
            <div class="so-trace-hop">HOP 01: 10.0.0.1 → Moscow, RU [45ms]</div>
            <div class="so-trace-hop">HOP 02: 185.x.x.x → Tokyo, JP [132ms]</div>
            <div class="so-trace-hop">HOP 03: 103.x.x.x → São Paulo, BR [289ms]</div>
            <div class="so-trace-hop">HOP 04: 41.x.x.x → Lagos, NG [441ms]</div>
            <div class="so-trace-hop">HOP 47: [CLASSIFIED] → [CLASSIFIED]</div>
        </div>
        <div class="so-code">✓ IDENTITY PROTECTED — UNTRACEABLE</div>
    `, 6000);
});

ShortcutManager.register('capslock', 3, w(3), () => {
    showSecretOverlay('overlay-admin', `
        <div class="so-big-icon">👑</div>
        <div class="so-title">ADMIN OVERRIDE ACTIVATED</div>
        <div class="so-sub">ROOT ACCESS GRANTED — ALL PERMISSIONS UNLOCKED</div>
        <div class="so-code">$ sudo su — nexus_master</div>
        <div class="so-code">KERNEL: UNRESTRICTED MODE ENGAGED</div>
    `, 4000);
});

// ==================== TUTORIAL MANAGER ====================
class TutorialManager {
    constructor() {
        this.slides = [
            {
                icon: '🖥️',
                title: 'WELCOME, AGENT',
                subtitle: 'CYBER NEXUS OS v3.0 — CLASSIFIED BRIEFING',
                content: `You have gained access to the most advanced cyber operations platform.<br><br>
                This terminal simulates a fully operational hacking environment.<br>
                Use it to impress — or confuse — anyone looking over your shoulder.<br><br>
                <span class="tut-tip">⚡ TIP: All activity here is 100% fake. Stay calm and look busy.</span>`
            },
            {
                icon: '📱',
                title: 'CORE MODULES',
                subtitle: 'AVAILABLE APPLICATIONS',
                content: `<div class="tut-app-grid">
                    <div class="tut-app"><span>⌨️ TYPER</span> Code typing simulator</div>
                    <div class="tut-app"><span>⚡ NETWORK</span> Network topology map</div>
                    <div class="tut-app"><span>🎯 RADAR</span> Threat detection radar</div>
                    <div class="tut-app"><span>📊 STATS</span> Data analytics dashboard</div>
                    <div class="tut-app"><span>💻 SYSTEM</span> Resource monitor</div>
                    <div class="tut-app"><span>🔢 MATRIX</span> Matrix data stream</div>
                    <div class="tut-app"><span>🌍 GLOBE</span> Global tracking</div>
                    <div class="tut-app"><span>💻 TERMINAL</span> Command terminal</div>
                    <div class="tut-app"><span>🛡️ FIREWALL</span> Security visualization</div>
                </div>
                <span class="tut-tip">⚡ TIP: Use Alt+1 through Alt+9 to open apps with keyboard shortcuts.</span>`
            },
            {
                icon: '🔒',
                title: 'NEW CLASSIFIED MODULES',
                subtitle: 'ADVANCED OPERATIONS CENTER',
                content: `<div class="tut-new-apps">
                    <div class="tut-new-app">
                        <div class="tut-new-icon">📥</div>
                        <div class="tut-new-info">
                            <div class="tut-new-name">FILE EXFILTRATION</div>
                            <div class="tut-new-desc">Watch classified documents, databases, and credential files being "stolen" in real time with progress bars.</div>
                        </div>
                    </div>
                    <div class="tut-new-app">
                        <div class="tut-new-icon">☣️</div>
                        <div class="tut-new-info">
                            <div class="tut-new-name">PAYLOAD DEPLOYER</div>
                            <div class="tut-new-desc">Select malware payloads (ransomware, keylogger, rootkit) and deploy them to fake target systems.</div>
                        </div>
                    </div>
                    <div class="tut-new-app">
                        <div class="tut-new-icon">₿</div>
                        <div class="tut-new-info">
                            <div class="tut-new-name">CRYPTO MINER</div>
                            <div class="tut-new-desc">A running Bitcoin miner showing hashrate, temperature, and BTC accumulating in real time.</div>
                        </div>
                    </div>
                    <div class="tut-new-app">
                        <div class="tut-new-icon">🔓</div>
                        <div class="tut-new-info">
                            <div class="tut-new-name">PASSWORD BREACH</div>
                            <div class="tut-new-desc">Brute-force password cracker with dictionary and AI smart modes. Watch passwords get cracked live.</div>
                        </div>
                    </div>
                </div>`
            },
            {
                icon: '⚠️',
                title: 'CLASSIFIED: SECRET SHORTCUTS',
                subtitle: 'DO NOT SHARE THESE WITH ANYONE',
                content: `<div class="tut-shortcuts">
                    <div class="tut-shortcut"><span class="tut-keys">Ctrl × 3</span><span class="tut-effect denied">ACCESS DENIED — giant red screen</span></div>
                    <div class="tut-shortcut"><span class="tut-keys">Shift × 3</span><span class="tut-effect accepted">ACCESS ACCEPTED — green clearance screen</span></div>
                    <div class="tut-shortcut"><span class="tut-keys">Alt × 3</span><span class="tut-effect danger">SELF-DESTRUCT countdown (5 seconds)</span></div>
                    <div class="tut-shortcut"><span class="tut-keys">Z × 3</span><span class="tut-effect">ENCRYPTING ALL FILES animation</span></div>
                    <div class="tut-shortcut"><span class="tut-keys">X × 4</span><span class="tut-effect danger">FBI MONITORING DETECTED warning</span></div>
                    <div class="tut-shortcut"><span class="tut-keys">Space × 5</span><span class="tut-effect">SATELLITE UPLINK established</span></div>
                    <div class="tut-shortcut"><span class="tut-keys">Q × 3</span><span class="tut-effect">CONNECTION TRACE through 47 nodes</span></div>
                    <div class="tut-shortcut"><span class="tut-keys">Caps Lock × 3</span><span class="tut-effect accepted">ADMIN MODE OVERRIDE</span></div>
                </div>
                <span class="tut-tip">⚡ TIP: All shortcuts require rapid repeated presses — they look accidental.</span>`
            },
            {
                icon: '🚀',
                title: 'MISSION READY',
                subtitle: 'ALL SYSTEMS OPERATIONAL',
                content: `Everything is loaded and ready to deploy.<br><br>
                Open multiple windows at once for maximum effect.<br>
                The Matrix and Firewall apps run indefinitely in the background.<br><br>
                <div class="tut-final-tips">
                    <div class="tut-final-tip">📌 Drag windows anywhere on screen</div>
                    <div class="tut-final-tip">📌 Maximize any window for full-screen drama</div>
                    <div class="tut-final-tip">📌 Stack windows for a busy workstation look</div>
                    <div class="tut-final-tip">📌 Use Ctrl×3 when someone asks what you're doing</div>
                </div>
                <br><span class="tut-tip">Good luck, Agent. The mission begins now.</span>`
            }
        ];
        this.current = 0;
    }

    start() {
        if (localStorage.getItem('nexus_tutorial_seen')) return;
        this.show();
    }

    show() {
        const overlay = document.createElement('div');
        overlay.id = 'tutorial-overlay';
        overlay.className = 'tutorial-overlay';
        overlay.innerHTML = this._buildSlide(this.slides[0]);
        document.body.appendChild(overlay);
        this._attachNav(overlay);
    }

    _buildSlide(slide) {
        const total = this.slides.length;
        const current = this.current;
        return `
            <div class="tutorial-box">
                <div class="tutorial-scan-line"></div>
                <div class="tutorial-header">
                    <div class="tutorial-badge">CLASSIFIED BRIEFING</div>
                    <div class="tutorial-counter">${current + 1} / ${total}</div>
                </div>
                <div class="tutorial-icon">${slide.icon}</div>
                <div class="tutorial-title">${slide.title}</div>
                <div class="tutorial-subtitle">${slide.subtitle}</div>
                <div class="tutorial-content">${slide.content}</div>
                <div class="tutorial-progress">
                    ${this.slides.map((_, i) => `<div class="tutorial-dot ${i === current ? 'active' : i < current ? 'done' : ''}"></div>`).join('')}
                </div>
                <div class="tutorial-nav">
                    <button class="tut-btn secondary" id="tut-skip">SKIP</button>
                    ${current > 0 ? '<button class="tut-btn secondary" id="tut-prev">← PREV</button>' : '<div></div>'}
                    <button class="tut-btn primary" id="tut-next">
                        ${current === total - 1 ? 'BEGIN MISSION ▶' : 'NEXT →'}
                    </button>
                </div>
            </div>
        `;
    }

    _attachNav(overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target.id === 'tut-next') {
                if (this.current >= this.slides.length - 1) {
                    this._close(overlay);
                } else {
                    this.current++;
                    const box = overlay.querySelector('.tutorial-box');
                    box.style.animation = 'tutSlideOut 0.2s ease forwards';
                    setTimeout(() => {
                        overlay.innerHTML = this._buildSlide(this.slides[this.current]);
                        this._attachNav(overlay);
                    }, 200);
                }
            } else if (e.target.id === 'tut-prev' && this.current > 0) {
                this.current--;
                overlay.innerHTML = this._buildSlide(this.slides[this.current]);
                this._attachNav(overlay);
            } else if (e.target.id === 'tut-skip') {
                this._close(overlay);
            }
        });
    }

    _close(overlay) {
        overlay.style.animation = 'overlayFadeOut 0.4s ease forwards';
        setTimeout(() => overlay.remove(), 400);
        localStorage.setItem('nexus_tutorial_seen', '1');
    }
}


// ==================== SYSTEM STATE ====================
// Shared live state — read by System Monitor, written by Miner & window count
const SystemState = {
    cpu: 12, ram: 28, gpu: 5, network: 8, diskio: 10, bandwidth: 15,
    minerRunning: false,

    // throttle[resource] = 0..1 multiplier — 1 = full speed, 0 = stopped
    // apps read this to slow their intervals
    throttle: { cpu:1, ram:1, gpu:1, network:1, diskio:1, bandwidth:1 },

    // boosts: { appName: { resource: [min, max] } }
    _boosts: {},

    setBoost(appName, boost) { this._boosts[appName] = boost; },
    clearBoost(appName)      { delete this._boosts[appName]; },

    // Return randomized sum of all active boosts this tick
    _sumBoosts() {
        const sum = { cpu:0, ram:0, gpu:0, network:0, diskio:0, bandwidth:0 };
        Object.values(this._boosts).forEach(b => {
            for (const k of Object.keys(sum)) {
                if (!b[k]) continue;
                const v = b[k];
                sum[k] += Array.isArray(v)
                    ? v[0] + Math.random() * (v[1] - v[0])
                    : v;
            }
        });
        return sum;
    },

    // Returns a 0..1 speed multiplier for an app based on which resources it uses.
    // Pass the array of resource keys this app depends on.
    // The more saturated those resources, the lower the returned value.
    getThrottle(resources) {
        if (!resources || resources.length === 0) return 1;
        const worst = Math.min(...resources.map(r => this.throttle[r] ?? 1));
        return worst;
    },

    tick() {
        const openWindows = document.querySelectorAll('.window').length;
        const baseLoad = 6 + openWindows * 2;

        const drift = (val, base, variance, min, max) => {
            let next = val + (Math.random() - 0.48) * variance;
            next += (base - next) * 0.08;
            return Math.max(min, Math.min(max, next));
        };

        const b = this._sumBoosts();

        this.cpu       = drift(this.cpu,       baseLoad + b.cpu,            4, 2, 99);
        this.ram       = drift(this.ram,       baseLoad * 1.2 + b.ram,      3, 5, 99);
        this.gpu       = drift(this.gpu,       baseLoad * 0.5 + b.gpu,      5, 2, 99);
        this.network   = drift(this.network,   baseLoad * 0.6 + b.network,  6, 1, 99);
        this.diskio    = drift(this.diskio,    baseLoad * 0.3 + b.diskio,   4, 1, 99);
        this.bandwidth = drift(this.bandwidth, baseLoad * 0.5 + b.bandwidth,5, 1, 99);

        // Update throttle factors.
        // Below 85%: no slowdown. 85-99%: gradual. 99-100%: severe.
        const slowdown = (v) => {
            if (v < 85) return 1;
            if (v < 99) return 1 - (v - 85) / 14 * 0.6;   // 1.0 → 0.4
            return 0.15 + Math.random() * 0.1;              // 0.15-0.25 at max
        };
        for (const k of Object.keys(this.throttle)) {
            this.throttle[k] = slowdown(this[k]);
        }
    }
};
setInterval(() => SystemState.tick(), 1000);

// ==================== APP DEFINITIONS ====================
const APPS = {
    typerscene: {
        title: '⌨️ TYPERSCENE',
        render: (container) => {
            SystemState.setBoost('typerscene', { cpu: [10, 28], ram: [8, 20], diskio: [4, 14] });
            new TyperScene(container);
            const tsCleanup = container.cleanup;
            const glitchChars = '█▓▒░╬╪╩╦╠═╣║╗╔╝╚';
            // EFFECT: while typing, corrupt other windows' title text momentarily
            const glitchInterval = setInterval(() => {
                document.querySelectorAll('.window-title').forEach(title => {
                    if (title.closest('.window')?.contains(container)) return;
                    if (Math.random() > 0.3) return;
                    const orig = title.dataset.origTitle || title.textContent;
                    title.dataset.origTitle = orig;
                    const pos = Math.floor(Math.random() * orig.length);
                    const gc = glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    title.textContent = orig.slice(0, pos) + gc + orig.slice(pos + 1);
                    setTimeout(() => { title.textContent = title.dataset.origTitle; }, 180);
                });
            }, 500);
            container.cleanup = () => {
                SystemState.clearBoost('typerscene');
                clearInterval(glitchInterval);
                if (tsCleanup) tsCleanup();
            };
        }
    },

    network: {
        title: '⚡ NETWORK MAP',
        render: (container) => {
            container.className = 'network-map';
            const nodes = [
                { x: 50, y: 50 }, { x: 200, y: 100 }, { x: 350, y: 80 },
                { x: 150, y: 250 }, { x: 300, y: 300 }, { x: 450, y: 200 }
            ];
            nodes.forEach((pos, i) => {
                const node = Utils.createElement('div', 'network-node');
                node.style.left = pos.x + 'px';
                node.style.top = pos.y + 'px';
                node.style.animationDelay = (i * 0.2) + 's';
                node.innerHTML = '<svg width="30" height="30" fill="#000"><circle cx="15" cy="15" r="8"/></svg>';
                container.appendChild(node);
            });
            for (let i = 0; i < nodes.length - 1; i++) {
                const line = Utils.createElement('div', 'network-line');
                const dx = nodes[i + 1].x - nodes[i].x;
                const dy = nodes[i + 1].y - nodes[i].y;
                const length = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx) * 180 / Math.PI;
                line.style.width = length + 'px';
                line.style.left = nodes[i].x + 30 + 'px';
                line.style.top = nodes[i].y + 30 + 'px';
                line.style.transform = `rotate(${angle}deg)`;
                line.style.animationDelay = (i * 0.3) + 's';
                container.appendChild(line);
            }

            // EFFECT: draw SVG cables from THIS window to every other open window
            const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
            svg.id = 'network-cables';
            svg.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9995;';
            document.body.appendChild(svg);

            const updateCables = () => {
                svg.innerHTML = '';
                const src = container.closest('.window');
                if (!src) return;
                const sr = src.getBoundingClientRect();
                const sx = sr.left + sr.width / 2, sy = sr.top + sr.height / 2;
                document.querySelectorAll('.window').forEach(win => {
                    if (win === src) return;
                    const wr = win.getBoundingClientRect();
                    const tx = wr.left + wr.width / 2, ty = wr.top + wr.height / 2;
                    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
                    line.setAttribute('x1', sx); line.setAttribute('y1', sy);
                    line.setAttribute('x2', tx); line.setAttribute('y2', ty);
                    line.setAttribute('stroke', 'rgba(0,255,255,0.35)');
                    line.setAttribute('stroke-width', '1.5');
                    line.setAttribute('stroke-dasharray', '6,4');
                    line.setAttribute('class', 'net-cable-line');
                    svg.appendChild(line);
                    // animated packet dot
                    const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
                    circle.setAttribute('r','4');
                    circle.setAttribute('fill','#0ff');
                    circle.setAttribute('filter','url(#cable-glow)');
                    const anim = document.createElementNS('http://www.w3.org/2000/svg','animateMotion');
                    anim.setAttribute('dur', (1.5 + Math.random()*2) + 's');
                    anim.setAttribute('repeatCount','indefinite');
                    anim.setAttribute('path', `M${sx},${sy} L${tx},${ty}`);
                    circle.appendChild(anim);
                    svg.appendChild(circle);
                });
                // glow filter
                const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
                defs.innerHTML = `<filter id="cable-glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
                svg.prepend(defs);
            };
            updateCables();
            let cableDelay = 2000;
            const cableInterval = setInterval(() => {
                const t = SystemState.getThrottle(['network','bandwidth']);
                // fewer cable updates when network saturated
                if (Math.random() < t) updateCables();
            }, 2000);
            SystemState.setBoost('network', { network: [30, 60], bandwidth: [40, 70], cpu: [4, 14] });
            container.cleanup = () => { clearInterval(cableInterval); svg.remove(); SystemState.clearBoost('network'); };
        }
    },

    radar: {
        title: '🎯 THREAT RADAR',
        render: (container) => {
            container.className = 'radar-container';
            const radar = Utils.createElement('div', 'radar');
            radar.innerHTML = '<div class="radar-line"></div>';
            for (let i = 0; i < 8; i++) {
                const blip = Utils.createElement('div', 'radar-blip');
                const angle = Math.random() * 360;
                const distance = Math.random() * 180 + 20;
                blip.style.left = `calc(50% + ${Math.cos(angle) * distance}px)`;
                blip.style.top = `calc(50% + ${Math.sin(angle) * distance}px)`;
                blip.style.animationDelay = (i * 0.2) + 's';
                radar.appendChild(blip);
            }
            container.appendChild(radar);

            // EFFECT: global rotating sweep beam over entire screen
            const sweep = document.createElement('div');
            sweep.id = 'radar-global-sweep';
            sweep.style.cssText = `
                position:fixed; inset:0; pointer-events:none; z-index:9994;
                background: conic-gradient(from 0deg, transparent 340deg, rgba(0,255,0,0.12) 355deg, rgba(0,255,0,0.04) 360deg);
                animation: radarGlobalSpin 4s linear infinite;
            `;
            document.body.appendChild(sweep);

            // warning labels that appear on other windows when sweep passes over them
            let angle = 0;
            const scanInterval = setInterval(() => {
                angle = (angle + 15) % 360;
                if (angle % 90 < 15) {
                    document.querySelectorAll('.window').forEach(win => {
                        if (win.contains(container)) return;
                        const badge = document.createElement('div');
                        badge.className = 'radar-scan-badge';
                        badge.textContent = '◉ SCANNING...';
                        win.appendChild(badge);
                        setTimeout(() => badge.remove(), 900);
                    });
                }
            }, 200);
            SystemState.setBoost('radar', { network: [15, 40], cpu: [14, 32], gpu: [5, 18] });
            container.cleanup = () => { clearInterval(scanInterval); sweep.remove(); document.querySelectorAll('.radar-scan-badge').forEach(b=>b.remove()); SystemState.clearBoost('radar'); };
        }
    },

    stats: {
        title: '📊 DATA ANALYTICS',
        render: (container) => {
            container.className = 'chart-container';
            const chart = Utils.createElement('div', 'bar-chart');
            const heights = [45, 78, 62, 89, 55, 92, 67, 81];
            heights.forEach((h, i) => {
                const bar = Utils.createElement('div', 'bar');
                bar.style.height = h + '%';
                bar.style.animationDelay = (i * 0.1) + 's';
                chart.appendChild(bar);
            });
            container.appendChild(chart);

            // EFFECT: mini bar chart overlays pulse at bottom of other windows
            const statsInterval = setInterval(() => {
                document.querySelectorAll('.window').forEach(win => {
                    if (win.contains(container)) return;
                    if (win.querySelector('.stats-mini-overlay')) return;
                    const overlay = document.createElement('div');
                    overlay.className = 'stats-mini-overlay';
                    overlay.innerHTML = Array.from({length:8}, () =>
                        `<div style="height:${20+Math.random()*70}%;background:rgba(0,255,0,0.7)"></div>`
                    ).join('');
                    win.appendChild(overlay);
                    setTimeout(() => overlay.remove(), 1800);
                });
            }, 3000);
            SystemState.setBoost('stats', { cpu: [18, 42], ram: [15, 35], diskio: [8, 22] });
            container.cleanup = () => { clearInterval(statsInterval); document.querySelectorAll('.stats-mini-overlay').forEach(e=>e.remove()); SystemState.clearBoost('stats'); };
        }
    },

    monitor: {
        title: '💻 SYSTEM MONITOR',
        render: (container) => {
            SystemState.setBoost('monitor', { cpu: [2, 8], ram: [2, 7] });
            container.className = 'system-monitor';
            const metrics = [
                { key: 'cpu',       label: 'CPU'       },
                { key: 'ram',       label: 'RAM'       },
                { key: 'gpu',       label: 'GPU'       },
                { key: 'network',   label: 'NETWORK'   },
                { key: 'diskio',    label: 'DISK I/O'  },
                { key: 'bandwidth', label: 'BANDWIDTH' },
            ];

            metrics.forEach(m => {
                const row = Utils.createElement('div', 'monitor-row');
                row.innerHTML = `
                    <div class="monitor-label">${m.label}</div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="mon-fill-${m.key}" style="width:${Math.round(SystemState[m.key])}%"></div>
                    </div>
                    <div class="monitor-value" id="mon-val-${m.key}">${Math.round(SystemState[m.key])}%</div>
                `;
                container.appendChild(row);
            });

            // Throttle status row at bottom
            const throttleRow = Utils.createElement('div', 'monitor-throttle-row');
            throttleRow.id = 'mon-throttle';
            container.appendChild(throttleRow);

            const updateInterval = setInterval(() => {
                metrics.forEach(m => {
                    const v = Math.round(SystemState[m.key]);
                    const fill = document.getElementById('mon-fill-' + m.key);
                    const val  = document.getElementById('mon-val-'  + m.key);
                    if (fill) fill.style.width = v + '%';
                    if (val)  val.textContent  = v + '%';

                    if (fill) {
                        if (v >= 99) {
                            fill.style.background = 'var(--danger)';
                            fill.style.animation = 'throttleFlicker 0.3s ease infinite';
                        } else if (v > 80) {
                            fill.style.background = 'var(--danger)';
                            fill.style.animation = '';
                        } else if (v > 55) {
                            fill.style.background = 'var(--warning)';
                            fill.style.animation = '';
                        } else {
                            fill.style.background = 'var(--primary)';
                            fill.style.animation = '';
                        }
                    }
                });

                // Throttle status summary
                const tr = document.getElementById('mon-throttle');
                if (tr) {
                    const saturated = metrics.filter(m => SystemState[m.key] >= 95);
                    if (saturated.length > 0) {
                        tr.innerHTML = `⚠ THROTTLING: ${saturated.map(m => m.label).join(', ')} — APPS SLOWED`;
                        tr.style.color = 'var(--danger)';
                        tr.style.animation = 'throttleFlicker 0.5s ease infinite';
                    } else {
                        const high = metrics.filter(m => SystemState[m.key] >= 80);
                        if (high.length > 0) {
                            tr.innerHTML = `⚡ HIGH LOAD: ${high.map(m => m.label).join(', ')}`;
                            tr.style.color = 'var(--warning)';
                            tr.style.animation = '';
                        } else {
                            tr.innerHTML = '✓ ALL SYSTEMS NOMINAL';
                            tr.style.color = 'var(--primary)';
                            tr.style.animation = '';
                        }
                    }
                }
            }, 1000);

            // EFFECT: desktop background hue shifts based on CPU load
            const desktop = document.getElementById('desktop');
            const origBg = desktop.style.background || '';
            const bgInterval = setInterval(() => {
                const cpu = Math.round(SystemState.cpu);
                let color;
                if (cpu > 80)      color = `radial-gradient(circle at center, rgba(80,0,0,0.6) 0%, #000 120%)`;
                else if (cpu > 55) color = `radial-gradient(circle at center, rgba(50,40,0,0.5) 0%, #000 120%)`;
                else               color = `radial-gradient(circle at center, #1a2c1a 0%, #000 120%)`;
                desktop.style.background = color;
            }, 1200);
            container.cleanup = () => { clearInterval(updateInterval); clearInterval(bgInterval); desktop.style.background = origBg; };
        }
    },

    matrix: {
        title: '🔢 MATRIX STREAM',
        render: (container) => {
            container.className = 'matrix-display';
            SystemState.setBoost('matrix', { cpu: [20, 50], gpu: [30, 60], ram: [12, 28] });
            const chars = '01アイウエオカキクケコ';

            // Internal stream inside the window
            const internalInterval = setInterval(() => {
                const t = SystemState.getThrottle(['cpu','gpu']);
                if (Math.random() > t) return;   // drop frames when overloaded
                if (container.children.length > 100) return;
                const char = Utils.createElement('div', 'matrix-char');
                char.textContent = chars[Math.floor(Math.random() * chars.length)];
                char.style.left = Math.random() * 100 + '%';
                char.style.animationDuration = (Math.random() * 3 + 2) / Math.max(t, 0.15) + 's';
                container.appendChild(char);
                setTimeout(() => char.remove(), 5000);
            }, 200);

            // LEAK: spawn chars on the whole desktop, floating over all other windows
            const desktop = document.getElementById('desktop');
            let leakLayer = document.getElementById('matrix-leak-layer');
            if (!leakLayer) {
                leakLayer = document.createElement('div');
                leakLayer.id = 'matrix-leak-layer';
                leakLayer.style.cssText = `
                    position:fixed; inset:0; pointer-events:none;
                    z-index:9998; overflow:hidden;
                `;
                document.body.appendChild(leakLayer);
            }
            leakLayer._refCount = (leakLayer._refCount || 0) + 1;

            const leakInterval = setInterval(() => {
                const t = SystemState.getThrottle(['cpu','gpu']);
                if (Math.random() > t) return;
                if (leakLayer.children.length > 60) return;
                const ch = document.createElement('div');
                ch.textContent = chars[Math.floor(Math.random() * chars.length)];
                const dur = (2 + Math.random() * 4) / Math.max(t, 0.15);
                ch.style.cssText = `
                    position:absolute;
                    left:${Math.random() * 100}vw;
                    top:-20px;
                    color:rgba(0,255,0,${0.3 + t * 0.4});
                    font-family:var(--font-mono);
                    font-size:${10 + Math.random() * 14}px;
                    text-shadow:0 0 6px #0f0;
                    animation:matrixLeakFall ${dur}s linear forwards;
                    pointer-events:none;
                `;
                leakLayer.appendChild(ch);
                setTimeout(() => ch.remove(), 6000);
            }, 120);

            container.cleanup = () => {
                clearInterval(internalInterval);
                clearInterval(leakInterval);
                leakLayer._refCount--;
                if (leakLayer._refCount <= 0) leakLayer.remove();
                SystemState.clearBoost('matrix');
            };
        }
    },

    globe: {
        title: '🌍 GLOBAL TRACKING',
        render: (container) => {
            SystemState.setBoost('globe', { gpu: [40, 75], network: [20, 50], bandwidth: [18, 42] });
            container.cleanup = () => SystemState.clearBoost('globe');
            container.className = 'globe-container';
            const globe = Utils.createElement('div', 'globe');
            for (let i = 0; i < 5; i++) {
                const line = Utils.createElement('div', 'globe-line');
                line.style.top = (20 + i * 20) + '%';
                globe.appendChild(line);
            }
            for (let i = 0; i < 6; i++) {
                const marker = Utils.createElement('div', 'globe-marker');
                marker.style.left = Math.random() * 80 + 10 + '%';
                marker.style.top = Math.random() * 80 + 10 + '%';
                marker.style.animationDelay = (i * 0.3) + 's';
                globe.appendChild(marker);
            }
            container.appendChild(globe);

            // EFFECT: floating coordinate/IP tags drift across desktop
            const cities = ['MOSCOW','BEIJING','TOKYO','LONDON','DUBAI','BERLIN','SYDNEY','CAIRO','PARIS','SEOUL'];
            const globeInterval = setInterval(() => {
                const tag = document.createElement('div');
                const lat = (Math.random()*170-85).toFixed(2);
                const lon = (Math.random()*360-180).toFixed(2);
                const city = cities[Math.floor(Math.random()*cities.length)];
                const ip = `${Utils.random(1,254)}.${Utils.random(0,255)}.${Utils.random(0,255)}.${Utils.random(1,254)}`;
                tag.className = 'globe-float-tag';
                tag.innerHTML = `📍 ${city} [${lat}°, ${lon}°] — ${ip}`;
                tag.style.cssText = `
                    position:fixed;
                    left:${Math.random()*75+5}vw;
                    top:${Math.random()*70+5}vh;
                    color:rgba(0,255,255,0.75);
                    font-family:var(--font-mono);font-size:11px;
                    text-shadow:0 0 8px #0ff;
                    pointer-events:none;z-index:9993;
                    animation:globeTagFade 3s ease forwards;
                    white-space:nowrap;
                `;
                document.body.appendChild(tag);
                setTimeout(() => tag.remove(), 3000);
            }, 1000);
            container.cleanup = () => { clearInterval(globeInterval); document.querySelectorAll('.globe-float-tag').forEach(t=>t.remove()); };
        }
    },

    terminal: {
        title: '💻 TERMINAL',
        render: (container) => {
            SystemState.setBoost('terminal', { cpu: [5, 16], diskio: [15, 38], ram: [4, 14] });
            container.className = 'terminal-container';
            const content = Utils.createElement('div', 'terminal-content');
            content.id = 'terminal-content';
            container.appendChild(content);
            const code = `$ sudo systemctl start cyber-nexus\n[OK] Starting Cyber Nexus System...\n[OK] Loaded kernel modules\n[OK] Network interface initialized\n[OK] Security protocols active\n\n$ cat /proc/sys/net\nIPv4: 192.168.1.100\nIPv6: fe80::1\nGateway: 192.168.1.1\nDNS: 8.8.8.8\n\n$ ps aux | grep cyber\nroot  1234  0.5  2.1  System Core\nroot  1235  0.3  1.8  Network Monitor\nroot  1236  0.1  0.9  Security Daemon\n\n$ █`;
            let index = 0;
            const typeInterval = setInterval(() => {
                const t = SystemState.getThrottle(['diskio','cpu']);
                if (index < code.length && Math.random() < t) {
                    content.textContent += code[index]; index++;
                    container.scrollTop = container.scrollHeight;
                } else if (index >= code.length) {
                    clearInterval(typeInterval);
                    // typing done — drop to near-idle
                    SystemState.setBoost('terminal', { cpu: [1, 3], diskio: [1, 4] });
                }
            }, 30);
            // EFFECT: ghost commands flicker on desktop background
            const termCmds = ["$ ssh root@10.0.0.1 -p 22", "$ nmap -sV --script vuln 192.168.1.0/24", "$ cat /etc/shadow", "$ sudo rm -rf /var/log/*", "$ tcpdump -i eth0 port 443", "$ netstat -tulpn | grep LISTEN", "$ curl -s https://api.darkweb.onion/data", "$ ./exploit.py --target 10.0.0.5 --payload shell", "$ openssl genrsa -out private.pem 4096", "$ iptables -F && iptables -X"];
            const desktopEl = document.getElementById('desktop');
            const ghostInterval = setInterval(() => {
                if (Math.random() > 0.5) return;
                const ghost = document.createElement('div');
                ghost.className = 'terminal-ghost-cmd';
                ghost.textContent = termCmds[Math.floor(Math.random()*termCmds.length)];
                ghost.style.cssText = `
                    position:absolute;
                    left:${Math.random()*70+5}%;
                    top:${Math.random()*75+5}%;
                    color:rgba(0,255,0,0.2);
                    font-family:var(--font-mono);font-size:12px;
                    pointer-events:none;z-index:1;
                    animation:termGhostFade 2.5s ease forwards;
                    white-space:nowrap;
                `;
                desktopEl.appendChild(ghost);
                setTimeout(() => ghost.remove(), 2500);
            }, 900);
            container.cleanup = () => { clearInterval(typeInterval); clearInterval(ghostInterval); document.querySelectorAll('.terminal-ghost-cmd').forEach(e=>e.remove()); };
        }
    },

    firewall: {
        title: '🛡️ FIREWALL STATUS',
        render: (container) => {
            SystemState.setBoost('firewall', { network: [30, 68], cpu: [18, 48], bandwidth: [25, 55] });
            container.className = 'firewall-viz';
            for (let i = 0; i < 5; i++) {
                const layer = Utils.createElement('div', 'firewall-layer');
                layer.style.animationDelay = (i * 0.6) + 's';
                container.appendChild(layer);
            }

            let attackCount = 0;
            const particleInterval = setInterval(() => {
                const t = SystemState.getThrottle(['network','cpu']);
                // when network saturated, MORE attacks flood through (inverse throttle for visual drama)
                const floodFactor = 2 - t;  // 1 at normal, up to 2 when maxed
                if (Math.random() > 0.4 * floodFactor) return;
                if (container.querySelectorAll('.attack-particle').length > 30) return;
                const particle = Utils.createElement('div', 'attack-particle');
                particle.style.top = Math.random() * 100 + '%';
                // saturated network = slower, more sluggish particles
                particle.style.animationDuration = ((Math.random() * 2 + 1) / Math.max(t, 0.2)) + 's';
                container.appendChild(particle);
                setTimeout(() => particle.remove(), 3000);

                attackCount++;
                // Every ~8 particles = a "wave attack" — shake all OTHER windows
                if (attackCount % 8 === 0) {
                    document.querySelectorAll('.window').forEach(win => {
                        if (win.contains(container)) return; // skip firewall window itself
                        win.classList.add('firewall-shake');
                        setTimeout(() => win.classList.remove('firewall-shake'), 500);
                    });
                    // Flash the desktop red briefly
                    const flash = document.createElement('div');
                    flash.style.cssText = `
                        position:fixed;inset:0;background:rgba(255,0,0,0.08);
                        pointer-events:none;z-index:9997;animation:firewallFlash 0.4s ease forwards;
                    `;
                    document.body.appendChild(flash);
                    setTimeout(() => flash.remove(), 400);
                }
            }, 500);
            container.cleanup = () => {
                clearInterval(particleInterval);
                SystemState.clearBoost('firewall');
            };
        }
    },

    // ==================== NEW: FILE EXFILTRATION ====================
    downloader: {
        title: '📥 FILE EXFILTRATION',
        render: (container) => {
            // idle: listing files, no transfer yet
            SystemState.setBoost('downloader', { network: [1, 5], cpu: [1, 3] });
            let activeTransfers = 0;
            container.className = 'downloader-container';
            const files = [
                { name: 'classified_docs_2024.zip', size: '847 MB', type: 'CLASSIFIED' },
                { name: 'employee_passwords.db', size: '23 MB', type: 'CREDENTIALS' },
                { name: 'financial_records_Q4.xlsx', size: '156 MB', type: 'FINANCIAL' },
                { name: 'surveillance_footage.tar', size: '2.3 GB', type: 'SURVEILLANCE' },
                { name: 'source_code_backup.git', size: '412 MB', type: 'SOURCE' },
                { name: 'private_keys.pem', size: '4 KB', type: 'CRYPTO' },
                { name: 'admin_credentials.txt', size: '12 KB', type: 'ACCESS' },
                { name: 'client_database.sql', size: '1.2 GB', type: 'DATABASE' },
            ];

            container.innerHTML = `
                <div class="dl-header">
                    <div class="dl-status-dot"></div>
                    <div class="dl-status-text">EXFILTRATION IN PROGRESS</div>
                    <div class="dl-speed">SPEED: <span id="dl-speed">-- MB/s</span></div>
                    <div class="dl-total">TOTAL: 5.1 GB</div>
                </div>
                <div class="dl-files" id="dl-files"></div>
                <div class="dl-log" id="dl-log"></div>
            `;

            const filesList = container.querySelector('#dl-files');
            const log = container.querySelector('#dl-log');
            const speedEl = container.querySelector('#dl-speed');

            const speedInterval = setInterval(() => {
                const t = SystemState.getThrottle(['bandwidth','network']);
                speedEl.textContent = ((Math.random() * 50 + 10) * t).toFixed(1) + ' MB/s';
                speedEl.style.color = t < 0.5 ? 'var(--danger)' : t < 0.8 ? 'var(--warning)' : '';
            }, 800);
            // EFFECT: thin "scanning" bar crawls across top of each other window
            const scanBars = new Map();
            const dlScanInterval = setInterval(() => {
                document.querySelectorAll('.window').forEach(win => {
                    if (win.contains(container)) return;
                    if (scanBars.has(win)) return;
                    const bar = document.createElement('div');
                    bar.className = 'dl-scan-bar';
                    win.appendChild(bar);
                    scanBars.set(win, bar);
                    setTimeout(() => { bar.remove(); scanBars.delete(win); }, 3500);
                });
            }, 2500);
            container.cleanup = () => {
                clearInterval(speedInterval); clearInterval(dlScanInterval);
                document.querySelectorAll('.dl-scan-bar').forEach(b=>b.remove());
                SystemState.clearBoost('downloader');
            };

            files.forEach((file, i) => {
                setTimeout(() => {
                    activeTransfers++;
                    // scale boost with number of simultaneous transfers
                    const perFile = { bandwidth: [6, 12], network: [5, 11], diskio: [4, 9], cpu: [1, 3] };
                    const scale = (v) => [v[0] * activeTransfers, v[1] * activeTransfers];
                    SystemState.setBoost('downloader', {
                        bandwidth: scale(perFile.bandwidth),
                        network:   scale(perFile.network),
                        diskio:    scale(perFile.diskio),
                        cpu:       scale(perFile.cpu),
                    });
                    const row = document.createElement('div');
                    row.className = 'dl-file-row';
                    const typeClass = file.type.toLowerCase().replace(' ', '-');
                    row.innerHTML = `
                        <div class="dl-file-info">
                            <span class="dl-file-type ${typeClass}">[${file.type}]</span>
                            <span class="dl-file-name">${file.name}</span>
                            <span class="dl-file-size">${file.size}</span>
                        </div>
                        <div class="dl-progress-wrap">
                            <div class="dl-progress-bar"><div class="dl-progress-fill" id="dlf-${i}"></div></div>
                            <span class="dl-pct" id="dlp-${i}">0%</span>
                        </div>
                        <div class="dl-file-status" id="dls-${i}">DOWNLOADING...</div>
                    `;
                    filesList.appendChild(row);

                    let progress = 0;
                    const fill = row.querySelector(`#dlf-${i}`);
                    const pct = row.querySelector(`#dlp-${i}`);
                    const status = row.querySelector(`#dls-${i}`);

                    const dlInterval = setInterval(() => {
                        const t = SystemState.getThrottle(['bandwidth','network']);
                        progress += (Math.random() * 6 + 2) * t;
                        if (progress >= 100) {
                            progress = 100;
                            fill.style.width = '100%';
                            pct.textContent = '100%';
                            status.textContent = '✓ COMPLETE';
                            status.style.color = 'var(--primary)';
                            clearInterval(dlInterval);
                            activeTransfers = Math.max(0, activeTransfers - 1);
                            if (activeTransfers === 0) {
                                SystemState.setBoost('downloader', { network: [1, 5], cpu: [1, 3] });
                            } else {
                                const perFile2 = { bandwidth: [6, 12], network: [5, 11], diskio: [4, 9], cpu: [1, 3] };
                                const scale2 = (v) => [v[0] * activeTransfers, v[1] * activeTransfers];
                                SystemState.setBoost('downloader', {
                                    bandwidth: scale2(perFile2.bandwidth), network: scale2(perFile2.network),
                                    diskio: scale2(perFile2.diskio), cpu: scale2(perFile2.cpu),
                                });
                            }

                            const entry = document.createElement('div');
                            entry.className = 'dl-log-entry';
                            entry.textContent = `[${new Date().toLocaleTimeString()}] EXFILTRATED: ${file.name}`;
                            log.prepend(entry);
                        } else {
                            fill.style.width = progress + '%';
                            pct.textContent = Math.floor(progress) + '%';
                        }
                    }, 150);
                }, i * 1800);
            });
        }
    },

    // ==================== NEW: PAYLOAD DEPLOYER ====================
    malware: {
        title: '☣️ PAYLOAD DEPLOYER',
        render: (container) => {
            // idle: scanning targets in background
            SystemState.setBoost('malware', { network: [2, 8], cpu: [1, 4] });
            container.className = 'malware-container';
            const payloads = [
                { name: 'Ransomware.v4.exe', type: 'RANSOMWARE', power: 95, color: '#f00' },
                { name: 'KeyLogger.dll', type: 'KEYLOGGER', power: 72, color: '#ff0' },
                { name: 'RootKit.sys', type: 'ROOTKIT', power: 88, color: '#f80' },
                { name: 'BotNet.v2.jar', type: 'BOTNET', power: 63, color: '#f0f' },
                { name: 'ZeroDay.bin', type: 'ZERO-DAY', power: 99, color: '#0ff' },
            ];

            const targetIPs = Array.from({ length: 8 }, () =>
                `${Utils.random(10, 192)}.${Utils.random(0, 255)}.${Utils.random(0, 255)}.${Utils.random(1, 254)}`
            );

            container.innerHTML = `
                <div class="mw-layout">
                    <div class="mw-panel">
                        <div class="mw-panel-title">① SELECT PAYLOAD</div>
                        <div class="mw-payloads" id="mw-payloads"></div>
                    </div>
                    <div class="mw-panel">
                        <div class="mw-panel-title">② TARGET SYSTEMS</div>
                        <div class="mw-targets" id="mw-targets"></div>
                    </div>
                </div>
                <button class="mw-deploy-btn" id="mw-deploy">⚡ DEPLOY PAYLOAD</button>
                <div class="mw-log" id="mw-log"></div>
            `;

            const payloadsList = container.querySelector('#mw-payloads');
            const targetsList = container.querySelector('#mw-targets');
            const deployBtn = container.querySelector('#mw-deploy');
            const log = container.querySelector('#mw-log');
            let selectedPayload = null;

            payloads.forEach(p => {
                const el = document.createElement('div');
                el.className = 'mw-payload-item';
                el.innerHTML = `
                    <div class="mw-payload-header">
                        <span class="mw-payload-name">${p.name}</span>
                        <span class="mw-payload-badge" style="color:${p.color}">[${p.type}]</span>
                    </div>
                    <div class="mw-power-wrap">
                        <div class="mw-power-bar"><div class="mw-power-fill" style="width:${p.power}%;background:${p.color}"></div></div>
                        <span class="mw-power-val">${p.power}%</span>
                    </div>
                `;
                el.addEventListener('click', () => {
                    container.querySelectorAll('.mw-payload-item').forEach(x => x.classList.remove('selected'));
                    el.classList.add('selected');
                    selectedPayload = p;
                });
                payloadsList.appendChild(el);
            });

            targetIPs.forEach(ip => {
                const el = document.createElement('div');
                el.className = 'mw-target-item';
                el.innerHTML = `
                    <span class="mw-target-ip">${ip}</span>
                    <span class="mw-target-os">${['WIN', 'LIN', 'OSX'][Utils.random(0,2)]}</span>
                    <span class="mw-target-status" style="color:#ff0">VULNERABLE</span>
                `;
                targetsList.appendChild(el);
            });

            deployBtn.addEventListener('click', () => {
                // spike during active deployment, return to idle scan after
                SystemState.setBoost('malware', { cpu: [45, 82], ram: [30, 58], network: [50, 85] });
                setTimeout(() => SystemState.setBoost('malware', { network: [2, 8], cpu: [1, 4] }), 8000);
                if (!selectedPayload) {
                    const e = document.createElement('div');
                    e.className = 'mw-log-entry error';
                    e.textContent = `[ERROR] No payload selected. Choose a payload first.`;
                    log.prepend(e);
                    return;
                }
                const targets = targetsList.querySelectorAll('.mw-target-item');
                let delay = 0;
                targets.forEach(t => {
                    setTimeout(() => {
                        const ip = t.querySelector('.mw-target-ip').textContent;
                        const s = t.querySelector('.mw-target-status');
                        s.textContent = 'INFECTED ✓';
                        s.style.color = '#f00';

                        const e = document.createElement('div');
                        e.className = 'mw-log-entry';
                        e.innerHTML = `<span class="mw-log-time">[${new Date().toLocaleTimeString()}]</span> ${selectedPayload.name} → ${ip} <span style="color:#0f0">SUCCESS</span>`;
                        log.prepend(e);
                    }, delay);
                    delay += Utils.random(300, 700);
                });
            });

            // EFFECT: while deployed, other windows glitch with chromatic aberration
            let glitchActive = false;
            deployBtn.addEventListener('click', () => {
                if (glitchActive) return;
                glitchActive = true;
                document.querySelectorAll('.window').forEach(win => {
                    if (win.contains(container)) return;
                    win.classList.add('malware-glitch');
                    setTimeout(() => win.classList.remove('malware-glitch'), 4000);
                });
                setTimeout(() => { glitchActive = false; }, 5000);
            });
            container.cleanup = () => {
                document.querySelectorAll('.malware-glitch').forEach(w=>w.classList.remove('malware-glitch'));
                SystemState.clearBoost('malware');
            };
        }
    },

    // ==================== NEW: CRYPTO MINER ====================
    miner: {
        title: '₿ CRYPTO MINER',
        render: (container) => {
            container.className = 'miner-container';
            // idle: only pool connection overhead
            SystemState.setBoost('miner', { network: [1, 4], cpu: [1, 3] });
            let btcMined = 0, running = false, intervals = [];

            container.innerHTML = `
                <div class="miner-stats-row">
                    <div class="miner-stat-box">
                        <div class="miner-stat-label">HASHRATE</div>
                        <div class="miner-stat-value" id="mn-hashrate">0.00 MH/s</div>
                    </div>
                    <div class="miner-stat-box btc-box">
                        <div class="miner-stat-label">BTC MINED</div>
                        <div class="miner-stat-value btc-val" id="mn-btc">0.00000000</div>
                    </div>
                    <div class="miner-stat-box">
                        <div class="miner-stat-label">SHARES</div>
                        <div class="miner-stat-value" id="mn-shares">0 / 0</div>
                    </div>
                    <div class="miner-stat-box">
                        <div class="miner-stat-label">POOL STATUS</div>
                        <div class="miner-stat-value pool-ok" id="mn-pool">CONNECTED</div>
                    </div>
                </div>
                <div class="miner-hash-display" id="mn-hash">-- PRESS START TO BEGIN MINING --</div>
                <div class="miner-gpu-row">
                    <span class="miner-gpu-label">GPU</span>
                    <div class="miner-gpu-bar"><div class="miner-gpu-fill" id="mn-gpu" style="width:0%"></div></div>
                    <span class="miner-gpu-temp" id="mn-temp">--°C</span>
                    <span class="miner-gpu-label">CPU</span>
                    <div class="miner-gpu-bar"><div class="miner-gpu-fill cpu-fill" id="mn-cpu" style="width:0%"></div></div>
                    <span class="miner-gpu-temp" id="mn-ctemp">--°C</span>
                </div>
                <div class="miner-controls">
                    <button class="miner-btn start-btn" id="mn-start">▶ START MINING</button>
                    <button class="miner-btn stop-btn" id="mn-stop">⏸ PAUSE</button>
                </div>
                <div class="miner-log" id="mn-log"></div>
            `;

            const els = {
                hashrate: container.querySelector('#mn-hashrate'),
                btc: container.querySelector('#mn-btc'),
                shares: container.querySelector('#mn-shares'),
                hash: container.querySelector('#mn-hash'),
                gpu: container.querySelector('#mn-gpu'),
                cpu: container.querySelector('#mn-cpu'),
                temp: container.querySelector('#mn-temp'),
                ctemp: container.querySelector('#mn-ctemp'),
                log: container.querySelector('#mn-log')
            };

            let accepted = 0, rejected = 0;

            const addLog = (msg) => {
                const e = document.createElement('div');
                e.className = 'miner-log-entry';
                e.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
                els.log.prepend(e);
                if (els.log.children.length > 20) els.log.lastChild.remove();
            };

            const startMining = () => {
                running = true;
                SystemState.minerRunning = true;
                SystemState.setBoost('miner', { cpu: [40, 68], gpu: [55, 82], ram: [16, 34], bandwidth: [8, 22] });
                // Visual effect: tint clock & taskbar red while mining
                const clock = document.getElementById('clock');
                const taskbar = document.querySelector('.taskbar');
                if (clock) clock.classList.add('miner-active-clock');
                if (taskbar) taskbar.classList.add('miner-active-taskbar');
                addLog('Mining started — connecting to pool.bitcoin.org:3333');
                addLog('Worker: nexus_agent_01 authenticated');

                const hashInterval = setInterval(() => {
                    if (!running) return;
                    const t = SystemState.getThrottle(['cpu','gpu']);
                    if (Math.random() > t) {
                        // show corrupted/stuck hash when throttled
                        const stuck = els.hash.textContent;
                        if (stuck.length === 64) {
                            const pos = Math.floor(Math.random()*64);
                            els.hash.textContent = stuck.slice(0,pos)+'?'+stuck.slice(pos+1);
                        }
                        return;
                    }
                    const h = Array.from({length: 64}, () => '0123456789abcdef'[Math.floor(Math.random()*16)]).join('');
                    els.hash.textContent = h;
                }, 80);

                const statsInterval = setInterval(() => {
                    if (!running) return;
                    const t = SystemState.getThrottle(['cpu','gpu']);
                    const hr = ((150 + Math.random() * 100) * t).toFixed(2);
                    els.hashrate.textContent = hr + ' MH/s';
                    els.hashrate.style.color = t < 0.5 ? 'var(--danger)' : t < 0.8 ? 'var(--warning)' : 'var(--primary)';
                    btcMined += (0.00000003 + Math.random() * 0.00000004) * t;
                    els.btc.textContent = btcMined.toFixed(8);
                    if (Math.random() > 0.25) { accepted++; addLog(`Share accepted! (#${accepted})`); }
                    else rejected++;
                    els.shares.textContent = `${accepted} / ${rejected}`;
                    // sync GPU/CPU values from SystemState (which is boosted while miner runs)
                    const gpuPct = Math.round(SystemState.gpu);
                    const cpuPct = Math.round(SystemState.cpu);
                    els.gpu.style.width = gpuPct + '%';
                    els.cpu.style.width = cpuPct + '%';
                    els.temp.textContent  = (55 + gpuPct * 0.45).toFixed(0) + '°C';
                    els.ctemp.textContent = (40 + cpuPct * 0.35).toFixed(0) + '°C';
                }, 1200);

                intervals = [hashInterval, statsInterval];
            };

            container.querySelector('#mn-start').addEventListener('click', () => { if (!running) startMining(); });
            container.querySelector('#mn-stop').addEventListener('click', () => {
                running = false;
                SystemState.minerRunning = false;
                SystemState.clearBoost('miner');
                intervals.forEach(clearInterval);
                els.hash.textContent = '-- MINING PAUSED --';
                els.gpu.style.width = '5%';
                els.cpu.style.width = '5%';
                const clock2 = document.getElementById('clock');
                const taskbar2 = document.querySelector('.taskbar');
                if (clock2) clock2.classList.remove('miner-active-clock');
                if (taskbar2) taskbar2.classList.remove('miner-active-taskbar');
                addLog('Mining paused by user');
            });

            container.cleanup = () => {
                running = false; SystemState.minerRunning = false;
                SystemState.clearBoost('miner');
                intervals.forEach(clearInterval);
                const clock3 = document.getElementById('clock');
                const taskbar3 = document.querySelector('.taskbar');
                if (clock3) clock3.classList.remove('miner-active-clock');
                if (taskbar3) taskbar3.classList.remove('miner-active-taskbar');
            };
            startMining();
        }
    },

    // ==================== NEW: PASSWORD CRACKER ====================
    cracker: {
        title: '🔓 PASSWORD BREACH',
        render: (container) => {
            SystemState.setBoost('cracker', { cpu: [5, 15], ram: [4, 12] });
            container.cleanup = () => SystemState.clearBoost('cracker');
            container.className = 'cracker-container';
            const crackedUsers = [
                { user: 'admin', pass: 'Admin@2024!' },
                { user: 'root', pass: 'r00tP@ss' },
                { user: 'john.doe', pass: 'Qwerty123' },
                { user: 'administrator', pass: 'P@ssw0rd1' },
                { user: 'sysadmin', pass: 'S3cur3!ty' },
                { user: 'dbadmin', pass: 'Database#99' },
            ];

            container.innerHTML = `
                <div class="cr-header">
                    <div class="cr-target-info">
                        <span class="cr-label">TARGET:</span>
                        <span class="cr-value">10.0.0.1:22 (SSH)</span>
                        <span class="cr-label">OS:</span>
                        <span class="cr-value">Ubuntu 22.04 LTS</span>
                    </div>
                    <div class="cr-modes">
                        <button class="cr-mode active" data-mode="dict">DICTIONARY</button>
                        <button class="cr-mode" data-mode="brute">BRUTE FORCE</button>
                        <button class="cr-mode" data-mode="ai">AI SMART</button>
                    </div>
                </div>
                <div class="cr-attempt-section">
                    <div class="cr-attempt-label">CURRENT ATTEMPT</div>
                    <div class="cr-attempt-val" id="cr-attempt">— READY —</div>
                    <div class="cr-progress-wrap">
                        <div class="cr-prog-bar"><div class="cr-prog-fill" id="cr-fill"></div></div>
                        <span class="cr-prog-pct" id="cr-pct">0%</span>
                    </div>
                    <div class="cr-live-stats">
                        <span>ATTEMPTS: <strong id="cr-attempts">0</strong></span>
                        <span>SPEED: <strong id="cr-speed">0/s</strong></span>
                        <span>ETA: <strong id="cr-eta">--:--</strong></span>
                        <span>STATUS: <strong id="cr-status" style="color:#ff0">IDLE</strong></span>
                    </div>
                </div>
                <button class="cr-start-btn" id="cr-start">⚡ INITIATE BREACH</button>
                <div class="cr-results-label">CRACKED CREDENTIALS</div>
                <div class="cr-results" id="cr-results"></div>
            `;

            container.querySelectorAll('.cr-mode').forEach(btn => {
                btn.addEventListener('click', () => {
                    container.querySelectorAll('.cr-mode').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });

            let cracking = false, interval;
            const attemptEl = container.querySelector('#cr-attempt');
            const fillEl = container.querySelector('#cr-fill');
            const pctEl = container.querySelector('#cr-pct');
            const attemptsEl = container.querySelector('#cr-attempts');
            const speedEl = container.querySelector('#cr-speed');
            const etaEl = container.querySelector('#cr-eta');
            const statusEl = container.querySelector('#cr-status');
            const results = container.querySelector('#cr-results');
            const startBtn = container.querySelector('#cr-start');

            // EFFECT: floating password attempts drift across whole screen
            let crackerFloatInterval = null;
            startBtn.addEventListener('click', () => {
                if (cracking) return;
                cracking = true;
                SystemState.setBoost('cracker', { cpu: [60, 92], ram: [28, 52], diskio: [10, 30] });
                const floatChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
                crackerFloatInterval = setInterval(() => {
                    const len = Utils.random(6,14);
                    const word = Array.from({length:len}, () => floatChars[Math.floor(Math.random()*floatChars.length)]).join('');
                    const tag = document.createElement('div');
                    tag.textContent = word;
                    tag.style.cssText = `
                        position:fixed;
                        left:${Math.random()*90}vw;
                        top:${Math.random()*85}vh;
                        color:rgba(255,200,0,0.45);
                        font-family:var(--font-mono);font-size:13px;
                        pointer-events:none;z-index:9992;
                        animation:crackerWordFade 1.4s ease forwards;
                        white-space:nowrap;
                    `;
                    document.body.appendChild(tag);
                    setTimeout(() => tag.remove(), 1400);
                }, 120);
                startBtn.textContent = '⏳ BREACHING...';
                startBtn.style.background = 'rgba(255,200,0,0.15)';
                statusEl.textContent = 'ACTIVE';
                statusEl.style.color = '#ff0';

                let progress = 0, attempts = 0, userIndex = 0;
                const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';

                interval = setInterval(() => {
                    const t = SystemState.getThrottle(['cpu','ram']);
                    const attIncrement = Math.round(Utils.random(60, 180) * t);
                    attempts += attIncrement;
                    progress += Math.random() * 1.5 * t;

                    const len = Utils.random(6, 14);
                    attemptEl.textContent = Array.from({length: len}, () => chars[Math.floor(Math.random() * chars.length)]).join('');

                    attemptsEl.textContent = attempts.toLocaleString();
                    speedEl.textContent = Math.round(Utils.random(900, 1400) * t) + '/s';
                    speedEl.style.color = t < 0.5 ? 'var(--danger)' : t < 0.8 ? 'var(--warning)' : '';

                    const remaining = Math.max(0, 100 - progress);
                    const eta = Math.floor(remaining * 0.4);
                    etaEl.textContent = `${String(Math.floor(eta/60)).padStart(2,'0')}:${String(eta%60).padStart(2,'0')}`;

                    const p = Math.min(progress, 100);
                    fillEl.style.width = p + '%';
                    pctEl.textContent = Math.floor(p) + '%';

                    if (progress > 16 * (userIndex + 1) && userIndex < crackedUsers.length) {
                        const cred = crackedUsers[userIndex];
                        const r = document.createElement('div');
                        r.className = 'cr-result-item';
                        r.innerHTML = `
                            <span class="cr-result-icon">🔓</span>
                            <span class="cr-result-user">${cred.user}</span>
                            <span class="cr-result-sep">:</span>
                            <span class="cr-result-pass">${cred.pass}</span>
                        `;
                        results.prepend(r);
                        userIndex++;
                    }

                    if (progress >= 100) {
                        clearInterval(interval);
                        if (crackerFloatInterval) { clearInterval(crackerFloatInterval); crackerFloatInterval = null; }
                        cracking = false;
                        SystemState.setBoost('cracker', { cpu: [5, 15], ram: [4, 12] });
                        attemptEl.textContent = '✓ BREACH COMPLETE';
                        attemptEl.style.color = 'var(--primary)';
                        startBtn.textContent = '✓ BREACH COMPLETE';
                        startBtn.style.background = 'rgba(0,255,0,0.15)';
                        statusEl.textContent = 'DONE';
                        statusEl.style.color = 'var(--primary)';
                    }
                }, 100);

                container.cleanup = () => { clearInterval(interval); if (crackerFloatInterval) clearInterval(crackerFloatInterval); document.querySelectorAll('.cracker-float-word').forEach(t=>t.remove()); };
            });
        }
    }
};

// ==================== BOOT SEQUENCE ====================
class BootSequence {
    constructor() {
        this.screen = document.getElementById('boot-screen');
        this.logs = CONFIG.boot.logs;
    }

    async start() {
        for (const log of this.logs) {
            await this.addLog(log);
            await this.delay(CONFIG.boot.logDelay);
        }
        await this.delay(1000);
        this.screen.classList.add('hidden');
    }

    addLog(text) {
        return new Promise(resolve => {
            const p = Utils.createElement('div', 'boot-log', `> ${text}`);
            this.screen.appendChild(p);
            this.screen.scrollTop = this.screen.scrollHeight;
            resolve();
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ==================== SYSTEM CLASS ====================
class CyberNexusOS {
    constructor() {
        this.windowManager = new WindowManager();
        this.cursor = document.getElementById('cursor');
        this.clock = document.getElementById('clock');
        this.init();
    }

    async init() {
        const boot = new BootSequence();
        await boot.start();

        this.setupTaskbar();
        this.setupCursor();
        this.setupClock();
        this.setupKeyboardShortcuts();

        // Show tutorial on first visit
        setTimeout(() => {
            const tutorial = new TutorialManager();
            tutorial.start();
        }, 500);
    }

    setupTaskbar() {
        const taskbar = document.getElementById('taskbar');
        taskbar.addEventListener('click', (e) => {
            const icon = e.target.closest('.app-icon');
            if (!icon) return;
            const appName = icon.dataset.app;
            const appConfig = APPS[appName];
            if (!appConfig) return;

            if (this.windowManager.windows.has(appName)) {
                const win = this.windowManager.windows.get(appName);
                this.windowManager.close(win);
                icon.classList.remove('active');
            } else {
                this.windowManager.create(appName, appConfig);
                icon.classList.add('active');
            }
        });
    }

    setupCursor() {
        const throttledMove = Utils.throttle((e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
        }, 16);
        document.addEventListener('mousemove', throttledMove);
        document.addEventListener('mousedown', () => this.cursor.classList.add('clicking'));
        document.addEventListener('mouseup', () => this.cursor.classList.remove('clicking'));
    }

    setupClock() {
        const updateClock = () => {
            const now = new Date();
            this.clock.textContent = now.toLocaleTimeString('en-US', { hour12: false });
        };
        updateClock();
        setInterval(updateClock, 1000);

        // Caps Lock × 3 handled via ShortcutManager below
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Prevent browser from hijacking Alt key (menu bar focus, etc.)
            if (e.key === 'Alt') e.preventDefault();

            // Feed all keys to shortcut manager (pass full event for repeat + code checks)
            ShortcutManager.handleKey(e);

            // Alt + number to open apps
            if (e.altKey && e.key >= '1' && e.key <= '9') {
                e.preventDefault();
                const appKeys = Object.keys(APPS);
                const index = parseInt(e.key) - 1;
                if (appKeys[index]) {
                    const appName = appKeys[index];
                    const icon = document.querySelector(`[data-app="${appName}"]`);
                    if (icon) icon.click();
                }
            }

            // Escape to close active window (but not when tutorial is open)
            if (e.key === 'Escape' && this.windowManager.activeWindow && !document.getElementById('tutorial-overlay')) {
                this.windowManager.close(this.windowManager.activeWindow);
            }
        });
    }
}

// ==================== START SYSTEM ====================
const OS = new CyberNexusOS();