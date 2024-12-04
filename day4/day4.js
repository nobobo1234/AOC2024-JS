import fs from 'fs';

const input = fs.readFileSync('day4.txt', 'utf-8').trim().split('\n');

const part1 = (input) => {
    const rows = input.map(row => row.split(''));

    const columns = []
    let diagonals = [];
    for (let i = 0; i < rows[0].length; i++) {
        // Create columns;
        columns.push(rows.map(row => row[i])) 

        let yDiag = i;
        let xDiag = 0;
        let fourDiagonals = [[], [], [], []];
        while (xDiag < rows[0].length && yDiag < rows.length) {
            // Find all the four diagonals at the same time
            // 1. First diagonal is from left up to right down going down each iteration
            fourDiagonals[0].push(input[yDiag][xDiag]);

            // 2. Second diagonal is from top right to bottom left.
            fourDiagonals[1].push(input[yDiag][rows[0].length - 1 - xDiag]);

            if (xDiag !== yDiag) {
                // Since the word search is square we can add the opposite 
                // vertical (same as matrix transpose x,y -> y,x) to a second
                // diagonal if we're not in the first diagonal where x = y the whole
                // time.
                fourDiagonals[2].push(input[xDiag][yDiag]);

                // For the other diagonal we just need to do the coordinates - our 
                // current row. For diagonal D = (2, 1) from top right to left bottom 
                // the opposite diagonal starts at O = (1, 0).
                // xOx
                // xxD
                // xxx
                fourDiagonals[3].push(input[yDiag - i][rows[0].length - 1  - xDiag - i]);
            }

            xDiag++;
            yDiag++;
        }

        diagonals = [...diagonals, ...fourDiagonals];
    }

    let amountOfXmas = 0;
    let re = /XMAS/g

    // Counts amount of matches of regex in an array (that should be string)
    // Converts array to string to use atching.
    let count = (array, regex) => (array.join('').match(regex) || []).length; 

    // Does the same but with the reverse because word searches allow for reverse
    // finds.
    let countNormalAndReverse = (array, regex) => 
        count(array, regex) + count(array.reverse(), regex);

    // Loop over rows and columns at the same time since word search is square.
    for (let i = 0; i < rows.length; i++) {
        amountOfXmas += countNormalAndReverse(columns[i], re);
        amountOfXmas += countNormalAndReverse(rows[i], re);
    }

    for (const diagonal of diagonals) {
        amountOfXmas += countNormalAndReverse(diagonal, re);
    }

    return amountOfXmas;
}

const part2 = (input) => {
    // Gets the two 1-distance diagonals with (x, y) as its middle point. So:
    // 0.0
    // .0.
    // 0.0
    let getDiagonals = (input, x, y) => {
        let firstDiag = input[y - 1][x - 1] + input[y][x] + input[y + 1][x + 1];
        let secondDiag = input[y - 1][x + 1] + input[y][x] + input[y + 1][x - 1];

        return [firstDiag, secondDiag];
    }

    // Start at 1 to prevent boundary issues. And an X-MAS can't appear 
    // directly on the side.
    let count = 0;
    for (let y = 1; y < input.length - 1; y++) {
        for (let x = 1;  x < input[0].length - 1; x++) {
            let diagonals = getDiagonals(input, x, y); 

            // MAS or its opposite are both valid, as long as its both diagonals.
            if (diagonals.every(diagonal => diagonal === "SAM" || diagonal == "MAS")) {
                count += 1; 
            }
        }
    }

    return count;
}

console.log(part1(input));
console.log(part2(input));
