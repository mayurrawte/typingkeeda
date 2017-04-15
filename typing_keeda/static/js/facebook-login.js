$(document).ready(function()
{



	  var facebook_id ;
	  var fb_user_name;
	  var fb_user_email;
	  var fb_user_profile;

	$('#fb-login-button').on('click',function()
	{
	
	    function statusChangeCallback(response) {
    	console.log('statusChangeCallback');
    	console.log(response);
    
    if (response.status === 'connected')
     {
       testAPI();
   	 }
     else if (response.status === 'not_authorized')
    {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    }
    else 
    {
     
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  // This function is called when someone finishes with the Login
    function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '481435148731788',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.5' // use graph api version 2.5
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() 
  {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      fb_user_name = response.name
      fb_user_email = response.email
      facebook_id = response.id
   	  fb_user_profile = "https://graph.facebook.com/"+response.id+"/picture?width=200&height=200";
    	fb_ajax_login();

      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });

    FB.api('/me?fields=email,name', function(response) {
    console.log(JSON.stringify(response));
	});
  }






  function getCookie(name)
	{
	      var cookieValue = null;
	          if (document.cookie && document.cookie != '') {
	                var cookies = document.cookie.split(';');
	          for (var i = 0; i < cookies.length; i++) {
	               var cookie = jQuery.trim(cookies[i]);
	          // Does this cookie string begin with the name we want?
	          if (cookie.substring(0, name.length + 1) == (name + '=')) {
	            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
	              break;
	             }
	          }
	      }
	 return cookieValue;
	}

var csrftoken = getCookie('csrftoken');



  function fb_ajax_login()
  {
  	$.ajax({
  		url:'/login/',
  		type:'POST',
  		data:{csrfmiddlewaretoken : csrftoken,
  			facebook_id:facebook_id,
  			fb_user_name:fb_user_name,
  			fb_user_email:fb_user_email,
  			fb_user_profile:fb_user_profile
  		},
  		success:function(json)
  		{
  			alert("fb-login-success");	
  		},
  	error : function(xhr,errmsg,err)
	{
		console.log(xhr.status + ": " + xhr.responseText); 
		console.log('ajazx_fb_erroro');
	}
  	});
  }

 });
	





});