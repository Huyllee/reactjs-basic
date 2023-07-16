import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { deleteUser } from '../services/userService';
import { toast } from 'react-toastify';

const ModalConfirm = (props) => {

    const { handleClose, show, dataUserDelete, handleDeleteUserFormModal } = props;

    const handleConfirmDelete = async () => {
        let res = await deleteUser(dataUserDelete.id);
        if (res && res.statusCode === 204) {
            toast.success('Delete a user success!');
            handleDeleteUserFormModal(dataUserDelete);
            handleClose();
        } else {
            toast.error('Delete a user error!');
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
                        Delete a user
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure to delete this user, email: <b>{dataUserDelete.email}</b>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={() => handleConfirmDelete()}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    );
}

export default ModalConfirm;