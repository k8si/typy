TSC = TSC
FLAGS = --module amd
ROOT = www/scripts/helper/

.SUFFIXES: .ts .js

.ts.js:
	$(TSC) $(FLAGS) $*.ts

CLASSES = $(ROOT)interpret.ts $(ROOT)opcodes.ts $(ROOT)parse.ts $(ROOT)py_objects.ts $(ROOT)utils.ts $(ROOT)vm_objects.ts $(ROOT)builtins.ts www/scripts/tests/test_suite.ts

default: classes

classes: $(CLASSES:.ts=.js)

run: default
	open -a firefox www/app.html

clean:
	$(RM) $(ROOT)*.js