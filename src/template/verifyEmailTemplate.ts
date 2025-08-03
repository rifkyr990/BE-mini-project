export const verifyEmailTemplate = (message: string) => `
    <html>
        <head>
            <title>Email Verified</title>
        </head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: green;">✅ Email Verified Successfully!</h1>
            <p>${message}</p>
            <p>Thank you for verifying your email. You can now <a href="http://localhost:3000/auth/login">log in</a>.</p>
        </body>
    </html>
`;
