import { useEffect, useState } from "react";
import {
  Search,
  Rocket,
  CalendarDays,
  IndianRupee,
  ArrowUpRight,
} from "lucide-react";

import { getIpos } from "../services/api";
import "./Ipos.css";

function Ipos() {
  const [ipos, setIpos] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadIpos();
  }, []);

  const loadIpos = async (params = {}) => {
    try {
      setLoading(true);
      setError("");

      const data = await getIpos(params);

      setIpos(data.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load IPO data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    loadIpos({
      search,
      status,
    });
  };

  const handleStatus = (e) => {
    const value = e.target.value;

    setStatus(value);

    loadIpos({
      search,
      status: value,
    });
  };

  const openIpos = ipos.filter(
    (ipo) => ipo.status === "open"
  );

  const upcomingIpos = ipos.filter(
    (ipo) => ipo.status === "upcoming"
  );

  return (
    <div className="ipos-page">

      {/* HEADER */}

      <section className="ipos-header">

        <div>

          <div className="page-eyebrow">
            <span className="live-indicator"></span>
            PRIMARY MARKET INTELLIGENCE
          </div>

          <h1>IPOs</h1>

          <p>
            Track upcoming and active public issues using
            source-backed market data.
          </p>

        </div>

        <div className="ipo-source">
          <span></span>
          NSE Data
        </div>

      </section>


      {/* SUMMARY */}

      <section className="ipo-summary">

        <div className="ipo-summary-card">

          <div className="ipo-icon">
            <Rocket size={18} />
          </div>

          <span>OPEN IPOs</span>

          <strong>
            {loading ? "—" : openIpos.length}
          </strong>

          <small>
            Currently active issues
          </small>

        </div>


        <div className="ipo-summary-card">

          <div className="ipo-icon">
            <CalendarDays size={18} />
          </div>

          <span>UPCOMING IPOs</span>

          <strong>
            {loading ? "—" : upcomingIpos.length}
          </strong>

          <small>
            Upcoming issues
          </small>

        </div>


        <div className="ipo-summary-card">

          <div className="ipo-icon">
            <IndianRupee size={18} />
          </div>

          <span>DATA SOURCE</span>

          <strong>
            NSE
          </strong>

          <small>
            Official issue information
          </small>

        </div>

      </section>


      {/* SEARCH */}

      <section className="ipo-toolbar">

        <form
          className="ipo-search"
          onSubmit={handleSearch}
        >

          <Search size={18} />

          <input
            type="text"
            placeholder="Search IPO or symbol..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <button type="submit">
            Search
          </button>

        </form>


        <select
          className="ipo-filter"
          value={status}
          onChange={handleStatus}
        >
          <option value="">
            All IPOs
          </option>

          <option value="open">
            Open
          </option>

          <option value="upcoming">
            Upcoming
          </option>

          <option value="closed">
            Closed
          </option>

          <option value="listed">
            Listed
          </option>

        </select>

      </section>


      {error && (
        <div className="ipo-error">
          {error}
        </div>
      )}


      {/* IPO FEED */}

      <section className="ipo-feed">

        <div className="ipo-feed-header">

          <div>

            <span>
              VERIFIED IPO FEED
            </span>

            <h2>
              IPO Intelligence
            </h2>

          </div>

          <span>
            {ipos.length} records
          </span>

        </div>


        {loading ? (

          <div className="ipo-empty">
            Loading IPO intelligence...
          </div>

        ) : ipos.length === 0 ? (

          <div className="ipo-empty">

            <Rocket size={28} />

            <h3>
              No IPO records found
            </h3>

            <p>
              Try another search or status filter.
            </p>

          </div>

        ) : (

          <div className="ipo-list">

            {ipos.map((ipo) => (

              <div
                className="ipo-row"
                key={ipo.id}
              >

                {/* COMPANY */}

                <div className="ipo-company">

                  <div className="ipo-logo">
                    {ipo.name?.charAt(0)}
                  </div>

                  <div>

                    <strong>
                      {ipo.name}
                    </strong>

                    <span>
                      {ipo.symbol || "—"}
                    </span>

                  </div>

                </div>


                {/* STATUS */}

                <div className="ipo-status">

                  <span
                    className={`status-badge ${ipo.status}`}
                  >
                    {ipo.status}
                  </span>

                  <small>
                    {ipo.issue_type || "Public Issue"}
                  </small>

                </div>


                {/* PRICE */}

                <div className="ipo-data">

                  <small>
                    PRICE BAND
                  </small>

                  <strong>

                    {ipo.price_band_min &&
                    ipo.price_band_max
                      ? `₹${Number(
                          ipo.price_band_min
                        ).toLocaleString(
                          "en-IN"
                        )} – ₹${Number(
                          ipo.price_band_max
                        ).toLocaleString(
                          "en-IN"
                        )}`
                      : "—"}

                  </strong>

                </div>


                {/* DATES */}

                <div className="ipo-data">

                  <small>
                    ISSUE PERIOD
                  </small>

                  <strong>
                    {formatDate(
                      ipo.open_date
                    )}
                    {" – "}
                    {formatDate(
                      ipo.close_date
                    )}
                  </strong>

                </div>


                {/* LOT */}

                <div className="ipo-data">

                  <small>
                    SOURCE
                  </small>

                  <strong>
                    {ipo.source_exchange || "NSE"}
                  </strong>

                </div>


                {/* LINK */}

                <div className="ipo-source-cell">

                  <span>
                    NSE
                  </span>

                  <ArrowUpRight size={14} />

                </div>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* TRUST */}

      <div className="ipo-trust">

        <div>

          <span className="trust-dot"></span>

          Source-backed IPO information

        </div>

        <span>
          NSE / Official Sources
        </span>

        <span>
          Issue details shown only when sourced
        </span>

      </div>

    </div>
  );
}


function formatDate(date) {

  if (!date) {
    return "—";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


export default Ipos;