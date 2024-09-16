import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";


const SocketContext = createContext(null);

const  useSocket = () => {
    return useContext(SocketContext);
}

// eslint-disable-next-line react/prop-types
export const SocketProvider = ({children}) => {

    const {userInfo} = useAppStore()
    const socket = useRef();

    useEffect(()=> {
        if ( userInfo ){
            socket.current = io(HOST, {
                withCredentials: true,
                query: {userId: userInfo.id}
            });
            socket.current.on("connect", () => {
                console.log("connected to socket server.")
            });
            
            const handleRecieveMessage = ( message ) => {
                const { selectedChatData, selectedChatType, addMessage, addContactsInDMContacts} = useAppStore.getState();
                console.log("recieved message :>",message)


                if (
                    selectedChatType != undefined &&
                    (selectedChatData._id === message.sender._id ||
                        selectedChatData._id === message.recipient._id)
                ){
                    addMessage(message);
                }
                addContactsInDMContacts(message)
            };

            const handleRecieveChannelMessage = (message) => {
                const {selectedChatData, selectedChatType, addMessage, addChannelInChannelList} = useAppStore.getState();

                if( 
                    selectedChatType !== undefined &&
                    selectedChatData._id === message.channelId
                ){
                    addMessage(message);
                }
                addChannelInChannelList(message)
            }

            socket.current.on("recieveMessage",handleRecieveMessage);
            socket.current.on("recieve-channel-message",handleRecieveChannelMessage)

            return () => {
            socket.current.disconnect();
        }
        }

        
    },[userInfo])
    return <SocketContext.Provider value={socket.current}>
        {children}
    </SocketContext.Provider>
}

export default useSocket