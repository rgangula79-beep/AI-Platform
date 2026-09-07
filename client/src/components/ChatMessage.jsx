export default function ChatMessage({message}){
 return <div className={`msg ${message.role}`}>
  <div className="msgrole">{message.role==="user"?"You":"AI"}</div>
  <div className="msgbody">{message.content}</div>
  {message.sources?.length>0 && <div className="sources">{message.sources.map((s,i)=><a key={i} href={s.url} target="_blank" rel="noreferrer">{s.title||s.url}</a>)}</div>}
 </div>
}
