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
    },
    settings: {
        ram: 16, // GB
        cpuModel: 'Intel Core i7-9700K',
        gpuModel: 'NVIDIA RTX 3080',
        storage: 512, // GB
        storageType: 'SSD'
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
        element.dataset.app = appName;
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
        const speedMultiplier = SystemState.getSpeedMultiplier('cpu');
        const blinkSpeed = Math.max(500, CONFIG.typerscene.cursorBlinkSpeed / speedMultiplier);
        this.container.innerHTML = `
            <style>
                .typer-cursor {
                    animation: blink ${blinkSpeed}ms infinite;
                }
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
            </style>
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
                    <div class="typer-screen" id="typer-screen">█</div>
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
        const speedMultiplier = SystemState.getSpeedMultiplier('cpu');
        const baseInterval = 50;
        const adjustedInterval = Math.max(20, baseInterval / speedMultiplier); // Minimum 20ms
        this.typingInterval = setInterval(() => {
            const t = SystemState.getThrottle(['cpu','ram']);
            if (Math.random() < t) {
                this.typeChunk();
                if (this.pointer >= this.rawText.length) this.stop();
            }
        }, adjustedInterval);
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
        screen.innerHTML = highlighted;
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
                content: `<style>
                    .tut-touch-shortcuts { margin-top: 20px; border-top: 1px solid #0f0; padding-top: 15px; }
                    .tut-touch-title { color: #0ff; font-weight: bold; margin-bottom: 10px; }
                </style>
                <div class="tut-shortcuts">
                    <div class="tut-shortcut"><span class="tut-keys">Ctrl × 3</span><span class="tut-effect denied">ACCESS DENIED — giant red screen</span></div>
                    <div class="tut-shortcut"><span class="tut-keys">Shift × 3</span><span class="tut-effect accepted">ACCESS ACCEPTED — green clearance screen</span></div>
                    <div class="tut-shortcut"><span class="tut-keys">Alt × 3</span><span class="tut-effect danger">SELF-DESTRUCT countdown (5 seconds)</span></div>
                    <div class="tut-shortcut"><span class="tut-keys">Z × 3</span><span class="tut-effect">ENCRYPTING ALL FILES animation</span></div>
                    <div class="tut-shortcut"><span class="tut-keys">X × 4</span><span class="tut-effect danger">FBI MONITORING DETECTED warning</span></div>
                    <div class="tut-shortcut"><span class="tut-keys">Space × 5</span><span class="tut-effect">SATELLITE UPLINK established</span></div>
                    <div class="tut-shortcut"><span class="tut-keys">Q × 3</span><span class="tut-effect">CONNECTION TRACE through 47 nodes</span></div>
                    <div class="tut-shortcut"><span class="tut-keys">Caps Lock × 3</span><span class="tut-effect accepted">ADMIN MODE OVERRIDE</span></div>
                </div>
                <div class="tut-touch-shortcuts">
                    <div class="tut-touch-title">📱 MOBILE/TOUCH SHORTCUTS (also work with mouse clicks on desktop):</div>
                    <div class="tut-shortcut"><span class="tut-keys">Tap/Click × 3</span><span class="tut-effect denied">ACCESS DENIED</span></div>
                    <div class="tut-shortcut"><span class="tut-keys">Tap/Click × 4</span><span class="tut-effect accepted">ACCESS ACCEPTED</span></div>
                    <div class="tut-shortcut"><span class="tut-keys">Tap/Click × 5</span><span class="tut-effect danger">SELF-DESTRUCT</span></div>
                    <div class="tut-shortcut"><span class="tut-keys">Tap/Click × 6</span><span class="tut-effect">ENCRYPT FILES</span></div>
                    <div class="tut-shortcut"><span class="tut-keys">Tap/Click × 7</span><span class="tut-effect danger">FBI WARNING</span></div>
                    <div class="tut-shortcut"><span class="tut-keys">Tap/Click × 8</span><span class="tut-effect">SATELLITE</span></div>
                    <div class="tut-shortcut"><span class="tut-keys">Tap/Click × 9</span><span class="tut-effect">TRACE</span></div>
                    <div class="tut-shortcut"><span class="tut-keys">Tap/Click × 10</span><span class="tut-effect accepted">ADMIN</span></div>
                </div>
                <span class="tut-tip">⚡ TIP: All shortcuts require rapid repeated presses/taps/clicks — they look accidental.</span>`
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

    // Base resource usage for each app (in relative units, realistic values)
    baseUsage: {
        typerscene: { cpu: 2, ram: 1, gpu: 0.3, network: 0.1, diskio: 0.2, bandwidth: 0.2 },
        network: { cpu: 1, ram: 1, gpu: 0.2, network: 3, diskio: 0.2, bandwidth: 2 },
        radar: { cpu: 2, ram: 1, gpu: 1, network: 2, diskio: 0.1, bandwidth: 1 },
        monitor: { cpu: 0.5, ram: 0.5, gpu: 0, network: 0, diskio: 0.1, bandwidth: 0 },
        matrix: { cpu: 3, ram: 2, gpu: 4, network: 0.2, diskio: 0.1, bandwidth: 0.3 },
        globe: { cpu: 2, ram: 1.5, gpu: 3, network: 1, diskio: 0.2, bandwidth: 1.5 },
        terminal: { cpu: 1, ram: 0.5, gpu: 0, network: 0.1, diskio: 1, bandwidth: 0.2 },
        firewall: { cpu: 2, ram: 1, gpu: 0.3, network: 3, diskio: 0.1, bandwidth: 2.5 },
        downloader: { cpu: 1, ram: 1, gpu: 0.1, network: 1, diskio: 2, bandwidth: 5 },
        malware: { cpu: 3, ram: 1.5, gpu: 0.5, network: 2, diskio: 0.5, bandwidth: 1.5 },
        miner: { cpu: 10, ram: 3, gpu: 8, network: 0.5, diskio: 0.3, bandwidth: 1 },
        cracker: { cpu: 5, ram: 2, gpu: 0.2, network: 0.3, diskio: 0.6, bandwidth: 0.4 },
        cctv: { cpu: 3, ram: 2, gpu: 5, network: 4, diskio: 0.3, bandwidth: 4 },
        wiretap: { cpu: 2.5, ram: 1.5, gpu: 0.8, network: 3, diskio: 0.2, bandwidth: 5 },
        satuplink: { cpu: 2, ram: 1.5, gpu: 2.5, network: 5, diskio: 0.2, bandwidth: 5 },
        dnssniffer: { cpu: 1.5, ram: 1, gpu: 0.1, network: 4, diskio: 0.5, bandwidth: 3 },
        darkweb: { cpu: 2, ram: 1.5, gpu: 0.2, network: 3, diskio: 0.3, bandwidth: 3.5 }
    },

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

    // Get configured hardware specs
    getHardwareSpecs() {
        return {
            ram: CONFIG.settings.ram,
            cpuModel: CONFIG.settings.cpuModel,
            gpuModel: CONFIG.settings.gpuModel,
            storage: CONFIG.settings.storage,
            storageType: CONFIG.settings.storageType
        };
    },

    // Calculate percentage based on configured hardware
    getPercentage(resource, usage) {
        const specs = this.getHardwareSpecs();
        let maxCapacity;

        switch(resource) {
            case 'ram':
                maxCapacity = specs.ram;
                break;
            case 'cpu':
                // CPU performance based on model (cores/threads equivalent)
                const cpuScores = {
                    'Intel Core i3': 4,
                    'Intel Core i5': 6,
                    'Intel Core i7-9700K': 8,
                    'Intel Core i9': 16,
                    'AMD Ryzen 5': 6,
                    'AMD Ryzen 7': 8,
                    'AMD Ryzen 9': 16
                };
                maxCapacity = cpuScores[specs.cpuModel] || 8;
                break;
            case 'gpu':
                // GPU performance score
                const gpuScores = {
                    'Integrated': 2,
                    'NVIDIA GTX 1650': 8,
                    'NVIDIA RTX 3080': 20,
                    'AMD Radeon RX 580': 12
                };
                maxCapacity = gpuScores[specs.gpuModel] || 10;
                break;
            case 'network':
                maxCapacity = 100; // Mbps
                break;
            case 'diskio':
                maxCapacity = specs.storageType === 'SSD' ? 500 : 150; // MB/s
                break;
            case 'bandwidth':
                maxCapacity = 100; // Mbps
                break;
            default:
                maxCapacity = 100;
        }
        return Math.min(100, (usage / maxCapacity) * 100);
    },

    // Calculate performance multiplier based on hardware specs (1.0 = baseline, higher = faster)
    getPerformanceMultiplier() {
        const specs = this.getHardwareSpecs();
        let multiplier = 1.0;

        // CPU performance multiplier
        const cpuScores = {
            'Intel Core i3': 0.7,
            'Intel Core i5': 0.9,
            'Intel Core i7-9700K': 1.0,
            'Intel Core i9': 1.3,
            'AMD Ryzen 5': 0.9,
            'AMD Ryzen 7': 1.0,
            'AMD Ryzen 9': 1.3
        };
        multiplier *= cpuScores[specs.cpuModel] || 1.0;

        // RAM performance multiplier
        const ramMultiplier = specs.ram / 16; // 16GB = baseline
        multiplier *= Math.max(0.5, Math.min(1.5, ramMultiplier));

        // GPU performance multiplier (affects GPU-intensive tasks)
        const gpuScores = {
            'Integrated': 0.6,
            'NVIDIA GTX 1650': 0.8,
            'NVIDIA RTX 3080': 1.2,
            'AMD Radeon RX 580': 0.9
        };
        multiplier *= gpuScores[specs.gpuModel] || 1.0;

        // Storage performance multiplier (affects disk operations)
        const storageMultiplier = specs.storageType === 'SSD' ? 1.2 : 0.8;
        multiplier *= storageMultiplier;

        return multiplier;
    },

    // Get speed multiplier for specific resource type
    getSpeedMultiplier(resourceType = 'general') {
        const baseMultiplier = this.getPerformanceMultiplier();

        // Different resources have different performance characteristics
        switch(resourceType) {
            case 'cpu': return baseMultiplier;
            case 'gpu': return baseMultiplier * 1.2; // GPU tasks benefit more from good hardware
            case 'disk': return baseMultiplier * (CONFIG.settings.storageType === 'SSD' ? 2.0 : 0.7);
            case 'network': return baseMultiplier * 0.8; // Network less affected by local hardware
            default: return baseMultiplier;
        }
    },
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
        // Below 80%: no slowdown. 80-95%: gradual. 95-100%: severe.
        const slowdown = (v) => {
            if (v < 80) return 1;
            if (v < 95) return 1 - (v - 80) / 15 * 0.7;   // 1.0 → 0.3
            if (v < 100) return 0.25 + Math.random() * 0.05;              // 0.25-0.3 at high load
            return 0.05 + Math.random() * 0.05;              // 0.05-0.1 at 100% (severe throttle)
        };
        for (const k of Object.keys(this.throttle)) {
            this.throttle[k] = slowdown(Math.min(100, this[k]));
        }

        // Visual feedback for system overload
        const avgThrottle = Object.values(this.throttle).reduce((a, b) => a + b, 0) / Object.keys(this.throttle).length;
        const desktop = document.getElementById('desktop');
        if (avgThrottle < 0.5) {
            desktop.classList.add('system-overloaded');
            if (!document.getElementById('overload-style')) {
                const style = document.createElement('style');
                style.id = 'overload-style';
                style.textContent = `
                    .system-overloaded .window {
                        opacity: 0.7;
                        filter: blur(1px);
                    }
                    .system-overloaded .taskbar {
                        background: rgba(255, 0, 0, 0.1);
                    }
                `;
                document.head.appendChild(style);
            }
        } else {
            desktop.classList.remove('system-overloaded');
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

            // Live packet log inside the window
            const logEl = Utils.createElement('div', 'net-packet-log');
            container.appendChild(logEl);
            const protocols = ['TCP','UDP','ICMP','HTTP','SSH','TLS','DNS','FTP'];
            const addPacket = () => {
                const entry = document.createElement('div');
                entry.className = 'net-packet-entry';
                const src = `10.${Utils.random(0,255)}.${Utils.random(0,255)}.${Utils.random(1,254)}`;
                const dst = `172.${Utils.random(16,31)}.${Utils.random(0,255)}.${Utils.random(1,254)}`;
                const proto = protocols[Utils.random(0, protocols.length-1)];
                const bytes = Utils.random(64, 65535);
                entry.innerHTML = `<span class="np-proto">${proto}</span> <span class="np-src">${src}</span> → <span class="np-dst">${dst}</span> <span class="np-bytes">${bytes}B</span>`;
                logEl.prepend(entry);
                if (logEl.children.length > 18) logEl.lastChild.remove();
            };
            const speedMultiplier = SystemState.getSpeedMultiplier('network');
            const baseInterval = 300;
            const adjustedInterval = Math.max(100, baseInterval / speedMultiplier);
            const packetInterval = setInterval(() => {
                const t = SystemState.getThrottle(['network','bandwidth']);
                const count = Math.round((1 + Math.random() * 3) * (2 - t)); // more packets when congested
                for (let i = 0; i < count; i++) addPacket();
            }, adjustedInterval);
            SystemState.setBoost('network', { network: [30, 60], bandwidth: [40, 70], cpu: [4, 14] });
            container.cleanup = () => { clearInterval(packetInterval); SystemState.clearBoost('network'); };
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

            // Live threat detection list inside the window
            const threatLog = Utils.createElement('div', 'radar-threat-log');
            container.appendChild(threatLog);
            const threatTypes = ['PORT SCAN','BRUTE FORCE','MITM','DDoS','C2 BEACON','EXPLOIT','DATA EXFIL','BOTNET'];
            const speedMultiplier = SystemState.getSpeedMultiplier('cpu');
            const baseInterval = 600;
            const adjustedInterval = Math.max(200, baseInterval / speedMultiplier);
            const threatInterval = setInterval(() => {
                if (Math.random() > 0.55) return;
                const entry = document.createElement('div');
                entry.className = 'radar-threat-entry';
                const ip = `${Utils.random(1,254)}.${Utils.random(0,255)}.${Utils.random(0,255)}.${Utils.random(1,254)}`;
                const type = threatTypes[Utils.random(0, threatTypes.length-1)];
                const severity = ['LOW','MED','HIGH','CRIT'][Utils.random(0,3)];
                const sevColor = { LOW:'#0f0', MED:'#ff0', HIGH:'#f80', CRIT:'#f00' }[severity];
                entry.innerHTML = `<span class="rt-type">${type}</span> <span class="rt-ip">${ip}</span> <span class="rt-sev" style="color:${sevColor}">[${severity}]</span>`;
                threatLog.prepend(entry);
                if (threatLog.children.length > 10) threatLog.lastChild.remove();
            }, adjustedInterval);
            SystemState.setBoost('radar', { network: [15, 40], cpu: [14, 32], gpu: [5, 18] });
            container.cleanup = () => { clearInterval(threatInterval); SystemState.clearBoost('radar'); };
        }
    },


    monitor: {
        title: '💻 SYSTEM MONITOR',
        render: (container) => {
            SystemState.setBoost('monitor', { cpu: [2, 8], ram: [2, 7] });
            container.className = 'system-monitor';

            // Specs row at top
            const specsRow = Utils.createElement('div', 'monitor-specs-row');
            specsRow.id = 'monitor-specs';
            specsRow.textContent = `CPU: ${CONFIG.settings.cpuModel} | RAM: ${CONFIG.settings.ram}GB | GPU: ${CONFIG.settings.gpuModel} | Storage: ${CONFIG.settings.storage}GB ${CONFIG.settings.storageType}`;
            container.appendChild(specsRow);

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
                // Calculate actual usage based on running apps
                const runningApps = {};
                document.querySelectorAll('.window').forEach(win => {
                    const appName = win.dataset.app;
                    if (appName && SystemState.baseUsage[appName]) {
                        runningApps[appName] = (runningApps[appName] || 0) + 1;
                    }
                });

                const totalUsage = { cpu: 0, ram: 0, gpu: 0, network: 0, diskio: 0, bandwidth: 0 };
                Object.entries(runningApps).forEach(([appName, count]) => {
                    const base = SystemState.baseUsage[appName];
                    if (base) {
                        Object.keys(totalUsage).forEach(resource => {
                            totalUsage[resource] += base[resource] * count;
                        });
                    }
                });

                // Add minimal base system usage
                totalUsage.cpu += 0.5;
                totalUsage.ram += 0.3;

                metrics.forEach(m => {
                    const usage = totalUsage[m.key] || 0;
                    const percentage = SystemState.getPercentage(m.key, usage);
                    const v = Math.round(percentage);

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
                    const saturated = metrics.filter(m => {
                        const usage = totalUsage[m.key] || 0;
                        const percentage = SystemState.getPercentage(m.key, usage);
                        return percentage >= 95;
                    });
                    if (saturated.length > 0) {
                        tr.innerHTML = `⚠ THROTTLING: ${saturated.map(m => m.label).join(', ')} — APPS SLOWED`;
                        tr.style.color = 'var(--danger)';
                        tr.style.animation = 'throttleFlicker 0.5s ease infinite';
                    } else {
                        const high = metrics.filter(m => {
                            const usage = totalUsage[m.key] || 0;
                            const percentage = SystemState.getPercentage(m.key, usage);
                            return percentage >= 80;
                        });
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
            const speedMultiplier = SystemState.getSpeedMultiplier('gpu');
            const baseInterval = 200;
            const adjustedInterval = Math.max(50, baseInterval / speedMultiplier);
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
            }, adjustedInterval);

            container.cleanup = () => {
                clearInterval(internalInterval);
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
            const speedMultiplier = SystemState.getSpeedMultiplier('gpu');
            const baseInterval = 1000;
            const adjustedInterval = Math.max(300, baseInterval / speedMultiplier);
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
            const speedMultiplier = SystemState.getSpeedMultiplier('disk');
            const baseInterval = 30;
            const adjustedInterval = Math.max(10, baseInterval / speedMultiplier);
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
            }, adjustedInterval);
            container.cleanup = () => {
                clearInterval(typeInterval);
                SystemState.clearBoost('terminal');
            };
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
            const speedMultiplier = SystemState.getSpeedMultiplier('network');
            const baseInterval = 500;
            const adjustedInterval = Math.max(200, baseInterval / speedMultiplier);
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
                    // Brief red tint on the firewall window itself
                    const fwin = container.closest('.window');
                    if (fwin) { fwin.style.boxShadow = '0 0 30px rgba(255,0,0,0.8)'; setTimeout(() => fwin.style.boxShadow = '', 400); }
                }
            }, adjustedInterval);
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

            const speedMultiplier = SystemState.getSpeedMultiplier('network');
            const speedInterval = setInterval(() => {
                const t = SystemState.getThrottle(['bandwidth','network']);
                speedEl.textContent = ((Math.random() * 50 + 10) * t).toFixed(1) + ' MB/s';
                speedEl.style.color = t < 0.5 ? 'var(--danger)' : t < 0.8 ? 'var(--warning)' : '';
            }, Math.max(400, 800 / speedMultiplier));
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
            }, Math.max(1000, 2500 / speedMultiplier));
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
                    }, Math.max(50, 150 / speedMultiplier));
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
                const speedMultiplier = SystemState.getSpeedMultiplier('network');
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
                    delay += Math.max(100, Utils.random(300, 700) / speedMultiplier);
                });
            });

            container.cleanup = () => { SystemState.clearBoost('malware'); };
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
                <div class="miner-system-metrics" id="mn-system">
                    <div class="miner-metric"><span class="miner-metric-label">CPU:</span> <span id="mn-sys-cpu">0%</span></div>
                    <div class="miner-metric"><span class="miner-metric-label">RAM:</span> <span id="mn-sys-ram">0%</span></div>
                    <div class="miner-metric"><span class="miner-metric-label">GPU:</span> <span id="mn-sys-gpu">0%</span></div>
                    <div class="miner-metric"><span class="miner-metric-label">DISK I/O:</span> <span id="mn-sys-disk">0%</span></div>
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
                sysCpu: container.querySelector('#mn-sys-cpu'),
                sysRam: container.querySelector('#mn-sys-ram'),
                sysGpu: container.querySelector('#mn-sys-gpu'),
                sysDisk: container.querySelector('#mn-sys-disk'),
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
                }, Math.max(30, 80 / SystemState.getSpeedMultiplier('gpu')));

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

                    // Update system metrics (same as monitor)
                    const runningApps = {};
                    document.querySelectorAll('.window').forEach(win => {
                        const appName = win.dataset.app;
                        if (appName && SystemState.baseUsage[appName]) {
                            runningApps[appName] = (runningApps[appName] || 0) + 1;
                        }
                    });
                    const totalUsage = { cpu: 0, ram: 0, gpu: 0, diskio: 0 };
                    Object.entries(runningApps).forEach(([appName, count]) => {
                        const base = SystemState.baseUsage[appName];
                        if (base) {
                            totalUsage.cpu += base.cpu * count;
                            totalUsage.ram += base.ram * count;
                            totalUsage.gpu += base.gpu * count;
                            totalUsage.diskio += base.diskio * count;
                        }
                    });
                    totalUsage.cpu += 0.5;
                    totalUsage.ram += 0.3;

                    // Calculate percentages
                    const cpuPct = Math.round(SystemState.getPercentage('cpu', totalUsage.cpu));
                    const ramPct = Math.round(SystemState.getPercentage('ram', totalUsage.ram));
                    const gpuPct = Math.round(SystemState.getPercentage('gpu', totalUsage.gpu));
                    const diskPct = Math.round(SystemState.getPercentage('diskio', totalUsage.diskio));

                    // Update hardware bars with calculated percentages
                    els.gpu.style.width = gpuPct + '%';
                    els.cpu.style.width = cpuPct + '%';
                    els.temp.textContent  = (55 + gpuPct * 0.45).toFixed(0) + '°C';
                    els.ctemp.textContent = (40 + cpuPct * 0.35).toFixed(0) + '°C';

                    // Update system metrics display
                    els.sysCpu.textContent = cpuPct + '%';
                    els.sysRam.textContent = ramPct + '%';
                    els.sysGpu.textContent = gpuPct + '%';
                    els.sysDisk.textContent = diskPct + '%';
                }, Math.max(400, 1200 / SystemState.getSpeedMultiplier('cpu')));

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
            const speedMultiplier = SystemState.getSpeedMultiplier('cpu');

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
                }, Math.max(50, 120 / speedMultiplier));
                startBtn.textContent = '⏳ BREACHING...';
                startBtn.style.background = 'rgba(255,200,0,0.15)';
                statusEl.textContent = 'ACTIVE';
                statusEl.style.color = '#ff0';

                let progress = 0, attempts = 0, userIndex = 0;
                const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';

                interval = setInterval(() => {
                    const t = SystemState.getThrottle(['cpu','ram']);
                    const attIncrement = Math.round(Utils.random(60, 180) * t * speedMultiplier);
                    attempts += attIncrement;
                    progress += Math.random() * 1.5 * t * speedMultiplier;

                    const len = Utils.random(6, 14);
                    attemptEl.textContent = Array.from({length: len}, () => chars[Math.floor(Math.random() * chars.length)]).join('');

                    attemptsEl.textContent = attempts.toLocaleString();
                    speedEl.textContent = Math.round(Utils.random(900, 1400) * t * speedMultiplier) + '/s';
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
                }, Math.max(30, 100 / speedMultiplier));

                container.cleanup = () => { clearInterval(interval); if (crackerFloatInterval) clearInterval(crackerFloatInterval); document.querySelectorAll('.cracker-float-word').forEach(t=>t.remove()); };
            });
        }
    },

    cctv: {
        title: '📹 CCTV INTERCEPT',
        render: (container) => {
            container.className = 'cctv-container';
            SystemState.setBoost('cctv', { gpu: [22, 50], network: [28, 58], bandwidth: [20, 46], cpu: [8, 20] });

            const camFeeds = ['CAM-01 // LOBBY', 'CAM-02 // PARKING', 'CAM-03 // VAULT', 'CAM-04 // ROOFTOP', 'CAM-05 // SERVER RM', 'CAM-06 // ELEVATOR'];
            let camIndex = 0;

            container.innerHTML = `
                <div class="cctv-screen">
                    <canvas class="cctv-static" width="160" height="90"></canvas>
                    <div class="cctv-vignette"></div>
                    <div class="cctv-scanline"></div>
                    <div class="cctv-hud cctv-hud-top">
                        <span class="cctv-rec">● REC</span>
                        <span class="cctv-cam" id="cctv-cam">${camFeeds[0]}</span>
                    </div>
                    <div class="cctv-hud cctv-hud-bottom">
                        <span id="cctv-coords">LAT 00.0000 LON 00.0000</span>
                        <span id="cctv-clock">00:00:00</span>
                    </div>
                    <div class="cctv-reticle" id="cctv-reticle"><span class="cctv-reticle-label">TARGET ACQUIRED</span></div>
                </div>
                <div class="cctv-controls">
                    <button class="cctv-btn" id="cctv-prev">◀ PREV</button>
                    <span class="cctv-status" id="cctv-status">SCANNING FEED...</span>
                    <button class="cctv-btn" id="cctv-next">NEXT ▶</button>
                </div>
            `;

            const canvas = container.querySelector('.cctv-static');
            const ctx = canvas.getContext('2d');
            const reticle = container.querySelector('#cctv-reticle');
            const coordsEl = container.querySelector('#cctv-coords');
            const clockEl = container.querySelector('#cctv-clock');
            const statusEl = container.querySelector('#cctv-status');
            const camEl = container.querySelector('#cctv-cam');

            const W = canvas.width, H = canvas.height;
            const img = ctx.createImageData(W, H);
            let running = true;

            // Static noise — under GPU/bandwidth load we randomly skip frames so it visibly stutters
            const drawStatic = () => {
                if (!running) return;
                const t = SystemState.getThrottle(['gpu', 'bandwidth']);
                if (Math.random() <= t) {
                    const d = img.data;
                    for (let i = 0; i < d.length; i += 4) {
                        const v = (Math.random() * 255) | 0;
                        d[i] = v * 0.4; d[i + 1] = v; d[i + 2] = v * 0.4; d[i + 3] = 255;
                    }
                    ctx.putImageData(img, 0, 0);
                }
                requestAnimationFrame(drawStatic);
            };
            requestAnimationFrame(drawStatic);

            // Fake face-detection reticle that hops around and occasionally "locks on"
            const moveReticle = () => {
                reticle.style.left = Utils.random(8, 70) + '%';
                reticle.style.top = Utils.random(8, 55) + '%';
                const locked = Math.random() > 0.5;
                reticle.classList.toggle('locked', locked);
                statusEl.textContent = locked ? 'TARGET ACQUIRED' : 'SCANNING FEED...';
                statusEl.style.color = locked ? 'var(--danger)' : 'var(--primary)';
            };
            const speedMultiplier = SystemState.getSpeedMultiplier('gpu');
            const reticleInterval = setInterval(moveReticle, Math.max(700, 1400 / speedMultiplier));
            moveReticle();

            // Drifting GPS coordinates + live timestamp
            const metaInterval = setInterval(() => {
                const lat = (Utils.random(-8999, 8999) / 100).toFixed(4);
                const lon = (Utils.random(-17999, 17999) / 100).toFixed(4);
                coordsEl.textContent = `LAT ${lat} LON ${lon}`;
                clockEl.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
            }, 1000);

            const switchCam = (dir) => {
                camIndex = (camIndex + dir + camFeeds.length) % camFeeds.length;
                camEl.textContent = camFeeds[camIndex];
                canvas.style.opacity = '0.2'; // brief signal-loss flash
                setTimeout(() => { canvas.style.opacity = '1'; }, 120);
            };
            container.querySelector('#cctv-next').addEventListener('click', () => switchCam(1));
            container.querySelector('#cctv-prev').addEventListener('click', () => switchCam(-1));
            const autoCam = setInterval(() => switchCam(1), 6000);

            container.cleanup = () => {
                running = false;
                clearInterval(reticleInterval);
                clearInterval(metaInterval);
                clearInterval(autoCam);
                SystemState.clearBoost('cctv');
            };
        }
    },

    wiretap: {
        title: '🎧 AUDIO WIRETAP',
        render: (container) => {
            container.className = 'wiretap-container';
            SystemState.setBoost('wiretap', { cpu: [12, 30], network: [20, 45], bandwidth: [30, 62], ram: [6, 16] });

            container.innerHTML = `
                <div class="wiretap-header">
                    <span class="wiretap-live">● LIVE</span>
                    <span id="wiretap-target">TARGET: +1-555-0${Utils.random(100, 999)}</span>
                    <span id="wiretap-dur">00:00</span>
                </div>
                <canvas class="wiretap-wave" width="480" height="120"></canvas>
                <div class="wiretap-transcript-label">▼ AUTO-TRANSCRIPTION</div>
                <div class="wiretap-transcript" id="wiretap-transcript"></div>
            `;

            const canvas = container.querySelector('.wiretap-wave');
            const ctx = canvas.getContext('2d');
            const W = canvas.width, H = canvas.height;
            const transcriptEl = container.querySelector('#wiretap-transcript');
            const durEl = container.querySelector('#wiretap-dur');
            let running = true;
            let phase = 0;

            // Animated waveform — amplitude and scroll speed drop as CPU/bandwidth saturate
            const drawWave = () => {
                if (!running) return;
                const t = SystemState.getThrottle(['cpu', 'bandwidth']);
                ctx.clearRect(0, 0, W, H);
                ctx.lineWidth = 2;
                ctx.strokeStyle = '#0f0';
                ctx.shadowColor = '#0f0';
                ctx.shadowBlur = 8;
                ctx.beginPath();
                const amp = (H / 3) * t;
                for (let x = 0; x <= W; x += 2) {
                    const y = H / 2
                        + Math.sin((x * 0.04) + phase) * amp * 0.5
                        + Math.sin((x * 0.13) + phase * 1.7) * amp * 0.3 * Math.random();
                    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.stroke();
                phase += 0.15 * (0.3 + t);
                requestAnimationFrame(drawWave);
            };
            requestAnimationFrame(drawWave);

            // Call duration counter
            let seconds = 0;
            const durInterval = setInterval(() => {
                seconds++;
                const m = String(Math.floor(seconds / 60)).padStart(2, '0');
                const s = String(seconds % 60).padStart(2, '0');
                durEl.textContent = `${m}:${s}`;
            }, 1000);

            // Fake intercepted transcript, revealed character-by-character in real time
            const lines = [
                'subject confirms the package is ready for pickup',
                'meet at the usual location after midnight',
                'they suspect nothing, proceed as planned',
                'transfer the funds to the offshore account',
                'do not use this line again, it may be compromised',
                'the access codes have been changed, stand by',
                'our contact inside will handle the rest',
                'abort the operation if you see anyone following you'
            ];
            const speakers = ['VOICE A', 'VOICE B'];
            let lineEl = null, charPos = 0, currentText = '', speaker = 0;

            const startLine = () => {
                currentText = lines[Utils.random(0, lines.length - 1)];
                charPos = 0;
                speaker = 1 - speaker;
                lineEl = document.createElement('div');
                lineEl.className = 'wiretap-line';
                lineEl.innerHTML = `<span class="wt-speaker">${speakers[speaker]}:</span> <span class="wt-text"></span>`;
                transcriptEl.appendChild(lineEl);
                if (transcriptEl.children.length > 12) transcriptEl.firstChild.remove();
            };
            startLine();

            const speedMultiplier = SystemState.getSpeedMultiplier('cpu');
            // delay per character — re-read live so heavy CPU load slows the transcription
            const interval = () => Math.max(40, (90 / speedMultiplier) / Math.max(0.3, SystemState.getThrottle(['cpu'])));
            let typeTimeout = null;
            const tick = () => {
                if (!running) return;
                if (charPos < currentText.length) {
                    charPos++;
                    lineEl.querySelector('.wt-text').textContent = currentText.slice(0, charPos);
                    transcriptEl.scrollTop = transcriptEl.scrollHeight;
                    typeTimeout = setTimeout(tick, interval());
                } else {
                    typeTimeout = setTimeout(() => { startLine(); typeTimeout = setTimeout(tick, interval()); }, 1200);
                }
            };
            typeTimeout = setTimeout(tick, interval());

            container.cleanup = () => {
                running = false;
                clearInterval(durInterval);
                clearTimeout(typeTimeout);
                SystemState.clearBoost('wiretap');
            };
        }
    },

    satuplink: {
        title: '🛰️ SAT-UPLINK',
        render: (container) => {
            container.className = 'satuplink-container';
            SystemState.setBoost('satuplink', { network: [30, 64], bandwidth: [28, 58], gpu: [15, 38], cpu: [6, 18] });

            container.innerHTML = `
                <div class="sat-top">
                    <span id="sat-id">SAT-${Utils.random(100, 999)} // GEO-SYNC</span>
                    <span id="sat-signal">SIGNAL: ▮▮▮▮▯</span>
                </div>
                <div class="sat-grid">
                    <canvas class="sat-map" width="320" height="200"></canvas>
                    <div class="sat-sweep"></div>
                    <div class="sat-target" id="sat-target">+</div>
                </div>
                <div class="sat-lock">
                    <div class="sat-lock-label">TARGET LOCK</div>
                    <div class="sat-lock-bar"><div class="sat-lock-fill" id="sat-lock-fill"></div></div>
                    <div class="sat-lock-pct" id="sat-lock-pct">0%</div>
                </div>
                <div class="sat-telemetry" id="sat-telemetry"></div>
            `;

            const canvas = container.querySelector('.sat-map');
            const ctx = canvas.getContext('2d');
            const W = canvas.width, H = canvas.height;
            const target = container.querySelector('#sat-target');
            const lockFill = container.querySelector('#sat-lock-fill');
            const lockPct = container.querySelector('#sat-lock-pct');
            const telemetryEl = container.querySelector('#sat-telemetry');
            const signalEl = container.querySelector('#sat-signal');

            // Static grid + fake landmasses
            ctx.clearRect(0, 0, W, H);
            ctx.strokeStyle = 'rgba(0,255,0,0.18)';
            ctx.lineWidth = 1;
            for (let x = 0; x <= W; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
            for (let y = 0; y <= H; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
            ctx.fillStyle = 'rgba(0,255,0,0.07)';
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.ellipse(Utils.random(0, W), Utils.random(0, H), Utils.random(20, 60), Utils.random(15, 40), Math.random() * Math.PI, 0, Math.PI * 2);
                ctx.fill();
            }

            // Telemetry stream
            const addTelemetry = (text, highlight) => {
                const row = document.createElement('div');
                row.className = 'sat-tele-row' + (highlight ? ' highlight' : '');
                row.textContent = text;
                telemetryEl.prepend(row);
                if (telemetryEl.children.length > 8) telemetryEl.lastChild.remove();
            };

            // Target marker drifts across the grid
            const moveTarget = () => {
                target.style.left = Utils.random(10, 88) + '%';
                target.style.top = Utils.random(10, 82) + '%';
            };
            moveTarget();
            const targetInterval = setInterval(moveTarget, 2500);

            // Lock-on progress — faster with strong hardware, stalls when network/bandwidth throttle
            let lock = 0;
            let locked = false;
            const speedMultiplier = SystemState.getSpeedMultiplier('network');
            const lockInterval = setInterval(() => {
                const t = SystemState.getThrottle(['network', 'bandwidth']);
                if (!locked) {
                    lock = Math.min(100, lock + (Utils.random(1, 4) * speedMultiplier * t));
                    lockFill.style.width = lock + '%';
                    lockPct.textContent = Math.floor(lock) + '%';
                    if (lock >= 100) {
                        locked = true;
                        lockPct.textContent = 'LOCKED';
                        lockPct.style.color = 'var(--danger)';
                        target.classList.add('locked');
                        addTelemetry('>>> TARGET LOCK CONFIRMED <<<', true);
                        setTimeout(() => {
                            locked = false; lock = 0; moveTarget();
                            lockPct.style.color = '';
                            target.classList.remove('locked');
                        }, 4000);
                    }
                }
                // signal-strength bars reflect current throttle
                const bars = Math.max(1, Math.round(t * 5));
                signalEl.textContent = 'SIGNAL: ' + '▮'.repeat(bars) + '▯'.repeat(5 - bars);
            }, 300);

            const teleMsgs = () => [
                `ALT ${Utils.random(180, 420)}km  VEL ${Utils.random(6, 8)}.${Utils.random(0, 9)}km/s`,
                `AZ ${Utils.random(0, 359)}°  EL ${Utils.random(0, 90)}°  DOP ${(Math.random() * 5).toFixed(2)}`,
                `UPLINK ${Utils.random(40, 99)}%  PKT ${Utils.random(1000, 9999)}  LOSS ${Utils.random(0, 3)}%`,
                `THERM ${Utils.random(-40, 60)}°C  PWR ${Utils.random(70, 100)}%  ORB STABLE`,
                `DECRYPT AES-256 ... ${Utils.random(10, 99)}% COMPLETE`
            ];
            const teleInterval = setInterval(() => {
                const msgs = teleMsgs();
                addTelemetry(msgs[Utils.random(0, msgs.length - 1)]);
            }, Math.max(500, 900 / speedMultiplier));

            container.cleanup = () => {
                clearInterval(targetInterval);
                clearInterval(lockInterval);
                clearInterval(teleInterval);
                SystemState.clearBoost('satuplink');
            };
        }
    },

    // ==================== NEW: DNS SNIFFER ====================
    dnssniffer: {
        title: '🔍 DNS SNIFFER',
        render: (container) => {
            SystemState.setBoost('dnssniffer', { network: [20, 50], bandwidth: [15, 40], cpu: [5, 14] });
            container.className = 'dnssniffer-container';

            const queryTypes = ['A', 'AAAA', 'MX', 'TXT', 'CNAME', 'NS', 'PTR', 'SOA'];
            const domains = [
                'login.corporate-vpn.net', 'internal.bank-secure.com', 'mail.gov-agency.us',
                'api.financial-data.io', 'secure.health-records.org', 'admin.military-ops.gov',
                'db.classified-intel.net', 'auth.pentagon-secure.mil', 'payroll.corp-internal.com',
                'vpn.secret-facility.gov', 'cloud.intelligence-ops.net', 'files.confidential-data.org'
            ];

            container.innerHTML = `
                <div class="dns-header">
                    <div class="dns-status-dot"></div>
                    <div class="dns-status-text">INTERCEPTING DNS TRAFFIC</div>
                    <div class="dns-count">CAPTURED: <span id="dns-count">0</span></div>
                    <div class="dns-iface">IFACE: eth0 [PROMISCUOUS]</div>
                </div>
                <div class="dns-filter-row">
                    <span class="dns-filter-label">FILTER:</span>
                    <span class="dns-filter active">ALL</span>
                    <span class="dns-filter">A/AAAA</span>
                    <span class="dns-filter">MX</span>
                    <span class="dns-filter">TXT</span>
                </div>
                <div class="dns-table-header">
                    <span>TYPE</span><span>DOMAIN</span><span>RESPONSE</span><span>TTL</span>
                </div>
                <div class="dns-entries" id="dns-entries"></div>
                <div class="dns-stats-row">
                    <span>QUERIES: <strong id="dns-queries">0</strong></span>
                    <span>RESPONSES: <strong id="dns-resp">0</strong></span>
                    <span>SUSPICIOUS: <strong id="dns-susp" style="color:#f00">0</strong></span>
                    <span>BW: <strong id="dns-bw">0.0 KB/s</strong></span>
                </div>
            `;

            let count = 0, queries = 0, responses = 0, suspicious = 0;
            const countEl = container.querySelector('#dns-count');
            const entriesEl = container.querySelector('#dns-entries');
            const queriesEl = container.querySelector('#dns-queries');
            const respEl = container.querySelector('#dns-resp');
            const suspEl = container.querySelector('#dns-susp');
            const bwEl = container.querySelector('#dns-bw');

            const speedMultiplier = SystemState.getSpeedMultiplier('network');

            const addEntry = () => {
                const t = SystemState.getThrottle(['network', 'bandwidth']);
                if (Math.random() > t * 0.9) return;

                count++;
                queries += Utils.random(1, 3);
                responses += Utils.random(1, 2);
                const isSusp = Math.random() > 0.75;
                if (isSusp) suspicious++;

                const type = queryTypes[Utils.random(0, queryTypes.length - 1)];
                const domain = domains[Utils.random(0, domains.length - 1)];
                const ip = `${Utils.random(1, 254)}.${Utils.random(0, 255)}.${Utils.random(0, 255)}.${Utils.random(1, 254)}`;
                const ttl = Utils.random(60, 3600);

                const entry = document.createElement('div');
                entry.className = 'dns-entry' + (isSusp ? ' suspicious' : '');
                entry.innerHTML = `
                    <span class="dns-type dns-type-${type.toLowerCase()}">${type}</span>
                    <span class="dns-domain">${domain}</span>
                    <span class="dns-response">${ip}</span>
                    <span class="dns-ttl">${ttl}s</span>
                `;
                entriesEl.prepend(entry);
                if (entriesEl.children.length > 20) entriesEl.lastChild.remove();

                countEl.textContent = count;
                queriesEl.textContent = queries;
                respEl.textContent = responses;
                suspEl.textContent = suspicious;
                bwEl.textContent = ((Math.random() * 80 + 10) * t).toFixed(1) + ' KB/s';
            };

            const captureInterval = setInterval(addEntry, Math.max(200, 600 / speedMultiplier));

            // EFFECT: suspicious query alerts float in from the right
            const alertInterval = setInterval(() => {
                if (Math.random() > 0.3) return;
                const domain = domains[Utils.random(0, domains.length - 1)];
                const tag = document.createElement('div');
                tag.textContent = `⚠ DNS INTERCEPT: ${domain}`;
                tag.style.cssText = `
                    position:fixed; right:20px; top:${Utils.random(10, 70)}vh;
                    color:rgba(255,50,50,0.9); font-family:var(--font-mono); font-size:11px;
                    background:rgba(50,0,0,0.85); border:1px solid #f00;
                    padding:4px 8px; border-radius:2px;
                    pointer-events:none; z-index:9992;
                    animation:dnsDriftFade 2.5s ease forwards; white-space:nowrap;
                `;
                document.body.appendChild(tag);
                setTimeout(() => tag.remove(), 2500);
            }, 3000);

            container.cleanup = () => {
                clearInterval(captureInterval);
                clearInterval(alertInterval);
                SystemState.clearBoost('dnssniffer');
            };
        }
    },

    // ==================== NEW: DARK WEB BROWSER ====================
    darkweb: {
        title: '🌑 DARKWEB BROWSER',
        render: (container) => {
            SystemState.setBoost('darkweb', { network: [15, 40], bandwidth: [20, 50], cpu: [6, 18], ram: [4, 12] });
            container.className = 'darkweb-container';

            const sites = [
                { url: 'zqktlwiuavvvqqt4ybvgvi7tyo4hjl5xgfuvpdf6otjiycgwqbym26wid.onion', name: 'The Hidden Wiki', category: 'INDEX' },
                { url: 'expyuzz4wqqyqhjn.onion/darknet/markets/', name: 'Black Market Exchange', category: 'MARKET' },
                { url: 'p53lf57qovyuvwsc6xnrppyply3vtqm7l6pcobkmyqg6uphvydcpqyd.onion', name: 'Classified Data Dumps', category: 'DATA' },
                { url: 'hss3uro2hsxfogfq.onion/en/index.html', name: 'Secure Drop Node', category: 'LEAK' },
                { url: 'nzdnmfcf2z5pd3vr.onion/', name: 'Zero-Day Exchange', category: 'EXPLOIT' },
                { url: 'msydqstlz2kzerdg.onion', name: 'Anonymous Comms Hub', category: 'COMMS' },
            ];

            const torNodes = [
                'Frankfurt, DE', 'Amsterdam, NL', 'Bucharest, RO', 'Moscow, RU', 'Tokyo, JP',
                'São Paulo, BR', 'Singapore, SG', 'Stockholm, SE', 'Dublin, IE'
            ];

            const siteContents = [
                ['> DATABASES: Financial, Medical, Gov', '> RECORDS: 847,291 entries indexed', '> ACCESS: Anonymous only — TOR required'],
                ['> LISTINGS: 1,247 active', '> ESCROW: BTC / XMR only', '> VERIFIED VENDORS: 89'],
                ['> LATEST DUMP: corp_breach_2024.sql (2.1GB)', '> CREDENTIALS: 14,000+ verified', '> FREE SAMPLES AVAILABLE'],
                ['> SUBMISSIONS: 1,891 files', '> JOURNALISTS ONLINE: 4', '> ENCRYPTED CHANNEL ACTIVE'],
                ['> CVE-2024-XXXX: $45,000', '> REMOTE CODE EXEC: $120,000', '> 0-DAY BUNDLE: NEGOTIABLE'],
                ['> CHANNELS: 247 active', '> USERS ONLINE: 1,892', '> MILITARY-GRADE END-TO-END ENCRYPTION'],
            ];

            container.innerHTML = `
                <div class="dw-tor-route">
                    <span class="dw-tor-label">TOR ROUTE:</span>
                    <span id="dw-route">ESTABLISHING...</span>
                </div>
                <div class="dw-addr-bar">
                    <span class="dw-addr-icon">🔒</span>
                    <span class="dw-addr" id="dw-addr">${sites[0].url}</span>
                </div>
                <div class="dw-connect-bar">
                    <span class="dw-connect-label">CONNECTING:</span>
                    <div class="dw-connect-progress"><div class="dw-connect-fill" id="dw-fill"></div></div>
                    <span class="dw-connect-pct" id="dw-pct">0%</span>
                </div>
                <div class="dw-site-info">
                    <div class="dw-site-name" id="dw-site-name">${sites[0].name}</div>
                    <div class="dw-site-cat" id="dw-site-cat">[${sites[0].category}]</div>
                </div>
                <div class="dw-content" id="dw-content"></div>
                <div class="dw-sites-list" id="dw-sites">
                    ${sites.map((s, i) => `
                        <div class="dw-site-item" data-idx="${i}">
                            <span class="dw-site-badge dw-cat-${s.category.toLowerCase()}">[${s.category}]</span>
                            <span class="dw-site-item-name">${s.name}</span>
                        </div>
                    `).join('')}
                </div>
            `;

            const addrEl = container.querySelector('#dw-addr');
            const fillEl = container.querySelector('#dw-fill');
            const pctEl = container.querySelector('#dw-pct');
            const siteNameEl = container.querySelector('#dw-site-name');
            const siteCatEl = container.querySelector('#dw-site-cat');
            const contentEl = container.querySelector('#dw-content');
            const routeEl = container.querySelector('#dw-route');

            let siteIdx = 0;
            let connectProgress = 0;
            let connectInterval = null;

            const updateRoute = () => {
                const count = Utils.random(3, 5);
                const route = Array.from({ length: count }, () => torNodes[Utils.random(0, torNodes.length - 1)]);
                routeEl.textContent = ['YOU', ...route, 'TARGET'].join(' → ');
            };
            updateRoute();

            const connectTo = (idx) => {
                siteIdx = idx;
                const site = sites[idx];
                addrEl.textContent = site.url;
                siteNameEl.textContent = site.name;
                siteCatEl.textContent = `[${site.category}]`;
                contentEl.innerHTML = '';
                connectProgress = 0;
                fillEl.style.width = '0%';
                pctEl.textContent = '0%';
                updateRoute();

                if (connectInterval) clearInterval(connectInterval);
                const speedMultiplier = SystemState.getSpeedMultiplier('network');
                connectInterval = setInterval(() => {
                    const t = SystemState.getThrottle(['network', 'bandwidth']);
                    connectProgress += (Math.random() * 8 + 2) * t;
                    if (connectProgress >= 100) {
                        connectProgress = 100;
                        fillEl.style.width = '100%';
                        pctEl.textContent = '100%';
                        clearInterval(connectInterval);
                        const lines = siteContents[idx] || siteContents[0];
                        lines.forEach((line, i) => {
                            setTimeout(() => {
                                const div = document.createElement('div');
                                div.className = 'dw-content-line';
                                div.textContent = line;
                                contentEl.appendChild(div);
                            }, i * 400);
                        });
                    } else {
                        fillEl.style.width = connectProgress + '%';
                        pctEl.textContent = Math.floor(connectProgress) + '%';
                    }
                }, Math.max(80, 200 / speedMultiplier));
            };

            container.querySelector('#dw-sites').addEventListener('click', (e) => {
                const item = e.target.closest('.dw-site-item');
                if (!item) return;
                container.querySelectorAll('.dw-site-item').forEach(x => x.classList.remove('active'));
                item.classList.add('active');
                connectTo(parseInt(item.dataset.idx));
            });

            const autoCycle = setInterval(() => {
                const nextIdx = (siteIdx + 1) % sites.length;
                container.querySelectorAll('.dw-site-item').forEach(x => x.classList.remove('active'));
                const items = container.querySelectorAll('.dw-site-item');
                if (items[nextIdx]) items[nextIdx].classList.add('active');
                connectTo(nextIdx);
            }, 15000);

            container.querySelector('.dw-site-item').classList.add('active');
            connectTo(0);

            container.cleanup = () => {
                if (connectInterval) clearInterval(connectInterval);
                clearInterval(autoCycle);
                SystemState.clearBoost('darkweb');
            };
        }
    },

    settings: {
        title: '⚙️ SETTINGS',
        render: (container) => {
            container.className = 'settings-container';
            container.innerHTML = `
                <div class="settings-section">
                    <h3>Computer Specifications</h3>
                    <div class="setting-item">
                        <label for="ram-select">RAM (GB):</label>
                        <select id="ram-select">
                            <option value="4">4GB</option>
                            <option value="8">8GB</option>
                            <option value="16" selected>16GB</option>
                            <option value="32">32GB</option>
                            <option value="64">64GB</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <label for="cpu-select">CPU Model:</label>
                        <select id="cpu-select">
                            <option value="Intel Core i3">Intel Core i3</option>
                            <option value="Intel Core i5">Intel Core i5</option>
                            <option value="Intel Core i7-9700K" selected>Intel Core i7-9700K</option>
                            <option value="Intel Core i9">Intel Core i9</option>
                            <option value="AMD Ryzen 5">AMD Ryzen 5</option>
                            <option value="AMD Ryzen 7">AMD Ryzen 7</option>
                            <option value="AMD Ryzen 9">AMD Ryzen 9</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <label for="gpu-select">GPU Model:</label>
                        <select id="gpu-select">
                            <option value="Integrated">Integrated Graphics</option>
                            <option value="NVIDIA GTX 1650">NVIDIA GTX 1650</option>
                            <option value="NVIDIA RTX 3080" selected>NVIDIA RTX 3080</option>
                            <option value="AMD Radeon RX 580">AMD Radeon RX 580</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <label for="storage-select">Storage (GB):</label>
                        <select id="storage-select">
                            <option value="256">256GB</option>
                            <option value="512" selected>512GB</option>
                            <option value="1024">1TB</option>
                            <option value="2048">2TB</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <label for="storage-type-select">Storage Type:</label>
                        <select id="storage-type-select">
                            <option value="HDD">HDD</option>
                            <option value="SSD" selected>SSD</option>
                        </select>
                    </div>
                    <button id="save-settings" class="settings-save-btn">Save Settings</button>
                </div>
            `;

            // Set current values
            container.querySelector('#ram-select').value = CONFIG.settings.ram;
            container.querySelector('#cpu-select').value = CONFIG.settings.cpuModel;
            container.querySelector('#gpu-select').value = CONFIG.settings.gpuModel;
            container.querySelector('#storage-select').value = CONFIG.settings.storage;
            container.querySelector('#storage-type-select').value = CONFIG.settings.storageType;

            container.querySelector('#save-settings').addEventListener('click', () => {
                CONFIG.settings.ram = parseInt(container.querySelector('#ram-select').value);
                CONFIG.settings.cpuModel = container.querySelector('#cpu-select').value;
                CONFIG.settings.gpuModel = container.querySelector('#gpu-select').value;
                CONFIG.settings.storage = parseInt(container.querySelector('#storage-select').value);
                CONFIG.settings.storageType = container.querySelector('#storage-type-select').value;
                // Save to localStorage
                localStorage.setItem('nexus_settings', JSON.stringify(CONFIG.settings));
                // Show confirmation
                showSecretOverlay('overlay-accepted', `
                    <div class="so-big-icon">✅</div>
                    <div class="so-title">SETTINGS SAVED</div>
                    <div class="so-sub">Configuration updated successfully</div>
                    <div class="so-code">RESTARTING SYSTEM...</div>
                `, 2000);
                // Refresh monitor if open
                const monitorWin = document.querySelector('.window[data-app="monitor"]');
                if (monitorWin) {
                    // Trigger update
                    setTimeout(() => {
                        const specsEl = monitorWin.querySelector('#monitor-specs');
                        if (specsEl) {
                            specsEl.textContent = `CPU: ${CONFIG.settings.cpuModel} | RAM: ${CONFIG.settings.ram}GB | GPU: ${CONFIG.settings.gpuModel} | Storage: ${CONFIG.settings.storage}GB ${CONFIG.settings.storageType}`;
                        }
                    }, 100);
                }
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
            const speedMultiplier = SystemState.getSpeedMultiplier('cpu');
            await this.delay(CONFIG.boot.logDelay / speedMultiplier);
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

        // Load saved settings
        const savedSettings = localStorage.getItem('nexus_settings');
        if (savedSettings) {
            Object.assign(CONFIG.settings, JSON.parse(savedSettings));
        }

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
            ShortcutManager.handleKey(e);

            // Prevent browser from hijacking Alt key (menu bar focus, etc.)
            if (e.key === 'Alt') e.preventDefault();

            // Ctrl+Shift+Alt to open settings
            if (e.ctrlKey && e.shiftKey && e.altKey) {
                e.preventDefault();
                const appConfig = APPS['settings'];
                this.windowManager.create('settings', appConfig);
                const icon = document.querySelector(`[data-app="settings"]`);
                if (icon) icon.classList.add('active');
                return;
            }

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

// ==================== TOUCH SHORTCUT MANAGER ====================
// For mobile devices without keyboards
const TouchShortcutManager = {
    tapCount: 0,
    lastTapTime: 0,
    tapWindow: 500, // ms

    init() {
        const desktop = document.getElementById('desktop');
        
        // Handle touch events for mobile
        desktop.addEventListener('touchstart', (e) => {
            this.handleTap();
        });
        
        // Handle mouse clicks for desktop
        desktop.addEventListener('click', (e) => {
            // Only count left clicks
            if (e.button === 0) {
                this.handleTap();
            }
        });
    },

    handleTap() {
        const now = Date.now();
        if (now - this.lastTapTime > this.tapWindow) {
            this.tapCount = 1;
        } else {
            this.tapCount++;
        }
        this.lastTapTime = now;

        // Clear after window
        setTimeout(() => {
            if (Date.now() - this.lastTapTime >= this.tapWindow) {
                this.triggerShortcut(this.tapCount);
                this.tapCount = 0;
            }
        }, this.tapWindow + 50);
    },

    triggerShortcut(count) {
        switch(count) {
            case 3:
                showSecretOverlay('overlay-denied', `
                    <div class="so-big-icon">🚫</div>
                    <div class="so-title">ACCESS DENIED</div>
                    <div class="so-sub">INSUFFICIENT CLEARANCE LEVEL</div>
                    <div class="so-code">ERROR CODE: 403-OMEGA-7</div>
                    <div class="so-code">THIS INCIDENT HAS BEEN LOGGED</div>
                `, 4000);
                break;
            case 4:
                showSecretOverlay('overlay-accepted', `
                    <div class="so-big-icon">✅</div>
                    <div class="so-title">ACCESS ACCEPTED</div>
                    <div class="so-sub">WELCOME BACK, AGENT</div>
                    <div class="so-code">CLEARANCE: LEVEL 5 — OMEGA BLACK</div>
                    <div class="so-code">ALL SYSTEMS UNLOCKED</div>
                `, 4000);
                break;
            case 5:
                const overlay = document.createElement('div');
                overlay.className = 'secret-overlay overlay-destruct';
                let countdown = 5;
                overlay.innerHTML = `
                    <div class="so-big-icon">☢️</div>
                    <div class="so-title">SELF-DESTRUCT INITIATED</div>
                    <div class="so-countdown" id="so-countdown">5</div>
                    <div class="so-sub">ALL CLASSIFIED DATA WILL BE PURGED</div>
                    <div class="so-code">TAP ANYWHERE TO ABORT</div>
                `;
                document.body.appendChild(overlay);
                const cd = overlay.querySelector('#so-countdown');
                const interval = setInterval(() => {
                    countdown--;
                    cd.textContent = countdown;
                    if (countdown <= 0) {
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
                overlay.addEventListener('touchstart', () => { clearInterval(interval); overlay.remove(); });
                break;
            case 6:
                showSecretOverlay('overlay-encrypt', `
                    <div class="so-big-icon">🔐</div>
                    <div class="so-title">ENCRYPTING ALL FILES</div>
                    <div class="so-sub">AES-256-GCM ENCRYPTION IN PROGRESS</div>
                    <div class="so-enc-progress"><div class="so-enc-fill"></div></div>
                    <div class="so-code">SECURING: /classified /financial /personal</div>
                    <div class="so-code">DO NOT DISCONNECT</div>
                `, 5000);
                break;
            case 7:
                showSecretOverlay('overlay-fbi', `
                    <div class="so-fbi-badge">🏛️</div>
                    <div class="so-fbi-label">FEDERAL BUREAU OF INVESTIGATION</div>
                    <div class="so-title">⚠️ FBI MONITORING DETECTED ⚠️</div>
                    <div class="so-sub">YOUR SESSION IS BEING TRACED</div>
                    <div class="so-code">CASE NUMBER: 2024-CYB-774521-A</div>
                    <div class="so-code">IP ADDRESS LOGGED — COUNTERMEASURES ACTIVE</div>
                    <div class="so-code">BOUNCING THROUGH 47 PROXY NODES...</div>
                `, 5000);
                break;
            case 8:
                showSecretOverlay('overlay-satellite', `
                    <div class="so-big-icon">🛰️</div>
                    <div class="so-title">SATELLITE UPLINK ESTABLISHED</div>
                    <div class="so-sub">KEYHOLE-19 ORBITAL PLATFORM CONNECTED</div>
                    <div class="so-code">BANDWIDTH: 47.2 TB/s</div>
                    <div class="so-code">LAT: 23.4°N | LONG: 54.7°E | ALT: 400km</div>
                    <div class="so-code">ENCRYPTION: QUANTUM-SAFE LATTICE</div>
                `, 4000);
                break;
            case 9:
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
                break;
            case 10:
                showSecretOverlay('overlay-admin', `
                    <div class="so-big-icon">👑</div>
                    <div class="so-title">ADMIN OVERRIDE ACTIVATED</div>
                    <div class="so-sub">ROOT ACCESS GRANTED — ALL PERMISSIONS UNLOCKED</div>
                    <div class="so-code">$ sudo su — nexus_master</div>
                    <div class="so-code">KERNEL: UNRESTRICTED MODE ENGAGED</div>
                `, 4000);
                break;
        }
    }
};

// ==================== START SYSTEM ====================
TouchShortcutManager.init();
const OS = new CyberNexusOS();