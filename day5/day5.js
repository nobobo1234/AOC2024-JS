export const prepareInput = (input) => {
    const mapping = input[0]
        .split('\n')
        .map(rule => rule.split('|'))
        .reduce((acc, [key, value]) => {
            if (acc.has(+key)) {
                acc.get(+key).push(+value);
            } else {
                acc.set(+key, [+value]);
            }

            return acc;
        }, new Map());

    const updates = input[1].split('\n').map(update => update.split(',').map(Number));

    return [mapping, updates];
}

const onlyInOrdRule = (update, no, mapping) => new Set(update).intersection(new Set(mapping.get(no)))

const rightOrder = (update, mapping) => {
    return update.every((no, i) => {
        if (mapping.has(no)) {
            // If the whole update array filtered for the ordering rules is 
            // the same as the array after the current index, we have a match.
            return onlyInOrdRule(update, no, mapping).size === onlyInOrdRule(update.slice(i + 1, update.length), no, mapping).size
        }
        return true;
    });
};

const putInRightOrder = (update, mapping) => {
    let newUpdate = update;

    // For each element in the original update list, keep adding `no` in front 
    // of the first find in newUpdate that is also in the ordering mapping. This
    // way you ensure the original array is sorted by the time you've looped through
    // it.
    for (let no of update) {
        if (mapping.has(no) && !rightOrder(update, mapping)) {
            const filtered = onlyInOrdRule(newUpdate, no, mapping);

            // Remove no first from the array, otherwise it will grow. 
            newUpdate = newUpdate.filter(e => e !== no)

            const firstIndex = newUpdate.findIndex(e => filtered.has(e));

            newUpdate = [...newUpdate.slice(0, firstIndex), no, ...newUpdate.slice(firstIndex, newUpdate.length)];
        }
    }

    return newUpdate;
}

const part1 = ([mapping, updates]) => {
    const sum = updates
        .filter(update => rightOrder(update, mapping))
        .reduce((acc, curr) => acc + curr[Math.floor(curr.length / 2)], 0);

    return sum;
}

const part2 = ([mapping, updates]) => {
    const sum = updates
        .filter(update => !rightOrder(update, mapping))
        .map(update => putInRightOrder(update, mapping))
        .reduce((acc, curr) => acc + curr[Math.floor(curr.length / 2)], 0);

    return sum;
};

console.log(part1([mapping, updates]));
console.log(part2([mapping, updates]));
