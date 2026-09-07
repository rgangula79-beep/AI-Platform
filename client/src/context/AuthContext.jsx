import {createContext,useContext,useEffect,useState} from "react";
import api from "../services/api";

const AuthContext=createContext(null);

export function AuthProvider({children}){
  const [user,setUser]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    const token=localStorage.getItem("ai_token");
    if(!token){setLoading(false);return;}
    api.get("/auth/me").then(r=>setUser(r.data.user)).catch(()=>localStorage.removeItem("ai_token")).finally(()=>setLoading(false));
  },[]);

  async function login(email,password){
    const {data}=await api.post("/auth/login",{email,password});
    localStorage.setItem("ai_token",data.token); setUser(data.user); return data.user;
  }
  async function register(payload){
    const {data}=await api.post("/auth/register",payload);
    localStorage.setItem("ai_token",data.token); setUser(data.user); return data.user;
  }
  async function guest(){
    const {data}=await api.post("/auth/guest");
    localStorage.setItem("ai_token",data.token); setUser(data.user); return data.user;
  }
  function logout(){localStorage.removeItem("ai_token");setUser(null);}
  return <AuthContext.Provider value={{user,loading,login,register,guest,logout}}>{children}</AuthContext.Provider>
}
export const useAuth=()=>useContext(AuthContext);
