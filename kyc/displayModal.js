import { removeNodeChildren } from './removeNodeChildren.js';

export function displayModal(message) {
    const modal = document.getElementById('modal');
    const modalMessage = document.querySelector('.modal-alert-text');

    modal.style.display = 'block';

    removeNodeChildren(modalMessage);

    modalMessage.innerHTML = message;

    closeModal(modal);
}

function closeModal(modal) {
    const btnCloseButton = document.querySelector('.modal-alert-ok');

    btnCloseButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}
