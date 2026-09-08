import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import logo from "../assets/yesbank-logo.png";

function Transfer() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [payees, setPayees] = useState([]);

  const [payeeId, setPayeeId] = useState("");
  const [amount, setAmount] = useState("");
  const [transferType, setTransferType] = useState("");
  const [description, setDescription] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [transferring, setTransferring] = useState(false);

  const [error, setError] = useState("");

  // Confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);

  // Receipt modal
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const token = localStorage.getItem("bankingToken");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    loadData();
  }, [navigate, token]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [userResponse, payeeResponse] = await Promise.all([
        api.get("/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        api.get("/payees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setUser(userResponse.data.user);
      setPayees(payeeResponse.data.payees || []);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        localStorage.removeItem("bankingToken");
        localStorage.removeItem("bankingUser");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load transfer information."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (value) => {
    return Number(value || 0).toLocaleString("en-IN", {
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
    if (!date) return "-";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const maskAccountNumber = (accountNumber) => {
    if (!accountNumber) return "-";

    const value = String(accountNumber);

    if (value.length <= 4) {
      return value;
    }

    return `${"X".repeat(value.length - 4)}${value.slice(-4)}`;
  };

  const selectedPayee = payees.find(
    (payee) => payee._id === payeeId
  );

  // Step 1: Validate transfer and open confirmation modal
  const handleTransferSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!payeeId) {
      setError("Please select a payee.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid transfer amount.");
      return;
    }

    if (!transferType) {
      setError("Please select a transfer type.");
      return;
    }

    if (
      user &&
      Number(amount) > Number(user.balance)
    ) {
      setError("Insufficient balance for this transfer.");
      return;
    }

    setPassword("");
    setShowConfirm(true);
  };

  // Step 2: Confirm transfer with password
  const handleConfirmTransfer = async (e) => {
    e.preventDefault();

    setError("");

    if (!password) {
      setError("Please enter your login password.");
      return;
    }

    try {
      setTransferring(true);

      const response = await api.post(
        "/transactions/transfer",
        {
          payeeId,
          amount: Number(amount),
          transferType,
          description,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const transaction = response.data.transaction;

      // Update balance immediately
      setUser((previousUser) => ({
        ...previousUser,
        balance: response.data.balance,
      }));

      // Save receipt information
      setReceipt({
        transaction,
        payee: selectedPayee,
        amount: Number(amount),
        transferType,
        description:
          description?.trim() || "Money Transfer",
        balance: response.data.balance,
      });

      // Close password confirmation
      setShowConfirm(false);

      // Clear form
      setPayeeId("");
      setAmount("");
      setTransferType("");
      setDescription("");
      setPassword("");

      // Open receipt
      setShowReceipt(true);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError(
          err.response?.data?.message ||
            "Incorrect password. Transfer cancelled."
        );
        return;
      }

      setError(
        err.response?.data?.message ||
          "Transfer failed. Please try again."
      );
    } finally {
      setTransferring(false);
    }
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setReceipt(null);
    setError("");
  };

  const printReceipt = () => {
    window.print();
  };

  const handleLogout = () => {
    localStorage.removeItem("bankingToken");
    localStorage.removeItem("bankingUser");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading transfer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          <img src={logo} alt="YES BANK" />
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
            className="nav-item"
            onClick={() => navigate("/account")}
          >
            <span className="nav-icon">◉</span>
            <span>Account</span>
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/payees")}
          >
            <span className="nav-icon">♙</span>
            <span>Payees</span>
          </button>

          <button className="nav-item active">
            <span className="nav-icon">↗</span>
            <span>Transfer</span>
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/transactions")}
          >
            <span className="nav-icon">☷</span>
            <span>Transactions</span>
          </button>

        </nav>

        <div className="sidebar-security">
          <span>🔒</span>
          <div>
            <strong>Secure Banking</strong>
            <small>Protected connection</small>
          </div>
        </div>

        <div className="sidebar-bottom">
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>
        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div className="dashboard-welcome">
            <p className="welcome-label">
              MONEY TRANSFER
            </p>

            <h1>
              Transfer <span>Money</span>
            </h1>

            <p className="welcome-date">
              Send money securely to your registered payee
            </p>
          </div>

          <div className="dashboard-header-right">
            <div className="profile-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="profile-details">
              <strong>{user?.name || "User"}</strong>
              <span>Personal Banking</span>
            </div>
          </div>

        </header>

        {/* ================= BALANCE ================= */}

        <section className="transfer-balance-card">

          <div>
            <p>AVAILABLE BALANCE</p>

            <h2>
              ₹ {formatAmount(user?.balance)}
            </h2>

            <span>
              Available for transfer
            </span>
          </div>

          <div className="transfer-balance-icon">
            ₹
          </div>

        </section>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="transfer-error">
            <span>⚠</span>
            {error}
          </div>
        )}

        {/* ================= TRANSFER FORM ================= */}

        <section className="transfer-card">

          <div className="transfer-card-header">
            <div>
              <p className="section-label">
                PAYMENT
              </p>

              <h2>Make a Transfer</h2>

              <p>
                Select a registered payee and enter the
                transfer details.
              </p>
            </div>

            <div className="secure-badge">
              🔒 Secure
            </div>
          </div>

          {payees.length === 0 ? (

            <div className="no-payees">
              <div className="no-payees-icon">
                ♙
              </div>

              <h3>No Payees Available</h3>

              <p>
                Add a payee before making a money transfer.
              </p>

              <button
                onClick={() => navigate("/payees")}
                className="primary-transfer-btn"
              >
                Add Payee
              </button>
            </div>

          ) : (

            <form
              className="transfer-form"
              onSubmit={handleTransferSubmit}
            >

              {/* PAYEE */}

              <div className="form-group">

                <label>Select Payee</label>

                <select
                  value={payeeId}
                  onChange={(e) => {
                    setPayeeId(e.target.value);
                    setError("");
                  }}
                >
                  <option value="">
                    Select a registered payee
                  </option>

                  {payees.map((payee) => (
                    <option
                      key={payee._id}
                      value={payee._id}
                    >
                      {payee.name} —{" "}
                      {maskAccountNumber(
                        payee.accountNumber
                      )}
                    </option>
                  ))}
                </select>

              </div>

              {/* SELECTED PAYEE */}

              {selectedPayee && (
                <div className="selected-payee">

                  <div className="selected-payee-avatar">
                    {selectedPayee.name
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>

                  <div className="selected-payee-info">
                    <strong>
                      {selectedPayee.name}
                    </strong>

                    <span>
                      {selectedPayee.bankName ||
                        "Bank Account"}
                    </span>

                    <small>
                      A/C{" "}
                      {maskAccountNumber(
                        selectedPayee.accountNumber
                      )}{" "}
                      • {selectedPayee.ifsc}
                    </small>
                  </div>

                  <span className="payee-verified">
                    ✓ Verified
                  </span>

                </div>
              )}

              {/* AMOUNT */}

              <div className="form-row">

                <div className="form-group">

                  <label>Transfer Amount</label>

                  <div className="amount-input-wrapper">
                    <span>₹</span>

                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setError("");
                      }}
                    />
                  </div>

                </div>

                {/* TRANSFER TYPE */}

                <div className="form-group">

                  <label>Transfer Type</label>

                  <select
                    value={transferType}
                    onChange={(e) => {
                      setTransferType(e.target.value);
                      setError("");
                    }}
                  >
                    <option value="">
                      Select transfer type
                    </option>

                    <option value="IMPS">
                      IMPS
                    </option>

                    <option value="NEFT">
                      NEFT
                    </option>

                    <option value="RTGS">
                      RTGS
                    </option>
                  </select>

                </div>

              </div>

              {/* DESCRIPTION */}

              <div className="form-group">

                <label>
                  Description
                  <span className="optional">
                    Optional
                  </span>
                </label>

                <input
                  type="text"
                  placeholder="Enter transfer description"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  maxLength={100}
                />

              </div>

              {/* SECURITY */}

              <div className="transfer-security-note">

                <span>🔐</span>

                <div>
                  <strong>
                    Password confirmation required
                  </strong>

                  <p>
                    Your login password will be required
                    before the transfer is processed.
                  </p>
                </div>

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="primary-transfer-btn"
              >
                <span>Transfer Money</span>
                <span>→</span>
              </button>

            </form>

          )}

        </section>

        {/* ================= FOOTER ================= */}

        <footer className="dashboard-footer">
          <span>YES BANK • Personal Banking</span>
          <span>Secure • Simple • Smart</span>
        </footer>

      </main>

      {/* =====================================================
          PASSWORD CONFIRMATION MODAL
          ===================================================== */}

      {showConfirm && (

        <div className="modal-overlay">

          <div className="transfer-confirm-modal">

            <button
              className="modal-close"
              onClick={() => {
                if (!transferring) {
                  setShowConfirm(false);
                  setPassword("");
                  setError("");
                }
              }}
            >
              ×
            </button>

            <div className="confirm-icon">
              🔐
            </div>

            <p className="section-label">
              CONFIRM TRANSFER
            </p>

            <h2>Authorize Payment</h2>

            <p className="confirm-subtitle">
              Enter your login password to authorize
              this transfer.
            </p>

            {/* TRANSFER SUMMARY */}

            <div className="confirm-summary">

              <div>
                <span>Payee</span>
                <strong>
                  {selectedPayee?.name || "-"}
                </strong>
              </div>

              <div>
                <span>Amount</span>
                <strong>
                  ₹ {formatAmount(amount)}
                </strong>
              </div>

              <div>
                <span>Transfer Type</span>
                <strong>
                  {transferType}
                </strong>
              </div>

            </div>

            <form onSubmit={handleConfirmTransfer}>

              <div className="form-group">

                <label>Login Password</label>

                <input
                  type="password"
                  autoFocus
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                />

              </div>

              {error && (
                <div className="modal-error">
                  ⚠ {error}
                </div>
              )}

              <button
                type="submit"
                className="confirm-transfer-btn"
                disabled={transferring}
              >
                {transferring
                  ? "Processing Transfer..."
                  : "Confirm & Transfer"}
              </button>

            </form>

            <div className="modal-security">
              🔒 Your password is securely verified
              and is never stored.
            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          SUCCESS RECEIPT
          ===================================================== */}

      {showReceipt && receipt && (

        <div className="modal-overlay receipt-overlay">

          <div className="transaction-receipt">

            <div className="receipt-success-icon">
              ✓
            </div>

            <p className="receipt-success-label">
              TRANSFER SUCCESSFUL
            </p>

            <h2>
              ₹ {formatAmount(receipt.amount)}
            </h2>

            <p className="receipt-message">
              Money has been transferred successfully.
            </p>

            <div className="receipt-divider"></div>

            <div className="receipt-row">
              <span>From</span>
              <strong>
                {user?.name || "Account Holder"}
              </strong>
            </div>

            <div className="receipt-row">
              <span>To</span>
              <strong>
                {receipt.payee?.name || "-"}
              </strong>
            </div>

            <div className="receipt-row">
              <span>Bank</span>
              <strong>
                {receipt.payee?.bankName || "-"}
              </strong>
            </div>

            <div className="receipt-row">
              <span>Account</span>
              <strong>
                {maskAccountNumber(
                  receipt.payee?.accountNumber
                )}
              </strong>
            </div>

            <div className="receipt-row">
              <span>Transfer Type</span>
              <strong>
                <span className="receipt-type">
                  {receipt.transferType}
                </span>
              </strong>
            </div>

            <div className="receipt-row receipt-utr-row">
              <span>UTR</span>
              <strong>
                {receipt.transaction?.utr ||
                  receipt.transaction?.referenceId ||
                  "-"}
              </strong>
            </div>

            <div className="receipt-row">
              <span>Date</span>
              <strong>
                {formatDate(
                  receipt.transaction?.createdAt
                )}
              </strong>
            </div>

            <div className="receipt-row">
              <span>Time</span>
              <strong>
                {formatTime(
                  receipt.transaction?.createdAt
                )}
              </strong>
            </div>

            <div className="receipt-row">
              <span>Description</span>
              <strong>
                {receipt.description}
              </strong>
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-balance">

              <span>Available Balance</span>

              <strong>
                ₹ {formatAmount(receipt.balance)}
              </strong>

            </div>

            <div className="receipt-actions">

              <button
                className="receipt-print-btn"
                onClick={printReceipt}
              >
                🖨 Print / Save Receipt
              </button>

              <button
                className="receipt-done-btn"
                onClick={closeReceipt}
              >
                Done
              </button>

            </div>

            <p className="receipt-footer">
              YES BANK • Secure Digital Banking
            </p>

          </div>

        </div>

      )}

    </div>
  );
}

export default Transfer;