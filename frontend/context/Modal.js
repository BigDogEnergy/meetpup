import React, { useContext, useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const ModalContext = React.createContext();

export function ModalProvider({ children }) {
    const ModalRef = useRef();
    const [ content, setContent ] = useState();

    useEffect(() => {
        setContent(ModalRef.current);
    }, [])

    return (
        <>
            <ModalContext.Provider value={ content }>
                {children}
            </ModalContext.Provider>
        </>
    );
}

