
  var socket = null;
$(function () {
  socket = new WebSocket("wss://" + location.host + "/socket/");
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
    $(".input-other").each(function (i, e) {
      var text = $(e).val();
      if (text.length > 0) {
        data.selects.push({
          id: e.id.replace("q", ""),
          value: text
        });
      }
    });
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
            "type": isOther ? "text" : data.Type,
            "name": "ans",
          });
          var span = $("<span>").text(data.rows[i].Text);
          if (isOther) {
            label.append(span);
            label.append(input);
          } else {
            label.append(input);
            label.append(span);
          }
          li.append(label);
          $(".case").append(li);
        }
        $(".close").hide();
        $(".submit").removeClass("btn-disable");
      }
    }
  });
  $(".close").show();
});