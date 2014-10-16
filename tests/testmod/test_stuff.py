class OldStyleClass:
	def __init__(self, stuff):
		self.stuff = stuff
	def __str__(self):
		return "this is a class and stuff"
	def __repr__(self):
		return "string representation of this class from within a container, but why..."
	def get_stuff(self):
		return self.stuff
	def set_stuff(self, val):
		self.stuff = val

class NewStyleClass(object):
	def __init__(self, stuff):
		self.stuff = stuff

def countWords(string, word):
	words = string.split(" ")
	return words.count(word)


