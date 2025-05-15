import React, { useState } from "react";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you can handle form submission, e.g., send data to API
    alert(`Thank you, ${form.name}! Your message has been sent.`);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "2rem" }}>
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          type="text"
          required
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        />

        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
          required
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        />

        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        />

        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ContactPage;
