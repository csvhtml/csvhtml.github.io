var cCurrentLoadendDivID = ""
var cCurrentLoadendFileName = ""
var cFunctionToCallAfterLoadend = undefined

// ################################################################
// DropDown                                                       #
// ################################################################

class clsDropDown {
    constructor() {
    }

// ################################################################
// Drop Down                                                      #
// ################################################################
    AddDropDownToDiv(targetDiv, ddName, ddPrefix, ddElements, ddFunctions){
        assert(ddElements.length == ddFunctions.length)
        
        // outer HTML part via set Attribute
        targetDiv.setAttribute('onclick', "ddToggle('" + ddPrefix + "ddm-" + ddName + "')")
        // inner HTML part via string composition
        let ret = '<div id="' + ddPrefix + 'ddm-' + ddName + '"' + ' class="dropdown-menu">'
        for (let i = 0; i < ddElements.length; i++) {
            ret += '<a id="' + ddPrefix + 'dd-' + ddElements[i] + '" class="dropdown-item" href="#" onclick="' + ddFunctions[i] + '">' + ddElements[i] + '</a>'}
        targetDiv.innerHTML += ret
    }

    AddInputFileAfterDiv({FormdivID = "", EgoID = "", FunctionToCall, type = "file", className = "form-control", accept = ".pdf"}) {
        let input = document.createElement("input")
        input.id = EgoID
        input.type = type
        input.className = className
        input.accept = accept
        document.getElementById(FormdivID).append(input)
        cFunctionToCallAfterLoadend = function (a) {FunctionToCall(a)}
        document.getElementById(EgoID).addEventListener('change', ReadFile)
    }
}

// ################################################################
// Drop Down                                                      #
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
// Input File                                                     #
// ################################################################

const ReadFile = (event)  => {
    cCurrentLoadendDivID = event.srcElement.id

    let divFile = document.getElementById(event.srcElement.id);
    cReader.readAsText(divFile.files[0]);
    cCurrentLoadendFileName = divFile.value.split("\\").slice(-1)[0]
    cReader.addEventListener("loadend", ReaderResults);
  }

const ReaderResults = (event)  => {
    cFunctionToCallAfterLoadend(cCurrentLoadendDivID)
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