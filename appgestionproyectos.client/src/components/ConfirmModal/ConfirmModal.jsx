import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { Context } from '../Router/Router';
import { Notify } from '../../Utils/Notifications';
import { useNavigate, NavLink } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function ConfirmModal(props) {

    const { RefreshProjects } = useContext(Context);
    const { warn, info } = Notify();
    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState(false);


    return (
        <Modal
            {...props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >

            <Modal.Body>
                <Form noValidate onSubmit={(e) => { createProject(props, e) }}>
                    <Form.Group className="mb-3" controlId="formBasicEmail" >
                        Are you sure you want to delete?
                    </Form.Group>
                    <div className="d-flex justify-content-between">
                        <Button variant="danger" onClick={props.onDelete}>
                            Delete
                        </Button>
                        <Button onClick={props.onHide}>
                            Cancel
                        </Button>
                    </div>

                </Form>
            </Modal.Body>
        </Modal>
    );
}
export default ConfirmModal;