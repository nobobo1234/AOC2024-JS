import memoize from 'memoize';

const product = memoize((iterables, repeat = 1) => {
    const inputs = Array(repeat).fill(iterables);

    // Iteratively build the Cartesian product by combining each element of the current array (`value`)
    // with all combinations accumulated so far (`accumulator`).
    // For example, if `inputs = [[1, 2], [3, 4]]`:
    // Step 1: Start with `accumulator = [[]]`.
    // Step 2: Combine `[[]]` with `[1, 2]` (first element of inputs) to get `[[1], [2]]` which is flattened 
    //         to [1], [2] using the flatMap.
    // Step 3: Combine `[[1], [2]]` with `[3, 4]` to get `[[[1, 3], [1, 4]], [[2, 3], [2, 4]]]`
    //         where each element is one result of value.map(). This result is flattened to 
    //         [[1, 3], [1, 4], [2, 3], [2, 4]] using the flatMap.
    return inputs.reduce((accumulator, value) => {
        return accumulator.flatMap(a0 => value.map(a1 => [...a0, a1]));
    }, [[]]);
}, { cacheKey: JSON.stringify });

export const prepareInput = (input) => input
    .trim()
    .split('\n')
    .map(line => line.split(': '))
    .map(line => ({ value: Number(line[0]), eq: line[1].split(' ').map(Number) }))

export const part1 = (input) => {
    let sum = 0;

    for (const { value, eq } of input) {
        const possibilities = product(['*', '+'], eq.length - 1)

        for (const possibility of possibilities) {
            const result = eq.slice(1).reduce((acc, curr, i) => {
                return possibility[i] == '*' ? acc * curr : acc + curr; 
            }, eq[0])

            if (result === value) {
                sum += value;
                break;
            }
        }
    }
    
    return sum;
}

export const part2 = (input) => {
    let sum = 0;

    for (const { value, eq } of input) {
        const possibilities = product(['*', '+', '||'], eq.length - 1)

        for (const possibility of possibilities) {
            const result = eq.slice(1).reduce((acc, curr, i) => {
                switch (possibility[i]) {
                    case '*':
                        return acc * curr;
                    case '+':
                        return acc + curr;
                    case '||':
                        return Number(`${acc}${curr}`)
                }
            }, eq[0])

            if (result === value) {
                sum += value;
                break;
            }
        }
    }
    
    return sum;
}
