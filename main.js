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
  if (pageId === 'resources') renderResources();
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

function sanitizeInput(input) {
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

function sendCaptcha() {
  var type = getCaptchaType();
  
  if (type === 'phone') {
    var phone = document.getElementById('registerPhone').value;
    if (!phone) {
      showMessage('registerMessage', 'error', '请先输入手机号');
      return;
    }
    var phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      showMessage('registerMessage', 'error', '请输入正确的手机号格式');
      return;
    }
    currentCaptcha = Math.floor(100000 + Math.random() * 900000).toString();
    showMessage('registerMessage', 'success', '验证码 ' + currentCaptcha + ' 已发送至手机号 ' + phone.substring(0, 3) + '****' + phone.substring(7));
  } else {
    var email = document.getElementById('registerEmail').value;
    if (!email) {
      showMessage('registerMessage', 'error', '请先输入邮箱');
      return;
    }
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage('registerMessage', 'error', '请输入正确的邮箱格式');
      return;
    }
    currentCaptcha = Math.random().toString(36).substring(2, 8).toUpperCase();
    showMessage('registerMessage', 'success', '验证码 ' + currentCaptcha + ' 已发送至邮箱 ' + email);
  }
  
  var btn = document.getElementById('sendCaptchaBtn');
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

function renderVideos() {
  var videos = getStorage('videos') || [];
  var users = getStorage('users') || [];
  
  var html = '';
  videos.forEach(function(video) {
    var author = users.find(function(u) { return u.id === video.userId; }) || { nickname: '未知用户', avatar: '?' };
    html += '<div class="video-card" onclick="openVideo(' + video.id + ')">';
    html += '<div class="video-thumbnail"></div>';
    html += '<div class="post-header"><div class="post-author"><div class="post-avatar">' + author.avatar + '</div><span>' + author.nickname + '</span></div><span class="tag">' + video.category + '</span></div>';
    if (video.location) html += '<span class="tag" style="background: rgba(6,182,212,0.1); color: var(--accent);">📍 ' + video.location + '</span>';
    html += '<h3>' + video.title + '</h3>';
    html += '<p>发布于 ' + video.createdAt + '</p>';
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
  
  document.getElementById('videoPlayer').src = video.url;
  document.getElementById('videoTitle').textContent = video.title;
  document.getElementById('videoAuthor').textContent = author.nickname;
  document.getElementById('videoCategory').textContent = video.category;
  document.getElementById('videoDate').textContent = video.createdAt;
  
  document.querySelectorAll('.page-section').forEach(function(el) { el.classList.remove('active'); });
  document.getElementById('video-detail-page').classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function createVideo() {
  if (!user) { showModal('login'); return; }
  
  var title = document.getElementById('videoTitleInput').value;
  var category = document.getElementById('videoCategoryInput').value;
  var location = document.getElementById('videoLocationInput').value;
  var url = document.getElementById('videoUrlInput').value;
  
  if (!title || !url) { showMessage('videoMessage', 'error', '请填写标题和视频链接'); return; }
  
  var videos = getStorage('videos') || [];
  videos.unshift({
    id: Date.now(),
    userId: user.id,
    title: title,
    category: category,
    location: location,
    url: url,
    createdAt: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-')
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