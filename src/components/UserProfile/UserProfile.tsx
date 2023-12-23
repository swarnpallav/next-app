"use client";
import axios from "axios";
import { useRouter } from "next/navigation";

const UserProfile = ({ id }: { id: number }) => {
  const { push } = useRouter();
  const onLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      push("/login");
    } catch (error: any) {
      console.log("error", error.message);
    }
  };
  return (
    <div>
      {id}
      <hr></hr>
      <button onClick={onLogout}>Log out</button>
    </div>
  );
};

export default UserProfile;
