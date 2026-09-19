import { useEffect, useState } from "react";
import {
  Search,
  FileText,
  ExternalLink,
  Database,
} from "lucide-react";

import { getDocuments } from "../services/api";
import "./Documents.css";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDocuments = async (value = "") => {
    try {
      setLoading(true);

      const response = await getDocuments(
        value ? { search: value } : {}
      );

      setDocuments(response?.data || []);
    } catch (error) {
      console.error("Documents error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="documents-page">

      <div className="documents-header">
        <div>
          <div className="documents-kicker">
            <FileText size={15} />
            SOURCE INTELLIGENCE
          </div>

          <h1>Documents</h1>

          <p>
            Official source documents behind EquityVault data.
          </p>
        </div>

        <div className="documents-source">
          <Database size={15} />
          Source-backed
        </div>
      </div>

      <div className="documents-toolbar">

        <div className="documents-search">
          <Search size={18} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                loadDocuments(search);
              }
            }}
            placeholder="Search documents..."
          />
        </div>

        <button
          className="documents-search-button"
          onClick={() => loadDocuments(search)}
        >
          Search
        </button>

      </div>

      <div className="documents-panel">

        <div className="documents-panel-header">
          <div>
            <span>VERIFIED SOURCES</span>
            <h2>Source Documents</h2>
          </div>

          <div className="documents-count">
            {documents.length} records
          </div>
        </div>

        {loading ? (
          <div className="documents-empty">
            Loading source documents...
          </div>
        ) : documents.length === 0 ? (
          <div className="documents-empty">
            <FileText size={34} />

            <h3>No source documents yet</h3>

            <p>
              Official NSE/BSE documents will appear here as they are
              ingested into EquityVault.
            </p>
          </div>
        ) : (
          <div className="documents-list">

            {documents.map((document) => (
              <div
                className="document-row"
                key={document.id}
              >
                <div className="document-icon">
                  <FileText size={19} />
                </div>

                <div className="document-main">
                  <strong>{document.title}</strong>

                  <div className="document-meta">
                    <span>
                      {document.document_type || "Document"}
                    </span>

                    <span>•</span>

                    <span>
                      {document.source_exchange || "—"}
                    </span>

                    <span>•</span>

                    <span>
                      {formatDate(document.published_at)}
                    </span>
                  </div>
                </div>

                <div className="document-source-name">
                  {document.source_name || "Official Source"}
                </div>

                <a
                  href={document.document_url}
                  target="_blank"
                  rel="noreferrer"
                  className="document-open"
                >
                  Open
                  <ExternalLink size={14} />
                </a>
              </div>
            ))}

          </div>
        )}

      </div>

      <div className="documents-trust">
        <Database size={17} />

        <div>
          <strong>Why this matters</strong>

          <p>
            EquityVault keeps source information alongside market-event
            records so users can verify where important corporate-action
            and IPO information came from.
          </p>
        </div>
      </div>

    </div>
  );
}

export default Documents;