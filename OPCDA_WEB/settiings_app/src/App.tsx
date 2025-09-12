import { useState } from "react";
import "./App.scss";

const App = () => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  if (submitted) {
    return (
      <div className="minimal-box">
        <h1>Settings Saved!</h1>
        <p>Name: {name}</p>
        <p>Email: {email}</p>
        <button onClick={() => setSubmitted(false)}>Edit</button>
      </div>
    );
  }

  return (
    <div className="minimal-box">
      <h1>Settings Page</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default App;
