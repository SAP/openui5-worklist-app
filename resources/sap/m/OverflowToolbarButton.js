/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/Button","sap/m/ButtonRenderer"],function(e,t){"use strict";var o=e.extend("sap.m.OverflowToolbarButton",{metadata:{interfaces:["sap.f.IShellBar","sap.m.IOverflowToolbarContent"]},renderer:t});o.prototype._getText=function(){if(this._bInOverflow){return e.prototype._getText.call(this)}return""};o.prototype._getTooltip=function(){var t=e.prototype._getTooltip.call(this);if(this._bInOverflow){return this._getText()===t?"":t}return t};o.prototype._onBeforeEnterOverflow=function(){this._bInOverflow=true};o.prototype._onAfterExitOverflow=function(){this._bInOverflow=false};o.prototype.getOverflowToolbarConfig=function(){var e={canOverflow:true,propsUnrelatedToSize:["enabled","type","accesskey"],autoCloseEvents:["press"]};e.onBeforeEnterOverflow=this._onBeforeEnterOverflow.bind(this);e.onAfterExitOverflow=this._onAfterExitOverflow.bind(this);return e};return o});
//# sourceMappingURL=OverflowToolbarButton.js.map