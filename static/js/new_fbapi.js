/* vars =*/

var fb_user_email;
var fb_user_name;
var fb_user_id;
var fb_user_profile;
var fb_user_friends;
var friends_list = 0;


function statusChangeCallback(response) 
{
  console.log('statusChangeCallback');
  console.log(response);
  if (response.status === 'connected')
  {
    // Logged into your app and Facebook.
    testAPI();

  } else if (response.status === 'not_authorized') 
  {
    // The person is logged into Facebook, but not your app.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into this app.';
  } 
  else 
  {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into Facebook.';
  }
}




  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
function checkLoginState() 
{
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

window.fbAsyncInit = function() 
{
  FB.init({
    appId      : '885871594891806',
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.6' // use graph api version 2.5
  });


  

    /*FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
    */
};

function custom_login()
{
  FB.login(function (response) {
    if (response.authResponse) {
        console.log('Welcome!  Fetching your information.... ');
        statusChangeCallback(response);
        
    } else {
    console.log('User cancelled login or did not fully authorize.');
  }
  }, { scope: 'email,user_friends,publish_actions'});
}


// Load the SDK asynchronously
(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
 
/*
function share_post()
{


  var uname = localStorage.getItem('username').replace(' ','%20');
  FB.ui({
    method: 'share',
    href: 'http://typingkeeda.in/static/tmp_photo/'+uname+'_.jpg',
    hashtag: 'typingkeeda',
    quote: 'Worried about your typing Speed ?',
    redirect_url:'http://typingkeeda.in', 

  }, function(response){
    alert(response.error_message)
  });   
}
*/

function share_post()
{

    alert('share_post');
  var uname = localStorage.getItem('username').replace(' ','%20');
  FB.ui({
  method: 'feed',
  link:'http://typingkeeda.in',
  picture: 'http://typingkeeda.in/static/tmp_photo/'+uname+'_.jpg',
  caption: 'Worried about typing speed ? ',
  }, function(response){
  });
}

function testAPI() 
{
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me','GET',{"fields":"friends,email,name"},function(response) {
  console.log('Successful login for: ' + response.name);
   
  fb_user_name = response.name;
  fb_user_email = response.email;
  fb_user_id = response.id;
  fb_user_profile = "https://graph.facebook.com/"+response.id+"/picture?width=200&height=200";
  fb_user_friends = response.friends;
  friends_list_lenght = fb_user_friends.data.length;
  if (friends_list_lenght)
  {
     for(var x = 0;x <fb_user_friends.data.length;x++)
    {
      if(x==0)
      {
        friends_list = fb_user_friends.data[x].id;  
      }
      else
      {
        friends_list = friends_list+","+fb_user_friends.data[x].id;
      }
      
    }
      
  }
  else
  {
    friends_list = "Null";
  }
    fb_ajax_login();
   localStorage.setItem('username',response.name);


});

}


$('#trigger-fb-login').on('click',function()
{
  $('.js-dialog').toggleClass('js-dialog-active');
  //everything_in_once();
  custom_login();

});


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
    url:'/fb_login/',
    type:'POST',
    data:{csrfmiddlewaretoken : csrftoken,
      facebook_id:fb_user_id,
      fb_user_name:fb_user_name,
      fb_user_email:fb_user_email,
      fb_user_profile:fb_user_profile,
      friends_list:friends_list,
    },
    success:function(json)
    {
       
        //window.location.href ='http://typingkeeda.in/user';
        document.open();
        document.write(json);
        document.close();
        
    },
    error : function(xhr,errmsg,err)
    {
      console.log(xhr.status + ": " + xhr.responseText); 
      console.log('ajazx_fb_erroro');
    }
  });
  
}



