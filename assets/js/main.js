/* ============================================================
   ZBL Craft Launcher 官网脚本
   ============================================================ */

/* ------------------------------------------------------------
 * 版本号集中定义：以后发新版只改这里（和 download/ 里的文件名）
 * ------------------------------------------------------------ */
const LAUNCHER_VERSION = '1.0.0';
const LAUNCHER_SIZE_MB = '5.3';

(function applyVersion() {
  const dlName = `ZBL-Craft-Launcher-v${LAUNCHER_VERSION}.exe`;
  // 填充所有 [data-version]
  document.querySelectorAll('[data-version]').forEach(el => {
    el.textContent = `v${LAUNCHER_VERSION}`;
  });
  // 填充所有 [data-size]
  document.querySelectorAll('[data-size]').forEach(el => {
    el.textContent = LAUNCHER_SIZE_MB;
  });
  // 更新下载按钮与 hero 主按钮的链接
  document.querySelectorAll('a[href$=".exe"]').forEach(a => {
    a.setAttribute('href', `download/${dlName}`);
  });
})();

/* ---------------- 导航栏滚动状态 ---------------- */
const nav = document.getElementById('nav');
const toTop = document.getElementById('toTop');

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 30);
  toTop.classList.toggle('show', y > 600);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------------- 滚动渐入（交错延迟） ---------------- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  // 同一容器内的兄弟元素做交错
  const siblings = el.parentElement
    ? Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'))
    : [el];
  const idx = siblings.indexOf(el);
  el.style.setProperty('--rd', `${Math.min(idx, 6) * 90}ms`);
  revealObserver.observe(el);
});

/* ---------------- 卡片 3D 倾斜跟随 ---------------- */
const isFinePointer = window.matchMedia('(pointer: fine)').matches;

if (isFinePointer) {
  document.querySelectorAll('[data-tilt]').forEach(el => {
    const target = el.matches('.hero-shot') || el.matches('.dl-card')
      ? el
      : el;
    const inner = el.querySelector('img');
    const strength = el.classList.contains('card') ? 7 : 5;

    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      if (inner && el.classList.contains('hero-shot')) {
        inner.style.transform =
          `rotateY(${x * strength}deg) rotateX(${-y * strength}deg) translateZ(0)`;
      } else if (!el.classList.contains('card')) {
        el.style.transform = `translateY(-8px) rotateX(${-y * strength * 0.5}deg)`;
      }
    });

    el.addEventListener('mouseleave', () => {
      if (inner && el.classList.contains('hero-shot')) {
        inner.style.transform = '';
      } else if (!el.classList.contains('card')) {
        el.style.transform = '';
      }
    });
  });

  /* 跟随光晕（用 rAF 节流，丝滑不卡） */
  const glow = document.getElementById('cursorGlow');
  let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
  let tx = gx, ty = gy;
  window.addEventListener('mousemove', e => {
    tx = e.clientX;
    ty = e.clientY;
  }, { passive: true });

  (function glowLoop() {
    gx += (tx - gx) * 0.08;
    gy += (ty - gy) * 0.08;
    glow.style.left = `${gx}px`;
    glow.style.top = `${gy}px`;
    requestAnimationFrame(glowLoop);
  })();
} else {
  const g = document.getElementById('cursorGlow');
  if (g) g.style.display = 'none';
}

/* ---------------- 截图无缝跑马灯（克隆一份） ---------------- */
(function setupMarquee() {
  const track = document.getElementById('marqueeTrack');
  if (!track) return;
  // CSS 动画位移 -50% 需要内容恰好两份
  track.innerHTML += track.innerHTML;
})();

/* ---------------- FAQ 手风琴：一次只开一个 ---------------- */
document.querySelectorAll('.faq').forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      document.querySelectorAll('.faq[open]').forEach(other => {
        if (other !== item) other.open = false;
      });
    }
  });
});
