import Victory from "@/assets/victory.svg";
import Background from "@/assets/login2.png";
import { Tabs } from "@radix-ui/react-tabs";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
import * as Yup from 'yup';



// Yup validation schema for login
const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one digit')
    .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
});

// Yup validation schema for signup
const signupSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one digit')
    .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
  
  ,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const Auth = () => {
  const navigate = useNavigate()
  const {setUserInfo} = useAppStore()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // const validateLogin = () => {
  //   if(!email) {
  //     toast.error("Email is required")
  //     return false;
  //   }
  //   if(!password) {
  //     toast.error("Password is required");
  //     return false;
  //   }
  //   return true;
  // }

  const validateLogin = async () => {
    await loginSchema.validate({email, password})
    .then( () => {
      return true
    })
    .catch((err)=>{
      
        toast.error(`${err.message}`)
        return false
    })
  }

  const validateSignup = async()=> {
    await signupSchema.validate({email,password,confirmPassword, })
    .then( () => {
      return true
    })
    .catch((err)=>{
      console.log("true");
      
        toast.error(`${err.message}`)
        return false
    })
  }

  // const validateSignup =()=> {
  //   if( !email.length){
  //     toast.error("Email is required.");
  //     return false;
  //   }

  //   if( !password.length){
  //     toast.error("Password is required.");
  //     return false;
  //   }

  //   if(password ===! confirmPassword){
  //     toast.error("Password and confirm Password should match");
  //     return false;
  //   }
  //   return true
  // }

  // const handleLogin = async () => {
  //   if(validateLogin()){
  //    console.log("hello")
  //    const response = await apiClient.post(
  //      LOGIN_ROUTE,
  //      { email, password },
  //      { withCredentials:true}
  //    );
  //    if(response.data.user.id){
  //      setUserInfo(response.data.user)
  //      if(response.data.user.profileSetup) navigate('/chat');
  //      else navigate('/profile');
  //    }    
  //   }
  //  }

   const handleLogin = async () => {

    if(validateLogin()){
     const response = await apiClient.post(
       LOGIN_ROUTE,
       { email, password },
       { withCredentials:true}
     );
     if(response.data.user.id){
       setUserInfo(response.data.user)
       if(response.data.user.profileSetup) navigate('/chat');
       else navigate('/profile');
     }    
    }
   }

  const handleSignup = async () => {
    try {
      if(validateSignup()){
    const response = await apiClient.post(SIGNUP_ROUTE,{email, password},{ withCredentials: true})
        console.log(response)
        if(response.status === 201){
      setUserInfo(response.data.user)
          navigate('/profile')
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center">
      <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 ">
        <div className="flex items-center justify-center flex-col">
          <div className="flex items-center justify-center">
            <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
            <img src={Victory} alt="Victory Emoji" className="h-[100px]" />
          </div>
          <p className="font-medium text-center ">
            Fill in the details to get started with the best chat app!
          </p>
          <div className="flex items-center justify-center w-full">
          <Tabs className="w-3/4" defaultValue="login">
            <TabsList className="bg-transparent rounded-none w-full">
              <TabsTrigger 
                value="login"
                className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all du300"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"  
              >
                Signup
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="flex flex-col gap-5 mt-10" >
              <Input
                placeholder="Email"
                type="email"
                className="rounded-full p-6"
                value={email}
                onChange={e=>setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="rounded-full p-6"
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
              />
              <Button className="rounded-full p-6" onClick={handleLogin}>Login</Button>
            </TabsContent>
            <TabsContent value="signup" className="flex flex-col gap-5 ">
            <Input
                placeholder="Email"
                type="email"
                className="rounded-full p-6"
                value={email}
                onChange={e=>setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                className="rounded-full p-6"
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
              />
              <Input
                placeholder="Confirm Password"
                type="password"
                className="rounded-full p-6"
                value={confirmPassword}
                onChange={(e)=> setConfirmPassword(e.target.value)}
              />
              <Button className="rounded-full p-6" onClick={handleSignup}>Signup</Button>
            </TabsContent>
          </Tabs>
        </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background} alt="background logo" className="h-[500px]" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
