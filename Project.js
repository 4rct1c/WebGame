var d1 = 0, d2 = 0;
var xMax = 20;
var yMax = 20;
var board = 0;
var turn = 1;
var action = 0;
var x1 = 0, y1 = 0, x2, y2;
var scoreBlue = 0, scoreRed = 0;
var rolled = 0;
var fieldLeft = 400;
var S;
window.onload = function(){
    init();
    var roll = document.getElementById("roll");
    var build = document.getElementById("build");
    var pass = document.getElementById("pass");
    $("#roll").mouseover(function () {
        $(this).css("color", "purple");
    });
    $("#roll").mouseout(function () {
        $(this).css("color", "black");
    });
    roll.onclick = rollDice;
    build.onclick = createField;
    pass.onclick = function () {
        action = 1;
        S = 0;
        passTurn();
    };
};



function passTurn(){
    if (board == 1 && action == 1){
        fieldLeft = fieldLeft - S;
        if (turn%2 == 1){
            $("#pass").removeClass("turnBlue");
            $("#pass").addClass("turnRed");
        }
        else{
            $("#pass").removeClass("turnRed");
            $("#pass").addClass("turnBlue");
        }
        turn++;
        action = 0;
        rolled = 0;
        rollDice();
    }
}



function createField(){
    if (board == 0) {
        xMax = document.getElementById("xMax").value;
        yMax = document.getElementById("yMax").value;
        fieldLeft = xMax*yMax;
        var tr;
        var td;
        var overIt = 0;
        $("#field").css("width", xMax*20+"px");
        $("#field").css("height", yMax*20+"px");
        for (var c = 1; c <= yMax; c++) {
            tr = $("<tr class='y"+ c +"'></tr>");
            $("#fieldTable").append(tr);
            for (var i = 1; i <= xMax; i++) {
                td = $("<td>").addClass("cell").attr("id", i+"-"+c).attr("datax", i).attr("datay", c);
                tr.append(td);
            }
        }
        $("#1-1").addClass("nearRed");
        $("#"+xMax+"-"+yMax).addClass("nearBlue");
        board = 1;
    }
    $(".cell").mouseover(function() {
        if ($(this).hasClass("blue")) {
            $(this).css("backgroundColor", "blue");
        }
        else if ($(this).hasClass("red")){
            $(this).css("backgroundColor", "red");
        }
        else {
            if (turn % 2 == 0)
                $(this).css("backgroundColor", "lightcoral");
            else
                $(this).css("backgroundColor", "deepskyblue");
        }
    });

    $(".cell").mouseout(function(){
        if ($(this).hasClass("blue")) {
            $(this).css("backgroundColor", "blue");
        }
        else if ($(this).hasClass("red")){
            $(this).css("backgroundColor", "red");
        } else
            this.style.removeProperty("background-color");
    });



    $(".cell").click(function(){
        x2 = parseInt($(this).attr("datax"));
        y2 = parseInt($(this).attr("datay"));
        if (x1 == 0 && y1 == 0){
            x1 = x2;
            y1 = y2;
            x2 = 0;
            y2 = 0;
        }
        else{
            var allowBlue = 0;
            var allowRed = 0;
            var l = Math.abs(x2-x1) + 1;
            var h = Math.abs(y2-y1) + 1;
            if (x1 > x2){
                x1 += x2;
                x2 = x1 - x2;
                x1 = x1 - x2;
            }
            if (y1 > y2){
                y1 += y2;
                y2 = y1 - y2;
                y1 = y1 - y2;
            }
            for (var ax = x1; ax <= x2; ax++){
                if ($("#" + ax + "-" + y1).hasClass("nearBlue") || $("#" + ax + "-" + y2).hasClass("nearBlue"))
                    allowBlue = 1;
                if ($("#" + ax + "-" + y1).hasClass("nearRed") || $("#" + ax + "-" + y2).hasClass("nearRed"))
                    allowRed = 1;
            }
            for (var ay = y1; ay <= x2; ay++){
                if ($(x1 + "-" + "#" + ay).hasClass("nearBlue") || $(x2 + "-" + "#" + ay).hasClass("nearBlue"))
                    allowBlue = 1;
                if ($(x1 + "-" + "#" + ay).hasClass("nearRed") || $(x2 + "-" + "#" + ay).hasClass("nearRed"))
                    allowRed = 1;
            }
            for (var cx = x1; cx <=x2; cx++){ //Проверка наложения на другие объекты
                for (var cy = y1; cy<=y2; cy++){
                    if ($("#" + cx + "-" + cy).hasClass("blue") || $("#" + cx + "-" + cy).hasClass("red")){
                        allowRed = 0;
                        allowBlue = 0;
                    }
                }
            }
            if (turn % 2 == 1) {  //Проверка на совпадение длины и ширины с кубами
                if (allowBlue == 1 && ((l == d1 && h == d2) || (h == d1 && l == d2))) {
                    scoreBlue = scoreBlue + h*l;
                    document.getElementById("scoreBlue").innerHTML = scoreBlue;
                }
                else
                    allowBlue = 0;
            } else{
                if (allowRed == 1 && ((l == d1 && h == d2) || (h == d1 && l == d2))) {
                    scoreRed = scoreRed + h*l;
                    document.getElementById("scoreRed").innerHTML = scoreRed;
                }
                else
                    allowRed = 0;
            } //Проверка на совпадение длины и ширины с кубами
            if ((turn%2 == 1 && allowBlue == 1) || (turn%2 == 0 && allowRed == 1))
                S = l*h;
                for (var cx = x1; cx<=x2; cx++){
                    for (var cy = y1; cy<=y2; cy++){
                        if (turn%2 == 1) {
                            if (allowBlue == 1) {
                                $("#" + cx + "-" + cy).addClass("blue");
                                $("#" + cx + "-" + cy).css("backgroundColor", "blue");
                                for (var nbx = x1; nbx <= x2; nbx++) {
                                    $("#" + nbx + "-" + parseInt(y1 - 1)).addClass("nearBlue");
                                    $("#" + nbx + "-" + parseInt(y2 + 1)).addClass("nearBlue");
                                }
                                for (var nby = y1; nby <= y2; nby++) {
                                    $("#" + parseInt(x1 - 1) + "-" + nby).addClass("nearBlue");
                                    $("#" + parseInt(x2 + 1) + "-" + nby).addClass("nearBlue");
                                }
                                action = 1;
                            }
                        }
                        else{
                            if (allowRed == 1) {
                                $("#" + cx + "-" + cy).addClass("red");
                                $("#" + cx + "-" + cy).css("backgroundColor", "red");
                                for (var nrx = x1; nrx <= x2; nrx++) {
                                    $("#" + nrx + "-" + parseInt(y1 - 1)).addClass("nearRed");
                                    $("#" + nrx + "-" + parseInt(y2 + 1)).addClass("nearRed");
                                }
                                for (var nry = y1; nry <= y2; nry++) {
                                    $("#" + parseInt(x1 - 1) + "-" + nry).addClass("nearRed");
                                    $("#" + parseInt(x2 + 1) + "-" + nry).addClass("nearRed");
                                }
                                action = 1;
                            }
                        }
                    }
                }
            x1 = 0;
            x2 = 0;
            y1 = 0;
            y2 = 0;
        }
        $(".blue").removeClass("nearBlue");
        $(".red").removeClass("nearRed");
        if (turn%2 == 1)
            $(this).css("backgroundColor", "deepskyblue");
        else
            $(this).css("backgroundColor", "lightcoral");
        passTurn();
        if (fieldLeft < 1){
            console.log("end");
            if (scoreRed > scoreBlue)
                document.getElementById("win").innerHTML = "Красные Выиграли!";
            else if (scoreBlue > scoreRed)
                document.getElementById("win").innerHTML = "Синие Выиграли!";
            else
                document.getElementById("win").innerHTML = "Ничья!";
        }
    });
}


function init() {
    var newElement = $("<table></table>");
    $("#field").append(newElement);
}

function rollDice(){
    if (rolled == 0) {
        d1 = parseInt(Math.random() * 6 + 1);
        d2 = parseInt(Math.random() * 6 + 1);
        document.getElementById("dice1").innerHTML = "Первый куб: " + d1;
        document.getElementById("dice2").innerHTML = "Второй куб: " + d2;
        rolled = 1;
    }
}

function over(){
    //console.log(this)
    this.style.backgroundColor="red";
    //cell.color
}