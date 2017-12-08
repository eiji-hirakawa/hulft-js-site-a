var socket = null;
$(function () {
  var protocol = location.protocol.replace("http", "ws");
  socket = new WebSocket(protocol + "//" + location.host + "/socket/");
  socket.onopen = function () {
    socket.send(JSON.stringify({
      protocol: "client",
      type: "connection"
    }));
  };
  $(".submit").on("click", function (ev) {
    if ($(".submit").hasClass("btn-disable"))
      return;
    var data = {
      protocol: "client",
      type: "question",
      id: ev.target.id,
      selects: []
    };
    $(".input-define").each(function (i, e) {
      if ($(e).prop("checked")) {
        data.selects.push({
          id: e.id.replace("q", ""),
          value: true
        });
      }
    });
    if($(".input-other").prop("checked")){
      var textbox = $(".case").find("input[type='text']");
      if(textbox.length > 0 && textbox.val().trim().length > 0){
        data.selects.push({
          id: $(".input-other").attr("id").replace("q", ""),
          value: textbox.val().trim()
        });
      }
    }
    socket.send(JSON.stringify(data));

    $(".submit").addClass("btn-disable");
  });

  socket.onmessage = (function (e) {
    var data = JSON.parse(e.data);
    if (data.protocol == "admin" && data.type == "question") {
      if (data.rows.length > 0) {
        $(".submit").attr("id", data.Id);
        $(".subject").html("<span class='index'>" + data.Index + "</span>" + data.Subject);
        $(".content").html(data.Content);
        $(".case").empty();
        var s = "";
        for (var i = 0; i < data.rows.length; i++) {
          var isOther = data.rows[i].IsOther == "1";
          var li = $("<li>");
          var label = $("<label>");
          var input = $("<input>").attr({
            "id": "q" + data.rows[i].QId,
            "class": isOther ? "input-other" : "input-define",
            "type": data.Type,
            "name": "ans",
          });
          var span = $("<span>").text(data.rows[i].Text);
          label.append(input);
          label.append(span);
          if (isOther) {
            var textbox = $("<input>").attr({
              "id": "q" + data.rows[i].QId,
              "type": "text"
            }).prop("disabled", true);
            label.append(textbox);
          }
          li.append(label);
          $(".case").append(li);
        }
        $(".case").find("input[name='ans']").on("click", function () {
          var textbox = $(".case").find("input[type='text']");
          if (textbox.length > 0) {
            var ischk = $(".case").find("input.input-other").is(":checked");
            textbox.prop('disabled', !ischk);
          }
        });
        $(".close").hide();
        $(".submit").removeClass("btn-disable");
      }
    }
  });
  $(".close").show();
});