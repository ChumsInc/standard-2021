
interface ModalSettings {
    timer: number,
    element?:HTMLElement,
    fadeDuration: number,
}
const modalSettings:ModalSettings = {
    timer: 0,
    element: document.querySelector('#chums--modal-backdrop'),
    fadeDuration: 350,
}


export interface ShowModalBackdropProps {
    closeOnClick?: boolean,
    closeOnEscape?: boolean,
}

function modalKeypressHandler(ev:KeyboardEvent) {
    console.log(ev);
    if (ev.key === "Escape") {
        hideModalBackdrop();
    }
}

export function showModalBackdrop({closeOnClick = true, closeOnEscape = true}:ShowModalBackdropProps = {}):void {
    if (!modalSettings.element) {
        return;
    }
    clearTimeout(modalSettings.timer);
    modalSettings.element.className = 'modal-backdrop fade';
    modalSettings.timer = window.setTimeout(() => {
        modalSettings.element.classList.toggle('show', true);
    })

    if (closeOnClick) {
        modalSettings.element.addEventListener('click',
            hideModalBackdrop,
            {once: true});
    }
    if (closeOnEscape) {
        modalSettings.element.addEventListener('keyup', modalKeypressHandler);
    }
}

export function hideModalBackdrop() {
    if (!modalSettings.element) {
        return;
    }
    modalSettings.element.removeEventListener('click', hideModalBackdrop);
    modalSettings.element.removeEventListener('keyup', modalKeypressHandler);
    modalSettings.element.className = '';
}
