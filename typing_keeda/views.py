from django.shortcuts import render_to_response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.template import RequestContext #for csrf token
from typing_keeda.forms import register_form
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from typing_keeda.models import typing_sentences
from typing_keeda.models import user_result
from typing_keeda.models import user_detail
from typing_keeda.forms import register_form
from typing_keeda.forms import login_form
from typing_keeda.forms import sentence_form
from typing_keeda.forms import feedback_form
from typing_keeda.forms import normalLogin_form
from django.http import Http404
from django.db import IntegrityError
import random
from django.http import JsonResponse
from django.contrib.auth import logout
from django.shortcuts import redirect
from picture_script import generate_certificate
from django.core.mail import send_mail
import math
import string

key = "$Ha@7dp_FXaz4Sr_QXeU#!GJbKTD?%k*5b_Q=@Wk7RAvr-qH9KmeCNgjFG$uf-7BC*qJQQ#V-x&"


global total_sentence
global random_id
global this_sentence
global response
global is_login
global this_author
global this_author_detail
is_login = 0


def random_sentence():
	global total_sentence
	global random_id
	global this_sentence
	global this_author
	global this_author_detail
	total_sentence  = typing_sentences.objects.filter(is_active = 1)
	total_sentence_len = total_sentence.count()+1
	random_id = random.choice([o.sentence_id for o in total_sentence])
#	random_id = random.randrange(1,total_sentence)
	this_sentence = typing_sentences.objects.get(sentence_id = random_id)
	author_id = this_sentence.sentence_author
	this_author = User.objects.get(id = author_id.id)
	this_author_detail = user_detail.objects.get(user_id = this_author)
	


def index(request):
	return HttpResponseRedirect('/home')

def register(request):
	if request.method =="POST":
			register_form_object = register_form(request.POST)
			if register_form_object.is_valid():
				name = register_form_object.cleaned_data['name']						
				email = register_form_object.cleaned_data['email']
				password = register_form_object.cleaned_data['password']
				user = User.objects.create_user(username= email,first_name = name,email= email,password= password)
				user.save()
				user_detail_object = user_detail(user_id = user,name = name)
				user_detail_object.save()
	text = '<h1>Success</h1>'
	return HttpResponse(text)

def home(request):
	random_sentence()
	world_wide_list = user_detail.objects.all().order_by('-highest_wpm')[:15]
	author_list = user_detail.objects.filter(author_count__gt = 0).order_by('-author_count')[:15]
	form = feedback_form()
	normalLogin = normalLogin_form()
	if request.user.is_authenticated():
		user = request.user
		user_detail_object = user_detail.objects.get(user_id=user)
		friends_list = user_detail_object.friends_list
		friends_list = friends_list.split(',')
		friends = user_detail.objects.filter(facebook_id__in=friends_list).order_by('-highest_wpm')[:10]
		is_login = 1
		response = render_to_response('index.html',{ 
			"sentence":this_sentence,
			"author":this_author,
			"author_detail":this_author_detail,
			"author_list":author_list,
			"User":user,
			"user_detail":user_detail_object,
			"world_wide_list":world_wide_list,
			"friends":friends,
			"is_login":is_login,
			"form":form
			},RequestContext(request))	
	else:
		is_login = 0
		response = render_to_response('index.html',{
		 "sentence":this_sentence,
		 "author":this_author,
		 "author_detail":this_author_detail,
		 "author_list":author_list,
		 "world_wide_list":world_wide_list,
		 "is_login":is_login,
		 "form":form,
		 "normalLogin_form":normalLogin
		 },RequestContext(request))

	return response

def user_login(request):
	context_instance = RequestContext(request)
	world_wide_list = user_detail.objects.all().order_by('-highest_wpm')[:15]
	random_sentence()
	global response
	if request.method == "POST":
		login_form_object = login_form(request.POST)
		if login_form_object.is_valid():
			email = login_form_object.cleaned_data['email']
			password = login_form_object.cleaned_data['password']
			user = authenticate(username = email,password= password)
			if user is not None:
				if user.is_active:
					login(request,user)
					is_login = 1
					response = render_to_response('index.html',{ "sentence":this_sentence,"User":user,"world_wide_list":world_wide_list,"is_login":is_login},context_instance)			
				else:
					return HttpResponse("Account Disabled")
			else:
				response = "Please provide valid information"
	if request.user.is_authenticated():
		user = request.user
		user_detail_object = user_detail.objects.get(user_id=user) 
		response = render_to_response('index.html',{ "sentence":this_sentence,"User":user,"user_detail":user_detail_object,"world_wide_list":world_wide_list},context_instance)
	else:
		response = render_to_response('index.html',{ "sentence":this_sentence,"world_wide_list":world_wide_list},context_instance)

			#temp_result = keeda_user.objects.get(email = temp_email,password = temp_password)
			#request.session['name'] = temp_result.name
			#request.session['email'] = temp_result.email
			#temp_user_id = temp_result.user_id
			#request.session['user_id'] = temp_result.user_id
			#global is_login
			#is_login = True
			#if 'user_wpm' in request.session:
		#		user_wpm = request.session['user_wpm']
	#			del request.session['user_wpm']
	#			user_accuracy = request.session['user_accuracy']
	#			user_object = keeda_user.objects.get(user_id = temp_user_id)
	#			my_user_result = user_result(user= user_object,user_accuracy= user_accuracy, user_wpm = user_wpm) 
	#			my_user_result.save()					
	#		response = render_to_response('index.html',{ "sentence":this_sentence.sentence_text,"name":temp_result.name,"email":temp_result.email,"world_wide_list":world_wide_list,"is_login":is_login},context_instance)
	#		return HttpResponse('ho gya login')
	#		return HttpResponse('No user exist')
		#fb_user_login(request)
			#response = render_to_response('index.html',{ "sentence":this_sentence.sentence_text,"name":request.session['name'],"email":request.session['email'],"fb_user_profile":request.session['fb_user_profile'],"world_wide_list":world_wide_list,"is_login":is_login},context_instance)
	return response	


def user_history(request):
	if request.method =='POST':
		if request.is_ajax():
			user = request.user
			if user.is_authenticated():
				user_detail_object = user_detail.objects.get(user_id = user)
				user_result_list = user_result.objects.filter(user_id = user)
				user_test_count = user_result_list.count()
				wpm_array =[]
				cnt = 1
				for user in user_result_list:
					#wpm_array.append(str(user.user_wpm)+",")
					wpm_array.append("[ "+str(cnt)+" , "+str(math.ceil(user.user_wpm))+","+str(math.ceil(user.user_accuracy))+" ],")
					cnt=cnt+1
				response = wpm_array
			else:
				response = "Login Required"
	return HttpResponse(response)
		

def sentence_enter(request):
	context_instance = RequestContext(request)
	return render_to_response('sentence_enter.html',context_instance)

def sentence_submit(request):
	user = request.user
	if user.is_authenticated():	
		if request.method =="POST":
			my_sentence_form = sentence_form(request.POST)
			if my_sentence_form.is_valid():
				temp_sentence = my_sentence_form.cleaned_data['sentence_text']
				temp_title = my_sentence_form.cleaned_data['sentence_title']
				temp_result = typing_sentences(sentence_author=user,sentence_text = temp_sentence,sentence_title=temp_title)
				user_obj = user_detail.objects.get(user_id= user)
				user_obj.author_count = user_obj.author_count + 1
				user_obj.save()
				temp_result.save()

				return HttpResponse("<h1>Submitted successfully</h1>"+ str(user_obj.author_count))
			else:
				return HttpResponse('Sentence not valid')
		else:
			return HttpResponse('Not Authorized')
	else:
		return HttpResponse('User not authenticated')

	

def user_logout(request):
	logout(request)
	return redirect('/home')

def mobile(request):
	return render_to_response('mobile.html',{},RequestContext(request))


def ajax_request(request):
	global total_sentence
	global random_id
	global this_sentence
	context_instance = RequestContext(request)
	if request.method == 'POST':
		if request.is_ajax():
				user_wpm = request.POST.get('user_wpm')
				user_accuracy = request.POST.get('user_accuracy')
				user = request.user
				if not user:
					request.session['user_wpm'] = user_wpm
					request.session['user_accuracy'] = user_accuracy
				else:
					user_detail_object = user_detail.objects.get(user_id = user)
					if float(user_wpm) > float(user_detail_object.highest_wpm):
						user_detail_object.highest_wpm = user_wpm
						user_detail_object.save()
					user_result_object = user_result(user_id= user,user_accuracy= user_accuracy, user_wpm = user_wpm) 
					user_result_object.save()
		else:
			return HttpResponse("error ajax Try again")
	return HttpResponse("Success ajax request")

def g_login(request):
	random_sentence()
	world_wide_list = user_detail.objects.all().order_by('-highest_wpm')[:15]
	author_list = user_detail.objects.filter(author_count__gt = 0).order_by('-author_count')[:10]
	if request.is_ajax():
		g_user_id = request.POST.get('google_id')
		g_user_email =request.POST.get('g_user_email')
		g_user_profile = request.POST.get('g_user_profile')
		g_user_name = request.POST.get('g_user_name')
		try:
			user = User.objects.get(email = g_user_email)
			user.backend = 'django.contrib.auth.backends.ModelBackend'			
			user_detail_object = user_detail(user_id=user)
			if user is not None:
				if user.is_active:
					login(request,user)
					is_login = 1
				else:
					return HttpResponse('Accound Disabled')
		except User.DoesNotExist:
			user = User(username = g_user_email,email= g_user_email,first_name=g_user_name)		
			user.save()
			user_detail_object = user_detail(user_id= user, name = user.first_name,profile_picture = g_user_profile,google_id=g_user_id)
			user_detail_object.save()
			user.backend = 'django.contrib.auth.backends.ModelBackend'
			login(request,user)
			is_login = 1
			#mail_auth(request,temp_pass)
		response = render_to_response('index.html',{ "sentence":this_sentence,"author":this_author,"author_detail":this_author_detail,"author_list":author_list,"User":user,"user_detail":user_detail_object,"world_wide_list":world_wide_list,"is_login":is_login},RequestContext(request))
	if request.user.is_authenticated():
		response = redirect('/home')
	return response

def fb_login(request):
	global response
	random_sentence()
	context_instance = RequestContext(request)
	world_wide_list = user_detail.objects.all().order_by('-highest_wpm')[:15]
	author_list = user_detail.objects.filter(author_count__gt = 0).order_by('-author_count')[:10]
	if request.is_ajax():
		fb_user_id = request.POST.get('facebook_id')
		fb_user_email = request.POST.get('fb_user_email')
		fb_user_name = request.POST.get('fb_user_name')
		fb_user_profile = request.POST.get('fb_user_profile')
		friends_list = request.POST.get('friends_list')
		try:
			user = User.objects.get(email = fb_user_email)
			user.backend = 'django.contrib.auth.backends.ModelBackend'			
			user_detail_object = user_detail.objects.get(user_id=user)
			if user is not None:
				if user.is_active:
					user_detail_object.profile_picture = fb_user_profile
					user_detail_object.facebook_id = fb_user_id
					user_detail_object.friends_list = str(friends_list)
					user_detail_object.save()
					login(request,user)
					is_login = 1
				else:
					return HttpResponse("Account Disabled")
		except User.DoesNotExist:
			user = User(username=fb_user_email,email=fb_user_email,first_name=fb_user_name)
			user.save()
			user_detail_object = user_detail(user_id= user,name=user.first_name,facebook_id=fb_user_id,profile_picture= fb_user_profile,friends_list=str(friends_list))
			user_detail_object.save()
			user.backend = 'django.contrib.auth.backends.ModelBackend'
			#new_fb_user = keeda_user(email=fb_user_email,name=fb_user_name,facebook_id= fb_user_id)
			#new_fb_user.save()
			login(request,user)
			is_login = 1
			#mail_auth(request,temp_pass)
		friends_list = user_detail_object.friends_list
		friends_list = friends_list.split(',')
		friends = user_detail.objects.filter(facebook_id__in=friends_list).order_by('-highest_wpm')[:10]		
		response = render_to_response('index.html',{ "sentence":this_sentence,"author":this_author,"author_detail":this_author_detail,"author_list":author_list,"User":user,"user_detail":user_detail_object,"world_wide_list":world_wide_list,"friends":friends,"is_login":is_login},context_instance)	
	if request.user.is_authenticated():
		response = redirect('/home')
	return response

				
				
def tc(request):
	context_instance = RequestContext(request)
	user = request.user
	return render_to_response('terms_and_conditions.html',{"User":user},context_instance)

def privacy_policy(request):
	context_instance = RequestContext(request)
	user = request.user
	return render_to_response('privacy_policy.html',{"User":user},context_instance)

def share_photo(request):
	user = request.user
	username = user.first_name+"_"+user.last_name
	user_detail_object = user_detail.objects.get(user_id=user)
	name = user.first_name
	url = user_detail_object.profile_picture
	speed = int(math.ceil(user_detail_object.highest_wpm))
	filenamee = generate_certificate(url,username,speed,name)
	return HttpResponse(filenamee)

def test_module(request,wow):
	return HttpResponse(wow)

def dashboard(request):
	user = request.user
	if user.is_authenticated():
		user_detail_object = user_detail.objects.get(user_id=user)
		friends_list = user_detail_object.friends_list
		friends_list = friends_list.split(',')
		friends = user_detail.objects.filter(facebook_id__in=friends_list).order_by('-highest_wpm')[:10]		
		user_sentences = typing_sentences.objects.filter(sentence_author = user)
		if user.is_staff:
			pending_sentences = typing_sentences.objects.filter(is_active = 0)
		else:
			pending_sentences = ""
		return render_to_response('dashboard.html',{
			"User":user,
			"user_sentences":user_sentences,
			"user_detail":user_detail_object,
			"friends":friends,
			"pending_sentences":pending_sentences
			},RequestContext(request))
	else:
		return redirect('/home')
	

def mail_auth(request,mail_message):
	subject = "No reply: Typingkeeda Signup detail"
	from_mail = "noreply@typingkeeda.in"
	message = "Thank you for signing up with typingkeeda. Your Password for the account is"+mail_message
	send_mail(subject,mail_message,from_mail,to_mail,fail_silently= True)

def generate_password():
	key = "5AqTQ2zSBFph9YaZKsfpEDzUkfgxGdCVy"
	password = ''.join(random.sample(key,15))
	return password

def feedback_mail(request):
	if request.method == "POST":
		feedback_form_object = feedback_form(request.POST)
		if feedback_form_object.is_valid():		
			f_name = feedback_form_object.cleaned_data['f_name']
			f_email = feedback_form_object.cleaned_data['f_email']
			f_subject = feedback_form_object.cleaned_data['f_subject']
			f_message = feedback_form_object.cleaned_data['f_message']
			from_mail = "feedback@typingkeeda.in"
			to = ["m.r.rawte7@gmail.com"]
			send_mail(f_subject,f_message,from_mail,to,fail_silently= False)
			response = HttpResponse("<h1>SuccessFully Sent Mail</h1>")
		else:
			response = HttpResponse("FOrm is not valid")
	else:
		response = HttpResponse("Kuch Gadbad Jhala")
	return response 

def s_approve(request,s_id):
	if request.user.is_authenticated():
		if request.user.is_staff:
			pending_sentences = typing_sentences.objects.get(sentence_id = int(s_id))
			pending_sentences.is_active = 1
			pending_sentences.save();
			return ('That sentence was approved')
		else:
			return HttpResponse('User is not statff')
	else:
		return HttpResponse("is not authenticated")
	return HttpResponse(str(s_id) + "That was saved")

def s_reject(request,s_id):
	if request.user.is_authenticated():
		if request.user.is_staff:
			pending_sentences = typing_sentences.objects.get(sentence_id = int(s_id))
			pending_sentences.is_active = -1
			pending_sentences.save();
			return ('That sentence was Rejected')
		else:
			return HttpResponse('User is not statff')
	else:
		return HttpResponse("is not authenticated")
	return HttpResponse(str(s_id) + "That was saved")
	
