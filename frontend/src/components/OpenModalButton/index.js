import React, { useState } from "react";

function OpenModalButton ({ buttonText, modalComponent }) {
    const [ showModal, setShowModal ] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <button onClick={openModal}>Log In</button>
            {showModal && modalComponent}
        </>
    );

}

export default OpenModalButton;