export const prepareInput = (input) => input.trim().split('\n');

const formatData = (inputGrid) => {
    // Find all the digits, or lower- and uppercase letters in a line and save them as objects with coords and types
    // We also now have [[{}, {}], [{}], ...] with a list of matches for each line. Since
    // coords are stored in objects we can flatten the array, this also directly removes
    // empty lines.
    return inputGrid
        .flatMap((line, i) => [...line.matchAll(/[A-Za-z0-9]/g)].map(match => ({ type: match[0], x: match.index, y: i })))
        // Create an object sorted by each type. { A: [{}, {}], O: [{}, {}] }
        .reduce((acc, curr) => {
            if (acc.hasOwnProperty(curr.type)) {
                acc[curr.type].push(curr);
            } else {
                acc[curr.type] = [curr]
            }

            return acc;
        }, {});
}

const inRange = (x, y, input) => {
    return x >= 0 && x < input[0].length && y >= 0 && y < input.length;
}

export const part1 = (input) => {
    const antiNodes = new Set();
    const antennasByType = formatData(input);

    // Loop over each type in the map.
    for (const antennas of Object.values(antennasByType)) {
        // Loop over each combination
        for (const first of antennas) {
            for (const second of antennas) {
                if (first.x == second.x && first.y === second.y) continue;

                const deltaX = first.x - second.x;
                const deltaY = first.y - second.y;

                if (inRange(first.x + deltaX, first.y + deltaY, input)) {
                    antiNodes.add(`${first.x + deltaX},${first.y + deltaY}`);
                } else if (inRange(second.x - deltaX, second.y - deltaY, input)) {
                    antiNodes.add(`${second.x - deltaX},${second.y - deltaY}`);
                }
            }
        }
    }

    return antiNodes.size;
}

export const part2 = (input) => {
    const antiNodes = new Set();
    const antennasByType = formatData(input);

    // Loop over each type in the map.
    for (const antennas of Object.values(antennasByType)) {
        // Loop over each combination
        for (const first of antennas) {
            for (const second of antennas) {
                // We don't want to check an antenna against itself.
                if (first.x == second.x && first.y === second.y) continue;

                // Don't directly change the objects, clone them.
                const firstCopy = { ...first };
                const secondCopy = { ...second };

                // Add the objects themselves since they will also be part of 
                // the line.
                antiNodes.add(`${firstCopy.x},${firstCopy.y}`);
                antiNodes.add(`${secondCopy.x},${secondCopy.y}`);

                const deltaX = firstCopy.x - secondCopy.x;
                const deltaY = firstCopy.y - secondCopy.y;

                // Add antinodes while you're in range.
                while (inRange(firstCopy.x + deltaX, firstCopy.y + deltaY, input)) {
                    antiNodes.add(`${firstCopy.x + deltaX},${firstCopy.y + deltaY}`);
                    firstCopy.x += deltaX;
                    firstCopy.y += deltaY;
                }  

                while (inRange(secondCopy.x - deltaX, secondCopy.y - deltaY, input)) {
                    antiNodes.add(`${secondCopy.x - deltaX},${secondCopy.y - deltaY}`);
                    secondCopy.x -= deltaX;
                    secondCopy.y -= deltaY;
                }
            }
        }
    }

    return antiNodes.size;
}
