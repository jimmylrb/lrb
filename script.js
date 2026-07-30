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
});