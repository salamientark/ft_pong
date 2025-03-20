/* ************************************************************************** */
/*                                GLOBAL VARIABLES                            */
/* ************************************************************************** */
/*
 * Defnining canvas and context */
var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
var	start_button: HTMLButtonElement;
var	reset_button: HTMLButtonElement;

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
var		BALL_RADIUS: number;
/* Terrain draw */
const	TERRAIN_COLOR: string = "#FFFFFF";
var		TERRAIN_LINE_FAT: number;

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
	if (!canvas)
		throw new Error("Canvas context not found");
	if (!ctx)
		throw new Error("Context not found");
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	draw_player(game.player_1);
	draw_player(game.player_2);
	draw_ball(game.ball);
	game.ball.pos = { x: game.ball.pos.x + game.ball.direction.x * game.ball.speed,
						y: game.ball.pos.y + game.ball.direction.y * game.ball.speed };
}

/* ************************************************************************** */
/*                                      GAME                                  */
/* ************************************************************************** */
function start_game(p1_name: string, p2_name: string) {
	if (!canvas)
		throw new Error("Canvas not found");
	if (!p1_name || !p2_name)
		throw new Error("Invalid player name");
	game = new Pong(p1_name, p2_name, { x: canvas.width / 2, y: canvas.height / 2 });
	game.ball.direction = { x: 0.5, y: 0.5 };
	game.ball.speed = 1;
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
 * @brief Show canvas when game start
 */
function show_canvas() {
	if (!canvas)
		throw new Error("Canvas not found.");
	canvas.style.display = 'block';
}

/**
 * @brief Hide canvas when game start
 */
function hide_canvas() {
	if (!canvas)
		throw new Error("Canvas not found.");
	canvas.style.display = 'none';
}

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
}

function load_script() {
	try {
		/* Set var */
		start_button = document.getElementById("button_start_game") as HTMLButtonElement;
		if (!start_button)
			throw new Error("Start button not found.");
		reset_button = document.getElementById("reset_button") as HTMLButtonElement;
		if (!reset_button)
			throw new Error("Reset button not found.");
		canvas = document.getElementById("pong_canvas") as HTMLCanvasElement;
		if (!canvas)
			throw new Error("Canvas not found");
		ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
		if (!ctx)
			throw new Error("Context not found");

		/* Set events listeners */
		start_button.addEventListener("click", () => {
			canvas.style.display = 'block';
			start_button.style.display = 'none';
			reset_button.style.display = 'block';
			/* Start game */
			resizeCanvas();
			start_game("Jojo", "Lili");
		});
		reset_button.addEventListener("click", () => {
			canvas.style.display = 'none';
			start_button.style.display = 'block';
			reset_button.style.display = 'none';

		});
		window.addEventListener("resize", resizeCanvas);

	}
	catch(err: any) {
		console.log(err);
	}
}

// window.addEventListener("resize", resizeCanvas);
// resizeCanvas();
// start_game("Jojo", "Lala");
load_script();
