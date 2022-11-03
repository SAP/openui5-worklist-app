/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Element","sap/ui/thirdparty/jquery","sap/ui/core/Configuration"],function(e,t,r){"use strict";var n={nodeHasUI5ParentControl:function(t,r){var n=["sap.ui.core.HTML"],u=e.closestTo(t);if(!u){return false}var a=u.getMetadata().getName(),f=n.indexOf(a)===-1,i=r.getElements().indexOf(u)>-1;return f&&i},getExternalStyleSheets:function(){return Array.from(document.styleSheets).filter(function(e){var t=r.getTheme(),n="/themes/"+t+"/library.css",u=!e.href||!(e.href.indexOf(n)!==-1),a=!!e.rules;return u&&a})},getStyleSheetName:function(e){return e.href||"Inline"},getStyleSource:function(e){var t;if(e.href){t=e.href.substr(e.href.lastIndexOf("/"),e.href.length-1)}else{t=" <style> tag "}return t}};return n},true);