/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/test/actions/Action","sap/ui/thirdparty/jquery"],function(t,e){"use strict";var r=t.extend("sap.ui.test.actions.Press",{metadata:{properties:{altKey:{type:"boolean"},shiftKey:{type:"boolean"},ctrlKey:{type:"boolean"},xPercentage:{type:"float"},yPercentage:{type:"float"}},publicMethods:["executeOn"]},init:function(){t.prototype.init.apply(this,arguments);this.controlAdapters=e.extend(this.controlAdapters,r.controlAdapters)},executeOn:function(t){var e=this.$(t),r=e[0];var a,n;var s=this.getAltKey();var i=this.getCtrlKey();var o=this.getShiftKey();var l=this.getXPercentage();var c=this.getYPercentage();if(l<0||l>100){this.oLogger.error("Please provide a valid X percentage in the range: 0 - 100");return}if(c<0||c>100){this.oLogger.error("Please provide a valid Y percentage in the range: 0 - 100");return}var p=r.getBoundingClientRect();var u=p.width;var g=p.height;var d=p.left+window.scrollX;var h=p.top+window.scrollY;if(l||l===0){a=l/100*u+d}if(c||c===0){n=c/100*g+h}if(e.length){this.oLogger.timestamp("opa.actions.press");this.oLogger.debug("Pressed the control "+t);this._tryOrSimulateFocusin(e,t);this._createAndDispatchMouseEvent("mousedown",r,null,null,null,a,n);this.getUtils().triggerEvent("selectstart",r);this._createAndDispatchMouseEvent("mouseup",r,null,null,null,a,n);this._createAndDispatchMouseEvent("click",r,o,s,i)}}});r.controlAdapters={};r.controlAdapters["sap.m.Input"]="vhi";r.controlAdapters["sap.m.SearchField"]="search";r.controlAdapters["sap.m.ListBase"]="trigger";r.controlAdapters["sap.m.Page"]="navButton";r.controlAdapters["sap.m.semantic.FullscreenPage"]="navButton";r.controlAdapters["sap.m.semantic.DetailPage"]="navButton";r.controlAdapters["sap.m.ComboBox"]="arrow";r.controlAdapters["sap.ui.comp.smartfilterbar.SmartFilterBar"]="btnGo";r.controlAdapters["sap.m.ObjectAttribute"]="text";r.controlAdapters["sap.m.ObjectStatus"]=function(t){if(t.getActive()){return"link"}else{return null}};r.controlAdapters["sap.m.ObjectIdentifier"]=function(t){if(t.getTitleActive()){return"link"}else if(t.getTitle()){return"title"}else if(t.getText()){return"text"}else{return null}};return r});