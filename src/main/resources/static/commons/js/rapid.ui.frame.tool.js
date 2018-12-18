/*
 * 创建人：杨威 
 * 创建时间：2016-12-27
 * 描述:定义框架加载的基础函数
 * 使用说明：
 * 			toolFn.each   		遍历
 * 			toolFn.isArraylike  判断要被遍历的对象是否可是类似数组的  返回 true/false
 *			toolFn.ajax			
 *
 *
 *
 *
 **/


var toolFn = {
	/* 名  称：    each
	 * 功  能：    遍历
	 * 参  数：    obj		被操作的对象
	 *			args	参数
	 *			callback      回调函数
	 */
	each: function(obj, callback, args) {
		var value,
			i = 0,
			length = obj.length,
			isArray = toolFn.isArraylike(obj);
		if (args) {
			if (isArray) {
				for (; i < length; i++) {
					value = callback.apply(obj[i], args);
					if (value === false) {
						break;
					}
				}
			} else {
				for (i in obj) {
					value = callback.apply(obj[i], args);
					if (value === false) {
						break;
					}
				}
			}
		} else {
			if (isArray) {
				for (; i < length; i++) {
					value = callback.call(obj[i], i, obj[i]);
					if (value === false) {
						break;
					}
				}
			} else {
				for (i in obj) {
					value = callback.call(obj[i], i, obj[i]);
					if (value === false) {
						break;
					}
				}
			}
		}

		return obj;
	},
	/**
     * [cutStr 字符串截取]
     * @param  {[type]} str [原始字符串]
     * @param  {[type]} num [截取字长]
     * @return {[type]}     [截取后的字符串]
     */
	cutStr:function (str, num) {
        var oldStr = str ? str : "", newStr = '';
        if (oldStr.length > num) {
            newStr = oldStr.substring(0, num) + '...';
        } else {
            if (oldStr == "") {
                newStr = "&nbsp;"
            } else {
                newStr = oldStr;
            }
        }
        return newStr;
    },
	/****************************************************************
	 * 名  称：	isEmpty
	 * 功  能：	判断是否为空
	 * 入口参数：	fData：要检查的数据
	 * 出口参数：	True：空                              
	 * 			False：非空
	 * DEMO ：	$.RapidUI.isEmpty(undefined);//true
				$.RapidUI.isEmpty("    ");//space=true
				$.RapidUI.isEmpty("");//true
				$.RapidUI.isEmpty(null);//true
				$.RapidUI.isEmpty("	");//tab=true
				$.RapidUI.isEmpty("1	");//false
	 ****************************************************************/
	isEmpty:function(fData){
		return ((fData==null) || (/^\s*$/.test(fData)));
	},
	isArraylike: function(obj) {
		if (typeof obj === 'string') { //增加字符判断，string类型直接返回false
			return false;
		}
		var length = "length" in obj && obj.length,
			type = ((typeof obj === "object") ||( typeof obj === "function" ?(  "object" ): typeof obj));
		var isWindow = (obj != null && obj == obj.window);
		if (type === "function" || isWindow) {
			return false;
		}

		if (obj.nodeType === 1 && length) {
			return true;
		}

		return type === "array" || length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj;
	},
	baseCreateAjax: function() {
		var xhr = null;
		try {
			//IE系列浏览器
			xhr = new ActiveXObject("microsoft.xmlhttp");
		} catch (e1) {
			try {
				//非IE浏览器
				xhr = new XMLHttpRequest();
			} catch (e2) {
				window.alert("您的浏览器不支持ajax，请更换！");
			}
		}
		return xhr;
	},
	/*
	 *  名  称：    ajax
	 * 功  能：    ajax
	 * 参  数：    conf   ajax参数
	 */
	ajax: function(conf) {
		var This = this;
		// 初始化
		//type参数,可选
		var type = conf.type;
		//url参数，必填 
		var url = conf.url;
		//data参数可选，只有在post请求时需要
		var data = conf.data;
		//datatype参数可选    
		var dataType = conf.dataType;
		//回调函数可选
		var success = conf.success;
		//回调error
		var error = conf.error;

		
		if (type == null) {
			//type参数可选，默认为get
			type = "get";
		}
		if (dataType == null) {
			//dataType参数可选，默认为text
			dataType = "text";
		}
		// 创建ajax引擎对象
		var xhr = This.baseCreateAjax();
		// 打开
		xhr.open(type, url, true);
		// 发送
		if (type == "GET" || type == "get") {
			xhr.send(null);
		} else if (type == "POST" || type == "post") {
			xhr.setRequestHeader("content-type",
				"application/x-www-form-urlencoded; charset=UTF-8");
			xhr.send(data);
		}
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				if (dataType == "text" || dataType == "TEXT" || dataType == "html" || dataType == "HTML") {
					if (success != null) {
						//普通文本
						success(xhr.responseText);
					}
				} else if (dataType == "xml" || dataType == "XML") {
					if (success != null) {
						//接收xml文档    
						success(xhr.responseXML);
					}
				} else if (dataType == "json" || dataType == "JSON") {
					if (success != null) {
						//将json字符串转换为js对象  
						success(eval("(" + xhr.responseText + ")"));
					}
				}
			}else if(xhr.status != 200){
				if (error != null) {
					//普通文本
					error(xhr);
				}
			}
		};
	},
	
	/* 名称：getQueryString
	 * 功能：获取网址参数
	 * 参数：name 	参数的KEY值
	 * 返回：对应的value
	 */
	getQueryString: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	},
	/*
	 * 名  称：    setObjCookies
	 * 功  能：    设置Cookies
	 * 参  数：    key		缓存里对应的名称
	 *			obj	对应的obj
	 */
	setObjCookies: function(key, obj) {
		var jsonStr = JSON.stringify(obj);
		LS.set(key, jsonStr);
	},
	/*
	 * 名  称：    removeObjCookies
	 * 功  能：    删除Cookies
	 * 参  数：    key		缓存里对应的名称
	 */
	removeObjCookies: function(key) {
		LS.remove(key)
	},
	/*
	 * 名  称：    getObjCookies
	 * 功  能：    读取Cookies
	 * 参  数：    key		缓存里对应名称
	 */
	getObjCookies: function(key) {
		var getCookies=LS.get(key);
		if(toolFn.isEmpty(getCookies)){
			getCookies=null;
		}else{
			getCookies=JSON.parse(getCookies);
		}
		return getCookies;
	},
	/*
	 * 名  称：    showDT
	 * 功  能：    显示当前计算机的时间
	 * 参  数：    idStr		要显示时间的标签的ID
	 */
	showDT:function (idStr) {
		var currentDT = new Date();
		var y, m, date, day, hs, ms, ss, theDateStr;
		y = currentDT.getFullYear(); //四位整数表示的年份
		m = currentDT.getMonth() + 1; //月
		date = currentDT.getDate(); //日
		day = currentDT.getDay(); //星期
		hs = currentDT.getHours(); //时
		ms = currentDT.getMinutes(); //分
		ss = currentDT.getSeconds(); //秒
		if (ss < 10) {
			ss = '0' + ss;
		}
		if (ms < 10) {
			ms = '0' + ms;
		}
		if (hs < 10) {
			hs = '0' + hs;
		}
		if (date < 10) {
			date = '0' + date;
		}
		if (m < 10) {
			m = '0' + m;
		}
		if (day === 1) {
			day = "一"
		}
		if (day === 2) {
			day = "二"
		}
		if (day === 3) {
			day = "三"
		}
		if (day === 4) {
			day = "四"
		}
		if (day === 5) {
			day = "五"
		}
		if (day === 6) {
			day = "六"
		}
		if (day === 0) {
			day = "日"
		}
		theDateStr = y + "-" + m + "-" + date + "  " + hs + ":" + ms + ":" + ss + " 星期" + day;
		document.getElementById(idStr).innerHTML = theDateStr;
		// setTimeout 在执行时,是在载入后延迟指定时间后,去执行一次表达式,仅执行一次
		window.setTimeout(function(){toolFn.showDT(idStr)}, 1000);
	},
	/*
	 * 名  称：    JsonTool
	 * 功  能：    处理json的函数
	 * 函  数：	toTree    将Json转化为树状Json
	 * 			prseTree  解析树结构
	 */
	JsonTool: {
		/* 名称：toTree
		 * 功能：将Json转化为树状Json
		 * 参数：as > 传入的Json
		 * 		 idStr > json对象的唯一标记key
		 * 		 pidStr > json对象中存储的父级标记key
		 * 		 chindrenStr > 子节点保存的key名
		 * 返回：是树状json
		 */
		toTree: function(as, idStr, pidStr, chindrenStr) {
			//格式化数据
			var r = [],
				hash = {},
				id = idStr,
				pid = pidStr,
				children = chindrenStr,
				i = 0,
				j = 0,
				a = JSON.parse(JSON.stringify(as));
			len = a.length;
			for (; i < len; i++) {
				hash[a[i][id]] = a[i];
			}
			for (; j < len; j++) {
				var aVal = a[j],
					hashVP = hash[aVal[pid]];
				if (hashVP) {
					!hashVP[children] && (hashVP[children] = []);
					hashVP[children].push(aVal);
				} else {
					r.push(aVal);
				}
			}
			return r;
		},
		/* 名称：prseTree
		 * 功能：解析树结构
		 * 参数：argument > 传入的Json
		 * 		 chindrenStr >  子节点的key
		 * 返回：同级的json
		 */
		prseTree: function(argument, chindrenStr) {
			var key = chindrenStr;
			var sp = [];
			for (var a = 0; a < argument.length; a++) {

				if (argument[a][key].length > 0) {
					var sc = toolFn.JsonTool.prseTree(argument[a][key], key);
					for (var i = 0; i < sc.length; i++) {
						sp.push(sc[i]);
					}
				}
				argument[a][key] = '';
				sp.push(argument[a]);

			};
			return sp;
		}
	}
};


/*	localStorage操作函数，兼容没有localStorage函数的浏览器
 * 名  称：    LS  			
 * 功  能：    存储、读取、删除localStorage
 * 例：
 * 		存储：LS.set('userName',"name");
 * 		读取：LS.get('userName');
 * 		删除：LS.remove('userName');
 *  
 */
(function(window) {
	var LS;
	(function() {

		var o = document.getElementsByTagName("head")[0],
			n = window.location.hostname || "localStorage",
			d = new Date(),
			doc, agent;
		//typeof o.addBehavior 在IE6下是object，在IE10下是function，因此这里直接用!判断
		if (!o.addBehavior) return; //防止有些浏览器默认禁用localStorage，这里优先考虑userData本地存储
		try { //尝试创建iframe代理
			agent = new ActiveXObject('htmlfile');
			agent.open();
			agent.write('<s' + 'cript>document.w=window;</s' + 'cript><iframe src="resources/commons/images/favicon.ico"></frame>');
			agent.close();
			doc = agent.w.frames[0].document;
		} catch (e) {
			doc = document;
		}
		o = doc.createElement('head'); //这里通过代理document创建head，可以使存储数据垮目录访问
		doc.appendChild(o);
		d.setDate(d.getDate() + 36500);
		o.addBehavior("#default#userData");
		o.expires = d.toUTCString();
		o.load(n);

		var root = o.XMLDocument.documentElement,
			attrs = root.attributes,
			prefix = "prefix_____hack__",
			reg1 = /^[-\d]/,
			reg2 = new RegExp("^" + prefix),
			encode = function(key) {
				return reg1.test(key) ? prefix + key : key;
			},
			decode = function(key) {
				return key.replace(reg2, "");
			};

		LS = {
			length: attrs.length,
			notNativeCode: true,
			getItem: function(key) {
				return (attrs.getNamedItem(encode(key)) || {
					nodeValue: null
				}).nodeValue || root.getAttribute(encode(key)); //IE9中 通过o.getAttribute(name);取不到值，所以才用了下面比较复杂的方法。（也许你会诧异IE9不是有原生的localStorage吗，是的，但是用户可以关闭DOM存储，所以为了保险一些还是考虑IE9可能会使用到#userData吧。）
			},
			setItem: function(key, value) {
				root.setAttribute(encode(key), value); //IE9中无法通过 o.setAttribute(name, value); 设置#userData值，而用下面的方法却可以。
				o.save(n);
				this.length = attrs.length;
			},
			removeItem: function(key) {
				root.removeAttribute(encode(key)); //IE9中无法通过 o.removeAttribute(name); 删除#userData值，而用下面的方法却可以。
				o.save(n);
				this.length = attrs.length;
			},
			clear: function() {
				while (attrs.length) {
					this.removeItem(attrs[0].nodeName);
				}
				this.length = 0;
			},
			key: function(i) {
				return attrs[i] ? decode(attrs[i].nodeName) : undefined;
			}
		};
	})();

	(function(w, localStorage) { //封装LS，对外提供接口
		var f = function() {
			return null;
		};
		w.LS = localStorage ? {
			set: function(key, value) {
				//fixed iPhone/iPad 'QUOTA_EXCEEDED_ERR' bug
				if (this.get(key) !== undefined)
					this.remove(key);
				localStorage.setItem(key, value);
			},
			//查询不存在的key时，有的浏览器返回null，这里统一返回undefined
			get: function(key) {
				var v = localStorage.getItem(key);
				return v === null ? undefined : v;
			},
			remove: function(key) {
				localStorage.removeItem(key);
			},
			clear: function() {
				localStorage.clear();
			},
			each: function(callback) {
				var list = this.obj(),
					fn = callback || function() {},
					key;
				for (key in list)
					if (fn.call(this, key, this.get(key)) === false)
						break;
			},
			obj: function() {
				var list = {},
					i = 0,
					n, key;
				if (localStorage.isVirtualObject) {
					list = localStorage.key(-1);
				} else {
					n = localStorage.length;
					for (; i < n; i++) {
						key = localStorage.key(i);
						list[key] = this.get(key);
					}
				}
				return list;
			}
		} : {
			set: f,
			get: f,
			remove: f,
			clear: f,
			each: f,
			obj: f
		}; //如果都不支持则所有方法返回null
	})(window, LS || window.localStorage); //这里优先使用自定义的LS
})(window);


/*JSON工具，兼容IE*/


if(typeof JSON!=="object"){JSON={};}(function(){"use strict";var rx_one=/^[\],:{}\s]*$/;var rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;var rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;var rx_four=/(?:^|:|,)(?:\s*\[)+/g;var rx_escapable=/[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;var rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;function f(n){return n<10?"0"+n:n;}function this_value(){return this.valueOf();}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null;};Boolean.prototype.toJSON=this_value;Number.prototype.toJSON=this_value;String.prototype.toJSON=this_value;}var gap;var indent;var meta;var rep;function quote(string){rx_escapable.lastIndex=0;return rx_escapable.test(string)?"\""+string.replace(rx_escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);})+"\"":"\""+string+"\"";}function str(key,holder){var i;var k;var v;var length;var mind=gap;var partial;var value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key);}if(typeof rep==="function"){value=rep.call(holder,key,value);}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null";}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null";}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v;}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==="string"){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v);}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v);}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v;}}if(typeof JSON.stringify!=="function"){meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"};JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" ";}}else if(typeof space==="string"){indent=space;}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify");}return str("",{"":value});};}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k;var v;var value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}return reviver.call(holder,key,value);}text=String(text);rx_dangerous.lastIndex=0;if(rx_dangerous.test(text)){text=text.replace(rx_dangerous,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);});}if(rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,""))){j=eval("("+text+")");return(typeof reviver==="function")?walk({"":j},""):j;}throw new SyntaxError("JSON.parse");};}}());