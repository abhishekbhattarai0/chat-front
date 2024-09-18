import  useSocket  from "@/context/socketContext"
import { apiClient } from "@/lib/api-client"
import { useAppStore } from "@/store"
import { UPLOAD_FILE_ROUTE } from "@/utils/constants"
import EmojiPicker from "emoji-picker-react"
import { useEffect, useRef, useState } from "react"
import { GrAttachment } from "react-icons/gr"
import { IoSend } from "react-icons/io5"
import { RiEmojiStickerLine } from "react-icons/ri"

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const { selectedChatType, selectedChatData , userInfo, setIsUploading, setFileUploadProgress} = useAppStore();
  const socket = useSocket()
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

  useEffect( ()=> {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  } ,[emojiRef])
  const handleAddEmoji = (emoji) => {
    setMessage( (msg) => msg + emoji.emoji)
  }

  const handleSendMessage = async () => {
   
    if(selectedChatType === "contact"){
      socket.emit("sendMessage",{
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined
      })

      
    }else if (selectedChatType === "channel"){
      socket.emit("send-channel-message", {
        sender: userInfo.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      });
    }
    setMessage("");
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const handleAttachmentChange = async(event) => {
    try {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      setIsUploading(true);
      setFileUploadProgress(0);
      const response = await apiClient.post(
        UPLOAD_FILE_ROUTE,
        formData,
        {
          withCredentials: true,
          onUploadProgress: (data)=> { console.log("uploading data",data)
            setFileUploadProgress(Math.round((100 * data.loaded)/data.total))
          }
        },
      );
      setIsUploading(false)
      if (response.status === 200 && response.data) {
        if(selectedChatType === "contact"){
         socket.emit("sendMessage", {
            sender: userInfo.id,
            content: undefined,
            recipient: selectedChatData._id,
            messageType: "file",
            fileUrl: response.data.filePath
          });
        } else if (selectedChatType === "channel"){
          socket.emit("send-channel-message", {
            sender: userInfo.id,
            content: undefined,
            messageType: "file",
            fileUrl: response.data.filePath,
            channelId: selectedChatData._id
          });
          
        }
      }
      console.log(file, "response", response)
    } catch (error) {
      setIsUploading(false)
      console.log({error})
    }
  }
  return (
    <div className="h-[10vh]    bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6 ">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center sm:gap-5 gap-2 pr-5 ">
        <input
          type="text" 
          className="flex-1 sm:p-5 p-3 pl-1 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={(e)=>{
            if( e.key === "Enter"){
              handleSendMessage()
            }
          }}
        />
        <button 
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white durarion-300 transition-all "
          onClick={handleAttachmentClick}  
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />
        <div className="relative">
        <button 
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white durarion-300 transition-all "
          onClick={()=> setEmojiPickerOpen(true)}
        >
          <RiEmojiStickerLine className="text-2xl" />
        </button>
        <div className="absolute bottom-16 right-0 " ref={emojiRef}>
          <EmojiPicker 
            theme="dark" 
            open={emojiPickerOpen} 
            onEmojiClick={handleAddEmoji}
            autoFocusSearch={false}
          />
        </div>
        </div>
      </div>
      <button 
        className="bg-[#8417ff] items-center rounded-md justify-center sm:p-5 p-3 pr-1 focus:border-none focus:outline-none hover:bg-[#741bda] focus:text-white focus:bg-[#741bda] durarion-300 transition-all "
        onClick={handleSendMessage}
        
      >
          <IoSend className="text-2xl" />
      </button>
    </div>
  )
}

export default MessageBar