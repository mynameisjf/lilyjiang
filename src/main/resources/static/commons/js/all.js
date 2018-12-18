if (!window._EBP_JS) {
    window.EJS = {
        cssPrefix: "ebp-ui",
        comRoot: "ComOrg",
        gridDefSearchExp: "like",
        gridAdvSearchExp: "like",
        gridLazyLoad: false
    };
    window._EBP_JS = EJS
} (function($, _EBP_JS) {
    var _basePath = "";
    function _typeOf(o) {
        var dataType = typeof(o) == "object" ? Object.prototype.toString.call(o) : typeof(o);
        switch (dataType) {
            case "[object Array]":
                return "array";
            case "[object Object]":
                return "object";
            case "[object Date]":
                return "date";
            default:
                return dataType
        }
    }
    function _toString(o) {
        var arr = [];
        var isArr = _typeOf(o) == "array";
        var fmt = function(s) {
            if (typeof s == "object" && s != null) {
                return _toString(s)
            }
            return /^(string)$/.test(typeof s) ? '"' + s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\"/g, '\\"') + '"': s
        };
        switch (_typeOf(o)) {
            case "array":
                isArr = true;
                break;
            case "object":
                isArr = false;
                break;
            case "date":
                return fmt(o.toString());
            case "function":
                return "'function'";
            default:
                return fmt(o)
        }
        for (var i in o) {
            if (isArr) {
                arr.push(fmt(o[i]))
            } else {
                arr.push('"' + i + '":' + fmt(o[i]))
            }
        }
        return isArr ? ("[" + arr.join(",") + "]") : ("{" + arr.join(",") + "}")
    }
    function _urlSerialize(json) {
        var ss = "";
        if (_isEmpty(json)) {
            json = ""
        }
        if (_typeOf(json) == "object") {
            $.each(json,
                function(k, v) {
                    if (_isEmpty(v)) {
                        v = ""
                    }
                    if (_typeOf(v) == "object") {
                        $.each(v,
                            function(k1, v1) {
                                if (_isEmpty(v1)) {
                                    v1 = ""
                                }
                                ss += "&" + k + "." + k1 + "=" + encodeURIComponent(v1)
                            })
                    } else {
                        if (_typeOf(v) == "array") {
                            $.each(v,
                                function(i, v1) {
                                    if (_isEmpty(v1)) {
                                        v1 = ""
                                    }
                                    ss += "&" + k + "=" + encodeURIComponent(v1)
                                })
                        } else {
                            ss += "&" + k + "=" + encodeURIComponent(v)
                        }
                    }
                })
        }
        return ss.replace(/^\&+/, "")
    }
    var _ajax_num = 0;
    var _ajax_backdrop = false;
    $.ajaxSetup({
        error: function(xhr, sta, err) {
            if (xhr.status == 1000) {
                if (self.location.href.indexOf("/u/a/login.do") == -1 && self.location.href.indexOf("/u/a/logout.do") == -1) {
                    _EBP_JS.messageDialog({
                        title: "提醒",
                        width: "300px",
                        content: "<p style='font-size: 14px;padding: 15px;'>登录超时，请点击此处 <a href=" + _EBP_JS.basePath() + "'/u/a/login.do' target='_blank' style='text-decoration:underline;color:#0000ff'>重新登录</a></p>",
                        ready: function($d) {
                            $d.find("a").click(function() {
                                _EBP_JS.messageDialog("close")
                            })
                        }
                    })
                }
                return
            }
            if (xhr.status == 200 && xhr.responseText) {
                alert(xhr.responseText)
            } else {
                if (xhr.status == 0) {} else {
                    alert("系统错误：" + sta + " - " + err)
                }
            }
        }
    });
    function _ajax(options) {
        var options = $.extend({
                type: "POST",
                async: "true",
                dataType: "json",
                backdrop: true
            },
            options);
        var _beforeSend = options.beforeSend;
        options.beforeSend = function(xhr) {
            if (!_ajax_backdrop) {
                _EBP_JS.showMask("请稍后...");
                _ajax_backdrop = true
            }
            _ajax_num++;
            if (_beforeSend) {
                _beforeSend(xhr)
            }
        };
        var _complete = options.complete;
        options.complete = function(xhr, ts) {
            _ajax_num--;
            if (_ajax_backdrop) {
                _EBP_JS.showMask(false);
                _ajax_backdrop = false
            }
            if (_complete) {
                _complete(xhr, ts)
            }
        };
        if (!options.backdrop) {
            _ajax_backdrop = true
        }
        $.ajax(options)
    }
    function _ajaxMessage(data, title) {
        var title = title || "";
        if (data) {
            if (data.error || !data.success) {
                if (data.message) {
                    alert(title + data.message)
                } else {
                    if (_typeOf(data.error) == "string") {
                        alert(title + data.error)
                    }
                }
            }
        } else {
            alert(title + "程序错误，返回值传输有误")
        }
    }
    function _closeWindow() {
        try {
            window.open("", "_parent", "");
            window.close();
            if (window) {
                window.location = "about:blank"
            }
        } catch(e) {
            window.location = "about:blank"
        }
    }
    function _windowView() {
        var e = window,
            a = "inner";
        if (! ("innerWidth" in window)) {
            a = "client";
            e = document.documentElement || document.body
        }
        return {
            width: e[a + "Width"],
            height: e[a + "Height"]
        }
    }
    function _getValue(o, k, d) {
        var d = arguments.length >= 2 ? d: undefined;
        if (!k || !o) {
            return d
        }
        try {
            if (_typeOf(k) == "array") {
                var v = {};
                for (var i = 0; i < k.length; i++) {
                    _setValue(v, k[i], _getValue(o, k[i]))
                }
                return v
            }
            var k = k.split(".");
            var v = o[k[0]];
            for (var i = 1; i < k.length; i++) {
                v = v[k[i]]
            }
            if (typeof v == "undefined") {
                v = d
            }
            return v
        } catch(e) {
            return d
        }
    }
    function _setValue(o, k, v) {
        if (!k || !o) {
            return
        }
        if (_typeOf(k) == "object") {
            if (v == true) {
                $.extend(true, o, k)
            } else {
                $.extend(o, k)
            }
        } else {
            var k = _EBP_JS.isArray(k) ? k: k.split(".");
            var i = 0;
            var _set = function(_o, _v) {
                if (i < k.length - 1) {
                    if (_typeOf(_o[k[i]]) != "object") {
                        _o[k[i]] = {}
                    }
                    i++;
                    _set(_o[k[i - 1]], _v)
                } else {
                    _o[k[i]] = _v
                }
            };
            _set(o, v)
        }
    }
    function _getListValue(objList, key, joinStr) {
        if (_typeOf(objList) == "array") {
            var r = [];
            $.each(objList,
                function(i, dd) {
                    r.push(_getValue(dd, key, ""))
                });
            if (typeof joinStr == "boolean" && joinStr == true) {
                return r
            } else {
                if (arguments.length < 3) {
                    joinStr = ","
                }
                return r.join(joinStr)
            }
        } else {
            return _getValue(objList, key, "")
        }
    }
    function _isEmpty(o) {
        if (o === "" || o == null || typeof o == "undefined") {
            return true
        }
        if (_typeOf(o) == "array" && o.length == 0) {
            return true
        }
        if (_typeOf(o) == "object") {
            for (var k in o) {
                return false
            }
            return true
        }
        return false
    }
    function _trim(str, ch) {
        if (!ch) {
            ch = " "
        }
        return str.replace(new RegExp("^" + ch + "+|" + ch + "+$", "gi"), "")
    }
    function _trimRepeat(str, ch) {
        if (!ch) {
            ch = " "
        }
        return str.replace(new RegExp(ch + ch + "+", "gi"), ch).replace(new RegExp("^" + ch + "+|" + ch + "+$", "gi"), "")
    }
    function _getRandomNum(numLength) {
        var multiplier = Math.pow(10, numLength);
        return ((1 + Math.random()) * multiplier + "").substr(1, numLength)
    }
    function _getRandomChars(len) {
        var arrChars = ["2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "K", "L", "M", "N", "P", "Q", "R", "S", "U", "V", "W", "X", "Y", "Z", "a", "b", "d", "e", "f", "g", "h", "i", "j", "k", "n", "p", "q", "r", "s", "t", "u", "v", "x", "y", "z", "J", "T", "c", "m", "w"];
        var arr = [];
        for (var i = 0; i < len; i++) {
            arr.push(arrChars[(parseInt(Math.random() * 56))])
        }
        return arr.join("")
    }
    function _format(value, formatter, digiNum) {
        if (_EBP_JS.isDate(value)) {
            return formatDate(value, formatter)
        } else {
            if (_EBP_JS.isNumber(formatter) && _EBP_JS.isCNum(value)) {
                return formatNumber(value, formatter)
            } else {
                if (formatter == "CNY") {
                    return formatCurrency(value)
                } else {
                    if (formatter == ",") {
                        return formatNumber2(value, digiNum)
                    } else {
                        return value
                    }
                }
            }
        }
    }
    function formatDate(date, formattor) {
        var str = formattor;
        var Week = ["日", "一", "二", "三", "四", "五", "六"];
        var Week2 = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        var Week3 = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        str = str.replace(/yyyy|YYYY/, date.getFullYear());
        str = str.replace(/yy|YY/, (date.getYear() % 100) > 9 ? (date.getYear() % 100).toString() : "0" + (date.getYear() % 100));
        str = str.replace(/MM/, (date.getMonth() + 1) > 9 ? (date.getMonth() + 1).toString() : "0" + (date.getMonth() + 1));
        str = str.replace(/M/g, date.getMonth() + 1);
        str = str.replace(/www|WWW/gi, Week3[date.getDay()]);
        str = str.replace(/ww|WW/gi, Week2[date.getDay()]);
        str = str.replace(/w|W/gi, Week[date.getDay()]);
        str = str.replace(/dd|DD/, date.getDate() > 9 ? date.getDate().toString() : "0" + date.getDate());
        str = str.replace(/d|D/g, date.getDate());
        str = str.replace(/hh|HH/, date.getHours() > 9 ? date.getHours().toString() : "0" + date.getHours());
        str = str.replace(/h|H/g, date.getHours());
        str = str.replace(/mm/, date.getMinutes() > 9 ? date.getMinutes().toString() : "0" + date.getMinutes());
        str = str.replace(/m/g, date.getMinutes());
        str = str.replace(/ss|SS/, date.getSeconds() > 9 ? date.getSeconds().toString() : "0" + date.getSeconds());
        str = str.replace(/s|S/g, date.getSeconds());
        return str
    }
    function formatCurrency(currencyDigits) {
        var MAXIMUM_NUMBER = 99999999999.99;
        var CN_ZERO = "零";
        var CN_ONE = "壹";
        var CN_TWO = "贰";
        var CN_THREE = "叁";
        var CN_FOUR = "肆";
        var CN_FIVE = "伍";
        var CN_SIX = "陆";
        var CN_SEVEN = "柒";
        var CN_EIGHT = "捌";
        var CN_NINE = "玖";
        var CN_TEN = "拾";
        var CN_HUNDRED = "佰";
        var CN_THOUSAND = "仟";
        var CN_TEN_THOUSAND = "万";
        var CN_HUNDRED_MILLION = "亿";
        var CN_SYMBOL = "人民币";
        var CN_DOLLAR = "元";
        var CN_TEN_CENT = "角";
        var CN_CENT = "分";
        var CN_INTEGER = "整";
        var integral;
        var decimal;
        var outputCharacters;
        var parts;
        var digits, radices, bigRadices, decimals;
        var zeroCount;
        var i, p, d;
        var quotient, modulus;
        currencyDigits = currencyDigits.toString();
        if (currencyDigits == "") {
            return ""
        }
        if (currencyDigits.match(/[^,.\d]/) != null) {
            alert("请填写正确的小写金额!");
            return ""
        }
        if ((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
            alert("请填写正确的小写格式!");
            return ""
        }
        currencyDigits = currencyDigits.replace(/,/g, "");
        currencyDigits = currencyDigits.replace(/^0+/, "");
        if (Number(currencyDigits) > MAXIMUM_NUMBER) {
            alert("转换金额过大!");
            return ""
        }
        parts = currencyDigits.split(".");
        if (parts.length > 1) {
            integral = parts[0];
            decimal = parts[1];
            decimal = decimal.substr(0, 2);
            if (decimal == "0" || decimal == "00") {
                decimal = ""
            }
        } else {
            integral = parts[0];
            decimal = ""
        }
        digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
        radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
        bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
        decimals = new Array(CN_TEN_CENT, CN_CENT);
        outputCharacters = "";
        if (Number(integral) > 0) {
            zeroCount = 0;
            for (i = 0; i < integral.length; i++) {
                p = integral.length - i - 1;
                d = integral.substr(i, 1);
                quotient = p / 4;
                modulus = p % 4;
                if (d == "0") {
                    zeroCount++
                } else {
                    if (zeroCount > 0) {
                        outputCharacters += digits[0]
                    }
                    zeroCount = 0;
                    outputCharacters += digits[Number(d)] + radices[modulus]
                }
                if (modulus == 0 && zeroCount < 4) {
                    outputCharacters += bigRadices[quotient]
                }
            }
            outputCharacters += CN_DOLLAR
        }
        if (decimal != "") {
            jiao = decimal.substr(0, 1);
            if (jiao == "") {
                jiao = "0"
            }
            fen = decimal.substr(1, 1);
            if (fen == "") {
                fen = "0"
            }
            if (jiao == "0" && fen == "0") {}
            if (jiao == "0" && fen != "0") {
                outputCharacters += CN_ZERO + digits[Number(fen)] + decimals[1]
            }
            if (jiao != "0" && fen == "0") {
                outputCharacters += digits[Number(jiao)] + decimals[0]
            }
            if (jiao != "0" && fen !== "0") {
                outputCharacters += digits[Number(jiao)] + decimals[0];
                outputCharacters += digits[Number(fen)] + decimals[1]
            }
        }
        if (outputCharacters == "") {
            outputCharacters = CN_ZERO + CN_DOLLAR
        }
        if (decimal == "") {
            outputCharacters += CN_INTEGER
        }
        outputCharacters = outputCharacters;
        return outputCharacters
    }
    function formatNumber(value, num) {
        var _strv;
        var _value = parseFloat(value);
        if (isNaN(_value)) {
            _strv = "0"
        } else {
            _strv = _value.toFixed(num) + ""
        }
        _strv += ".";
        var _arr = _strv.split(".");
        for (var i = _arr[1].length; i < num; i++) {
            _arr[1] += "0"
        }
        return _arr[0] + "." + _arr[1]
    }
    function formatNumber2(value, num) {
        var str = value + "";
        if (_EBP_JS.isNumber(num)) {
            str = _EBP_JS.format(value, num)
        }
        var arr = str.split(".");
        if (arr[0].length < 4) {
            return str
        }
        var str1 = arr[0].replace(/\d{1,3}(?=(\d{3})+$)/g, "$&,");
        if (arr[1]) {
            str1 += "." + arr[1]
        }
        return str1
    }
    function concat(seperator, s1, s2, s3) {
        var s = "";
        for (var i = 1; i < arguments.length; i++) {
            if (!_isEmpty(arguments[i])) {
                if (s != "") {
                    s += seperator
                }
                s += arguments[i]
            }
        }
        return s
    }
    function getUrlParam(name, urlParams) {
        if (!urlParams) {
            urlParams = window.location.search.substr(1)
        }
        if (!urlParams) {
            return ""
        }
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = urlParams.match(reg);
        if (r != null) {
            return decodeURIComponent(r[2])
        }
        return ""
    }
    function setUrlParam(url, name, value) {
        var arr = url.split("?");
        if (!arr[1]) {
            return url + "?" + name + "=" + value
        }
        var params = arr[1];
        var newParams = {};
        if (_EBP_JS.isString(name)) {
            newParams[name] = value
        } else {
            newParams = name
        }
        $.each(newParams,
            function(n, v) {
                var reg = new RegExp("(^|&)" + n + "=");
                if (reg.test(params)) {
                    params = params.replace(new RegExp("(^|&)(" + n + "=)[^&]*(&|$)"), "$1$2" + v + "$3")
                } else {
                    params += "&" + n + "=" + v
                }
            });
        return arr[0] + "?" + params
    }
    function parseDate(dateStr, format) {
        var format = format || "yyyy-MM-dd";
        var date = new Date(2017, 0, 1, 0, 0, 0);
        var re = /-|\/| |:|年|月|日|时|分|秒/;
        var arrD = dateStr.split(re);
        var arrF = format.split(re);
        var _hh = false;
        for (var i = 0; i < arrF.length; i++) {
            if (!arrD[i]) {
                continue
            }
            var val = parseInt(arrD[i], 10);
            switch (arrF[i]) {
                case "yyyy":
                case "yy":
                    date.setYear(val);
                    break;
                case "MM":
                case "M":
                    date.setMonth(val - 1);
                    break;
                case "dd":
                case "d":
                    date.setDate(val);
                    break;
                case "hh":
                case "h":
                    date.setHours(val);
                    _hh = true;
                    break;
                case "mm":
                case "m":
                    if (_hh) {
                        date.setMinutes(val)
                    } else {
                        date.setMonth(val - 1)
                    }
                    break;
                case "ss":
                case "s":
                    date.setSeconds(val);
                    break
            }
        }
        return date
    }
    $.extend(_EBP_JS, {
        basePath: function(s) {
            if (arguments.length > 0) {
                _basePath = s
            } else {
                return _basePath
            }
        },
        stringify: function(o) {
            return _toString(o)
        },
        toObject: function(str, def) {
            if (!def) {
                def = {}
            }
            if (!str) {
                return def
            }
            try {
                return eval("(" + str + ")") || def
            } catch(e) {
                return def
            }
        },
        dataType: function(o) {
            return _typeOf(o)
        },
        urlSerialize: function(o) {
            return _urlSerialize(o)
        },
        closeWindow: function() {
            _closeWindow()
        },
        windowView: function() {
            return _windowView()
        },
        ajax: function(options) {
            _ajax(options)
        },
        ajaxMessage: function(data, title) {
            _ajaxMessage(data, title)
        },
        getValue: function(o, k, s) {
            return _getValue(o, k, s)
        },
        setValue: function(o, k, v) {
            _setValue(o, k, v)
        },
        getListValue: function(o, k, s) {
            return _getListValue(o, k, s)
        },
        isEmpty: function(o) {
            return _isEmpty(o)
        },
        isNotEmpty: function(o) {
            return ! _isEmpty(o)
        },
        trim: function(s, c) {
            return _trim(s, c)
        },
        trimRepeat: function(s, c) {
            return _trimRepeat(s, c)
        },
        trimJson: function(json) {
            var _json = {};
            if (_EBP_JS.isObject(json)) {
                $.each(json,
                    function(k, v) {
                        if (_EBP_JS.isNotEmpty(v)) {
                            _json[k] = v
                        }
                    })
            }
            return _json
        },
        getRandomNum: function(numLength) {
            return _getRandomNum(numLength)
        },
        getRandomChars: function(len) {
            return _getRandomChars(len)
        },
        isCNum: function(x) {
            return ! _isEmpty(x) && !isNaN(x)
        },
        isCInt: function(x) {
            return _EBP_JS.isCNum(x) && (x + "").indexOf(".") < 0
        },
        isCFloat: function(x) {
            return _EBP_JS.isCNum(x) && (x + "").indexOf(".") > -1
        },
        isString: function(x) {
            return _typeOf(x) == "string"
        },
        isBoolean: function(x) {
            return _typeOf(x) == "boolean"
        },
        isNumber: function(x) {
            return _typeOf(x) == "number"
        },
        isDate: function(x) {
            return _typeOf(x) == "date"
        },
        isArray: function(x) {
            return _typeOf(x) == "array"
        },
        isObject: function(x) {
            return _typeOf(x) == "object"
        },
        isInteger: function(x) {
            return _EBP_JS.isNumber(x) && _EBP_JS.isCInt(x)
        },
        isFloat: function(x) {
            return _EBP_JS.isNumber(x) && _EBP_JS.isCFloat(x)
        },
        isFunction: function(x) {
            return _typeOf(x) == "function"
        },
        format: function(value, formatter, digiNum) {
            return _format(value, formatter, digiNum)
        },
        parseDate: function(dateStr, format) {
            return parseDate(dateStr, format)
        },
        concat: function(seperator, s1, s2, s3, s4, s5, s6, s7, s8, s9) {
            return concat(seperator, s1, s2, s3, s4, s5, s6, s7, s8, s9)
        },
        inArray: function(arr, value) {
            if (_EBP_JS.isArray(arr)) {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] == value) {
                        return i
                    }
                }
                return - 1
            }
        },
        isJsonString: function(str) {
            return _EBP_JS.isObject(_EBP_JS.toObject(str))
        },
        isTrue: function(v) {
            return v == true || v == 1 || v == "true"
        },
        openWindow: function(url, width, height) {
            if (!width || width === true) {
                width = window.screen.availWidth
            }
            if (!height || height === true) {
                height = window.screen.availHeight
            }
            if (!isNaN(width)) {
                width = width + "px"
            }
            if (!isNaN(height)) {
                height = height + "px"
            }
            window.open(url, "_blank", "scrollbars=yes,width=" + width + ",height=" + height)
        },
        getUrlParam: function(name, urlParams) {
            return getUrlParam(name, urlParams)
        },
        setUrlParam: function(url, name, value) {
            return setUrlParam(url, name, value)
        }
    })
})(jQuery, _EBP_JS); (function(a, b) {
    if (!b) {
        return
    }
    b.showMask = function(d) {
        var h, c, e, f;
        if (b.dataType(d) == "object") {
            var k = a.extend({
                    show: true,
                    loadingImage: false,
                    backdrop: false,
                    loadingMsg: ""
                },
                d);
            h = k.show,
                c = k.loadingImage,
                e = k.backdrop,
                f = k.loadingMsg
        } else {
            var k = [true, false, false, ""];
            var l = 0;
            for (var j = 0; j < arguments.length; j++) {
                if (typeof arguments[j] == "boolean") {
                    k[l++] = arguments[j]
                } else {
                    k[3] = arguments[j]
                }
            }
            h = k[0],
                c = k[1],
                e = k[2],
                f = k[3];
            if (k[3]) {
                c = true
            }
        }
        var m = a("." + b.cssPrefix + "-body-mask");
        var g = a(document.body);
        if (!h) {
            if (m.size() > 0) {
                m.hide();
                g.removeClass("" + b.cssPrefix + "-mask-show")
            }
            return
        }
        g.addClass("" + b.cssPrefix + "-mask-show");
        if (m.size() == 0) {
            m = a("<div class='" + b.cssPrefix + "-body-mask'><div class='" + b.cssPrefix + "-body-mask-front'></div><div class='" + b.cssPrefix + "-body-mask-back'></div></div>");
            g.append(m)
        }
        if (c) {
            m.find("." + b.cssPrefix + "-body-mask-front").html("<div class='" + b.cssPrefix + "-mask-msg'><div class='" + b.cssPrefix + "-mask-msg-inner'>" + f + "</div></div>")
        } else {
            m.find("." + b.cssPrefix + "-mask-msg").remove()
        }
        if (e) {
            m.unbind("click").click(function() {
                b.showMask(false)
            })
        }
        m.show()
    };
    b.messageDialog = function(c) {
        var e = "_ebp_ui_message_dialog_";
        if (typeof c == "string" && c == "close") {
            a("#" + e).modal("hide");
            return
        }
        var g;
        var c = a.extend({
                backdrop: "static",
                title: "消息提醒",
                content: "&nbsp;",
                width: "650px"
            },
            c);
        var f = function() {
            if (c.title) {
                g.find(".modal-title").empty().append(c.title)
            }
            if (c.content) {
                g.find(".modal-body").empty().append(c.content)
            }
            if (typeof c.ready == "function") {
                g.on("shown.bs.modal",
                    function(h) {
                        c.ready(g)
                    })
            }
        };
        g = a("#" + e);
        if (g.size() > 0) {
            g.off("shown.bs.modal")
        } else {
            var d = '<div id="' + e + '" class="modal fade" data-backdrop="' + c.backdrop + '"><div class="modal-dialog ' + b.cssPrefix + '-dialog" style="width:' + c.width + '"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title"></h4></div><div class="modal-body"></div><div class="modal-footer"></div></div></div></div>';
            g = a(d);
            g.appendTo("body");
            g.on("hiden.bs.modal",
                function(h) {
                    g.find(".modal-title").empty();
                    g.find(".modal-body").empty()
                })
        }
        f();
        g.modal("toggle");
        return g
    };
    b.footPopoverId = "";
    b.footPopover = function(k, j) {
        var r = {
            width: 200,
            height: 150,
            title: "通知",
            content: "通知内容",
            style: "primary",
            href: "",
            mode: "ajaxLoad",
            ready: false,
            timeInterval: 10,
            showTimeOut: 1000,
            hideTimeOut: 0
        };
        if (typeof k == "object") {
            a.extend(r, k)
        } else {
            if (j) {
                r[k] = j
            }
        }
        var o = b.footPopoverId;
        if (!o) {
            o = "fPop" + b.getRandomNum(5) + b.getRandomNum(5);
            b.footPopoverId = o
        }
        var h = a("#" + o);
        if (h.size() == 0) {
            h = a('<div id="' + o + '" class="' + b.cssPrefix + '-foot-popover" style="bottom:-1000px"></div>');
            h.appendTo("body");
            h.append('<div class="panel panel-default"><div class="panel-heading"><span></span><button type="button" class="close"><span>×</span></button></div><div class="panel-body"></div></div>')
        } else {
            h.css({
                bottom: "-1000px"
            })
        }
        h.find("> div.panel").removeClass().addClass("panel panel-" + r.style);
        var p = h.find("> .panel > .panel-heading > span");
        var i = h.find("> .panel > .panel-body");
        p.empty().append(r.title);
        i.empty();
        i.height(r.height);
        i.width(r.width);
        if (r.href) {
            if (r.mode == "iframe") {
                var q = a('<iframe src="' + r.href + '" frameborder="no"></iframe>');
                q.load(function() {
                    if (r.ready) {
                        r.ready(h, p, i)
                    }
                });
                q.appendTo(i)
            } else {
                i.load(r.href,
                    function() {
                        if (r.ready) {
                            r.ready(h, p, i)
                        }
                    })
            }
        } else {
            i.append(r.content);
            if (r.ready) {
                r.ready(h, p, i)
            }
        }
        h.width(i.outerWidth());
        var d = h.height() * -1 - 2;
        h.css({
            bottom: d
        });
        var c = d;
        var g = 0;
        var f = 0;
        var l = r.timeInterval || 10;
        var n = r.showTimeOut || 1000;
        function e() {
            g = window.setInterval(function() {
                    if (f) {
                        window.clearInterval(f)
                    }
                    if (c < 0) {
                        c += 1;
                        h.css("bottom", c)
                    } else {
                        if (g) {
                            window.clearInterval(g);
                            g = 0;
                            setTimeout(function() {
                                    if (!f) {
                                        m()
                                    }
                                },
                                n)
                        }
                    }
                },
                l)
        }
        function m() {
            if (g) {
                window.clearInterval(g);
                g = 0
            }
            f = window.setInterval(function() {
                    if (c > d) {
                        c -= 1;
                        h.css("bottom", c)
                    } else {
                        if (f) {
                            window.clearInterval(f);
                            f = 0;
                            if (r.hideTimeOut) {
                                setTimeout(function() {
                                        e()
                                    },
                                    r.hideTimeOut)
                            }
                        }
                    }
                },
                l)
        }
        h.find("> .panel > .panel-heading > .close").click(function() {
            m()
        });
        e()
    };
    b.ajaxCheckLogin = function(c) {
        if (typeof(c) == "string" && c.indexOf("<form ") > -1) {
            b.messageDialog({
                title: "提醒",
                width: "300px",
                content: "<p style='font-size: 14px;padding: 15px;'>登录超时，请点击此处 <a href=" + b.basePath() + "'/u/a/login.do' target='_blank' style='text-decoration:underline;color:#0000ff'>重新登录</a></p>",
                ready: function(d) {
                    d.find("a").click(function() {
                        b.messageDialog("close")
                    })
                }
            });
            return false
        }
        return true
    }
})(jQuery, _EBP_JS); (function(j, l) {
    if (!l) {
        return
    }
    if (!l.Dialog) {
        l.Dialog = {}
    }
    j(document).off("hidden.bs.modal", ".modal").on("hidden.bs.modal", ".modal",
        function() {
            if (j(document.body).find("div.modal-backdrop").size() == 0) {
                j(document.body).removeClass("modal-open")
            }
        });
    var r = "/oa/service/comorg/getOrgChildren.do";
    var q = "/oa/service/comorg/getPersonList.do";
    var f = "/oa/service/comorg/getOrgAllChildren.do";
    var i = "/oa/service/comorg/getOrgPositions.do";
    var m;
    var p = 1000;
    var d = 0;
    var e = {};
    var a = null;
    var k = {
        x: 0,
        y: 0
    };
    var b = {};
    j(document).on("mouseup",
        function(t) {
            if (a != null) {
                a.css({
                    cursor: "default"
                });
                if (a.position().top < 0) {
                    a.css({
                        top: "0px"
                    })
                }
                a = null;
                k = {
                    x: 0,
                    y: 0
                }
            }
        }).on("mousemove",
        function(t) {
            if (a != null) {
                a.css({
                    top: b.top + t.pageY - k.y,
                    left: b.left + t.pageX - k.x
                })
            }
        });
    function o(t) {
        var y;
        var t = j.extend({
                backdrop: "static",
                title: "&nbsp;",
                content: "&nbsp;",
                width: "650px",
                forceInit: true,
                noFooter: false,
                singleButton: false
            },
            t);
        if (l.dataType(t.buttonsLabel) != "array") {
            t.buttonsLabel = ["关 闭", "确 定"]
        } else {
            if (!t.buttonsLabel[0]) {
                t.buttonsLabel[0] = "关 闭"
            }
            if (!t.buttonsLabel[1]) {
                t.buttonsLabel[1] = "确 定"
            }
        }
        var v = "_ebp_dialog_";
        var w = t.noFooter || !t.success;
        var x = function() {
            if (t.title) {
                y.find(".modal-title").empty().append(t.title)
            }
            if (t.content) {
                y.find(".modal-body").empty().append(t.content)
            }
            y.on("shown.bs.modal",
                function(A) {
                    d++;
                    if (typeof t.ready == "function") {
                        t.ready(y)
                    }
                });
            y.on("hidden.bs.modal",
                function(A) {
                    d--;
                    if (d > 0) {
                        y.data("bs.modal").setScrollbar();
                        y.data("bs.modal").$body.addClass("modal-open")
                    }
                });
            if (typeof t.success == "function") {
                y.find(".btn-primary,." + l.cssPrefix + "-success").unbind("click").click(function() {
                    var A = t.success(y);
                    if (! (typeof A == "boolean" && A == false)) {
                        y.modal("hide")
                    }
                })
            }
        };
        if (t.key) {
            v += t.key;
            y = j("#" + v);
            if (y.size() > 0) {
                y.off("shown.bs.modal");
                y.off("hidden.bs.modal");
                if (t.forceInit) {
                    x()
                }
                y.modal("show");
                if (t.backdrop) {
                    y.data("bs.modal").$backdrop.css("z-index", p++)
                }
                y.data("bs.modal").$element.css("z-index", p);
                y.data("bs.modal").$element.find(".modal-dialog").css("z-index", p++);
                return y
            }
        } else {
            v += (new Date()).getTime()
        }
        var z = "";
        if (l.isArray(t.footbar)) {
            w = true;
            z += '<div class="modal-footer">';
            j.each(t.footbar,
                function() {
                    z += '<button type="button" class="btn ' + l.getValue(this, "clsName", "btn-default") + '">' + (this.iconCls ? ('<i class="' + this.iconCls + '"></i>') : "") + l.getValue(this, "label", "") + "</button>"
                });
            z += "</div>"
        }
        var u = '<div id="' + v + '" class="modal fade" data-backdrop="' + t.backdrop + '"><div class="modal-dialog ' + l.cssPrefix + '-dialog" style="width:' + t.width + '"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title"></h4></div><div class="modal-body"></div>' + (w ? z: ('<div class="modal-footer">' + (t.singleButton ? "": '<button type="button" class="btn btn-default" data-dismiss="modal">' + t.buttonsLabel[0] + "</button>") + (typeof t.success == "function" ? '<button type="button" class="btn ' + (t.singleButton ? "btn-default": "btn-primary") + " " + l.cssPrefix + '-success">' + t.buttonsLabel[1] + "</button>": "") + "</div>")) + "</div></div></div>";
        y = j(u);
        y.appendTo("body");
        x();
        y.modal("show");
        if (t.backdrop) {
            y.data("bs.modal").$backdrop.css("z-index", p++)
        }
        y.data("bs.modal").$element.css("z-index", p);
        y.data("bs.modal").$element.find(".modal-dialog").css("z-index", p++);
        j(".modal-header", y).on("mousedown",
            function(A) {
                a = j(this).closest(".modal-dialog");
                k = {
                    x: A.pageX,
                    y: A.pageY
                };
                b = a.position();
                a.css({
                    cursor: "move"
                })
            });
        return y
    }
    function s(E) {
        var G = j.extend({
                key: "",
                backdrop: "static",
                rootId: l.comRoot,
                rootSelect: true,
                deptLoad: "",
                defaultMyDept: true,
                singleSelect: false,
                setOptions: false,
                moreBacks: ""
            },
            E);
        if (!G.$scope) {
            G.$scope = j("body")
        }
        if (typeof G.setOptions == "function") {
            G.setOptions(G)
        }
        var A = {};
        var D = l.basePath() + r;
        var C = l.basePath() + q;
        if (!G.deptLoad) {
            G.deptLoad = G.rootId
        } else {
            G.defaultMyDept = false
        }
        var B, y, F, t, z, x, w;
        var u = -1;
        var v = "";
        return o({
            key: "psn_sel_" + G.key,
            title: "人员选择",
            content: m.selectPsn,
            backdrop: G.backdrop,
            width: "750px",
            ready: function(H) {
                B = H.find("div[" + l.cssPrefix + "-comp-id='deptTree'] ul");
                y = H.find("div[" + l.cssPrefix + "-comp-id='deptTreeBtns'] .dropdown-menu li");
                F = H.find("div[" + l.cssPrefix + "-comp-id='personList'] table");
                t = H.find("div[" + l.cssPrefix + "-comp-id='personSelected']");
                z = H.find("div[" + l.cssPrefix + "-comp-id='personSelectedBtns']");
                x = H.find(".default-search input:text");
                w = H.find(".default-search .btn");
                B.tree({
                    lines: true,
                    url: D + "?orgId=" + G.rootId + "&getSelf=true",
                    onBeforeExpand: function(I) {
                        B.tree("options").url = D + "?getSelf=false&orgId=" + I.id
                    },
                    onExpand: function(I) {
                        j(I.target).data("tree-expand", true)
                    },
                    onCollapse: function(I) {
                        j(I.target).data("tree-expand", false)
                    },
                    onSelect: function(I) {
                        if (v == I.id) {
                            return
                        }
                        v = I.id;
                        x.val("");
                        F.datagrid("load", {
                            deptId: I.id,
                            myDept: false,
                            backs: G.moreBacks
                        })
                    },
                    onDblClick: function(I) {
                        if (j(I.target).data("tree-expand")) {
                            B.tree("collapse", I.target)
                        } else {
                            B.tree("expand", I.target)
                        }
                    }
                });
                if (G.rootSelect) {
                    y.parent().prev().css("visibility", "visible")
                } else {
                    y.parent().prev().css("visibility", "hidden")
                }
                y.click(function() {
                    var I = B.tree("getRoot");
                    var J = j(this).index();
                    var K = "";
                    if (J == 0 && I.id != l.comRoot) {
                        K = D + "?orgId=" + l.comRoot + "&getSelf=true"
                    } else {
                        if (J == 1 && I.id != l.comRoot) {
                            K = D + "?orgId=" + I.id + "&getSelf=true&getParent=true"
                        } else {
                            if (J == 2 && J != u) {
                                K = D + "?orgId=" + G.deptLoad + "&getSelf=true&myDept=true"
                            }
                        }
                    }
                    if (K) {
                        j.get(K + "&t" + (new Date()).getTime(), "",
                            function(L) {
                                B.tree({
                                    url: null,
                                    data: L
                                });
                                I = B.tree("getRoot");
                                if (I != null) {
                                    B.tree("select", I.target)
                                }
                            })
                    }
                });
                F.datagrid({
                    fit: true,
                    striped: true,
                    rownumbers: true,
                    pageSize: 15,
                    pagination: true,
                    pageList: [5, 15, 30, 50],
                    border: false,
                    singleSelect: G.singleSelect,
                    url: C + "?t" + (new Date()).getTime(),
                    queryParams: {
                        deptId: G.deptLoad,
                        myDept: G.defaultMyDept,
                        backs: G.moreBacks
                    },
                    idField: "id",
                    frozenColumns: [[{
                        field: "id",
                        checkbox: true
                    },
                        {
                            field: "name",
                            title: "姓名",
                            width: 70,
                            align: "center",
                            sortable: true
                        },
                        {
                            field: "unno",
                            title: "工号",
                            width: 70,
                            align: "center",
                            sortable: true
                        }]],
                    columns: [[{
                        field: "positionName",
                        title: "职位",
                        width: 120,
                        align: "center",
                        sortable: true
                    },
                        {
                            field: "departmentName",
                            title: "部门",
                            width: 120,
                            align: "center",
                            sortable: true
                        },
                        {
                            field: "officePhone",
                            title: "办公电话",
                            width: 100,
                            align: "center",
                            sortable: true
                        },
                        {
                            field: "mobile",
                            title: "移动长号",
                            width: 100,
                            align: "center",
                            sortable: true
                        }]],
                    onSelect: function(K, J) {
                        var I = t.find("span[dataId='" + J.id + "']");
                        if (I.size() == 0) {
                            if (G.singleSelect) {
                                t.children().remove();
                                A = {}
                            }
                            t.append("<span dataId='" + J.id + "'>" + J.name + "[" + J.unno + "]</span>");
                            A[J.id] = J
                        }
                    },
                    onUnselect: function(K, J) {
                        var I = t.find("span[dataId='" + J.id + "']");
                        if (I.size() > 0) {
                            I.remove()
                        }
                    },
                    onSelectAll: function(I) {
                        j.each(I,
                            function(L, K) {
                                var J = t.find("span[dataId='" + K.id + "']");
                                if (J.size() == 0) {
                                    t.append("<span dataId='" + K.id + "'>" + K.name + "[" + K.unno + "]</span>");
                                    A[K.id] = K
                                }
                            })
                    },
                    onUnselectAll: function(I) {
                        j.each(I,
                            function(L, K) {
                                var J = t.find("span[dataId='" + K.id + "']");
                                if (J.size() > 0) {
                                    J.remove()
                                }
                            })
                    },
                    onDblClickRow: function(J, I) {
                        if (G.singleSelect) {
                            t.children().remove();
                            A = {};
                            t.append("<span dataId='" + I.id + "'>" + I.name + "[" + I.unno + "]</span>");
                            A[I.id] = I;
                            H.find(".btn-primary").click()
                        }
                    }
                });
                F.datagrid("getPager").pagination({
                    showPageList: false,
                    showRefresh: false
                });
                F.datagrid("resize");
                w.click(function() {
                    var K = x.val().replace(/^ | $/g, "");
                    if (K) {
                        var J = B.tree("getSelected");
                        var I = J == null ? G.rootId: J.id;
                        F.datagrid("load", {
                            searchKey: K,
                            backs: G.moreBacks,
                            deptId: I
                        })
                    }
                });
                x.on("keydown",
                    function(I) {
                        if (I.keyCode == 13) {
                            w.click();
                            I.preventDefault();
                            I.stopPropagation()
                        }
                    });
                t.click(function(J) {
                    var I = j(J.target);
                    if (I.is("span")) {
                        if (I.is(".selected")) {
                            I.removeClass("selected")
                        } else {
                            I.addClass("selected")
                        }
                    }
                });
                z.find("a").click(function() {
                    var N = t.find(".selected");
                    var P = N.size();
                    var M = j(this).index();
                    if (M == 5) {
                        t.find("span:not(.selected)").addClass("selected")
                    } else {
                        if (P == 0) {
                            return
                        }
                    }
                    var O = P == t.find("span").size();
                    if (M == 0 && !O) {
                        var J = N.clone();
                        N.remove();
                        J.insertBefore(t.find("span:first"))
                    } else {
                        if (M == 3 && !O) {
                            var J = N.clone();
                            N.remove();
                            J.insertAfter(t.find("span:last"))
                        } else {
                            if (M == 1 && !O) {
                                N.not(":first-child").each(function() {
                                    var R = j(this).clone();
                                    var Q = j(this).prev();
                                    if (!Q.is(".selected")) {
                                        R.insertBefore(Q);
                                        j(this).remove()
                                    }
                                })
                            } else {
                                if (M == 2 && !O) {
                                    var K = [];
                                    N = N.not(":last-child");
                                    for (var L = N.size() - 1; L >= 0; L--) {
                                        K.push(N[L])
                                    }
                                    for (var L = 0; L < K.length; L++) {
                                        var J = j(K[L]).clone();
                                        var I = j(K[L]).next();
                                        if (!I.is(".selected")) {
                                            J.insertAfter(I);
                                            j(K[L]).remove()
                                        }
                                    }
                                } else {
                                    if (M == 4) {
                                        N.remove();
                                        F.datagrid("clearSelections")
                                    } else {
                                        if (M == 6) {
                                            N.removeClass("selected")
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                H.find("a[href='#']").attr("href", "javascript:void(0)")
            },
            success: function(I) {
                var H = [];
                t.find("span").each(function() {
                    H.push(A[j(this).attr("dataId")])
                });
                if (H.length == 0) {
                    alert("尚未选择任何人员");
                    return false
                }
                if (typeof G.success == "function") {
                    var J = G.success(H);
                    if (l.isBoolean(J) && !J) {
                        return false
                    }
                }
                return true
            }
        })
    }
    function h(A) {
        var C = j.extend({
                key: "",
                backdrop: "static",
                rootId: l.comRoot,
                orgLoad: "",
                orgTreeQuery: {},
                orgListQuery: {},
                singleSelect: false,
                setOptions: false,
                listParent: false
            },
            A);
        if (!C.$scope) {
            C.$scope = j("body")
        }
        if (typeof C.setOptions == "function") {
            C.setOptions(C)
        }
        if (C.listParent) {
            C.orgListQuery.withSelf = true
        }
        var x = {};
        var z = l.basePath() + r;
        if (!C.orgLoad) {
            C.orgLoad = C.rootId
        }
        C.orgTreeQuery.orgId = C.rootId;
        C.orgListQuery.orgId = C.orgLoad;
        var y, B, t, w;
        var u = -1;
        var v = "";
        return o({
            key: "org_sel_" + C.key,
            title: "组织机构选择",
            content: m.selectOrg,
            backdrop: C.backdrop,
            width: "750px",
            ready: function(D) {
                y = D.find("div[" + l.cssPrefix + "-comp-id='deptTree'] ul");
                B = D.find("div[" + l.cssPrefix + "-comp-id='orgList'] table");
                t = D.find("div[" + l.cssPrefix + "-comp-id='orgSelected']");
                w = D.find("div[" + l.cssPrefix + "-comp-id='orgSelectedBtns']");
                y.tree({
                    lines: true,
                    url: z + "?getSelf=true&" + l.urlSerialize(C.orgTreeQuery),
                    onBeforeExpand: function(E) {
                        C.orgTreeQuery.orgId = E.id;
                        y.tree("options").url = z + "?getSelf=false&" + l.urlSerialize(C.orgTreeQuery)
                    },
                    onExpand: function(E) {
                        j(E.target).data("tree-expand", true)
                    },
                    onCollapse: function(E) {
                        j(E.target).data("tree-expand", false)
                    },
                    onSelect: function(E) {
                        if (v == E.id) {
                            return
                        }
                        v = E.id;
                        C.orgListQuery.orgId = E.id;
                        D.find(".org-tree-selected").html(E.text);
                        B.datagrid("load", C.orgListQuery)
                    },
                    onDblClick: function(E) {
                        if (j(E.target).data("tree-expand")) {
                            y.tree("collapse", E.target)
                        } else {
                            y.tree("expand", E.target)
                        }
                    }
                });
                B.datagrid({
                    fit: true,
                    fitColumns: true,
                    striped: true,
                    rownumbers: true,
                    pageSize: 15,
                    pagination: true,
                    pageList: [5, 15, 30, 50],
                    border: false,
                    singleSelect: C.singleSelect,
                    url: l.basePath() + f + "?t" + (new Date()).getTime(),
                    queryParams: C.orgListQuery,
                    idField: "id",
                    toolbar: D.find(".org-tree-selected"),
                    columns: [[{
                        field: "id",
                        checkbox: true
                    },
                        {
                            field: "unno",
                            title: "组织编号",
                            width: 100,
                            align: "center"
                        },
                        {
                            field: "name",
                            title: "组织名称",
                            width: 200,
                            align: "left"
                        }]],
                    onSelect: function(G, F) {
                        var E = t.find("span[dataId='" + F.id + "']");
                        if (E.size() == 0) {
                            if (C.singleSelect) {
                                t.children().remove();
                                x = {}
                            }
                            t.append("<span dataId='" + F.id + "'>" + F.name + "</span>");
                            x[F.id] = F
                        }
                    },
                    onUnselect: function(G, F) {
                        var E = t.find("span[dataId='" + F.id + "']");
                        if (E.size() > 0) {
                            E.remove()
                        }
                    },
                    onSelectAll: function(E) {
                        j.each(E,
                            function(H, G) {
                                var F = t.find("span[dataId='" + G.id + "']");
                                if (F.size() == 0) {
                                    t.append("<span dataId='" + G.id + "'>" + G.name + "</span>");
                                    x[G.id] = G
                                }
                            })
                    },
                    onUnselectAll: function(E) {
                        j.each(E,
                            function(H, G) {
                                var F = t.find("span[dataId='" + G.id + "']");
                                if (F.size() > 0) {
                                    F.remove()
                                }
                            })
                    },
                    onDblClickRow: function(F, E) {
                        if (C.singleSelect) {
                            t.children().remove();
                            x = {};
                            t.append("<span dataId='" + E.id + "'>" + E.name + "</span>");
                            x[E.id] = E;
                            D.find(".btn-primary").click()
                        }
                    }
                });
                B.datagrid("getPager").pagination({
                    showPageList: false,
                    showRefresh: false
                });
                B.datagrid("resize");
                t.click(function(F) {
                    var E = j(F.target);
                    if (E.is("span")) {
                        if (E.is(".selected")) {
                            E.removeClass("selected")
                        } else {
                            E.addClass("selected")
                        }
                    }
                });
                w.find("a").click(function() {
                    var J = t.find(".selected");
                    var L = J.size();
                    var I = j(this).index();
                    if (I == 5) {
                        t.find("span:not(.selected)").addClass("selected")
                    } else {
                        if (L == 0) {
                            return
                        }
                    }
                    var K = L == t.find("span").size();
                    if (I == 0 && !K) {
                        var F = J.clone();
                        J.remove();
                        F.insertBefore(t.find("span:first"))
                    } else {
                        if (I == 3 && !K) {
                            var F = J.clone();
                            J.remove();
                            F.insertAfter(t.find("span:last"))
                        } else {
                            if (I == 1 && !K) {
                                J.not(":first-child").each(function() {
                                    var N = j(this).clone();
                                    var M = j(this).prev();
                                    if (!M.is(".selected")) {
                                        N.insertBefore(M);
                                        j(this).remove()
                                    }
                                })
                            } else {
                                if (I == 2 && !K) {
                                    var G = [];
                                    J = J.not(":last-child");
                                    for (var H = J.size() - 1; H >= 0; H--) {
                                        G.push(J[H])
                                    }
                                    for (var H = 0; H < G.length; H++) {
                                        var F = j(G[H]).clone();
                                        var E = j(G[H]).next();
                                        if (!E.is(".selected")) {
                                            F.insertAfter(E);
                                            j(G[H]).remove()
                                        }
                                    }
                                } else {
                                    if (I == 4) {
                                        J.remove();
                                        B.datagrid("clearSelections")
                                    } else {
                                        if (I == 6) {
                                            J.removeClass("selected")
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                D.find("a[href='#']").attr("href", "javascript:void(0)")
            },
            success: function(E) {
                var D = [];
                t.find("span").each(function() {
                    D.push(x[j(this).attr("dataId")])
                });
                if (D.length == 0) {
                    alert("尚未选择任何组织");
                    return false
                }
                if (typeof C.success == "function") {
                    var F = C.success(D);
                    if (l.isBoolean(F) && !F) {
                        return false
                    }
                }
                return true
            }
        })
    }
    function c(A) {
        var C = j.extend({
                key: "",
                backdrop: "static",
                rootId: l.comRoot,
                orgLoad: "",
                orgTreeQuery: {},
                orgListQuery: {},
                singleSelect: false,
                setOptions: false
            },
            A);
        if (!C.$scope) {
            C.$scope = j("body")
        }
        if (typeof C.setOptions == "function") {
            C.setOptions(C)
        }
        var x = {};
        var z = l.basePath() + r;
        if (!C.orgLoad) {
            C.orgLoad = C.rootId
        }
        C.orgTreeQuery.orgId = C.rootId;
        C.orgListQuery.orgId = C.orgLoad;
        var y, B, t, w;
        var u = -1;
        var v = "";
        return o({
            key: "org_post_sel_" + C.key,
            title: "部门职位选择",
            content: m.selectPost,
            backdrop: C.backdrop,
            width: "750px",
            ready: function(D) {
                y = D.find("div[" + l.cssPrefix + "-comp-id='deptTree'] ul");
                B = D.find("div[" + l.cssPrefix + "-comp-id='orgList'] table");
                t = D.find("div[" + l.cssPrefix + "-comp-id='orgSelected']");
                w = D.find("div[" + l.cssPrefix + "-comp-id='orgSelectedBtns']");
                y.tree({
                    lines: true,
                    url: z + "?getSelf=true&" + l.urlSerialize(C.orgTreeQuery),
                    onBeforeExpand: function(E) {
                        C.orgTreeQuery.orgId = E.id;
                        y.tree("options").url = z + "?getSelf=false&" + l.urlSerialize(C.orgTreeQuery)
                    },
                    onExpand: function(E) {
                        j(E.target).data("tree-expand", true)
                    },
                    onCollapse: function(E) {
                        j(E.target).data("tree-expand", false)
                    },
                    onSelect: function(E) {
                        if (v == E.id) {
                            return
                        }
                        v = E.id;
                        C.orgListQuery.orgId = E.id;
                        D.find(".org-tree-selected").html(E.text);
                        B.datagrid("load", C.orgListQuery)
                    },
                    onDblClick: function(E) {
                        if (j(E.target).data("tree-expand")) {
                            y.tree("collapse", E.target)
                        } else {
                            y.tree("expand", E.target)
                        }
                    }
                });
                B.datagrid({
                    fit: true,
                    fitColumns: true,
                    striped: true,
                    rownumbers: true,
                    pageSize: 15,
                    pagination: true,
                    pageList: [5, 15, 30, 50],
                    border: false,
                    singleSelect: C.singleSelect,
                    url: l.basePath() + i + "?t" + (new Date()).getTime(),
                    queryParams: C.orgListQuery,
                    toolbar: D.find(".org-tree-selected"),
                    idField: "id",
                    columns: [[{
                        field: "id",
                        checkbox: true
                    },
                        {
                            field: "unno",
                            title: "职位编号",
                            width: 100,
                            align: "center"
                        },
                        {
                            field: "name",
                            title: "职位名称",
                            width: 200,
                            align: "center"
                        }]],
                    onSelect: function(G, F) {
                        var E = t.find("span[dataId='" + F.id + "']");
                        if (E.size() == 0) {
                            if (C.singleSelect) {
                                t.children().remove();
                                x = {}
                            }
                            t.append("<span dataId='" + F.id + "'>" + F.name + "</span>");
                            x[F.id] = F
                        }
                    },
                    onUnselect: function(G, F) {
                        var E = t.find("span[dataId='" + F.id + "']");
                        if (E.size() > 0) {
                            E.remove()
                        }
                    },
                    onSelectAll: function(E) {
                        j.each(E,
                            function(H, G) {
                                var F = t.find("span[dataId='" + G.id + "']");
                                if (F.size() == 0) {
                                    t.append("<span dataId='" + G.id + "'>" + G.name + "</span>");
                                    x[G.id] = G
                                }
                            })
                    },
                    onUnselectAll: function(E) {
                        j.each(E,
                            function(H, G) {
                                var F = t.find("span[dataId='" + G.id + "']");
                                if (F.size() > 0) {
                                    F.remove()
                                }
                            })
                    },
                    onDblClickRow: function(F, E) {
                        if (C.singleSelect) {
                            t.children().remove();
                            x = {};
                            t.append("<span dataId='" + E.id + "'>" + E.name + "</span>");
                            x[E.id] = E;
                            D.find(".btn-primary").click()
                        }
                    }
                });
                B.datagrid("getPager").pagination({
                    showPageList: false,
                    showRefresh: false
                });
                B.datagrid("resize");
                t.click(function(F) {
                    var E = j(F.target);
                    if (E.is("span")) {
                        if (E.is(".selected")) {
                            E.removeClass("selected")
                        } else {
                            E.addClass("selected")
                        }
                    }
                });
                w.find("a").click(function() {
                    var J = t.find(".selected");
                    var L = J.size();
                    var I = j(this).index();
                    if (I == 5) {
                        t.find("span:not(.selected)").addClass("selected")
                    } else {
                        if (L == 0) {
                            return
                        }
                    }
                    var K = L == t.find("span").size();
                    if (I == 0 && !K) {
                        var F = J.clone();
                        J.remove();
                        F.insertBefore(t.find("span:first"))
                    } else {
                        if (I == 3 && !K) {
                            var F = J.clone();
                            J.remove();
                            F.insertAfter(t.find("span:last"))
                        } else {
                            if (I == 1 && !K) {
                                J.not(":first-child").each(function() {
                                    var N = j(this).clone();
                                    var M = j(this).prev();
                                    if (!M.is(".selected")) {
                                        N.insertBefore(M);
                                        j(this).remove()
                                    }
                                })
                            } else {
                                if (I == 2 && !K) {
                                    var G = [];
                                    J = J.not(":last-child");
                                    for (var H = J.size() - 1; H >= 0; H--) {
                                        G.push(J[H])
                                    }
                                    for (var H = 0; H < G.length; H++) {
                                        var F = j(G[H]).clone();
                                        var E = j(G[H]).next();
                                        if (!E.is(".selected")) {
                                            F.insertAfter(E);
                                            j(G[H]).remove()
                                        }
                                    }
                                } else {
                                    if (I == 4) {
                                        J.remove();
                                        B.datagrid("clearSelections")
                                    } else {
                                        if (I == 6) {
                                            J.removeClass("selected")
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                D.find("a[href='#']").attr("href", "javascript:void(0)")
            },
            success: function(E) {
                var D = [];
                t.find("span").each(function() {
                    D.push(x[j(this).attr("dataId")])
                });
                if (D.length == 0) {
                    alert("请选择信息");
                    return false
                }
                if (typeof C.success == "function") {
                    var F = C.success(D);
                    if (l.isBoolean(F) && !F) {
                        return false
                    }
                }
                return true
            }
        })
    }
    m = {
        selectPsn: '<table class="person-select"><tr><td><div ' + l.cssPrefix + '-comp-id="deptTreeBtns"><div class="dropdown"><a href="#" data-toggle="dropdown"><span class="glyphicon glyphicon-list"></span>&nbsp;<span ' + l.cssPrefix + '-comp-id="deptLabel"></span>&nbsp;<span class="caret"></span></a><ul class="dropdown-menu"><li><a href="#">根组织</a></li><li><a href="#">上级部门</a></li><li><a href="#">我的部门</a></li></ul></div></div><div ' + l.cssPrefix + '-comp-id="deptTree"><div><ul></ul></div></div></td><td><div class="form-horizontal ' + l.cssPrefix + '-datagrid-toolbar"><div class="form-group"><div class="col-xs-12 ' + l.cssPrefix + '-datagrid-searchbar"><div class="input-group default-search"><input class="form-control" placeholder="姓名/拼音" value=""><span class="input-group-btn"><a class="btn default-search-btn"><i class="glyphicon glyphicon-search"></i></a></span></div></div></div></div><div ' + l.cssPrefix + '-comp-id="personList"><table></table></div></td><td><div ' + l.cssPrefix + '-comp-id="personSelected"></div><div ' + l.cssPrefix + '-comp-id="personSelectedBtns"><a href="#"><span class="glyphicon glyphicon-open"></span></a><a href="#"><span class="glyphicon glyphicon-arrow-up"></span></a><a href="#"><span class="glyphicon glyphicon-arrow-down"></span></a><a href="#"><span class="glyphicon glyphicon-download-alt"></span></a><a href="#"><span class="glyphicon glyphicon-remove"></span></a><a href="#"><span class="glyphicon glyphicon-saved"></span></a><a href="#"><span class="glyphicon glyphicon-share-alt"></span></a></div></td></tr></table>',
        selectOrg: '<table class="org-select"><tr><td><div ' + l.cssPrefix + '-comp-id="deptTree"><div><ul></ul></div></div></td><td><div ' + l.cssPrefix + '-comp-id="orgList"><div class="org-tree-selected"></div><table></table></div></td><td><div ' + l.cssPrefix + '-comp-id="orgSelected"></div><div ' + l.cssPrefix + '-comp-id="orgSelectedBtns"><a href="#"><span class="glyphicon glyphicon-open"></span></a><a href="#"><span class="glyphicon glyphicon-arrow-up"></span></a><a href="#"><span class="glyphicon glyphicon-arrow-down"></span></a><a href="#"><span class="glyphicon glyphicon-download-alt"></span></a><a href="#"><span class="glyphicon glyphicon-remove"></span></a><a href="#"><span class="glyphicon glyphicon-saved"></span></a><a href="#"><span class="glyphicon glyphicon-share-alt"></span></a></div></td></tr></table>',
        selectPost: '<table class="org-select"><tr><td><div ' + l.cssPrefix + '-comp-id="deptTree"><div><ul></ul></div></div></td><td><div ' + l.cssPrefix + '-comp-id="orgList"><div class="org-tree-selected"></div><table></table></div></td><td><div ' + l.cssPrefix + '-comp-id="orgSelected"></div><div ' + l.cssPrefix + '-comp-id="orgSelectedBtns"><a href="#"><span class="glyphicon glyphicon-open"></span></a><a href="#"><span class="glyphicon glyphicon-arrow-up"></span></a><a href="#"><span class="glyphicon glyphicon-arrow-down"></span></a><a href="#"><span class="glyphicon glyphicon-download-alt"></span></a><a href="#"><span class="glyphicon glyphicon-remove"></span></a><a href="#"><span class="glyphicon glyphicon-saved"></span></a><a href="#"><span class="glyphicon glyphicon-share-alt"></span></a></div></td></tr></table>',
        flowConfirm: '<div class="form-horizontal flow-confirm"><div class="form-group"><label class="col-xs-3 control-label">操作类型</label><div class="col-xs-8"><input class="form-control" ' + l.cssPrefix + '-comp-id="operateName" readonly></div></div><div class="form-group" ' + l.cssPrefix + '-comp-id="nextNodeRow"><label class="col-xs-3 control-label">下一处理环节<span></span></label><div class="col-xs-8"><input class="form-control"  ' + l.cssPrefix + '-comp-id="nextNodeName" readonly></div></div><div class="form-group" ' + l.cssPrefix + '-comp-id="nextPersonRow" style="display:none"><label class="col-xs-3 control-label">下一处理人<span></span></label><div class="col-xs-7"><input class="form-control"  ' + l.cssPrefix + '-comp-id="nextPersonName" readonly><input class="form-control" type="hidden" ' + l.cssPrefix + '-comp-id="nextPersonUsername" readonly></div><div class="col-xs-2"><button class="btn btn-info" ' + l.cssPrefix + '-comp-id="authorSelector">选择…</button></div></div><div ' + l.cssPrefix + '-comp-id="commentsAddRow" class="form-group" style="display:none"><label class="col-xs-3 control-label">批示意见(500字以内)</label><div ' + l.cssPrefix + '-comp-id="commentsAdd" class="col-xs-8"><span class="btn btn-link">&nbsp;添加&gt;&gt;</span></div></div><div class="form-group" ' + l.cssPrefix + '-comp-id="flowCommentRow" style="display:none"><label class="col-xs-3 control-label">批示意见</label><div class="col-xs-8"><textarea class="form-control"  ' + l.cssPrefix + '-comp-id="flowComment" rows="3"></textarea></div><div class="col-xs-8 col-xs-offset-3" ' + l.cssPrefix + '-comp-id="tempComments"><span class="submit">同意</span><span class="submit">请执行</span><span class="submit">请批示</span><span class="submit">已执行</span><span class="reject restart">不同意</span><span class="reject restart">返回再议</span><span class="reject restart">修改后再提交</span><span class="reject restart">延后处理</span></div></div><div class="form-group" ' + l.cssPrefix + '-comp-id="flowMessageRow" style="display:none"><label class="col-xs-3 control-label">消息提醒</label><div class="col-xs-8"><input class="form-control"  ' + l.cssPrefix + '-comp-id="flowMessage"></div></div></div>',
        createComm: '<div class="form-horizontal"><input type="hidden" ' + l.cssPrefix + '-comp-id="refId"><input type="hidden" ' + l.cssPrefix + '-comp-id="refKey"><div class="form-group"><label class="col-xs-3 control-label">消息主题</label><div class="col-xs-8"><input class="form-control" ' + l.cssPrefix + '-comp-id="subject"></div></div><div class="form-group"><label class="col-xs-3 control-label">回复人<span></span></label><div class="col-xs-6" ><input class="form-control"  ' + l.cssPrefix + '-comp-id="replierName" readonly><span style="display:none"><input ' + l.cssPrefix + '-comp-id="replierId"></span></div><div class="col-xs-2"><button class="btn btn-info" ' + l.cssPrefix + '-comp-id="replierSelector">选择…</button></div></div><div class="form-group" ' + l.cssPrefix + '-comp-id="contentRow"><label class="col-xs-3 control-label">沟通内容</label><div class="col-xs-8"><textarea class="form-control"  ' + l.cssPrefix + '-comp-id="content" rows="3"></textarea></div></div></div>',
        replyComm: '<div class="form-horizontal comm-reply"><input type="hidden" ' + l.cssPrefix + '-comp-id="id"><div class="form-group"><label class="col-xs-3 control-label">发起人</label><div class="col-xs-6"><input class="form-control" ' + l.cssPrefix + '-comp-id="creatorName" readonly></div><div class="col-xs-2"><span ' + l.cssPrefix + '-comp-id="ref-form" class="btn btn-link">关联业务表单</span></div></div><div class="form-group"><label class="col-xs-3 control-label">主题</label><div class="col-xs-8"><input class="form-control" ' + l.cssPrefix + '-comp-id="subject" readonly></div></div><div class="form-group"><label class="col-xs-3 control-label">沟通内容</label><div class="col-xs-8"><textarea class="form-control" ' + l.cssPrefix + '-comp-id="content" rows="3" readonly></textarea></div></div><div class="form-group"><label class="col-xs-3 control-label">回复内容</label><div class="col-xs-8"><textarea class="form-control"  ' + l.cssPrefix + '-comp-id="replyContent" rows="3"></textarea></div></div></div>'
    };
    var n = {
        modal: function(t) {
            return o(t)
        },
        selectPsn: function(t) {
            return s(t)
        },
        selectOrg: function(t) {
            return h(t)
        },
        selectPost: function(t) {
            return c(t)
        },
        personSelect: function(t) {
            return s(t)
        },
        comorgSelect: function(t) {
            return h(t)
        },
        positionSelect: function(t) {
            return c(t)
        },
        confirm: function(z, x, w, y, u, t) {
            var z = z;
            var x = x;
            var w = w;
            var y = y;
            if (l.isFunction(w)) {
                y = w;
                w = false
            } else {
                if (l.isFunction(x)) {
                    w = false;
                    y = x;
                    x = z;
                    z = "提示"
                } else {
                    if (!x) {
                        w = false;
                        y = false;
                        x = z;
                        z = "提示"
                    }
                }
            }
            var v = j("<p style='font-weight:bold;padding:10px 20px;'></p>");
            v.append(x);
            o({
                title: z,
                width: w || "500px",
                content: v,
                backdrop: u === false ? false: (u || "static"),
                success: y,
                singleButton: t
            })
        },
        HTMLTemplate: m
    };
    var g = function(u, t) {
        if (typeof u == "string") {
            return n[u](t)
        } else {
            var t = u || {};
            return o(t)
        }
    };
    j.extend(l.Dialog, n);
    j.extend(l, {
        dialog: function(u, t) {
            return g(u, t)
        },
        confirm: function(y, w, v, x, u, t) {
            n.confirm(y, w, v, x, u, t)
        },
        message: function(w, u, t, v) {
            n.confirm(w, u, t, v, true, true)
        },
        alert: function(w, u, t, v) {
            n.confirm(w, u, t, v, "static", true)
        }
    })
})(jQuery, _EBP_JS); (function($, _EBP_JS) {
    if (!_EBP_JS) {
        return
    }
    if (!_EBP_JS.Form) {
        _EBP_JS.Form = {}
    }
    var formOptions = {};
    var formData = {};
    var URL = {
        formHelp: "/oa/service/form/help/get.do"
    };
    var formVariables = {};
    function form(options) {
        formOptions = $.extend({
                title: "表单",
                ready: function() {},
                parseData: function() {
                    return {}
                },
                beforeSubmit: function() {},
                afterSubmit: function() {},
                buttons: {
                    quit: {
                        label: "退出",
                        clsName: "btn-default",
                        disabled: false,
                        hidden: false,
                        handler: function(formData) {
                            _EBP_JS.closeWindow()
                        },
                        parseData: false
                    },
                    submit: {
                        label: "提交",
                        clsName: "btn-default",
                        parseData: true,
                        handler: function(formData) {}
                    },
                    dropdown: {
                        label: "下拉",
                        clsName: "btn-default",
                        dropdowns: {
                            dropdown1: {
                                label: "选项1",
                                handler: function(formData) {}
                            },
                            dropdown2: {
                                label: "选项2",
                                handler: function(formData) {}
                            },
                            dropdown3: {
                                label: "选项3",
                                handler: function(formData) {}
                            }
                        }
                    }
                },
                toolbar: ["quit", "submit", {
                    dropdown: ["dropdown1", "dropdown3"]
                }]
            },
            options);
        $("." + _EBP_JS.cssPrefix + "-form-header").append('<div class="btn-toolbar form-buttons"><div class="btn-group"></div></div>');
        var $bar = $("." + _EBP_JS.cssPrefix + "-form-header .form-buttons > div");
        if (formOptions.toolbar) {
            function _createBtn(key, dropdowns) {
                var button = formOptions.buttons[key];
                if (button) {
                    var dropdownCls = "";
                    var dropdownTag = "";
                    var $dropdown = false;
                    if (_EBP_JS.isNotEmpty(dropdowns)) {
                        dropdownCls = ' dropdown-toggle" data-toggle="dropdown';
                        dropdownTag = ' <span class="caret"></span>';
                        $dropdown = $('<ul class="dropdown-menu"></ul>');
                        $.each(dropdowns,
                            function(si, skey) {
                                var sbtn = _EBP_JS.getValue(button.dropdowns, skey, false);
                                if (sbtn) {
                                    var $sbtn = $('<a href="javascript:void(0)">' + sbtn.label + "</a>");
                                    var $sgrp = $('<li class="form-btn-' + skey + '"></li>');
                                    $sbtn.appendTo($sgrp);
                                    $sgrp.appendTo($dropdown);
                                    if (!sbtn.disabled && sbtn.handler) {
                                        $sbtn.click(function() {
                                            formData = sbtn.parseData ? formOptions.parseData() : {};
                                            sbtn.handler(formData, $sbtn)
                                        })
                                    }
                                    if (sbtn.disabled) {
                                        $sbtn.attr("disabled", "disabled").click(function(e) {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            return false
                                        })
                                    }
                                    if (sbtn.hidden) {
                                        $sgrp.hide()
                                    }
                                    $sgrp.data("formButton", sbtn)
                                }
                            })
                    }
                    var $btn = $('<button class="btn ' + (button.clsName || "btn-default") + dropdownCls + '">' + button.label + dropdownTag + "</button>");
                    var $grp = $('<div class="btn-group form-btn-' + key + '"></div>');
                    $grp.append($btn).appendTo($bar);
                    if (!button.disabled && button.handler) {
                        $btn.click(function() {
                            formData = button.parseData ? formOptions.parseData() : {};
                            button.handler(formData, $btn)
                        })
                    }
                    if ($dropdown) {
                        $grp.append($dropdown)
                    }
                    if (button.disabled) {
                        $btn.attr("disabled", "disabled")
                    }
                    if (button.hidden) {
                        $grp.hide()
                    }
                    $grp.data("formButton", button)
                }
            }
            $.each(formOptions.toolbar,
                function(i, key) {
                    if (_EBP_JS.isObject(key)) {
                        $.each(key,
                            function(ki, sk) {
                                _createBtn(ki, sk)
                            })
                    } else {
                        _createBtn(key)
                    }
                })
        }
        if (formOptions.ready) {
            formOptions.ready()
        }
        $(window).scroll(function() {
            var ti = $(window).scrollTop();
            if (ti < 30) {
                if ($("." + _EBP_JS.cssPrefix + "-form-header.fixed-top").size() > 0) {
                    $("." + _EBP_JS.cssPrefix + "-form-header.fixed-top").removeClass("fixed-top")
                }
            } else {
                if ($("." + _EBP_JS.cssPrefix + "-form-header.fixed-top").size() == 0) {
                    $("." + _EBP_JS.cssPrefix + "-form-header").addClass("fixed-top")
                }
            }
        }).scroll()
    }
    function readonly(form, filters, exclusion) {
        var $f = $(form || "body"),
            $e;
        if (!exclusion) {
            exclusion = ".datagrid"
        }
        if (exclusion) {
            $(exclusion).find("input:text,input:password,input:radio,input:checkbox,select,textarea").addClass("" + _EBP_JS.cssPrefix + "-disabled")
        }
        if (!$f.is("input:text,input:password,input:radio,input:checkbox,select,textarea")) {
            $e = $f.find("input:text,input:password,input:radio,input:checkbox,select,textarea").filter(":enabled")
        } else {
            $e = $f
        }
        $e = $e.not("." + _EBP_JS.cssPrefix + "-disabled");
        if (filters) {
            $e = $e.filter(filters)
        }
        $e.each(function() {
            if ($(this).is(":text,:password,textarea")) {
                this.readOnly = true
            } else {
                this.disabled = true
            }
        })
    }
    function inputToText(form, filters) {
        var $f = $(form || "body"),
            $e;
        if (!$f.is("input:text,textarea")) {
            $e = $f.find("input:text,textarea")
        } else {
            $e = $f
        }
        if (filters) {
            $e = $e.filter(filters)
        }
        $e.each(function() {
            $(this).hide().after("<p class='form-control-static'>" + $(this).val() + "</p>")
        })
    }
    function hideButton(form) {
        var $f = $(form || "body");
        $f.find("input:button,button,.btn,.btn-group").hide()
    }
    function toJson(form, filter, exclusion) {
        var data = {};
        var $form = $(form || "body");
        var elSelector = "input:text,input:hidden,input:password,select,textarea";
        if ($form.size() > 0) {
            if (!exclusion) {
                exclusion = ".datagrid"
            }
            if (exclusion) {
                $(exclusion).find("input:text,input:hidden,input:password,input:checked,select,textarea").addClass("" + _EBP_JS.cssPrefix + "-disabled")
            }
            var $all = $form.find("input:text,input:hidden,input:password,select,textarea").filter("[name]:enabled").not("." + _EBP_JS.cssPrefix + "-disabled");
            if (filter) {
                $all = $all.filter(filter)
            }
            $all.each(function() {
                var fieldName = $(this).data("fieldName") || this.name;
                if ($(this).val() && $(this).data("type") == "number") {
                    _EBP_JS.setValue(data, fieldName, parseFloat($(this).val()))
                } else {
                    if ($(this).val() && $(this).data("type") == "boolean") {
                        _EBP_JS.setValue(data, fieldName, $(this).val().toLowerCase() == "true")
                    } else {
                        if ($(this).data("letter") == "uppercase") {
                            $(this).val($(this).val().toUpperCase())
                        } else {
                            if ($(this).data("letter") == "lowercase") {
                                $(this).val($(this).val().toLowerCase())
                            }
                        }
                        _EBP_JS.setValue(data, fieldName, $(this).val())
                    }
                }
            });
            $all = $form.find("input:checked").filter("[name]:enabled").not("." + _EBP_JS.cssPrefix + "-disabled");
            if (filter) {
                $all = $all.filter(filter)
            }
            $all.each(function() {
                var fieldName = $(this).data("fieldName") || this.name;
                if ($(this).is(":checkbox")) {
                    var arr = _EBP_JS.getValue(data, fieldName, []);
                    arr.push($(this).val());
                    _EBP_JS.setValue(data, fieldName, arr)
                } else {
                    _EBP_JS.setValue(data, fieldName, $(this).val())
                }
            })
        }
        return data
    }
    function getFormHelp(params, callback, backdrop) {
        if (arguments.length < 3) {
            backdrop = false
        }
        var async = _EBP_JS.isFunction(callback);
        var backData = {};
        _EBP_JS.ajax({
            backdrop: backdrop,
            async: async,
            url: _EBP_JS.basePath() + URL.formHelp,
            data: params,
            success: function(data) {
                if (async) {
                    callback(data)
                } else {
                    backData = data
                }
            }
        });
        if (!async) {
            return backData
        }
    }
    function formHelp(options) {
        var options = $.extend({
                render: "auto",
                label: "用户向导",
                backdrop: false,
                params: {}
            },
            options);
        var $content = false;
        if (options.render) {
            var $tabnav = $("." + _EBP_JS.cssPrefix + "-form-content .page-header .nav-tabs");
            $tabnav.append('<li><a href="#tab_form_help" data-toggle="tab" class="form-help-btn" style="color:#dd2323">' + options.label + "</a></li>");
            $content = $('<div class="tab-pane" id="tab_form_help"><div style="padding:0 15px 20px 15px;" class="form-help-content">加载中...</div></div>');
            $content.appendTo("." + _EBP_JS.cssPrefix + "-form-content .tab-content");
            $tabnav.find(".form-help-btn").click(function() {
                if (!$(this).data("tab-inited")) {
                    _getHtml();
                    $(this).data("tab-inited", true)
                }
            })
        } else {
            _getHtml()
        }
        function _getHtml() {
            getFormHelp(options.params,
                function(data) {
                    var content = _EBP_JS.getValue(data, "helpContent", "");
                    var attachment = "";
                    if (data.helpAttachment) {
                        var attachmentData = eval("(" + data.helpAttachment + ")");
                        if (attachmentData && attachmentData.length) {
                            attachment += '<div class="form-help-attachment"><p style="font-weight:bold">附件说明</p>';
                            $.each(attachmentData,
                                function(i, att) {
                                    attachment += "<div class='attach-list-item'><span class='attach-icon'></span><span class='attach-item'><a href='" + _EBP_JS.basePath() + "/oa/service/attach/download.do?id=" + att.id + "'>" + att.originalName + "</a></span></div>"
                                });
                            attachment += "</div>"
                        }
                    }
                    var backHtml = "<div class='" + _EBP_JS.cssPrefix + "-form-help'>" + content + attachment + "</div>";
                    if ($content) {
                        $content.find(".form-help-content").html(backHtml)
                    }
                    if (_EBP_JS.isFunction(options.success)) {
                        options.success(backHtml)
                    }
                },
                options.backdrop)
        }
    }
    function load($form, options, elements) {
        if (!elements) {
            elements = {}
        }
        var options = $.extend({
                async: true,
                success: false
            },
            options);
        if (options.url) {
            _EBP_JS.ajax({
                url: options.url,
                async: options.async,
                success: function(data) {
                    elements = loadFormData($form, data);
                    if (options.success) {
                        options.success($form, data)
                    }
                }
            })
        } else {
            if (options.data) {
                elements = loadFormData($form, options.data)
            }
        }
    }
    function loadFormData($form, data) {
        var data = data || {};
        var els = {};
        $form.find("input:text,input:hidden,input:password,select,textarea").filter("[name]").each(function() {
            if (typeof data[this.name] != "undefined" && data[this.name] != null) {
                data[this.name] = data[this.name] + ""
            }
            $(this).val(data[this.name]);
            els[this.name] = $(this)
        });
        $form.find("input:checkbox").filter("[name]").each(function() {
            if (typeof data[this.name] != "undefined" && data[this.name] != null) {
                data[this.name] = data[this.name] + ""
            }
            if (_EBP_JS.isArray(data[this.name])) {
                if (_EBP_JS.inArray(data[this.name], this.value)) {
                    this.checked = true
                } else {
                    this.checked = false
                }
            } else {
                if (this.value == data[this.name]) {
                    this.checked = true
                } else {
                    this.checked = false
                }
            }
            els[this.name] = $(this)
        });
        $form.find("input:radio").filter("[name]").each(function() {
            if (typeof data[this.name] != "undefined" && data[this.name] != null) {
                data[this.name] = data[this.name] + ""
            }
            if (this.value == data[this.name]) {
                this.checked = true
            } else {
                this.checked = false
            }
            els[this.name] = $(this)
        });
        return els
    }
    $.extend(_EBP_JS.Form, {
        form: function(options) {
            form(options)
        },
        show: function(key) {
            $("." + _EBP_JS.cssPrefix + "-form-header .form-buttons .form-btn-" + key).show()
        },
        hide: function(key) {
            $("." + _EBP_JS.cssPrefix + "-form-header .form-buttons .form-btn-" + key).hide()
        },
        disable: function(key) {
            var $btn = $("." + _EBP_JS.cssPrefix + "-form-header .form-buttons .form-btn-" + key);
            if ($btn.size() > 0) {
                if ($btn.is("li")) {
                    $btn = $btn.find("a")
                } else {
                    $btn = $btn.find("button")
                }
                $btn.attr("disabled", "disabled").unbind("click").click(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false
                })
            }
        },
        enable: function(key) {
            var $btn = $("." + _EBP_JS.cssPrefix + "-form-header .form-buttons .form-btn-" + key);
            if ($btn.size() > 0) {
                $btn.show();
                var button = $btn.data("formButton") || {};
                if ($btn.is("li")) {
                    $btn = $btn.find("a")
                } else {
                    $btn = $btn.find("button")
                }
                $btn.attr("disabled", false).unbind("click").click(function() {
                    if (button.handler) {
                        formData = button.parseData ? formOptions.parseData() : {};
                        button.handler(formData)
                    }
                })
            }
        },
        isVisible: function(key) {
            var $btn = $("." + _EBP_JS.cssPrefix + "-form-header .form-buttons .form-btn-" + key);
            return $btn.size() && $btn.is(":visible")
        },
        isEnable: function(key) {
            var $btn = $("." + _EBP_JS.cssPrefix + "-form-header .form-buttons .form-btn-" + key);
            if ($btn.size() > 0 && $btn.is(":visible")) {
                if ($btn.is("li")) {
                    $btn = $btn.find("a")
                } else {
                    $btn = $btn.find("button")
                }
                return $btn.size() && $btn.is(":enabled")
            }
            return false
        },
        elements: function(form) {
            var els = {};
            var form = form || "body";
            $("input:text,input:hidden,input:password,select,textarea", $(form)).filter("[name]").each(function(i, e) {
                els[e.name] = $(e)
            });
            return els
        },
        readonly: function(form, filters, exclusion) {
            readonly(form, filters, exclusion)
        },
        inputToText: function(form, filters) {
            inputToText(form, filters)
        },
        hideButton: function(form) {
            hideButton(form)
        },
        toJson: function(form, filter, exclusion) {
            return toJson(form, filter, exclusion)
        },
        formToJson: function(form, filter, exclusion) {
            return toJson(form, filter, exclusion)
        },
        convertAfStatus: function(afStatus) {
            switch (afStatus) {
                case 0:
                    return "草稿";
                case 1:
                    return "审批中";
                case 2:
                    return "已完成";
                case 3:
                    return "驳回";
                default:
                    return "审批中"
            }
        },
        popover: function(elements) {
            if (_EBP_JS.isObject(elements)) {
                elements = [elements]
            }
            $.each(elements,
                function(i, element) {
                    var $e = $(element.renderTo);
                    if ($e.size() > 0) {
                        var options = {
                            container: "body",
                            placement: "right",
                            html: true,
                            content: "<div style='color:#aa0000'>" + element.content + "</div>",
                            trigger: "manual"
                        };
                        if (element.options) {
                            $.extend(options, element.options)
                        } else {
                            options.content = "<div style='color:#aa0000'>" + element.content + "</div>"
                        }
                        $e.on("focus",
                            function() {
                                if ($e.data("popover-create")) {
                                    $e.popover("destroy")
                                } else {
                                    $e.data("popover-create", true)
                                }
                                $e.popover(options).popover("show")
                            }).on("blur",
                            function() {
                                $e.data("popover-create", false);
                                $e.popover("destroy")
                            })
                    }
                })
        },
        formHelp: function(options) {
            formHelp(options)
        },
        getFormHelp: function(params, callback, backdrop) {
            return getFormHelp(params, callback, backdrop)
        },
        reset: function($form) {
            if ($form && $form.size()) {
                $form.find("input:text,input:hidden,input:password,select,textarea").each(function() {
                    $(this).val("")
                });
                $form.find("input:checked").each(function() {
                    this.checked = false
                });
                $form.find(".dropdown-panel .dropdown-menu .selected").removeClass("selected")
            }
        },
        load: function($from, options, elements) {
            load($from, options, elements)
        },
        loadData: function($from, data) {
            return loadFormData($from, data)
        },
        set: function(key, value) {
            _EBP_JS.setValue(formVariables, key, value)
        },
        get: function(key) {
            _EBP_JS.getValue(formVariables, key)
        },
        hasAcl: function(acl) {
            if (_EBP_JS.isString(acl)) {
                acl = acl.split(",")
            }
            var acList = _EBP_JS.getValue(formVariables, "acl", []);
            if (acList.length == 0) {
                return false
            }
            for (var i = 0; i < acl.length; i++) {
                if (_EBP_JS.inArray(acList, acl[i]) > -1) {
                    return true
                }
            }
            return false
        }
    });
    _EBP_JS.form = function(cmd, arg1, arg2, arg3, arg4, arg5) {
        if (_EBP_JS.isString(cmd)) {
            if (_EBP_JS.isFunction(_EBP_JS.Form[cmd])) {
                return _EBP_JS.Form[cmd](arg1, arg2, arg3, arg4, arg5)
            }
        } else {
            return form(cmd)
        }
    }
})(jQuery, _EBP_JS);
$(function() {
    $(document).delegate("a", "focus",
        function() {
            this.blur()
        });
    var b = $(".in-frame ." + _EBP_JS.cssPrefix + "-form-title");
    if (b.size() > 0) {
        var c = _EBP_JS.getUrlParam("_af_title");
        if (c) {
            b.html("<span>" + c + "</span>")
        }
    }
    $(".nav-tabs li a").on("shown.bs.tab",
        function() {
            $(window).resize()
        });
    $(document).on("focus", "." + _EBP_JS.cssPrefix + "-input-group .form-control",
        function() {
            $(this).closest("." + _EBP_JS.cssPrefix + "-input-group").addClass("input-focus")
        }).on("blur", "." + _EBP_JS.cssPrefix + "-input-group .form-control",
        function() {
            $(this).closest("." + _EBP_JS.cssPrefix + "-input-group").removeClass("input-focus")
        });
    var a = -1;
    $(document).on("show.bs.dropdown", ".dropdown",
        function(d) {
            $(d.target).find("li.dropdown-hovered").removeClass("dropdown-hovered");
            a = -1
        });
    $(document).on("keydown", ".dropdown",
        function(g) {
            if (g.keyCode == 9) {
                return
            }
            if (g.keyCode == 38 || g.keyCode == 40) {
                g.preventDefault()
            }
            var d = $(this);
            if (!d.hasClass("open")) {
                d.find("[data-toggle]").dropdown("toggle")
            } else {
                if (g.keyCode == 38 || g.keyCode == 40 || g.keyCode == 13) {
                    var f = d.find(".dropdown-menu > li:visible");
                    if (g.keyCode == 40) {
                        a++;
                        if (a >= f.size()) {
                            a = 0
                        }
                        f.eq(a).addClass("dropdown-hovered").siblings().removeClass("dropdown-hovered")
                    } else {
                        if (g.keyCode == 38) {
                            a--;
                            if (a < 0) {
                                a = f.size() - 1
                            }
                            f.eq(a).addClass("dropdown-hovered").siblings().removeClass("dropdown-hovered")
                        } else {
                            if (g.keyCode == 13 && d.hasClass("open")) {
                                f.filter(".dropdown-hovered").click()
                            }
                        }
                    }
                }
            }
        })
}); (function(i) {
    var q = window.orientation != undefined;
    var b = function(s, k) {
        this.id = n++;
        this.init(s, k)
    };
    var o = function(k) {
        if (typeof k === "string") {
            return new Date(k)
        }
        return k
    };
    b.prototype = {
        constructor: b,
        init: function(s, k) {
            var t;
            if (! (k.pickTime || k.pickDate)) {
                throw new Error("Must choose at least one picker")
            }
            this.options = k;
            this.$element = i(s);
            this.language = k.language in a ? k.language: "cn";
            this.pickDate = k.pickDate;
            this.pickTime = k.pickTime;
            this.isInput = this.$element.is("input");
            this.component = false;
            if (this.$element.find(".input-group") || this.$element.find(".datetime-input-group")) {
                this.component = this.$element.find(".input-group-btn .btn")
            }
            this.input = this.isInput ? this.$element: this.$element.find("input");
            this.format = k.format;
            if (!this.format) {
                if (this.isInput) {
                    this.format = this.$element.data("format")
                } else {
                    this.format = this.$element.find("input").data("format")
                }
            }
            this._compileFormat();
            this.widget = i(d(this.timeIcon, k.pickDate, k.pickTime, k.pick12HourFormat, k.pickSeconds, k.collapse)).appendTo("body");
            this.minViewMode = k.minViewMode || this.$element.data("date-minviewmode") || 0;
            if (typeof this.minViewMode === "string") {
                switch (this.minViewMode) {
                    case "months":
                        this.minViewMode = 1;
                        break;
                    case "years":
                        this.minViewMode = 2;
                        break;
                    default:
                        this.minViewMode = 0;
                        break
                }
            }
            this.viewMode = k.viewMode || this.$element.data("date-viewmode") || 0;
            if (typeof this.viewMode === "string") {
                switch (this.viewMode) {
                    case "months":
                        this.viewMode = 1;
                        break;
                    case "years":
                        this.viewMode = 2;
                        break;
                    default:
                        this.viewMode = 0;
                        break
                }
            }
            this.startViewMode = this.viewMode;
            this.weekStart = k.weekStart || this.$element.data("date-weekstart") || 0;
            this.weekEnd = this.weekStart === 0 ? 6 : this.weekStart - 1;
            this.setStartDate(k.startDate || this.$element.data("date-startdate"));
            this.setEndDate(k.endDate || this.$element.data("date-enddate"));
            this.maxDate = k.maxDate ? (typeof(k.maxDate) == "string" ? this.parseDate(k.maxDate) : k.maxDate) : false;
            this.minDate = k.minDate ? (typeof(k.minDate) == "string" ? this.parseDate(k.minDate) : k.minDate) : false;
            if (!this.pickTime) {
                if (this.maxDate) {
                    this.maxDate = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth(), this.maxDate.getDate(), 23, 59, 59, 999)
                }
                if (this.minDate) {
                    this.minDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth(), this.minDate.getDate(), 0, 0, 0, 0)
                }
            }
            this.checkValue = typeof k.checkValue == "function" ? k.checkValue: false;
            this.fillDow();
            this.fillMonths();
            this.fillHours();
            this.fillMinutes();
            this.fillSeconds();
            this.update();
            this.showMode();
            this._attachDatePickerEvents()
        },
        show: function(k) {
            this.widget.show();
            this.height = this.component ? this.component.outerHeight() : this.$element.outerHeight();
            this.place();
            this.$element.trigger({
                type: "show",
                date: this._date
            });
            this._attachDatePickerGlobalEvents();
            if (k) {
                k.stopPropagation();
                k.preventDefault()
            }
        },
        disable: function() {
            this.$element.find("input").prop("disabled", true);
            this._detachDatePickerEvents()
        },
        enable: function() {
            this.$element.find("input").prop("disabled", false);
            this._attachDatePickerEvents()
        },
        hide: function(u) {
            var t = this.widget.find(".collapse");
            for (var k = 0; k < t.length; k++) {
                var s = t.eq(k).data("collapse");
                if (s && s.transitioning) {
                    return
                }
            }
            this.widget.hide();
            this.viewMode = this.startViewMode;
            this.showMode();
            if (u) {
                this.set()
            }
            this.$element.trigger({
                type: "hide",
                date: this._date
            });
            this._detachDatePickerGlobalEvents()
        },
        set: function() {
            var s = "";
            if (!this._unset) {
                if (this.minDate && this.minDate > this._date) {
                    _EBP_JS.form("validateMessage", this.$element.find("input"), "日期不能小于" + this.formatDate(this.minDate));
                    return
                }
                if (this.maxDate && this.maxDate < this._date) {
                    _EBP_JS.form("validateMessage", this.$element.find("input"), "日期不能大于" + this.formatDate(this.maxDate));
                    return
                }
                s = this.formatDate(this._date);
                if (this.checkValue && !this.checkValue(this._date, s)) {
                    return
                }
            }
            var k;
            if (!this.isInput) {
                if (this.component) {
                    k = this.$element.find("input");
                    k.val(s);
                    this._resetMaskPos(k)
                }
                this.$element.data("date", s)
            } else {
                k = this.$element;
                k.val(s);
                this._resetMaskPos(this.$element)
            }
            if (s && this.afterCheck) {
                this.afterCheck(k, this._date, s)
            }
        },
        setValue: function(k) {
            if (!k) {
                this._unset = true
            } else {
                this._unset = false
            }
            if (typeof k === "string") {
                this._date = this.parseDate(k)
            } else {
                if (k) {
                    this._date = new Date(k)
                }
            }
            this.set();
            this.viewDate = new Date(this._date.getFullYear(), this._date.getMonth(), 1, 0, 0, 0, 0);
            this.fillDate();
            this.fillTime()
        },
        getDate: function() {
            if (this._unset) {
                return null
            }
            return new Date(this._date.valueOf())
        },
        setDate: function(k) {
            if (!k) {
                this.setValue(null)
            } else {
                this.setValue(k.valueOf())
            }
        },
        setStartDate: function(k) {
            if (k instanceof Date) {
                this.startDate = k
            } else {
                if (typeof k === "string") {
                    this.startDate = new Date(k);
                    if (!this.startDate.getFullYear()) {
                        this.startDate = -Infinity
                    }
                } else {
                    this.startDate = -Infinity
                }
            }
            if (this.viewDate) {
                this.update();
                this.check()
            }
        },
        setEndDate: function(k) {
            if (k instanceof Date) {
                this.endDate = k
            } else {
                if (typeof k === "string") {
                    this.endDate = new Date(k);
                    if (!this.endDate.getFullYear()) {
                        this.endDate = Infinity
                    }
                } else {
                    this.endDate = Infinity
                }
            }
            if (this.viewDate) {
                this.update();
                this.check()
            }
        },
        getLocalDate: function() {
            if (this._unset) {
                return null
            }
            var k = this._date;
            return new Date(k.getFullYear(), k.getMonth(), k.getDate(), k.getHours(), k.getMinutes(), k.getSeconds(), k.getMilliseconds())
        },
        setLocalDate: function(k) {
            if (!k) {
                this.setValue(null)
            } else {
                this.setValue(k)
            }
        },
        place: function() {
            var k = "absolute";
            var t = this.component ? this.component.closest(".datetime-input-group").offset() : this.$element.offset();
            this.width = this.component ? this.component.parent().outerWidth() : this.$element.outerWidth();
            t.top = t.top + this.height;
            var s = i(window);
            if (this.options.width != undefined) {
                this.widget.width(this.options.width)
            }
            if (this.options.orientation == "left") {
                this.widget.addClass("left-oriented");
                t.left = t.left - this.widget.width() + 20
            }
            if (this._isInFixed()) {
                k = "fixed";
                t.top -= s.scrollTop();
                t.left -= s.scrollLeft()
            }
            if (s.width() < t.left + this.widget.outerWidth()) {
                t.right = s.width() - t.left - this.width;
                t.left = "auto";
                this.widget.addClass("pull-right")
            } else {
                t.right = "auto";
                this.widget.removeClass("pull-right")
            }
            if (s.height() < t.top + this.widget.outerHeight() - s.scrollTop()) {
                this.widget.css({
                    position: k,
                    top: s.height() - this.widget.outerHeight() + s.scrollTop(),
                    left: t.left,
                    right: t.right
                })
            } else {
                this.widget.css({
                    position: k,
                    top: t.top,
                    left: t.left,
                    right: t.right
                })
            }
        },
        notifyChange: function() {
            this.$element.trigger({
                type: "changeDate",
                date: this.getDate(),
                localDate: this.getLocalDate()
            })
        },
        update: function(k) {
            var s = k;
            if (!s) {
                if (this.isInput) {
                    s = this.$element.val()
                } else {
                    s = this.$element.find("input").val()
                }
                if (s) {
                    this._date = this.parseDate(s)
                }
            } else {
                this._date = typeof s == "date" ? s: this.parseDate(s)
            }
            if (!this._date) {
                this._date = new Date()
            }
            this.viewDate = new Date(this._date.getFullYear(), this._date.getMonth(), 1, 0, 0, 0, 0);
            this.fillDate();
            this.fillTime()
        },
        fillDow: function() {
            var k = this.weekStart;
            var s = i("<tr>");
            while (k < this.weekStart + 7) {
                s.append('<th class="dow">' + a[this.language].daysMin[k++%7] + "</th>")
            }
            this.widget.find(".datepicker-days thead").append(s)
        },
        fillMonths: function() {
            var s = "";
            var k = 0;
            while (k < 12) {
                s += '<span class="month">' + a[this.language].monthsShort[k++] + "</span>"
            }
            this.widget.find(".datepicker-months td").append(s)
        },
        fillDate: function() {
            var D = this.viewDate.getFullYear();
            var B = this.viewDate.getMonth();
            var s = new Date(this._date.getFullYear(), this._date.getMonth(), this._date.getDate(), 0, 0, 0, 0);
            var C = typeof this.startDate === "object" ? this.startDate.getFullYear() : -Infinity;
            var F = typeof this.startDate === "object" ? this.startDate.getMonth() : -1;
            var G = typeof this.endDate === "object" ? this.endDate.getFullYear() : Infinity;
            var z = typeof this.endDate === "object" ? this.endDate.getMonth() : 12;
            this.widget.find(".datepicker-days").find(".disabled").removeClass("disabled");
            this.widget.find(".datepicker-months").find(".disabled").removeClass("disabled");
            this.widget.find(".datepicker-years").find(".disabled").removeClass("disabled");
            this.widget.find(".datepicker-days th:eq(1)").text(a[this.language].months[B] + " " + D);
            var v = new Date(D, B - 1, 28, 0, 0, 0, 0);
            var E = j.getDaysInMonth(v.getFullYear(), v.getMonth());
            v.setDate(E);
            v.setDate(E - (v.getDay() - this.weekStart + 7) % 7);
            if (D == C && B <= F || D < C) {
                this.widget.find(".datepicker-days th:eq(0)").addClass("disabled")
            }
            if (D == G && B >= z || D > G) {
                this.widget.find(".datepicker-days th:eq(2)").addClass("disabled")
            }
            var y = new Date(v.valueOf());
            y.setDate(y.getDate() + 42);
            y = y.valueOf();
            var x = [];
            var H;
            var u;
            while (v.valueOf() < y) {
                if (v.getDay() === this.weekStart) {
                    H = i("<tr>");
                    x.push(H)
                }
                u = "";
                if (v.getFullYear() < D || v.getFullYear() == D && v.getMonth() < B) {
                    u += " old"
                } else {
                    if (v.getFullYear() > D || v.getFullYear() == D && v.getMonth() > B) {
                        u += " new"
                    }
                }
                if (v.valueOf() === s.valueOf()) {
                    u += " active"
                }
                if (v.valueOf() + 86400000 <= this.startDate) {
                    u += " disabled"
                }
                if (v.valueOf() > this.endDate) {
                    u += " disabled"
                }
                H.append('<td class="day' + u + '">' + v.getDate() + "</td>");
                v.setDate(v.getDate() + 1)
            }
            this.widget.find(".datepicker-days tbody").empty().append(x);
            var A = this._date.getFullYear();
            var k = this.widget.find(".datepicker-months").find("th:eq(1)").text(D).end().find("span").removeClass("active");
            if (A === D) {
                k.eq(this._date.getMonth()).addClass("active")
            }
            if (A - 1 < C) {
                this.widget.find(".datepicker-months th:eq(0)").addClass("disabled")
            }
            if (A + 1 > G) {
                this.widget.find(".datepicker-months th:eq(2)").addClass("disabled")
            }
            for (var w = 0; w < 12; w++) {
                if (D == C && F > w || D < C) {
                    i(k[w]).addClass("disabled")
                } else {
                    if (D == G && z < w || D > G) {
                        i(k[w]).addClass("disabled")
                    }
                }
            }
            x = "";
            D = parseInt(D / 10, 10) * 10;
            var t = this.widget.find(".datepicker-years").find("th:eq(1)").text(D + "-" + (D + 9)).end().find("td");
            this.widget.find(".datepicker-years").find("th").removeClass("disabled");
            if (C > D) {
                this.widget.find(".datepicker-years").find("th:eq(0)").addClass("disabled")
            }
            if (G < D + 9) {
                this.widget.find(".datepicker-years").find("th:eq(2)").addClass("disabled")
            }
            D -= 1;
            for (var w = -1; w < 11; w++) {
                x += '<span class="year' + (w === -1 || w === 10 ? " old": "") + (A === D ? " active": "") + (D < C || D > G ? " disabled": "") + '">' + D + "</span>";
                D += 1
            }
            t.html(x)
        },
        fillHours: function() {
            var u = this.widget.find(".timepicker .timepicker-hours table");
            u.parent().hide();
            var t = "";
            if (this.options.pick12HourFormat) {
                var v = 1;
                for (var s = 0; s < 3; s += 1) {
                    t += "<tr>";
                    for (var k = 0; k < 4; k += 1) {
                        var w = v.toString();
                        t += '<td class="hour">' + f(w, 2, "0") + "</td>";
                        v++
                    }
                    t += "</tr>"
                }
            } else {
                var v = 0;
                for (var s = 0; s < 5; s += 1) {
                    t += "<tr>";
                    for (var k = 0; k < 4; k += 1) {
                        if (v > 0 && v < 17 && v % 4 == 0) {
                            v++
                        }
                        var w = v.toString();
                        t += '<td class="hour">' + f(w, 2, "0") + "</td>";
                        v++
                    }
                    t += "</tr>"
                }
            }
            u.html(t)
        },
        fillMinutes: function() {
            var u = this.widget.find(".timepicker .timepicker-minutes table");
            u.parent().hide();
            var t = "";
            var v = 0;
            for (var s = 0; s < 5; s++) {
                t += "<tr>";
                for (var k = 0; k < 4; k += 1) {
                    var w = v.toString();
                    t += '<td class="minute">' + f(w, 2, "0") + "</td>";
                    v += 3
                }
                t += "</tr>"
            }
            u.html(t)
        },
        fillSeconds: function() {
            var u = this.widget.find(".timepicker .timepicker-seconds table");
            u.parent().hide();
            var t = "";
            var v = 0;
            for (var s = 0; s < 5; s++) {
                t += "<tr>";
                for (var k = 0; k < 4; k += 1) {
                    var w = v.toString();
                    t += '<td class="second">' + f(w, 2, "0") + "</td>";
                    v += 3
                }
                t += "</tr>"
            }
            u.html(t)
        },
        fillTime: function() {
            if (!this._date) {
                return
            }
            var x = this.widget.find(".timepicker span[data-time-component]");
            var u = x.closest("table");
            var t = this.options.pick12HourFormat;
            var k = this._date.getHours();
            var w = "AM";
            if (t) {
                if (k >= 12) {
                    w = "PM"
                }
                if (k === 0) {
                    k = 12
                } else {
                    if (k != 12) {
                        k = k % 12
                    }
                }
                this.widget.find(".timepicker [data-action=togglePeriod]").text(w)
            }
            k = f(k.toString(), 2, "0");
            var v = f(this._date.getMinutes().toString(), 2, "0");
            var s = f(this._date.getSeconds().toString(), 2, "0");
            x.filter("[data-time-component=hours]").text(k);
            x.filter("[data-time-component=minutes]").text(v);
            x.filter("[data-time-component=seconds]").text(s)
        },
        click: function(y) {
            y.stopPropagation();
            y.preventDefault();
            this._unset = false;
            var x = i(y.target).closest("span, td, th");
            if (x.length === 1) {
                if (!x.is(".disabled")) {
                    switch (x[0].nodeName.toLowerCase()) {
                        case "th":
                            switch (x[0].className) {
                                case "switch":
                                    this.showMode(1);
                                    break;
                                case "prev":
                                case "next":
                                    var s = this.viewDate;
                                    var t = j.modes[this.viewMode].navFnc;
                                    var v = j.modes[this.viewMode].navStep;
                                    if (x[0].className === "prev") {
                                        v = v * -1
                                    }
                                    s["set" + t](s["get" + t]() + v);
                                    this.fillDate();
                                    break
                            }
                            break;
                        case "span":
                            if (x.is(".month")) {
                                var w = x.parent().find("span").index(x);
                                this.viewDate.setMonth(w)
                            } else {
                                var u = parseInt(x.text(), 10) || 0;
                                this.viewDate.setFullYear(u)
                            }
                            if (this.viewMode !== 0) {
                                this._date = this.viewDate;
                                this.notifyChange()
                            }
                            this.showMode( - 1);
                            this.fillDate();
                            this.set();
                            break;
                        case "td":
                            if (x.is(".day")) {
                                var k = parseInt(x.text(), 10) || 1;
                                var w = this.viewDate.getMonth();
                                var u = this.viewDate.getFullYear();
                                if (x.is(".old")) {
                                    if (w === 0) {
                                        w = 11;
                                        u -= 1
                                    } else {
                                        w -= 1
                                    }
                                } else {
                                    if (x.is(".new")) {
                                        if (w == 11) {
                                            w = 0;
                                            u += 1
                                        } else {
                                            w += 1
                                        }
                                    }
                                }
                                this._date = new Date(u, w, k, this._date.getHours(), this._date.getMinutes(), this._date.getSeconds(), this._date.getMilliseconds());
                                this.viewDate = new Date(u, w, Math.min(28, k), 0, 0, 0, 0);
                                this.fillDate();
                                this.set();
                                this.notifyChange()
                            }
                            break
                    }
                }
            }
        },
        actions: {
            incrementHours: function(k) {
                this._date.setHours(this._date.getHours() + 1)
            },
            incrementMinutes: function(k) {
                this._date.setMinutes(this._date.getMinutes() + 1)
            },
            incrementSeconds: function(k) {
                this._date.setSeconds(this._date.getSeconds() + 1)
            },
            decrementHours: function(k) {
                this._date.setHours(this._date.getHours() - 1)
            },
            decrementMinutes: function(k) {
                this._date.setMinutes(this._date.getMinutes() - 1)
            },
            decrementSeconds: function(k) {
                this._date.setSeconds(this._date.getSeconds() - 1)
            },
            togglePeriod: function(s) {
                var k = this._date.getHours();
                if (k >= 12) {
                    k -= 12
                } else {
                    k += 12
                }
                this._date.setHours(k)
            },
            showPicker: function() {
                this.widget.find(".timepicker > div:not(.timepicker-picker)").hide();
                this.widget.find(".timepicker .timepicker-picker").show()
            },
            showHours: function() {
                this.widget.find(".timepicker .timepicker-picker").hide();
                this.widget.find(".timepicker .timepicker-hours").show()
            },
            showMinutes: function() {
                this.widget.find(".timepicker .timepicker-picker").hide();
                this.widget.find(".timepicker .timepicker-minutes").show()
            },
            showSeconds: function() {
                this.widget.find(".timepicker .timepicker-picker").hide();
                this.widget.find(".timepicker .timepicker-seconds").show()
            },
            selectHour: function(t) {
                var u = i(t.target);
                var k = parseInt(u.text(), 10);
                if (this.options.pick12HourFormat) {
                    var s = this._date.getHours();
                    if (s >= 12) {
                        if (k != 12) {
                            k = (k + 12) % 24
                        }
                    } else {
                        if (k === 12) {
                            k = 0
                        } else {
                            k = k % 12
                        }
                    }
                }
                this._date.setHours(k);
                this.actions.showPicker.call(this)
            },
            selectMinute: function(s) {
                var t = i(s.target);
                var k = parseInt(t.text(), 10);
                this._date.setMinutes(k);
                this.actions.showPicker.call(this)
            },
            selectSecond: function(s) {
                var t = i(s.target);
                var k = parseInt(t.text(), 10);
                this._date.setSeconds(k);
                this.actions.showPicker.call(this)
            }
        },
        doAction: function(s) {
            s.stopPropagation();
            s.preventDefault();
            if (!this._date) {
                this._date = new Date(1970, 0, 0, 0, 0, 0, 0)
            }
            var k = i(s.currentTarget).data("action");
            var t = this.actions[k].apply(this, arguments);
            this.set();
            this.fillTime();
            this.notifyChange();
            return t
        },
        stopEvent: function(k) {
            k.stopPropagation();
            k.preventDefault()
        },
        keydown: function(v) {
            var u = this,
                t = v.which,
                s = i(v.target);
            if (t == 8 || t == 46) {
                setTimeout(function() {
                    u._resetMaskPos(s)
                })
            }
        },
        keypress: function(v) {
            var u = v.which;
            if (u == 8 || u == 46) {
                return
            }
            var t = i(v.target);
            var x = String.fromCharCode(u);
            var w = t.val() || "";
            w += x;
            var s = this._mask[this._maskPos];
            if (!s) {
                return false
            }
            if (s.end != w.length) {
                return
            }
            if (!s.pattern.test(w.slice(s.start))) {
                w = w.slice(0, w.length - 1);
                while ((s = this._mask[this._maskPos]) && s.character) {
                    w += s.character;
                    this._maskPos++
                }
                w += x;
                if (s.end != w.length) {
                    t.val(w);
                    return false
                } else {
                    if (!s.pattern.test(w.slice(s.start))) {
                        t.val(w.slice(0, s.start));
                        return false
                    } else {
                        t.val(w);
                        this._maskPos++;
                        return false
                    }
                }
            } else {
                this._maskPos++
            }
        },
        check: function(s) {
            var s = s || this.$element.find("input");
            var u = s.val();
            var t = "";
            if (u && this._formatPattern.test(u)) {
                var k = this.parseDate(u);
                if (this.startDate && this.startDate > k) {
                    t = "日期不能小于" + this.formatDate(this.startDate);
                    s.val("")
                } else {
                    if (this.endDate && this.endDate < k) {
                        t = "日期不能大于" + this.formatDate(this.endDate);
                        s.val("")
                    }
                }
            }
            return t
        },
        change: function(t) {
            var k = i(t.target);
            var u = k.val();
            if (this._formatPattern.test(u)) {
                var s = this.check(k);
                if (s) {
                    _EBP_JS.form("validateMessage", k, s);
                    this._unset = true
                } else {
                    this.update();
                    this.setValue(this._date.getTime());
                    this.notifyChange()
                }
            } else {
                if (u && u.trim()) {
                    if (this._date) {
                        this.setValue(this._date.getTime())
                    } else {
                        k.val("")
                    }
                } else {
                    if (this._date) {
                        this.setValue(null);
                        this.notifyChange();
                        this._unset = true
                    }
                }
            }
            this._resetMaskPos(k)
        },
        showMode: function(k) {
            if (k) {
                this.viewMode = Math.max(this.minViewMode, Math.min(2, this.viewMode + k))
            }
            this.widget.find(".datepicker > div").hide().filter(".datepicker-" + j.modes[this.viewMode].clsName).show()
        },
        destroy: function() {
            this._detachDatePickerEvents();
            this._detachDatePickerGlobalEvents();
            this.widget.remove();
            this.$element.removeData("datetimepicker");
            this.component.removeData("datetimepicker")
        },
        formatDate: function(k) {
            return this.format.replace(c,
                function(u) {
                    var t, v, w, s = u.length;
                    if (u === "ms") {
                        s = 1
                    }
                    v = p[u].property;
                    if (v === "Hours12") {
                        w = k.getHours();
                        if (w === 0) {
                            w = 12
                        } else {
                            if (w !== 12) {
                                w = w % 12
                            }
                        }
                    } else {
                        if (v === "Period12") {
                            if (k.getHours() >= 12) {
                                return "PM"
                            } else {
                                return "AM"
                            }
                        } else {
                            t = "get" + v;
                            w = k[t]()
                        }
                    }
                    if (t === "getMonth") {
                        w = w + 1
                    }
                    if (t === "getYear") {
                        w = w + 1900 - 2000
                    }
                    return f(w.toString(), s, "0")
                })
        },
        parseDate: function(x) {
            var t, u, w, s, v, k = {};
            if (! (t = this._formatPattern.exec(x))) {
                return null
            }
            for (u = 1; u < t.length; u++) {
                w = this._propertiesByIndex[u];
                if (!w) {
                    continue
                }
                v = t[u];
                if (/^\d+$/.test(v)) {
                    v = parseInt(v, 10)
                }
                k[w] = v
            }
            return this._finishParsingDate(k)
        },
        _resetMaskPos: function(k) {
            var t = k.val();
            for (var s = 0; s < this._mask.length; s++) {
                if (this._mask[s].end > t.length) {
                    this._maskPos = s;
                    break
                } else {
                    if (this._mask[s].end === t.length) {
                        this._maskPos = s + 1;
                        break
                    }
                }
            }
        },
        _finishParsingDate: function(s) {
            var w, x, u, k, v, y, t;
            w = s.FullYear;
            if (s.Year) {
                w = 2000 + s.Year
            }
            if (!w) {
                w = 1970
            }
            if (s.Month) {
                x = s.Month - 1
            } else {
                x = 0
            }
            u = s.Date || 1;
            k = s.Hours || 0;
            v = s.Minutes || 0;
            y = s.Seconds || 0;
            t = s.Milliseconds || 0;
            if (s.Hours12) {
                k = s.Hours12
            }
            if (s.Period12) {
                if (/pm/i.test(s.Period12)) {
                    if (k != 12) {
                        k = (k + 12) % 24
                    }
                } else {
                    k = k % 12
                }
            }
            return new Date(w, x, u, k, v, y, t)
        },
        _compileFormat: function() {
            var u, t, w = [],
                s = [],
                x = this.format,
                k = {},
                v = 0,
                y = 0;
            while (u = h.exec(x)) {
                t = u[0];
                if (t in p) {
                    v++;
                    k[v] = p[t].property;
                    w.push("\\s*" + p[t].getPattern(this) + "\\s*");
                    s.push({
                        pattern: new RegExp(p[t].getPattern(this)),
                        property: p[t].property,
                        start: y,
                        end: y += t.length
                    })
                } else {
                    w.push(g(t));
                    s.push({
                        pattern: new RegExp(g(t)),
                        character: t,
                        start: y,
                        end: ++y
                    })
                }
                x = x.slice(t.length)
            }
            this._mask = s;
            this._maskPos = 0;
            this._formatPattern = new RegExp("^\\s*" + w.join("") + "\\s*$");
            this._propertiesByIndex = k
        },
        _attachDatePickerEvents: function() {
            var k = this;
            this.widget.on("click", ".datepicker *", i.proxy(this.click, this));
            this.widget.on("click", "[data-action]", i.proxy(this.doAction, this));
            this.widget.on("mousedown", i.proxy(this.stopEvent, this));
            this.widget.on("click", ".picker-time-bot .btn:eq(0)",
                function() {
                    k.update(new Date())
                });
            this.widget.on("click", ".picker-time-bot .btn:eq(1)",
                function() {
                    k.hide(true)
                });
            this.widget.on("click", ".picker-time-bot .btn:eq(2)",
                function() {
                    k.input.val("");
                    k.hide()
                });
            if (this.isInput) {
                this.$element.on({
                    focus: i.proxy(this.show, this),
                    change: i.proxy(this.change, this)
                });
                if (this.options.maskInput) {
                    this.$element.on({
                        keydown: i.proxy(this.keydown, this),
                        keypress: i.proxy(this.keypress, this)
                    })
                }
            } else {
                this.$element.on({
                        change: i.proxy(this.change, this)
                    },
                    "input");
                if (this.options.maskInput) {
                    this.$element.on({
                            keydown: i.proxy(this.keydown, this),
                            keypress: i.proxy(this.keypress, this)
                        },
                        "input")
                }
                if (this.component) {
                    this.component.on("click", i.proxy(this.show, this))
                } else {
                    this.$element.on("click", i.proxy(this.show, this))
                }
            }
        },
        _attachDatePickerGlobalEvents: function() {
            var k = this;
            i(window).on("resize.datetimepicker" + this.id, i.proxy(this.place, this));
            if (!this.isInput) {
                i(document).on("mousedown.datetimepicker" + this.id,
                    function() {
                        k.hide(false)
                    })
            }
        },
        _detachDatePickerEvents: function() {
            this.widget.off("click", ".datepicker *", this.click);
            this.widget.off("click", "[data-action]");
            this.widget.off("mousedown", this.stopEvent);
            if (this.pickDate && this.pickTime) {
                this.widget.off("click.togglePicker")
            }
            if (this.isInput) {
                this.$element.off({
                    focus: this.show,
                    change: this.change
                });
                if (this.options.maskInput) {
                    this.$element.off({
                        keydown: this.keydown,
                        keypress: this.keypress
                    })
                }
            } else {
                this.$element.off({
                        change: this.change
                    },
                    "input");
                if (this.options.maskInput) {
                    this.$element.off({
                            keydown: this.keydown,
                            keypress: this.keypress
                        },
                        "input")
                }
                if (this.component) {
                    this.component.off("click", this.show)
                } else {
                    this.$element.off("click", this.show)
                }
            }
        },
        _detachDatePickerGlobalEvents: function() {
            i(window).off("resize.datetimepicker" + this.id);
            if (!this.isInput) {
                i(document).off("mousedown.datetimepicker" + this.id)
            }
        },
        _isInFixed: function() {
            if (this.$element) {
                var s = this.$element.parents();
                var k = false;
                for (var t = 0; t < s.length; t++) {
                    if (i(s[t]).css("position") == "fixed") {
                        k = true;
                        break
                    }
                }
                return k
            } else {
                return false
            }
        }
    };
    i.fn.datetimepicker = function(k, s) {
        return this.each(function() {
            var v = i(this),
                u = v.data("datetimepicker"),
                t = typeof k === "object" && k;
            if (!u) {
                v.data("datetimepicker", u = new b(this, i.extend({},
                    i.fn.datetimepicker.defaults, t)))
            }
            if (typeof k === "string") {
                u[k](s)
            }
        })
    };
    i.fn.datetimepicker.defaults = {
        maskInput: false,
        pickDate: true,
        pickTime: true,
        pick12HourFormat: false,
        pickSeconds: true,
        startDate: -Infinity,
        endDate: Infinity,
        collapse: true
    };
    i.fn.datetimepicker.Constructor = b;
    var n = 0;
    var a = i.fn.datetimepicker.dates = {
        en: {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        },
        cn: {
            days: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            daysShort: ["日", "一", "二", "三", "四", "五", "六", "日"],
            daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
            months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            monthsShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"]
        }
    };
    var p = {
        dd: {
            property: "Date",
            getPattern: function() {
                return "(0?[1-9]|[1-2][0-9]|3[0-1])\\b"
            }
        },
        d: {
            property: "Date",
            getPattern: function() {
                return "([1-9]|[1-2][0-9]|3[0-1])\\b"
            }
        },
        MM: {
            property: "Month",
            getPattern: function() {
                return "(0?[1-9]|1[0-2])\\b"
            }
        },
        M: {
            property: "Month",
            getPattern: function() {
                return "([1-9]|1[0-2])\\b"
            }
        },
        yyyy: {
            property: "FullYear",
            getPattern: function() {
                return "(\\d{4})\\b"
            }
        },
        yy: {
            property: "Year",
            getPattern: function() {
                return "(\\d{2})\\b"
            }
        },
        hh: {
            property: "Hours",
            getPattern: function() {
                return "(0?[0-9]|1[0-9]|2[0-3])\\b"
            }
        },
        h: {
            property: "Hours",
            getPattern: function() {
                return "([0-9]|1[0-9]|2[0-3])\\b"
            }
        },
        mm: {
            property: "Minutes",
            getPattern: function() {
                return "(0?[0-9]|[1-5][0-9])\\b"
            }
        },
        ss: {
            property: "Seconds",
            getPattern: function() {
                return "(0?[0-9]|[1-5][0-9])\\b"
            }
        },
        s: {
            property: "Seconds",
            getPattern: function() {
                return "([0-9]|[1-5][0-9])\\b"
            }
        },
        ms: {
            property: "Milliseconds",
            getPattern: function() {
                return "([0-9]{1,3})\\b"
            }
        },
        HH: {
            property: "Hours12",
            getPattern: function() {
                return "(0?[1-9]|1[0-2])\\b"
            }
        },
        H: {
            property: "Hours12",
            getPattern: function() {
                return "([1-9]|1[0-2])\\b"
            }
        },
        PP: {
            property: "Period12",
            getPattern: function() {
                return "(AM|PM|am|pm|Am|aM|Pm|pM)\\b"
            }
        },
        P: {
            property: "Period12",
            getPattern: function() {
                return "(AM|PM|am|pm|Am|aM|Pm|pM)\\b"
            }
        }
    };
    var r = [];
    for (var e in p) {
        r.push(e)
    }
    r[r.length - 1] += "\\b";
    r.push(".");
    var h = new RegExp(r.join("|"));
    r.pop();
    var c = new RegExp(r.join("|"), "g");
    function g(k) {
        return k.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
    }
    function f(t, k, u) {
        if (k < t.length) {
            return t
        } else {
            return Array(k - t.length + 1).join(u || " ") + t
        }
    }
    function d(v, u, k, s, t, w) {
        if (u && k) {
            return '<div class="bootstrap-datetimepicker-widget dropdown-menu" style="z-index:10000;"><table><tr><td class="picker-date"><div class="datepicker">' + j.template + '</div></td><td class="picker-line"><div></div></td><td class="picker-time"><div class="picker-time-tit"><i class="glyphicon glyphicon-time"></i></div><div class="timepicker">' + l.getTemplate(s, t) + '</div><div class="picker-time-bot"><a class="btn btn-link">当前</a><a class="btn btn-link">确定</a><a class="btn btn-link">清除</a></div></td></tr></table></div>'
        } else {
            if (k) {
                return '<div class="bootstrap-datetimepicker-widget dropdown-menu" style="z-index:10000;"><table><tr><td class="picker-time only-time"><div class="timepicker">' + l.getTemplate(s, t) + '</div><div class="picker-time-bot"><a class="btn btn-link">当前</a><a class="btn btn-link">确定</a><a class="btn btn-link">清除</a></div></td></tr></table></div>'
            } else {
                return '<div class="bootstrap-datetimepicker-widget dropdown-menu" style="z-index:10000;"><table><tr><td class="picker-date"><div class="datepicker">' + j.template + '</div><div class="picker-time-bot"><a class="btn btn-link">今天</a><a class="btn btn-link">确定</a><a class="btn btn-link">清除</a></div></td></tr></table></div>'
            }
        }
    }
    function m() {
        return new Date(Date.UTC.apply(Date, arguments))
    }
    var j = {
        modes: [{
            clsName: "days",
            navFnc: "Month",
            navStep: 1
        },
            {
                clsName: "months",
                navFnc: "FullYear",
                navStep: 1
            },
            {
                clsName: "years",
                navFnc: "FullYear",
                navStep: 10
            }],
        isLeapYear: function(k) {
            return k % 4 === 0 && k % 100 !== 0 || k % 400 === 0
        },
        getDaysInMonth: function(k, s) {
            return [31, j.isLeapYear(k) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][s]
        },
        headTemplate: '<thead><tr><th class="prev">&lsaquo;</th><th colspan="5" class="switch"></th><th class="next">&rsaquo;</th></tr></thead>',
        contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>'
    };
    j.template = '<div class="datepicker-days"><table class="table-condensed">' + j.headTemplate + '<tbody></tbody></table></div><div class="datepicker-months"><table class="table-condensed">' + j.headTemplate + j.contTemplate + '</table></div><div class="datepicker-years"><table class="table-condensed">' + j.headTemplate + j.contTemplate + "</table></div>";
    var l = {
        hourTemplate: '<span data-action="showHours" data-time-component="hours" class="timepicker-hour"></span>',
        minuteTemplate: '<span data-action="showMinutes" data-time-component="minutes" class="timepicker-minute"></span>',
        secondTemplate: '<span data-action="showSeconds" data-time-component="seconds" class="timepicker-second"></span>'
    };
    l.getTemplate = function(k, s) {
        return '<div class="timepicker-picker"><table class="table-condensed"' + (k ? ' data-hour-format="12"': "") + '><tr><td><a href="#" class="btn btn-default" data-action="incrementHours"><i class="glyphicon glyphicon-chevron-up"></i></a></td><td class="separator"></td><td><a href="#" class="btn btn-default" data-action="incrementMinutes"><i class="glyphicon glyphicon-chevron-up"></i></a></td>' + (s ? '<td class="separator"></td><td><a href="#" class="btn btn-default" data-action="incrementSeconds"><i class="glyphicon glyphicon-chevron-up"></i></a></td>': "") + (k ? '<td class="separator"></td>': "") + "</tr><tr><td>" + l.hourTemplate + '</td> <td class="separator">:</td><td>' + l.minuteTemplate + "</td> " + (s ? '<td class="separator">:</td><td>' + l.secondTemplate + "</td>": "") + (k ? '<td class="separator"></td><td><button type="button" class="btn btn-primary" data-action="togglePeriod"></button></td>': "") + '</tr><tr><td><a href="#" class="btn btn-default" data-action="decrementHours"><i class="glyphicon glyphicon-chevron-down"></i></a></td><td class="separator"></td><td><a href="#" class="btn btn-default" data-action="decrementMinutes"><i class="glyphicon glyphicon-chevron-down"></i></a></td>' + (s ? '<td class="separator"></td><td><a href="#" class="btn btn-default" data-action="decrementSeconds"><i class="glyphicon glyphicon-chevron-down"></i></a></td>': "") + (k ? '<td class="separator"></td>': "") + '</tr></table></div><div class="timepicker-hours" data-action="selectHour"><table class="table-condensed"></table></div><div class="timepicker-minutes" data-action="selectMinute"><table class="table-condensed"></table></div>' + (s ? '<div class="timepicker-seconds" data-action="selectSecond"><table class="table-condensed"></table></div>': "")
    };
    i.DateTimePicker = {
        isLeapYear: function(k) {
            return j.isLeapYear(k)
        },
        getDaysInMonth: function(k, s) {
            return j.getDaysInMonth(k, s)
        },
        parseDate: function(k, s) {
            return j.parseDate(k, j.parseFormat(s))
        },
        formatDate: function(k, s) {
            return j.formatDate(k, j.parseFormat(s))
        }
    }
})(window.jQuery); (function($, _EBP_JS) {
    if (!_EBP_JS) {
        return
    }
    if (!_EBP_JS.Form) {
        _EBP_JS.Form = {}
    }
    function datetimepicker(arg) {
        var arr = [];
        if (_EBP_JS.isArray(arg)) {
            arr = arg
        } else {
            arr.push(arg || {})
        }
        $.each(arr,
            function(i, o) {
                var options = $.extend({
                        editable: false,
                        pickDate: true,
                        pickTime: true
                    },
                    o);
                if (!options.format) {
                    if (options.pickDate && options.pickTime) {
                        options.format = "yyyy-MM-dd hh:mm:ss"
                    } else {
                        if (options.pickDate) {
                            options.format = "yyyy-MM-dd"
                        } else {
                            options.format = "hh:mm:ss"
                        }
                    }
                }
                var selector = options.renderTo || ".datetime-input";
                $(selector).each(function() {
                    $(this).data("original", {
                        readonly: $(this).attr("readonly")
                    });
                    var _options = $(this).data("options");
                    if (_options) {
                        if (typeof _options == "string") {
                            _options = eval("({" + _options + "})")
                        }
                        _options = $.extend({},
                            options, _options)
                    } else {
                        _options = $.extend({},
                            options)
                    }
                    if (!_options.editable) {
                        $(this).attr("readonly", "readonly")
                    }
                    if (!$(this).attr("readonly")) {
                        _EBP_JS.Form.datetimeeditable(this, _options.format)
                    }
                    _EBP_JS.form("inputgroupDestroy", this);
                    var $p = $(this).parent();
                    var $g;
                    if ($p.is(".datetime-input-group")) {
                        $g = $p
                    } else {
                        $g = $('<div class="input-group datetime-input-group ' + _EBP_JS.cssPrefix + '-input-group"></div>');
                        $(this).after($g);
                        $(this).appendTo($g);
                        if (_options.pickDate) {
                            $g.append('<div class="input-group-btn"><a class="btn btn-default"><span class="glyphicon glyphicon-calendar"></span></a></div>')
                        } else {
                            $g.append('<div class="input-group-btn"><a class="btn btn-default"><span class="glyphicon glyphicon-time"></span></a></div>')
                        }
                    }
                    $g.datetimepicker(_options);
                    $(this).data("datetimepicker", $g)
                })
            })
    }
    function setDefaultOptions(options, def) {
        var arr = [];
        if (_EBP_JS.isArray(options)) {
            $.each(options,
                function(i, o) {
                    arr.push($.extend(def, o))
                })
        } else {
            arr.push($.extend(def, options))
        }
        return arr
    }
    $.extend(_EBP_JS.Form, {
        datetimepicker: function(optionsORselector, method, arg1, arg2, arg3) {
            if (method) {
                if ($(optionsORselector).data("datetimepicker")) {
                    $(optionsORselector).data("datetimepicker").datetimepicker(method, arg1, arg2, arg3)
                }
            } else {
                datetimepicker(optionsORselector)
            }
        },
        datepicker: function(options) {
            datetimepicker(setDefaultOptions(options, {
                pickTime: false,
                pickTime: false
            }))
        },
        timepicker: function(options) {
            datetimepicker(setDefaultOptions(options, {
                pickDate: false,
                pickTime: true
            }))
        },
        monthpicker: function(options) {
            datetimepicker(setDefaultOptions(options, {
                pickTime: false,
                minViewMode: 1,
                viewMode: 1,
                format: "yyyy-MM"
            }))
        },
        yearpicker: function(options) {
            datetimepicker(setDefaultOptions(options, {
                pickTime: false,
                minViewMode: 2,
                viewMode: 2,
                format: "yyyy"
            }))
        },
        datetimeeditable: function(input, formatter) {
            var formatter = formatter || "yyyy-MM-dd hh:mm:ss";
            var seps = formatter.replace(/y|m|d|h|i|s|p|z/gi, "\0").split("");
            var maxLength = seps.length;
            $(input).attr({
                maxLength: maxLength,
                readonly: false
            }).on("keydown",
                function(e) {
                    var len = this.value.length;
                    if (e.keyCode != 8 && len < maxLength) {
                        while (seps[len] != "\0" && len < maxLength) {
                            this.value += seps[len];
                            len = this.value.length
                        }
                    }
                })
        }
    })
})(jQuery, _EBP_JS); (function($, _EBP_JS) {
    if (!_EBP_JS) {
        return
    }
    if (!_EBP_JS.Form) {
        _EBP_JS.Form = {}
    }
    var BizTypesRequired = {};
    function bizTypesRequire(options, callback) {
        if (_EBP_JS.isEmpty(options)) {
            return
        }
        var param = {};
        $.each(options,
            function(key, type) {
                if (_EBP_JS.isObject(type)) {
                    param[key] = type
                } else {
                    param[key] = {
                        type: type
                    }
                }
            });
        _EBP_JS.ajax({
            backdrop: false,
            url: _EBP_JS.basePath() + "code/require.do",// 原来的地址废弃："/oa/service/conf/bizType/require.do"
            data: {
                require: _EBP_JS.stringify(param)
            },
            success: function(data) {
                if (data) {
                    $.extend(BizTypesRequired, data)
                }
                if (callback) {
                    callback(data)
                }
            }
        })
    }
    function getBizTypeList(key) {
        return _EBP_JS.getValue(BizTypesRequired, key, [])
    }
    function getBizTypeText(key, value, multi) {
        var arr = getBizTypeList(key);
        var arrValue = [];
        var multi = multi === true;
        if (multi) {
            arrValue = value.split(",")
        } else {
            arrValue.push(value)
        }
        var arrText = [];
        if (arr.length > 0) {
            for (var i = 0; i < arr.length; i++) {
                if (_EBP_JS.inArray(arrValue, arr[i][0]) > -1) {
                    if (!multi) {
                        return arr[i][1]
                    }
                    arrText.push(arr[i][1])
                }
            }
        }
        return arrText.join(",")
    }
    var areaRequired = {};
    function areaRequired(options, callback) {
        if (_EBP_JS.isEmpty(options)) {
            return
        }
        _EBP_JS.ajax({
            backdrop: false,
            url: _EBP_JS.basePath() + "/af/service/area/getText.do",
            data: {
                require: _EBP_JS.stringify(options.param)
            },
            success: function(data) {
                if (data) {
                    $.extend(areaRequired, data)
                }
                if (callback) {
                    callback(data)
                }
            }
        })
    }
    function getArea(key) {
        return _EBP_JS.getValue(areaRequired, key, [])
    }
    function getAreaText(key) {
        var obj = getArea(key);
        if (obj != undefined) {
            return obj[key]
        }
        return ""
    }
    function dropdown(options) {
        var options = $.extend({
                renderTo: ".dropdown-input",
                multiSelect: false,
                maxHeight: "200px",
                editable: false,
                addon: false,
                listKey: "",
                checkSelect: false,
                onSelect: false,
                initSelect: false,
                dataField: "",
                textDField: "",
                valueDField: "",
                titleDField: "",
                textField: "",
                valueField: "",
                defaultValue: "",
                captionAll: false,
                autoSearch: false,
                returns: {},
                $scope: "body"
            },
            options);
        $(options.renderTo).each(function() {
            var $target = $(this);
            $target.data("original", {
                readonly: $target.attr("readonly")
            });
            $target.attr("autocomplete", "off");
            var $p = $target.parents(".dropdown-panel");
            if ($p.size() > 0) {
                $p = $p.eq(0);
                $p.find("ul.dropdown-menu").remove()
            } else {
                $p = $("<div class='dropdown dropdown-panel " + _EBP_JS.cssPrefix + "-input-group'></div>");
                $target.after($p);
                var $g = $('<div class="input-group" data-toggle="dropdown"></div>');
                $g.appendTo($p);
                $target.appendTo($g);
                $g.append('<div class="input-group-btn"><a class="btn btn-default"><span class="glyphicon glyphicon-chevron-down"></span></a></div>');
                if (options.addon) {
                    var $add = $('<a class="btn btn-default"></a>');
                    var _handler = false;
                    if (typeof options.addon == "string") {
                        $add.append("<span>" + options.addon + "</span>")
                    } else {
                        if (options.addon.handler) {
                            _handler = options.addon.handler
                        }
                        $add.append("<span>" + options.addon.content + "</span>")
                    }
                    $add.click(function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        if (_handler) {
                            _handler(this)
                        }
                        return false
                    }).appendTo($g.find(".input-group-btn"))
                }
            }
            var _options = $target.data("options");
            if (_options) {
                if (typeof _options == "string") {
                    if (_options.indexOf("{") == 0) {
                        _options = eval("(" + _options + ")")
                    } else {
                        _options = eval("({" + _options + "})")
                    }
                }
                _options = $.extend({},
                    options, _options)
            } else {
                _options = $.extend({},
                    options)
            }
            var $scope = $(_options.$scope);
            var selected = [];
            var selectedValue = [];
            var selectedText = [];
            if (!_options.editable) {
                $target.attr("readonly", "readonly")
            }
            var $ul = $('<ul class="dropdown-menu" style="min-width:100%;max-height:' + _options.maxHeight + ';overflow-y:auto"></ul>');
            $ul.appendTo($p);
            if (_options.listKey) {
                _getListHtml(getBizTypeList(_options.listKey), $ul);
                _initValues()
            } else {
                if (_options.href || _options.queryParams || _options.type) {
                    if (!_options.href || _options.href == "#") {
                        _options.href = _EBP_JS.basePath() + "code/get.do"//"原来的地址废弃：/oa/service/conf/bizType/get.do"
                    }
                    if (!_options.queryParams) {
                        _options.queryParams = {}
                    }
                    if (_EBP_JS.isFunction(_options.queryParams)) {
                        _options.queryParams = _options.queryParams() || {}
                    }
                    if (_options.type) {
                        _options.queryParams.type = _options.type
                    }
                    $.post(_options.href, _options.queryParams,
                        function(data) {
                            data = _EBP_JS.getValue(data, _options.dataField, data);
                            _getListHtml(data, $ul);
                            _initValues()
                        })
                } else {
                    if (_options.data) {
                        _getListHtml(_options.data, $ul);
                        _initValues()
                    }
                }
            }
            var checkSelect = _options.checkSelect ||
                function(val, txt, target) {
                    return true
                };
            $ul.on("click", "li",
                function(e) {
                    if ($(this).attr("disabled")) {
                        return false
                    }
                    if (_options.multiSelect) {
                        e.stopPropagation()
                    }
                    if ($(this).is(".selected")) {
                        $(this).removeClass("selected")
                    } else {
                        var val = $(this).data("value");
                        var txt = $(this).data("text");
                        var data = $(this).data("data");
                        if (!checkSelect(val, txt, $target, data, $scope)) {
                            return false
                        }
                        if (!_options.multiSelect) {
                            $(this).parent().find("li.selected").removeClass("selected")
                        }
                        $(this).addClass("selected")
                    }
                    _setFieldValue();
                    if (_options.onSelect && !_options.initSelect) {
                        _options.onSelect(selectedValue, selectedText, $target, selected, $scope)
                    }
                });
            if (_options.editable) {
                $target.attr("readonly", false);
                if (_options.autoSearch) {
                    var _value_change = $target.val();
                    $p.on("keyup", "input",
                        function(e) {
                            if (e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13 || e.keyCode == 9) {
                                return
                            }
                            var $input = $(e.target);
                            var val = $input.val();
                            if (_value_change != val) {
                                _value_change = val;
                                if (val.length > 0) {
                                    $ul.find("li").each(function() {
                                        $(this).removeClass("selected");
                                        var _value = $(this).attr("data-value");
                                        var _text = $(this).attr("data-text");
                                        if (_value.indexOf(val) > -1 || _text.indexOf(val) > -1) {
                                            $(this).show()
                                        } else {
                                            $(this).hide()
                                        }
                                    })
                                } else {
                                    $ul.find("li").show()
                                }
                            }
                        })
                } else {
                    $p.on("blur", "input",
                        function(e) {
                            var $input = $(e.target);
                            var values = [];
                            if (_options.multiSelect) {
                                values = $input.val().replace(/^ +| +$/g, "").split(",")
                            } else {
                                values.push($input.val())
                            }
                            $.each(values,
                                function(i, v) {
                                    if (!_options.multiSelect) {
                                        $ul.find("li.selected").removeClass("selected")
                                    }
                                    if (v && $ul.find("li[data-value='" + v + "']").size() == 0) {
                                        $ul.append('<li class="selected" data-value="' + v + '" data-text="' + v + '"><a href="javascript:void(0)"><span class="checkmark"></span>' + v + "</a></li>")
                                    } else {
                                        if (v) {
                                            $ul.find("li[data-value='" + v + "']").addClass("selected")
                                        }
                                    }
                                })
                        })
                }
            }
            function _initValues() {
                var val = "";
                if (_options.valueField) {
                    val = $(_options.valueField, $scope).val()
                } else {
                    val = $target.val()
                }
                if (!val && _options.defaultValue) {
                    val = _options.defaultValue
                }
                if (!val) {
                    return
                }
                var values = [];
                if (_options.multiSelect) {
                    values = val.replace(/^ +| +$/g, "").split(",")
                } else {
                    values.push(val)
                }
                $.each(values,
                    function(i, v) {
                        if (v) {
                            var $li = $ul.find("li[data-value='" + v + "']");
                            if ($li.size() == 0) {} else {
                                $li.addClass("selected")
                            }
                        }
                    });
                _setFieldValue(true)
            }
            function _setFieldValue(initFlag) {
                selected = [];
                selectedText = [];
                selectedValue = [];
                $ul.parent().find(".selected").each(function() {
                    selected.push($(this).data("data"))
                });
                selectedValue = _EBP_JS.getListValue(selected, _options.valueDField, ",");
                selectedText = _EBP_JS.getListValue(selected, _options.textDField, ",");
                if (!initFlag) {
                    if (_options.valueField) {
                        $(_options.valueField, $scope).val(selectedValue)
                    } else {
                        $target.val(selectedValue)
                    }
                }
                if (_options.textField && (!initFlag || _EBP_JS.isEmpty($(_options.textField, $scope).val()))) {
                    $(_options.textField, $scope).val(selectedText)
                }
                if (!initFlag) {
                    if (_EBP_JS.isFunction(_options.returns)) {
                        _options.returns(selected, $target, $scope)
                    } else {
                        if (_EBP_JS.isObject(_options.returns)) {
                            $.each(_options.returns,
                                function(fname, input) {
                                    $(input, $scope).val(_EBP_JS.getListValue(selected, fname, ","))
                                })
                        }
                    }
                }
                if (_options.onSelect && _options.initSelect) {
                    _options.onSelect(selectedValue, selectedText, $target, selected, $scope, initFlag)
                }
                if (selectedValue == "" && _options.autoSearch && _options.editable) {
                    $ul.find("li:hidden").show()
                }
            }
            function _getListHtml(data, $ul) {
                if (typeof data == "string") {
                    data = data.split(",")
                }
                if (!data.length) {
                    return
                }
                if (!_EBP_JS.isObject(data[0])) {
                    _options.valueDField = "value";
                    _options.textDField = "text";
                    _options.titleDField = "title"
                } else {
                    if (!_options.valueDField) {
                        _options.valueDField = "value";
                        _options.textDField = "text";
                        _options.titleDField = "title"
                    } else {
                        if (!_options.textDField) {
                            _options.textDField = _options.valueDField
                        }
                    }
                }
                $.each(data,
                    function(i, dd) {
                        var dd1 = {};
                        if (_EBP_JS.isObject(dd)) {
                            $.extend(dd1, dd)
                        } else {
                            if (!_EBP_JS.isArray(dd)) {
                                dd = dd + "";
                                dd = dd.split(",")
                            }
                            dd1 = {
                                value: dd[0],
                                text: dd.length > 1 ? dd[1] : dd[0],
                                title: dd.length > 2 ? dd[2] : ""
                            }
                        }
                        if (options.formatter) {
                            options.formatter(dd1)
                        }
                        var title = _EBP_JS.getValue(dd1, _options.titleDField, "");
                        var text = _EBP_JS.getValue(dd1, _options.textDField);
                        var value = _EBP_JS.getValue(dd1, _options.valueDField);
                        var caption = _options.captionAll ? value + " " + text: text;
                        var _disabled = _EBP_JS.getValue(dd1, "dropdownDisabled", "") ? "disabled style='color:#aaa'": "";
                        $("<li " + _disabled + ' data-value="' + value + '" data-text="' + text + '"' + (title ? ' title="' + title + '"': "") + "><a " + _disabled + ' href="javascript:void(0)"><span class="checkmark"></span>' + caption + "</a></li>").data("data", dd1).appendTo($ul)
                    })
            }
        })
    }
    function clearDropdown(renderTo) {
        $(renderTo).each(function() {
            var $target = $(this);
            var $p = $target.parents(".dropdown-panel");
            $p.find(".dropdown-menu .selected").removeClass("selected")
        })
    }
    function setDropdown(renderTo, value, multiSelect) {
        $(renderTo).each(function() {
            var $target = $(this);
            var $p = $target.parents(".dropdown-panel");
            var $ul = $p.find("ul.dropdown-menu");
            $ul.find(".selected").removeClass("selected");
            if (!value) {
                return
            }
            var values = [];
            if (multiSelect) {
                values = value.replace(/^ +| +$/g, "").split(",")
            } else {
                values.push(value)
            }
            $.each(values,
                function(i, v) {
                    if (v) {
                        var $li = $ul.find("li[data-value='" + v + "']");
                        if ($li.size() > 0) {
                            $li.addClass("selected")
                        }
                    }
                })
        })
    }
    $.extend(_EBP_JS.Form, {
        bizTypesRequire: function(options, callback) {
            bizTypesRequire(options, callback)
        },
        getBizTypeList: function(key) {
            return getBizTypeList(key)
        },
        getBizTypeText: function(key, value) {
            return getBizTypeText(key, value)
        },
        areaRequired: function(options, callback) {
            areaRequired(options, callback)
        },
        getAreaText: function(key) {
            getAreaText(key)
        },
        areaRequired: function(key) {
            getArea(key)
        },
        dropdown: function(options) {
            if (_EBP_JS.isArray(options)) {
                $.each(options,
                    function(i, o) {
                        dropdown(o)
                    })
            } else {
                dropdown(options)
            }
        },
        clearDropdown: function(renderTo) {
            clearDropdown(renderTo)
        },
        setDropdown: function(renderTo, value, multiSelect) {
            setDropdown(renderTo, value, multiSelect)
        }
    })
})(jQuery, _EBP_JS); (function(c, d) {
    if (!d) {
        return
    }
    if (!d.Form) {
        d.Form = {}
    }
    function b(f) {
        var f = f || [{}];
        var e = d.isArray(f) ? f: [f];
        c.each(e,
            function(j, k) {
                if (!k.renderTo) {
                    return
                }
                var h = c.extend({
                        editable: false,
                        handler: function(l, i) {},
                        clearHandler: false,
                        btnIconCls: "glyphicon glyphicon-list",
                        btnLabel: "",
                        btnTitle: "",
                        readonlyStyle: false,
                        addonBtn: false
                    },
                    k);
                var g = h.$scope || c("body");
                c(k.renderTo).each(function() {
                    var i = c(this);
                    d.form("inputgroupDestroy", i);
                    i.data("original", {
                        readonly: i.attr("readonly")
                    });
                    if (!i.is(".form-control")) {
                        i.addClass("form-control")
                    }
                    if (!h.editable) {
                        i.attr("readonly", "readonly")
                    }
                    var n = i.parent();
                    var o = c('<div class="' + d.cssPrefix + '-input-group"></div>');
                    var l = c('<div class="input-group"></div>');
                    var m = c('<div class="input-group-btn"></div>');
                    o.appendTo(n);
                    l.appendTo(o);
                    i.appendTo(l);
                    m.appendTo(l);
                    if (h.readonlyStyle && !h.editable) {
                        o.addClass("" + d.cssPrefix + "-readonly-style")
                    }
                    if (h.addonBtn) {
                        c.each(h.addonBtn,
                            function(q, p) {
                                var r = c('<a class="btn btn-default"><span></span>' + (p.label ? " " + p.label: "") + "</a>");
                                if (p.title) {
                                    r.attr("title", p.title)
                                }
                                if (p.iconCls) {
                                    r.find("span").addClass(p.iconCls)
                                }
                                if (p.handler) {
                                    r.click(function() {
                                        p.handler(i, g)
                                    })
                                } else {
                                    r.addClass(d.cssPrefix + "-no-handler")
                                }
                                r.appendTo(m)
                            })
                    } else {
                        if (h.handler) {
                            c('<a class="btn btn-default"' + (h.btnTitle ? ' title="' + h.btnTitle + '"': "") + '><span class="' + h.btnIconCls + '"></span>' + (h.btnLabel ? " " + h.btnLabel: "") + "</a>").click(function() {
                                h.handler(i, g)
                            }).appendTo(m)
                        }
                        if (h.clearHandler) {
                            c('<a class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></a>').click(function() {
                                h.clearHandler(i, g)
                            }).appendTo(m)
                        }
                    }
                })
            })
    }
    function a(e) {
        if (!e) {
            e = "." + d.cssPrefix + "-input-group .form-control"
        }
        c(e).each(function() {
            var f = c(this);
            var g = f.closest("." + d.cssPrefix + "-input-group");
            if (g.size() == 1) {
                g.after(f);
                g.remove();
                f.attr("readonly", d.getValue(f.data("original"), "readonly", false))
            }
        })
    }
    c.extend(d.Form, {
        inputgroup: function(e) {
            b(e)
        },
        inputgroupDestroy: function(e) {
            a(e)
        }
    })
})(jQuery, _EBP_JS); (function(c, d) {
    if (!d) {
        return
    }
    if (!d.Form) {
        d.Form = {}
    }
    var a = true;
    var e = {
        autoMark: true,
        els: {},
        rules: {
            mobile: {
                validator: function(g) {
                    var f = /^(\+\d{1,2})?[1-9]\d{10}$/;
                    return f.test(g)
                },
                message: "输入的手机号码无效"
            },
            phone: {
                validator: function(g) {
                    var f = /^(\d{3,4})-(\d{7,8})(-\d{1,8})?$/;
                    return f.test(g)
                },
                message: "输入的电话号码无效（如：027-87000000）"
            },
            email: {
                validator: function(f) {
                    return /^([A-Za-z0-9])(\w)+@(\w)+(\.(com|com\.cn|net|cn|net\.cn|org|biz|info|gov|gov\.cn|edu|edu\.cn))$/i.test(f)
                },
                message: "输入的电子邮件地址无效"
            },
            idnumber: {
                validator: function(f) {
                    return /^\d{17}(\d|X)$/i.test(f)
                },
                message: "身份证号码格式不正确"
            },
            length: {
                validator: function(g, h) {
                    if (!d.isArray(h)) {
                        h = [h, h]
                    }
                    if (h.length == 1) {
                        h[1] = h[0]
                    }
                    var f = g.length;
                    return f >= h[0] && f <= h[1]
                },
                message: "输入内容的长度不符合"
            },
            number: {
                validator: function(h, i) {
                    var f = "+";
                    if (i) {
                        if (d.isArray(i)) {
                            i = i.join(",")
                        }
                        f = "{" + i + "}"
                    }
                    var g = new RegExp("^[+-]?((\\d+\\.\\d" + f + ")|\\d*)$", "g");
                    return g.test(h)
                },
                message: "输入的数值无效"
            },
            date: {
                validator: function(g) {
                    var f = new RegExp("^\\d{4}-((0[1-9])|(1[0-2]))-((0[1-9])|([12][0-9])|(3[01]))$");
                    return f.test(g)
                },
                message: "输入的日期格式有误[yyyy-mm-dd]"
            },
            time: {
                validator: function(g) {
                    var f = new RegExp("^(([0-1][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9]$");
                    return f.test(g)
                },
                message: "输入的时间格式有误[hh:mm:ss]"
            },
            datetime: {
                validator: function(g) {
                    var f = new RegExp("^\\d{4}-((0[1-9])|(1[0-2]))-((0[1-9])|([12][0-9])|(3[01])) (([0-1][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9]$");
                    return f.test(g)
                },
                message: "输入的时间格式有误[yyyy-mm-dd hh:mm:ss]"
            },
            url: {
                validator: function(g) {
                    var f = new RegExp("^(http|ftp|https)://[^.]+(.[^.]+)*$");
                    return f.test(g)
                },
                message: "输入的URL格式有误[http|ftp|https://xxx.xxxx.com/xxx]"
            }
        },
        popover: function(j, l, i) {
            if (i) {
                l = "[" + i + "] " + l
            }
            if (j.is(":hidden")) {
                var h = j.parents(".tab-content .tab-pane");
                if (h.size() > 0) {
                    h.each(function() {
                        c(".nav-tabs a[href='#" + c(this).attr("id") + "']").tab("show")
                    })
                }
            }
            if (j.is(":visible")) {
                j.focus();
                var h = j.parent().is(".input-group") ? j.parent() : j;
                if (h.parents(".modal-dialog").size() == 0) {
                    var f = c(window).scrollTop();
                    var k = c(window).height();
                    var g = h.offset().top;
                    if (g < f + 80 || g > k + f - 80) {
                        c(window).scrollTop(h.offset().top - 80)
                    }
                }
                h.popover({
                    container: "body",
                    placement: "left",
                    html: true,
                    content: "<div style='color:#aa0000'>" + l + "</div>",
                    trigger: "manual"
                }).popover("show").data("popover-destroy", false);
                window.setTimeout(function() {
                        h.popover("destroy").data("popover-destroy", true)
                    },
                    3000);
                if (!h.data("popover-event")) {
                    h.data("popover-event", true).on("click",
                        function() {
                            if (!h.data("popover-destroy")) {
                                h.popover("destroy").data("popover-destroy", true)
                            }
                        })
                }
            } else {
                alert(l)
            }
        },
        validate: function(f) {
            var g;
            if (!f) {
                g = e.els
            } else {
                if (typeof f == "string") {
                    f = f.split(",")
                }
                g = {};
                c.each(f,
                    function(j, k) {
                        if (e.els[k]) {
                            g[k] = e.els[k]
                        }
                    })
            }
            var h = true;
            c.each(g,
                function(i, l) {
                    var j = l.el ? c(l.el) : c("#" + i);
                    h = b(j, l);
                    if (!h) {
                        return false
                    }
                });
            return h
        }
    };
    function b(i, h) {
        var l, g;
        if (!h) {
            l = i;
            g = c(l.el)
        } else {
            g = c(i);
            l = h
        }
        var f = true;
        if (g.size()) {
            var j = g.val();
            if (!l.label && !l.message && !l.validator) {
                var n = g.closest("[class^='col-xs-']").prev();
                if (n.is("label")) {
                    l.label = n.text()
                }
            }
            if (!l.trim === false) {
                j = d.trim(j);
                g.val(j)
            }
            var o = l.message || "";
            if (j == "" && a && l.required) {
                if (!o) {
                    o = "输入的信息不能为空"
                }
                f = false
            }
            if (f && j != "") {
                if (d.isFunction(l.validator)) {
                    var m = l.validator(j);
                    if (d.isString(m) && d.isNotEmpty(m)) {
                        o = m;
                        f = false
                    } else {
                        if (d.isBoolean(m)) {
                            f = m;
                            return false
                        }
                    }
                }
                if (f && l.regExp) {
                    if (typeof l.regExp == "string") {
                        l.regExp = new RegExp(l.regExp)
                    }
                    if (!l.regExp.test(j)) {
                        if (!o) {
                            o = "输入的数据格式有误"
                        }
                        f = false
                    }
                }
                if (f && l.length) {
                    if (!e.rules.length.validator(j, l.length)) {
                        if (!o) {
                            if (!l.length[1]) {
                                o = "(" + l.length[0] + "位长度)"
                            } else {
                                o = "(" + l.length[0] + "～" + l.length[1] + "位长度)"
                            }
                            o = e.rules.length.message + o
                        }
                        f = false
                    }
                }
                if (f && l.equalTo) {
                    var k = c(l.equalTo).val();
                    if (l.trim) {
                        k = d.trim(k);
                        c(l.equalTo).val(k)
                    }
                    if (j != k) {
                        if (!o) {
                            o = "输入的信息不一致"
                        }
                        f = false
                    }
                }
                if (f && l.type && e.rules[l.type]) {
                    if (!e.rules[l.type].validator(j, l.decimal)) {
                        if (!o) {
                            o = e.rules[l.type].message
                        }
                        f = false
                    }
                }
            }
            if (!f) {
                if (l.renderTo) {
                    g = c(l.renderTo)
                }
                if (o) {
                    e.popover(g, o, l.label)
                }
                return false
            }
        }
        return true
    }
    c.extend(d.Form, {
        validate: function(l, j, h) {
            var g, f;
            if (d.isBoolean(l)) {
                a = l;
                g = j;
                f = h
            } else {
                a = true;
                g = l;
                f = j
            }
            if (d.isArray(g)) {
                for (var k = 0; k < g.length; k++) {
                    if (!b(g[k])) {
                        return false
                    }
                }
                return true
            } else {
                if (f || d.isObject(g)) {
                    return b(g, f)
                }
            }
            return e.validate(g)
        },
        setValidate: function(h, g) {
            if (d.isBoolean(h) && !h) {
                e.els = {}
            } else {
                if (!g) {
                    var g = h;
                    d.setValue(e, g, true);
                    if (e.autoMark && g.els) {
                        c.each(g.els,
                            function(i, l) {
                                var j = l.el ? c(l.el) : c("#" + i);
                                if (j.size() > 0) {
                                    if (l.required) {
                                        j.closest('[class^="col-"]').prepend('<span class="input-required"></span>')
                                    } else {
                                        j.closest('[class^="col-"]').find(".input-required").remove()
                                    }
                                }
                            })
                    }
                } else {
                    d.setValue(e, h, g);
                    if (e.autoMark) {
                        var f = g.el ? c(g.el) : c("#" + h);
                        if (f.size() > 0) {
                            if (g.required) {
                                f.closest('[class^="col-"]').prepend('<span class="input-required"></span>')
                            } else {
                                f.closest('[class^="col-"]').find(".input-required").remove()
                            }
                        }
                    }
                }
            }
        },
        validateMessage: function(g, h, f) {
            e.popover(g, h, f)
        }
    })
})(jQuery, _EBP_JS); (function($, _EBP_JS) {
    if (!_EBP_JS) {
        return
    }
    if (!_EBP_JS.Form) {
        _EBP_JS.Form = {}
    }
    function gridSelect(options) {
        var hasLeftTree = _EBP_JS.isNotEmpty(options.leftTree);
        var options = $.extend({
                key: "",
                title: "选择",
                width: hasLeftTree ? "800px": "700px",
                height: "350px",
                backdrop: "static",
                selectedShows: ["code", "name"],
                defaultSelecteds: [],
                ready: function($d, $g) {},
                success: function(data) {}
            },
            options);
        options.singleSelect = _EBP_JS.getValue(options, "datagrid.singleSelect", false);
        var selectedData = {};
        var $tree, $params, $grid, $selected, $selectedBtns;
        var treeBtnIndex = -1;
        var ti = (new Date()).getTime();
        var gridPanelId = "ebpgridselect_gp" + ti;
        var selectedPanelId = "ebpgridselect_sp" + ti;
        var $form = $('<div class="form-horizontal ' + _EBP_JS.cssPrefix + "-dialogform " + _EBP_JS.cssPrefix + '-grid-select"></div>');
        $form.append('<div class="form-group">' + (hasLeftTree ? '<div class="col-xs-3" style="border-right:1px solid #ddd;"><div class="grid-left-tree" style="overflow:auto;height:' + (parseInt(options.height) - 20) + 'px;"><ul></ul></div></div><div class="col-xs-6">': '<div class="col-xs-9">') + '<div id="' + gridPanelId + '"></div></div><div class="col-xs-3" style="border-left:1px solid #ddd;"><div id="' + selectedPanelId + '"><div class="grid-selected-panel"></div><div class="grid-selected-btns"><a href="#" title="置顶"><span class="glyphicon glyphicon-open top"></span></a><a href="#" title="上移"><span class="glyphicon glyphicon-arrow-up up"></span></a><a href="#" title="下移"><span class="glyphicon glyphicon-arrow-down down"></span></a><a href="#" title="置底"><span class="glyphicon glyphicon-download-alt bottom"></span></a><a href="#" title="移除"><span class="glyphicon glyphicon-remove remove"></span></a><a href="#" title="全选"><span class="glyphicon glyphicon-saved all"></span></a><a href="#" title="不选"><span class="glyphicon glyphicon-share-alt refresh"></span></a></div></div></div></div>');
        $form.height(options.height);
        var idField = _EBP_JS.getValue(options, "datagrid.idField", "id");
        var showFields = _EBP_JS.isString(options.selectedShows) ? [options.selectedShows] : options.selectedShows;
        var getSelectedShows = function(data) {
            var v = [];
            $.each(showFields,
                function(i, n) {
                    v.push(_EBP_JS.getValue(data, n, "&nbsp;"))
                });
            return v.join(" ")
        };
        _EBP_JS.dialog({
            key: "grid_select_" + options.key,
            title: options.title,
            content: $form,
            backdrop: options.backdrop,
            width: options.width,
            forceInit: true,
            ready: function($dialog) {
                var gWidth = $("#" + gridPanelId).width();
                var gHeight = parseInt(options.height) - 20;
                $selected = $("#" + selectedPanelId).find(".grid-selected-panel");
                $selectedBtns = $("#" + selectedPanelId).find(".grid-selected-btns");
                $selected.height(gHeight - $selectedBtns.outerHeight());
                var gridOptions = $.extend(true, {},
                    options, {
                        renderTo: "#" + gridPanelId,
                        width: "100%",
                        height: gHeight - 10,
                        datagrid: {
                            border: true,
                            onSelect: function(rowIndex, rowData) {
                                var span = $selected.find("span[dataId='" + rowData[idField] + "']");
                                if (span.size() == 0) {
                                    if (options.singleSelect) {
                                        $selected.children().remove();
                                        selectedData = {}
                                    }
                                    $selected.append("<span dataId='" + rowData[idField] + "'>" + getSelectedShows(rowData) + "</span>");
                                    selectedData[rowData[idField]] = rowData
                                }
                            },
                            onUnselect: function(rowIndex, rowData) {
                                var span = $selected.find("span[dataId='" + rowData[idField] + "']");
                                if (span.size() > 0) {
                                    span.remove()
                                }
                            },
                            onSelectAll: function(rows) {
                                $.each(rows,
                                    function(rowIndex, rowData) {
                                        var span = $selected.find("span[dataId='" + rowData[idField] + "']");
                                        if (span.size() == 0) {
                                            $selected.append("<span dataId='" + rowData[idField] + "'>" + getSelectedShows(rowData) + "</span>");
                                            selectedData[rowData[idField]] = rowData
                                        }
                                    })
                            },
                            onUnselectAll: function(rows) {
                                $.each(rows,
                                    function(rowIndex, rowData) {
                                        var span = $selected.find("span[dataId='" + rowData[idField] + "']");
                                        if (span.size() > 0) {
                                            span.remove()
                                        }
                                    })
                            },
                            onDblClickRow: function(rowIndex, rowData) {
                                if (options.singleSelect) {
                                    $selected.children().remove();
                                    selectedData = {};
                                    $selected.append("<span dataId='" + rowData[idField] + "'>" + getSelectedShows(rowData) + "</span>");
                                    selectedData[rowData.id] = rowData;
                                    $dialog.find(".btn-primary").click()
                                }
                            }
                        }
                    });
                $grid = _EBP_JS.form("datagrid", gridOptions);
                $grid.datagrid("resize");
                $.each(options.defaultSelecteds,
                    function(i, v) {
                        var span = $selected.find("span[dataId='" + v[idField] + "']");
                        if (span.size() == 0) {
                            if (options.singleSelect) {
                                $selected.children().remove();
                                selectedData = {}
                            }
                            $selected.append("<span dataId='" + v[idField] + "'>" + getSelectedShows(v) + "</span>");
                            selectedData[v[idField]] = v;
                            $grid.datagrid("selectRecord", v[idField])
                        }
                    });
                $selected.click(function(e) {
                    var _t = $(e.target);
                    if (_t.is("span")) {
                        if (_t.is(".selected")) {
                            _t.removeClass("selected")
                        } else {
                            _t.addClass("selected")
                        }
                    }
                });
                $selectedBtns.find("a").click(function() {
                    var selecteds = $selected.find(".selected");
                    var sSize = selecteds.size();
                    var btnIndex = $(this).index();
                    if (btnIndex == 5) {
                        $selected.find("span:not(.selected)").addClass("selected")
                    } else {
                        if (sSize == 0) {
                            return
                        }
                    }
                    var selectAll = sSize == $selected.find("span").size();
                    if (btnIndex == 0 && !selectAll) {
                        var _c = selecteds.clone();
                        selecteds.remove();
                        _c.insertBefore($selected.find("span:first"))
                    } else {
                        if (btnIndex == 3 && !selectAll) {
                            var _c = selecteds.clone();
                            selecteds.remove();
                            _c.insertAfter($selected.find("span:last"))
                        } else {
                            if (btnIndex == 1 && !selectAll) {
                                selecteds.not(":first-child").each(function() {
                                    var _c = $(this).clone();
                                    var _p = $(this).prev();
                                    if (!_p.is(".selected")) {
                                        _c.insertBefore(_p);
                                        $(this).remove()
                                    }
                                })
                            } else {
                                if (btnIndex == 2 && !selectAll) {
                                    var reverse = [];
                                    selecteds = selecteds.not(":last-child");
                                    for (var i = selecteds.size() - 1; i >= 0; i--) {
                                        reverse.push(selecteds[i])
                                    }
                                    for (var i = 0; i < reverse.length; i++) {
                                        var _c = $(reverse[i]).clone();
                                        var _n = $(reverse[i]).next();
                                        if (!_n.is(".selected")) {
                                            _c.insertAfter(_n);
                                            $(reverse[i]).remove()
                                        }
                                    }
                                } else {
                                    if (btnIndex == 4) {
                                        selecteds.remove();
                                        $grid.datagrid("clearSelections")
                                    } else {
                                        if (btnIndex == 6) {
                                            selecteds.removeClass("selected")
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
                if (hasLeftTree) {
                    var $tree;
                    var treeOptions = $.extend({
                            idParamName: "pid",
                            datagridParamName: "pid",
                            lines: true,
                            onBeforeLoad: function(node, param) {
                                if (node) {
                                    if (!param) {
                                        param = {}
                                    }
                                    param[treeOptions.idParamName] = node.id
                                }
                            },
                            onSelect: function(node) {
                                var datagridParam = {};
                                datagridParam[treeOptions.datagridParamName] = node.id;
                                _EBP_JS.form("datagridLoad", $grid, datagridParam)
                            }
                        },
                        options.leftTree);
                    $tree = $dialog.find(".grid-left-tree ul").tree(treeOptions)
                }
                $dialog.find("a[href='#']").attr("href", "javascript:void(0)");
                if (options.ready) {
                    options.ready($dialog, $grid)
                }
            },
            success: function($dialog) {
                var _data = [];
                $selected.find("span").each(function() {
                    _data.push(selectedData[$(this).attr("dataId")])
                });
                if (_data.length == 0) {
                    alert("尚未选择任何记录");
                    return false
                }
                if (typeof options.success == "function") {
                    var _r = options.success(_data);
                    if (_EBP_JS.isBoolean(_r) && !_r) {
                        return false
                    }
                }
                return true
            }
        })
    }
    function linkSelect(options) {
        var dp = {
            data: [],
            url: "",
            para: {},
            async: true,
            editable: true,
            valueField: "",
            level: "",
            textField: "",
            defualtValue: "",
            width: "100%",
            height: "200px",
            tabClk: function(node) {},
            itemAfterClk: function(node) {},
            itemBeforeClk: function(node) {},
            leafClk: function(node) {},
            _k: function(node) {}
        };
        var di = {
            isLeaf: false
        };
        var opt = $.extend({},
            dp, options || {});
        var s = $(options.renderTo);
        var $o = {};
        load();
        function load() {
            $o = _i();
            _m(opt)
        }
        function _i() {
            s.hide();
            var g = $("<div class='dropdown downlist-group'></div>");
            var c = $("<div class='input-group' data-toggle='dropdown'></div>");
            var m = $("<input class='form-control' readonly='readonly'/>");
            var b = $('<div class="input-group-btn"><a class="btn btn-default"><span class="glyphicon glyphicon-chevron-down"></span></a></div>');
            var l = $('<div class="dropdown-menu" style="min-width:' + opt.width + ";max-height:" + opt.height + ';overflow-y:auto;"></div>');
            var u = $('<ul class="nav nav-tabs"></ul>');
            var i = $('<div style="padding:5px"></div>');
            g.append(c).append(l.append(u).append(i));
            c.append(m).append(b);
            if (!opt.editable) {
                m.bind("click",
                    function(e) {
                        e.preventDefault();
                        e.stopPropagation()
                    });
                b.bind("click",
                    function(e) {
                        e.preventDefault();
                        e.stopPropagation()
                    })
            }
            s.after(g);
            var _df = [];
            if (opt.defualtValue && opt.defualtValue != null) {
                _df = opt.defualtValue.split(",")
            }
            return {
                v: m,
                l: l,
                u: u,
                i: i,
                d: _df
            }
        }
        function _m(dp) {
            if (dp.data && dp.data.length > 0) {
                var json = [];
                if (typeof(dp.data) == "string" && dp.data.indexOf("[") >= 0) {
                    json = eval("(" + dp.data + ")")
                } else {
                    if (typeof(dp.data) == "string" && dp.data.indexOf("[") < 0) {
                        json = eval("([" + dp.data + "])")
                    } else {
                        json = dp.data
                    }
                }
                opt._k = function(item) {
                    _static(dp, item.child)
                };
                _static(dp, json)
            } else {
                if (dp.url && dp.url != "") {
                    if (opt.async) {
                        opt._k = function(item) {
                            _ajax(dp, item)
                        }
                    } else {
                        opt._k = function(item) {
                            _static(dp, item.child)
                        }
                    }
                    _ajax(dp)
                } else {
                    alert("请先定义数据来源")
                }
            }
        }
        function _ajax(dp, item) {
            var _p = dp.para;
            if (item && item.id) {
                _p = $.extend(dp.para, {
                    _pid: item.id
                })
            }
            $.ajax({
                type: "post",
                url: dp.url,
                data: _p,
                success: function(data) {
                    var json = [];
                    try {
                        if (typeof(data) == "string") {
                            json = eval("(" + data + ")")
                        } else {
                            json = data
                        }
                        item.child(json)
                    } catch(e) {}
                    _d(dp, json)
                }
            })
        }
        function _static(dp, data) {
            _d(dp, data)
        }
        function _d(dp, d) {
            if (!d || d.length <= 0) {
                return
            }
            var idx = $o.u.find("li").length + 1;
            var _t = $('<li role="presentation" _idx="' + idx + '" class="active"><a href="javascript:;">请选择</a></li>');
            var _i = $('<ul class="nav nav-pills" _idx="' + idx + '" role="tablist"></ul>');
            $o.u.append(_t);
            $o.i.append(_i);
            _show(idx);
            _t.bind("click",
                function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    _show($(this).attr("_idx"));
                    var item = $(this).data("_item");
                    opt.tabClk(getNode(item, $(this).attr("_idx")))
                });
            var _def = "";
            if ($o.d && $o.d.length > -1) {
                _def = $o.d[0];
                $o.d.splice(0, 1)
            }
            for (var x = 0; x < d.length; x++) {
                var node = $.extend({},
                    di, d[x] || {});
                var item = $('<li role="presentation" ><a href="javascript:;">' + d[x].text + "</a></li>");
                _i.append(item);
                item.data("item", node);
                item.bind("click",
                    function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var _item = $(this).data("item");
                        var _idx = $(this).parent().attr("_idx");
                        $(this).siblings().removeClass("active");
                        $(this).addClass("active");
                        $o.u.find("li[_idx=" + _idx + "]").find("a").html(_item.text);
                        $o.u.find("li[_idx=" + _idx + "]").data("item", _item);
                        _remove(_idx);
                        opt.itemBeforeClk(getNode(_item, _idx));
                        _level(_idx, _item);
                        opt.itemAfterClk(getNode(_item, _idx))
                    });
                if (_def && _def != "") {
                    if (node.id == _def) {
                        item.click()
                    }
                }
            }
        }
        function getNode(i, idx) {
            if (i) {
                return {
                    id: i.id,
                    text: i.text,
                    level: idx,
                    attrs: i
                }
            } else {
                return {}
            }
        }
        function _show(idx) {
            var _tab = $o.u.find("li[_idx='" + idx + "']");
            var _item = $o.i.find("ul[_idx='" + idx + "']");
            _tab.siblings().removeClass("active");
            _tab.addClass("active");
            _item.siblings().hide();
            _item.show()
        }
        function _remove(idx) {
            var _tab = $o.u.find("li[_idx='" + idx + "']");
            var _item = $o.i.find("ul[_idx='" + idx + "']");
            _tab.nextAll().remove();
            _item.nextAll().remove()
        }
        function _setValue(item) {
            if (opt.valueField && opt.valueField != null) {
                s.val(item[opt.valueField])
            } else {
                s.val(item.id)
            }
            if (opt.textField && opt.textField != null) {
                $o.v.val(item[opt.textField])
            } else {
                $o.v.val(item.text)
            }
        }
        function _clear() {
            s.val("");
            $o.v.val("")
        }
        function _level(_idx, _item) {
            _clear();
            var _level = opt.level;
            if (!_level || _level == "" || _level == "0") {
                _level = "<999"
            }
            if (/^[1-9]+$/g.test(_level)) {
                _level = "<" + (Number(_level) + 1)
            }
            if (/^[=<>][1-9]+$/g.test(_level)) {
                if (/^[=][1-9]+$/g.test(_level)) {
                    if (eval((Number(_idx) + 1) + "<" + _level)) {
                        opt._k(_item)
                    }
                    if (eval(_idx + "=" + _level)) {
                        _setValue(_item)
                    }
                } else {
                    if (/^[=>][1-9]+$/g.test(_level) || eval((Number(_idx) + 1) + _level)) {
                        opt._k(_item)
                    }
                    if (eval(_idx + _level)) {
                        _setValue(_item)
                    }
                }
            } else {
                if (/^[=]?[0]$/g.test(_level)) {
                    if (_item.isLeaf) {
                        _setValue(_item)
                    }
                    opt._k(_item)
                } else {
                    alert("LEVEL参数格式不正确")
                }
            }
        }
    }
    function areaSelect(options) {
        var options = $.extend({
                root: "",
                fields: [],
                grades: [1, 2, 3, 4, 5, 6],
                url: _EBP_JS.basePath() + "/af/m0/m0021/service/list.do"
            },
            options);
        var render = function(fieldSet, param, idx) {
            _EBP_JS.form("dropdown", $.extend({
                    href: options.url,
                    queryParams: param,
                    valueDField: "id",
                    textDField: "name",
                    onSelect: function(val) {
                        var i = idx;
                        while (options.fields[++i]) {
                            $(options.fields[i].valueField).val("");
                            $(options.fields[i].textField).val("");
                            render(options.fields[i], {
                                    pid: val || options.root,
                                    grade: options.grades[i] || ""
                                },
                                i)
                        }
                    }
                },
                fieldSet))
        };
        $.each(options.fields,
            function(i, fieldSet) {
                var pid = i > 0 ? ($(options.fields[i - 1].valueField).val() || "[X]") : options.root;
                render(fieldSet, {
                        pid: pid,
                        grade: options.grades[i] || ""
                    },
                    i)
            })
    }
    $.extend(_EBP_JS.Form, {
        linkSelect: function(options) {
            linkSelect(options)
        },
        gridSelect: function(options) {
            gridSelect(options)
        },
        areaSelect: function(options) {
            areaSelect(options)
        }
    })
})(jQuery, _EBP_JS); (function($, _EBP_JS) {
    if (!_EBP_JS) {
        return
    }
    if (!_EBP_JS.Form) {
        _EBP_JS.Form = {}
    }
    var _file_uploader = "";
    function fileUpload(_options) {
        _options = $.extend({
                backdrop: "static",
                allowTypes: [],
                enableSelect: false,
                enableUsed: false,
                singleSelect: true,
                maxSize: 10240
            },
            _options);
        var success = _options.success ||
            function(data) {};
        var error = _options.error ||
            function(msg) {
                alert(msg)
            };
        var singleSelect = _options.singleSelect;
        var returns = _options.returns ? _options.returns: ["id", "originalName", "extType", "fileSize", "path"];
        var allowTypes = _options.allowTypes.length ? _options.allowTypes: ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "rar", "zip", "pdf", "jpg", "jepg", "gif", "png", "txt"];
        if (_options.enableUsed) {
            _options.enableSelect = true
        }
        var _isAllowType = function(v) {
            for (var i = 0; i < allowTypes.length; i++) {
                if (v.toLowerCase() == allowTypes[i]) {
                    return true
                }
            }
            return false
        };
        if (!_file_uploader) {
            _file_uploader = "_" + new Date().getTime()
        }
        var upload_url = _EBP_JS.basePath() + "attachment/upload.do";//废弃：/oa/service/attach/upload.do
        var download_url = _EBP_JS.basePath() + "attachment/download.do";//废弃：/oa/service/attach/download.do
        var list_url = _EBP_JS.basePath() + "attachment/list.do?countUsed=true";//废弃：/oa/service/attach/list.do?countUsed=true
        var class_list_url = _EBP_JS.basePath() + "attachment/classList.do";//废弃：/oa/service/attach/classList.do
        var target = "_ebp_upload_iframe" + _file_uploader;
        var _maxSize = _options.maxSize > 1024 ? (Math.ceil(_options.maxSize / 1024 * 100) / 100 + "MB") : (_options.maxSize + "KB");
        var html = '<ul class="nav nav-tabs"><li class="active"><a href="#upload_tab' + _file_uploader + '" data-toggle="tab">文件上传</a></li><li><a href="#att_list_tab' + _file_uploader + '" data-toggle="tab">我的附件库</a></li></ul><div class="tab-content"><div class="tab-pane active ' + _EBP_JS.cssPrefix + '-uploadify-form" id="upload_tab' + _file_uploader + '"><iframe name="' + target + '" style="display:none;"></iframe><form method="post" enctype="multipart/form-data" class="form-horizontal" style="margin-top:15px" target="' + target + '" action="' + upload_url + '"><div class="form-group"><label class="col-xs-2 control-label">选择文件</label><div class="col-xs-8"><input type="hidden" value="' + _options.maxSize + '" name="maxSize"><input type="file" id="upload_file' + _file_uploader + '" name="file" ' + (singleSelect ? "": 'multiple="multiple"') + '><div id="upload_file_list' + _file_uploader + '"></div></div><div class="col-xs-2 classify-show"><a href="javascript:void(0)" class="btn btn-link">添加分类</a></div></div><div class="form-group classify-panel" style="display:none"><label class="col-xs-2 control-label">文件分类</label><div class="col-xs-10"><input type="text" name="classify" class="form-control"></div></div><div class="form-group"><div class="col-xs-10 col-xs-offset-1"><span class="help-block">附件大小不超过' + _maxSize + '，格式要求：<span></span></span></div></div></form></div><div class="tab-pane active" id="att_list_tab' + _file_uploader + '"></div></div>';
        return _EBP_JS.dialog({
            key: _file_uploader,
            title: "附件上传",
            content: html,
            forceInit: true,
            backdrop: _options.backdrop,
            width: "700px",
            ready: function($d) {
                $d.find(".help-block span").html(allowTypes.join("/"));
                $d.find(".classify-show a").click(function() {
                    $d.find(".classify-panel").show()
                });
                $d.find("#upload_file" + _file_uploader).change(function() {
                    var oFile = document.getElementById("upload_file" + _file_uploader);
                    var $list = $("#upload_file_list" + _file_uploader);
                    $list.empty();
                    if (oFile.files) {
                        var idx = 1;
                        $.each(oFile.files,
                            function() {
                                $list.append('<span style="color:#000099;display:block;margin:3px">' + (idx++) + ". " + this.name + "</span>")
                            })
                    }
                });
                $d.find("iframe").unbind().bind("load",
                    function() {
                        var doc = $d.find("iframe")[0].contentDocument || $d.find("iframe")[0].contentWindow.document;
                        var data;
                        var str = doc.body.innerHTML;
                        if (str.replace(/ |\r|\n/, "")) {
                            try {
                                data = eval("(" + str + ")");
                                if (data) {
                                    if (data.success) {
                                        success(data.data);
                                        $d.modal("hide")
                                    } else {
                                        error(data.error)
                                    }
                                }
                            } catch(e) {
                                error("附件上传失败，附件大小超过系统限制或者网络异常")
                            }
                        }
                    });
                $d.find(".nav-tabs a:first").click(function() {
                    $d.find("#att_search" + _file_uploader).hide()
                });
                $d.find(".nav-tabs a:last").click(function() {
                    var $list = $("#att_list_tab" + _file_uploader);
                    if ($list.html() == "") {
                        var str = '<div style="width:100%;height:230px"><table id="att_list' + _file_uploader + '"></table></div>';
                        $list.append(str);
                        str = '<div style="width:320px;position:absolute;right:20px;top:12px;display:none" id="att_search' + _file_uploader + '"><select style="width:200px" class="att-classify"><option value="">全部类型</option><option value="[NULL]">*[未分类]*</option></select><select style="width:100px" class="att-status"><option value="0">未使用</option><option value="1">使用中</option><option value="-1">所有状态</option></select>';
                        $d.find(".modal-body").append(str);
                        $("#att_list" + _file_uploader).datagrid({
                            fit: true,
                            striped: true,
                            method: "POST",
                            rownumbers: true,
                            pageSize: 15,
                            pagination: true,
                            pageList: [5, 15, 30, 50],
                            border: false,
                            fitColumns: true,
                            singleSelect: singleSelect,
                            url: list_url,
                            idField: "id",
                            columns: [[{
                                field: "id",
                                checkbox: true,
                                hidden: !_options.enableSelect
                            },
                                {
                                    field: "originalName",
                                    title: "文件名称",
                                    width: 200,
                                    align: "center"
                                },
                                {
                                    field: "createDate",
                                    title: "上传时间",
                                    width: 120,
                                    align: "center"
                                },
                                {
                                    field: "extType",
                                    title: "类型",
                                    width: 60,
                                    align: "center"
                                },
                                {
                                    field: "fileSize",
                                    title: "大小",
                                    width: 60,
                                    align: "center"
                                },
                                {
                                    field: "classify",
                                    title: "分类",
                                    width: 80,
                                    align: "center"
                                },
                                {
                                    field: "usedCount",
                                    title: "使用",
                                    width: 50,
                                    align: "center"
                                },
                                {
                                    field: "_action",
                                    title: "#",
                                    width: 60,
                                    align: "center",
                                    formatter: function(value, row) {
                                        return "<a target='_blank' href='" + download_url + "?id=" + row.id + "' style='color:#3333CC;'>查看</a>"
                                    }
                                }]],
                            onSelect: function(rowIndex, rowData) {
                                if (!_options.enableSelect || (!_options.enableUsed && rowData.usedCount > 0)) {
                                    $("#att_list" + _file_uploader).datagrid("unselectRow", rowIndex)
                                }
                            },
                            onSelectAll: function(rows) {
                                if (!_options.enableSelect || !_options.enableUsed) {
                                    $.each(rows,
                                        function(i, row) {
                                            if (row.usedCount > 0) {
                                                $("#att_list" + _file_uploader).datagrid("unselectRow", i)
                                            }
                                        })
                                }
                            },
                            onLoadSuccess: function(data) {
                                if (_options.enableSelect && !_options.enableUsed) {
                                    var _checkboxs = $("#att_list" + _file_uploader).datagrid("getPanel").find("table :checkbox");
                                    $.each(data.rows,
                                        function(i, row) {
                                            if (row.usedCount > 0) {
                                                _checkboxs.eq(i + 1).remove()
                                            }
                                        })
                                }
                            }
                        });
                        $.get(class_list_url + "?t" + new Date().getTime(), "",
                            function(data) {
                                if (data.length) {
                                    var ss = "";
                                    $.each(data,
                                        function(i, v) {
                                            ss += '<option value="' + v + '">' + v + "</option>"
                                        });
                                    $("#att_search" + _file_uploader + " .att-classify").append(ss)
                                }
                                $("#att_search" + _file_uploader + " select").unbind().change(function() {
                                    $("#att_list" + _file_uploader).datagrid("load", {
                                        classify: $("#att_search" + _file_uploader + " .att-classify").val(),
                                        usedStatus: $("#att_search" + _file_uploader + " .att-status").val()
                                    })
                                })
                            })
                    }
                    $d.find("#att_search" + _file_uploader).show()
                })
            },
            success: function($d) {
                if ($d.find(".nav-tabs li:first").is(".active")) {
                    var oFile = document.getElementById("upload_file" + _file_uploader);
                    if (!oFile.value) {
                        alert("请选择上传的文件")
                    } else {
                        var oFile = document.getElementById("upload_file" + _file_uploader);
                        var arrNames = [];
                        if (oFile.files) {
                            $.each(oFile.files,
                                function() {
                                    arrNames.push(this.name)
                                })
                        } else {
                            arrNames.push(oFile.value)
                        }
                        for (var i = 0; i < arrNames.length; i++) {
                            var arr = arrNames[i].split(".");
                            if (!_isAllowType(arr[arr.length - 1])) {
                                alert("选择的文件格式不正确\n（格式要求：" + allowTypes.join("/") + "）");
                                return false
                            }
                        }
                        $d.find("#upload_tab" + _file_uploader + " form")[0].submit()
                    }
                    return false
                } else {
                    var data = $("#att_list" + _file_uploader).datagrid("getSelections");
                    if (data.length) {
                        var r = [];
                        $.each(data,
                            function(i, d) {
                                var _d = {};
                                $.each(returns,
                                    function(j, k) {
                                        _d[k] = d[k]
                                    });
                                r.push(_d)
                            });
                        return success(r)
                    } else {
                        alert("请选择或者上传需要的文件");
                        return false
                    }
                }
            }
        })
    }
    function uploadify(arg) {
        var arg = arg || [{}];
        var arr = _EBP_JS.isArray(arg) ? arg: [arg];
        $.each(arr,
            function(i, o) {
                var options = $.extend({
                        backdrop: "static",
                        editable: false,
                        deletable: true,
                        allowTypes: [],
                        enableSelect: false,
                        enableUsed: false,
                        singleSelect: true,
                        trueDelete: false,
                        cannotDelete: {},
                        refParam: {},
                        maxLength: 0,
                        attachCount: 0,
                        singleQuote: true,
                        showImage: false,
                        attachIcon: true,
                        imageStyle: "",
                        listItemStyle: "",
                        success: false
                    },
                    o);
                if (options.showImage) {
                    if (!options.imageStyle) {
                        options.imageStyle = "margin:5px auto;max-height:200px;max-width:100%"
                    }
                    if (!options.listItemStyle) {
                        options.listItemStyle = "margin:auto"
                    }
                    options.attachIcon = false
                }
                var input = o.renderTo || ".attach-input";
                var $scope = options.$scope || $("body");
                $(input).each(function() {
                    var $target = $(this);
                    $target.hide();
                    var _options = $(this).data("options");
                    if (_options) {
                        if (typeof _options == "string") {
                            _options = eval("({" + _options + "})")
                        }
                        _options = $.extend({},
                            options, _options)
                    } else {
                        _options = $.extend({},
                            options)
                    }
                    var $list;
                    if ($target.next().is("div.attach-list")) {
                        $list = $target.next();
                        $list.empty()
                    } else {
                        $list = $("<div class='attach-list'></div>");
                        $target.after($list)
                    }
                    if (_options.editable) {
                        $list.append("<a class='attach-upload'>添加文件..</a>")
                    }
                    var cannotDelete = {};
                    if (_EBP_JS.isArray(_options.cannotDelete)) {
                        var arrIds = [];
                        if (_EBP_JS.isObject(_options.cannotDelete[0])) {
                            arrIds = _EBP_JS.getListValue(_options.cannotDelete, "id", true)
                        } else {
                            arrIds = _options.cannotDelete
                        }
                        $.each(arrIds,
                            function(i, v) {
                                cannotDelete[v] = true
                            })
                    }
                    var dd = $(this).val();
                    if (dd) {
                        dd = eval("(" + dd + ")");
                        $list.append(_getListHtml(dd, _options, cannotDelete))
                    }
                    if (_options.editable) {
                        $list.find(".attach-upload").click(function() {
                            fileUpload($.extend({},
                                _options, {
                                    success: function(data) {
                                        var _dd = [];
                                        if ($target.val()) {
                                            _dd = eval("(" + $target.val() + ")")
                                        }
                                        if (_options.singleSelect && _dd.length > 0) {
                                            if (_dd[0].id != data[0].id) {
                                                if (_options.trueDelete) {
                                                    _trueDelete(_dd[0].id, _options.refParam)
                                                }
                                                $list.find(".attach-list-item").remove();
                                                _dd = []
                                            } else {
                                                return true
                                            }
                                        }
                                        var ids = _parseIds(_dd);
                                        var _ndd = [];
                                        $.each(data,
                                            function(i, dd) {
                                                if (!ids[dd.id]) {
                                                    _dd.push(dd);
                                                    _ndd.push(dd)
                                                }
                                            });
                                        if (_options.attachCount && _options.attachCount > 0) {
                                            if (_dd.length > _options.attachCount) {
                                                alert("附件上传个数超过限制，最多可上传 " + _options.maxSize + " 个！");
                                                return false
                                            }
                                        }
                                        var _value = _EBP_JS.stringify(_dd);
                                        if (_options.singleQuote) {
                                            _value = _value.replace(/\"/g, "'")
                                        }
                                        if (_options.maxLength && _options.maxLength > 0) {
                                            if (_value.length > _options.maxLength) {
                                                alert("附件上传个数超过限制，或者附件名称过长");
                                                return false
                                            }
                                        }
                                        $target.val(_value);
                                        $list.append(_getListHtml(_ndd, _options, cannotDelete));
                                        if (_options.success) {
                                            _options.success($target, data, _dd, $list)
                                        }
                                        return true
                                    }
                                }))
                        });
                        $list.delegate(".attach-delete", "click",
                            function() {
                                if (_options.trueDelete) {
                                    _trueDelete($(this).parent().data("id"), _options.refParam,
                                        function() {
                                            _removeItem($(this).parent(), $target)
                                        })
                                } else {
                                    _removeItem($(this).parent(), $target)
                                }
                            })
                    }
                    $list.delegate(".attach-item", "click",
                        function() {
                            window.open(_EBP_JS.basePath() + "/oa/service/attach/download.do?id=" + $(this).parent().data("id"))
                        })
                })
            });
        function _getListHtml(data, opts, cannotDelete) {
            var html = "";
            var editable = opts.editable;
            var deletable = opts.deletable;
            $.each(data,
                function(i, att) {
                    html += "<div class='attach-list-item' data-id='" + att.id + "'" + (opts.listItemStyle ? " style='" + opts.listItemStyle + "'": "") + ">" + (opts.attachIcon ? "<span class='attach-icon'></span>": "") + "<span class='attach-item'><a href='#'>" + (opts.showImage ? ("<img src='" + (/^https?:/.test(att.path) ? att.path: _EBP_JS.basePath() + "/oa/service/attach/download.do?id=" + att.id) + "'" + (opts.imageStyle ? " style='" + opts.imageStyle + "'": "") + "' />") : att.originalName) + "</a></span>" + (editable && deletable && !cannotDelete[att.id] ? "<span class='attach-delete' title='删除'></span>": "") + "</div>"
                });
            return html
        }
        function _trueDelete(id, refParam, callback) {
            var param = {
                attId: id
            };
            if (typeof refParam == "object") {
                $.extend(param, refParam)
            } else {
                if (typeof refParam == "function") {
                    $.extend(param, refParam())
                }
            }
            $.post(_EBP_JS.basePath() + "/oa/service/ref/delete.do", param,
                function(data) {
                    if (data && data.success && callback) {
                        callback()
                    }
                })
        }
        function _parseIds(d) {
            var ids = {};
            if (d) {
                $.each(d,
                    function(i, a) {
                        ids[a.id] = true
                    })
            }
            return ids
        }
        function _removeItem($item, $target) {
            var data = eval("(" + $target.val() + ")");
            var removeId = $item.data("id");
            var _dd = [];
            $.each(data,
                function(i, dd) {
                    if (removeId != dd.id) {
                        _dd.push(dd)
                    }
                });
            if (_dd.length == 0) {
                $target.val("")
            } else {
                $target.val(_EBP_JS.stringify(_dd).replace(/\"/g, "'"))
            }
            $item.remove()
        }
    }
    function sampleUpload(_options) {
        _options = $.extend({
                title: "文件上传",
                backdrop: "static",
                allowTypes: [],
                maxSize: 10240,
                singleSelect: true,
                url: _EBP_JS.basePath() + "attachment/upload.do"
            },
            _options);
        var singleSelect = _options.singleSelect;
        var success = _options.success ||
            function(data) {};
        var error = _options.error ||
            function(msg) {
                alert(msg)
            };
        var returns = _options.returns ? _options.returns: ["id", "originalName", "extType", "fileSize", "path"];
        var allowTypes = _options.allowTypes.length ? _options.allowTypes: ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "rar", "zip", "pdf", "jpg", "jepg", "gif", "png", "txt"];
        var _isAllowType = function(v) {
            for (var i = 0; i < allowTypes.length; i++) {
                if (v.toLowerCase() == allowTypes[i]) {
                    return true
                }
            }
            return false
        };
        if (!_file_uploader) {
            _file_uploader = "_" + new Date().getTime()
        }
        var upload_url = _options.url;
        var target = "_ebp_s_upload_iframe" + _file_uploader;
        var _maxSize = _options.maxSize > 1024 ? (Math.ceil(_options.maxSize / 1024 * 100) / 100 + "MB") : (_options.maxSize + "KB");
        var html = '<div class="tab-pane active ' + _EBP_JS.cssPrefix + '-uploadify-form"><iframe name="' + target + '" style="display:none;"></iframe><form method="post" enctype="multipart/form-data" class="form-horizontal" style="margin-top:15px" target="' + target + '" action="' + upload_url + '"><div class="form-group"><label class="col-xs-2 control-label">选择文件</label><div class="col-xs-10"><input type="hidden" value="' + _options.maxSize + '" name="maxSize"><input type="file" name="file" ' + (singleSelect ? "": 'multiple="true"') + '></div></div><div class="form-group"><div class="col-xs-10 col-xs-offset-1"><span class="help-block">附件大小不超过' + _maxSize + "，格式要求：<span></span></span></div></div></form></div>";
        return _EBP_JS.dialog({
            key: _file_uploader,
            title: _options.title,
            content: html,
            forceInit: true,
            backdrop: _options.backdrop,
            width: "700px",
            ready: function($d) {
                $d.find(".help-block span").html(allowTypes.join("/"));
                $d.find(".classify-show a").click(function() {
                    $d.find(".classify-panel").show()
                });
                $d.find("iframe").unbind().bind("load",
                    function() {
                        var doc = $d.find("iframe")[0].contentDocument || $d.find("iframe")[0].contentWindow.document;
                        var data;
                        var str = doc.body.innerHTML;
                        if (str.replace(/ |\r|\n/, "")) {
                            try {
                                data = eval("(" + str + ")");
                                if (data) {
                                    if (data.success) {
                                        success(data.data);
                                        $d.modal("hide")
                                    } else {
                                        error(data.error)
                                    }
                                }
                            } catch(e) {
                                error("附件上传失败，附件大小超过系统限制或者网络异常")
                            }
                        }
                    })
            },
            success: function($d) {
                var fileName = $d.find("input:file").val();
                if (fileName == "") {
                    alert("请选择上传的文件")
                } else {
                    var arr = fileName.split(".");
                    if (!_isAllowType(arr[arr.length - 1])) {
                        alert("文件格式不支持\n（格式要求：" + allowTypes.join("/") + "）");
                        return false
                    }
                    $d.find("form")[0].submit()
                }
                return false
            }
        })
    }
    var _ex_file_uploader;
    function dataImport(options) {
        var options = $.extend({
                backdrop: "static",
                template: "",
                templateUrl: "",
                templateHelpBlock: "",
                params: {},
                submitUrl: "",
                allowTypes: ["xls", "xlsx"],
                success: function(data) {
                    alert("导入操作完成")
                },
                error: function(msg) {
                    alert(msg)
                }
            },
            options);
        var allowTypes = options.allowTypes;
        var templateHelpBlock = options.templateHelpBlock || ["1、请严格按照Excel模板整理数据", "2、导入文件仅支持[" + allowTypes.join(",") + "]格式"];
        var _isAllowType = function(v) {
            for (var i = 0; i < allowTypes.length; i++) {
                if (v.toLowerCase() == allowTypes[i]) {
                    return true
                }
            }
            return false
        };
        if (!_ex_file_uploader) {
            _ex_file_uploader = "_" + new Date().getTime()
        }
        var upload_url = options.submitUrl;
        var download_url = options.templateUrl;
        if (!download_url && options.template) {
            download_url = _EBP_JS.basePath() + "/oa/service/system/dataImport/template.do?template=" + encodeURIComponent(encodeURIComponent(options.template))
        }
        var target = "_ebp_ex_upload_iframe" + _ex_file_uploader;
        var html = '<div><iframe name="' + target + '" style="display:none;"></iframe><form method="post" enctype="multipart/form-data" class="form-horizontal" style="margin-top:15px" target="' + target + '" action="' + upload_url + '"><div class="form-group"><label class="col-xs-3 control-label">选择Excel文件</label><div class="col-xs-9"><input type="file" name="file" style="width:50%;float:left"></div></div><div class="form-group"><label class="col-xs-3 control-label">模板说明</label><div class="col-xs-9">' + (download_url ? '<a class="btn btn-link" href="' + download_url + '" target="_blank">点击下载Excel模板</a>': "") + '<span class="help-block">' + templateHelpBlock.join('</span><span class="help-block">') + "</span></div></div></form></div>";
        _EBP_JS.dialog({
            key: _ex_file_uploader,
            title: "Excel导入",
            content: html,
            forceInit: true,
            backdrop: options.backdrop,
            width: "600px",
            ready: function($d) {
                if (_EBP_JS.isNotEmpty(options.params)) {
                    var $formParams = $("<div style='display: none'></div>");
                    $.each(options.params,
                        function(n, v) {
                            var $i = $("<input type='hidden' name='" + n + "'>");
                            $i.val(v);
                            $formParams.append($i)
                        });
                    $d.find("form").append($formParams)
                }
                var $win = window;
                $d.find("iframe").unbind().bind("load",
                    function() {
                        var doc = $d.find("iframe")[0].contentDocument || $d.find("iframe")[0].contentWindow.document;
                        var data;
                        var str = doc.body.innerHTML;
                        if (str.replace(/ |\r|\n/, "")) {
                            try {
                                data = eval("(" + str + ")");
                                if (data) {
                                    if (data.success) {
                                        if (options.success) {
                                            options.success(data.data)
                                        }
                                        $d.modal("hide")
                                    } else {
                                        options.error(data.error)
                                    }
                                }
                            } catch(e) {
                                options.error("系统错误，操作失败")
                            }
                        }
                        $win._EBP_JS.showMask(false)
                    })
            },
            success: function($d) {
                var fileName = $d.find("form input:file").val();
                if (fileName == "") {
                    alert("请选择Excel导入文件")
                } else {
                    var arr = fileName.split(".");
                    if (!_isAllowType(arr[arr.length - 1])) {
                        alert("文件格式不支持，请选择[" + allowTypes.join(",") + "]文件");
                        return false
                    }
                    _EBP_JS.showMask("执行中...");
                    window.setTimeout(function() {
                            $d.find("form")[0].submit()
                        },
                        50)
                }
                return false
            }
        })
    }
    function dataImportForm(options) {
        var options = $.extend({
                title: "数据导入",
                imKey: "TEMPLATE",
                formNumber: "",
                submitUrl: "",
                templateUrl: "",
                template: "",
                logSelect: true,
                errorRollback: false,
                dialogWidth: "80%",
                fitColumns: false,
                fieldsLabel: [],
                trueDelete: false,
                showSuccessList: true,
                formData: "",
                success: function(data) {}
            },
            options);
        function _format(n) {
            return n < 10 ? ("0" + n) : ("" + n)
        }
        var gridColumns = [{
            field: "id",
            checkbox: true
        }];
        var formFields = [[{
            name: "id",
            hidden: true
        }]];
        var formFields0 = [];
        $.each(options.fieldsLabel,
            function(i, label) {
                gridColumns.push({
                    field: "imInfo" + _format(i + 1),
                    title: label,
                    width: 100,
                    align: "center",
                    sortable: true
                });
                formFields0.push({
                    name: "imInfo" + _format(i + 1),
                    label: label
                });
                if (formFields0.length == 2) {
                    formFields.push(formFields0);
                    formFields0 = []
                }
            });
        if (formFields0.length > 0) {
            formFields.push(formFields0)
        }
        gridColumns.push({
            field: "createDate",
            title: "上传时间",
            width: 100,
            align: "center",
            sortable: true
        });
        gridColumns.push({
            field: "updateDate",
            title: "最后操作时间",
            width: 100,
            align: "center",
            sortable: true
        });
        gridColumns.push({
            field: "errorMessage",
            title: "错误消息",
            width: 100,
            align: "center",
            sortable: true
        });
        var $importDataGrid;
        var gridTabChecks = [{
            label: "未导入",
            param: {
                imStatus: 0
            },
            checked: true
        }];
        if (options.showSuccessList) {
            gridTabChecks.push({
                label: "已导入",
                param: {
                    imStatus: 1
                }
            })
        }
        _EBP_JS.form("dialogform", {
            key: "dataImport",
            title: options.title,
            width: options.dialogWidth,
            forceInit: true,
            fields: [[{
                name: "importDataGrid",
                fieldWidth: "12",
                type: "datagrid",
                options: {
                    height: "400px",
                    defaultParams: {
                        validSign: 0,
                        imKey: options.imKey + options.formNumber
                    },
                    defaultSort: ["createTime,orderNo", "asc,asc"],
                    fieldsMapping: {
                        imKey: {
                            sqlExp: "="
                        },
                        imStatus: {
                            sqlExp: "=",
                            dataType: "number"
                        },
                        deleteStatus: {
                            sqlExp: "=",
                            dataType: "number"
                        }
                    },
                    tabChecks: gridTabChecks,
                    datagrid: {
                        fitColumns: false,
                        url: _EBP_JS.basePath() + "dataImport/list.do?imOwner=true",//废弃地址：/oa/service/system/dataImport/list.do
                        columns: [gridColumns],
                        onDblClickRow: function(rowIndex, rowData) {
                            _editRow("edit", rowData)
                        }
                    },
                    toolbar: [{
                        iconCls: "glyphicon glyphicon-import",
                        label: "上传EXCEL数据",
                        handler: function() {
                            dataImport({
                                allowTypes: ["xls"],
                                templateUrl: options.templateUrl,
                                template: options.template,
                                params: {
                                    imKey: options.imKey + options.formNumber
                                },
                                submitUrl: _EBP_JS.basePath() + "dataImport/import.do",//废弃地址：/oa/service/system/dataImport/import.do
                                success: function(data) {
                                    alert("上传完毕，请检查并确认导入");
                                    $importDataGrid.datagrid("reload").datagrid("clearSelections")
                                }
                            })
                        }
                    },
                        {
                            iconCls: "glyphicon glyphicon-export",
                            label: "导出记录",
                            handler: function() {
                                _EBP_JS.form("datagridExport", $importDataGrid, {
                                    url: _EBP_JS.basePath() + "dataImport/export.do?columnTitles=" + encodeURIComponent(encodeURIComponent(_EBP_JS.stringify(options.fieldsLabel))) + "&title=" + encodeURIComponent(encodeURIComponent(options.title)),
                                    params: {}
                                })
                            }
                        },
                        {
                            iconCls: "glyphicon glyphicon-plus",
                            label: "新增",
                            handler: function() {
                                _editRow("add", {})
                            }
                        },
                        {
                            iconCls: "glyphicon glyphicon-remove",
                            label: "删除",
                            handler: function() {
                                var rows = $importDataGrid.datagrid("getSelections");
                                if (rows.length == 0) {
                                    alert("请选择需要删除的数据行");
                                    return
                                }
                                if (!confirm("确定要删除选定的数据？")) {
                                    return
                                }
                                var ids = [];
                                $.each(rows,
                                    function(i, row) {
                                        ids.push(row.id)
                                    });
                                _EBP_JS.ajax({
                                    url: _EBP_JS.basePath() + "dataImport/delete.do",//废弃地址：/oa/service/system/dataImport/delete.do
                                    data: {
                                        ids: _EBP_JS.stringify(ids),
                                        trueDelete: options.trueDelete
                                    },
                                    success: function(data) {
                                        if (data && data.success) {
                                            alert("操作成功");
                                            $importDataGrid.datagrid("reload").datagrid("clearSelections")
                                        }
                                    }
                                })
                            }
                        },
                        {
                            iconCls: "glyphicon glyphicon-trash",
                            label: "清空",
                            handler: function() {
                                if (!confirm("确定要清空历史数据？")) {
                                    return
                                }
                                var postParams = {};
                                postParams.imStatus = _EBP_JS.getValue($importDataGrid.data("tabChecksParams"), "imStatus", 0);
                                postParams.imKey = options.imKey + options.formNumber;
                                postParams.trueDelete = options.trueDelete;
                                _EBP_JS.ajax({
                                    url: _EBP_JS.basePath() + "dataImport/deleteAll.do",//废弃地址：e//oa/servicsystem/dataImport/deleteAll.do
                                    data: postParams,
                                    success: function(data) {
                                        if (data && data.success) {
                                            alert("操作成功");
                                            $importDataGrid.datagrid("reload").datagrid("clearSelections")
                                        }
                                    }
                                })
                            }
                        },
                        {
                            iconCls: "glyphicon glyphicon-ok",
                            label: "确定导入",
                            handler: function() {
                                if ($importDataGrid.datagrid("getRows").length == 0) {
                                    alert("请先上传EXCEL数据");
                                    return false
                                }
                                if (confirm("确定检查无误，执行导入操作？")) {
                                    _EBP_JS.ajax({
                                        url: options.submitUrl,
                                        data: {
                                            imKey: options.imKey + options.formNumber,
                                            errorRollback: options.errorRollback,
                                            deleteTemp: !options.showSuccessList && options.trueDelete,
                                            formData: _EBP_JS.stringify(options.formData)
                                        },
                                        success: function(data) {
                                            if (data.success) {
                                                alert("执行完毕，请检查执行结果");
                                                if (options.success) {
                                                    options.success(data)
                                                }
                                            } else {
                                                _EBP_JS.ajaxMessage(data)
                                            }
                                            $importDataGrid.datagrid("reload").datagrid("clearSelections")
                                        }
                                    })
                                }
                            }
                        }]
                }
            }]],
            ready: function($d) {
                $importDataGrid = $d.data("datagrids")[0]
            }
        });
        function _editRow(opt, rowData) {
            var tabCheckedIndex = _EBP_JS.form("datagridGet", $importDataGrid, "tabCheckedIndex");
            _EBP_JS.form("dialogform", {
                width: "70%",
                data: rowData,
                title: tabCheckedIndex == 1 ? "查看": (opt == "edit" ? "编辑": "添加"),
                fields: formFields,
                readonly: tabCheckedIndex == 1,
                success: function(data) {
                    var postData = $.extend({
                            imKey: options.imKey + options.formNumber
                        },
                        data);
                    _EBP_JS.ajax({
                        url: _EBP_JS.basePath() + "dataImport/save.do",//废弃地址：/oa/service/system/dataImport/save.do
                        data: {
                            formData: _EBP_JS.stringify(postData)
                        },
                        success: function(data) {
                            if (data && data.success) {
                                alert("保存成功");
                                $importDataGrid.datagrid("reload").datagrid("clearSelections")
                            } else {
                                _EBP_JS.ajaxMessage(data)
                            }
                        }
                    })
                }
            })
        }
    }
    $.extend(_EBP_JS.Form, {
        fileUpload: function(options) {
            fileUpload(options)
        },
        uploadify: function(options) {
            uploadify(options)
        },
        sampleUpload: function(options) {
            sampleUpload(options)
        },
        dataImport: function(options) {
            dataImport(options)
        },
        dataImportForm: function(options) {
            dataImportForm(options)
        },
        readFileData: function(options) {
            var _s = options.success;
            if (_s) {
                options.success = function(data) {
                    _s(decodeURIComponent(data))
                }
            }
            sampleUpload($.extend({
                    title: "文本文件内容读取",
                    url: _EBP_JS.basePath() + "/oa/service/attach/read.do"
                },
                options || {}))
        },
        createFileLinks: function(attData) {
            if (!attData) {
                return ""
            }
            if (!_EBP_JS.isArray(attData)) {
                attData = eval("(" + attData + ")")
            }
            var html = "";
            $.each(attData,
                function(i, att) {
                    html += '<div><a class="btn btn-link" target="_blank" href="' + _EBP_JS.basePath() + "/oa/service/attach/download.do?id=" + att.id + '">' + att.originalName + "</a></div>"
                });
            return html
        }
    })
})(jQuery, _EBP_JS); (function(c, e) {
    if (!e) {
        return
    }
    if (!e.Form) {
        e.Form = {}
    }
    function a(n) {
        var n = c.extend(true, {
                key: "",
                title: "",
                width: "80%",
                fields: [],
                data: {},
                url: "",
                elemExclusion: ".datagrid",
                queryParams: {},
                readonly: false,
                forceInit: true,
                backdrop: "static",
                noFooter: false,
                footbar: false,
                ready: false,
                confirm: false,
                success: false,
                formClass: e.cssPrefix + "-dialogform",
                validateMark: true
            },
            n);
        var i = d(n);
        var o = i.$form;
        var j = i.$elements;
        var l = n.ready || false;
        var k = n.success || false;
        var m = n.confirm || false;
        var h = n.key || (new Date()).getTime();
        var g = function(s, q) {
            if (m) {
                var p = m(s, n, j);
                if (b === false) {
                    return false
                }
            }
            if (q.validate && !j.validate()) {
                return false
            }
            if (q.handler) {
                var f = {};
                if (q.parseData) {
                    if (n.elemExclusion) {
                        c(n.elemExclusion, s).find("input,select,textarea").addClass(e.cssPrefix + "-disabled")
                    }
                    c.extend(f, e.Form.toJson(s))
                }
                var t = q.handler(f, s, j);
                if (typeof t == "boolean" && t == false) {
                    return false
                }
            }
            return e.isBoolean(q.autoClose) ? q.autoClose: true
        };
        e.dialog({
            key: "_form" + h,
            title: n.title || "新增/编辑",
            content: o,
            width: n.width || "650px",
            forceInit: n.forceInit,
            backdrop: n.backdrop,
            noFooter: n.noFooter,
            footbar: n.footbar,
            ready: function(q) {
                if (e.isArray(n.footbar)) {
                    var p = q.find(".modal-footer button");
                    c.each(n.footbar,
                        function(s, r) {
                            p.eq(s).unbind("click").click(function() {
                                if (r.type == "close") {
                                    q.modal("hide")
                                } else {
                                    if (r.type == "success") {
                                        r = {
                                            handler: k,
                                            parseData: true,
                                            validate: true
                                        }
                                    }
                                    if (g(q, r)) {
                                        q.modal("hide")
                                    }
                                }
                            })
                        })
                }
                var f = [];
                q.find(".dialogform-datagrid").each(function() {
                    f.push(e.form("datagrid", c(this).data("options")))
                });
                q.data("datagrids", f);
                if (l) {
                    l(q, j)
                }
            },
            success: k ?
                function(f) {
                    if (n.readonly) {
                        return true
                    }
                    return g(f, {
                        handler: k,
                        parseData: true,
                        validate: true
                    })
                }: false
        })
    }
    function d(g) {
        var g = c.extend(true, {
                fields: [],
                data: {},
                url: "",
                queryParams: {},
                readonly: false,
                formClass: ""
            },
            g);
        var i = g.data || {};
        var h = {
            getEl: function(j) {
                return e.getValue(h[j], "el")
            },
            setEl: function(k, l) {
                if (e.isObject(l)) {
                    e.setValue(h[k], l);
                    if (g.validateMark) {
                        var j = e.getValue(h[k], "panel");
                        if (j) {
                            if ((l.required || e.getValue(l, "validate.required", false)) && j.find(".input-required").size() == 0) {
                                j.prepend('<span class="input-required"></span>')
                            } else {
                                if ((!l.required && !e.getValue(l, "validate.required", false)) && j.find(".input-required").size() > 0) {
                                    j.find(".input-required").remove()
                                }
                            }
                        }
                    }
                }
            },
            validate: function() {
                var j = true;
                c.each(h,
                    function(l, k) {
                        var m = "";
                        if (k.trimValue && k.el.val()) {
                            k.el.val(e.trim(k.el.val()))
                        }
                        if (k.required) {
                            if (k.el.find(":radio,:checkbox").size() > 0) {
                                if (k.el.find(":checked").size() == 0) {
                                    j = false;
                                    m = "请选择：" + k.label
                                }
                            } else {
                                if (k.el.val() == "") {
                                    j = false;
                                    m = "请填写：" + k.label
                                }
                            }
                        }
                        if (j && k.checkValue) {
                            m = k.checkValue(k.el);
                            if (e.isNotEmpty(m)) {
                                j = false
                            }
                        }
                        if (!j) {
                            if (m) {
                                EJS.form("validateMessage", k.el, m)
                            }
                            k.el.focus();
                            return false
                        }
                        if (k.validate) {
                            j = e.form("validate", k.el, k.validate);
                            if (!j) {
                                return false
                            }
                        }
                    });
                return j
            }
        };
        var f = c('<form class="form-horizontal ' + g.formClass + '"></form>');
        if (g.url) {
            e.ajax({
                backdrop: false,
                async: false,
                url: g.url,
                data: g.queryParams,
                success: function(j) {
                    if (j) {
                        c.extend(i, j)
                    }
                }
            })
        }
        c.each(g.fields,
            function(j, l) {
                var k = c('<div class="form-group"></div>');
                c.each(l,
                    function(o, p) {
                        var n;
                        if (!p.aliasName) {
                            p.aliasName = p.name
                        }
                        if (e.isTrue(p.hidden) || p.type == "hidden") {
                            n = c('<input type="hidden" name="' + p.aliasName + '">');
                            if (e.isTrue(p.disabled)) {
                                n.addClass(e.cssPrefix + "-disabled")
                            }
                            if (p.dataType) {
                                n.attr("data-type", p.dataType)
                            }
                            if (e.isObject(p.data)) {
                                n.data(p.data)
                            }
                            if (e.isNotEmpty(p.defaultValue)) {
                                n.val(p.defaultValue)
                            }
                            if (typeof i[p.name] != "undefined" && i[p.name] != null) {
                                n.val(i[p.name] + "")
                            }
                            n.appendTo(k);
                            k.appendTo(f)
                        } else {
                            if (p.label) {
                                k.append('<label class="col-xs-' + (p.labelWidth || "2") + ' control-label">' + p.label + "</label>")
                            }
                            if (p.type == "textarea") {
                                n = c('<textarea name="' + p.aliasName + '" class="form-control" rows="' + (p.rows || "4") + '"></textarea>')
                            } else {
                                if (p.type == "select") {
                                    n = c('<select name="' + p.aliasName + '" class="form-control"><option value=""></option></select>');
                                    c.each(p.options,
                                        function(r, s) {
                                            n.append('<option value="' + s[0] + '">' + (s[1] || s[0]) + "</option>")
                                        })
                                } else {
                                    if (p.type == "radio" || p.type == "checkbox") {
                                        var q = "";
                                        c.each(p.options,
                                            function(r, s) {
                                                q += '<input value="' + s[0] + '" name="' + p.aliasName + '" data-fieldName="' + p.name + '" type="' + p.type + '">' + (s[1] || s[0]) + "&nbsp;"
                                            });
                                        n = c("<div>" + q + "</div>")
                                    } else {
                                        if (p.type == "html") {
                                            n = c(p.html)
                                        } else {
                                            if (p.type == "frame") {
                                                n = c('<iframe name="' + p.aliasName + '" frameborder="no" style="width:100%;height:100px;border:0"></iframe>');
                                                if (p.frameHeight) {
                                                    n.height(p.frameHeight)
                                                }
                                                if (p.frameSrc) {
                                                    n.attr("src", p.frameSrc)
                                                }
                                                if (p.frameStyle) {
                                                    n.css(p.frameStyle)
                                                }
                                            } else {
                                                if (p.type == "password") {
                                                    n = c('<input value="" name="' + p.aliasName + '" type="password" class="form-control">')
                                                } else {
                                                    if (p.type == "datagrid") {
                                                        n = c("<div class='dialogform-datagrid'></div>");
                                                        n.data("options", c.extend({
                                                                renderTo: n
                                                            },
                                                            p.options))
                                                    } else {
                                                        n = c('<input value="" name="' + p.aliasName + '" type="text" class="form-control">')
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (e.isTrue(p.readonly) || e.isTrue(g.readonly)) {
                                n.attr("readonly", "readonly")
                            }
                            if (e.isTrue(p.disabled)) {
                                n.addClass(e.cssPrefix + "-disabled")
                            }
                            if (p.dataType) {
                                n.attr("data-type", p.dataType)
                            }
                            if (e.isObject(p.data)) {
                                n.data(p.data)
                            }
                            n.data("fieldName", p.name);
                            if (e.isNotEmpty(p.defaultValue)) {
                                n.val(p.defaultValue)
                            }
                            var m = c('<div class="col-xs-' + (p.fieldWidth || "4") + '"></div>');
                            n.appendTo(m);
                            m.appendTo(k);
                            k.appendTo(f);
                            if (typeof i[p.name] != "undefined" && i[p.name] != null) {
                                n.val(i[p.name] + "")
                            }
                            if (!g.readonly && !(p.readonly && p.readonly2)) {
                                if (p.type == "date") {
                                    e.Form.datepicker(c.extend({
                                            renderTo: n
                                        },
                                        p.options))
                                } else {
                                    if (p.type == "datetime") {
                                        e.Form.datetimepicker(c.extend({
                                                renderTo: n
                                            },
                                            p.options))
                                    } else {
                                        if (p.type == "person") {
                                            e.Form.personSelect(c.extend({
                                                    renderTo: n,
                                                    key: "gridEditorP",
                                                    backdrop: false,
                                                    $scope: f
                                                },
                                                p.options))
                                        } else {
                                            if (p.type == "comorg") {
                                                e.Form.comorgSelect(c.extend({
                                                        renderTo: n,
                                                        key: "gridEditorO",
                                                        backdrop: false,
                                                        $scope: f
                                                    },
                                                    p.options))
                                            } else {
                                                if (p.type == "dropdown") {
                                                    e.Form.dropdown(c.extend({
                                                            renderTo: n,
                                                            $scope: f
                                                        },
                                                        p.options))
                                                } else {
                                                    if (p.type == "attach") {
                                                        e.Form.uploadify(c.extend({
                                                                renderTo: n,
                                                                backdrop: false,
                                                                $scope: f
                                                            },
                                                            p.options))
                                                    } else {
                                                        if (p.type == "inputgroup") {
                                                            e.Form.inputgroup(c.extend({
                                                                    renderTo: n,
                                                                    $scope: f
                                                                },
                                                                p.options))
                                                        } else {
                                                            if (p.type == "position") {
                                                                e.Form.positionSelect(c.extend({
                                                                        renderTo: n,
                                                                        key: "gridEditorS",
                                                                        backdrop: false,
                                                                        $scope: f
                                                                    },
                                                                    p.options))
                                                            } else {
                                                                if (p.type == "linkSelect") {
                                                                    e.Form.linkSelect(c.extend({
                                                                            renderTo: n,
                                                                            $scope: f
                                                                        },
                                                                        p.options))
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (p.type == "attach") {
                                    e.Form.uploadify(c.extend({
                                            renderTo: n,
                                            backdrop: false,
                                            $scope: f
                                        },
                                        p.options, {
                                            editable: false
                                        }))
                                }
                            }
                            if (g.validateMark) {
                                if (e.isTrue(p.required) || e.getValue(p, "validate.required", false)) {
                                    m.prepend('<span class="input-required"></span>')
                                }
                            }
                        }
                        if (p.hideRow) {
                            k.hide()
                        }
                        h[p.name] = {
                            el: n,
                            panel: m,
                            label: p.label,
                            required: e.isTrue(p.required),
                            validate: p.validate || false,
                            checkValue: p.checkValue || false,
                            trimValue: p.trimValue === false ? false: true
                        }
                    })
            });
        return {
            $form: f,
            $elements: h
        }
    }
    c.extend(e.Form, {
        dialogform: function(f) {
            a(f)
        },
        create: function(f) {
            return d(f)
        }
    })
})(jQuery, _EBP_JS); (function(d, c) {
    if (!c) {
        return
    }
    if (!c.Form) {
        c.Form = {}
    }
    var a = {};
    function g() {
        var m = "D" + (new Date()).getTime() + parseInt((1 + Math.random()) * 1000);
        while (a[m]) {
            m = "D" + (new Date()).getTime() + parseInt((1 + Math.random()) * 1000)
        }
        a[m] = {};
        return m
    }
    var i = {
        EXP_EQ: "=",
        EXP_NOT_EQ: "<>",
        EXP_GT: ">",
        EXP_LT: "<",
        EXP_GE: ">=",
        EXP_LE: "<=",
        EXP_LIKE: "like",
        EXP_LEFT_LIKE: "leftLike",
        EXP_RIGHT_LIKE: "rightLike",
        EXP_IN: "in",
        EXP_NOT_IN: "notIn",
        EXP_IS_NULL: "isNull",
        EXP_IS_NOT_NULL: "isNotNull",
        ORDER_DEFAULT: "default",
        ORDER_CUSTOM: "custom",
        PARAM_ROWS: "rows",
        PARAM_PAGE: "page",
        PARAM_CONDITION: "condition",
        ADDITIONAL_PARAMS: "additionalParams",
        ASC: "ASC",
        DESC: "DESC"
    };
    function k(s) {
        var J = g();
        var m = d(".in-frame").size() > 0;
        var n = "500px";
        if (m) {
            n = d(document).height() - d("body").height() - 62;
            if (n < 500) {
                n = 500
            } else {
                if (n > 600) {
                    n = 600
                }
            }
            n += "px";
            d("body").css("padding-bottom", "0px")
        }
        var s = d.extend(true, {
                renderTo: "",
                width: "100%",
                height: "auto",
                minHeight: n,
                cellBorder: !m,
                fixedWidth: false,
                fitInFrame: m,
                defaultSearch: {
                    enabled: true,
                    defaultValue: "",
                    placeholder: "请输入查询信息",
                    fields: [],
                    ready: function(Q) {}
                },
                advancedSearch: {
                    style: "form",
                    showDefault: false,
                    dialogWidth: "80%",
                    enabled: true,
                    btnLabel: "高级",
                    useCache: true,
                    fields: [],
                    ready: false,
                    confirm: false,
                    formClass: c.cssPrefix + "-searchform",
                    fitHeight: false
                },
                defaultParams: {},
                defaultSort: [],
                fieldsMapping: {},
                fieldsMappingEnabled: true,
                cellMouseover: "none",
                lazyLoad: c.gridLazyLoad || false,
                datagrid: {
                    rownumbers: true,
                    striped: m,
                    url: "",
                    method: "post",
                    width: "100%",
                    border: false,
                    fitColumns: true,
                    columns: [],
                    pagination: true,
                    pageSize: 15,
                    pageList: [10, 15, 20, 30, 50, 100],
                    singleSelect: false,
                    multiSort: true,
                    idField: "id"
                },
                toolbarWidth: "50%",
                searchbarWidth: "50%",
                toolbar: [],
                tabChecks: [],
                additionalParams: {}
            },
            s);
        var x = {};
        var C = {};
        var H = {};
        var I = "";
        if (s.lazyLoad) {
            I = c.getValue(s, "datagrid.url", "");
            c.setValue(s, "datagrid.url", "")
        }
        var q;
        var t;
        var u = 0;
        if (s.renderTo) {
            q = d(s.renderTo);
            if (q.size() == 0) {
                return
            }
        } else {
            q = d("<div></div>");
            q.appendTo("body")
        }
        q.addClass(c.cssPrefix + "-datagrid-panel");
        if (s.width) {
            q.width(s.width)
        }
        if (s.height) {
            q.height(s.height)
        }
        var P = d("<div class='form-horizontal " + c.cssPrefix + "-datagrid-toolbar'><div class='form-group'></div></div>");
        var w = d("<div class='col-xs-6 " + c.cssPrefix + "-datagrid-buttons'></div>");
        var L = d("<div class='col-xs-6 " + c.cssPrefix + "-datagrid-searchbar'></div>");
        P.appendTo(q);
        P = P.find("div");
        w.appendTo(P);
        L.appendTo(P);
        if (s.toolbarWidth) {
            w.css("width", s.toolbarWidth)
        }
        if (s.searchbarWidth) {
            L.css("width", s.searchbarWidth)
        }
        if (s.hideBtnGroup) {
            w.hide()
        }
        var z = true;
        if (c.isNotEmpty(s.toolbar)) {
            d.each(s.toolbar,
                function(S, W) {
                    var T = "";
                    var V = false;
                    if (c.isNotEmpty(W.dropdowns)) {
                        T = ' dropdown-toggle" data-toggle="dropdown';
                        V = d('<ul class="dropdown-menu"></ul>');
                        d.each(W.dropdowns,
                            function(Z, X) {
                                var aa = d('<a href="javascript:void(0)">' + X.label + "</a>");
                                if (X.key) {
                                    aa.addClass(c.cssPrefix + "-datagrid-buttons-" + X.key)
                                }
                                var Y = d("<li></li>");
                                aa.appendTo(Y);
                                Y.appendTo(V);
                                if (X.handler) {
                                    aa.click(function() {
                                        X.handler(t)
                                    })
                                }
                                if (X.hidden) {
                                    Y.hide()
                                }
                            })
                    }
                    var U = d('<a href="javascript:void(0)" class="btn ' + (W.clsName || "btn-default") + T + '"></a>');
                    var R = d('<div class="btn-group"></div>');
                    U.appendTo(R);
                    R.appendTo(w);
                    if (W.key) {
                        U.addClass(c.cssPrefix + "-datagrid-buttons-" + W.key)
                    }
                    if (W.iconRight) {
                        U.append(W.label)
                    }
                    if (W.iconCls) {
                        var Q = d("<i></i>");
                        Q.addClass(W.iconCls);
                        if (W.iconRight) {
                            Q.addClass("right-icon")
                        } else {
                            Q.addClass("left-icon")
                        }
                        Q.appendTo(U)
                    }
                    if (!W.iconRight) {
                        U.append(W.label)
                    }
                    if (V) {
                        R.append(V);
                        U.append('<i class="caret right-icon"></i>')
                    }
                    if (W.handler) {
                        U.click(function() {
                            W.handler(t)
                        })
                    }
                    if (W.hidden) {
                        R.hide()
                    }
                });
            z = false
        }
        if (s.defaultSearch && s.defaultSearch.enabled && c.isNotEmpty(s.defaultSearch.fields)) {
            var v = s.defaultSearch.placeholder || "";
            var F = s.defaultSearch.defaultValue || "";
            var o = d('<div class="input-group default-search"><input class="form-control" placeholder="' + v + '" value="' + F + '"><span class="input-group-btn"><a class="btn default-search-btn"><i class="glyphicon glyphicon-search left-icon"></i></a></span></div>');
            o.appendTo(L);
            o.on("keyup", "input",
                function(Q) {
                    if (Q.keyCode == 13 || (Q.keyCode == 8 && this.value == "")) {
                        o.find(".default-search-btn").click();
                        Q.preventDefault();
                        Q.stopPropagation()
                    }
                });
            o.find(".default-search-btn").click(function() {
                x = {};
                C = {};
                o.find("input").val(c.trim(o.find("input").val()));
                var Q = o.find("input").val();
                if (Q) {
                    d.each(s.defaultSearch.fields,
                        function(S, R) {
                            x[R] = Q
                        })
                }
                if (I) {
                    c.setValue(s, "datagrid.url", I);
                    t.datagrid({
                        url: I
                    });
                    I = ""
                } else {
                    t.datagrid("load", {})
                }
            });
            if (s.defaultSearch.ready) {
                s.defaultSearch.ready(o.find("input"))
            }
            z = false;
            var O = o.find("input").val();
            if (O) {
                x = {};
                C = {};
                d.each(s.defaultSearch.fields,
                    function(R, Q) {
                        x[Q] = O
                    })
            }
        }
        if (s.advancedSearch && s.advancedSearch.enabled && c.isNotEmpty(s.advancedSearch.fields)) {
            var p = c.getValue(s, "advancedSearch.ready", false);
            var G = c.getValue(s, "advancedSearch.confirm", false);
            var y = false;
            var M = d('<a href="javascript:void(0)" class="btn btn-link adv-btn">' + s.advancedSearch.btnLabel + "</a>");
            if (L.find(".input-group-btn").size() == 0) {
                L.append('<div class="input-group default-search"><span class="input-group-btn"></span></div>')
            }
            L.find(".input-group-btn").append(M);
            if (c.getValue(s, "advancedSearch.style", "") == "form") {
                var E = c.Form.create(s.advancedSearch);
                y = E.$form;
                P.after(y);
                L.append('<div class="advanced-search"><a class="btn btn-default search-btn"><i class="glyphicon glyphicon-search left-icon"></i>查询</a><a class="btn btn-link back-btn" style="display:none">隐藏</a><a class="btn btn-link reset-btn">重置</a></div>');
                L.find(".advanced-search .search-btn").click(function() {
                    x = {};
                    C = {};
                    P.find(".default-search input").val("");
                    var Q = c.getValue(s, "advancedSearch.confirm", false);
                    if (Q) {
                        var R = Q(y);
                        if (typeof R == "boolean" && !R) {
                            return false
                        }
                    }
                    d.extend(C, c.form("toJson", y, "", "", true));
                    if (I) {
                        c.setValue(s, "datagrid.url", I);
                        t.datagrid({
                            url: I
                        });
                        I = ""
                    } else {
                        t.datagrid("load", {})
                    }
                });
                y.on("keydown",
                    function(Q) {
                        if (Q.keyCode == 13) {
                            L.find(".advanced-search .search-btn").click()
                        }
                    });
                if (c.getValue(s, "advancedSearch.showDefault", false)) {
                    L.find(".default-search").hide();
                    L.find(".advanced-search").show();
                    y.show();
                    if (p) {
                        p(y, E.$elements)
                    }
                    x = {};
                    C = {};
                    P.find(".default-search input").val("");
                    d.extend(C, c.form("toJson", y, "", "", true))
                } else {
                    M.click(function() {
                        L.find(".default-search").hide();
                        L.find(".advanced-search").show();
                        y.slideDown();
                        if (s.advancedSearch.fitHeight) {
                            if (!u) {
                                u = t.datagrid("getPanel").height()
                            }
                            t.datagrid("resize", {
                                height: u - y.height()
                            })
                        }
                        d(window).resize();
                        if (p) {
                            p(y, E.$elements)
                        }
                    });
                    var r = L.find(".advanced-search .back-btn");
                    r.click(function() {
                        y.slideUp();
                        L.find(".advanced-search").hide();
                        L.find(".default-search").show();
                        if (s.advancedSearch.fitHeight) {
                            t.datagrid("resize", {
                                height: u
                            })
                        }
                    }).show()
                }
            } else {
                M.click(function() {
                    var Q = c.getValue(s, "advancedSearch.useCache", false) ? C: {};
                    c.Form.dialogform({
                        key: s.advancedSearch.key || "_dgas",
                        fields: s.advancedSearch.fields,
                        title: s.advancedSearch.btnLabel,
                        forceInit: true,
                        data: Q,
                        backdrop: true,
                        width: c.getValue(s, "advancedSearch.dialogWidth", "75%"),
                        ready: p,
                        confirm: G,
                        success: function(R) {
                            x = {};
                            C = {};
                            P.find(".default-search input").val("");
                            d.extend(C, R);
                            if (I) {
                                c.setValue(s, "datagrid.url", I);
                                t.datagrid({
                                    url: I
                                });
                                I = ""
                            } else {
                                t.datagrid("load", {})
                            }
                        }
                    })
                })
            }
            L.find(".input-group-btn").append('<a href="javascript:void(0)" class="btn btn-link reset-btn">重置</a>');
            L.find(".reset-btn").click(function() {
                x = {};
                C = {};
                c.form("reset", d("." + c.cssPrefix + "-searchform"));
                P.find(".default-search input").val("");
                if (s.lazyLoad) {
                    if (!I) {
                        I = c.getValue(s, "datagrid.url", "");
                        t.datagrid({
                            url: ""
                        });
                        t.datagrid("loadData", [])
                    }
                } else {
                    t.datagrid("load", {})
                }
            });
            z = false
        }
        if (z) {
            P.hide()
        }
        var K = s.height == "auto" ? "auto": (q.height() - (z ? -10 : P.parent().height()));
        var A = d('<div class="form-horizontal"></div>');
        A.appendTo(q);
        A.append('<div class="form-group" style="margin-bottom:0px"><div class="col-xs-12"><table></table></div></div>');
        A.find("> div > div").css({
            height: K,
            width: s.width
        });
        t = A.find("table");
        if (!s.cellBorder) {
            A.addClass(c.cssPrefix + "-datagrid-nocellborder")
        }
        t.data("outerParams", {});
        var N = null;
        var D = -1;
        if (c.isNotEmpty(s.tabChecks)) {
            N = [];
            d.each(s.tabChecks,
                function(Q, R) {
                    if (Q == 0) {
                        N.push("-")
                    }
                    N.push({
                        text: R.label,
                        handler: function(S) {
                            if (R.handler) {
                                R.handler(t)
                            } else {
                                H = R.param || {};
                                t.data("tabChecksParams", H);
                                t.datagrid("load", {});
                                c.setValue(a[J], "tabChecksParams", H)
                            }
                            c.setValue(a[J], "tabCheckedIndex", Q)
                        }
                    });
                    N.push("-");
                    if (R.checked) {
                        D = Q;
                        H = R.param || {};
                        c.setValue(a[J], "tabChecksParams", H);
                        c.setValue(a[J], "tabCheckedIndex", Q)
                    }
                })
        }
        var B = d.extend({
                height: K,
                onDblClickRow: function(R, Q) {
                    if (Q.url) {
                        window.open(Q.url)
                    }
                },
                toolbar: N
            },
            s.datagrid, {
                onLoadSuccess: function(Q) {
                    if (s.datagrid.onLoadSuccess) {
                        s.datagrid.onLoadSuccess(Q)
                    }
                    if (s.cellMouseover == "auto") {
                        A.find(".datagrid-body .datagrid-cell").each(function() {
                            if (d(this).text()) {
                                d(this).attr("title", d(this).text())
                            }
                        })
                    }
                    if (s.height == "auto") {
                        t.datagrid("resize", {
                            height: "auto"
                        });
                        setTimeout(function() {
                                if (s.minHeight && t.datagrid("getPanel").height() < parseInt(s.minHeight)) {
                                    t.datagrid("resize", {
                                        height: parseInt(s.minHeight)
                                    })
                                }
                                q.height("auto").height(q[0].scrollHeight)
                            },
                            10)
                    }
                    t.datagrid("clearSelections")
                },
                onSelect: function(Q, S) {
                    if (s.datagrid.onSelect) {
                        s.datagrid.onSelect(Q, S)
                    }
                    var R = t.data("clickSelectIndex");
                    if (s.datagrid.singleSelect && R === Q) {
                        t.datagrid("unselectRow", Q);
                        t.data("clickSelectIndex", -1)
                    } else {
                        t.data("clickSelectIndex", Q)
                    }
                },
                onCheck: function(Q, S) {
                    if (s.datagrid.onCheck) {
                        s.datagrid.onCheck(Q, S)
                    }
                    var R = t.data("clickCheckIndex");
                    if (s.datagrid.singleSelect && R === Q) {
                        t.datagrid("uncheckRow", Q);
                        t.data("clickCheckIndex", -1)
                    } else {
                        t.data("clickCheckIndex", Q)
                    }
                },
                onBeforeLoad: function(S) {
                    if (s.datagrid.onBeforeLoad) {
                        s.datagrid.onBeforeLoad(S)
                    }
                    var Q = c.isFunction(s.additionalParams) ? s.additionalParams() : s.additionalParams;
                    var T = t.data("outerParams") || {};
                    if (s.fieldsMappingEnabled) {
                        var V = s.fieldsMapping || {};
                        var U = [];
                        if (c.isNotEmpty(x)) {
                            var R = [];
                            d.each(x,
                                function(ac, af) {
                                    var ag = c.getValue(V[ac], "dataType") == "number";
                                    var ae = c.getValue(V[ac], "multiSeparator", "");
                                    var aa = c.getValue(V[ac], "letterCase", "");
                                    if (aa == "uppercase") {
                                        af = af.toUpperCase()
                                    } else {
                                        if (aa == "lowercase") {
                                            af = af.toLowerCase()
                                        }
                                    }
                                    if (c.getValue(V[ac], "asAdditionalParam", false)) {
                                        Q[ac] = af
                                    } else {
                                        var ad = [];
                                        if (ae) {
                                            ad = af.split(ae)
                                        } else {
                                            ad.push(af)
                                        }
                                        var ab = c.getValue(V[ac], "dbColumn", ac.replace(/[A-Z]/g,
                                            function(ah) {
                                                return "_" + ah
                                            }).replace(/^\_/, "").toUpperCase());
                                        d.each(ad,
                                            function(ai, ah) {
                                                R.push({
                                                    column: ab,
                                                    exp: c.getValue(V[ac], "sqlExp", ag ? "=": c.gridDefSearchExp),
                                                    value: ag ? parseFloat(ah) : ah
                                                })
                                            })
                                    }
                                });
                            if (R.length > 0) {
                                U.push({
                                    orConditionList: R
                                })
                            }
                        }
                        var X = d.extend({},
                            s.defaultParams, C, H, T);
                        if (c.isNotEmpty(X)) {
                            d.each(X,
                                function(ab, al) {
                                    if (c.isNotEmpty(al)) {
                                        var af = "";
                                        var ac = c.getValue(V[ab], "expFromValueSp", "");
                                        if (ac && c.isString(al)) {
                                            var aj = al.split(ac);
                                            if (aj.length == 2) {
                                                af = aj[1]
                                            }
                                            if (af) {
                                                al = aj[0]
                                            }
                                        }
                                        var ah = c.getValue(V[ab], "letterCase", "");
                                        if (ah == "uppercase") {
                                            al = al.toUpperCase()
                                        } else {
                                            if (ah == "lowercase") {
                                                al = al.toLowerCase()
                                            }
                                        }
                                        if (c.getValue(V[ab], "asAdditionalParam", false)) {
                                            Q[ab] = al
                                        } else {
                                            var aa = [];
                                            ac = c.getValue(V[ab], "multiSeparator", "");
                                            if (ac) {
                                                aa = al.split(ac)
                                            } else {
                                                aa.push(al)
                                            }
                                            var ag = c.getValue(V[ab], "dataType") == "number";
                                            if (!af) {
                                                af = c.getValue(V[ab], "sqlExp", ag ? "=": c.gridAdvSearchExp)
                                            }
                                            var ae = c.getValue(V[ab], "dbColumn", ab.replace(/[A-Z]/g,
                                                function(am) {
                                                    return "_" + am
                                                }).replace(/^\_/, "").toUpperCase());
                                            if (af == i.EXP_IN || af == i.EXP_NOT_IN) {
                                                if (ag) {
                                                    for (var ai = 0; ai < aa.length; ai++) {
                                                        aa[ai] = parseFloat(aa[ai])
                                                    }
                                                }
                                                U.push({
                                                    column: ae,
                                                    exp: af,
                                                    value: aa
                                                })
                                            } else {
                                                if (aa.length > 1) {
                                                    var ad = [];
                                                    d.each(aa,
                                                        function(am, an) {
                                                            var ao = {
                                                                column: ae,
                                                                exp: af
                                                            };
                                                            if (c.isNotEmpty(an)) {
                                                                ao.value = ag ? parseFloat(an) : an
                                                            }
                                                            ad.push(ao)
                                                        });
                                                    U.push({
                                                        orConditionList: ad
                                                    })
                                                } else {
                                                    var ak = {
                                                        column: ae,
                                                        exp: af
                                                    };
                                                    if (c.isNotEmpty(al)) {
                                                        ak.value = ag ? parseFloat(al) : al
                                                    }
                                                    U.push(ak)
                                                }
                                            }
                                        }
                                    }
                                })
                        }
                        if (S.sort || c.isNotEmpty(s.defaultSort)) {
                            var Z = [],
                                Y = [];
                            if (S.sort) {
                                Z = S.sort.split(",");
                                Y = S.order.split(",")
                            } else {
                                Z = s.defaultSort[0].split(",");
                                if (s.defaultSort.length > 1) {
                                    Y = s.defaultSort[1].split(",")
                                } else {
                                    for (var W = 0; W < Z.length; W++) {
                                        Y.push("ASC")
                                    }
                                }
                            }
                            for (var W = 0; W < Z.length; W++) {
                                U.push({
                                    column: c.getValue(V[Z[W]], "dbColumn", Z[W].replace(/[A-Z]/g,
                                        function(aa) {
                                            return "_" + aa
                                        }).replace(/^\_/, "").toUpperCase()),
                                    orderType: c.getValue(V[Z[W]], "orderType", i.ORDER_DEFAULT),
                                    orderKey: c.getValue(V[Z[W]], "orderKey", ""),
                                    direction: Y[W].toUpperCase()
                                })
                            }
                        }
                        S[i.PARAM_CONDITION] = c.stringify(U);
                        S[i.ADDITIONAL_PARAMS] = c.stringify(Q)
                    } else {
                        d.extend(S, x, s.defaultParams, C, H, T, Q)
                    }
                    t.data("queryParams", S);
                    c.setValue(a[J], "queryParams", S)
                }
            });
        t.datagrid(B);
        if (s.datagrid.singleSelect) {
            q.find(".datagrid-header-check :checkbox").hide()
        }
        if (c.isNotEmpty(s.tabChecks)) {
            q.find(".datagrid-toolbar .l-btn").click(function() {
                q.find(".datagrid-toolbar .l-btn").removeClass("" + c.cssPrefix + "-datagrid-tab-checked");
                d(this).addClass("" + c.cssPrefix + "-datagrid-tab-checked")
            });
            if (D > -1) {
                t.data("tabChecksParams", s.tabChecks[D].param);
                q.find(".datagrid-toolbar .l-btn").eq(D).addClass("" + c.cssPrefix + "-datagrid-tab-checked")
            }
        }
        if (s.width == "100%" && !s.fixedWidth) {
            q.css({
                position: "relative"
            });
            A.css({
                position: "absolute"
            });
            d(window).resize(function() {
                try {
                    A.width(q.width());
                    t.datagrid("resize")
                } catch(Q) {}
            })
        }
        c.setValue(a[J], "options", s);
        c.setValue(a[J], "$panel", q);
        c.setValue(a[J], "$toolbar", P);
        c.setValue(a[J], "$buttons", w);
        c.setValue(a[J], "$searchBar", L);
        c.setValue(a[J], "$searchInput", o);
        t.data("datagrid-id", J);
        return t
    }
    var h = false;
    function b(m, n) {
        var o = m.data("queryParams") || {};
        if (n.params) {
            d.extend(o, n.params)
        }
        if (!h) {
            var p = "dg_fr_export" + (new Date()).getTime();
            d('<iframe src="" style="display:none" name="' + p + '"></iframe>').appendTo("body");
            h = d('<form method="post" style="display:none" target="' + p + '" acceptCharset="UTF-8"></form>');
            h.appendTo("body")
        }
        h.attr("action", n.url);
        h.empty();
        d.each(o,
            function(q, r) {
                d('<input name="' + q + '">').val(r).appendTo(h)
            });
        h.submit()
    }
    function f(m, o) {
        var p = m.data("queryParams") || {};
        if (o.params) {
            d.extend(p, o.params)
        }
        var n = {
            backdrop: true,
            url: o.url,
            data: p,
            success: function(q) {
                if (q && q.success) {
                    alert("操作成功");
                    m.datagrid("reload")
                } else {
                    c.ajaxMessage(q)
                }
            }
        };
        if (o.callback) {
            n.success = o.callback
        }
        c.ajax(n)
    }
    function l(o) {
        var v = c.getValue(o, "queryParams", {});
        var n = c.getValue(o, "sortParams", []);
        var q = c.getValue(o, "fieldsMapping", {});
        var m = {};
        var p = [];
        d.each(v,
            function(x, G) {
                if (c.isNotEmpty(G)) {
                    var B = "";
                    var y = c.getValue(q[x], "expFromValueSp", "");
                    if (y && c.isString(G)) {
                        var E = G.split(y);
                        if (E.length == 2) {
                            B = E[1]
                        }
                        if (B) {
                            G = E[0]
                        }
                    }
                    if (c.getValue(q[x], "asAdditionalParam", false)) {
                        m[x] = G
                    } else {
                        var w = [];
                        if (c.isArray(G)) {
                            w = G
                        } else {
                            y = c.getValue(q[x], "multiSeparator", "");
                            if (y) {
                                w = G.split(y)
                            } else {
                                w.push(G)
                            }
                        }
                        var C = c.getValue(q[x], "dataType") == "number";
                        if (!B) {
                            B = c.getValue(q[x], "sqlExp", "=")
                        }
                        var A = c.getValue(q[x], "dbColumn", x.replace(/[A-Z]/g,
                            function(H) {
                                return "_" + H
                            }).replace(/^\_/, "").toUpperCase());
                        if (B == i.EXP_IN || B == i.EXP_NOT_IN) {
                            if (C) {
                                for (var D = 0; D < w.length; D++) {
                                    w[D] = parseFloat(w[D])
                                }
                            }
                            p.push({
                                column: A,
                                exp: B,
                                value: w
                            })
                        } else {
                            if (w.length > 1) {
                                var z = [];
                                d.each(w,
                                    function(I, K) {
                                        y = c.getValue(q[x], "expFromValueSp", "");
                                        var J = "";
                                        if (y && c.isString(K)) {
                                            var H = K.split(y);
                                            if (H.length == 2) {
                                                J = H[1]
                                            }
                                            if (J) {
                                                K = H[0]
                                            }
                                        }
                                        var L = {
                                            column: A,
                                            exp: J ? J: B
                                        };
                                        if (c.isNotEmpty(K)) {
                                            L.value = C ? parseFloat(K) : K
                                        }
                                        z.push(L)
                                    });
                                p.push({
                                    orConditionList: z
                                })
                            } else {
                                var F = {
                                    column: A,
                                    exp: B
                                };
                                if (c.isNotEmpty(G)) {
                                    F.value = C ? parseFloat(G) : G
                                }
                                p.push(F)
                            }
                        }
                    }
                }
            });
        if (c.isNotEmpty(n)) {
            var t = [],
                s = [];
            t = n[0].split(",");
            if (n.length > 1) {
                s = n[1].split(",")
            } else {
                for (var r = 0; r < t.length; r++) {
                    s.push("ASC")
                }
            }
            for (var r = 0; r < t.length; r++) {
                p.push({
                    column: c.getValue(q[t[r]], "dbColumn", t[r].replace(/[A-Z]/g,
                        function(w) {
                            return "_" + w
                        }).replace(/^\_/, "").toUpperCase()),
                    orderType: c.getValue(q[t[r]], "orderType", i.ORDER_DEFAULT),
                    orderKey: c.getValue(q[t[r]], "orderKey", ""),
                    direction: s[r].toUpperCase()
                })
            }
        }
        var u = {};
        u[i.PARAM_CONDITION] = c.stringify(p);
        u[i.ADDITIONAL_PARAMS] = c.stringify(m);
        return u
    }
    function e(m, n, o) {
        var n = n || m.datagrid("options")["url"].replace("list.do", "save.do");
        m.datagrid({
            onDblClickRow: function(q, s) {
                var p = [];
                var r = [];
                d.each(s,
                    function(u, t) {
                        if (r.length == 2) {
                            p.push(r);
                            r = []
                        }
                        r.push({
                            label: c.getValue(o, u, u),
                            name: u,
                            dataType: c.isNumber(t) ? "number": "string"
                        })
                    });
                if (r.length > 0) {
                    p.push(r)
                }
                c.form("dialogform", {
                    data: s,
                    fields: p,
                    success: function(t) {
                        c.ajax({
                            data: {
                                formData: c.stringify(t)
                            },
                            url: n,
                            success: function(u) {
                                alert(c.stringify(u))
                            }
                        })
                    }
                })
            }
        })
    }
    function j(m) {
        var n = c.getValue(a[m.data("datagrid-id")], "options", {});
        if (n.height == "auto") {
            m.datagrid("resize", {
                height: "auto"
            });
            setTimeout(function() {
                    if (n.minHeight && m.datagrid("getPanel").height() < parseInt(n.minHeight)) {
                        m.datagrid("resize", {
                            height: parseInt(n.minHeight)
                        })
                    }
                    var o = c.getValue(a[m.data("datagrid-id")], "$panel", false);
                    if (o) {
                        o.height("auto").height(o[0].scrollHeight)
                    }
                },
                10)
        }
    }
    d.extend(c.Form, {
        datagrid: function(m) {
            return k(m)
        },
        datagridGet: function(m, n, o) {
            return c.getValue(a[m.data("datagrid-id")], n, o)
        },
        datagridGetButtons: function(m, n) {
            var o = c.getValue(a[m.data("datagrid-id")], "$buttons", false);
            if (o) {
                if (arguments.length == 1) {
                    return o.find(".btn")
                }
                if (c.isNumber(n)) {
                    return o.find(".btn").eq(n - 1)
                } else {
                    return o.find("." + c.cssPrefix + "-datagrid-buttons-" + n)
                }
            } else {
                return false
            }
        },
        datagridLoad: function(m, p, n, o) {
            var o = c.isBoolean(n) ? n: o;
            if (!o) {
                m.datagrid("clearSelections")
            }
            var p = p || {};
            m.data("outerParams", p);
            var n = c.isObject(n) ? n: {};
            m.datagrid("load", n)
        },
        getDatagridParams: function(m) {
            return m.data("queryParams") || {}
        },
        datagridExport: function(m, n) {
            b(m, n)
        },
        datagridDelete: function(m, n) {
            f(m, n)
        },
        buildDatagridParams: function(m) {
            return l(m)
        },
        datagridRowEdit: function(m, n, o) {
            e(m, n, o)
        },
        datagridResize: function(m) {
            j(m)
        }
    })
})(jQuery, _EBP_JS);
if ($.fn.pagination) {
    $.fn.pagination.defaults.beforePageText = "第";
    $.fn.pagination.defaults.afterPageText = "共{pages}页";
    $.fn.pagination.defaults.displayMsg = "显示{from}到{to},共{total}记录"
}
if ($.fn.datagrid) {
    $.fn.datagrid.defaults.loadMsg = "正在处理，请稍待。。。"
}
if ($.fn.treegrid && $.fn.datagrid) {
    $.fn.treegrid.defaults.loadMsg = $.fn.datagrid.defaults.loadMsg
}; (function($, _EBP_JS) {
    if (!_EBP_JS) {
        return
    }
    if (!_EBP_JS.Form) {
        _EBP_JS.Form = {}
    }
    var _url_tree_dept = "/oa/service/comorg/getOrgChildren.do";
    var _url_psn_by_dept = "/oa/service/comorg/getPersonList.do";
    var _url_org_select = "/oa/service/comorg/getOrgAllChildren.do";
    var _url_post_select = "/oa/service/comorg/getOrgPositions.do";
    function personSelect(arg) {
        var arg = arg || [{}];
        var arr = _EBP_JS.isArray(arg) ? arg: [arg];
        $.each(arr,
            function(i, o) {
                var selector = o.renderTo || ".person-input";
                var options = $.extend({
                        clearable: true,
                        clearHandler: false,
                        defaultMyDept: true,
                        singleSelect: true,
                        selectRange: "",
                        selectMode: "auto",
                        destroyOnInit: false,
                        beforeShowDialog: false,
                        editable: false
                    },
                    o);
                if (options.destroyOnInit) {
                    _EBP_JS.form("inputgroupDestroy", selector)
                }
                var $scope = options.$scope || $("body");
                $(selector).each(function() {
                    var $target = $(this);
                    var _options = $target.data("options");
                    if (_options) {
                        if (typeof _options == "string") {
                            _options = eval("({" + _options + "})")
                        }
                        _options = $.extend({},
                            options, _options)
                    } else {
                        _options = $.extend({},
                            options)
                    }
                    if (_options.returns) {
                        var _success = _options.success;
                        _options.success = function(persons) {
                            $.each(_options.returns,
                                function(k, v) {
                                    $(v, $scope).val(_EBP_JS.getListValue(persons, k, ","))
                                });
                            if (typeof _success == "function") {
                                return _success(persons)
                            }
                        }
                    }
                    $target.data("original", {
                        readonly: $target.attr("readonly")
                    });
                    $target.attr("readonly", !options.editable);
                    var $p = $target.parent();
                    var $g;
                    if ($p.is(".person-input-group")) {
                        $g = $p
                    } else {
                        $g = $('<div class="input-group person-input-group ' + _EBP_JS.cssPrefix + '-input-group"></div>');
                        $p.append($g);
                        $target.appendTo($g);
                        var $btns = $('<div class="input-group-btn"></div>');
                        $btns.append('<a class="btn btn-default"><span class="glyphicon glyphicon-list"></span></a>');
                        if (_options.clearable || _options.clearHandler) {
                            $('<a class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></a>').click(function() {
                                $target.val("");
                                if (_options.returns) {
                                    $.each(_options.returns,
                                        function(k, v) {
                                            $(v, $scope).val("")
                                        })
                                }
                                if (typeof _options.clearHandler == "function") {
                                    _options.clearHandler()
                                }
                            }).appendTo($btns)
                        }
                        $btns.appendTo($g)
                    }
                    $g.find(".input-group-btn .btn:first").unbind("click").click(function() {
                        if (_options.beforeShowDialog) {
                            if (_options.beforeShowDialog() === false) {
                                return false
                            }
                        }
                        if (typeof _options.setOptions == "function") {
                            _options.setOptions(_options)
                        }
                        if (_options.rollback) {
                            return false
                        }
                        if (_EBP_JS.isEmpty(_options.selectRange)) {
                            _EBP_JS.Dialog.selectPsn(_options)
                        } else {
                            var queryParams = $.extend({
                                    backs: _options.moreBacks
                                },
                                _options.selectRange);
                            _EBP_JS.form("gridSelect", {
                                key: "psnSelect",
                                title: "人员选择",
                                width: "650px",
                                backdrop: _options.backdrop,
                                selectedShows: ["name", "unno"],
                                fieldsMappingEnabled: false,
                                defaultSearch: {
                                    placeholder: "姓名/拼音/编号",
                                    fields: ["searchKey"]
                                },
                                defaultParams: queryParams,
                                searchbarWidth: "100%",
                                datagrid: {
                                    url: _EBP_JS.basePath() + "/oa/service/comorg/getPersonList.do",
                                    singleSelect: _options.singleSelect,
                                    idField: "id",
                                    frozenColumns: [[{
                                        field: "id",
                                        checkbox: true
                                    },
                                        {
                                            field: "name",
                                            title: "姓名",
                                            width: 70,
                                            align: "center",
                                            sortable: true
                                        },
                                        {
                                            field: "unno",
                                            title: "编号",
                                            width: 70,
                                            align: "center",
                                            sortable: true
                                        }]],
                                    columns: [[{
                                        field: "positionName",
                                        title: "职位",
                                        width: 120,
                                        align: "center",
                                        sortable: true
                                    },
                                        {
                                            field: "departmentName",
                                            title: "部门",
                                            width: 120,
                                            align: "center",
                                            sortable: true
                                        },
                                        {
                                            field: "officePhone",
                                            title: "办公电话",
                                            width: 100,
                                            align: "center",
                                            sortable: true
                                        },
                                        {
                                            field: "mobile",
                                            title: "移动长号",
                                            width: 100,
                                            align: "center",
                                            sortable: true
                                        }]]
                                },
                                success: _options.success
                            })
                        }
                    })
                })
            })
    }
    function comorgSelect(arg) {
        var arg = arg || [{}];
        var arr = _EBP_JS.isArray(arg) ? arg: [arg];
        $.each(arr,
            function(i, o) {
                var selector = o.renderTo || ".comorg-input";
                options = $.extend({
                        clearable: true,
                        clearHandler: false,
                        singleSelect: true
                    },
                    o);
                var $scope = options.$scope || $("body");
                $(selector).each(function() {
                    $(this).data("original", {
                        readonly: $(this).attr("readonly")
                    });
                    $(this).attr("readonly", "readonly");
                    var _options = $(this).data("options");
                    if (_options) {
                        if (typeof _options == "string") {
                            _options = eval("({" + _options + "})")
                        }
                        _options = $.extend({},
                            options, _options)
                    } else {
                        _options = $.extend({},
                            options)
                    }
                    if (_options.returns) {
                        var _success = _options.success;
                        _options.success = function(orgs) {
                            $.each(_options.returns,
                                function(k, v) {
                                    $(v, $scope).val(_EBP_JS.getListValue(orgs, k, ","))
                                });
                            if (typeof _success == "function") {
                                return _success(orgs)
                            }
                        }
                    }
                    var $p = $(this).parent();
                    var $g;
                    if ($p.is(".comorg-input-group")) {
                        $g = $p
                    } else {
                        $g = $('<div class="input-group comorg-input-group ' + _EBP_JS.cssPrefix + '-input-group"></div>');
                        $p.append($g);
                        $(this).appendTo($g);
                        var $btns = $('<div class="input-group-btn"></div>');
                        $btns.append('<a class="btn btn-default"><span class="glyphicon glyphicon-list"></span></a>');
                        if (_options.clearable || _options.clearHandler) {
                            $('<a class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></a>').click(function() {
                                if (_options.returns) {
                                    $.each(_options.returns,
                                        function(k, v) {
                                            $(v, $scope).val("")
                                        })
                                }
                                if (typeof _options.clearHandler == "function") {
                                    _options.clearHandler()
                                }
                            }).appendTo($btns)
                        }
                        $btns.appendTo($g)
                    }
                    $g.find(".input-group-btn .btn:first").unbind("click").click(function() {
                        _EBP_JS.Dialog.selectOrg(_options)
                    })
                })
            })
    }
    function positionSelect(arg) {
        var arg = arg || [{}];
        var arr = _EBP_JS.isArray(arg) ? arg: [arg];
        $.each(arr,
            function(i, o) {
                var selector = o.renderTo || ".position-input";
                options = $.extend({
                        clearable: true,
                        clearHandler: false,
                        singleSelect: true
                    },
                    o);
                var $scope = options.$scope || $("body");
                $(selector).each(function() {
                    $(this).data("original", {
                        readonly: $(this).attr("readonly")
                    });
                    $(this).attr("readonly", "readonly");
                    var _options = $(this).data("options");
                    if (_options) {
                        if (typeof _options == "string") {
                            _options = eval("({" + _options + "})")
                        }
                        _options = $.extend({},
                            options, _options)
                    } else {
                        _options = $.extend({},
                            options)
                    }
                    if (_options.returns) {
                        var _success = _options.success;
                        _options.success = function(posts) {
                            $.each(_options.returns,
                                function(k, v) {
                                    $(v, $scope).val(_EBP_JS.getListValue(posts, k, ","))
                                });
                            if (typeof _success == "function") {
                                return _success(posts)
                            }
                        }
                    }
                    var $p = $(this).parent();
                    var $g;
                    if ($p.is(".position-input-group")) {
                        $g = $p
                    } else {
                        $g = $('<div class="input-group position-input-group ' + _EBP_JS.cssPrefix + '-input-group"></div>');
                        $p.append($g);
                        $(this).appendTo($g);
                        var $btns = $('<div class="input-group-btn"></div>');
                        $btns.append('<a class="btn btn-default"><span class="glyphicon glyphicon-list"></span></a>');
                        if (_options.clearable || _options.clearHandler) {
                            $('<a class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></a>').click(function() {
                                if (_options.returns) {
                                    $.each(_options.returns,
                                        function(k, v) {
                                            $(v, $scope).val("")
                                        })
                                }
                                if (typeof _options.clearHandler == "function") {
                                    _options.clearHandler()
                                }
                            }).appendTo($btns)
                        }
                        $btns.appendTo($g)
                    }
                    $g.find(".input-group-btn .btn:first").unbind("click").click(function() {
                        _EBP_JS.Dialog.selectPost(_options)
                    })
                })
            })
    }
    function showPersonDetail(options) {
        var options = $.extend({
                key: "person-detail",
                renderTo: "",
                idSelector: "",
                title: "人员详细信息",
                width: "600px",
                queryParams: {},
                parseParams: false,
                url: _EBP_JS.basePath() + "/oa/service/comorg/getPersonInfo.do",
                readonly: true,
                backdrop: true,
                fields: [[{
                    label: "ID",
                    name: "id",
                    hidden: true
                }], [{
                    label: "姓名",
                    name: "name",
                    fieldWidth: 10
                }], [{
                    label: "公司",
                    name: "companyName",
                    fieldWidth: 10
                }], [{
                    label: "部门",
                    name: "departmentName",
                    fieldWidth: 10
                }], [{
                    label: "职位",
                    name: "positionName",
                    fieldWidth: 10
                }], [{
                    label: "职级",
                    name: "postLevelName",
                    fieldWidth: 10
                }], [{
                    label: "办公电话",
                    name: "officePhone",
                    fieldWidth: 10
                }], [{
                    label: "手机",
                    name: "mobile",
                    fieldWidth: 10
                }], [{
                    label: "邮箱",
                    name: "email",
                    fieldWidth: 10
                }], [{
                    label: "个人网站",
                    name: "website",
                    fieldWidth: 10
                }]]
            },
            options || {});
        if (options.renderTo) {
            if (_EBP_JS.isFunction(options.parseParams)) {
                options.queryParams = options.parseParams()
            }
            if (options.idSelector) {
                options.queryParams.id = $(options.idSelector).val()
            }
            _EBP_JS.form("inputgroup", {
                renderTo: options.renderTo,
                btnIconCls: "glyphicon glyphicon-user",
                btnLabel: "详细",
                btnTitle: "点击查看人员详细信息",
                editable: false,
                readonlyStyle: true,
                handler: function() {
                    _EBP_JS.form("dialogform", options)
                }
            })
        } else {
            if (_EBP_JS.isFunction(options.parseParams)) {
                options.queryParams = options.parseParams()
            }
            _EBP_JS.form("dialogform", options)
        }
    }
    function comorgTree(options) {
        var options = $.extend(true, {
                renderTo: "",
                rootId: "ComOrg",
                queryParams: {},
                showRoot: false,
                showParent: false,
                getLocked: false,
                onLoadSuccess: function(node, data) {},
                onSelect: function($tree, data) {}
            },
            options);
        if (options.renderTo) {
            options.queryParams.orgId = options.rootId;
            options.queryParams.getRoot = options.showRoot;
            options.queryParams.getParent = options.showParent;
            options.queryParams.getLocked = options.getLocked;
            var $tree = $(options.renderTo);
            $tree.tree({
                lines: true,
                url: _EBP_JS.basePath() + _url_tree_dept + "?" + _EBP_JS.urlSerialize(options.queryParams),
                onBeforeExpand: function(node) {
                    options.queryParams.orgId = node.id;
                    $tree.tree("options").url = _EBP_JS.basePath() + _url_tree_dept + "?" + _EBP_JS.urlSerialize(options.queryParams)
                },
                onLoadSuccess: function(node, data) {
                    options.onLoadSuccess(node, data)
                },
                onSelect: function(node) {
                    options.onSelect($tree, node.attributes)
                }
            });
            return $tree
        }
        return null
    }
    $.extend(_EBP_JS.Form, {
        personSelect: function(arg) {
            personSelect(arg)
        },
        comorgSelect: function(arg) {
            comorgSelect(arg)
        },
        positionSelect: function(arg) {
            positionSelect(arg)
        },
        showPersonDetail: function(options) {
            showPersonDetail(options)
        },
        comorgTree: function(options) {
            return comorgTree(options)
        },
        showRightPhoneDialog: function(personId) {
            showRightPhoneDialog(personId)
        }
    })
})(jQuery, _EBP_JS); (function(av, b) {
    if (!b) {
        return
    }
    if (!b.Flow) {
        b.Flow = {}
    }
    var v = {
        isNewData: true,
        isNewFlow: true,
        isTaskPool: false,
        isClaimedTask: false,
        isMyAuthorized: false,
        nodeVars: {}
    };
    function c(aJ) {
        var aI = b.getValue(v, aJ, "");
        return aI == null || aI == "null" ? "": aI
    }
    function aE(aJ, aI) {
        b.setValue(v, aJ, aI)
    }
    function Z(aJ) {
        var aI = {};
        if (typeof aJ == "string") {
            aJ = aJ.split(",")
        }
        av.each(aJ,
            function(aL, aK) {
                b.setValue(aI, aK, c(aK))
            });
        return aI
    }
    var aG = false;
    var ay = null;
    var J = null;
    var D;
    var j = [];
    var w = {
        assigners: {},
        processVar: {},
        subProcessVar: {},
        processParams: {}
    };
    var k = {};
    var d = false;
    var au = false;
    var p = false;
    var I = false;
    var A = false;
    var an = false;
    var ap = {
        init: "/oa/service/flow/init.do",
        submit: "/oa/service/flow/submit.do",
        view: "/oa/service/flow/view/img.do",
        get_node: "/oa/service/flow/getFlowNodes.do",
        get_next_node: "/oa/service/flow/getNextNode.do",
        get_all_next_node: "/oa/service/flow/getAllNextNode.do",
        get_node_user: "/oa/service/flow/getNodeUser.do",
        get_history: "/oa/service/flow/getHistory.do",
        single_claim: "/oa/service/flow/singleClaim.do",
        classify: "/oa/service/flow/classify.do",
        task_redirect: "/oa/service/flow/userTask/redirect.do",
        create_comm: "/oa/service/uc/create.do",
        get_comm: "/oa/service/uc/my/get.do",
        load_assigners: "/oa/service/flow/loadAssigners.do"
    };
    var z = false;
    var aA = {};
    var aq = {};
    var s = [];
    var O = {};
    var ac = {
        quit: {
            label: "退出",
            clsName: "btn-info",
            parseData: false,
            handler: function(aJ, aI) {
                N(aI, "quit")
            }
        },
        save: {
            label: "保存",
            clsName: "btn-primary",
            parseData: false,
            hidden: true,
            handler: function(aJ, aI) {
                N(aI, "save")
            }
        },
        submit: {
            label: "提交",
            clsName: "btn-success",
            parseData: false,
            hidden: true,
            handler: function(aJ, aI) {
                N(aI, "submit")
            }
        },
        reject: {
            label: "驳回",
            clsName: "btn-warning",
            parseData: false,
            hidden: true,
            handler: function(aJ, aI) {
                ar("reject");
                if (!z) {
                    aa("FirstNode")
                }
            }
        },
        restart: {
            label: "强制驳回",
            clsName: "btn-danger",
            parseData: false,
            hidden: true,
            handler: function(aJ, aI) {
                N(aI, "restart")
            }
        },
        append: {
            label: "加签",
            clsName: "btn-info",
            hidden: true,
            dropdowns: {
                before: {
                    label: "在我之前签核",
                    parseData: false,
                    hidden: true,
                    handler: function(aJ, aI) {
                        ar("append");
                        am("before")
                    }
                },
                current: {
                    label: "加签与我会签",
                    parseData: false,
                    hidden: true,
                    handler: function(aJ, aI) {
                        ar("append");
                        am("current")
                    }
                },
                after: {
                    label: "在我之后签核",
                    parseData: false,
                    hidden: true,
                    handler: function(aJ, aI) {
                        ar("append");
                        am("after")
                    }
                }
            }
        },
        handover: {
            label: "转办",
            clsName: "btn-info",
            parseData: false,
            hidden: true,
            handler: function(aJ, aI) {
                N(aI, "handover")
            }
        },
        revoke: {
            label: "撤签",
            clsName: "btn-info",
            parseData: false,
            hidden: true,
            handler: function(aJ, aI) {
                N(aI, "revoke")
            }
        },
        notify: {
            label: "通知",
            clsName: "btn-info",
            parseData: false,
            hidden: true,
            handler: function(aJ, aI) {
                N(aI, "notify")
            }
        },
        deliver: {
            label: "传阅",
            clsName: "btn-info",
            parseData: false,
            hidden: true,
            handler: function(aJ, aI) {
                N(aI, "deliver")
            }
        },
        authorize: {
            label: "授权",
            clsName: "btn-info",
            parseData: false,
            hidden: true,
            handler: function(aJ, aI) {
                N(aI, "authorize")
            }
        },
        reauthorize: {
            label: "收回授权",
            clsName: "btn-info",
            parseData: false,
            hidden: true,
            handler: function(aJ, aI) {
                N(aI, "reauthorize")
            }
        },
        claim: {
            label: "认领",
            clsName: "btn-info",
            parseData: false,
            hidden: true,
            handler: function(aJ, aI) {
                N(aI, "claim")
            }
        },
        backpool: {
            label: "退回任务池",
            clsName: "btn-info",
            parseData: false,
            hidden: true,
            handler: function(aJ, aI) {
                N(aI, "backpool")
            }
        },
        hangup: {
            label: "挂起",
            clsName: "btn-info",
            parseData: false,
            hidden: true,
            handler: function(aJ, aI) {
                N(aI, "hangup")
            }
        },
        classify: {
            label: "归类",
            clsName: "btn-info",
            parseData: false,
            hidden: true,
            handler: function(aJ, aI) {
                N(aI, "classify")
            }
        },
        communicate: {
            label: "沟通",
            clsName: "btn-info",
            parseData: false,
            hidden: true,
            handler: function(aJ, aI) {
                N(aI, "communicate")
            }
        },
        adminOpt: {
            label: "特殊操作",
            clsName: "btn-warning",
            hidden: true,
            parseData: false,
            dropdowns: {
                jump: {
                    label: "强制跳转",
                    hidden: true,
                    parseData: false,
                    handler: function(aJ, aI) {
                        b.dialog({
                            title: "请选择跳转环节：",
                            width: "500px",
                            forceInit: false,
                            noFooter: true,
                            content: "<div class='af-admin-opt-jump'></div>",
                            ready: function(aL) {
                                var aK = av("<ul class='list-group'></ul>");
                                av.each(c("flowNodes"),
                                    function(aM, aN) {
                                        var aO = av("<li class='list-group-item'><a href='javascript:void(0)' class='btn' style='font-size:14px'><input type='radio'> <span>" + aN.name + "[" + aN.id + "]</span></a></li>");
                                        aK.append(aO);
                                        aO.click(function() {
                                            aL.modal("hide");
                                            ar("jump");
                                            aa(aN.id)
                                        })
                                    });
                                aL.find(".af-admin-opt-jump").append(aK)
                            }
                        })
                    }
                },
                replace: {
                    label: "替换处理人",
                    parseData: false,
                    hidden: true,
                    handler: function(aJ, aI) {
                        N(aI, "replace")
                    }
                },
                stop: {
                    label: "终止流程",
                    parseData: false,
                    hidden: true,
                    handler: function(aJ, aI) {
                        N(aI, "stop")
                    }
                },
                restart2: {
                    label: "重新启动",
                    parseData: false,
                    hidden: true,
                    handler: function(aJ, aI) {
                        N(aI, "restart")
                    }
                },
                manage: {
                    label: "权限管理",
                    parseData: false,
                    hidden: true,
                    handler: function(aJ, aI) {
                        N(aI, "manage")
                    }
                }
            }
        },
        extend1: {
            label: "扩展1",
            clsName: "btn-success",
            parseData: false,
            hidden: true,
            handler: function(aJ, aI) {
                N(aI, "extend1")
            }
        },
        extend2: {
            label: "扩展2",
            clsName: "btn-success",
            parseData: false,
            hidden: true,
            handler: function(aJ, aI) {
                N(aI, "extend2")
            }
        },
        extend3: {
            label: "扩展3",
            clsName: "btn-success",
            parseData: false,
            hidden: true,
            handler: function(aJ, aI) {
                N(aI, "extend3")
            }
        },
        print: {
            label: "打印",
            clsName: "btn-info",
            parseData: false,
            hidden: true,
            handler: function(aJ, aI) {
                N(aI, "print")
            }
        },
        view: {
            label: "查看流程",
            clsName: "btn-info",
            parseData: false,
            handler: function(aJ, aI) {
                N(aI, "view")
            }
        }
    };
    var ah = ["quit", "save", "submit", "reject", "restart", "append", "handover", "revoke", "notify", "deliver", "authorize", "reauthorize", "claim", "backpool", "hangup", "classify", "communicate", {
        adminOpt: ["jump", "replace", "stop", "restart2", "manage"]
    },
        "extend1", "extend2", "extend3", "print", "view"];
    var o = {
        ids: {},
        submitUrl: "",
        startNode: "StartEvent",
        endNode: "EndEvent",
        firstNode: "FirstNode",
        lastNode: "LastNode",
        beforeCommit: null,
        afterCommit: null,
        errorCommit: null,
        parseProcessVar: null,
        parseProcessParams: null,
        parseSubProcessVar: null,
        parseBizData: null,
        checkButtons: function(aI) {},
        flowMessages: {},
        autoLoadAssigner: {
            enable: true,
            renderTo: ".flow-assigner-info",
            params: {},
            onLoadSuccess: false,
            forceRefresh: false
        },
        cmdExtend: {}
    };
    var aF = ["quit", "view"];
    var f = "before,after";
    var ae = {
        before: "加签到我之前",
        current: "加签与我会签",
        after: "加签到我之后"
    };
    var q = [{
        name: "important",
        text: "重要任务"
    },
        {
            name: "normal",
            text: "普通任务"
        },
        {
            name: "issue",
            text: "问题任务"
        }];
    var L = "[HANGUP]";
    var aH = {};
    function aC() {
        var aK = c("currentPerson.name");
        var aJ = c("flowInst.applyerName");
        var aL = aJ && aJ != aK ? ("(" + aJ + "的)") : "";
        var aI = c("flowBase.name");
        aH = {
            submit: aK + n("submit") + "了" + aL + aI + "，请处理",
            reject: aK + n("reject") + "了您的" + aL + aI + "，请查阅",
            restart: aK + n("restart") + "了您的" + aL + aI + "，请查阅",
            append: aK + n("append") + "给您了" + aL + aI + "，请处理",
            handover: aK + "将" + aL + aI + "转交给您，请处理",
            notify: aK + n("notify") + "您及时处理" + aL + aI + "，请查阅",
            deliver: aK + "传给您的" + aL + aI + "，请查阅",
            authorize: aK + "授权您处理" + aL + aI + "，请查阅",
            jump: aK + "将" + aL + aI + "跳转给您，请处理",
            replace: aK + "将" + aL + aI + "处理人替换为您，请处理"
        }
    }
    function ag(aI) {
        var aI = aI || c("nodeId");
        return aI && aI == o.startNode
    }
    function Q() {
        return o.startNode || ""
    }
    function H(aI) {
        o.startNode = aI
    }
    function aj(aK) {
        var aK = aK || c("nodeId");
        if (aK && o.endNode) {
            var aI = o.endNode.split(/,|;/);
            for (var aJ = 0; aJ < aI.length; aJ++) {
                if (aK == aI[aJ]) {
                    return true
                }
            }
        }
        return false
    }
    function r() {
        return o.endNode || ""
    }
    function S(aI) {
        o.endNode = aI
    }
    function W(aI) {
        var aI = aI || c("nodeId");
        return aI && aI == o.firstNode
    }
    function F() {
        return o.firstNode || ""
    }
    function B(aI) {
        o.firstNode = aI
    }
    function K(aK) {
        var aK = aK || c("nodeId");
        if (aK && o.lastNode) {
            var aI = o.lastNode.split(/,|;/);
            for (var aJ = 0; aJ < aI.length; aJ++) {
                if (aK == aI[aJ]) {
                    return true
                }
            }
        }
        return false
    }
    function G() {
        return o.lastNode || ""
    }
    function l(aI) {
        o.lastNode = aI
    }
    function V(aI) {
        w.operateType = aI
    }
    function af() {
        return w.operateType
    }
    function ai(aI) {
        var aI = aI || af();
        return ac[aI]
    }
    function n(aI) {
        var aI = aI || af();
        var aJ = b.getValue(ac, O[aI] + ".label", ac[aI]);
        return aJ || aI || ""
    }
    function P(aI) {
        var aI = aI || af();
        return ac[aI].value
    }
    function aw(aK, aI) {
        if (!aK) {
            return ""
        }
        var aJ = ay[aK];
        if (aJ) {
            if (aI) {
                return aJ[aI] || ""
            } else {
                return aJ
            }
        } else {
            return ""
        }
    }
    function x() {
        w = av.extend({
                assigners: {},
                processVar: {},
                subProcessVar: {},
                processParams: {}
            },
            Z("flowDefId,flowKeyId,instId,nodeId,taskUserId,executionId,dataId,formId"));
        if (c("proRunId")) {
            w.proRunId = c("proRunId")
        }
        k = {}
    }
    function ar() {
        x();
        aE("nextNodes", []);
        for (var aI = 0; aI < arguments.length; aI++) {
            if (typeof arguments[aI] == "string") {
                w.operateType = arguments[aI]
            } else {
                av.extend(w, arguments[aI])
            }
        }
        if (w.operateType) {
            w.operateName = n(w.operateType)
        }
    }
    function al(aJ, aI) {
        b.setValue(w, aJ, aI)
    }
    function C(aJ, aI) {
        b.setValue(w.assigners, aJ, aI)
    }
    function E(aJ, aI) {
        b.setValue(w.processVar, aJ, aI)
    }
    function at(aJ, aI) {
        b.setValue(w.subProcessVar, aJ, aI)
    }
    function ad() {
        var aI = arguments[0] || af();
        return aH[aI]
    }
    function U(aK, aJ) {
        var aI = b.getValue(aK, aJ, "");
        if (aI == null || aI == "null") {
            aI = ""
        }
        return aI
    }
    function aB() {
        av("." + b.cssPrefix + "-form-header .form-buttons .btn").each(function() {
            this.disabled = true;
            av(this).addClass("btn-disabled")
        });
        window.setTimeout(function() {
                av("." + b.cssPrefix + "-form-header .form-buttons .btn.btn-disabled").each(function() {
                    this.disabled = false;
                    av(this).removeClass("btn-disabled")
                })
            },
            3000)
    }
    function aa(aJ) {
        if (!R()) {
            return false
        }
        var aI = typeof aJ == "object" ? aJ: ay[aJ];
        if (aI) {
            aB();
            al({
                targetNodeId: aI.id
            });
            var aL = {
                flowKeyId: c("flowKeyId"),
                targetNodeId: aI.id,
                instId: c("instId")
            };
            try {
                aL.paramData = b.stringify(ak(true))
            } catch(aK) {}
            av.get(ap.get_node_user, aL,
                function(aM) {
                    if (!b.ajaxCheckLogin(aM)) {
                        return false
                    }
                    aI.assigners = aM;
                    az({
                        nextNodes: [aI],
                        requires: {
                            nextPerson: false
                        }
                    })
                })
        } else {
            alert("未获取到驳回环节的配置信息")
        }
    }
    function R(aL, aI) {
        var aL = aL || af();
        var aJ = "on" + aL.replace(/^[a-z]/,
            function(aM) {
                return aM.toUpperCase()
            });
        if (typeof o[aJ] == "function") {
            var aK = o[aJ]();
            if (typeof aK == "boolean" && aK == false) {
                return false
            }
        }
        if (aI) {
            aJ = "on" + aI.replace(/^[a-z]/,
                function(aM) {
                    return aM.toUpperCase()
                });
            if (typeof o[aJ] == "function") {
                var aK = o[aJ]();
                if (typeof aK == "boolean" && aK == false) {
                    return false
                }
            }
        }
        return true
    }
    function am(aI) {
        if (!R()) {
            return false
        }
        b.dialog("selectPsn", {
            deptLoad: c("currentPerson.departmentId"),
            success: function(aJ) {
                var aK = b.getListValue(aJ, "name", ",");
                var aL = b.getListValue(aJ, "sysUsername", ",");
                al({
                    appendAuthors: aL,
                    appendType: aI
                });
                az({
                    displays: {
                        flowCommentRow: true,
                        nextNodeRow: true
                    },
                    defaults: {
                        nextPersonName: aK,
                        nextPersonUsername: aL,
                        operateName: ae[aI]
                    }
                })
            }
        })
    }
    function a(aI) {
        b.ajax({
            url: ap.classify,
            data: {
                taskUserId: c("taskUserId"),
                classify: aI
            },
            success: function(aJ) {
                if (!b.ajaxCheckLogin(aJ)) {
                    return false
                }
                if (aJ && aJ.success) {
                    alert("分类标记完成")
                } else {
                    b.ajaxMessage(aJ)
                }
            }
        })
    }
    var i = {
        quit: function(aI) {
            if (confirm("确定【" + n() + "】页面？（请确定您的数据已经保存）")) {
                b.closeWindow()
            }
        },
        save: function(aI) {
            if (confirm("确定【" + n() + "】？")) {
                u()
            }
        },
        submit: function(aI) {
            aB();
            u()
        },
        reject: function(aK) {
            var aI = P();
            var aJ = [];
            if (aI == "[toPreNode]") {
                aJ.push(j[j.length - 1])
            } else {
                if (aI == "[toAnyNode]") {
                    aJ = j
                } else {
                    if (!aI || aI == "[toStart]") {
                        aJ.push(aw(F()))
                    } else {
                        aJ = aI.split(/,|;/)
                    }
                }
            }
            if (aJ.length == 1) {
                aa(aJ[0])
            } else {
                if (aJ.length > 1) {
                    if (!d && aK != null) {
                        var aL = av('<ul class="dropdown-menu"></ul>');
                        aK.addClass("dropdown-toggle").after(aL);
                        aL.empty();
                        av.each(aJ,
                            function(aM, aN) {
                                aL.append("<li " + b.cssPrefix + "-flow-action='" + aN + "'><a href='javascript:void(0)'><span>到：" + ay[aN].name + "</span></a></li>")
                            });
                        aL.find("li").click(function() {
                            aa(av(this).attr("" + b.cssPrefix + "-flow-action"))
                        });
                        d = true;
                        aK.attr("data-toggle", "dropdown")
                    }
                }
            }
        },
        append: function(aJ) {
            var aI = P() || "before;current;after";
            var aL = aI.split(/,|;/);
            if (aL.length == 1) {
                am(aL[0])
            } else {
                if (!au && aJ) {
                    var aK = av('<ul class="dropdown-menu"></ul>');
                    aJ.addClass("dropdown-toggle").after(aK);
                    aK.empty();
                    av.each(aL,
                        function(aN, aM) {
                            var aO = av('<li><a href="javascript:void(0)"><span>' + ae[aM] + "</span></a></li>");
                            aK.append(aO);
                            aO.click(function() {
                                am(aM)
                            })
                        });
                    au = true;
                    aJ.attr("data-toggle", "dropdown")
                }
            }
        },
        handover: function(aI) {
            b.dialog("selectPsn", {
                singleSelect: true,
                deptLoad: c("currentPerson.departmentId"),
                success: function(aJ) {
                    var aK = b.getListValue(aJ, "name", ",");
                    var aL = b.getListValue(aJ, "sysUsername", ",");
                    al({
                        newAssigner: aL
                    });
                    az({
                        displays: {
                            flowCommentRow: true,
                            nextNodeRow: true
                        },
                        defaults: {
                            nextPersonName: aK,
                            nextPersonUsername: aL
                        }
                    })
                }
            })
        },
        revoke: function(aI) {
            if (confirm("确定【" + n() + "】")) {
                u()
            }
        },
        notify: function(aI) {
            b.dialog("selectPsn", {
                deptLoad: c("currentPerson.departmentId"),
                success: function(aJ) {
                    var aK = b.getListValue(aJ, "name", ",");
                    var aL = b.getListValue(aJ, "sysUsername", ",");
                    al({
                        notifyReceivers: aL
                    });
                    az({
                        displays: {
                            flowCommentRow: true,
                            nextNodeRow: true
                        },
                        defaults: {
                            nextPersonName: aK,
                            nextPersonUsername: aL
                        }
                    })
                }
            })
        },
        deliver: function(aI) {
            b.dialog("selectPsn", {
                deptLoad: c("currentPerson.departmentId"),
                success: function(aJ) {
                    var aK = b.getListValue(aJ, "name", ",");
                    var aL = b.getListValue(aJ, "sysUsername", ",");
                    az({
                        displays: {
                            flowCommentRow: true,
                            nextNodeRow: true
                        },
                        defaults: {
                            nextPersonName: aK,
                            nextPersonUsername: aL
                        }
                    })
                }
            })
        },
        authorize: function(aI) {
            b.dialog("selectPsn", {
                deptLoad: c("currentPerson.departmentId"),
                singleSelect: true,
                success: function(aJ) {
                    var aK = b.getListValue(aJ, "name", ",");
                    var aL = b.getListValue(aJ, "sysUsername", ",");
                    al({
                        authorAssigner: aL
                    });
                    az({
                        displays: {
                            flowCommentRow: true,
                            nextNodeRow: true
                        },
                        defaults: {
                            nextPersonName: aK,
                            nextPersonUsername: aL
                        }
                    })
                }
            })
        },
        reauthorize: function(aI) {
            var aJ = c("currentTask.assignerName") + "[" + c("currentTask.nodeName") + "]";
            if (confirm("确定【" + n() + "】【" + aJ + "】？")) {
                u()
            }
        },
        claim: function(aI) {
            if (confirm("确定【" + n() + "】？")) {
                b.ajax({
                    url: ap.single_claim,
                    data: {
                        taskUserId: c("taskUserId")
                    },
                    success: function(aJ) {
                        if (!b.ajaxCheckLogin(aJ)) {
                            return false
                        }
                        if (aJ && aJ.success) {
                            alert("认领成功，流程将重新加载，请稍后");
                            self.location.reload()
                        } else {
                            b.ajaxMessage(aJ)
                        }
                    }
                })
            }
        },
        hangup: function(aI) {
            if (confirm("确定【" + n() + "】？")) {
                al("classify", L);
                u()
            }
        },
        backpool: function(aI) {
            if (confirm("确定【" + n() + "】？")) {
                u()
            }
        },
        classify: function(aI) {
            if (!A && aI) {
                var aJ = av('<ul class="dropdown-menu"></ul>');
                aI.addClass("dropdown-toggle").after(aJ);
                aJ.empty();
                av.each(q,
                    function(aK, aM) {
                        var aL = av("<li><a href='javascript:void(0)'><span>" + aM.text + "</span></a></li>");
                        aJ.append(aL);
                        aL.click(function() {
                            a(aM.name)
                        })
                    });
                A = true;
                aI.attr("data-toggle", "dropdown")
            }
        },
        communicate: function(aI) {
            h()
        },
        jump: function(aK) {
            if (!p && aK) {
                var aI = P() || "";
                var aJ = aI.split(/,|;/);
                var aL = av('<ul class="dropdown-menu"></ul>');
                aK.addClass("dropdown-toggle").after(aL);
                aL.empty();
                if (aI && aJ.length > 0) {
                    av.each(aJ,
                        function(aM, aN) {
                            var aO = av("<li><a href='javascript:void(0)'><span>到：" + aw(aN, "name") + "</span></a></li>");
                            aL.append(aO);
                            aO.click(function() {
                                aa(aN)
                            })
                        })
                } else {
                    av.each(ay,
                        function(aO, aM) {
                            var aN = av("<li><a href='javascript:void(0)'><span>到：" + aM.name + "</span></a></li>");
                            aL.append(aN);
                            aN.click(function() {
                                aa(aO)
                            })
                        })
                }
                p = true;
                aK.attr("data-toggle", "dropdown")
            }
        },
        replace: function(aI) {
            b.dialog("selectPsn", {
                deptLoad: c("currentPerson.departmentId"),
                singleSelect: true,
                success: function(aJ) {
                    var aK = b.getListValue(aJ, "name", ",");
                    var aL = b.getListValue(aJ, "sysUsername", ",");
                    al({
                        newAssigner: aL
                    });
                    az({
                        displays: {
                            flowCommentRow: true,
                            nextNodeRow: true
                        },
                        defaults: {
                            nextPersonName: aK,
                            nextPersonUsername: aL
                        }
                    })
                }
            })
        },
        stop: function(aI) {
            if (confirm("确定【" + n() + "】？")) {
                u()
            }
        },
        manage: function(aI) {},
        print: function(aI) {
            alert("为了更好的打印效果，建议使用浏览器的【文件】【打印预览】功能");
            window.print()
        },
        view: function(aI) {
            b.dialog({
                key: "flow_view",
                title: "流程查看",
                content: "",
                forceInit: false,
                width: "800px",
                backdrop: true,
                ready: function(aK) {
                    var aJ = '<div class="flow-hi-view"><ul class="nav nav-tabs"><li class="active"><a href="#_flow_view_img" flow-hi-type="img">流程图</a></li><li><a href="#_flow_hi_node" flow-hi-type="node">流转记录</a></li><li><a href="#_flow_hi_action" flow-hi-type="action">操作记录</a></li><li><a href="#_flow_hi_task" flow-hi-type="task">任务记录</a></li><li><a href="#_flow_hi_comment" flow-hi-type="comment">批示意见</a></li></ul><div class="tab-content"><div class="tab-pane active" id="_flow_view_img"></div><div class="tab-pane" id="_flow_hi_node"></div><div class="tab-pane" id="_flow_hi_action"></div><div class="tab-pane" id="_flow_hi_task"></div><div class="tab-pane" id="_flow_hi_comment"></div></div></div>';
                    aK.find(".modal-body").html(aJ);
                    aK.find(".nav li a").attr("data-toggle", "tab").click(function() {
                        var aN = av(this).attr("href");
                        var aO = aK.find(aN);
                        var aL = av(this).attr("flow-hi-type");
                        if (aO.html() == "") {
                            var aP = av('<div class="loading-img"></div>');
                            aP.appendTo(aO);
                            if (aL == "img") {
                                aO.append("<table><tr><td style='width:60%'></td><td style='width:40%'></td></tr></table>");
                                aO.find("td").css({
                                    "vertical-align": "top",
                                    padding: "10px"
                                });
                                av('<img src="' + ap.view + "?_ti+=" + (new Date()).getTime() + "&" + b.urlSerialize(Z("flowDefId,flowKeyId,instId,executionId")) + '" style="display:none">').load(function() {
                                    aP.remove();
                                    aO.find("td:last").append('<div class="flow-description"><h3>' + c("flowBase.name") + "</h3><span>流程说明：</span>" + c("flowBase.description") + "</div>");
                                    aO.css("text-align", "center").find("img").css("display", "inline-block")
                                }).appendTo(aO.find("td:first"))
                            } else {
                                if (aL == "comment") {
                                    aP.remove();
                                    if (D && D.length) {
                                        var aM = av('<table class="table flow-hi-table"></table>');
                                        aM.append("<thead><tr><td>处理人</td><td>处理环节</td><td>处理类型</td><td>处理时间</td></tr></thead>");
                                        av.each(D,
                                            function(aR, aQ) {
                                                aM.append('<tr class="flow-user-row"><td>' + U(aQ, "operaterName") + "</td><td>" + U(aQ, "nodeName") + "</td><td>" + n(U(aQ, "operateType")) + "</td><td>" + U(aQ, "operateTime") + '</td></tr><tr class="flow-comment-row"><td colspan="4">' + U(aQ, "opinion") + "</td></tr>")
                                            });
                                        aM.appendTo(aO)
                                    } else {
                                        aO.html("<p>未查询到相关记录</p>")
                                    }
                                } else {
                                    if (!c("isNewFlow")) {
                                        av.get(ap.get_history, {
                                                instId: c("instId"),
                                                hiType: aL
                                            },
                                            function(aR) {
                                                aP.remove();
                                                if (aR && aR.length) {
                                                    var aQ = av('<table class="table flow-hi-table"></table>');
                                                    if (aL == "node") {
                                                        aQ.append("<thead><tr><td>流程环节</td><td>环节类型</td><td>开始时间</td><td>结束时间</td></tr></thead>");
                                                        av.each(aR,
                                                            function(aT, aS) {
                                                                if (U(aS, "nodeName")) {
                                                                    aQ.append('<tr class=""><td>' + U(aS, "nodeName") + "</td><td>" + U(aS, "nodeType") + "</td><td>" + U(aS, "nodeBeginTime") + "</td><td>" + U(aS, "nodeEndTime") + "</td></tr>")
                                                                }
                                                            })
                                                    } else {
                                                        if (aL == "action") {
                                                            aQ.append("<thead><tr><td>操作时间</td><td>操作人</td><td>操作类型</td><td>操作环节</td><td>流向环节</td></tr></thead>");
                                                            av.each(aR,
                                                                function(aT, aS) {
                                                                    aQ.append("<tr><td>" + U(aS, "operateTime") + "</td><td>" + U(aS, "operaterName") + "</td><td>" + n(U(aS, "operateType") || "-") + "</td><td>" + U(aS, "nodeName") + "</td><td>" + U(aS, "flowNodeName") + "</td></tr>")
                                                                })
                                                        } else {
                                                            if (aL == "task") {
                                                                aQ.append("<thead><tr><td>任务环节</td><td>开始时间</td><td>完成时间</td><td>预定处理人</td><td>实际处理人</td></tr></thead>");
                                                                av.each(aR,
                                                                    function(aT, aS) {
                                                                        aQ.append("<tr><td>" + U(aS, "nodeName") + "</td><td>" + U(aS, "beginTime") + "</td><td>" + U(aS, "endTime") + "</td><td>" + U(aS, "preAssignerName") + "</td><td>" + U(aS, "realAssignerName") + "</td></tr>")
                                                                    })
                                                            } else {
                                                                if (aL == "comm") {
                                                                    aQ.append("<thead><tr><td>处理人</td><td>处理环节</td><td>操作类型</td><td>处理时间</td></tr></thead>");
                                                                    av.each(aR,
                                                                        function(aT, aS) {
                                                                            var aU = aw([aS.refKey], "name");
                                                                            aQ.append('<tr class="flow-user-row"><td>' + U(aS, "creatorName") + "</td><td>" + aU + "</td><td>发起</td><td>" + U(aS, "createDate") + '</td></tr><tr class="flow-comment-row"><td colspan="4">' + U(aS, "content") + "</td></tr>");
                                                                            if (U(aS, "replyDate")) {
                                                                                aQ.append('<tr class="flow-user-row"><td>' + U(aS, "replierName") + "</td><td>" + aU + "</td><td>答复</td><td>" + U(aS, "replyDate") + '</td></tr><tr class="flow-comment-row"><td colspan="4">' + U(aS, "replyContent") + "</td></tr>")
                                                                            }
                                                                        })
                                                                }
                                                            }
                                                        }
                                                    }
                                                    aO.append(aQ)
                                                } else {
                                                    aO.html("<p>未查询到相关记录</p>")
                                                }
                                            })
                                    } else {
                                        aO.html("<p>未查询到相关记录</p>")
                                    }
                                }
                            }
                        }
                    }).first().click()
                }
            })
        },
        restart: function(aI) {
            if (aj()) {
                ar("restart")
            } else {
                ar("reject")
            }
            aa(aw(F()))
        },
        extend1: function(aI) {
            aB();
            if (typeof o.extAction1 == "function") {
                o.extAction1()
            }
        },
        extend2: function(aI) {
            aB();
            if (typeof o.extAction2 == "function") {
                o.extAction2()
            }
        },
        extend3: function(aI) {
            aB();
            if (typeof o.extAction3 == "function") {
                o.extAction3()
            }
        }
    };
    function N(aN, aM, aK) {
        var aI, aL;
        for (var aJ = 0; aJ < arguments.length && aJ < 2; aJ++) {
            if (typeof arguments[aJ] == "string") {
                aL = arguments[aJ]
            } else {
                aI = arguments[aJ]
            }
        }
        if (typeof i[aL] == "function") {
            ar(aL);
            if (!R(aL, aK)) {
                return false
            }
            i[aL](aI)
        }
    }
    function az(aJ) {
        var aM = [];
        var aL = {
            operateName: "",
            flowComment: "",
            flowMessage: ""
        };
        var aK = {
            flowComment: true,
            flowMessage: true,
            nextPerson: true
        };
        var aI = {
            nextPersonRow: false,
            flowCommentRow: false,
            flowMessageRow: false,
            commentsAddRow: true
        };
        if (aJ) {
            if (aJ.nextNodes) {
                aM = aJ.nextNodes
            }
            if (aJ.defaults) {
                av.extend(aL, aJ.defaults)
            }
            if (aJ.requires) {
                av.extend(aK, aJ.requires)
            }
            if (aJ.displays) {
                av.extend(aI, aJ.displays)
            }
        }
        if (!aL.operateName) {
            aL.operateName = n()
        }
        if (!aL.flowMessage) {
            aL.flowMessage = ad()
        }
        aI.commentsAddRow = !aI.flowCommentRow;
        if (aM[0] && aj(aM[0].id)) {
            aI.nextPersonRow = true;
            aL.nextNodeName = "结束"
        }
        aE("nextNodes", aM);
        b.dialog({
            key: "flow_cf",
            title: "请确认操作",
            content: b.Dialog.HTMLTemplate.flowConfirm,
            width: "620px",
            ready: function(aP) {
                aP.find("[" + b.cssPrefix + "-comp-id='nextNodeRow']:gt(0)").remove();
                aP.find("[" + b.cssPrefix + "-comp-id='nextPersonRow']:gt(0)").remove();
                aP.find("[" + b.cssPrefix + "-comp-id]").each(function() {
                    var aQ = av(this).attr("" + b.cssPrefix + "-comp-id");
                    if (aI[aQ]) {
                        aK[aQ] = false;
                        av(this).hide()
                    } else {
                        av(this).show()
                    }
                    if (av(this).is("input:text,textarea")) {
                        av(this).val(aL[aQ] || "")
                    }
                });
                if (!aI.nextPersonRow) {
                    var aN = null;
                    var aO = null;
                    av.each(aM,
                        function(aS, aR) {
                            if (aN) {
                                aN = aN.clone().insertAfter(aO);
                                aO = aO.clone().insertAfter(aN)
                            } else {
                                aN = aP.find("div[" + b.cssPrefix + "-comp-id='nextNodeRow']");
                                aO = aP.find("div[" + b.cssPrefix + "-comp-id='nextPersonRow']")
                            }
                            aN.find("label span").html("[" + (aS + 1) + "]");
                            aO.find("label span").html("[" + (aS + 1) + "]");
                            aN.find("input:first").val(aR.name + (aR.groupTask ? "[任务池]": ""));
                            var aQ = "";
                            var aT = "";
                            if (aR.groupTask) {
                                aR.replacePerson = false
                            }
                            if (af() != "submit" || b.isEmpty(aR.assigners) || c("nodeId") != aR.id) {
                                var aU = aD();
                                if (b.isEmpty(aU)) {
                                    var aV = "input[flow-assigner-node*='" + aR.id + "']";
                                    aQ = av(aV + "[flow-assigner-field='assignerId']").val() || "";
                                    aT = av(aV + "[flow-assigner-field='assignerName']").val() || aQ
                                } else {
                                    aQ = b.getValue(aU, aR.id + ".assignerId", "");
                                    aT = b.getValue(aU, aR.id + ".assignerName", aQ)
                                }
                            }
                            if (aQ) {
                                aO.find("input[" + b.cssPrefix + "-comp-id='nextPersonName']").val(aT);
                                aO.find("input[" + b.cssPrefix + "-comp-id='nextPersonUsername']").val(aQ)
                            } else {
                                if (aR.assigners && aR.assigners.length) {
                                    aQ = b.getListValue(aR.assigners, "sysUsername", ",");
                                    aT = b.getListValue(aR.assigners, "name", ",");
                                    if (aT.replace(/,| /g, "") == "") {
                                        aT = aQ
                                    }
                                    aO.find("input:first").val(aR.groupTask ? "[系统]": aT);
                                    aN.show();
                                    aO.show()
                                } else {
                                    if (aj(aR.id)) {
                                        aR.replacePerson = 0;
                                        aN.hide();
                                        aO.hide()
                                    } else {
                                        if (aR.autoSkipWhenNull == 1) {
                                            aR.replacePerson = 0;
                                            aK.nextPerson = false;
                                            aT = "[系统]";
                                            aO.find("input[" + b.cssPrefix + "-comp-id='nextPersonName']").val(aT)
                                        } else {
                                            aN.show();
                                            aO.show()
                                        }
                                    }
                                }
                            }
                            if (aM.length < 2) {
                                if (!aN) {
                                    aN = aP.find("div[" + b.cssPrefix + "-comp-id='nextNodeRow']");
                                    aO = aP.find("div[" + b.cssPrefix + "-comp-id='nextPersonRow']")
                                }
                                aN.find("label span").html("");
                                aO.find("label span").html("")
                            }
                            if (aR.replacePerson) {
                                aO.find("input[" + b.cssPrefix + "-comp-id='nextPersonName']").parent().removeClass().addClass("col-xs-6");
                                aO.find("button[" + b.cssPrefix + "-comp-id='authorSelector']").unbind("click").click(function() {
                                    var aW = av(this).parent().prev();
                                    b.dialog("selectPsn", {
                                        key: "xx",
                                        backdrop: false,
                                        deptLoad: c("currentPerson.departmentId"),
                                        success: function(aY) {
                                            var aX = b.getListValue(aY, "name", ",");
                                            var aZ = b.getListValue(aY, "sysUsername", ",");
                                            aW.find("input[" + b.cssPrefix + "-comp-id='nextPersonName']").val(aX);
                                            aW.find("input[" + b.cssPrefix + "-comp-id='nextPersonUsername']").val(aZ)
                                        }
                                    })
                                }).parent().show()
                            } else {
                                aO.find("button[" + b.cssPrefix + "-comp-id='authorSelector']").parent().hide();
                                aO.find("input[" + b.cssPrefix + "-comp-id='nextPersonName']").parent().removeClass().addClass("col-xs-8")
                            }
                        });
                    if (!aM.length) {
                        aP.find("button[" + b.cssPrefix + "-comp-id='authorSelector']").parent().hide();
                        aP.find("input[" + b.cssPrefix + "-comp-id='nextPersonName']").parent().removeClass().addClass("col-xs-8")
                    }
                }
                aP.find("div[" + b.cssPrefix + "-comp-id='commentsAdd'] span").click(function() {
                    aP.find("div[" + b.cssPrefix + "-comp-id='commentsAddRow']").hide();
                    aP.find("div[" + b.cssPrefix + "-comp-id='flowCommentRow']").show()
                });
                aP.find("div[" + b.cssPrefix + "-comp-id='tempComments'] span").hide();
                aP.find("div[" + b.cssPrefix + "-comp-id='tempComments'] span." + af()).show().click(function() {
                    aP.find("textarea[" + b.cssPrefix + "-comp-id='flowComment']").val(av(this).text())
                })
            },
            success: function(aR) {
                var aQ = {};
                var aN = true;
                if (!aI.nextPersonRow) {
                    aR.find("input[" + b.cssPrefix + "-comp-id='nextPersonUsername']").each(function(aU, aV) {
                        var aT = aV.value;
                        var aS = av(aV).prev().val();
                        if (!aS && aK.nextPerson) {
                            alert("请选择【" + av(this).parent().prev().text() + "】");
                            aN = false;
                            return false
                        } else {
                            if (aT) {
                                C(aM[aU].id, aT)
                            }
                        }
                    })
                }
                if (!aN) {
                    return false
                }
                var aP = aR.find("textarea[" + b.cssPrefix + "-comp-id='flowComment']");
                var aO = aP.val();
                if (!aO && !aI.flowCommentRow && aK.flowComment) {
                    alert("请填写【" + aP.parent().prev().text() + "】");
                    return false
                }
                al("flowComment", aO);
                aP = aR.find("input[" + b.cssPrefix + "-comp-id='flowMessage']");
                aO = aP.val();
                if (!aO && !aI.flowMessageRow && aK.flowMessage) {
                    alert("请填写【" + aP.parent().prev().text() + "】");
                    return false
                }
                al("flowMessage", aO);
                if (aM.length) {
                    al("nextNodeId", b.getListValue(aM, "id"))
                }
                aR.modal("hide");
                if (typeof aJ.beforeOk == "function" && aJ.beforeOk() === false) {
                    return false
                }
                if (af() == "submit") {
                    m()
                } else {
                    u()
                }
                return false
            }
        })
    }
    function h() {
        b.dialog({
            key: "comm_cr",
            title: "在线沟通",
            content: b.Dialog.HTMLTemplate.createComm,
            width: "620px",
            ready: function(aI) {
                aI.find("input[" + b.cssPrefix + "-comp-id='subject']").val("关于“" + c("flowBase.name") + "”，请回复");
                aI.find("input[" + b.cssPrefix + "-comp-id='refId']").val(c("instId"));
                aI.find("input[" + b.cssPrefix + "-comp-id='refKey']").val(c("nodeId"));
                aI.find("button[" + b.cssPrefix + "-comp-id='replierSelector']").click(function() {
                    var aJ = av(this).parent().prev();
                    b.dialog("selectPsn", {
                        key: "xx",
                        backdrop: false,
                        deptLoad: c("currentPerson.departmentId"),
                        singleSelect: true,
                        success: function(aL) {
                            var aK = b.getListValue(aL, "name", ",");
                            var aM = b.getListValue(aL, "sysUsername", ",");
                            aJ.find("input[" + b.cssPrefix + "-comp-id='replierName']").val(aK);
                            aJ.find("input[" + b.cssPrefix + "-comp-id='replierId']").val(aM)
                        }
                    })
                })
            },
            success: function(aK) {
                var aJ = {};
                var aI = true;
                aK.find("input[" + b.cssPrefix + "-comp-id],textarea[" + b.cssPrefix + "-comp-id]").each(function(aM, aN) {
                    var aL = av(this).val();
                    if (!aL && av(this).is(":visible")) {
                        alert("请选择或者填写【" + av(this).parent().prev().text() + "】");
                        aI = false;
                        return false
                    }
                    aJ[av(this).attr("" + b.cssPrefix + "-comp-id")] = aL
                });
                if (!aI) {
                    return false
                }
                aK.modal("hide");
                b.ajax({
                    url: ap.create_comm,
                    data: aJ,
                    success: function(aL) {
                        if (!b.ajaxCheckLogin(aL)) {
                            return false
                        }
                        if (aL.success) {
                            alert("沟通信息已发送，请等待回复")
                        } else {
                            b.ajaxMessage(aL, "操作失败！\n\n")
                        }
                    }
                });
                return false
            }
        })
    }
    function M() {
        if (typeof o.parseProcessVar == "function") {
            var aI = o.parseProcessVar();
            if (typeof aI == "object") {
                b.setValue(w.processVar, aI)
            }
        }
    }
    function ak(aK) {
        var aM = {};
        var aI = c("flowBase.bizDataRule");
        if (aI) {
            aI = b.toObject(aI);
            if (b.isArray(aI)) {
                var aJ = {};
                if (aK) {
                    aJ = y()
                }
                av.each(aI,
                    function(aO, aN) {
                        if (aN.propertyName) {
                            if (aN.formField) {
                                aM[aN.propertyName] = av(aN.formField).val() || ""
                            } else {
                                aM[aN.propertyName] = b.getValue(aJ, aN.propertyName, "");
                                if (aN.bizDataKey && b.getValue(aJ, aN.bizDataKey, "")) {
                                    aM[aN.propertyName] = b.getValue(aJ, aN.bizDataKey)
                                }
                            }
                        }
                    })
            }
        }
        if (typeof o.parseProcessParams == "function") {
            var aL = o.parseProcessParams();
            if (typeof aL == "object") {
                av.extend(aM, aL)
            }
        }
        return aM
    }
    function ao() {
        b.setValue(w.processParams, ak(true))
    }
    function ax() {
        if (typeof o.parseSubProcessVar == "function") {
            var aI = o.parseSubProcessVar();
            if (typeof aI == "object") {
                b.setValue(w.subProcessVar, aI)
            }
        }
    }
    function y() {
        var aI = {};
        if (typeof o.parseBizData == "function") {
            var aJ = o.parseBizData();
            if (typeof aJ == "object") {
                b.setValue(aI, aJ)
            }
        }
        return aI
    }
    function aD() {
        var aI = {};
        if (!o.parsePreAssigner) {
            o.parsePreAssigner = o.preAssignerFields
        }
        if (b.isObject(o.parsePreAssigner)) {
            av.each(o.parsePreAssigner,
                function(aK, aJ) {
                    if (b.isNotEmpty(av(aJ.idField).val())) {
                        aI[aK] = {
                            assignerId: av(aJ.idField).val()
                        };
                        if (aJ.nameField) {
                            aI[aK]["assignerName"] = av(aJ.nameField).val()
                        }
                    }
                })
        } else {
            if (b.isFunction(o.parsePreAssigner)) {
                aI = av.extend(aI, o.parsePreAssigner())
            }
        }
        return aI
    }
    function ab() {
        var aI = {};
        if (typeof o.parseOtherData == "function") {
            aI = av.extend(aI, o.parseOtherData())
        }
        return aI
    }
    function u() {
        var aJ = af();
        M();
        ao();
        ax();
        if (aJ == "submit") {
            var aI = true;
            if (W() && b.getValue(o, "autoLoadAssigner.enable", false)) {
                b.ajax({
                    url: ap.get_all_next_node,
                    backdrop: false,
                    async: false,
                    data: w,
                    success: function(aK) {
                        if (b.ajaxCheckLogin(aK)) {
                            aI = T(aK)
                        }
                    }
                })
            }
            if (aI) {
                b.ajax({
                    backdrop: false,
                    url: ap.get_next_node,
                    data: w,
                    success: function(aK) {
                        if (!b.ajaxCheckLogin(aK)) {
                            return false
                        }
                        if (b.isEmpty(aK)) {
                            alert("流程配置或者参数处理有误，无法获取下一环节");
                            return false
                        }
                        az({
                            nextNodes: aK,
                            requires: {
                                flowComment: !W()
                            },
                            displays: {
                                flowCommentRow: W()
                            }
                        })
                    }
                })
            }
        } else {
            m()
        }
    }
    function m() {
        if (typeof o.beforeCommit == "function") {
            var aJ = o.beforeCommit(c("nextNodes"));
            if (typeof aJ == "boolean" && aJ == false) {
                return false
            }
        }
        w.preAssigners = aD();
        var aI = {
            flowData: b.stringify(w),
            formData: b.stringify(y()),
            otherData: b.stringify(ab())
        };
        b.ajax({
            url: ap.submit,
            data: aI,
            success: function(aM) {
                if (!b.ajaxCheckLogin(aM)) {
                    return false
                }
                if (aM && aM.success) {
                    try {
                        if (window.opener) {
                            if (!b.isEmpty(window.opener.parent)) {
                                window.opener.location.reload()
                            }
                        }
                    } catch(aN) {}
                    alert("流程【" + n() + "】成功！");
                    if (typeof o.afterCommit == "function") {
                        o.afterCommit(aM)
                    } else {
                        var aL = af();
                        switch (aL) {
                            case "notify":
                                break;
                            case "replace":
                                window.location.reload();
                                break;
                            case "append":
                                var aK = w.appendType;
                                if (aK != "before") {
                                    alert("请继续处理该流程")
                                } else {
                                    b.closeWindow()
                                }
                                break;
                            default:
                                b.closeWindow()
                        }
                    }
                } else {
                    if (aM && typeof o.errorCommit == "function") {
                        o.errorCommit(aM)
                    } else {
                        b.ajaxMessage(aM, "流程操作失败！\n\n")
                    }
                }
            }
        })
    }
    function X(aI) {
        av.extend(true, o, aI);
        av.each(ap,
            function(aL, aK) {
                ap[aL] = b.basePath() + aK
            });
        aE(o.ids);
        if (typeof o.isNewData == "boolean") {
            aE("isNewData", o.isNewData)
        }
        if (o.submitUrl) {
            ap.submit = o.submitUrl
        }
        if (o.buttons) {
            av.extend(true, ac, o.buttons)
        }
        if (o.cmdExtend) {
            av.extend(i, o.cmdExtend)
        }
        O = {};
        av.each(ac,
            function(aL, aK) {
                O[aL] = aL;
                if (b.isNotEmpty(aK.dropdowns)) {
                    av.each(aK.dropdowns,
                        function(aN, aM) {
                            O[aN] = aL + ".dropdowns." + aN
                        })
                }
            });
        if (c("flowBase.id")) {
            e()
        } else {
            var aJ = Z("flowKeyId,instId,nodeId,taskUserId,executionId,dataId,appKeyId");
            aJ.preAssignerFrom = o.preAssignerFrom || "";
            b.ajax({
                url: ap.init,
                data: aJ,
                success: function(aK) {
                    if (!b.ajaxCheckLogin(aK)) {
                        return false
                    }
                    e(aK)
                }
            })
        }
    }
    function e(aO) {
        if (aO) {
            aE(aO)
        }
        var aI = c("flowNodes");
        if (c("flowBase.id") && aI && aI.length) {
            aE("flowDefId", c("flowBase.id"));
            if (!F()) {
                B(aI[0].id)
            }
            if (c("currentNode.nodeId")) {
                aE("nodeId", c("currentNode.nodeId"))
            } else {
                if (c("flowInst.currentNodeId")) {
                    aE("nodeId", c("flowInst.currentNodeId"))
                }
            }
            if (c("isNewFlow")) {
                aE("nodeId", F())
            } else {
                aE("instId", c("flowInst.actInstId"));
                aE("proRunId", c("flowInst.proRunId"))
            }
            ay = {};
            av.each(aI,
                function(aP, aQ) {
                    ay[aQ.id] = aQ
                });
            aq = {};
            s = [];
            av.each(aF,
                function(aQ, aP) {
                    aq[aP] = true
                });
            if ((typeof o.readonly == "boolean" && o.readonly) || (typeof o.readonly == "function" && o.readonly())) {
                aE("isAuthor", false)
            } else {
                var aK = c("nodeButtons");
                if (aK && aK.length) {
                    av.each(aK,
                        function(aQ, aP) {
                            aq[aP.key] = true;
                            aA[aP.key] = aP;
                            s.push(aP.key);
                            if (aP.text && aP.text != "null") {
                                b.setValue(ac, O[aP.key] + ".label", aP.text)
                            }
                            if (aP.value && aP.value != "null") {
                                b.setValue(ac, O[aP.key] + ".value", aP.value)
                            }
                            if (aP.type && aP.type != "null") {
                                b.setValue(ac, O[aP.key] + ".type", aP.type)
                            }
                        })
                }
                if (c("isMyAuthorized")) {
                    aq.reauthorize = true
                } else {
                    aq.reauthorize = false
                }
                if (!c("isTaskPool") || c("isClaimedTask")) {
                    aq.claim = false
                }
                if (!c("isTaskPool") || !c("isClaimedTask")) {
                    aq.backpool = false
                }
                if (c("isTaskPool") && !c("isClaimedTask")) {
                    av.each(aq,
                        function(aP) {
                            if (b.inArray(aF, aP) == -1 && aP != "claim") {
                                aq[aP] = false
                            }
                        })
                }
                if (c("currentTask.id")) {
                    aE("taskUserId", c("currentTask.id"));
                    aE("executionId", c("currentTask.actExecutionId"));
                    var aN = c("currentTask.lastOperateType");
                    if (aN == "authorize") {
                        aq.authorize = false;
                        aq.handover = false
                    } else {
                        if (aN == "handover") {
                            aq.authorize = false;
                            aq.handover = false
                        } else {
                            if (aN == "append") {
                                aq.append = false
                            }
                        }
                    }
                    if (c("currentTask.classify") == L) {
                        aq.hangup = false
                    }
                }
            }
            aC();
            var aM = c("flowHiNodeIds");
            if (aM && aM.length) {
                var aJ = {};
                av.each(aM,
                    function(aQ, aP) {
                        aJ[aP] = true
                    });
                for (var aL = 0; aL < aI.length; aL++) {
                    if (aI[aL].id == c("nodeId")) {
                        break
                    }
                    if (aJ[aI[aL].id]) {
                        j.push(aI[aL])
                    }
                }
            }
            g()
        } else {
            alert("流程初始化失败")
        }
    }
    function g() {
        if (o.flowMessages) {
            av.extend(aH, o.flowMessages)
        }
        if (typeof o.checkButtons == "function") {
            o.checkButtons(aq)
        }
        aq.hangup = false;
        var aK = [];
        if (b.isNotEmpty(o.toolbar)) {
            ah = o.toolbar
        }
        if (b.isNotEmpty(aq)) {
            var aJ = false;
            av.each(ah,
                function(aP, aN) {
                    if (b.isObject(aN)) {
                        av.each(aN,
                            function(aU, aS) {
                                var aR = [];
                                av.each(aS,
                                    function(aV, aW) {
                                        if (aq[aW]) {
                                            aR.push(aW);
                                            b.setValue(ac[aU], "dropdowns." + aW + ".hidden", false)
                                        }
                                    });
                                if (aR.length > 0) {
                                    b.setValue(ac[aU], "hidden", false);
                                    var aT = {};
                                    aT[aU] = aR;
                                    aK.push(aT)
                                } else {
                                    if (aq[aU]) {
                                        b.setValue(ac[aU], "hidden", false);
                                        aK.push(aU)
                                    }
                                }
                            })
                    } else {
                        if (aq[aN]) {
                            b.setValue(ac[aN], "hidden", false);
                            if (b.isNotEmpty(ac[aN])) {
                                var aM = aN;
                                if (aN == "append") {
                                    if (!ac[aN].value) {
                                        ac[aN].value = f
                                    }
                                    var aL = ac[aN].value.split(/,|;/);
                                    av.each(aL,
                                        function(aS, aR) {
                                            b.setValue(ac, aN + ".dropdowns." + aR + ".hidden", false)
                                        });
                                    aM = {
                                        append: aL
                                    }
                                } else {
                                    if (aN == "reject") {
                                        if (ac[aN].value && ac[aN].value != "[toStart]") {
                                            z = true;
                                            var aQ = {};
                                            var aO = [];
                                            if (ac[aN].value == "[toPreNode]") {
                                                aO.push(b.getValue(j[j.length - 1], "id", "FirstNode"))
                                            } else {
                                                if (ac[aN].value == "[toAnyNode]") {
                                                    aO = b.getListValue(j, "id", true)
                                                } else {
                                                    aO = ac[aN].value.split(/,|;/)
                                                }
                                            }
                                            var aL = [];
                                            av.each(aO,
                                                function(aR, aS) {
                                                    aL.push("reject" + aR);
                                                    aQ["reject" + aR] = {
                                                        label: "到：" + ay[aS].name,
                                                        handler: function(aU, aT) {
                                                            aa(aS)
                                                        }
                                                    }
                                                });
                                            ac[aN]["dropdowns"] = aQ;
                                            aM = {
                                                reject: aL
                                            }
                                        }
                                    }
                                }
                                aK.push(aM)
                            }
                        }
                    }
                })
        }
        b.form({
            buttons: ac,
            toolbar: aK,
            parseData: o.parseBizData
        });
        D = c("flowHiComments");
        if (D && D.length) {
            var aI = av("div.flow-user-comments");
            if (aI.size() > 0) {
                av.each(D,
                    function(aM, aL) {
                        aI.append('<div class="form-group"><label class="col-xs-2 control-label">' + U(aL, "nodeName") + '</label><div class="col-xs-7"><p class="form-control-static">' + U(aL, "operaterName") + '</p></div><div class="col-xs-1"><p class="form-control-static">' + n(U(aL, "operateType")) + '</p></div><div class="col-xs-2"><p class="form-control-static">' + U(aL, "operateTime") + '</p></div><div class="col-xs-10 col-xs-offset-2"><p class="form-control-static">' + U(aL, "opinion") + "</p></div></div>")
                    })
            }
        }
        Y();
        if (typeof o.ready == "function") {
            o.ready()
        }
    }
    function t(aI) {
        if (!aI.renderTo || av(aI.renderTo).size() == 0) {
            return false
        }
        var aK = Z("flowDefId,instId,proRunId");
        aK.paramMap = {};
        try {
            av.extend(aK.paramMap, ak(true))
        } catch(aJ) {}
        if (aI.params) {
            av.extend(aK.paramMap, aI.params)
        }
        b.ajax({
            url: ap.load_assigners,
            data: {
                formData: b.stringify(aK),
                time: (new Date()).getTime()
            },
            backdrop: false,
            success: function(aS) {
                if (!b.ajaxCheckLogin(aS)) {
                    return false
                }
                if (!aS) {
                    return false
                }
                var aM = aS.nodeAssigners || [];
                var aP = aS.proRunAssigners || {};
                var aU = {};
                av.each(aM,
                    function(aX, aV) {
                        aU[aV.nodeId] = aV;
                        if (aV.nodeVars && c("nodeId") == aV.nodeId) {
                            var aW = aV.nodeVars.split(",");
                            var aY = {};
                            av.each(aW,
                                function(a0, aZ) {
                                    aY[aZ] = true
                                });
                            aE("nodeVars", aY)
                        }
                    });
                aE("assignerExpression", aU);
                var aN = av(aI.renderTo);
                aN.empty();
                var aR = {};
                var aQ = 0;
                var aO = false;
                var aT = av('<div class="form-group"></div>');
                var aL = c("flowNodes") || [];
                av.each(aL,
                    function(aX, aW) {
                        var a5 = aU[aW.id];
                        if (a5 && a5.visible) {
                            if (aQ == 2) {
                                aQ = 0;
                                if (!aO) {
                                    aN.append("<h4>审批人</h4>");
                                    aO = true
                                }
                                aN.append(aT);
                                aT = av('<div class="form-group"></div>')
                            }
                            aQ++;
                            aT.append('<label class="col-xs-2 control-label">' + aW.name + "</label>");
                            var a2 = av('<input id="flowNodeAssignerName_' + aW.id + '" class="form-control" readonly="true">');
                            var a4 = av('<input id="flowNodeAssignerId_' + aW.id + '" type="hidden">');
                            aR[aW.id] = {
                                idField: "#flowNodeAssignerId_" + aW.id,
                                nameField: "#flowNodeAssignerName_" + aW.id
                            };
                            var a0 = av('<div class="col-xs-4"></div>');
                            a0.appendTo(aT);
                            a2.appendTo(a0);
                            a4.appendTo(a0);
                            var aY = 100;
                            aY = a5.defaultShow || 0;
                            if (a5.modifiable && W()) {
                                if (a5.modifyType == "comorg") {
                                    b.form("personSelect", {
                                        renderTo: a2,
                                        singleSelect: !a5.multiple,
                                        rootId: a5.modifyAssignerId,
                                        deptLoad: a5.modifyAssignerId,
                                        defaultMyDept: true,
                                        rootSelect: false,
                                        returns: {},
                                        success: function(a9) {
                                            var a7 = [];
                                            var a6 = [];
                                            for (var a8 = 0; a8 < a9.length; a8++) {
                                                if (!a9[a8].sysUsername) {
                                                    alert("选择的人员中“" + a9[a8].name + "”未开通OA账号，不能参与审批！");
                                                    return false
                                                }
                                                a7.push(a9[a8].sysUsername);
                                                a6.push(a9[a8].name)
                                            }
                                            a4.val(a7.join(","));
                                            a2.val(a6.join(","));
                                            return true
                                        }
                                    })
                                } else {
                                    var aZ = b.getListValue(a5.modifyAssignerPersons, "sysUsername", ",");
                                    var a1 = aZ.indexOf(",") > 0;
                                    if (aZ && (a1 || aY == 0)) {
                                        if (a1) {
                                            aY = 0
                                        }
                                        b.form("personSelect", {
                                            renderTo: a2,
                                            singleSelect: !a5.multiple,
                                            selectRange: {
                                                usernames: aZ
                                            },
                                            returns: {},
                                            success: function(a9) {
                                                var a7 = [];
                                                var a6 = [];
                                                for (var a8 = 0; a8 < a9.length; a8++) {
                                                    if (!a9[a8].sysUsername) {
                                                        alert("选择的人员中“" + a9[a8].name + "”未开通OA账号，不能参与审批！");
                                                        return false
                                                    }
                                                    a7.push(a9[a8].sysUsername);
                                                    a6.push(a9[a8].name)
                                                }
                                                a4.val(a7.join(","));
                                                a2.val(a6.join(","));
                                                return true
                                            }
                                        })
                                    }
                                }
                            }
                            var aZ = "";
                            if (!aI.forceRefresh) {
                                aZ = b.getValue(aP[aW.id], "assignerId", "")
                            }
                            if (aZ) {
                                a2.val(b.getValue(aP[aW.id], "assignerName", ""));
                                a4.val(aZ)
                            } else {
                                if (b.isNotEmpty(a5.nodeAssignerPersons)) {
                                    if (aY > 0) {
                                        var a3 = [];
                                        var aV = [];
                                        for (var aX = 0; aX < aY && aX < a5.nodeAssignerPersons.length; aX++) {
                                            a3.push(a5.nodeAssignerPersons[aX].sysUsername);
                                            aV.push(a5.nodeAssignerPersons[aX].name)
                                        }
                                        a2.val(aV.join(","));
                                        a4.val(a3.join(","))
                                    }
                                }
                            }
                        }
                    });
                if (aQ > 0) {
                    if (!aO) {
                        aN.append("<h4>审批人</h4>")
                    }
                    aN.append(aT)
                }
                o.preAssignerFields = aR;
                if (aI.onLoadSuccess) {
                    aI.onLoadSuccess(aS, aN)
                }
            }
        })
    }
    function Y(aJ) {
        if (o.autoLoadAssigner.enable) {
            var aI = av.extend({},
                o.autoLoadAssigner);
            if (aJ) {
                aI.forceRefresh = true
            }
            t(aI)
        }
    }
    function T(aL) {
        if (b.isEmpty(aL)) {
            return true
        }
        var aJ = c("assignerExpression");
        if (b.isEmpty(aJ)) {
            return true
        }
        for (var aK = 0; aK < aL.length; aK++) {
            var aI = b.getValue(aJ, aL[aK].id, {});
            if (aI.required && aI.visible) {
                if (!b.form("validate", av("#flowNodeAssignerName_" + aL[aK].id), {
                        required: true,
                        label: aL[aK].name
                    })) {
                    return false
                }
            }
        }
        return true
    }
    av.extend(b.Flow, {
        flow: function(aI) {
            X(aI)
        },
        load: function(aI) {
            e(aI)
        },
        command: function(aK, aJ, aI) {
            N(aK, aJ, aI)
        },
        commit: function() {
            u()
        },
        initContext: function() {
            x()
        },
        setContext: function(aJ, aI) {
            al(aJ, aI)
        },
        resetContext: function() {
            ar()
        },
        isNewData: function() {
            return c("isNewData")
        },
        isNewFlow: function() {
            return c("isNewFlow")
        },
        isStartNode: function(aI) {
            return ag(aI)
        },
        isFirstNode: function(aI) {
            return W(aI)
        },
        isLastNode: function(aI) {
            return K(aI)
        },
        isEndNode: function(aI) {
            return aj(aI)
        },
        get: function(aI) {
            return c(aI)
        },
        set: function(aJ, aI) {
            aE(aJ, aI);
            return b.Flow
        },
        getOperateType: function() {
            return af()
        },
        getButtonText: function(aI) {
            return n(aI)
        },
        setProcessVar: function(aJ, aI) {
            E(aJ, aI)
        },
        setSubProcessVar: function(aJ, aI) {
            at(aJ, aI)
        },
        setAssigner: function(aJ, aI) {
            C(aJ, aI)
        },
        getBizData: function() {
            return y()
        },
        getProcessParams: function(aI) {
            return ak(aI)
        },
        hide: function(aI) {
            b.form("hide", aI)
        },
        show: function(aI) {
            b.form("show", aI)
        },
        disable: function(aI) {
            b.form("disable", aI)
        },
        enable: function(aI) {
            b.form("enable", aI)
        },
        isVisible: function(aI) {
            return b.form("isVisible", aI)
        },
        isEnable: function(aI) {
            return b.form("isEnable", aI)
        },
        checkNode: function(aI) {
            return c("nodeVars", aI)
        },
        getAfStatus: function() {
            var aJ = c("nextNodes");
            var aI = aJ && aJ.length ? aJ[0].id: "";
            if (aj(aI)) {
                return 2
            }
            if (W()) {
                if (W(aI)) {
                    return 0
                } else {
                    return 1
                }
            } else {
                if (W(aI)) {
                    return 3
                } else {
                    return 1
                }
            }
        },
        convertAfStatus: function(aI) {
            var aI = arguments.length == 0 ? b.flow("getAfStatus") : aI;
            switch (aI) {
                case 0:
                    return "草稿";
                case 1:
                    return "审批中";
                case 2:
                    return "已完成";
                case 3:
                    return "驳回";
                default:
                    return "审批中"
            }
        },
        reloadAssigner: function() {
            Y(true)
        },
        hasAcl: function(aK) {
            if (b.isString(aK)) {
                aK = aK.split(",")
            }
            var aJ = b.getValue(v, "acl", []);
            if (aJ.length == 0) {
                return false
            }
            for (var aI = 0; aI < aK.length; aI++) {
                if (b.inArray(aJ, aK[aI]) > -1) {
                    return true
                }
            }
            return false
        }
    });
    b.flow = function(aM, aL, aK, aJ, aI, aN) {
        if (b.isString(aM)) {
            if (b.isFunction(b.Flow[aM])) {
                return b.Flow[aM](aL, aK, aJ, aI, aN)
            }
        } else {
            return X(aM)
        }
    }
})(jQuery, _EBP_JS);