$(document).ready(function()
{
	
	$('.change-sub-modal').on('click',function()
	{
		$('.register-modal').toggleClass('sub-modal-hidden');
		$('.login-modal').toggleClass('sub-modal-hidden');
	});
	

	/*
	var wpm = new Array();
	var is_login = false;

	function getCookie(name) {
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

	$.ajax({
		url:'/user_history/',
		type:'POST',
		data:{ csrfmiddlewaretoken : csrftoken},
		success:function(json)
		{
			wpm = json.split(',');
			console.log(wpm);

			create_Graph();
			/*alert('Response is '+wpm_list);
			console.log(wpm_list);
			
		},
		error : function(xhr,errmsg,err)
		{
			console.log(xhr.status + ": " + xhr.responseText); 
		}
	});
	*/

	
	//wpm = wpm_list;
	//wpm = [20,30,50,40,20,40,70,90,40,50,40,20,40,70,90,40,90,40,50,40,20,50,25,60,15,80,46,25];
	//wpm =[11,62,11,26,11,11,11,11,11,11,11,11,11,11,45];
/*	wpm[0] = 10;
	wpm[1] = 40;
	wpm[2] = 20;
	wpm[3] = 25;
	wpm[4] = 40;
	wpm[5] = 10;
	*/
	/*

	function create_Graph()
	{


			console.log(wpm);

			var total_width = 300;
			var total_height = 300;

			var arr_len = wpm.length-1;
			console.log(arr_len);
			var spacing = total_width /arr_len;
			console.log(arr_len);
			var spacing_l = spacing;
			var canvas = document.getElementById('stats-canvas');
			var context = canvas.getContext('2d');

			var post_x=0;
			var post_y=0;
			var bool_first = true;
			var x = 50;
			var y =0;
				for(var i= 0; i<arr_len;i++)
				{
					x = spacing+50;
					y = total_width-wpm[i]*3 + 50;
					context.beginPath();
					context.arc(x,y,2,0,2*Math.PI);
					console.log(x+","+y);
					if(!bool_first)
					{
						context.moveTo(x,y);
						context.lineTo(post_x,post_y);	
					}
					if(bool_first)
					{
						bool_first = false;
					}


					
					context.stroke();
					spacing=spacing+spacing_l;
					post_x = x;
					post_y = y;
				}
				/*
				context.beginPath();
				context.moveTo(350,10);
				context.lineWidth = 20;
				context.lineTo(350,400);
				context.strokeStyle= '#ccc';

				context.stroke();
				//context.moveTo(400,400);
				context.beginPath();
				context.strokeText('Something',200,200);
				context.stroke();		
				//context.lineCap = "round";
				context.beginPath();
				context.lineWidth = 2;
				
				context.arc(100,100,2,0,2*Math.PI);
				context.stroke();
				

				context.beginPath();
				context.lineWidth=2;
				context.arc(100,200,2,0,2*Math.PI);
				context.quadraticCurveTo(100,200,200,75);
				context.stroke();

			
				context.beginPath();
				context.moveTo(50,50);

				context.lineTo(50,350);
				context.lineTo(350,350);
				context.strokeStyle='#ccc';
				context.stroke();

				context.beginPath();
			//	context.moveTo(30,50);
				context.fillText('Words Per Minute-----',10,50);
				
				for(var t = 5;t<=100;t=t+5)
				{	
					var temp_y = 350 - t*3;
					context.fillText(t+' --',20,temp_y);
					console.log(temp_y);
				}
		//		context.fillText(' 5--',20,345);
				context.stroke();

	}
		//wpm draw

*/
	/* Google analytics */

	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

	  ga('create', 'UA-79237109-1', 'auto');
	  ga('send', 'pageview');



});