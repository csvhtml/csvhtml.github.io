// ################################################################
// Config                                                         #
// ################################################################
const CLS_MODES_DEFAULT_COLS = ["No.", "Name", "Description", "url", "img", "Type [dropdown]", "Tags [dropdown]"]

const CLS_MODES_CSV_VALID_CONFIG = {
    "CSVLayout": ["table", "list", "headersOnly"],  // first entry is default config
    "colsFixed": [false, true] // alo cols to be changed
}
const CLS_MODES_FILTER = {
    "type": [],
    "tags": []
} 

const CLS_MODES_DEFAULT_DATA = {
    "No.": 1,
    "[dropdown]": "[]",
    "default": ".."
}
// ################################################################
// Pre-defined Configs                                            #
// ################################################################
const CLS_MODES_PREDEFINED = {
    "default": {},
    "header": {
        "CSVLayout": "headersOnly"
    },
    "sidebar": {
        "cols": ["No.","Name"],
        "colsFixed": true
    }
}

class clsModes {
    constructor(SetMode = "default", DefaultCols = []) {
        this.Config = {
            // Config at Startup
            "cols": [],
            "CSVLayout": "",
            "colsFixed": "",
            // Filter during run time
            "type": [],
            "tags": []
        }
        // default Config 
        this.Config["cols"] =  CLS_MODES_DEFAULT_COLS
        for (let key of Object.keys(CLS_MODES_CSV_VALID_CONFIG)) {
            this.Config[key] =  CLS_MODES_CSV_VALID_CONFIG[key][0]
        }
        
        // standard Configs
        if (SetMode != "default") {
            for (let key of Object.keys(CLS_MODES_PREDEFINED[SetMode])) {
                this.Config[key] = CLS_MODES_PREDEFINED[SetMode][key]
            }
        }

        this.Config["cols"].replaceIfEmpty(DefaultCols)
        this.activeModeName = SetMode
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
            if (configKey == "cols" && this.Config["colsFixed"] == false) {
                this.Config[configKey] = configVal
            }
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





