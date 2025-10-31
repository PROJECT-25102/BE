export const getVerifyTemplateMail = ({ email, link }) => {
  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <title>Xác thực tài khoản — BEESTAR</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      body {
        margin: 0;
        padding: 0;
        background: #f8f9fa;
        font-family: "Helvetica Neue", Arial, sans-serif;
        color: #222;
      }

      .wrapper {
        width: 100%;
        padding: 40px 0;
      }

      .container {
        max-width: 580px;
        background: #fff;
        margin: 0 auto;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
      }

      .header {
        text-align: center;
        padding: 36px 24px 16px;
        border-bottom: 1px solid #eee;
      }

      .logo {
        display: inline-block;
        background: #ef4444;
        color: #fff;
        font-weight: 700;
        font-size: 22px;
        border-radius: 10px;
        padding: 12px 18px;
        box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2);
      }

      .brand {
        color: #ef4444;
        font-size: 18px;
        margin-top: 10px;
        color: #111;
        font-weight: 700;
      }

      .subtitle {
        font-size: 14px;
        color: #666;
        margin-top: 4px;
      }

      .content {
        padding: 32px 36px;
        line-height: 1.6;
      }

      .title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 12px;
        color: #111;
      }

      .text {
        font-size: 15px;
        color: #333;
        margin-bottom: 24px;
      }

      .highlight {
        color: #ef4444;
        font-weight: 500;
      }

      .btn {
        display: inline-block;
        background: #ef4444;
        color: #fff;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        text-decoration: none;
      }

      .note {
        font-size: 13px;
        color: #555;
        margin-top: 24px;
      }

      .note a {
        color: #ef4444;
        word-break: break-all;
      }

      .footer {
        text-align: center;
        padding: 20px 32px;
        background: #fafafa;
        border-top: 1px solid #eee;
        color: #555;
        font-size: 13px;
      }

      .footer a {
        color: #ef4444;
        text-decoration: none;
      }

      @media (max-width: 480px) {
        .content {
          padding: 24px;
        }
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <div class="header">
          <div class="brand">BEESTAR</div>
          <div class="subtitle">Nền tảng đặt vé xem phim nổi tiếng</div>
        </div>

        <div class="content">
          <p class="title">Xác thực địa chỉ email của bạn</p>
          <p class="text">
            Xin chào <strong>${email}</strong>, cảm ơn bạn đã đăng ký tài khoản tại
            <span class="highlight">BEESTAR</span>. Nhấn nút bên dưới để xác thực email
            và hoàn tất quá trình đăng ký.
          </p>

          <a href="${link}" class="btn" target="_blank" rel="noopener noreferrer">
            Xác thực tài khoản
          </a>

          <p class="note">
            Liên kết xác thực có hiệu lực trong <span class="highlight">24 giờ</span>.
            Nếu bạn không đăng ký BEESTAR, vui lòng bỏ qua email này.
          </p>
        </div>

        <div class="footer">
          BEESTAR — Kết nối nhanh, tiện ích hơn
        </div>
      </div>
    </div>
  </body>
</html>`;
};

export const getResetPasswordTemplateMail = ({ email, password }) => {
  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <title>Mật khẩu mới của bạn — BEESTAR</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      body {
        margin: 0;
        padding: 0;
        background: #f8f9fa;
        font-family: "Helvetica Neue", Arial, sans-serif;
        color: #222;
      }

      .wrapper {
        width: 100%;
        padding: 40px 0;
      }

      .container {
        max-width: 580px;
        background: #fff;
        margin: 0 auto;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
      }

      .header {
        text-align: center;
        padding: 36px 24px 16px;
        border-bottom: 1px solid #eee;
      }

      .logo {
        display: inline-block;
        background: #ef4444;
        color: #fff;
        font-weight: 700;
        font-size: 22px;
        border-radius: 10px;
        padding: 12px 18px;
        box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2);
      }

      .brand {
        color: #ef4444;
        font-size: 18px;
        margin-top: 10px;
        color: #111;
        font-weight: 700;
      }

      .subtitle {
        font-size: 14px;
        color: #666;
        margin-top: 4px;
      }

      .content {
        padding: 32px 36px;
        line-height: 1.6;
      }

      .title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 12px;
        color: #111;
      }

      .text {
        font-size: 15px;
        color: #333;
        margin-bottom: 24px;
      }

      .highlight {
        color: #ef4444;
        font-weight: 500;
      }

      .btn {
        display: inline-block;
        background: #ef4444;
        color: #fff;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        text-decoration: none;
      }

      .note {
        font-size: 13px;
        color: #555;
        margin-top: 24px;
      }

      .note a {
        color: #ef4444;
        word-break: break-all;
      }

      .footer {
        text-align: center;
        padding: 20px 32px;
        background: #fafafa;
        border-top: 1px solid #eee;
        color: #555;
        font-size: 13px;
      }

      .footer a {
        color: #ef4444;
        text-decoration: none;
      }

      @media (max-width: 480px) {
        .content {
          padding: 24px;
        }
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <div class="header">
          <div class="brand">BEESTAR</div>
          <div class="subtitle">Nền tảng đặt vé xem phim nổi tiếng</div>
        </div>

        <div class="content">
          <p class="title">Yêu cầu đặt lại mật khẩu</p>
          <p class="text">
            Xin chào <strong>${email}</strong>, chúng tôi đã đặt lại mật khẩu mới của bạn
          </p>

          <button class="btn">
            ${password}
          </button>

          <p class="note">
           Không chia sẻ mật khẩu cho bất kỳ ai để tránh rò rỉ thông tin. Chúng tôi sẽ không chịu trách nghiệm
          </p>
        </div>

        <div class="footer">
          BEESTAR — Kết nối nhanh, tiện ích hơn
        </div>
      </div>
    </div>
  </body>
</html>`;
};
