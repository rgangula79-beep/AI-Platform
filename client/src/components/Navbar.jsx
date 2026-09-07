import {Link} from "react-router-dom";
import {LogIn,Shield} from "lucide-react";
import {useAuth} from "../context/AuthContext";

export default function Navbar(){
 const {user,logout}=useAuth();
 return <header className="nav">
  <Link to="/" className="brand"><img src="/logo.svg"/> <span>AI Platform</span></Link>
  <nav>
   <Link to="/search">Search</Link>
   {user?.role==="admin" && <a href="http://localhost:5174"><Shield size={16}/> Admin</a>}
   {user?<button className="linkbtn" onClick={logout}>Logout</button>:<Link to="/login"><LogIn size={16}/> Login</Link>}
  </nav>
 </header>
}
