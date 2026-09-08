import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import yesBankLogo from "../assets/yesbank-logo.png";

function Transactions() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("bankingToken");

  useEffect(() => {
    const loadTransactions = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/transactions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTransactions(
          response.data.transactions || []
        );

      } catch (err) {

        console.error(
          "Transaction loading error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load transactions."
        );

      } finally {
        setLoading(false);
      }
    };

    loadTransactions();

  }, [navigate, token]);


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (date) => {

    if (!date) return "-";

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };


  // =====================================================
  // FORMAT AMOUNT
  // =====================================================

  const formatAmount = (amount) => {

    return Number(amount || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };


  // =====================================================
  // STATS
  // =====================================================

  const completedTransactions =
    transactions.filter(
      (transaction) =>
        transaction.status === "COMPLETED"
    );


  const totalTransferred =
    completedTransactions.reduce(
      (total, transaction) =>
        total +
        Number(transaction.amount || 0),
      0
    );


  const successfulCount =
    completedTransactions.length;


  // =====================================================
  // INITIAL
  // =====================================================

  const getInitial = (name) => {

    return (
      name?.charAt(0)?.toUpperCase() ||
      "P"
    );
  };


  // =====================================================
  // UTR DISPLAY
  // =====================================================

  const getUTR = (transaction) => {

    return (
      transaction.utr ||
      transaction.referenceId ||
      "-"
    );
  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {

    localStorage.removeItem(
      "bankingToken"
    );

    localStorage.removeItem(
      "bankingUser"
    );

    navigate("/login");
  };


  // =====================================================
  // REFRESH
  // =====================================================

  const refreshTransactions = () => {
    window.location.reload();
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="banking-loading">

        <div className="loading-card">

          <img
            src={yesBankLogo}
            alt="YES BANK"
            className="loading-logo"
          />

          <div className="loading-spinner"></div>

          <p>
            Loading transactions...
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="dashboard-page">

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside className="sidebar">

        <div className="sidebar-logo">

          <img
            src={yesBankLogo}
            alt="YES BANK"
          />

        </div>


        <nav className="sidebar-nav">

          <button
            className="nav-item"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <span>⌂</span>
            Dashboard
          </button>


          <button
            className="nav-item"
            onClick={() =>
              navigate("/account")
            }
          >
            <span>👤</span>
            My Account
          </button>


          <button
            className="nav-item"
            onClick={() =>
              navigate("/transfer")
            }
          >
            <span>↗</span>
            Transfer Money
          </button>


          <button
            className="nav-item"
            onClick={() =>
              navigate("/payees")
            }
          >
            <span>👥</span>
            Payees
          </button>


          <button
            className="nav-item active"
            onClick={() =>
              navigate("/transactions")
            }
          >
            <span>▤</span>
            Transactions
          </button>

        </nav>


        <div className="sidebar-security">

          <div className="security-icon">
            🔒
          </div>

          <div>

            <strong>
              Secure Banking
            </strong>

            <span>
              Your connection is protected
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

      </aside>


      {/* ==========================================
          MAIN
      ========================================== */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <p className="welcome-small">
              Account Activity
            </p>

            <h1>
              Transaction History
            </h1>

          </div>


          <div className="profile-circle">
            P
          </div>

        </header>


        {/* ==========================================
            HERO
        ========================================== */}

        <section className="transactions-hero">

          <div className="transactions-hero-content">

            <div className="transactions-hero-icon">
              ▤
            </div>

            <div>

              <p className="transactions-eyebrow">
                TRANSACTION HISTORY
              </p>

              <h2>
                Track every transfer
              </h2>

              <p>
                View and monitor your recent banking
                activity in one place.
              </p>

            </div>

          </div>


          <div className="transaction-activity-badge">

            <span className="activity-dot"></span>

            <div>

              <strong>
                Account Activity
              </strong>

              <small>
                Up to date
              </small>

            </div>

          </div>

        </section>


        {/* ==========================================
            ERROR
        ========================================== */}

        {error && (

          <div className="transfer-message error">

            <span>!</span>

            <div>

              <strong>
                Unable to load transactions
              </strong>

              <p>
                {error}
              </p>

            </div>

          </div>

        )}


        {/* ==========================================
            STATS
        ========================================== */}

        <section className="transaction-stats">

          <div className="transaction-stat-card">

            <div className="transaction-stat-icon">
              ▤
            </div>

            <div>

              <span>
                TOTAL TRANSACTIONS
              </span>

              <strong>
                {transactions.length}
              </strong>

              <small>
                All recorded activity
              </small>

            </div>

          </div>


          <div className="transaction-stat-card">

            <div className="transaction-stat-icon success-stat">
              ✓
            </div>

            <div>

              <span>
                SUCCESSFUL TRANSFERS
              </span>

              <strong>
                {successfulCount}
              </strong>

              <small>
                Completed successfully
              </small>

            </div>

          </div>


          <div className="transaction-stat-card">

            <div className="transaction-stat-icon amount-stat">
              ₹
            </div>

            <div>

              <span>
                TOTAL TRANSFERRED
              </span>

              <strong>
                ₹{formatAmount(
                  totalTransferred
                )}
              </strong>

              <small>
                Successfully transferred
              </small>

            </div>

          </div>

        </section>


        {/* ==========================================
            TRANSACTIONS
        ========================================== */}

        <section className="transactions-card">

          <div className="transactions-header">

            <div>

              <p className="section-eyebrow">
                ACCOUNT ACTIVITY
              </p>

              <h2>
                All Transactions
              </h2>

              <p>
                Your latest money transfers and account
                activity.
              </p>

            </div>


            <button
              className="refresh-button"
              onClick={
                refreshTransactions
              }
            >
              ↻ Refresh
            </button>

          </div>


          {transactions.length === 0 ? (

            /* ======================================
               EMPTY STATE
            ====================================== */

            <div className="transactions-empty">

              <div className="transactions-empty-icon">
                ▤
              </div>

              <p className="section-eyebrow">
                NO ACTIVITY
              </p>

              <h3>
                No Transactions Yet
              </h3>

              <p>
                Your completed transfers will appear
                here once you make your first transaction.
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  navigate("/transfer")
                }
              >
                Transfer Money →
              </button>

            </div>

          ) : (

            <>

              {/* ==================================
                  DESKTOP TABLE
              ================================== */}

              <div className="transactions-table-wrapper">

                <table className="transactions-table">

                  <thead>

                    <tr>

                      <th>
                        Date
                      </th>

                      <th>
                        Payee
                      </th>

                      <th>
                        Description
                      </th>

                      <th>
                        Transfer Type
                      </th>

                      <th>
                        UTR
                      </th>

                      <th>
                        Amount
                      </th>

                      <th>
                        Status
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {transactions.map(
                      (transaction) => (

                        <tr
                          key={
                            transaction._id
                          }
                        >

                          {/* DATE */}

                          <td>

                            <div className="transaction-date-block">

                              <strong>
                                {formatDate(
                                  transaction.createdAt
                                )}
                              </strong>

                              <span>
                                {formatTime(
                                  transaction.createdAt
                                )}
                              </span>

                            </div>

                          </td>


                          {/* PAYEE */}

                          <td>

                            <div className="transaction-payee">

                              <div className="transaction-avatar">

                                {getInitial(
                                  transaction.payeeName
                                )}

                              </div>

                              <div>

                                <strong>
                                  {transaction.payeeName ||
                                    "Payee"}
                                </strong>

                                <small>
                                  {transaction.payeeAccountNumber ||
                                    "-"}
                                </small>

                              </div>

                            </div>

                          </td>


                          {/* DESCRIPTION */}

                          <td>

                            <span className="transaction-description">

                              {transaction.description ||
                                "Money Transfer"}

                            </span>

                          </td>


                          {/* TRANSFER TYPE */}

                          <td>

                            <span className="transfer-type-badge">

                              {transaction.transferType ||
                                "-"}

                            </span>

                          </td>


                          {/* UTR */}

                          <td>

                            <span className="reference-id">

                              {getUTR(
                                transaction
                              )}

                            </span>

                          </td>


                          {/* AMOUNT */}

                          <td>

                            <span className="debit-amount">

                              - ₹
                              {formatAmount(
                                transaction.amount
                              )}

                            </span>

                          </td>


                          {/* STATUS */}

                          <td>

                            <span
                              className={`transaction-status ${
                                transaction.status ===
                                "COMPLETED"
                                  ? "completed"
                                  : "failed"
                              }`}
                            >

                              {transaction.status ===
                              "COMPLETED"
                                ? "✓ Completed"
                                : "✕ Failed"}

                            </span>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>


              {/* ==================================
                  MOBILE CARDS
              ================================== */}

              <div className="mobile-transactions">

                {transactions.map(
                  (transaction) => (

                    <article
                      className="mobile-transaction-card"
                      key={
                        transaction._id
                      }
                    >

                      <div className="mobile-transaction-top">

                        <div className="transaction-payee">

                          <div className="transaction-avatar">

                            {getInitial(
                              transaction.payeeName
                            )}

                          </div>

                          <div>

                            <strong>
                              {transaction.payeeName ||
                                "Payee"}
                            </strong>

                            <small>
                              {transaction.payeeAccountNumber ||
                                "-"}
                            </small>

                          </div>

                        </div>


                        <span
                          className={`transaction-status ${
                            transaction.status ===
                            "COMPLETED"
                              ? "completed"
                              : "failed"
                          }`}
                        >

                          {transaction.status ===
                          "COMPLETED"
                            ? "✓ Completed"
                            : "✕ Failed"}

                        </span>

                      </div>


                      <div className="mobile-transaction-amount">

                        - ₹
                        {formatAmount(
                          transaction.amount
                        )}

                      </div>


                      <div className="mobile-transaction-details">

                        <div>

                          <span>
                            DATE
                          </span>

                          <strong>
                            {formatDate(
                              transaction.createdAt
                            )}
                          </strong>

                        </div>


                        <div>

                          <span>
                            TIME
                          </span>

                          <strong>
                            {formatTime(
                              transaction.createdAt
                            )}
                          </strong>

                        </div>


                        <div>

                          <span>
                            TRANSFER TYPE
                          </span>

                          <strong>
                            {transaction.transferType ||
                              "-"}
                          </strong>

                        </div>


                        <div>

                          <span>
                            DESCRIPTION
                          </span>

                          <strong>
                            {transaction.description ||
                              "Money Transfer"}
                          </strong>

                        </div>


                        <div>

                          <span>
                            UTR
                          </span>

                          <strong>
                            {getUTR(
                              transaction
                            )}
                          </strong>

                        </div>

                      </div>

                    </article>

                  )
                )}

              </div>

            </>

          )}

        </section>


        {/* ==========================================
            SECURITY NOTE
        ========================================== */}

        <section className="transaction-security-banner">

          <div className="transaction-security-icon">
            🔐
          </div>

          <div>

            <strong>
              Your transactions are secure
            </strong>

            <p>
              Every transfer is authenticated and
              recorded with a unique UTR for your records.
            </p>

          </div>

        </section>


        {/* FOOTER */}

        <footer className="dashboard-footer">

          <span>
            YES BANK Digital Banking
          </span>

          <span>
            Secure • Simple • Connected
          </span>

        </footer>

      </main>

    </div>
  );
}

export default Transactions;