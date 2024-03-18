import { useEffect, useRef, useState } from "react"
import Client from "../Components/Client"
import Editor from "../Components/Editor"
import { initSocket } from "../socket"
import ACTIONS from "../../Actions"
import { Navigate, useLocation,useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"

const EditorPage = () => {

    const handleError = (e) => {
        console.log('socket error',e);
        toast.error('Socket connection failed try again later')
        reactNavigator('/')
    }

    //Socket connection
    const reactNavigator = useNavigate();
    const socketRef = useRef(null)
    const location = useLocation()
    const {roomId} = useParams()
    const [clients,setClients] = useState([])
    useEffect(()=>{
        const init = async () => {
            try {
                socketRef.current = await initSocket()
                socketRef.current.on('connection_error',(err)=>handleError(err))
                socketRef.current.on('connection_failed',(err)=>handleError(err))
                socketRef.current.emit(ACTIONS.JOIN,{
                    roomId,
                    username:location.state?.username,
                })
                socketRef.current.on(ACTIONS.JOINED,({clients,username,socketId})=>{
                    if(username !== location.state?.username){
                        toast.success(`${username} joined the room`)
                    }
                    setClients(clients)
                })
            } catch (error) {
                console.error('Error initializing socket:', error);
            }
        }
        init();
    },[])


    if(!location.state){
        return <Navigate to='/' />
    }
  return (
    <div className="mainWrap h-[100vh]">
        <div className="aside bg-[#1c1e29] p-4 text-white flex flex-col">
            <div className="asideInner flex-1">
                <div className="logo">
                    <img src="/er.png" alt="" className="logoImage h-[60px] mb-3" />
                </div>
                <h3>Connected Members</h3>
                <div className="clientsList flex items-center flex-wrap gap-5 mt-5">
                    {
                        clients.map((client) => <Client key={client.scoketId} username={client.username}/>)
                    }
                </div>
            </div>
            <button className="btn copyBtn font-bold bg-white text-black">Copy Room ID</button>
            <button className="btn leaveBtn mt-5 font-bold bg-[#4aed88] text-black hover:bg-[#2b824c]">Leave</button>
        </div>
        <div className="editorWrap bg-white">
            <Editor/>
        </div>
    </div>
  )
}

export default EditorPage

//2.38.00
//https://www.youtube-nocookie.com/embed/jOv8jb6rCU0?playlist=jOv8jb6rCU0&autoplay=1&iv_load_policy=3&loop=1&start=