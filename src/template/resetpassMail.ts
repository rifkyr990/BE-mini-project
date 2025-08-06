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
        background-color: #19b02f;
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
      <h1>Halo, ${username}</h1>
      <p>Kami menerima permintaan untuk mengatur ulang kata sandi Anda. Klik tombol di bawah ini untuk melanjutkan. Tautan ini akan kedaluwarsa dalam 15 menit demi keamanan Anda.</p>

      <p style="text-align: center;">
        <a href="${link}" class="button" target="_blank">Atur Ulang Kata Sandi</a>
      </p>

      <p>Jika Anda tidak meminta pengaturan ulang kata sandi, Anda dapat mengabaikan email ini dengan aman.</p>

      <p class="footer">
        &copy; ${new Date().getFullYear()} Ticket.com. Seluruh hak cipta dilindungi.
      </p>
    </div>
  </body>
</html>`;
};
