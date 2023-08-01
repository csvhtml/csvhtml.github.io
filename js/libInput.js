// ################################################################
// Config                                                         #
// ################################################################
const LIB_INPUT_FUNCTIONMAPPING = {
    "nav-input": clsNavbar_Call_Input,      // inputs on the page. Referenced function must be global
}

// ################################################################
// Lib                                                            #
// ################################################################

const cReader = new FileReader();
var libInput_FileDivID = ""
var libInput_FileFunction = undefined


class libInput {
    constructor() {
        this._init()
    }

    _init() {
        let keys = Object.keys(LIB_INPUT_FUNCTIONMAPPING) 
        for (let key of keys) {
            let div = document.getElementById(key)
            if (div != null) {
                let input = document.getElementById(key)
                input.addEventListener('change', _ddReadFile)
                this._Input_AssignFunction(key, LIB_INPUT_FUNCTIONMAPPING[key])
            }
        }
    }

    _Input_AssignFunction(EgoID, FunctionToCall) {
        libInput_FileDivID = EgoID
        libInput_FileFunction = function (a) {FunctionToCall(a)}
    }
}


// ################################################################
// Input File global functions                                    #
// ################################################################

const _ddReadFile = (event)  => {
    let divFile = document.getElementById(event.srcElement.id);
    cReader.readAsText(divFile.files[0]);
    cReader.addEventListener("loadend", _ddReadFile_functioncall);
    // cReader.addEventListener("loadend", DDFileInput(DivID));   // this does not work. Work around via _ddReadFile_functioncall 
  }

const _ddReadFile_functioncall = (event)  => {
    libInput_FileFunction(libInput_FileDivID)
  }



// ################################################################
// archiv                                                         #
// ################################################################

// AddInputFileAfterDiv({FormdivID = "", EgoID = "", FunctionToCall, type = "file", className = "form-control", accept = ".pdf"}) {
//     let input = document.createElement("input")
//     input.id = EgoID
//     input.type = type
//     input.className = className
//     input.accept = accept
//     input.addEventListener('change', _ddReadFile) // input.onchange = ... does not work. no attribute of input Also inside html text -> onclick="_ddReadFile" does not work. it runs but event parameter is null
//     document.getElementById(FormdivID).append(input)
//     // document.getElementById(EgoID).addEventListener('change', ReadFile) would also work


//     // remember fuction and parameter to be called after loadend
//     cInputFileDivID = EgoID
//     cInputFileFunction = function (a) {FunctionToCall(a)}
// }


// ################################################################
// How it works                                                   #
// ################################################################

// (1) const cReader = new FileReader();  
//  |
// (2) input.addEventListener('change', _ddReadFile)
//  |
// (3) var libInput_FileFunction = function (a) {FunctionToCall(a)}  , variable represents function with parameter
//  |
//  ... then when input is clicked
//  |
// (4) cReader.readAsText(divFile.files[0]);
//     cReader.addEventListener("loadend", _ddReadFile_functioncall)
//  |
// (5) libInput_FileFunction (libInput_FileDivID), is called
