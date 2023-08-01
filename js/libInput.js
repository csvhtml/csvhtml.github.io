class libInput {
    constructor() {
        
    }

    Input_AssignFunction(EgoID, FunctionToCall) {
        cInputFileDivID = EgoID
        cInputFileFunction = function (a) {FunctionToCall(a)}
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
    cInputFileFunction(cInputFileDivID)
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
