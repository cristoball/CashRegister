function autoRecon() {

console.log("IN autoRecon()")
  var openbankarray = [];//temp array for flagged tran
  var openmanarray = [];//temp array for flagged tran
  
  clearrows();
  clearopenarray();
  
  document.getElementById("dispregister").style.display = "none";
	document.getElementById("newmantran").style.display = "none";
	document.getElementById("confirmauto").style.display = "block";
	document.getElementById("manualrecon").style.display = "none";
  
  popOpenBankArray(openbankarray, openmanarray);
}

function popOpenBankArray(openbankarray, openmanarray) {
    var resultsarray = [];//array to store matched trans 
    var foundmatch = 0;
console.log("IN popOpenBankArray ")
console.log("banktrans.length = " + banktrans.length);
    
    for(var i = 0; i < banktrans.length; i++) {
      if(banktrans[i].autoreconflag == true) {
console.log("IN 1st loop: " + "loop i = " + i + " " + banktrans[i].autoreconflag);  
        for(var j = 0; j < mantrans.length; j++) {
          if(objectsAreSame(mantrans[j], banktrans[i])) {
              openbankarray.push(banktrans[i]);
              openmanarray.push(mantrans[j]);
              foundmatch++; // found corresponding man tran
          }
        }
      }
    }
      if(foundmatch == 0) {
        alert("No transaction currently available for reconcilliation");
        displayRegister();
        //  maybe use return here? worried about leaving this open...
      }
    

console.debug("openbankarray.length = " + openbankarray.length);
    for(var k = 0; k < openbankarray.length; k++) {
      resultsarray.push({ bank: openbankarray[k], man: openmanarray[k] });  //write to array
    }

console.log("IN end of AutoRecon()" + resultsarray);
    displayAutoRecon(resultsarray);     
}

function objectsAreSame(incmantran, incbanktran) {
console.log("IN objectsaresame: " + " " + incmantran.transID + " " + incbanktran.autoreconFKey);
console.log(incmantran.transID === incbanktran.autoreconFKey);
  if (incmantran.transID === incbanktran.autoreconFKey) {
    return true;
  }
  else {
    return false;
  }
}

function test(resultsarray) {
console.log("resultsarray = " + resultsarray)
}

function displayAutoRecon(resultsarray) {
console.log("In displayAutoRecon()");
console.log("resultsarray.length: " + resultsarray.length);
      
    var tableinstA = document.getElementById("ClistA");
    tableinstA.setAttribute("display", "block");
    
    for (var i = 0; i < resultsarray.length; i++) {
      var row = tableinstA.insertRow(i+1);
      var rownameA = "CArow" + (i+1);
      row.setAttribute("id", rownameA);
        document.getElementById(rownameA).transObj = resultsarray[i].man;
        row.insertCell(0).innerHTML = resultsarray[i].man.datePurchase;
        row.insertCell(1).innerHTML = resultsarray[i].man.payee;
        row.insertCell(2).innerHTML = resultsarray[i].man.transType;
        row.insertCell(3).innerHTML = resultsarray[i].man.purchaseAmt;
    }
    
    var tableinstB = document.getElementById("ClistB");
    tableinstA.setAttribute("display", "block");
    
    for (var i = 0; i < resultsarray.length; i++) {
      var row = tableinstB.insertRow(i+1);
      var rownameB = "CBrow" + (i+1);
      row.setAttribute("id", rownameB);
      document.getElementById(rownameB).transObj = resultsarray[i].bank;
        row.insertCell(0).innerHTML = resultsarray[i].bank.datePurchase;
        row.insertCell(1).innerHTML = resultsarray[i].bank.payee;
        row.insertCell(2).innerHTML = resultsarray[i].bank.transType;
        row.insertCell(3).innerHTML = resultsarray[i].bank.purchaseAmt;
      displayConfirmDenyButtons(i); 
    }   
}   

     
///TRYING TO AD BUTTONS***************
function displayConfirmDenyButtons(x) {	  
    var i = Number(x);
  console.log("in DCDB");
  //  var tableinstA = document.getElementById("ClistA");
  //  var row = tableinstA.insertRow(i+1);
  //  var rownameA = "CArow" + (i+1);
  //     row.setAttribute("id", rownameA);
      
  //  var tableinstB = document.getElementById("ClistB");
  //  var row = tableinstB.insertRow(i+1);
  //  var rownameB = "CBrow" + (i+1);
  //     row.setAttribute("id", rownameB); THIS SECTION DOES NOTHING WHEN UNCOMMENTED??????????
      
  var confirmbtnname = "confirmbutton" + (i+1);
	var confirmbtn = document.createElement("div");
		confirmbtn.setAttribute("id", confirmbtnname);
		confirmbtn.setAttribute("class", "button");
		confirmbtn.setAttribute("onclick", "confirm(" + i + ")");
		confirmbtn.innerHTML = "Confirm Transaction";
    
	var denybtn = document.createElement("div");
  var denybtnname = "denybutton" + (i+1);
		denybtn.setAttribute("id", denybtnname);
		denybtn.setAttribute("class", "button");
		denybtn.setAttribute("onclick", "deny(" + i + ")");
		denybtn.innerHTML = "deny Transaction";

	document.getElementById("Cleft").appendChild(confirmbtn);
  document.getElementById("Cleft").appendChild(denybtn);
 // console.log("in DCDB " + rownameA);
}
  
function confirm(x){
  var i = Number(x);
console.log("in confirm " + i);
  var manA = document.getElementById("CArow" + (i+1)).transObj;
console.log(document.getElementById("CArow"));
  var bankB = document.getElementById("CBrow" + (i+1)).transObj;
 // var reconArray=[];
 
  bankB.autoreconflag=false;
  bankB.autoreconDate = null;
  bankB.autoreconFKey= manA.transID;
  bankB.reconDate = new Date(Date.now());
 //need to get the reconcilled trans into storage new array or try to pop mantrans array?
 // reconArray.push("CArow" + (i+1));
console.log(mantrans);
 for (var j = 0; j< mantrans.length; j++) {
  if(mantrans[j].transID === manA.transID){
console.log("confrim reconilliation: i=" + j + " mantrans: " + mantrans[j].transID);
    mantrans.splice(j,1);
    accountUpdate(manA);
    alert("transactions reconcilled");
      }  
    }
    
    clearopenarray();
    clearrows();
    autoRecon();
   //document.getElementById("confirmbtnname").innerHTML=""; // reset the HTML
   //document.getElementById("denybtnname").innerHTML=""; // reset the HTML
 }

function deny(x){
   var i = Number(x);
   var manA = document.getElementById("CArow" + (i+1)).transObj;
   var bankB = document.getElementById("CBrow" + (i+1)).transObj;
console.log(document.getElementById("CArow" + (i+1))); 
   
    manA.autoreconflag = false;
    manA.autoreconDate = null;
    bankB.autoreconflag = false;
    bankB.autoreconDate = false;
console.log("manA " + manA[i]);
    alert("transaction marked unreconcilled");
    
    clearopenarray();
    clearrows();
    autoRecon();
}

function clearrows() {
    var listCArowlength = document.getElementById("ClistA").rows.length - 1;
    var listCBrowlength = document.getElementById("ClistB").rows.length - 1;
    for(var i = listCArowlength; i > 0; i--) {
        document.getElementById("ClistA").deleteRow(i);
        if(document.getElementById("confirmbutton1")) {
            document.getElementById("Cleft").removeChild(document.getElementById("confirmbutton" + (i)));
            document.getElementById("Cleft").removeChild(document.getElementById("denybutton" + (i)));
        }
    }
    
    for(var i = listCBrowlength; i > 0; i--) {
        document.getElementById("ClistB").deleteRow(i);
    }

    //document.getElementById("CArow").selected = null;
    //document.getElementById("CBrow").selected = null;
}

function clearopenarray() {
  delete openbankarray;
  delete openmanarray;
  delete resultsarray;
  //delete document.getElementById();
}