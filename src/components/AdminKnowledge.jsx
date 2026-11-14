import { useEffect, useState } from "react";
import "./AdminKnowledge.css";

const API = "http://localhost:8080/api/admin/documents";

export default function AdminKnowledge() {

  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadDocuments() {

    try {

      const response = await fetch(API);
      const data = await response.json();

      setDocuments(data);

    } catch (error) {

      setMessage(
        "Could not connect to the RAG backend."
      );
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  async function uploadDocument() {

    if (!file) {
      setMessage("Please select a document.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {

      const formData = new FormData();

      formData.append("file", file);

      const response =
          await fetch(`${API}/upload`, {
            method: "POST",
            body: formData,
          });

      const data =
          await response.json();

      setMessage(data.message);

      if (data.success) {
        setFile(null);
        document.getElementById(
          "knowledge-file"
        ).value = "";

        await loadDocuments();
      }

    } catch (error) {

      setMessage(
        "Upload failed. Check the backend."
      );

    } finally {

      setLoading(false);
    }
  }

  async function deleteDocument(sourceFile) {

    const confirmed =
        window.confirm(
          `Delete ${sourceFile}?`
        );

    if (!confirmed) {
      return;
    }

    try {

      await fetch(
        `${API}/${encodeURIComponent(sourceFile)}`,
        {
          method: "DELETE",
        }
      );

      await loadDocuments();

      setMessage(
        "Document deleted successfully."
      );

    } catch (error) {

      setMessage(
        "Could not delete document."
      );
    }
  }

  return (
    <div className="admin-page">

      <div className="admin-container">

        <div className="admin-header">
          <div>
            <p className="admin-label">
              RAG KNOWLEDGE BASE
            </p>

            <h1>
              Portfolio AI Knowledge
            </h1>

            <p>
              Upload documents that the portfolio
              AI can use when answering recruiters.
            </p>
          </div>
        </div>

        <div className="upload-card">

          <h2>
            Upload Knowledge
          </h2>

          <p>
            Supported formats: PDF, DOCX, TXT, MD
          </p>

          <div className="upload-row">

            <input
              id="knowledge-file"
              type="file"
              accept=".pdf,.docx,.txt,.md"
              onChange={(e) =>
                setFile(e.target.files[0])
              }
            />

            <button
              onClick={uploadDocument}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : "Upload & Index"}
            </button>

          </div>

          {message && (
            <div className="admin-message">
              {message}
            </div>
          )}

        </div>

        <div className="documents-card">

          <div className="documents-header">

            <h2>
              Indexed Documents
            </h2>

            <span>
              {documents.length} documents
            </span>

          </div>

          {documents.length === 0 ? (

            <p className="empty">
              No documents indexed.
            </p>

          ) : (

            <div className="document-list">

              {documents.map((doc) => (

                <div
                  className="document-item"
                  key={doc.sourceFile}
                >

                  <div>

                    <strong>
                      {doc.sourceFile}
                    </strong>

                    <small>
                      {doc.chunks} chunks
                    </small>

                  </div>

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteDocument(
                        doc.sourceFile
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}