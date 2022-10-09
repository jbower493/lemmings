import { Directions, LEMMING_SPEED, LemmingStatuses } from "./constants";

class Lemming {
    width: number = 10;
    height: number = 15;
    position: { x: number; y: number };
    direction: Directions;
    previousDirections: Directions[];
    status: LemmingStatuses;

    constructor(startingX: number, startingY: number) {
        this.position = { x: startingX, y: startingY };
        this.direction = Directions.DOWN;
        this.previousDirections = [];
        this.status = LemmingStatuses.LIVE;
    }

    draw(c: CanvasRenderingContext2D) {
        c.fillStyle = "red";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    updatePosition(deltaTime: number) {
        if (!deltaTime) return;

        switch (this.direction) {
            case Directions.DOWN:
                this.position.y += LEMMING_SPEED / deltaTime;
                break;
            case Directions.RIGHT:
                this.position.x += LEMMING_SPEED / deltaTime;
                break;
            case Directions.LEFT:
                this.position.x -= LEMMING_SPEED / deltaTime;
                break;
            default:
                break;
        }
    }

    hitFloor(floorY: number) {
        const newDirection =
            this.previousDirections.find((dir) =>
                [Directions.LEFT, Directions.RIGHT].includes(dir)
            ) || Directions.RIGHT;
        this.changeDirection(newDirection);
        this.position.y = floorY - this.height;
    }

    fall() {
        this.changeDirection(Directions.DOWN);
    }

    changeDirection(newDir: Directions) {
        this.direction = newDir;
        this.previousDirections = [newDir, ...this.previousDirections].slice(
            0,
            4
        );
    }

    turnAround() {
        if (![Directions.RIGHT, Directions.LEFT].includes(this.direction))
            return;

        if (this.direction === Directions.RIGHT) {
            this.changeDirection(Directions.LEFT);
        } else {
            this.changeDirection(Directions.RIGHT);
        }
    }

    reachHome() {
        this.status = LemmingStatuses.HOME;
    }
}

export default Lemming;
