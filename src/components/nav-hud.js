/**
 * Gaming Wiki - Floating Navigation HUD (Header)
 * Isolated via Shadow DOM to prevent any CSS conflicts with AI-generated HTML
 */
class WikiNavHud extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isCollapsed = false;
  }

  connectedCallback() {
    const title = this.getAttribute('title') || document.title || 'Guide Game';
    const game = this.getAttribute('game') || 'Wiki Game';
    const homeUrl = this.getAttribute('home-url') || '../index.html';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          all: initial;
          display: block;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 2147483640;
          box-sizing: border-box;
        }

        *, *::before, *::after {
          box-sizing: border-box;
        }

        .hud-container {
          background: rgba(11, 15, 25, 0.92);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(56, 189, 248, 0.22);
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.45), 0 1px 0 rgba(255, 255, 255, 0.05);
          color: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 20px;
          gap: 16px;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        }

        .hud-container.collapsed {
          transform: translateY(-100%);
          pointer-events: none;
        }

        .left-section {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9));
          border: 1px solid rgba(56, 189, 248, 0.35);
          border-radius: 8px;
          color: #38bdf8;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .back-btn:hover {
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(14, 165, 233, 0.1));
          border-color: #38bdf8;
          color: #ffffff;
          box-shadow: 0 0 14px rgba(56, 189, 248, 0.35);
          transform: translateX(-2px);
        }

        .guide-info {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .game-badge {
          background: rgba(139, 92, 246, 0.22);
          border: 1px solid rgba(168, 85, 247, 0.4);
          color: #c084fc;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 3px 9px;
          border-radius: 9999px;
          white-space: nowrap;
        }

        .guide-title {
          font-size: 14px;
          font-weight: 600;
          color: #e2e8f0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 480px;
        }

        .right-section {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .hud-btn {
          background: rgba(30, 41, 59, 0.7);
          border: 1px solid rgba(148, 163, 184, 0.15);
          color: #94a3b8;
          padding: 7px 11px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .hud-btn:hover {
          background: rgba(51, 65, 85, 0.9);
          border-color: rgba(148, 163, 184, 0.35);
          color: #f8fafc;
        }

        .hud-btn.active {
          color: #38bdf8;
          border-color: #38bdf8;
        }

        /* Floating Trigger when Collapsed */
        .reopen-trigger {
          position: fixed;
          top: 12px;
          right: 16px;
          z-index: 2147483641;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(56, 189, 248, 0.4);
          color: #38bdf8;
          padding: 6px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          display: none;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
          transition: all 0.2s ease;
        }

        .reopen-trigger:hover {
          background: #0284c7;
          color: #ffffff;
          transform: scale(1.05);
        }

        .toast {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #0f172a;
          border: 1px solid #38bdf8;
          color: #38bdf8;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
          pointer-events: none;
          z-index: 2147483647;
        }

        .toast.show {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .guide-title {
            display: none;
          }
          .hud-container {
            padding: 8px 12px;
          }
          .btn-text {
            display: none;
          }
        }
      </style>

      <div class="hud-container" id="hudContainer">
        <div class="left-section">
          <a href="${homeUrl}" class="back-btn" title="Trở về danh sách Guide (Phím tắt: Esc)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Trang Chủ</span>
          </a>

          <div class="guide-info">
            <span class="game-badge">${this.escapeHtml(game)}</span>
            <span class="guide-title" title="${this.escapeHtml(title)}">${this.escapeHtml(title)}</span>
          </div>
        </div>

        <div class="right-section">
          <button class="hud-btn" id="copyBtn" title="Sao chép liên kết guide này">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span class="btn-text">Copy link</span>
          </button>

          <button class="hud-btn" id="printBtn" title="In hoặc lưu dạng PDF để đọc offline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
            <span class="btn-text">In / PDF</span>
          </button>

          <button class="hud-btn" id="fullscreenBtn" title="Bật/Tắt chế độ toàn màn hình khi cày game">
            <svg id="fsIcon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
            <span class="btn-text">Toàn màn hình</span>
          </button>

          <button class="hud-btn" id="collapseBtn" title="Thu gọn thanh HUD để nhìn thoáng hơn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <button class="reopen-trigger" id="reopenTrigger" title="Mở lại thanh điều hướng HUD">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
        <span>Hiện Menu</span>
      </button>

      <div class="toast" id="toast">Đã sao chép liên kết vào clipboard!</div>
    `;

    this.bindEvents(homeUrl);
  }

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  showToast(msg) {
    const toast = this.shadowRoot.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }

  bindEvents(homeUrl) {
    const hudContainer = this.shadowRoot.getElementById('hudContainer');
    const collapseBtn = this.shadowRoot.getElementById('collapseBtn');
    const reopenTrigger = this.shadowRoot.getElementById('reopenTrigger');
    const copyBtn = this.shadowRoot.getElementById('copyBtn');
    const printBtn = this.shadowRoot.getElementById('printBtn');
    const fullscreenBtn = this.shadowRoot.getElementById('fullscreenBtn');

    // Collapse / Expand
    collapseBtn.addEventListener('click', () => {
      hudContainer.classList.add('collapsed');
      reopenTrigger.style.display = 'inline-flex';
    });

    reopenTrigger.addEventListener('click', () => {
      hudContainer.classList.remove('collapsed');
      reopenTrigger.style.display = 'none';
    });

    // Copy link
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.showToast('✅ Đã copy link bài guide!');
      }).catch(() => {
        this.showToast('Link: ' + window.location.href);
      });
    });

    // Print
    printBtn.addEventListener('click', () => {
      window.print();
    });

    // Fullscreen toggle
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        fullscreenBtn.classList.add('active');
      } else {
        document.exitFullscreen().catch(() => {});
        fullscreenBtn.classList.remove('active');
      }
    });

    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        fullscreenBtn.classList.remove('active');
      } else {
        fullscreenBtn.classList.add('active');
      }
    });

    // Keyboard navigation (Esc -> go to home)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !e.target.matches('input, textarea')) {
        window.location.href = homeUrl;
      }
    });
  }
}

if (!customElements.get('wiki-nav-hud')) {
  customElements.define('wiki-nav-hud', WikiNavHud);
}
