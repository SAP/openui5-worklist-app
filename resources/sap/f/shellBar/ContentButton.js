/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/Button","sap/f/shellBar/ContentButtonRenderer"],function(t,e){"use strict";var a=t.extend("sap.f.shallBar.ContentButton",{metadata:{library:"sap.f",aggregations:{avatar:{type:"sap.f.Avatar",multiple:false}}},renderer:e});a.prototype.setAvatar=function(t){t.setDisplaySize(sap.f.AvatarSize.XS);return this.setAggregation("avatar",t)};a.prototype._getText=function(){if(this._bInOverflow){return t.prototype._getText.call(this)}return""};return a});