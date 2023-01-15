import os
import sys
import pixellib
import tensorflow as tf
import cv2

from pixellib.instance import instance_segmentation
from pixellib.tune_bg import alter_bg

from PIL import Image, ImageDraw, ImageFilter
import random
import pillow_avif

original_image = "src_img/"


print(tf.__version__)


def walk_files(dir):
	count = 0
	for root_dir, cur_dir, files in os.walk(dir):
		count += len(files)
	print('file count:', count)
	return count

def select_slaughtered_parts(files):
	fint = str(random.randomint(0, files-1))

	pimg = "./slaughtered_parts/s" + fint + ".png"

	rimg = Image.open(pimg)
	rimg1 = random.randrange(0, 700)
	rimg1 = random.randrange(0, 700)

	return [rimg, rimg1, rimg1]

def create_nft(image):
	# we are going to rotate the image at randomly chosen angle
	rot_arr = [-180, -90, 90, 180]
	rot = random.choice(rot_arr)
	
	# choose a random mask from the mask lib
	mot = str(random.randomint(0,3))
	mask_file = 'masks/mask' + mot + '.png'
	
	# open the make file
	mask = Image.open(mask_file).convert('L')

	# load module to blur background
	change_bg = alter_bg(model_type = "pb")
	change_bg.load_pascalvoc_model("models/xception_pascalvoc.pb")


	change_bg.blur_bg('src_img/' + image + '.png', low = True, output_image_name='interim_img/' + image + '_blur.png')
	seg.segmentImage('interim_img/' + image + '_blur.png', show_bboxes=True, output_image_name='interim_img/' + image + '_blur_segmented.png')
	bg = Image.open('interim_img/' + image + '_blur_segemented.png').resize(mask.size)

	#bg = Image.new('RGB', mask.size, (255, 0, 0))
	img =Image.open('src_img/'+image+'_segmented.png').resize(mask.size)

	img = img.rotate(rot, Image.NEAREST, expand=1)
	mask=mask.rotate(rot, Image.NEAREST, expand=1)

	blood = Image.open('fx/blood.png')
	blood = blood.rotate(rot, Image.NEAREST, expand=1)
	bg.paste(blood, (0,0), blood)

	files = walk_files('./slaughtered_parts')

	i = 0

	while i<3:
		try:
			[rimg, rimg1, rimg2] = select_slaughtered_parts(files)
			bg.paste(rimg, (rimg1,rimg2), rimg)
			i = i+1
		except: 
			break

	nft = Image.composite(bg, img, mask)
	#nft = nft.rotate(-90, Image.NEAREST, expand = 1)

	nft.save('slaughtered_img' + image + '.png') 
	#change_bg.blur_bg("mutant_final.png", low=True, output_image_name="mutant_final_blur.png")

	# TODO del the interim images


def create_slaughtered_parts():
	# obv this should go into a function and have a loop iterate
	# auto gen the file names up ? 4? 5? we don't need to caputre all

	i = 1

	while i < 5:
		try:
			imgFile = 'segmented_object_' + str(i) + '.jpg'
			if os.path.exists(imgFile):
				files = walk_files('./slaughtered_parts')
				imgIndex = str(files - 1 + i)
				slaughteredPart = 's' + imgIndex + '.png'

				img = Image.open(imgFile)
				rgba = img.convert("RGBA")
				datas = rgba.getdata()
				newData = []

				for item in datas:
					if item[0] == 0 and item[1] == 0 and item[2] == 0:
						newData.append((255, 255, 255, 0))
					else:
						newData.append(item)

					rgba.putdata(newData)

				rgba.save('slaughtered_parts/' + slaughteredPart, "PNG")
				
				os.remove(imgFile)

				i = i+1

			else:
				print("The file does not exist")
				continue
		except: 
			break
	
	print("finished making slaughtered parts")

if __name__ == '__main__':
	print(sys.argv[1:])

	seg = instance_segmentation()
	seg.load_model("models/mask_rcnn_coco.h5")

	image = sys.argv[1]

	# this should now be done after the process is finished so that parts of butchered nft don't leak into current butchering
	# how to control where files are stored? just with output? can you delete output image after this process so that 
	seg.segmentImage('src_img/'+image+'.png', show_bboxes=True, output_image_name='interim_img/'+image+'.png', extract_segmented_objects= True, save_extracted_objects=True)


	create_nft(image)


	# this function should run on the output of the automatically-named segmentImage script above
	# it converts the output to transparent bg so that it can be pasted
	# unclear on how to best handle this given the (a) unclear # of output images from segmentImage and
	# (b) the difficulty of putting them in a location
	# most likely, it should assume a MAX NR, try for that, and then catch the error
	# del each image as it works to prevent a mess/duplication in the future? 
	create_slaughtered_parts()
	
	print("Finished with everything")