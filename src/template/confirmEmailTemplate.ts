export const confirmEmailTemplate = (name: string, verifyLink: string) => {
    return `
    <!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 500px;
        margin: 40px auto;
        background-color: #ffffff;
        padding: 30px;
        text-align: center;
        border-radius: 10px;
      }
      .btn {
        display: inline-block;
        padding: 12px 25px;
        margin-top: 20px;
        background-color: #4CAF50;
        color: #ffffff;
        text-decoration: none;
        font-weight: bold;
        border-radius: 6px;
        transition: background-color 0.3s ease;
      }
      .btn:hover {
        background-color: #0056b3;
      }
      p {
        color: #333333;
        line-height: 1.6;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Halo ${name} 👋</h2>
      <p>Selamat datang! Kami senang Anda bergabung bersama kami.</p>
      <p>Untuk mengaktifkan akun Anda, silakan klik tombol di bawah ini untuk memverifikasi email Anda:</p>
      <a class="btn" target="_blank" href="${verifyLink}">Verifikasi Sekarang</a>
      <p style="margin-top: 30px; font-size: 12px; color: #888;">Jika Anda tidak mendaftar, abaikan email ini.</p>
    </div>
  </body>
</html>

    `
}