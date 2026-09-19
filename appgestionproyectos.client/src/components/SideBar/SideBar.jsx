import React, { useRef, useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import {
    Bars3Icon,
    UserIcon,
    ArrowRightStartOnRectangleIcon,
    Cog6ToothIcon,
    Bars3BottomLeftIcon,
    ChevronDownIcon,
    PlusIcon,
    EllipsisHorizontalIcon
} from '@heroicons/react/16/solid'
import { useNavigate, NavLink } from 'react-router-dom';
import styles from './SideBar.module.css'
import { Tree } from 'react-arborist';
import { Context } from '../Router/Router';
import ProjectMenu from '../ProjectMenu/ProjectMenu';
import { MenuNodes } from '../../Utils/MenuNodes';
import { CreateProjectModal } from '../../components/CreateProjectModal/CreateProjectModal'
import { SidebarNode } from '../../components/SidebarNode/SidebarNode'

function SideBar() {
    const { globalWorkspace, globalUserProjects, sideBarActive, setSideBarActive } = useContext(Context);
    const navigate = useNavigate();

    let fullSidebarHeight = "calc(100vh - 1px)";
    let classes = [styles.sidebar];
    const sideBar = useRef();
    const [sideBarClasses, setSideBarClasses] = useState([styles.sidebar]);
    const [menuActive, setMenuActive] = useState(true);
    const [sideBarStyles, setSideBarStyles] = useState({ height: fullSidebarHeight });
    const [sideBarCurrentScrollHeight, setSideBarCurrentScrollHeight] = useState(null);
    const [windowSize, setWindowSize] = useState();
    const [userProjects, setUserProjects] = useState([]);
    const [menu, setMenu] = useState([]);


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
        if (token != null) {
            arrayToken = token.split('.');
            tokenPayload = JSON.parse(atob(arrayToken[1]));
            return tokenPayload;
        }
        navigate("/login");
    });

    const [selectedWorkspace, setSelectedWorkspace] = useState();
    const [modalShow, setModalShow] = useState(false);
    const [showProjectMenu, setShowProjectMenu] = useState(false);
    const [projectMenuPosition, setProjectMenuPosition] = useState({ top: 0, left: 0 });
    const [projectSidebarSelection, setProjectSidebarSelection] = useState({});


    useEffect(() => {
        setSideBarCurrentScrollHeight(sideBar.current.scrollHeight + "px");
    }, [sideBarCurrentScrollHeight]);

    useEffect(() => {
        //cargar menu principal por defecto
        MenuNodes().then(data => {
            console.log("menu data", data);
            setMenu(data);
        }).catch(err => console.log(err));

        const handleResize = () => {
            setWindowSize(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        // Llamada inicial (por si ya esta en ese tama�o)
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


    useEffect(() => {
        setMenu(
            prev => {
                const newMenu = prev.map(item => {
                    if (item.id === "2") {
                        return { ...item, children: [...globalUserProjects] };
                    }
                    return item;
                });
                return [...newMenu];
            }
        );
    }, [globalUserProjects]);


    const logout = () => {
        const publicBase = import.meta.env.VITE_API_URL || "https://localhost:7233";
        const routerBase = import.meta.env.VITE_ROUTER_URL || "https://localhost:5173";
        fetch(`${publicBase}/api/auth/logout`, {
            credentials: "include",
        })
            .then((res) => {
                console.log(res, "logout response")

                window.location.href = `${routerBase}/login`;
            })
            .catch((err) => {
                console.log(err, "response")

            });
    }
    useEffect(() => {

        const handleClickOutside = () => setShowProjectMenu(false);
        document.addEventListener('click', handleClickOutside);

    }, [showProjectMenu]);

    const handleOptionsClick = (data, e) => {
        console.log("Project options data", data);
        const { public_id, name } = data;
        setProjectSidebarSelection({ public_id, name });
        e.preventDefault();
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setProjectMenuPosition({
            top: rect.bottom + 5,// Debajo del botón
            left: rect.left // Alineado a la izquierda
        });
        setShowProjectMenu(true)
    }
    function Node({ node, style, dragHandle }) {
        const { globalUserProjects, sideBarActive, setSideBarActive } = useContext(Context);
        const nodeRef = useRef(null);
        const hasChildren = node.isInternal;
        const nodeId = node.data.id;
        let isProject = false;
        let isProjectParent = false;
        if (nodeId.match(/^p-.*/)) {
            isProject = true
        }
        if (nodeId == 2) {
            isProjectParent = true;
        }
        const handleDropDownClick = (e) => {

            console.log("nodeRef", nodeRef.current.getAttribute("class"));
            e.preventDefault();
            e.stopPropagation();
            if (hasChildren && globalUserProjects.length > 0) {
                node.toggle(); // Abre o cierra el nodo si tiene hijos
            }
        };
        useEffect(() => {
            // Solo cerrar el nodo cuando el sidebar se oculta, y solo si tiene hijos y esta abierto
            if (!sideBarActive && hasChildren && node.isOpen) {
                node.toggle();
            }
        }, [sideBarActive]);

        return (

            <React.Fragment>

                <li style={style} className={styles['nav-item']}>
                    {node.data.route ?
                        <NavLink ref={nodeRef} to={node.data.route} className={({ isActive, isPending }) => {
                            const classes = [styles['nav-link']];

                            if (isActive) {
                                classes.push(styles.active);
                            }

                            if (isProject) {
                                classes.push(styles['nav-link-child']);
                            }

                            return classes.join(' ');
                        }} onClick={() => { if (windowSize <= 768 && !hasChildren) { setSideBarActive(false) } }}>
                        <span className={[styles['nav-icon'], styles['material-symbols-rounded']].join(' ')}>
                            {node.data.icon?.()}
                        </span>

                            <span className={styles['nav-label']}>{node.data.name}</span>

                            <>
                                {hasChildren && globalUserProjects.length > 0 &&
                                    <span className={styles['sidebar-button']}>
                                    <ChevronDownIcon className="h-6 w-6 text-gray-500 sidebar-button" style={{ width: '20px', height: '20px' }} onClick={handleDropDownClick} />
                                </span>

                                }
                            </>
                            {isProjectParent &&
                                <span className={[styles["clickable"], styles["sidebar-button"]].join(' ')}>
                                <PlusIcon className="h-6 w-6 text-gray-500" style={{ width: '20px', height: '20px' }} variant="primary" onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setModalShow(true)
                                }} />
                            </span>

                            }
                            {isProject &&
                                <>
                                <span className={[styles['sidebar-button'], styles['project-menu-button']].join(' ')} onClick={(e) => { handleOptionsClick(node.data, e) }}>
                                    <EllipsisHorizontalIcon className="h-6 w-6 text-gray-500" style={{ width: '20px', height: '20px' }} />
                                </span>
                                </>
                            }

                        </NavLink>
                        :
                        <React.Fragment>
                            <div className={styles['nav-link']}>
                            <span className={[styles['nav-icon'], styles['material-symbols-rounded']].join(' ')}>
                                {node.data.icon?.()}
                            </span>

                                <span className={styles['nav-label']}>{node.data.name} </span>
                                <span className={styles["clickable"]}>
                                {hasChildren &&
                                    <ChevronDownIcon className="h-6 w-6 text-gray-500" style={{ width: '20px', height: '20px' }} onClick={handleDropDownClick} />
                                }
                            </span>
                                <span>
                            </span>
                            </div>

                        </React.Fragment>
                    }

                </li>
            </React.Fragment>

        );
    }
    

    return (
        <React.Fragment>
            <CreateProjectModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                workSpace={globalWorkspace}
            />
            {showProjectMenu && createPortal(
                <ProjectMenu
                    position={projectMenuPosition}
                    project={projectSidebarSelection}
                    setShowProjectMenu={() => setShowProjectMenu()}

                />,
                document.body // Lo renderiza en el body, fuera de todo
            )}
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
                            height={9999}
                            indent={25}
                            rowHeight={50}
                            overscanCount={1}>
                            { Node }
                        </Tree>
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