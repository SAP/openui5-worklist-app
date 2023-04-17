/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var e={apiVersion:2};e.render=function(e,n){e.openStart("div",n);e.class("sapMTCMenu");e.openEnd();this.renderQuickActions(e,n);this.renderItems(e,n);e.close("div")};e.renderQuickActions=function(e,n){if(n._getAllEffectiveQuickActions().length===0){return}e.openStart("div");if(n._oItemsContainer){if(n._oItemsContainer.getCurrentViewKey()==="$default"){e.class("sapMTCMenuQAList")}else{e.class("sapMTCMenuQAListHidden")}}else{e.class("sapMTCMenuQAList")}e.openEnd();e.renderControl(n._oForm);e.close("div")};e.renderItems=function(e,n){if(n._getAllEffectiveItems().length===0){return}e.openStart("div");e.class("sapMTCMenuContainerWrapper");e.openEnd();e.renderControl(n._oItemsContainer);e.close("div")};return e});
//# sourceMappingURL=MenuRenderer.js.map