import fs from 'fs';

const input = fs.readFileSync('./day3.txt', 'utf-8').trim()

const part1 = (input) => {
    const regex = /mul\((\d+),(\d+)\)/g;
    let matches = [...input.matchAll(regex)];

    let sum = 0;
    for (const match of matches) {
        const [_, a, b] = match;


        sum += Number(a) * Number(b);
    }
    
    return sum;
}

const part2 = (input) => {
    const matchDo = /do\(\)/g;
    const matchDont = /don't\(\)/g;
    const matchesDo = [...input.matchAll(matchDo)].map(m => ({ index: m.index, type: 'do' }));
    const matchesDont = [...input.matchAll(matchDont)].map(m => ({ index: m.index, type: 'dont' }));

    const matches = [...matchesDo, ...matchesDont].sort((a, b) => a.index - b.index);

    let startIndex = 0;
    let endIndex = 0;
    let prevType = 'do';
    let sum = 0;
    for (const todo of matches) {
        if (todo.type === 'do' && prevType == 'dont') {
            startIndex = todo.index;
            prevType = 'do';
        }

        if (todo.type === 'dont' && prevType == 'do') {
            endIndex = todo.index;

            sum += part1(input.substring(startIndex, endIndex));

            prevType = 'dont';
        }
    }

    if (prevType === 'do') {
        sum += part1(input.substring(startIndex));
    }

    return sum;
}

console.log(part1(input))
console.log(part2(input))
