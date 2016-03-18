$(function() {
    if (localStorage.barista_total != null) {
        $("#price span").text(localStorage.barista_total);   
        console.log(localStorage.barista_total)
    }

    if (localStorage.comprou == "true") {
        localStorage.comprou = false;
        var countdown = new Countdown(60, function(seconds) {
          $("#cnt").text("O seu pedido chega dentro de "+seconds+" secs"); 
        }, function() {
            $("#cnt").text(""); 
        });
    }
    $("#addNo").click(function() {
        if ($("#mini_buts img[src='Botao-mini-hoover.png']").attr("src") == undefined ||
            $("#mini_buts img[src='Botao-mini-hoover.png']").attr("src") == null)
            return false;
        $("#drinkNo").text(parseInt($("#drinkNo").text())+1);
    });
    $("#remNo").click(function() {
        if ($("#mini_buts img[src='Botao-mini-hoover.png']").attr("src") == undefined ||
            $("#mini_buts img[src='Botao-mini-hoover.png']").attr("src") == null)
            return false;
        var drinkNo = parseInt($("#drinkNo").text());
        if (drinkNo > 1)
            $("#drinkNo").text(parseInt($("#drinkNo").text())-1);
    });
	$("#mini_buts img").click(function() {
        $("#drinkNo").text("1");
    });
    $("#mini_buts img").click(function(event) {
        $("#mini_buts img[src='Botao-mini-hoover.png']").attr("src", "Botao-mini.png");
        $(this).attr("src", "Botao-mini-hoover.png");
        $("#bebida img").attr("src", "Bebidas/"+$(this).data("drink")+".png");
        $("#bebida img").width(89);
        $("#bebida img").height(272);
    });
    $("#confirm_but").click(function() {
        var drinkNo = parseInt($("#drinkNo").text());
        if (drinkNo < 1)
            return false;
        var curTotal = parseInt($("#price span").text());
        localStorage.new_barista_total = curTotal+drinkNo;
        window.location.href='confi_balcao.html';
    });
    $("#exit_but").click(function() {
        localStorage.barista_total = 0;
        localStorage.givenVotes = 0;
        window.location.href='index.html';
    });
});