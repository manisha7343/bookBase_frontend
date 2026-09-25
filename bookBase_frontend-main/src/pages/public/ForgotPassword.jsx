import { Link } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";

// There is no email service in this project, so password resets are
// handled at the library desk. Signed-in users can change their password
// themselves from the Profile page.
export default function ForgotPassword() {
  const { settings } = useSettings();
  const hasContact = settings.contactEmail || settings.contactPhone;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Forgot your password?</h1>
        <p className="auth-subtitle">
          Password resets are handled by the library staff. Contact the librarian with the email
          address you registered with, and they will help you get back into your account.
        </p>

        {hasContact ? (
          <dl className="info-list info-list-boxed">
            {settings.contactEmail && (
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${settings.contactEmail}?subject=Password reset request`}>
                    {settings.contactEmail}
                  </a>
                </dd>
              </div>
            )}
            {settings.contactPhone && (
              <div>
                <dt>Phone</dt>
                <dd>{settings.contactPhone}</dd>
              </div>
            )}
          </dl>
        ) : (
          <p className="muted">Please visit the library help desk in person.</p>
        )}

        <p className="muted">
          If you remember your current password, sign in and change it from your Profile page.
        </p>

        <Link to="/login" className="btn btn-secondary btn-block">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
