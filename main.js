
var SiteHandler ={  
    
    settings:   {
        animSpeed:          1000,
        fx:                 'easeOutQuint',
        sleep:              1000,
        pagesClass:         'step'
    },
    
    currentStep:                0,
    currentlyIsAnimating:       false,
    currentlyIsListening:       false,
    finishedAnimations:         [],
    previousTouchPosition:      false,
    shouldAnimateSomethingElse: false,

    init:           function(options){
        SiteHandler.settings    =$.extend(SiteHandler.settings, options);
        SiteHandler.listenOrientation();
        SiteHandler.listenScrolling();
        SiteHandler.domReadyEvents();    
        return SiteHandler;
    },
    
    wheel:          function(e){
        e.preventDefault();
        
        if(!SiteHandler.currentlyIsAnimating && SiteHandler.shouldAnimateSomethingElse!==false)
            return SiteHandler.otherWheelAnimation(e.detail || e.wheelDeltaY);
        
        if(!SiteHandler.currentlyIsAnimating && Math.abs(e.wheelDeltaY)>=1){
            SiteHandler.step(e.wheelDeltaY);
        }
	else if(!SiteHandler.currentlyIsAnimating && typeof e.detail !== 'undefined'){
            SiteHandler.step(1-e.detail);
	}
    },
    
    otherWheelAnimation:    function(way){
        SiteHandler.currentlyIsAnimating    =true;
        SiteHandler[SiteHandler.shouldAnimateSomethingElse](way);
    },
    
    touch:          function(e){
        e.preventDefault();
	currentY	=e.touches.item(0).clientY;
        if(SiteHandler.previousTouchPosition!==false && !SiteHandler.currentlyIsAnimating && SiteHandler.shouldAnimateSomethingElse!==false){
            SiteHandler.otherWheelAnimation(1-(SiteHandler.previousTouchPosition-currentY));
            return SiteHandler.previousTouchPosition	=currentY;
        }
	if(SiteHandler.previousTouchPosition!==false && !SiteHandler.currentlyIsAnimating)
	    SiteHandler.step(1-(SiteHandler.previousTouchPosition-currentY));
	SiteHandler.previousTouchPosition	=currentY;
    },

    touchStart:     function(e){
	e.preventDefault();
	SiteHandler.previousTouchPosition	=false;
    },
    
    step:           function(way){
        var maxElements =$('.'+SiteHandler.settings.pagesClass).length;

        if(way<0 && SiteHandler.currentStep!=(maxElements-1)){
            SiteHandler.currentlyIsAnimating=   true;
            $('.'+SiteHandler.settings.pagesClass+':eq('+SiteHandler.currentStep+')').animate({top:'-100%'},SiteHandler.settings.animSpeed,SiteHandler.settings.fx,SiteHandler.stepAnimation);
            SiteHandler.currentStep++;
        }
        else if(way>0 && SiteHandler.currentStep!=1){
            SiteHandler.currentlyIsAnimating=   true;
            $('.'+SiteHandler.settings.pagesClass+':eq('+(SiteHandler.currentStep-1)+')').animate({top:'0%'},SiteHandler.settings.animSpeed,SiteHandler.settings.fx,SiteHandler.stepAnimation);
            SiteHandler.currentStep--;
        }
        
        SiteHandler.currentStep             =(SiteHandler.currentStep<0)?0:(SiteHandler.currentStep>maxElements)?maxElements:SiteHandler.currentStep;
    },
    
    stepAnimation:  function(){
        if(SiteHandler.finishedAnimations.indexOf(SiteHandler.currentStep)!=-1)
            return SiteHandler.allAnimationsHasBeenFinished();
        switch(SiteHandler.currentStep){
            case 1:SiteHandler.aboutAnim();break;
            case 2:SiteHandler.skillsAnim();break;
            case 3:SiteHandler.projectsAnim();break;
            case 4:SiteHandler.infosAnim();break;
            default:SiteHandler.allAnimationsHasBeenFinished();break;
        }
    },
    
    animateArrow:   function(element){
        $(element).animate({bottom:'10%',opacity:1},SiteHandler.settings.animSpeed,SiteHandler.settings.fx);
    },
    
    skillsAnim:     function(){
        $('#skills .skillsCircle').animate({top:'150px'},SiteHandler.settings.animSpeed,SiteHandler.settings.fx);
        SiteHandler.chainingSkillsAnimation();
    },
    
    aboutAnim:      function(){
	$('header').addClass('shadow');
        $('#about .cover').animate({top:'100px',height:'0'},SiteHandler.settings.animSpeed,SiteHandler.settings.fx);
	$('header .arrow').animate({bottom:'25%'},SiteHandler.settings.animSpeed,SiteHandler.settings.fx);
        $('header').animate({backgroundPositionY:'20px'},SiteHandler.settings.animSpeed,SiteHandler.settings.fx,function(){
            $('#about .welcomeCircle').animate({top:'150px'},SiteHandler.settings.animSpeed,SiteHandler.settings.fx);
            $('#about .welcomeMessage').animate({bottom:'25%',width:'50%',left:'25%'},SiteHandler.settings.animSpeed,SiteHandler.settings.fx);
            SiteHandler.animateArrow('#about .arrow');
            SiteHandler.chainingSocialAnimations(($('header > a').length-1));
            $('header a').promise().done(SiteHandler.allAnimationsHasBeenFinished);
        });
    },
    
    chainingSocialAnimations:   function(idx){
        var element =$('header > a:eq('+Math.abs(idx)+')');
        if(element.length>0){
            element.animate({top:0},SiteHandler.settings.animSpeed/4,function(){
                SiteHandler.chainingSocialAnimations((idx-1));
            });
        }
    },
    
    chainingSkillsAnimation:    function(){
        var middlePoint =Math.floor($('#skills .skillsGroup').length/2);
        SiteHandler.skillsAnimationToDirection(-1,middlePoint-1,0);
        SiteHandler.skillsAnimationToDirection(1,middlePoint,0);
    },
    
    skillsAnimationToDirection:      function(direction,idx,itemsAnimated){
        var element =$('#skills .skillsGroup:eq('+idx+')');
        if(element.length>0){
            element.animate({bottom:0},SiteHandler.settings.animSpeed/4,function(){
                SiteHandler.skillsAnimationToDirection(direction,idx+direction,itemsAnimated+1);
            });
        }
        if(itemsAnimated == $('#skills .skillsGroup').length)
            SiteHandler.moveSkillsGroupHigher();
    },
    
    moveSkillsGroupHigher:          function(){
        $('#skills .skillsDetail').css({display:'inline-block'});
        $('#skills .skillsContainer.group').animate({bottom:(50+$('#skills .skillsDetail').height())+'px'},SiteHandler.settings.animSpeed/4,function(){
	    $(this).addClass('done');
	});
        $('#skills .skillsCircle').animate({width:'100px',height:'100px',lineHeight:'100px',fontSize:'18px'},SiteHandler.settings.animSpeed/4,SiteHandler.allAnimationsHasBeenFinished);
    },
    
    projectsAnim:                   function(){
        SiteHandler.currentlyIsAnimating        =false;
        SiteHandler.shouldAnimateSomethingElse  ='projectsTableAnim';
    },
    
    projectsTableAnim:              function(direction){
        var firstElement    =$('.project:eq(0)');
        var currentlyActive =$('.project.active');
        var nextActiveIdx   =(direction>0)?currentlyActive.index()-1:currentlyActive.index()+1;
        var nextActiveElem  =$('.project:eq('+nextActiveIdx+')');
        var marginTop       =firstElement.css('marginTop');
        marginTop           =parseInt(marginTop.substr(0,marginTop.indexOf(marginTop.substr(-2))),10);
        var animateTo       =(direction>0)?marginTop+200+'px':marginTop-200+'px';
        
        if(nextActiveIdx<0 || nextActiveIdx>$('.project').length-1){
            SiteHandler.shouldAnimateSomethingElse  =false;
            SiteHandler.allAnimationsHasBeenFinished(true);
        }
        else{
            if(currentlyActive.index()!=firstElement.index())
                currentlyActive.animate({opacity:.25});
            if(nextActiveElem.index()!=firstElement.index())
                nextActiveElem.animate({opacity:1});
            firstElement.animate({marginTop:animateTo,opacity:(nextActiveElem.index()===firstElement.index())?1:.25},SiteHandler.settings.animSpeed,SiteHandler.settings.fx,function(){
                currentlyActive.removeClass('active');
                nextActiveElem.addClass('active');
                SiteHandler.allAnimationsHasBeenFinished(true);
            });
        }
        
        
    },
    
    infosAnim:                      function(){
        var greyCoverStarted    =false;
        $('header').css('zIndex',100);
        $('.blueCover').animate({bottom:'0%'},{
            duration:   SiteHandler.settings.animSpeed,
            step:       function(now,tween){
                if(now>=-25 && !greyCoverStarted){
                    greyCoverStarted    =SiteHandler.infosGreyCoverAnim();
                }
            }
        });
    },
    
    infosGreyCoverAnim:             function(){
        var contactButtonsStarted   =false;
        $('.greyCover').animate({bottom:'0%'},{
            duration:   SiteHandler.settings.animSpeed,
            step:       function(now,tween){
                if(now>=-60 && !contactButtonsStarted){
                    contactButtonsStarted   =SiteHandler.infosContactButtonsAnim();
                }
            }
        });
        return true;
    },
    
    infosContactButtonsAnim:	    function(){
        var socialIconsStarted      =false;
        $('.greyCover .logo').animate({top:'50%'},{
            duration:   SiteHandler.settings.animSpeed*1.5,
            easing:     SiteHandler.settings.fx,
            step:       function(now,tween){
                if(now>=20 && !socialIconsStarted){
                    socialIconsStarted   =SiteHandler.infosSocialIconsAnim();
                }
            }
        });
	return true;
    },
    
    infosSocialIconsAnim:           function(){
        SiteHandler.chainingInfosSocialAnimations(0);
        return true;
    },
    
    chainingInfosSocialAnimations:  function(idx){
        var element     =$('.contactsContainer .contact:eq('+Math.abs(idx)+')');
        var nextStarted =false;
        if(element.length>0){
            element.animate({bottom:'0%'},{
                duration:   SiteHandler.settings.animSpeed/2,
                step:       function(now){
                    if(now>=-200&&!nextStarted){
                        nextStarted =true;
                        SiteHandler.chainingInfosSocialAnimations(idx+1);
                    }
                }
            });
        }
    },
    
    setPreloadLogoColored:	    function(){
	$('#preload').addClass('done');
    },
    
    allAnimationsHasBeenFinished:   function(except){
        SiteHandler.currentlyIsAnimating=   false;
        if(!except)
            SiteHandler.finishedAnimations.push(SiteHandler.currentStep);
    },
    
    listenScrolling:    function(){
        if (window.addEventListener) {
            window.addEventListener('DOMMouseScroll', SiteHandler.wheel, false);
            window.addEventListener('touchmove', SiteHandler.touch, false);
            window.addEventListener('touchstart', SiteHandler.touchStart, false);
        }
        window.onmousewheel = document.onmousewheel = window.onscroll = SiteHandler.wheel;
        SiteHandler.currentlyIsListening    =true;
    },
    
    deafScrolling:      function(){
        if(window.removeEventListener){
            window.removeEventListener('DOMMouseScroll', SiteHandler.wheel, false);
            window.removeEventListener('touchmove', SiteHandler.touch, false);
            window.removeEventListener('touchstart', SiteHandler.touchStart, false);
        }
        window.onmousewheel = document.onmousewheel = window.onscroll = undefined;
        SiteHandler.currentlyIsListening    =false;
    },
    
    listenOrientation:  function(){
        if(window.addEventListener)
            window.addEventListener('resize', SiteHandler.resize, false);
    },

    resize:             function(){
        var wi  =$(window);
        var w   =wi.width()
        var h   =wi.height();
        if(w<h && SiteHandler.currentlyIsListening)
            SiteHandler.deafScrolling();
        else if(w>h && !SiteHandler.currentlyIsListening)
            SiteHandler.listenScrolling();
    },
    
    goTo:               function(step){
        for(var i=0;i<step;i++){
            $('.'+SiteHandler.settings.pagesClass+':eq('+i+')').css({top:'-100%'});
        }
        SiteHandler.currentStep =step;
        SiteHandler.stepAnimation();
    },

    domReadyEvents:     function(){
        $(function(){
            SiteHandler.resize();
	    setTimeout(function(){
		SiteHandler.setPreloadLogoColored();
	        SiteHandler.animateArrow('#preload .arrow');
	    },1000);
        });
    }
    
    
};
