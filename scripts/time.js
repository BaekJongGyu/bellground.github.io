﻿"use strict";class CTimes extends CDataClass{constructor(){super(...arguments),this._times=new CTableData(["name","object"],["name","object"])}get times(){return this._times}get length(){return this.times.length}add(t,e){this._times.add([t,e])}delete(t){if("string"==typeof t){let e=this._times.findIndexRow("name",t);this._times.delete(e)}else{let e=this._times.findIndexRow("object",t);this._times.delete(e)}}clear(){this._times.clear()}loopTime(t){for(let e=0;e<this._times.length;e++)t(this._times.getRow(e).get(1).asObject)}}class CTime extends CDataClass{constructor(t,e=1){super(),this._time=0,this._speed=1,this._isPause=!1,this._isReverse=!1,this._childs=new CTimes,this._timePoints=new Array,this._timeSections=new Array,this._time=null==t?(new Date).getTime():t,this.speed=e}get preTime(){return this._preTime}get changeTime(){return this._changeTime}get time(){return this._time}set time(t){t!=this._time&&(this._time=t,this.doChangeTime())}get timeString(){let t=new Date(this._time);return CDatetime.toTimeString(t,!0,!0)}get speed(){return this._speed}set speed(t){this._speed=t}get isPause(){return this._isPause}set isPause(t){this._isPause!=t&&(this._isPause=t,this.doChangePause())}get isReverse(){return this._isReverse}set isReverse(t){this._isReverse!=t&&(this._isReverse=t,this.doChangeReverse())}get childs(){return this._childs}get timePoints(){return this._timePoints}get timeSections(){return this._timeSections}set timeSections(t){this._timeSections=t}doChangeTime(){null!=this.onChangeTime&&this.onChangeTime(this)}doChangePause(){null!=this.onChangePause&&this.onChangePause(this)}doChangeReverse(){null!=this.onChangeReverse&&this.onChangeReverse(this)}doRemove(){CTime.times.delete(this),this._childs.loopTime(function(t){t.doRemove()}),this._childs.clear(),super.doRemove()}setTime(t,e){let i=(e-t)*this.speed;if(!this.isPause){this._preTime=this.time,this._changeTime=i,this.isReverse?this.time-=i:this.time+=i;let t=this;if(this.childs.loopTime(function(e){null!=t.preTime&&e.setTime(t.preTime,t.time)}),null!=this.preTime){for(let t=0;t<this._timePoints.length;t++)this._timePoints[t].checkTime(this.preTime,this.time);for(let t=0;t<this._timeSections.length;t++)if(this._timeSections[t].isLoop){if(this.time>=this._timeSections[t].startTime){let e=this._timeSections[t].stopTime-this._timeSections[t].startTime,i=this._timeSections[t].startTime+e*Math.floor((this.time-this._timeSections[t].startTime)/e),a=i+e;this._timeSections[t].doTick(this.preTime,this.time,CCalc.crRange2Value(i,a,this.time,0,1))}}else this.isReverse?this.preTime>=this._timeSections[t].startTime&&this.time<=this._timeSections[t].startTime?this._timeSections[t].doTick(this.preTime,this.time,0):this.time<=this._timeSections[t].stopTime&&this.preTime>=this._timeSections[t].stopTime?this._timeSections[t].doTick(this.preTime,this.time,1):this.time>this._timeSections[t].startTime&&this.time<this._timeSections[t].stopTime&&this._timeSections[t].doTick(this.preTime,this.time,CCalc.crRange2Value(this._timeSections[t].startTime,this._timeSections[t].stopTime,this.time,0,1)):this.preTime<=this._timeSections[t].startTime&&this.time>=this._timeSections[t].startTime?this._timeSections[t].doTick(this.preTime,this.time,0):this.time>=this._timeSections[t].stopTime&&this.preTime<=this._timeSections[t].stopTime?this._timeSections[t].doTick(this.preTime,this.time,1):this.time>this._timeSections[t].startTime&&this.time<this._timeSections[t].stopTime&&this._timeSections[t].doTick(this.preTime,this.time,CCalc.crRange2Value(this._timeSections[t].startTime,this._timeSections[t].stopTime,this.time,0,1))}}}hasTimePoint(t){let e=!1;for(let i=0;i<this.timePoints.length;i++)if(this.timePoints[i]==t){e=!0;break}return e}deleteTimePoint(t){for(let e=0;e<this._timePoints.length;e++)if(this._timePoints[e]==t){this._timePoints.splice(e,1);break}}clearTimePoint(){for(let t=this._timePoints.length-1;t>=0;t--)this._timePoints[t].remove(),this._timePoints.splice(t,1)}clearTimeSection(){for(let t=this._timeSections.length-1;t>=0;t--)this._timeSections[t].remove(),this._timeSections.splice(t,1)}timeMove(t){if(t!=this.time){let e=t-this.time;this._preTime=void 0,this._changeTime=void 0,this.time=t,this.childs.loopTime(function(t){t.timeMove(t.time+e*t.speed)})}}pause(){this.isPause=!this.isPause}reverse(){this.isReverse=!this.isReverse}static get now(){return(new Date).getTime()}static doAnimationFrame(t,e){this.systemTime=e,this.isPause||CTime.times.loopTime(function(i){i.setTime(t,e)})}static pause(){CTime.isPause=!CTime.isPause}}CTime.isPause=!1,CTime.times=new CTimes,CTime.systemTime=0;class CTimePoint extends CDataClass{constructor(t,e,i){super(),this._afterRemove=!1,this._timePointCount=0,this._notifyDirection="both",this._parent=t,this._time=null==e?(new Date).getTime():e,null!=i&&(this._afterRemove=i)}get parent(){return this._parent}get afterRemove(){return this._afterRemove}set afterRemove(t){this._afterRemove=t}get time(){return this._time}set time(t){this._time=t}get timePointCount(){return this._timePointCount}set timePointCount(t){this._timePointCount=t}get notifyDirection(){return this._notifyDirection}set notifyDirection(t){this._notifyDirection=t}doRemove(){null!=this._parent&&(this._parent.deleteTimePoint(this),this._parent=void 0),super.doRemove()}doBeforeTime(){null!=this.onBeforeTime&&this.onBeforeTime(this,this.parent,this.timePointCount)}doTime(t){this._timePointCount++,null!=this.onTime&&this.onTime(this,this.parent,this.timePointCount),this._afterRemove&&this.doRemove()}checkTime(t,e){let i=CCalc.min(t,e),a=CCalc.max(t,e);if("both"==this.notifyDirection&&i<this.time&&a>=this.time){let i=0;i=t<e?this.time-t:t-this.time,this.doBeforeTime(),this.doTime(i)}else if("go"==this.notifyDirection&&t<this.time&&e>=this.time){let e=this.time-t;this.doBeforeTime(),this.doTime(e)}else if("back"==this.notifyDirection&&e<this.time&&t>=this.time){let e=t-this.time;this.doBeforeTime(),this.doTime(e)}}}class CTimeSection extends CDataClass{constructor(t){super(),this.startTime=0,this.stopTime=0,this.isLoop=!1,null!=t&&t.timeSections.push(this)}get parent(){return this._parent}doRemove(){this._parent=void 0,super.doRemove()}doTick(t,e,i){null!=this.onTick&&this.onTick(this,t,e,i)}}class CTimePointReserve extends CTimePoint{doTime(t){0==this.timePointCount&&null!=this._parent&&(this._parent.isReverse?this._parent.timeMove(this._parent.time+t):this._parent.timeMove(this._parent.time-t),this._parent.reverse()),super.doTime(t)}}class CTimePointPause extends CTimePoint{doTime(t){0==this.timePointCount&&null!=this._parent&&this._parent.pause(),super.doTime(t)}}class CTimePointMoveTime extends CTimePoint{constructor(t,e,i,a){super(t,i,a),this._moveTime=e}get moveTime(){return this._moveTime}set moveTime(t){this._moveTime=t}doTime(t){0==this.timePointCount&&null!=this._parent&&this._parent.timeMove(this._moveTime+t),super.doTime(t)}}class CTimePointRemoveTimeFromTimes extends CTimePoint{doTime(t){null!=this._parent&&CTime.times.delete(this._parent),super.doTime(t)}}{let t;function _t(e){let i=(new Date).getTime();if(null!=t)try{CTime.doAnimationFrame(t,i)}catch(t){console.log(t)}t=i,window.requestAnimationFrame(_t)}window.requestAnimationFrame(_t)}class CAnimation extends CResourceClass{constructor(t,e,i){super(),this._animate=!1,this._value=0,this._invertValue=!1,this.duration=200,this.cancelDuration=100,this.delay=0,this.isLoop=!1,null!=t&&(this.duration=t),null!=e&&(this.delay=e),null!=i&&(this.isLoop=i)}doToData(t){super.doToData(t),CDataClass.putData(t,"duration",this.duration,200),CDataClass.putData(t,"cancelDuration",this.cancelDuration,100),CDataClass.putData(t,"delay",this.delay,0),CDataClass.putData(t,"isLoop",this.isLoop,!1)}doFromData(t){super.doFromData(t),this.duration=CDataClass.getData(t,"duration",200),this.cancelDuration=CDataClass.getData(t,"cancelDuration",100),this.delay=CDataClass.getData(t,"delay",0),this.isLoop=CDataClass.getData(t,"isLoop",!1)}doAnimate(t,e,i){null!=this.onAnimate&&this.onAnimate(this,t,e,i)}doBeforeAnimation(){null!=this.onBeforeAnimation&&this.onBeforeAnimation(this)}doAfterAnimation(){this._animate=!1,null!=this._time&&this._time.doRemove(),this._time=void 0,null!=this.onAfterAnimation&&this.onAfterAnimation(this)}doStart(t){let e=this;this._time=new CTime,this._invertValue=t,this._animate=!0,null!=this.onStart&&this.onStart(this,this._time),CAnimation.animate(this.duration,function(t,i,a){null!=e&&e._animate&&(e._value=i,e.doAnimate(t,i,a))},this.delay,this._invertValue,this.isLoop,function(){null!=e&&e.doBeforeAnimation()},function(){null!=e&&e.doAfterAnimation(),e=void 0},this._time)}doCancel(){if(null!=this._time){null!=this.onCancel&&this.onCancel(this,this._time),this._time.doRemove(),this._time=void 0,this._animate=!1;let t=this;CAnimation.animate(this.cancelDuration,function(e,i,a){t.doAnimate(e,t._value-CCalc.crRange2Value(0,1,i,0,t._value),a)},0,this._invertValue,!1,void 0,function(){t.doAfterAnimation()},this._time)}}doPause(){null!=this._time&&(this._time.pause(),null!=this.onPause&&this.onPause(this,this._time))}start(){this.doStart(!1)}invert(){this.doStart(!0)}startOnce(t,e,i){CAnimation.animate(this.duration,t,this.delay,!1,this.isLoop,e,i,this._time)}reverse(){null!=this._time&&this._time.reverse()}cancel(){this.doCancel()}pause(){this.doPause()}isAnimate(){return this._animate}static animateResource(t,e,i,a,s){let o=CSystem.resources.get(t);CAnimation.graphAnimate(o.duration,o.graphNames,e,o.pointsNames,i,o.delay,!1,o.isLoop,a,s)}static animate(t,e,i,a,s,o,r,n){let h=null==i?0:"number"==typeof i?i:Math.random()*(i.randomRangeStop-i.randomRangeStart)+i.randomRangeStart,l=null==t?0:"number"==typeof t?t:Math.random()*(t.randomRangeStop-t.randomRangeStart)+t.randomRangeStart,m=(new Date).getTime()+h,p=m+l;function u(t){if(null!=o&&o(),e(t,a?1:0,0),s){let e=new CTimePointMoveTime(t,m,p);e.notifyDirection="go";let i=new CTimePointMoveTime(t,p,m);i.notifyDirection="back",e.onTime=function(t,e){t.timePointCount=0},i.onTime=function(t,e){t.timePointCount=0},t.timePoints.push(e),t.timePoints.push(i)}else{let e=new CTimePointRemoveTimeFromTimes(t,p);e.notifyDirection="go";let i=new CTimePointRemoveTimeFromTimes(t,m);i.notifyDirection="back",e.onTime=function(){e.remove(),i.remove(),null!=r&&r()},i.onTime=function(){e.remove(),i.remove(),null!=r&&r()},t.timePoints.push(e),t.timePoints.push(i)}t.onChangeTime=function(i){if(null!=t.changeTime){let i=CCalc.crRange2Value(m,p,t.time,0,1);i<0&&(i=0),i>1&&(i=1),a&&(i=1-i),e(t,i,t.changeTime)}}}if(0==h)if(null!=n)CTime.times.add(CSequence.getSequence("tempAnimation"),n),u(n);else{let t=new CTime;CTime.times.add(CSequence.getSequence("tempAnimation"),t),u(t)}else null!=n&&CTime.times.add(CSequence.getSequence("tempAnimation"),n),setTimeout(()=>{if(null!=n)u(n);else{let t=new CTime;CTime.times.add(CSequence.getSequence("tempAnimation"),t),u(t)}},h);return{duration:l,delay:h,startTime:m,stopTime:p}}static graphAnimate(t,e,i,a,s,o,r,n,h,l,m){let p=new Array,u=new Array;for(let t=0;t<e.length;t++){let i=CSystem.resources.get(e[t]);null!=i&&p.push({name:e[t],values:i})}if(null!=a)for(let t=0;t<a.length;t++){let e=CSystem.resources.get("pathpoints"+a[t]);if(null!=e){let i=CSystem.resources.get(e.graphName);null!=i&&u.push({graphName:e.graphName,graphValues:i,pointsName:a[t],points:e.points})}}CAnimation.animate(t,function(t,e,o){for(let a=0;a<p.length;a++)i(t,e,o,p[a].name,p[a].values[Math.round(CCalc.cr(p[a].values.length-1,0,1,e,2))]);if(null!=a&&null!=s)for(let i=0;i<u.length;i++){let a=u[i].graphValues[Math.round(CCalc.cr(u[i].graphValues.length-1,0,1,e,2))];a<0&&(a=0),a>1&&(a=1),s(t,e,o,u[i].pointsName,u[i].points[Math.round(CCalc.cr(u[i].points.length-1,0,1,a,2))])}},o,r,n,h,l,m)}}class CGraphAnimationInfo extends CResourceClass{constructor(t,e,i,a,s,o,r,n,h,l){super(),this.duration=200,this.graphNames=new Array,this.duration=t,this.graphNames=e,this.graphProc=i,this.pointsNames=a,this.pointsProc=s,this.delay=o,this.invertValue=r,this.isLoop=n,this.beforeAnimation=h,this.afterAnimation=l}doStartAnimation(){let t=this.getAnimation();return null!=this.onStartAnimation&&this.onStartAnimation(this,t),null!=this.invertValue&&this.invertValue?t.invert():t.start(),t}getAnimation(){let t=new CGraphAnimation(this.graphNames,this.pointsNames,this.duration,this.delay,this.isLoop);return null!=this.graphProc&&(t.onGraphAnimate=this.graphProc),null!=this.pointsProc&&(t.onPointsAnimate=this.pointsProc),null!=this.beforeAnimation&&(t.onBeforeAnimation=this.beforeAnimation),null!=this.afterAnimation&&(t.onAfterAnimation=this.afterAnimation),t}startAnimation(){return this.doStartAnimation()}}class CGraphAnimation extends CAnimation{constructor(t,e,i,a,s){super(i,a,s),this._arr=new Array,this._arrPoints=new Array,this.graphNames=t,this.pointsNames=e}doToData(t){super.doToData(t),CDataClass.putData(t,"graphNames",this.graphNames,[],!0),CDataClass.putData(t,"pointsNames",this.pointsNames,void 0)}doFromData(t){super.doFromData(t),this.graphNames=CDataClass.getData(t,"graphNames",[],!0),this.pointsNames=CDataClass.getData(t,"pointsNames",void 0)}doStart(t){this._arr=[],this._arrPoints=[];for(let t=0;t<this.graphNames.length;t++){let e=CSystem.resources.get(this.graphNames[t]);null!=e&&this._arr.push({name:this.graphNames[t],values:e})}if(null!=this.pointsNames)for(let t=0;t<this.pointsNames.length;t++){let e=CSystem.resources.get(this.pointsNames[t]);if(null!=e){let i=CSystem.resources.get(e.graphName);null!=i&&this._arrPoints.push({graphName:e.graphName,graphValues:i,pointsName:this.pointsNames[t],points:e.points})}}super.doStart(t)}doAnimate(t,e,i){super.doAnimate(t,e,i);for(let a=0;a<this._arr.length;a++)this.doGraphAnimate(t,e,i,this._arr[a].name,this._arr[a].values[Math.round(CCalc.cr(this._arr[a].values.length-1,0,1,e,2))]);if(null!=this.pointsNames)for(let a=0;a<this._arrPoints.length;a++){let s=this._arrPoints[a].graphValues[Math.round(CCalc.cr(this._arrPoints[a].graphValues.length-1,0,1,e,2))];s<0&&(s=0),s>1&&(s=1),this.doPointsAnimate(t,e,i,this._arrPoints[a].pointsName,this._arrPoints[a].points[Math.round(CCalc.cr(this._arrPoints[a].points.length-1,0,1,s,2))])}}doGraphAnimate(t,e,i,a,s){null!=this.onGraphAnimate&&this.onGraphAnimate(this,t,e,i,a,s)}doPointsAnimate(t,e,i,a,s){null!=this.onPointsAnimate&&this.onPointsAnimate(this,t,e,i,a,s)}}class CColorInfo extends CDataClass{constructor(t,e,i,a){super(),this.r=255,this.g=255,this.b=255,this.a=1,null!=t&&(this.r=t),null!=e&&(this.g=e),null!=i&&(this.b=i),null!=a&&(this.a=a)}doToData(t){super.doToData(t),CDataClass.putData(t,"r",this.r,255),CDataClass.putData(t,"g",this.g,255),CDataClass.putData(t,"b",this.b,255),CDataClass.putData(t,"a",this.a,1)}doFromData(t){super.doFromData(t),this.r=CDataClass.getData(t,"r",255),this.g=CDataClass.getData(t,"g",255),this.b=CDataClass.getData(t,"b",255),this.a=CDataClass.getData(t,"a",1)}toColor(){return"rgba("+this.r+","+this.g+","+this.b+","+this.a+")"}}var EGraphAnimationValueKind,EPointsValueKind;!function(t){t[t.GRAPH=0]="GRAPH",t[t.POINTS=1]="POINTS"}(EGraphAnimationValueKind||(EGraphAnimationValueKind={})),function(t){t[t.POINT=0]="POINT",t[t.RECT=1]="RECT",t[t.NOTIFYRECT=2]="NOTIFYRECT"}(EPointsValueKind||(EPointsValueKind={}));class CGraphAnimationValue extends CDataClass{constructor(t,e,i){super(),this.name=t,this.startValue=e,this.stopValue=i}get startValueString(){let t="";return"number"==typeof this.startValue?t=this.startValue+"":this.startValue instanceof CColorInfo?t="new CColorInfo("+this.startValue.r+","+this.startValue.g+","+this.startValue.b+","+this.startValue.a+")":this.startValue instanceof CPoint&&(t="new CPoint("+this.startValue.x+","+this.startValue.y+")"),t}get stopValueString(){let t="";return"number"==typeof this.stopValue?t=this.stopValue+"":this.stopValue instanceof CColorInfo?t="new CColorInfo("+this.stopValue.r+","+this.stopValue.g+","+this.stopValue.b+","+this.stopValue.a+")":this.startValue instanceof CPoint&&(t="new CPoint("+this.startValue.x+","+this.startValue.y+")"),t}doToData(t){super.doToData(t),CDataClass.putData(t,"name",this.name,""),"number"==typeof this.startValue?(CDataClass.putData(t,"startKind","number"),CDataClass.putData(t,"startValue",this.startValue,0)):this.startValue instanceof CPoint?(CDataClass.putData(t,"startKind","CPoint"),CDataClass.putData(t,"startValue",this.startValue.toData(),{x:0,y:0},!0)):this.startValue instanceof CRect?(CDataClass.putData(t,"startKind","CRect"),CDataClass.putData(t,"startValue",this.startValue.toData(),{left:0,top:0,right:0,bottom:0},!0)):this.startValue instanceof CNotifyPoint?(CDataClass.putData(t,"startKind","CNotifyPoint"),CDataClass.putData(t,"startValue",this.startValue.toData(),{x:0,y:0},!0)):this.startValue instanceof CNotifyRect?(CDataClass.putData(t,"startKind","CNotifyRect"),CDataClass.putData(t,"startValue",this.startValue.toData(),{left:0,top:0,right:0,bottom:0},!0)):this.startValue instanceof CColorInfo&&(CDataClass.putData(t,"startKind","CColorInfo"),CDataClass.putData(t,"startValue",this.startValue.toData(),{r:255,g:255,b:255,a:1},!0)),"number"==typeof this.stopValue?(CDataClass.putData(t,"stopKind","number"),CDataClass.putData(t,"stopValue",this.stopValue,0)):this.stopValue instanceof CPoint?(CDataClass.putData(t,"stopKind","CPoint"),CDataClass.putData(t,"stopValue",this.stopValue.toData(),{x:0,y:0},!0)):this.stopValue instanceof CRect?(CDataClass.putData(t,"stopKind","CRect"),CDataClass.putData(t,"stopValue",this.stopValue.toData(),{left:0,top:0,right:0,bottom:0},!0)):this.stopValue instanceof CNotifyPoint?(CDataClass.putData(t,"stopKind","CNotifyPoint"),CDataClass.putData(t,"stopValue",this.stopValue.toData(),{x:0,y:0},!0)):this.stopValue instanceof CNotifyRect?(CDataClass.putData(t,"stopKind","CNotifyRect"),CDataClass.putData(t,"stopValue",this.stopValue.toData(),{left:0,top:0,right:0,bottom:0},!0)):this.stopValue instanceof CColorInfo&&(CDataClass.putData(t,"stopKind","CColorInfo"),CDataClass.putData(t,"stopValue",this.stopValue.toData(),{r:255,g:255,b:255,a:1},!0))}doFromData(t){super.doFromData(t),this.name=CDataClass.getData(t,"name","");let e=CDataClass.getData(t,"startKind"),i=CDataClass.getData(t,"stopKind");"number"==e&&(this.startValue=CDataClass.getData(t,"startValue",0)),"CPoint"==e&&(this.startValue=new CPoint,this.startValue.fromData(CDataClass.getData(t,"startValue",{x:0,y:0},!0))),"CRect"==e&&(this.startValue=new CRect,this.startValue.fromData(CDataClass.getData(t,"startValue",{left:0,top:0,right:0,bottom:0},!0))),"CNotifyPoint"==e&&(this.startValue=new CNotifyPoint,this.startValue.fromData(CDataClass.getData(t,"startValue",{x:0,y:0},!0))),"CNotifyRect"==e&&(this.startValue=new CNotifyRect,this.startValue.fromData(CDataClass.getData(t,"startValue",{left:0,top:0,right:0,bottom:0},!0))),"CColorInfo"==e&&(this.startValue=new CColorInfo,this.startValue.fromData(CDataClass.getData(t,"startValue",{r:255,g:255,b:255,a:1},!0))),"number"==i&&(this.stopValue=CDataClass.getData(t,"stopValue",0)),"CPoint"==i&&(this.stopValue=new CPoint,this.stopValue.fromData(CDataClass.getData(t,"stopValue",{x:0,y:0},!0))),"CRect"==i&&(this.stopValue=new CRect,this.stopValue.fromData(CDataClass.getData(t,"stopValue",{left:0,top:0,right:0,bottom:0},!0))),"CNotifyPoint"==i&&(this.stopValue=new CNotifyPoint,this.stopValue.fromData(CDataClass.getData(t,"stopValue",{x:0,y:0},!0))),"CNotifyRect"==i&&(this.stopValue=new CNotifyRect,this.stopValue.fromData(CDataClass.getData(t,"stopValue",{left:0,top:0,right:0,bottom:0},!0))),"CColorInfo"==i&&(this.stopValue=new CColorInfo,this.stopValue.fromData(CDataClass.getData(t,"stopValue",{r:255,g:255,b:255,a:1},!0)))}getValue(t){if("number"==typeof this.startValue&&"number"==typeof this.stopValue)return CCalc.crRange2Value(0,1,t,this.startValue,this.stopValue);if(this.startValue instanceof CPoint&&this.stopValue instanceof CPoint){let e=CCalc.crRange2Value(0,1,t,this.startValue.x,this.stopValue.x),i=CCalc.crRange2Value(0,1,t,this.startValue.y,this.stopValue.y);return CPoint.create(e,i)}if(this.startValue instanceof CNotifyPoint&&this.stopValue instanceof CNotifyPoint){let e=CCalc.crRange2Value(0,1,t,this.startValue.x,this.stopValue.x),i=CCalc.crRange2Value(0,1,t,this.startValue.y,this.stopValue.y);return CNotifyPoint.create(e,i)}if(this.startValue instanceof CRect&&this.stopValue instanceof CRect){let e=CCalc.crRange2Value(0,1,t,this.startValue.left,this.stopValue.left),i=CCalc.crRange2Value(0,1,t,this.startValue.top,this.stopValue.top),a=CCalc.crRange2Value(0,1,t,this.startValue.right,this.stopValue.right),s=CCalc.crRange2Value(0,1,t,this.startValue.bottom,this.stopValue.bottom);return CRect.create(e,i,a,s)}if(this.startValue instanceof CNotifyRect&&this.stopValue instanceof CNotifyRect){let e=CCalc.crRange2Value(0,1,t,this.startValue.left,this.stopValue.left),i=CCalc.crRange2Value(0,1,t,this.startValue.top,this.stopValue.top),a=CCalc.crRange2Value(0,1,t,this.startValue.right,this.stopValue.right),s=CCalc.crRange2Value(0,1,t,this.startValue.bottom,this.stopValue.bottom);return new CNotifyRect(e,i,a,s)}if(this.startValue instanceof CColorInfo&&this.stopValue instanceof CColorInfo){let e=CCalc.crRange2Value(0,1,t,this.startValue.r,this.stopValue.r),i=CCalc.crRange2Value(0,1,t,this.startValue.g,this.stopValue.g),a=CCalc.crRange2Value(0,1,t,this.startValue.b,this.stopValue.b),s=CCalc.crRange2Value(0,1,t,this.startValue.a,this.stopValue.a);return new CColorInfo(e,i,a,s)}}static graphValueToData(t){return"number"==typeof t?{kind:"number",value:t}:t instanceof CPoint?{kind:"CPoint",value:t.toData()}:t instanceof CRect?{kind:"CRect",value:t.toData()}:t instanceof CNotifyPoint?{kind:"CNotifyPoint",value:t.toData()}:t instanceof CNotifyRect?{kind:"CNotifyRect",value:t.toData()}:t instanceof CColorInfo?{kind:"CColorInfo",value:t.toData()}:void 0}static graphValueFromData(t){if("number"==t.kind)return t.value;if("CPoint"==t.kind){let e=new CPoint;return e.fromData(t.value),e}if("CRect"==t.kind){let e=new CRect;return e.fromData(t.value),e}if("CNotifyPoint"==t.kind){let e=new CNotifyPoint;return e.fromData(t.value),e}if("CNotifyRect"==t.kind){let e=new CNotifyRect;return e.fromData(t.value),e}{let e=new CColorInfo;return e.fromData(t.valeu),e}}}class CPointsAnimationValue extends CDataClass{constructor(t,e,i,a){super(),this.name=t,this.pointsArea=e,this.rectWidth=i,this.rectHeight=a}doToData(t){super.doToData(t),CDataClass.putData(t,"name",this.name,""),CDataClass.putData(t,"pointsArea",this.pointsArea.toData(),{left:0,top:0,right:0,bottom:0},!0),CDataClass.putData(t,"rectWidth",this.rectWidth,void 0),CDataClass.putData(t,"rectHeight",this.rectHeight,void 0)}doFromData(t){super.doFromData(t),this.name=CDataClass.getData(t,"name",""),this.pointsArea.fromData(CDataClass.getData(t,"pointsArea",{left:0,top:0,right:0,bottom:0},!0)),this.rectWidth=CDataClass.getData(t,"rectWidth",void 0),this.rectHeight=CDataClass.getData(t,"rectHeight",void 0)}getPointValue(t,e){if(e==EPointsValueKind.POINT){let e=CCalc.crRange2Value(0,1,t.x,this.pointsArea.left,this.pointsArea.right),i=CCalc.crRange2Value(0,1,t.y,this.pointsArea.top,this.pointsArea.bottom);return CPoint.create(e,i)}if(e==EPointsValueKind.RECT&&null!=this.rectWidth&&null!=this.rectHeight){let e=new CRect;return e.left=CCalc.crRange2Value(0,1,t.x,this.pointsArea.left,this.pointsArea.right),e.top=CCalc.crRange2Value(0,1,t.y,this.pointsArea.top,this.pointsArea.bottom),e.width=this.rectWidth,e.height=this.rectHeight,e}if(e==EPointsValueKind.NOTIFYRECT&&null!=this.rectWidth&&null!=this.rectHeight){let e=new CNotifyRect;return e.left=CCalc.crRange2Value(0,1,t.x,this.pointsArea.left,this.pointsArea.right),e.top=CCalc.crRange2Value(0,1,t.y,this.pointsArea.top,this.pointsArea.bottom),e.width=this.rectWidth,e.height=this.rectHeight,e}}}class CProperty extends CDataClass{constructor(t,e){super(),this.properties="",this.obj=t,this.properties=e}get property(){return new Function("obj","return obj."+this.properties)(this.obj)}set property(t){let e=this.properties.split("."),i="";for(let t=0;t<e.length;t++){if(i+="."+e[t],new Function("obj","return obj"+i+" == undefined")(this.obj))return}new Function("obj","v","if(obj."+this.properties+" != undefined) obj."+this.properties+" = v")(this.obj,t)}doToData(t){super.doToData(t),CDataClass.putData(t,"properties",this.properties,"")}doFromData(t){super.doFromData(t),this.properties=CDataClass.getData(t,"properties","")}static getProperty(t,e){return new Function("obj","return obj."+e)(t)}static setProperty(t,e,i){new Function("obj","v","obj."+e+" = v")(t,i)}}class CAnimatorSetProperty extends CProperty{constructor(t,e,i){super(t,e),this.value=i}doToData(t){super.doToData(t),CDataClass.putData(t,"value",this.value)}doFromData(t){super.doFromData(t),this.value=CDataClass.getData(t,"changeValue")}}class CAnimatorGraphProperty extends CProperty{constructor(t,e,i,a,s){super(t,e),this.changeValue=new CGraphAnimationValue(i,a,s)}doToData(t){super.doToData(t),CDataClass.putData(t,"changeValue",this.changeValue.toData())}doFromData(t){super.doFromData(t),this.changeValue.fromData(CDataClass.getData(t,"changeValue"))}}class CAnimatorPointsProperty extends CProperty{constructor(t,e,i,a,s,o){super(t,e),this.changeValue=new CPointsAnimationValue(i,a,s,o)}doToData(t){super.doToData(t),CDataClass.putData(t,"changeValue",this.changeValue)}doFromData(t){super.doFromData(t),this.changeValue.fromData(CDataClass.getData(t,"changeValue"))}}class CAnimator extends CGraphAnimation{constructor(t,e=[],i,a,s,o){super(e,i,a,s,o),this._beforeProperties=new Array,this._graphProperties=new Array,this._pointsProperties=new Array,this._afterProperties=new Array,this.beforeScript="//parameter : animator, params",this.animationScript="//parameter : animator, params, graphName, graphValue",this.afterScript="//parameter : animator, params",this._parent=t}get parent(){return this._parent}set parent(t){this._parent=t;for(let e=0;e<this._graphProperties.length;e++)this._graphProperties[e].obj=t;for(let e=0;e<this._pointsProperties.length;e++)this._pointsProperties[e].obj=t}get beforeProperties(){return this._beforeProperties}set beforeProperties(t){this._beforeProperties=t}get graphProperties(){return this._graphProperties}get pointsProperties(){return this._pointsProperties}get afterProperties(){return this._afterProperties}set afterProperties(t){this._afterProperties=t}doToData(t){super.doToData(t);let e=new Array;for(let t=0;t<this._graphProperties.length;t++)e.push(this._graphProperties[t].toData());let i=new Array;for(let t=0;t<this._pointsProperties.length;t++)i.push(this._pointsProperties[t].toData());CDataClass.putData(t,"className",this.className),CDataClass.putData(t,"beforeProperties",this.beforeProperties,[],!0),CDataClass.putData(t,"graphProperties",e,[],!0),CDataClass.putData(t,"pointsProperties",i,[],!0),CDataClass.putData(t,"afterProperties",this.afterProperties,[],!0),CDataClass.putData(t,"beforeScript",this.beforeScript,"//parameter : animator, params"),CDataClass.putData(t,"animationScript",this.animationScript,"//parameter : animator, params, graphName, graphValue"),CDataClass.putData(t,"afterScript",this.afterScript,"//parameter : animator, params")}doFromData(t){super.doFromData(t),this.beforeProperties=CDataClass.getData(t,"beforeProperties",[],!0),this._graphProperties=[];let e=CDataClass.getData(t,"graphProperties",[],!0);for(let t=0;t<e.length;t++){let i=new CAnimatorGraphProperty(this._parent,"","",0,0);i.fromData(e[t]),this._graphProperties.push(i)}this._pointsProperties=[],e=CDataClass.getData(t,"pointsProperties",[],!0);for(let t=0;t<e.length;t++){let i=new CAnimatorPointsProperty(this._parent,"","",new CRect);i.fromData(e[t]),this._pointsProperties.push(i)}this.afterProperties=CDataClass.getData(t,"afterProperties",[],!0),this.beforeScript=CDataClass.getData(t,"beforeScript","//parameter : animator, params"),this.animationScript=CDataClass.getData(t,"animationScript","//parameter : animator, params, graphName, graphValue"),this.afterScript=CDataClass.getData(t,"afterScript","//parameter : animator, params")}doRemove(){this.parent=void 0,this._beforeProperties=[],this._afterProperties=[],this._pointsProperties=[],this._graphProperties=[],this.__obj={},super.doRemove()}doBeforeAnimation(){super.doBeforeAnimation();for(let t=0;t<this._beforeProperties.length;t++)this._beforeProperties[t].property=this._beforeProperties[t].value;if("//parameter : animator, params"!=this.animationScript){this.__obj={},new Function("animator","params",this.beforeScript)(this,this.__obj)}}doAfterAnimation(){super.doAfterAnimation();for(let t=0;t<this._afterProperties.length;t++)this._afterProperties[t].property=this._afterProperties[t].value;if("//parameter : animator, params"!=this.animationScript){new Function("animator","params",this.afterScript)(this,this.__obj)}this.__obj={}}doGraphAnimate(t,e,i,a,s){super.doGraphAnimate(t,e,i,a,s);for(let t=0;t<this._graphProperties.length;t++){let e=this._graphProperties[t].changeValue;if(e.name==a){let i=e.getValue(s);null!=i&&(this._graphProperties[t].property=i instanceof CColorInfo?i.toColor():i)}}if("//parameter : animator, params, graphName, graphValue"!=this.animationScript){new Function("animator","params","graphName","graphValue",this.animationScript)(this,this.__obj,a,s)}}doPointsAnimate(t,e,i,a,s){super.doPointsAnimate(t,e,i,a,s);for(let t=0;t<this._pointsProperties.length;t++){let e=this._pointsProperties[t].changeValue;if(e.name==a){if(this._pointsProperties[t].property instanceof CRect){let i=e.getPointValue(s,EPointsValueKind.RECT);null!=i&&(this._pointsProperties[t].property=i)}if(this._pointsProperties[t].property instanceof CPoint){let i=e.getPointValue(s,EPointsValueKind.POINT);null!=i&&(this._pointsProperties[t].property=i)}if(this._pointsProperties[t].property instanceof CNotifyRect){let i=e.getPointValue(s,EPointsValueKind.NOTIFYRECT);null!=i&&(this._pointsProperties[t].property=i)}}}}addBeforeSetProperty(t,e){let i=new CAnimatorSetProperty(this._parent,t,e);this._beforeProperties.push(i)}addAnimationGraphProperty(t,e,i,a){let s=new CAnimatorGraphProperty(this._parent,t,e,i,a);this._graphProperties.push(s)}addAnimationPointsProperty(t,e,i,a,s){let o=new CAnimatorPointsProperty(this._parent,t,e,i,a,s);this._pointsProperties.push(o)}addAfterSetProperty(t,e){let i=new CAnimatorSetProperty(this._parent,t,e);this._afterProperties.push(i)}static fromAnimatorData(t,e,i){let a=CDataClass.getData(t,i,void 0);null!=a&&(null==e[i]&&(null==a.className||"CAnimator"==a.className?e[i]=new CAnimator(e):"CResourceAnimator"==a.className?e[i]=new CResourceAnimator(e):"CCopyCanvasAnimator"==a.className&&(e[i]=new CCopyCanvasAnimator(e))),e[i].fromData(a))}static animatorFromResource(t,e){let i=CSystem.resources.get(e);if(null!=i&&null!=i.className){let a=new Function("return new "+i.className+"()")();return a.resource=e,a.parent=t,a}}}class CResourceAnimator extends CAnimator{constructor(t,e,i,a,s,o,r){super(void 0,i,a,s,o,r),this.controlResource=t,this.parentControlName=e}doToData(t){super.doToData(t),CDataClass.putData(t,"controlResource",this.controlResource,""),CDataClass.putData(t,"parentControlName",this.parentControlName,void 0)}doFromData(t){super.doFromData(t),this.controlResource=CDataClass.getData(t,"controlResource",""),this.parentControlName=CDataClass.getData(t,"parentControlName",void 0)}doAfterAnimation(){super.doAfterAnimation(),this.parent.remove(),this.parent=void 0}start(){let t=CControl.controlFromResource(this.controlResource);if(t.hasPointerEvent=!1,null==this.parentControlName)t.parent=document.body;else{let e=CControl.getControl(this.parentControlName);e.length>0&&(t.parent=e[0])}t.position.left=0,t.position.top=0,t.position.width=t.parent.position.width,t.position.height=t.parent.position.height;let e=new CAnimator(void 0);e.fromData(this.toData()),e.parent=t,e.onAfterAnimation=function(){t.remove(),e.remove()},e.start()}}class CCopyCanvasAnimator extends CAnimator{start(){let t=new CCanvasLayerControl(this.parent);t.hasPointerEvent=!1,t.layers.fromData(this.parent.layers.toData()),t.position.left=0,t.position.top=0,t.position.width=this.parent.position.width,t.position.height=this.parent.position.height;let e=new CAnimator(void 0);e.fromData(this.toData()),e.parent=t;let i=this;e.onAfterAnimation=function(){t.remove(),e.remove(),null!=i.onAfterAnimation&&i.onAfterAnimation(i)},e.start()}}