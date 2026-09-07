import {useEffect,useState} from "react";
import {Link,useLocation,useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
export default function Login(){
 const {login,guest}=useAuth(); const nav=useNavigate(); const loc=useLocation();
 const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState("");
 useEffect(()=>{const p=new URLSearchParams(loc.search);if(p.get("token")){localStorage.setItem("ai_token",p.get("token"));window.location.href="/chat"}},[]);
 async function submit(e){e.preventDefault();setError("");try{await login(email,password);nav("/chat")}catch(err){setError(err.response?.data?.message||err.message)}}
 async function guestLogin(){try{await guest();nav("/chat")}catch(e){setError(e.message)}}
 return <div className="auth"><form className="card" onSubmit={submit}><h1>Welcome back</h1><p>Sign in to your AI workspace.</p>{error&&<div className="error">{error}</div>}<label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button className="primary full">Login</button><a className="google" href={`${import.meta.env.VITE_API_URL||"http://localhost:5000/api"}/auth/google`}>Continue with Google</a><button type="button" className="secondary full" onClick={guestLogin}>Continue as Guest</button><p>No account? <Link to="/register">Create account</Link></p></form></div>
}
