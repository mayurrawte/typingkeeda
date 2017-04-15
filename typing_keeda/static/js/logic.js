$(document).ready(function()
{

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

	initialSetup();
	function initialSetup()
	{
		for(var i = 0; i<hidden_sentence_list.length;i++)
		{
			$('#sentence').append('<span id=word_'+i+'>'+hidden_sentence_list[i]+"</span> ");
		}
	}
	function next_word()
	{
		var target = "#word_"+count;
		$(target).css('color','rgb(61, 133, 204)');
	}
/*	$('#typing_area').keypress(function(event)
	{
		start_test(event);
		
	});
*/
	$('#typing_area').on('keyup',function(event)
	{
		start_test(event);
	});
	function start_test(event)
	{

		if(initial)
		{
			timer();
			initial = false;
		}
		next_word();
		var uniCharCode = event.which || event.keyCode;
		if(uniCharCode!= 8)
		{
		
			keystokes+=1;
				
		}

		if(uniCharCode==32 || uniCharCode == 13)
		{
			add_to();
			
			clear_previous();
			error_check();
		}
	}

	function add_to()
	{
		temp = $('#typing_area').val();
		temp = temp.trim();
		typed_sentence_list.push(temp);
		
		//console.log(typed_sentence_list);
	}

	function clear_previous()
	{
		$('#typing_area').val('');
	}

	function error_check()
	{
		if(hidden_sentence_list[count] == typed_sentence_list[count])
		{
			var target = "#word_"+count;
			$(target).css('color','rgb(115, 197, 90)');
		}
		else
		{
			var target = "#word_"+count;
				$(target).css('color','rgb(252, 88, 88)');
				wrong_words+=1;

			/* additional penelty*/
			keystokes = keystokes- 6;
		}

		count+=1;

		if(hidden_sentence_list.length == typed_sentence_list.length)
		{
			result();
		}
	}


	function timer()
	{

		timer=setInterval(function()
			{
				grosswpm = (keystokes/5)/time_spent;
				grosswpm = Math.round(grosswpm*60);		
				netwpm = grosswpm -(wrong_words*5/time_spent);	
				
				accuracy = (netwpm/grosswpm)*100;
				document.getElementById('accuracy').innerHTML =  accuracy;

				document.getElementById('kpm').innerHTML = Math.floor(netwpm);
				//var n =$(text_area).val().length;
			

				time_spent+=1;	
				time_left = 60-time_spent;
				document.getElementById('time_left').innerHTML = time_left;
				if(time_spent>=60)
				{
					result();
					clearInterval(timer);
				}



			},1000);

	}

function result()
{
	var current_flag =document.getElementById('current-flag').getAttribute("value");
	clearInterval(timer);
	final_result_netwpm = netwpm;
	ajax_method();
	if(current_flag)
	{
		console.log('success submistion')
			
	}
	else
	{
		alert('you can save result on login');
	}
	
}



	


/* Ajax request */

function ajax_method()
{
	//For getting CSRF token
	/*function getCookie(name) 
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
	*/
	
	$.ajax({
		url: '/ajax_request/',
		type: "POST",
		data:{ csrfmiddlewaretoken : csrftoken, 
		user_wpm :final_result_netwpm,
		user_accuracy : accuracy
	},

	success: function(json)
	{
		console.log(json);
		alert('data submitted'+ json);
		get_graph_values();
	}
	,
	error : function(xhr,errmsg,err)
	{
		console.log(xhr.status + ": " + xhr.responseText); 
	}

	});	
}




/* For rendering graph */


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
			wpm = json.split(',');
			no_of_test = wpm.length-1;
			document.getElementById('no_of_test').innerHTML = no_of_test;
			highest_user_wpm = json.split(',')
			highest_user_wpm = highest_user_wpm.sort(function(a, b){return b-a;})[0] -1 ;
			document.getElementById('highest_user_wpm').innerHTML = highest_user_wpm;

			create_Graph();
			/*alert('Response is '+wpm_list);
			console.log(wpm_list);
			*/
		},
		error : function(xhr,errmsg,err)
		{
			console.log(xhr.status + ": " + xhr.responseText); 
		}
	});
}

function create_Graph()
{


//console.log(wpm);

var total_width = 300;
var total_height = 300;
var arr_len = wpm.length-1;
//console.log(arr_len);
var spacing = total_width /arr_len;
//console.log(arr_len);
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

*/
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






// Logout 


//var logout = document.getElementById('logout');

$('#logout').on('click',function()
{

	window.location = '/logout/';

	/*$.ajax({
		url:'/logout/',
		type:'POST',
		data:{ csrfmiddlewaretoken : csrftoken},

		success:function(json)
		{	
			console.log('Logout successfully');
		},
		error : function(xhr,errmsg,err)
		{
			console.log(xhr.status + ": " + xhr.responseText); 
		}

	});	
	*/

});



});