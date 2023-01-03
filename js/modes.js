var MODES = {
    "standard": {cols:[], valueEquals:{}},
    "list": {cols:["No.", "Name", "url", "Type", "Tags"], valueEquals:{"Type":["document"]}},
    "issues": {cols:["No.", "Name", "Description", "Type", "Tags"], valueEquals:{"Type":["item"]}}
}

function GetModes() {
    ret = []
    for (let key of Object.keys(MODES)) {
        ret.push(key)
    }
    return ret
}

function GetModesOnClick() {
    ret = []
    for (let key of Object.keys(MODES)) {
        ret.push("DDMode('" + key + "')")
    }
    return ret
}

function GetModeValueEquals(mode) {
    return MODES[mode]["valueEquals"]
}