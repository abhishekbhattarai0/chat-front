import { useAppStore } from "@/store"
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5"
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import {FaTrash, FaPlus} from "react-icons/fa"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from "@/utils/constants";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore()
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null)

  useEffect(()=> {
    setFirstName(userInfo.firstName);
    setLastName(userInfo.lastName);
    setSelectedColor(userInfo.color)
    if(userInfo.image){
      console.log(HOST,userInfo)
      setImage(`${HOST}/${userInfo.image}`)
    }
  },[userInfo])
  
  const validateProfile = () => {
    if(!firstName){
      toast.error("firstname is required.");
      return false;
    }
    if(!lastName){
      toast.error("lastName is required.");
      return false;
    }
    return true;
  }
  const saveChanges = async() => {
    if(validateProfile()){
      try {
        console.log("first")
        const response = await apiClient.post(UPDATE_PROFILE_ROUTE,
          {firstName, lastName, color: selectedColor},
          {withCredentials:true}
        );
        console.log(response)
        if(response.status == 200 && response.data ){
          setUserInfo({...response.data});
          toast.success("User profile setup successfully.");
          navigate("/chat")
        }
      } catch (error) {
          console.log(error)
      }
    }
  }

  const handleNavigate = () => {
    if(userInfo.profileSetup){
      navigate("/chat");
    }else{
    toast.error("Please setup Profile")
    }
  }

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  }

  const handleImageChange = async(e) => {
    const file = e.target.files[0];
    if(file){
      const formdata = new FormData()
      formdata.append("profile-image", file);
      const response = await apiClient.post(
        ADD_PROFILE_IMAGE_ROUTE,
        formdata,
        {withCredentials:true}
      );
      if(response.status == 200 && response.data.image){
        console.log(response)
        console.log(response.data.image)
        setUserInfo({...userInfo,image:response.data.image});
        toast.success("Image updated Successfully");
      }

    }
  }
  const handleDeleteImage = async() => {
    try {
      const response = await apiClient.delete(
        REMOVE_PROFILE_IMAGE_ROUTE,
        {withCredentials:true}
      );
      if(response.status === 200){
        setUserInfo({...userInfo,image:null})
        toast.success("Profile image removed successfully.")
        setImage(null)
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-mx">
        <div>
          <IoArrowBack onClick={handleNavigate} className="text-4xl lg:text-6xl text-white/90 cursor-pointer"/>
        </div>
        <div className="grid grid-cols-2">
          <div className="h-full w-32 md:w-48 relative flex items-center justify-center"
          onMouseEnter={()=> setHovered(true)}
          onMouseLeave={()=> setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 rounded-full overflow-hidden">
              {
                image? (
                  <AvatarImage 
                    src={image} 
                    alt="profile" 
                    className="object-cover w-full h-full bg-black" 
                  />
                ): (
                  <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>
                    {firstName
                      ? firstName.split("").shift()
                      : userInfo.email.split("").shift()}
                  </div>
                )
              }
            </Avatar>
            { 
              hovered && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full cursor-pointer"
                  onClick={image ? handleDeleteImage : handleFileInputClick}
                >
                  {
                    image ? <FaTrash className="text-white text-3xl cursor-pointer" /> : <FaPlus className="text-white text-3xl cursor-pointer"/>
                  } 
                  </div>
              )
            }
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleImageChange} 
              name='profile-image' 
              accept=".png ,.jpg ,.jepg, .svg, .webp" 
            />
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center  justify-center">
          <div className="w-full">
            <Input 
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none "
              />
          </div>
          <div className="w-full">
            <Input 
              placeholder="First Name"
              type="name"
              onChange={(e)=> setFirstName(e.target.value)}
              value={firstName}
              className="rounded-lg p-6 bg-[#2c2e3b] border-none "
            />
          </div>
          <div className="w-full">
            <Input 
                placeholder="Last Name"
                type="email"
                onChange={e => setLastName(e.target.value)}
                value={lastName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none "
            />
          </div>
          <div className="w-full flex gap-5">
            {colors.map( (color, index) => (
              <div
              className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                selectedColor === index ? "outline outline-white/50 outline-1" : ""
              }`}
              key={index}
              onClick={()=> setSelectedColor(index)}
              ></div>
            ))}
          </div>
          </div>
        </div>
        <div className="w-full">
            <Button 
              className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
              onClick={saveChanges}
            >Save changes</Button>
        </div>
      </div>
    </div>
  )
}

export default Profile