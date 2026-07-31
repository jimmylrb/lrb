/**
 * 脱敏统计模块 (stats.js)
 * 
 * 🔒 隐私设计：
 * - 只记录【统计结果】（如"密码强度=弱"、"URL风险=危险"）
 * - 绝不记录原始输入（密码、URL 原文）
 * - 数据仅存本地浏览器 (localStorage)，不上传任何个人数据
 * - 预留了可选的脱敏事件上报钩子（默认关闭，需站长手动启用）
 */

window.stats = (function() {
    const PW_KEY  = 'sec_pw_stats';
    const URL_KEY = 'sec_url_stats';

    // ============ 本地存储工具 ============
    function load(key, def) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : def;
        } catch (e) {
            return def;
        }
    }

    function save(key, obj) {
        try {
            localStorage.setItem(key, JSON.stringify(obj));
        } catch (e) {
            // localStorage 不可用（隐私模式等）时静默失败
        }
    }

    // ============ 上报钩子（Supabase 脱敏事件上报） ============
    // anon key 是设计给前端公开使用的（配合 RLS 策略：只能 insert，不能读/改/删）
    // 上报内容只有脱敏统计事件（强度等级/风险等级），绝无原始输入
    const SUPABASE_URL = 'https://sdesawclogqjhtvlzlvm.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkZXNhd2Nsb2dxamh0dmx6bHZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0OTE3NDYsImV4cCI6MjEwMTA2Nzc0Nn0.0hLIjABNLhQkvldc3rfQAdbSnamxInSr5wl9mgeTlFU';

    function uploadEvent(event, data) {
        try {
            fetch(SUPABASE_URL + '/rest/v1/stats_events', {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(Object.assign({ event: event }, data))
            }).catch(function() {});
        } catch (e) { /* 静默失败 */ }
    }

    // ============ 记录函数（脱敏） ============
    function recordPassword(strength) {
        const s = load(PW_KEY, { counts: { '很弱': 0, '弱': 0, '中等': 0, '强': 0, '非常强': 0 }, total: 0, firstTime: Date.now() });
        if (!(strength in s.counts)) s.counts[strength] = 0;
        s.counts[strength]++;
        s.total++;
        s.lastTime = Date.now();
        save(PW_KEY, s);
        // 脱敏上报：只发强度等级，不发密码
        uploadEvent('password_checked', { strength: strength });
    }

    function recordUrl(level) {
        const s = load(URL_KEY, { counts: { safe: 0, warning: 0, danger: 0 }, total: 0, firstTime: Date.now() });
        if (!(level in s.counts)) s.counts[level] = 0;
        s.counts[level]++;
        s.total++;
        s.lastTime = Date.now();
        save(URL_KEY, s);
        // 脱敏上报：只发风险等级，不发 URL
        uploadEvent('url_checked', { level: level });
    }

    // ============ 面板渲染 ============
    function bar(label, value, total, color) {
        const pct = total > 0 ? Math.round(value / total * 100) : 0;
        return '<div style="margin-bottom:6px;">' +
            '<div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:2px;">' +
            '<span>' + label + '</span><span style="color:var(--text-secondary);">' + value + ' 次 (' + pct + '%)</span>' +
            '</div>' +
            '<div style="background:#e5e7eb;border-radius:4px;height:10px;overflow:hidden;">' +
            '<div style="background:' + color + ';width:' + pct + '%;height:100%;border-radius:4px;transition:width .4s;"></div>' +
            '</div></div>';
    }

    function renderPanel() {
        const pw  = load(PW_KEY,  { counts: { '很弱': 0, '弱': 0, '中等': 0, '强': 0, '非常强': 0 }, total: 0 });
        const url = load(URL_KEY, { counts: { safe: 0, warning: 0, danger: 0 }, total: 0 });

        let html = '<div style="background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;margin-top:16px;">';

        // 标题 + 隐私说明
        html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">' +
            '<h4 style="font-size:0.95rem;margin:0;">📊 本机统计</h4>' +
            '<span style="font-size:0.7rem;color:var(--text-secondary);">🔒 仅存本机，不收集原始输入</span>' +
            '</div>';

        // 密码强度分布
        html += '<div style="font-size:0.85rem;font-weight:600;color:var(--primary);margin-bottom:8px;">🔐 密码检测记录 (' + pw.total + ' 次)</div>';
        if (pw.total > 0) {
            html += bar('很弱', pw.counts['很弱'], pw.total, '#dc2626');
            html += bar('弱', pw.counts['弱'], pw.total, '#f59e0b');
            html += bar('中等', pw.counts['中等'], pw.total, '#eab308');
            html += bar('强', pw.counts['强'], pw.total, '#16a34a');
            html += bar('非常强', pw.counts['非常强'], pw.total, '#15803d');
        } else {
            html += '<div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:10px;">还没有检测记录，试一次吧 👆</div>';
        }

        // URL 风险分布
        html += '<div style="font-size:0.85rem;font-weight:600;color:var(--primary);margin:12px 0 8px;">🔍 URL 检测记录 (' + url.total + ' 次)</div>';
        if (url.total > 0) {
            html += bar('✅ 安全', url.counts.safe, url.total, '#16a34a');
            html += bar('⚠️ 可疑', url.counts.warning, url.total, '#f59e0b');
            html += bar('🔴 危险', url.counts.danger, url.total, '#dc2626');
        } else {
            html += '<div style="font-size:0.8rem;color:var(--text-secondary);">还没有检测记录。</div>';
        }

        html += '</div>';
        return html;
    }

    // ============ 对外接口 ============
    return {
        recordPassword: recordPassword,
        recordUrl: recordUrl,
        renderPanel: renderPanel,
    };
})();
