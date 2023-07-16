// ################################################################
// Prototype extentions                                           #
// ################################################################

// from https://stackoverflow.com/questions/6120931/how-to-count-certain-elements-in-array
Object.defineProperties(Array.prototype, {
    count: {
        value: function(query) {
            /* 
               Counts number of occurrences of query in array, an integer >= 0 
               Uses the javascript == notion of equality.
            */
            var count = 0;
            for(let i=0; i<this.length; i++)
                if (this[i]==query)
                    count++;
            return count;
        }
    }
});


Object.defineProperties(Array.prototype, {
    remove: {
        value: function(element) {
            let idx = this.indexOf(element);
            return this.splice(idx, 1)
        }
    }
});


Object.defineProperties(Array.prototype, {
    toggle: {
        value: function(element) {
            if (this.includes(element)) {
                this.remove(element)}
            else {
                this.push(element)}
            }
        }
});

Object.defineProperties(Array.prototype, {
    pushX: {
        value: function(element) {
            if (!this.includes(element)) {
                this.push(element)}
            }
        }
});

Object.defineProperties(Array.prototype, {
    replaceIfEmpty: {
        value: function(element) {
            if (Array.isArray(element)) {
                if (this.length === 0) {
                    for (let e of element) {
                        this.push(e)
                    }}
                }
            }
        }
});