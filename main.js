
var SiteHandler ={  
    
    settings:   {
        animSpeed:          1000,
        fx:                 'easeOutQuint',
        sleep:              1000,
        pagesClass:         'step'
    },
    
    currentStep:            0,
    currentlyIsAnimating:   false,
    finishedAnimations:     [],
    
    init:           function(options){
        SiteHandler.settings    =$.extend(SiteHandler.settings, options);
        SiteHandler.listenScrolling();
        SiteHandler.domReadyEvents();
        return SiteHandler;
    },
    
    wheel:          function(e){
        e.preventDefault();
        if(!SiteHandler.currentlyIsAnimating && Math.abs(e.wheelDeltaY)>=1){
            SiteHandler.step(e.wheelDeltaY);
        }
    },
    
    touch:          function(e){
        e.preventDefault();
    },
    
    step:           function(way){
        //SiteHandler.ignoreScrolling();
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
        //setTimeout(SiteHandler.listenScrolling,SiteHandler.settings.sleep);
    },
    
    stepAnimation:  function(){
        if(SiteHandler.finishedAnimations.indexOf(SiteHandler.currentStep)!=-1)
            return SiteHandler.allAnimationsHasBeenFinished();
        switch(SiteHandler.currentStep){
            case 1:SiteHandler.aboutAnim();break;
            case 2:SiteHandler.skillsAnim();break;
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
        $('#about .cover').animate({top:'100px',height:'0'},SiteHandler.settings.animSpeed,SiteHandler.settings.fx);
        $('header').animate({backgroundPositionY:'20px'},SiteHandler.settings.animSpeed,SiteHandler.settings.fx,function(){
            $('#about .welcomeCircle').animate({top:'150px'},SiteHandler.settings.animSpeed,SiteHandler.settings.fx);
            $('#about .welcomeMessage').animate({bottom:'20%',width:'600px',marginLeft:'-300px',height:'130px'},SiteHandler.settings.animSpeed,SiteHandler.settings.fx);
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
        $('#skills .skillsContainer.group').animate({bottom:'200px'},SiteHandler.settings.animSpeed/4);
        $('#skills .skillsCircle').animate({width:'100px',height:'100px',lineHeight:'100px',fontSize:'18px'},SiteHandler.settings.animSpeed/4,SiteHandler.allAnimationsHasBeenFinished);
    },
    
    allAnimationsHasBeenFinished:   function(){
        SiteHandler.currentlyIsAnimating=   false;
        SiteHandler.finishedAnimations.push(SiteHandler.currentStep);
        console.log('done');
    },
    
    listenScrolling:    function(){
        if (window.addEventListener) {
            window.addEventListener('DOMMouseScroll', SiteHandler.wheel, false);
            window.addEventListener('touchmove', SiteHandler.touch, false);
        }
        window.onmousewheel = document.onmousewheel = SiteHandler.wheel;        
    },
    
    ignoreScrolling:    function(){
        if (window.removeEventListener) {
            window.removeEventListener('DOMMouseScroll', SiteHandler.wheel, false);
            window.removeEventListener('touchmove', SiteHandler.touch, false);
        }
        window.onmousewheel = document.onmousewheel = null;  
    },
    
    domReadyEvents:     function(){
        $(function(){
            SiteHandler.animateArrow('#preload .arrow');
        });
    }
    
    
};
