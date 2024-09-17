import { apiClient } from "@/lib/api-client"
import { useAppStore } from "@/store"
import { GET_ALL_MESSSAGES_ROUTE, GET_CHANNEL_MESSAGES, HOST } from "@/utils/constants"
import moment from "moment"
import { useEffect, useRef, useState } from "react"
import { MdFolderZip } from "react-icons/md"
import { IoMdArrowRoundDown } from 'react-icons/io'
import { IoCloseSharp } from "react-icons/io5"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getColor } from "@/lib/utils"

const MessageContainer = () => {
  const scrollRef = useRef()
  const { selectedChatType, selectedChatMessage,  selectedChatData, setSelectedChatMessage, setIsDownloading, setFileDownloadProgress, userInfo} = useAppStore();
  const [showImage, setShowImage ] = useState(false);
  const [imageUrl, setImageUrl ] = useState(null);

  useEffect(()=>{

    const getMessages = async() => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSSAGES_ROUTE, 
          {id: selectedChatData._id}, 
          { withCredentials: true}
        );

        console.log("get message")


        if( response.data.messages){
          setSelectedChatMessage(response.data.messages)
        }
      } catch (error) {
        console.log(error)
      }
    };
    
    const getChannelMessages = async() => {
      try {
        const response = await apiClient.get(
          `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessage(response.data.messages);
        }
      } catch (error) {
        console.log({error})
      }
    }

    if (selectedChatData._id) {
      if( selectedChatType === "contact") getMessages()
      else if(selectedChatType === "channel") getChannelMessages()
    }
  },[selectedChatData, selectedChatType, setSelectedChatMessage])

  useEffect( ()=> {
    if(scrollRef.current){
      scrollRef.current.scrollIntoView({ behaviour: "smooth"})
    }
  },[selectedChatMessage])


  const checkImage = (filePath) => {
    console.log("filePath::",filePath)
    const imageRegex = /\.(jpg|jpeg|png|gif|tiff|bmp|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  }

  const downloadFile = async(fileUrl) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const response = await apiClient.get(`${HOST}/${fileUrl}`,{
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentCompleted = Math.round((loaded * 100)/ total);
        setFileDownloadProgress(percentCompleted)
      }
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    console.log("Url blob:",urlBlob);
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", fileUrl.split("/").pop());
    document.body.appendChild(link)
    console.log("link::",link)
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
  }
  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessage.map( (message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={index}>
          {showDate && (<div className="text-center ">
            {console.log("first")}
            {moment(message.timestamp).format("LL")}
          </div>)}
          {
            selectedChatType === "contact" && renderedDMMessage(message)
          }
          {
            selectedChatType === "channel" && renderChannelMessages(message)
          }
        </div>
      )
    })
  };

  const renderedDMMessage = ( message ) => (
    <div className={`${
      message.sender === selectedChatData._id ? "text-left" : "text-right"} mx-4 my-4`}>
      { message.messageType === "text" && (
        <div 
          className={`${
            message.sender !== selectedChatData._id
            ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 " : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
          }  border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
            {message.content}
        </div> 
      )}  
      {
        message.messageType === "file" && <div 
        className={`${
          message.sender !== selectedChatData._id
          ? "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 " 
          : "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
        }  border inline-block p-4 rounded my-1 sm:max-w-[50%]   break-words`}
      >
           { checkImage(message.fileUrl) ? <div 
              className="cursor-pointer"
              onClick={()=>{
                setShowImage(true);
                setImageUrl(message.fileUrl);
              }}
            >
            <img
              src={`${HOST}/${message.fileUrl}`}
              height={300}
              width={300}
            />
           </div> : <div className="flex items-center justify-center gap-4">
              <span className="text-white/8- text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip/>
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span 
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={()=>downloadFile(message.fileUrl)}
              >
                <IoMdArrowRoundDown/>
              </span>
           </div> }         
      </div> 
      }
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
      
);

const renderChannelMessages = (message) => {
  return (
    <div
  className={`mt-5 mx-2 ${
    message.sender._id !== userInfo.id ? "text-left" : "text-right"
  }`}
    >
       
      { message.messageType === "text" && (
         <div
         className={`${
           message.sender._id === userInfo.id 
           ? "bg-[#8417ff]/20 text-[#8417ff]/90 border-[#8417ff]/50"
           : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
         } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
       >
         {message.content}
       </div>
      )}
      {
        message.messageType === "file" && <div 
        className={`${
          message.sender._id === userInfo._id
          ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 "
          : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 " 
          
        }  border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
      >
           { checkImage(message.fileUrl) ? (<div 
              className="cursor-pointer"
              onClick={()=>{
                setShowImage(true);
                setImageUrl(message.fileUrl);
              }}
            >
            <img
              src={`${HOST}/${message.fileUrl}`}
              height={300}
              width={300}
            />
           </div>) : <div className="flex items-center justify-center gap-4">
              <span className="text-white/8- text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip/>
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span 
                className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                onClick={()=>downloadFile(message.fileUrl)}
              >
                <IoMdArrowRoundDown/>
              </span>
           </div> }         
      </div> 
      }
      {
        message.sender._id !== userInfo.id ? <div className="flex items-center justify-start gap-3">
          <Avatar className="h-8 w-4  rounded-full overflow-hidden">
              {message.sender.image && (
                <AvatarImage
                  src={`${HOST}/${message.sender.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) } 
                <AvatarFallback
                  className={`uppercase h-4 w-4 mt-2 text-lg  flex items-center justify-center rounded-full cursor-pointer ${getColor(
                    message.sender.color
                  )}`}
                >
                  {message.sender.firstName
                    ? message.sender.firstName.split("").shift()
                    : message.sender.email.split("").shift()}
                </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>
            <span className="text-xs text-white/60">
                    {moment(message.timestamp).format("LT")}
            </span>
        </div>: (
          <div className="text-xs text-white/60 mt-1">
            {moment(message.timestamp).format("LT")}
          </div>
        )
      }
    </div>
   
  )
}

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full ">
      {renderMessages()}
      <div ref={scrollRef}></div>
      {
        showImage &&( 
        <div className="fixed z-[1000] top-2 left-0 h-[100vh] w-[100vw] flex items-center backdrop-blur-lg justify-center ">
          <div>
            <img 
              src={`${HOST}/${imageUrl}`}  
              className="h-[80vh] w-full bg-cover "
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-1 ">
          <button
              className="text-white/8- text-3xl bg-black/20 rounded-full p-3"
              onClick={() => downloadFile(imageUrl)}
            >
              <IoMdArrowRoundDown/>
            </button>
            <button
              className="text-white/8- text-3xl bg-black/20 rounded-full p-3"
              onClick={() =>{
                setShowImage(false);
                setImageUrl(null);
              }}
            >
              <IoCloseSharp/>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessageContainer