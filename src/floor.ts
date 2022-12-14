class Floor {
    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(c: CanvasRenderingContext2D) {
        c.fillStyle = "black";
        c.fillRect(this.x, this.y, this.width, this.height);
    }
}

export default Floor;
