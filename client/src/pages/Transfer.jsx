import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import yesBankLogo from "../assets/yesbank-logo.png";

function Transfer() {
  const navigate = useNavigate();

  const [payees, setPayees] = useState([]);
  const [balance, setBalance] = useState(0);

  const [payeeId, setPayeeId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [transferring, setTransferring] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("bankingToken");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const payeeResponse = await api.get("/payees", {
          headers,
        });

        setPayees(payeeResponse.data.payees || []);

        const userResponse = await api.get("/users/me", {
          headers,
        });

        const user = userResponse.data.user || userResponse.data;

        setBalance(Number(user.balance || 0));
      } catch (err) {
        console.error("Transfer page loading error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load account information."
        );
      } finally {
        setLoading(false);
      }
    };

    if (!token) {
      navigate("/login");
      return;
    }

    loadData();
  }, [navigate, token]);

  const handleTransfer = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const transferAmount = Number(amount);

    if (!payeeId) {
      setError("Please select a payee.");
      return;
    }

    if (!amount || transferAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (transferAmount > balance) {
      setError("Insufficient balance.");
      return;
    }

    try {
      setTransferring(true);

      const response = await api.post(
        "/transactions/transfer",
        {
          payeeId,
          amount: transferAmount,
          description: description.trim() || "Money Transfer",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const transaction = response.data.transaction;

      if (response.data.balance !== undefined) {
        setBalance(Number(response.data.balance));
      } else {
        setBalance((prev) => prev - transferAmount);
      }

      setSuccess(
        `Transfer successful! Reference ID: ${
          transaction?.referenceId || "Generated"
        }`
      );

      setPayeeId("");
      setAmount("");
      setDescription("");
    } catch (err) {
      console.error("Transfer error:", err);

      setError(
        err.response?.data?.message ||
          "Transfer failed. Please try again."
      );
    } finally {
      setTransferring(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bankingToken");
    localStorage.removeItem("bankingUser");

    navigate("/login");
  };

  const selectedPayee = payees.find(
    (payee) => payee._id === payeeId
  );

  const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

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

          <p>Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          <img src={yesBankLogo} alt="YES BANK" />
        </div>

        <nav className="sidebar-nav">

          <button
            className="nav-item"
            onClick={() => navigate("/dashboard")}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/account")}
          >
            <span>👤</span>
            My Account
          </button>

          <button
            className="nav-item active"
            onClick={() => navigate("/transfer")}
          >
            <span>↗</span>
            Transfer Money
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/payees")}
          >
            <span>👥</span>
            Payees
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/transactions")}
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
            <strong>Secure Banking</strong>
            <span>Your connection is protected</span>
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


      {/* ================= MAIN ================= */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>
            <p className="welcome-small">
              Payments & Transfers
            </p>

            <h1>Transfer Money</h1>
          </div>

          <div className="profile-circle">
            P
          </div>

        </header>


        {/* ================= TRANSFER HERO ================= */}

        <section className="transfer-hero">

          <div className="transfer-hero-content">

            <div className="transfer-hero-icon">
              ↗
            </div>

            <div>

              <p className="transfer-eyebrow">
                SECURE MONEY TRANSFER
              </p>

              <h2>
                Send money with confidence
              </h2>

              <p>
                Transfer funds securely to your saved
                beneficiaries anytime.
              </p>

            </div>

          </div>

          <div className="transfer-security">

            <span>🔒</span>

            <div>
              <strong>Bank-grade security</strong>
              <small>Protected transaction</small>
            </div>

          </div>

        </section>


        {/* ================= BALANCE ================= */}

        <section className="transfer-balance-card">

          <div>

            <span>AVAILABLE BALANCE</span>

            <h2>
              ₹{formatAmount(balance)}
            </h2>

            <p>
              Available for immediate transfer
            </p>

          </div>

          <div className="transfer-balance-icon">
            ₹
          </div>

        </section>


        {/* ================= MESSAGES ================= */}

        {error && (
          <div className="transfer-message error">
            <span>!</span>
            <div>
              <strong>Transfer issue</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="transfer-message success">
            <span>✓</span>
            <div>
              <strong>Transfer successful</strong>
              <p>{success}</p>
            </div>
          </div>
        )}


        {/* ================= MAIN TRANSFER AREA ================= */}

        <section className="transfer-layout">

          {/* FORM */}

          <div className="transfer-card">

            <div className="transfer-card-header">

              <div>
                <p className="section-eyebrow">
                  NEW TRANSFER
                </p>

                <h2>Make a Transfer</h2>

                <p>
                  Select a beneficiary and enter
                  the amount you want to send.
                </p>
              </div>

              <div className="transfer-form-icon">
                ₹
              </div>

            </div>


            {payees.length === 0 ? (

              <div className="no-payees">

                <div className="no-payees-icon">
                  👥
                </div>

                <p className="section-eyebrow">
                  BENEFICIARY REQUIRED
                </p>

                <h3>No Payees Available</h3>

                <p>
                  Add a payee before making a money
                  transfer.
                </p>

                <button
                  className="primary-button"
                  onClick={() => navigate("/payees")}
                >
                  + Add Payee
                </button>

              </div>

            ) : (

              <form onSubmit={handleTransfer}>

                {/* PAYEE */}

                <div className="form-group transfer-field">

                  <label htmlFor="payee">
                    Select Payee
                  </label>

                  <select
                    id="payee"
                    value={payeeId}
                    onChange={(e) =>
                      setPayeeId(e.target.value)
                    }
                    required
                  >
                    <option value="">
                      Select a saved payee
                    </option>

                    {payees.map((payee) => (
                      <option
                        key={payee._id}
                        value={payee._id}
                      >
                        {payee.name} — {payee.bankName}
                      </option>
                    ))}
                  </select>

                </div>


                {/* SELECTED PAYEE */}

                {selectedPayee && (

                  <div className="selected-payee">

                    <div className="selected-payee-header">

                      <div className="selected-payee-avatar">
                        {selectedPayee.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>

                        <span>TRANSFER TO</span>

                        <strong>
                          {selectedPayee.name}
                        </strong>

                        <small>
                          {selectedPayee.bankName}
                        </small>

                      </div>

                      <div className="verified-badge">
                        ✓ Verified
                      </div>

                    </div>

                    <div className="selected-payee-details">

                      <div>
                        <span>ACCOUNT NUMBER</span>
                        <strong>
                          {selectedPayee.accountNumber}
                        </strong>
                      </div>

                      <div>
                        <span>IFSC CODE</span>
                        <strong>
                          {selectedPayee.ifsc}
                        </strong>
                      </div>

                    </div>

                  </div>

                )}


                {/* AMOUNT */}

                <div className="form-group transfer-field">

                  <div className="label-row">

                    <label htmlFor="amount">
                      Transfer Amount
                    </label>

                    <span>
                      Available ₹{formatAmount(balance)}
                    </span>

                  </div>

                  <div className="amount-input">

                    <span>₹</span>

                    <input
                      id="amount"
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) =>
                        setAmount(e.target.value)
                      }
                      required
                    />

                  </div>

                </div>


                {/* DESCRIPTION */}

                <div className="form-group transfer-field">

                  <label htmlFor="description">
                    Description
                    <span className="optional">
                      Optional
                    </span>
                  </label>

                  <input
                    id="description"
                    type="text"
                    placeholder="e.g. Monthly payment"
                    maxLength="100"
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                  />

                </div>


                {/* BUTTON */}

                <button
                  type="submit"
                  className="transfer-button"
                  disabled={transferring}
                >

                  {transferring ? (
                    <>
                      <span className="button-spinner"></span>
                      Processing Transfer...
                    </>
                  ) : (
                    <>
                      Transfer Money
                      <span>→</span>
                    </>
                  )}

                </button>

              </form>

            )}

          </div>


          {/* SIDE INFORMATION */}

          <aside className="transfer-info-card">

            <div className="transfer-info-icon">
              🔐
            </div>

            <p className="section-eyebrow">
              SECURE TRANSFER
            </p>

            <h3>
              Your money is protected
            </h3>

            <p>
              Every transfer is processed through
              authenticated banking services.
            </p>


            <div className="transfer-info-list">

              <div>
                <span>✓</span>
                <p>Secure authentication</p>
              </div>

              <div>
                <span>✓</span>
                <p>Verified beneficiaries</p>
              </div>

              <div>
                <span>✓</span>
                <p>Instant transaction record</p>
              </div>

              <div>
                <span>✓</span>
                <p>Unique reference ID</p>
              </div>

            </div>


            <div className="transfer-help">

              <span>?</span>

              <div>
                <strong>Need help?</strong>
                <p>
                  Review your payee details before
                  confirming the transfer.
                </p>
              </div>

            </div>

          </aside>

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

export default Transfer;