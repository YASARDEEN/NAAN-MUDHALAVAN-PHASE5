import React, { useState, useEffect } from "react";
import "./App.css";

function FeedbackForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setMessage("⚠️ Please enter your feedback.");
      return;
    }

    const newFeedback = {
      id: Date.now(),
      name: name || "Anonymous",
      email,
      feedback,
      rating,
      sentiment: feedback.toLowerCase().includes("good") ? "Positive" : "Negative",
      createdAt: new Date().toLocaleString(),
    };

    onSubmit(newFeedback);
    setName("");
    setEmail("");
    setFeedback("");
    setRating(5);
    setMessage("✅ Feedback submitted successfully!");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Feedback Collection System</h2>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        placeholder="Write your feedback..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} Star{r > 1 && "s"}
          </option>
        ))}
      </select>
      <button type="submit">Submit</button>
      {message && <p>{message}</p>}
    </form>
  );
}

function FeedbackList({ feedbacks }) {
  if (feedbacks.length === 0) return <p>No feedback yet.</p>;

  return (
    <div className="list">
      {feedbacks.map((f) => (
        <div key={f.id} className="card">
          <h4>{f.name}</h4>
          <p>{f.feedback}</p>
          <small>
            ⭐ {f.rating} | {f.sentiment} | {f.createdAt}
          </small>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("feedbacks")) || [];
    setFeedbacks(saved);
  }, []);

  const addFeedback = (f) => {
    const updated = [f, ...feedbacks];
    setFeedbacks(updated);
    localStorage.setItem("feedbacks", JSON.stringify(updated));
  };

  return (
    <div className="App">
      <FeedbackForm onSubmit={addFeedback} />
      <FeedbackList feedbacks={feedbacks} />
    </div>
  );
}
