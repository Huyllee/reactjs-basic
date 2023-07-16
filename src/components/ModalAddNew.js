import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { postCreateUser, putUpdateUser } from '../services/userService';
import { toast } from 'react-toastify';

const ModalAddNew = (props) => {

    const { handleClose, show, handleUpdateTable, isEditUser, dataUserEdit, handleEditUserFromModal } = props;
    const [name, setName] = useState('');
    const [job, setJob] = useState('');

    useEffect(() => {
        if (isEditUser === true) {
            setName(dataUserEdit.first_name);
        } else if (!show) {
            setName('');
        }
    }, [dataUserEdit])

    const handleSaveUser = async () => {
        if (isEditUser === true) {
            toast.success('Edit user success!')
            let res = await putUpdateUser(name, job);
            if (res && res.updatedAt) {
                handleEditUserFromModal({
                    first_name: name,
                    id: dataUserEdit.id
                })
                handleClose();
            }
        }
        else {
            let res = await postCreateUser(name, job);
            if (res && res.id) {
                toast.success('Create a new user success!')
                handleUpdateTable({ first_name: res.name, id: res.id });
                handleClose();
            }
        }
    }

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop='static'
                keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {isEditUser === true ? 'Edit user' : 'Create a new user'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(event) => setName(event.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Job</label>
                        <input type="text"
                            className="form-control"
                            value={job}
                            onChange={(event) => setJob(event.target.value)} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleSaveUser()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    );
}

export default ModalAddNew;