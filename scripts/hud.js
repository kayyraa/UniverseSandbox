const Focus = document.createElement("div");
Focus.style.position = "absolute";
Focus.style.aspectRatio = "1 / 1";
Focus.style.border = "5px solid transparent";
Focus.style.opacity = "0";
Focus.style.pointerEvents = "none";
document.body.appendChild(Focus);

function Update() {
    const NewPartList = document.createElement("div");

    Array.from(Scene.children).forEach(Part => {
        if (!Part.classList.contains("Object")) return;

        const Node = document.createElement("div");
        Node.innerHTML = `
            <div class="Visual" style="
                rotate: ${parseFloat(getComputedStyle(Part).rotate)}deg;
                background-color: ${getComputedStyle(Part).backgroundColor};
                scale: ${Math.min(Part.clientWidth / 10, 1)};
            "></div>
            <div>${Part.getAttribute("Uuid")}</div>
            ${
                Part.classList.contains("Debris") ?
                    `
                        <div style="
                            position: absolute;
                            left: 50%;
                            transform: translateX(-50%);
                        ">[ Debris ]</div>
                    `
                : ""
            }
        `;

        Node.addEventListener("mousedown", () => {
            ValueList.style.width = "calc(100% - 20em - 25em)";
            ObjectList.style.width = "calc(100% - 20em - 25em)";

            Options.style.right = "0";
            Focus.style.opacity = "1";

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
    if (Event.target === document.body || Event.target === Scene) {
        Options.style.right = "-25em";
        ValueList.style.width = "calc(100% - 20em)";
        ObjectList.style.width = "calc(100% - 20em)";
        Focus.style.opacity = "0";
    }
});

const GetNestedValue = (Path, Obj) => Path.split(".").reduce((Acc, Key) => Acc && Acc[Key], Obj);

let LastTime = performance.now();
let Frame = 0;

function DeltaUpdate() {
    Frame++;
    if (Frame >= 1200) {
        const Debris = Scene.firstChild;
        Debris ? Debris.classList.contains("Debris") ? Debris.remove() : "" : "";
        Frame = 0;
    }

    const CurrentTime = performance.now();
    const Dt = (CurrentTime - LastTime) / 1000;
    LastTime = CurrentTime;

    globalThis.Readonly.Performance.Dt = Dt;
    globalThis.Readonly.Performance.Fps = Math.round(1 / Dt);

    document.querySelectorAll("[display]").forEach(Node => {
        let Root = window.Readonly;
        if (Node.hasAttribute("root")) Root = window[Node.getAttribute("root")];

        const Prefix = Node.getAttribute("prefix") || "";
        let Value = GetNestedValue(Node.getAttribute("display"), Root);
        const Suffix = Node.getAttribute("suffix") || "";

        if (Node.hasAttribute("format")) Value = Value[Node.getAttribute("format").split(":")[0] || ""](Node.getAttribute("format").split(":")[1]);

        Node.textContent = `${Prefix}${Value}${Suffix}`;
    });

    document.querySelectorAll("[value]").forEach(Node => {
        let Root = window.Readonly;
        if (Node.hasAttribute("root")) Root = window[Node.getAttribute("root")];

        const Prefix = Node.getAttribute("prefix") || "";
        const Value = Node.getAttribute("value");
        const Suffix = Node.getAttribute("suffix") || "";

        Node.textContent = `${Prefix}${Root[Value]}${Suffix}`;
    });

    requestAnimationFrame(DeltaUpdate);
}

DeltaUpdate();

const FileInput = document.createElement("input");
FileInput.type = "file";
FileInput.accept = `*/.js`;

LoadButton.addEventListener("click", () => {
    FileInput.click();
    FileInput.addEventListener("change", () => {
        const Reader = new FileReader();
        Reader.onload = (Event) => eval(Event.target.result);
        Reader.readAsText(FileInput.files[0]);
    });
});

SaveButton.addEventListener("click", () => {
    let Code = `globalThis.Universe = "Unnamed Universe";\n`;
    Array.from(Scene.children).forEach(Part => {
        const Physics = JSON.parse(Part.getAttribute("Physics"));
        const Style = Object.fromEntries(
            String(Part.getAttribute("style") || "").split(";").filter(Boolean).map(Property => {
                let [Key, Value] = Property.split(":").map(Item => Item.trim());
                return [Key, Value];
            })
        );

        Code += `new SceneObject(${Physics}, ${Style}).Append();\n`;
    });

    const AnchorBlob = new Blob([Code], { type: "text/plain;charset=utf-8" });
    const AnchorURL = URL.createObjectURL(AnchorBlob);
    const Link = document.createElement("a");
    Link.href = AnchorURL;
    Link.download = "UnnamedUniverse.js";
    Link.click();
    URL.revokeObjectURL(AnchorURL);
});

Readonly.BuiltIn.Objects.forEach(Object => {
    const Node = document.createElement("div");
    Node.setAttribute("header", Object[0]);
    Node.setAttribute("properties", JSON.stringify([Object[1], Object[2]]));
    ObjectList.appendChild(Node);
});

Array.from(ObjectList.children).forEach(Part => {
    const Properties = JSON.parse(Part.getAttribute("Properties"));
    const Physics = Properties[0];
    const Style = Properties[1];

    const CssStyle = Object.entries(Style)
    .map(([Key, Value]) => `${Key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${Value};`)
    .join(" ");

    const Node = document.createElement("div");
    Node.style = `
        height: 5em;
        margin: 8px;
        aspect-ratio: 1 / 1;

        box-sizing: border-box;
        border: 1px solid rgba(255, 255, 255, 0.25);

        cursor: pointer;
    `;
    Node.innerHTML = `
        <div class="Visual SceneObject" style="
            ${CssStyle};
            scale: ${Math.min(Physics.Volume / 50, 1)};
            rotate: 22.5deg;
        "></div>
    `;
    const Header = Part.getAttribute("header");
    Node.setAttribute("header", Header);
    ObjectList.appendChild(Node);
    Part.remove();

    Physics.Velocity = new Vector2(Physics.Velocity);

    let Animate = false;
    function UpdateAnimation() {
        if (Animate) {
            Node.querySelector(".Visual").style.rotate = `${parseFloat(getComputedStyle(Node.querySelector(".Visual")).rotate) + Physics.Velocity.Vector[2] / Physics.Volume}deg`;
        } else {
            Node.querySelector(".Visual").style.rotate = "22.5deg";
        }

        requestAnimationFrame(UpdateAnimation);
    }

    UpdateAnimation();    
    
    Node.addEventListener("click", () => {
        Scene.ClickedNode = { Physics, Style, Header };
    });

    Node.addEventListener("mouseenter", () => Animate = true);
    Node.addEventListener("mouseleave", () => Animate = false);

    tippy(Node, { content: Header });
});

if (!Scene.HasClickListener) {
    Scene.addEventListener("click", (Event) => {
        if (Event.target !== Scene || !Scene.ClickedNode) return;
        const { Physics, Style, Header } = Scene.ClickedNode;
        Physics.Position = [Event.clientX - (Physics.Volume / 2), Event.clientY - (Physics.Volume / 2)];
        Physics.Position = new Vector2(Physics.Position);
        const Object = new SceneObject(Physics, Style).Append();
        Object.setAttribute("uuid", Scene.ClickedNode.Header)
        Scene.ClickedNode = null;
    });

    Scene.HasClickListener = true;
}