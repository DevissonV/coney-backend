export const getAuthorizationApprovedTemplate = ({
  userFullName,
  raffleName,
}) => {
  const subject = `✅ Autorización aprobada para la rifa ${raffleName}`;
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
                      <h1 style="color: #1976d2; margin: 0;">✅ CONEY</h1>
                    </td>
                  </tr>
  
                  <!-- Body -->
                  <tr>
                    <td>
                      <h2 style="color: #333;">¡Hola ${userFullName}!</h2>
                      <p style="color: #444;">
                        Nos complace informarte que la solicitud de autorización para tu rifa
                        <strong>${raffleName}</strong> ha sido <strong>aprobada</strong>.
                      </p>
  
                      <p style="color: #222; font-size: 16px; margin: 20px 0;">
                        🎉 Ahora puedes promocionar tu rifa públicamente en Coney y comenzar a recibir participantes.
                      </p>
  
                      <p style="color: #555; font-size: 14px;">
                        ¡Gracias por cumplir con todos los requisitos legales!
                      </p>
  
                      <p style="margin-top: 40px; color: #444;">
                        Saludos,<br />
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
