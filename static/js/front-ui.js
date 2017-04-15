/*var inputTarget = "#"+getCookie('csrftoken') + "1t3Z";
var text;
$(document).ready(function()
{
	

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
		$('#custom-overlay-id').addClass('custom-overlay-hidden');
		$(inputTarget).focus();
		initialWordSetup();
		notificationDeactive();
	});

	$('#testbtn').on('click',function()
	{
		$('#custom-overlay-id').removeClass('custom-overlay-hidden');
		notificationActive();

	});

	function notificationActive()
	{
		$('#notificationbox').addClass('notification-active');
		$('#main-container').addClass('s-overlay-blr');
		$('body').css('overflow','hidden');
	}
	function notificationDeactive()
	{
		$('#notificationbox').removeClass('notification-active');
		$('#main-container').removeClass('s-overlay-blr');
		$('body').css('overflow','visible');
	}

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

*/