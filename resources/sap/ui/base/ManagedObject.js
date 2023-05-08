/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./DataType","./EventProvider","./ManagedObjectMetadata","./Object","./BindingInfo","sap/ui/util/ActivityDetection","sap/base/util/ObjectPath","sap/base/Log","sap/base/assert","sap/base/util/deepClone","sap/base/util/deepEqual","sap/base/util/uid","sap/base/util/extend","sap/base/util/isEmptyObject"],function(t,e,i,n,r,s,o,a,g,p,f,d,h,l){"use strict";var u;var c=e.extend("sap.ui.base.ManagedObject",{metadata:{abstract:true,publicMethods:["getId","getMetadata","getModel","setModel","hasModel","bindProperty","unbindProperty","bindAggregation","unbindAggregation","bindObject","unbindObject","getObjectBinding"],library:"sap.ui.core",properties:{},aggregations:{},associations:{},events:{validationSuccess:{enableEventBubbling:true,parameters:{element:{type:"sap.ui.base.ManagedObject"},property:{type:"string"},type:{type:"sap.ui.model.Type"},newValue:{type:"any"},oldValue:{type:"any"}}},validationError:{enableEventBubbling:true,parameters:{element:{type:"sap.ui.base.ManagedObject"},property:{type:"string"},type:{type:"sap.ui.model.Type"},newValue:{type:"any"},oldValue:{type:"any"},message:{type:"string"}}},parseError:{enableEventBubbling:true,parameters:{element:{type:"sap.ui.base.ManagedObject"},property:{type:"string"},type:{type:"sap.ui.model.Type"},newValue:{type:"any"},oldValue:{type:"any"},message:{type:"string"}}},formatError:{enableEventBubbling:true,parameters:{element:{type:"sap.ui.base.ManagedObject"},property:{type:"string"},type:{type:"sap.ui.model.Type"},newValue:{type:"any"},oldValue:{type:"any"}}},modelContextChange:{}},specialSettings:{id:"sap.ui.core.ID",models:"object",bindingContexts:"object",objectBindings:"object",metadataContexts:"object",Type:{type:"string",visibility:"hidden"}}},constructor:function(i,n,r){var s=this;e.call(this);if(typeof i!=="string"&&i!==undefined){r=n;n=i;i=n&&n.id}if(!i){i=this.getMetadata().uid()}else{var o=c._fnIdPreprocessor;i=o?o.call(this,i):i;var a=u||(u=t.getType("sap.ui.core.ID"));if(!a.isValid(i)){throw new Error('"'+i+'" is not a valid ID.')}}this.sId=i;this.mProperties=this.getMetadata().createPropertyBag();this.mAggregations={};this.mAssociations={};this.oParent=null;this.aDelegates=[];this.aBeforeDelegates=[];this.iSuppressInvalidate=0;this.oPropagatedProperties=c._oEmptyPropagatedProperties;this.mSkipPropagation={};this._bIsOwnerActive=true;this.oModels={};this.aPropagationListeners=[];this.oBindingContexts={};this.mElementBindingContexts={};this.mBindingInfos={};this.mObjectBindingInfos={};this._oContextualSettings=c._defaultContextualSettings;this._sOwnerId=c._sOwnerId;(function(){var t=false;if(s.register){s.register()}try{if(s._initCompositeSupport){s._initCompositeSupport(n)}if(s.init){s.init()}s.applySettings(n,r);t=true}finally{if(!t&&s.deregister){s.deregister()}}})()}},i);Object.defineProperty(c,"bindingParser",{set:function(t){r.parse=t},get:function(){return r.parse}});function y(t){g(t===undefined||typeof t==="string"&&!/^(undefined|null)?$/.test(t),"sModelName must be a string or omitted")}var b=false;function m(t){if(!b){var e=Object.values(t)[0];if(e&&e.mixinBindingSupport){e.mixinBindingSupport(c.prototype);b=true}}}c.create=function(t,e,i){if(!t||t instanceof c||typeof t!=="object"||t instanceof String){return t}function n(t){if(typeof t==="function"){return t}if(typeof t==="string"){return o.get(t)}}var r=n(t.Type)||n(e&&e.type);if(typeof r==="function"){return new r(t,i)}var s="Don't know how to create a ManagedObject from "+t+" ("+typeof t+")";a.fatal(s);throw new Error(s)};c._fnIdPreprocessor=null;c._fnSettingsPreprocessor=null;c.runWithPreprocessors=function(t,e,i){g(typeof t==="function","fn must be a function");g(!e||typeof e==="object","oPreprocessors must be an object");var n={id:this._fnIdPreprocessor,settings:this._fnSettingsPreprocessor};e=e||{};this._fnIdPreprocessor=e.id;this._fnSettingsPreprocessor=e.settings;try{return t.call(i)}finally{this._fnIdPreprocessor=n.id;this._fnSettingsPreprocessor=n.settings}};c.prototype.applySettings=function(e,i){if(!e||l(e)){return this}var r=this,s=this.getMetadata(),o=s.getJSONKeys(),p=c.create,f=c._fnSettingsPreprocessor,d,h,u;function y(t){for(var e=0,n=t.length;e<n;e++){var s=t[e];if(Array.isArray(s)){y(s)}else{r[u._sMutator](p(s,u,i))}}}function b(t){r[u._sMutator](t[0],t[1],t[2])}function m(e){var i=t.getType(e),n=i&&i.getPrimitiveType().getName();return n==="object"||n==="any"}f&&f.call(this,e);if(e.metadataContexts&&this._processMetadataContexts){this._processMetadataContexts(e.metadataContexts,e)}if(e.models){if(typeof e.models!=="object"){throw new Error("models must be a simple object")}if(n.isA(e.models,"sap.ui.model.Model")){this.setModel(e.models)}else{for(d in e.models){this.setModel(e.models[d],d==="undefined"?undefined:d)}}}if(e.bindingContexts){if(typeof e.bindingContexts!=="object"){throw new Error("bindingContexts must be a simple object")}var v=e.bindingContexts;if(n.isA(v,"sap.ui.model.Context")){this.setBindingContext(e.bindingContexts)}else{for(d in e.bindingContexts){this.setBindingContext(e.bindingContexts[d],d==="undefined"?undefined:d)}}}if(e.objectBindings){if(typeof e.objectBindings!=="string"&&typeof e.objectBindings!=="object"){throw new Error("binding must be a string or simple object")}if(typeof e.objectBindings==="string"||e.objectBindings.path){this.bindObject(e.objectBindings)}else{for(d in e.objectBindings){e.objectBindings[d].model=d==="undefined"?undefined:d;this.bindObject(e.objectBindings[d])}}}for(d in e){h=e[d];if((u=o[d])!==undefined){var P;switch(u._iKind){case 0:P=this.extractBindingInfo(h,i,!m(u.type));if(P&&typeof P==="object"){this.bindProperty(d,P)}else{this[u._sMutator](typeof P==="string"?P:h)}break;case 1:P=u.altTypes&&this.extractBindingInfo(h,i,!u.altTypes.some(m));if(P&&typeof P==="object"){this.bindProperty(d,P)}else{if(Array.isArray(h)){if(h.length>1){a.error("Tried to add an array of controls to a single aggregation")}h=h[0]}this[u._sMutator](p(typeof P==="string"?P:h,u,i))}break;case 2:P=this.extractBindingInfo(h,i);if(P&&typeof P==="object"){this.bindAggregation(d,P)}else{h=typeof P==="string"?P:h;if(h){if(Array.isArray(h)){y(h)}else{r[u._sMutator](p(h,u,i))}}}break;case 3:this[u._sMutator](h);break;case 4:if(h){if(Array.isArray(h)){for(var A=0,_=h.length;A<_;A++){this[u._sMutator](h[A])}}else{this[u._sMutator](h)}}break;case 5:if(typeof h=="function"){this[u._sMutator](h)}else if(Array.isArray(h[0])&&(h.length<=1||Array.isArray(h[1]))){h.forEach(b)}else{b(h)}break;case-1:break;default:break}}else{g(false,"ManagedObject.apply: encountered unknown setting '"+d+"' for class '"+s.getName()+"' (value:'"+h+"')")}}return this};c.escapeSettingsValue=function(t){return typeof t==="string"?r.escape(t):t};c.prototype.toString=function(){return"ManagedObject "+this.getMetadata().getName()+"#"+this.getId()};c.prototype.getId=function(){return this.sId};c.prototype.setProperty=function(t,i,n){var r=this.mProperties[t];i=this.validateProperty(t,i);if(f(r,i)){this.mProperties[t]=i;return this}if(n){s.refresh()}this.mProperties[t]=i;if(!n&&!this.isInvalidateSuppressed()){this.invalidate()}this.updateModelProperty(t,i,r);i=this.mProperties[t];if(this.mEventRegistry["_change"]){e.prototype.fireEvent.call(this,"_change",{id:this.getId(),name:t,oldValue:r,newValue:i})}if(this._observer){this._observer.propertyChange(this,t,r,i)}return this};c.prototype.getProperty=function(e){var i=this.mProperties[e],n=this.getMetadata().getManagedProperty(e),r;if(!n){throw new Error('Property "'+e+'" does not exist in '+this)}r=t.getType(n.type);if(r instanceof t&&r.isArrayType()&&Array.isArray(i)){i=i.slice(0)}if(i instanceof String){i=i.valueOf()}if(n.byValue){i=p(i)}return i};c.prototype.validateProperty=function(e,i){var n=this.getMetadata().getManagedProperty(e),r;if(!n){throw new Error('Property "'+e+'" does not exist in '+this)}r=t.getType(n.type);if(r instanceof t&&r.isArrayType()&&Array.isArray(i)){i=i.slice(0)}if(i==null){i=n.getDefaultValue()}else if(r instanceof t){if(r.getName()=="string"){if(!(typeof i=="string"||i instanceof String)){i=""+i}}else if(r.getName()=="string[]"){if(typeof i=="string"){i=[i]}if(!Array.isArray(i)){throw new Error('"'+i+'" is of type '+typeof i+", expected string[]"+' for property "'+e+'" of '+this)}for(var s=0;s<i.length;s++){if(typeof i[s]!=="string"){i[s]=""+i[s]}}}else if(!r.isValid(i)){throw new Error('"'+i+'" is of type '+typeof i+", expected "+r.getName()+' for property "'+e+'" of '+this)}}if(n.byValue){i=p(i)}if(r&&r.normalize&&typeof r.normalize==="function"){i=r.normalize(i)}return i};c.prototype.isPropertyInitial=function(t){return!Object.prototype.hasOwnProperty.call(this.mProperties,t)&&!this.isBound(t)};c.prototype.resetProperty=function(t){if(this.mProperties.hasOwnProperty(t)){var e=this.getMetadata().getManagedProperty(t);e.set(this,null);if(this.mProperties[t]===e.getDefaultValue()){delete this.mProperties[t]}}return this};c.prototype.getOriginInfo=function(t){var e=this.mProperties[t];if(!(e instanceof String&&e.originInfo)){return null}return e.originInfo};c.prototype.setAssociation=function(t,e,i){if(e instanceof c){e=e.getId()}else if(e!=null&&typeof e!=="string"){g(false,"setAssociation(): sId must be a string, an instance of sap.ui.base.ManagedObject or null");return this}if(this.mAssociations[t]===e){return this}if(i){this.iSuppressInvalidate++}if(this._observer&&this.mAssociations[t]!=null){this._observer.associationChange(this,t,"remove",this.mAssociations[t])}this.mAssociations[t]=e;if(this._observer&&this.mAssociations[t]!=null){this._observer.associationChange(this,t,"insert",e)}if(!this.isInvalidateSuppressed()){this.invalidate()}if(i){this.iSuppressInvalidate--}return this};c.prototype.getAssociation=function(t,e){var i=this.mAssociations[t];if(!i){i=this.mAssociations[t]=e||null}else{if(typeof i.length==="number"&&!i.propertyIsEnumerable("length")){return i.slice()}return i}return i};c.prototype.addAssociation=function(t,e,i){if(e instanceof c){e=e.getId()}else if(typeof e!=="string"){g(false,"addAssociation(): sId must be a string or an instance of sap.ui.base.ManagedObject");return this}if(i){this.iSuppressInvalidate++}var n=this.mAssociations[t];if(!n){n=this.mAssociations[t]=[e]}else{n.push(e)}if(this._observer){this._observer.associationChange(this,t,"insert",e)}if(!this.isInvalidateSuppressed()){this.invalidate()}if(i){this.iSuppressInvalidate--}return this};c.prototype.removeAssociation=function(t,e,i){var n=this.mAssociations[t];var r=null;if(!n){return null}if(i){this.iSuppressInvalidate++}if(typeof e=="object"&&e.getId){e=e.getId()}if(typeof e=="string"){for(var s=0;s<n.length;s++){if(n[s]==e){e=s;break}}}if(typeof e=="number"){if(e<0||e>=n.length){a.warning("ManagedObject.removeAssociation called with invalid index: "+t+", "+e)}else{r=n[e];n.splice(e,1);if(this._observer){this._observer.associationChange(this,t,"remove",r)}if(!this.isInvalidateSuppressed()){this.invalidate()}}}if(i){this.iSuppressInvalidate--}return r};c.prototype.removeAllAssociation=function(t,e){var i=this.mAssociations[t];if(!i){return[]}delete this.mAssociations[t];if(!i.length){return i}if(e){this.iSuppressInvalidate++}if(this._observer){this._observer.associationChange(this,t,"remove",i)}if(!this.isInvalidateSuppressed()){this.invalidate()}if(e){this.iSuppressInvalidate--}return i};c.prototype.validateAggregation=function(e,i,r,s){var a=this.getMetadata(),p=a.getManagedAggregation(e),f,d,h,l;if(!p){throw new Error('Aggregation "'+e+'" does not exist in '+this)}if(p.multiple!==r){throw new Error("Aggregation '"+e+"' of "+this+" used with wrong cardinality (declared as "+(p.multiple?"0..n":"0..1")+")")}var u=a.getAggregationForwarder(e);if(u&&!s){u.getTarget(this).validateAggregation(u.targetAggregationName,i,r)}if(!p.multiple&&!i){return i}if(n.isA(i,p.type)){return i}f=p.altTypes;if(f&&f.length){if(i==null){return i}for(h=0;h<f.length;h++){d=t.getType(f[h]);if(d instanceof t){if(d.isValid(i)){return i}}}}d=o.get(p.type);if(typeof d==="function"&&i instanceof d){return i}l='"'+i+'" is not valid for aggregation "'+e+'" of '+this;if(t.isInterfaceType(p.type)){g(false,l);return i}else{throw new Error(l)}};c.prototype.setAggregation=function(t,e,i){var n=this.getMetadata().getAggregationForwarder(t);if(n){e=this.validateAggregation(t,e,false,true);return n.set(this,e)}var r=this.mAggregations[t];if(r===e){return this}e=this.validateAggregation(t,e,false);if(i){this.iSuppressInvalidate++}this.mAggregations[t]=null;if(r instanceof c){r.setParent(null)}else{if(this._observer!=null&&r!=null){this._observer.aggregationChange(this,t,"remove",r)}}this.mAggregations[t]=e;if(e instanceof c){e.setParent(this,t,i)}else{if(!this.isInvalidateSuppressed()){this.invalidate()}if(this._observer!=null&&e!=null){this._observer.aggregationChange(this,t,"insert",e)}}if(i){this.iSuppressInvalidate--}return this};c.prototype.getAggregation=function(t,e){var i=this.getMetadata().getAggregationForwarder(t);if(i){return i.get(this)}var n=this.mAggregations[t];if(!n){n=this.mAggregations[t]=e||null}if(n){if(typeof n.length==="number"&&!n.propertyIsEnumerable("length")){return n.slice()}return n}else{return null}};c.prototype.indexOfAggregation=function(t,e){var i=this.getMetadata().getAggregationForwarder(t);if(i){return i.indexOf(this,e)}var n=this.mAggregations[t];if(n){if(n.length==undefined){return-2}for(var r=0;r<n.length;r++){if(n[r]==e){return r}}}return-1};c.prototype.insertAggregation=function(t,e,i,n){if(!e){return this}e=this.validateAggregation(t,e,true,true);var r=this.getMetadata().getAggregationForwarder(t);if(r){return r.insert(this,e,i)}var s=this.mAggregations[t]||(this.mAggregations[t]=[]);var o;if(i<0){o=0}else if(i>s.length){o=s.length}else{o=i}if(o!==i){a.warning("ManagedObject.insertAggregation: index '"+i+"' out of range [0,"+s.length+"], forced to "+o)}s.splice(o,0,e);e.setParent(this,t,n);return this};c.prototype.addAggregation=function(t,e,i){if(!e){return this}e=this.validateAggregation(t,e,true,true);var n=this.getMetadata().getAggregationForwarder(t);if(n){return n.add(this,e)}var r=this.mAggregations[t];if(!r){r=this.mAggregations[t]=[e]}else{r.push(e)}e.setParent(this,t,i);return this};c.prototype.removeAggregation=function(t,e,i){var n=this.getMetadata().getAggregationForwarder(t);if(n){return n.remove(this,e)}var r=this.mAggregations[t],s=null,o;if(!r){return null}if(i){this.iSuppressInvalidate++}if(typeof e=="string"){for(o=0;o<r.length;o++){if(r[o]&&r[o].getId()===e){e=o;break}}}if(typeof e=="object"){for(o=0;o<r.length;o++){if(r[o]==e){e=o;break}}}if(typeof e=="number"){if(e<0||e>=r.length){a.warning("ManagedObject.removeAggregation called with invalid index: "+t+", "+e)}else{s=r[e];r.splice(e,1);s.setParent(null);if(!this.isInvalidateSuppressed()){this.invalidate()}}}if(i){this.iSuppressInvalidate--}return s};c.prototype.removeAllAggregation=function(t,e){var i=this.getMetadata().getAggregationForwarder(t);if(i){return i.removeAll(this)}var n=this.mAggregations[t];if(!n){return[]}delete this.mAggregations[t];if(!n.length){return n}if(e){this.iSuppressInvalidate++}for(var r=0;r<n.length;r++){n[r].setParent(null)}if(!this.isInvalidateSuppressed()){this.invalidate()}if(e){this.iSuppressInvalidate--}return n};c.prototype.destroyAggregation=function(t,e){var i=this.getMetadata().getAggregationForwarder(t);if(i){return i.destroy(this)}var n=this.mAggregations[t],r,s;if(!n){return this}delete this.mAggregations[t];if(Array.isArray(n)&&!n.length){return this}if(e){this.iSuppressInvalidate++}if(n instanceof c){n.destroy(e);if(this._observer){this._observer.aggregationChange(this,t,"remove",n)}}else if(Array.isArray(n)){for(r=n.length-1;r>=0;r--){s=n[r];if(s){s.destroy(e);if(this._observer){this._observer.aggregationChange(this,t,"remove",s)}}}}if(!this.isInvalidateSuppressed()){this.invalidate()}if(e){this.iSuppressInvalidate--}return this};c.prototype.invalidate=function(){if(this.oParent){this.oParent.invalidate(this)}};c.prototype.isInvalidateSuppressed=function(){var t=this.iSuppressInvalidate>0;if(this.oParent&&this.oParent instanceof c){t=t||this.oParent.isInvalidateSuppressed()}return t};c.prototype._removeChild=function(t,e,i){if(!e){a.error("Cannot remove aggregated child without aggregation name.",null,this)}else{if(i){this.iSuppressInvalidate++}var n=this.indexOfAggregation(e,t);var r=this.getMetadata().getAggregation(e);if(n==-2){if(r&&this[r._sMutator]){this[r._sMutator](null)}else{this.setAggregation(e,null,i)}}else if(n>-1){if(r&&this[r._sRemoveMutator]){this[r._sRemoveMutator](n)}else{this.removeAggregation(e,n,i)}}if(i){this.iSuppressInvalidate--}}};function v(t,e){while(t&&t!==e){t=t.oParent}return!!t}c.prototype.setParent=function(t,e,i){g(t==null||t instanceof c,"oParent either must be null, undefined or a ManagedObject");var n;if(!t){if(this.oParent){n=this._observer||this.oParent._observer;if(n){n.parentChange(this,this.sParentAggregationName,"unset",this.oParent)}if(this.aAPIParentInfos&&this.aAPIParentInfos.forwardingCounter===0){delete this.aAPIParentInfos}}this.oParent=null;this.sParentAggregationName=null;var r=c._oEmptyPropagatedProperties;if(r!==this.oPropagatedProperties){this.oPropagatedProperties=r;if(!this._bIsBeingDestroyed){Promise.resolve().then(function(){if(!this.oParent){this.updateBindings(true,null);this.updateBindingContext(false,undefined,true);this.propagateProperties(true);this.fireModelContextChange()}}.bind(this))}}this._oContextualSettings=c._defaultContextualSettings;if(!this._bIsBeingDestroyed){Promise.resolve().then(function(){if(!this.oParent){this._propagateContextualSettings()}}.bind(this))}s.refresh();return}if(v(t,this)){throw new Error("Cycle detected: new parent '"+t+"' is already a descendant of (or equal to) '"+this+"'")}if(i){s.refresh();this.iSuppressInvalidate++}var o=this.getParent();if(o){o._removeChild(this,this.sParentAggregationName)}this.oParent=t;this.sParentAggregationName=e;if(!t.mSkipPropagation[e]){var r=this.aAPIParentInfos?this.aAPIParentInfos[0].parent._getPropertiesToPropagate():t._getPropertiesToPropagate();if(r!==this.oPropagatedProperties){this.oPropagatedProperties=r;if(this.hasModel()){this.updateBindings(true,null);this.updateBindingContext(false,undefined,true);this.propagateProperties(true)}this._callPropagationListener();this.fireModelContextChange()}}this._applyContextualSettings(t._oContextualSettings);if(t&&!this.isInvalidateSuppressed()){t.invalidate(this)}if(i){this.iSuppressInvalidate--}n=this._observer||this.oParent._observer;if(n){n.parentChange(this,e,"set",this.oParent)}return this};c.prototype._applyContextualSettings=function(t){t=t||c._defaultContextualSettings;if(this._oContextualSettings!==t){this._oContextualSettings=t;this._propagateContextualSettings();if(this._bIsOwnerActive){this._onContextualSettingsChanged()}}};c.prototype._onContextualSettingsChanged=function(){};c.prototype._propagateContextualSettings=function(){var t=this._oContextualSettings,e,i,n;for(e in this.mAggregations){i=this.mAggregations[e];if(i instanceof c){i._applyContextualSettings(t)}else if(i instanceof Array){for(n=0;n<i.length;n++){if(i[n]instanceof c){i[n]._applyContextualSettings(t)}}}}};c.prototype._getContextualSettings=function(){return this._oContextualSettings};c.prototype.getParent=function(){return this.oParent};c.prototype.destroy=function(t){var i,n;if(this.bIsDestroyed){return}var r=this;this._bIsBeingDestroyed=true;if(t){this.iSuppressInvalidate++}for(i in this.mBindingInfos){n=this.mBindingInfos[i];if(n.binding){if(n.factory){this._detachAggregationBindingHandlers(i)}else{this._detachPropertyBindingHandlers(i)}}}for(i in this.mObjectBindingInfos){n=this.mObjectBindingInfos[i];if(n.binding){this._detachObjectBindingHandlers(n)}}if(this.exit){this.exit()}if(this._exitCompositeSupport){this._exitCompositeSupport()}for(var s in this.mAggregations){this.destroyAggregation(s,t)}if(this.deregister){this.deregister()}if(this.oParent&&this.sParentAggregationName){this.oParent._removeChild(this,this.sParentAggregationName,t)}delete this.oParent;for(i in this.mBindingInfos){if(this.mBindingInfos[i].factory){this.unbindAggregation(i,true)}else{this.unbindProperty(i,true)}}for(i in this.mObjectBindingInfos){this.unbindObject(i,true)}if(t){this.iSuppressInvalidate--}if(this._observer){this._observer.objectDestroyed(this)}if(this.aAPIParentInfos){this.aAPIParentInfos=null}e.prototype.destroy.apply(this,arguments);this.setParent=function(){throw Error("The object with ID "+r.getId()+" was destroyed and cannot be used anymore.")};this.bIsDestroyed=true};c.prototype.isBinding=function(t,e){return typeof this.extractBindingInfo(t)==="object"};c.prototype.extractBindingInfo=function(t,e,i){var n=r.extract(t,e,i);if(typeof t==="object"&&n&&n.template){n.template=c.create(n.template)}return n};c.prototype.getBindingInfo=function(t){var e=this.getMetadata().getAggregationForwarder(t);if(e&&e.forwardBinding){return e.getTarget(this).getBindingInfo(e.targetAggregationName)}return this.mBindingInfos[t]};c.prototype._getObjectBindingInfo=function(t){return this.mObjectBindingInfos[t]};c.prototype.bindObject=function(t){var e,i;if(typeof t=="string"){i=t;t={path:i,parameters:arguments[1]}}t=r.createObject(t);e=t.model;if(this.getObjectBinding(e)){this.unbindObject(e,true)}this.mObjectBindingInfos[e]=t;if(this.getModel(e)){this._bindObject(t)}return this};function P(t){a.error("Unexpected call of '"+t+"'.")}c.prototype._bindObject=P.bind(null,"_bindObject");c.prototype._detachObjectBindingHandlers=P.bind(null,"_detachObjectBindingHandlers");c.prototype.unbindObject=function(t,e){var i=this.mObjectBindingInfos[t];if(i){delete this.mObjectBindingInfos[t];if(i.binding){this._unbindObject(i,t,e)}}return this};c.prototype._unbindObject=P.bind(null,"_unbindObject");c.prototype.bindContext=function(t){return this.bindObject(t)};c.prototype.unbindContext=function(t){return this.unbindObject(t)};c.prototype.bindProperty=function(t,e,i,s){var o=true,a=this.getMetadata().getPropertyLikeSetting(t);if(!a){throw new Error('Property "'+t+'" does not exist in '+this)}if(typeof e=="string"){e={parts:[{path:e,type:n.isA(i,"sap.ui.model.Type")?i:undefined,mode:s}],formatter:typeof i==="function"?i:undefined}}if(this.isBound(t)){this.unbindProperty(t,true)}e=r.createProperty(e);this.mBindingInfos[t]=e;if(this._observer){this._observer.bindingChange(this,t,"prepare",e,"property")}for(var g=0;g<e.parts.length;g++){if(e.parts[g].value===undefined&&!this.getModel(e.parts[g].model)){o=false;break}}if(o){this._bindProperty(t,e)}return this};c.prototype._bindProperty=function(t,e){var i=true;for(var n=0;n<e.parts.length;n++){if(e.parts[n].value===undefined){i=false;break}}if(i){var r=[];e.parts.forEach(function(t){r.push(t.formatter?t.formatter(t.value):t.value)});var s=e.formatter?e.formatter(r):r.join(" ");var o=this.getMetadata().getPropertyLikeSetting(t);this[o._sMutator](s)}else{P.call(this,"_bindProperty")}};c.prototype._detachPropertyBindingHandlers=function(t){};c.prototype.unbindProperty=function(t,e){var i=this.mBindingInfos[t];if(i){if(i.binding){this._unbindProperty(i,t)}if(this._observer&&!this._bIsBeingDestroyed){this._observer.bindingChange(this,t,"remove",this.mBindingInfos[t],"property")}delete this.mBindingInfos[t];if(!e){this.resetProperty(t)}}return this};c.prototype._unbindProperty=P.bind(null,"_unbindProperty");c.prototype.updateProperty=function(t){};c.prototype.updateModelProperty=function(t,e,i){};var A=1;c.prototype.bindAggregation=function(t,e){var i,n,s,o,g=this.getMetadata(),p=g.getAggregation(t);if(!p){throw new Error('Aggregation "'+t+'" does not exist in '+this)}if(!p.multiple){a.error('Binding of single aggregation "'+t+'" of '+this+" is not supported!")}if(typeof e=="string"){i=arguments[1];n=arguments[2];s=arguments[3];o=arguments[4];e={path:i,sorter:s,filters:o};if(n instanceof c){e.template=n}else if(typeof n==="function"){e.factory=n}}var f=g.getAggregationForwarder(t);if(f&&f.forwardBinding){f.getTarget(this).bindAggregation(f.targetAggregationName,e);return this}if(this.isBound(t)){this.unbindAggregation(t)}if(e.template){if(e.template._sapui_candidateForDestroy){a.warning("A binding template that is marked as 'candidate for destroy' is reused in a binding. "+"You can use 'templateShareable:true' to fix this issue for all bindings that are affected "+"(The template is used in aggregation '"+t+"' of object '"+this.getId()+"'). "+"For more information, see documentation under 'Aggregation Binding'.");delete e.template._sapui_candidateForDestroy}if(e.templateShareable===undefined){e.templateShareable=A}}e=r.createAggregation(e,p._doesNotRequireFactory);this.mBindingInfos[t]=e;if(!(e.template||e.factory)){throw new Error("Missing template or factory function for aggregation "+t+" of "+this+" !")}if(this._observer){this._observer.bindingChange(this,t,"prepare",e,"aggregation")}if(this.getModel(e.model)){this._bindAggregation(t,e)}return this};c.prototype._bindAggregation=P.bind(null,"_bindAggregation");c.prototype._detachAggregationBindingHandlers=P.bind(null,"_detachAggregationBindingHandlers");c.prototype.unbindAggregation=function(t,e){var i=this.getMetadata().getAggregationForwarder(t);if(i&&i.forwardBinding){i.getTarget(this).unbindAggregation(i.targetAggregationName,e);return this}var n=this.mBindingInfos[t],r=this.getMetadata().getAggregation(t);if(n){if(n.binding){this._unbindAggregation(n,t)}if(n.template){if(!n.templateShareable&&n.template.destroy){n.template.destroy()}if(n.templateShareable===A){n.template._sapui_candidateForDestroy=true}}if(this._observer&&!this._bIsBeingDestroyed){this._observer.bindingChange(this,t,"remove",this.mBindingInfos[t],"aggregation")}delete this.mBindingInfos[t];if(!e){this[r._sDestructor]()}}return this};c.prototype._unbindAggregation=P.bind(null,"_unbindAggregation");c.prototype.updateAggregation=function(t,e,i){};c.prototype.refreshAggregation=function(t){};c.prototype.propagateMessages=function(t,e){a.warning("Message for "+this+", Property "+t)};c.prototype.isTreeBinding=function(t){return false};c.prototype.updateBindings=function(t,e){};c.prototype.isBound=function(t){return!!this.getBindingInfo(t)};c.prototype.getObjectBinding=function(t){y(t);var e=this._getObjectBindingInfo(t);return e&&e.binding};c.prototype.getEventingParent=function(){return this.oParent};c.prototype.getBinding=function(t){var e=this.getBindingInfo(t);return e&&e.binding};c.prototype.getBindingPath=function(t){var e=this.getBindingInfo(t);return e&&(e.path||e.parts&&e.parts[0]&&e.parts[0].path)};c.prototype.setBindingContext=function(t,e){y(e);var i=this.oBindingContexts[e];if(i!==t||t&&t.hasChanged()){if(t===undefined){delete this.oBindingContexts[e]}else{this.oBindingContexts[e]=t}this.updateBindingContext(false,e);this.propagateProperties(e);this.fireModelContextChange()}return this};c.prototype.setElementBindingContext=function(t,e){};c.prototype.updateBindingContext=function(t,e,i){};c.prototype.getBindingContext=function(t){var e=this.getModel(t),i=this.mElementBindingContexts[t];if(i&&!e){return i}else if(i&&e&&i.getModel()===e){return i}else if(i===null){return i}else{return this._getBindingContext(t)}};c.prototype._getBindingContext=function(t){var e=this.getModel(t),i=this.oBindingContexts[t],n=this.oPropagatedProperties.oBindingContexts[t];if(i&&!e){return this.oBindingContexts[t]}else if(i&&e&&i.getModel()===e){return this.oBindingContexts[t]}else if(i===null){return i}else if(n&&e&&n.getModel()!==e){return undefined}else{return n}};c.prototype.setModel=function(t,e){g(t==null||n.isA(t,"sap.ui.model.Model"),"oModel must be an instance of sap.ui.model.Model, null or undefined");g(e===undefined||typeof e==="string"&&!/^(undefined|null)?$/.test(e),"sName must be a string or omitted");if(!t&&this.oModels[e]){delete this.oModels[e];this.propagateProperties(e);this.updateBindings(false,e);this.fireModelContextChange()}else if(t&&t!==this.oModels[e]){this.oModels[e]=t;this.propagateProperties(e);this.updateBindingContext(false,e);this.updateBindings(false,e);this.fireModelContextChange()}return this};c.prototype.addPropagationListener=function(t){g(typeof t==="function","listener must be a function");this.aPropagationListeners.push(t);this.propagateProperties(false);this._callPropagationListener(t);return this};c.prototype.removePropagationListener=function(t){g(typeof t==="function","listener must be a function");var e=this.aPropagationListeners;var i=e.indexOf(t);if(i>=0){e.splice(i,1);this.propagateProperties(false)}return this};c.prototype.getPropagationListeners=function(){return this.oPropagatedProperties.aPropagationListeners.concat(this.aPropagationListeners)};c.prototype._callPropagationListener=function(t){var e;if(t){t(this)}else{e=this.getPropagationListeners();for(var i=0;i<e.length;i++){t=e[i];t(this)}}return this};c._oEmptyPropagatedProperties={oModels:{},oBindingContexts:{},aPropagationListeners:[]};function _(t,e){return!e.aAPIParentInfos||e.aAPIParentInfos[0].parent===t}c.prototype.propagateProperties=function(t){var e=this._getPropertiesToPropagate(),i=t===true,n=t===false,r=i?undefined:t,s,o,a,g=Object.assign({},this.mAggregations,this.mForwardedAggregations);m(e.oModels);for(s in g){if(this.mSkipPropagation[s]){continue}o=g[s];if(o instanceof c){if(_(this,o)){this._propagateProperties(t,o,e,i,r,n)}}else if(o instanceof Array){for(a=0;a<o.length;a++){if(o[a]instanceof c){if(_(this,o[a])){this._propagateProperties(t,o[a],e,i,r,n)}}}}}};c.prototype._propagateProperties=function(t,e,i,n,r,s){if(!i){i=this._getPropertiesToPropagate();n=t===true;s=t===false;r=n?undefined:t}m(i.oModels);if(e.oPropagatedProperties!==i){e.oPropagatedProperties=i;if(s!==true){e.updateBindings(n,r);e.updateBindingContext(false,r,n)}e.propagateProperties(t);if(s||n){e._callPropagationListener()}e.fireModelContextChange()}};c.prototype._getPropertiesToPropagate=function(){var t=l(this.oModels),e=l(this.oBindingContexts),i=this.aPropagationListeners.length===0,n=l(this.mElementBindingContexts);function r(t,e,i,n){return t?e:h({},e,i,n)}function s(t,e,i){return t?e:e.concat(i)}if(e&&t&&n&&i){return this.oPropagatedProperties}else{return{oModels:r(t,this.oPropagatedProperties.oModels,this.oModels),oBindingContexts:r(e&&n,this.oPropagatedProperties.oBindingContexts,this.oBindingContexts,this.mElementBindingContexts),aPropagationListeners:s(i,this.oPropagatedProperties.aPropagationListeners,this.aPropagationListeners)}}};c.prototype.getModel=function(t){y(t);return this.oModels[t]||this.oPropagatedProperties.oModels[t]};c.prototype.getOwnModels=function(){return this.oModels};c.prototype.hasModel=function(){return!(l(this.oModels)&&l(this.oPropagatedProperties.oModels))};c.prototype.clone=function(t,e,n){var s=true,o=true;if(n){s=!!n.cloneChildren;o=!!n.cloneBindings}if(!t){t=i.uid("clone")||d()}if(!e&&s){e=this.findAggregatedObjects(true,null,true).map(function(t){return t.getId()});e.push(this.getId())}var g=this.getMetadata(),f=g._oClass,h=this.getId()+"-"+t,l={},u,y=this.mProperties,b,m,v,P=r.escape,_,I;var B=Object.keys(y);var C;_=B.length;while(_>0){b=B[--_];u=g.getProperty(b);if(u&&!(this.isBound(b)&&o)){if(typeof y[b]==="string"){l[b]=P(y[b])}else{C=u.byValue?p(y[b]):y[b];if(C&&typeof C==="object"&&!Object.isFrozen(C)){C[r.UI5ObjectMarker]=true}l[b]=C}}}l["models"]=this.oModels;l["bindingContexts"]=this.oBindingContexts;if(s){var M=Object.assign({},this.mAggregations,this.mForwardedAggregations);for(m in M){var x=M[m];if(g.hasAggregation(m)&&!(this.isBound(m)&&o)){if(x instanceof c){l[m]=x.clone(t,e)}else if(Array.isArray(x)){l[m]=[];for(var _=0;_<x.length;_++){l[m].push(x[_].clone(t,e))}}else{l[m]=typeof x==="string"?P(x):x}}}for(m in this.mAssociations){if(!g.hasAssociation(m)){continue}var j=this.mAssociations[m];if(Array.isArray(j)){j=j.slice(0);for(var _=0;_<j.length;_++){if(e.indexOf(j[_])>=0){j[_]+="-"+t}}}else if(e.indexOf(j)>=0){j+="-"+t}l[m]=j}}v=new f(h,l);function S(i,n,r,s,o){var g=!r;var p=Object.assign({},i);if(!i.templateShareable&&i.template&&i.template.clone){p.template=i.template.clone(t,e);delete p.factory}else if(i.templateShareable===A){i.templateShareable=p.templateShareable=true;a.error("During a clone operation, a template was found that neither was marked with 'templateShareable:true' nor 'templateShareable:false'. "+"The framework won't destroy the template. This could cause errors (e.g. duplicate IDs) or memory leaks "+"(The template is used in aggregation '"+o+"' of object '"+s.getId()+"')."+"For more information, see documentation under 'Aggregation Binding'.")}delete p.binding;delete p.modelChangeHandler;delete p.dataStateChangeHandler;delete p.modelRefreshHandler;if(g){n.bindObject(p)}else if(i.factory){n.bindAggregation(r,p)}else{n.bindProperty(r,p)}}for(m in this.mEventRegistry){v.mEventRegistry[m]=this.mEventRegistry[m].slice()}if(o){for(m in this.mObjectBindingInfos){S(this.mObjectBindingInfos[m],v)}for(m in this.mBindingInfos){S(this.mBindingInfos[m],v,m,this,m)}}if(c._supportInfo){c._supportInfo.addSupportInfo(v.getId(),c._supportInfo.byId(this.getId()))}if(this._cloneMetadataContexts){this._cloneMetadataContexts(v)}if(this.mForwardedAggregations){for(m in this.mForwardedAggregations){var w=v.getMetadata().getAggregationForwarder(m);if(w){I=w.getTarget(v,true);if(w.forwardBinding&&this.isBound(m)){S(this.getBindingInfo(m),I,w.targetAggregationName,this,m)}}}}return v};c._handleLocalizationChange=function(t){var e,i,n,r;if(t===1){for(i in this.oModels){e=this.oModels[i];if(e&&e._handleLocalizationChange){e._handleLocalizationChange()}}}else if(t===2){for(i in this.mBindingInfos){n=this.mBindingInfos[i];var s=n.parts;if(s){for(r=0;r<s.length;r++){if(n.type&&n.type._handleLocalizationChange){n.type._handleLocalizationChange()}}if(n.modelChangeHandler){n.modelChangeHandler()}}}}};c.prototype.findAggregatedObjects=function(t,e,i){var n=[];if(e&&typeof e!=="function"){e=null}function r(s){var o,a,g;if(i){for(g in s.mBindingInfos){o=s.mBindingInfos[g].template;if(o){if(!e||e(o)){n.push(o)}if(t){r(o)}}}}for(g in s.mAggregations){o=s.mAggregations[g];if(Array.isArray(o)){for(a=0;a<o.length;a++){if(!e||e(o[a])){n.push(o[a])}if(t){r(o[a])}}}else if(o instanceof c){if(!e||e(o)){n.push(o)}if(t){r(o)}}}}r(this);return n};c.prototype.onOwnerDeactivation=function(){this._bIsOwnerActive=false};c.prototype.onOwnerActivation=function(){this._bIsOwnerActive=true;this._onContextualSettingsChanged()};c.prototype.isDestroyStarted=function(){return!!this._bIsBeingDestroyed};c.prototype.isDestroyed=function(){return!!this.bIsDestroyed};c._defaultContextualSettings={};return c});
//# sourceMappingURL=ManagedObject.js.map