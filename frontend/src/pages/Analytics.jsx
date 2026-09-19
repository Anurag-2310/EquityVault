import { useEffect, useState } from "react";
import {
  BarChart3,
  Building2,
  CalendarDays,
  Rocket,
  Database,
} from "lucide-react";

import {
  getCompanies,
  getCorporateActions,
  getDividends,
  getIpos,
} from "../services/api";

import "./Analytics.css";

function Analytics() {
  const [stats, setStats] = useState({
    companies: 0,
    actions: 0,
    dividends: 0,
    openIpos: 0,
  });

  const [actionBreakdown, setActionBreakdown] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [
          companiesResponse,
          actionsResponse,
          dividendsResponse,
          iposResponse,
        ] = await Promise.all([
          getCompanies(),
          getCorporateActions(),
          getDividends(),
          getIpos(),
        ]);

        const actions = actionsResponse?.data || [];
        const ipos = iposResponse?.data || [];

        const breakdown = {};

        actions.forEach((action) => {
          const type = action.action_type || "other";

          breakdown[type] = (breakdown[type] || 0) + 1;
        });

        setStats({
          companies: companiesResponse?.data?.length || 0,
          actions: actionsResponse?.total || actions.length,
          dividends: dividendsResponse?.total || dividendsResponse?.data?.length || 0,
          openIpos: ipos.filter((ipo) => ipo.status === "open").length,
        });

        setActionBreakdown(breakdown);
      } catch (error) {
        console.error("Analytics error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const formatLabel = (value) => {
    return value
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="analytics-page">

      <div className="analytics-header">
        <div>
          <div className="analytics-kicker">
            <BarChart3 size={15} />
            MARKET INTELLIGENCE
          </div>

          <h1>Analytics</h1>

          <p>
            A source-backed view of the data currently tracked in EquityVault.
          </p>
        </div>

        <div className="analytics-source">
          <Database size={15} />
          NSE Data
        </div>
      </div>

      {loading ? (
        <div className="analytics-loading">
          Loading EquityVault analytics...
        </div>
      ) : (
        <>
          <div className="analytics-grid">

            <div className="analytics-card">
              <div className="analytics-card-top">
                <span>COMPANIES TRACKED</span>
                <Building2 size={19} />
              </div>

              <strong>{stats.companies}</strong>

              <small>Companies available in EquityVault</small>
            </div>

            <div className="analytics-card">
              <div className="analytics-card-top">
                <span>CORPORATE ACTIONS</span>
                <CalendarDays size={19} />
              </div>

              <strong>{stats.actions}</strong>

              <small>Imported corporate-action records</small>
            </div>

            <div className="analytics-card">
              <div className="analytics-card-top">
                <span>DIVIDEND EVENTS</span>
                <BarChart3 size={19} />
              </div>

              <strong>{stats.dividends}</strong>

              <small>Dividend records in the database</small>
            </div>

            <div className="analytics-card">
              <div className="analytics-card-top">
                <span>OPEN IPOs</span>
                <Rocket size={19} />
              </div>

              <strong>{stats.openIpos}</strong>

              <small>Currently open issue records</small>
            </div>

          </div>

          <div className="analytics-section">

            <div className="analytics-section-header">
              <div>
                <span>EVENT DISTRIBUTION</span>
                <h2>Corporate Action Breakdown</h2>
              </div>

              <span className="analytics-live">
                DATABASE DATA
              </span>
            </div>

            <div className="breakdown-list">

              {Object.keys(actionBreakdown).length === 0 ? (
                <div className="analytics-empty">
                  No corporate-action data available.
                </div>
              ) : (
                Object.entries(actionBreakdown).map(
                  ([type, count]) => {
                    const percentage =
                      stats.actions > 0
                        ? Math.round((count / stats.actions) * 100)
                        : 0;

                    return (
                      <div className="breakdown-row" key={type}>

                        <div className="breakdown-info">
                          <strong>{formatLabel(type)}</strong>
                          <span>{count} events</span>
                        </div>

                        <div className="breakdown-bar">
                          <div
                            className="breakdown-fill"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                        <strong className="breakdown-percent">
                          {percentage}%
                        </strong>

                      </div>
                    );
                  }
                )
              )}

            </div>

          </div>

          <div className="analytics-trust">
            <Database size={16} />

            <div>
              <strong>Source-backed analytics</strong>

              <p>
                Metrics are calculated from EquityVault records imported from
                official NSE data sources. No synthetic market values are used.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Analytics;