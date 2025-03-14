globalThis.Universe = "Solar System";

new SceneObject({
    Mass: 128,
    Volume: 24,
    Velocity: new Vector3([1.5, -2.5, 0]),
    Position: new Vector2([window.innerWidth / 3, window.innerWidth / 6])
}, {
    backgroundColor: "rgb(255, 255, 255)"
}).Append();

new SceneObject({
    Mass: 64,
    Volume: 16,
    Velocity: new Vector3([3.625, -2.75, 0]),
    Position: new Vector2([window.innerWidth / 2.25, window.innerWidth / 5.75])
}, {
    backgroundColor: "rgb(255, 255, 255)"
}).Append();

new SceneObject({
    Mass: 24000,
    Volume: 32,
    Velocity: new Vector3([0, 0, 60]),
    Position: new Vector2([window.innerWidth / 2, window.innerHeight / 2])
}, {
    backgroundColor: "rgb(255, 255, 255)",
    boxShadow: "0 0 64px 2px rgb(255, 255, 255)"
}).Append();