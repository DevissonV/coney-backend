/**
 * Generates the email content for password recovery.
 *
 * @param {Object} data - Data for the template.
 * @param {string} data.resetUrl - URL where the user can reset the password.
 * @returns {Object} An object containing subject and HTML body.
 */
export const getPasswordRecoveryTemplate = ({ resetUrl }) => {
  const subject = 'Recuperación de contraseña';
  const html = `
      <html lang="es">
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center">
                <table width="600" style="background-color: white; border-radius: 8px; padding: 30px;">
                  <!-- Header -->
                  <tr>
                    <td align="center" style="padding-bottom: 20px;">
                      <h1 style="color: #1976d2; margin: 0;">🏆 CONEY</h1>
                    </td>
                  </tr>
  
                  <!-- Body -->
                  <tr>
                    <td>
                      <h2 style="color: #333;">Recuperación de contraseña</h2>
                      <p style="color: #444;">
                        Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para continuar:
                      </p>
  
                      <div style="text-align: center; margin: 30px 0;">
                        <a
                          href="${resetUrl}"
                          style="
                            background-color: #1976d2;
                            color: white;
                            padding: 14px 30px;
                            text-decoration: none;
                            border-radius: 6px;
                            font-size: 16px;
                            display: inline-block;
                          "
                        >
                          Restablecer contraseña
                        </a>
                      </div>
  
                      <p style="color: #777; font-size: 14px;">
                        Si no realizaste esta solicitud, puedes ignorar este mensaje. Tu contraseña actual no se verá afectada.
                      </p>
  
                      <p style="margin-top: 40px; color: #444;">
                        Gracias,<br />
                        <strong>Equipo Coney</strong>
                      </p>
                    </td>
                  </tr>
  
                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding-top: 30px;">
                      <p style="font-size: 12px; color: #aaa;">© 2025 Coney. Todos los derechos reservados.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

  return { subject, html };
};
