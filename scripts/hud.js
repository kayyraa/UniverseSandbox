function Update() {
    const NewPartList = document.createElement("div");

    Array.from(Scene.children).forEach(Part => {
        if (!Part.classList.contains("Object")) return;

        const Node = document.createElement("div");
        Node.innerHTML = `
            <div class="Visual" style="rotate: ${parseFloat(getComputedStyle(Part).rotate)}deg; background-color: ${getComputedStyle(Part).backgroundColor};"></div>
            <div>${Part.getAttribute("Uuid")}</div>
        `;

        Node.addEventListener("mousedown", () => {
            Options.style.right = "0";

            const Velocity = JSON.parse(Part.getAttribute("Velocity"));
            const Position = [Part.offsetLeft, Part.offsetTop];

            Options.innerHTML = `
                <span>${Part.getAttribute("Uuid")}</span>
                <hr>
                <div>
                    <span>Velocity:</span>
                    <span class="VelocityDisplay">[${Floor(Velocity[0])}, ${Floor(Velocity[1])}, ${Floor(Velocity[2])}]</span>
                </div>
                <div>
                    <span>Position:</span>
                    <span class="PositionDisplay">[${Floor(Position[0])}, ${Floor(Position[1])}]</span>
                </div>
                <hr>
                <div>
                    <span>Set Velocity:</span>
                    <div>
                        <input class="XVelocityInput" style="width: 3em; text-align: center;" value="${Velocity[0]}">
                        <input class="YVelocityInput" style="width: 3em; text-align: center;" value="${Velocity[1]}">
                        <input class="AngularVelocityInput" style="width: 3em; text-align: center;" value="${Velocity[2]}">
                    </div>
                </div>
                <button class="VelocitySetButton">Set</button>
                <div>
                    <span>Set Position:</span>
                    <div>
                        <input class="XPositionInput" style="width: 3em; text-align: center;" value="${Position[0]}">
                        <input class="YPositionInput" style="width: 3em; text-align: center;" value="${Position[1]}">
                    </div>
                </div>
                <button class="PositionSetButton">Set</button>
            `;

            Options.querySelector(".VelocitySetButton").addEventListener("click", () => {
                const NewVelocity = [
                    parseFloat(Options.querySelector(".XVelocityInput").value),
                    parseFloat(Options.querySelector(".YVelocityInput").value),
                    parseFloat(Options.querySelector(".AngularVelocityInput").value)
                ];

                Part.setAttribute("Velocity", JSON.stringify(NewVelocity));
            });

            Options.querySelector(".PositionSetButton").addEventListener("click", () => {
                const NewX = parseFloat(Options.querySelector(".XPositionInput").value);
                const NewY = parseFloat(Options.querySelector(".YPositionInput").value);

                Part.style.left = `${NewX}px`;
                Part.style.top = `${NewY}px`;
            });

            function UpdateDisplays() {
                const LiveVelocity = JSON.parse(Part.getAttribute("Velocity"));
                const LivePosition = [Part.offsetLeft, Part.offsetTop];

                Options.querySelector(".VelocityDisplay").textContent = `[${Floor(LiveVelocity[0])}, ${Floor(LiveVelocity[1])}, ${Floor(LiveVelocity[2])}]`;
                Options.querySelector(".PositionDisplay").textContent = `[${Floor(LivePosition[0])}, ${Floor(LivePosition[1])}]`;

                requestAnimationFrame(UpdateDisplays);
            }

            UpdateDisplays();
        });

        NewPartList.appendChild(Node);
    });

    PartList.replaceChildren(...NewPartList.children);

    requestAnimationFrame(Update);
}

document.addEventListener("DOMContentLoaded", Update);

document.addEventListener("mousedown", (Event) => {
    if (Event.target === document.body || Event.target === Scene) {
        Options.style.right = "-25em";
    }
});