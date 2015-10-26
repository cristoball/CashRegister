function displayRegister() {
	console.log("IN displayRegister()");
	document.getElementById("dispregister").style.display = "block";
	document.getElementById("newmantran").style.display = "none";
	document.getElementById("confirmauto").style.display = "none";
	document.getElementById("manualrecon").style.display = "none";
	
	var RpendingTblrowlength = document.getElementById("RpendingTbl").rows.length;
	var RcompletedTblrowlength = document.getElementById("RcompletedTbl").rows.length;
	if(RpendingTblrowlength > 1) {
		for(var i = RpendingTblrowlength-1; i > 0; i--) {
			document.getElementById("RpendingTbl").deleteRow(i);
		}
	}
	if(RcompletedTblrowlength > 1) {
		for(var i = RcompletedTblrowlength-1; i > 0; i--) {
			document.getElementById("RcompletedTbl").deleteRow(i);
		}
	}
	
	var pendingarray = [];
	for(var i = 0; i < banktrans.length; i++) {
		if(banktrans[i].reconDate == null) {
			pendingarray.push(banktrans[i]);
		}	
	}
	for(var i = 0; i < mantrans.length; i++) {
		pendingarray.push(mantrans[i]);
	}
	
	//	Populate Pending table
	pendingarray.sort(function (a, b) {
		if(a.datePurchase < b.datePurchase) { return -1; }
		if(a.datePurchase > b.datePurchase) { return 1; }
		return 0;	
	});
	
	if(pendingarray.length == 0) {
		var emptyrow = document.getElementById("RpendingTbl").insertRow(1);
		emptyrow.setAttribute("id", "emptyrow");
		emptyrow.innerHTML = "There are no transactions to show";
	}
	
	var pendtable = document.getElementById("RpendingTbl");
	for(var i = 0; i < pendingarray.length; i++) {
		var row = pendtable.insertRow(i+1);
		var rowname = "Rpendrow" + (i+1);
		row.setAttribute("id", rowname);
			if(pendingarray[i].autoreconflag == true) {
				row.insertCell(0).innerHTML = "Pending Auto-Recon"
			} else {
				row.insertCell(0).innerHTML = "";
			}
			if(pendingarray[i].reconDate === null) {
				row.insertCell(1).innerHTML = "bank";
			} else {
				row.insertCell(1).innerHTML = "manual";
			}
			row.insertCell(2).innerHTML = pendingarray[i].datePurchase.toDateString();
			row.insertCell(3).innerHTML = pendingarray[i].payee;
			row.insertCell(4).innerHTML = pendingarray[i].transType;
			row.insertCell(5).innerHTML = pendingarray[i].purchaseAmt;
	}
	
	var completedarray = [];
	for(var i = 0; i < banktrans.length; i++) {
		if(banktrans[i].reconDate != null) {
			completedarray.push(banktrans[i]);
		}	
	}
	
	completedarray.sort(function (a, b) {
		if(a.datePurchase < b.datePurchase) { return -1; }
		if(a.datePurchase > b.datePurchase) { return 1; }
		return 0;	
	});
	
	if(completedarray.length == 0) {
		var emptyrow = document.getElementById("RcompletedTbl").insertRow(1);
		emptyrow.setAttribute("id", "emptyrow");
		emptyrow.innerHTML = "There are no transactions to show";
	}
	
	var completetable = document.getElementById("RcompletedTbl");
	for(var i = 0; i < completedarray.length; i++) {
		var row = completetable.insertRow(i+1);
		var rowname = "Rcomprow" + (i+1);
		row.setAttribute("id", rowname);
			row.insertCell(0).innerHTML = completedarray[i].datePurchase.toDateString();
			row.insertCell(1).innerHTML = completedarray[i].payee;
			row.insertCell(2).innerHTML = completedarray[i].transType;
			row.insertCell(3).innerHTML = completedarray[i].purchaseAmt;
			row.insertCell(4).innerHTML = completedarray[i].reconDate.toDateString();
			row.insertCell(5).innerHTML = completedarray[i].balanceAsOf;
	}
}
