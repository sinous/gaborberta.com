/*$(function(){
    var bottom  =$("#bottom");
    var p       =$("#top p");
    var logo    =$("#top");
    function resize(){
        if($(this).height()<450&&bottom.is(':visible')){
            p.hide(200);
            bottom.hide(200);
            logo.animate({top:'25px',left:'25px'},200);
        }
        else if($(this).height()>450&&!bottom.is(':visible')){
            p.show(200);
            bottom.show(200);
            logo.animate({top:'100px',left:'100px'},200);
        }
    };
    $(window).resize(function(){
        resize();
    });
    resize();
});*/