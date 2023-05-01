var xhr = new XMLHttpRequest();

class clsHTTP {
  constructor() {
    this.CSVS = {"Start":"https://raw.githubusercontent.com/csvhtml/csvhtml.github.io/main/csv-files/Start.csv"}
  }

  GetCSV(name, calllback) {
    return XHR_GetFileCB(this.CSVS[name], calllback)
  }
}

function XHR_GetFile(url) {

  xhr.onreadystatechange = function ()
  {
    if (xhr.readyState == 4) {
      var resp = xhr.responseText
      return resp
    }
  }
  xhr.open("GET", url, true);
  xhr.send();
}

function XHR_GetFileCB(url, CallBack) {

    xhr.onreadystatechange = function ()
    {
      if (xhr.readyState == 4) {
        var resp = xhr.responseText
        CallBack(resp)
        // console.log(resp)
        // return resp
      }
    }
    xhr.open("GET", url, true);
    xhr.send();
}


function XCallBack(text) {
    console.log(text)
}


function testHTTP() {
    // let url = "https://support.staffbase.com/hc/en-us/article_attachments/360009197031/username.csv"
    url = "https://raw.githubusercontent.com/csvhtml/csvhtml.github.io/main/csv-files/Start.csv"
    let callback = XCallBack
    
    XHR_GetFileCB(url, callback)
}