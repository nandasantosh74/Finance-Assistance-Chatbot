import { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  container: {
    background: "rgba(0, 0, 0, 0.54)",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.24)",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
  },
  toggle: {
    color: "#007BFF",
    cursor: "pointer",
    marginTop: "10px",
    fontSize: "14px",
  },
}

const Auth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ Initialize navigation

  const handleAuth = async () => {
    setError("");
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created successfully!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
      }
      navigate("/chat"); // ✅ Redirect to chatbot page after login
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to handle Enter key press for form submission
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAuth();
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2>{isRegister ? "Register" : "Login"}</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          onKeyPress={handleKeyPress} // Add key press event
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          onKeyPress={handleKeyPress} // Add key press event
        />
        <button onClick={handleAuth} style={styles.button}>
          {isRegister ? "Register" : "Login"}
        </button>
        <p onClick={() => setIsRegister(!isRegister)} style={styles.toggle}>
          {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
};

export default Auth;
