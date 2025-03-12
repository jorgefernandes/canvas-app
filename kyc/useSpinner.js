export function setSpinner(show) {
    const spinner = document.getElementById('spinner');

    if (show) {
        spinner.style.display = 'block';
    } else {
        spinner.style.display = 'none';
    }
}
