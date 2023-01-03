function RemoveDuplicates(listElements) {
    return [...new Set(listElements)];
}


function DoubleAndShuffle(listElements) {
        listElements
        let memlist = listElements.concat(listElements)
        // shuffle array (Fisher-Yates algorithm)
        for (let i = memlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = memlist[i];
            memlist[i] = memlist[j];
            memlist[j] = tmp;
        }
        return memlist
}

function PseudoCSV(headers, cols, Names, del = ";") {
    ret = ""
    for (header of headers) {
        ret += header+del
    }
    ret +="\n"
    let counter = 0
    for (let element of Names) {
        if (counter < cols-1) {
            counter += 1
            ret += element + del
        }
        else if (counter == cols-1) {
            counter += 1
            ret += element
        }
        else {
            counter = 1
            ret += "\n" + element + del
        }
    }
    return ret
}

function CardIndex(divID, cols) {
    if (divID.includes("R:")) {
        let R = RetStringBetween(divID, "R:", "C:")
        let C = RetStringBetween(divID, "C:", "H:")
        let H = RetStringBetween(divID, "H:", "")
        return cols*parseInt(R) + parseInt(C)
    }
    return -1
}