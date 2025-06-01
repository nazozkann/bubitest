document.addEventListener('DOMContentLoaded', () => {
    const scrollDown1 = document.getElementById('sd-1');
    const scrollDown2 = document.getElementById('sd-2');
    const scrollDown3 = document.getElementById('sd-3');

    scrollDown1.addEventListener('click', () => {
        document.querySelector('.slide-show-2').scrollIntoView({ behavior: 'smooth' });
    });

    scrollDown2.addEventListener('click', () => {
        document.querySelector('.slide-show-3').scrollIntoView({ behavior: 'smooth' });
    });

    scrollDown3.addEventListener('click', () => {
        document.querySelector('.slide-show-4').scrollIntoView({ behavior: 'smooth' });
    });
});
