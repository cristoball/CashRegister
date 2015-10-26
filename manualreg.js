function ManuallyReconTrans(mTbORbTm) {							//	STEP 1 - these 2 functions simply pass the open trans in the right order
	console.log("IN ManuallyReconTrans. option = " + mTbORbTm);
	console.log("TRYING TO GET TO CLEFT");
	console.log(document.getElementById("Cleft"));
	var returnResults = [];
	returnResults.push( { order: mTbORbTm, man: getOpenMantrans(), bank: getOpenBanktrans() } );
	document.getElementById("dispregister").style.display = "none";
	document.getElementById("newmantran").style.display = "none";
	document.getElementById("confirmauto").style.display = "none";
	
	return returnResults;
}

		function getOpenMantrans() {							//	STEP 1.5 (helper functions that load local arrays)
			var manlist = [];
			for(var i = 0; i < mantrans.length; i++)
				if(mantrans[i].autoreconflag === false) {
					manlist.push(mantrans[i]);
				}
			return manlist;
		}
		
		function getOpenBanktrans() {
			var banklist = [];
			for(var i = 0; i < banktrans.length; i++) {
				if(banktrans[i].autoreconflag === false && banktrans[i].reconDate === null) {
					banklist.push(banktrans[i]);
				}
			}
			return banklist;
		}

function displaymantrans(returnedResults) { 		//	STEP 2 - takes returnedResults from STEP 1 and processes them
console.log("Now processing displaymantrans");	
	document.getElementById("dispregister").style.display = "none";
	document.getElementById("newmantran").style.display = "none";
	document.getElementById("confirmauto").style.display = "none";
	document.getElementById("manualrecon").style.display = "block";
	cancelManRecon("1");

	var incAtrans = [];
	var incBtrans = [];

console.log("returnedResults of displaymantrans:");
console.log(returnedResults);

	var returnManLength = returnedResults[0].man.length; 				
	var returnBnkLength = returnedResults[0].bank.length;
	var orderoption = returnedResults[0].order;
console.log("IN displaymantrans. option = " + orderoption);	
	if(orderoption == "4" || orderoption == "5") {				//	check #1 - order option
		//	continue
	} else {
		alert("Illegal option passed to displaymantrans (4 or 5 only)");
	}
	document.getElementById("manualrecon").orderoption = orderoption;
	
	if(returnManLength == 0 || returnBnkLength == 0) {	//	check #2 - 0 length return
		alert("There are no open transactions to reconcile.");
		//	exit out of function (call 1. Display Register)
	}
	
	//	STEP 2.1 - populate incAtrans and incBtrans
	if(orderoption == 4) {							//	ManToBank
		for(var i = 0; i < returnManLength; i++) {			//	populate local manual array
			incAtrans.push(returnedResults[0].man[i]);
		}
		for(var i = 0; i < returnBnkLength; i++) {			//	populate local bank array
			incBtrans.push(returnedResults[0].bank[i]);
		}
	} else {										//	BankToMan
		for(var i = 0; i < returnBnkLength; i++) {			//	populate local bank array
			incAtrans.push(returnedResults[0].bank[i]);
		}
		for(var i = 0; i < returnManLength; i++) {			//	populate local manual array
			incBtrans.push(returnedResults[0].man[i]);
		}
	}
	
	//	STEP 2.2 - build listA table
	var tableinstA = document.getElementById("listA");
	tableinstA.setAttribute("display", "block");
	for(var i = 0; i < incAtrans.length; i++) {
		var row = tableinstA.insertRow(i+1);
		var rownameA = "Arow" + (i+1);
		row.setAttribute("id", rownameA);
		document.getElementById(rownameA).transobj = incAtrans[i];
		document.getElementById(rownameA).appendChild(document.createElement("input"));
		document.getElementById(rownameA).firstChild.setAttribute("type", "radio");
		document.getElementById(rownameA).firstChild.setAttribute("name", "Mradio");
		document.getElementById(rownameA).firstChild.setAttribute("id", rownameA + "rdo");
		document.getElementById(rownameA).firstChild.setAttribute("onclick", "pickleft(" + rownameA + ")");
			row.insertCell(0).innerHTML = incAtrans[i].datePurchase.toDateString();
			row.insertCell(1).innerHTML = incAtrans[i].payee;
			row.insertCell(2).innerHTML = incAtrans[i].transType;
			row.insertCell(3).innerHTML = incAtrans[i].purchaseAmt;
	}
	
	//	STEP 2.3 - build listB table	
	var tableinstB = document.getElementById("listB");
	tableinstB.setAttribute("display", "block");
	for(var i = 0; i < incBtrans.length; i++) {
		var row = tableinstB.insertRow(i+1);
		var rownameB = "Brow" + (i+1);
		row.setAttribute("id", rownameB);
		document.getElementById(rownameB).transobj = incBtrans[i];
		document.getElementById(rownameB).appendChild(document.createElement("input"));
		document.getElementById(rownameB).firstChild.setAttribute("type", "radio");
		document.getElementById(rownameB).firstChild.setAttribute("name", "Bradio");
		document.getElementById(rownameB).firstChild.setAttribute("id", rownameB + "rdo");
		document.getElementById(rownameB).firstChild.setAttribute("onclick", "pickright(" + rownameB + ")");
		document.getElementById(rownameB).firstChild.setAttribute("disabled", true);			//	list B buttons are disabled until after listA selection is made
			row.insertCell(0).innerHTML = incBtrans[i].datePurchase.toDateString();
			row.insertCell(1).innerHTML = incBtrans[i].payee;
			row.insertCell(2).innerHTML = incBtrans[i].transType;
			row.insertCell(3).innerHTML = incBtrans[i].purchaseAmt;
	} 
}	 

function pickleft(rownameA) {							//	STEP 3 - pick left side line for recon
console.log("IN pickleft(rownameA)");
	var inctrans = rownameA.transobj;
	var maninst = document.getElementById("listA");	
	var rowlength = (document.getElementById("listA").rows.length - 1);
	maninst.selected = inctrans;												//	attach trans to table (for use in confirm)
console.log("IN pickleft(rownameA). listA.rows.length = " + document.getElementById("listA").rows.length);	
	for(var j = rowlength; j > 0; j--) {		//	delete all rows
		maninst.deleteRow(j);
console.log("DELETE ROW " + j);
	}
	var selectedrow = maninst.insertRow(1);										//	add new row with inctrans info
		selectedrow.insertCell(0).innerHTML = inctrans.datePurchase.toDateString();
		selectedrow.insertCell(1).innerHTML = inctrans.payee;
		selectedrow.insertCell(2).innerHTML = inctrans.transType;
		selectedrow.insertCell(3).innerHTML = inctrans.purchaseAmt;
	for(var k = 1; k < document.getElementById("listB").rows.length; k++) {		//	make listb table radio buttons available
		var Browname = "Brow" + k;
		document.getElementById(Browname).firstChild.removeAttribute("disabled");
	}
}

function pickright(rownameB) {				//	STEP 4 - pick right side line for recon
	var inctrans = rownameB.transobj;
	var maninst = document.getElementById("listB");
	var rowlength = (document.getElementById("listB").rows.length - 1);
	maninst.selected = inctrans;												//	attach trans to table (for use in confirm)
	for(var j = rowlength; j > 0; j--) {		//	delete all rows
		maninst.deleteRow(j);
	}
	var selectedrow = maninst.insertRow(1);										//	add new row with inctrans info
		selectedrow.insertCell(0).innerHTML = inctrans.datePurchase.toDateString();
		selectedrow.insertCell(1).innerHTML = inctrans.payee;
		selectedrow.insertCell(2).innerHTML = inctrans.transType;
		selectedrow.insertCell(3).innerHTML = inctrans.purchaseAmt;
	displayCommitCancelButtons();  									//	call commitmanrecon()
}

function displayCommitCancelButtons() {		//	STEP 5 - create buttons to commit or cancel
	var manualrecondiv = document.getElementById("manualrecon");
	var confirmbtn = document.createElement("div");
		confirmbtn.setAttribute("id", "confirmbtn");
		confirmbtn.setAttribute("class", "button");
		confirmbtn.setAttribute("onclick", "confirmManRecon()");
		confirmbtn.innerHTML = "Confirm Transaction";
	var cancelbtn = document.createElement("div");
		cancelbtn.setAttribute("id", "cancelbtn");
		cancelbtn.setAttribute("class", "button");
		cancelbtn.setAttribute("onclick", "cancelManRecon()");
		cancelbtn.innerHTML = "Cancel Transaction";
	manualrecondiv.appendChild(confirmbtn);
	manualrecondiv.appendChild(cancelbtn);
}

function confirmManRecon() {				//	STEP 6 - confirm ManRecon
	var selectionA = document.getElementById("listA").selected;
	var selectionB = document.getElementById("listB").selected;
console.log("IN confirmManRecon. selectionA.reconDate:")
console.log(selectionA.reconDate);	
	reconCheck(selectionA, selectionB);

	var mantranslength = mantrans.length;
	var banktranslength = banktrans.length;

	if(selectionA.reconDate === undefined) {				//	A is the man tran, splice out of mantrans, populate B, and update Account (reverse A)
		for(var i = 0; i < mantranslength; i++) {
			if(selectionA.transID === mantrans[i].transID) {
				mantrans.splice(i, 1);
				selectionB.autoreconflag = false;
				selectionB.autoreconFKey = selectionA.transID;
				selectionB.autoreconDate = null; 				//	set autoreconDate and reconDate
				selectionB.reconDate = new Date(Date.now());
console.log("IN confirmManRecon. seelctionB after update: " + selectionB);
				accountUpdate(selectionA);
			} else {
				//	
			}
		}
	} 
	else {													//	B is the man tran, splice out of mantrans, populate A, and update Account (reverse B)
		for(var i = 0; i < mantranslength; i++) {
			if(selectionB.transID === mantrans[i].transID) {
				mantrans.splice(i, 1);
				selectionA.autoreconflag = false;
				selectionA.autoreconFKey = selectionB.transID;
				selectionA.autoreconDate = null; 				//	set autoreconDate and reconDate
				selectionA.reconDate = new Date(Date.now());
				console.log("IN confirmManRecon. seelctionA after update: " + selectionA);
				accountUpdate(selectionB);
			}
		}
	}
	
	alert("Transactions have been successfully reconcilled. ");
	cancelManRecon();
}

function reconCheck(tranA, tranB) {			//	STEP 6.1 - make sure amount and type agree for manual recon
	//	tran is either manTran or bankTran
	//	fn is either reconManToBanks or reconBanksToMan
	//  recon tran to element in list returned from fn
	if(tranA.purchaseAmt != tranB.purchaseAmt) {		//	amounts do not match
		alert("Amounts do not match. Are you sure these transactions are reconcilled?");
		//	give options to Continue or Cancel. if Continue, finish function, else exit function
	} else {
		if(tranA.transType != tranB.transType) {
			alert("The transaction types do not match. Are you sure these transaction are reconcilled?");
			// give options to Continue or Cancel...
		} else {
			// check date and payee?
		}		
	} 
}

function cancelManRecon(x) {
	var listArowlength = document.getElementById("listA").rows.length - 1;
	var listBrowlength = document.getElementById("listB").rows.length - 1;
	for(var i = listArowlength; i > 0; i--) {
		document.getElementById("listA").deleteRow(i);
	}
	
	for(var i = listBrowlength; i > 0; i--) {
		document.getElementById("listB").deleteRow(i);
	}

	document.getElementById("listA").selected = null;
	document.getElementById("listB").selected = null;
	if(document.getElementById("confirmbtn")) {
		document.getElementById("manualrecon").removeChild(document.getElementById("confirmbtn"));
		document.getElementById("manualrecon").removeChild(document.getElementById("cancelbtn"));
	}
	if(x != 1) {
		displaymantrans(ManuallyReconTrans(document.getElementById("manualrecon").orderoption));
	}
}

/* function manualrecon_listtrans(tran) {				//	I don't think this function is used...		
		var temparray = [];
	
	for(var i = 0; i < banktrans.length; i++) {		//	iterate through bank transaction array and put a copy
		if(banktrans[i].reconflag == false) {		//	of reference to bank transaction in array if 
			temparray.push(banktrans[i]);			//	trasaction has not been reconcilled yet (reconflag == false)
		}
	}
	
	for(var i = 0; i < temparray.length; i++) {
		// add open bank transaction to list for UI		UI HOOK
		// options to sort by type/amt/name/etc.
	}
} */