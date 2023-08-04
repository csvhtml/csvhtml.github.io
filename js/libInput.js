// ################################################################
// Config                                                         #
// ################################################################

const LIB_INPUT_FUNCTIONMAPPING = {
    "nav-input": clsNavbar_Call_Input,
    "clsCSV-Cell-Input": clsCSV_ParseFileNameToTextArea, 
}

// ################################################################
// Functionality                                                  #
// ################################################################

// access the data globally via 'cReader.result' as text
const cReader = new FileReader();


class libInput {
    constructor() {
        // variables
        this.ActiveEventListeners_OnChange = {} // same structur as LIB_INPUT_FUNCTIONMAPPING
        // actions
        this.LinkInputWithFunctions()
    }

    ReturnInputField({id = "", type="file", classList, multiple = false, webkitdirectory = false}) {
        let input = document.createElement("input")
        input.id = id
        input.type = type
        for (let clas of classList) {
            input.classList.add(clas)}
        input.multiple = multiple
        input.webkitdirectory = webkitdirectory
        return input
    }
    
    LinkInputWithFunctions() {
        // asserts
        let KEYS = Object.keys(LIB_INPUT_FUNCTIONMAPPING)
        for (let key of KEYS) {
            let div = document.getElementById(key)
            if (div != null) {
                this._EventListenerOnChange_AddX(key)
            }
        }
    }

    _EventListenerOnChange_AddX(divID) {
        let KEYS = Object.keys(LIB_INPUT_FUNCTIONMAPPING)
        let KeysOnPage = Object.keys(this.ActiveEventListeners_OnChange) 
        if (KEYS.includes(divID) && !KeysOnPage.includes(divID)) {
            let input = document.getElementById(divID)
            input.addEventListener('change', _libInput_OnLoad)
            this.ActiveEventListeners_OnChange[divID] = LIB_INPUT_FUNCTIONMAPPING[divID]
        }
    }
}

// ################################################################
// Global functions of Input File                                 #
// ################################################################

const _libInput_OnLoad = (event)  => {
    let divFile = document.getElementById(event.srcElement.id);
    cReader.readAsText(divFile.files[0]);
    cReader.addEventListener("loadend", LIB_INPUT_FUNCTIONMAPPING[event.srcElement.id]); 
  }


// ################################################################
// Documentation                                                  #
// ################################################################

// Usage:
// A) Define the functions that shall be called when a file was uploaded via the Input form. Mapping happens
//    via the input id
// B) Create one instance of this lib:
// - const cINPUT = new libInput()
// 
// C) Define Inputs eitehr via html or via Javascript
// 1) Input form defined by html file:
// - Then nothing needs to be done. Just create an instance and all input forms defined in the config at the top
//   will be allocated with the corresponding function defined in the config
// 2) Input defined by Jaascript:
// - Then you need to call 'LinkInputWithFunctions()'. It will link input forms with the corresponding function
//   defined in the Config. You only need to call it once to link muliplte input forms.
// - This lib also proved a function 'ReturnInputField()' that returns a html input object, that then only needs to be 
//   appended to whereever you want it to be. Liekwise after you appended the input form, you have to call 'LinkInputWithFunctions()'   