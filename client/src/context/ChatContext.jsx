import {createContext,useContext,useState} from "react";
const ChatContext=createContext(null);
export function ChatProvider({children}){
  const [conversationId,setConversationId]=useState(null);
  return <ChatContext.Provider value={{conversationId,setConversationId}}>{children}</ChatContext.Provider>
}
export const useChatContext=()=>useContext(ChatContext);
