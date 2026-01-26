"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// styles (UNCHANGED)
import "@/styles/layout/auth.layout.css";
import "@/styles/design/auth.design.css";

// validation helpers (EMAIL REMOVED)
import {
  isValidName,
  isValidPhone,
  isValidPassword,
  isValidOTP,
} from "@/modules/auth/auth.validation";

// API base
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AuthPage() {
  const router = useRouter();

  /* --------------------------------------------------
     STATE
  -------------------------------------------------- */

  const [step, setStep] = useState("signup"); // signup | otp | login
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    otp: "",
  });

  /* --------------------------------------------------
     DEBUG
  -------------------------------------------------- */

  useEffect(() => {
    console.log("[AUTH] Current step:", step);
  }, [step]);

  useEffect(() => {
    console.log("[AUTH] Form updated:", form);
  }, [form]);

  useEffect(() => {
    setError("");
  }, [step]);

  /* --------------------------------------------------
     INPUT HANDLER
  -------------------------------------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(`[AUTH] Input change → ${name}:`, value);

    setError("");
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* --------------------------------------------------
     SIGNUP
  -------------------------------------------------- */

  const handleSignup = async () => {
    if (loading) return;

    console.log("[SIGNUP] Payload:", form);

    if (!isValidName(form.name)) {
      return setError("Name must be at least 2 characters");
    }

    if (!isValidPhone(form.phone)) {
      return setError("Phone must be 10 digits");
    }

    if (!isValidPassword(form.password)) {
      return setError("Password must be 6+ chars with letters & numbers");
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API}/auth/signup`, {
        name: form.name,
        phone: form.phone,
        password: form.password,
      });

      console.log("[SIGNUP] API success:", res.data);
      alert("OTP sent to phone");
      setStep("otp");
    } catch (err) {
      console.error("[SIGNUP] API error:", err);
      setError(err?.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------------
     VERIFY OTP
  -------------------------------------------------- */

  const handleVerifyOTP = async () => {
    console.log("[OTP] Payload:", {
      phone: form.phone,
      otp: form.otp,
    });

    if (!isValidOTP(form.otp)) {
      return setError("OTP must be 6 digits");
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API}/auth/verify-otp`, {
        phone: form.phone,
        otp: form.otp,
      });

      console.log("[OTP] Success:", res.data);
      alert("Registration successful. Please login.");
      setStep("login");
    } catch (err) {
      console.error("[OTP] Failed:", err);
      setError(err?.response?.data?.error || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------------
     LOGIN (PHONE + PASSWORD)
  -------------------------------------------------- */

  const handleLogin = async () => {
    console.log("[LOGIN] Payload:", {
      phone: form.phone,
      password: form.password,
    });

    if (!isValidPhone(form.phone)) {
      return setError("Enter a valid phone number");
    }

    if (!form.password) {
      return setError("Password is required");
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API}/auth/login`, {
        phone: form.phone,
        password: form.password,
      });

      console.log("[LOGIN] Success:", res.data);
      localStorage.setItem("token", res.data.token);
      router.push("/generate");
    } catch (err) {
      console.error("[LOGIN] Failed:", err);
      setError(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------------
     RENDER
  -------------------------------------------------- */

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🔐 Authentication</h1>

        {error && (
          <div
            style={{
              marginBottom: 12,
              padding: "10px 12px",
              borderRadius: 8,
              background: "#fee2e2",
              color: "#991b1b",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <div className="auth-form">
          {step === "signup" && (
            <>
              <input name="name" placeholder="Name" onChange={handleChange} />
              <input name="phone" placeholder="Phone" onChange={handleChange} />
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
              />

              <button onClick={handleSignup} disabled={loading}>
                {loading ? "Sending OTP…" : "Sign Up"}
              </button>

              <p className="auth-footer">
                Already have an account?{" "}
                <button onClick={() => setStep("login")}>Login</button>
              </p>
            </>
          )}

          {step === "otp" && (
            <>
              <input
                name="otp"
                placeholder="Enter OTP"
                onChange={handleChange}
              />

              <button onClick={handleVerifyOTP} disabled={loading}>
                {loading ? "Verifying…" : "Verify OTP"}
              </button>
            </>
          )}

          {step === "login" && (
            <>
              <input name="phone" placeholder="Phone" onChange={handleChange} />
              <input
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
              />

              <button onClick={handleLogin} disabled={loading}>
                {loading ? "Logging in…" : "Login"}
              </button>

              <p className="auth-footer">
                New user?{" "}
                <button onClick={() => setStep("signup")}>
                  Create account
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
