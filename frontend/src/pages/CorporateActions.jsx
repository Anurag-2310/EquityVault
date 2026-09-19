import { useEffect, useState } from "react";
import {
  Search,
  CalendarDays,
  ArrowUpRight,
  Filter,
} from "lucide-react";

import { getCorporateActions } from "../services/api";
import "./CorporateActions.css";

function CorporateActions() {
  const [actions, setActions] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadActions();
  }, [type]);

  const loadActions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCorporateActions({
        type,
        search,
      });

      setActions(data.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load corporate actions.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    loadActions();
  };

  return (
    <div className="corporate-actions-page">

      {/* HEADER */}
      <section className="corporate-header">
        <div>
          <div className="page-eyebrow">
            <span className="live-indicator"></span>
            MARKET INTELLIGENCE
          </div>

          <h1>Corporate Actions</h1>

          <p>
            Source-backed dividends, bonuses, splits, buybacks and
            other corporate events.
          </p>
        </div>

        <div className="corporate-source">
          <span></span>
          NSE Data
        </div>
      </section>

      {/* FILTER BAR */}
      <section className="corporate-toolbar">

        <form
          className="corporate-search"
          onSubmit={handleSearch}
        >
          <Search size={18} />

          <input
            type="text"
            placeholder="Search company or action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit">
            Search
          </button>
        </form>

        <div className="action-filter">
          <Filter size={16} />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">All Actions</option>
            <option value="dividend">Dividends</option>
            <option value="bonus">Bonus</option>
            <option value="split">Stock Split</option>
            <option value="rights">Rights</option>
            <option value="buyback">Buyback</option>
            <option value="other">Other</option>
          </select>
        </div>

      </section>

      {/* ERROR */}
      {error && (
        <div className="corporate-error">
          {error}
        </div>
      )}

      {/* CONTENT */}
      <section className="corporate-card">

        <div className="corporate-card-header">
          <div>
            <span>CORPORATE EVENT FEED</span>
            <h2>Latest Corporate Actions</h2>
          </div>

          <div className="corporate-count">
            {actions.length} records
          </div>
        </div>

        {loading ? (
          <div className="corporate-empty">
            Loading source-backed events...
          </div>
        ) : actions.length === 0 ? (
          <div className="corporate-empty">
            <CalendarDays size={28} />

            <h3>No corporate actions found</h3>

            <p>
              Try another company, search term or action type.
            </p>
          </div>
        ) : (
          <div className="corporate-table-wrapper">

            <table className="corporate-table">

              <thead>
                <tr>
                  <th>COMPANY</th>
                  <th>ACTION</th>
                  <th>AMOUNT</th>
                  <th>EX-DATE</th>
                  <th>RECORD DATE</th>
                  <th>SOURCE</th>
                </tr>
              </thead>

              <tbody>

                {actions.map((action) => (
                  <tr key={action.id}>

                    {/* COMPANY */}
                    <td>
                      <div className="corporate-company">
                        <div className="corporate-company-logo">
                          {action.company?.symbol?.charAt(0)}
                        </div>

                        <div>
                          <strong>
                            {action.company?.symbol || "—"}
                          </strong>

                          <span>
                            {action.company?.name || "—"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* ACTION */}
                    <td>
                      <div className="corporate-action-name">
                        <strong>
                          {action.title}
                        </strong>

                        <span className={`action-type ${action.action_type}`}>
                          {action.action_type}
                        </span>
                      </div>
                    </td>

                    {/* AMOUNT */}
                    <td>
                      <strong className="corporate-amount">
                        {action.amount !== null &&
                        action.amount !== undefined
                          ? `₹${Number(
                              action.amount
                            ).toLocaleString("en-IN")}`
                          : "—"}
                      </strong>
                    </td>

                    {/* EX DATE */}
                    <td>
                      <span className="corporate-date">
                        {formatDate(action.ex_date)}
                      </span>
                    </td>

                    {/* RECORD DATE */}
                    <td>
                      <span className="corporate-date">
                        {formatDate(action.record_date)}
                      </span>
                    </td>

                    {/* SOURCE */}
                    <td>
                      <div className="corporate-source-cell">
                        <span>
                          {action.source_exchange || "—"}
                        </span>

                        <ArrowUpRight size={14} />
                      </div>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </section>

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

export default CorporateActions;