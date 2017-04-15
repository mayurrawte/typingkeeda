from django.db import models
from django.contrib.auth.models import User



class user_detail(models.Model):
	user_id = models.ForeignKey(User)
	name = models.CharField(max_length=50)
	highest_wpm = models.FloatField(default='0')
	facebook_id = models.CharField(max_length=50,default=0)
	profile_picture = models.CharField(max_length=50)
	friends_list = models.CharField(max_length=400)
	author_count = models.IntegerField(default= 0)
	google_id = models.CharField(max_length=50,default=0)
	
	class Meta:
		db_table = "user_detail"

class typing_sentences(models.Model):
	sentence_id = models.AutoField(primary_key=True)
	sentence_author = models.ForeignKey(User,on_delete=models.CASCADE)
	sentence_text = models.TextField()
	sentence_title = models.CharField(max_length=50)
	is_active = models.IntegerField(default=0)

	class Meta:
		db_table = "typing_sentences"

class user_result(models.Model):
	user_id = models.ForeignKey(User,on_delete=models.CASCADE)
	date = models.DateField(auto_now=True)
	user_wpm = models.FloatField(default='0')
	user_accuracy = models.FloatField(default='0')

	class Meta:
			db_table = "user_result"

			
