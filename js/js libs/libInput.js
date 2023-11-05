// access the data globally via 'cReader.result' as text
const cReaders = {};  // dict of fileReaders that is dynamically created
const cReaders_FilePaths = {};  // dict of fileReaders that is dynamically created
const LIB_INPUT_CLASSES = [
    "libInput-NoFileRead", // in case the input field has this class, then the uploaded file content is not read (and only the files path is saved)
]
    var VAR_LIB_INPUT_FUNCTIONMAPPING = {}


class libInput {
    constructor(FunctionMappingDict) {
        VAR_LIB_INPUT_FUNCTIONMAPPING = FunctionMappingDict
        this.FuncMap = FunctionMappingDict
        // variables
        this.ActiveEventListeners_OnChange = {} // this.FuncMap
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
        let KEYS = Object.keys(this.FuncMap)
        for (let key of KEYS) {
            let div = document.getElementById(key)
            if (div != null) {
                this._EventListenerOnChange_AddX(key)
            }
        }
    }

    _EventListenerOnChange_AddX(divID) {
        let KEYS = Object.keys(this.FuncMap)
        let KeysOnPage = Object.keys(this.ActiveEventListeners_OnChange) 
        if (KEYS.includes(divID) && !KeysOnPage.includes(divID)) {
            let input = document.getElementById(divID)
            if (!input.multiple && !input.webkitdirectory) {
                input.addEventListener('change', _libInput_OnLoad)
                this.ActiveEventListeners_OnChange[divID] = this.FuncMap[divID]
                cReaders[divID] = new FileReader()
            }

            if (!input.multiple && input.webkitdirectory) {
                input.addEventListener('change', _libInput_OnLoad)
                cReaders[divID] = [] // list of later defined FileReaders
                cReaders_FilePaths[divID] = [] // list of later defined FileNames
            }
        }
    }
}

// ################################################################
// Global functions of Input File                                 #
// ################################################################

const _libInput_OnLoad = (event)  => {
    let divFile = document.getElementById(event.srcElement.id);
    if (!divFile.multiple && !divFile.webkitdirectory) {
        cReaders_FilePaths[event.srcElement.id] = divFile.files[0].name
        cReaders[event.srcElement.id].addEventListener("loadend", VAR_LIB_INPUT_FUNCTIONMAPPING[event.srcElement.id]); 
        if (!event.srcElement.classList.contains(LIB_INPUT_CLASSES[0])) {
            cReaders[event.srcElement.id].readAsText(divFile.files[0]);}

    }

    if (divFile.multiple && !divFile.webkitdirectory) {
        a = 1
    }

    if (!divFile.multiple && divFile.webkitdirectory) {
        let idx = 0
        for (file of divFile.files) {
            cReaders_FilePaths[event.srcElement.id].push(file.webkitRelativePath)
            cReaders[event.srcElement.id].push(new FileReader())
            if (!event.srcElement.classList.contains(LIB_INPUT_CLASSES[0])) {
                cReaders[event.srcElement.id][idx].readAsText(divFile.files[idx])}
            idx += 1
        }
        cReaders[event.srcElement.id][idx-1].readAsText(divFile.files[idx-1]) // last file must be loaded to trigger function call below
        cReaders[event.srcElement.id][idx-1].addEventListener("loadend", VAR_LIB_INPUT_FUNCTIONMAPPING[event.srcElement.id]); 
    }

    if (divFile.multiple && divFile.webkitdirectory) {
        // should not exist
        assert(false)
    }

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