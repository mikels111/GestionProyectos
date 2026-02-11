import React, { useRef, useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
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
    ChevronDownIcon,
    PlusIcon,
    EllipsisVerticalIcon,
    EllipsisHorizontalCircleIcon,
    EllipsisHorizontalIcon
} from '@heroicons/react/16/solid'
import { useNavigate, NavLink } from 'react-router-dom';
import styles from './SideBar.module.css'
import { Tree } from 'react-arborist';
import { Context } from '../Router/Router';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import SplitButton from 'react-bootstrap/SplitButton';
import { Notify } from '../../Utils/Notifications';
import ProjectMenu from '../ProjectMenu/ProjectMenu';
import axios from 'axios';

function CreateProyectModal(props) {
    const inputRef = useRef(null);
    const { warn, info } = Notify();
    const { globalUser } = useContext(Context);
    const { globalWorkspace, setGlobalUserProjects, RefreshProjects } = useContext(Context);
    const navigate = useNavigate();

    const createProject = (props, e) => {
        //console.log(props, "propiedades")
        e.preventDefault();
        console.log("global workspace Create project", props);
        let inputName = inputRef.current.value;
        if (inputName) {
            const publicBase = import.meta.env.VITE_API_URL || "https://localhost:7233";
            //const publicBase = import.meta.env.BASE_URL ?? '/'
            axios({
                withCredentials: true,
                method: 'post',
                data: {
                    "w_environment_id": props.workSpace,
                    "name": inputName
                },
                url: `${publicBase}/api/project`,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(function (res) {
                    if (res.status == 200) {
                        console.log("created project response", res.data.data);
                        UserProjectAssignment(res.data.data.id);
                    }
                })
                .catch(function (err) {
                    console.log(err.data, "response")
                });
        }
    }
    //------------> crear relacion user-project porque el usuario es el creador del proyecto
    async function UserProjectAssignment(projectId) {
        const publicBase = import.meta.env.VITE_API_URL || "https://localhost:7233";
        console.log("project id UserProject assignment: ", projectId)
        axios({
            withCredentials: true,
            method: 'post',
            data: {
                "project": projectId
            },
            url: `${publicBase}/api/user/UserProjectAssignment`,
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(function (res) {
                if (res.status == 200) {
                    console.log("created project response", res.data);
                }
            })
            .catch(function (err) {
                console.log(err.data, "response")
            }).finally(() => {
                props.onHide();
                info("Project created")
                navigate(`/p/${projectId}`)
                RefreshProjects()
                //conseguir proyectos (recarga para ver el nuevo proyecto)
            });
    }
    return (
        <>
            <style type="text/css">
                {`
                    .btn-flat {
                      background-color: #59C5DE;
                      color: white;
                    }
                    .btn-flat:hover {
                      background-color: black;
                      color: white;
                    }
                    .btn-flat:click {
                      background-color: grey;
                      color: white;
                    }

                    `}
            </style>
            <Modal
                show={props.show}
                onHide={props.onHide}
                aria-labelledby="contained-modal-title-vcenter"
                animation={false}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        New Project
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate onSubmit={(e) => { createProject(props, e) }}>
                        <Form.Group className="mb-3" controlId="formBasicEmail" >
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control type="text" ref={inputRef} />
                        </Form.Group>
                        <Button variant="flat" type="submit">
                            Create
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

function SideBar() {
    const { globalUser, setGlobalUser, globalWorkspace, setGlobalWorkspace, globalUserProjects, setGlobalUserProjects } = useContext(Context);
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
            route: "/projects",
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
    const [modalShow, setModalShow] = useState(false);
    const [showProjectMenu, setShowProjectMenu] = useState(false);
    const [projectMenuPosition, setProjectMenuPosition] = useState({ top: 0, left: 0 });
    const [projectSidebarSelection, setProjectSidebarSelection] = useState({});


    //useEffect(() => {

    //    //setGlobalUser(user);
    //    AuthRequest(`/api/WEnvironment/getWEnvironments`, 'get').
    //        then((res) => {
    //            //setWEnvironments(res.data.data);
    //            //let workSpcLocal = JSON.parse(localStorage.getItem("worksp")).id;
    //            console.log(localStorage.getItem("worksp"), "workSpcLocal")
    //            if (!localStorage.getItem("worksp") || localStorage.getItem("worksp") == undefined) {
    //                //setSelectedWorkspace(res.data.data[0])
    //                //console.log(selectedWorkspace);
    //                console.log("setting worksapce");
    //                //localStorage
    //                //    .setItem(
    //                //        "worksp",
    //                //        JSON.stringify(res.data.data[0])
    //                //    );
    //            }
    //            //console.log(workSpcLocal);
    //            //setSelectedWorkspace(workSpcLocal);
    //            //setGlobalWorkspace(workSpcLocal);
    //            console.log("setting global workspace")
    //            //setGlobalWorkspace(JSON.parse(localStorage.getItem("worksp")).id);
    //            setGlobalWorkspace(res.data.data[0].id);
    //        }).
    //        catch((err) => {
    //            console.error(err);
    //            if (err.status == 401) {
    //                navigate("/login");

    //            }
    //        });
    //}, []);

    useEffect(() => {
        setSideBarCurrentScrollHeight(sideBar.current.scrollHeight + "px");
    }, [sideBarCurrentScrollHeight]);

    //useEffect(() => {
    //    try {
    //        if (globalWorkspace != null) {
    //            console.log(globalWorkspace, "GLOBAL WORKSPACE")
    //            //let parsedSelectWorkSpc = JSON.parse(globalWorkspace);
    //            //console.log(parsedSelectWorkSpc, "Sidebar selected workspace parsed");
    //            //console.log(selectedWorkspace, "Sidebar selected workspace");
    //            AuthRequest(`/api/Project/getProjects?workspace=${globalWorkspace}`, 'get').
    //                then((res) => {
    //                    //console.log(res);
    //                    const proj = res.data.data;
    //                    proj.map((project, i) => {
    //                        project.project_id = project.id;
    //                        project.route = `/project/${project.id}`
    //                        project.id = `p${i}`;
    //                    })
    //                    //console.log("projects obtenidos", proj)
    //                    console.log(proj)
    //                    setUserProjects(proj)

    //                }).
    //                catch((err) => {
    //                    //console.error(err.status);
    //                    if (err.status == 401) {
    //                        navigate("/login");
    //                    }
    //                });
    //        }


    //    } catch (Exception) {
    //        console.error(Exception);
    //    }

    //}, [globalWorkspace]);
    useEffect(() => {

        const handleResize = () => {
            setWindowSize(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        // Llamada inicial (por si ya est� en ese tama�o)
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
        //console.log("userProjects cargado:", menu);

    }, [globalUserProjects]);


    const logout = () => {
        //localStorage.removeItem("aT");
        //localStorage.removeItem("rT");
        const publicBase = import.meta.env.VITE_API_URL || "https://localhost:7233";
        //const publicBase = import.meta.env.BASE_URL ?? '/'
        fetch(`${publicBase}/api/auth/logout`, {
            credentials: "include",
        })
            .then((res) => {
                //console.log("is authenticated")
                //setIsAuthenticated(res.ok);
                console.log(res, "logout response")

                //navigate("/login");
                window.location.href = `${publicBase}/login`;
            })
            .catch((err) => {
                //console.log("is NOT authenticated")
                //setIsAuthenticated(false);
                console.log(err, "response")

            });
    }
    useEffect(() => {
        //if (!showProjectMenu) return;

        const handleClickOutside = () => setShowProjectMenu(false);
        document.addEventListener('click', handleClickOutside);

        //return () => document.removeEventListener('click', handleClickOutside);
    }, [showProjectMenu]);

    const handleOptionsClick = (data, e) => {
        console.log("Project options data", data);
        const { public_id, name } = data;
        setProjectSidebarSelection({ public_id, name});
        e.preventDefault();
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setProjectMenuPosition({
            top: rect.bottom + 5,// Debajo del botón
            left: rect.left // Alineado a la izquierda
        });
        //console.log(showProjectMenu);
        setShowProjectMenu(true)
    }
    function Node({ node, style, dragHandle }) {
        const nodeRef = useRef(null);
        const hasChildren = node.isInternal;
        const isChild = node.level > 0;
        const nodeId = node.data.id;
        let isProject = false;
        let isProjectParent = false;
        let children = null
        //const regex = "/^p-.*/";
        //children = "<ChevronDownIcon className='h-6 w-6 text-gray-500' style={{ width: '20px', height: '20px' }} />";
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
            // Solo cerrar el nodo cuando el sidebar se oculta, y solo si tiene hijos y está abierto
            if (!sideBarActive && hasChildren && node.isOpen) {
                node.toggle();
            }
        }, [sideBarActive]);

        return (
            //<div style={style}>

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
            //</div>

        );

    }

    return (
        //<Context.Provider value={{ user, setUser }} >


        <React.Fragment>
            <CreateProyectModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                workSpace={globalWorkspace}
            />
            {showProjectMenu && createPortal(
                <ProjectMenu
                    position={projectMenuPosition}
                    project={projectSidebarSelection}
                    setShowProjectMenu={()=>setShowProjectMenu() }

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
                            indent={0}
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