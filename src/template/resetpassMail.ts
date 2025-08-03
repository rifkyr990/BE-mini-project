export const resetpassMailTemplate = (username: string, link: string) => {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Reset Your Password</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        background-color: #f4f5f6;
        font-family: Helvetica, sans-serif;
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 0 10px rgba(0,0,0,0.05);
        padding: 32px;
      }

      h1 {
        font-size: 24px;
        color: #333333;
        margin-bottom: 16px;
      }

      p {
        font-size: 16px;
        color: #555555;
        line-height: 1.5;
        margin-bottom: 24px;
      }

      a.button {
        display: inline-block;
        background-color: #0867ec;
        color: white !important;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-weight: bold;
        font-size: 16px;
      }

      .footer {
        text-align: center;
        font-size: 14px;
        color: #9a9ea6;
        margin-top: 32px;
      }

      @media only screen and (max-width: 600px) {
        .container {
          padding: 16px;
        }

        h1 {
          font-size: 20px;
        }

        a.button {
          display: block;
          width: 100%;
          text-align: center;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Hello, ${username}</h1>
      <p>We received a request to reset your password. Click the button below to reset it. This link will expire in 15 minutes for your security.</p>
      
      <p style="text-align: center;">
        <a href="${link}" class="button" target="_blank">Reset Password</a>
      </p>

      <p>If you didn’t request a password reset, you can safely ignore this email.</p>

      <p class="footer">
        &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
      </p>
    </div>
  </body>
</html>`;
};
