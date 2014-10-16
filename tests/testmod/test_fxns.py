A_GLOBAL = 0

def arg0():
	return None

def arg1(a):
	return None

def arg2(a, b):
	return None

def loc1():
	a = 1
	return a

def incr_global():
	global A_GLOBAL
	A_GLOBAL += 1

def change_global():
	global A_GLOBAL
	A_GLOBAL = "hello"
