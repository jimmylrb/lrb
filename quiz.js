/**
 * 安全意识培训 — 钓鱼识别测验
 */

const questions = [
    {
        id: 1,
        question: '你收到一封来自"XX银行"的邮件，要求点击链接验证账户信息，否则账户将在24小时内冻结。这是钓鱼攻击吗？',
        options: ['是，这是典型的钓鱼攻击', '不是，这是正常的银行安全流程'],
        correct: 0,
        explanation: '✅ 正确！正规银行不会通过邮件要求点击链接验证账户。制造"24小时内冻结"的紧迫感是钓鱼攻击的典型手法。',
        wrongExplanation: '❌ 这是钓鱼攻击！正规银行不会通过邮件发送链接要求验证账户，更不会用"冻结"来施压。正确的做法是：直接打开浏览器，手动输入银行官网地址登录查看。'
    },
    {
        id: 2,
        question: '你收到一封邮件，发件人显示为 "Microsoft 安全团队"，但发件地址是 "security@microsoft-secure-alert.net"。这封邮件可信吗？',
        options: ['不可信，发件域名不是官方域名', '可信，发件人名称是 Microsoft'],
        correct: 0,
        explanation: '✅ 正确！发件人显示名称可以随意伪造，但发件地址是真实的。Microsoft 官方邮件只会来自 @microsoft.com 域名。microsoft-secure-alert.net 是一个冒牌域名。',
        wrongExplanation: '❌ 显示名称可以随便写，但发件地址骗不了人。@microsoft-secure-alert.net 不是 Microsoft 的官方域名。始终检查完整的发件地址。'
    },
    {
        id: 3,
        question: '你在浏览网站时，看到一个需要登录的页面，浏览器地址栏显示的是 🔒 https://www.amazon.com。这是安全的吗？',
        options: ['安全，HTTPS 和小锁标志说明连接是加密的', '不一定安全，需要进一步确认是否是真正的亚马逊网站'],
        correct: 1,
        explanation: '✅ 正确！HTTPS 只保证你与这个网站的连接是加密的，但并不保证这个网站本身是合法的。攻击者也可以给自己的钓鱼网站部署 HTTPS。需要同时确认域名是否正确。',
        wrongExplanation: '❌ HTTPS 加密的 🔒 只表示数据传输是加密的，不表示网站本身可信。钓鱼网站也可以有 HTTPS。关键在于确认域名是否完全正确（如 amazon.com，而不是 amaz0n.com 或 amazon.com.xyz.top）。'
    },
    {
        id: 4,
        question: '你收到一条短信："【快递通知】您的包裹已到达，请点击链接支付关税后安排配送：http://sf-express.top/verify"。这是真的吗？',
        options: ['是真的，快递公司经常会这样通知', '是钓鱼短信，域名和链接都可疑'],
        correct: 1,
        explanation: '✅ 正确！这是典型的 Smishing（短信钓鱼）。顺丰官网是 sf-express.com，而不是 sf-express.top。快递公司不会通过短信链接要求支付关税。',
        wrongExplanation: '❌ 这是钓鱼短信！sf-express.top 不是顺丰官方域名。正规快递公司不会通过短信发送链接要求在线支付。如有疑问，请通过官方 App 或官方客服电话查询。'
    },
    {
        id: 5,
        question: '你的同事在微信上给你发了一条消息："我在外面不方便，能不能帮我看一下这个链接，好像是我们的系统有问题 http://company-portal.freehost.com/login"。你应该怎么做？',
        options: ['直接点击查看，是同事发的应该没问题', '通过其他方式（电话等）先确认是同事本人发的，不要直接点击'],
        correct: 1,
        explanation: '✅ 正确！同事的账号可能被盗。即使用 IM 工具收到的消息，也要先通过电话或其他渠道确认对方身份。域名 company-portal.freehost.com 明显不是公司内部域名。',
        wrongExplanation: '❌ 永远不要直接点击他人发来的链接，即使看起来是熟人！账号可能被盗，或者对方正在被钓鱼攻击。先通过电话等方式确认对方身份再说。'
    },
    {
        id: 6,
        question: '你收到一封来自"CEO"的紧急邮件，要求你立即向一个供应商账户转账 XX 万元，并强调"此事保密，不要告知他人"。这是？',
        options: ['正常的老板工作指令', '鲸钓攻击（Whaling），针对高管的定向钓鱼'],
        correct: 1,
        explanation: '✅ 正确！这是典型的鲸钓攻击（Whaling）特征：冒充高管、要求转账、强调保密。正常的高额转账应该有正式的审批流程，不会仅通过邮件要求。',
        wrongExplanation: '❌ 这是鲸钓攻击！"要求保密"是危险信号 — 正规的财务操作不会要求你绕过正常流程。遇到这种情况，应通过当面或电话向高管本人直接确认。'
    },
    {
        id: 7,
        question: '以下哪种行为最能保护你免受钓鱼攻击？',
        options: [
            '安装杀毒软件后就可以随意点击链接',
            '不点击任何邮件或消息中的链接，手动输入官方网址访问'
        ],
        correct: 1,
        explanation: '✅ 正确！手动在浏览器地址栏输入官方网址是最安全的方式。杀毒软件是辅助防御，不能拦截所有钓鱼网站。养成不点击链接的好习惯是最有效的防护。',
        wrongExplanation: '❌ 杀毒软件不能拦截所有钓鱼网站。最好的习惯是：永远不点击邮件或消息中的链接，而是手动输入官方网站地址。对于重要的服务，使用官方 App 或者浏览器中保存的书签访问。'
    },
    {
        id: 8,
        question: '你发现不小心点击了钓鱼链接并输入了密码，第一时间应该做什么？',
        options: [
            '先删除那封邮件，就当没发生过',
            '立即修改受影响账户的密码，并检查账户安全设置'
        ],
        correct: 1,
        explanation: '✅ 正确！时间就是一切。立即修改密码、启用双重认证、检查最近登录记录。如果涉及公司账户，还需要立即通知 IT 安全团队。删除邮件只是掩耳盗铃。',
        wrongExplanation: '❌ 删除邮件并不能解决问题——攻击者可能已经获取了你的信息。立即修改密码（如果还能登录）、检查账户活动、联系官方客服。如果该密码在其他平台也使用过，一并修改。'
    }
];

// 测验状态
let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let answered = false;

// DOM 元素
const questionNumber = document.getElementById('question-number');
const questionText = document.getElementById('question-text');
const questionContext = document.getElementById('question-context');
const optionsContainer = document.getElementById('options-container');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackTitle = document.getElementById('feedback-title');
const feedbackText = document.getElementById('feedback-text');
const nextBtn = document.getElementById('next-btn');
const resultContainer = document.getElementById('result-container');
const questionContainer = document.getElementById('question-container');
const progressBar = document.querySelector('.progress-bar');
const progressText = document.getElementById('progress-text');
const scoreNumber = document.getElementById('score-number');
const scoreMessage = document.getElementById('score-message');

function initQuiz() {
    currentQuestion = 0;
    score = 0;
    showQuestion(currentQuestion);
}

function showQuestion(index) {
    const q = questions[index];
    
    // 重置状态
    answered = false;
    selectedOption = null;
    feedbackContainer.classList.add('hidden');
    feedbackContainer.className = 'hidden';
    questionContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');

    // 更新进度
    const progress = ((index) / questions.length) * 100;
    progressBar.style.setProperty('--progress', progress + '%');
    progressBar.querySelector('::after')?.remove();
    // Use inline style for the pseudo-element width
    const styleEl = document.createElement('style');
    styleEl.id = 'progress-style';
    const oldStyle = document.getElementById('progress-style');
    if (oldStyle) oldStyle.remove();
    styleEl.textContent = `.progress-bar::after { width: ${((index) / questions.length) * 100}% !important; }`;
    document.head.appendChild(styleEl);
    progressText.textContent = `第 ${index + 1} / ${questions.length} 题`;

    // 题目
    questionNumber.textContent = `问题 ${index + 1}`;
    questionText.textContent = q.question;
    
    // 选项
    optionsContainer.innerHTML = '';
    q.options.forEach(function(opt, i) {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.dataset.index = i;
        btn.addEventListener('click', function() {
            selectOption(i);
        });
        optionsContainer.appendChild(btn);
    });
}

function selectOption(index) {
    if (answered) return;
    
    answered = true;
    const q = questions[currentQuestion];
    const buttons = optionsContainer.querySelectorAll('.option-btn');
    
    // 禁用所有按钮
    buttons.forEach(function(btn) {
        btn.disabled = true;
    });
    
    // 标记正确/错误
    buttons.forEach(function(btn, i) {
        if (i === q.correct) {
            btn.classList.add('correct');
        }
        if (i === index && index !== q.correct) {
            btn.classList.add('wrong');
        }
        if (i === index && index === q.correct) {
            btn.classList.add('selected');
        }
    });
    
    // 更新分数
    if (index === q.correct) {
        score++;
    }
    
    // 显示反馈
    const isCorrect = index === q.correct;
    feedbackContainer.classList.remove('hidden');
    feedbackContainer.className = isCorrect ? 'correct-feedback' : 'wrong-feedback';
    feedbackIcon.textContent = isCorrect ? '🎉' : '😅';
    feedbackTitle.textContent = isCorrect ? '回答正确！' : '回答错误';
    feedbackText.textContent = isCorrect ? q.explanation : q.wrongExplanation;
    
    // 更新进度（加分后）
    if (isCorrect) {
        const styleEl = document.createElement('style');
        styleEl.id = 'progress-score-style';
        const oldStyle = document.getElementById('progress-score-style');
        if (oldStyle) oldStyle.remove();
        styleEl.textContent = `.progress-bar::after { width: ${((currentQuestion + 0.5) / questions.length) * 100}% !important; }`;
        document.head.appendChild(styleEl);
    }
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion >= questions.length) {
        showResult();
    } else {
        showQuestion(currentQuestion);
    }
}

function showResult() {
    questionContainer.classList.add('hidden');
    feedbackContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    
    // 进度满
    const styleEl = document.createElement('style');
    styleEl.id = 'progress-final-style';
    const oldStyle = document.getElementById('progress-style');
    if (oldStyle) oldStyle.remove();
    styleEl.textContent = `.progress-bar::after { width: 100% !important; }`;
    document.head.appendChild(styleEl);
    progressText.textContent = `完成！${score} / ${questions.length}`;
    
    scoreNumber.textContent = score;
    
    let message;
    if (score === questions.length) {
        message = '🏅 完美通关！你有很强的安全意识，能够准确识别各类钓鱼攻击！';
    } else if (score >= questions.length - 2) {
        message = '👏 表现优秀！你已经能够识别大部分钓鱼攻击，继续保持安全意识！';
    } else if (score >= questions.length / 2) {
        message = '💪 还不错，但还需要加强。建议重新学习模拟演示和防护指南。';
    } else {
        message = '📚 需要继续学习！建议先仔细阅读首页的钓鱼知识和防护指南，然后重新测验。';
    }
    scoreMessage.textContent = message;
}

// 事件绑定
document.addEventListener('DOMContentLoaded', function() {
    nextBtn.addEventListener('click', nextQuestion);
    initQuiz();
});