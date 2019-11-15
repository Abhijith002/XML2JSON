// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require("fs");
const {
    dialog, app
} = require("electron").remote;
var xml2js = require('xml2js');
var parser = new xml2js.Parser({
    explicitArray: false
});
// var basepath = app.getAppPath();
// var targetpath = app.getAppPath();
var basepath = "";
var targetpath = "";
var json = "";

document.getElementById("inlineRadio2").addEventListener("change", () => {
    if(document.getElementById("inlineRadio2").checked) {
        document.getElementById("fromDate").hidden = false;
        document.getElementById("toDate").hidden = false;
        $('#inpFromDate').datepicker({
            autoclose: true
        });
        $('#inpToDate').datepicker({
            autoclose: true
        });
        var date =  $('#inpFromDate').datepicker('getDate');
        var tmpStmp = new Date(date);
        var iso = tmpStmp.toISOString();
    }
});

document.getElementById("inlineRadio1").addEventListener("change", () => {
    if(document.getElementById("inlineRadio1").checked) {
        document.getElementById("fromDate").hidden = true;
        document.getElementById("toDate").hidden = true;
    }
});

document.getElementById("btn").addEventListener("click", () => {
    // dialog.showOpenDialog((fileNames) => {
        // fileNames is an array that contains all the selected
        // if (fileNames === undefined) {
        if (basepath === "") {
            alert("Please select the source file");
            return;
        }
        if (targetpath === "") {
            alert("Please select the target path");
            return;
        }
        fs.readFile(basepath, 'utf-8', (err, data) => {
            if (err) {
                alert("An error ocurred reading the file :" + err.message);
                return;
            }

            const options = {
                type: 'question',
                buttons: ['Yes', 'No'],
                defaultId: 2,
                title: 'Question',
                message: 'Is this initial load file?',
                detail: 'Please specify the type of data in the file, if its Initial load or delta load',
              };
            
              dialog.showMessageBox(null, options, (response, checkboxChecked) => {
                if(response === 0) {
                    parser.parseString(data, function (err, result) {
                        json = JSON.stringify(result["soap:Envelope"]["soap:Body"]["GetActiveEmployeesInfoResponse"]["GetActiveEmployeesInfoResult"]["EmpActiveDetailEntity"], null, 3);
                    });
                } else {
                    // Change how to handle the file content
                    // console.log("The file content is : " + data);
                    parser.parseString(data, function (err, result) {
                        // console.log(JSON.stringify(result));
                        json = JSON.stringify(result["soap:Envelope"]["soap:Body"]["GetAllMovementResponse"]["GetAllMovementResult"]["EmpMovDetailEntity"], null, 3);
                        // console.log(basepath);
                    });
                }
                // fileName is a string that contains the path and filename created in the save file dialog.  
                fs.writeFile(targetpath+"\\"+"hrmart_emp.txt", json, (err) => {
                    if (err) {
                        alert("An error ocurred creating the file " + err.message)
                    }
    
                    alert("The file has been succesfully saved");
                });
              });
        });
    // });
}, false);

document.getElementById("btnRtr").addEventListener("click", () => {
    $('.toast').toast({delay: 3000});    
    var frmDate = "";
    var toDate = "";
    var sr = '';
    var initialLoad = false;
    var deltaLoad = false;
    if(!document.getElementById("inlineRadio2").checked && !document.getElementById("inlineRadio1").checked) {
        $("#smallAlert").html(new Date().getDate()+"/"+new Date().getMonth()+"/"+new Date().getFullYear());
        $(".toast-body").html("Please select Initial Load/Delta Load");
        $('.toast').toast('show');
        return;
    }
    if(document.getElementById("inlineRadio2").checked) {
        frmDate = $("#inpFromDate").val();
        toDate = $("#inpToDate").val();
        if(frmDate === "" || toDate === "") {
            $("#smallAlert").html(new Date().getDate()+"/"+new Date().getMonth()+"/"+new Date().getFullYear());
            $(".toast-body").html("Please select from and to dates for the delta load");
            $('.toast').toast('show');
            return;
        } else {
            frmDate = new Date(frmDate).toISOString();
            toDate = new Date(toDate).toISOString();
        }
    }
    if (targetpath === "") {
            $("#smallAlert").html(new Date().getDate()+"/"+new Date().getMonth()+"/"+new Date().getFullYear());
            $(".toast-body").html("Please select the target path");
            $('.toast').toast('show');
            return;
        }
        document.getElementById("loader").style.visibility = "visible";
        var xmlhttp = new XMLHttpRequest();
        if(document.getElementById("inlineRadio1").checked) {
            xmlhttp.open('POST', 'https://www.hr-mart.com/services/formulahr_hris.asmx', true);
            sr = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">'
                     + '<soapenv:Header/>'
                     + '<soapenv:Body>'
                     + '<tem:GetActiveEmployeesInfo>'
                     + '<tem:AppID>AFFLG90NKIUMBCI</tem:AppID>'
                     + '<tem:Username>APIADMIN</tem:Username>'
                     + '<tem:Password>VxF#RList</tem:Password>'
                     + '<tem:Empid></tem:Empid>'
                     + '</tem:GetActiveEmployeesInfo>'
                     + '</soapenv:Body>'
                     + '</soapenv:Envelope>';
                     initialLoad = true; 
        }
        if(document.getElementById("inlineRadio2").checked) {
            xmlhttp.open('POST', 'https://www.hr-mart.com/services/formulahr_hris.asmx?op=GetAllMovement', true);
            sr = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">'
                     + '<soapenv:Header/>'
                     + '<soapenv:Body>'
                     + '<tem:GetAllMovement>'
                     + '<tem:AppID>FHRHRIS</tem:AppID>'
                     + '<tem:Username>FHRADMIN</tem:Username>'
                     + '<tem:Password>$ser%Hr!$@LM0v#15*</tem:Password>'
                     + '<tem:FromDate>'+frmDate+'</tem:FromDate>'
                     + '<tem:ToDate>'+toDate+'</tem:ToDate>'
                     + '<tem:Empid></tem:Empid>'
                     + '</tem:GetAllMovement>'
                     + '</soapenv:Body>'
                     + '</soapenv:Envelope>';
                     deltaLoad = true; 
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                        parser.parseString(xmlhttp.responseText, function (err, result) {
                            if(initialLoad === true) {
                                json = JSON.stringify(result["soap:Envelope"]["soap:Body"]["GetActiveEmployeesInfoResponse"]["GetActiveEmployeesInfoResult"]["EmpActiveDetailEntity"], null, 3);
                            } else if(deltaLoad === true) {
                                json = JSON.stringify(result["soap:Envelope"]["soap:Body"]["GetAllMovementResponse"]["GetAllMovementResult"]["EmpMovDetailEntity"], null, 3); 
                            }
                        });
                        // fileName is a string that contains the path and filename created in the save file dialog.  
                        fs.writeFile(targetpath+"\\"+"hrmart_emp.txt", json, (err) => {
                            if (err) {
                                alert("An error ocurred creating the file " + err.message)
                            }
                            alert("The file has been succesfully saved");
                        });
                        document.getElementById("loader").style.visibility = "hidden";
                    }
                }
            }
        // Send the POST request
        xmlhttp.setRequestHeader('Content-Type', 'text/xml');
        xmlhttp.send(sr);
}, false);

document.getElementById("button-addon2").addEventListener("click", () => {
    dialog.showOpenDialog((fileNames) => {
        // fileNames is an array that contains all the selected
        if (fileNames === undefined) {
            console.log("No file selected");
            return;
        } else {
            basepath = fileNames[0];
            document.getElementById("inpFile").value = basepath;
        }
    });
}, false);

document.getElementById("button-addon3").addEventListener("click", () => {
    dialog.showOpenDialog({ properties: ['openDirectory'] },(fileNames) => {
        // fileNames is an array that contains all the selected
        if (fileNames === undefined) {
            console.log("No file selected");
            return;
        } else {
            targetpath = fileNames[0];
            document.getElementById("outFile").value = targetpath;
        }
    });
}, false);

// document.addEventListener('DOMContentLoaded', () => {
//     document.getElementById("outFile").value = targetpath;
//     document.getElementById("inpFile").value = basepath;
// }, false);