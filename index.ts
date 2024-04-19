type Point = [number, number];
type Grid = [
  [number, number, number, number, number],
  [number, number, number, number, number],
  [number, number, number, number, number],
  [number, number, number, number, number],
  [number, number, number, number, number],
  [number, number, number, number, number],
  [number, number, number, number, number],
  [number, number, number, number, number],
];

const Look = {
  left: (point: Point): Point => [point[0], point[1] - 1],
  right: (point: Point): Point => [point[0], point[1] + 1],
  up: (point: Point): Point => [point[0] - 1, point[1]],
  down: (point: Point): Point => [point[0] + 1, point[1]],
  topLeft: (point: Point): Point => [point[0] - 1, point[1] - 1],
  topRight: (point: Point): Point => [point[0] - 1, point[1] + 1],
  bottomLeft: (point: Point): Point => [point[0] + 1, point[1] - 1],
  bottomRight: (point: Point): Point => [point[0] + 1, point[1] + 1],
};

const parse = (rawGrid: string): Grid => {
  const grid: number[][] = [];
  const gridArray = rawGrid.split(" ").map((cell) => parseInt(cell));

  for (let i = 0; i < 8; i++) {
    grid.push(gridArray.splice(0, 5));
  }

  return grid as Grid;
};

const LookupOrder = [Look.right, Look.bottomLeft, Look.down, Look.bottomRight];

const findSecondTile = (grid: Grid, point: Point): Point | undefined => {
  const pointValue = grid[point[0]][point[1]];

  for (const direction of LookupOrder) {
    const nextPoint = direction(point);
    if (grid[nextPoint[0]] && grid[nextPoint[0]][nextPoint[1]] === pointValue) {
      return nextPoint;
    }
  }

  return undefined;
};

// search for the start tile. check second tile each time until valid one is found.
const findStartTile = (grid: Grid): Point => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 2) {
        const secondTile = findSecondTile(grid, [i, j]);
        if (secondTile) {
          return [i, j];
        }
      }
    }
  }
  throw new Error("No start tile found.");
};

const findPath = (grid: string[][]) => {};

/* Tests */

const samples = [
  `8 128 4 128 32 16 16 4 256 16 32 4 16 64 4 8 64 64 256 8 16 2 2 256 4 32 128 2 64 8 256 32 128 16 2 8 64 64 128 32`,
];

const main = () => {
  for (const sample of samples) {
    const grid = parse(sample);
    console.log(grid);
    console.log(findStartTile(grid));
  }
};

main();
