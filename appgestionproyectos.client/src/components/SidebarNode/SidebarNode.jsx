import React, { useRef, useEffect, useContext } from 'react';
import styles from '../SideBar/SideBar.module.css'
import { Context } from '../Router/Router';
import { NavLink } from 'react-router-dom';
import {
    ChevronDownIcon,
    PlusIcon,
    EllipsisHorizontalIcon
} from '@heroicons/react/16/solid'

export function SidebarNode({ node, style, dragHandle }) {
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