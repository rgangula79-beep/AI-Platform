import {Link} from "react-router-dom";
export default function Sidebar(){
 return <aside className="sidebar">
  <Link to="/chat">✦ New Chat</Link><Link to="/history">History</Link><Link to="/files">Files</Link>
  <Link to="/search">Web Search</Link><Link to="/research">Research</Link>
  <Link to="/profile">Profile</Link><Link to="/settings">Settings</Link>
 </aside>
}
