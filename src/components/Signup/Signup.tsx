"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Signup = () => {
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
  });
  const { push } = useRouter();

  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    setLoading(true);
    const { username, email, password } = user;

    try {
      const response = await axios.post("/api/users/signup", {
        username,
        password,
        email,
      });

      console.log("~ user created", response.data);
      push("/login");
    } catch (error) {
      console.log("~ Signup failed", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 50,
        padding: 100,
        textAlign: "center",
      }}
    >
      {loading ? "Processing..." : "Signup"}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", gap: 20 }}>
          <div>email</div>
          <input
            type="text"
            value={user.email}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder={"email"}
          />
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <div>username</div>
          <input
            type="text"
            value={user.username}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, username: e.target.value }))
            }
            placeholder={"username"}
          />
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <div>password</div>
          <input
            type="password"
            value={user.password}
            onChange={(e) =>
              setUser((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder={"password"}
          />
        </div>
        <button
          disabled={!(user.email && user.password && user.username) || loading}
          style={{ cursor: "pointer" }}
          onClick={onSignup}
        >
          {loading ? "Processing" : "Signup here"}
        </button>
        <Link href={"/login"}>Visit Login Page</Link>
      </div>
    </div>
  );
};

export default Signup;
