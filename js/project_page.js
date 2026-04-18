/* setup: get project from URL */
const params = new URLSearchParams(window.location.search);
const projectKey = params.get('key');
const project = projects[projectKey];

/* reading progress bar */
const progressBar = document.getElementById('reading-progress');

if (progressBar) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;

        const progress = docHeight > 0
            ? Math.min((scrollTop / docHeight) * 100, 100)
            : 0;

        progressBar.style.width = `${progress}%`;
    }, { passive: true });
}

/* toc mobile toggle */
const tocToggle = document.getElementById('toc-toggle');
const tocMobileBody = document.getElementById('toc-mobile-body');

if (tocToggle && tocMobileBody) {
    tocToggle.addEventListener('click', () => {
        const open = tocMobileBody.classList.toggle('open');
        tocToggle.classList.toggle('open', open);
        tocToggle.setAttribute('aria-expanded', String(open));
    });
}

/* build table of contents */
function buildTOC(articleEl) {
    const headings = articleEl.querySelectorAll('h1, h2, h3');
    const listDesktop = document.getElementById('toc-list-desktop');
    const listMobile  = document.getElementById('toc-list-mobile');
    const tocEmpty    = document.getElementById('toc-empty');

    if (!listDesktop || !listMobile || !tocEmpty) return;

    listDesktop.innerHTML = '';
    listMobile.innerHTML = '';

    if (!headings.length) {
        tocEmpty.style.display = 'list-item';
        return;
    }

    tocEmpty.style.display = 'none';

    const allLinks = [];

    headings.forEach((h, i) => {
        if (!h.id) h.id = `heading-${i}`;

        const tag = h.tagName.toLowerCase();
        const text = h.textContent;

        [listDesktop, listMobile].forEach(list => {
            const li = document.createElement('li');
            li.className = `toc-${tag}`;

            const a = document.createElement('a');
            a.href = `#${h.id}`;
            a.textContent = text;

            a.addEventListener('click', e => {
                e.preventDefault();
                h.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState(null, '', `#${h.id}`);
            });

            li.appendChild(a);
            list.appendChild(li);

            if (list === listDesktop) {
                allLinks.push({ el: h, a });
            }
        });
    });

    /* highlight active section */
    function updateActive() {
        let closest = null;
        let closestOffset = Infinity;

        for (const { el, a } of allLinks) {
            const rect = el.getBoundingClientRect();
            const offset = Math.abs(rect.top - 100);

            if (rect.top <= 200 && offset < closestOffset) {
                closest = a;
                closestOffset = offset;
            }
        }

        allLinks.forEach(({ a }) => a.classList.remove('active'));
        if (closest) closest.classList.add('active');
    }

    window.addEventListener('scroll', updateActive);
    updateActive();
}

/* add copy buttons to code blocks */
function addCopyButtons(articleEl) {
    articleEl.querySelectorAll('pre').forEach(pre => {
        const wrap = document.createElement('div');
        wrap.className = 'code-block-wrapper';

        pre.parentNode.insertBefore(wrap, pre);
        wrap.appendChild(pre);

        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.textContent = 'Copy';
        btn.setAttribute('aria-label', 'Copy code');

        btn.addEventListener('click', async () => {
            const code = pre.querySelector('code')?.innerText ?? pre.innerText;

            try {
                await navigator.clipboard.writeText(code);

                btn.textContent = 'Copied!';
                btn.classList.add('copied');

                setTimeout(() => {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                }, 2000);

            } catch {
                btn.textContent = 'Error';
                setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
            }
        });

        wrap.appendChild(btn);
    });
}

/* wrap images for horizontal scroll + captions */
function wrapImages(articleEl) {
    articleEl.querySelectorAll('img').forEach(img => {
        if (img.closest('.image-row') || img.closest('.image-scroll')) return;

        const caption = img.nextElementSibling;

        const wrapper = document.createElement('div');
        wrapper.className = 'image-scroll';

        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        /* move caption if it's an <em> directly after */
        if (
            caption &&
            caption.tagName === 'EM' &&
            !caption.closest('.image-scroll')
        ) {
            wrapper.appendChild(caption);
            caption.classList.add('image-caption');
        }
    });
}

/* wrap tables for horizontal scrolling */
function wrapTables(articleEl) {
    articleEl.querySelectorAll('table').forEach(tbl => {
        if (tbl.closest('.table-wrapper')) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';

        tbl.parentNode.insertBefore(wrapper, tbl);
        wrapper.appendChild(tbl);
    });
}

/* load + render markdown */
async function renderProject(project) {
    const loadingEl = document.getElementById('loading-state');
    const errorEl   = document.getElementById('error-state');
    const contentEl = document.getElementById('content');

    try {
        if (!project.markdown) {
            throw new Error('No markdown file for this project.');
        }

        const response = await fetch(project.markdown);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const markdown = await response.text();

        /* parse markdown */
        contentEl.innerHTML = marked.parse(markdown);

        /* render math (katex) */
        renderMathInElement(contentEl, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '$',  right: '$',  display: false }
            ],
            throwOnError: false
        });

        /* syntax highlighting */
        Prism.highlightAllUnder(contentEl);

        /* enhance content */
        addCopyButtons(contentEl);
        wrapImages(contentEl);
        wrapTables(contentEl);
        buildTOC(contentEl);

        loadingEl.style.display = 'none';
        errorEl.style.display = 'none';
        contentEl.style.display = 'block';

    } catch (err) {
        console.error('Failed to load markdown:', err);

        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';

        document.getElementById('error-msg').textContent =
            `Failed to load content: ${err.message}`;
    }
}

/* setup previous/next navigation */
function setupNav(project) {
    const sidePrev  = document.getElementById('side-prev');
    const sideNext  = document.getElementById('side-next');
    const bottomNav = document.getElementById('bottom-nav');

    if (project.prev && sidePrev && bottomNav) {
        const url = `project.html?key=${project.prev.key}`;
        sidePrev.href = url;

        const a = document.createElement('a');
        a.href = url;
        a.className = 'nav-prev';
        a.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg><span class="nav-label">${project.prev.label}</span>`;

        bottomNav.appendChild(a);
    }

    if (project.next && sideNext && bottomNav) {
        const url = `project.html?key=${project.next.key}`;
        sideNext.href = url;

        const a = document.createElement('a');
        a.href = url;
        a.className = 'nav-next';
        a.innerHTML = `<span class="nav-label">${project.next.label}</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>`;

        bottomNav.appendChild(a);
    }
}

/* populate hero section */
function populateHero(project) {
    document.getElementById('project-title').textContent = project.title;
    document.getElementById('title').textContent = project.title;

    /* dates */
    document.getElementById('dates-meta').textContent =
        `${project.start} – ${project.end}`;

    /* type */
    if (project.tags?.type) {
        document.getElementById('type-meta').textContent =
            project.tags.type.charAt(0).toUpperCase() + project.tags.type.slice(1);

        document.getElementById('type-sep').style.display = 'inline';
    }

    /* state badge */
    const state = project.tags?.state;
    if (state) {
        const labels = {
            completed: 'Completed',
            wip: 'In Progress',
            planned: 'Planned'
        };

        const stateMeta = document.getElementById('state-meta');
        stateMeta.innerHTML =
            `<span class="state-badge state-${state}">${labels[state] || state}</span>`;

        document.getElementById('state-sep').style.display = 'inline';
    }

    /* summary */
    if (project.summary) {
        const s = document.getElementById('summary-text');
        s.textContent = project.summary;
        s.style.display = 'block';
    }

    /* skills */
    const skillsRow = document.getElementById('skills-row');
    (project.skills || []).forEach(skill => {
        const span = document.createElement('span');
        span.className = 'skill-pill';
        span.textContent = skill;
        skillsRow.appendChild(span);
    });

    /* links */
    const linksEl = document.getElementById('links');
    (project.links || []).forEach(link => {
        const a = document.createElement('a');
        a.className = 'link-item';
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';

        const img = document.createElement('img');
        img.className = 'icon-invert';
        img.src = link.icon;
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');

        a.appendChild(img);
        a.appendChild(document.createTextNode(link.label));

        linksEl.appendChild(a);
    });
}

/* main init */
if (!project) {
    document.getElementById('title').textContent = 'Project not found';
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('error-state').style.display = 'block';
    document.getElementById('error-msg').textContent =
        'No project found for this key.';
} else {
    populateHero(project);
    setupNav(project);
    renderProject(project);
}