import { Link } from "react-router-dom"
import "../Styles/gameStyles/pauseMenu.css"

export interface PauseProps{
  resume: () => void,
  restart: () => void,
}

export const PauseModal = ({resume, restart}: PauseProps) => {

  return (
    <div className="overlay">
      <div className="pause-container">
        <div className="pause-card">
          <h1>PAUSE</h1>
          <div onClick={()=> resume()} className="pause-btn">CONTINUE GAME</div>
          <div onClick={()=> restart()} className="pause-btn">RESTART</div>
          <Link onClick={()=> restart()} to={`/Connect-4`} className="pause-btn quit">QUIT GAME</Link>
        </div>
      </div>
    </div>
  )
}