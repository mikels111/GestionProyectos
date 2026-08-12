import React, { useState, useEffect, useContext, useRef } from 'react'
import axios from 'axios';
import styles from './ProjectMenu.module.css'
import { Context } from '../Router/Router';
import { Notify } from '../../Utils/Notifications';
import { useNavigate, NavLink } from 'react-router-dom';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
function ProjectMenu({ position, project, setShowProjectMenu }) {
    const projectMenuStyle = {
        width: '150px',
        padding: '6px',
        backgroundColor: 'white',
        border: '1px solid #EFF0F1',
        borderRadius: '6px',
        position: 'fixed',
        boxShadow: '0 3px 15px -3px rgba(13, 20, 33, .1)',
        zIndex: '999',
        top: `${position.top - 15}px`,
        left: `${position.left + 10}px`
    }
    const { RefreshProjects } = useContext(Context);
    const { warn, info } = Notify();
    const navigate = useNavigate();
    const [confirmModalShow, setConfirmModalShow] = useState(false);
    const [renameModalShow, setRenameModalShow] = useState(false);
    const inputRenameRef = useRef(null);


    const handleDelete = () => {
        console.log("----->",project);

        const publicBase = import.meta.env.VITE_API_URL || "https://localhost:7233";
        axios({
            withCredentials: true,
            method: 'delete',
            url: `${publicBase}/api/Project/deleteProject?public_id=${project.public_id}`,
        })
            .then(function (res) {
                console.log("delete project response", res);
                if (res.data.success) {
                    console.log("project deleted");
                    info("Project deleted");
                    RefreshProjects();
                    //navigate("/");
                } else {
                    console.log("project not deleted");
                }
            })
            .catch(function (err) {
                console.log("delete project error", err);
            });
    }
    const handleRename = (e, props) => {
        e.preventDefault();
        e.stopPropagation();
        // Implementar la l�gica de renombrado aqu� si se necesita.
        let inputName = inputRenameRef.current.value;
        if (inputName) {
            const publicBase = import.meta.env.VITE_API_URL || "https://localhost:7233";
            //const publicBase = import.meta.env.BASE_URL ?? '/'
            axios({
                withCredentials: true,
                method: 'put',
                data: {
                    "public_id": project.public_id,
                    "name": inputName
                },
                url: `${publicBase}/api/Project/renameProject`,
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(function (res) {
                    if (res.data.success) {
                        console.log("project renamed");
                        info("Project renamed");
                        RefreshProjects();
                        setRenameModalShow(false)
                        setShowProjectMenu(false)
                    } else {
                        console.log("project not renamed");
                    }
                })
                .catch(function (err) {
                    console.log(err, "response")
                });
        }
    }

    return (
        <div>
            <ConfirmModal
                show={confirmModalShow}
                onHide={() => setConfirmModalShow(false)}
                onDelete={handleDelete}
            />
            <Modal
                show={renameModalShow}
                onHide={() => setRenameModalShow(false)}
                aria-labelledby="contained-modal-title-vcenter"
                animation={false}
                centered
                onClick={(e) => e.stopPropagation()}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit Project
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate onSubmit={(e) => { handleRename(e) }}>
                        <Form.Group className="mb-3" controlId="formBasicEmail" >
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control type="text" ref={inputRenameRef} placeholder={project.name} />
                        </Form.Group>
                        <div className="flex gap-1">
                            <Button variant="flat" type="submit">
                                Save
                            </Button>
                            <Button variant="secondary" onClick={() => {
                                setRenameModalShow(false);
                                setShowProjectMenu(false);
                            }}>
                                Cancel
                            </Button>
                        </div>

                    </Form>
                </Modal.Body>
            </Modal>
            <div style={projectMenuStyle} >
                <div className={[styles['project-menu-item'], styles['rename-project-btn']].join(' ')} onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setRenameModalShow(true);
                }}>
                    Rename
                </div>
                <div className={[styles['project-menu-item'], styles['delete-project-btn']].join(' ')} onClick={
                    (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setConfirmModalShow(true);
                    }}>
                    Delete
                </div>

            </div>
        </div>
    );
}
export default ProjectMenu;