// access the data globally via 'cReader.result' as text
const cReaders = {};  // dict of fileReaders that is dynamically created
const cReaders_FilePath = {};  // dict of fileReaders that is dynamically created
const LIB_INPUT_CLASSES = [
    "libInput-PathOnly", // in case the input field has this class, then the uploaded file content is not read (and only the files path is saved)
]
var VAR_LIB_INPUT_EVENTLISTENERS = {
    //"divID": {"change": FunctionName},  // type of event listeners must be "change". All other types are ignored
}


class libInput {
    constructor(dictEventListenerMapping) {
        // Function Mappings globally defined outside this lib
        VAR_LIB_INPUT_EVENTLISTENERS = this._Init_FilterEventListeners(dictEventListenerMapping)
        
        // Function Mappings already mapped (= active event listeners)
        this.AppliedEventListeners = {}

        // Init
        this._Init_LinkFunctions()
    }

    _Init_FilterEventListeners(rawdict) {
        let ret = {}
        for (let key of Object.keys(rawdict)) {
            for (let ky of Object.keys(rawdict[key])) {
                if (ky == "change") {
                    ret[key]= {}
                    ret[key][ky]= rawdict[key][ky]}
            }
        }
        return ret
    }

    _Init_LinkFunctions() {
        let KEYS = Object.keys(VAR_LIB_INPUT_EVENTLISTENERS)
        for (let key of KEYS) {
            let div = document.getElementById(key)
            if (div != null) { // key == div.id
                if (this._IsFunctionMappingDefined(key) && !this._IsFunctionMappingApplied(key)) {
                    this._AddXEventListener(key)}
            }
        }
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

    _AddXEventListener(divID) {
            let input = document.getElementById(divID)
            input.addEventListener('change', LIB_INPUT_FUNCTION_ONLOAD)
            this.AppliedEventListeners[divID] = VAR_LIB_INPUT_EVENTLISTENERS[divID]
            if (_IsInputTypeSingleFile(input)) {
                cReaders[divID] = new FileReader()
                cReaders_FilePath[divID] = ""  // later defined
                return}
            if (_IsInputTypeSingleFolder(input)) {
                cReaders[divID] = [] // list of later defined FileReaders
                cReaders_FilePath[divID] = [] // list of later defined FileNames
                return}
           
            assert(false)
    }

    _IsFunctionMappingDefined(divID) {
        let KEYS = Object.keys(VAR_LIB_INPUT_EVENTLISTENERS)  
        if (KEYS.includes(divID)) {
            return true}
        return false
    }


    _IsFunctionMappingApplied(divID) {                        
        let KEYS = Object.keys(this.AppliedEventListeners)
        if (KEYS.includes(divID)) {
            return true}
        return false
    }

}

// ################################################################
// Global functions of Input File                                 #
// ################################################################

const LIB_INPUT_FUNCTION_ONLOAD = (event)  => {
    let divFile = document.getElementById(event.srcElement.id);
    if (_IsInputTypeSingleFile(divFile)) {
        cReaders_FilePath[event.srcElement.id] = divFile.files[0].name
        cReaders[event.srcElement.id].addEventListener("loadend", VAR_LIB_INPUT_EVENTLISTENERS[event.srcElement.id]["change"]); 
        if (!event.srcElement.classList.contains(LIB_INPUT_CLASSES[0])) {
            cReaders[event.srcElement.id].readAsText(divFile.files[0]);}
    return
    }

    if (_IsInputTypeSingleFolder(divFile)) {
        let idx = 0
        for (file of divFile.files) {
            cReaders_FilePath[event.srcElement.id].push(file.webkitRelativePath)
            cReaders[event.srcElement.id].push(new FileReader())
            if (!event.srcElement.classList.contains(LIB_INPUT_CLASSES[0])) {
                cReaders[event.srcElement.id][idx].readAsText(divFile.files[idx])}
            idx += 1
        }
    cReaders[event.srcElement.id][idx-1].readAsText(divFile.files[idx-1]) // last file must be loaded to trigger function call below
    cReaders[event.srcElement.id][idx-1].addEventListener("loadend", VAR_LIB_INPUT_EVENTLISTENERS[event.srcElement.id]["change"]); 
    return
    }
    assert(false)
  }


// function myReadAsText(event) {
//     if (!event.srcElement.classList.contains(LIB_INPUT_CLASSES[0])) {
//         cReaders[event.srcElement.id].readAsText(divFile.files[0]);}
// }
  
function _IsInputTypeSingleFile(input) {
    if (!input.multiple && !input.webkitdirectory) {
        return true}
    return false
}

function _IsInputTypeSingleFolder(input) {
    if (!input.multiple && input.webkitdirectory) {
        return true}
    return false
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