var logouts = 99;
var fcsdon = false;

var ocllgoutSttngsArr = {
	'Google': {'lnk': 'https://accounts.google.com/Logout', 'enabled': '0', 'cks': '0',},
	'Mailru': {'lnk': 'https://auth.mail.ru/cgi-bin/logout?next=1&lang=ru_RU&Page=https%3A%2F%2Fmail.ru%2F%3Ffrom%3Dlogout','enabled': '0', 'cks': '0',},
	'Yandex': {'lnk': 'https://yandex.ru', 'enabled': '0', 'cks': '1',},
	'Facebook': {'lnk': 'https://www.facebook.com/logout.php?button_location=settings&button_name=logout', 'enabled': '0', 'cks': '1',},
	'Linkedin': {'lnk': 'https://www.linkedin.com/m/logout', 'enabled': '0', 'cks': '1',},
};

//'Linkedin': {'lnk': 'https://www.linkedin.com/m/logout', 'enabled': '0'},
//https://www.facebook.com/logout.php?button_location=settings&button_name=logout

var currsttngs = {};


/* SERVICE FUNCTION SECTION */
Object.size = function(obj) {
    
	var size = 0, key;
    
	for (key in obj) {
        
		if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


function sleep(ms) {
  
  return new Promise(resolve => setTimeout(resolve, ms));
}


/* HTML POPUP WINDOW GEN AND HANDLE SECTION*/
function genHtmlEl(name){
	
	var listbox = document.getElementById("srvcsbox");
	
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
	
	if (ret){
		
		listbox.insertBefore(tmp, listbox.firstChild);
	}
	
	else { listbox.appendChild(tmp); }
	
	document.getElementById(name + "_chkbx").addEventListener("click", function(event){
		
		docheckbox(event, event.target.value);
	});
	
	return ret;
}


function waitnclose(){
	
	sleep(900).then(() => { if (!fcsdon){ window.close();} });
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


/* DOSTUFF SECTION */
function dostuff(){
	
	document.getElementById("infobox").innerText = "Select services for fast logout";
	
	for (var srvc in currsttngs.oneclicklogout_settings) {
		
		if (genHtmlEl(srvc)){
			
			let tmp = srvc.toString();
			
			document.getElementById("infobox").innerText = "";
			
			if ( currsttngs.oneclicklogout_settings[srvc]['cks'] == '1' ){
				
				theyresofcknspecial(srvc);
				logouts--;
			}
			else {
				
				httpLogoutSrvc(srvc);
			}
		}
	}
}


function httpLogoutSrvc(name){
	
	var xmlHttp = new XMLHttpRequest();
	
	xmlHttp.open("GET", currsttngs.oneclicklogout_settings[name]['lnk'], true); // true for asynchronous 
    
	xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
			
			document.getElementById(name+"_wait").innerHTML = name+" logout done!";
			
			logouts--;
			if (logouts < 1) {waitnclose();}
			
		}
    }
	
	/* TODO: catch and alert */
	xmlHttp.timeout = 4000;
	
	xmlHttp.send(null);
}


function theyresofcknspecial(srvcname){
	
	var gettingAll = browser.cookies.getAll({});
	
	gettingAll.then( value => { listCookies(value,srvcname) });
}



/* COOKIES HANDLE SUBSECTION */
/* TODO: search by domain, not list all every time*/
function listCookies(cookies, srvcnm) {
  
	for (let cookie of cookies) {
		
		//console.log(cookie);
		if ( (cookie.domain).includes(srvcnm.toLowerCase()) ){
			
			removeCookie(cookie.name, currsttngs.oneclicklogout_settings[srvcnm]['lnk']);
		}
	}
	
	document.getElementById(srvcnm+"_wait").innerHTML = srvcnm+" logout done!";
}


//debug, delete later
function onRemoved(cookie) {
	
	console.log(`Removed: ${cookie}`);
}


function onError(error) {
	
	console.log(`Error removing cookie: ${error}`);
}


function removeCookie(cn, cu) {
  
	var removing = browser.cookies.remove({
		name: cn,
		url: cu
	});
	removing.then(onRemoved, onError);
}


/* MAIN FUNCTION */
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
		
		//console.log(currsttngs.oneclicklogout_settings);
		
		dostuff();
	});
	
}


document.getElementById("maindiv").addEventListener("mouseover", function(){ fcsdon = true; } );
document.getElementById("maindiv").addEventListener("mouseout", function(){ fcsdon = false; } );

document.addEventListener('DOMContentLoaded', popuphndlr());


