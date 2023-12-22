import { useEffect, useRef, useState } from "react";

function Modal({ visible, winner }) {
    const [closed, setClosed] = useState(false);
    const elementRef = useRef();
    const handleClose = e => setClosed(true);

    useEffect(() => {
        if (visible)
            elementRef.current.classList.add('show');
        else
            elementRef.current.classList.remove('show');
    }, [visible]);
    useEffect(() => setClosed(false), [winner]);

    return (
        <div ref={elementRef} className={'modal' + (!visible || closed ? ' displayNone' : '')}>
            <div className="modalContent">
                {
                    winner === 0
                    ? 'Black Won'
                    : winner === 1
                        ? 'White Won'
                        : 'Draw'
                }
                <span className="closeModal" onClick={handleClose}>╳</span>
            </div>
        </div>
    );
}

export default Modal;