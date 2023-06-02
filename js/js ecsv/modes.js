class clsModes {
    constructor(activeMode = "standard", DefaultCols = []) {
        if (DefaultCols.length === 0) {
            this.defaultCols = ["No.", "Name", "Description", "url", "img", "Type [dropdown]", "Tags [dropdown]"]
        } else {
            this.defaultCols = DefaultCols
        }
        this.activeMode = activeMode
        this.activeModeType = activeMode
        this.modes = {
            "standard": {cols:[], valueIncludes:{}, type: "table"},
            "header": {cols:[], valueIncludes:{}, type: "table"},
            "SIDEBAR": {cols: ["No.","Name"], valueIncludes:{}, type: "table"},
            "ulist": {cols:[], valueIncludes:{}, type: "list"},
            "issues": {cols:["No.", "Name", "Description", "Type", "Tags [dropdown]"], valueIncludes:{"Type":["item"]}, type: "table"},
            // "memory": {cols:["A", "B", "C", "D", "E", "F"], valueIncludes:{}, cls: clsMMY}
            "memory": {cols:["A", "B", "C", "D", "E", "F"], type: "table"}
        }
    }

    GetModes() {
        let ret = []
        for (let key of Object.keys(this.modes)) {
            if (!this.IsCapitalMode(key)) {
                ret.push(key)}
        }
        return ret
    }

    SetMode(mode) {
        if (this.IsCapitalMode(this.activeMode)) {
            return}
        this.activeMode = mode
    }

    GetCols(mode = "") {
        if (mode == "") { mode = this.activeMode}

        if (mode == "standard" || mode == "header") {
            return this.defaultCols
        } else {
            return this.modes[mode]["cols"]
        }
    }
    
    GetModesOnClick() {
        let ret = []
        for (let key of Object.keys(this.modes)) {
            if (!this.IsCapitalMode(key)) {
                ret.push("DDMode('" + key + "')")}
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

        if (mode == "standard" || mode == "header") {
            return [["1", "..", "..", "..", "..", "..", "[]"]]
        }
        if (mode == "SIDEBAR") {
            return [["1", ".."]]
        }
        if (mode == "list" || mode == "ulist") {
            return [["1", "..", "..", "document", "[]"]]
        }
        if (mode == "issues") {
            return [["1", "..", "..", "item", "[]"]]
        }
        if (mode == "memory") {
            return this.modes["memory"]["cls"].DefautData()
        }
    }

    IsCapitalMode(mode) {
        if (mode == "SIDEBAR") {
            return true
        }
        return false
    }

    ModeType(mode = null) {
        if (mode == null) {
            return this.modes[this.activeMode]["type"] 
        } else {
            return this.modes[mode][type]
        }
        
    }
}





