/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Core","sap/ui/core/Element","sap/m/CustomListItem","sap/ui/unified/DateTypeRange","sap/ui/unified/library"],function(e,t,a,n,p){"use strict";var r=t.extend("sap.m.PlanningCalendarRow",{metadata:{library:"sap.m",properties:{title:{type:"string",group:"Data"},text:{type:"string",group:"Data"},icon:{type:"sap.ui.core.URI",group:"Data",defaultValue:null},nonWorkingDays:{type:"int[]",group:"Misc",defaultValue:null},nonWorkingHours:{type:"int[]",group:"Misc",defaultValue:null},selected:{type:"boolean",group:"Data",defaultValue:false},key:{type:"string",group:"Data",defaultValue:null},enableAppointmentsDragAndDrop:{type:"boolean",group:"Misc",defaultValue:false},enableAppointmentsResize:{type:"boolean",group:"Misc",defaultValue:false},enableAppointmentsCreate:{type:"boolean",group:"Misc",defaultValue:false},noAppointmentsText:{type:"string",group:"Misc",defaultValue:null}},aggregations:{appointments:{type:"sap.ui.unified.CalendarAppointment",multiple:true,singularName:"appointment",dnd:{draggable:true}},intervalHeaders:{type:"sap.ui.unified.CalendarAppointment",multiple:true,singularName:"intervalHeader"},specialDates:{type:"sap.ui.unified.DateTypeRange",multiple:true,singularName:"specialDate"},headerContent:{type:"sap.ui.core.Control",multiple:true,singularName:"headerContent",forwarding:{getter:"_getPlanningCalendarCustomRowHeader",aggregation:"content"},forwardBinding:true}},events:{appointmentDrop:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},startDate:{type:"object"},endDate:{type:"object"},calendarRow:{type:"sap.m.PlanningCalendarRow"},copy:{type:"boolean"}}},appointmentDragEnter:{allowPreventDefault:true,parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},startDate:{type:"object"},endDate:{type:"object"},calendarRow:{type:"sap.m.PlanningCalendarRow"}}},appointmentResize:{parameters:{appointment:{type:"sap.ui.unified.CalendarAppointment"},startDate:{type:"object"},endDate:{type:"object"}}},appointmentCreate:{parameters:{startDate:{type:"object"},endDate:{type:"object"},calendarRow:{type:"sap.m.PlanningCalendarRow"}}}}}});r.prototype.exit=function(){if(this.oRowHeader){this.oRowHeader.destroy()}};r.prototype._getPlanningCalendarCustomRowHeader=function(){if(!this.oRowHeader){this.oRowHeader=new a(this.getId()+"-CustomHead",{accDescription:e.getLibraryResourceBundle("sap.m").getText("PC_CUSTOM_ROW_HEADER_CONTENT_DESC")})}return this.oRowHeader};r.prototype._getSpecialDates=function(){var e=this.getSpecialDates();for(var t=0;t<e.length;t++){var a=e[t].getSecondaryType()===p.CalendarDayType.NonWorking&&e[t].getType()!==p.CalendarDayType.NonWorking;if(a){var r=new n;r.setType(p.CalendarDayType.NonWorking);r.setStartDate(e[t].getStartDate());if(e[t].getEndDate()){r.setEndDate(e[t].getEndDate())}e.push(r)}}return e};return r});
//# sourceMappingURL=PlanningCalendarRow.js.map