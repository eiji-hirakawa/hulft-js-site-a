
var socket = io("wss://" + window.location.hostname + ":3200");
// var socket = io(window.location.protocol + "://" + window.location.hostname + ":3200");
  $(function () {
    $(".submit").on("click", function (ev) {
      if ($(".submit").hasClass("btn-disable"))
        return;
      var data = {
        id: ev.target.id,
        selects: []
      };
      $(".input-define").each(function (i, e) {
        if ($(e).prop("checked")) {
          data.selects.push({
            id:e.id.replace("q", ""),
            value: true
          });
        }
      });
      $(".input-other").each(function (i, e) {
        var text = $(e).val();
        if (text.length > 0) {
          data.selects.push({
            id:e.id.replace("q", ""),
            value: text
          });
        }
      });

      socket.emit("client2admin", data);
      $(".submit").addClass("btn-disable");
    });

    socket.on("admin2client", function (data) {
      console.log(data);
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
            "id" : "q" + data.rows[i].QId,
            "class": isOther ? "input-other" : "input-define",
            "type" : isOther ? "text" : data.Type,
            "name": "ans",
          });
          var span = $("<span>").text(data.rows[i].Text);
          if(isOther){
            label.append(span);
            label.append(input);
          }
          else{
            label.append(input);
            label.append(span);
          }
          li.append(label);
          $(".case").append(li);
        }
        $(".close").hide();
        $(".submit").removeClass("btn-disable");
      }
    });
    $(".close").show();
  });