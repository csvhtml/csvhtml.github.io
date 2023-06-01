



class clsParameter {
    constructor() {
        this.Default = {
            "Sidebar": true
        }

        this.Current = {
            "Sidebar": true
        }

        let keys = Object.keys(this.Default)
        for (let key of keys) {
            assert (key in this.Current)
        }

    }

    set(key, val) {
        assert (key in this.Current)
        this.Current[key] = val
    }

    get(key) {
        assert (key in this.Current)
        return this.Current[key]
    }
}