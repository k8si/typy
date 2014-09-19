CMPSCI 630 Project 1
=========

A Python interpreter written in TypeScript

# Useful Links
## Python Interpreter
* [manually compile python scripts to bytecode](https://docs.python.org/2/library/compileall.html)
* [python "dis" module](https://docs.python.org/2/library/dis.html)
* [brief overview of the python interpreter](https://akaptur.github.io/blog/2013/11/15/introduction-to-the-python-interpreter/)
* [StackOverflow on the python interpreter](https://stackoverflow.com/questions/3299648/python-compilation-interpretation-process)
* [old overview of the structure of .pyc files](http://nedbatchelder.com/blog/200804/the_structure_of_pyc_files.html)
* [byteplay](https://wiki.python.org/moin/ByteplayDoc)

## TypeScript
* [importing node modules with TypeScript](https://stackoverflow.com/questions/18378503/importing-node-modules-with-typescript)

### Using external modules
Node:
* download [node.d.ts](https://github.com/borisyankov/DefinitelyTyped/blob/master/node/node.d.ts)
* add to the top of your file:
	/// <reference path="node.d.ts" />
* run `tsc foo.ts --module "commonjs"`
