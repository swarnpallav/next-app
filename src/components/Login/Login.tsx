"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { push } = useRouter();

  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const { email, password } = user;
      const response = await axios.post("/api/users/login", {
        email,
        password,
      });

      console.log("~ login response", response);
      push("/profile");
    } catch (error) {
      console.log("~ error while loggin in", error);
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
      {loading ? "Processing..." : "Login"}
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
          disabled={!(user.email && user.password) || loading}
          style={{ cursor: "pointer" }}
          onClick={onLogin}
        >
          {loading ? "Processing..." : "Login Here"}
        </button>
        <Link href={"/signup"}>Visit Signup Page</Link>
      </div>
    </div>
  );
};

export default Login;
