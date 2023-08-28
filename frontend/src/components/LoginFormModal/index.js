import React, {  useState   } from 'react';
import { Modal } from '../../context/Modal';
import LoginForm from '../LoginFormPage';
import './LoginFormModal.css'

function LoginFormModal() {
    const [ showModal, setShowModal ] = useState(false);

    return (
        <>
            <div className='log-in-button' onClick={() => setShowModal(true)}>Log In</div>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                        <div>
                            <LoginForm />
                        </div>
                </Modal>
            )}
        </>
    )
}

export default LoginFormModal;