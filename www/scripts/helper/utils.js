/*
Basically stolen from https://github.com/basarat/typescript-collections (because I haven't been able to get the module to work with Node)

TODO if we're actually gonna use any of these, need to catch errors, test, etc.
 */
define(["require", "exports"], function (require, exports) {
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
        Dict.prototype.update = function (d) {
            var k = d.keys();
            var v = d.values();
            for (var i = 0; i < k.length; i++) {
                this.add(k[i], v[i]);
            }
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
});
