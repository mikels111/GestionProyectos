import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import styles from './ProjectMenu.module.css'
import { Context } from '../Router/Router';
import { Notify } from '../../Utils/Notifications';
import { useNavigate, NavLink } from 'react-router-dom';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

function ProjectMenu({ position, project }) {
    const style = {
        width: '150px',
        padding: '6px',
        backgroundColor: 'white',
        border: '1px solid #EFF0F1',
        borderRadius: '6px',
        position: 'fixed',
        boxShadow: '0 3px 15px -3px rgba(13, 20, 33, .1)',
        zIndex: '1050',
        top: `${position.top - 15}px`,
        left: `${position.left + 10}px`
    }
    const { RefreshProjects } = useContext(Context);
    const { warn, info } = Notify();
    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState(false);


    const handleDelete = (e) => {
        
        const publicBase = import.meta.env.VITE_API_URL || "https://localhost:7233";
        axios({
            withCredentials: true,
            method: 'delete',
            url: `${publicBase}/api/Project/deleteProject?projectId=${project}`,
        })
            .then(function (res) {
                console.log("delete project response", res);
                if (res.data.success) {
                    console.log("project deleted");
                    info("Project deleted");
                    RefreshProjects();
                    navigate("/");
                } else {
                    console.log("project not deleted");
                }
            })
            .catch(function (err) {
                console.log("delete project error", err);
            });
    }

    return (
        <>
            <ConfirmModal 
            show={modalShow} 
            onHide={() => setModalShow(false)} 
            onDelete={handleDelete}
            />
            <div style={style}>
                <div className={[styles['project-menu-item'], styles['rename-project-btn']].join(' ')} >
                    Rename
                </div>
                <div className={[styles['project-menu-item'], styles['delete-project-btn']].join(' ')} onClick={
                    (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setModalShow(true);
                    }}>
                    Delete
                </div>

            </div>
        </>
    );
}
export default ProjectMenu;