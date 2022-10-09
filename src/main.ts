import { GAME_WIDTH, GAME_HEIGHT, LevelStatuses } from "./constants";
import Floor from "./floor";
import Level from "./level";

const canvas = document.querySelector<HTMLCanvasElement>(".canvas");

if (!canvas) throw new Error("No canvas");

const c = canvas.getContext("2d");

if (!c) throw new Error("No canvas context");

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const firstFloor = new Floor(150, 130, 250, 10);
const secondFloor = new Floor(280, 210, 340, 10);
const thirdFloor = new Floor(40, 270, 290, 10);

const levelOne = new Level({ x: 180, y: 20 }, { floorIndex: 2, fromLeft: 30 }, [
    firstFloor,
    secondFloor,
    thirdFloor,
]);

let lastTime = 0;

const gameLoop: FrameRequestCallback = (timeStamp) => {
    if (!c) return;

    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    c.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    levelOne.draw(c, deltaTime);

    if (levelOne.status !== LevelStatuses.IN_PROGRESS) {
        c.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        return;
    }

    requestAnimationFrame(gameLoop);
};

gameLoop(0);

// TEMP click on them to turn them around
document.addEventListener("click", (e) => {
    const leftPadding = canvas.getBoundingClientRect().x;
    const topPadding = canvas.getBoundingClientRect().y;

    levelOne.lemmings.forEach((lemming) => {
        if (
            e.x >= lemming.position.x + leftPadding &&
            e.x <= lemming.position.x + lemming.width + leftPadding &&
            e.y >= lemming.position.y + topPadding &&
            e.y <= lemming.position.y + lemming.height + topPadding
        ) {
            lemming.turnAround();
        }
    });
});
