const bidHierarchy = []


for (var i = 1; i < 21; i++) {
    for (let j = 1; j < 7; j++) {
        let toPush = [];
        for (let k = 1; k < (i + 1) ; k++) {
            toPush.push(j)

        }

        bidHierarchy.push(toPush)
    }
}


function arraysIdentical(arr1, arr2) {
    var i = arr1.length;
    if (i !== arr2.length) {
        return false;
    }
    while (i--) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}


function indexOf(arr, val, comparer) {
    for (var i = 0, len = arr.length; i < len; ++i) {
        if ( i in arr && comparer(arr[i], val) ) {
            return i;
        }
    }
    return -1;
}


// console.log(indexOf(bidHierarchy, [2, 2, 2], arraysIdentical));

export { bidHierarchy, arraysIdentical, indexOf };