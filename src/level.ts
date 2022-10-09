import Floor from "./floor";
import Lemming from "./lemming";
import {
    HOME_WIDTH,
    HOME_HEIGHT,
    Directions,
    LemmingStatuses,
    LevelStatuses,
} from "./constants";

class Level {
    start: { x: number; y: number };
    home: { floorIndex: number; fromLeft: number };
    floors: Floor[];
    lemmings: Lemming[];
    maxLemmings = 5;
    spawnFrequency: number = 1500;
    spawnInterval: null | number;
    status: LevelStatuses;

    constructor(
        start: { x: number; y: number },
        home: { floorIndex: number; fromLeft: number },
        floors: Floor[]
    ) {
        this.start = start;
        this.home = home;
        this.floors = floors;
        this.status = LevelStatuses.IN_PROGRESS;

        this.lemmings = [this.genLemming()];

        this.spawnInterval = setInterval(() => {
            this.spawnLemming();
        }, this.spawnFrequency);
    }

    private drawStart(c: CanvasRenderingContext2D) {
        c.fillStyle = "blue";
        c.fillRect(this.start.x, this.start.y, HOME_WIDTH, HOME_HEIGHT);
    }

    private drawHome(c: CanvasRenderingContext2D) {
        c.fillStyle = "green";
        c.fillRect(
            this.floors[this.home.floorIndex].x + this.home.fromLeft,
            this.floors[this.home.floorIndex].y - HOME_HEIGHT,
            HOME_WIDTH,
            HOME_HEIGHT
        );
    }

    private genLemming() {
        const newLemming = new Lemming(
            this.start.x + HOME_WIDTH / 2,
            this.start.y + HOME_HEIGHT
        );

        return newLemming;
    }

    private spawnLemming() {
        if (this.spawnInterval && this.lemmings.length >= this.maxLemmings) {
            return clearInterval(this.spawnInterval);
        }

        this.lemmings.push(this.genLemming());
    }

    private sendLemmingHome(lemmingIndex: number) {
        this.lemmings[lemmingIndex].reachHome();
    }

    draw(c: CanvasRenderingContext2D, deltaTime: number) {
        this.floors.forEach((floor) => floor.draw(c));
        this.drawStart(c);
        this.drawHome(c);

        // check each lemming for any events
        this.lemmings.forEach((lemming, index) => {
            switch (lemming.direction) {
                case Directions.DOWN: {
                    // hitting a floor
                    const floorHit = this.floors.find(
                        (floor) =>
                            // Check if the bottom corners of the lemming are within the area of any floors
                            lemming.position.x + lemming.width >= floor.x &&
                            lemming.position.x <= floor.x + floor.width &&
                            lemming.position.y + lemming.height <
                                floor.y + floor.height &&
                            lemming.position.y + lemming.height >= floor.y
                    );
                    if (floorHit) lemming.hitFloor(floorHit.y);
                    break;
                }
                case Directions.RIGHT:
                    // falling off right side of a floor
                    const currentFloor = this.floors.find(
                        (floor) =>
                            floor.y === lemming.position.y + lemming.height
                    );

                    if (!currentFloor) break;

                    if (
                        currentFloor &&
                        lemming.position.x > currentFloor.x + currentFloor.width
                    )
                        lemming.fall();

                    // reaching home
                    if (
                        lemming.position.x + lemming.width >=
                            this.floors[this.home.floorIndex].x +
                                this.home.fromLeft &&
                        this.floors.indexOf(currentFloor) ===
                            this.home.floorIndex
                    )
                        this.sendLemmingHome(index);
                    break;
                case Directions.LEFT: {
                    // falling off left side of a floor
                    const currentFloor = this.floors.find(
                        (floor) =>
                            floor.y === lemming.position.y + lemming.height
                    );

                    if (!currentFloor) break;

                    if (
                        currentFloor &&
                        lemming.position.x + lemming.width < currentFloor.x
                    )
                        lemming.fall();

                    // reaching home
                    if (
                        lemming.position.x <=
                            this.floors[this.home.floorIndex].x +
                                this.home.fromLeft +
                                HOME_WIDTH &&
                        this.floors.indexOf(currentFloor) ===
                            this.home.floorIndex
                    )
                        this.sendLemmingHome(index);
                    break;
                }
                default:
                    break;
            }

            if (lemming.status === LemmingStatuses.LIVE) {
                lemming.updatePosition(deltaTime);
                lemming.draw(c);
            }
        });

        const lemmingsHome = this.lemmings.filter(
            (lemming) => lemming.status === LemmingStatuses.HOME
        ).length;

        if (lemmingsHome === this.maxLemmings) this.completeLevel();
    }

    completeLevel() {
        this.status = LevelStatuses.COMPLETED;
    }
}

export default Level;
