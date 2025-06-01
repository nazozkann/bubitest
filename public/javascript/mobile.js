document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuElement = document.getElementById('mobile-side-menu');
    const mobileMenuBtnElement = document.getElementById('mobile-menu-btn');

    if (!mobileMenuElement || !mobileMenuBtnElement) {
        console.error('Menu or button element not found!');
        return;
    }

    mobileMenuBtnElement.addEventListener('click', () => {
        mobileMenuElement.classList.toggle('open');
    });
});