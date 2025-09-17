import React, { useRef, useState, useEffect, useContext } from 'react';
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
import { Context } from '../Router/Router';


function SideBar() {
    const { globalUser, setGlobalUser, globalWorkspace, setGlobalWorkspace } = useContext(Context);
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
    const [userProjects, setUserProjects] = useState([]);
    const [menu, setMenu] = useState(
        [{
            id: "1",
            name: "Home",
            route: "/",
            icon: () => <HomeIcon className="h-6 w-6 text-gray-500" style={{ width: '20px', height: '20px' }} />
        },
        {
            id: "2",
            name: "Projects",
            icon: () => <BriefcaseIcon className="h-6 w-6 text-gray-500" style={{ width: '20px', height: '20px' }} />,
            children: []

        }]
    );

    const [token, setToken] = useState(() => {
        let localAT = localStorage.getItem("aT");
        if (localAT == null) {
            navigate("/login");
        } else {
            return localAT;
        }
    });
    const [user, setUser] = useState(() => {
        let arrayToken = "";
        let tokenPayload = {};
        //console.log("token listo", token);
        if (token != null) {
            arrayToken = token.split('.');
            tokenPayload = JSON.parse(atob(arrayToken[1]));
            return tokenPayload;
        }
        navigate("/login");
    });

    const [selectedWorkspace, setSelectedWorkspace] = useState();
    useEffect(() => {

        setGlobalUser(user);
        AuthRequest(`WEnvironment/getWEnvironments`, 'get').
            then((res) => {
                //setWEnvironments(res.data.data);
                //let workSpcLocal = JSON.parse(localStorage.getItem("worksp")).id;
                console.log(localStorage.getItem("worksp"), "workSpcLocal")
                if (!localStorage.getItem("worksp") || localStorage.getItem("worksp") == undefined) {
                    //setSelectedWorkspace(res.data.data[0])
                    //console.log(selectedWorkspace);
                    console.log("setting worksapce");
                    //localStorage
                    //    .setItem(
                    //        "worksp",
                    //        JSON.stringify(res.data.data[0])
                    //    );
                }
                //console.log(workSpcLocal);
                //setSelectedWorkspace(workSpcLocal);
                //setGlobalWorkspace(workSpcLocal);
                console.log("setting global workspace")
                //setGlobalWorkspace(JSON.parse(localStorage.getItem("worksp")).id);
                setGlobalWorkspace(res.data.data[0].id);
                


            }).
            catch((err) => {
                console.error(err);
                if (err.status == 401) {
                    navigate("/login");

                }
            });
    }, []);

    useEffect(() => {
        setSideBarCurrentScrollHeight(sideBar.current.scrollHeight + "px");
    }, [sideBarCurrentScrollHeight]);

    useEffect(() => {
        try {
            if (globalWorkspace != null) {
                console.log(globalWorkspace, "GLOBAL WORKSPACE")
                //let parsedSelectWorkSpc = JSON.parse(globalWorkspace);
                //console.log(parsedSelectWorkSpc, "Sidebar selected workspace parsed");
                //console.log(selectedWorkspace, "Sidebar selected workspace");
                AuthRequest(`Project/getProjects?workspace=${globalWorkspace}`, 'get').
                    then((res) => {
                        //console.log(res);
                        const proj = res.data.data;
                        proj.map((project, i) => {
                            project.project_id = project.id;
                            project.route = `/project/${project.id}`
                            project.id = `p${i}`;
                        })
                        //console.log("projects obtenidos", proj)
                        setUserProjects(proj)

                    }).
                    catch((err) => {
                        //console.error(err.status);
                        if (err.status == 401) {
                            navigate("/login");
                        }
                    });
            }


        } catch (Exception) {
            console.error(Exception);
        }

    }, [globalWorkspace]);
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
        //localStorage.removeItem("aT");
        //localStorage.removeItem("rT");
        fetch("https://localhost:7233/auth/logout", {
            credentials: "include",
        })
            .then((res) => {
                //console.log("is authenticated")
                //setIsAuthenticated(res.ok);
                console.log(res, "response")
                //navigate("/login");
                window.location.href = "/login";
            })
            .catch((err) => {
                //console.log("is NOT authenticated")
                //setIsAuthenticated(false);
                console.log(err, "response")

            });
    }

    useEffect(() => {
        setMenu(
            prev => {
                const newMenu = prev.map(item => {
                    if (item.id === "2") {
                        return { ...item, children: [...userProjects] };
                    }
                    return item;
                });
                return [...newMenu];
            }
        );
        //console.log("userProjects cargado:", menu);

    }, [userProjects]);

    useEffect(() => {
        //console.log("menu actualizado:", menu);
    }, [menu]);

    function Node({ node, style, dragHandle }) {
        const hasChildren = node.isInternal;
        const isChild = node.level > 0;
        //console.log(node.data.name, node.data.route);
        //console.log(node.data.name, isChild);

        //console.log("icon", node.data.icon)
        const handleClick = () => {

            if (hasChildren && userProjects.length > 0) {
                node.toggle(); // Abre o cierra el nodo si tiene hijos
            }

        };

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
                            {hasChildren && userProjects.length > 0 &&
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
        //<Context.Provider value={{ user, setUser }} >


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
                        <Tree data={menu}
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
        //</Context.Provider>
    );
}

export default SideBar;