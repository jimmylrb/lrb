/**
 * 安全意识培训网站 — 通用脚本
 */

document.addEventListener('DOMContentLoaded', function() {
    // 提示气泡交互
    const triggers = document.querySelectorAll('.tip-trigger');
    
    triggers.forEach(function(trigger) {
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const tipBox = this.parentElement.querySelector('.tip-box');
            if (tipBox) {
                tipBox.classList.toggle('active');
            }
        });
    });

    // 点击其它区域关闭气泡
    document.addEventListener('click', function() {
        document.querySelectorAll('.tip-box.active').forEach(function(box) {
            box.classList.remove('active');
        });
    });

    // 阻止点击气泡本身关闭
    document.querySelectorAll('.tip-box').forEach(function(box) {
        box.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    // ========== 深色模式 ==========
    const THEME_KEY = 'sec_theme';
    const themeToggle = document.getElementById('theme-toggle');

    // 应用已保存的主题（优先于系统偏好）
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        // 更新按钮图标
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
            themeToggle.title = theme === 'dark' ? '切换到浅色模式' : '切换到深色模式';
        }
        try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    }

    // 初始化：本地保存的 > 系统偏好 > 默认浅色
    let saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
    if (!saved) {
        saved = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }
    applyTheme(saved);

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            applyTheme(isDark ? 'light' : 'dark');
        });
    }
});