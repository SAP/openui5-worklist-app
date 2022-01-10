/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/unified/calendar/Header","sap/ui/unified/calendar/IndexPickerRenderer","sap/ui/core/delegate/ItemNavigation","sap/ui/events/KeyCodes"],function(e,t,i,a,n){"use strict";var s=e.extend("sap.ui.unified.calendar.IndexPicker",{metadata:{library:"sap.ui.unified",properties:{startIndex:{type:"int",group:"Data",defaultValue:0},selectedIndex:{type:"int",group:"Data",defaultValue:0},formatter:{type:"object",group:"Data"},rows:{type:"int",group:"Data",defaultValue:4},columns:{type:"int",group:"Data",defaultValue:3},periodSize:{type:"int",group:"Data",defaultValue:1}},aggregations:{header:{type:"sap.ui.unified.calendar.Header",multiple:false}},events:{select:{},focus:{}}}});s.prototype.init=function(){this._initializeHeader();this.iCurrentIndex=0};s.prototype.onBeforeRendering=function(){this.getHeader().setEnabledPrevious(this.getStartIndex()>0)};s.prototype.onAfterRendering=function(){r.call(this)};s.prototype._initializeHeader=function(){var e=new t(this.getId()+"--Head",{visibleButton1:false,visibleButton2:false});e.attachEvent("pressPrevious",this._handlePrevious,this);e.attachEvent("pressNext",this._handleNext,this);this.setAggregation("header",e)};s.prototype._handlePrevious=function(){this.goToPreviousPage()};s.prototype.goToPreviousPage=function(){var e=this.getStartIndex()-this.getRows()*this.getColumns();e=Math.max(0,e);this.setStartIndex(e)};s.prototype._handleNext=function(){this.goToNextPage()};s.prototype.goToNextPage=function(){var e=this.getStartIndex()+this.getRows()*this.getColumns();this.setStartIndex(e)};s.prototype.onmouseup=function(e){var t=e.target.getAttribute("data-sap-ui-index");if(!t){return}this._selectIndex(parseInt(t))};s.prototype.onkeydown=function(e){if(e.keyCode===n.ENTER){var t=e.target.getAttribute("data-sap-ui-index");if(!t){return}this._selectIndex(parseInt(t))}};s.prototype.onkeyup=function(e){if(e.keyCode===n.SPACE){e.preventDefault();var t=e.target.getAttribute("data-sap-ui-index");if(!t){return}this._selectIndex(parseInt(t))}};s.prototype._selectIndex=function(e){this.setSelectedIndex(e);this.iCurrentIndex=0;this.fireSelect({index:e})};s.prototype._getFormatter=function(){return this.getFormatter()||o};function o(e){return(e+1).toString()}function r(){var e=0,t=false,i=this.getDomRef(),n=i.querySelectorAll(".sapMIPItem"),s=this.getColumns();for(var o=0;o<n.length;o++){if(n[o].getAttribute("data-sap-ui-index")===this.getSelectedIndex()){e=o;t=true;break}}if(!this._oItemNavigation){this._oItemNavigation=new a;this._oItemNavigation.attachEvent(a.Events.AfterFocus,u,this);this._oItemNavigation.attachEvent(a.Events.BorderReached,this._handleBorderReached,this);this.addDelegate(this._oItemNavigation);if(s>1){this._oItemNavigation.setHomeEndColumnMode(true,true)}this._oItemNavigation.setDisabledModifiers({sapnext:["alt"],sapprevious:["alt"],saphome:["alt"],sapend:["alt"]});this._oItemNavigation.setCycling(false);this._oItemNavigation.setColumns(s,true)}this._oItemNavigation.setRootDomRef(i);this._oItemNavigation.setItemDomRefs(n);if(!t){e=this.iCurrentIndex%n.length}this._oItemNavigation.setFocusedIndex(e);this._oItemNavigation.focusItem(e);this._oItemNavigation.setPageSize(n.length)}function u(e){var t=e.getParameter("index");var i=e.getParameter("event");if(!i){return}var a=e.getParameter("index");var n=this._oItemNavigation.getItemDomRefs();var s=jQuery(n[t]);this.iCurrentIndex=a;a=s.attr("data-sap-ui-index");this.fireFocus({index:a})}s.prototype._handleBorderReached=function(e){var t=e.getParameter("event");var i=parseInt(t.target.getAttribute("data-sap-ui-index"));var a=e.getParameter("index");if(t.type){switch(t.type){case"sapnext":case"sapnextmodifiers":if(t.keyCode===n.ARROW_DOWN){i+=this.getColumns();a+=this.getColumns()}else{i+=1;a+=1}this.goToNextPage();break;case"sapprevious":case"sappreviousmodifiers":if(t.keyCode===n.ARROW_UP){i-=this.getColumns();a-=this.getColumns()}else{i-=1;a-=1}this.goToPreviousPage();break;default:break}var s=this._oItemNavigation.getItemDomRefs();a=Math.abs(s.length-Math.abs(a));this.iCurrentIndex=a;this._oItemNavigation.focusItem(s[a]);this.fireFocus({index:i})}};return s});