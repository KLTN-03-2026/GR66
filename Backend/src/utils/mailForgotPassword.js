import nodemailer from 'nodemailer';

export const SendMailForgotPassword = async (email, otp) => {
    try {
        // Tạo transporter dùng Gmail + App Password
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        // Gửi mail
        const info = await transporter.sendMail({
            from: `"DTU_TRAVEL" <${process.env.MAIL_USERNAME}>`,
            to: email,
            subject: 'Yêu cầu đặt lại mật khẩu',
            text: `Mã OTP để đặt lại mật khẩu của bạn là: ${otp}`,
            html: `
                <!DOCTYPE html>
                <html lang="vi">
                <head>
                    <meta charset="UTF-8">
                </head>
                <body style="margin:0; padding:0; font-family: Arial, sans-serif; background:#f4f6f8;">
                
                <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 8px 20px rgba(0,0,0,0.1);">
                    
                    <div style="background:#1e3a8a; padding:20px; text-align:center; color:white;">
                        <div style="font-size:22px; font-weight:bold;">
                            DTU_TRAVEL
                        </div>
                        <div style="font-size:14px;">
                            Yêu cầu đặt lại mật khẩu
                        </div>
                    </div>

                    <div style="padding:30px;">
                        <h2 style="text-align:center;">Quên mật khẩu</h2>

                        <p>Bạn hoặc ai đó đã yêu cầu đặt lại mật khẩu.</p>
                        <p>Vui lòng sử dụng mã OTP bên dưới:</p>

                        <div style="text-align:center; margin:30px 0;">
                            <div style="
                                display:inline-block;
                                padding:18px 40px;
                                font-size:28px;
                                font-weight:bold;
                                letter-spacing:6px;
                                color:#ffffff;
                                background:#3b82f6;
                                border-radius:12px;
                            ">
                                ${otp}
                            </div>
                        </div>

                        <p style="color:#6b7280;">
                            Nếu bạn không yêu cầu, hãy bỏ qua email này.
                        </p>
                    </div>

                    <div style="background:#f1f5f9; text-align:center; padding:20px; font-size:13px; color:#6b7280;">
                        Trân trọng,<br/>
                        <strong>DTU_TRAVEL</strong>
                    </div>

                </div>

                </body>
                </html>
            `,
        });

        console.log(" Mail sent:", info.messageId);
        return info;

    } catch (error) {
        console.error(" Send mail error:", error);
        throw error;
    }
};