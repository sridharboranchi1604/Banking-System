import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import yesBankLogo from "../assets/yesbank-logo.png";

function Payees() {
  const navigate = useNavigate();

  const [payees, setPayees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("bankingToken");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchPayees();
  }, []);

  const fetchPayees = async () => {
    try {
      const response = await api.get("/payees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPayees(response.data.payees);
    } catch (error) {
      console.error("Failed to fetch payees:", error);
      setError("Unable to load payees.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddPayee = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.name ||
      !formData.accountNumber ||
      !formData.ifsc ||
      !formData.bankName
    ) {
      setError("Please fill all payee details.");
      return;
    }

    try {
      const response = await api.post("/payees", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message);

      setFormData({
        name: "",
        accountNumber: "",
        ifsc: "",
        bankName: "",
      });

      setShowForm(false);

      fetchPayees();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to add payee."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payee?"
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      const response = await api.delete(`/payees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message);

      fetchPayees();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete payee."
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bankingToken");
    localStorage.removeItem("bankingUser");

    navigate("/login");
  };

  const getInitial = (name) => {
    if (!name) return "P";
    return name.charAt(0).toUpperCase();
  };

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
            className="nav-item"
            onClick={() => navigate("/transfer")}
          >
            <span>↗</span>
            Transfer Money
          </button>

          <button
            className="nav-item active"
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
          <div className="security-icon">🔒</div>

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
              Beneficiary Management
            </p>

            <h1>My Payees</h1>
          </div>

          <div className="profile-circle">
            P
          </div>

        </header>


        {/* ================= INTRO HERO ================= */}
        <section className="payees-intro">

          <div className="payees-intro-content">

            <div className="payees-intro-icon">
              👥
            </div>

            <div>
              <p className="payees-eyebrow">
                BENEFICIARY MANAGEMENT
              </p>

              <h2>
                Manage your trusted payees
              </h2>

              <p>
                Save beneficiary accounts securely for
                faster and easier money transfers.
              </p>
            </div>

          </div>

          <div className="payees-count">

            <span>Total Payees</span>

            <strong>
              {payees.length}
            </strong>

          </div>

        </section>


        {/* ================= MESSAGES ================= */}
        {message && (
          <div className="success-banner">
            <span>✓</span>
            {message}
          </div>
        )}

        {error && (
          <div className="error-banner">
            <span>!</span>
            {error}
          </div>
        )}


        {/* ================= ACTION HEADER ================= */}
        <section className="payee-action-header">

          <div>
            <p className="section-eyebrow">
              SAVED BENEFICIARIES
            </p>

            <h2>Saved Payees</h2>

            <p>
              Manage the people and bank accounts
              you frequently transfer money to.
            </p>
          </div>

          <button
            className="add-payee-button"
            onClick={() => {
              setShowForm(!showForm);
              setMessage("");
              setError("");
            }}
          >
            <span>
              {showForm ? "×" : "+"}
            </span>

            {showForm ? "Cancel" : "Add Payee"}
          </button>

        </section>


        {/* ================= ADD PAYEE FORM ================= */}
        {showForm && (
          <section className="payee-form-card">

            <div className="payee-form-heading">

              <div className="form-icon">
                +
              </div>

              <div>
                <p className="section-eyebrow">
                  NEW BENEFICIARY
                </p>

                <h2>Add New Payee</h2>

                <p className="form-description">
                  Enter the beneficiary's bank account
                  details carefully.
                </p>
              </div>

            </div>

            <form onSubmit={handleAddPayee}>

              <div className="payee-form-grid">

                <div className="form-group">
                  <label>Payee Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter payee name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>


                <div className="form-group">
                  <label>Bank Name</label>

                  <input
                    type="text"
                    name="bankName"
                    placeholder="Enter bank name"
                    value={formData.bankName}
                    onChange={handleChange}
                  />
                </div>


                <div className="form-group">
                  <label>Account Number</label>

                  <input
                    type="text"
                    name="accountNumber"
                    placeholder="Enter account number"
                    value={formData.accountNumber}
                    onChange={handleChange}
                  />
                </div>


                <div className="form-group">
                  <label>IFSC Code</label>

                  <input
                    type="text"
                    name="ifsc"
                    placeholder="Enter IFSC code"
                    value={formData.ifsc}
                    onChange={handleChange}
                    style={{
                      textTransform: "uppercase",
                    }}
                  />
                </div>

              </div>


              <div className="payee-form-footer">

                <div className="form-security-note">
                  <span>🔒</span>
                  Your beneficiary information is securely
                  stored.
                </div>

                <button
                  type="submit"
                  className="auth-button payee-submit"
                >
                  Add Payee
                  <span>→</span>
                </button>

              </div>

            </form>

          </section>
        )}


        {/* ================= PAYEE LIST ================= */}
        <section className="payees-section">

          {loading ? (

            <div className="payees-loading">

              <div className="loading-circle"></div>

              <p>Loading your payees...</p>

            </div>

          ) : payees.length === 0 ? (

            <div className="payees-empty">

              <div className="empty-payee-icon">
                👥
              </div>

              <p className="section-eyebrow">
                NO BENEFICIARIES
              </p>

              <h3>No payees added yet</h3>

              <p>
                Add your first payee to make transfers
                faster and more convenient.
              </p>

              <button
                className="empty-add-button"
                onClick={() => {
                  setShowForm(true);
                  setMessage("");
                  setError("");
                }}
              >
                + Add Your First Payee
              </button>

            </div>

          ) : (

            <div className="payees-grid">

              {payees.map((payee) => (

                <article
                  className="payee-card"
                  key={payee._id}
                >

                  {/* CARD TOP */}
                  <div className="payee-card-header">

                    <div className="payee-avatar">
                      {getInitial(payee.name)}
                    </div>

                    <div className="payee-name-block">

                      <h3>
                        {payee.name}
                      </h3>

                      <span>
                        {payee.bankName}
                      </span>

                    </div>

                    <div className="payee-status">
                      Active
                    </div>

                  </div>


                  {/* ACCOUNT DETAILS */}
                  <div className="payee-details">

                    <div className="payee-detail-item">

                      <span>
                        ACCOUNT NUMBER
                      </span>

                      <strong>
                        {payee.accountNumber}
                      </strong>

                    </div>


                    <div className="payee-detail-item">

                      <span>
                        IFSC CODE
                      </span>

                      <strong>
                        {payee.ifsc}
                      </strong>

                    </div>

                  </div>


                  {/* ACTION */}
                  <button
                    className="delete-payee"
                    onClick={() =>
                      handleDelete(payee._id)
                    }
                  >
                    <span>🗑</span>
                    Delete Payee
                  </button>

                </article>

              ))}

            </div>

          )}

        </section>


        {/* FOOTER */}
        <footer className="dashboard-footer">
          <span>YES BANK Digital Banking</span>
          <span>Secure • Simple • Connected</span>
        </footer>

      </main>

    </div>
  );
}

export default Payees;