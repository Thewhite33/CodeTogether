import { BrowserRouter,Routes,Route } from "react-router-dom"
import Home from "./pages/Home"
import EditorPage from "./pages/EditorPage"
import { Toaster } from "react-hot-toast"

const App = () => {
  return (
    <div>
      <div>
        <Toaster position="top-center" toastOptions={{
          success:{
            theme:{
              primary:'#4aed88'
            }
          }
        }}/>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/editor/:roomId" element={<EditorPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

