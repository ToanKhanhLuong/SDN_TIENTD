import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(
        auth,
        provider
      );

      localStorage.setItem(
        "user",
        JSON.stringify(result.user)
      );

      navigate("/profile");
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
      }}
    >
      <h1>BaaS Demo</h1>

      <button onClick={handleLogin}>
        Đăng nhập bằng Google
      </button>
    </div>
  );
}

export default Login;