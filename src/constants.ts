export const GAME_WIDTH = 700;
export const GAME_HEIGHT = 300;

export const HOME_WIDTH = 40;
export const HOME_HEIGHT = 30;

export const LEMMING_SPEED = 15;

export enum Directions {
    DOWN = "DOWN",
    RIGHT = "RIGHT",
    LEFT = "LEFT",
}

export enum LemmingStatuses {
    LIVE = "LIVE",
    DEAD = "DEAD",
    HOME = "HOME",
}

export enum LevelStatuses {
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
}
