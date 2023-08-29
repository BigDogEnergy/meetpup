function ConfirmationModal({ onConfirm, onCancel }) {
    return (
        <div className="confirm-modal">
            <div className="confirm-modal-background">
                <div className="confirm-modal-content"> 
                        <p>Are you sure you want to delete this group?</p>
                    <div className='confirm-modal-options'> 
                        <button onClick={onConfirm}>Confirm (Delete Group)</button>
                        <button onClick={onCancel}>Cancel (Keep Group)</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;