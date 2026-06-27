import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!user) {
    navigate("/");
    return null;
  }

  const handleLogout = async () => {
    await signOut(auth);

    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
      }}
    >
      <h1>Profile</h1>

      <img
        src={user.photoURL}
        alt="avatar"
        width="120"
      />

      <h2>{user.displayName}</h2>

      <p>{user.email}</p>

      <button onClick={handleLogout}>
        Đăng xuất
      </button>
    </div>
  );
}

export default Profile;