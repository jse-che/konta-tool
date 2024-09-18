import "./ContentTop.css"
import { useContext } from "react"
import { SidebarContext } from "../../Context/sidebarContext"
import { iconsImgs } from "../../utils/images"

const ContentTop = () => {
    const { toggleSidebar } = useContext(SidebarContext)
  return (
    <div className="main-content-top">
        <div className="content-top-left">
            <button type="button" className="sidebar-toggle" onClick={() => toggleSidebar()}
            >
                <img src={iconsImgs.menu} />
            </button>
            <h3 className="content-top-title">Inicio</h3>
        </div>
        <div className="content-top-btns">
            <button className="notification-btn content-top-btn">
                <img src={iconsImgs.bell} />
                <span className="notification-btn-dot"></span>
            </button>
        </div>
    </div>
  )
}

export default ContentTop