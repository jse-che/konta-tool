import "./Sidebar.css";
import { personsImgs } from "../../utils/images";
import { navigationLinks } from "../../data/data";
import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "../../Context/sidebarContext";


const Sidebar = () => {
    const [activeLinkIdx, setActiveLinkIdx] = useState(1);
    const [sidebarClass, setSidebarClass] = useState("");
    const { isSidebarOpen } = useContext(SidebarContext);

    useEffect(() => {
        if (isSidebarOpen) {
            setSidebarClass("sidebar-change");
        } else {
            setSidebarClass("");
        }
    }, [isSidebarOpen]);

    const handleLinkClick = (index) => {
        setActiveLinkIdx(index); 
    };

    return (
        <div className={`sidebar ${sidebarClass}`}>
            <div className="user-info">
                <div className="info-img img-fit-cover">
                    <img src={personsImgs.logo} alt="profile image" />
                </div>
            </div>
            <nav className="navigation">
                <ul className="nav-list">
                    {navigationLinks.map((navigationLink, index) => (
                        <li className="nav-item" key={navigationLink.id}>
                            <a
                                href="#"
                                className={`nav-link ${
                                    index === activeLinkIdx ? "active" : ""
                                }`}
                                onClick={() => handleLinkClick(index)}
                            >
                                <img
                                    src={navigationLink.image}
                                    className="nav-link-icon"
                                    alt={navigationLink.title}
                                />
                                <span className="nav-link-text">
                                    {navigationLink.title}
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;