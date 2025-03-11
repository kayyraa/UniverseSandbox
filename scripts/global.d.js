globalThis.Scene = document.querySelector(".Scene");
globalThis.Display = document.querySelector(".Display");
globalThis.ValueList = document.querySelector(".ValueList");
globalThis.ObjectList = document.querySelector(".ObjectList");
globalThis.TrailContainer = document.querySelector(".TrailContainer");
globalThis.PartList = document.querySelector(".PartList");
globalThis.Options = document.querySelector(".Options");

globalThis.LoadButton = document.querySelector(".LoadButton");
globalThis.SaveButton = document.querySelector(".SaveButton");

globalThis.Universe = "None";

globalThis.Readonly = {
    Performance: {
        Fps: 0,
        Dt: 0
    },
    BuiltIn: {
        Objects: [
            [
                "Veltrion-6",
                {
                    Mass: 24000,
                    Volume: 32,
                    Velocity: [0,0,60],
                    Position: [0,0]
                },
                {
                    backgroundColor: "rgb(255, 255, 255)",
                    boxShadow: "0 0 64px 2px rgb(255, 255, 255)"
                }
            ],
            [
                "Nyxaris-2B",
                {
                    Mass: 43000,
                    Volume: 64,
                    Velocity: [0,0,40],
                    Position: [0,0]
                },
                {
                    backgroundColor: "rgb(175, 255, 255)",
                    boxShadow: "0 0 64px 2px rgb(175, 255, 255)"
                }
            ],
            [
                "Nexis-44",
                {
                    Mass: 126000,
                    Volume: 128,
                    Velocity: [0,0,40],
                    Position: [0,0]
                },
                {
                    backgroundColor: "rgb(150, 225, 255)",
                    boxShadow: "0 0 128px 16px rgb(150, 225, 255)"
                }
            ],
            [
                "Tirvannis-9",
                {
                    Mass: 408000,
                    Volume: 256,
                    Velocity: [0,0,60],
                    Position: [0,0]
                },
                {
                    backgroundColor: "rgb(120, 200, 255)",
                    boxShadow: "0 0 512px 4px rgb(120, 200, 255)"
                }
            ],
            [
                "Sagittarius A*",
                {
                    Mass: 5120000,
                    Volume: 16,
                    Velocity: [0,0,20],
                    Position: [0,0]
                },
                {
                    backgroundColor: "rgb(0, 0, 0)",
                    boxShadow: "0 0 128px 32px rgb(239, 151, 40)"
                }
            ]
        ]
    }
};

globalThis.Simulation = {
    StepSize: 1
};

globalThis.Random = (Min, Max) => Math.random() * (Max - Min) + Min;
globalThis.RandomSign = () => Math.random() < 0.5 ? -1 : 1;

globalThis.Vector2 = class {
    constructor(Vector = [0, 0]) {
        this.Vector = Vector;
    }

    get Magnitude() {
        return Math.sqrt(this.Vector[0] ** 2 + this.Vector[1] ** 2);
    }

    get Dot() {
        return this.Vector[0] * this.Vector[0] + this.Vector[1] * this.Vector[1];
    }
}

globalThis.Vector3 = class {
    constructor(Vector = [0, 0, 0]) {
        this.Vector = Vector;
    }
}

globalThis.SceneObject = class {
    constructor(Physics = {
        Mass: 1,
        Volume: 1,
        Velocity: new Vector3(),
        Position: new Vector2()
    }, Style = {}) {
        this.Physics = Physics;
        this.Style = Style;
    }

    Append() {
        const Node = document.createElement("div");
        Node.style.left = `${this.Physics.Position.Vector[0]}px`;
        Node.style.top = `${this.Physics.Position.Vector[1]}px`;
        Node.style.width = `${this.Physics.Volume}px`;
        Object.keys(this.Style).forEach(Key => Node.style[Key] = this.Style[Key]);
        Node.style.setProperty("--Width", "0");
        Node.style.setProperty("--Opacity", "0");
        Node.setAttribute("Velocity", JSON.stringify(this.Physics.Velocity.Vector));
        Node.setAttribute("Physics", JSON.stringify(this.Physics));
        Node.setAttribute("Uuid", Uuid(8));
        Node.classList.add("Object", "SceneObject");
        Scene.appendChild(Node);
        return Node;
    }
}

Element.prototype.SendToDebris = function(Parent = document.body, Timeout = 1200) {
    Parent.appendChild(this);
    setTimeout(() => this.remove(), Timeout);
};

globalThis.em = (Value) => Value * 16;

globalThis.Uuid = (Length = 16) => {
    if ((Length & (Length - 1)) !== 0 || Length < 2) return "";

    return Array.from({ length: Length }, () =>
        Math.floor(Math.random() * 16).toString(16)
    ).reduce((Acc, Char, Index) =>
        Acc + (Index && Index % (Length / 2) === 0 ? "-" : "") + Char, ""
    );
};

globalThis.NoNaN = (Value) => {
    if (typeof Value === "number") return isNaN(Value) ? 0 : Value;
    if (Array.isArray(Value)) return Value.map(NoNaN);
    if (typeof Value === "object" && Value !== null) Object.keys(Value).forEach(Key => Value[Key] = NoNaN(Value[Key]));
    return Value;
};

globalThis.Floor = (Value) => {
    if (typeof Value === "number") return Math.floor(Value);
    if (Array.isArray(Value)) return Value.map(Math.floor);
    if (typeof Value === "object" && Value !== null) Object.keys(Value).forEach(Key => Value[Key] = Math.floor(Value[Key]));
    return Value;
}