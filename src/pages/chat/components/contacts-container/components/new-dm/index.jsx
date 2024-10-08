import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/components/ui/multipleSelect";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { apiClient } from "@/lib/api-client";
import {  getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST, SEARCH_CONTACTS_ROUTES } from "@/utils/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Lottie from "react-lottie";

const NewDM = () => {
  const { setSelectedChatType, setSelectedChatData } = useAppStore();
  const [openNewContactModal, setOpenContactModal] = useState(false);
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [search, setSearch] = useState('')
  const debounceSearch = useDebounce(search);

  const selectNewContact = (contact) => {
    setOpenContactModal(false);
    setSelectedChatType("contact")
    console.log("contact : ",contact)
    setSelectedChatData(contact)
    setSearchedContacts([]);
  }
  // const searchContacts = async (searchTerm) => {
  //   try {
  //     if (searchTerm.length > 0) {
  //       const response = await apiClient.post(
  //         SEARCH_CONTACTS_ROUTES,
  //         { searchTerm },
  //         { withCredentials: true }
  //       );
  //       if (response.status === 200 && response.data.contacts) {
  //         setSearchedContacts(response.data.contacts);
  //       }
  //     } else {
  //       setSearchedContacts([]);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(()=>{
    const searchContacts = async () => {
      try {
        if(search.length > 0){
          const response = await apiClient.post(
            SEARCH_CONTACTS_ROUTES,
            {searchTerm:debounceSearch},
            {withCredentials:true}
          );
          if(response.status === 200 && response.data.contacts){
            setSearchedContacts(response.data.contacts);
          }else{
            setSearchedContacts([]);
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    searchContacts()
  },[debounceSearch])
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300"
              onClick={() => setOpenContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white ">
            Select New Contack
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModal} onOpenChange={setOpenContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white sm:w-[400px] w-[300px] h-[400px] flex flex-col ">
          <DialogHeader>
            <DialogTitle>Please Select a contact</DialogTitle>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contacts"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              // onChange={(e) => searchContacts(e.target.value)}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[250px]">
            <div className="flex flex-col gap-5">
              {searchedContacts.map((contact) => (
                <div
                  key={contact._id}
                  className="flex gap-3 items-center cursor-pointer"
                  onClick={()=>selectNewContact(contact)}
                >
                  <div className="w-12 h-12 relative flex flex-row gap-2">
                    <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                      {contact.image ? (
                        <AvatarImage
                          src={contact.image}
                          // src={`${HOST}/${contact.image}`}
                          alt="profile"
                          className="object-cover w-full h-full bg-black"
                        />
                      ) : (
                            <div
                              className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full cursor-pointer ${getColor(
                                contact.color
                              )}`}
                            >
                              {contact.firstName
                                ? contact.firstName.split("").shift()
                                : contact.email.split("").shift()}
                            </div>
                          )}
                    </Avatar>
                    <div className="flex flex-col">
                      <span>
                        {contact.firstName && contact.lastName
                          ? `${contact.firstName} ${contact.lastName}`
                          : contact.email}
                      </span>
                      <span className="text-xs">{contact.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          {searchedContacts.length <= 0 && (
            <div className="      duration-100 transition-all ">
             
              <div className="text-opacity-80 text-white flex flex-col items-center  lg:text-2xl text-xl transition-all duration-300 ">
                <h3 className="poppins-medium">
                  Hi<span className="text-purple-500">!</span> Search new
                  <span className="text-purple-500"> Contacts </span>
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
