import React, { useState, useEffect } from "react";

function App() {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setPosts(data);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      title: formData.title,
      body: formData.body,
      userId: 1,
    };

    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create post");
        return res.json();
      })
      .then((newPost) => {
        setPosts((prev) => [newPost, ...prev]);
        setFormData({ title: "", body: "" });
      })
      .catch((err) => {
        console.error("Error creating post:", err);
        setError("Failed to create post.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Posts</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.subheading}>Create New Post</h2>

        <label style={styles.label}>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </label>

        <label style={styles.label}>
          Body:
          <textarea
            name="body"
            value={formData.body}
            onChange={handleChange}
            style={{ ...styles.input, height: "80px" }}
            required
          />
        </label>

        <button type="submit" disabled={isSubmitting} style={styles.button}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </form>

      <ul style={styles.postList}>
        {posts.map((post) => (
          <li key={post.id} style={styles.postItem}>
            <h3 style={styles.postTitle}>
              {post.id}. {post.title}
            </h3>
            <p style={styles.postBody}>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "1rem",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
  },
  subheading: {
    marginBottom: "0.5rem",
  },
  form: {
    border: "1px solid #ccc",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "2rem",
  },
  label: {
    display: "block",
    marginBottom: "0.75rem",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginTop: "0.25rem",
    boxSizing: "border-box",
  },
  button: {
    padding: "0.5rem 1rem",
    marginTop: "0.5rem",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "0.5rem",
  },
  postList: {
    listStyle: "none",
    padding: 0,
  },
  postItem: {
    borderBottom: "1px solid #ddd",
    padding: "1rem 0",
  },
  postTitle: {
    margin: 0,
  },
  postBody: {
    margin: "0.5rem 0 0",
  },
};

export default App;
