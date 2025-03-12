export function removeNodeChildren(div) {
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}
