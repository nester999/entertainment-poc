var card_container_width = $('#mainStackGrid').width();
var card_spacing = 2;
var show = 'visible';
var hide = 'hidden';
var currentSingleStack;
var navigationType='stack';
var availableStages = ['stackGrid','singleStack','imageGrid'];
var swipeAllowedStages = ['singleStack','imageGrid'];
var currentStage = "";
var selectAll = function(e) { return document.querySelectorAll(e); }

var generalTitleSelector = $('#genralTitle');
var subCatSelector=	$('#subCategories');
var rightNextselector = $('#rightNext');
var leftPrevSelector = $('#leftPrevious');
var watchBtnSelector = $('#watchBtn');

var gridAdjsutArr = [];
gridAdjsutArr['content1'] = "0|0";
gridAdjsutArr['content2'] = "0|0";	
gridAdjsutArr['content3'] = "0|0";
gridAdjsutArr['content4'] = "0|0";	
gridAdjsutArr['content5'] = "0|0";
gridAdjsutArr['content6'] = "0|0";	

function loadJsonData(){
$.getJSON('./json/content.json',function(data){	
	setItemsInStack(data.awardNominees,"awardNominees");
	setItemsInStack(data.movies,"movies");
	setItemsInStack(data.clips,"clips");
	setItemsInStack(data.series,"series");
	setItemsInStack(data.music,"music");
	setItemsInStack(data.shows,"shows");
	displayGridstack();
});
}

function setItemsInStack(category,catName){
var divCategory = $("#"+catName);
$.each(category, function(i,item) {
$(divCategory).append('\
<a href="#" class="single_card">\
<div class="series_title medium_text">\
'+item.etitle+'\
</div>\
<img src="'+item.image+'" class="stack_image" alt="'+item.etitle+'">\
<div class="stack_content">\
<div class="stack_description_wrapper">\
<div class="stack_info_wrapper">\
<div class="stack_time semi_large_text">\
'+ item.duration+'\
</div>\
<div class="stack_title din_alternate_bold semi_large_text">\
'+item.etitle+'\
</div>\
</div>\
<div class="stack_description semi_large_text_reg">\
'+((item.eid !== "") ? item.eid+' <span class="stack_separate">|</span> ' : '')+item.edescription+'\
</div>\
</div>\
</div>\
</a>');
});
}
function displayGridstack(){
	var imageDIVCount = selectAll('div[id^="content"]').length;
	for(var iteration=1; iteration <= imageDIVCount; iteration++){
	   var selector = '#content'+iteration+ ' a.single_card';
	   createImageStack(selector);
	}
	currentStage = availableStages[0]; //singleStack
	//alert('currentStage :::' + currentStage);
}
function createImageStack(selector){
     var images = selectAll(selector);
	 var imageCount = images.length;
	 var initalScale=0.7,zindex = imageCount,top = 0,left=0;index=1;opacity =1.0;
	 var reduceScale = 0.07,scale,position = 'absolute',shadow = '0px -20px 0px #000000';
	 $.each(images, function(key, value ) {
	     scale =  (initalScale - reduceScale);
		 if(index==imageCount){position='relative';}
		 if(index>4){opacity=0;}
		 var duration = 0; //1000
		 var animationObj = {
			  padding:0, x :left,y :top, opacity:opacity,maxWidth:'100%', position: position,
			  scaleX : scale+0.2, scaleY :scale, margin: '20px auto 0px 0px'
		 }
	     $.Velocity(value, animationObj, {duration: duration, begin:function(){ $(this).css('cssText', 'z-index: '+zindex+'; transform-origin:50% -50%')}, complete:function(){}});
		 zindex--; 
		 index++;
		 reduceScale = reduceScale+0.05;
	});
 }	

function controlCategoryTabStyle(id)
{ 
   for(var i=1; i<=6; i++){
   var subCatSelector = $('#subCat'+i);
   $.Velocity(subCatSelector, {border:'0px'}, {duration: 100, complete:function(){
      $(this).css('cssText', 'color:rgb(200, 205, 210);');
	}});
    if(i==id)
	{
		$.Velocity(subCatSelector, { borderBottom:'3px solid #000000;'}, {duration: 500, complete:function(){
			$(this).css('cssText', 'border-bottom:3px solid #000000;  color:rgb(14, 16, 19);');
		}});
	}
  }
}
function controlNextPrevious(currentStack)
{
   var rightNextselector = $('#rightNext');
   var leftPrevSelector = $('#leftPrevious');
   $.Velocity(rightNextselector, {opacity:0}, {visibility:hide, duration: 500});
   $.Velocity(leftPrevSelector, {opacity:0}, {visibility:hide, duration: 500});
   if(currentStack<6){//enable next
	 $.Velocity(rightNextselector, {opacity:1}, {visibility:show, duration: 500});
	}
   if(currentStack>1){ //enable previous
    $.Velocity(leftPrevSelector, {opacity:1}, {visibility:show, duration: 500});
	}
}
function showNext()
{
    var current = currentSingleStack;
	var next    = ++current;
	if(next>6){
	    return false;
	}
	else
	{
		for(var i=1; i<=6; i++){
		 	$.Velocity($('#set'+i), { opacity:0.0}, {visibility:hide,  easing:'easeInSine', duration: 500});
		    if(i==next){
			console.log("navigationType::"+navigationType);
			   if(navigationType=='stack'){ 
					var title = $('#title'+i).text();
					console.log(title);
					$('#mainTitle').text(title);
			   }
			   if(navigationType=='card'){ 
				 controlCategoryTabStyle(i);
			   }
			   controlNextPrevious(current);
			   $.Velocity($('#set'+i), { opacity:1.0}, {visibility:show,  easing:'easeInSine', duration: 500});
			}
			currentSingleStack = next;
		}
		next++;
	}
}

function showPrevious()
{
	var current = currentSingleStack;
	var previous = --current;
	if(previous<1){
	  return false;
	}
	else
	{
		for(var k=6; k>=1; k--){
			var setSelector = $('#set'+k);
			$.Velocity(setSelector, { opacity:0.0}, {visibility:hide, easing:'easeInSine', duration: 500});
			if(k==previous){
				if(navigationType=='stack'){   
					var title = $('#title'+k).text();
					$('#mainTitle').text(title);
				}
				if(navigationType=='card'){
				   controlCategoryTabStyle(k);
				}
				controlNextPrevious(current);
				$.Velocity(setSelector, { opacity:1.0}, {visibility:show,  easing:'easeInSine', duration: 500});
				currentSingleStack = previous;
			}
		}
	}
}

function getWindowCenterCoOrds(elementId){
   var position =[];
   var elementCurrentPos=[];
   var centerPointY= ($(window).height()-$('#'+elementId).innerHeight())/2;
   var centerPointX = ($(window).width()-$('#'+elementId).innerWidth())/2;
   elementCurrentPos = $('#'+elementId).position();
   var left = (centerPointX-elementCurrentPos.left)/2;
   position['left'] = left;
   var top  = (centerPointY-elementCurrentPos.top)/2;
   position['top']= top;
   if(top<0){ position['top']= parseInt(top-100);}
   return position;
}

function showHideElements(stackDiv,setDiv,titleDiv,state,duration)
{
   var opacity = (state=='hidden')? 0 : 1;
   var setSelector = $("div[id^='set']:not(#"+setDiv+")");
   var titleSelector = $(".title");
   var stackDivTitle = $("#"+stackDiv+".title");   
   $.Velocity(setSelector,{ opacity:opacity}, {visibility:state, duration:duration});
   $.Velocity(titleSelector,{ opacity:opacity}, {visibility:state, duration:duration});
   $.Velocity(stackDivTitle,{ opacity:opacity}, {visibility:state, duration:duration});
 }
function hideAllOtherStacks(stackDiv,setDiv,titleDiv){
     var setSelector = $("div[id^='set']:not(#"+setDiv+")"); 
	 var titleSelector = $(".title");
	 var stackDivTitle = $("#"+stackDiv+".title");
	 $.Velocity(setSelector,{ opacity:0}, {visibility:hide, duration:500});
	 $.Velocity(titleSelector,{ opacity:0}, {visibility:hide, duration:500});
	 $.Velocity(stackDivTitle,{ opacity:0}, {visibility:hide, duration:500});
	
 }
function showSingleStack(stackDiv,setDiv,titleDiv)
{
   	currentSingleStack = stackDiv.charAt(stackDiv.length-1);
    hideAllOtherStacks(stackDiv,setDiv,titleDiv);	
	setTimeout(function(){
	   animateSingleStack(stackDiv,setDiv,titleDiv,true,1000);
	}, 100);
}



function animateSingleStack(stackDiv,setDiv,titleDiv, hideOthers,duration)
{
    //var pos = getWindowCenterCoOrds(setDiv);
	//console.log(pos['left'] + "||"+  pos['top']);
	var spreadAdjsutArr = [];
	spreadAdjsutArr['content1'] = "450|-100";
	spreadAdjsutArr['content2'] = "0|-100";
	spreadAdjsutArr['content3'] = "-450|-100";
	spreadAdjsutArr['content4'] = "450|-410";
	spreadAdjsutArr['content5'] = "0|-410";
	spreadAdjsutArr['content6'] = "-450|-410";
	var adjustLeftTop = spreadAdjsutArr[stackDiv].split('|');
	var left = adjustLeftTop[0];
	var top  = adjustLeftTop[1];
	var initScale = 1.30;
	var initOffset = 100;
	var setPerspective = 0;
	var index=1;
	var images = $('#' + stackDiv + ' a.single_card');
	var stackCardCount = images.length;
	var zindex=stackCardCount;
	var delay=500;
	var title = $('#'+titleDiv).text();
	
	$.each(images, function(key, value ) {
		 if(index==stackCardCount){position='relative';}
	  	 var animationObj = {opacity: 1.0,scaleX: initScale,scaleY: initScale,y:initOffset, x:left, left:left,top:top};
		 $.Velocity(value, animationObj, {duration: duration, easing:'easeInSine', delay:delay,
		 begin:function(){ $(this).css({'z-index': zindex,'transform-origin':'50% -100%'}); zindex-=1;}, 
		 complete:function(){
		           if(index==stackCardCount){
				      if(currentSingleStack==stackDiv.charAt(stackDiv.length-1)){
						$('#mainTitle').text(title);
						controlNextPrevious(stackDiv.charAt(stackDiv.length-1));
					  }
					  $('#'+stackDiv).removeAttr("onClick");
					  $('#'+stackDiv).unbind("click").bind("click", function() {
						  //alert('binding spreadSingleStackImages');
						 spreadSingleStackImages(stackDiv,setDiv,titleDiv, true,1000);
				      });
					   					    
						$.Velocity(subCatSelector,{opacity:0},{visibility:hide, duration:100});
						$.Velocity(watchBtnSelector,{opacity:0},{visibility:hide, duration:100});
						$.Velocity(generalTitleSelector,{opacity:1},{ visibility: show,  duration:100});
				 }
				index++; zindex-=1; 
		   }
	 });
	 delay += 300;
	 initOffset -= (50 - setPerspective)
	 setPerspective += 0;
	 initScale = parseFloat((initScale-0.07).toFixed(2));
 });
 
 if(hideOthers==true){
  animateOtherSingleStacks(stackDiv,setDiv,titleDiv);
 }
 
}
function animateOtherSingleStacks(stackDiv,setDiv,titleDiv)
{
	var otherStackObjs = $("div[id^='content']:not(#"+stackDiv+")");
	$.each(otherStackObjs, function( index, value ) {
		 var idStr = value.getAttribute("id");
		 var idNum = idStr.charAt(idStr.length-1);
		 animateSingleStack('content'+idNum,'set'+idNum,'title'+idNum,false,0);
		// alert('content'+idNum+'set'+idNum+'title'+idNum);
	});
	
	currentStage = availableStages[1]; //singleStack
	//alert('currentStage :::' + currentStage);
	
}
function spreadOtherStackImages(stackDiv,setDiv,titleDiv){
    var otherStackObjs = $("div[id^='content']:not(#"+stackDiv+")");
	$.each(otherStackObjs, function( index, value ) {
		 var idStr = value.getAttribute("id");
		 var idNum = idStr.charAt(idStr.length-1);
		 spreadSingleStackImages('content'+idNum,'set'+idNum,'title'+idNum,false,0);
   });
   currentStage = availableStages[2]; //imageGrid
   //alert('currentStage :::' + currentStage);
}
function spreadSingleStackImages(stackDiv,setDiv,titleDiv,hideOthers,duration){
    navigationType='card';
	var left = 	0;
	var top = 0;
	var card_width = $('#' + stackDiv + ' a').width();
	var card_height = $('#' + stackDiv + ' a').height();
	var left_step =  card_width + card_spacing;
	var images = $('#' + stackDiv + ' a.single_card');
	var card_count = images.length;
	var spreadAdjsutArr = [];
	spreadAdjsutArr['content1'] = "0|20";
	spreadAdjsutArr['content2'] = "450|20";
	spreadAdjsutArr['content3'] = "900|20";
	spreadAdjsutArr['content4'] = "0|350";
	spreadAdjsutArr['content5'] = "450|350";
	spreadAdjsutArr['content6'] = "900|350";
	var delay = 500;
	
	$.each(images, function(key, value ) {
	   var adjustLeftTop = spreadAdjsutArr[stackDiv].split('|');
	   var animationObj = {scaleY:0.8, scaleX:0.9, position: 'absolute', left:(left-adjustLeftTop[0]), top:(top-adjustLeftTop[1])};
	   $.Velocity(value, animationObj, {duration: duration, easing:'easeInSine',
		 begin:function(){
		         left = left + left_step;
				 if(left+card_width + card_spacing > card_container_width){
				   left = 0;
				   top += card_height;
				 }
		 }, 
		 complete:function(){
		 
		          if(key==card_count-1)
				  { 
				    var contentId = stackDiv.charAt(stackDiv.length-1);
				    if(currentSingleStack==contentId){
						controlCategoryTabStyle(contentId);
					}
					$('#'+stackDiv).removeAttr("onClick");
					$('#'+stackDiv).unbind("click").bind("click",function() {
					   	backToSingleStack(stackDiv,setDiv,titleDiv,true,1000);
					});
					if(hideOthers==true){
					  spreadOtherStackImages(stackDiv,setDiv,titleDiv);
					}
										
					$.Velocity(generalTitleSelector,{opacity:0},{visibility:hide,duration:0});
					$.Velocity(subCatSelector,{opacity:1},{visibility:show, duration:0});
					$.Velocity(watchBtnSelector,{opacity:0},{visibility:hide, duration:0});
					
				}
				
				
			  }
	 });
	
	 delay += 500;
	
   });
   
}

function showSpreadImages(Id){
    currentSingleStack = Id;
    var selector = $("div[id^='set']:not(#set"+Id+")"); 
	$.Velocity(selector,{ opacity:0}, {visibility:hide, easing:'easeInSine', duration:500});
	controlCategoryTabStyle(Id);
	controlNextPrevious(Id);
	$.Velocity($('#set'+Id),{opacity:1.0}, {visibility:show, easing:'easeInSine', duration:500});
}

function backToSingleStack(stackDiv,setDiv,titleDiv, hideOthers,duration)
{  
    navigationType='stack';
    var spreadAdjsutArr = [];
	spreadAdjsutArr['content1'] = "450|-100";
	spreadAdjsutArr['content2'] = "0|-100";
	spreadAdjsutArr['content3'] = "-450|-100";
	spreadAdjsutArr['content4'] = "450|-410";
	spreadAdjsutArr['content5'] = "0|-410";
	spreadAdjsutArr['content6'] = "-450|-410";
	var adjustLeftTop = spreadAdjsutArr[stackDiv].split('|');
	var left = adjustLeftTop[0];
	var top  = adjustLeftTop[1];
	var initScale = 1.30;
	var initOffset = 100;
	var setPerspective = 0;
	var index=1;
	var images = $('#' + stackDiv + ' a.single_card');
	var stackCardCount = images.length;
	var zindex=stackCardCount
	 
	var delay = 500;
	var title = $('#'+titleDiv).text();
	
	//console.log(title);
	
	$.each(images, function(key, value ) {
		 if(index==stackCardCount){position='relative';}
	  	 var animationObj = {opacity: 1.0,scaleX: initScale,scaleY: initScale,y:initOffset, x:left, left:left,top:top};
		 $.Velocity(value, animationObj, {duration: duration, easing:'easeInSine', delay:delay,
		 begin:function(){ $(this).css({'z-index': zindex,'transform-origin':'50% -100%'}); zindex-=1;}, 
		 complete:function(){
		           if(index==stackCardCount){
				      if(currentSingleStack==stackDiv.charAt(stackDiv.length-1)){
						$('#mainTitle').text(title);
						controlNextPrevious(stackDiv.charAt(stackDiv.length-1));
					  }
					  $('#'+stackDiv).removeAttr("onClick");
					  $('#'+stackDiv).unbind("click").bind("click", function() {
						  //alert('binding spreadSingleStackImages');
						 backTogridStack(stackDiv,setDiv,titleDiv, true, 1000);
				      });
					   if(hideOthers==true){
						 backToOtherSingleStack(stackDiv,setDiv,titleDiv);
					   }
					   $.Velocity(generalTitleSelector,{opacity:1},{visibility:show, duration:0});
					   $.Velocity(subCatSelector,{opacity:0},{visibility:hide, duration:0});
					   $.Velocity(watchBtnSelector,{opacity:0},{visibility:hide, duration:0});
						
				 }
				index++; zindex-=1; 
		   }
	 });
	 delay += 200;
	initOffset -= (50 - setPerspective)
	setPerspective += 0;
	initScale = parseFloat((initScale-0.07).toFixed(2));
 });
}

function backToOtherSingleStack(stackDiv,setDiv,titleDiv)
{
    hideAllOtherStacks(stackDiv,setDiv,titleDiv);
    var otherStackObjs = $("div[id^='content']:not(#"+stackDiv+")");
	$.each(otherStackObjs, function( index, value ) {
		 var idStr = value.getAttribute("id");
		 var idNum = idStr.charAt(idStr.length-1);
		 backToSingleStack('content'+idNum,'set'+idNum,'title'+idNum, false, 0);
		
	});
	currentStage = availableStages[1]; //singleStack
	//alert('currentStage :::' + currentStage);
}

function backTogridStack(stackDiv,setDiv,titleDiv, hideOthers, duration)
{
     var images = selectAll('#'+stackDiv+' a.single_card');
	 var imageCount = images.length;
	 var initalScale=0.7,zindex = imageCount,top = 0,left=0;index=0;opacity =1.0;
	 var reduceScale = 0.07,scale,position = 'absolute';
	 var delay = 500;
	  $.each(images, function(key, value ) {
		 scale =  (initalScale - reduceScale);
		 if(index==imageCount) {position='relative';}
		 if(index>=4){opacity=0; }
		 var leftTop = gridAdjsutArr[stackDiv].split('|');
		 
	  	 var animationObj = {
			  padding:0, left :leftTop[0],top :leftTop[1], opacity:opacity,maxWidth:'100%', position: position,
			  scaleX : scale+0.2, scaleY :scale, margin: '20px auto'
		 }
		$.Velocity(value, animationObj, {duration: duration, delay:delay, easing:'easeInSine', 
		begin:function(){ $(this).css({'z-index': '+zindex+', 'transform-origin':'50% -50%'}); zindex--; },  
		complete:function(){
		           if(index==(imageCount)){
					$('#'+stackDiv).removeAttr("onClick");
					$('#'+stackDiv).unbind('click').one('click',function() {
						showSingleStack(stackDiv,setDiv,titleDiv);
					});
					setTimeout(function(){
						   $.Velocity($("#"+setDiv),{opacity:1.0},{visibility:show, duration:0});
						   $.Velocity($("#"+titleDiv),{opacity:1.0},{visibility:show, duration:0});
						   $.Velocity(generalTitleSelector,{opacity:0},{visibility:hide,duration:0});
						   $.Velocity(subCatSelector,{opacity:0},{visibility:hide, duration:0})
						   $.Velocity(leftPrevSelector,{opacity:0},{visibility:hide, duration:0});
						   $.Velocity(rightNextselector,{opacity:0},{visibility:hide, duration:0});
						   $.Velocity(watchBtnSelector,{opacity:1},{visibility:show, duration:0});
						
					}, 1000);
				 }
		   }
		   
	 });
	  
	  index++;
	  delay-=200;
	  reduceScale = reduceScale+0.05;
 });
 if(hideOthers==true){
	backOthersTogridStack(stackDiv,setDiv,titleDiv, false, 0);
 }
}

function backOthersTogridStack(stackDiv,setDiv,titleDiv, hideOthers,duration)
{
    var otherStackObjs = $("div[id^='content']:not(#"+stackDiv+")");
	$.each(otherStackObjs, function( index, value ) {
		 var idStr = value.getAttribute("id");
		 var idNum = idStr.charAt(idStr.length-1);
		 backTogridStack('content'+idNum,'set'+idNum,'title'+idNum, hideOthers,duration);
	});
   currentStage = availableStages[0]; //stackGrid
   //alert('currentStage :::' + currentStage);	
}



function goBackwardFlow(e,setId){

    currentSingleStack = setId;
	var stackDiv='content'+setId;
	var setDiv='set'+setId;
	var titleDiv='title'+setId;
	//alert(stackDiv+" ~"+setDiv+"~"+titleDiv);	
	//alert('currentStage :::'+ currentStage);
  if(currentStage=='imageGrid')
		backToSingleStack(stackDiv,setDiv,titleDiv, true, "1.0");
   if(currentStage=='singleStack')
		backTogridStack(stackDiv,setDiv,titleDiv, true, "1.0");
}

function goForwardFlow(e, setId){
	
	currentSingleStack = setId;
	
	var stackDiv='content'+setId;
	var setDiv='set'+setId;
	var titleDiv='title'+setId;
	
	//alert(stackDiv+" ~"+setDiv+"~"+titleDiv);	
   	
	//alert(currentStage);
	
   if(currentStage=='stackGrid'){
		showSingleStack(stackDiv,setDiv,titleDiv);
	}
   if(currentStage=='singleStack'){
		spreadSingleStackImages(stackDiv,setDiv,titleDiv,true,2.0);
   }
}

$(document).ready(function(){

	$(window).load(function(){
		loadJsonData();
	});
	document.ontouchstart = function(e) { 
		e.preventDefault(); 
	}
	var options = {
	  preventDefault: true
	};	
	var element = document.querySelector("body");
	var hammer = new Hammer(element,options);
	hammer.get('pinch').set({enable:true});
	hammer.on("swipeleft", function(ev){ 
		if(swipeAllowedStages.indexOf(currentStage)>-1){
			showNext();
		}else{
			return false;
		}
	});
	hammer.on("swiperight", function(ev){ 
		if(swipeAllowedStages.indexOf(currentStage)>-1){
			showPrevious();
		}else{
			return false;
		}
	});
	
	var pinchAction = "";
	hammer.on("pinchin", function(ev) {
		pinchAction = "pinchin";			
	});
	hammer.on("pinchout", function(ev) {
		pinchAction = "pinchout";			
	});
	
	hammer.on("pinchend", function(ev) {
		var ids = $(ev.target).closest("div[id^='set']"); // getting piched set id
		var clickedItemID = ids[0].id;
		var idNum = clickedItemID.charAt(clickedItemID.length-1);
		
		if(pinchAction!="" && pinchAction=='pinchin'){
		   goBackwardFlow(ev,idNum);
        }
        if(pinchAction && pinchAction=='pinchout'){
		   goForwardFlow(ev,idNum);
        }			
	});
	
	
	
	
	
    

});