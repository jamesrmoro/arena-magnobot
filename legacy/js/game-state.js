let score = 0;
let highscore = 0;
let gameOver = false;

let direction = "right";
let nextDirection = "right";

let snake = [];
let box = null;
let ghost = null;
let powerUp = null;

let robotState = "normal";
let robotActive = false;

let boxesCollected = 0;
let powerUpQueue = [];
let powerUpDelayCounter = 0;
let allPowerUpsCollected = false;

let robotSequenceInterval;
let robotSwitchTimeout;

const stage = new createjs.Stage("gameCanvas");
