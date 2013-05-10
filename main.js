
var SiteHandler ={  
    
    settings:   {
        animSpeed:          1000,
        fx:                 'easeOutQuint',
        sleep:              1000,
        pagesClass:         'step'
    },
    
    currentStep:    0,
    
    init:           function(options){
        SiteHandler.settings    =$.extend(SiteHandler.settings, options);
        SiteHandler.listenScrolling();
        return SiteHandler;
    },
    
    wheel:          function(e){
        e.preventDefault();
        if(Math.abs(e.wheelDeltaY)>=50){
            SiteHandler.step(e.wheelDeltaY);
        }
    },
    
    touch:          function(e){
        e.preventDefault();
    },
    
    step:           function(way){
        SiteHandler.ignoreScrolling();
        var maxElements =$('.'+SiteHandler.settings.pagesClass).length;
        
        if(way<0 && SiteHandler.currentStep!=(maxElements-1)){
            $('.'+SiteHandler.settings.pagesClass+':eq('+SiteHandler.currentStep+')').animate({top:'-100%'},SiteHandler.settings.animSpeed,SiteHandler.settings.fx,SiteHandler.stepAnimation);
            SiteHandler.currentStep++;
        }
        else if(way>0 && SiteHandler.currentStep!=1){
            $('.'+SiteHandler.settings.pagesClass+':eq('+(SiteHandler.currentStep-1)+')').animate({top:'0%'},SiteHandler.settings.animSpeed,SiteHandler.settings.fx,SiteHandler.stepAnimation);
            SiteHandler.currentStep--;
        }
        
        SiteHandler.currentStep     =(SiteHandler.currentStep<0)?0:(SiteHandler.currentStep>maxElements)?maxElements:SiteHandler.currentStep;
        setTimeout(SiteHandler.listenScrolling,SiteHandler.settings.sleep);
    },
    
    stepAnimation:  function(){
        switch(SiteHandler.currentStep){
            case 1:SiteHandler.aboutAnim();break;
        }
        console.log(SiteHandler.currentStep);
    },
    
    aboutAnim:      function(){
        $('#about .cover').animate({top:'100px',height:'0'},SiteHandler.settings.animSpeed,SiteHandler.settings.fx);
        $('header').animate({backgroundPositionY:'20px'},SiteHandler.settings.animSpeed,SiteHandler.settings.fx,function(){
            $('#about .welcomeCircle').animate({top:'150px'},SiteHandler.settings.animSpeed,SiteHandler.settings.fx);
            $('#about .welcomeMessage').animate({bottom:'20%',width:'600px',marginLeft:'-300px',height:'130px'},SiteHandler.settings.animSpeed,SiteHandler.settings.fx);
            SiteHandler.chainingSocialAnimations(($('header > a').length-1));
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
    }
    
};
