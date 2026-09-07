import {useState} from "react"; import {useNavigate,Link} from "react-router-dom"; import {useAuth} from "../context/AuthContext";
export default function Register(){
 const {register}=useAuth();const nav=useNavigate();const [form,setForm]=useState({name:"",email:"",password:""});const [error,setError]=useState("");
 async function submit(e){e.preventDefault();setError("");try{await register(form);nav("/chat")}catch(err){setError(err.response?.data?.message||err.message)}}
 return <div className="auth"><form className="card" onSubmit={submit}><h1>Create account</h1><p>Start with a free AI account.</p>{error&&<div className="error">{error}</div>}<label>Name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></label><label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/></label><label>Password<input type="password" minLength="8" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/></label><button className="primary full">Create account</button><p>Already registered? <Link to="/login">Login</Link></p></form></div>
}
