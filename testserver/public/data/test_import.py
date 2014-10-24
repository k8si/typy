from testmod import test_stuff
from testmod import test_fxns

s = "alice killed bob"
result = test_stuff.countWords(s, "alice")
print result
print(result)

o = test_stuff.OldStyleClass("alice")
print o

n = test_stuff.NewStyleClass("bob")
print n

l = []
for i in range(5):
	l.append(test_stuff.OldStyleClass(i))

print l
for i in l:
	print i

print test_fxns.A_GLOBAL
test_fxns.incr_global()
print test_fxns.A_GLOBAL