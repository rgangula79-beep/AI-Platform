import Navbar from "../components/Navbar"; import Sidebar from "../components/Sidebar";
export default function ChatLayout({children}){return <><Navbar/><div className="appgrid"><Sidebar/><main className="chatmain">{children}</main></div></>}
