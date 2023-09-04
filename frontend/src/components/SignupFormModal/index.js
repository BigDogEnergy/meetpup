import React, {  useState   } from 'react';
import { Modal } from '../../context/Modal';
import SignupFormPage from '../SignupFormPage';
import './SignupFormModal.css'

function SignupFormModal() {
    const [ showModal, setShowModal ] = useState(false);

    return (
        <>
            <div className='log-in-button' onClick={() => setShowModal(true)}>Sign Up</div>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                        <div>
                            <SignupFormPage />
                        </div>
                </Modal>
            )}
        </>
    )
}

export default SignupFormModal;