import {useTheme} from "../context/ThemeContext";
export default function Settings(){const{dark,setDark}=useTheme();return <div className="page"><h1>Settings</h1><div className="card"><label className="row">Dark mode<input type="checkbox" checked={dark} onChange={e=>setDark(e.target.checked)}/></label></div></div>}
