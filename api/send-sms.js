const https = require('https');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ success: false, message: 'Missing parameters' });
  }

  const SMSBAO_USER = process.env.SMSBAO_USER || 'sanxiaxiang';
  const SMSBAO_PASS = process.env.SMSBAO_PASS || '4a4a4a4a4a';
  
  const message = `【三下乡平台】您的验证码是：${code}，5分钟内有效。`;
  
  const params = new URLSearchParams({
    u: SMSBAO_USER,
    p: SMSBAO_PASS,
    m: phone,
    c: message
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.smsbao.com',
      path: '/sms',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': params.toString().length
      }
    };

    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        if (data === '0') {
          res.status(200).json({ success: true, message: '短信发送成功' });
        } else {
          res.status(200).json({ success: false, message: '短信发送失败', code: data });
        }
        resolve();
      });
    });

    request.on('error', (error) => {
      res.status(500).json({ success: false, message: '发送失败', error: error.message });
      resolve();
    });

    request.write(params.toString());
    request.end();
  });
};
