export const transactionFailedMail = (name: string, event: string, date: Date, location: any, ticketQty: number, totalPaid: number) => {
    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transaksi Gagal</title>
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
      background-color: #e53935;
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
      background-color: #fff3f3;
      padding: 15px;
      border-radius: 5px;
      margin-top: 10px;
      border: 1px solid #ffcdd2;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #888888;
      padding: 20px;
    }
    a.button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #e53935;
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
      <h1>Transaksi Gagal</h1>
    </div>
    <div class="content">
      <h2>Hai ${name},</h2>
      <p>Sayangnya, transaksi pembelian tiket Anda tidak berhasil. Berikut adalah detail transaksi Anda:</p>
      <div class="details">
        <p><strong>Nomor Referensi:</strong> REF123456</p>
        <p><strong>Acara:</strong> ${event}</p>
        <p><strong>Tanggal:</strong> ${date}</p>
        <p><strong>Waktu:</strong> 19.00 WIB</p>
        <p><strong>Lokasi:</strong> ${location}</p>
        <p><strong>Jumlah Tiket:</strong> ${ticketQty}</p>
        <p><strong>Total Pembayaran: ${totalPaid}</strong> </p>
        <p><strong>Status:</strong> Gagal</p>
      </div>
      <p>Kemungkinan penyebab:</p>
      <ul>
        <li>Saldo atau limit kartu tidak mencukupi</li>
        <li>Koneksi pembayaran terganggu</li>
        <li>Data pembayaran tidak valid</li>
      </ul>
      <p>Silakan coba kembali transaksi Anda atau hubungi layanan pelanggan jika masalah berlanjut.</p>
      <a href="[link_ulang_transaksi]" class="button">Coba Lagi</a>
    </div>
    <div class="footer">
      &copy; 2025 Ticket.com. Semua hak dilindungi.
    </div>
  </div>
</body>
</html>
`
}