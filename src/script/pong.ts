/*
 * Defnining canvas and context
 */
const canvas = document.getElementById("pong_canvas") as HTMLCanvasElement | null;
if (!canvas)
	throw new Error("Canvas not found");
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | null;
if (!ctx)
	throw new Error("Context not found");


function draw() {
	if (!ctx)
		throw new Error("Context not found");
	ctx.beginPath();
	ctx.rect(20, 40, 50, 50);
	ctx.fillStyle = "#FF0000";
	ctx.fill();
	ctx.closePath();
}
setInterval(draw, 10);

function resizeCanvas() {
	if (!canvas) {
		throw new Error("Canvas not found");
	}
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

/*
 * Resize canva on window resize and window load
 */
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
