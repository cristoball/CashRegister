function enterNewMan() {
	document.getElementById("dispregister").style.display = "none";
	document.getElementById("newmantran").style.display = "block";
	document.getElementById("confirmauto").style.display = "none";
	document.getElementById("manualrecon").style.display = "none";
	
	var NmantranTbl = document.getElementById("NmantranTbl");
	var datePlbl = NmantranTbl.insertRow(0);
	var payeelbl = NmantranTbl.insertRow(1);
	var amtlbl = NmantranTbl.insertRow(2);
	var typelbl = NmantranTbl.insertRow(3);
	
	var datePbox = document.createElement("input");
	datePbox.setAttribute("id", "datePbox");
	datePbox.setAttribute("type", "date");
	var payeebox = document.createElement("input");
	payeebox.setAttribute("id", "payeebox");
	payeebox.setAttribute("type", "text");
	var amtbox = document.createElement("input");
	amtbox.setAttribute("id", "amtbox");
	amtbox.setAttribute("type", "text");
	var typebox = document.createElement("input");
	typebox.setAttribute("id", "typebox");
	typebox.setAttribute("type", "text");
	typebox.setAttribute("value", "check");
	
	datePlbl.insertCell(0).innerHTML = "Purchase Date:";
	payeelbl.insertCell(0).innerHTML = "Payee:";
	amtlbl.insertCell(0).innerHTML = "Purchase Amount:";
	typelbl.insertCell(0).innerHTML = "Transaction Type:";
	datePlbl.appendChild(datePbox);
	payeelbl.appendChild(payeebox);
	amtlbl.appendChild(amtbox);
	typelbl.appendChild(typebox);
	
	var submitbtn = document.createElement("div");
	submitbtn.setAttribute("id", "Nsubmitbtn");
	submitbtn.setAttribute("class", "button");
	submitbtn.setAttribute("onclick", "submitNewMan()");
	submitbtn.innerHTML = "Submit";
	NmantranTbl.appendChild(submitbtn);
}

	function submitNewMan() {
		var datePbox = document.getElementById("datePbox");
		var payeebox = document.getElementById("payeebox");
		var amtbox = document.getElementById("amtbox");
		var typebox = document.getElementById("typebox");
		
		
		var newguy = new Manualtran(datePbox.value, payeebox.value, amtbox.value, typebox.value, account);
		alert("New Transaction submitted");
	}
