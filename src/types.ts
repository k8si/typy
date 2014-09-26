/**
 * Created by kate on 9/25/14.
 */

import utils = require('./utils');

export var typechars: string[] = ["O", "N", "F", "T", "S", ".", "i", "I", "f", "g", "x", "y", "l", "s", "t", "R", "u", "(", "[", "{", ">", "c"];

var td = new utils.Dict<string>();
td.add("S", "STOPITER");
td.add("F", "FALSE");
td.add("T", "TRUE");
td.add("s", "STRING");

export var typeDict = td;

//export class Type {
//    public char: string;
//    public name: string;
////    public byteCount: number;
//    constructor(char:string, name:string){
//        this.char = char;
//        this.name = name;
////        this.byteCount = byteCount;
//    }
//    toString(): string {
//        return this.name + " " + " [" + this.char + "]";
//    }
//}
//
//export class StringType extends Type {
//    public byteCount: number;
//    constructor(char:string, name:string) {
//        super(char, name);
//    }
//    setBytecount(bytes: number): void { this.byteCount = bytes; }
//}
//
//var typeDict = new utils.Dict<Type>();
//typeDict.add("S", new Type("S", "TYPE_STOPITER"));
//typeDict.add("s", new StringType("s", "TYPE_STRING"));
////typeDict.add("F", new Type("F", "TYPE_FALSE", -1));
////typeDict.add("T", new Type("T", "TYPE_TRUE", -1));
////typeDict.add(".", new Type(".", "TYPE_ELLIPSIS", -1));
////typeDict.add("i", new Type("i", "TYPE_INT", -1));
////typeDict.add("I", new Type("i", "TYPE_INT64", -1));
////typeDict.add("f", new Type("f", "TYPE_FLOAT", -1));
////typeDict.add("l", new Type("l", "TYPE_LONG", -1));
////typeDict.add("s", new Type("s", "TYPE_STRING", -1));
////
//export var type_dict = typeDict;