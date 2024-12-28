import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextInput, Card } from "flowbite-react";
import axios from "axios";
import { signinUrl, signinUrlForAdmin } from "./../url";

const Signin = () => {
  const navigate = useNavigate();
  const appSecret = useRef("");
  const adminPassword = useRef("");
  const adminUsername = useRef("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios(signinUrl, {
        method: "POST",
        data: { appSecret: appSecret.current.value },
        headers: {
          "Content-Type": "application/json",
        },
      });
      localStorage.setItem("token", res.data.data.token);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error.message || "Something went wrong");
    }
  };

  const handleSubmitForAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios(signinUrlForAdmin, {
        method: "POST",
        data: { username: adminUsername.current.value, password: adminPassword.current.value },
        headers: {
          "Content-Type": "application/json",
        },
      });
      localStorage.setItem("token", res.data.data.token);
      navigate("/admin");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* App Secret Form */}
      <Card className="w-full max-w-md mb-6">
        <h2 className="text-xl font-semibold text-center mb-4">Sign in</h2>
        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            ref={appSecret}
            required
            placeholder="Enter the App Secret"
            className="mb-4"
          />
          <Button type="submit" gradientMonochrome="info" fullSized>
            Submit
          </Button>
        </form>
      </Card>

      {/* Admin Login Form */}
      <Card className="w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4">Admin Sign in</h2>
        <form onSubmit={handleSubmitForAdmin}>
          <TextInput
            type="text"
            ref={adminUsername}
            required
            placeholder="Enter Admin Username"
            className="mb-4"
          />
          <TextInput
            type="password"
            ref={adminPassword}
            required
            placeholder="Enter Admin Password"
            className="mb-4"
          />
          <Button type="submit" gradientMonochrome="success" fullSized>
            Submit as Admin
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Signin;