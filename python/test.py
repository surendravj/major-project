import cv2
import numpy as np
import argparse
import time
import glob
import os
import pandas
import sys
import subprocess
import random


cv2.namedWindow("preview")
vc = cv2.VideoCapture(0)
facecascade = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")
facedict = {}
actions = {}
emotions = ["anger","disgust","fear", "happy","neutral","sadness","surprise"]
