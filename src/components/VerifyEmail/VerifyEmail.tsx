"use client";

import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [verified, setVerified] = useState(false);
  const verifyEmailByToken = async () => {
    try {
      const response = await axios.post("/api/verifyemail", {
        token,
      });
      setVerified(true);
    } catch (error: any) {
      console.log("error", error?.response?.data);
    }
  };
  useEffect(() => {
    if (token?.length) {
      verifyEmailByToken();
    }
  }, [token]);
  return <div>verifying your mail... verified: {verified}</div>;
};

export default VerifyEmail;
