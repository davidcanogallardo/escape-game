$(document).ready(function () {
    //SLIDER RANKING
    $(".container").on('click', '.level-slider img', function(e) {
        $(".container").find(".selected").removeClass("selected");
        $(e.currentTarget).addClass("selected");
        $(".container .level-name").text(e.currentTarget.id);
    });

});

