const https = require('https');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ success: false, message: 'Missing parameters' });
  }

  const SMTP2GO_KEY = process.env.SMTP2GO_KEY || 'api-xxx';
  
  const payload = {
    to: [{ email: email }],
    from: 'noreply@sanxiaxiang.com',
    subject: '三下乡平台验证码',
    text_body: `您的验证码是：${code}，5分钟内有效。`,
    html_body: `<p>您的验证码是：<strong>${code}</strong>，5分钟内有效。</p>`
  };

  return new Promise((resolve) => {
    const jsonPayload = JSON.stringify(payload);
    const options = {
      hostname: 'api.smtp2go.com',
      path: '/v3/email/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Smtp2go-Api-Key': SMTP2GO_KEY,
        'Content-Length': jsonPayload.length
      }
    };

    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.status === 'success') {
            res.status(200).json({ success: true, message: '邮件发送成功' });
          } else {
            res.status(200).json({ success: false, message: '邮件发送失败' });
          }
        } catch (e) {
          res.status(200).json({ success: false, message: '邮件发送失败' });
        }
        resolve();
      });
    });

    request.on('error', (error) => {
      res.status(500).json({ success: false, message: '发送失败', error: error.message });
      resolve();
    });

    request.write(jsonPayload);
    request.end();
  });
};
