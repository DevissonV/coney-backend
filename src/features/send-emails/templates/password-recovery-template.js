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
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Solicitud de recuperación de contraseña</h2>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
            Restablecer contraseña
          </a>
        </p>
        <p>Si no realizaste esta solicitud, puedes ignorar este mensaje.</p>
        <p style="margin-top: 30px;">Gracias,<br>Equipo Coney</p>
      </div>
    `;

  return { subject, html };
};
