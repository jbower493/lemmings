const canvas = document.querySelector<HTMLCanvasElement>(".canvas");

if (!canvas) throw new Error("No canvas");

const ctx = canvas.getContext("2d");

if (!ctx) throw new Error("No canvas context");

ctx.canvas.width = 700;
ctx.canvas.height = 300;
