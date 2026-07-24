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
  if (pageId === 'messages') loadContacts();
  if (pageId === 'profile') renderProfile();
  if (pageId === 'videos') renderVideos();
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
      { id: 1, school: 'XX大学', studentId: '2023001', email: 'test@example.com', password: '123456', nickname: '张三', avatar: '张' },
      { id: 2, school: 'YY大学', studentId: '2023002', email: 'test2@example.com', password: '123456', nickname: '李四', avatar: '李' },
      { id: 3, school: 'ZZ大学', studentId: '2023003', email: 'test3@example.com', password: '123456', nickname: '王五', avatar: '王' }
    ]);
  }
  var posts = getStorage('posts');
  if (!posts || posts.length === 0) {
    setStorage('posts', [
      { id: 1, userId: 1, title: '我的三下乡实践心得', category: '心得体会', content: '这次三下乡实践让我收获很多，深入乡村了解了农村的发展现状，也锻炼了自己的实践能力。', createdAt: '2026-07-23 10:30', comments: [{ userId: 2, content: '写得真好！', createdAt: '2026-07-23 11:00' }], likes: [], favorites: [] },
      { id: 2, userId: 2, title: '求组队！暑期三下乡', category: '活动招募', content: '有没有同学想一起组队参加暑期三下乡活动？我们可以一起调研乡村产业发展。', createdAt: '2026-07-22 15:00', comments: [], likes: [], favorites: [] },
      { id: 3, userId: 1, title: '实践经验分享：如何做好调研', category: '经验分享', content: '分享一下我的调研经验：1. 提前做好准备工作；2. 多与当地居民交流；3. 注意安全问题。', createdAt: '2026-07-21 09:00', comments: [{ userId: 2, content: '非常实用！', createdAt: '2026-07-21 10:30' }], likes: [], favorites: [] },
      { id: 4, userId: 3, title: '急需帮助！关于三下乡申报材料', category: '求助问答', content: '有没有同学知道三下乡申报材料需要准备哪些东西？急！在线等！', createdAt: '2026-07-24 08:00', comments: [], likes: [], favorites: [] },
      { id: 5, userId: 1, title: '分享一个好用的调研工具', category: '资源分享', content: '给大家分享一个调研数据分析工具，非常实用，链接在这里：xxx', createdAt: '2026-07-24 09:30', comments: [], likes: [], favorites: [] }
    ]);
  }
  var videos = getStorage('videos');
  if (!videos || videos.length === 0) {
    setStorage('videos', [
      { id: 1, userId: 1, title: '三下乡实践纪录片', category: '纪录片', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', createdAt: '2026-07-23 14:00' },
      { id: 2, userId: 2, title: '乡村调研采访视频', category: '采访', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', createdAt: '2026-07-22 16:00' },
      { id: 3, userId: 1, title: '实践经验分享直播回放', category: '直播', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', createdAt: '2026-07-21 20:00' }
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

function sendCaptcha() {
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
  showMessage('registerMessage', 'success', '验证码已发送到邮箱：' + currentCaptcha + '（模拟）');
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
  var email = document.getElementById('registerEmail').value;
  var code = document.getElementById('registerCode').value;
  var password = document.getElementById('registerPassword').value;
  var confirmPassword = document.getElementById('registerConfirmPassword').value;

  if (!school || !studentId || !email || !code || !password || !confirmPassword) {
    showMessage('registerMessage', 'error', '请填写所有字段');
    return;
  }

  if (code.toUpperCase() !== currentCaptcha) {
    showMessage('registerMessage', 'error', '验证码错误');
    return;
  }

  if (password !== confirmPassword) {
    showMessage('registerMessage', 'error', '两次密码输入不一致');
    return;
  }

  var users = getStorage('users');
  var existingUser = users.find(function(u) { return u.email === email || u.studentId === studentId; });
  if (existingUser) {
    showMessage('registerMessage', 'error', '该邮箱或学号已被注册');
    return;
  }

  var newUser = {
    id: Date.now(),
    school: school,
    studentId: studentId,
    email: email,
    password: password,
    nickname: school + '-' + studentId.substring(0, 4),
    avatar: school.charAt(0)
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
  var foundUser = users.find(function(u) {
    return (u.email === account || u.studentId === account) && u.password === password;
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
    var isLiked = user && post.likes && post.likes.includes(user.id);
    var isFavorited = user && post.favorites && post.favorites.includes(user.id);
    html += '<div class="post-card" onclick="openPostDetail(' + post.id + ')">';
    html += '<div class="post-header"><div class="post-author"><div class="post-avatar">' + author.avatar + '</div><div class="post-author-info"><div class="post-author-name">' + author.nickname + '</div><div class="post-author-school">' + author.school + '</div></div></div><div class="post-time">' + post.createdAt + '</div></div>';
    html += '<span class="tag">' + post.category + '</span>';
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
  html += '<h1 class="post-title" style="margin-top: 20px;">' + post.title + '</h1>';
  html += '<p class="post-content" style="font-size: 16px; line-height: 1.8;">' + post.content + '</p>';
  html += '<div class="interaction-bar">';
  html += '<button class="interaction-btn ' + (isLiked ? 'liked active' : '') + '" onclick="toggleLike(' + postId + ')">👍 ' + (post.likes ? post.likes.length : 0) + '</button>';
  html += '<button class="interaction-btn ' + (isFavorited ? 'active' : '') + '" onclick="toggleFavorite(' + postId + ')">❤️ ' + (post.favorites ? post.favorites.length : 0) + '</button>';
  html += '<button class="interaction-btn" onclick="openChatWith(' + author.id + ')">💬 私信作者</button>';
  html += '</div>';

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
  var content = document.getElementById('postContent').value;
  if (!title || !content) { showMessage('postMessage', 'error', '请填写标题和内容'); return; }
  var posts = getStorage('posts') || [];
  posts.unshift({
    id: Date.now(),
    userId: user.id,
    title: title,
    category: category,
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
  document.getElementById('profileEmail').textContent = user.email;
  
  document.getElementById('profilePostCount').textContent = userPosts.length;
  
  var totalLikes = userPosts.reduce(function(sum, p) { return sum + (p.likes ? p.likes.length : 0); }, 0);
  document.getElementById('profileLikeCount').textContent = totalLikes;
  
  var html = '';
  userPosts.forEach(function(post) {
    html += '<div class="post-card" onclick="openPostDetail(' + post.id + ')">';
    html += '<span class="tag">' + post.category + '</span>';
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
  var url = document.getElementById('videoUrlInput').value;
  
  if (!title || !url) { showMessage('videoMessage', 'error', '请填写标题和视频链接'); return; }
  
  var videos = getStorage('videos') || [];
  videos.unshift({
    id: Date.now(),
    userId: user.id,
    title: title,
    category: category,
    url: url,
    createdAt: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-')
  });
  
  setStorage('videos', videos);
  closeModal('video');
  navigateTo('videos');
}

document.getElementById('chatInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});