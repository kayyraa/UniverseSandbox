const Focus = document.createElement("div");
Focus.style.position = "absolute";
Focus.style.aspectRatio = "1 / 1";
Focus.style.border = "5px solid transparent";
Focus.style.opacity = "0";
document.body.appendChild(Focus);

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

            const VelocityInputs = {};
            const PositionInputs = {};
            let ActiveInput = { Current: null };

            function CreateInput(ClassName, Value) {
                const Input = document.createElement("input");
                Input.className = ClassName;
                Input.style.width = "3em";
                Input.style.textAlign = "center";
                Input.value = Value;

                Input.addEventListener("focus", () => ActiveInput.Current = Input);
                Input.addEventListener("blur", () => ActiveInput.Current = null);

                return Input;
            }

            const Velocity = JSON.parse(Part.getAttribute("Velocity"));
            const Position = [Part.offsetLeft, Part.offsetTop];

            VelocityInputs.X = CreateInput("XVelocityInput", Velocity[0]);
            VelocityInputs.Y = CreateInput("YVelocityInput", Velocity[1]);
            VelocityInputs.Angular = CreateInput("AngularVelocityInput", Velocity[2]);

            PositionInputs.X = CreateInput("XPositionInput", Position[0]);
            PositionInputs.Y = CreateInput("YPositionInput", Position[1]);

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
                    <div class="VelocityInputs"></div>
                </div>
                <button class="VelocitySetButton">Set</button>
                <div>
                    <span>Set Position:</span>
                    <div class="PositionInputs"></div>
                </div>
                <button class="PositionSetButton">Set</button>
                <hr>
                <div>
                    <span>Set Mass:</span>
                    <input class="MassInput" value="${JSON.parse(Part.getAttribute("Physics")).Mass}">
                </div>
                <button class="MassSetButton">Set</button>
            `;

            const VelocityContainer = Options.querySelector(".VelocityInputs");
            VelocityContainer.appendChild(VelocityInputs.X);
            VelocityContainer.appendChild(VelocityInputs.Y);
            VelocityContainer.appendChild(VelocityInputs.Angular);

            const PositionContainer = Options.querySelector(".PositionInputs");
            PositionContainer.appendChild(PositionInputs.X);
            PositionContainer.appendChild(PositionInputs.Y);

            const MassInput = Options.querySelector(".MassInput");
            MassInput.addEventListener("focus", () => ActiveInput.Current = MassInput);
            MassInput.addEventListener("blur", () => ActiveInput.Current = null);

            const MassSetButton = Options.querySelector(".MassSetButton");
            MassSetButton.addEventListener("click", () => {
                const Physics = JSON.parse(Part.getAttribute("Physics"));
                Physics.Mass = parseFloat(MassInput.value);
                Part.setAttribute("Physics", JSON.stringify(Physics));
            });

            function KeepFocus(Event) {
                if (ActiveInput.Current && Event.target.tagName === "BUTTON") {
                    Event.preventDefault();
                    ActiveInput.Current.focus();
                }
            }

            Options.querySelector(".VelocitySetButton").addEventListener("mousedown", KeepFocus);
            Options.querySelector(".VelocitySetButton").addEventListener("click", () => {
                const NewVelocity = [
                    parseFloat(VelocityInputs.X.value),
                    parseFloat(VelocityInputs.Y.value),
                    parseFloat(VelocityInputs.Angular.value)
                ];

                Part.setAttribute("Velocity", JSON.stringify(NewVelocity));
            });

            Options.querySelector(".PositionSetButton").addEventListener("mousedown", KeepFocus);
            Options.querySelector(".PositionSetButton").addEventListener("click", () => {
                const NewX = parseFloat(PositionInputs.X.value);
                const NewY = parseFloat(PositionInputs.Y.value);

                Part.style.left = `${NewX}px`;
                Part.style.top = `${NewY}px`;
            });

            function UpdateDisplays() {
                const LiveVelocity = JSON.parse(Part.getAttribute("Velocity"));
                const LivePosition = [Part.offsetLeft, Part.offsetTop];

                Options.querySelector(".VelocityDisplay").textContent = `[${Floor(LiveVelocity[0])}, ${Floor(LiveVelocity[1])}, ${Floor(LiveVelocity[2])}]`;
                Options.querySelector(".PositionDisplay").textContent = `[${Floor(LivePosition[0])}, ${Floor(LivePosition[1])}]`;

                if (!ActiveInput.Current) {
                    VelocityInputs.X.value = LiveVelocity[0];
                    VelocityInputs.Y.value = LiveVelocity[1];
                    VelocityInputs.Angular.value = LiveVelocity[2];

                    PositionInputs.X.value = LivePosition[0];
                    PositionInputs.Y.value = LivePosition[1];
                }

                Focus.style.left = `${Part.offsetLeft - (Part.clientWidth / 2)}px`;
                Focus.style.top = `${Part.offsetTop - (Part.clientWidth / 2)}px`;
                Focus.style.width = `${Part.clientWidth + (Part.clientWidth / 2)}px`;
                Focus.style.padding = `${(Part.clientWidth / 6)}px`;
                Focus.style.borderColor = getComputedStyle(Part).backgroundColor;

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
    if (Event.target === document.body || Event.target === Scene) Options.style.right = "-25em";
});
