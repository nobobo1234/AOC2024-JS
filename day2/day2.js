function checkIfReportOkay(report) {
    let isAscending = true;
    if (report[0] > report[1]) {
        isAscending = false;
    }

    // Check if the report is strictly increasing or decreasing
    let keptOrder = report.map((e, i) => {
        if (i === report.length - 1) return true;

        return isAscending ? e < report[i + 1] : e > report[i + 1];
    })

    // If there are more elements of !isAscending in the list, it means the 
    // first guess of isAscending was probably wrong. Reverse the boolean values 
    // of keptOrder in this case.
    if (keptOrder.filter(e => !e).length > keptOrder.filter(e => e).length) {
        keptOrder = keptOrder.map(e => !e);
    }

    // Check if the difference between each element is between 1 and 3
    let keptDiffBetweenOneAndThree = report.map((e, i) => {
        if (i === report.length - 1) return true;

        return Math.abs(e - report[i + 1]) <= 3 && Math.abs(e - report[i + 1]) >= 1;
    });

    // Return False if one of the two checks failed, else return True
    return keptOrder.map((e, i) => e && keptDiffBetweenOneAndThree[i]);
}

export function part1(input) {
    const lines = input.trim().split('\n').map(e => e.split(' ').map(Number));

    let sum = 0;
    for (const report of lines) {
        // Set initial isAscending value
        const isOkay = checkIfReportOkay(report);
        
        if (isOkay.every(e => e)) {
            sum += 1;
        }
    }
    return sum;
}


export function part2(input) {
    const lines = input.trim().split('\n').map(e => e.split(' ').map(Number));

    let sum = 0;
    for (const report of lines) {
        // Returns list of booleans.
        let isOkay = checkIfReportOkay(report)

        if (!isOkay.every(e => e)) {
            // Find the index of the (first) false element
            // If there is only one element that needs to be removed the first 
            // false element OR the next index the element was compared with
            // is the bottleneck.
            const index = isOkay.indexOf(false);

            // TODO: First value can be wrong.

            let removeFirst = [...report];
            removeFirst.splice(index, 1);

            let removeSecond = [...report];
            removeSecond.splice(index + 1, 1);
            
            // Check if we have a good report with one of the bottlenecks removed
            if (
                checkIfReportOkay(removeFirst).every(e => e) || 
                checkIfReportOkay(removeSecond).every(e => e)
            ) {
                sum += 1;   
            }
        } else {
            sum += 1;
        }
    }
    return sum;
}
