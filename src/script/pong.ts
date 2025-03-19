/*
 * Defnining canvas and context
 */
const canvas = document.getElementById("pong_canvas") as HTMLCanvasElement | null;
if (!canvas)
	throw new Error("Canvas not found");
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | null;
if (!ctx)
	throw new Error("Context not found");

/**
 * Define drawing var
 */
const	golden_nbr: number = 1.618033;
const	player_width_ratio: number = 0.09;
const	player_width_height_ratio: number = 10;
var		player_height: number;
var		player_width: number;

function draw_terrain() {
	
}

/**
 * @brief Draw the pong game frame
 */
function draw() {
	if (!ctx)
		throw new Error("Context not found");
	ctx.beginPath();
	ctx.rect(20, 40, player_height, player_width);
	ctx.fillStyle = "#FFFFFF";
	ctx.fill();
	ctx.closePath();
}
setInterval(draw, 10);

function resizeCanvas() {
	if (!canvas) {
		throw new Error("Canvas not found");
	}

	// if (window.innerWidth > 1920)
	// 	canvas.width = 1900;
	// else if (window.innerWidth > 720)
	// 	canvas.width = 700;
	// else if (window.innerWidth > 480)
	// 	canvas.width = 460;
	// else
	// 	canvas.width = 280;
	if (window.innerWidth > window.innerHeight * golden_nbr) {
		canvas.width = window.innerWidth * 0.9;
		canvas.height = canvas.width / golden_nbr;
	}
	else {
		canvas.height = window.innerHeight * 0.7;
		canvas.width = canvas.height * golden_nbr
	}
	player_width = canvas.width * player_width_ratio;
	player_height = player_width / player_width_height_ratio;
}

/*
 * Resize canva on window resize and window load
 */
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
