import os
import sys
import pixellib
import tensorflow as tf
import cv2
import multiprocessing

from pixellib.instance import instance_segmentation
from pixellib.tune_bg import alter_bg

from PIL import Image, ImageDraw, ImageFilter
import random

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

	pimg = dirPath + "/slaughtered_parts/s" + fint + ".png"

	rimg = Image.open(pimg)
	rimg1 = random.randrange(0, 700)
	rimg2 = random.randrange(0, 700)

	return [rimg, rimg1, rimg2]

def create_nft(image):
	# we are going to rotate the image at randomly chosen angle
	rot_arr = [-90, 90, 180]
	rot = random.choice(rot_arr)
	
	# choose a random mask from the mask lib
	mot = str(random.randint(0,2))
	mask_file = dirPath + '/masks/mask' + mot + '.png'

	# open the make file
	mask = Image.open(mask_file).convert('L')

	# load module to blur background
	change_bg = alter_bg(model_type = "pb")
	change_bg.load_pascalvoc_model(dirPath + "/models/xception_pascalvoc.pb")


	change_bg.blur_bg(dirPath + '/src_img/' + image + '.png', low = True, output_image_name=dirPath + '/interim_img/' + image + '_blur.png')
	
	seg.segmentImage(dirPath + '/src_img/' + image + '.png', show_bboxes=True, output_image_name=dirPath + '/interim_img/' + image + '_blur_segmented.png')

	bg = Image.open(dirPath + '/interim_img/' + image + '_blur_segmented.png').resize(mask.size)


	try:
		#bg = Image.new('RGB', mask.size, (255, 0, 0))
		img =Image.open(dirPath + '/src_img/'+image+'.png').resize(mask.size)
		rgbimg = Image.new("RGBA", img.size)
		rgbimg.paste(img)
	except: 
		print("background problem")
	
	try:
		rgbimg = rgbimg.rotate(rot, Image.NEAREST, expand=1)
		mask=mask.rotate(rot, Image.NEAREST, expand=1)
	except: 
		print("mask problem")

	try:
		contour_file = dirPath + '/fx/contour_' + mot + '.png'
		contour = Image.open(contour_file)
		contour = contour.rotate(rot, Image.NEAREST, expand=1)
		bg.paste(contour, (0,0), contour)
	except:
		print("contour failed")


	try:
		bot = str(random.randint(0,1))
		blood_file = dirPath + '/fx/blood_' + mot + '_' + bot + '.png'
		blood = Image.open(blood_file)
		blood.resize(mask.size)
		blood = blood.rotate(rot, Image.NEAREST, expand=1)
		bg.paste(blood, (0,0), blood)
	except:
		print("blood failed")
	

	try:
		nft = Image.composite(bg, rgbimg, mask)
		border_file = dirPath + '/fx/border.png'
		border = Image.open(border_file)
		nft.paste(border, (0,0), border)
		butcher_file = dirPath + '/fx/butcher_illusion.png'
		butcher = Image.open(butcher_file)
		nft.paste(butcher, (0,0), butcher)
		nft.save(dirPath + '/slaughtered_img/' + image + '.png') 
	except:
		print("nft failed")

def create_slaughtered_parts():
	i = 1
	files = walk_files(dirPath + '/slaughtered_parts')

	while i < 5:
		try:
			imgFile = dirPath + '/../../../segmented_object_' + str(i) + '.jpg'
			print("IMAGE FILE =>", imgFile)
			if os.path.exists(imgFile):
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
				
				rgba.save(dirPath + '/slaughtered_parts/' + slaughteredPart, "PNG")
				
				os.remove(imgFile)

				i = i+1

			else:
				print("The file does not exist")
				i = i + 1
				continue

		except: 
			break
	
	print("finished making slaughtered parts")

if __name__ == '__main__':
	print("EN PYTHON")
	print(sys.argv[1:])

	seg = instance_segmentation()

	dirPath = os.path.dirname(os.path.realpath(__file__))
	print("DIR PATH =>", dirPath)
	seg.load_model(dirPath + "/models/mask_rcnn_coco.h5")

	image = sys.argv[1]

	## save to grayscale here
	img = Image.open(dirPath + '/src_img/' + image + '.png').convert('L')
	img.save(dirPath + '/src_img/' + image + '.png')


	# this should now be done after the process is finished so that parts of butchered nft don't leak into current butchering
	# how to control where files are stored? just with output? can you delete output image after this process so that 
	seg.segmentImage(dirPath + '/src_img/'+image+'.png', show_bboxes=True, output_image_name=dirPath + '/interim_img/'+image+'.png', extract_segmented_objects= True, save_extracted_objects=True)


	create_nft(image)


	# this function should run on the output of the automatically-named segmentImage script above
	# it converts the output to transparent bg so that it can be pasted
	'''
	p = multiprocessing.Process(target=create_slaughtered_parts)
	p.start()
	p.join(10)
	if p.is_alive():
		p.terminate()
		p.join()
	'''

	# del working images
	os.remove(dirPath + '/interim_img/'+image+'.png')
	os.remove(dirPath + '/interim_img/'+image+'_blur.png')
	os.remove(dirPath + '/interim_img/'+image+'_blur_segmented.png')

	print("Finished with everything")

	sys.exit(0)