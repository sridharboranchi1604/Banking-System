import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import yesBankLogo from "../assets/yesbank-logo.png";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("bankingToken", token);
      localStorage.setItem("bankingUser", JSON.stringify(user));

      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* =========================
          LEFT SIDE
      ========================= */}

      <section className="login-showcase">

        <div className="showcase-overlay"></div>

        <div className="showcase-content">

          <div className="showcase-brand">
            <img
              src={yesBankLogo}
              alt="YES BANK"
            />
          </div>

          <div className="showcase-text">

            <span className="showcase-tag">
              DIGITAL BANKING
            </span>

            <h1>
              Banking made
              <br />
              <span>simple & secure.</span>
            </h1>

            <p>
              Manage your account, transfer money,
              manage payees and track your transactions
              from one secure banking dashboard.
            </p>

          </div>


          <div className="security-points">

            <div className="security-point">
              <div className="security-icon">
                ✓
              </div>

              <div>
                <strong>Secure Banking</strong>
                <span>
                  Your account is protected
                </span>
              </div>
            </div>


            <div className="security-point">
              <div className="security-icon">
                ✓
              </div>

              <div>
                <strong>Easy Transfers</strong>
                <span>
                  Send money quickly and easily
                </span>
              </div>
            </div>


            <div className="security-point">
              <div className="security-icon">
                ✓
              </div>

              <div>
                <strong>24/7 Access</strong>
                <span>
                  Access your banking anytime
                </span>
              </div>
            </div>

          </div>

        </div>

      </section>


      {/* =========================
          RIGHT SIDE
      ========================= */}

      <section className="login-panel">

        <div className="login-container">

          <div className="mobile-bank-logo">
            <img
              src={yesBankLogo}
              alt="YES BANK"
            />
          </div>


          <div className="login-heading">

            <span className="login-welcome">
              WELCOME BACK
            </span>

            <h2>
              Sign in to your account
            </h2>

            <p>
              Enter your credentials to continue
              to your banking dashboard.
            </p>

          </div>


          {/* Error / Success message */}

          {message && (
            <div className="login-message">
              <span>!</span>
              {message}
            </div>
          )}


          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <div className="login-field">

              <label htmlFor="email">
                Email Address
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="login-field">

              <div className="password-label-row">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-link"
                  onClick={() =>
                    setMessage(
                      "Password recovery is not available in this college project."
                    )
                  }
                >
                  Forgot Password?
                </button>

              </div>


              <div className="input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "◉" : "○"}
                </button>

              </div>

            </div>


            {/* REMEMBER ME */}

            <label className="remember-row">

              <input
                type="checkbox"
              />

              <span>
                Remember me
              </span>

            </label>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span>→</span>
                </>
              )}

            </button>

          </form>


          {/* REGISTER */}

          <div className="create-account">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create Account
            </Link>

          </div>


          {/* SECURITY */}

          <div className="login-security">

            <span className="lock-symbol">
              🔒
            </span>

            <span>
              Your connection is secure
            </span>

          </div>


          {/* PROJECT NOTICE */}

          <div className="project-notice">
            College Project • Banking Management System
          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;