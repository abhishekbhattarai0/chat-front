import { Skeleton } from '@/components/ui/skeleton';

const Loader = () => {
    return (
        <Skeleton className="w-[100vw] h-[100vh] flex items-center justify-center">
        <Skeleton className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 ">
          <Skeleton className="flex items-center justify-center flex-col">
            <Skeleton className="flex items-center justify-center">
              <Skeleton  className="h-[100px]" />
            </Skeleton>
            <Skeleton className="font-medium text-center h-2 ">
              
            </Skeleton>
            <Skeleton className="flex items-center justify-center w-full">
            <Skeleton className="w-3/4" >
              <Skeleton className="bg-transparent rounded-none w-full">
                <Skeleton 
                  className="h-2 data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all du300"
                >
                </Skeleton>
                
              </Skeleton>
              <Skeleton value="login" className="flex flex-col gap-5 mt-10" >
                <Skeleton 
                className="rounded-full p-6"
                ></Skeleton>
                <Skeleton
                  className="rounded-full p-6"
                />
                <Skeleton className="rounded-full p-6" ></Skeleton>
              </Skeleton>
              
            </Skeleton>
          </Skeleton>
          </Skeleton>
          <Skeleton className="hidden xl:flex justify-center items-center h-2">
            
          </Skeleton>
        </Skeleton>
      </Skeleton>
    )
};


export default Loader