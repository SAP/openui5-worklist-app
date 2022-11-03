/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","./SinglePlanningCalendarView","sap/ui/core/LocaleData","sap/ui/unified/calendar/CalendarDate","sap/ui/unified/calendar/CalendarUtils","sap/ui/core/Configuration"],function(e,t,a,n,i,r){"use strict";var o=t.extend("sap.m.SinglePlanningCalendarWeekView",{metadata:{library:"sap.m"}});o.prototype.getEntityCount=function(){return 7};o.prototype.getScrollEntityCount=function(){return 7};o.prototype.calculateStartDate=function(e){var t=a.getInstance(r.getFormatSettings().getFormatLocale()),o=this.getFirstDayOfWeek(),l=o===-1?t.getFirstDayOfWeek():o;e.setDate(e.getDate()-e.getDay()+l);return i._getFirstDateOfWeek(n.fromLocalJSDate(e),{firstDayOfWeek:o,minimalDaysInFirstWeek:t.getMinimalDaysInFirstWeek()}).toLocalJSDate()};return o});