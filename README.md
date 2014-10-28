TyPy
=========
TyPy is a Python 2.7 bytecode (*.pyc) interpreter for the browser.

Authors: Puja Mishra, Kate Silverstein

# Requirements

* Typescript
* [npm](https://www.npmjs.org/)
* Browser: tested on recent versions of Firefox and Chrome
* Python 2.7 (needed by `make` to compile the test files)

# Running the project

1. Clone the repository and `cd` into the directory:

		git clone https://github.com/k8si/630-proj1.git
		cd 630-proj1/

2. Compile everything:

		npm install
    
3. Open a browser window and the browser's developer tools
4. Open `630-proj1/www/app.html` in your browser
5. Use the "Browse..." button to select and open a *.pyc file (e.g. select a file from 630-proj1/samples)

The output of the interpreter will be displayed in the developer tools Javascript console, and any output directed to standard out will be printed to and embedded in the HTML toward the bottom of the window.

# Running the test suite

Assuming you've already cloned the repository and you're in the top level of 630-proj1:

1. Compile the Python test scripts to bytecode:

		make tests

2. `cd` into the testserver directory and install dependencies:

		cd testserver/
		npm install
    
3. Start the server. (The test server just serves static *.pyc files which we can use to run tests automatically.)

		npm start
    
4. Open a browser window and the browser's developer tools
5. Open `630-proj1/www/test.html` in your browser. The tests will start running automatically.

The output of the tests will be displayed in the HTML page. Note that a test will indicate whether or not it has "passed", but
you can also compare the output printed to the DOM (as well as the Javascript console) to the *.py files located in `testserver/public/data/`




