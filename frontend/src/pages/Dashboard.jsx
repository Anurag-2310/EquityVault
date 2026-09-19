import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  CircleDollarSign,
  Globe2,
  Landmark,
  Rocket,
  TrendingUp,
} from "lucide-react";

import { getCompanies, getCompany } from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // -----------------------------
      // LOAD COMPANIES
      // -----------------------------

      const companyResponse = await getCompanies();

      const companyList = companyResponse.data || [];

      setCompanies(companyList);

      // -----------------------------
      // LOAD FIRST COMPANY DETAILS
      // -----------------------------

      if (companyList.length > 0) {
        const company = await getCompany(companyList[0].id);

        setSelectedCompany(company);
      }

      // -----------------------------
      // LOAD LOCAL PORTFOLIO
      // -----------------------------

      const storedPortfolio = JSON.parse(
        localStorage.getItem("equityvault_holdings") || "[]"
      );

      setPortfolio(storedPortfolio);

    } catch (error) {
      console.error("Dashboard data error:", error);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // CORPORATE ACTIONS
  // -----------------------------

  const actions =
    selectedCompany?.corporate_actions || [];

  // -----------------------------
  // DIVIDENDS
  // -----------------------------

  const dividendActions = actions.filter(
    (action) => action.action_type === "dividend"
  );

  const latestDividend = dividendActions[0];

  // -----------------------------
  // EXPECTED DIVIDEND
  // -----------------------------

  const expectedDividends = portfolio.reduce(
    (total, holding) => {
      return (
        total +
        Number(holding.shares || 0) *
          Number(holding.dividend_per_share || 0)
      );
    },
    0
  );

  // -----------------------------
  // TOTAL SHARES
  // -----------------------------

  const totalShares = portfolio.reduce(
    (total, holding) => {
      return total + Number(holding.shares || 0);
    },
    0
  );

  return (
    <div className="dashboard-page">

      {/* =====================================
          HERO
      ====================================== */}

      <section className="dashboard-header">

        <div>

          <div className="page-eyebrow">
            <span className="live-indicator"></span>
            MARKET INTELLIGENCE
          </div>

          <h1>
            Good evening, <span>Anurag.</span>
          </h1>

          <p>
            Your intelligent view of Indian markets,
            dividends and corporate actions.
          </p>

        </div>

        <div className="market-state">

          <div className="market-state-dot"></div>

          <div>
            <span>Market Status</span>

            <strong>
              {loading
                ? "Connecting..."
                : "Data Connected"}
            </strong>
          </div>

        </div>

      </section>


      {/* =====================================
          OVERVIEW CARDS
      ====================================== */}

      <section className="overview-grid">

        {/* PORTFOLIO VALUE */}

        <div className="overview-card primary-card">

          <div className="card-top">

            <span>PORTFOLIO VALUE</span>

            <WalletIcon />

          </div>

          <div className="metric-value">
            ₹—
          </div>

          <div className="metric-bottom">

            <span>
              Market price data unavailable
            </span>

          </div>

        </div>


        {/* EXPECTED DIVIDENDS */}

        <div className="overview-card">

          <div className="card-top">

            <span>EXPECTED DIVIDENDS</span>

            <CircleDollarSign size={18} />

          </div>

          <div className="metric-value">

            {loading
              ? "₹—"
              : `₹${expectedDividends.toLocaleString(
                  "en-IN"
                )}`}

          </div>

          <div className="metric-bottom">

            <span>
              {portfolio.length > 0
                ? `${portfolio.length} holding${
                    portfolio.length > 1
                      ? "s"
                      : ""
                  } · ${totalShares} shares`
                : "Add your holdings"}
            </span>

          </div>

        </div>


        {/* IPO */}

        <div className="overview-card">

          <div className="card-top">

            <span>UPCOMING IPOs</span>

            <Rocket size={18} />

          </div>

          <div className="metric-value">
            —
          </div>

          <div className="metric-bottom">

            <span>
              IPO intelligence
            </span>

          </div>

        </div>


        {/* CORPORATE ACTIONS */}

        <div className="overview-card">

          <div className="card-top">

            <span>CORPORATE ACTIONS</span>

            <Landmark size={18} />

          </div>

          <div className="metric-value">

            {loading
              ? "—"
              : actions.length}

          </div>

          <div className="metric-bottom">

            <span>
              {selectedCompany?.symbol || "NSE"} events
            </span>

          </div>

        </div>

      </section>


      {/* =====================================
          MAIN GRID
      ====================================== */}

      <section className="main-grid">

        {/* =================================
            PORTFOLIO OVERVIEW
        ================================== */}

        <div className="dashboard-card portfolio-card">

          <div className="section-heading">

            <div>

              <span>YOUR PORTFOLIO</span>

              <h2>
                Portfolio Overview
              </h2>

            </div>

            <button
              className="ghost-button"
              onClick={() => navigate("/portfolio")}
            >
              View portfolio

              <ChevronRight size={14} />

            </button>

          </div>


          <div className="chart-placeholder">

            <div className="chart-grid"></div>


            {portfolio.length === 0 ? (

              /* EMPTY PORTFOLIO */

              <div className="chart-empty-content">

                <div className="chart-symbol">
                  <TrendingUp size={22} />
                </div>

                <h3>
                  Your portfolio starts here
                </h3>

                <p>
                  Add your holdings to unlock
                  portfolio performance,
                  allocation and dividend analytics.
                </p>

                <button
                  className="green-button"
                  onClick={() =>
                    navigate("/portfolio")
                  }
                >
                  Add Holdings
                </button>

              </div>

            ) : (

              /* CONNECTED PORTFOLIO */

              <div className="chart-empty-content">

                <div className="chart-symbol">
                  <TrendingUp size={22} />
                </div>

                <h3>
                  Portfolio connected
                </h3>

                <p>
                  {portfolio.length} holding
                  {portfolio.length > 1
                    ? "s"
                    : ""}{" "}
                  with {totalShares} total shares
                  tracked using source-backed
                  dividend data.
                </p>

                <div className="portfolio-dashboard-metric">

                  <span>
                    Expected Dividend
                  </span>

                  <strong>
                    ₹
                    {expectedDividends.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

                <button
                  className="green-button"
                  onClick={() =>
                    navigate("/portfolio")
                  }
                >
                  View Portfolio
                </button>

              </div>

            )}

          </div>

        </div>


        {/* =================================
            DIVIDEND INTELLIGENCE
        ================================== */}

        <div className="dashboard-card">

          <div className="section-heading">

            <div>

              <span>
                DIVIDEND INTELLIGENCE
              </span>

              <h2>
                Latest Dividends
              </h2>

            </div>

            <button
              className="icon-link"
              onClick={() =>
                navigate("/dividends")
              }
            >
              <ChevronRight size={16} />
            </button>

          </div>


          {dividendActions.length === 0 ? (

            <div className="empty-list">

              <div className="large-empty-icon">
                <CircleDollarSign size={24} />
              </div>

              <h3>
                Waiting for market data
              </h3>

              <p>
                Verified dividend events from
                official market sources will
                appear here.
              </p>

            </div>

          ) : (

            <div className="dashboard-dividend-list">

              {dividendActions
                .slice(0, 4)
                .map((action) => (

                  <div
                    className="dashboard-dividend-item"
                    key={action.id}
                  >

                    <div>

                      <strong>
                        {selectedCompany?.symbol}
                      </strong>

                      <span>
                        {action.title}
                      </span>

                    </div>


                    <div className="dashboard-dividend-right">

                      <strong>
                        {action.amount
                          ? `₹${Number(
                              action.amount
                            ).toLocaleString(
                              "en-IN"
                            )}`
                          : "—"}
                      </strong>

                      <span>
                        {formatDate(
                          action.ex_date
                        )}
                      </span>

                    </div>

                  </div>

                ))}

            </div>

          )}

        </div>

      </section>


      {/* =====================================
          SECOND ROW
      ====================================== */}

      <section className="secondary-grid">

        {/* IPO */}

        <div className="dashboard-card">

          <div className="section-heading">

            <div>

              <span>
                PRIMARY MARKET
              </span>

              <h2>
                Upcoming IPOs
              </h2>

            </div>

            <button
              className="ghost-button"
              onClick={() =>
                navigate("/ipos")
              }
            >
              Explore

              <ChevronRight size={14} />

            </button>

          </div>


          <div className="empty-list compact-empty">

            <div className="large-empty-icon purple">
              <Rocket size={23} />
            </div>

            <h3>
              IPO intelligence
            </h3>

            <p>
              Upcoming, open and recently listed
              IPOs will be displayed here.
            </p>

          </div>

        </div>


        {/* MARKET MOVERS */}

        <div className="dashboard-card">

          <div className="section-heading">

            <div>

              <span>
                MARKET ACTIVITY
              </span>

              <h2>
                Market Movers
              </h2>

            </div>

            <button
              className="ghost-button"
              onClick={() =>
                navigate("/markets")
              }
            >
              Markets

              <ChevronRight size={14} />

            </button>

          </div>


          <div className="movers-grid">

            <Mover
              icon={
                <ArrowUpRight size={17} />
              }
              title="Top Gainers"
            />

            <Mover
              icon={
                <ArrowDownRight size={17} />
              }
              title="Top Losers"
            />

            <Mover
              icon={
                <Globe2 size={17} />
              }
              title="Most Active"
            />

          </div>

        </div>

      </section>


      {/* =====================================
          SOURCE BAR
      ====================================== */}

      <div className="source-bar">

        <div>

          <span className="source-dot"></span>

          {loading
            ? "Connecting to data source"
            : "NSE data connected"}

        </div>

        <span>
          NSE / Official Sources
        </span>

        <span>

          {selectedCompany
            ? `${selectedCompany.symbol} · ${actions.length} actions`
            : "Waiting for data"}

        </span>

      </div>

    </div>
  );
}


/* =====================================
   DATE FORMATTER
====================================== */

function formatDate(date) {

  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}


/* =====================================
   WALLET ICON
====================================== */

function WalletIcon() {

  return (
    <div className="wallet-icon">
      ₹
    </div>
  );
}


/* =====================================
   MARKET MOVER
====================================== */

function Mover({ icon, title }) {

  return (
    <div className="mover-card">

      <div className="mover-icon">
        {icon}
      </div>

      <div>

        <span>
          {title}
        </span>

        <strong>
          —
        </strong>

      </div>

    </div>
  );
}


export default Dashboard;