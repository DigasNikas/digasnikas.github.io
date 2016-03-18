$(function() {
    $("#addNo").click(function() {
        if ($(".butRow img[src='mini-botao-hoover.png']").attr("src") == undefined ||
            $(".butRow img[src='mini-botao-hoover.png']").attr("src") == null)
            return false;
        $("#drinkNo").text(parseInt($("#drinkNo").text())+1);
    });
    $("#remNo").click(function() {
        if ($(".butRow img[src='mini-botao-hoover.png']").attr("src") == undefined ||
            $(".butRow img[src='mini-botao-hoover.png']").attr("src") == null)
            return false;
        var drinkNo = parseInt($("#drinkNo").text());
        if (drinkNo > 1)
            $("#drinkNo").text(parseInt($("#drinkNo").text())-1);
    });
    $(".butRow img").click(function() {
        $("#drinkNo").text("1");
    });
    $(".butRow img").click(function() {
        $(".butRow img[src='mini-botao-hoover.png']").attr("src", "mini-botao.png");
        $(this).attr("src", "mini-botao-hoover.png");
    });
    $("#confirm_but").click(function() {
        var drinkNo = parseInt($("#drinkNo").text());
        if (drinkNo < 1)
            return false;
        var curTotal = localStorage.barista_total;
        if (curTotal == null || curTotal == "") {
            curTotal = 0;
        } 
        console.log("new_barista_total: "+localStorage.new_barista_total);
        localStorage.new_barista_total = parseInt(curTotal)+drinkNo;
        window.location.href='confi_bebida.html';
    });
    $("#exit_but").click(function() {
        localStorage.barista_total = 0;
        window.location.href='index.html';
    });
});