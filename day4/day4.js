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
            fourDiagonals[0].push(input[yDiag][xDiag]);
            fourDiagonals[1].push(input[yDiag][rows[0].length - 1 - xDiag]);

            // Since the word search is square we can add the opposite 
            // vertical (same as matrix transpose x,y -> y,x) to a second
            // diagonal if we're not in the first diagonal where x = y the whole
            // time.
            if (xDiag !== yDiag) {
                fourDiagonals[2].push(input[xDiag][yDiag]);
                fourDiagonals[3].push(input[yDiag - i][rows[0].length - 1  - xDiag - i]);
            }

            xDiag++;
            yDiag++;
        }

        diagonals = [...diagonals, ...fourDiagonals];
    }

    let amountOfXmas = 0;
    let re = /XMAS/g

    // Converts array to join('') string to make reversing easier.
    let count = (array, regex) => (array.join('').match(regex) || []).length; 

    // Loop over rows and columns at the same time since word search is square.
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let col = columns[i];

        amountOfXmas += count(row, re) + count(row.reverse(), re);
        amountOfXmas += count(col, re) + count(col.reverse(), re);
    }

    for (const diagonal of diagonals) {
        amountOfXmas += count(diagonal, re) + count(diagonal.reverse(), re);
    }

    return amountOfXmas;
}

const part2 = (input) => {
    // Start at 1 to prevent boundary issues. And an X-MAS can't appear 
    // directly on the side.
    let getDiagonals = (input, x, y) => {
        let firstDiag = input[y - 1][x - 1] + input[y][x] + input[y + 1][x + 1];
        let secondDiag = input[y - 1][x + 1] + input[y][x] + input[y + 1][x - 1];

        return [firstDiag, secondDiag];
    }

    let count = 0;
    for (let y = 1; y < input.length - 1; y++) {
        for (let x = 1;  x < input[0].length - 1; x++) {
            let diagonals = getDiagonals(input, x, y); 

            if (diagonals.every(diagonal => diagonal === "SAM" || diagonal == "MAS")) {
                count += 1; 
            }
        }
    }

    return count;
}

console.log(part1(input));
console.log(part2(input));
