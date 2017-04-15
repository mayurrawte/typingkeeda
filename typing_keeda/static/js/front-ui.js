$(document).ready(function()
{
	
	$(document).on('scroll',function()

	{

		var headerOffset = $('header').offset();

		if(headerOffset.top >=140)

		{

			$('header').addClass('header-moved');

		}
		else

		{

			$('header').removeClass('header-moved');

		}
		/*if(headerOffset.top >=700)
		{
			$('body').addClass('body-2nd');
		}
		else
		{
			$('body').removeClass('body-2nd');
		}

		*/
	});


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

});
