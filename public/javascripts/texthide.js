document.addEventListener('DOMContentLoaded', function () {
    const showInputButton = document.getElementById('showInputButton');
    const addItemContainer = document.getElementById('addItemContainer');
    
    showInputButton.addEventListener('click', () => {
        showInputButton.style.display = 'none';
        addItemContainer.style.display = 'block';
    })
});
