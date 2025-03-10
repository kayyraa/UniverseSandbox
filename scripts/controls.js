document.addEventListener("wheel", (Event) => {
    const Target = Event.target;
    if (Target !== Scene) return;

    const Step = Math.abs(Math.max(window.Simulation.StepSize / 10, 0.0625));

    const DeltaY = Event.deltaY;
    if (DeltaY < 0) window.Simulation.StepSize = Math.min(window.Simulation.StepSize + Step, 10);
    else if (DeltaY > 0) window.Simulation.StepSize = Math.max(window.Simulation.StepSize - Step, -10);
});