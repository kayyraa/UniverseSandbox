new SceneObject({
    Mass: 512,
    Volume: 32,
    Velocity: new Vector3([2, -1, 900]),
    Position: new Vector2([450, 200])
}, {
    backgroundColor: "rgb(255, 255, 255)"
}).Append();

new SceneObject({
    Mass: 128,
    Volume: 24,
    Velocity: new Vector3([2, -2.25, 0]),
    Position: new Vector2([550, 200])
}, {
    backgroundColor: "rgb(255, 255, 255)"
}).Append();

new SceneObject({
    Mass: 64,
    Volume: 16,
    Velocity: new Vector3([3.75, -2.9, 0]),
    Position: new Vector2([690, 260])
}, {
    backgroundColor: "rgb(255, 255, 255)"
}).Append();

new SceneObject({
    Mass: 24000,
    Volume: 48,
    Velocity: new Vector3([0, 0, 60]),
    Position: new Vector2([window.innerWidth / 2, window.innerHeight / 2])
}, {
    backgroundColor: "rgb(255, 255, 255)",
    boxShadow: "0 0 64px 2px rgb(255, 255, 255)"
}).Append();

function GenerateStars() {
    Scene.querySelectorAll(".Star").forEach(Star => Star.remove());
    for (let Index = 0; Index < 200; Index++) {
        const Star = document.createElement("div");
        Star.style.width = `${Random(1, 3)}px`;
        Star.style.left = `${Random(0, Scene.clientWidth)}px`;
        Star.style.top = `${Random(0, Scene.clientHeight)}px`;
        Star.style.rotate = `${Random(0, 360)}deg`;
        Star.classList.add("Star");
        Scene.appendChild(Star);
    }
}

GenerateStars();