function GenerateStars() {
    Display.innerHTML = "";
    for (let Index = 0; Index < 200; Index++) {
        const Star = document.createElement("div");
        Star.style.width = `${Random(1, 3)}px`;
        Star.style.left = `${Random(0, Display.clientWidth)}px`;
        Star.style.top = `${Random(0, Display.clientHeight)}px`;
        Star.style.rotate = `${Random(0, 360)}deg`;
        Star.classList.add("Star");
        Display.appendChild(Star);
    }
}

GenerateStars();