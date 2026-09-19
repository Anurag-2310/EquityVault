import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { getCompany } from "../services/api";
import "./StockProfile.css";

function StockProfile() {
  const { id } = useParams();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCompany();
  }, [id]);

  const loadCompany = async () => {
    try {
      setLoading(true);

      const data = await getCompany(id);

      setCompany(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load company.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-state">
        Loading company data...
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="profile-state">
        {error || "Company not found."}
      </div>
    );
  }

  const actions = company.corporate_actions || [];

  return (
    <div className="stock-profile">

      <Link to="/stocks" className="back-link">
        <ArrowLeft size={17} />
        Back to Stocks
      </Link>

      <div className="profile-header">

        <div className="profile-logo">
          {company.symbol?.charAt(0)}
        </div>

        <div>
          <div className="profile-symbol">
            {company.symbol}
          </div>

          <h1>{company.name}</h1>

          <p>
            NSE: {company.nse_symbol || "—"} ·{" "}
            Source: {company.source_exchange || "—"}
          </p>
        </div>

      </div>

      <div className="profile-stats">

        <div>
          <span>Corporate Actions</span>
          <strong>{actions.length}</strong>
        </div>

        <div>
          <span>Data Source</span>
          <strong>{company.source_exchange || "—"}</strong>
        </div>

        <div>
          <span>Last Fetched</span>
          <strong>
            {company.fetched_at
              ? new Date(company.fetched_at).toLocaleDateString(
                  "en-IN"
                )
              : "—"}
          </strong>
        </div>

      </div>

      <section className="profile-section">

        <div className="profile-section-heading">
          <div>
            <div className="eyebrow">
              SOURCE-BACKED DATA
            </div>

            <h2>Corporate Actions</h2>
          </div>

          <span>{actions.length} records</span>
        </div>

        <div className="profile-actions">

          {actions.map((action) => (
            <div className="profile-action" key={action.id}>

              <div className="profile-action-icon">
                <CalendarDays size={17} />
              </div>

              <div className="profile-action-main">
                <strong>{action.title}</strong>

                <span>
                  {action.action_type}
                </span>
              </div>

              <div className="profile-action-data">
                <small>AMOUNT</small>

                <strong>
                  {action.amount
                    ? `₹${Number(
                        action.amount
                      ).toLocaleString("en-IN")}`
                    : "—"}
                </strong>
              </div>

              <div className="profile-action-data">
                <small>EX-DATE</small>

                <strong>
                  {formatDate(action.ex_date)}
                </strong>
              </div>

              <div className="profile-action-data">
                <small>RECORD DATE</small>

                <strong>
                  {formatDate(action.record_date)}
                </strong>
              </div>

            </div>
          ))}

        </div>

      </section>

    </div>
  );
}

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default StockProfile;