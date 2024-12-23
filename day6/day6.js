const isObstacle = (x, y, obstacles) => obstacles.includes(`${x},${y}`);
const isEnd = (x, y, input) => x < 0 || x >= input[0].length || y < 0 || y >= input.length;

export const part1 = (input) => {
    // Finds coordinates of the guard by checking if ^ can be found in each
    // line. Return index with index of line.
    let [guardX, guardY] = input.reduce((acc, line, i) => {
        return line.indexOf('^') != -1 ? [line.indexOf('^'), i] : acc;
    }, [-1, -1]);

    let obstacles = [];
    for (let y = 0; y < input.length; y++) {
        const matches = [...input[y].matchAll(/\#/g)].map(e => `${e.index},${y}`)
        obstacles = [...obstacles, ...matches]
    }

    let dirX = 0;
    let dirY = -1;

    let visited = new Set([`${guardX},${guardY}`]);
    while (!isEnd(guardX + dirX, guardY + dirY, input)) {
        // Turn 90 degrees. If we're going up/down x becomes the opposite way 
        // that we were going. If we're going left/right y becomes the same direction
        // we were going.
        if (isObstacle(guardX + dirX, guardY + dirY, obstacles)) {
            if (dirX === 0) {
                dirX = -dirY;
                dirY = 0;
            } else if (dirY === 0) {
                dirY = dirX;
                dirX = 0;
            }
        } else {
            // Don't put this in an else, this skips an extra iteration.
            guardX += dirX;
            guardY += dirY;
            visited.add(`${guardX},${guardY}`);
        }
    }

    return visited.size;
}

export const part2 = (input) => {
    // Finds coordinates of the guard by checking if ^ can be found in each
    // line. Return index with index of line.
    let [guardX, guardY] = input.reduce((acc, line, i) => {
        return line.indexOf('^') != -1 ? [line.indexOf('^'), i] : acc;
    }, [-1, -1]);

    let obstacles = [];
    for (let y = 0; y < input.length; y++) {
        const matches = [...input[y].matchAll(/\#/g)].map(e => `${e.index},${y}`)
        obstacles = [...obstacles, ...matches]
    }


    let sum = 0;
    for (let x = 0; x < input[0].length; x++) {
        for (let y = 0; y < input.length; y++) {
i           // Recreate the obstacles loop with the new obstacle instead of 
            // tampering with the old one.
            let newObstacles = [...obstacles, `${x},${y}`];

            // Keep track of all the places we've found an obstacle.
            let foundObstacles = [];

            // Reset the currX and currY to the starting position at the start
            // of every iteration.
            let currX = guardX;
            let currY = guardY;
            
            let dirX = 0;
            let dirY = -1;

            let visited = new Set([`${currX},${currY}`]);
            while (!isEnd(currX + dirX, currY + dirY, input)) {
                // Turn 90 degrees. If we're going up/down x becomes the opposite way 
                // that we were going. If we're going left/right y becomes the same direction
                // we were going.
                if (isObstacle(currX + dirX, currY + dirY, newObstacles)) {
                    // If we reach an obstacle on the same rotation/place twice we've encountered a loop.
                    if (foundObstacles.includes(`${currX},${currY}|${currX + dirX},${currY + dirY}`)) {
                        sum++;

                        // I do not like breaking in a while loop but it's the simplest way to do this.
                        break;
                    }
                    foundObstacles.push(`${currX},${currY}|${currX + dirX},${currY + dirY}`);
                    if (dirX === 0) {
                        dirX = -dirY;
                        dirY = 0;
                    } else if (dirY === 0) {
                        dirY = dirX;
                        dirX = 0;
                    }
                } else {
                    // Don't put this in an else, this skips an extra iteration.
                    currX += dirX;
                    currY += dirY;
                    visited.add(`${currX},${currY}`);
                }
            }
        }
    }

    return sum;
}
