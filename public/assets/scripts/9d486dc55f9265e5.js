
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.btn-flotante');
            var instances = M.FloatingActionButton.init(elems, {
                hoverEnabled: false,
            });
        });
        $('.sub').dropdown(
        {
            hover:true
        });
        $(".submenu1").click(function(){
            if (document.getElementById("sobre").style.display == "block"){
                document.getElementById("sobre").style.display = "none";
                document.getElementById("submenu1").style.color = "black";
                document.getElementById("iconSobreDown").style.display = "";
                document.getElementById("iconSobreUp").style.display = "none";

            }else{
                document.getElementById("sobre").style.display = "block";
                document.getElementById("submenu1").style.color = "grey";
                document.getElementById("iconSobreDown").style.display = "none";
                document.getElementById("iconSobreUp").style.display = "";
                document.getElementById("iconSobreUp").style.color = "grey";


            }
        })
        $(".submenu2").click(function(){
            if (document.getElementById("modelo").style.display == "block"){
                document.getElementById("sobre").style.display = "block";
                document.getElementById("modelo").style.display = "none";
                document.getElementById("submenu2").style.color = "black";
                document.getElementById("iconModelDown").style.display = "";
                document.getElementById("iconModelUp").style.display = "none";
            }else{
                document.getElementById("modelo").style.display = "block";
                document.getElementById("submenu2").style.color = "grey";
                document.getElementById("iconModelDown").style.display = "none";
                document.getElementById("iconModelUp").style.display = "";
                document.getElementById("iconModelUp").style.color = "grey";
            }
        })
        $(".submenu3").click(function(){
            if (document.getElementById("quienes").style.display == "block"){
                document.getElementById("sobre").style.display = "block";
                document.getElementById("quienes").style.display = "none";
                document.getElementById("submenu3").style.color = "black";
                document.getElementById("iconQuieDown").style.display = "";
                document.getElementById("iconQuieUp").style.display = "none";
            }else{
                document.getElementById("quienes").style.display = "block";
                document.getElementById("submenu3").style.color = "grey";
                document.getElementById("iconQuieDown").style.display = "none";
                document.getElementById("iconQuieUp").style.display = "";
                document.getElementById("iconQuieUp").style.color = "grey";
            }
        })
        $(".submenu4").click(function(){
            if (document.getElementById("hilanderia").style.display == "block"){
                document.getElementById("sobre").style.display = "block";
                document.getElementById("hilanderia").style.display = "none";
                document.getElementById("submenu4").style.color = "black";
                document.getElementById("iconHilDown").style.display = "";
                document.getElementById("iconHilUp").style.display = "none";
            }else{
                document.getElementById("hilanderia").style.display = "block";
                document.getElementById("submenu4").style.color = "grey";
                document.getElementById("iconHilDown").style.display = "none";
                document.getElementById("iconHilUp").style.display = "";
                document.getElementById("iconHilUp").style.color = "grey";
            }
        })
        $(".submenu5").click(function(){
            if (document.getElementById("paquete").style.display == "block"){
                document.getElementById("sobre").style.display = "block";
                document.getElementById("paquete").style.display = "none";
                document.getElementById("submenu5").style.color = "black";
                document.getElementById("iconPaqDown").style.display = "";
                document.getElementById("iconPaqUp").style.display = "none";

            }else{
                document.getElementById("paquete").style.display = "block";
                document.getElementById("submenu5").style.color = "grey";
                document.getElementById("iconPaqDown").style.display = "none";
                document.getElementById("iconPaqUp").style.display = "";
                document.getElementById("iconPaqUp").style.color = "grey";
            }
        })
        $(".submenu6").click(function(){
            if (document.getElementById("sostenibilidad").style.display == "block"){
                document.getElementById("sostenibilidad").style.display = "none";
                document.getElementById("submenu6").style.color = "black";
                document.getElementById("iconSosDown").style.display = "";
                document.getElementById("iconSosUp").style.display = "none";

            }else{
                document.getElementById("sostenibilidad").style.display = "block";
                document.getElementById("submenu6").style.color = "grey";
                document.getElementById("iconSosDown").style.display = "none";
                document.getElementById("iconSosUp").style.display = "";
                document.getElementById("iconSosUp").style.color = "grey";
            }
        })
        $(".submenu7").click(function(){
            if (document.getElementById("cumplimiento").style.display == "block"){
                document.getElementById("cumplimiento").style.display = "none";
                document.getElementById("submenu7").style.color = "black";
                document.getElementById("iconCumpDown").style.display = "";
                document.getElementById("iconCumpUp").style.display = "none";

            }else{
                document.getElementById("cumplimiento").style.display = "block";
                document.getElementById("submenu7").style.color = "grey";
                document.getElementById("iconCumpDown").style.display = "none";
                document.getElementById("iconCumpUp").style.display = "";
                document.getElementById("iconCumpUp").style.color = "grey";
            }
        })
    