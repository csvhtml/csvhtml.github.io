class clsModes {
    constructor() {
        // var clsMMY = new clsMemory()
        this.defaultCols = ["No.", "Name", "Description", "url", "Type [dropdown]", "Tags [dropdown]"]
        this.activeMode = "standard"
        this.modes = {
            "standard": {cols:[], valueIncludes:{}},
            "list": {cols:["No.", "Name", "url", "Type", "Tags [dropdown]"], valueIncludes:{"Type":["document"]}},
            "issues": {cols:["No.", "Name", "Description", "Type", "Tags [dropdown]"], valueIncludes:{"Type":["item"]}},
            // "memory": {cols:["A", "B", "C", "D", "E", "F"], valueIncludes:{}, cls: clsMMY}
            "memory": {cols:["A", "B", "C", "D", "E", "F"]}
        }
    }

    GetModes() {
        let ret = []
        for (let key of Object.keys(this.modes)) {
            ret.push(key)
        }
        return ret
    }

    SetMode(mode) {
        this.activeMode = mode
    }

    GetCols(mode = "") {
        if (mode == "") { mode = this.activeMode}

        if (mode == "standard") {
            return this.defaultCols
        } else {
            return this.modes[mode]["cols"]
        }
    }
    
    GetModesOnClick() {
        let ret = []
        for (let key of Object.keys(this.modes)) {
            ret.push("DDMode('" + key + "')")
        }
        return ret
    }
    
    GetModeValueEquals(mode = "") {
        if (mode == "") {mode = this.activeMode}

        return this.modes[mode]["valueEquals"]
    }

    GetModeValueIncludes(mode = "") {
        if (mode == "") {mode = this.activeMode}

        return this.modes[mode]["valueIncludes"]
    }

    DefaultData(mode = "") {
        if (mode == "") {mode = this.activeMode}

        if (mode == "standard") {
            return [["1", "..", "..", "..", "..", "[]"]]
        }
        if (mode == "list") {
            return [["1", "..", "..", "document", "[]"]]
        }
        if (mode == "issues") {
            return [["1", "..", "..", "item", "[]"]]
        }
        if (mode == "memory") {
            return this.modes["memory"]["cls"].DefautData()
        }
    }
}



