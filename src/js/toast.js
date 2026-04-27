export const showToast = (message, duration) => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-show`;
    toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-message">${message}</span>
      <button class="toast-close">&times;</button>
    </div>
    <div class="toast-progress" style="--duration: ${duration}ms"></div>
  `;
    container.appendChild(toast);
    setTimeout(
        () => dismissToast(toast.querySelector('.toast-close')),
        duration
    );

    toast.querySelector('.toast-close').addEventListener('click', (event) => {
        dismissToast(event.currentTarget);
    })
}

const dismissToast = (btn) => {
    const toast = btn.closest('.toast');
    toast.classList.add('toast-hide');
    setTimeout(() => toast.remove(), 300);
}
