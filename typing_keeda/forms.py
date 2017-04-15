from django import forms

class register_form(forms.Form):
	name = forms.CharField(max_length=50)
	email = forms.EmailField()
	password = forms.CharField(widget = forms.PasswordInput())

	

class login_form(forms.Form):
	email = forms.CharField(max_length=50)
	password = forms.CharField(widget = forms.PasswordInput())

class sentence_form(forms.Form):
	sentence_text = forms.CharField(widget=forms.Textarea)
	sentence_title = forms.CharField()

class feedback_form(forms.Form):
	f_name = forms.CharField(
		label='f_name',
		max_length=50,
		widget = forms.TextInput(attrs={'placeholder':'Your Name'})
		)
	
	f_email = forms.EmailField(
		label = 'f_email',
		widget = forms.TextInput(attrs={'placeholder':'Your Email'})
		)

	f_subject = forms.CharField(
		max_length=50,
		widget = forms.TextInput(attrs={'placeholder':'Subject'})
		)

	f_message = forms.CharField(widget=forms.Textarea(attrs={'placeholder':'Message'}))


class normalLogin_form(forms.Form):
	email = forms.EmailField(
		label='email',
		widget= forms.EmailInput(attrs={'placeholder':'Email'})
		)

	password = forms.CharField(
		widget = forms.PasswordInput(attrs={'placeholder':'Password'})
		)