window.fbAsyncInit = function() 
{
  FB.init({
    appId      : '1584130285233666',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.5' // use graph api version 2.5
  });


  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));



$('#trigger-fb-login').on('click',function()
{
  FB.login(function (response) {
      if (response.authResponse) {
          console.log('Welcome!  Fetching your information.... ');
      } else {
      console.log('User cancelled login or did not fully authorize.');
  }
  }, { scope: 'email'});
});

/*

function login()
{
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
    });
 
}
*/

function statusChangeCallback(response) 
{
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
}

function checkLoginState()
{
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}


function testAPI() 
{
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me?fields=email,name', function(response) {
    console.log('Successful login for: ' + response.name);
    fb_user_name = response.name;
    fb_user_email = response.email;
    fb_user_id = response.id;
    fb_user_profile = "https://graph.facebook.com/"+response.id+"/picture?width=200&height=200";
    fb_ajax_login();

   alert('login');
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
  //console.log(fb_user_email+" "+fb_user_name+" "+facebook_id)
  $.ajax({
    url:'/login/',
    type:'POST',
    data:{csrfmiddlewaretoken : csrftoken,
      facebook_id:fb_user_id,
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




  $(document).ready(function()
  {
    $('#fb-login-button').on('click',function()
    {
      login();
    });
  });