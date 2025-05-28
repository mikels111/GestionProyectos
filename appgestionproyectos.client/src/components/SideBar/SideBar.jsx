import React, { useRef, useState, useEffect } from 'react';
import { AuthRequest } from '../../Utils/Authorization';
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
    HomeIcon,
    ChevronDownIcon
} from '@heroicons/react/16/solid'
import { useNavigate, NavLink } from 'react-router-dom';
import styles from './SideBar.module.css'
import { Tree } from 'react-arborist';



function SideBar({ user, workspace }) {
    const navigate = useNavigate();

    let fullSidebarHeight = "calc(100vh - 32px)";
    let classes = [styles.sidebar];
    const sideBar = useRef();
    const [sideBarClasses, setSideBarClasses] = useState([styles.sidebar]);
    const [sideBarActive, setSideBarActive] = useState(true);
    const [menuActive, setMenuActive] = useState(true);
    const [sideBarStyles, setSideBarStyles] = useState({ height: fullSidebarHeight });
    const [sideBarCurrentScrollHeight, setSideBarCurrentScrollHeight] = useState(null);
    const [windowSize, setWindowSize] = useState();
    const [userProjects, setUserProjects] = useState();
    useEffect(() => {
        setSideBarCurrentScrollHeight(sideBar.current.scrollHeight + "px");
    }, [sideBarCurrentScrollHeight]);
    useEffect(() => {
        try {
            console.log(workspace, "selected workspace");
            AuthRequest(`Project/getProjects?fields=${user.sub}&workspace=${workspace}`, 'get').
                then((res) => {
                    


                }).
                catch((err) => {
                    console.error(err.status);
                    if (err.status == 401) {
                        navigate("/login");
                    }
                });

        } catch (Exception) {
            console.error(Exception);
        }

    }, [workspace]);
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

    const data = [
        {
            id: "1",
            name: "Home",
            route: "/",
            icon: () => <HomeIcon className="h-6 w-6 text-gray-500" style={{ width: '20px', height: '20px' }} />
        },
        {
            id: "2",
            name: "Projects",
            icon: () => <BriefcaseIcon className="h-6 w-6 text-gray-500" style={{ width: '20px', height: '20px' }} />,
            children: userProjects
            //children: [
            //    {
            //        id: "c1",
            //        name: "General",
            //        route: "/project"
            //    },
            //    {
            //        id: "c2",
            //        name: "Random",
            //        route: "/project"
            //    },
            //    {
            //        id: "c3",
            //        name: "Open Source Projects",
            //        route: "/project"
            //    }
            //]
        }
    ];
    function Node({ node, style, dragHandle }) {
        const hasChildren = node.isInternal;
        const isChild = node.level > 0;
        //console.log(node.data.name, node.data.route);
        //console.log(node.data.name, isChild);

        //console.log("icon", node.data.icon)
        const handleClick = () => {

            if (hasChildren) {
                node.toggle(); // Abre o cierra el nodo si tiene hijos
            }

        };
        /* This node instance can do many things. See the API reference. */
        return (
            //<div style={style}>

            <li style={style} className={styles['nav-item']}>
                {node.data.route ?
                    <NavLink to={node.data.route} className={({ isActive, isPending }) =>
                        isActive && !isChild ? [styles['nav-link'], styles.active].join(' ') : styles['nav-link']
                    } onClick={() => { if (windowSize <= 768 && !hasChildren) { setSideBarActive(false) } }}>
                        <span className={[styles['nav-icon'], styles['material-symbols-rounded']].join(' ')}>
                            {node.data.icon?.()}
                        </span>

                        <span className={styles['nav-label']}>{node.data.name}</span>
                        <span className={styles["arrow-down"]}>
                            {hasChildren &&
                                <ChevronDownIcon className="h-6 w-6 text-gray-500" style={{ width: '20px', height: '20px' }} onClick={handleClick} />
                            }
                        </span>
                    </NavLink>
                    :
                    <div className={styles['nav-link']}>
                        <span className={[styles['nav-icon'], styles['material-symbols-rounded']].join(' ')}>
                            {node.data.icon?.()}
                        </span>

                        <span className={styles['nav-label']}>{node.data.name}</span>
                        <span className={styles["arrow-down"]}>
                            {hasChildren &&
                                <ChevronDownIcon className="h-6 w-6 text-gray-500" style={{ width: '20px', height: '20px' }} onClick={handleClick} />
                            }
                        </span>
                    </div>
                }

            </li>
            //</div>

        );
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
                        <Tree initialData={data}
                            openByDefault={false}
                            width={"inherit"}
                            height={300}
                            indent={50}
                            rowHeight={50}
                            overscanCount={1}>
                            {Node}
                        </Tree>

                        {/*<li className={styles['nav-item']}>*/}
                        {/*    <NavLink to="/" className={({ isActive, isPending }) =>*/}
                        {/*        isActive ? [styles['nav-link'], styles.active].join(' ') : styles['nav-link']*/}
                        {/*    } onClick={() => { if (windowSize <= 768) { setSideBarActive(false) } }}>*/}
                        {/*        */}{/*<a href="#" >*/}
                        {/*        <span className={[styles['nav-icon'], styles['material-symbols-rounded']].join(' ')}>*/}
                        {/*            <HomeIcon className="h-6 w-6 text-gray-500" style={{ width: '20px', height: '20px' }} />*/}
                        {/*        </span>*/}
                        {/*        <span className={styles['nav-label']}>Home</span>*/}
                        {/*        */}{/*</a>*/}
                        {/*    </NavLink>*/}
                        {/*    <span className={styles['nav-tooltip']}>Home</span>*/}
                        {/*</li>*/}
                        {/*<li className={styles['nav-item']}>*/}
                        {/*    <a href="#" className={styles['nav-link']}>*/}
                        {/*        <span className={[styles['nav-icon'], styles['material-symbols-rounded']].join(' ')}>*/}

                        {/*            <BriefcaseIcon className="h-6 w-6 text-gray-500" style={{ width: '20px', height: '20px' }} />*/}
                        {/*        </span>*/}
                        {/*        <span className={styles['nav-label']}>Projects</span>*/}
                        {/*    </a>*/}
                        {/*    <span className={styles['nav-tooltip']}>Projects</span>*/}
                        {/*</li>*/}
                    </ul>

                    {/*Secondary bottom nav*/}
                    <ul className={[styles['nav-list'], styles['secondary-nav']].join(' ')}>
                        <hr className="dashed" />
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