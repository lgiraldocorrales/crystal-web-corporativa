
        document.addEventListener("DOMContentLoaded", function(){
            var item='Com'
            $("div").removeClass("flashit");
            $("#" + item).addClass("flashit");
            $('html,body').animate({
                scrollTop: $("#" + item).offset().top -100
            }, 'slow');
        });   
    