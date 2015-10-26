
var mantrans = [];		//	keeps all open (i.e., non-reconcilled) manual transactions
var banktrans = [];		//	keeps all bank transactions (reconcilled & non-reconcilled)
var account = {};		//	keeps balance and avaialable balance
var reconrecords = [];	//	

function Transaction() {
	//	Fields
	this.transID = Transaction.counter++;				//	transID will be autogenerated
	this.datePurchase;
	this.payee;
	this.purchaseAmt;
	this.transType;
	this.autoreconflag = false;
	this.autoreconFKey;
}

Transaction.counter = 0;

// Transaction.prototype.newtrans = function (date, pay, purch, ttype) {
// 	this.datePurchase = new Date.parse(date);
// 	this.payee = pay;
// 	this.purchaseAmt = purch;
// 	this.transType = ttype;
// }

Transaction.prototype.datebefore = function () {
	return this.datePurchase - 5;
}

Transaction.prototype.dateafter = function () {
	return this.datePurchase + 5;
}






function Manualtran(pd, p, pA, tT, account) {
	Transaction.apply(this, []);
	this.datePurchase = new Date(pd);
	this.payee = p;
	this.purchaseAmt = pA;
	this.transType = tT;
	
	account.addNewManTrans(this);
};

Manualtran.prototype = Transaction.prototype;



function Banktran(pd, p, pA, tT, account) {
	//	Fields
	Transaction.apply(this, []);
	this.balanceAsOf;
	this.autoreconDate;
	this.reconDate = null;

	this.datePurchase = new Date(pd);
	this.payee = p;
	this.purchaseAmt = pA;
	this.transType = tT;

	account.addNewBankTrans(this);
	autorecon(this);
}

Banktran.prototype = Transaction.prototype;

Banktran.prototype.calcBalanceAsOf = function (totalBalance, transactionAmt) {
	return (totalBalance - transactionAmt);
};




function Account() {
	//	Fields
	this.accountID;
	this.currentBalance;
	this.availableBalance;
};

Account.counter = 0;

Account.prototype.newAccount = function (balance) {			//	Constructor
	this.accountID = Account.counter++;
	this.currentBalance = balance;
	this.availableBalance = balance;
};

Account.prototype.addNewBankTrans = function (banktran) {	//	subscribe to banktrans.push
console.log("IN account.addNewBankTrans: " + banktrans)
	var purch = Number(banktran.purchaseAmt);
	if (banktran.transType == "deposit") {
		this.currentBalance += purch;
		this.availableBalance += purch;
	} else {
		this.currentBalance -= purch;
		this.availableBalance -= purch;
	}
	banktrans.push(banktran);
};

Account.prototype.addNewManTrans = function (mantran) {
	var purch = mantrans.puchaseAmt
console.log("IN account.addNewManTrans: " + mantrans);
	if (mantrans.transType == "deposit") {
		// leave available balance alone
	} else {
		this.availableBalance -= purch;
	}
	mantrans.push(mantran);
};

function autorecon(bankTran) {						//	run when a new bankTran comes in
	var temparray = [];

	for (var i = 0; i < mantrans.length; i++) {		//	iterate through manual transaction array and put a copy
		if (mantrans[i].autoreconflag === false) {		//	of reference to manual transaction in array if 
			temparray.push(mantrans[i]);			//	trasaction has not been reconcilled yet (reconflag == false)
			//console.log("temparray[i] = " + temparray[i].purchaseAmt)
			console.log("mantrans[i].purchaseAmt = " + mantrans[i].purchaseAmt)
		}
	}
	console.log("temparray[0].purchaseAmt = " + temparray[0].purchaseAmt)
	for (var i = 0; i < temparray.length; i++) {		//	go through the unreconcilled transactions and for each:
		var x;
		if (temparray[i].payee.length < 4) {			//	make sure payee string is at least 5 characters long or
			x = temparray[i].payee.length			//	set the search to the length of the short string
		} else {
			x = 4;
		}

		var match = true;
		if (temparray[i].purchaseAmt === bankTran.purchaseAmt) {			//	1st, check that purchase amt is equal
			if (temparray[i].transType == bankTran.transType) {			//	2nd, make sure they are same transaction type
				if (temparray[i].datebefore() <= bankTran.datePurchase || temparray[i].dateafter() >= bankTran.datePurchase) {		// 3rd, make sure manual date is within 5 days of bank trans
					if (temparray[i].payee.toUpperCase().indexOf(bankTran.payee.toUpperCase().substr(0, x)) > -1) { 		// finally, make sure that at least some of the characters in the manual payee name is in bank payee name
						// leave that manual transaction in array and go to next one						
					} else {
						console.log("didn't match anything on payee check");
						match=false;
					}
				} else {
					console.log("didn't match anything on date check");
					match=false;
				}
			} else {
				console.log("didn't match anything on type check");
				match=false;
			}
		} else {
			console.log("didn't match anything on purchAmt");
			match=false;
		}
	
	if(match == true) {
		bankTran.autoreconflag = true;
		bankTran.autoreconDate = Date.now();
		bankTran.autoreconFKey = temparray[i].transID;
		temparray[i].autoreconflag = true;
		temparray[i].autoreconFKey = bankTran.transID;		
	} else {
		temparray.splice(i, 1);
	}
}

	
		
	//}
}
//	match man to bank trans
//	reverse man trans for correct availableBalance
/*
function selectmantran() { 		//	from sidebar menu to select open manual transaction
	var temparray = [];

	for (var i = 0; i < mantrans.length; i++) {		//	iterate through manual transaction array and put a copy
		if (mantrans[i].reconflag == false) {		//	of reference to manual transaction in array if 
			temparray.push(mantrans[i]);			//	trasaction has not been reconcilled yet (reconflag == false)
		}
	}

	if (temparray.length == 0) {
		console.log("There are no open manual transactions.");
	} else {
		console.log("Display list of transactions, pick one to recon.");
	}
	
	//	show the list of open manual transactions  UI HOOK
	//	wait for user to pick one to recon			UI HOOK
	//  call manualrecon and pass the manual transaction they picked
}

function manualrecon_listbanktrans(manTran) {				//	listens for pick from selectmantran() list UI		
	var temparray = [];

	for (var i = 0; i < banktrans.length; i++) {		//	iterate through bank transaction array and put a copy
		if (banktrans[i].reconflag == false) {		//	of reference to bank transaction in array if 
			temparray.push(banktrans[i]);			//	trasaction has not been reconcilled yet (reconflag == false)
		}
	}

	for (var i = 0; i < temparray.length; i++) {
		// add open bank transaction to list for UI		UI HOOK
		// options to sort by type/amt/name/etc.
	}
}

function reconSelect(tranA, tranB) {
	//	tran is either manTran or bankTran
	//	fn is either reconManToBanks or reconBanksToMan
	//  recon tran to element in list returned from fn
	if (tranA.purchaseAmt != tranB.purchaseAmt) {		//	amounts do not match
		alert("Amounts do not match. Are you sure these transactions are reconcilled?");
		//	give options to Continue or Cancel. if Continue, finish function, else exit function
	} else {
		if (tranA.transType != tranB.transType) {
			alert("The transaction types do not match. Are you sure these transaction are reconcilled?");
			// give options to Continue or Cancel...
		} else {
			// check date and payee?
		}
	}

	if (tranA.instanceOf("mantran")) {						//	checks if reconSelect was called with a manual or a bank trans	
		reconSet(tranB, tranA); 						//	call reconSet with banktrans as first arg, mantrans as 2nd arg
	} else {
		reconSet(tranA, tranB);						//	call reconSet with banktrans as first arg, mantrans as 2nd arg
	}
}

function reconSet(incbanktran, incmantran) {
	incbanktran.reconDate = Date.now();					//	set reconDate
	incbanktran.autoreconFKey = incmantran.transID;		//	set FKEY
	mantrans.splice(mantrans.findIndex(incmantran, 1));	//	remove mantran from mantrans[]
}

function getOpenMantrans() {
	var manlist = [];
	for (var i = 0; i < mantrans.length; i++)
		if (mantrans[i].autoreconflag == false) {
			manlist.push(mantrans[i]);
		}
	return manlist;
}

function getOpenBanktrans() {
	var banklist = [];
	for (var i = 0; i < banktrans.length; i++) {
		if (!banktrans[i].autoreconFKey && banktrans[i].autoreconflag == false) {
			banklist.push(banktrans[i]);
		}
	}
}

function reconManToBank() {
	var returnResults = [];
	returnResults.push({ bank: getOpenMantrans(), man: getOpenBanktrans() });
	return returnResults;
}

function reconBankToMan() {
	var returnResults = [];
	returnResults.push({ bank: getOpenBanktrans(), man: getOpenMantrans() });
	return returnResults;
}
*/
var initialize = (function () {
	var clicker3 = document.getElementById("menu3");
	console.log("Clicker3 = " + clicker3);
	clicker3.addEventListener("click", function () {

		console.log("IN INITIALIZE");
	}, false);
});

function runAutoRecon() {
	console.log("IN runAutoRecon()");
	autoRecon();
}

var ouraccount = new Account();
ouraccount.newAccount("1000.00");

var tran1 = new Manualtran("Oct 20, 2015", "got some Pizza", "20.00", "check", ouraccount);
console.log("Transaction.counter = " + Transaction.counter);
var bank1 = new Banktran("Oct 20, 2015", "Pizza Hut", "20.00", "check", ouraccount);
console.log("Transaction.counter = " + Transaction.counter);
var tran2 = new Manualtran("Oct 21, 2015", "cigarettes", "7.00", "check", ouraccount);
console.log("Transaction.counter = " + Transaction.counter);
var bank2 = new Banktran("Oct 22, 2015", "cigarettes", "7.00", "check", ouraccount);
console.log("Transaction.counter = " + Transaction.counter);
console.log(bank1.datePurchase);
console.log(tran1.autoreconFKey);
console.log(bank2.transID);
console.log(tran2.autoreconFKey);

var tran3 = new Manualtran("Oct 22, 2015", "new mouse", "35.00", "check", ouraccount);
var tran4 = new Manualtran("Oct 23, 2015", "7-11", "6.55", "check", ouraccount);
var bank3 = new Banktran("Oct 22, 2015", "microwave", "154.33", "check", ouraccount);
var bank4 = new Banktran("Oct 24, 2015", "Rocky Horror Tickets", "10.00", "check", ouraccount);
var bank5 = new Banktran("Oct 1, 2015", "cigarettes", "6.55", "check", ouraccount);

//var user = { name: "name", age: 25 }
//console.log("Serialize all the things");
//serialize("all", user);
//console.log("Deserialize all the things");
//var userTest = deserialize("all");
//console.log(userTest);
//console.log("banks.autoreconFKey = " + bank1.autoreconFKey);
//console.log("bank1.transID = " + bank1.transID);
//console.log("tran1.autoreconKey = " + tran1.autoreconFKey);
//console.log("tran1.transID = " + tran1.transID);