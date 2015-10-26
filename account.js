function accountUpdate(mtran) {
	
	if (mtran.transType == "deposit") {
		//
	} else {
		
		var purch = Number(mtran.purchaseAmt);
		account.availableBalance += purch;
	}
	
	var acctbalbox = document.getElementById("acctbalbox");
	var acctavailbox = document.getElementById("acctavailbox");
	
	acctbalbox = account.currentBalance;
	acctavailbox = account.availableBalance;
}

