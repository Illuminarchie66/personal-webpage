// ── state ──────────────────────────────────────────────────────────
let activeState = 'all';
let activeType  = 'all';
let searchQ     = '';
let sortMode    = 'default';
const allEntries = Object.entries(projects);

// ── helpers ────────────────────────────────────────────────────────
function parseDate(str) {
    if (!str || str.toLowerCase() === 'present') return new Date();
    return new Date(str);
}

function matchesFilters([key, p]) {
    if (activeState !== 'all' && p.tags?.state !== activeState) return false;
    if (activeType  !== 'all' && p.tags?.type  !== activeType)  return false;
    if (searchQ) {
    const q = searchQ.toLowerCase();
    const haystack = [p.title, p.summary, ...(p.skills||[])].join(' ').toLowerCase();
    if (!haystack.includes(q)) return false;
    }
    return true;
}

function sortedEntries(entries) {
    const copy = [...entries];
    switch (sortMode) {
    case 'newest':    return copy.sort((a,b) => parseDate(b[1].end) - parseDate(a[1].end));
    case 'oldest':    return copy.sort((a,b) => parseDate(a[1].start) - parseDate(b[1].start));
    case 'alpha':     return copy.sort((a,b) => a[1].title.localeCompare(b[1].title));
    case 'alpha-desc':return copy.sort((a,b) => b[1].title.localeCompare(a[1].title));
    default:          return copy;
    }
}

// ── render ─────────────────────────────────────────────────────────
function render() {
    const container = document.getElementById('project_list');
    const emptyState = document.getElementById('empty-state');
    const countEl   = document.getElementById('result-count');
    container.innerHTML = '';

    const filtered = sortedEntries(allEntries.filter(matchesFilters));
    countEl.textContent = `${filtered.length} project${filtered.length !== 1 ? 's' : ''}`;

    if (!filtered.length) {
    emptyState.style.display = 'block';
    return;
    }
    emptyState.style.display = 'none';

    filtered.forEach(([key, project], i) => {
    const card = document.createElement('a');
    card.href = `./${key}`;
    card.className = 'project-card';
    card.style.animationDelay = `${i * 40}ms`;

    const state = project.tags?.state || '';
    const stateLabel = { completed: 'Completed', wip: 'In Progress', planned: 'Planned' }[state] || state;
    const stateClass  = { completed: 'state-completed', wip: 'state-wip', planned: 'state-planned' }[state] || '';

    const topSkills = (project.skills || []).slice(0, 4);

    card.innerHTML = `
        <div class="card-header">
        <span class="card-title">${escHtml(project.title)}</span>
        <span class="card-date">${escHtml(project.start)} – ${escHtml(project.end)}</span>
        </div>
        ${project.summary ? `<p class="card-summary">${escHtml(project.summary)}</p>` : ''}
        <div class="card-footer">
        <div class="card-skills">
            ${topSkills.map(s => `<span class="skill-tag">${escHtml(s)}</span>`).join('')}
            ${project.skills?.length > 4 ? `<span class="skill-tag">+${project.skills.length - 4}</span>` : ''}
        </div>
        ${stateLabel ? `<span class="card-state ${stateClass}">${stateLabel}</span>` : ''}
        </div>`;

    container.appendChild(card);
    });
}

function escHtml(str) {
    return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── event wiring ───────────────────────────────────────────────────
document.getElementById('search-input').addEventListener('input', e => {
    searchQ = e.target.value.trim();
    render();
});

document.getElementById('sort-select').addEventListener('change', e => {
    sortMode = e.target.value;
    render();
});

document.querySelectorAll('[data-filter-state]').forEach(btn => {
    btn.addEventListener('click', () => {
    document.querySelectorAll('[data-filter-state]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeState = btn.dataset.filterState;
    render();
    });
});

document.querySelectorAll('[data-filter-type]').forEach(btn => {
    btn.addEventListener('click', () => {
    document.querySelectorAll('[data-filter-type]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeType = btn.dataset.filterType;
    render();
    });
});

render();