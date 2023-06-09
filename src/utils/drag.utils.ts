export function dragElement(elem: HTMLElement) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elem.id + "-header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elem.id + "-header")!.onpointerdown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elem.onpointerdown = dragMouseDown;
    }

    function dragMouseDown(e: PointerEvent) {
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onpointerup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onpointermove = elementDrag;
    }

    function elementDrag(e: PointerEvent) {
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elem.style.top = (elem.offsetTop - pos2) + "px";
        elem.style.left = (elem.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onpointerup = null;
        document.onpointermove = null;
    }
}
