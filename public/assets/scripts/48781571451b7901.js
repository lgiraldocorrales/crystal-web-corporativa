
        function ScrollToDivId(id) {
            $("div").removeClass("flashit");
            $("#" + id).addClass("flashit");
            $('html,body').animate({
                scrollTop: $("#" + id).offset().top-150
            }, 'slow');
        }         
        $('#select').on('change', function (e) {
            var optionSelected = $("option:selected", this);
            var valueSelected = this.value;
            ScrollToDivId(valueSelected);
        });
        document.addEventListener("DOMContentLoaded", function(){
            var anio='1969'
            $("div").removeClass("flashit");
            $("#" + anio).addClass("flashit");
            $('html,body').animate({
                scrollTop: $("#" + anio).offset().top-150
            }, 'slow');
        }); 
    