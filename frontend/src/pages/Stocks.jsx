import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowUpRight, CalendarDays } from "lucide-react";
import { getCompanies, getCompany } from "../services/api";
import "./Stocks.css";

function Stocks() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCompanies();

      setCompanies(data.data || []);

      // Automatically show first real company.
      if (data.data?.length > 0) {
        loadCompany(data.data[0].id);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load companies.");
    } finally {
      setLoading(false);
    }
  };

  const loadCompany = async (id) => {
    try {
      setDetailsLoading(true);
      setError("");

      const data = await getCompany(id);

      setSelectedCompany(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load company details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const query = search.toLowerCase();

    return (
      company.name?.toLowerCase().includes(query) ||
      company.symbol?.toLowerCase().includes(query)
    );
  });

  const corporateActions =
    selectedCompany?.corporate_actions || [];

  return (
    <div className="stocks-page">

      {/* Header */}
      <div className="stocks-header">
        <div>
          <div className="eyebrow">MARKET INTELLIGENCE</div>

          <h1>Stocks</h1>

          <p>
            Explore companies and source-backed corporate actions.
          </p>
        </div>

        <div className="source-badge">
          <span className="source-dot"></span>
          NSE Data
        </div>
      </div>

      {/* Search */}
      <div className="stocks-search">
        <Search size={19} />

        <input
          type="text"
          placeholder="Search company or symbol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div className="stocks-error">
          {error}
        </div>
      )}

      <div className="stocks-layout">

        {/* Company List */}
        <aside className="company-list">

          <div className="section-title">
            Companies
          </div>

          {loading ? (
            <div className="empty-small">
              Loading companies...
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="empty-small">
              No companies found.
            </div>
          ) : (
            filteredCompanies.map((company) => (
              <button
                key={company.id}
                className={`company-item ${
                  selectedCompany?.id === company.id
                    ? "active"
                    : ""
                }`}
                onClick={() => loadCompany(company.id)}
              >
                <div className="company-logo">
                  {company.symbol?.charAt(0)}
                </div>

                <div className="company-info">
                  <strong>{company.symbol}</strong>

                  <span>{company.name}</span>
                </div>

                <ArrowUpRight size={16} />
              </button>
            ))
          )}

        </aside>

        {/* Company Details */}
        <main className="company-details">

          {detailsLoading ? (
            <div className="details-loading">
              Loading company data...
            </div>
          ) : !selectedCompany ? (
            <div className="details-empty">
              <h2>Select a company</h2>

              <p>
                Choose a company to view its corporate actions.
              </p>
            </div>
          ) : (
            <>
              {/* Company Hero */}
              <section className="company-hero">

                <div className="company-heading">

                  <div className="big-company-logo">
                    {selectedCompany.symbol?.charAt(0)}
                  </div>

                  <div>
                    <div className="company-symbol">
                      {selectedCompany.symbol}
                    </div>

                    <h2>
                      {selectedCompany.name}
                    </h2>

                    <div className="company-meta">
                      <span>
                        NSE: {selectedCompany.nse_symbol || "—"}
                      </span>

                      <span>
                        {selectedCompany.source_exchange || "—"}
                      </span>
                    </div>
                  </div>

                </div>

                <Link
                  to={`/stocks/${selectedCompany.id}`}
                  className="company-link"
                >
                  View full profile
                  <ArrowUpRight size={17} />
                </Link>

              </section>

              {/* Stats */}
              <section className="stock-stats">

                <div className="stat-card">
                  <span>Corporate Actions</span>

                  <strong>
                    {corporateActions.length}
                  </strong>
                </div>

                <div className="stat-card">
                  <span>Latest Action</span>

                  <strong>
                    {corporateActions.length > 0
                      ? corporateActions[0].action_type
                      : "—"}
                  </strong>
                </div>

                <div className="stat-card">
                  <span>Data Source</span>

                  <strong>
                    {selectedCompany.source_exchange || "—"}
                  </strong>
                </div>

              </section>

              {/* Corporate Actions */}
              <section className="actions-section">

                <div className="section-heading">

                  <div>
                    <div className="eyebrow">
                      CORPORATE ACTIONS
                    </div>

                    <h3>
                      Corporate Action History
                    </h3>
                  </div>

                  <span className="action-count">
                    {corporateActions.length} records
                  </span>

                </div>

                {corporateActions.length === 0 ? (
                  <div className="empty-actions">
                    No corporate actions available.
                  </div>
                ) : (
                  <div className="actions-table-wrapper">

                    <table className="actions-table">

                      <thead>
                        <tr>
                          <th>Action</th>
                          <th>Amount</th>
                          <th>Ex-Date</th>
                          <th>Record Date</th>
                          <th>Source</th>
                        </tr>
                      </thead>

                      <tbody>
                        {corporateActions.map((action) => (
                          <tr key={action.id}>

                            <td>
                              <div className="action-name">
                                <span className="action-icon">
                                  <CalendarDays size={15} />
                                </span>

                                <div>
                                  <strong>
                                    {action.title}
                                  </strong>

                                  <small>
                                    {action.action_type}
                                  </small>
                                </div>
                              </div>
                            </td>

                            <td>
                              {action.amount !== null &&
                              action.amount !== undefined
                                ? `₹${Number(
                                    action.amount
                                  ).toLocaleString("en-IN")}`
                                : "—"}
                            </td>

                            <td>
                              {formatDate(action.ex_date)}
                            </td>

                            <td>
                              {formatDate(
                                action.record_date
                              )}
                            </td>

                            <td>
                              <span className="source-tag">
                                {action.source_exchange || "—"}
                              </span>
                            </td>

                          </tr>
                        ))}
                      </tbody>

                    </table>

                  </div>
                )}

              </section>
            </>
          )}

        </main>

      </div>
    </div>
  );
}

function formatDate(date) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default Stocks;