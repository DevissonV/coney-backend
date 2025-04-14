/**
 * Generates the email content for the raffle winner.
 *
 * @param {Object} data
 * @param {string} data.userFullName - Full name of the winner.
 * @param {string} data.raffleName - Name of the raffle.
 * @param {string} data.raffleDescription - Description or prize details.
 * @param {string|number} data.winningNumber - The number that won.
 * @returns {Object} An object containing subject and HTML body.
 */
export const getWinnerNotificationTemplate = ({
  userFullName,
  raffleName,
  raffleDescription,
  winningNumber,
}) => {
  const subject = `🎉 ¡Felicidades, ${userFullName}! Has ganado la rifa ${raffleName}`;
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
                      <h2 style="color: #333;">¡Felicidades, ${userFullName}!</h2>
                      <p style="color: #444;">
                        Eres el ganador de la rifa <strong>${raffleName}</strong>.
                      </p>
  
                      <p style="color: #222; font-size: 16px; margin: 20px 0;">
                        🎁 <strong>Detalles de la rifa:</strong> ${raffleDescription || '—'}
                      </p>
  
                      <p style="color: #222; font-size: 16px;">
                        🏅 <strong>Número ganador:</strong> ${winningNumber}
                      </p>
  
                      <p style="color: #555; font-size: 14px;">
                        Muy pronto nos estaremos contactando contigo para coordinar la entrega del premio.
                      </p>
  
                      <p style="margin-top: 40px; color: #444;">
                        ¡Gracias por jugar con nosotros!<br />
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
