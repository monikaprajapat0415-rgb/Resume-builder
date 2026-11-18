// What an "editor" may do under /api/admin. Default is NO: anything not listed here is admin only.
// Editors write and publish content and moderate; they cannot delete, change settings, users, plans, ads,
// menus, pages, products, tools, backups, job sources, the activity log or anything about money.
const WRITE = ['blogs', 'learn', 'roadmaps', 'community', 'inbox', 'feedback', 'bulk', 'categories', 'upload'];
const READ_ONLY = ['stats', 'visits', 'site-health'];

export const editorMayUse = (method, path, body = {}) => {
    const first = String(path || '').split('?')[0].split('/').filter(Boolean)[0];
    if (!first) return false;
    const m = String(method).toUpperCase();
    if (READ_ONLY.includes(first)) return m === 'GET';
    if (!WRITE.includes(first)) return false;
    if (m === 'DELETE') return false;                                  // deleting stays with admins
    if (first === 'bulk' && body && body.action === 'delete') return false;
    if (first === 'inbox' && body && body.action === 'delete') return false;
    return true;
};
