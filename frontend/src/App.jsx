/* global gtag */
import { useEffect, useState } from "react";
import CookieConsent from "react-cookie-consent";

function App() {
  const [entries, setEntries] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getEntries = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/entries");
        const data = await res.json();
        setEntries(data);
      } catch (err) {
        console.error("Fetch error", err);
      }
    };

    getEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEntry = { title, content };

    const res = await fetch("http://localhost:3000/api/entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEntry),
    });

    if (res.ok) {
      gtag("event", "submit_entry", {
        event_category: "Entry",
        event_label: title,
      });
      const savedEntry = await res.json();
      setEntries([...entries, savedEntry]);
      setTitle("");
      setContent("");
      setIsModalOpen(false);
    } else {
      console.error("Failed to add entry");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/entries/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        gtag("event", "delete_entry", {
          event_category: "Entry",
          event_label: id,
        });
        setEntries(entries.filter((entry) => entry._id !== id));
      } else {
        console.error("Failed to delete entry");
      }
    } catch (err) {
      console.error("Error", err);
    }
  };

  const handleSaveEdit = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/entries/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
        }),
      });

      if (response.ok) {
        const updatedEntry = await response.json();
        setEntries((prevEntries) =>
          prevEntries.map((entry) => (entry._id === id ? updatedEntry : entry))
        );
        setEditingId(null);
      } else {
        console.eroor("Failed to update Entry");
      }
    } catch (err) {
      console.error("Error updating entry:", err);
    }
  };

  const startEditing = (entry) => {
    setEditingId(entry._id);
    setEditTitle(entry.title);
    setEditContent(entry.content);
  };

  return (
    <main>
      <header>
        <h1>Favourite Media List</h1>
      </header>

      <section aria-labelledby="media-section">
        <div className="entry-header">
          <h2 className="your-entries">Your Entries</h2>
          <button className="add-entry" onClick={() => setIsModalOpen(true)}>
            Add Entry
          </button>
        </div>
        <ul>
          {entries.map((entry) => (
            <li key={entry._id}>
              {editingId === entry._id ? (
                <article>
                  <label
                    className="edit-title"
                    htmlFor={`edit-title-${entry._id}`}
                  >
                    Edit Title
                  </label>
                  <input
                    className="edit-title-input"
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <label
                    className="edit-content"
                    htmlFor={`edit-content-${entry._id}`}
                  >
                    Edit Content
                  </label>
                  <input
                    className="edit-content-input"
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <button
                    className="edit-save-btn"
                    onClick={() => handleSaveEdit(entry._id)}
                    aria-label="Save Edited Entry"
                  >
                    Save
                  </button>
                  <button
                    className="edit-cancel-btn"
                    onClick={() => {
                      gtag("event", "click_button", {
                        event_category: "Button",
                        event_label: "Cancel Edit",
                      });
                      setEditingId(null);
                    }}
                    aria-label="Cancel Editing Entry"
                  >
                    Cancel
                  </button>
                </article>
              ) : (
                <article className="media-card">
                  <h3> {entry.title} </h3>
                  <p> {entry.content} </p>
                  <button
                    onClick={() => {
                      gtag("event", "click_button", {
                        event_category: "Button",
                        event_label: "Edit Entry",
                      });
                      startEditing(entry);
                    }}
                    aria-label={`Edit entry title ${entry.title}`}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      gtag("event", "click_button", {
                        event_category: "Button",
                        event_label: "Delete Entry",
                      });
                      handleDelete(entry._id);
                    }}
                    aria-label={`Delete entry titled ${entry.title}`}
                  >
                    Delete
                  </button>
                </article>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="add-section">
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add a New Entry</h2>
              <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <br />
                <label htmlFor="content">Content</label>
                <textarea
                  placeholder="Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                ></textarea>
                <br />
                <button type="submit" aria-label="add new media entry">
                  Add Entry
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </section>
      <CookieConsent
        location="bottom"
        buttonText="Accept"
        cookieName="userConsent"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
        expires={150}
      >
        We use cookies to understand how users interact with this site. Please
        click "Accept" so I can do anonymous tracking!
      </CookieConsent>
    </main>
  );
}

export default App;
