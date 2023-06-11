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
        this.Default = {
            "sidebar": true,
            "mode": "",
        }

        this.Current = {}
        let keys = Object.keys(this.Default)
        for (let key of keys) {
            this.Current[key] = this.Default[key]
        }
    }
    setAll(dicct) {
        let keys = Object.keys(dicct) 
        for (let key of keys) {
            this.set(key, dicct[key])
        }
    }

    set(key, val) {
        if (key in this.Current) {
            this.Current[key] = val
        } else {
            this.log("URL parameter is not a page parameter", "'" + key + "'")
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