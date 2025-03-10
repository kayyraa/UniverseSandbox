const G = 0.1;

function DrawTrail(X, Y, Color) {
    const TrailPoint = document.createElement("div");
    TrailPoint.style.left = `${X}px`;
    TrailPoint.style.top = `${Y}px`;
    TrailPoint.style.backgroundColor = Color;
    TrailContainer.appendChild(TrailPoint);

    if (TrailContainer.children.length > 500) TrailContainer.removeChild(TrailContainer.firstChild);
}

function DeltaUpdate() {
    const Dt = Simulation.StepSize;
    Array.from(Scene.children).forEach(PartA => {
        if (!PartA.classList.contains("Object")) return;

        const PartAVelocity = JSON.parse(PartA.getAttribute("Velocity"));
        const PartAPhysics = JSON.parse(PartA.getAttribute("Physics"));
        const PartAMass = PartAPhysics.Mass;

        Array.from(Scene.children).forEach(PartB => {
            if (!PartB.classList.contains("Object") || PartB === PartA) return;

            const PartBPhysics = JSON.parse(PartB.getAttribute("Physics"));
            const PartBMass = PartBPhysics.Mass;

            const Dx = parseFloat(getComputedStyle(PartB).left) - parseFloat(getComputedStyle(PartA).left);
            const Dy = parseFloat(getComputedStyle(PartB).top) - parseFloat(getComputedStyle(PartA).top);
            const Distance = Math.sqrt(Dx * Dx + Dy * Dy);

            if (Distance > 1) {
                const Force = (G * PartAMass * PartBMass) / (Distance * Distance);
                const Acceleration = (Force / (PartAMass + PartA.clientWidth * G)) * Dt;
                const GravitationalForce = Acceleration / Force;
            
                const PartBInfluence = PartBMass / (PartAMass + PartBMass);
            
                PartAVelocity[0] += (Dx / Distance) * Acceleration * PartBInfluence;
                PartAVelocity[1] += (Dy / Distance) * Acceleration * PartBInfluence;
                PartAVelocity[2] += G * (PartBMass / Distance / Dx + Dy) * GravitationalForce * PartBInfluence * Dt;
            }

            const PartABounds = PartA.getBoundingClientRect();
            const PartBBounds = PartB.getBoundingClientRect();
            const PartBVelocity = JSON.parse(PartB.getAttribute("Velocity"));

            if (
                PartABounds.right > PartBBounds.left &&
                PartABounds.left < PartBBounds.right &&
                PartABounds.bottom > PartBBounds.top &&
                PartABounds.top < PartBBounds.bottom
            ) {
                if (PartAMass > PartBMass) {
                    PartAVelocity[0] = ((PartAVelocity[0] * PartAMass + PartBVelocity[0] * PartBMass) / (PartAMass + PartBMass)) * Dt;
                    PartAVelocity[1] = ((PartAVelocity[1] * PartAMass + PartBVelocity[1] * PartBMass) / (PartAMass + PartBMass)) * Dt;
                    PartA.style.width = `${PartA.clientWidth + PartB.clientWidth}px`;
                    PartAPhysics.Mass += PartBMass;
                    PartA.setAttribute("Physics", JSON.stringify(PartAPhysics));
                    PartB.remove();
                } else {
                    PartBVelocity[0] = ((PartAVelocity[0] * PartAMass + PartBVelocity[0] * PartBMass) / (PartAMass + PartBMass)) * Dt;
                    PartBVelocity[1] = ((PartAVelocity[1] * PartAMass + PartBVelocity[1] * PartBMass) / (PartAMass + PartBMass)) * Dt;
                    PartB.style.width = `${PartB.clientWidth + PartA.clientWidth}px`;
                    PartBPhysics.Mass += PartAMass;
                    PartB.setAttribute("Physics", JSON.stringify(PartBPhysics));
                    PartA.remove();
                }
            }
        });

        const TensileStrength = PartAMass * Math.pow(10, 6);
        const Radius = PartA.clientWidth / 2;
        const Volume = (4 / 3) * Math.PI * Math.pow(Radius, 3);

        const Density = PartAMass / Volume;
        const AngularVelocity = Math.abs(Math.sqrt(TensileStrength / (Density * Math.pow(Radius, 2))));

        if (Math.abs(PartAVelocity[2]) > AngularVelocity / (Math.PI * 2) && PartA.clientWidth > 4) {
            const Pieces = Math.floor(AngularVelocity / (Math.PI * 2) / PartA.clientWidth * G);
            for (let Index = 0; Index < Pieces; Index++) {
                const StyleObject = Object.fromEntries(
                    String(PartA.getAttribute("style") || "").split(";").filter(Boolean).map(Property => {
                        let [Key, Value] = Property.split(":").map(Item => Item.trim());
                        return [Key, Value];
                    })
                );
        
                const Angle = (Index / 4) * Math.PI * 2;
                const OffsetX = Math.cos(Angle) * Radius + Angle;
                const OffsetY = Math.sin(Angle) * Radius + Angle;
        
                const Physics = PartAPhysics;
                Physics.Mass = PartAMass / 4;
                Physics.Volume = PartA.clientWidth / 6;
        
                Physics.Velocity = new Vector2([
                    (PartAVelocity[0] / 2) + Angle * RandomSign(),
                    (PartAVelocity[1] / 2) + Angle * RandomSign(),
                    (PartAVelocity[2] / 32) + Angle
                ]);
                
                const Part = new SceneObject(Physics, StyleObject).Append();
                Part.style.left = `${PartA.offsetLeft + OffsetX + 16}px`;
                Part.style.top = `${PartA.offsetTop + OffsetY + 16}px`;
                Part.style.width = `${Physics.Volume}px`;
                Part.classList.add("Debris");
                Part.setAttribute("Physics", JSON.stringify(Physics));
            }

            PartAPhysics.Mass = PartAPhysics.Mass / 4;
            PartAPhysics.Volume = PartAPhysics.Volume / 4;
            PartA.style.width = `${PartA.clientWidth / 4}px`;
            PartA.setAttribute("Physics", JSON.stringify(PartAPhysics));
        }

        const NewX = parseFloat(getComputedStyle(PartA).left) + PartAVelocity[0] * Dt;
        const NewY = parseFloat(getComputedStyle(PartA).top) + PartAVelocity[1] * Dt;

        DrawTrail(NewX + PartA.clientWidth / 2, NewY + PartA.clientHeight / 2, PartA.style.backgroundColor);

        PartA.style.left = `${NewX}px`;
        PartA.style.top = `${NewY}px`;
        PartA.style.rotate = `${(parseFloat(getComputedStyle(PartA).rotate) || 0) + (PartAVelocity[2] / PartA.clientWidth) * Dt}deg`;
        PartA.setAttribute("Velocity", JSON.stringify(PartAVelocity));
    });

    requestAnimationFrame(DeltaUpdate);
}

document.addEventListener("DOMContentLoaded", DeltaUpdate);