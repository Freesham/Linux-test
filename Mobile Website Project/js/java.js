/* Set the width of the side navigation to 160px */
function openNav(){
	document.getElementById("mySidenav").style.width = "160px";
}

/* Set the width of the side navigation to 0 */
function closeNav(){
	document.getElementById("mySidenav").style.width = "0";
}

/* Controls Register/SignOut and Login/Profile buttons */
function SignInOut(){
	
	if (getCookie("signedIn") == 0)
	{
		document.getElementById('RegisterSignOut').innerHTML += "<a href=\"Register.html\" class=\"register-link\">Register</a>";
		document.getElementById('LoginProfile').innerHTML += "<a href=\"LogIn.html\" class=\"login-link\">Log In</a>";
	}
	else
	{
		document.getElementById('RegisterSignOut').innerHTML += "<a href=\"LogIn.html\" onClick=\"logout()\" class=\"register-link\">Sign Out</a>";
		document.getElementById('LoginProfile').innerHTML += "<a href=\"ProfilePage.html\" class=\"login-link\">Profile</a>";
	}
}

/* Redirect Function if Not Logged In */
function Redirect() {
	if(getCookie("signedIn") == null)
	{
		document.cookie = "signedIn=0";
		document.cookie = "userCookie=null";
		document.cookie = "passCookie=null";
	}
	
	if(getCookie("signedIn") == 0) {
		window.location = "LogIn.html";
	}
	else
		SignInOut();
}

/* Populates browse jobs page */
function GeneralSearch() {
	var xhttp = new XMLHttpRequest();
	
	xhttp.open("GET", "https://jobapp.h-net.org/1.0/Job", false, getCookie("userCookie"), getCookie("passCookie"));
	xhttp.withCredentials = true;
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send();
	
	if (xhttp.responseText != "")
	{
		var response = JSON.parse(xhttp.responseText);
		var advid = 0;
		
		var body = JSON.parse(response.body);
		
		for (var j = 0; j<body.length; j++) {
			advid = body[j].job_id;
			if(j%2 == 0){
				document.getElementById('results').innerHTML += "<table><tr><td><div onClick=\"NewWindow('" + advid + "')\" style=\"color: black; margin-left: 7px; font-size: 0.9em\"><b>" + body[j].institution_name + "</b>, " + body[j].description + "</div></td></tr></table>";
				}
			else{
				document.getElementById('results').innerHTML += "<table><tr><td style=\"background-color:#b4c4ca\"><div onClick=\"NewWindow('" + advid + "')\" style=\"color: black; margin-left: 7px; font-size: 0.9em\"><b>" + body[j].institution_name + "</b>, " + body[j].description + "</div></td></tr></table>";
			}
		}
	}
}

/* Searches featured jobs */
function featuredSearch() {
	var url = "https://jobapp.h-net.org/1.0/Job";
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", url, false, getCookie("userCookie"), getCookie("passCookie"));
	
	xhttp.withCredentials = true;
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send();
	
	if (xhttp.responseText != "")
	{
		var response = JSON.parse(xhttp.responseText);
		var featid = 0;
		
		var body = JSON.parse(response.body);
		var currentJob = 0;
		for (var j = 0; j<body.length; j++) {
			featid = body[j].job_id;
			if (body[j].featured == true) {				
				if(currentJob%2 == 0){
					document.getElementById('featured').innerHTML += "<table><tr><td><div onClick=\"NewWindow('" + featid + "')\" style=\"color: black; margin-left: 7px; font-size: 0.9em\"><b>" + body[j].institution_name + "</b>, " + body[j].description + "</div></td></tr></table>";
				}
				else{
					document.getElementById('featured').innerHTML += "<table><tr><td style=\"background-color:#b4c4ca\"><div onClick=\"NewWindow('" + featid + "')\" style=\"color: black; margin-left: 7px; font-size: 0.9em\"><b>" + body[j].institution_name + "</b>, " + body[j].description + "</div></td></tr></table>";
				}
				currentJob++;
			}
		}
	}
	
}

/* Redirects to detailed job page */
function NewWindow(jid) {
	document.cookie = "jidCookie=" + jid;
	window.location='DetailedJob.html?jobid=' + jid;
}

/* Populates detailed job description */
function DetailedDescription() {
	var url = document.location.href;
	var decodedURL = url.split('=',2);
	var jid = decodedURL[1];
	
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", ("https://jobapp.h-net.org/1.0/Job?jobid=" + jid), false, getCookie("userCookie"), getCookie("passCookie"));
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send();
	
	if(xhttp.responseText != "")
	{
		var response = JSON.parse(xhttp.responseText);
		
		var fetchID = getCookie("jidCookie");
		
		var body = JSON.parse(response.body);
		
		document.getElementById('jobid').innerHTML = fetchID;
		document.getElementById('description').innerHTML += "<font size=\"4\"><b>" + body[0].description + "</b></font>";
		if(body[0].website != '') {document.getElementById('website').innerHTML += "<b>Website: </b><a href=\"" + body[0].website + "\">" + body[0].website + "</a>";}
		if(body[0].institution_name != '') {document.getElementById('institutionname').innerHTML += "<b>Institution: </b>" + body[0].institution_name;}
		if(body[0].institution_type != '') {document.getElementById('institutiontype').innerHTML += "<b>Institution Type: </b>" + body[0].institution_type;}
		if(body[0].department != '') {document.getElementById('department').innerHTML += "<b>Department: </b>" + body[0].department;}
		document.getElementById('text').innerHTML += body[0].text;
		if(body[0].contact != '') {document.getElementById('contact').innerHTML += "<b>Contact: </b>" + body[0].contact;}
		if(body[0].date_posting != '') {
			var date = new Date(body[0].date_posting*1000);
			document.getElementById('date_posting').innerHTML += "<b>Posting Date: </b>" + date;
		}
		if(body[0].date_closing != '') {
			var date = new Date(body[0].date_closing*1000);
			document.getElementById('date_closing').innerHTML += "<b>Deadline: </b>" + date;
		}
	}
	
	document.getElementById('share').innerHTML = "<a href=\"https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fjobapp.h-net.org%2FDetailedJob.html%3Fjobid%3D" + jid + "&amp;src=sdkpreparse\"><image src=\"images/facebook_share.png\" alt=\"Share to Facebook\" style=\"width: 100px; height: 30px font-size: 0.8em\"></a>"
}

/* Checks password on registration page */
function checkPassword() {
	var pwd = document.getElementById("pwd").value;
	var conPwd = document.getElementById("conPwd").value;
	var email = document.getElementById("email").value;
	
	if(pwd === conPwd && pwd.length > 7) {createAccount(email, pwd); document.getElementById('error').innerHTML = "";}
	else if(email.length == 0) {document.getElementById('error').innerHTML = "<font color=\"red\">Please enter a valid email address.</font>";}
	else if (pwd !== conPwd) {document.getElementById('error').innerHTML = "<font color=\"red\">Passwords do not match.</font>";}
	else if (pwd.length < 8) {document.getElementById('error').innerHTML = "<font color=\"red\">Password must be at least 8 characters long.</font>";}
}

/* Pushes new account information */
function createAccount(email, pwd) {
	var url = "https://jobapp.h-net.org/1.0/Registration";

	var data = {};
	data.email = email;
	data.password  = pwd;
	var json = JSON.stringify(data);
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type","application/json");
	xhr.onreadystatechange = function () {
		if ((xhr.readyState === 4) && (xhr.status === "201")) {
			console.table(xhr.responseText);
		} else {
			console.error(xhr.responseText);
		}
	}
	xhr.send(json);
	
	window.location = "TransitionPage.html";
}

/* Profile Page Info */
function profilePost() {
	var date = new Date();
	var url = "https://jobapp.h-net.org/1.0/User?date=" + date.getTime();
    var username = getCookie("userCookie");
    var password = getCookie("passCookie");
	
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", url, false, username, password);
	xhttp.send();
	
	if (xhttp.responseText != "")
	{
		var response = JSON.parse(xhttp.responseText);
		var body = JSON.parse(response.body);
		
		document.getElementById('userEmail').innerHTML = body.email;
		
		var xhrLoc = new XMLHttpRequest();
		xhrLoc.open("GET", "https://jobapp.h-net.org/1.0/Country", false, username, password);
		xhrLoc.send();
		
		var responseLoc = JSON.parse(xhrLoc.responseText);
		var bodyLoc = JSON.parse(responseLoc.body);
		
		if(body.locationfilter[0] == 0)
		{
			document.getElementById('userLocation').innerHTML = "Any";
		}
		
		for(var b=0; b<bodyLoc.length; b++)
		{
			if(bodyLoc[b].country_id == body.locationfilter[0])
			{
				document.getElementById('userLocation').innerHTML += bodyLoc[b].country_name;
			}
		}
		
		for(var i=0; i<body.institutionfilter.length; i++)
		{
			document.getElementById('userInstitution').innerHTML += body.institutionfilter[i] + "<br>";
		}
		
		var xhrCat = new XMLHttpRequest();
		xhrCat.open("GET", "https://jobapp.h-net.org/1.0/Category", false, username, password);
		xhrCat.send();
		
		var responseCat = JSON.parse(xhrCat.responseText);
		var bodyCat = JSON.parse(responseCat.body);
		if(body.categoryfilter.length > 5)
		{
			for(var j=0; j<bodyCat.length; j++)
			{
				for(var k=0; k<5; k++)
				{
					if(bodyCat[j].category_id == body.categoryfilter[k])
					{
						document.getElementById('userFields').innerHTML += bodyCat[j].category_name + "<br>";
					}
				}
			}
			document.getElementById('userFields').innerHTML += "&nbsp;&nbsp;. . ." + "<br>";
		}
		else 
		{
			for(var j=0; j<bodyCat.length; j++)
			{
				for(var k=0; k<body.categoryfilter.length; k++)
				{
					if(bodyCat[j].category_id == body.categoryfilter[k])
					{
						document.getElementById('userFields').innerHTML += bodyCat[j].category_name + "<br>";
					}
				}
			}
		}
	}
}

/* Save Job */
function saveJob() {
    
    var date = new Date();
    var url = "https://jobapp.h-net.org/1.0/User?date=" + date.getTime();
    var username = getCookie("userCookie");
    var password = getCookie("passCookie");
    
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false, username, password);
    
    xhttp.withCredentials = true;
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.send();
    
    var response = JSON.parse(xhttp.responseText);
    var body = JSON.parse(response.body);
	
    var jobid = parseInt(document.getElementById('jobid').innerHTML);
    if (body.savedjobs.length == 0){
        var saveData = "{\"savedjobs\":[" + jobid + "]}";
    }
    else {
        if (body.savedjobs.indexOf(jobid) == -1) {
            var saveData = "{\"savedjobs\":[" + body.savedjobs + ", " + jobid + "]}";
        }
    }
    
    var xhr = new XMLHttpRequest();
    xhr.open("PATCH", url, true, username, password);
    xhr.send(saveData);
}

/* Enables/Disables State selection based on country */
function homeChange() {
	if((document.getElementById('homeCountry').value == 209) || (document.getElementById('homeCountry').value == 37)) {
		document.getElementById('homeState').disabled = false;
	}
	else {
		document.getElementById('homeState').disabled = true;
	}
}

/* Fetch values for advanced search */
function cookies() {
	document.cookie = "keywordCookie=" + document.getElementById("myInput").value;
	document.cookie = "institutionCookie=" + document.getElementById("institutiontype").value;
	document.cookie = "countryCookie=" + document.getElementById("country").value;
	document.cookie = "stateCookie=" + document.getElementById("stateprovince").value;
	window.location = 'AdvancedSearchResults.html';
}

/* Fetch values for home page search */
function homeCookies() {
	document.cookie = "keywordCookie=" + document.getElementById("homeInput").value;
	document.cookie = "countryCookie=" + document.getElementById("homeCountry").value;
	document.cookie = "stateCookie=" + document.getElementById("homeState").value;
	window.location = 'HomeSearchResults.html';
}

/* Parse cookies for advances search */
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/* Home Page Search */
function homeSearch() {
	var keywordVal = getCookie("keywordCookie");
	var countryVal = getCookie("countryCookie");
	var stateVal = getCookie("stateCookie");
	
	var xhttp = new XMLHttpRequest();
	
	xhttp.open("GET", "https://jobapp.h-net.org/1.0/Job", false, getCookie("userCookie"), getCookie("passCookie"));
	
	xhttp.onreadystatechange = function() {
		if(xhttp.readyState === 4) {
			console.log(xhttp.responseText);
		}
	}
	
	xhttp.withCredentials = true;
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send();
	
	if (xhttp.responseText != "")
	{
		var response = JSON.parse(xhttp.responseText);
		var advid = 0;
		var inc = 0;
		console.log(response);
		
		var body = JSON.parse(response.body);
		
		for (var j = 0; j<body.length; j++) {
			advid = body[j].job_id;
			var textB = body[j].text;
			if((textB.search(keywordVal) != -1) || (keywordVal == '')) {
				if((body[j].country_id == countryVal) || (countryVal == 0)) {
					if((body[j].state_id == stateVal) || (stateVal == 0)) {
						if(inc%2 == 0){
							document.getElementById('home-results').innerHTML += "<table><tr><td><div onClick=\"NewWindow('" + advid + "')\" style=\"color: black; margin-left: 7px; font-size: 0.9em\"><b>" + body[j].institution_name + "</b>, " + body[j].description + "</div></td></tr></table>";
							}
						else{
							document.getElementById('home-results').innerHTML += "<table><tr><td style=\"background-color:#b4c4ca\"><div onClick=\"NewWindow('" + advid + "')\" style=\"color: black; margin-left: 7px; font-size: 0.9em\"><b>" + body[j].institution_name + "</b>, " + body[j].description + "</div></td></tr></table>";
						}
						inc++;
					}
				}
			}
		}
	}
}

/* Reset Advanced Search Inputs */
function advReset() {
	document.getElementById('myInput').value = "";
	document.getElementById('category').value = 0;
	document.getElementById('institutiontype').value = 0;
	document.getElementById('country').value = 0;
	document.getElementById('stateprovince').value = 0;
}

/* Advanced Search Button */
function advancedSearch() {
	var keywordVal = getCookie("keywordCookie");
	var categVal = getCookie("categoryCookie");
	var institTypVal = getCookie("institutionCookie");
	var countryVal = getCookie("countryCookie");
	var stateVal = getCookie("stateCookie");
	
	var xhttp = new XMLHttpRequest();
	
	xhttp.open("GET", "https://jobapp.h-net.org/1.0/Job", false, getCookie("userCookie"), getCookie("passCookie"));
	
	xhttp.onreadystatechange = function() {
		if(xhttp.readyState === 4) {
			console.log(xhttp.responseText);
		}
	}
	
	xhttp.withCredentials = true;
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send();
	
	if (xhttp.responseText != "")
	{
		var response = JSON.parse(xhttp.responseText);
		var advid = 0;
		var inc = 0;
		console.log(response);
		
		var body = JSON.parse(response.body);
		
		for (var j = 0; j<body.length; j++) {
			advid = body[j].job_id;
			var textB = body[j].text;
			if((textB.search(keywordVal) != -1) || (keywordVal == '')) {
				if((body[j].institution_type === institTypVal) || (institTypVal == 0)) {
					if((body[j].country_id == countryVal) || (countryVal == 0)) {
						if((body[j].state_id == stateVal) || (stateVal == 0)) {
							if(inc%2 == 0){
								document.getElementById('adv-results').innerHTML += "<table><tr><td><div onClick=\"NewWindow('" + advid + "')\" style=\"color: black; margin-left: 7px; font-size: 0.9em\"><b>" + body[j].institution_name + "</b>, " + body[j].description + "</div></td></tr></table>";
								}
							else{
								document.getElementById('adv-results').innerHTML += "<table><tr><td style=\"background-color:#b4c4ca\"><div onClick=\"NewWindow('" + advid + "')\" style=\"color: black; margin-left: 7px; font-size: 0.9em\"><b>" + body[j].institution_name + "</b>, " + body[j].description + "</div></td></tr></table>";
							}
							inc++;
						}
					}
				}
			}
		}
	}
}

/* Reset Password */
function resetPassword() {
	var email = document.getElementById("myInput").value;
	var url = "https://jobapp.h-net.org/1.0/Reset?email=" + email;
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, false);
	xhr.setRequestHeader("Content-type","application/json");
	xhr.onreadystatechange = function () {
		if ((xhr.readyState === 4) && (xhr.status === "201")) {
			console.table(xhr.responseText);
		} else {
			console.error(xhr.responseText);
		}
	}
	xhr.send();
	
	if (xhr.responseText != "")
	{
		var response = JSON.parse(xhr.responseText);
		if (response.message === "Appropriate resets generated"){
			document.getElementById('error').innerHTML = "<font color=\"black\">If the email submitted is associated with an account, an email with your new password has been sent.</font>";
		}
	}
}

/* Log In and Set Cookies */
function login() {
	//window.location.reload(true);
	//deleteAllCookies(); 
	
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;
	var date = new Date();
	var url = "https://jobapp.h-net.org/1.0/User?date=" + date.getTime();
	
	var xhttp = new XMLHttpRequest();
	
	xhttp.open("GET", url, false, username, password);
	
	xhttp.onreadystatechange = function() {
		if(xhttp.readyState === 4) {
			console.log(xhttp.responseText);
		}
	}
	
	xhttp.withCredentials = true;
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send();
	
	if (xhttp.responseText != "")
	{
		var response = JSON.parse(xhttp.responseText);
		console.log(response);
		
		var body = JSON.parse(response.body);
		if (body.email === username) {
			document.cookie = "signedIn=1";
			document.cookie = "userCookie=" + document.getElementById("username").value;
			document.cookie = "passCookie=" + document.getElementById("password").value;
			window.location = "HNet.html";
		}
		else {
			document.cookie = "signedIn=0";
			document.getElementById('error').innerHTML = "<font color=\"red\">Invalid login information.</font>";
		} 
	}
}

/* Log Out and Clear Cookies */
function logout() {
	deleteAllCookies();
	window.location = "LogIn.html";
}

/* Clear Cookies Function */
function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

/* Edit Location Button */
function editLocation() {
	var date = new Date();
	var username = getCookie("userCookie");
	var password = getCookie("passCookie");
	var url = "https://jobapp.h-net.org/1.0/User?date=" + date.getTime();
	
	var country = document.getElementById('editCountry').value;
	var output = "{\"locationfilter\":[" + country + "]}";
	var xhr = new XMLHttpRequest();
	xhr.open("PATCH", url, false, username, password);
	xhr.send(output);
	
	window.location = "ProfilePage.html";
}

/* Edit Institution Button */
function editInstitution() {
	var date = new Date();
	var username = getCookie("userCookie");
	var password = getCookie("passCookie");
	var url = "https://jobapp.h-net.org/1.0/User?date=" + date.getTime();
	
	var str = "{\"institutionfilter\": [";
	var chk1 = document.getElementById('CollegeUniversity').checked;
	var chk2 = document.getElementById('Government').checked;
	var chk3 = document.getElementById('Nonprofit').checked;
	var chk4 = document.getElementById('TwoYearCollege').checked;
	var chk5 = document.getElementById('Preparatory').checked;
	var chk6 = document.getElementById('Other').checked;
	
	if(chk1 == true) {str += "\"College / University\", ";}
	if(chk2 == true) {str += "\"Government\", ";}
	if(chk3 == true) {str += "\"Nonprofit\", ";}
	if(chk4 == true) {str += "\"Two-Year College\", ";}
	if(chk5 == true) {str += "\"Preparatory School\", ";}
	if(chk6 == true) {str += "\"Other\", ";}
	
	if(str.length > 16) {str = str.substring(0, str.length-2);}
	str += "]}";
	console.log(str);
	var xhr = new XMLHttpRequest();
	xhr.open("PATCH", url, false, username, password);
	xhr.send(str);
	
	window.location = "ProfilePage.html";
}

/* Marks Institution Type is Already in User */
function editInstitutionOnload() {
	var date = new Date();
	var username = getCookie("userCookie");
	var password = getCookie("passCookie");
	var url = "https://jobapp.h-net.org/1.0/User?date=" + date.getTime();
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, false, username, password);
	xhr.send();

	var response = JSON.parse(xhr.responseText);
    var body = JSON.parse(response.body);
	var str = body.institutionfilter;
	
	for(var i=0; i<str.length; i++)
	{
		if(str[i].indexOf("College / University") != -1)
		{
			document.getElementById('CollegeUniversity').checked = true;
		}
		if(str[i].indexOf("Government") != -1)
		{
			document.getElementById('Government').checked = true;
		}
		if(str[i].indexOf("Nonprofit") != -1)
		{
			document.getElementById('Nonprofit').checked = true;
		}
		if(str[i].indexOf("Two-Year College") != -1)
		{
			document.getElementById('TwoYearCollege').checked = true;
		}
		if(str[i].indexOf("Preparatory School") != -1)
		{
			document.getElementById('Preparatory').checked = true;
		}
		if(str[i].indexOf("Other") != -1)
		{
			document.getElementById('Other').checked = true;
		}
	}
}

/* editEmailPassword Onload */
function editEmailPasswordOnload() {
	var date = new Date();
	var username = getCookie("userCookie");
	var password = getCookie("passCookie");
	var url = "https://jobapp.h-net.org/1.0/User?date=" + date.getTime();
	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, false, username, password);
	xhr.send();

	var response = JSON.parse(xhr.responseText);
    var body = JSON.parse(response.body);
	
	document.getElementById('editEmail').value = body.email;
	
	if(body.notification == true)
	{
		document.getElementById('notificationBool').checked = true;
	}
}

/* To Edit Email/Password/Notification */
function editEmailPassword() {
	var date = new Date();
	var username = getCookie("userCookie");
	var password = getCookie("passCookie");
	var url = "https://jobapp.h-net.org/1.0/User?date=" + date.getTime();
	
	var editOldPass = document.getElementById('editOldPass').value;
	var editNewPass = document.getElementById('editNewPass').value;
	var editConfirmPass = document.getElementById('editConfirmPass').value;
	var notificationBool = document.getElementById('notificationBool').checked;
	
	if((editNewPass == editConfirmPass) && (editNewPass != ""))
	{
		var output = "{\"password\": \"" + editNewPass + "\"}";
		console.log(output);
		
		var xhr = new XMLHttpRequest();
		xhr.open("PATCH", url, false, username, password);
		xhr.send(output);
	}
	
	var output2 = "{\"notification\":" + notificationBool + "}";
	var xhr2 = new XMLHttpRequest();
	xhr2.open("PATCH", url, false, username, password);
	xhr2.send(output2);
	
	window.location = "ProfilePage.html";
}

/* Populates Boxes with Fields */
function populateFields() {
	
	var date = new Date();
	var username = getCookie("userCookie");
	var password = getCookie("passCookie");
	var url = "https://jobapp.h-net.org/1.0/Category?date=" + date.getTime();
	
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", url, false, username, password);
	
	xhttp.withCredentials = true;
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send();
	
	var response = JSON.parse(xhttp.responseText);
	var body = JSON.parse(response.body);
	//Array of all categories
	var array = new Array();
	for(var j=0; j<body.length; j++)
	{
		array.push(body[j].category_id);
	}
	
	var url2 = "https://jobapp.h-net.org/1.0/User?date=" + date.getTime();
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url2, false, username, password);
	xhr.send();
	
	var response2 = JSON.parse(xhr.responseText);
	var body2 = JSON.parse(response2.body);
	//Array of user's categories
	var array2 = new Array();
	for(var k=0; k<body2.savedjobs.length; k++)
	{
		array2.push(body2.savedjobs[k]);
	}
	
	for(var a=0; a<array2.length; a++)
	{
		if(array.indexOf(array2[a] != -1))
		{
			array.splice(array.indexOf(array2[a], 1));
		}
	}
	
	//Populate page with fields
	for(var i=0; i<body.length; i++)
	{
		document.getElementById('allFields').innerHTML += "<option value=" + body[i].category_id + ">" + body[i].category_name + "</option>";
	}
}

/* Edit Fields Function */
function fieldsBox() {
	document.getElementById('buttonAdd').addEventListener("click", addMyField);
}

function addMyField() {
	var Field = document.getElementById('allFields');
	var valueField = Field.options[Field.selectedIndex].value;
	var textField = Field.options[Field.selectedIndex].text;
	document.getElementById('myFields').innerHTML += "<div id=\"" + valueField + "\">" + textField + "</div>";
	Field.remove(Field.selectedIndex);
}

/* Patch Categoryfilter to User */
function fieldsConfirm () {
	var c = document.getElementById('myFields').childNodes.length;
	var myFields = document.getElementById('myFields');
	var output = "";
	for(var i=1; i<c; i++) {
		output += document.getElementById('myFields').childNodes[i].id + ", ";
	}
	output = output.slice(0, output.length-2);
	
	var date = new Date();
	var username = getCookie("userCookie");
	var password = getCookie("passCookie");
	var url = "https://jobapp.h-net.org/1.0/User?date=" + date.getTime();
	var output2 = "{\"categoryfilter\":[" + output + "]}";
	
	var xhr = new XMLHttpRequest();
	xhr.open("PATCH", url, false, username, password);
	xhr.send(output2);
	
	window.location = "ProfilePage.html";
}

/* Swap Boxes Function */
function swapFactory(fromSelect, toSelect) {
  return function() {
	if (fromSelect.selectedIndex >= 0) {
	  const optionToMove = fromSelect.options[fromSelect.selectedIndex];
	  toSelect.appendChild(optionToMove.cloneNode(true));
	  fromSelect.removeChild(optionToMove);
	}
  }
}

/* Displaying Saved Jobs */
function displaySavedJobs() {
	var username = getCookie("userCookie");
	var password = getCookie("passCookie");
	var date = new Date();
	var url = "https://jobapp.h-net.org/1.0/User?date=" + date.getTime();
	
	var xhttp = new XMLHttpRequest();
	
	xhttp.open("GET", url, false, username, password);
	
	xhttp.withCredentials = true;
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send();
	
	if (xhttp.responseText != "")
	{
		var response = JSON.parse(xhttp.responseText);
		var body = JSON.parse(response.body);
		var savedJobs = body.savedjobs;
		if (savedJobs.length == 0) {
			document.getElementById('saved').innerHTML = "<table><tr><td><font color=\"black\">No jobs saved!</font></td></tr></table>";
		}
		else {
			for (var i = 0; i < savedJobs.length; i++) {
				var xhr = new XMLHttpRequest();
				var joburl = "https://jobapp.h-net.org/1.0/Job?jobid=";
				xhr.open("GET", joburl + savedJobs[i], false, username, password);
				xhr.withCredentials = true;
				xhr.setRequestHeader("Accept", "application/json");
				xhr.send();
				var response = JSON.parse(xhr.responseText);
				var body = JSON.parse(response.body);
				if (i % 2 == 0) {
					document.getElementById('saved').innerHTML += "<table><tr><td><div onClick=\"NewWindow('" + body[0].job_id + "')\"" +
					" style=\"color: black; margin-left: 7px; font-size: 0.9em\"><b>" + body[0].institution_name + "</b>, " + body[0].description +
					"</div></td><td><input type=\"button\" onClick=\"removeSavedJob(" + body[0].job_id + ")\" value=\"Remove\" class=\"edit-button\"></td></tr></table>";
				}
				else {
					document.getElementById('saved').innerHTML += "<table><tr><td style=\"background-color:#b4c4ca\">" +
					"<div onClick=\"NewWindow('" + body[0].job_id + "')\" style=\"color: black; margin-left: 7px; font-size: 0.9em\">" +
					"<b>" + body[0].institution_name + "</b>, " + body[0].description + "</div></td>" +
					"<td style=\"background-color:#b4c4ca\"><input type=\"button\" onClick=\"removeSavedJob(" + body[0].job_id + ")\" value=\"Remove\" class=\"edit-button\"></td></tr></table>";
				}
			
			}
		}
	}
}

/* Removing Saved Job */
function removeSavedJob(jobid) {
	var username = getCookie("userCookie");
	var password = getCookie("passCookie");
	var date = new Date();
	var url = "https://jobapp.h-net.org/1.0/User?date=" + date.getTime();
	
	var xhttp = new XMLHttpRequest();
	
	xhttp.open("GET", url, false, username, password);
	
	xhttp.withCredentials = true;
	xhttp.setRequestHeader("Accept", "application/json");
	xhttp.send();
	
	var newSavedJobs;
	if (xhttp.responseText != "") {
		var response = JSON.parse(xhttp.responseText);
		var body = JSON.parse(response.body);
		var savedJobs = body.savedjobs;
		if (savedJobs.indexOf(jobid) > -1) {
			var saveData = "{\"savedjobs\":[";
			for (var i = 0; i < savedJobs.length; i++) {
				if (!savedJobs.indexOf(jobid) == 0)	{				
					if (savedJobs[i] != jobid)
						if (i == 0)
							saveData = saveData + savedJobs[i];
						else
							saveData = saveData + "," + savedJobs[i];
				}
				else {
					if (savedJobs[i] != jobid)
						if (i == 1)
							saveData = saveData + savedJobs[i];
						else
							saveData = saveData + "," + savedJobs[i];
				}
			}
		}
	}
	var saveData = saveData + "]}";
	var xhr = new XMLHttpRequest();
	xhr.open("PATCH", "https://jobapp.h-net.org/1.0/User", false, username, password);
	xhr.send(saveData);
	window.location = "SavedJobs.html";
}