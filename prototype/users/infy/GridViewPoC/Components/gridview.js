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

var spreadAdjsutArr = [];
spreadAdjsutArr['content1'] = "130|220";
spreadAdjsutArr['content2'] = "330|220";
spreadAdjsutArr['content3'] = "550|220";
spreadAdjsutArr['content4'] = "130|210";
spreadAdjsutArr['content5'] = "330|210";
spreadAdjsutArr['content6'] = "550|210";

var gridAdjsutArr = [];
gridAdjsutArr['content1'] = "-280|-28";
gridAdjsutArr['content2'] = "-45|-28";	
gridAdjsutArr['content3'] = "170|-28";
gridAdjsutArr['content4'] = "-280|308";	
gridAdjsutArr['content5'] = "-45|308";	
gridAdjsutArr['content6'] = "170|308";	

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
		var eImage = item.image;
		var eDuration = item.duration;
		var eId = item.eid;
		var eTitle = item.etitle;
		var eDescription = item.edescription;
  $(divCategory).append('\
	<a href="#" class="single_card">\
	<div class="series_title medium_text">\
	  '+eTitle+'\
	</div>\
	<img src="'+eImage+'" class="stack_image" alt="'+eTitle+'">\
	<div class="stack_content">\
	  <div class="stack_description_wrapper">\
		<div class="stack_info_wrapper">\
		  <div class="stack_time semi_large_text">\
			'+eDuration+'\
		  </div>\
		  <div class="stack_title din_alternate_bold semi_large_text">\
			'+eTitle+'\
		  </div>\
		</div>\
		<div class="stack_description semi_large_text_reg">\
		  '+((eId !== "") ? eId+' <span class="stack_separate">|</span> ' : '')+eDescription+'\
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
	 var reduceScale = 0.07,scale,position = 'absolute';
	 $.each(images, function(key, value ) {
		 scale =  (initalScale - reduceScale);
		 if(index==imageCount) {position='relative';}
		 if(index>4){opacity=0; }
		 var duration = 0.0;
		 var propertiesObj = {
			  padding:0,x:left,y:top,opacity:opacity,zIndex:zindex,maxWidth:'100%', position: position,
			  transformOrigin:"50% -50%",scaleX : scale+0.2,scaleY :scale,margin: '10px auto',force3D:true
		 }
		 TweenMax.to(value, duration, propertiesObj);
		 zindex--; index++;
		 reduceScale = reduceScale+0.05;
   });
  
   
 }

function controlCategoryTabStyle(id)
{ 
   for(var i=1; i<=6; i++){
    TweenMax.staggerTo('#subCat'+i,'1.0',{border:"0px",color:'rgb(200, 205, 210)'});
    if(i==id){
		TweenMax.staggerTo('#subCat'+i,'1.0',{ borderBottom:"3px solid #000000", padding:'2px', color:'rgb(14, 16, 19)'});
	}
  }
}
function controlNextPrevious(currentStack)
{
   TweenMax.staggerTo('#rightNext','2',{visibility:hide,opacity:0});
   TweenMax.staggerTo('#leftPrevious','2',{visibility:hide,opacity:0}); 
  if(currentStack<6){//enable next
	TweenMax.staggerTo('#rightNext','2',{visibility:show,opacity:1});}
  if(currentStack>1){ //enable previous
    TweenMax.staggerTo('#leftPrevious','2',{visibility:show,opacity:1});}
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
		   TweenMax.staggerTo('#set'+i,2.0,{ opacity:0.0, ease:SlowMo.easeInOut},1.0, function(){
			  TweenMax.staggerTo('#set'+i,1.0,{visibility:hide});
		   });
		   if(i==next){
			   if(navigationType=='stack'){ 
					var title = $('#title'+i).text();
					$('#mainTitle').text(title);
			   }
			   if(navigationType=='card'){ 
				 controlCategoryTabStyle(i);
			   }
			   controlNextPrevious(current);
			   TweenMax.staggerTo('#set'+i,2.0,{ opacity:1.0, ease:SlowMo.easeInOut},1.0, function(){
				  TweenMax.staggerTo('#set'+i,1.0,{visibility:show});
			   });
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
			TweenMax.staggerTo('#set'+k,2.0,{ opacity:0.0, ease:SlowMo.easeInOut},1.0, function(){
				TweenMax.staggerTo('#set'+k,1.0,{visibility:hide});
			});
			if(k==previous){
				if(navigationType=='stack'){   
					var title = $('#title'+k).text();
					$('#mainTitle').text(title);
				}
				if(navigationType=='card'){
				   controlCategoryTabStyle(k);
				}
				controlNextPrevious(current);
				TweenMax.staggerTo('#set'+k,1.0,{ opacity:1.0, ease:SlowMo.easeInOut},1.0, function(){
					TweenMax.staggerTo('#set'+k,0.5,{visibility:show});
				});
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
   if(top<0){ position['top']= parseInt(top-175);}
   return position;
}

function showHideElements(stackDiv,setDiv,titleDiv,state,duration)
{
   var opacity = (state=='hidden')? 0 : 1;
   TweenMax.staggerTo("div[id^='set']:not(#"+setDiv+")",duration,{ opacity:opacity , ease:SlowMo.easeInOut},duration, function(){
      TweenMax.staggerTo('{self}',duration,{visibility:state});
   });
   TweenMax.staggerTo(".title",duration,{ opacity:opacity, ease:SlowMo.easeInOut},duration, function(){
	  TweenMax.staggerTo('{self}',duration,{visibility:state});
   });
   TweenMax.to("#"+stackDiv+".title",duration,{opacity:opacity, ease:SlowMo.easeInOut},duration, function(){
	 TweenMax.staggerTo('{self}',duration,{visibility:state});
   });
 }
function hideAllOtherStacks(stackDiv,setDiv,titleDiv){
    TweenMax.staggerTo("div[id^='set']:not(#"+setDiv+")",1.0,{ opacity:0 , ease:SlowMo.easeInOut},0.2, function(){
		TweenMax.staggerTo('{self}',0.5,{visibility:hide});
	});
	TweenMax.staggerTo(".title",1.0,{ opacity:0, ease:SlowMo.easeInOut},0.2, function(){
	  TweenMax.staggerTo('{self}',0.5,{visibility:hide});
	});
	TweenMax.staggerTo("#"+stackDiv+".title",1.0,{opacity:0, ease:SlowMo.easeInOut},0.2, function(){
	 TweenMax.staggerTo('{self}',0.5,{visibility:hide});
   });
 }
function showSingleStack(stackDiv,setDiv,titleDiv)
{
   	currentSingleStack = stackDiv.charAt(stackDiv.length-1);	
	hideAllOtherStacks(stackDiv,setDiv,titleDiv);
    setTimeout(function(){
	   animateSingleStack(stackDiv,setDiv,titleDiv,true,1.0);
	}, 200);
}
function animateSingleStack(stackDiv,setDiv,titleDiv, hideOthers,duration)
{
    var pos = getWindowCenterCoOrds(setDiv);
	var left = pos['left'];
	var top  = pos['top'];
	var initScale = 1.30;
	var initOffset = 100;
	var setPerspective = 0;
	var images = $('#' + stackDiv + ' a.single_card');
	var stackCardCount = images.length;
	var index=stackCardCount;
	var delay = 0.5;
	var title = $('#'+titleDiv).text();
	
	$.each(images, function(key, value ) {
	   	TweenMax.to(value, duration, {
			opacity: 1.0,
			scaleX: initScale,
			scaleY: initScale,
			y: (initOffset),
			force3D: true,
			transformOrigin:'50% 100%',
			delay: delay,
			x:left,
			left:left,
			top:top,
			force3D:true,
			onComplete:function(){ 
			     if(key==stackCardCount-1){
				    if(currentSingleStack==stackDiv.charAt(stackDiv.length-1)){
						$('#mainTitle').text(title);
						controlNextPrevious(stackDiv.charAt(stackDiv.length-1));
					}
				  	$('#'+stackDiv).removeAttr("onClick");
					$('#'+stackDiv).unbind("click").bind("click", function() {
					  spreadSingleStackImages(stackDiv,setDiv,titleDiv, true,1.0);
					});
					if(hideOthers==true){
					  animateOtherSingleStacks(stackDiv,setDiv,titleDiv);
					}
					TweenMax.staggerTo('#genralTitle','0.2',{visibility:show,opacity:1});
					TweenMax.staggerTo('#subCategories','0.2',{visibility:hide,opacity:0});
					TweenMax.staggerTo('#watchBtn','0.2',{visibility:hide,opacity:0});
				 }
		   }
		});

		delay += 0.2;
		initOffset -= (50 - setPerspective)
		setPerspective += 0;
		initScale = parseFloat((initScale-0.07).toFixed(2));
		index--;	   
	
	});
}

function animateOtherSingleStacks(stackDiv,setDiv,titleDiv)
{
	var otherStackObjs = $("div[id^='content']:not(#"+stackDiv+")");
	$.each(otherStackObjs, function( index, value ) {
		 var idStr = value.getAttribute("id");
		 var idNum = idStr.charAt(idStr.length-1);
		 animateSingleStack('content'+idNum,'set'+idNum,'title'+idNum,false,0);
	});
	
	currentStage = availableStages[1]; //singleStack
	//alert('currentStage :::' + currentStage);
	
}
function spreadOtherStackImages(stackDiv,setDiv,titleDiv){
    var otherStackObjs = $("div[id^='content']:not(#"+stackDiv+")");
	$.each(otherStackObjs, function( index, value ) {
		 var idStr = value.getAttribute("id");
		 var idNum = idStr.charAt(idStr.length-1);
		 spreadSingleStackImages('content'+idNum,'set'+idNum,'title'+idNum,false,0.0);
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
	var adjustLeftTop = spreadAdjsutArr[stackDiv].split('|');
	var delay = 0.01;
	$.each(images, function(key, value ) {
	   TweenMax.to(value, duration, {
			x:(left-adjustLeftTop[0] )+'px',
			y:(top-adjustLeftTop[1] )+'px',
			scaleY:0.8,
			scaleX:0.9,
			position: 'absolute',
			delay:delay,
			ease:SlowMo.easeOut,
			immediateRender:false,
			force3D:true,
			marginTop:'30px',
			marginLeft:"-100px",
			onComplete:function(){
			     if(key==card_count-1)
				 { 
				    if(currentSingleStack==stackDiv.charAt(stackDiv.length-1)){
						controlCategoryTabStyle(stackDiv.charAt(stackDiv.length-1));
					}
					$('#'+stackDiv).removeAttr("onClick");
					$('#'+stackDiv).unbind("click").bind("click",function() {
					   	backToSingleStack(stackDiv,setDiv,titleDiv,true,1.0);
					});
					if(hideOthers==true){
					  spreadOtherStackImages(stackDiv,setDiv,titleDiv);
					}
					TweenMax.staggerTo('#genralTitle',2,{visibility:hide,opacity:0});
					TweenMax.staggerTo('#subCategories',2,{visibility:show,opacity:1});
					TweenMax.staggerTo('#leftNext',2,{visibility:show,opacity:1});
				}
			}
		});
		delay = delay + 0.01;
		left = left + left_step;
		if(left+card_width + card_spacing > card_container_width){
		   left = 0;
		   top += (card_height-60);
		}
   });
}

function showSpreadImages(Id){
    currentSingleStack = Id;
    TweenMax.staggerTo("div[id^='set']:not(#set"+Id+")",1.0,{ opacity:0 , ease:SlowMo.easeInOut},0.1, function(){
		TweenMax.staggerTo('{self}',0.5,{visibility:hide});
	});
	controlCategoryTabStyle(Id);
	controlNextPrevious(Id);
	TweenMax.staggerTo('#set'+Id,1.0,{ opacity:1.0, ease:SlowMo.easeInOut},0.1, function(){
	  TweenMax.staggerTo('#set'+Id,0.5,{visibility:show});
	});
}

function backToSingleStack(stackDiv,setDiv,titleDiv, hideOthers,duration)
{
    navigationType='stack';
	var pos = getWindowCenterCoOrds(setDiv);
	var left = pos['left']+60; //Adjusting into middle
	var top  = pos['top'];
	var initScale = 1.30;
	var initOffset = 100;
	var setPerspective = 0;
	var images = $('#' + stackDiv + ' a.single_card');
	var stackCardCount = images.length;
	var index=stackCardCount;
	var delay = 0.01;
	var title = $('#'+titleDiv).text();
	$.each(images, function(key, value ) {
	    TweenMax.to(value, duration, {
			opacity: 1.0,
			scaleX: initScale,
			scaleY: initScale,
			y: (initOffset),
			force3D: true,
			transformOrigin:'50% 100%',
			delay: delay,
			x:left,
			left:left,
			top:top,
			force3D:true,
			onComplete:function(){ 
			     if(key==stackCardCount-1){
				    if(currentSingleStack==stackDiv.charAt(stackDiv.length-1)){
						$('#mainTitle').text(title);
						controlNextPrevious(stackDiv.charAt(stackDiv.length-1));
					}
				    $('#'+stackDiv).removeAttr("onClick");
					$('#'+stackDiv).unbind("click").bind("click", function() {
					   backTogridStack(stackDiv,setDiv,titleDiv, true, 2.0);
					});
					if(hideOthers==true){
					  backToOtherSingleStack(stackDiv,setDiv,titleDiv);
					}
					TweenMax.staggerTo('#genralTitle','5',{visibility:show,opacity:1});
					TweenMax.staggerTo(['#subCategories', '#watchBtn'],'5',{visibility:hide,opacity:0});
			  }
		   }
		});

		delay += 0.01;
		initOffset -= (50 - setPerspective)
		setPerspective += 0;
		initScale = parseFloat((initScale-0.07).toFixed(2));
		index--;
	
	});
	
	
	
}

function backToOtherSingleStack(stackDiv,setDiv,titleDiv)
{
    hideAllOtherStacks(stackDiv,setDiv,titleDiv);
    var otherStackObjs = $("div[id^='content']:not(#"+stackDiv+")");
	$.each(otherStackObjs, function( index, value ) {
		 var idStr = value.getAttribute("id");
		 var idNum = idStr.charAt(idStr.length-1);
		 backToSingleStack('content'+idNum,'set'+idNum,'title'+idNum, false, 0.0);
		
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
	 var delay = 1;
	 $.each(images, function(key, value ) {
	     scale =  (initalScale - reduceScale);
		 if(index==imageCount) {position='relative';}
		 if(index>=4){opacity=0; }
		 var leftTop = gridAdjsutArr[stackDiv].split('|');
		 TweenMax.to(value, duration, {padding:0,
			  x:leftTop[0]+"px", 
			  y:leftTop[1]+"px", 
			  opacity:opacity, 
			  zIndex:zindex, 
			  maxWidth:'100%', 
			  transformOrigin:"50% -50%",
			  scaleX : scale+0.2,
			  scaleY :scale,
			  margin: '0px auto',
			  position: position,
			  delay: delay,
			  yoyo:true,
			  force3D:true,
			  immediateRender:false,
			  onComplete:function(){
				   if(index==(imageCount)){
					$('#'+stackDiv).removeAttr("onClick");
					$('#'+stackDiv).unbind('click').one('click',function() {
						showSingleStack(stackDiv,setDiv,titleDiv);
					});
					setTimeout(function(){
						   TweenMax.staggerTo("#"+setDiv,1.0,{ opacity:1.0 , ease:SlowMo.easeInOut},1.0, function(){
							  TweenMax.staggerTo("#"+setDiv,0.5,{visibility:show});
						   });
							TweenMax.to("#"+titleDiv,1.0,{opacity:1.0, ease:SlowMo.easeInOut},1.0, function(){
							TweenMax.staggerTo("#"+titleDiv,0.5,{visibility:show});
						   });
						
					}, 2000);
				 }
			  }
		  });
		 delay -= 0.2;
		 zindex--; 
		 index++; 
		 reduceScale = reduceScale+0.05;	
		 
      });
	 
	 if(hideOthers==true){
		backOthersTogridStack(stackDiv,setDiv,titleDiv, false, 0.0);
	 }
	 
	 TweenMax.staggerTo('#genralTitle','5',{visibility:hide, opacity:0});
	 TweenMax.staggerTo('#subCategories','5',{visibility:hide,opacity:0});
	 TweenMax.staggerTo('#leftPrevious','5',{visibility:hide,opacity:0});
	 TweenMax.staggerTo('#rightNext','5',{visibility:hide,opacity:0});
	 TweenMax.staggerTo('#watchBtn','5',{visibility:show,opacity:1});
	
	
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