import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import yesBankLogo from "../assets/yesbank-logo.png";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(true);

  const token = localStorage.getItem("bankingToken");

  useEffect(() => {
    const loadDashboard = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [userResponse, transactionResponse] =
          await Promise.all([
            api.get("/users/me", { headers }),
            api.get("/transactions", { headers }),
          ]);

        const currentUser =
          userResponse.data.user || userResponse.data;

        setUser(currentUser);

        setTransactions(
          transactionResponse.data.transactions || []
        );
      } catch (error) {
        console.error("Dashboard loading error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("bankingToken");
          localStorage.removeItem("bankingUser");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate, token]);

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }

    return "U";
  };

  const handleLogout = () => {
    localStorage.removeItem("bankingToken");
    localStorage.removeItem("bankingUser");
    navigate("/login");
  };

  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return "XXXXXXXXXXXX";

    const account = String(accountNumber);

    if (account.length <= 4) {
      return account;
    }

    return `•••• •••• ${account.slice(-4)}`;
  };

  // Mask PAN - show only last 4 characters
  const maskPAN = (pan) => {
    if (!pan) return "-";

    const value = String(pan);

    if (value.length <= 4) {
      return value;
    }

    return `XXXXXX${value.slice(-4)}`;
  };

  // Mask Aadhaar - show only last 4 digits
  const maskAadhaar = (aadhaar) => {
    if (!aadhaar) return "-";

    const value = String(aadhaar).replace(/\s/g, "");

    if (value.length <= 4) {
      return value;
    }

    return `XXXX XXXX ${value.slice(-4)}`;
  };

  const totalTransferred = transactions.reduce(
    (total, transaction) =>
      total + Number(transaction.amount || 0),
    0
  );

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

          <p>Loading your banking dashboard...</p>
        </div>
      </div>
    );
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
            className="nav-item active"
            onClick={() => navigate("/dashboard")}
          >
            <span className="nav-icon">⌂</span>
            <span>Dashboard</span>
          </button>

          <button
            className="nav-item"
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
              <strong>Secure Banking</strong>
              <span>Your session is protected</span>
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
          MAIN
      ===================================================== */}

      <main className="dashboard-main">

        {/* =================================================
            TOP HEADER
        ================================================= */}

        <header className="dashboard-header">

          <div className="dashboard-welcome">

            <p className="welcome-small">
              PERSONAL BANKING
            </p>

            <h1>
              Welcome back,{" "}
              <span>
                {user?.name || "Customer"}
              </span>
            </h1>

            <p className="welcome-date">
              Here's your account overview for today.
            </p>

          </div>


          <div className="dashboard-header-right">

            <button
              className="header-icon-button"
              type="button"
              title="Notifications"
            >
              ♢
            </button>

            <div className="header-profile">

              <div className="profile-circle">
                {getInitial()}
              </div>

              <div className="profile-details">
                <strong>
                  {user?.name || "Customer"}
                </strong>

                <span>
                  {user?.accountType || "Savings Account"}
                </span>
              </div>

            </div>

          </div>

        </header>


        {/* =================================================
            BALANCE HERO
        ================================================= */}

        <section className="balance-hero">

          <div className="balance-main">

            <div className="balance-top-line">

              <span>
                AVAILABLE BALANCE
              </span>

              <button
                type="button"
                className="balance-visibility"
                onClick={() =>
                  setShowBalance(!showBalance)
                }
                title={
                  showBalance
                    ? "Hide balance"
                    : "Show balance"
                }
              >
                {showBalance ? "◉" : "○"}
              </button>

            </div>

            <div className="balance-value">

              <span>₹</span>

              <strong>
                {showBalance
                  ? formatAmount(user?.balance)
                  : "••••••••"}
              </strong>

            </div>


            <div className="balance-account">

              <span>
                A/C
              </span>

              <strong>
                {maskAccountNumber(
                  user?.accountNumber
                )}
              </strong>

              <span className="account-status">
                <i></i>
                ACTIVE
              </span>

            </div>

          </div>


          <div className="balance-side">

            <div className="balance-side-icon">
              ₹
            </div>

            <span>
              ACCOUNT TYPE
            </span>

            <strong>
              {user?.accountType ||
                "Savings Account"}
            </strong>

            <small>
              YES BANK
            </small>

          </div>

        </section>


        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="dashboard-section">

          <div className="section-heading">

            <div>
              <span className="section-label">
                SERVICES
              </span>

              <h2>
                Quick Actions
              </h2>
            </div>

          </div>


          <div className="quick-actions">

            <button
              className="premium-action-card transfer-action"
              onClick={() => navigate("/transfer")}
            >

              <div className="action-card-icon">
                ⇄
              </div>

              <div className="action-card-content">
                <h3>
                  Transfer Money
                </h3>

                <p>
                  Send money to a saved payee
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>

            </button>


            <button
              className="premium-action-card"
              onClick={() => navigate("/payees")}
            >

              <div className="action-card-icon">
                ♙
              </div>

              <div className="action-card-content">
                <h3>
                  Manage Payees
                </h3>

                <p>
                  Add or manage your payees
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>

            </button>


            <button
              className="premium-action-card"
              onClick={() => navigate("/account")}
            >

              <div className="action-card-icon">
                ◎
              </div>

              <div className="action-card-content">
                <h3>
                  My Account
                </h3>

                <p>
                  View your account details
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>

            </button>


            <button
              className="premium-action-card"
              onClick={() =>
                navigate("/transactions")
              }
            >

              <div className="action-card-icon">
                ▤
              </div>

              <div className="action-card-content">
                <h3>
                  Transactions
                </h3>

                <p>
                  View your complete history
                </p>
              </div>

              <span className="action-arrow">
                →
              </span>

            </button>

          </div>

        </section>


        {/* =================================================
            OVERVIEW STATISTICS
        ================================================= */}

        <section className="dashboard-stats">

          <div className="stat-card">

            <div className="stat-icon">
              ↗
            </div>

            <div>
              <span>
                TOTAL TRANSFERS
              </span>

              <strong>
                {transactions.length}
              </strong>

              <small>
                Transactions recorded
              </small>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon green">
              ₹
            </div>

            <div>
              <span>
                TOTAL TRANSFERRED
              </span>

              <strong>
                ₹{formatAmount(totalTransferred)}
              </strong>

              <small>
                Across your transactions
              </small>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon purple">
              ✓
            </div>

            <div>
              <span>
                ACCOUNT STATUS
              </span>

              <strong className="active-stat">
                Active
              </strong>

              <small>
                Banking access available
              </small>
            </div>

          </div>

        </section>


        {/* =================================================
            TRANSACTIONS + ACCOUNT STATUS
        ================================================= */}

        <div className="dashboard-two-column">


          {/* RECENT TRANSACTIONS */}

          <section className="dashboard-section transactions-panel">

            <div className="section-heading">

              <div>
                <span className="section-label">
                  ACTIVITY
                </span>

                <h2>
                  Recent Transactions
                </h2>
              </div>

              {transactions.length > 0 && (
                <button
                  className="view-link"
                  onClick={() =>
                    navigate("/transactions")
                  }
                >
                  View All →
                </button>
              )}

            </div>


            {transactions.length === 0 ? (

              <div className="empty-transactions">

                <div className="empty-icon">
                  ▤
                </div>

                <h3>
                  No transactions yet
                </h3>

                <p>
                  Your recent transfers will
                  appear here.
                </p>

              </div>

            ) : (

              <div className="recent-transactions">

                {transactions
                  .slice(0, 5)
                  .map((transaction) => (

                    <div
                      className="premium-transaction"
                      key={transaction._id}
                    >

                      <div className="transaction-left">

                        <div className="transaction-icon">
                          ↗
                        </div>

                        <div className="transaction-info">

                          <strong>
                            {transaction.payeeName ||
                              "Money Transfer"}
                          </strong>

                          <span>
                            {transaction.description ||
                              "Money Transfer"}
                          </span>

                          <small>
                            {formatDate(
                              transaction.createdAt
                            )}
                            {" • "}
                            {formatTime(
                              transaction.createdAt
                            )}
                          </small>

                        </div>

                      </div>


                      <div className="transaction-right">

                        <strong>
                          - ₹
                          {formatAmount(
                            transaction.amount
                          )}
                        </strong>

                        <span className="recent-status">
                          <i></i>
                          {transaction.status ||
                            "COMPLETED"}
                        </span>

                      </div>

                    </div>

                  ))}

              </div>

            )}

          </section>


          {/* ACCOUNT SECURITY */}

          <section className="dashboard-section account-health-panel">

            <div className="section-heading">

              <div>
                <span className="section-label">
                  ACCOUNT
                </span>

                <h2>
                  Account Overview
                </h2>
              </div>

            </div>


            <div className="account-health">

              <div className="health-circle">
                <div>
                  <strong>100%</strong>
                  <span>Secure</span>
                </div>
              </div>

              <h3>
                Your account is active
              </h3>

              <p>
                Your banking access is currently
                active and protected.
              </p>

            </div>


            <div className="security-list">

              <div className="security-item">
                <span>✓</span>

                <div>
                  <strong>
                    Account Status
                  </strong>

                  <small>
                    Active
                  </small>
                </div>
              </div>

              <div className="security-item">
                <span>✓</span>

                <div>
                  <strong>
                    Account Type
                  </strong>

                  <small>
                    {user?.accountType ||
                      "Savings Account"}
                  </small>
                </div>
              </div>

              <div className="security-item">
                <span>✓</span>

                <div>
                  <strong>
                    Bank
                  </strong>

                  <small>
                    YES BANK
                  </small>
                </div>
              </div>

            </div>

          </section>

        </div>


        {/* =================================================
            ACCOUNT INFORMATION
        ================================================= */}

        <section className="account-information">

          <div className="account-information-header">

            <div>
              <span className="section-label">
                ACCOUNT DETAILS
              </span>

              <h2>
                Your Banking Information
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/account")}
            >
              View Full Account →
            </button>

          </div>


          <div className="account-information-grid">

            <div>
              <span>
                ACCOUNT NUMBER
              </span>

              <strong>
                {user?.accountNumber || "-"}
              </strong>
            </div>


            <div>
              <span>
                ACCOUNT TYPE
              </span>

              <strong>
                {user?.accountType ||
                  "Savings Account"}
              </strong>
            </div>


            <div>
              <span>
                BANK
              </span>

              <strong>
                YES BANK
              </strong>
            </div>


            <div>
              <span>
                BRANCH
              </span>

              <strong>
                {user?.branch || "-"}
              </strong>
            </div>


            <div>
              <span>
                PAN
              </span>

              <strong>
                {maskPAN(user?.pan)}
              </strong>
            </div>


            <div>
              <span>
                AADHAAR
              </span>

              <strong>
                {maskAadhaar(user?.aadhaar)}
              </strong>
            </div>


            <div>
              <span>
                MOBILE
              </span>

              <strong>
                {user?.phone || "-"}
              </strong>
            </div>


            <div>
              <span>
                STATUS
              </span>

              <strong className="status-active">
                ● Active
              </strong>
            </div>


            <div className="account-address">

              <span>
                ADDRESS
              </span>

              <strong>
                {user?.address || "-"}
              </strong>

            </div>

          </div>

        </section>


        {/* =================================================
            FOOTER
        ================================================= */}

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

export default Dashboard;