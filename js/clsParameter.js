class clsParameter {
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
            assert (key in this.Current)
            this.Current[key] = dicct[key]
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

    keys() {
        return Object.keys(this.Default)
    }
}