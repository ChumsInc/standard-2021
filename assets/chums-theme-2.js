const searchIcon = document.querySelector('.js-search-header');
if (searchIcon) {
    searchIcon.addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        searchIcon.innerText += '.';
    })
}
