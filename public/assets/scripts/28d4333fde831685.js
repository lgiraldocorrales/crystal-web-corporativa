
        document.addEventListener("DOMContentLoaded", function(){
            var item='Sen'
            $("div").removeClass("flashit");
            $("#" + item).addClass("flashit");
            $('html,body').animate({
                scrollTop: $("#" + item).offset().top-130
            }, 'slow');
        });   
    