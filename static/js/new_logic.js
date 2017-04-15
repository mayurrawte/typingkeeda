
	var hidden_sentence_list = $('#hidden_sentence').text().split(" ");
	var typed_sentence_list = new Array();
	var count=0;
	var temp;
	var keystokes=0;
	var count=0;
	var wrong_words =0;
	var grosswpm;
	var time_spent= 1;
	var initial = true;
	var netwpm = 0;
	var lastwordbool=false;
	var final_result_netwpm = 0;
	var accuracy=0;
	var timer; 
	var curret_word_buffer=0;
	var wrong_keystrokes=0;
	var correct_keystokes=0;
	var correct_words=0;
	var typing_area = "#"+getCookie('csrftoken')+"1t3Z";
	var current_flag;
	var g_graph_vals;
	var tar_cnt = 1;
	var voice_enabled = 1;




	$('#sound_').on('click',function()
	{
		voice_enabled = 0;
		$('#sound_').html('<img src="/static/images/sound_dis.png">');
	});



	showStart();
	var toing = document.getElementById('toingId');
	function initialWordSetup()
	{
		var target = "#"+getCookie('csrftoken');
		for(var i = 0; i<hidden_sentence_list.length;i++)
		{

			$(target).append('<span id=word_'+i+'>'+hidden_sentence_list[i]+"</span> ");
			
		}

		next_word();

	}
	function next_word()
	{
		var target = "#word_"+ count;
		var targettext = String($('#word_'+ (count)).text());
		if(voice_enabled)
		{
			speech(targettext);			
		}	
		$(target).css('color','#ffffff');
		$(target).animate({fontSize:'23px'},'fast');
		$(target).css('background','rgb(189, 189, 189)');
	}

	$(typing_area).on('keyup',function(event)
	{
		start_test(event);
	});
	function start_test(event)
	{
		if(initial)
		{
			time_r();
			initial = false;
		}
		var uniCharCode = event.which || event.keyCode;
		if(uniCharCode!= 8)
		{
		
			keystokes+=1;
			curret_word_buffer+=1;
			asyncCheck();
		}

		if(uniCharCode==32 || uniCharCode == 13)
		{
			add_to();			
			clear_previous();
			error_check();
			next_word();
			tar_cnt = 1;
		}

	}
	function asyncCheck()
	{
		var target = String($('#word_'+ (count)).text());
		
		
		var nx1 = getCookie('csrftoken')+"1t3Z";
		var nx = String(document.getElementById(nx1).value);
		var targetInputString = nx.length;
		if (target[targetInputString-1] == nx[targetInputString-1] || typeof(target[targetInputString-1]) == 'undefined')
		{
			$('#word_'+count).css('color','#FFF');
		}
		else
		{

			$('#word_'+count).css('color','rgb(255, 99, 99)');
			toing.play();
			if(tar_cnt)
			{
				var tar = "<span>"+target+" - </span>";
				$('#p_words').append(tar);
				tar_cnt = 0;				
			}

		}

	}

	function add_to()
	{
		temp = $(typing_area).val();
		temp = temp.trim();
		typed_sentence_list.push(temp);
	}

	function clear_previous()
	{
		$(typing_area).val('');
	}

	function error_check()
	{
		if(hidden_sentence_list[count] == typed_sentence_list[count])
		{
			var target = "#word_"+count;
			$(target).css('color','#73c55a');

			correct_keystokes+=curret_word_buffer;

			$(target).css('background','none');
		}
		else
		{
			var target = "#word_"+count;
				$(target).css('color','rgb(252, 88, 88)');
				wrong_words+=1;

				wrong_keystrokes+=curret_word_buffer;

				$(target).css('background','none');


		}
		curret_word_buffer=0;
		count+=1;

		if(hidden_sentence_list.length == typed_sentence_list.length)
		{
			result();
		}
	}


	function time_r()
	{
		timer=setInterval(function()
			{
				grosswpm = ((correct_keystokes+wrong_keystrokes)/5)/(time_spent/60);
				netwpm = grosswpm - ((wrong_keystrokes/5)/(time_spent/60));
				accuracy = (netwpm/grosswpm)*100;
				document.getElementById('accuracy').innerHTML =  accuracy;

				document.getElementById('kpm').innerHTML = Math.floor(netwpm);

				
				time_spent+=1;	
				time_left = 60-time_spent;
				document.getElementById('time_left').innerHTML = time_left;
				if(time_spent>=60)
				{
					result();
					clearInterval(timer);
					$(typing_area).prop('disabled', true);

				}
				gaugeRefresh();
			

			},1000);
	}



	function result()
	{

		clearInterval(timer);
		current_flag =document.getElementById('current-flag').getAttribute("value");
		current_flag = parseInt(current_flag);
		final_result_netwpm = netwpm;
		
		if(current_flag)
		{	
			ajax_method();
			generate_certificate();
				
		}
		else
		{
			promoteLogin();
		}
		showResult();		
	}



	




	function ajax_method()
	{

		
		$.ajax({
			url: '/ajax_request/',
			type: "POST",
			data:{ csrfmiddlewaretoken : csrftoken, 
			user_wpm :final_result_netwpm,
			user_accuracy : accuracy
		},

		success: function(json)
		{

			get_graph_values();
		}
		,
		error : function(xhr,errmsg,err)
		{
			console.log(xhr.status + ": " + xhr.responseText); 
		}

		});	
	}







	var wpm = new Array();
	var is_login = false;




	function getCookie(name) {
	      var cookieValue = null;
	          if (document.cookie && document.cookie != '') {
	                var cookies = document.cookie.split(';');
	          for (var i = 0; i < cookies.length; i++) {
	               var cookie = jQuery.trim(cookies[i]);

	          if (cookie.substring(0, name.length + 1) == (name + '=')) {
	            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
	              break;
	             }
	          }
	      }
	 return cookieValue;
	}

	var csrftoken = getCookie('csrftoken');
	var no_of_test = 0;
	var highest_user_wpm;

			get_graph_values();	



	function get_graph_values()
	{

		$.ajax({
			url:'/user_history/',
			type:'POST',
			data:{ csrfmiddlewaretoken : csrftoken},
			success:function(json)
			{
				g_graph_vals = eval("[ "+json+" ]");
				console.log(g_graph_vals);
				google.charts.load('current', {packages: ['corechart', 'line']});
				google.charts.setOnLoadCallback(drawBackgroundColor);

				function drawBackgroundColor() {
				      var data = new google.visualization.DataTable();
				      data.addColumn('number', 'X');
				      data.addColumn('number', 'WPM');
				      data.addColumn('number','accuracy')

				      data.addRows(g_graph_vals);

				      var options = {
				        hAxis: {
				          title: 'Test'
				        },
				        vAxis: {
				          title: 'Words Per Minute'
				        },
				       height: 500,
				 

				      };

				      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
				      chart.draw(data, options);
				    }

			},
			error : function(xhr,errmsg,err)
			{
				console.log(xhr.status + ": " + xhr.responseText); 
			}
		});
	}





	$('#logout').on('click',function()
	{

		window.location = '/logout/';
	});


	var not_interested;
	var dialgo_certi;
	function generate_certificate()
	{
		$.ajax({
			url:'/share_photo/',
			type:'POST',
			data:{ csrfmiddlewaretoken : csrftoken},
			success:function(json)
			{
					
				var dialog = '<div class="certi-dialog-container"><h2 id="modal1Title"> Share your best score with your friends</h2> <div class="user_img_result"><img src="/static/tmp_photo/'+json+'"></div> <div class="user_share_button" id="share_button"> Share on Facebook</div><div id="not-interested">Share on Google+</div>  </div> ';
				$('#newNotification').append(dialog);
			
				not_interested = document.getElementById('not-interested');
				dialgo_certi = document.getElementById('certificate_dialog');

					$(not_interested).on('click',function()
					{
						$(dialgo_certi).remove();
					});
					
					$('#share_button').on('click',function()
					{
							share_post();					
					});
			},
			error : function(xhr,errmsg,err)
			{
				console.log(xhr.status + ": " + xhr.responseText); 
			}
		});		

	}

	$(typing_area).bind('copy paste',function(e) {
	    e.preventDefault(); return false; 
	});

	var target = "#sentence"+getCookie('csrftoken');

	$(target).bind('copy paste',function(e) {
	    e.preventDefault(); return false; 
	});


	function speech(text)
	{
		  var u = new SpeechSynthesisUtterance();
		  var voices = window.speechSynthesis.getVoices();
		  
	     u.text = text;
	     u.lang = 'en-US';
	     u.pitch = 1;
	     u.rate = 0.4;
	     u.onend = function(event) {  }
	     speechSynthesis.speak(u);
	}


	function showResult()
	{
				document.getElementById('resultModal').click();
		var resultshow = '<div id="result-notification"></div>';
		//notificationActive();
		$('#newNotification').append(resultshow);
		var accuracy_gauge = document.getElementById('accuracy-gauge').innerHTML;
		var speed_gauge = document.getElementById('speed-gauge').innerHTML;
		$('#newNotification').append("<div class='result-contain'>"+accuracy_gauge + " "+ speed_gauge+"</div>"); 
	}


	var inputTarget = "#"+getCookie('csrftoken') + "1t3Z";
	var text;

	var inputTarget = "#"+getCookie('csrftoken') + "1t3Z";
	$('.user-profile-button').on('click',function()
	{
		$('.user-profile-container').toggleClass('user-profile-container-hidden');
	});
	
	$('.nav-bar-optimised').on('click',function()
	{
		$('.nav-bar-top').toggleClass('nav-bar-top-clicked');
		$('.nav-bar-middle').toggleClass('nav-bar-middle-clicked');
		$('.nav-bar-bottom').toggleClass('nav-bar-bottom-clicked');
		$('.nav-bar-menu').toggleClass('nav-bar-menu-active');
		$('.brand').toggleClass('brand-in-menu');
	});	


	$('div[data-type="background"').each(function()
	{
		var bgobj = $(this);
		$window = $(window);
		
		$(window).scroll(function()
		{
			 var yPos = -($window.scrollTop() / bgobj.data('speed'));
		 var coords = '50% '+ yPos + 'px';
		 bgobj.css({ backgroundPosition: coords });
		});
		
		 

	});

	$('#dialog-cancel').on('click',function()
	{
		$('.js-dialog').toggleClass('js-dialog-active');

	});
	
	$('.trigger-login-dialog').on('click',function()
	{
		$('.js-dialog').toggleClass('js-dialog-active')		
	});

	$('.change-view-button').on('click',function()
	{
		$('.js-dialog-content').toggleClass('js-dialog-change-view');
	});



	var spinner_time = setTimeout(spiner_timeout,5000)

	function spiner_timeout()
	{
		$('.spinner-container').addClass('hide');
	}

	$('#restart').on('click',function()
	{
		location.reload(true);
	});

	$('#start-btn-overlay').on('click',function()
	{

		$(inputTarget).focus();
		initialWordSetup();
		notificationDeactive();
	});


	$('#testbtn').on('click',function()
	{

		notificationActive();

	});

	function notificationActive()
	{
		$('#custom-overlay-id').removeClass('custom-overlay-hidden');
		$('#notificationbox').addClass('notification-active');
		$('#main-container').addClass('s-overlay-blr');
		$('body').css('overflow','hidden');
	}
	function notificationDeactive()
	{
		$('#custom-overlay-id').addClass('custom-overlay-hidden');
		$('#notificationbox').removeClass('notification-active');
		$('#main-container').removeClass('s-overlay-blr');
		$('body').css('overflow','visible');
	}



	function showStart()
	{
		var startbtn = '<div class="start-btn-overlay" id="start-btn-overlay"> Start </div> '; 
		$('#custom-overlay-id').append(startbtn);
	}

	function promoteLogin()
	{

		$('#newNotification').html('');
		var logdial = '<p><div class="logdial"> <div class="logdial-img"><img src="/static/images/profile.png"></div> <div> <div class="modal-fb-btn" > <div onclick="custom_login();">Register/Login with Facebook</div> </div> <div><h3>Track your progress and share results with friends. </h3></div> </div><button id="not_now" onclick="notificationDeactive()">Not Now</button> </div></p>';
		$('#newNotification').append(logdial);

	}




	$('div[data-type="background"').each(function()
	{
		var bgobj = $(this);
		$window = $(window);
		
		$(window).scroll(function()
		{
			 var yPos = -($window.scrollTop() / bgobj.data('speed'));
		 var coords = '50% '+ yPos + 'px';
		 bgobj.css({ backgroundPosition: coords });
		});
	});
	$('#side-menu-btn').on('click',function()
	{
		$('.side-menu').toggleClass('side-menu-visible');
	});
	$('#feedback-btn').on('click',function()
	{
		$('.feedback-box').toggleClass('feedback-box-open');
	});
	$('#close-feedback-btn').on('click',function()
	{
		$('.feedback-box').removeClass('feedback-box-open');
	});
	$('#unlock-click').on('click',function()
	{	
		document.getElementById('trigger-fb-login').click();
	});
	$('#notificationLogin').on('click',function()
	{
		document.getElementById('trigger-fb-login').click();
		console.log('notification-login');
	});








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
	    testAPI();

	  } else if (response.status === 'not_authorized') 
	  {

	    document.getElementById('status').innerHTML = 'Please log ' +
	      'into this app.';
	  } 
	  else 
	  {

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

	window.fbAsyncInit = function() 
	{
	  FB.init({
	    appId      : '885871594891806',
	    xfbml      : true,  // parse social plugins on this page
	    version    : 'v2.6' // use graph api version 2.5
	  });
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



(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));




function share_post()
{

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
  custom_login();

});


function getCookie(name)
{
  var cookieValue = null;
      if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
           var cookie = jQuery.trim(cookies[i]);
      if (cookie.substring(0, name.length + 1) == (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
         }
      }
  }
return cookieValue;
}
var csrftoken = getCookie('csrftoken');


function g_ajax_login()
{
  $.ajax({
    url:'/g_login/',
    type:'POST',
    data:{csrfmiddlewaretoken : csrftoken,
      google_id:g_user_id,
      g_user_name:g_user_name,
      g_user_email:g_user_email,
      g_user_profile:g_user_profile,
    },
    success:function(json)
    {
 		window.location = '/g_login'

        //document.open();
        //document.write(json);
        //document.close();
 
    },
    error : function(xhr,errmsg,err)
    {
      console.log(xhr.status + ": " + xhr.responseText); 
      console.log('ajazx_fb_erroro');
      window.location = '/home'
    }
  });

}



function fb_ajax_login()
{

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
        //document.open();
        //document.write(json);
        //document.close();
        //alert('facebook wala json');
        window.location = '/fb_login'
    },
    error : function(xhr,errmsg,err)
    {
      console.log(xhr.status + ": " + xhr.responseText); 
      console.log('ajazx_fb_erroro');
    }
  });
}

var g_user_name;
var g_user_profile;
var g_user_email;
var g_user_id;

function onSignIn(googleUser) 
{
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  g_user_name = profile.getName();
  g_user_profile = profile.getImageUrl();
  g_user_email = profile.getEmail();
  g_user_id = profile.getId();
  g_ajax_login();
}


function g_signOut() 
{
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
  window.location = '/user_logout'
}

window.onload = onLoad();
function onLoad() 
{
  gapi.load('auth2', function() {
    gapi.auth2.init();
  });
}

function sentence_validation()
{
	var title = document.sent_form.sentence_title.value;
	var sentence = document.sent_form.sentence_text.value;
	console.log(title);
	console.log(sentence);
	if(title == "" || title == null)
	{
		alert('Title can not be empty');
		return false;
	}
	if(sentence.length >= 450)
	{
		alert('Only 450 Characters are allowe');
		return false;
	}

}

function sentence_async_check()
{
	$('#sentence_area').on('keyup',function(event)
	{
		var sentence = document.sent_form.sentence_text.value;

		console.log(sentence);
		console.log(sentence.length);
	});

}

function practise()
{
hidden_sentence_list = $('#p_words').text().split("-");	
typed_sentence_list = [];
console.log(typed_sentence_list);
count=0;
temp;
keystokes=0;
count=0;
wrong_words =0;
grosswpm;
time_spent= 1;
initial = true;
netwpm = 0;
lastwordbool=false;
final_result_netwpm = 0;
accuracy=0;
timer = 0; 
curret_word_buffer=0;
wrong_keystrokes=0;
correct_keystokes=0;
correct_words=0;
current_flag;
g_graph_vals;
tar_cnt = 1;
voice_enabled = 1;
var target = "#"+getCookie('csrftoken');
$(target).html('');
$(typing_area).prop('disabled', false);
initialWordSetup();

}
