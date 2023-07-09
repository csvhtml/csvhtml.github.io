
const CLS_PARAMETER_VALID = {
    "sidebar": [true, false],
    "mode": [""],
}

class clsParameter {
/**
 * Handles the page parameters. 
 * At Init is starts with default page parameters
 * @param {*} setAll - Set all parameters via dictiony.
 * @param {*} set - Set one parameter via key (String).
 * @param {*} get - Get one parameter via key (String).
 * @param {*} keys - Get parameter Keys.
 */

    constructor() {
        this.Default = this.initParameter()
        this.Current = {}
        let keys = Object.keys(this.Default)
        for (let key of keys) {
            this.Current[key] = this.Default[key]
        }
    }

    initParameter () {       
        let keys = Object.keys(CLS_PARAMETER_VALID) 
        let dicct = {}
        for (let key of keys) {
            dicct[key] = []
            dicct[key].push(CLS_PARAMETER_VALID[key][0])
        }
        return dicct
    }

    setAll(dicct) {
        let keys = Object.keys(dicct) 
        for (let key of keys) {
            this.set(key, dicct[key])
        }
    }

    set(key, val) {
        if (key in this.Current) {
            if (CLS_PARAMETER_VALID[key].includes(val)) {
                this.Current[key] = val
            } else {
                this.log("value " + "'" + key + "'" + " is not valid value for parameter ", "'" + key + "'")
            }

        } else {
            this.log("parameter is not a valid page parameter", "'" + key + "'")
        }
    }

    get(key) {
        assert (key in this.Current)
        return this.Current[key]
    }

    keys() {
        return Object.keys(this.Default)
    }

    log(key, val) {
        if (LOGG) {
            let msg = "[clsParameterHandler] "
            log.msg(msg+ key + ": " + val)
        }
    }
}