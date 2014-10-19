class Foo:
	def __init__(self, x):
		self.x = x
	def get_x(self):
		return self.x
	def __str__(self):
		return "<FOO " + self.get_x() + ">"

f = Foo(1)
print str(f)