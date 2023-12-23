"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Profile = () => {
  const { push } = useRouter();
  const onLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      push("/login");
    } catch (error: any) {
      console.log("error", error.message);
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await axios.get("/api/user-info");

      const userId = response.data.data?._id;

      if (userId) {
        push("/profile/" + userId);
      }
    } catch (error: any) {
      console.log("~ error", error.message);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);
  return (
    <div>
      Profile Page
      <hr></hr>
      <button onClick={onLogout}>Log out</button>
    </div>
  );
};

export default Profile;
