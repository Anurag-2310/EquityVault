import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Wallet,
  CircleDollarSign,
  TrendingUp,
} from "lucide-react";

import { getCompanies, getCompany } from "../services/api";
import "./Portfolio.css";

function Portfolio() {
  const [companies, setCompanies] = useState([]);
  const [holdings, setHoldings] = useState([]);

  const [symbol, setSymbol] = useState("");
  const [shares, setShares] = useState("");

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      setLoading(true);

      const stored = JSON.parse(
        localStorage.getItem("equityvault_holdings") || "[]"
      );

      setHoldings(stored);

      const response = await getCompanies();
      setCompanies(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load portfolio.");
    } finally {
      setLoading(false);
    }
  };

  const saveHoldings = (updated) => {
    setHoldings(updated);
    localStorage.setItem(
      "equityvault_holdings",
      JSON.stringify(updated)
    );
  };

  const addHolding = async (e) => {
    e.preventDefault();

    if (!symbol || !shares || Number(shares) <= 0) {
      setError("Select a company and enter valid shares.");
      return;
    }

    try {
      setAdding(true);
      setError("");

      const company = companies.find(
        (item) => item.symbol === symbol
      );

      if (!company) {
        setError("Company not found.");
        return;
      }

      const details = await getCompany(company.id);

      const dividend = (details.corporate_actions || [])
        .filter((action) => action.action_type === "dividend")
        .sort(
          (a, b) =>
            new Date(b.ex_date) - new Date(a.ex_date)
        )[0];

      const dividendPerShare = Number(
        dividend?.amount || 0
      );

      const existing = holdings.find(
        (item) => item.company_id === company.id
      );

      let updated;

      if (existing) {
        updated = holdings.map((item) =>
          item.company_id === company.id
            ? {
                ...item,
                shares:
                  Number(item.shares) + Number(shares),
                dividend_per_share: dividendPerShare,
              }
            : item
        );
      } else {
        updated = [
          ...holdings,
          {
            company_id: company.id,
            symbol: company.symbol,
            name: company.name,
            shares: Number(shares),
            dividend_per_share: dividendPerShare,
            source: "NSE",
          },
        ];
      }

      saveHoldings(updated);

      setSymbol("");
      setShares("");
    } catch (err) {
      console.error(err);
      setError("Unable to add holding.");
    } finally {
      setAdding(false);
    }
  };

  const removeHolding = (companyId) => {
    const updated = holdings.filter(
      (item) => item.company_id !== companyId
    );

    saveHoldings(updated);
  };

  const totalShares = holdings.reduce(
    (sum, item) => sum + Number(item.shares || 0),
    0
  );

  const expectedDividend = holdings.reduce(
    (sum, item) =>
      sum +
      Number(item.shares || 0) *
        Number(item.dividend_per_share || 0),
    0
  );

  return (
    <div className="portfolio-page">

      {/* HEADER */}
      <section className="portfolio-page-header">
        <div>
          <div className="page-eyebrow">
            <span className="live-indicator"></span>
            PORTFOLIO INTELLIGENCE
          </div>

          <h1>Portfolio</h1>

          <p>
            Track your holdings and estimate dividends using
            source-backed corporate-action data.
          </p>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="portfolio-summary">

        <div className="portfolio-summary-card">
          <div className="portfolio-summary-icon">
            <Wallet size={18} />
          </div>

          <span>HOLDINGS</span>

          <strong>
            {loading ? "—" : holdings.length}
          </strong>

          <small>
            Companies in portfolio
          </small>
        </div>

        <div className="portfolio-summary-card">
          <div className="portfolio-summary-icon">
            <TrendingUp size={18} />
          </div>

          <span>TOTAL SHARES</span>

          <strong>
            {loading ? "—" : totalShares}
          </strong>

          <small>
            Across your holdings
          </small>
        </div>

        <div className="portfolio-summary-card highlight">
          <div className="portfolio-summary-icon">
            <CircleDollarSign size={18} />
          </div>

          <span>EXPECTED DIVIDENDS</span>

          <strong>
            ₹{expectedDividend.toLocaleString("en-IN")}
          </strong>

          <small>
            Based on latest available dividend
          </small>
        </div>

      </section>

      {/* ADD HOLDING */}
      <section className="portfolio-add-card">

        <div className="portfolio-section-title">
          <div>
            <span>ADD POSITION</span>
            <h2>Add Holding</h2>
          </div>
        </div>

        <form
          className="portfolio-form"
          onSubmit={addHolding}
        >

          <div className="portfolio-field">
            <label>COMPANY</label>

            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            >
              <option value="">
                Select company
              </option>

              {companies.map((company) => (
                <option
                  key={company.id}
                  value={company.symbol}
                >
                  {company.symbol} — {company.name}
                </option>
              ))}
            </select>
          </div>

          <div className="portfolio-field">
            <label>SHARES</label>

            <input
              type="number"
              min="1"
              placeholder="e.g. 20"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
            />
          </div>

          <button
            className="add-holding-button"
            type="submit"
            disabled={adding}
          >
            <Plus size={17} />

            {adding ? "Adding..." : "Add Holding"}
          </button>

        </form>

        {error && (
          <div className="portfolio-error">
            {error}
          </div>
        )}

      </section>

      {/* HOLDINGS */}
      <section className="portfolio-holdings">

        <div className="portfolio-section-title">
          <div>
            <span>YOUR POSITIONS</span>
            <h2>Holdings</h2>
          </div>

          <span>
            {holdings.length} positions
          </span>
        </div>

        {holdings.length === 0 ? (

          <div className="portfolio-empty">

            <Wallet size={30} />

            <h3>
              Your portfolio starts here
            </h3>

            <p>
              Add a holding above to calculate your
              expected dividend income.
            </p>

          </div>

        ) : (

          <div className="holdings-list">

            {holdings.map((holding) => {

              const expected =
                Number(holding.shares || 0) *
                Number(
                  holding.dividend_per_share || 0
                );

              return (
                <div
                  className="holding-row"
                  key={holding.company_id}
                >

                  <div className="holding-company">

                    <div className="holding-logo">
                      {holding.symbol?.charAt(0)}
                    </div>

                    <div>
                      <strong>
                        {holding.symbol}
                      </strong>

                      <span>
                        {holding.name}
                      </span>
                    </div>

                  </div>

                  <div className="holding-data">
                    <small>SHARES</small>
                    <strong>
                      {holding.shares}
                    </strong>
                  </div>

                  <div className="holding-data">
                    <small>DIVIDEND / SHARE</small>
                    <strong>
                      ₹
                      {Number(
                        holding.dividend_per_share || 0
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div className="holding-data expected">
                    <small>EXPECTED DIVIDEND</small>
                    <strong>
                      ₹
                      {expected.toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div className="holding-source">
                    <span>
                      {holding.source || "NSE"}
                    </span>
                  </div>

                  <button
                    className="delete-holding"
                    onClick={() =>
                      removeHolding(
                        holding.company_id
                      )
                    }
                    title="Remove holding"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>
              );
            })}

          </div>
        )}

      </section>

      {/* SOURCE */}
      <div className="portfolio-trust">

        <span className="trust-dot"></span>

        Dividend estimates use the latest available
        source-backed dividend record.

      </div>

    </div>
  );
}

export default Portfolio;