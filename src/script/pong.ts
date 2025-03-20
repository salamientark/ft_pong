/* ************************************************************************** */
/*                                GLOBAL VARIABLES                            */
/* ************************************************************************** */
/*
 * Defnining canvas and context
 */
const canvas = document.getElementById("pong_canvas") as HTMLCanvasElement | null;
if (!canvas)
	throw new Error("Canvas not found");
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D | null;
if (!ctx)
	throw new Error("Context not found");

/*
 * Define drawing var
 */
const	GOLDEN_NUMBER: number = 1.618033;
const	PLAYER_WIDTH_RATIO: number = 0.09;
const	PLAYER_WIDTH_HEIGHT_RATIO: number = 10;
var		PLAYER_HEIGHT: number;
var		PLAYER_WIDTH: number;
const	PLAYER_COLOR: string = "#FFFFFF";

/* Ball */
const	BALL_COLOR: string = "#FFFFFF";
var		BALL_RADIUS: number = 0.01 * Math.min(canvas.width, canvas.height);
/* Terrain draw */
const	TERRAIN_COLOR: string = "#FFFFFF";
var		TERRAIN_LINE_FAT: number = 0.01 * Math.max(canvas.width, canvas.height);

/* Game status variable */
var		intervalID: number;
var		endGame: boolean = false;
var		game: Pong;

/* ************************************************************************** */
/*                              CLASSES && INTERFACES                         */
/* ************************************************************************** */
interface Vec2 {
	x: number;
	y: number;
}

class Player {
	name: string;
	score: number;
	pos: Vec2;

	constructor(name: string, pos: Vec2) {
		this.name = name;
		this.score = 0;
		this.pos = pos;
	}
}

class Ball {
	pos: Vec2;
	direction: Vec2;
	speed: number;

	constructor(pos: Vec2) {
		this.pos = pos;
		this.direction = { x: 0, y: 0 };
		this.speed = 0;
	}
}

class Pong {
	player_1: Player;
	player_2: Player;
	ball: Ball;
	score_max: number;

	constructor(player_1_name: string, player_2_name: string, center: Vec2) {
		if (!canvas)
			throw new Error("Canvas not found.");
		const player_offset = 0.05 * canvas.width;
		this.player_1 = new Player(player_1_name,
							{ x: player_offset, y: (canvas.height - PLAYER_WIDTH) / 2});
		this.player_2 = new Player(player_2_name,
						 { x: canvas.width - player_offset - PLAYER_HEIGHT, y: (canvas.height - PLAYER_WIDTH) / 2 });
		this.ball = new Ball(center);
		this.score_max = 5;
	}
}

/* ************************************************************************** */
/*                                       DRAW                                 */
/* ************************************************************************** */
/**
 * @brief Draw basic pong terrain
 */
function draw_terrain() {
	if (!canvas)
		throw new Error("Canvas not found");
	if (!ctx)
		throw new Error("Context not found");
	if (window.innerWidth > window.innerHeight) {
		ctx.rect(0, 0, canvas.width, TERRAIN_LINE_FAT); // Top line
		ctx.rect(0, 0, TERRAIN_LINE_FAT, canvas.height); // Left line
		ctx.rect(0, canvas.height - TERRAIN_LINE_FAT, canvas.width, TERRAIN_LINE_FAT); // Bottom line
		ctx.rect(canvas.width - TERRAIN_LINE_FAT, 0, TERRAIN_LINE_FAT, canvas.height); // Right line
	}
	else {
		ctx.rect(0, 0, canvas.height, TERRAIN_LINE_FAT); // Top line
		ctx.rect(0, 0, TERRAIN_LINE_FAT, canvas.width); // Left line
		ctx.rect(0, canvas.width - TERRAIN_LINE_FAT, canvas.height, TERRAIN_LINE_FAT); // Bottom line
		ctx.rect(canvas.height - TERRAIN_LINE_FAT, 0, TERRAIN_LINE_FAT, canvas.width); // Right line
	}
	ctx.fillStyle = TERRAIN_COLOR;
	ctx.fill();
}

/**
 * @brief Draw the two players
 */
function draw_player(player: Player) {
	if (!canvas)
		throw new Error("Canvas not found");
	if (!ctx)
		throw new Error("Context not found");

	ctx.beginPath();
	ctx.rect(player.pos.x, player.pos.y, PLAYER_HEIGHT, PLAYER_WIDTH);
	ctx.fillStyle = PLAYER_COLOR;
	ctx.fill();
	ctx.closePath();
}

function draw_ball(ball: Ball) {
	if (!ctx)
		throw new Error("Context not found.");
	ctx.beginPath();
	ctx.arc(ball.pos.x, ball.pos.y, BALL_RADIUS, 0, 2 * Math.PI);
	ctx.fillStyle = BALL_COLOR;
	ctx.fill();
	ctx.closePath();
}

/**
 * @brief Draw the pong game frame
 */
function draw() {
	if (!ctx)
		throw new Error("Context not found");
	draw_player(game.player_1);
	draw_player(game.player_2);
	draw_ball(game.ball);
}

/* ************************************************************************** */
/*                                      GAME                                  */
/* ************************************************************************** */
function pong(p1_name: string, p2_name: string) {
	if (!canvas)
		throw new Error("Canvas not found");
	if (!p1_name || !p2_name)
		throw new Error("Invalid player name");
	game = new Pong(p1_name, p2_name, { x: canvas.width / 2, y: canvas.height / 2 });
	let end_game = false;
	function game_loop() {
		if (game.player_1.score >= game.score_max || game.player_2.score >= game.score_max) {
			end_game = true;
			clearInterval(intervalID);
			return ;
		}
		draw();
	}
	const intervalID = setInterval(game_loop, 10);
}

/* ************************************************************************** */
/*                                    SPECIAL                                 */
/* ************************************************************************** */
/**
 * @brief REsize canvas for "Responsivness"
 */
function resizeCanvas() {
	if (!ctx)
		throw new Error("Context not found");
	if (!canvas)
		throw new Error("Canvas not found");

	/* Rotate canvas if needed */
	if (window.innerHeight > window.innerWidth) {
		canvas.height = window.innerHeight * 0.8;
		canvas.width = canvas.height / GOLDEN_NUMBER;

		/* Rotate */
        ctx.translate(canvas.width / 2, canvas.height / 2); // Move to center
        ctx.rotate(Math.PI / 2); // Rotate 90 degrees
        ctx.translate(-canvas.height / 2, -canvas.width / 2); // Move back
	}
	else {
		canvas.width = window.innerWidth * 0.8;
		canvas.height = canvas.width / GOLDEN_NUMBER;

		/* Rotate */
        ctx.rotate(0); // No rotation needed for portrait
	}
	PLAYER_WIDTH = canvas.width * PLAYER_WIDTH_RATIO;
	PLAYER_HEIGHT = PLAYER_WIDTH / PLAYER_WIDTH_HEIGHT_RATIO;
	TERRAIN_LINE_FAT = 0.01 * Math.max(canvas.width, canvas.height);
	BALL_RADIUS = 0.01 * Math.min(canvas.width, canvas.height);
	// draw();
}

/*
 * Resize canva on window resize and window load
 */
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
pong("Jojo", "Lala");
