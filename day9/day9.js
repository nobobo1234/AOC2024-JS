export const prepareInput = (input) => {
    let length = input.length - (input.length % 2 === 0 ? 1 : 0);

    const files = [];
    for (let i = 0; i < length; i++) {
        if (i % 2 === 0) {
            // block of space with id = i / 2
            files.push({ id: i / 2, count: +input[i] });
        } else {
            // block of free space
            files.push({ id: -1, count: +input[i] });
        }
    }

    return files;
}

export const part1 = (files) => {
    while (files.findIndex(e => e.id === -1) >= 0) {
        const freeSpace = files.find(e => e.id === -1); 
        const lastFile = files[files.length - 1];

        const index = files.findIndex(e => e.id === -1);

        const min = Math.min(freeSpace.count, lastFile.count);
        if (min === freeSpace.count || freeSpace.count === lastFile.count) {
            // If the minimum is the amount of freeSpace, completely replace the freeSpace 
            // with the id: lastFile.
            files[index] = { id: lastFile.id, count: min };
        } else if (min === lastFile.count && min !== freeSpace.count) {
            // If the freeSpace is larger, remove lastFile count from freeSpace
            files[index].count -= min;

            // ...and insert a copy of lastFile before the emptySpace with the 
            // count just removed from freeSpace.
            files.splice(index, 0, { ...lastFile })
        }

        // Remove the count for the old file.
        files[files.length - 1].count -= min;

        // If the last file is now empty and everything is in the old freeSpace,
        if (files[files.length - 1].count === 0) {
            files.pop();
        }

        // If the now end of the array is empty space, directly remove it.
        if (files[files.length -1].id === -1) {
            files.pop();
        }

    }

    return files.reduce(({ totalI, sum }, { id, count }) => {
        // Sum from totalI - totalI + count times id
        // (T + i)(T + i - 1)/2 - T(T - 1)/2 = (T^2 + Ti - T + Ti + i^2 - i - T^2 + T)/2
        //                                   = (2Ti + i^2 - i)/2
        sum += (2 * totalI * count + count**2 - count)/2*id
        totalI += count;
        return { totalI, sum };
    }, { totalI: 0, sum: 0 })['sum']
};

export const part2 = (files) => {
    // Loop through all files IDs starting with last one i.e. descending order.
    for (let i = files[files.length - 1].id; i >= 0; i--) {
        const lastFile = files.find(e => e.id === i);
        const lastFileIndex = files.findIndex(e => e.id === i);

        // Find the first freeSpace that has place for the last file.
        const freeSpace = files.find(e => e.id === -1 && e.count >= lastFile.count); 
        const freeSpaceIndex = files.findIndex(e => e.id === -1 && e.count >= lastFile.count); 

        // If there's no freeSpace available for the lastFile or if the freeSpace 
        // is after the file, continue.
        if (!freeSpace || freeSpaceIndex > lastFileIndex) {
            continue;
        }

        if (freeSpace.count === lastFile.count) {
            // If freespace is exactly lastFile count, replace the freeSpace 
            // with the lastFile and replace the lastfile with nothing (to preserve
            // checksums.
            //
            // We don't need to merge freeSpaces since you're only looking at things
            // before lastFileIndex.
            files[freeSpaceIndex] = { ...lastFile };
            files[lastFileIndex] = { ...freeSpace };
        } else if (freeSpace.count > lastFile.count) {
            // Otherwise, if it's larger edit the freeSpace and add the lastFile 
            // in the place of the freeIndex. Change the lastFile to free space here 
            // also.
            files[freeSpaceIndex].count -= lastFile.count;

            files.splice(freeSpaceIndex, 0, { ...lastFile })
            files[lastFileIndex + 1] = { id: -1, count: lastFile.count }
        }

        // If the now end of the array is empty space, directly remove it.
        if (files[files.length -1].id === -1) {
            files.pop();
        }
    }

    return files.reduce(({ totalI, sum }, { id, count }) => {
        // Sum from totalI - totalI + count times id
        // (T + i)(T + i - 1)/2 - T(T - 1)/2 = (T^2 + Ti - T + Ti + i^2 - i - T^2 + T)/2
        //                                   = (2Ti + i^2 - i)/2
        if (id != -1) {
            sum += (2 * totalI * count + count**2 - count)/2*id
        }
        totalI += count;
        return { totalI, sum };
    }, { totalI: 0, sum: 0 })['sum']
};
