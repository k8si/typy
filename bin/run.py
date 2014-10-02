#!/usr/local/bin/python

import sys, os
assert len(sys.argv) == 2
fname = sys.argv[1]
print "compiling ", fname, " ... ",
os.system("bin/compile.sh " + fname)
print "done. output: "
jsfile = fname[:-2]+"js"
os.system("node " + jsfile)
