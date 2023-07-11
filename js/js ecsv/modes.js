// ################################################################
// Config                                                         #
// ################################################################
const CLS_MODES_DEFAULT_COLS = ["No.", "Name", "Description", "url", "img", "Type [dropdown]", "Tags [dropdown]"]
const CLS_MODES_DEFAULT_DATA = {
    "No.": 1,
    "[dropdown]": "[]",
    "default": ".."
}
const CLS_MODES_CSV_VALID_CONFIG = {
    "CSVLayout": ["table", "list", "headersOnly"]  // first entry is default config
}
const CLS_MODES_FILTER = {
    "type": [],
    "tags": []
} 

// ################################################################
// Pre-defined Configs                                            #
// ################################################################
const CLS_MODES_PREDEFINED = {
    "standard": {},
    "header": {
        "CSVLayout": "headersOnly"
    },
    "SIDEBAR": {
        "cols": ["No.","Name"]
    }
}

class clsModes {
    constructor(SetMode = "standard", DefaultCols = []) {
        this.Config = {
            // Config at Startup
            "cols": [],
            "CSVLayout": "",
            // Filter during run time
            "type": [],
            "tags": []
        }
        
        this.Config["cols"] =  CLS_MODES_DEFAULT_COLS
        this.Config["CSVLayout"] =  CLS_MODES_CSV_VALID_CONFIG[0]
        if (SetMode != "standard") {
            for (let key of Object.keys(CLS_MODES_PREDEFINED[SetMode])) {
                this.Config[key] = CLS_MODES_PREDEFINED[SetMode][key]
            }
        }

        this.Config["cols"].replaceIfEmpty(DefaultCols)
        this.activeModeName = SetMode


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

    ActiveCols() {
        return this.Config["cols"]
    }

    ActiveCSVLayout() {
        return this.Config["CSVLayout"]
    }

    SetMode(mode) {
        if (CLS_MODES_PREDEFINED.includes(mode)) {
            this.activeModeName = mode
            for (let key of Object.keys(CLS_MODES_PREDEFINED[mode])) {
                this.Config[key] = CLS_MODES_PREDEFINED[mode][key]
            }
        }  
    }

    SetConfig(configKey, configVal) {
        if (Object.keys(this.Config).includes(configKey)) {
            if (configKey == "CSVLayout") {
                if (!CLS_MODES_CSV_VALID_CONFIG["CSVLayout"].includes(configVal)) {
                    return}
            }
            this.Config[configKey] = configVal
        }
    }

    DefaultRow(atPosition = -1) {
        let no = 0
        let ret = []
        if (atPosition = -1) {
            no = 0}
        
        for (let col of this.Config["cols"]) {
            if (col == "No.") {
                ret.push(String(CLS_MODES_DEFAULT_DATA["No."] + no));continue}
            if (col.includes("[dropdown]")) {
                ret.push(CLS_MODES_DEFAULT_DATA["[dropdown]"]);continue}  
            ret.push(CLS_MODES_DEFAULT_DATA["default"])
        }
        return ret
    }
}





