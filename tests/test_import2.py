from __future__ import division
from collections import deque

a = 5/2
print a

d = deque()
d.append(1)
d.append(1)
d.append(2)
print d.count(1)
d.pop()
print len(d)
d.pop()
d.pop()
assert len(d) == 0
