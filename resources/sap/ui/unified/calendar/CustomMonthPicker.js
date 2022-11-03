/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Renderer","sap/ui/unified/Calendar","sap/ui/unified/CalendarRenderer","sap/ui/unified/calendar/Header","sap/ui/unified/DateRange"],function(e,t,i,r,a){"use strict";var n=e.extend(i);n.apiVersion=2;var s=t.extend("sap.ui.unified.internal.CustomMonthPicker",{metadata:{library:"sap.ui.unified"},renderer:n});s.prototype._initializeHeader=function(){var e=new r(this.getId()+"--Head",{visibleButton1:false});e.attachEvent("pressPrevious",this._handlePrevious,this);e.attachEvent("pressNext",this._handleNext,this);e.attachEvent("pressButton2",this._handleButton2,this);this._afterHeaderRenderAdjustCSS=this._createOnAfterRenderingDelegate(e);e.addDelegate(this._afterHeaderRenderAdjustCSS);this.setAggregation("header",e)};s.prototype.init=function(){t.prototype.init.apply(this,arguments);this.setProperty("_currentPicker","monthPicker");this._bNamesLengthChecked=true};s.prototype.onBeforeRendering=function(){var e=this.getSelectedDates(),i=this._getYearPicker().getDate(),r,a;t.prototype.onBeforeRendering.apply(this,arguments);if(this._iMode===1){if(e.length&&e[0].getStartDate()&&(!i||e[0].getStartDate().getFullYear()===i.getFullYear())){r=this._getMonthPicker();a=e[0].getStartDate();r.setMonth(a.getMonth());r._iYear=a.getFullYear()}}};s.prototype._closePickers=function(){this.setProperty("_currentPicker","monthPicker");this._togglePrevNext(this._getFocusedDate(),true)};s.prototype._selectYear=function(){var e=this._getMonthPicker(),t=this._getYearPicker(),i=this._getFocusedDate();i.setYear(t.getYear());e._setYear(i.getYear());e._setDate(i);this._focusDate(i,true);this._showMonthPicker()};s.prototype._selectMonth=function(){var e=this._getMonthPicker(),t=this.getSelectedDates()[0],i=this._getFocusedDate();if(!t){t=new a}if(!e.getIntervalSelection()){i.setMonth(e.getMonth(),1);t.setStartDate(i.toLocalJSDate());this.addSelectedDate(t)}this.fireSelect()};s.prototype.onsapescape=function(e){this.fireCancel()};s.prototype._hideMonthPicker=function(){this._hideOverlay();this._togglePrevNext(this._getFocusedDate(),true);this._bActionTriggeredFromSecondHeader=false};s.prototype.setShowCurrentDateButton=function(e){return this};return s});