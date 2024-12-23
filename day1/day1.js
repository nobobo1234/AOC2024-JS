export const part1 = (input) => {
    const lines = input.split('\n').map(e => e.split('  '));

    lines.pop();

    const list1 = lines.map(e => parseInt(e[0])).sort();
    const list2 = lines.map(e => parseInt(e[1])).sort();

    const result = list1.map((e, i) => Math.abs(list2[i] - e)).reduce((acc, cur) => acc + cur, 0);

    return result;
}

export const part2 = (input) => {
    const lines = input.split('\n').map(e => e.split('  '));

    lines.pop();

    const list1 = lines.map(e => parseInt(e[0])).sort();
    const list2 = lines.map(e => parseInt(e[1])).sort();

    let sum = 0;

    for (const number of list1) {
        const howMuchInList2 = list2.filter(e => e === number).length;
        sum += number * howMuchInList2;
    }

    return sum;
}
