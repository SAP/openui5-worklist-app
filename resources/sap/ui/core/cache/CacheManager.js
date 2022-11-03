/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./LRUPersistentCache","./CacheManagerNOP","sap/ui/Device","sap/base/Log","sap/ui/performance/Measurement","sap/ui/performance/trace/Interaction","sap/ui/core/Configuration"],function(e,n,t,s,r,i,a){"use strict";var o={_instance:null,_getInstance:function(){var e,n=f("_getInstance"),t=this;e=new Promise(function(e,i){var a;s.debug("Cache Manager: Initialization...");if(!o._instance){a=t._findImplementation();r.start(u,"CM",c);a.init().then(h,i);r.end(u,"CM")}else{h(o._instance)}function h(t){o._instance=t;n.endAsync();s.debug("Cache Manager initialized with implementation ["+o._instance.name+"], resolving _getInstance promise");e(t)}});n.endSync();return e},_findImplementation:function(){if(d()&&this._isSupportedEnvironment()){return e}else{s.debug("UI5 Cache Manager is switched off");return n}},set:function(e,n){var t,r=f("set",e);s.debug("Cache Manager: Setting value of type["+typeof n+"] with key ["+e+"]");t=this._callInstanceMethod("set",arguments).then(function e(){this.logResolved("set");r.endAsync()}.bind(this),function(n){s.error("Cache Manager: Setting key ["+e+"] failed. Error:"+n);r.endAsync();throw n});r.endSync();return t},get:function(e){var n,t=i.notifyAsyncStep(),r=f("get",e);s.debug("Cache Manager: Getting key ["+e+"]");n=this._callInstanceMethod("get",arguments).then(function e(n){this.logResolved("get");r.endAsync();return n}.bind(this),function(n){s.debug("Cache Manager: Getting key ["+e+"] failed. Error: "+n);r.endAsync();throw n}).finally(t);r.endSync();return n},has:function(e){var n,t=f("has",e);s.debug("Cache Manager: has key ["+e+"] called");n=this._callInstanceMethod("has",arguments).then(function e(n){this.logResolved("has");t.endAsync();return n}.bind(this));t.endSync();return n},del:function(e){var n,t=f("del",e);s.debug("Cache Manager: del called.");n=this._callInstanceMethod("del",arguments).then(function e(){this.logResolved("del");t.endAsync()}.bind(this),function(e){s.debug("Cache Manager: del failed. Error: "+e);t.endAsync();throw e});t.endSync();return n},delWithFilters:function(e){var n;s.debug("Cache Manager: delWithFilters called.");n=this._callInstanceMethod("delWithFilters",arguments).then(function e(){this.logResolved("delWithFilters")}.bind(this),function(e){s.debug("Cache Manager: delWithFilters failed. Error: "+e);throw e});return n},reset:function(){var e,n=f("reset");s.debug("Cache Manager: Reset called.");e=this._callInstanceMethod("reset",arguments).then(function e(){this.logResolved("reset");n.endAsync()}.bind(this),function(e){s.debug("Cache Manager: Reset failed. Error: "+e);n.endAsync();throw e});n.endSync();return e},_switchOff:function(){var e=this;return Promise.resolve().then(function(){l(e);a.setUI5CacheOn(false)})},_switchOn:function(){var e=this;return Promise.resolve().then(function(){var n=a;if(!n.isUI5CacheOn()){l(e);a.setUI5CacheOn(true)}return Promise.resolve()})},_callInstanceMethod:function(e,n){var t,i="[sync ] _callInstanceMethod";r.start(i,"CM",c);if(this._instance){s.debug("Cache Manager: calling instance...");return this._instance[e].apply(this._instance,n)}s.debug("Cache Manager: getting instance...");t=this._getInstance().then(function t(s){return s[e].apply(s,n)});r.end(i);return t},_isSupportedEnvironment:function(){var e=[];if(this._bSupportedEnvironment==undefined){e.push({system:t.system.SYSTEMTYPE.DESKTOP,browserName:t.browser.BROWSER.CHROME,browserVersion:49});e.push({system:t.system.SYSTEMTYPE.DESKTOP,browserName:t.browser.BROWSER.SAFARI,browserVersion:13});e.push({system:t.system.SYSTEMTYPE.TABLET,browserName:t.browser.BROWSER.SAFARI,browserVersion:13});e.push({system:t.system.SYSTEMTYPE.PHONE,browserName:t.browser.BROWSER.SAFARI,browserVersion:13});e.push({system:t.system.SYSTEMTYPE.TABLET,os:t.os.OS.ANDROID,browserName:t.browser.BROWSER.CHROME,browserVersion:80});e.push({system:t.system.SYSTEMTYPE.PHONE,os:t.os.OS.ANDROID,browserName:t.browser.BROWSER.CHROME,browserVersion:80});this._bSupportedEnvironment=e.some(function(e){var n=t.system[e.system],s=e.os?e.os===t.os.name:true,r=e.browserName===t.browser.name,i=t.browser.version>=e.browserVersion;try{return n&&s&&r&&i&&window.indexedDB}catch(e){return false}})}return this._bSupportedEnvironment},logResolved:function(e){this._instance.logResolved&&this._instance.logResolved(e)}};var c="CacheManager",u="[sync ] _initImplementation",h=0;function d(){return a.isUI5CacheOn()}function l(e){if(e._instance){e._instance._destroy();e._instance=null}}function f(e,n){h++;var t="[async]  "+e+"["+n+"]- #"+h,s="[sync ]  "+e+"["+n+"]- #"+h;r.start(t,"CM",[c,e]);r.start(s,"CM",[c,e]);return{sMeasureAsync:t,sMeasureSync:s,endAsync:function(){r.end(this.sMeasureAsync)},endSync:function(){r.end(this.sMeasureSync)}}}return o});