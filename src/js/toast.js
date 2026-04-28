export const showToast = (message, duration) => {
    const container = document.getElementById('toast-container')

    const toast = document.createElement('div');
    toast.className = `toast toast-show`;
    container.appendChild(toast);

    const toastContainer = document.createElement('div')
    toastContainer.className = 'toast-content'
    toast.appendChild(toastContainer)

    const messageContainer = document.createElement('span')
    messageContainer.className = 'toast-message'
    messageContainer.textContent = message
    toastContainer.appendChild(messageContainer)

    const closeButton = document.createElement('button')
    closeButton.className = 'toast-close'
    closeButton.innerHTML = `&times;`
    toastContainer.appendChild(closeButton)

    const progressBar = document.createElement('div')
    progressBar.className = 'toast-progress'
    progressBar.style.setProperty('--duration', `${duration}ms`)
    toast.appendChild(progressBar)

    setTimeout(
        () => dismissToast(toast.querySelector('.toast-close')),
        duration
    );

    toast.querySelector('.toast-close').addEventListener('click', (event) => {
        dismissToast(event.currentTarget)
    })
}

const dismissToast = (btn) => {
    const toast = btn.closest('.toast')
    toast.classList.add('toast-hide')
    setTimeout(() => toast.remove(), 300)
}
