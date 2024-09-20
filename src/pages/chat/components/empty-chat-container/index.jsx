const EmptyChatContainer = () => {
  return (
    <div className=" flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center items-center hidden duration-100 transition-all ">
      
      <div className="text-opacity-80 text-white flex flex-col  items-center mt-10 lg:text-4xl text-3xl transition-all duration-300 text-center">
        <h3 className="poppins-medium">
          <div className=" text-4xl mb-4">Hi<span className="text-purple-500">!</span> </div>
          <div>Welcome to</div>
          <span className="text-purple-500"> Syncronus </span> Chat App<span className="text-purple-500">.</span>
        </h3>
      </div>
    </div>
  )
}

export default EmptyChatContainer