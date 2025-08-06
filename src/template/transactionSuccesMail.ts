export const transactionSuccessMail = (name: string, event: string, date: Date, location: any, ticketQty: number, totalPaid: number) => {
    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transaksi Tiket Berhasil</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f5f7fa;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #19b02f;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      padding: 20px;
    }
    .content h2 {
      color: #333333;
    }
    .details {
      background-color: #f0f0f0;
      padding: 15px;
      border-radius: 5px;
      margin-top: 10px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888888;
      padding: 20px;
    }
    a.button {
      display: block;
      margin: auto;
      text-align: center;
      padding: 10px 20px;
      background-color: #19b02f;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Transaksi Berhasil</h1>
    </div>
    <div class="content">
      <h2>Hai ${name},</h2>
      <p>Terima kasih telah melakukan pemesanan tiket. Berikut adalah detail transaksi Anda:</p>
      <div class="details">
        <p><strong>Nomor Tiket:</strong> TIKET123456</p>
        <p><strong>Acara:</strong> ${event}</p>
        <p><strong>Tanggal:</strong> ${date}</p>
        <p><strong>Waktu:</strong> 19.00 WIB</p>
        <p><strong>Lokasi:</strong> ${location}</p>
        <p><strong>Jumlah Tiket:</strong> ${ticketQty}</p>
        <p><strong>Total Pembayaran:</strong> Rp ${totalPaid}</p>
      </div>
      <p>Silakan unduh tiket Anda melalui tombol di bawah ini:</p>
      <a href="[link_download_tiket]" class="button">Unduh Tiket</a>
      <p>Jika Anda memiliki pertanyaan, silakan hubungi tim layanan pelanggan kami.</p>
    </div>
    <div class="footer">
      &copy; 2025 [Nama Perusahaan]. Semua hak dilindungi.
    </div>
  </div>
</body>
</html>
`
}