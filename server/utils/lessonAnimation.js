// Lesson animations: a small step-by-step diagram that the lesson page plays in the browser (no video file).
//
// {
//   title: 'How a request travels',                       // heading above the player
//   nodes: [{ id: 'app', label: 'Your app', sub: 'Angular', col: 0, row: 0, kind: 'app' }, ...],
//   steps: [{ say: 'Caption shown (and read aloud) for this step', on: ['app'], flow: ['app>api:POST /messages'] }, ...]
// }
// col 0-3 and row 0-2 place a node on a grid. On a narrow phone the grid is turned so columns run down the page.
// `on` lights nodes up; `flow` sends a labelled packet along an arrow ("from>to" or "from>to:label").
// kind only changes colour: app, model, tool, data, store, user, check, out.

export const NODE_KINDS = ['app', 'model', 'tool', 'data', 'store', 'user', 'check', 'out'];
const ID = /^[a-z0-9][a-z0-9_-]{0,19}$/;
const str = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

const fail = (msg) => { throw new Error(`Animation: ${msg}`); };

// Returns the cleaned animation, or throws an Error with a plain message the admin can act on.
export const cleanAnimation = (a) => {
    if (a === null || a === undefined || a === '') return undefined;
    if (typeof a !== 'object' || Array.isArray(a)) fail('must be an object with title, nodes and steps.');
    const nodes = Array.isArray(a.nodes) ? a.nodes : [];
    if (nodes.length < 2 || nodes.length > 12) fail('needs 2 to 12 nodes.');
    const ids = new Set();
    const cleanNodes = nodes.map((n, i) => {
        const id = str(n?.id, 20).toLowerCase();
        if (!ID.test(id)) fail(`node ${i + 1} needs an id of lowercase letters, numbers, - or _ (up to 20 characters).`);
        if (ids.has(id)) fail(`two nodes share the id "${id}".`);
        ids.add(id);
        const label = str(n?.label, 28);
        if (!label) fail(`node "${id}" needs a label.`);
        const col = Number(n?.col), row = Number(n?.row);
        if (!Number.isInteger(col) || col < 0 || col > 3) fail(`node "${id}": col must be 0, 1, 2 or 3.`);
        if (!Number.isInteger(row) || row < 0 || row > 2) fail(`node "${id}": row must be 0, 1 or 2.`);
        return { id, label, sub: str(n?.sub, 40), col, row, kind: NODE_KINDS.includes(n?.kind) ? n.kind : 'app' };
    });
    const cells = new Set(cleanNodes.map((n) => `${n.col},${n.row}`));
    if (cells.size !== cleanNodes.length) fail('two nodes are on the same grid cell.');

    const steps = Array.isArray(a.steps) ? a.steps : [];
    if (steps.length < 2 || steps.length > 12) fail('needs 2 to 12 steps.');
    const cleanSteps = steps.map((s, i) => {
        const say = str(s?.say, 240);
        if (!say) fail(`step ${i + 1} needs a "say" caption.`);
        const on = (Array.isArray(s?.on) ? s.on : []).map((x) => str(x, 20).toLowerCase());
        for (const x of on) if (!ids.has(x)) fail(`step ${i + 1} lights up "${x}", which is not a node id.`);
        const flow = (Array.isArray(s?.flow) ? s.flow : []).slice(0, 3).map((f) => {
            let from, to, label = '';
            if (typeof f === 'string') { const m = /^([a-z0-9_-]+)>([a-z0-9_-]+)(?::(.*))?$/i.exec(f.trim()); if (!m) fail(`step ${i + 1}: flow "${f}" must look like "from>to" or "from>to:label".`); [, from, to, label = ''] = m; }
            else { from = f?.from; to = f?.to; label = f?.label || ''; }
            from = str(from, 20).toLowerCase(); to = str(to, 20).toLowerCase();
            if (!ids.has(from) || !ids.has(to) || from === to) fail(`step ${i + 1}: flow "${from}>${to}" must join two different node ids.`);
            return { from, to, label: str(label, 30) };
        });
        if (!on.length && !flow.length) fail(`step ${i + 1} must light up a node or send a flow.`);
        return { say, on, flow };
    });
    return { title: str(a.title, 90), nodes: cleanNodes, steps: cleanSteps };
};

// Plain text of an animation, for crawlers and for readers without JavaScript.
export const animationSteps = (a) => (a?.steps || []).map((s) => s.say);
