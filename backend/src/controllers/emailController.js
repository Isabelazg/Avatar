import nodemailer from 'nodemailer';

/**
 * Envía el avatar por correo electrónico
 * POST /api/send-avatar-email
 * Body: { email: string, avatar: base64 }
 */
export const sendAvatarEmail = async (req, res) => {
  try {
    const { email, avatar } = req.body;

    // Validación
    if (!email || !avatar) {
      return res.status(400).json({
        success: false,
        error: 'Email y avatar son requeridos'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Email no válido'
      });
    }

    // Configurar transporte de correo
    let transporter;
    
    // Si no hay credenciales, usar Ethereal (testing)
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'tu-email@gmail.com') {
      console.log('No hay credenciales de Gmail. Usando Ethereal para testing...');
      
      // Crear cuenta de prueba en Ethereal
      const testAccount = await nodemailer.createTestAccount();
      
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      
      console.log('Cuenta de prueba creada:', testAccount.user);
    } else {
      // Usar Gmail con credenciales reales
      console.log('Usando Gmail con:', process.env.EMAIL_USER);
      
      // Remover espacios de la contraseña (Gmail App Passwords tienen espacios)
      const cleanPassword = process.env.EMAIL_PASS.replace(/\s/g, '');
      
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: cleanPassword
        }
      });
    }

    // Verificar la configuración
    await transporter.verify();
    console.log('Configuración de correo verificada');

    // Preparar el correo
    const mailOptions = {
      from: {
        name: 'Avatar Generator',
        address: process.env.EMAIL_USER || 'noreply@avatargenerator.com'
      },
      to: email,
      subject: 'Tu avatar está listo',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 10px 10px 0 0;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
              }
              .content {
                background: #f7fafc;
                padding: 30px;
                border-radius: 0 0 10px 10px;
              }
              .message {
                background: white;
                padding: 25px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .message p {
                margin: 15px 0;
              }
              .emoji {
                font-size: 24px;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                color: #718096;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Avatar Generator</h1>
            </div>
            <div class="content">
              <div class="message">
                <p><span class="emoji">👋</span> <strong>¡Hola!</strong></p>
                
                <p>Tu avatar generado con Inteligencia Artificial está listo.</p>
                
                <p>Te enviamos la imagen adjunta para que puedas usarla donde quieras:</p>
                
                <ul>
                  <li>Redes sociales</li>
                  <li>Perfiles profesionales</li>
                  <li>Plataformas de gaming</li>
                  <li>¡Donde tú quieras!</li>
                </ul>
                
                <p><strong>Gracias por usar nuestro generador de avatares.</strong></p>
                
                <p style="margin-top: 25px; color: #718096; font-size: 14px;">
                  <em>Si no solicitaste este correo, puedes ignorarlo de forma segura.</em>
                </p>
              </div>
            </div>
            <div class="footer">
              <p>Avatar Generator &copy; ${new Date().getFullYear()}</p>
              <p>Creado por Visto Bueno</p>
            </div>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: `avatar-${Date.now()}.png`,
          content: avatar,
          encoding: 'base64'
        }
      ]
    };

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);

    console.log('Correo enviado:', info.messageId);
    
    // Si es Ethereal, mostrar el preview URL
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'tu-email@gmail.com') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('Preview URL (Ethereal):', previewUrl);
      
      return res.status(200).json({
        success: true,
        message: 'Avatar enviado correctamente (Modo Testing)',
        messageId: info.messageId,
        previewUrl: previewUrl,
        note: 'MODO TESTING: El correo no se envió realmente. Abre el previewUrl para verlo.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Avatar enviado correctamente',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Error al enviar correo:', error);
    
    // Mensajes de error más específicos
    let errorMessage = 'Error al enviar el correo';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Error de autenticación del correo. Verifica las credenciales.';
    } else if (error.code === 'ESOCKET') {
      errorMessage = 'Error de conexión. Verifica tu conexión a Internet.';
    }

    res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
};
