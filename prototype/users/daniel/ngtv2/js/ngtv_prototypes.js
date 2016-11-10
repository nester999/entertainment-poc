/* SUB NAVIGATION FUNCTIONS */

// 3-15 - make changes to forward and store already loaded modules

function subNavHandler(el,action,limit,option,last){

	var newItems = [];

	// ACTION VARIABLE
	if(typeof el !== 'undefined' && el !== 0){
		var subAction = el.attr('action');	
	}else{
		var subAction = action;
	}

	// ACTION INTERPRETER
	if(typeof action !== 'undefined' && action == 'open'){
		processJson(subAction);
    }else if(typeof action !== 'undefined' && action == 'close'){
		unloadSubModule();
    }else{
    	processJson(subAction);
    }

	// PROCESS AND PARSE JSON - NOTE: write redundancy safeguard
	function processJson(subAction){

		// SET DEFAULT CANVAS
		$('#episode_inner_wrapper').show().empty();

		// JSON PARSER
		$.getJSON('../json/content.json',function(data){
			
			switch(subAction){
				case 'episode':
				  	var search = data.episode;
			    	break;
				case 'clip': 
				  	var search = data.clip;
				  	break;
				case 'similar':
			   		var search = data.similar;
				  	break;
				 case 'singlestack':
				 	var search = data.singlestack;
				 	break;
				default:  
					console.log('ERROR PARSING JSON');
			}
			
			// PARSE FEED
			$.each(search, function(i,item) {

				if(typeof last !== 'undefined' && i <= last){
					return true;
				}

				var eImage = item.image;
			    var eDuration = item.duration;
			    var eId = item.eid;
			    var eTitle = item.etitle;
			    var eDescription = item.edescription;

			    	if(subAction == 'singlestack'){
			    		$('#single_stack').append('\
				    		<a href="#" class="single_card active" index="'+i+'">\
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

			    		newItems.push($('#single_stack a:last-child'));
			    	
			    	}else{
				        $('#episode_inner_wrapper').append('\
					    	<a href="#" class="'+subAction+'_wrapper">\
					    		<div class="'+subAction+'_content">\
					    			<div class="'+subAction+'_image">\
					       				<img src="'+eImage+'" alt="'+eId+' '+eTitle+'">\
					       			</div>\
					       			<div class="'+subAction+'_description_wrapper">\
					       				<div class="'+subAction+'_info_wrapper">\
					       					'+((subAction !== "similar") ? '<div class="'+subAction+'_minutes">'+eDuration+'</div>' : '')+'\
					       					<div class="'+subAction+'_id">'+((subAction == "episode") ? '<span class="'+subAction+'_se din_bold">'+eId+'</span> | ' : '')+eTitle+'</div>\
					       				</div>\
				        				<div class="'+subAction+'_description">'+eDescription+'</div>\
				        				'+((subAction == "episode") ? '<div class="'+subAction+'_elipsis">...</div>' : '')+'\
				        			</div>\
				        		</div>\
					    	</a>');
			    	}

			    	// limit to 10 - may need to change when doing an update
			    	if(typeof limit !== 'undefined'){
			    		return i < (limit-1);
			    	}
			 
			});

		}).done(function(){
			
			if(action == 'singlestack'){
				setZindex();

				if(option == undefined){
					setScale();
				}else{
					var lastCard = visualEffects.length-1;

					var card = visualEffects[lastCard];
						var cardScale = card[0];
						var cardOffset = card[1];

					$(newItems).each(function(){
						
						var $this = $(this);

						TweenMax.set($this, {
							scaleX: cardScale,
							scaleY: cardScale,
							y: cardOffset,
							z: 0.01
						});

					});
					$('.active').each(function(i){

						var $this = $(this);
						var $i = i;

						var card = visualEffects[i];
							
						if(typeof card === 'undefined'){
							return false;
						}else{
							var cardScale = card[0];
							var cardOffset = card[1];
						}

						TweenMax.to($this, 2.5, {
							scaleX: cardScale,
							scaleY: cardScale,
							y: cardOffset,
							z: 0.01,
							force3D: true
						});

					});
					roloForward(option);

				}

				setHandler();

				/* TEST FUNCTION FOR OPENING SINGLE VIEW */
				stackPinch();

			}else{
				loadSubModule();
			}
		});
	}


	/* NOTES - if screen is larger then just go maximum height of content or of items x amount */


	// SUB MODULE OPEN AND LOAD
	function loadSubModule(){

		// CAPTURE MODULE SIZING ON TRANSITION
		var contentModule = $('#content_module');
			contentModule
				.height(contentModule.height())
				.width(contentModule.width());

		// HANDLE SELECTED STATES
		$('.navigation_item').removeClass('selected');
		el.addClass('selected');

		// DYNAMIC HEIGHT CALCULATIONS
		var windowHeight = $(window).innerHeight();

		var singleOffset = $('#flat_view').offset();

		var infoTitle = $('.info_title');
			var infoTitleHeight = infoTitle.outerHeight();
		
		var subNavigation = $('#sub_navigation');
			var subnavHeight = subNavigation.outerHeight();
			var subnavPosition = subNavigation.position();
				var innerSubNavHeight = infoTitleHeight + subnavHeight;

		var contentHeight = windowHeight - singleOffset.top;
				

		// SET CONTENT LOCATIONS PRE ANIMATION
		$('#sub_module').show().css({visibility: 'hidden'});

		var moduleNavigation = $('#module_navigation');
			var moduleNavHeight = moduleNavigation.outerHeight();
		
		if(subAction == "clip" || subAction == "similar"){
			var subContentHeight = windowHeight 
				- (singleOffset.top 
				+ innerSubNavHeight
			);
			$('#module_navigation').hide();
			$('#episode_inner_wrapper')
				.removeClass('list_view')
				.addClass('thumb_view');
		}else{
			var subContentHeight = windowHeight 
				- (singleOffset.top 
				+ innerSubNavHeight 
				+ moduleNavHeight
			);
			$('#module_navigation').show();
			$('#episode_inner_wrapper')
				.removeClass('thumb_view')
				.addClass('list_view');
		}

		$('#episode_outer').height(subContentHeight);
		
		// TRANSITION ANIMATIONS
		$('#action_subnav').fadeIn(500);

		// SUB NAV TRANSITION ANIMATIONS
		contentModule.animate({height:contentHeight},250);

		$('#content_wrapper').animate({opacity:0},250,function(e){
			$(this).hide();
			$('#sub_navigation')
				.addClass('subnav_open')
				.css({top:subnavPosition.top})
				.animate({top:infoTitleHeight},350);

			// SUB MODULE LOADER
			
			$('#sub_module').css({
				top: windowHeight,
				opacity: 1,
				visibility: 'visible'
			}).delay(250).animate({top: innerSubNavHeight},350);

			/* 
				NOTES: redo the module to have 3 internal sections
					- detect which view you are on
					- have it move left or right based on what is currently selected
			*/

		});

	}

	// UNLOAD AND CLOSE
	function unloadSubModule(){

		// DYNAMIC HEIGHT - (NOTE: instead of polling at the time of function, on window resizes store in parent object)
		var contentModule = $('#content_module');
		var endContentHeight = contentModule.height();

		var contentWrapper = $('#content_wrapper');

		var subNav = $('#sub_navigation');

		// TEMPORARILY GET HEIGHT VARIABLES FOR ANIMATION BACK
		$('#action_subnav, #module_navigation').fadeOut(250);
		$('#episode_inner_wrapper').fadeOut(250,function(){
			$(this).hide().empty();
			$('#episode_outer, #content_module').removeAttr('style');
			$('.navigation_item').removeClass('selected');
			contentWrapper
				.show()
				.css({visibility:'hidden'});
			subNav
				.removeClass('subnav_open')
				.css({top:''});
			
			var contentHeight = contentModule.height();
			var contentWrapperHeight = contentWrapper.height();
			
			// SET FINAL HEIGHTS AND RESET MODULE
			contentWrapper.removeAttr('style').css({visibility:'hidden'}).height(0).animate({height:contentWrapperHeight},250);

			contentModule.height(endContentHeight).animate({height:contentHeight},350,function(){
				$('#content_module, #content_wrapper, #sub_module').removeAttr('style');
				contentWrapper.hide().fadeIn(250);
			});
		});

	}

}

// MORE WAYS TO WATCH HANDLER
function moreWaysHandler(el){

	// SIZE THE SIDE MODULE DYNAMICALLY IN CASE OF WINDOW RESIZES - move to future resize function
	$('#side_wrapper').innerHeight($('#module_wrapper').height());

	// INTERPRET SELECTION MODE
	if(el.hasClass('selected')){
		el.removeClass('selected');
		$('#side_module').stop().fadeOut(250,function(){
			$('#flat_view').stop().animate({width: $('#flat_view').width()-220},250);
			$('#side_wrapper').stop().animate({marginLeft:-215},250,function(){
				$(this).removeAttr('style');
			});
		});
	}else{
		el.addClass('selected');
		$('#flat_view').stop().animate({width: $('#flat_view').width()+220},250);
		$('#side_wrapper').stop().animate({marginLeft:0},250,function(){
			$('#side_module').stop().fadeIn(250);
		});
	}

}

// SIDE NAV ORGANIZATION - unfinished until more content is available
function sideNavHandler(el){
	$('.sidenav_item').removeClass('selected');
	el.addClass('selected');
}

// CAB MENU HANDLER

function cabMenuHandler(el){

	if(el.hasClass('selected')){
		closeCab(el);
	}else{
		openCab(el);
	}

	var primaryWidth;
	var negPrimaryWidth;

	function calculatePrimary(){

		var primary = $('#cab_primary')
			primaryWidth = $('#cab_primary').width()
				negPrimaryWidth = primaryWidth - (primaryWidth * 2);
	}

	// OPEN CAB MENU ANIMATIONS
	function openCab(el){

		// STOPS BUTTONS ACTION FROM QUEUING
		if($(':animated').length){
			return false;
		}

    	el.addClass('selected');

    	$('#cab_primary,#secondary_wrapper').show(0,function(){
    		calculatePrimary();
    	});

    	$.when(calculatePrimary()).done(function() {
      		$('#cab_primary,#secondary_wrapper').children().animate({opacity:1},0).promise().done(function(){
				$('#cab_sort').css({
					width: primaryWidth,
					position: 'absolute',
					right: negPrimaryWidth,
					bottom: $('#cab_icon').height(),
					paddingBottom: parseFloat($('#cab_primary').css('padding-bottom'), 10)+1
				});
				$('#cab_primary,#secondary_wrapper').children().css({opacity:0});
				$('#cab_sort').stop().animate({opacity:1,right:0},200,function(){
					
					// REMOVE ALL STYLES DYNAMICALLY ASSIGNED
					$(this).removeAttr('style');
					
					// ANNIMATION QUEUE
					$('#cab_refine').stop().delay(100).animate({opacity:1},200);
					$('#cab_genres').stop().delay(200).animate({opacity:1},200);
					$('#cab_critically').stop().delay(300).animate({opacity:1},200);
					$('#cab_added').stop().delay(400).animate({opacity:1},200);
					$('#cab_popular').stop().delay(500).animate({opacity:1},200);
				});
			});

		});

	}
	
	// CLOSE CAB MENU ANIMATIONS
	function closeCab(el){
		
		// STOPS BUTTONS ACTION FROM QUEUING
		if($(':animated').length){
			return false;
		}

    	el.removeClass('selected');

    	calculatePrimary();

		// HIDE CAB ITEMS
		$('#cab_popular').stop().animate({opacity:0},200);
		$('#cab_added').stop().delay(100).animate({opacity:0},200);
		$('#cab_critically').stop().delay(200).animate({opacity:0},200);
		$('#cab_genres').stop().delay(300).animate({opacity:0},200);
		$('#cab_refine').stop().delay(400).animate({opacity:0},200,function(){
			$('#cab_sort').css({
				width: $(this).width(),
				position: 'absolute',
				bottom: $('#cab_icon').height(),
				paddingBottom: $('#cab_primary').css('padding-bottom')
			}).stop().animate({
				opacity:0, 
				right: negPrimaryWidth},200,function(){
			
					// REMOVE ALL STYLES DYNAMICALLY ASSIGNED
					$('#cab_primary,#secondary_wrapper').removeAttr('style').children().removeAttr('style');

				});
		});

	}
};



/**********************************************************************************************/


/* SINGLE STACK FUNCTIONS */

jQuery.fn.reverse = [].reverse;

// SET THE INDEX FOR ITEMS
function setZindex(){
	var zindex = 0
	$('.single_card').reverse().each(function(){
		$(this).css({
			zIndex: zindex
		});
		zindex += 1;
	});
	zindex = 0;
}

// SET SCALE OF EACH ITEM
function setScale(){

	visualEffects= [];
	cachedSiblings = [];

	var initScale = 1;
	var initOffset = 380;
	var setPerspective = 0;

	$('.single_card').each(function(i){

		$this = $(this);

		// kickstart the gpu
		TweenMax.to($this, 0.0, {
			opacity: 1.0,
			scaleX: initScale,
			scaleY: initScale,
			y: initOffset,
			z: 0.01,
			force3D: true
		});

		visualEffects.push([initScale,initOffset]);
		if(i <= 1){
			initOffset -= (70 - setPerspective);
		}else if(i >= 2 && i <=3){
			initOffset -= (60 - setPerspective);
		}else if (i >=4 && i <=6){
			initOffset -= (56 - setPerspective);
		}else if(i >= 7){
			initOffset -= (52 - setPerspective);
		}
		setPerspective += 4;

		initScale = parseFloat((initScale-0.07).toFixed(2));

	});

	var initScale = 1;
	var initOffset = 380;
	var setPerspective = 0;

}

// SET SINGLE STACK CARD HANDLERS
function setHandler(){
	$('.single_card').off('click').on('click',function(){
		var siblingsInfront = $(this).prevAll();
			roloToCard(siblingsInfront);
	});
}

// ROLODEX FORWARD ANIMATION
function roloForward(multi){

	var length = ($('.single_card.active').length)-1;

	if(typeof multi !== 'undefined' && multi > 4){
		var delay = 0;
	}else{
		var delay = 0.1;
	}

	//TweenMax.killTweensOf($('.active'));

	$('.single_card.active').each(function(i){

		var $this = $(this);
		var $i = i;

		var card = visualEffects[i];

		if(typeof card === 'undefined'){
			return false;
		}else{
			var cardScale = card[0];
			var cardOffset = card[1];
		}

			if($i == 0){
				delay = parseFloat((delay += 0.025).toFixed(3));
			}else if($i >0 && $i <= 2){
				delay = parseFloat((delay += 0.075).toFixed(3));
			}else if($i >= 3 && $i <=6){
				delay = parseFloat((delay += 0.01).toFixed(3));
			}else if($i >= 7){
				delay = parseFloat((delay += 0.125).toFixed(3));
			}

			TweenMax.to($this, 0.8, {
				delay: delay,
				scaleX: cardScale,
				scaleY: cardScale,
				y: cardOffset,
				z: 0.01,
				force3D: true,
				ease: SlowMo.easeOut
			});

	});

	delay = 0.1;

}

// ROLODEX BACKWARDS ANIMATION
function roloBackwards(){

	var delay = 0.75;

	$('.single_card.active').each(function(i){

		var $this = $(this);
		var $i = i;

		var card = visualEffects[i];

		if(typeof card === 'undefined'){
			return false;
		}else{
			var cardScale = card[0];
			var cardOffset = card[1];
		}

			if($i == 0){
				delay = delay;
			}else if($i >0 && $i <= 2){
				delay = parseFloat((delay -= 0.05).toFixed(3));
			}else if($i >= 3 && $i <=6){
				delay = parseFloat((delay -= 0.075).toFixed(3));
			}else if($i >= 7){
				delay = parseFloat((delay -= 0.1).toFixed(3));
			}

			TweenMax.to($this, 0.35, {
				delay: delay,
				scaleX: cardScale,
				scaleY: cardScale,
				y: cardOffset,
				z: 0.01,
				force3D: true,
				ease: SlowMo.easeOut
			});

	});

	delay = 0.75;

}

// ROLO TO CLICKED CARDS
function roloToCard(siblings){

	var length = siblings.length;
		var trueLength = length;
		var index = length-1;
	var lastIndex = parseFloat($('#single_stack a:last-child').attr('index'));
		var permLength = lastIndex+length+1;

	var card = visualEffects[0];
		var cardScale = card[0];

	var delay = 0.25;
	var speed = 1.0;

	var windowHeight = $(window).height();

		$(siblings).reverse().each(function(i){

			var $i = i;
			var $this = $(this);

				cachedSiblings.unshift($this);

				$this.removeClass('active');

				if($i < 4){
					speed = parseFloat((speed-0.1).toFixed(1));
				}

				TweenMax.to($this, speed, {
					delay: delay,
					scaleX: cardScale,
					scaleY: cardScale,
					y: windowHeight,
					z: 0.01,
					force3D: true,
					ease: SlowMo.easeOut
				});

				delay = delay+0.15;

		});

		setTimeout(function(){
			subNavHandler(0,'singlestack',permLength,length,lastIndex);

			setTimeout(function(){
				$('.single_card').slice(0,trueLength).remove();
			},(delay*2300));

		}, (delay*900));

		delay = 0.25;
		speed = 1.0;

}

// CONTROL HOW MANY CARD FORWARD
function roloForwardCard(number){

	if(number > $('.single_card').length){
		var selectedCard = $('.single_card:last-child');
	}else{
		var selectedCard = $('.single_card:eq('+number+')');
	}

	var siblingsInfront = selectedCard.prevAll();

		if(siblingsInfront.length > 0){
			roloToCard(siblingsInfront);
		}else{
			TweenMax.to(selectedCard, 0.25, {
				rotationX: -20,
				z: 0.01,
				yoyo: true,
				repeat: 1
			});
		}

}

// CONTROL HOW MANY CARDS BACK
function roloBackCard(number){

	var count = number-1;

		$(cachedSiblings).each(function(i){
			if(typeof count !== 'undefined' && i <= count){
				$('#single_stack').prepend($(this));
				$('#single_stack a:first-child').addClass('active');

				if($('#single_stack a').length > 10){
					$('#single_stack a:last-child').remove();
				}

				cachedSiblings.shift();
			}
		});
	
		setZindex();
		setHandler();
		roloBackwards();
}

// VELOCITY CONTROL
function velocityProcess(velocity,direction){

	// put in fix for swipe harder than number of cards left

	if(velocity < 2){
		var t = 1;
	}else if(velocity > 9){
		var t = 9;
	}else{
		var t = Math.round(velocity);
	}

	// testing purposes only
	$('#move_velocity').html(' <b>INPUT:</b> '+velocity+' | <b>OUTPUT: </b>'+t);

	if(direction == 1){
	    roloForwardCard(t);
	}else{
	    roloBackCard(t);
	}
}

// LOAD SINGLE CARD
function loadSingleCard() {
	var marginSpacing = ($(window).height() - $('#flat_view').height()) / 2;
				
		$('#flat_view')
			.width($('#flat_view').width())
			.css({
				display: 'block',
				marginTop: marginSpacing,
				visibility: 'visible'
			});

		$('a').on('click',function(e){
			e.preventDefault();
		})

		var dtvtouch = new Hammer($('#flat_view')[0]);
		
			dtvtouch.get('pinch').set({
				enable: true,
				preventDefault: true
			});

			var pinched = false;

				dtvtouch.on('pinchin',function(ev){
					pinched = true;
				});
				dtvtouch.on('pinchend',function(ev){
					if(ev.type == 'pinchend' && pinched == true){
						
						$('#app_wrapper').hide();
						
						$('.single_card.active').each(function(i){
							
							var $this = $(this);

							var card = visualEffects[i];
							
								if(typeof card === 'undefined'){
									return false;
								}else{
									var cardScale = card[0];
									var cardOffset = card[1];
								}

								TweenMax.to($this, 0.6, {
									opacity: 1.0,
									scaleX: cardScale,
									scaleY: cardScale,
									y: cardOffset,
									z: 0.01,
									force3D: true,
									ease: SlowMo.easeOut
								});

						});

						$('#single_wrapper').show();

						pinched = false;
					}
				});

		// move to layout later
		$('.navigation_item').on('click',function(e){
			subNavHandler($(this),'open');
		});

		$('#action_back').on('click',function(e){
			subNavHandler($(this),'close');
		});

		$('.action_more').on('click',function(e){
			moreWaysHandler($(this));
		});

		$('.sidenav_item').on('click',function(e){
			sideNavHandler($(this));
		});

		$('#cab_icon').on('click',function(e){
			cabMenuHandler($(this));
		});
}

// LOAD SINGLE STACK
function loadSingleStack(){
	subNavHandler(0,'singlestack',10);

	var dtvtouch = new Hammer($('#single_stack')[0]);
	        	
	    dtvtouch.get('swipe').set({
	        direction: Hammer.DIRECTION_VERTICAL,
	        threshold: 5,
	        velocity: 0.75
	    });
				
		// WARNING: may need to optimize for single call
		dtvtouch.on('swipedown swipeup',function(ev){
						
			var velocity = Math.abs(ev.velocityY);

				if(ev.type == 'swipedown'){
					var direction = 1;
				}else{
					var direction = 0;
				}
							
				velocityProcess(velocity,direction);
		});
}

// test pinch commands
function stackPinch(){
	var dtvtouch = new Hammer($('#single_stack')[0]);
		
		dtvtouch.get('pinch').set({
			enable: true,
			preventDefault: true
		});

		var pinched = false;

		dtvtouch.on('pinchout',function(ev){
			pinched = true;
		});
		dtvtouch.on('pinchend',function(ev){
			if(ev.type == 'pinchend' && pinched == true){

				var delay = 0.0;

				var length = ($('.single_card.active').length)-1;

				var firstCard = visualEffects[0];
				var fifthCard = visualEffects[4];
					var cardScale = firstCard[0];
					var cardOffset = fifthCard[1];

					TweenMax.to($('.single_card:gt(0)'), 1.0, {
						opacity: 0.0,
						z: 0.01,
						force3D: true,
						ease: SlowMo.easeOut
					});

					$('.single_card.active').each(function(i){

						var $this = $(this);
						var $i = i;

						/*if(typeof card === 'undefined'){
							return false;
						}*/

						if($i == 0){
							delay = parseFloat((delay += 0.025).toFixed(3));
						}else if($i >0 && $i <= 2){
							delay = parseFloat((delay += 0.075).toFixed(3));
						}else if($i >= 3 && $i <=6){
							delay = parseFloat((delay += 0.01).toFixed(3));
						}else if($i >= 7){
							delay = parseFloat((delay += 0.125).toFixed(3));
						}

						TweenMax.to($this, 0.4, {
							//delay: delay,
							scaleX: cardScale,
							scaleY: cardScale,
							y: cardOffset,
							z: 0.01,
							force3D: true,
							ease: SlowMo.easeOut
						});

					});

				setTimeout(function(){

					//TweenMax.killTweensOf($('.active'));
					$('#single_wrapper').hide();
					$('#app_wrapper').show();

					loadSingleCard();

				},(delay*1500));

				delay = 0.0;
				pinched = false;
			}
		});

}

$(document).ready(function(){

		$(window).load(function(){
			loadSingleStack();
		});

});