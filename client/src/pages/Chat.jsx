import {useEffect,useState} from "react"; import api from "../services/api"; import ChatMessage from "../components/ChatMessage"; import ChatInput from "../components/ChatInput"; import Loading from "../components/Loading"; import {useChatContext} from "../context/ChatContext";
export default function Chat(){
 const {conversationId,setConversationId}=useChatContext(); const [messages,setMessages]=useState([]);const [busy,setBusy]=useState(false);
 useEffect(()=>{if(!conversationId)setMessages([])},[conversationId]);
 async function send(message,useWeb){setBusy(true);setMessages(m=>[...m,{role:"user",content:message}]);try{const {data}=await api.post("/chat",{message,conversationId,useWeb});setConversationId(data.conversationId);setMessages(m=>[...m,data.message])}catch(e){setMessages(m=>[...m,{role:"assistant",content:e.response?.data?.message||"Something went wrong."}])}finally{setBusy(false)}}
 return <div className="chatpage"><div className="chatmessages">{messages.length===0?<div className="empty"><div className="orb">✦</div><h1>What can I help you with?</h1><p>Ask a question, turn on Web for current information, or start a new conversation.</p></div>:messages.map((m,i)=><ChatMessage key={m.id||i} message={m}/>)}{busy&&<Loading text="Thinking..."/>}</div><ChatInput onSend={send} busy={busy}/></div>
}
