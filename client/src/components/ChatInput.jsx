import {useState} from "react";
import {Send,Globe,Paperclip} from "lucide-react";
export default function ChatInput({onSend,busy}){
 const [text,setText]=useState(""); const [web,setWeb]=useState(false);
 function submit(e){e.preventDefault();if(!text.trim()||busy)return;onSend(text.trim(),web);setText("")}
 return <form className="chatinput" onSubmit={submit}>
  <textarea value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();submit(e)}}} placeholder="Ask anything..." rows="2"/>
  <div className="inputbar"><button type="button" className={web?"active":""} onClick={()=>setWeb(!web)}><Globe size={16}/> Web</button><button type="button"><Paperclip size={16}/> File</button><button className="send" disabled={busy}><Send size={17}/></button></div>
 </form>
}
