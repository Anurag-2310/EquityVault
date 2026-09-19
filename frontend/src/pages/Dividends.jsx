import { useEffect, useState } from "react";
import {
  Search,
  CalendarDays,
  CircleDollarSign,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

import { getDividends } from "../services/api";
import "./Dividends.css";

function Dividends() {
  const [dividends, setDividends] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDividends();
  }, []);

  const loadDividends = async (query = "") => {
    try {
      setLoading(true);
      setError("");

      const data = await getDividends({
        search: query,
      });

      setDividends(data.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load dividend data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadDividends(search);
  };

  const totalEvents = dividends.length;

  // Sum of dividend amounts available in the imported records.
  const totalAnnouncedDividends = dividends.reduce(
    (total, dividend) => {
      return total + Number(dividend.amount || 0);
    },
    0
  );

  const latestDividend = dividends[0];

  return (
    <div className="dividends-page">

      {/* =========================
          HEADER
      ========================== */}

      <section className="dividends-header">

        <div>
          <div className="page-eyebrow">
            <span className="live-indicator"></span>
            DIVIDEND INTELLIGENCE
          </div>

          <h1>Dividends</h1>

          <p>
            Track source-backed dividend announcements, record dates
            and ex-dates from official market data.
          </p>
        </div>

        <div className="dividend-source">
          <span></span>
          NSE Data
        </div>

      </section>


      {/* =========================
          SUMMARY CARDS
      ========================== */}

      <section className="dividend-summary">

        {/* DIVIDEND EVENTS */}

        <div className="dividend-summary-card">

          <div className="summary-icon">
            <CircleDollarSign size={18} />
          </div>

          <span>DIVIDEND EVENTS</span>

          <strong>
            {loading ? "—" : totalEvents}
          </strong>

          <small>
            Source-backed records
          </small>

        </div>


        {/* TOTAL ANNOUNCED DIVIDENDS */}

        <div className="dividend-summary-card">

          <div className="summary-icon">
            <TrendingUp size={18} />
          </div>

          <span>TOTAL ANNOUNCED DIVIDENDS</span>

          <strong>
            {loading
              ? "—"
              : `₹${totalAnnouncedDividends.toLocaleString("en-IN")}`}
          </strong>

          <small>
            Sum of imported dividend amounts
          </small>

        </div>


        {/* LATEST EX-DATE */}

        <div className="dividend-summary-card">

          <div className="summary-icon">
            <CalendarDays size={18} />
          </div>

          <span>LATEST EX-DATE</span>

          <strong className="date-value">
            {latestDividend
              ? formatDate(latestDividend.ex_date)
              : "—"}
          </strong>

          <small>
            Latest available event
          </small>

        </div>

      </section>


      {/* =========================
          SEARCH
      ========================== */}

      <section className="dividend-toolbar">

        <form
          className="dividend-search"
          onSubmit={handleSearch}
        >

          <Search size={18} />

          <input
            type="text"
            placeholder="Search company or symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit">
            Search
          </button>

        </form>

      </section>


      {/* =========================
          ERROR
      ========================== */}

      {error && (
        <div className="dividend-error">
          {error}
        </div>
      )}


      {/* =========================
          DIVIDEND FEED
      ========================== */}

      <section className="dividend-feed">

        <div className="dividend-feed-header">

          <div>
            <span>VERIFIED DIVIDEND FEED</span>

            <h2>
              Latest Dividend Events
            </h2>
          </div>

          <span>
            {dividends.length} records
          </span>

        </div>


        {/* LOADING */}

        {loading ? (

          <div className="dividend-empty">

            <CircleDollarSign size={28} />

            <h3>
              Loading verified dividend events...
            </h3>

          </div>


        ) : dividends.length === 0 ? (

          /* EMPTY */

          <div className="dividend-empty">

            <CircleDollarSign size={28} />

            <h3>
              No dividend events found
            </h3>

            <p>
              Try searching for another company.
            </p>

          </div>


        ) : (

          /* DATA */

          <div className="dividend-list">

            {dividends.map((dividend) => (

              <div
                className="dividend-row"
                key={dividend.id}
              >

                {/* =====================
                    COMPANY
                ====================== */}

                <div className="dividend-company">

                  <div className="dividend-logo">
                    {dividend.company?.symbol?.charAt(0)}
                  </div>

                  <div>

                    <strong>
                      {dividend.company?.symbol || "—"}
                    </strong>

                    <span>
                      {dividend.company?.name || "—"}
                    </span>

                  </div>

                </div>


                {/* =====================
                    DIVIDEND EVENT
                ====================== */}

                <div className="dividend-event">

                  <strong>
                    {dividend.title}
                  </strong>

                  <span>
                    Dividend
                  </span>

                </div>


                {/* =====================
                    AMOUNT
                ====================== */}

                <div className="dividend-amount">

                  <small>
                    PER SHARE
                  </small>

                  <strong>
                    {dividend.amount !== null &&
                    dividend.amount !== undefined
                      ? `₹${Number(
                          dividend.amount
                        ).toLocaleString("en-IN")}`
                      : "—"}
                  </strong>

                </div>


                {/* =====================
                    EX-DATE
                ====================== */}

                <div className="dividend-date">

                  <small>
                    EX-DATE
                  </small>

                  <strong>
                    {formatDate(dividend.ex_date)}
                  </strong>

                </div>


                {/* =====================
                    RECORD DATE
                ====================== */}

                <div className="dividend-date">

                  <small>
                    RECORD DATE
                  </small>

                  <strong>
                    {formatDate(dividend.record_date)}
                  </strong>

                </div>


                {/* =====================
                    SOURCE
                ====================== */}

                <div className="dividend-source-cell">

                  <span>
                    {dividend.source_exchange || "NSE"}
                  </span>

                  <ArrowUpRight size={14} />

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* =========================
          TRUST BAR
      ========================== */}

      <div className="dividend-trust">

        <div>

          <span className="trust-dot"></span>

          Source-backed market data

        </div>

        <span>
          NSE / Official Sources
        </span>

        <span>
          Payment date shown only when officially sourced
        </span>

      </div>

    </div>
  );
}


/* =========================
   DATE FORMATTER
========================= */

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


export default Dividends;