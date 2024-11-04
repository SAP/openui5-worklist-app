/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/DynamicDateOption"],function(e){"use strict";var t=e.extend("sap.m.CustomDynamicDateOption",{metadata:{library:"sap.m",properties:{getText:{type:"function"},getValueHelpUITypes:{type:"function"},createValueHelpUI:{type:"function"},validateValueHelpUI:{type:"function"},getValueHelpOutput:{type:"function"},getGroup:{type:"function"},getGroupHeader:{type:"function"},format:{type:"function"},parse:{type:"function"},toDates:{type:"function"},enhanceFormattedValue:{type:"function"}}}});function p(e){return e.charAt(0).toUpperCase()+e.slice(1)}["getText","getValueHelpUITypes","createValueHelpUI","getValueHelpOutput","validateValueHelpUI","getGroup","getGroupHeader","format","parse","toDates","enhanceFormattedValue"].forEach(function(a){t.prototype[a]=function(){var t="get"+p(a);var r=this[t]();return r?r.apply(this,arguments):e.prototype[a].apply(this,arguments)}});t.prototype.getGroupHeader=function(){if(this.getGroup()<7&&this.getGroup()>-1||!this.getGetGroupHeader()){return e.prototype.getGroupHeader.apply(this,arguments)}else{return this.getGetGroupHeader().apply(this,arguments)}};return t});
//# sourceMappingURL=CustomDynamicDateOption.js.map