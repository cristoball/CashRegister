function accountUpdate(mtran) {
	
	if(mtran.transType == "deposit") {
		//
	} else {
		var avail = Number(account.availableBalance);
		var purch = Number(mtran.purchaseAmt);
		avail += purch;
	}
	
	var acctbalbox = document.getElementById("acctbalbox");
	var acctavailbox = document.getElementById("acctavailbox");
	
	acctbalbox = account.currentBalance;
	acctavailbox = account.availableBalance;
}

