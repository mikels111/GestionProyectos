import React, { useRef, useState, useEffect, useContext } from 'react';
import { Notify } from '../../Utils/Notifications';
import { Context } from '../Router/Router';
import { useNavigate, NavLink } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
export function CreateProjectModal(props) {
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