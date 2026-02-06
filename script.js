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
        
        // Order matters: comments first, then strings, then keywords
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
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
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

        const win = {
            element,
            header,
            content,
            appName,
            minimized: false,
            maximized: false
        };

        this._setupDragging(win);
        this._setupControls(win);

        // Render app content
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

        const upHandler = () => {
            isDragging = false;
        };

        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
    }

    _setupControls(win) {
        const closeBtn = win.header.querySelector('.close');
        const minimizeBtn = win.header.querySelector('.minimize');
        const maximizeBtn = win.header.querySelector('.maximize');

        closeBtn.addEventListener('click', () => this.close(win));
        minimizeBtn.addEventListener('click', () => this.minimize(win));
        maximizeBtn.addEventListener('click', () => this.maximize(win));
    }

    close(win) {
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
        if (this.activeWindow) {
            this.activeWindow.element.style.zIndex = this.zIndex;
        }
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
                    <button class="typer-btn" data-action="clear">Clear</button>
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
                case 'clear': this.clear(); break;
            }
        });

        controls.addEventListener('change', (e) => {
            if (e.target.dataset.action === 'language') {
                this.changeLanguage(e.target.value);
            }
        });

        // Global keyboard listener
        document.addEventListener('keydown', (e) => {
            if (!this.container.closest('.window.active')) return;
            
            if (e.key === 'Escape') {
                this.stop();
            } else if (!this.isTyping && e.key.length === 1) {
                this.typeChunk();
            }
        });
    }

    start() {
        if (this.isTyping) return;
        this.isTyping = true;
        
        this.typingInterval = setInterval(() => {
            this.typeChunk();
            if (this.pointer >= this.rawText.length) {
                this.stop();
            }
        }, 50);
    }

    stop() {
        this.isTyping = false;
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
        }
    }

    reset() {
        this.stop();
        this.pointer = 0;
        this.displayText = '';
        this.updateDisplay();
    }

    clear() {
        this.stop();
        this.rawText = '';
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
        
        // Auto scroll
        screen.scrollTop = screen.scrollHeight;
    }

    changeLanguage(lang) {
        this.currentLanguage = lang;
        this.rawText = CONFIG.typerscene.examples[lang] || '';
        this.reset();
    }
}

// ==================== APP DEFINITIONS ====================
const APPS = {
    typerscene: {
        title: '⌨️ TYPERSCENE',
        render: (container) => {
            new TyperScene(container);
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
        }
    },

    monitor: {
        title: '💻 SYSTEM MONITOR',
        render: (container) => {
            container.className = 'system-monitor';
            const items = [
                { label: 'CPU', value: 87 },
                { label: 'RAM', value: 65 },
                { label: 'NETWORK', value: 92 },
                { label: 'DISK I/O', value: 45 },
                { label: 'GPU', value: 78 },
                { label: 'BANDWIDTH', value: 83 }
            ];

            items.forEach((item, i) => {
                const row = Utils.createElement('div', 'monitor-row');
                row.innerHTML = `
                    <div class="monitor-label">${item.label}</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${item.value}%; animation-delay: ${i * 0.1}s"></div>
                    </div>
                    <div class="monitor-value">${item.value}%</div>
                `;
                container.appendChild(row);
            });
        }
    },

    matrix: {
        title: '🔢 MATRIX STREAM',
        render: (container) => {
            container.className = 'matrix-display';
            const chars = '01アイウエオカキクケコ';

            const interval = setInterval(() => {
                if (container.children.length > 100) return;
                const char = Utils.createElement('div', 'matrix-char');
                char.textContent = chars[Math.floor(Math.random() * chars.length)];
                char.style.left = Math.random() * 100 + '%';
                char.style.animationDuration = (Math.random() * 3 + 2) + 's';
                container.appendChild(char);
                setTimeout(() => char.remove(), 5000);
            }, 200);

            // Cleanup when window closes
            container.cleanup = () => clearInterval(interval);
        }
    },

    globe: {
        title: '🌍 GLOBAL TRACKING',
        render: (container) => {
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
        }
    },

    terminal: {
        title: '💻 TERMINAL',
        render: (container) => {
            container.className = 'terminal-container';
            const content = Utils.createElement('div', 'terminal-content');
            content.id = 'terminal-content';
            container.appendChild(content);

            const code = `$ sudo systemctl start cyber-nexus
[OK] Starting Cyber Nexus System...
[OK] Loaded kernel modules
[OK] Network interface initialized
[OK] Security protocols active

$ cat /proc/sys/net
IPv4: 192.168.1.100
IPv6: fe80::1
Gateway: 192.168.1.1
DNS: 8.8.8.8

$ ps aux | grep cyber
root  1234  0.5  2.1  System Core
root  1235  0.3  1.8  Network Monitor
root  1236  0.1  0.9  Security Daemon

$ █`;

            let index = 0;
            const typeInterval = setInterval(() => {
                if (index < code.length) {
                    content.textContent += code[index];
                    index++;
                    container.scrollTop = container.scrollHeight;
                } else {
                    clearInterval(typeInterval);
                }
            }, 30);

            container.cleanup = () => clearInterval(typeInterval);
        }
    },

    firewall: {
        title: '🛡️ FIREWALL STATUS',
        render: (container) => {
            container.className = 'firewall-viz';

            for (let i = 0; i < 5; i++) {
                const layer = Utils.createElement('div', 'firewall-layer');
                layer.style.animationDelay = (i * 0.6) + 's';
                container.appendChild(layer);
            }

            const particleInterval = setInterval(() => {
                if (container.querySelectorAll('.attack-particle').length > 20) return;
                const particle = Utils.createElement('div', 'attack-particle');
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDuration = (Math.random() * 2 + 1) + 's';
                container.appendChild(particle);
                setTimeout(() => particle.remove(), 3000);
            }, 500);

            container.cleanup = () => clearInterval(particleInterval);
        }
    }
};

// ==================== BOOT SEQUENCE ====================
class BootSequence {
    constructor() {
        this.screen = document.getElementById('boot-screen');
        this.logs = CONFIG.boot.logs;
        this.index = 0;
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
        // Boot sequence
        const boot = new BootSequence();
        await boot.start();

        // Setup event listeners
        this.setupTaskbar();
        this.setupCursor();
        this.setupClock();
        this.setupKeyboardShortcuts();
    }

    setupTaskbar() {
        const taskbar = document.getElementById('taskbar');
        
        taskbar.addEventListener('click', (e) => {
            const icon = e.target.closest('.app-icon');
            if (!icon) return;

            const appName = icon.dataset.app;
            const appConfig = APPS[appName];
            
            if (!appConfig) return;

            // Toggle window
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
        }, 16); // ~60fps

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
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
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

            // Escape to close active window
            if (e.key === 'Escape' && this.windowManager.activeWindow) {
                this.windowManager.close(this.windowManager.activeWindow);
            }
        });
    }
}

// ==================== START SYSTEM ====================
const OS = new CyberNexusOS();
