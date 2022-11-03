/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Core","sap/ui/core/Control","sap/ui/core/delegate/ItemNavigation","sap/f/GridContainer","sap/f/GridContainerSettings","sap/f/ProductSwitchItem","sap/f/ProductSwitchRenderer"],function(t,e,i,o,r,n,s){"use strict";var a=e.extend("sap.f.ProductSwitch",{metadata:{library:"sap.f",aggregations:{_gridContainer:{type:"sap.f.GridContainer",visibility:"hidden",multiple:false},items:{type:"sap.f.ProductSwitchItem",multiple:true,singularName:"item",forwarding:{getter:"_getGridContainer",aggregation:"items"}}},associations:{selectedItem:{type:"sap.f.ProductSwitchItem",multiple:false}},events:{change:{parameters:{itemPressed:{type:"sap.f.ProductSwitchItem"}}}}},renderer:s});a.COLUMNS={THREE_COLUMNS:3,FOUR_COLUMNS:4};a.prototype.init=function(){this._oCurrentSelectedItem=null};a.prototype.exit=function(){this._oCurrentSelectedItem=null;this._destroyItemNavigation()};a.prototype._destroyItemNavigation=function(){if(this._oItemNavigation){this.removeEventDelegate(this._oItemNavigation);this._oItemNavigation.destroy();this._oItemNavigation=null}};a.prototype.onAfterRendering=function(){var t,e=[];if(!this._oItemNavigation){this._oItemNavigation=new i(null,null);this._oItemNavigation.setDisabledModifiers({sapnext:["alt","meta"],sapprevious:["alt","meta"]});this.addEventDelegate(this._oItemNavigation)}t=this.getDomRef();this._oItemNavigation.setRootDomRef(t);e=this.getItems().map(function(t){return t.getDomRef()});this._oItemNavigation.setItemDomRefs(e)};a.prototype._gridContainerItemsUpdate=function(){var t=this._getGridContainer().getLayout();t.setColumns(this.getItems().length<=6?a.COLUMNS.THREE_COLUMNS:a.COLUMNS.FOUR_COLUMNS)};a.prototype._changeLayoutHandler=function(t){var e=t.getParameter("layout"),i=e==="layoutS"||e==="layoutXS";this._getGridContainer().toggleStyleClass("sapFProductSwitch-Popover-CTX",!i)};a.prototype._getGridContainer=function(){var t=this.getAggregation("_gridContainer");if(!t){t=new o({layoutChange:this._changeLayoutHandler.bind(this)}).setLayout(new r({columnSize:"11.25rem",rowSize:"7rem",gap:"0.5rem",columns:4})).setLayoutM(new r({columnSize:"11.25rem",rowSize:"7rem",gap:"0.5rem",columns:3})).setLayoutS(new r({columnSize:"100%",rowSize:"5rem",gap:"0",columns:1}));this.setAggregation("_gridContainer",t)}return t};a.prototype._onItemPress=function(t){this.setSelectedItem(t.oSource);this.fireChange({itemPressed:t.oSource})};a.prototype._setSelection=function(t){if(this._oCurrentSelectedItem){this._oCurrentSelectedItem.removeStyleClass("sapFPSItemSelected");this._oCurrentSelectedItem.$().removeAttr("aria-checked")}this._oCurrentSelectedItem=t;if(this._oCurrentSelectedItem){this._oCurrentSelectedItem.addStyleClass("sapFPSItemSelected");this._oCurrentSelectedItem.$().attr("aria-checked","true")}};a.prototype.setSelectedItem=function(e){if(typeof e==="string"){e=t.byId(e)}if(!(e instanceof n)&&e!==null){return this}this._setSelection(e);return this.setAssociation("selectedItem",e,true)};a.prototype.addItem=function(t){this.addAggregation("items",t);if(t){t.attachEvent("_itemPress",this._onItemPress,this)}this._gridContainerItemsUpdate();return this};a.prototype.insertItem=function(t,e){this.insertAggregation("items",t,e);if(t){t.attachEvent("_itemPress",this._onItemPress,this)}this._gridContainerItemsUpdate();return this};a.prototype.removeItem=function(t){var e=this.removeAggregation("items",t).detachEvent("_itemPress",this._onItemPress,this);this._gridContainerItemsUpdate();return e};a.prototype.removeAllItems=function(){var t=this.getItems(),e;t.forEach(function(t){t.detachEvent("_itemPress",this._onItemPress,this)},this);e=this.removeAllAggregation("items");this._gridContainerItemsUpdate();return e};a.prototype.destroyItems=function(){var t=this.getItems(),e;t.forEach(function(t){t.detachEvent("_itemPress",this._onItemPress,this)},this);e=this.destroyAggregation("items");this._gridContainerItemsUpdate();return e};a.prototype._getItemsCount=function(){return this.getItems().length};a.prototype._getItemPosition=function(t){var e=this.getItems(),i;e.forEach(function(e,o){if(e===t){i=o+1}});return i};return a});