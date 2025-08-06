export const verifyEmailTemplate = (message: string) => `
    <html>

    <head>
        <title>Email Berhasil Diverifikasi</title>
    </head>

    <body
        style="font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f9f9f9; color: #333;">
        <div
            style="max-width: 600px; margin: auto; background: #fff; padding: 40px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h1 style="color: #28a745;">✅ Email Anda Berhasil Diverifikasi!</h1>
            <p style="font-size: 16px; margin-top: 20px;">
                Terima kasih telah memverifikasi alamat email Anda. Akun Anda sekarang telah aktif dan siap digunakan.
            </p>
            <p style="font-size: 16px;">
                Silakan klik tombol di bawah ini untuk masuk ke akun Anda.
            </p>
            <a href="http://localhost:3000/auth/login"
                style="display: inline-block; margin-top: 25px; padding: 12px 25px; background-color: #28a745; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Masuk Sekarang
            </a>
            <p style="font-size: 14px; color: #888; margin-top: 40px;">
                Jika Anda tidak merasa melakukan pendaftaran ini, abaikan email ini atau hubungi tim dukungan kami.
            </p>
        </div>
    </body>
    </html>

`;
