// var cInputFileDivID = ""
// var cInputFileFunction = undefined

// ################################################################
// DropDown                                                       #
// ################################################################

class libDropDown {
    constructor() {
    }

// ################################################################
// Drop Down                                                      #
// ################################################################
    AddDropDownToDiv(targetDiv, ddElements, ddFunctions){
        assert(ddElements.length == ddFunctions.length)
        let ddElements_NoBlanks = _RemoveBlanksInList(ddElements)
        let ddPrefix = targetDiv.id

        // outer HTML part via set Attribute
        targetDiv.setAttribute('onclick', "ddToggle('" + ddPrefix + "-ddmenu')")
        
        // inner HTML part via string composition
        let ret = '<div id="' + ddPrefix + '-ddmenu"' + ' class="dropdown-menu">'
        for (let i = 0; i < ddElements.length; i++) {
            ret += '<a id="' + ddPrefix + '-dd-' + ddElements_NoBlanks[i] + '" class="dropdown-item" href="#" onclick="' + ddFunctions[i] + '">' + ddElements[i] + '</a>'}
        targetDiv.innerHTML += ret
    }

    ChangeDropDownVal(divID, oldVal, newVal) {
        let div = document.getElementById(divID)
        div.innerHTML = div.innerHTML.replace(">" + oldVal + "</a>",">" + newVal + "</a>")
    }

    ChangeDropDownFunction(divID, oldVal, newVal) {
        let div = document.getElementById(divID)
        div.innerHTML = div.innerHTML.replace(' onclick="' + oldVal + '"',' onclick="' + newVal + '"')
    }
}



// ################################################################
// Drop Down global function                                      #
// ################################################################

function ddToggle(divID) {
    var x = document.getElementById(divID);
    if (x.style.display === "none" || x.style.display === "") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }


// ################################################################
// Button (not used)                                              #
// ################################################################

class clsButton {
    constructor(menu = [], events = []) {
        if (menu.length != events.length) {
            console.log("classButton initalized with menu and events of not equal size. Function call skipped")
            return
        }
        this.menu = menu;
        this.menu = events;
        this.div = document.createElement('a'); 
        
        // single button
        if (this.menu.length == 1 ) {
            let attributes = {
                "innerHTML": menu[0],
                "class": ["btn", "bg-light"],
                "href": "#", 
                "onclick": events[0]}
            this._A_SetAttributes(attributes)
        }

        // dropdown button
        if (this.menu.length > 1 ) {
            this.div = document.createElement('div'); this.div.classList.add("dropdown")
        }
    }


    _A_SetAttributes(dictAttributes) {
        for (let key in dictAttributes) {
            if (key == "innerHTML") {
                this.div.innerHTML = dictAttributes[key]
                continue
            }
            if (key == "class") { // attributes must be a list
                for (let cls of dictAttributes[key]) {
                    this.div.classList.add(cls)
                }
                continue
            }
           this.div.setAttribute(key, dictAttributes[key])
        }
    }
}