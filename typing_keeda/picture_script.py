from PIL import Image, ImageOps, ImageDraw, ImageFont
import urllib, cStringIO
import os

#BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
#photo_dir =  os.path.join(BASE_DIR,'/static/pic')
photo_dir = os.getcwd


def makeCircular(image):
	size = (143, 143)
	mask = Image.new('L', size, 0)
	draw = ImageDraw.Draw(mask)
	draw.ellipse((0, 0) + size, fill=255)
	output = ImageOps.fit(image, mask.size, centering=(0.5, 0.5))
	output.putalpha(mask)
	return output



def generate_certificate(url,username,speed,name):
	file = cStringIO.StringIO(urllib.urlopen(url).read())
	im = Image.open(file)
	im = im.resize((200, 200), Image.ANTIALIAS)		
	circularImage = makeCircular(im)
	certificate_banner = Image.open('static/typingkeedacertificate.jpg')
	circularImage.copy()
	certificate_banner.paste(circularImage,(230,150),circularImage)
	filename = str(username)+".jpg"
	#certificate_banner.save('static/tmp_photo/'+filename)
	
	drawText = ImageDraw.Draw(certificate_banner)
	font = ImageFont.truetype('static/fonts/titillium_web/TitilliumWeb-Regular.ttf',15)
	font25 = ImageFont.truetype('static/fonts/titillium_web/TitilliumWeb-SemiBold.ttf',50)
	font15 = ImageFont.truetype('static/fonts/titillium_web/TitilliumWeb-SemiBold.ttf',20)
	drawText.text((408,165),str(speed), font=font25, fill=(0,160,227,1))
	drawText.text((400,240),name, font=font15, fill=(0,160,227,1))

	certificate_banner.save('static/tmp_photo/'+filename)

	return filename

#url = str(raw_input('enter_url'))
#url = str(sys.argv[1])

#file = cStringIO.StringIO(urllib.urlopen(url).read())

#im = Image.open('mr.jpg')
#circularImage = makeCircular(im)
#image.save('output3.png')

#wow = Image.open('output3.png')

#certificate_banner = Image.open('typingkeedacertificate.jpg')
#circularImage.copy()
#certificate_banner.paste(circularImage,(230,150),circularImage)
#certificate_banner.save('final.jpg')

#image propertiesk


