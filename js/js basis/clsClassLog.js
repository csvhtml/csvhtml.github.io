const CLS_CLASS_LOG_VALID_KEYS = clsHtmlInterfaces_VALIDKEYS

class clsClassLog {
    constructor(validActions) {
        this.logs= []
        this.validActions = ["init"] + validActions
        this.Add({"action":"init"})
    }


    Add({action = "", parameters = [], divIDSource = "", divIDTarget = ""}) {
        if (!this.validActions.includes(action)) {
            cLOG.Add("[clsClassLog].Add: action: '" + action + "' is not valid" )
        }
        this.logs.push({
            "by": "html class",
            "action": action,
            "parameters": parameters,
            "divIDSource": divIDSource,
            "divIDTarget": divIDTarget})
    }

    AddUserInput(action) {
        this.logs.push({
            "by": "user",
            "action": action,
            "parameters": "",
            "divIDSource": "",
            "divIDTarget": ""})
    }

    EntriesSince(nthIndex) {
        return this.logs.slice(nthIndex)
    }

    LastIndex() {
        return this.logs.length-1
    }

    LastIndexByUser() {
        for (let i = this.LastIndex(); i>-1;i--) {
            if (this.logs[i]["by"] == "user") {
                return i}
            }
        return -1
    }

    IsLastItemUserInput(action) {
        if (this.logs[this.LastIndex()]["by"] != "user") {
            return false}
        if (this.logs[this.LastIndex()]["action"] != action) {
            return false}

        return true
    }

    WhatIvedDone() {
        if (this.LastIndex()>0) {
            return this.logs.slice(this.LastIndexByUser())
        }
        return null
    }

    _Click_Answer(lastAction = "", divID = "", val = "") {
        let antwort = {"action": "", "divID": "", "requestedBy": this.TargetDivID}
        if (lastAction == "HighlightRow") {
            divID = divID.split('] ')[1]
            antwort["action"] = lastAction
            antwort["divID"] = divID
            return antwort
        }
        if (lastAction == "ChangedCell") {
            if (this.mode.activeMode != "SIDEBAR") {
                divID = divID.split('] ')[1]
                return {"action": lastAction, "divID": divID, "val":val}
            }
        }
        return antwort

    }
}