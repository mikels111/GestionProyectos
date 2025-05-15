import React, { useRef, useState, useEffect } from 'react';
import {
    BeakerIcon,
    Squares2X2Icon,
    ArrowLeftCircleIcon,
    Bars3Icon,
    UserIcon,
    ArrowRightStartOnRectangleIcon,
    Cog6ToothIcon,
    BriefcaseIcon,
    RectangleGroupIcon,
    Bars3BottomLeftIcon,
    HomeIcon
} from '@heroicons/react/16/solid'
import { useNavigate, NavLink } from 'react-router-dom';
import styles from './SideBar.module.css'
function SideBar({ }) {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    let fullSidebarHeight = "calc(100vh - 32px)";
    let classes = [styles.sidebar];
    const sideBar = useRef();
    const [sideBarClasses, setSideBarClasses] = useState([styles.sidebar]);
    const [sideBarActive, setSideBarActive] = useState(true);
    const [menuActive, setMenuActive] = useState(true);
    const [sideBarStyles, setSideBarStyles] = useState({ height: fullSidebarHeight });
    const [sideBarCurrentScrollHeight, setSideBarCurrentScrollHeight] = useState(null);
    useEffect(() => {
        setSideBarCurrentScrollHeight(sideBar.current.scrollHeight + "px");
    }, [sideBarCurrentScrollHeight]);
    const [windowSize, setWindowSize] = useState();
    useEffect(() => {
        const handleResize = () => {
            setWindowSize(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        // Llamada inicial (por si ya está en ese tamaño)
        handleResize();

        // Limpieza del listener
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (sideBarActive) {
            setSideBarClasses([styles.sidebar]);
        } else {
            setSideBarClasses([styles.sidebar, styles.collapsed].join(' '));
        }
    }, [sideBarActive]);
    const logout = () => {
        localStorage.removeItem("aT");
        localStorage.removeItem("rT");
        navigate("/login");
    }

    return (
        <React.Fragment>
            <aside className={sideBarClasses} ref={sideBar} style={sideBarStyles}>
                {/*Sidebar header */}
                <header className={styles['sidebar-header']}>
                    <a href="#" className={styles['header-logo']}>
                        <UserIcon className="h-6 w-6 text-gray-500" style={{ width: '20px', height: '20px', color: 'white' }} />

                    </a>
                    <button className={[styles.toggler, styles['sidebar-toggler']].join(' ')} onClick={() => { setSideBarActive(!sideBarActive) }}>
                        <React.Fragment>
                            <span className={styles['material-symbols-rounded']} >
                                <Bars3BottomLeftIcon className="h-6 w-6 text-gray-500" style={{ width: '15px', height: '15px' }} />
                            </span>
                        </React.Fragment>
                    </button>
                    <button className={[styles.toggler, styles['menu-toggler']].join(' ')} onClick={() => { setMenuActive(!menuActive) }}>
                        <span className={styles['material-symbols-rounded']}><Bars3Icon className="h-6 w-6 text-gray-500" style={{ width: '20px', height: '20px' }} /></span>
                    </button>
                </header>
                <nav className={styles['sidebar-nav']}>
                    {/*Primary top nav*/}
                    <ul className={[styles['nav-list'], styles['primary-nav']].join(' ')}>
                        <li className={styles['nav-item']}>
                            <NavLink to="/" className={({ isActive, isPending }) =>
                                isActive ? [styles['nav-link'], styles.active].join(' ') : styles['nav-link']
                            } onClick={() => { if (windowSize <= 768) { setSideBarActive(false) } }}>
                                {/*<a href="#" >*/}
                                <span className={[styles['nav-icon'], styles['material-symbols-rounded']].join(' ')}>
                                    <HomeIcon className="h-6 w-6 text-gray-500" style={{ width: '20px', height: '20px' }} />
                                </span>
                                <span className={styles['nav-label']}>Home</span>
                                {/*</a>*/}
                            </NavLink>
                            <span className={styles['nav-tooltip']}>Home</span>
                        </li>
                        <li className={styles['nav-item']}>
                            <NavLink to="/dashboard" className={({ isActive, isPending }) =>
                                isActive ? [styles['nav-link'], styles.active].join(' ') : styles['nav-link']  
                            }>
                                {/*<a href="#" >*/}
                                <span className={[styles['nav-icon'], styles['material-symbols-rounded']].join(' ')}>

                                    <RectangleGroupIcon className="h-6 w-6 text-gray-500" style={{ width: '20px', height: '20px' }} />

                                </span>
                                <span className={styles['nav-label']}>Dashboard</span>
                                {/*</a>*/}
                            </NavLink>
                            <span className={styles['nav-tooltip']}>Dashboard</span>
                        </li>
                        <li className={styles['nav-item']}>
                            <a href="#" className={styles['nav-link']}>
                                <span className={[styles['nav-icon'], styles['material-symbols-rounded']].join(' ')}>

                                    <BriefcaseIcon className="h-6 w-6 text-gray-500" style={{ width: '20px', height: '20px' }} />
                                </span>
                                <span className={styles['nav-label']}>Projects</span>
                            </a>
                            <span className={styles['nav-tooltip']}>Projects</span>
                        </li>
                    </ul>
                    {/*Secondary bottom nav*/}
                    <ul className={[styles['nav-list'], styles['secondary-nav']].join(' ')}>
                        <li className={styles['nav-item']}>
                            <a className={styles['nav-link']}>
                                <span className={[styles['nav-icon'], styles['material-symbols-rounded']].join(' ')}><Cog6ToothIcon className="h-6 w-6 text-gray-500" style={{ width: '20px', height: '20px' }} /></span>
                                <span className={styles['nav-label']}>Settings</span>
                            </a>
                            <span className={styles['nav-tooltip']}>Settings</span>
                        </li>
                        <li className={styles['nav-item']}>
                            <a className={styles['nav-link']} onClick={logout}>
                                <span className={[styles['nav-icon'], styles['material-symbols-rounded']].join(' ')}><ArrowRightStartOnRectangleIcon className="h-6 w-6 text-gray-500" style={{ width: '20px', height: '20px' }} /></span>
                                <span className={styles['nav-label']}>
                                    Logout
                                </span>
                            </a>
                            <span className={styles['nav-tooltip']}>Logout</span>
                        </li>
                    </ul>
                </nav>
            </aside>
        </React.Fragment>
    );
}

export default SideBar;