TSC = TSC
FLAGS = --module amd
ROOT = www/scripts/helper/
TESTROOT = testserver/public/data

PYC = python -m compileall

.SUFFIXES: .ts .js .py .pyc

.ts.js:
	$(TSC) $(FLAGS) $*.ts

.py.pyc:
	$(PYC) $*.py

CLASSES = $(ROOT)interpret.ts $(ROOT)opcodes.ts $(ROOT)parse.ts $(ROOT)py_objects.ts $(ROOT)utils.ts $(ROOT)vm_objects.ts $(ROOT)builtins.ts $(ROOT)gLong.ts www/scripts/tests/test_suite.ts

TESTS = $(TESTROOT)/test_if.py $(TESTROOT)/test_for_loop.py $(TESTROOT)/test_while_loop.py $(TESTROOT)/test_list.py $(TESTROOT)/test_neg_numbers.py $(TESTROOT)/test_dict.py $(TESTROOT)/test_math.py $(TESTROOT)/test_fxn.py

default: classes

classes: $(CLASSES:.ts=.js)

run: default
	open -a firefox www/app.html

clean:
	$(RM) $(ROOT)*.js
	$(RM) $(TESTROOT)/*.pyc

tests: $(TESTS:.py=.pyc)



