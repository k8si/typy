# Compilation

compile for the browser: `tsc src/[source].ts --module amd`
compile for node: `tsc src/[source].ts --module commonjs`

run with node: `node [source].js`

# Useful Links

## General Interpreters
* [How to Write A Lisp Interpreter In Python](http://norvig.com/lispy.html)
* [paper on the Smalltalk bytecode interpreter](http://smalltalk.gnu.org/files/vmimpl.pdf)
* [Go to Javascript compiler](https://github.com/gopherjs/gopherjs)


## Python Interpreter
* [UnPyc](http://sourceforge.net/projects/unpyc/) -- this is the most useful thing I've found so far
* [marshall format](http://daeken.com/2010-02-20_Python_Marshal_Format.html)
* [The Python Interpreter Is And Not At All Terrifying: Opcodes](http://www.slideshare.net/alexgolec/python-opcodes)
* [bytecodehacks](http://sourceforge.net/projects/bytecodehacks/) -- we should basically port this into TypeScript (everything is of course out of date, this was written for ~Python 1.5.2)
* [manually compile python scripts to bytecode](https://docs.python.org/2/library/compileall.html)
* [python "dis" module](https://docs.python.org/2/library/dis.html)
* [brief overview of the python interpreter](https://akaptur.github.io/blog/2013/11/15/introduction-to-the-python-interpreter/)
* [StackOverflow on the python interpreter](https://stackoverflow.com/questions/3299648/python-compilation-interpretation-process)
* [old overview of the structure of .pyc files](http://nedbatchelder.com/blog/200804/the_structure_of_pyc_files.html)
* [byteplay](https://wiki.python.org/moin/ByteplayDoc)
* [byterun](https://github.com/nedbat/byterun/tree/master/byterun)

## TypeScript
* [importing node modules with TypeScript](https://stackoverflow.com/questions/18378503/importing-node-modules-with-typescript)
* [Typescript tutorial] http://www.typescriptlang.org/Tutorial 

### TypeScript modules
* [DefinitelyTyped](https://github.com/georgiosd/DefinitelyTyped)
* [Underscore](http://underscorejs.org/) - functional programming
* [TypeScript Collections](https://github.com/basarat/typescript-collections) - I can't figure how how to get this to work


## In the Browser
* [upload file using Express and node.js](https://stackoverflow.com/questions/23691194/node-express-file-upload)
* [Express guide](http://expressjs.com/guide.html)
* [BrowserFS](https://github.com/jvilk/BrowserFS)

## Testing
* [Karma](http://karma-runner.github.io/0.12/index.html)
* [Jasmine](http://jasmine.github.io/2.0/introduction.html)

