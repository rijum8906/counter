import { useRef } from "react";
import { useNavigate } from "react-router-dom"
import { Button } from "flowbite-react";
import axios from "axios";
import { signinUrl } from "./../url"

const Signin = () => {
  const navigate = useNavigate();
  const appSecret = useRef("");
  const handleSubmit = async (e) =>{
    e.preventDefault();
    console.log(appSecret)
    try {
      const res = await axios(signinUrl, {
      method: "POST",
      data: { appSecret: appSecret.current.value },
      headers: {
        "Content-Type": "application/json"
      }
    });
    localStorage.setItem("token",res.data.data.token)
    } catch (error) {
      console.log(error)
      alert(error.response.data.message || error.message || "something went wrong");
    }
    navigate("/");
  }
  
  return (
    <form onSubmit={handleSubmit}>
    <div>
      <input type="text" ref={appSecret} required placeholder="Enter the app secret"/>
    </div>
    <Button type="submit">Submit</Button>
    </form>
    )
}

export default Signin;