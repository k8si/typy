my_global = 0

def incr_global():
	global my_global
	my_global += 1

print my_global
incr_global()
print my_global