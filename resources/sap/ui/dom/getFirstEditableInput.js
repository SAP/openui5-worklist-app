/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/dom/isHidden"],function(t,e){"use strict";function n(e,n){var i="textarea[readonly],input[type=hidden],input[type=button],input[type=submit],input[type=reset],input[type=image],button",u=":enabled:visible:first";if(n){return t(e).find("input, textarea").not(i).filter(u)[0]}else{return t(e).find("input, textarea").not("input[readonly],"+i).filter(u)[0]}}function i(t,i){var u;if(!t||e(t)){return null}if(i){u=i.includeReadOnly}return n(t,u)}return i});