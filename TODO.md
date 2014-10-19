630 Project 1 TODO List

* how to run stuff in the browser?
* finish adding opcodes to OpCode enum in opcodes.ts
* finish adding opcodes to OpcodesWithArgs in opcodes.ts
* finish opcode implementations in interpret.ts
* compare operations

* get "list[-1]" working -- something wrong with the way the parser reads in ints/longs

* test_builtins doesn't work because for some reason "consts", "names", and "varnames" get mixed up in parsing

### TEST SUITE


### REPORT

functionality:
- simple "if" statement
- simple for loop
- simple while loop
- basic arithmetic for numbers

design approach:
- stack based interpreter based on unpyc, byterun, and CPython

results:
- show what output we get in the browser