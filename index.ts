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
  left: (point: Point): Point => [point[0] - 1, point[1]],
  right: (point: Point): Point => [point[0] + 1, point[1]],
  up: (point: Point): Point => [point[0], point[1] - 1],
  down: (point: Point): Point => [point[0], point[1] + 1],
  topLeft: (point: Point): Point => [point[0] - 1, point[1] - 1],
  topRight: (point: Point): Point => [point[0] + 1, point[1] - 1],
  bottomLeft: (point: Point): Point => [point[0] - 1, point[1] + 1],
  bottomRight: (point: Point): Point => [point[0] + 1, point[1] + 1],
};

const InitialLookupOrder = [
  Look.right,
  Look.bottomLeft,
  Look.down,
  Look.bottomRight,
];

const LookupOrder = [
  Look.left,
  Look.right,
  Look.bottomLeft,
  Look.down,
  Look.bottomRight,
];

const parse = (rawGrid: string): Grid => {
  const grid: number[][] = [];
  const gridArray = rawGrid.split(" ").map((tile) => parseInt(tile));

  for (let i = 0; i < 8; i++) {
    grid.push(gridArray.splice(0, 5));
  }

  return grid as Grid;
};

const findSecondTile = (grid: Grid, point: Point): Point | undefined => {
  const pointValue = grid[point[1]][point[0]];

  for (const direction of InitialLookupOrder) {
    const nextPoint = direction(point);
    if (grid[nextPoint[1]] && grid[nextPoint[1]][nextPoint[0]] === pointValue) {
      return nextPoint;
    }
  }

  return undefined;
};

// search for the start tile. check second tile each time until valid one is found.
const findStartingTiles = (grid: Grid): [Point, Point] => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const secondTile = findSecondTile(grid, [x, y]);
      if (secondTile) {
        return [[x, y], secondTile];
      }
    }
  }
  throw new Error("No start tile found.");
};

const getNextTile = (grid: Grid, point: Point): Point | undefined => {
  const pointValue = grid[point[1]][point[0]];

  for (const direction of LookupOrder) {
    const nextPoint = direction(point);
    const nextPointValue = grid[nextPoint[1]][nextPoint[0]];

    if (nextPointValue === pointValue || nextPointValue === pointValue * 2) {
      return nextPoint;
    }
  }
  return undefined;
};

const findPath = (grid: Grid) => {
  const path: Point[] = [];
  const startingTiles = findStartingTiles(grid);
  path.push(...startingTiles);

  let previousTile = startingTiles[0];
  let nextTile: Point | undefined = startingTiles[1];

  while (nextTile) {
    path.push(nextTile);

    previousTile = nextTile;
    nextTile = getNextTile(grid, nextTile);

    if (nextTile === previousTile) {
      continue;
    }

    if (nextTile) {
      path.push(nextTile);
    }
  }

  return path;
};

/* Tests */

const samples = [
  `8 128 4 128 32 16 16 4 256 16 32 4 16 64 4 8 64 64 256 8 16 2 2 256 4 32 128 2 64 8 256 32 128 16 2 8 64 64 128 32`,
  `256 128 64 128 32 32 16 8 256 16 4 2 16 64 4 4 128 32 256 8 16 16 64 256 4 32 64 2 64 8 256 2 128 16 2 8 128 256 4 32`,
  `256 16 256 2 32 2 32 2 16 8 32 2 256 64 16 4 2 128 2 32 8 8 32 256 2 2 4 8 32 128 2 16 32 64 256 4 2 128 4 8`,
  `256 16 256 2 32 2 32 2 16 8 32 2 256 64 16 4 2 128 2 32 8 8 32 256 2 2 4 8 32 128 2 16 32 64 256 4 2 128 4 8`,
  `4 16 8 2 32 2 2 8 32 4 2 16 16 4 128 128 32 4 2 128 128 64 8 128 128 4 2 16 32 16 8 8 128 64 32 32 8 128 2 128`,
];

const main = () => {
  for (const sample of samples) {
    const grid = parse(sample);
    console.table(grid);
    console.log("\n");
    console.log(findPath(grid));
  }
};

main();
