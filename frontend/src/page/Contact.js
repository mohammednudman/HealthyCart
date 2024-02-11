import React from "react";

const Contact = () => {
  return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f1f1f1" }}>
        <form
            style={{
              display: "flex", flexDirection: "column", width: "300px", gap: "15px", padding: "20px", borderRadius: "8px", background: "white", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)"
            }}
            onSubmit={(e) => e.preventDefault()}
        >
          <h1 style={{ textAlign: "center", color: "#333" }}>Contact Us</h1>
          <input style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }} type="text" name="name" placeholder="Your name" />
          <input style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }} type="email" name="email" placeholder="Your email" />
          <textarea style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ddd", minHeight: "100px" }} name="message" placeholder="Your message" />
          <button style={{ padding: "10px", borderRadius: "4px", border: "none", background: "#007BFF", color: "white" }} type="submit">Submit</button>
        </form>
      </div>
  );
}

export default Contact;