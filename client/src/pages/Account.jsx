import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import yesBankLogo from "../assets/yesbank-logo.png";

function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("bankingToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAccount = async () => {
      try {
        const response = await api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
      } catch (error) {
        console.error("Account fetch failed:", error);

        localStorage.removeItem("bankingToken");
        localStorage.removeItem("bankingUser");

        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("bankingToken");
    localStorage.removeItem("bankingUser");
    navigate("/login");
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getInitial = () => {
    return user?.name
      ? user.name.charAt(0).toUpperCase()
      : "U";
  };

  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return "XXXXXXXXXXXX";

    const account = String(accountNumber);

    if (account.length <= 4) {
      return account;
    }

    return `•••• •••• ${account.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-card">

          <img
            src={yesBankLogo}
            alt="YES BANK"
            className="loading-logo"
          />

          <div className="loading-spinner"></div>

          <p>
            Loading your account...
          </p>

        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-page">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          <img
            src={yesBankLogo}
            alt="YES BANK"
          />
        </div>

        <div className="sidebar-divider"></div>

        <nav className="sidebar-nav">

          <button
            className="nav-item"
            onClick={() => navigate("/dashboard")}
          >
            <span className="nav-icon">⌂</span>
            <span>Dashboard</span>
          </button>

          <button
            className="nav-item active"
            onClick={() => navigate("/account")}
          >
            <span className="nav-icon">◎</span>
            <span>My Account</span>
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/transfer")}
          >
            <span className="nav-icon">⇄</span>
            <span>Transfer Money</span>
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/payees")}
          >
            <span className="nav-icon">♙</span>
            <span>Payees</span>
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/transactions")}
          >
            <span className="nav-icon">▤</span>
            <span>Transactions</span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-security">

            <div className="security-check">
              ✓
            </div>

            <div>
              <strong>
                Secure Banking
              </strong>

              <span>
                Your session is protected
              </span>
            </div>

          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div className="dashboard-welcome">

            <p className="welcome-small">
              ACCOUNT MANAGEMENT
            </p>

            <h1>
              My Account
            </h1>

            <p className="welcome-date">
              Manage and review your personal banking information.
            </p>

          </div>

          <div className="dashboard-header-right">

            <button
              className="header-icon-button"
              type="button"
            >
              ♢
            </button>

            <div className="header-profile">

              <div className="profile-circle">
                {getInitial()}
              </div>

              <div className="profile-details">

                <strong>
                  {user.name}
                </strong>

                <span>
                  {user.accountType ||
                    "Savings Account"}
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* =================================================
            PROFILE HERO
        ================================================= */}

        <section className="account-profile-hero">

          <div className="account-profile-identity">

            <div className="account-large-avatar">
              {getInitial()}
            </div>

            <div>

              <span className="profile-eyebrow">
                YES BANK CUSTOMER
              </span>

              <h2>
                {user.name}
              </h2>

              <p>
                {user.email}
              </p>

            </div>

          </div>


          <div className="profile-active-status">

            <span className="status-dot"></span>

            <div>
              <strong>
                Account Active
              </strong>

              <small>
                Banking access enabled
              </small>
            </div>

          </div>

        </section>


        {/* =================================================
            BALANCE + ACCOUNT NUMBER
        ================================================= */}

        <section className="account-balance-grid">

          <div className="account-balance-card">

            <div className="account-card-heading">

              <div>
                <span>
                  AVAILABLE BALANCE
                </span>

                <h2>
                  ₹
                  {showBalance
                    ? formatAmount(user.balance)
                    : "••••••••"}
                </h2>
              </div>

              <button
                type="button"
                className="account-eye-button"
                onClick={() =>
                  setShowBalance(!showBalance)
                }
              >
                {showBalance ? "◉" : "○"}
              </button>

            </div>

            <div className="balance-card-footer">

              <span>
                {user.accountType ||
                  "Savings Account"}
              </span>

              <span>
                YES BANK
              </span>

            </div>

          </div>


          <div className="account-number-card">

            <div className="account-mini-icon">
              #
            </div>

            <div>

              <span>
                ACCOUNT NUMBER
              </span>

              <strong>
                {maskAccountNumber(
                  user.accountNumber
                )}
              </strong>

              <small>
                Your account information is protected
              </small>

            </div>

          </div>

        </section>


        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <section className="account-information">

          <div className="account-information-header">

            <div>

              <span className="section-label">
                PERSONAL INFORMATION
              </span>

              <h2>
                Customer Details
              </h2>

            </div>

          </div>


          <div className="account-information-grid">

            <div>
              <span>
                FULL NAME
              </span>

              <strong>
                {user.name}
              </strong>
            </div>

            <div>
              <span>
                EMAIL ADDRESS
              </span>

              <strong>
                {user.email}
              </strong>
            </div>

            <div>
              <span>
                MOBILE NUMBER
              </span>

              <strong>
                {user.phone || "-"}
              </strong>
            </div>

            <div>
              <span>
                CUSTOMER STATUS
              </span>

              <strong className="status-active">
                ● Active
              </strong>
            </div>

          </div>

        </section>


        {/* =================================================
            BANKING DETAILS
        ================================================= */}

        <section className="account-information">

          <div className="account-information-header">

            <div>

              <span className="section-label">
                BANKING INFORMATION
              </span>

              <h2>
                Account Details
              </h2>

            </div>

          </div>


          <div className="banking-details-grid">

            <div className="banking-detail-box">

              <span>
                ACCOUNT NUMBER
              </span>

              <strong>
                {user.accountNumber || "-"}
              </strong>

            </div>

            <div className="banking-detail-box">

              <span>
                ACCOUNT TYPE
              </span>

              <strong>
                {user.accountType ||
                  "Savings Account"}
              </strong>

            </div>

            <div className="banking-detail-box">

              <span>
                IFSC CODE
              </span>

              <strong>
                {user.ifsc || "-"}
              </strong>

            </div>

            <div className="banking-detail-box">

              <span>
                BRANCH
              </span>

              <strong>
                {user.branch || "-"}
              </strong>

            </div>

            <div className="banking-detail-box">

              <span>
                BANK
              </span>

              <strong>
                YES BANK
              </strong>

            </div>

            <div className="banking-detail-box">

              <span>
                ACCOUNT STATUS
              </span>

              <strong className="status-active">
                ● Active
              </strong>

            </div>

          </div>

        </section>


        {/* =================================================
            SECURITY CARD
        ================================================= */}

        <section className="account-security-banner">

          <div className="security-banner-icon">
            ✓
          </div>

          <div>

            <strong>
              Your account is secure
            </strong>

            <p>
              Your banking session is protected
              with secure authentication.
            </p>

          </div>

          <div className="security-badge">
            SECURE
          </div>

        </section>


        {/* FOOTER */}

        <footer className="dashboard-footer">

          <span>
            © 2026 Banking Management System
          </span>

          <span>
            Secure Digital Banking
          </span>

        </footer>

      </main>

    </div>
  );
}

export default Account;