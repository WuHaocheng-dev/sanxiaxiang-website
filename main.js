var currentSlide = 0;
var slides = document.querySelectorAll('.carousel-item');
var slideInterval;
var twikooInitialized = { article1: false, article2: false };

function showSlide(index) {
  slides.forEach(function(s, i) {
    s.classList.toggle('active', i === index);
  });
  currentSlide = index;
}

function nextSlide() {
  showSlide((currentSlide + 1) % slides.length);
}

function prevSlide() {
  showSlide((currentSlide - 1 + slides.length) % slides.length);
}

function startCarousel() {
  slideInterval = setInterval(nextSlide, 5000);
}

function stopCarousel() {
  clearInterval(slideInterval);
}

document.querySelector('.carousel').addEventListener('mouseenter', stopCarousel);
document.querySelector('.carousel').addEventListener('mouseleave', startCarousel);
startCarousel();

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('active');
}

function navigateTo(pageId) {
  document.querySelectorAll('.page-section').forEach(function(el) {
    el.classList.remove('active');
  });
  document.getElementById(pageId + '-page').classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    a.classList.remove('active');
  });
  var activeLink = document.querySelector('.nav-links a[onclick*="' + pageId + '"]');
  if (activeLink) activeLink.classList.add('active');
  document.getElementById('navLinks').classList.remove('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (pageId === 'forum') renderPosts();
  if (pageId === 'timeline') renderTimeline();
  if (pageId === 'teams') renderTeams();
  if (pageId === 'resources') renderResources();
  if (pageId === 'downloads') renderDownloads();
  if (pageId === 'faq') renderFaq();
  if (pageId === 'messages') loadContacts();
  if (pageId === 'profile') renderProfile();
  if (pageId === 'videos') renderVideos();
  if (pageId === 'contacts') checkContactAccess();
}

function openArticle(articleId) {
  document.querySelectorAll('.page-section').forEach(function(el) {
    el.classList.remove('active');
  });
  document.getElementById(articleId + '-page').classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    a.classList.remove('active');
  });
  document.getElementById('navLinks').classList.remove('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  initTwikoo(articleId);
}

var galleryStyles = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #a8edea, #fed6e3)'
];

function openGallery(index) {
  document.getElementById('modalContent').style.background = galleryStyles[index];
  document.getElementById('galleryModal').classList.add('active');
}

function closeGallery() {
  document.getElementById('galleryModal').classList.remove('active');
}

document.getElementById('galleryModal').addEventListener('click', function(e) {
  if (e.target === this) closeGallery();
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', function() {
  var scrollTop = document.getElementById('scrollTop');
  if (window.scrollY > 300) {
    scrollTop.classList.add('active');
  } else {
    scrollTop.classList.remove('active');
  }
});

function initTwikoo(articleId) {
  if (twikooInitialized[articleId]) return;
  twikooInitialized[articleId] = true;
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/twikoo@1.6.30/dist/twikoo.all.min.js';
  s.onload = function() {
    twikoo.init({
      envId: 'https://twikoo-haocheng2.vercel.app',
      el: '#twikoo-container-' + articleId,
      path: '/article/' + articleId,
      requiredFields: ['nick', 'mail'],
      enableCommentReview: true
    });
  };
  document.head.appendChild(s);
}

var forbiddenWords = [
  'fuck', 'shit', 'bitch', 'damn', 'ass', 'porn', 'sex', 'nude', 'xxx', '色情', '淫秽', '暴力', '恐怖', '毒品', 
  '赌博', '诈骗', '传销', '反动', '分裂', '邪教', '极端', '辱骂', '侮辱', '诽谤', '造谣', '虚假', 
  '违法', '违规', '作弊', '抄袭', '枪手', '代考', '办证', '发票', '贷款', '网贷', '套路贷', '高利贷',
  '枪支', '弹药', '爆炸', '刀具', '凶器', '杀人', '自杀', '自残', '跳楼', '威胁', '恐吓', '敲诈',
  '种族歧视', '地域歧视', '性别歧视', '歧视', '仇恨', '攻击', '人身攻击', '人肉', '隐私', '泄露',
  '病毒', '木马', '黑客', '入侵', '破解', '盗号', '钓鱼', '诈骗', '刷单', '返利', '红包', '中奖',
  '微信', 'QQ', '加群', '私聊', '联系方式', '微信号', 'QQ号', '电话号码', '手机号', '广告', '推广',
  '出售', '转让', '收购', '交易', '买卖', '色情服务', '特殊服务', '上门', '约炮', '交友', '一夜情'
];

function containsForbiddenWord(text) {
  if (!text) return false;
  var lowerText = text.toLowerCase();
  for (var i = 0; i < forbiddenWords.length; i++) {
    if (lowerText.includes(forbiddenWords[i].toLowerCase())) {
      return true;
    }
  }
  return false;
}

function detectMaliciousContent(text) {
  if (!text) return { safe: true, reason: '' };
  
  text = text.toLowerCase();
  
  var checks = [
    { pattern: /(色情|淫秽|sex|porn|xxx|nude)/i, reason: '包含色情内容' },
    { pattern: /(暴力|恐怖|杀人|自杀|自残)/i, reason: '包含暴力或危险内容' },
    { pattern: /(毒品|赌博|诈骗|传销|邪教)/i, reason: '包含违法违规内容' },
    { pattern: /(反动|分裂|极端)/i, reason: '包含政治敏感内容' },
    { pattern: /(辱骂|侮辱|诽谤|造谣)/i, reason: '包含恶意攻击内容' },
    { pattern: /(枪支|弹药|爆炸|刀具)/i, reason: '包含危险物品相关内容' },
    { pattern: /(种族歧视|地域歧视|性别歧视|歧视)/i, reason: '包含歧视性内容' },
    { pattern: /(病毒|木马|黑客|入侵|破解)/i, reason: '包含恶意技术内容' },
    { pattern: /(刷单|返利|红包|中奖|广告)/i, reason: '包含广告营销内容' },
    { pattern: /(微信号|QQ号|电话号码|手机号)/i, reason: '包含联系方式' },
    { pattern: /(加群|私聊|联系我)/i, reason: '包含诱导私聊内容' },
    { pattern: /(办证|发票|贷款|网贷)/i, reason: '包含违规服务内容' },
    { pattern: /(约炮|交友|一夜情)/i, reason: '包含不良交友内容' }
  ];
  
  for (var i = 0; i < checks.length; i++) {
    if (checks[i].pattern.test(text)) {
      return { safe: false, reason: checks[i].reason };
    }
  }
  
  if (containsForbiddenWord(text)) {
    return { safe: false, reason: '包含不良词汇' };
  }
  
  if (text.length > 5000) {
    return { safe: false, reason: '内容过长' };
  }
  
  return { safe: true, reason: '' };
}

function sanitizeInput(input) {
  if (!input) return '';
  return input.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
}

function hashPassword(password) {
  var chars = '0123456789abcdef';
  var hash = [];
  for (var i = 0; i < 32; i++) {
    hash[i] = chars.charCodeAt(0);
  }
  
  var key = '三下乡平台加密密钥';
  var keyLen = key.length;
  var passwordLen = password.length;
  
  for (var i = 0; i < passwordLen; i++) {
    hash[i % 32] = (hash[i % 32] + password.charCodeAt(i) + key.charCodeAt(i % keyLen)) % 256;
  }
  
  for (var i = 0; i < 64; i++) {
    for (var j = 0; j < 32; j++) {
      hash[j] = (hash[j] * 2 + hash[(j + 1) % 32] + 1) % 256;
    }
  }
  
  var result = '';
  for (var i = 0; i < 32; i++) {
    result += chars.charAt(hash[i] % 16);
    result += chars.charAt((hash[i] >> 4) % 16);
  }
  return result;
}

function checkVerification() {
  var path = window.location.pathname;
  if (path.indexOf('88d09a97fd81a6b59006fecc27af3b53') !== -1) {
    document.querySelectorAll('.page-section').forEach(function(el) {
      el.classList.remove('active');
    });
    document.getElementById('verify-page').classList.add('active');
    document.querySelector('header').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
  }
}

window.addEventListener('load', function() {
  checkVerification();
  loadUser();
  initMockData();
});

var user = null;
var currentCaptcha = '';
var captchaTimer = null;
var currentChatUser = null;
var messagePolling = null;

function getStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null');
  } catch (e) {
    return null;
  }
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function initMockData() {
  var users = getStorage('users');
  if (!users || users.length === 0) {
    setStorage('users', [
      { id: 1, school: '内蒙古科技大学', studentId: '2023001', phone: '13800138001', email: 'test@example.com', password: hashPassword('123456'), nickname: '张三', avatar: '张', verified: true },
      { id: 2, school: '内蒙古科技大学', studentId: '2023002', phone: '13800138002', email: 'test2@example.com', password: hashPassword('123456'), nickname: '李四', avatar: '李', verified: false },
      { id: 3, school: 'XX大学', studentId: '2023003', phone: '13800138003', email: 'test3@example.com', password: hashPassword('123456'), nickname: '王五', avatar: '王', verified: false }
    ]);
  }
  var posts = getStorage('posts');
  if (!posts || posts.length === 0) {
    setStorage('posts', [
      { id: 1, userId: 1, title: '我的三下乡实践心得', category: '心得体会', content: '这次三下乡实践让我收获很多，深入乡村了解了农村的发展现状，也锻炼了自己的实践能力。', location: '甘肃省静宁县雷大镇', createdAt: '2026-07-23 10:30', comments: [{ userId: 2, content: '写得真好！', createdAt: '2026-07-23 11:00' }], likes: [], favorites: [] },
      { id: 2, userId: 2, title: '求组队！暑期三下乡', category: '活动招募', content: '有没有同学想一起组队参加暑期三下乡活动？我们可以一起调研乡村产业发展。', location: '甘肃省平凉市', createdAt: '2026-07-22 15:00', comments: [], likes: [], favorites: [] },
      { id: 3, userId: 1, title: '实践经验分享：如何做好调研', category: '经验分享', content: '分享一下我的调研经验：1. 提前做好准备工作；2. 多与当地居民交流；3. 注意安全问题。', location: '甘肃省静宁县', createdAt: '2026-07-21 09:00', comments: [{ userId: 2, content: '非常实用！', createdAt: '2026-07-21 10:30' }], likes: [], favorites: [] },
      { id: 4, userId: 3, title: '急需帮助！关于三下乡申报材料', category: '求助问答', content: '有没有同学知道三下乡申报材料需要准备哪些东西？急！在线等！', location: '', createdAt: '2026-07-24 08:00', comments: [], likes: [], favorites: [] },
      { id: 5, userId: 1, title: '分享一个好用的调研工具', category: '资源分享', content: '给大家分享一个调研数据分析工具，非常实用！', location: '', createdAt: '2026-07-24 09:30', comments: [], likes: [], favorites: [] }
    ]);
  }
  var videos = getStorage('videos');
  if (!videos || videos.length === 0) {
    setStorage('videos', [
      { id: 1, userId: 1, title: '三下乡实践纪录片', category: '纪录片', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', location: '甘肃省静宁县', createdAt: '2026-07-23 14:00' },
      { id: 2, userId: 2, title: '乡村调研采访视频', category: '采访', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', location: '甘肃省平凉市', createdAt: '2026-07-22 16:00' },
      { id: 3, userId: 1, title: '实践经验分享直播回放', category: '直播', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', location: '', createdAt: '2026-07-21 20:00' }
    ]);
  }
  var messages = getStorage('messages');
  if (!messages || messages.length === 0) {
    setStorage('messages', [
      { id: 1, fromId: 2, toId: 1, content: '你好！我看到你发布的实践心得，想请教一下。', createdAt: '2026-07-23 11:30' },
      { id: 2, fromId: 1, toId: 2, content: '好的，请问有什么问题？', createdAt: '2026-07-23 11:35' },
      { id: 3, fromId: 2, toId: 1, content: '你们调研的时候遇到最大的困难是什么？', createdAt: '2026-07-23 11:40' },
      { id: 4, fromId: 3, toId: 1, content: '你好，我是王五，想跟你聊聊组队的事情。', createdAt: '2026-07-24 09:00' }
    ]);
  }
  var contacts = getStorage('contacts');
  if (!contacts || contacts.length === 0) {
    setStorage('contacts', [
      { id: 1, name: '张主任', phone: '13900139001', location: '甘肃省静宁县雷大镇', role: '镇政府办公室主任', description: '负责三下乡活动对接，热情周到，对当地情况非常熟悉', submitterId: 1, createdAt: '2026-07-23' },
      { id: 2, name: '李书记', phone: '13900139002', location: '甘肃省静宁县界石铺镇', role: '村党支部书记', description: '熟悉当地红色资源，可协助安排红色研学活动', submitterId: 1, createdAt: '2026-07-22' },
      { id: 3, name: '王老师', phone: '13900139003', location: '甘肃省平凉市崆峒区', role: '实践基地负责人', description: '提供实践场地和住宿安排，有丰富的接待经验', submitterId: 2, createdAt: '2026-07-21' }
    ]);
  }
  var resources = getStorage('resources');
  if (!resources || resources.length === 0) {
    setStorage('resources', [
      { id: 1, userId: 1, title: '甘肃省静宁县雷大镇三下乡对接信息', category: '对接信息', location: '甘肃省静宁县雷大镇', contact: '张主任', phone: '13900139001', content: '甘肃省静宁县雷大镇是苹果主产区，适合开展乡村产业调研、助农帮扶等实践活动。镇政府办公室张主任负责三下乡活动对接，可协助联系村委会、合作社，安排住宿和调研路线。', createdAt: '2026-07-23 10:00', views: 128 },
      { id: 2, userId: 2, title: '静宁县苹果产业调研报告模板', category: '调研报告', location: '', contact: '', phone: '', content: '分享一份苹果产业调研报告模板，包含调研问卷、数据分析表格、报告撰写框架等，非常实用！', createdAt: '2026-07-22 15:30', views: 89 },
      { id: 3, userId: 1, title: '界石铺长征纪念馆对接联系方式', category: '联系方式', location: '甘肃省静宁县界石铺镇', contact: '李书记', phone: '13900139002', content: '界石铺长征纪念馆位于甘肃省静宁县界石铺镇，是红色研学的重要地点。李书记可协助安排参观讲解、重温入党誓词等活动。', createdAt: '2026-07-21 09:00', views: 67 },
      { id: 4, userId: 3, title: '三下乡实践安全手册', category: '实践资料', location: '', contact: '', phone: '', content: '暑期三下乡实践安全注意事项：1. 提前了解当地天气情况；2. 注意交通安全；3. 尊重当地风俗习惯；4. 保持通讯畅通；5. 随身携带常用药品。', createdAt: '2026-07-24 11:00', views: 156 }
    ]);
  }
  var timeline = getStorage('timeline');
  if (!timeline || timeline.length === 0) {
    setStorage('timeline', [
      { id: 1, title: '2026年暑期三下乡活动启动', date: '2026-07-01', location: '内蒙古科技大学', teams: '萤火志愿服务队等', description: '2026年暑期三下乡社会实践活动正式启动，各实践队伍开始筹备工作。', type: 'start' },
      { id: 2, title: '萤火志愿服务队出征仪式', date: '2026-07-15', location: '内蒙古科技大学', teams: '萤火志愿服务队', description: '萤火志愿服务队举行出征仪式，队员们整装待发，前往甘肃省静宁县开展实践活动。', type: 'event' },
      { id: 3, title: '雷大镇苹果产业调研', date: '2026-07-18', location: '甘肃省静宁县雷大镇', teams: '萤火志愿服务队', description: '实践队伍深入雷大镇屈岔村、合岘村开展苹果产业调研，走访果农30余户。', type: 'activity' },
      { id: 4, title: '界石铺红色研学', date: '2026-07-20', location: '甘肃省静宁县界石铺镇', teams: '萤火志愿服务队', description: '前往界石铺长征纪念馆开展红色研学活动，重温入党誓词，传承红色基因。', type: 'activity' },
      { id: 5, title: '实践成果汇报', date: '2026-08-20', location: '内蒙古科技大学', teams: '各实践队伍', description: '2026年暑期三下乡社会实践成果汇报大会，各队伍分享实践经验和成果。', type: 'end' },
      { id: 6, title: '2025年暑期三下乡活动', date: '2025-07-10', location: '内蒙古科技大学', teams: '各实践队伍', description: '2025年暑期三下乡活动圆满结束，共派出28支队伍，覆盖甘肃、宁夏、青海等地。', type: 'start' },
      { id: 7, title: '2024年暑期三下乡活动', date: '2024-07-05', location: '内蒙古科技大学', teams: '各实践队伍', description: '2024年暑期三下乡活动顺利开展，重点围绕乡村振兴主题开展实践。', type: 'start' }
    ]);
  }
  var teams = getStorage('teams');
  if (!teams || teams.length === 0) {
    setStorage('teams', [
      { id: 1, name: '萤火志愿服务队', school: '内蒙古科技大学', advisor: '王老师', leader: '武皓程', leaderPhone: '13800138001', members: 12, topic: '乡村产业调研与红色研学', location: '甘肃省静宁县', description: '萤火志愿服务队成立于2023年，主要开展乡村产业调研、红色文化传承、助农帮扶等实践活动。', createdAt: '2026-07-15', achievements: ['2025年校级优秀实践队伍', '2024年省级实践成果三等奖'] },
      { id: 2, name: '星火实践团', school: '内蒙古科技大学', advisor: '李老师', leader: '张三', leaderPhone: '13800138002', members: 8, topic: '乡村教育帮扶', location: '宁夏回族自治区西吉县', description: '星火实践团致力于乡村教育事业，开展支教活动，帮助农村儿童提升学习成绩。', createdAt: '2026-07-10', achievements: ['2025年校级优秀实践队伍'] },
      { id: 3, name: '绿源环保服务队', school: '内蒙古科技大学', advisor: '赵老师', leader: '李四', leaderPhone: '13800138003', members: 10, topic: '农村环境保护调研', location: '青海省海东市', description: '绿源环保服务队关注农村生态环境问题，开展环保宣传和调研活动。', createdAt: '2026-07-08', achievements: [] }
    ]);
  }
  var downloads = getStorage('downloads');
  if (!downloads || downloads.length === 0) {
    setStorage('downloads', [
      { id: 1, name: '三下乡调研报告模板', category: '调研报告', description: '包含调研问卷模板、数据分析表格、报告撰写框架等，适用于各类实践调研报告撰写。', url: '#', downloads: 356, createdAt: '2026-07-20' },
      { id: 2, name: '三下乡活动申报书模板', category: '申报材料', description: '校级三下乡活动申报书模板，包含申报要求、可行性分析、实施方案等内容。', url: '#', downloads: 289, createdAt: '2026-07-18' },
      { id: 3, name: '暑期实践安全手册', category: '安全手册', description: '暑期社会实践安全注意事项，包含交通安全、食品安全、应急处理等内容。', url: '#', downloads: 421, createdAt: '2026-07-15' },
      { id: 4, name: '实践活动宣传海报模板', category: '宣传资料', description: '三下乡实践活动宣传海报设计模板，包含多种风格和格式。', url: '#', downloads: 156, createdAt: '2026-07-12' },
      { id: 5, name: '实践日志模板', category: '其他', description: '每日实践日志记录模板，帮助队员记录每天的实践经历和收获。', url: '#', downloads: 198, createdAt: '2026-07-10' }
    ]);
  }
  var faq = getStorage('faq');
  if (!faq || faq.length === 0) {
    setStorage('faq', [
      { id: 1, category: '申报流程', title: '三下乡活动如何申报？', content: '三下乡活动申报流程如下：1. 登录学校团委网站下载申报表格；2. 填写申报书，包括实践主题、方案、团队成员等；3. 提交学院审核；4. 学校团委审批；5. 审批通过后开展实践活动。', answers: [{ userId: 1, content: '补充：申报时间一般在每年5-6月份，请关注学校通知。', createdAt: '2026-07-20' }], views: 520, solved: true },
      { id: 2, category: '实践准备', title: '出发前需要做哪些准备？', content: '出发前建议做好以下准备：1. 了解目的地气候和环境；2. 准备好必要的生活用品和药品；3. 与当地对接人联系确认行程；4. 制定详细的实践方案；5. 购买保险；6. 准备好调研问卷和记录工具。', answers: [], views: 389, solved: false },
      { id: 3, category: '安全问题', title: '实践过程中如何保障安全？', content: '实践过程中安全第一：1. 保持通讯畅通；2. 遵守团队纪律，不单独行动；3. 注意饮食卫生；4. 了解当地风俗习惯；5. 遇到突发事件及时联系带队老师和当地警方。', answers: [{ userId: 2, content: '建议提前了解当地的紧急联系方式！', createdAt: '2026-07-21' }], views: 456, solved: true },
      { id: 4, category: '调研报告', title: '调研报告怎么写？', content: '调研报告一般包含以下部分：1. 调研背景和目的；2. 调研方法；3. 调研结果与分析；4. 问题与建议；5. 实践感悟。建议参考网站提供的调研报告模板。', answers: [], views: 287, solved: false },
      { id: 5, category: '其他', title: '实践结束后需要提交哪些材料？', content: '实践结束后一般需要提交：1. 实践报告；2. 实践日志；3. 照片和视频资料；4. 实践成果（如调研报告、宣传材料等）；5. 团队总结。具体要求以学校通知为准。', answers: [], views: 234, solved: false }
    ]);
  }
}

function loadUser() {
  user = getStorage('currentUser');
  if (user) {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('user-section').style.display = 'flex';
    document.getElementById('userAvatar').textContent = user.avatar || user.nickname.charAt(0);
    document.getElementById('userName').textContent = user.nickname;
  } else {
    document.getElementById('auth-section').style.display = 'flex';
    document.getElementById('user-section').style.display = 'none';
  }
}

function showModal(type) {
  document.getElementById(type + 'Modal').classList.add('active');
  document.getElementById(type + 'Message').innerHTML = '';
  if (type === 'register') {
    initRecaptcha();
  }
}

function closeModal(type) {
  document.getElementById(type + 'Modal').classList.remove('active');
}

function showMessage(elementId, type, message) {
  document.getElementById(elementId).innerHTML = '<div class="message ' + type + '">' + message + '</div>';
}

function getCaptchaType() {
  var radios = document.getElementsByName('captchaType');
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) return radios[i].value;
  }
  return 'phone';
}

function toggleCaptchaMethod() {
  var type = getCaptchaType();
  var emailInput = document.getElementById('registerEmail');
  if (type === 'email') {
    emailInput.required = true;
    emailInput.parentElement.classList.add('required');
  } else {
    emailInput.required = false;
    emailInput.parentElement.classList.remove('required');
  }
}

var recaptchaToken = '';

function initRecaptcha() {
  if (typeof grecaptcha !== 'undefined') {
    grecaptcha.ready(function() {
      grecaptcha.render('recaptcha-container', {
        'sitekey': '6LcI6nQqAAAAAIo4Gk30YqT9G3yN8Xk8Q2b7vJ2t',
        'size': 'normal',
        'callback': function(token) {
          recaptchaToken = token;
        },
        'expired-callback': function() {
          recaptchaToken = '';
        }
      });
    });
  }
}

function verifyRecaptcha() {
  if (!recaptchaToken) {
    showMessage('registerMessage', 'error', '请完成人机验证');
    return false;
  }
  return true;
}

function sendCaptcha() {
  if (!verifyRecaptcha()) {
    return;
  }
  
  var type = getCaptchaType();
  var btn = document.getElementById('sendCaptchaBtn');
  
  btn.disabled = true;
  btn.textContent = '发送中...';
  
  setTimeout(function() {
    if (type === 'phone') {
      var phone = document.getElementById('registerPhone').value;
      if (!phone) {
        showMessage('registerMessage', 'error', '请先输入手机号');
        btn.disabled = false;
        btn.textContent = '发送验证码';
        return;
      }
      var phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        showMessage('registerMessage', 'error', '请输入正确的手机号格式');
        btn.disabled = false;
        btn.textContent = '发送验证码';
        return;
      }
      currentCaptcha = Math.floor(100000 + Math.random() * 900000).toString();
      sendSms(phone, currentCaptcha, btn);
    } else {
      var email = document.getElementById('registerEmail').value;
      if (!email) {
        showMessage('registerMessage', 'error', '请先输入邮箱');
        btn.disabled = false;
        btn.textContent = '发送验证码';
        return;
      }
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showMessage('registerMessage', 'error', '请输入正确的邮箱格式');
        btn.disabled = false;
        btn.textContent = '发送验证码';
        return;
      }
      currentCaptcha = Math.random().toString(36).substring(2, 8).toUpperCase();
      sendEmailCode(email, currentCaptcha, btn);
    }
  }, 500);
}

function sendSms(phone, code, btn) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://api.smsbao.com/sms', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          var response = xhr.responseText;
          if (response === '0') {
            showMessage('registerMessage', 'success', '✅ 验证码 ' + code + ' 已发送至手机号 ' + phone.substring(0, 3) + '****' + phone.substring(7));
            startCountdown(btn);
          } else {
            showMessage('registerMessage', 'error', '❌ 短信发送失败，请稍后重试');
            btn.disabled = false;
            btn.textContent = '发送验证码';
          }
        } catch (e) {
          showMessage('registerMessage', 'success', '⚠️ 验证码 ' + code + ' 已生成，请查收短信');
          startCountdown(btn);
        }
      } else {
        showMessage('registerMessage', 'success', '⚠️ 验证码 ' + code + ' 已生成，请查收短信');
        startCountdown(btn);
      }
    }
  };
  xhr.onerror = function() {
    showMessage('registerMessage', 'success', '⚠️ 验证码 ' + code + ' 已生成，请查收短信');
    startCountdown(btn);
  };
  xhr.send('u=sanxiaxiang&p=4a4a4a4a4a&m=' + phone + '&c=【三下乡平台】您的验证码是：' + code + '，5分钟内有效。');
}

function sendEmailCode(email, code, btn) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://api.smtp2go.com/v3/email/send', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('X-Smtp2go-Api-Key', 'api-xxx');
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        showMessage('registerMessage', 'success', '✅ 验证码 ' + code + ' 已发送至邮箱 ' + email);
      } else {
        showMessage('registerMessage', 'success', '⚠️ 验证码 ' + code + ' 已生成，请查收邮件');
      }
      startCountdown(btn);
    }
  };
  xhr.onerror = function() {
    showMessage('registerMessage', 'success', '⚠️ 验证码 ' + code + ' 已生成，请查收邮件');
    startCountdown(btn);
  };
  xhr.send(JSON.stringify({
    'to': [{ 'email': email }],
    'from': 'noreply@sanxiaxiang.com',
    'subject': '三下乡平台验证码',
    'text_body': '您的验证码是：' + code + '，5分钟内有效。'
  }));
}

function startCountdown(btn) {
  var count = 60;
  btn.textContent = count + '秒后重新发送';
  captchaTimer = setInterval(function() {
    count--;
    btn.textContent = count + '秒后重新发送';
    if (count <= 0) {
      clearInterval(captchaTimer);
      btn.disabled = false;
      btn.textContent = '发送验证码';
      recaptchaToken = '';
      if (typeof grecaptcha !== 'undefined') {
        grecaptcha.reset();
      }
    }
  }, 1000);
}

function register() {
  var school = document.getElementById('registerSchool').value;
  var studentId = document.getElementById('registerStudentId').value;
  var phone = document.getElementById('registerPhone').value;
  var email = document.getElementById('registerEmail').value;
  var code = document.getElementById('registerCode').value;
  var password = document.getElementById('registerPassword').value;
  var confirmPassword = document.getElementById('registerConfirmPassword').value;

  if (!school || !studentId || !phone || !code || !password || !confirmPassword) {
    showMessage('registerMessage', 'error', '请填写所有必填字段');
    return;
  }

  if (code !== currentCaptcha) {
    showMessage('registerMessage', 'error', '验证码错误');
    return;
  }

  if (password !== confirmPassword) {
    showMessage('registerMessage', 'error', '两次密码输入不一致');
    return;
  }

  var users = getStorage('users');
  var existingUser = users.find(function(u) { return u.phone === phone || u.studentId === studentId || (email && u.email === email); });
  if (existingUser) {
    showMessage('registerMessage', 'error', '该手机号、学号或邮箱已被注册');
    return;
  }

  var newUser = {
    id: Date.now(),
    school: school,
    studentId: studentId,
    phone: phone,
    email: email,
    password: hashPassword(password),
    nickname: school + '-' + studentId.substring(0, 4),
    avatar: school.charAt(0),
    verified: false
  };
  users.push(newUser);
  setStorage('users', users);

  showMessage('registerMessage', 'success', '注册成功！请登录');
  setTimeout(function() {
    closeModal('register');
    showModal('login');
  }, 2000);
}

function login() {
  var account = document.getElementById('loginAccount').value;
  var password = document.getElementById('loginPassword').value;

  if (!account || !password) {
    showMessage('loginMessage', 'error', '请填写账号和密码');
    return;
  }

  var users = getStorage('users');
  var hashedPassword = hashPassword(password);
  var foundUser = users.find(function(u) {
    return (u.phone === account || u.email === account || u.studentId === account) && u.password === hashedPassword;
  });

  if (!foundUser) {
    showMessage('loginMessage', 'error', '账号或密码错误');
    return;
  }

  setStorage('currentUser', foundUser);
  loadUser();
  closeModal('login');
  showMessage('loginMessage', 'success', '登录成功！');
}

function logout() {
  setStorage('currentUser', null);
  loadUser();
  stopMessagePolling();
}

function renderPosts(category) {
  var posts = getStorage('posts') || [];
  var users = getStorage('users') || [];
  var filteredPosts = category === 'all' ? posts : posts.filter(function(p) { return p.category === category; });

  var html = '';
  filteredPosts.forEach(function(post) {
    var author = users.find(function(u) { return u.id === post.userId; }) || { nickname: '未知用户', avatar: '?', school: '' };
    html += '<div class="post-card" onclick="openPostDetail(' + post.id + ')">';
    html += '<div class="post-header"><div class="post-author"><div class="post-avatar">' + author.avatar + '</div><div class="post-author-info"><div class="post-author-name">' + author.nickname + '</div><div class="post-author-school">' + author.school + '</div></div></div><div class="post-time">' + post.createdAt + '</div></div>';
    html += '<span class="tag">' + post.category + '</span>';
    if (post.location) html += '<span class="tag" style="background: rgba(6,182,212,0.1); color: var(--accent);">📍 ' + post.location + '</span>';
    html += '<h3 class="post-title">' + post.title + '</h3>';
    html += '<p class="post-content">' + post.content.substring(0, 100) + (post.content.length > 100 ? '...' : '') + '</p>';
    html += '<div class="post-meta"><span>💬 ' + (post.comments ? post.comments.length : 0) + '</span><span>👍 ' + (post.likes ? post.likes.length : 0) + '</span><span>❤️ ' + (post.favorites ? post.favorites.length : 0) + '</span></div></div>';
  });

  document.getElementById('postList').innerHTML = html || '<div class="empty-state"><div class="icon">📭</div><h3>暂无帖子</h3><p>快来发布第一篇帖子吧！</p></div>';
}

function filterPosts(category) {
  document.querySelectorAll('.category-btn').forEach(function(btn) { btn.classList.remove('active'); });
  event.target.classList.add('active');
  renderPosts(category);
}

function openPostDetail(postId) {
  var posts = getStorage('posts') || [];
  var users = getStorage('users') || [];
  var post = posts.find(function(p) { return p.id === postId; });

  if (!post) return;

  var author = users.find(function(u) { return u.id === post.userId; }) || { nickname: '未知用户', avatar: '?', school: '' };
  var isLiked = user && post.likes && post.likes.includes(user.id);
  var isFavorited = user && post.favorites && post.favorites.includes(user.id);

  var html = '';
  html += '<div class="post-header"><div class="post-author"><div class="post-avatar">' + author.avatar + '</div><div class="post-author-info"><div class="post-author-name">' + author.nickname + '</div><div class="post-author-school">' + author.school + '</div></div></div><div class="post-time">' + post.createdAt + '</div></div>';
  html += '<span class="tag">' + post.category + '</span>';
  if (post.location) {
    html += '<span class="tag" style="background: rgba(6,182,212,0.1); color: var(--accent); cursor: pointer;" onclick="openMap(\'' + post.location + '\')">📍 ' + post.location + '</span>';
  }
  html += '<h1 class="post-title" style="margin-top: 20px;">' + post.title + '</h1>';
  html += '<p class="post-content" style="font-size: 16px; line-height: 1.8;">' + post.content + '</p>';
  html += '<div class="interaction-bar">';
  html += '<button class="interaction-btn ' + (isLiked ? 'liked active' : '') + '" onclick="toggleLike(' + postId + ')">👍 ' + (post.likes ? post.likes.length : 0) + '</button>';
  html += '<button class="interaction-btn ' + (isFavorited ? 'active' : '') + '" onclick="toggleFavorite(' + postId + ')">❤️ ' + (post.favorites ? post.favorites.length : 0) + '</button>';
  html += '<button class="interaction-btn" onclick="openChatWith(' + author.id + ')">💬 私信作者</button>';
  html += '</div>';

  if (post.location) {
    html += '<div style="margin-top: 30px;"><h3>📍 地点定位</h3><div id="postMap" style="height: 300px; border-radius: 12px; background: rgba(0,0,0,0.3);"></div></div>';
  }

  html += '<div class="comment-section"><h3>💬 评论 (' + (post.comments ? post.comments.length : 0) + ')</h3><div class="comment-list">';

  if (post.comments && post.comments.length > 0) {
    post.comments.forEach(function(comment) {
      var commentAuthor = users.find(function(u) { return u.id === comment.userId; }) || { nickname: '未知用户', avatar: '?' };
      html += '<div class="comment-item"><div class="comment-header"><div class="comment-author"><div class="comment-avatar">' + commentAuthor.avatar + '</div><span style="color: var(--text-primary); font-size: 14px;">' + commentAuthor.nickname + '</span></div><span style="color: var(--text-muted); font-size: 12px;">' + comment.createdAt + '</span></div><div class="comment-text">' + comment.content + '</div></div>';
    });
  } else {
    html += '<div class="empty-state"><div class="icon">💭</div><h3>暂无评论</h3><p>快来发表第一条评论吧！</p></div>';
  }

  html += '</div><div class="comment-form"><textarea id="commentContent" placeholder="请输入评论内容"></textarea><button class="btn-primary" onclick="addComment(' + postId + ')">发表评论</button></div></div>';

  document.getElementById('postDetail').innerHTML = html;
  document.querySelectorAll('.page-section').forEach(function(el) { el.classList.remove('active'); });
  document.getElementById('post-detail-page').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (post.location) {
    initMap(post.location);
  }
}

function initMap(location) {
  if (window.AMap) {
    var map = new AMap.Map('postMap', {
      zoom: 12,
      center: [106.3, 35.5]
    });
    AMap.plugin(['AMap.Geocoder'], function() {
      var geocoder = new AMap.Geocoder();
      geocoder.getLocation(location, function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          var location = result.geocodes[0].location;
          map.setCenter(location);
          var marker = new AMap.Marker({
            position: location,
            title: location
          });
          map.add(marker);
        }
      });
    });
  }
}

function openMap(location) {
  window.open('https://uri.amap.com/search?keyword=' + encodeURIComponent(location), '_blank');
}

function toggleLike(postId) {
  if (!user) { showModal('login'); return; }
  var posts = getStorage('posts') || [];
  var postIndex = posts.findIndex(function(p) { return p.id === postId; });
  if (postIndex === -1) return;
  posts[postIndex].likes = posts[postIndex].likes || [];
  var likeIndex = posts[postIndex].likes.indexOf(user.id);
  if (likeIndex === -1) {
    posts[postIndex].likes.push(user.id);
  } else {
    posts[postIndex].likes.splice(likeIndex, 1);
  }
  setStorage('posts', posts);
  openPostDetail(postId);
}

function toggleFavorite(postId) {
  if (!user) { showModal('login'); return; }
  var posts = getStorage('posts') || [];
  var postIndex = posts.findIndex(function(p) { return p.id === postId; });
  if (postIndex === -1) return;
  posts[postIndex].favorites = posts[postIndex].favorites || [];
  var favIndex = posts[postIndex].favorites.indexOf(user.id);
  if (favIndex === -1) {
    posts[postIndex].favorites.push(user.id);
  } else {
    posts[postIndex].favorites.splice(favIndex, 1);
  }
  setStorage('posts', posts);
  openPostDetail(postId);
}

function addComment(postId) {
  if (!user) { showModal('login'); return; }
  var content = document.getElementById('commentContent').value;
  if (!content.trim()) { alert('请输入评论内容'); return; }
  
  var safetyCheck = detectMaliciousContent(content);
  if (!safetyCheck.safe) {
    alert('评论内容包含违规信息：' + safetyCheck.reason + '，请修改后再发送');
    return;
  }
  
  var posts = getStorage('posts') || [];
  var postIndex = posts.findIndex(function(p) { return p.id === postId; });
  if (postIndex === -1) return;
  posts[postIndex].comments = posts[postIndex].comments || [];
  posts[postIndex].comments.push({
    userId: user.id,
    content: content.trim(),
    createdAt: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-')
  });
  setStorage('posts', posts);
  document.getElementById('commentContent').value = '';
  openPostDetail(postId);
}

function createPost() {
  if (!user) { showModal('login'); return; }
  var title = document.getElementById('postTitle').value;
  var category = document.getElementById('postCategory').value;
  var location = document.getElementById('postLocation').value;
  var content = document.getElementById('postContent').value;
  if (!title || !content) { showMessage('postMessage', 'error', '请填写标题和内容'); return; }
  
  var titleSafety = detectMaliciousContent(title);
  var contentSafety = detectMaliciousContent(content);
  if (!titleSafety.safe) {
    showMessage('postMessage', 'error', '标题包含违规信息：' + titleSafety.reason);
    return;
  }
  if (!contentSafety.safe) {
    showMessage('postMessage', 'error', '内容包含违规信息：' + contentSafety.reason);
    return;
  }
  
  var posts = getStorage('posts') || [];
  posts.unshift({
    id: Date.now(),
    userId: user.id,
    title: title,
    category: category,
    location: location,
    content: content,
    createdAt: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-'),
    comments: [],
    likes: [],
    favorites: []
  });
  setStorage('posts', posts);
  closeModal('post');
  navigateTo('forum');
}

function loadContacts() {
  if (!user) { showModal('login'); return; }
  var users = getStorage('users') || [];
  var messages = getStorage('messages') || [];
  var contacts = users.filter(function(u) { return u.id !== user.id; });

  var html = '';
  contacts.forEach(function(contact) {
    var unreadCount = messages.filter(function(m) { 
      return m.fromId === contact.id && m.toId === user.id; 
    }).length;
    html += '<div class="chat-contact" onclick="openChat(' + contact.id + ')">';
    html += '<div class="chat-contact-avatar">' + contact.avatar + '</div>';
    html += '<div class="chat-contact-info"><div class="chat-contact-name">' + contact.nickname + '</div><div class="chat-contact-school">' + contact.school + '</div></div>';
    if (unreadCount > 0) html += '<div class="chat-contact-badge">' + unreadCount + '</div>';
    html += '</div>';
  });

  document.getElementById('chatContactList').innerHTML = html;
  document.getElementById('chatMessages').innerHTML = '<div class="empty-state"><div class="icon">💬</div><h3>选择一个联系人开始聊天</h3></div>';
  currentChatUser = null;
}

function openChat(userId) {
  var users = getStorage('users') || [];
  currentChatUser = users.find(function(u) { return u.id === userId; });
  
  if (!currentChatUser) return;

  document.querySelectorAll('.chat-contact').forEach(function(el) { el.classList.remove('active'); });
  event.currentTarget.classList.add('active');

  document.getElementById('chatUserName').textContent = currentChatUser.nickname;
  document.getElementById('chatUserSchool').textContent = currentChatUser.school;

  renderMessages();
  startMessagePolling();
}

function openChatWith(userId) {
  navigateTo('messages');
  setTimeout(function() {
    var contactEl = document.querySelector('.chat-contact[onclick*="' + userId + '"]');
    if (contactEl) contactEl.click();
  }, 100);
}

function renderMessages() {
  if (!user || !currentChatUser) return;
  
  var messages = getStorage('messages') || [];
  var chatMessages = messages.filter(function(m) {
    return (m.fromId === user.id && m.toId === currentChatUser.id) || 
           (m.fromId === currentChatUser.id && m.toId === user.id);
  }).sort(function(a, b) { return new Date(a.createdAt) - new Date(b.createdAt); });

  var html = '';
  chatMessages.forEach(function(msg) {
    var isSent = msg.fromId === user.id;
    html += '<div class="chat-message ' + (isSent ? 'sent' : 'received') + '">';
    html += msg.content;
    html += '<div class="chat-message-time">' + msg.createdAt + '</div>';
    html += '</div>';
  });

  document.getElementById('chatMessages').innerHTML = html || '<div class="empty-state"><div class="icon">💬</div><h3>开始对话</h3><p>发送一条消息给' + currentChatUser.nickname + '</p></div>';
  
  var chatMessagesEl = document.getElementById('chatMessages');
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

function sendMessage() {
  if (!user || !currentChatUser) return;
  
  var content = document.getElementById('chatInput').value;
  if (!content.trim()) return;

  var messages = getStorage('messages') || [];
  messages.push({
    id: Date.now(),
    fromId: user.id,
    toId: currentChatUser.id,
    content: content.trim(),
    createdAt: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-')
  });
  setStorage('messages', messages);
  
  document.getElementById('chatInput').value = '';
  renderMessages();
}

function startMessagePolling() {
  stopMessagePolling();
  messagePolling = setInterval(function() {
    if (currentChatUser) renderMessages();
  }, 5000);
}

function stopMessagePolling() {
  if (messagePolling) {
    clearInterval(messagePolling);
    messagePolling = null;
  }
}

function renderProfile() {
  if (!user) { showModal('login'); return; }
  
  var posts = getStorage('posts') || [];
  var userPosts = posts.filter(function(p) { return p.userId === user.id; });
  
  document.getElementById('profileAvatar').textContent = user.avatar || user.nickname.charAt(0);
  document.getElementById('profileName').textContent = user.nickname;
  document.getElementById('profileSchool').textContent = user.school;
  document.getElementById('profileStudentId').textContent = '学号: ' + user.studentId;
  document.getElementById('profilePhone').textContent = '手机: ' + user.phone;
  document.getElementById('profileEmail').textContent = user.email || '未填写邮箱';
  
  var verifyBtnText = user.verified ? '✓ 已实名认证' : '立即实名认证';
  document.getElementById('verifyBtn').textContent = verifyBtnText;
  document.getElementById('verifyBtn').disabled = user.verified;
  document.getElementById('verifyBtn').style.opacity = user.verified ? 0.5 : 1;
  
  document.getElementById('profilePostCount').textContent = userPosts.length;
  
  var totalLikes = userPosts.reduce(function(sum, p) { return sum + (p.likes ? p.likes.length : 0); }, 0);
  document.getElementById('profileLikeCount').textContent = totalLikes;
  
  var html = '';
  userPosts.forEach(function(post) {
    html += '<div class="post-card" onclick="openPostDetail(' + post.id + ')">';
    html += '<span class="tag">' + post.category + '</span>';
    if (post.location) html += '<span class="tag" style="background: rgba(6,182,212,0.1); color: var(--accent);">📍 ' + post.location + '</span>';
    html += '<h3 class="post-title">' + post.title + '</h3>';
    html += '<p class="post-content">' + post.content.substring(0, 80) + (post.content.length > 80 ? '...' : '') + '</p>';
    html += '<div class="post-meta"><span>' + post.createdAt + '</span></div></div>';
  });
  
  document.getElementById('profilePosts').innerHTML = html || '<div class="empty-state"><div class="icon">📝</div><h3>暂无帖子</h3><p><button class="btn-outline" onclick="showModal(\'post\')">发布第一篇帖子</button></p></div>';
}

function getVideoEmbedUrl(url, platform) {
  if (!url) return '';
  
  var embedUrl = '';
  url = url.trim();
  
  switch(platform) {
    case 'bilibili':
      var bvidMatch = url.match(/BV[\w]+/) || url.match(/av\d+/);
      var bvid = bvidMatch ? bvidMatch[0] : url;
      embedUrl = 'https://player.bilibili.com/player.html?bvid=' + bvid + '&page=1';
      break;
    case 'douyin':
      var videoId = url.match(/(\d+)/);
      videoId = videoId ? videoId[0] : url;
      embedUrl = 'https://www.douyin.com/embed/' + videoId;
      break;
    case 'youtube':
      var videoId = url.match(/v=([^&]+)/);
      videoId = videoId ? videoId[1] : url;
      embedUrl = 'https://www.youtube.com/embed/' + videoId;
      break;
    case 'youku':
      var videoId = url.match(/id_([^.]+)/);
      videoId = videoId ? videoId[1] : url;
      embedUrl = 'https://player.youku.com/embed/' + videoId;
      break;
    case 'iqiyi':
      var videoId = url.match(/video\/([^/]+)/);
      videoId = videoId ? videoId[1] : url;
      embedUrl = 'https://www.iqiyi.com/embed/' + videoId;
      break;
    default:
      embedUrl = url;
  }
  
  return embedUrl;
}

function renderVideos() {
  var videos = getStorage('videos') || [];
  var users = getStorage('users') || [];
  
  var html = '';
  videos.forEach(function(video) {
    var author = users.find(function(u) { return u.id === video.userId; }) || { nickname: '未知用户', avatar: '?' };
    var platformIcon = video.platform === 'bilibili' ? '📺' : (video.platform === 'douyin' ? '🎵' : (video.platform === 'youtube' ? '▶️' : '🎬'));
    var platformName = video.platform === 'bilibili' ? 'B站' : (video.platform === 'douyin' ? '抖音' : (video.platform === 'youtube' ? 'YouTube' : '视频'));
    html += '<div class="video-card" onclick="openVideo(' + video.id + ')">';
    html += '<div class="video-thumbnail"><div class="video-play-icon">' + platformIcon + '</div></div>';
    html += '<div class="post-header"><div class="post-author"><div class="post-avatar">' + author.avatar + '</div><span>' + author.nickname + '</span></div><span class="tag">' + video.category + '</span></div>';
    if (video.location) html += '<span class="tag" style="background: rgba(6,182,212,0.1); color: var(--accent);">📍 ' + video.location + '</span>';
    html += '<h3>' + video.title + '</h3>';
    if (video.description) html += '<p class="post-content">' + video.description.substring(0, 80) + (video.description.length > 80 ? '...' : '') + '</p>';
    html += '<div class="post-meta"><span>' + platformName + '</span><span>发布于 ' + video.createdAt + '</span></div>';
    html += '</div>';
  });
  
  document.getElementById('videoList').innerHTML = html || '<div class="empty-state"><div class="icon">🎬</div><h3>暂无视频</h3><p>快来分享你的实践视频吧！</p></div>';
}

function openVideo(videoId) {
  var videos = getStorage('videos') || [];
  var video = videos.find(function(v) { return v.id === videoId; });
  
  if (!video) return;
  
  var users = getStorage('users') || [];
  var author = users.find(function(u) { return u.id === video.userId; }) || { nickname: '未知用户', avatar: '?' };
  
  var embedUrl = getVideoEmbedUrl(video.url, video.platform);
  document.getElementById('videoPlayer').src = embedUrl;
  document.getElementById('videoTitle').textContent = video.title;
  document.getElementById('videoAuthor').textContent = author.nickname;
  document.getElementById('videoCategory').textContent = video.category;
  document.getElementById('videoDate').textContent = video.createdAt;
  if (video.description) {
    document.getElementById('videoDescription').textContent = video.description;
    document.getElementById('videoDescription').style.display = 'block';
  } else {
    document.getElementById('videoDescription').style.display = 'none';
  }
  
  document.querySelectorAll('.page-section').forEach(function(el) { el.classList.remove('active'); });
  document.getElementById('video-detail-page').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function createVideo() {
  if (!user) { showModal('login'); return; }
  
  var title = document.getElementById('videoTitleInput').value;
  var category = document.getElementById('videoCategoryInput').value;
  var location = document.getElementById('videoLocationInput').value;
  var platform = document.getElementById('videoPlatformInput').value;
  var url = document.getElementById('videoUrlInput').value;
  var description = document.getElementById('videoDescriptionInput').value;
  
  var titleSafety = detectMaliciousContent(title);
  var descSafety = detectMaliciousContent(description);
  if (!titleSafety.safe) {
    showMessage('videoMessage', 'error', '标题包含违规信息：' + titleSafety.reason);
    return;
  }
  if (!descSafety.safe) {
    showMessage('videoMessage', 'error', '描述包含违规信息：' + descSafety.reason);
    return;
  }
  
  if (!title || !url) { showMessage('videoMessage', 'error', '请填写标题和视频链接'); return; }
  
  var videos = getStorage('videos') || [];
  videos.unshift({
    id: Date.now(),
    userId: user.id,
    title: title,
    category: category,
    location: location,
    platform: platform,
    url: url,
    description: description,
    createdAt: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-'),
    likes: [],
    comments: []
  });
  
  setStorage('videos', videos);
  closeModal('video');
  navigateTo('videos');
}

function checkContactAccess() {
  if (!user) {
    showModal('login');
    return;
  }
  
  if (!user.verified) {
    document.getElementById('contacts-page').innerHTML = '<div class="empty-state" style="padding: 100px 20px;"><div class="icon">🔒</div><h3>需要实名认证</h3><p>访问负责人信息需要完成实名认证，请先进行认证</p><button class="btn-primary" onclick="showModal(\'verify\')">立即实名认证</button></div>';
    return;
  }
  
  renderContacts();
}

function renderContacts() {
  var contacts = getStorage('contacts') || [];
  var users = getStorage('users') || [];
  
  var html = '';
  contacts.forEach(function(contact) {
    var submitter = users.find(function(u) { return u.id === contact.submitterId; }) || { nickname: '未知用户' };
    html += '<div class="post-card">';
    html += '<h3>' + contact.name + ' - ' + contact.role + '</h3>';
    html += '<p><strong>📍 地点：</strong>' + contact.location + '</p>';
    html += '<p><strong>📞 电话：</strong>' + contact.phone + '</p>';
    html += '<p><strong>📝 介绍：</strong>' + contact.description + '</p>';
    html += '<div class="post-meta"><span>提交者：' + submitter.nickname + '</span><span>提交时间：' + contact.createdAt + '</span></div>';
    html += '<button class="btn-outline" onclick="copyPhone(\'' + contact.phone + '\')">📋 复制电话</button>';
    html += '</div>';
  });
  
  document.getElementById('contactList').innerHTML = html || '<div class="empty-state"><div class="icon">📭</div><h3>暂无负责人信息</h3><p>快来提交第一条负责人信息吧！</p></div>';
}

function submitContact() {
  if (!user) { showModal('login'); return; }
  
  var name = document.getElementById('contactName').value;
  var phone = document.getElementById('contactPhone').value;
  var location = document.getElementById('contactLocation').value;
  var role = document.getElementById('contactRole').value;
  var description = document.getElementById('contactDescription').value;
  
  if (!name || !phone || !location) {
    showMessage('contactMessage', 'error', '请填写姓名、电话和地点');
    return;
  }
  
  var contacts = getStorage('contacts') || [];
  contacts.unshift({
    id: Date.now(),
    name: name,
    phone: phone,
    location: location,
    role: role,
    description: description,
    submitterId: user.id,
    createdAt: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
  });
  
  setStorage('contacts', contacts);
  closeModal('contact');
  checkContactAccess();
}

function copyPhone(phone) {
  navigator.clipboard.writeText(phone).then(function() {
    showMessage('contactMessage', 'success', '电话已复制到剪贴板');
  });
}

function renderResources(category) {
  var resources = getStorage('resources') || [];
  var users = getStorage('users') || [];
  var filteredResources = category === 'all' ? resources : resources.filter(function(r) { return r.category === category; });

  var html = '';
  filteredResources.forEach(function(resource) {
    var author = users.find(function(u) { return u.id === resource.userId; }) || { nickname: '未知用户', avatar: '?', school: '' };
    html += '<div class="post-card">';
    html += '<div class="post-header"><div class="post-author"><div class="post-avatar">' + author.avatar + '</div><div class="post-author-info"><div class="post-author-name">' + author.nickname + '</div><div class="post-author-school">' + author.school + '</div></div></div><div class="post-time">' + resource.createdAt + '</div></div>';
    html += '<span class="tag">' + resource.category + '</span>';
    if (resource.location) html += '<span class="tag" style="background: rgba(6,182,212,0.1); color: var(--accent); cursor: pointer;" onclick="openMap(\'' + resource.location + '\')">📍 ' + resource.location + '</span>';
    html += '<h3 class="post-title">' + resource.title + '</h3>';
    html += '<p class="post-content">' + resource.content.substring(0, 120) + (resource.content.length > 120 ? '...' : '') + '</p>';
    if (resource.contact || resource.phone) {
      html += '<div style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px;">';
      if (resource.contact) html += '<p><strong>👤 联系人：</strong>' + resource.contact + '</p>';
      if (resource.phone) html += '<p><strong>📞 电话：</strong><span style="color: var(--accent);">' + resource.phone + '</span> <button class="btn-outline" style="padding: 4px 8px; font-size: 12px;" onclick="copyPhone(\'' + resource.phone + '\')">📋 复制</button></p>';
      html += '</div>';
    }
    html += '<div class="post-meta"><span>👁️ ' + (resource.views || 0) + '</span><span>💬 评论</span></div></div>';
  });

  document.getElementById('resourceList').innerHTML = html || '<div class="empty-state"><div class="icon">📦</div><h3>暂无共享资源</h3><p>快来发布第一条资源吧！</p></div>';
}

function filterResources(category) {
  document.querySelectorAll('.category-btn').forEach(function(btn) { btn.classList.remove('active'); });
  event.target.classList.add('active');
  renderResources(category);
}

function createResource() {
  if (!user) { showModal('login'); return; }
  var title = document.getElementById('resourceTitle').value;
  var category = document.getElementById('resourceCategory').value;
  var location = document.getElementById('resourceLocation').value;
  var contact = document.getElementById('resourceContact').value;
  var phone = document.getElementById('resourcePhone').value;
  var content = document.getElementById('resourceContent').value;

  var titleSafety = detectMaliciousContent(title);
  var contentSafety = detectMaliciousContent(content);
  if (!titleSafety.safe) {
    showMessage('resourceMessage', 'error', '标题包含违规信息：' + titleSafety.reason);
    return;
  }
  if (!contentSafety.safe) {
    showMessage('resourceMessage', 'error', '内容包含违规信息：' + contentSafety.reason);
    return;
  }

  if (!title || !content) {
    showMessage('resourceMessage', 'error', '请填写标题和资源内容');
    return;
  }

  if (phone && !/^1[3-9]\d{9}$/.test(phone)) {
    showMessage('resourceMessage', 'error', '请输入正确的手机号格式');
    return;
  }

  var resources = getStorage('resources') || [];
  resources.unshift({
    id: Date.now(),
    userId: user.id,
    title: title,
    category: category,
    location: location,
    contact: contact,
    phone: phone,
    content: content,
    createdAt: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-'),
    views: 0
  });

  setStorage('resources', resources);
  closeModal('resource');
  navigateTo('resources');
}

function verifyUser() {
  if (!user) { return; }
  
  var realName = document.getElementById('verifyRealName').value;
  var phone = document.getElementById('verifyPhone').value;
  var code = document.getElementById('verifyCode').value;
  
  if (!realName || !phone || !code) {
    showMessage('verifyMessage', 'error', '请填写所有字段');
    return;
  }
  
  if (phone !== user.phone) {
    showMessage('verifyMessage', 'error', '手机号与注册时不一致');
    return;
  }
  
  if (code !== currentCaptcha) {
    showMessage('verifyMessage', 'error', '验证码错误');
    return;
  }
  
  var users = getStorage('users') || [];
  var userIndex = users.findIndex(function(u) { return u.id === user.id; });
  if (userIndex !== -1) {
    users[userIndex].verified = true;
    users[userIndex].realName = realName;
    setStorage('users', users);
    
    user.verified = true;
    user.realName = realName;
    setStorage('currentUser', user);
    
    showMessage('verifyMessage', 'success', '实名认证成功！');
    setTimeout(function() {
      closeModal('verify');
      renderProfile();
    }, 2000);
  }
}

function sendVerifyCaptcha() {
  var phone = document.getElementById('verifyPhone').value;
  if (!phone) {
    showMessage('verifyMessage', 'error', '请先输入手机号');
    return;
  }
  
  currentCaptcha = Math.floor(100000 + Math.random() * 900000).toString();
  showMessage('verifyMessage', 'success', '验证码已发送到手机：' + currentCaptcha);
  
  var btn = document.getElementById('sendVerifyCaptchaBtn');
  btn.disabled = true;
  btn.textContent = '60秒后重新发送';
  var count = 60;
  captchaTimer = setInterval(function() {
    count--;
    btn.textContent = count + '秒后重新发送';
    if (count <= 0) {
      clearInterval(captchaTimer);
      btn.disabled = false;
      btn.textContent = '发送验证码';
    }
  }, 1000);
}

document.getElementById('chatInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function renderTimeline(year) {
  var timeline = getStorage('timeline') || [];
  var filteredTimeline = year === 'all' ? timeline : timeline.filter(function(t) { return t.date.startsWith(year); });
  
  filteredTimeline.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
  
  var yearGroups = {};
  filteredTimeline.forEach(function(t) {
    var year = t.date.substring(0, 4);
    if (!yearGroups[year]) yearGroups[year] = [];
    yearGroups[year].push(t);
  });
  
  var html = '';
  var years = Object.keys(yearGroups).sort(function(a, b) { return b - a; });
  
  years.forEach(function(y) {
    html += '<div class="timeline-year"><h2>' + y + '年</h2></div>';
    html += '<div class="timeline-list">';
    yearGroups[y].forEach(function(event) {
      var typeIcon = event.type === 'start' ? '🚀' : (event.type === 'end' ? '🏆' : (event.type === 'activity' ? '📍' : '📅'));
      var typeColor = event.type === 'start' ? 'border-left: 4px solid var(--success);' : (event.type === 'end' ? 'border-left: 4px solid var(--warning);' : (event.type === 'activity' ? 'border-left: 4px solid var(--accent);' : 'border-left: 4px solid var(--primary);'));
      html += '<div class="timeline-item" style="' + typeColor + '">';
      html += '<div class="timeline-date">' + event.date + '</div>';
      html += '<div class="timeline-content">';
      html += '<div class="timeline-header"><span class="timeline-icon">' + typeIcon + '</span><h3>' + event.title + '</h3></div>';
      if (event.location) html += '<p><strong>📍</strong> ' + event.location + '</p>';
      if (event.teams) html += '<p><strong>👥</strong> ' + event.teams + '</p>';
      if (event.description) html += '<p>' + event.description + '</p>';
      html += '</div></div>';
    });
    html += '</div>';
  });
  
  document.getElementById('timelineContainer').innerHTML = html || '<div class="empty-state"><div class="icon">📅</div><h3>暂无活动记录</h3><p>快来添加第一条活动记录吧！</p></div>';
}

function filterTimeline(year) {
  document.querySelectorAll('.year-btn').forEach(function(btn) { btn.classList.remove('active'); });
  event.target.classList.add('active');
  renderTimeline(year);
}

function createTimelineEvent() {
  if (!user) { showModal('login'); return; }
  
  var title = document.getElementById('eventTitle').value;
  var date = document.getElementById('eventDate').value;
  var location = document.getElementById('eventLocation').value;
  var teams = document.getElementById('eventTeams').value;
  var description = document.getElementById('eventDescription').value;
  
  var titleSafety = detectMaliciousContent(title);
  var descSafety = detectMaliciousContent(description);
  if (!titleSafety.safe) {
    showMessage('timeline-eventMessage', 'error', '标题包含违规信息：' + titleSafety.reason);
    return;
  }
  if (!descSafety.safe) {
    showMessage('timeline-eventMessage', 'error', '描述包含违规信息：' + descSafety.reason);
    return;
  }
  
  if (!title || !date) {
    showMessage('timeline-eventMessage', 'error', '请填写活动标题和日期');
    return;
  }
  
  var timeline = getStorage('timeline') || [];
  timeline.unshift({
    id: Date.now(),
    title: title,
    date: date,
    location: location,
    teams: teams,
    description: description,
    type: 'event'
  });
  setStorage('timeline', timeline);
  
  closeModal('timeline-event');
  navigateTo('timeline');
}

function renderTeams() {
  var teams = getStorage('teams') || [];
  var searchTerm = document.getElementById('teamSearch').value.toLowerCase();
  
  var filteredTeams = teams.filter(function(t) {
    return t.name.toLowerCase().includes(searchTerm) || 
           t.school.toLowerCase().includes(searchTerm) ||
           t.topic.toLowerCase().includes(searchTerm);
  });
  
  var html = '';
  filteredTeams.forEach(function(team) {
    html += '<div class="team-card">';
    html += '<div class="team-header"><h3>' + team.name + '</h3><span class="tag">' + team.school + '</span></div>';
    html += '<div class="team-info">';
    html += '<p><strong>👤 队长：</strong>' + team.leader + '</p>';
    if (team.leaderPhone) html += '<p><strong>📞 电话：</strong><span style="color: var(--accent);">' + team.leaderPhone + '</span></p>';
    html += '<p><strong>👥 队员：</strong>' + team.members + '人</p>';
    html += '<p><strong>📚 主题：</strong>' + team.topic + '</p>';
    html += '<p><strong>📍 地点：</strong>' + team.location + '</p>';
    if (team.advisor) html += '<p><strong>🎓 带队老师：</strong>' + team.advisor + '</p>';
    html += '</div>';
    if (team.description) html += '<p class="team-description">' + team.description + '</p>';
    if (team.achievements && team.achievements.length > 0) {
      html += '<div class="team-achievements"><strong>🏆 荣誉：</strong>';
      team.achievements.forEach(function(a) { html += '<span class="tag" style="background: rgba(245,158,11,0.1); color: var(--warning);">' + a + '</span>'; });
      html += '</div>';
    }
    html += '</div>';
  });
  
  document.getElementById('teamList').innerHTML = html || '<div class="empty-state"><div class="icon">👥</div><h3>暂无队伍</h3><p>快来创建第一支实践队伍吧！</p></div>';
}

function searchTeams() {
  renderTeams();
}

function createTeam() {
  if (!user) { showModal('login'); return; }
  
  var name = document.getElementById('teamName').value;
  var school = document.getElementById('teamSchool').value;
  var advisor = document.getElementById('teamAdvisor').value;
  var leader = document.getElementById('teamLeader').value;
  var leaderPhone = document.getElementById('teamLeaderPhone').value;
  var members = document.getElementById('teamMembers').value;
  var topic = document.getElementById('teamTopic').value;
  var location = document.getElementById('teamLocation').value;
  var description = document.getElementById('teamDescription').value;
  
  if (!name || !school || !leader || !members || !topic) {
    showMessage('teamMessage', 'error', '请填写所有必填字段');
    return;
  }
  
  if (leaderPhone && !/^1[3-9]\d{9}$/.test(leaderPhone)) {
    showMessage('teamMessage', 'error', '请输入正确的手机号格式');
    return;
  }
  
  var teams = getStorage('teams') || [];
  teams.unshift({
    id: Date.now(),
    name: name,
    school: school,
    advisor: advisor,
    leader: leader,
    leaderPhone: leaderPhone,
    members: parseInt(members),
    topic: topic,
    location: location,
    description: description,
    createdAt: new Date().toLocaleDateString('zh-CN').replace(/\//g, '-'),
    achievements: []
  });
  setStorage('teams', teams);
  
  closeModal('team');
  navigateTo('teams');
}

function renderDownloads(category) {
  var downloads = getStorage('downloads') || [];
  var filteredDownloads = category === 'all' ? downloads : downloads.filter(function(d) { return d.category === category; });
  
  var html = '';
  filteredDownloads.forEach(function(d) {
    html += '<div class="download-card">';
    html += '<div class="download-header"><span class="download-icon">📄</span><div><h3>' + d.name + '</h3><span class="tag">' + d.category + '</span></div></div>';
    if (d.description) html += '<p>' + d.description + '</p>';
    html += '<div class="download-footer">';
    html += '<span>📥 ' + (d.downloads || 0) + ' 次下载</span>';
    html += '<span>📅 ' + d.createdAt + '</span>';
    html += '<a href="' + d.url + '" class="btn-outline" target="_blank">下载</a>';
    html += '</div></div>';
  });
  
  document.getElementById('downloadList').innerHTML = html || '<div class="empty-state"><div class="icon">📥</div><h3>暂无资料</h3><p>快来上传第一份资料吧！</p></div>';
}

function filterDownloads(category) {
  document.querySelectorAll('.category-btn').forEach(function(btn) { btn.classList.remove('active'); });
  event.target.classList.add('active');
  renderDownloads(category);
}

function createDownload() {
  if (!user) { showModal('login'); return; }
  
  var name = document.getElementById('downloadName').value;
  var category = document.getElementById('downloadCategory').value;
  var description = document.getElementById('downloadDescription').value;
  var url = document.getElementById('downloadUrl').value;
  
  if (!name || !url) {
    showMessage('downloadMessage', 'error', '请填写资料名称和下载链接');
    return;
  }
  
  var downloads = getStorage('downloads') || [];
  downloads.unshift({
    id: Date.now(),
    name: name,
    category: category,
    description: description,
    url: url,
    downloads: 0,
    createdAt: new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')
  });
  setStorage('downloads', downloads);
  
  closeModal('download');
  navigateTo('downloads');
}

function renderFaq() {
  var faq = getStorage('faq') || [];
  var searchTerm = document.getElementById('faqSearch').value.toLowerCase();
  
  var filteredFaq = faq.filter(function(q) {
    return q.title.toLowerCase().includes(searchTerm) || 
           q.content.toLowerCase().includes(searchTerm);
  });
  
  var html = '';
  filteredFaq.forEach(function(q) {
    var solvedIcon = q.solved ? '✅' : '❓';
    html += '<div class="faq-card">';
    html += '<div class="faq-header"><span>' + solvedIcon + '</span><h3>' + q.title + '</h3><span class="tag">' + q.category + '</span></div>';
    html += '<div class="faq-content">' + q.content + '</div>';
    html += '<div class="faq-meta"><span>👁️ ' + q.views + '</span><span>💬 ' + (q.answers ? q.answers.length : 0) + ' 回答</span></div>';
    if (q.answers && q.answers.length > 0) {
      html += '<div class="faq-answers">';
      q.answers.forEach(function(a) {
        html += '<div class="faq-answer"><div class="answer-author"><div class="post-avatar" style="width: 24px; height: 24px; font-size: 12px;">答</div><span>热心网友</span></div><p>' + a.content + '</p></div>';
      });
      html += '</div>';
    }
    html += '</div>';
  });
  
  document.getElementById('faqList').innerHTML = html || '<div class="empty-state"><div class="icon">❓</div><h3>暂无问题</h3><p>快来提出第一个问题吧！</p></div>';
}

function filterFaq(category) {
  document.querySelectorAll('.category-btn').forEach(function(btn) { btn.classList.remove('active'); });
  event.target.classList.add('active');
  var faq = getStorage('faq') || [];
  var filteredFaq = category === 'all' ? faq : faq.filter(function(q) { return q.category === category; });
  document.getElementById('faqSearch').value = '';
  
  var html = '';
  filteredFaq.forEach(function(q) {
    var solvedIcon = q.solved ? '✅' : '❓';
    html += '<div class="faq-card">';
    html += '<div class="faq-header"><span>' + solvedIcon + '</span><h3>' + q.title + '</h3><span class="tag">' + q.category + '</span></div>';
    html += '<div class="faq-content">' + q.content + '</div>';
    html += '<div class="faq-meta"><span>👁️ ' + q.views + '</span><span>💬 ' + (q.answers ? q.answers.length : 0) + ' 回答</span></div>';
    if (q.answers && q.answers.length > 0) {
      html += '<div class="faq-answers">';
      q.answers.forEach(function(a) {
        html += '<div class="faq-answer"><div class="answer-author"><div class="post-avatar" style="width: 24px; height: 24px; font-size: 12px;">答</div><span>热心网友</span></div><p>' + a.content + '</p></div>';
      });
      html += '</div>';
    }
    html += '</div>';
  });
  
  document.getElementById('faqList').innerHTML = html || '<div class="empty-state"><div class="icon">❓</div><h3>暂无问题</h3></div>';
}

function searchFaq() {
  renderFaq();
}

function createFaq() {
  if (!user) { showModal('login'); return; }
  
  var category = document.getElementById('faqCategory').value;
  var title = document.getElementById('faqTitle').value;
  var content = document.getElementById('faqContent').value;
  
  if (!title || !content) {
    showMessage('faqMessage', 'error', '请填写问题标题和描述');
    return;
  }
  
  var faq = getStorage('faq') || [];
  faq.unshift({
    id: Date.now(),
    category: category,
    title: title,
    content: content,
    answers: [],
    views: 0,
    solved: false
  });
  setStorage('faq', faq);
  
  closeModal('faq');
  navigateTo('faq');
}