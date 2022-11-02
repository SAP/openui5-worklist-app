/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device","sap/ui/base/Object","sap/ui/core/Core","sap/ui/core/ValueStateSupport","sap/ui/core/Popup","sap/ui/core/library","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/Aria"],function(t,e,o,n,a,r,s){"use strict";var i=r.ValueState;var u=e.extend("sap.m.delegate.ValueState",{constructor:function(t){e.apply(this,arguments);this._oControl=t;this._oPopup=null}});u.prototype.open=function(){var e=this._oControl,o=this.getPopup(),n=this.createDom(),r=a.Dock,i;if(!e||!e.getDomRef()||!o||!n){return}i=s(e.getDomRefForValueStateMessage());o.setContent(n);o.close(0);if(o.getContent()){o.getContent().style.maxWidth=e.getDomRef().offsetWidth+"px"}else{o.getContent().style.maxWidth=""}o.open(this.getOpenDuration(),r.BeginTop,r.BeginBottom,e.getDomRefForValueStateMessage(),null,null,null,t.system.phone?true:a.CLOSE_ON_SCROLL);var u=s(n);if(i.offset().top<u.offset().top){u.addClass("sapMValueStateMessageBottom")}else{u.addClass("sapMValueStateMessageTop")}};u.prototype.close=function(){if(this._oPopup){this._oPopup.close(0)}};u.prototype.getId=function(){var t=this._oControl;if(!t){return""}return typeof t.getValueStateMessageId==="function"?t.getValueStateMessageId():t.getId()+"-message"};u.prototype.getOpenDuration=function(){var t=this._oControl;if(!t){return 0}return t.iOpenMessagePopupDuration===undefined?0:t.iOpenMessagePopupDuration};u.prototype.createPopup=function(t){t=t||this.getId();if(this._oPopup){return this._oPopup}this._oPopup=new a(document.createElement("span"),false,false,false);this._oPopup.attachClosed(function(){s(document.getElementById(t)).remove()});this._oPopup.attachOpened(function(){var t=this._oPopup.getContent();if(t){t.style.zIndex=this._getCorrectZIndex()}}.bind(this));return this._oPopup};u.prototype.getPopup=function(){if(!this._oControl){return null}return this.createPopup()};u.prototype._getValueStateText=function(t,e){if(e===i.Success||e===i.None){return""}var o=t.getFormattedValueStateText&&t.getFormattedValueStateText();var a=o&&o.getHtmlText();var r=t.getValueStateText()||n.getAdditionalText(t);return a?o:r};u.prototype.createDom=function(){var t=this._oControl;if(!t){return null}var e=this.getId(),n,a=document.createElement("div"),r=t.getValueState(),s=this._getValueStateText(t,r);if(r===i.Success||r===i.None){a.className="sapUiInvisibleText"}else{a.className="sapMValueStateMessage sapMValueStateMessage"+r}if(typeof s==="string"){n=document.createElement("span");n.id=e+"-text";n.appendChild(document.createTextNode(s));a.appendChild(n)}else{o.getRenderManager().render(s,a);a.lastElementChild.setAttribute("id",e+"-text")}a.id=e;a.setAttribute("role","presentation");a.setAttribute("aria-hidden","true");return a};u.prototype.destroy=function(){if(this._oPopup){this._oPopup.destroy();this._oPopup=null}this._oControl=null};u.prototype._getCorrectZIndex=function(){var t=this._oControl.$().parents().filter(function(){var t=s(this).css("z-index");return t&&t!=="auto"&&t!=="0"});if(!t.length){return 1}var e=0;t.each(function(){var t=parseInt(s(this).css("z-index"));if(t>e){e=t}});return e+1};return u});