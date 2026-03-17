// ─── Sandhill Research Update — Vanilla JS ───

const LOGO_PATH = 'Sandhill_logo.png';
const STORAGE_KEY = 'sandhill-research-data';

// ─── Default Data ───
const DEFAULT_DATA = {
  date: '2026-03-16',
  performance: [
    { label: 'CEA', value: -0.0454, benchmark: 'Russell 3000 TR', benchValue: -0.00267, section: 'equity' },
    { label: 'LCY', value: 0.00194, benchmark: 'DJIA', benchValue: -0.00671, section: 'equity' },
    { label: 'Corporate Bond', value: 0.00408, benchmark: 'BAML 3-5 Yr.', benchValue: 0.00768, section: 'fixed' },
    { label: 'Preferred', value: 0.0059, benchmark: 'US Aggregate Bond', benchValue: 0.0105, section: 'fixed' },
  ],
  marketIndices: [
    { label: 'Nasdaq', value: -0.0225 },
    { label: 'Russell Mid Cap Growth', value: -0.0121 },
    { label: 'Russell 1000 Value', value: 0.0405 },
    { label: 'Russell 1000 Growth', value: -0.0436 },
  ],
  portfolioChanges: [
    { description: 'CDNS was sold.', portfolio: 'CEA', prevWeight: 0.017, newWeight: 0 },
    { description: 'ACM added to 6%', portfolio: 'CEA', prevWeight: 0.047, newWeight: 0.06 },
    { description: 'SYK added to 4%', portfolio: 'CEA', prevWeight: 0.037, newWeight: 0.04 },
  ],
  portfolioCommentary: '',
  marketCommentary: '',
  macroSections: [
    { id: 'inflation', title: 'Inflation', entries: [
      { text: 'Producer prices came in much hotter than expected for the second consecutive month.', imageUrl: '' },
      { text: 'The manufacturing price index surged to the highest level since mid-2022, with firms widely citing higher metals costs and tariffs.', imageUrl: '' },
    ]},
    { id: 'economy', title: 'Economy', entries: [
      { text: "The Atlanta Fed\u2019s GDPNow model is now tracking Q1 GDP at 2.1%, down from 3% on March 2.", imageUrl: '' },
      { text: 'The ISM Services PMI surged to the highest level since mid-2022, well above expectations.', imageUrl: '' },
      { text: 'The ISM manufacturing PMI remained firmly in expansionary territory, near the highest reading in over three years.', imageUrl: '' },
    ]},
    { id: 'jobs', title: 'Labor Market', entries: [
      { text: 'Nonfarm payrolls unexpectedly fell by 92k. Private payrolls fell by a similar 86k, the largest decline since Dec 2020.', imageUrl: '' },
      { text: 'The three-month average for total job growth cooled.', imageUrl: '' },
      { text: 'The unemployment rate edged up 10 bps to 4.4%, above consensus.', imageUrl: '' },
      { text: 'Initial jobless claims were stable at 213k, near the lowest levels of the past year.', imageUrl: '' },
    ]},
    { id: 'consumer', title: 'Consumer', entries: [
      { text: 'Mortgage rates remained stable near the lowest level since 2022.', imageUrl: '' },
      { text: 'Retail sales growth contracted in January, but by less than expected.', imageUrl: '' },
      { text: 'US consumer credit creation slowed sharply, with both revolving and non-revolving debt easing.', imageUrl: '' },
    ]},
    { id: 'fedrates', title: 'The Fed & Rates', entries: [
      { text: 'Markets are now pricing in fewer than two rate cuts for 2026.', imageUrl: '' },
      { text: 'Expectations for the first rate cut occurring in June have decreased significantly relative to a month ago.', imageUrl: '' },
    ]},
    { id: 'other', title: 'Other', entries: [
      { text: "About a fifth of the world\u2019s oil and gas supply passes through the Strait of Hormuz.", imageUrl: '' },
      { text: "The largest AI firms' capex has mushroomed to 1.3x EBITDA on a trailing 12-month basis vs. the 50% average for S&P 100.", imageUrl: '' },
    ]},
  ],
};

// ─── State ───
let state = { view: 'advisor', data: JSON.parse(JSON.stringify(DEFAULT_DATA)) };

// ─── Helpers ───
function pct(v) {
  if (v == null || isNaN(v)) return '\u2014';
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return (n > 0 ? '+' : '') + (n * 100).toFixed(2) + '%';
}
function pctCls(v) {
  const n = typeof v === 'string' ? parseFloat(v) : v;
  return n > 0 ? 'positive' : n < 0 ? 'negative' : '';
}
function wPct(v) {
  if (v == null) return '\u2014';
  return ((typeof v === 'string' ? parseFloat(v) : v) * 100).toFixed(1) + '%';
}
function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function fmtDate(d) {
  try { return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }); }
  catch { return d; }
}

// ─── Storage ───
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_DATA));
  } catch { return JSON.parse(JSON.stringify(DEFAULT_DATA)); }
}
function saveData() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data)); } catch (e) { console.error('Save failed', e); }
}

// ─── Render ───
function render() {
  document.body.className = state.view === 'admin' ? 'admin-mode' : '';
  const app = document.getElementById('app');
  app.innerHTML = renderNav() + (state.view === 'advisor' ? renderAdvisor() : renderAdmin());
  bind();
}

function renderNav() {
  const d = state.data;
  return `<nav class="sr-nav">
    <div class="sr-nav-left">
      <div class="sr-nav-logo">Sandhill<span>Research Update</span></div>
    </div>
    <div class="sr-nav-right">
      <div class="sr-tabs">
        <button class="sr-tab ${state.view === 'advisor' ? 'active' : ''}" data-view="advisor">Advisor View</button>
        <button class="sr-tab ${state.view === 'admin' ? 'active' : ''}" data-view="admin">Edit Data</button>
      </div>
      <div class="sr-date">${fmtDate(d.date)}</div>
    </div>
  </nav>`;
}

// ─── Advisor View ───
function renderAdvisor() {
  const d = state.data;
  const eq = d.performance.filter(p => p.section === 'equity');
  const fi = d.performance.filter(p => p.section === 'fixed');

  function perfRows(items) {
    return items.map((p, i) => {
      const sp = p.value - p.benchValue;
      return `<tr><td style="font-weight:600">${esc(p.label)}</td><td class="${pctCls(p.value)}">${pct(p.value)}</td></tr>
        <tr style="background:#faf9f7"><td style="color:#8a92a2;padding-left:28px;font-size:0.84rem">${esc(p.benchmark)}</td><td class="${pctCls(p.benchValue)}" style="color:#8a92a2">${pct(p.benchValue)}</td></tr>
        <tr class="spread-row"><td style="padding-left:28px">Spread</td><td class="${pctCls(sp)}">${pct(sp)}</td></tr>`;
    }).join('');
  }

  const changesHtml = d.portfolioChanges.length ? `
    <div class="sr-section">
      <div class="sr-section-header"><span class="sr-section-tag" style="background:#d0ac2b">Updates</span><h2 class="sr-section-title">Portfolio Changes</h2></div>
      <div class="sr-card"><table class="change-table">
        <thead><tr><th>Change</th><th>Portfolio</th><th>Previous</th><th>New</th></tr></thead>
        <tbody>${d.portfolioChanges.map(c => `<tr><td>${esc(c.description)}</td><td>${esc(c.portfolio)}</td><td>${wPct(c.prevWeight)}</td><td style="font-weight:600">${wPct(c.newWeight)}</td></tr>`).join('')}</tbody>
      </table></div>
    </div>` : '';

  const macroHtml = d.macroSections.map(s => `
    <div class="sr-section">
      <div class="sr-section-header"><h2 class="sr-section-title">${esc(s.title)}</h2></div>
      <div class="sr-card">${s.entries.map(e => `
        <div class="macro-entry">
          <div class="macro-entry-text">${esc(e.text)}</div>
          ${e.imageUrl ? `<img class="macro-entry-img" src="${e.imageUrl}" alt="${esc(s.title)} chart">` : ''}
        </div>`).join('')}</div>
    </div>`).join('');

  return `<div class="sr-container-wide">
    <div class="sr-two-col">
      <div>
        <div class="sr-section">
          <div class="sr-section-header"><span class="sr-section-tag">YTD</span><h2 class="sr-section-title">Performance</h2></div>
          <div class="sr-card"><table class="perf-table">
            <thead><tr><th>Strategy / Index</th><th>YTD Return</th></tr></thead>
            <tbody>
              <tr class="section-divider"><td colspan="2">Equity</td></tr>${perfRows(eq)}
              <tr class="section-divider"><td colspan="2">Fixed Income</td></tr>${perfRows(fi)}
            </tbody>
          </table></div>
        </div>
        <div class="sr-section">
          <div class="sr-section-header"><span class="sr-section-tag">Indices</span><h2 class="sr-section-title">Market Benchmarks</h2></div>
          <div class="sr-card"><table class="perf-table">
            <thead><tr><th>Index</th><th>YTD Return</th></tr></thead>
            <tbody>${d.marketIndices.map(m => `<tr><td>${esc(m.label)}</td><td class="${pctCls(m.value)}">${pct(m.value)}</td></tr>`).join('')}</tbody>
          </table></div>
        </div>
        ${changesHtml}
      </div>
      <div>
        <div class="sr-section">
          <div class="sr-section-header"><span class="sr-section-tag">Markets</span><h2 class="sr-section-title">Market Commentary</h2></div>
          <div class="sr-card">${d.marketCommentary ? `<div class="commentary-block">${esc(d.marketCommentary)}</div>` : '<div class="commentary-empty">No market commentary for this period.</div>'}</div>
        </div>
        <div class="sr-section">
          <div class="sr-section-header"><span class="sr-section-tag" style="background:#d0ac2b">Portfolio</span><h2 class="sr-section-title">Portfolio Commentary</h2></div>
          <div class="sr-card">${d.portfolioCommentary ? `<div class="commentary-block">${esc(d.portfolioCommentary)}</div>` : '<div class="commentary-empty">No portfolio commentary for this period.</div>'}</div>
        </div>
      </div>
    </div>
    <div style="margin-top:16px;margin-bottom:20px">
      <div class="gold-divider"></div>
      <h2 style="font-family:'Playfair Display',serif;font-size:1.6rem;color:#004465;font-weight:700;margin-bottom:4px">Macro Environment</h2>
      <p style="font-size:0.88rem;color:#8a92a2">Key data and trends from the past two weeks</p>
    </div>
    ${macroHtml}
    <div class="sr-footer">Sandhill Investment Management \u2014 For internal use only</div>
  </div>`;
}

// ─── Admin View ───
function renderAdmin() {
  const d = state.data;

  const perfHtml = d.performance.map((p, i) => `
    <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:${i < d.performance.length - 1 ? '1px solid #f0ede8' : 'none'}">
      <div class="admin-row" style="margin-bottom:8px">
        <div class="admin-field" style="flex:1"><label class="admin-label">Strategy</label><input class="admin-input" data-perf="${i}" data-field="label" value="${esc(p.label)}"></div>
        <div class="admin-field" style="width:120px"><label class="admin-label">YTD (decimal)</label><input class="admin-input" type="number" step="0.0001" data-perf="${i}" data-field="value" value="${p.value}"></div>
        <div class="admin-field" style="width:100px"><label class="admin-label">Section</label>
          <select class="admin-input" data-perf="${i}" data-field="section"><option value="equity" ${p.section === 'equity' ? 'selected' : ''}>Equity</option><option value="fixed" ${p.section === 'fixed' ? 'selected' : ''}>Fixed</option></select>
        </div>
      </div>
      <div class="admin-row">
        <div class="admin-field" style="flex:1"><label class="admin-label">Benchmark</label><input class="admin-input" data-perf="${i}" data-field="benchmark" value="${esc(p.benchmark)}"></div>
        <div class="admin-field" style="width:120px"><label class="admin-label">Bench YTD</label><input class="admin-input" type="number" step="0.0001" data-perf="${i}" data-field="benchValue" value="${p.benchValue}"></div>
      </div>
    </div>`).join('');

  const indicesHtml = d.marketIndices.map((m, i) => `
    <div class="admin-row" style="margin-bottom:8px">
      <div class="admin-field" style="flex:1"><input class="admin-input" data-idx="${i}" data-field="label" value="${esc(m.label)}"></div>
      <div class="admin-field" style="width:120px"><input class="admin-input" type="number" step="0.0001" data-idx="${i}" data-field="value" value="${m.value}"></div>
    </div>`).join('');

  const changesHtml = d.portfolioChanges.map((c, i) => `
    <div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #f0ede8;display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap">
      <div class="admin-field" style="flex:2"><label class="admin-label">Description</label><input class="admin-input" data-chg="${i}" data-field="description" value="${esc(c.description)}"></div>
      <div class="admin-field" style="width:80px"><label class="admin-label">Portfolio</label><input class="admin-input" data-chg="${i}" data-field="portfolio" value="${esc(c.portfolio)}"></div>
      <div class="admin-field" style="width:80px"><label class="admin-label">Prev Wt</label><input class="admin-input" type="number" step="0.001" data-chg="${i}" data-field="prevWeight" value="${c.prevWeight}"></div>
      <div class="admin-field" style="width:80px"><label class="admin-label">New Wt</label><input class="admin-input" type="number" step="0.001" data-chg="${i}" data-field="newWeight" value="${c.newWeight}"></div>
      <button class="admin-btn admin-btn-danger" data-remove-chg="${i}" style="margin-bottom:12px">\u2715</button>
    </div>`).join('');

  const macroHtml = d.macroSections.map((s, si) => `
    <div class="sr-section">
      <div class="sr-section-header"><h2 class="sr-section-title">${esc(s.title)}</h2></div>
      <div class="sr-card" style="padding:20px">
        ${s.entries.map((e, ei) => `
          <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:${ei < s.entries.length - 1 ? '1px solid #f0ede8' : 'none'}">
            <div style="display:flex;gap:8px;align-items:flex-start">
              <div style="flex:1"><label class="admin-label">Commentary</label><textarea class="admin-input admin-textarea" data-macro="${si}" data-entry="${ei}" data-field="text">${esc(e.text)}</textarea></div>
              <button class="admin-btn admin-btn-danger" data-remove-macro="${si}" data-remove-entry="${ei}" style="margin-top:18px">\u2715</button>
            </div>
            <div style="margin-top:8px">
              <label class="admin-label">Chart / Graph (paste, drag, or click)</label>
              <div class="img-drop-zone" data-imgzone="${si}-${ei}" tabindex="0">
                <div class="img-drop-zone-icon">\uD83D\uDCCA</div>
                <div class="img-drop-zone-label">Paste, drag & drop, or click to add a chart</div>
                <div class="img-drop-zone-sublabel">Click here first, then Ctrl+V to paste from clipboard</div>
                <input type="file" accept="image/*" data-imgfile="${si}-${ei}">
              </div>
              ${e.imageUrl ? `<div class="img-preview-wrap" data-imgpreview="${si}-${ei}"><img src="${e.imageUrl}" alt="Chart"><button class="img-remove-btn" data-imgremove="${si}-${ei}">\u2715</button></div>` : ''}
            </div>
          </div>`).join('')}
        <button class="admin-btn admin-btn-secondary" data-add-macro="${si}">+ Add Entry</button>
      </div>
    </div>`).join('');

  return `<div class="sr-container" style="padding-bottom:100px">
    <div class="sr-section">
      <div class="sr-section-header"><h2 class="sr-section-title">Report Date</h2></div>
      <div class="sr-card" style="padding:20px">
        <div class="admin-field"><label class="admin-label">Date</label><input type="date" class="admin-input" id="admin-date" style="max-width:200px" value="${d.date}"></div>
      </div>
    </div>
    <div class="sr-section">
      <div class="sr-section-header"><span class="sr-section-tag">YTD</span><h2 class="sr-section-title">Performance Data</h2></div>
      <div class="sr-card" style="padding:20px">${perfHtml}</div>
    </div>
    <div class="sr-section">
      <div class="sr-section-header"><span class="sr-section-tag">Indices</span><h2 class="sr-section-title">Market Benchmarks</h2></div>
      <div class="sr-card" style="padding:20px">${indicesHtml}</div>
    </div>
    <div class="sr-section">
      <div class="sr-section-header"><span class="sr-section-tag" style="background:#d0ac2b">Updates</span><h2 class="sr-section-title">Portfolio Changes</h2></div>
      <div class="sr-card" style="padding:20px">${changesHtml}<button class="admin-btn admin-btn-secondary" id="add-change">+ Add Change</button></div>
    </div>
    <div class="sr-section">
      <div class="sr-section-header"><span class="sr-section-tag">Markets</span><h2 class="sr-section-title">Market Commentary</h2></div>
      <div class="sr-card" style="padding:20px"><textarea class="admin-input admin-textarea" id="admin-market-commentary" style="min-height:120px" placeholder="Enter market commentary \u2014 appears on the right side of the advisor view alongside performance data...">${esc(d.marketCommentary || '')}</textarea></div>
    </div>
    <div class="sr-section">
      <div class="sr-section-header"><span class="sr-section-tag" style="background:#d0ac2b">Portfolio</span><h2 class="sr-section-title">Portfolio Commentary</h2></div>
      <div class="sr-card" style="padding:20px"><textarea class="admin-input admin-textarea" id="admin-portfolio-commentary" style="min-height:100px" placeholder="Enter portfolio commentary for advisors...">${esc(d.portfolioCommentary || '')}</textarea></div>
    </div>
    <div style="margin-top:48px;margin-bottom:20px"><div class="gold-divider"></div><h2 style="font-family:'Playfair Display',serif;font-size:1.6rem;color:#004465;font-weight:700">Macro Sections</h2></div>
    ${macroHtml}
  </div>
  <div class="admin-save-bar">
    <button class="admin-reset-btn" id="reset-btn">Reset to Default</button>
    <button class="admin-save-btn" id="save-btn">Save Changes</button>
  </div>`;
}

// ─── Event Binding ───
function bind() {
  // Nav tabs
  document.querySelectorAll('.sr-tab').forEach(btn => {
    btn.addEventListener('click', () => { state.view = btn.dataset.view; render(); });
  });

  if (state.view !== 'admin') return;

  // Date
  const dateEl = document.getElementById('admin-date');
  if (dateEl) dateEl.addEventListener('change', e => { state.data.date = e.target.value; });

  // Performance
  document.querySelectorAll('[data-perf]').forEach(el => {
    el.addEventListener('input', () => {
      const i = +el.dataset.perf, f = el.dataset.field;
      state.data.performance[i][f] = (f === 'label' || f === 'benchmark' || f === 'section') ? el.value : parseFloat(el.value) || 0;
    });
  });

  // Market indices
  document.querySelectorAll('[data-idx]').forEach(el => {
    el.addEventListener('input', () => {
      const i = +el.dataset.idx, f = el.dataset.field;
      state.data.marketIndices[i][f] = f === 'label' ? el.value : parseFloat(el.value) || 0;
    });
  });

  // Portfolio changes
  document.querySelectorAll('[data-chg]').forEach(el => {
    el.addEventListener('input', () => {
      const i = +el.dataset.chg, f = el.dataset.field;
      state.data.portfolioChanges[i][f] = (f === 'prevWeight' || f === 'newWeight') ? parseFloat(el.value) || 0 : el.value;
    });
  });
  document.querySelectorAll('[data-remove-chg]').forEach(btn => {
    btn.addEventListener('click', () => { state.data.portfolioChanges.splice(+btn.dataset.removeChg, 1); render(); });
  });
  const addChgBtn = document.getElementById('add-change');
  if (addChgBtn) addChgBtn.addEventListener('click', () => { state.data.portfolioChanges.push({ description: '', portfolio: '', prevWeight: 0, newWeight: 0 }); render(); });

  // Commentary
  const mcEl = document.getElementById('admin-market-commentary');
  if (mcEl) mcEl.addEventListener('input', e => { state.data.marketCommentary = e.target.value; });
  const pcEl = document.getElementById('admin-portfolio-commentary');
  if (pcEl) pcEl.addEventListener('input', e => { state.data.portfolioCommentary = e.target.value; });

  // Macro entries
  document.querySelectorAll('[data-macro]').forEach(el => {
    if (el.dataset.field) {
      el.addEventListener('input', () => {
        state.data.macroSections[+el.dataset.macro].entries[+el.dataset.entry][el.dataset.field] = el.value;
      });
    }
  });
  document.querySelectorAll('[data-remove-macro]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.data.macroSections[+btn.dataset.removeMacro].entries.splice(+btn.dataset.removeEntry, 1);
      render();
    });
  });
  document.querySelectorAll('[data-add-macro]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.data.macroSections[+btn.dataset.addMacro].entries.push({ text: '', imageUrl: '' });
      render();
    });
  });

  // Image drop zones
  bindImageZones();

  // Save / Reset
  const saveBtn = document.getElementById('save-btn');
  if (saveBtn) saveBtn.addEventListener('click', () => {
    saveData();
    showToast('Changes saved');
  });
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', () => {
    state.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    saveData();
    render();
  });
}

function bindImageZones() {
  function processFile(file, si, ei) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => { state.data.macroSections[si].entries[ei].imageUrl = ev.target.result; render(); };
    reader.readAsDataURL(file);
  }

  document.querySelectorAll('.img-drop-zone').forEach(zone => {
    const [si, ei] = zone.dataset.imgzone.split('-').map(Number);

    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
      e.preventDefault(); zone.classList.remove('drag-over');
      const file = e.dataTransfer?.files?.[0];
      if (file) { processFile(file, si, ei); return; }
      const html = e.dataTransfer?.getData('text/html');
      if (html) { const m = html.match(/src="([^"]+)"/); if (m) { state.data.macroSections[si].entries[ei].imageUrl = m[1]; render(); } }
    });
    zone.addEventListener('paste', e => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) { e.preventDefault(); processFile(item.getAsFile(), si, ei); return; }
      }
    });
  });

  document.querySelectorAll('[data-imgfile]').forEach(input => {
    const [si, ei] = input.dataset.imgfile.split('-').map(Number);
    input.addEventListener('change', e => { if (e.target.files?.[0]) processFile(e.target.files[0], si, ei); });
  });

  document.querySelectorAll('[data-imgremove]').forEach(btn => {
    const [si, ei] = btn.dataset.imgremove.split('-').map(Number);
    btn.addEventListener('click', () => { state.data.macroSections[si].entries[ei].imageUrl = ''; render(); });
  });
}

function showToast(msg) {
  let t = document.querySelector('.toast');
  if (t) t.remove();
  t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2000);
}

// ─── Init ───
state.data = loadData();
render();
