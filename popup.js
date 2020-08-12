

function popuphndlr(){
	
	//translation
	//localize_menu();
	
	logoutFunc();
}

function sleep(ms) {
  
  return new Promise(resolve => setTimeout(resolve, ms));
}


function logoutFunc(){
		
	var xmlHttp = new XMLHttpRequest();
     
	xmlHttp.open("GET", "https://accounts.google.com/Logout", true); // true for asynchronous 
    
	xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
			
			document.getElementById("wait").innerHTML = "Google logout done!";
			
			sleep(700).then(() => { window.close(); });
			
		}
    }	
	
	xmlHttp.send(null);
	
	/*
	xmlHttp.open("POST", "https://www.facebook.com/logout.php?button_location=settings&button_name=logout", false); // true for asynchronous 
    
	xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
			
			console.log("reqdone");
			console.log(xmlHttp.responseText);
		}
    }	
	
	xmlHttp.send(null);
	
	xmlHttp.open("GET", "https://passport.yandex.ru/passport?mode=embeddedauth&action=logout&yu=0&uid=0&retpath=https%3A%2F%2Fya.ru", false); // true for asynchronous 
    
	xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
			
			console.log("reqdone");
			console.log(xmlHttp.responseText);
		}
    }
	
	xmlHttp.send(null);
	*/
}

document.addEventListener('DOMContentLoaded', popuphndlr());


