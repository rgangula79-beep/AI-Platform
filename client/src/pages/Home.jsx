import {Link} from "react-router-dom";
import {Search,MessageSquare,ShieldCheck,Zap} from "lucide-react";
export default function Home(){
 return <div className="hero">
  <div className="eyebrow">NEXT-GENERATION AI WORKSPACE</div>
  <h1>Ask. Search. Create.<br/><span>One intelligent platform.</span></h1>
  <p>Chat with AI, search the web, research topics, upload files and manage everything from one fast workspace.</p>
  <div className="heroBtns"><Link className="primary" to="/chat">Start chatting</Link><Link className="secondary" to="/search">Search the web</Link></div>
  <div className="featuregrid">
   <div><MessageSquare/><h3>AI Chat</h3><p>Context-aware conversations with history.</p></div>
   <div><Search/><h3>Fast Search</h3><p>Find current information with sources.</p></div>
   <div><ShieldCheck/><h3>Privacy-first</h3><p>Secrets stay on the backend.</p></div>
  </div>
 </div>
}
