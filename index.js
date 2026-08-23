/**
 * Cloudflare Worker 欢迎页面
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 简单路由：/health 返回健康检查
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', time: Date.now() }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const html = welcomePage(url.origin);
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  },
};

function welcomePage(origin) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Welcome · Cloudflare Worker</title>
<style>
  :root {
    --bg1: #0f172a;
    --bg2: #1e1b4b;
    --bg3: #172554;
    --text: #e2e8f0;
    --muted: #94a3b8;
    --accent: #38bdf8;
    --accent2: #a78bfa;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
      'Microsoft YaHei', sans-serif;
    background: linear-gradient(135deg, var(--bg1) 0%, var(--bg2) 45%, var(--bg3) 100%);
    color: var(--text);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    overflow-x: hidden;
    position: relative;
  }

  /* 背景光斑 */
  .blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.45;
    z-index: 0;
    pointer-events: none;
  }
  .blob-1 { width: 480px; height: 480px; background: #2563eb; top: -120px; left: -100px; animation: float 12s ease-in-out infinite; }
  .blob-2 { width: 380px; height: 380px; background: #7c3aed; bottom: -100px; right: -80px; animation: float 16s ease-in-out infinite reverse; }
  .blob-3 { width: 260px; height: 260px; background: #06b6d4; top: 50%; left: 55%; animation: float 20s ease-in-out infinite; }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -30px) scale(1.08); }
    66% { transform: translate(-25px, 25px) scale(0.95); }
  }

  .card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 720px;
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 24px;
    padding: 48px 40px;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.35);
    animation: rise 0.8s ease-out both;
  }

  @keyframes rise {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    background: linear-gradient(90deg, rgba(56, 189, 248, 0.15), rgba(167, 139, 250, 0.15));
    border: 1px solid rgba(56, 189, 248, 0.3);
    color: #bae6fd;
    margin-bottom: 24px;
  }

  .badge .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 10px #4ade80;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  h1 {
    font-size: clamp(32px, 5vw, 52px);
    font-weight: 800;
    line-height: 1.15;
    margin-bottom: 16px;
    background: linear-gradient(120deg, #e0f2fe 0%, var(--accent) 40%, var(--accent2) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle {
    font-size: 17px;
    color: var(--muted);
    line-height: 1.7;
    margin-bottom: 36px;
  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 36px;
  }

  .feature {
    padding: 20px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
  }

  .feature:hover {
    transform: translateY(-4px);
    border-color: rgba(56, 189, 248, 0.4);
    background: rgba(56, 189, 248, 0.08);
  }

  .feature .icon { font-size: 26px; margin-bottom: 12px; display: block; }
  .feature h3 { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
  .feature p { font-size: 13px; color: var(--muted); line-height: 1.6; }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 13px;
    color: var(--muted);
  }

  .status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 999px;
    background: rgba(74, 222, 128, 0.1);
    border: 1px solid rgba(74, 222, 128, 0.25);
    color: #86efac;
    font-weight: 600;
    cursor: pointer;
    user-select: none;
    transition: transform 0.2s ease;
  }

  .status:hover { transform: scale(1.05); }

  .status .dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 8px #4ade80;
  }

  .hidden { display: none; }

  @media (max-width: 560px) {
    .card { padding: 36px 24px; }
    .footer { justify-content: center; text-align: center; }
  }
</style>
</head>
<body>
  <div class="blob blob-1"></div>
  <div class="blob blob-2"></div>
  <div class="blob blob-3"></div>

  <main class="card">
    <span class="badge"><span class="dot"></span>Cloudflare Workers 在线</span>

    <h1>欢迎来到我的云端小站</h1>

    <p class="subtitle">
      这是一个运行在 Cloudflare 全球边缘网络上的欢迎页面，
      由 Worker 动态渲染，毫秒级响应，分布在全球 300+ 个节点。
    </p>

    <div class="features">
      <div class="feature">
        <span class="icon">⚡</span>
        <h3>极速响应</h3>
        <p>全球边缘节点就近响应，冷启动接近零延迟。</p>
      </div>
      <div class="feature">
        <span class="icon">🌍</span>
        <h3>全球覆盖</h3>
        <p>300+ 城市边缘节点，自动就近路由。</p>
      </div>
      <div class="feature">
        <span class="icon">🛡️</span>
        <h3>安全可靠</h3>
        <p>内置 DDoS 防护与 TLS 加密，开箱即用。</p>
      </div>
    </div>

    <div class="footer">
      <span>${dateStr} · 由 Worker 动态生成</span>
      <span class="status" onclick="toggleHealth()">
        <span class="dot"></span>
        <span id="healthText">点击检测服务状态</span>
      </span>
    </div>
  </main>

<script>
  const startTime = performance.now();

  async function toggleHealth() {
    const el = document.getElementById('healthText');
    el.textContent = '检测中…';
    try {
      const res = await fetch('${origin}/health');
      const data = await res.json();
      el.textContent = res.ok ? '服务正常 · ' + Math.round(performance.now() - startTime) + 'ms' : '服务异常';
      document.querySelector('.status .dot').style.background = res.ok ? '#4ade80' : '#f87171';
    } catch (e) {
      el.textContent = '无法连接服务';
      document.querySelector('.status .dot').style.background = '#f87171';
    }
  }
</script>
</body>
</html>`;
}
