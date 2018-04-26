$(function() {
  $("#btn").on("click", function(evt) {
    evt.preventDefault();

    var $container = $(".show");
    $.ajax({
      url: "/process",
      type: "POST",
      data: {
        name: "name"
      },
      success: function(data) {
        console.log(data);
        if (data.success) {
          $container.html("<h2>Thank You success </h2>");
        } else {
          $container.html("There was a problem");
        }
      },
      error: function() {
        $container.html("There was a problem");
      }
    });
  });
});
