import UserProfile from "@/components/UserProfile";

const UserProfilePage = ({ params }: { params: { id: number } }) => {
  return <UserProfile id={params.id} />;
};

export default UserProfilePage;
