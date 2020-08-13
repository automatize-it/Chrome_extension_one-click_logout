var logouts = 99;
var fcsdon = false;

var ocllgoutSttngsArr = {
	'Google': {'lnk': 'https://accounts.google.com/Logout', 'enabled': '0'},
	'Mailru': {'lnk': 'https://auth.mail.ru/cgi-bin/logout?next=1&lang=ru_RU&Page=https%3A%2F%2Fmail.ru%2F%3Ffrom%3Dlogout','enabled': '0'}
};

var currsttngs = {};


Object.size = function(obj) {
    
	var size = 0, key;
    
	for (key in obj) {
        
		if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


function popuphndlr(){
	
	//translation
	//localize_menu();
	
	//debug
	//chrome.storage.local.set({'oneclicklogout_settings': null}, function(){});
	//chrome.storage.local.set({'oneclicklogout_settings': ocllgoutSttngsArr}, function(){});
	
	chrome.storage.local.get({'oneclicklogout_settings': {}}, function (result) {
		
		if ( Object.size(result.oneclicklogout_settings) == 0){
			
			chrome.storage.local.set({'oneclicklogout_settings': ocllgoutSttngsArr}, function(){});
		}
		else {
			
			currsttngs = result;
			logouts = Object.size(currsttngs.oneclicklogout_settings);
		}
		
		dostuff();
	});
	
}


function sleep(ms) {
  
  return new Promise(resolve => setTimeout(resolve, ms));
}


function waitnclose(){
	
	sleep(700).then(() => { if (!fcsdon){ window.close();} });
}


function docheckbox(event, name){
	
	if (event.target.type == "checkbox"){
		
		var tmp = name;
		var tmpstate = '0'; if (event.target.checked) tmpstate = '1';
		
		currsttngs.oneclicklogout_settings[name]['enabled'] = tmpstate;
			
		chrome.storage.local.set({"oneclicklogout_settings": currsttngs.oneclicklogout_settings}, function(){
			
			window.location.reload(true);		
			chrome.tabs.executeScript(null,{code: "window.location = window.location;"});
		});
	}
}


function genHtmlEl(name){
	
	var mndv = document.getElementById("maindiv");
	
	let tmp = document.createElement("div");
	let tmpinnerdiv = document.createElement("div");
	let tmpinput = document.createElement("input");
	let tmpimg = document.createElement("img");
	let ret = false;
	
	tmp.classList.add("itemstr");
	tmp.id = name + "_div";
	
	tmpinput.type = "checkbox";
	
	tmpinnerdiv.classList.add("statstr");
	tmpinnerdiv.id = (name+"_wait");
		
	tmpinput.id = name + "_chkbx";
	tmpinput.value = name;
	
	tmpimg.classList.add("logo");
	tmpimg.src = "img/"+name+"_logo_16px.png";
	
	if (currsttngs.oneclicklogout_settings[name]['enabled'] == 1) { 
		
		tmpinput.checked = true;
		tmpinnerdiv.innerText = name+" logging out...";
		ret = true; 
	}
	else{
		
		tmpinnerdiv.innerText = "Fast logoff disabled";
		logouts--;
	}
	
	tmp.appendChild(tmpinput);
	tmp.appendChild(tmpimg);
	//tmp.innerHTML += "<img src=\"img/"+name+"_logo_16px.png\" class=\"logo\">";
	tmp.appendChild(tmpinnerdiv);
	
	mndv.appendChild(tmp);
	
	document.getElementById(name + "_chkbx").addEventListener("click", function(event){
		
		docheckbox(event, event.target.value);
	});
	
	return ret;
}


function dostuff(){
	
	document.getElementById("infobox").innerText = "Select services for fast logout";
	
	for (var srvc in currsttngs.oneclicklogout_settings) {
		
		if (genHtmlEl(srvc)){
			
			document.getElementById("infobox").innerText = "";
			logoutSrvc(srvc);
		}
	}
}


function logoutSrvc(name){
	
	var xmlHttp = new XMLHttpRequest();
	
	xmlHttp.open("GET", currsttngs.oneclicklogout_settings[name]['lnk'], true); // true for asynchronous 
    
	xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
			
			document.getElementById(name+"_wait").innerHTML = name+" logout done!";
			
			logouts--;
			if (logouts < 1) {waitnclose();}
			
		}
    }	
	
	xmlHttp.send(null);
}


function logoutFunc(){
		
	var xmlHttp = new XMLHttpRequest();
	 
	xmlHttp.open("GET", "https://accounts.google.com/Logout", true); // true for asynchronous 
    
	xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
			
			document.getElementById("google_wait").innerHTML = "Google logout done!";
			
			logouts--;
			if (logouts < 1) {waitnclose();}
			
		}
    }	
	
	xmlHttp.send(null);
	
	var xmlHttp2 = new XMLHttpRequest();
     
	xmlHttp2.open("GET", "https://auth.mail.ru/cgi-bin/logout?next=1&lang=ru_RU&Page=https%3A%2F%2Fmail.ru%2F%3Ffrom%3Dlogout", true);
	
	xmlHttp2.onreadystatechange = function() { 
        if (xmlHttp2.readyState == 4 && xmlHttp2.status == 200){ //
			
			document.getElementById("mailru_wait").innerHTML = "Mail.ru logout done!";
			
			logouts--;
			if (logouts < 1) {waitnclose();}
			
		}
    }	
	
	xmlHttp2.send(null);
	
}

document.getElementById("maindiv").addEventListener("mouseover", function(){ fcsdon = true; } );
document.getElementById("maindiv").addEventListener("mouseout", function(){ fcsdon = false; } );

document.addEventListener('DOMContentLoaded', popuphndlr());


