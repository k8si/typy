/*
Basically stolen from https://github.com/basarat/typescript-collections (because I haven't been able to get the module to work with Node)
TODO if we're actually gonna use any of these, need to catch errors, test, etc.
*/
//interface IDict {
//    add(key: string, value: any): void;
//    remove(key: string): void;
//    contains(key: string): boolean;
//    keys(): string[];
//    values(): any[];
//    get(key: string): any;
//    size(): number;
//}
var Dict = (function () {
    function Dict() {
        this._keys = new Array();
        this._values = new Array();
    }
    // FIXME should throw exception if we try to add a key that's already in the dict
    Dict.prototype.add = function (key, value) {
        this._keys.push(key);
        this._values.push(value);
    };

    Dict.prototype.remove = function (key) {
        var idx = this._keys.indexOf(key, 0);
        this._keys.splice(idx, 1);
        this._values.splice(idx, 1);
    };

    /* FIXME better implementation for this? Why doesn't "in" work? */
    Dict.prototype.contains = function (key) {
        var result = false;
        if (this._keys.indexOf(key) >= 0)
            result = true;
        return result;
    };

    Dict.prototype.keys = function () {
        return this._keys;
    };
    Dict.prototype.values = function () {
        return this._values;
    };

    Dict.prototype.get = function (key) {
        if (this.contains(key)) {
            var idx = this._keys.indexOf(key, 0);
            return this._values[idx];
        }
        return undefined;
    };

    Dict.prototype.size = function () {
        return this._keys.length;
    };
    return Dict;
})();
exports.Dict = Dict;

//interface IMap {
//    add(key: string, value: any): void;
//    remove(key: string): void;
//    contains(key: string): boolean;
//    keys(): string[];
//    values(): any[];
//    get(key: string): any;
//    size(): number;
//}
var Map = (function () {
    function Map() {
        this._keys = new Array();
        this._values = new Array();
    }
    Map.prototype.add = function (key, value) {
        if (this.contains(key)) {
            console.log("invalid: duplicate key");
            return;
        }
        this._keys.push(key);
        this._values.push(value);
    };

    // TODO I have no idea if this actually works
    Map.prototype.remove = function (key) {
        var idx = this._keys.indexOf(key, 0);
        this._keys.splice(idx, 1);
        this._values.splice(idx, 1);
    };

    Map.prototype.contains = function (key) {
        var result = false;
        if (this._keys.indexOf(key) >= 0)
            result = true;
        return result;
    };

    Map.prototype.keys = function () {
        return this._keys;
    };
    Map.prototype.values = function () {
        return this._values;
    };

    Map.prototype.get = function (key) {
        if (this.contains(key)) {
            var idx = this._keys.indexOf(key, 0);
            return this._values[idx];
        }
        return undefined;
    };

    Map.prototype.size = function () {
        return this._keys.length;
    };
    return Map;
})();
exports.Map = Map;

var Stack = (function () {
    function Stack() {
        this.list = new Array();
        this.idx = 0;
    }
    Stack.prototype.push = function (elem) {
        this.list[this.idx] = elem;
        this.idx += 1;
    };
    Stack.prototype.pop = function () {
        if (this.idx <= 0)
            return undefined;
        var result = this.list[this.idx];
        this.list[this.idx] = undefined;
        this.idx = this.idx - 1;
        return result;
    };
    Stack.prototype.toString = function () {
        var s = "";
        for (var i = 0; i < this.idx; i++) {
            s = s + this.list[i].toString() + " ";
        }
        return s;
    };
    return Stack;
})();
exports.Stack = Stack;

/* some helper functions stolen from doppio and StackOverflow */
function bytestr_to_array(bytecode_string) {
    var rv = [];
    for (var i = 0; i < bytecode_string.length; i++) {
        rv.push(bytecode_string.charCodeAt(i) & 0xFF);
        rv.push(bytecode_string.charCodeAt(i));
    }
    return rv;
}
exports.bytestr_to_array = bytestr_to_array;

function byte2str(byte) {
    var s = byte <= 0x7f ? byte === 0x25 ? "%25" : String.fromCharCode(byte) : "%" + byte.toString(16).toUpperCase();
    return decodeURIComponent(s);
}
exports.byte2str = byte2str;

function byteArrayToUTF8(byteArray) {
    var str = '';
    for (var i = 0; i < byteArray.length; i++)
        str += byteArray[i] <= 0x7F ? byteArray[i] === 0x25 ? "%25" : String.fromCharCode(byteArray[i]) : "%" + byteArray[i].toString(16).toUpperCase();
    return decodeURIComponent(str);
}
exports.byteArrayToUTF8 = byteArrayToUTF8;
;

function utf8toByteArray(str) {
    var byteArray = [];
    for (var i = 0; i < str.length; i++)
        if (str.charCodeAt(i) <= 0x7F)
            byteArray.push(str.charCodeAt(i));
        else {
            var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
            for (var j = 0; j < h.length; j++)
                byteArray.push(parseInt(h[j], 16));
        }
    return byteArray;
}
exports.utf8toByteArray = utf8toByteArray;
;

function bytes2str(bytes, null_terminate) {
    var y;
    var z;
    var idx = 0;
    var rv = '';
    while (idx < bytes.length) {
        var x = bytes[idx++] & 0xff;

        //            if (null_terminate && x == 0) {
        //                break;
        //            }
        rv += String.fromCharCode(x <= 0x7f ? x : x <= 0xdf ? (y = bytes[idx++], ((x & 0x1f) << 6) + (y & 0x3f)) : (y = bytes[idx++], z = bytes[idx++], ((x & 0xf) << 12) + ((y & 0x3f) << 6) + (z & 0x3f)));
    }
    return rv;
}
exports.bytes2str = bytes2str;

function byteArray2Buffer(bytes, offset, len) {
    if (typeof offset === "undefined") { offset = 0; }
    if (typeof len === "undefined") { len = bytes.length; }
    var buff = new Buffer(len), i;
    for (i = 0; i < len; i++) {
        buff.writeInt32LE(bytes[offset + i], i);
    }
    return buff;
}
exports.byteArray2Buffer = byteArray2Buffer;
