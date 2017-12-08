var CurrentSheet = {
	id: -1,
	chart: null
}
var socket = null;
$(function () {
	var protocol = location.protocol.replace("http", "ws");
	socket = new WebSocket(protocol + "//" + location.host + "/socket/");
	// 接続確立
	socket.onopen = function () {
		socket.send(JSON.stringify({
			protocol: "admin",
			type: "connection"
		}));
	};
	socket.onmessage = (function (e) {
		var data = JSON.parse(e.data);
		if (data.protocol == "client" && data.type == "question") {
			if (CurrentSheet.id == data.id && CurrentSheet.chart) {
				for (var i = 0; i < CurrentSheet.chart.dataProvider.length; i++) {
					var dp = CurrentSheet.chart.dataProvider[i];
					var sel = findSelectionItem(dp.QId, data.selects);
					if (sel) {
						dp.Aggregate++;
						if (dp.IsOther) {
							$("#o" + CurrentSheet.id).append("<span>" + sel.value + "</span>");
						}
					}
				}
				CurrentSheet.chart.validateData();
			}
		}
	});

	function findSelectionItem(qid, selects) {
		for (var i = 0; i < selects.length; i++) {
			if (selects[i].id == qid)
				return selects[i];
		}
		return null;
	}
	$("#demo2").tabs({
		orientation: "vertical"
	});
	$(".tabhead").on("click", function (ev) {
		var $a = $(ev.target);
		var id = $a.attr("href").replace("#q", "");
		getQuestion(id);
	});
	$(".submit").on("click", function (ev) {
		var id = ev.target.id.replace("submit-", "");
		$.post({
			type: "POST",
			url: "/admin",
			contentType: 'application/json',
			data: JSON.stringify({
				"id": id
			}),
		}).done(function (data, textStatus, jqXHR) {
			alert("success");
		}).fail(function (jqXHR, textStatus, errorThrown) {
			alert("failed:" + textStatus);
		});
	});
	$(".save").on("click", function (ev) {
		if (!CurrentSheet.chart)
			return;
		var others = [];
		$("#o" + CurrentSheet.id).find("span").each(function (i, e) {
			others.push($(e).text());
		});
		var senddata = {
			id: ev.target.id.replace("save-", ""),
			data: CurrentSheet.chart.dataProvider,
			others: others.join(',')
		};
		$.post({
			type: "POST",
			url: "/update",
			contentType: 'application/json',
			data: JSON.stringify(senddata)
		}).done(function (data, textStatus, jqXHR) {
			alert("success");
		}).fail(function (jqXHR, textStatus, errorThrown) {
			alert("failed:" + textStatus);
		});
	});
	$(".clear").on("click", function (ev) {
		if (!CurrentSheet.chart)
			return;
		$("#o" + CurrentSheet.id).empty();
		for (var i = 0; i < CurrentSheet.chart.dataProvider.length; i++) {
			CurrentSheet.chart.dataProvider[i].Aggregate = 0;
		}
		CurrentSheet.chart.validateData();
		var senddata = {
			id: ev.target.id.replace("clear-", ""),
			data: CurrentSheet.chart.dataProvider,
			others: ""
		};
		$.post({
			type: "POST",
			url: "/update",
			contentType: 'application/json',
			data: JSON.stringify(senddata)
		}).done(function (data, textStatus, jqXHR) {
			alert("success");
		}).fail(function (jqXHR, textStatus, errorThrown) {
			alert("failed:" + textStatus);
		});
	});

	function initializeQuestion(id, data) {
		$("#c" + id).empty();
		var ol = $("<ol>");
		for (var i = 0; i < data.rows.length; i++) {
			var row = data.rows[i];
			var pbtn = $("<span>+</span>")
				.attr("id", "pb-" + row.QId)
				.addClass("pmbtn")
				.on("click", function (ev) {
					updateDataProvider(ev.target.id.replace("pb-", ""), 1);
				});
			var mbtn = $("<span>-</span>")
				.attr("id", "mb-" + row.QId)
				.addClass("pmbtn")
				.on("click", function (ev) {
					updateDataProvider(ev.target.id.replace("mb-", ""), -1);
				});
			var btnwrap = $("<div>")
				.addClass("btnwrap")
				.append(pbtn)
				.append(mbtn);
			var li = $("<li>").append(row.Text).append(btnwrap);
			ol.append(li);
		}
		$("#c" + id).append(ol);

		function updateDataProvider(id, val) {
			if (CurrentSheet.chart) {
				for (var i = 0; i < CurrentSheet.chart.dataProvider.length; i++) {
					if (CurrentSheet.chart.dataProvider[i].QId == id) {
						CurrentSheet.chart.dataProvider[i].Aggregate += val;
						CurrentSheet.chart.validateData();
						break;
					}
				}
			}
		}
	}

	function initializeGraph(id, data) {
		$("#g" + id).empty();
		$("#o" + id).empty();
		CurrentSheet.id = id;
		CurrentSheet.chart = AmCharts.makeChart("g" + id, {
			"theme": "none",
			"type": "serial",
			"dataProvider": data.rows,
			"valueAxes": [{
				"title": "アンケート結果"
			}],
			"graphs": [{
				"labelText": "[[Aggregate]]",
				"fillAlphas": 1,
				"lineAlpha": 0.2,
				"title": "Aggregate",
				"type": "column",
				"valueField": "Aggregate"
			}],
			"rotate": true,
			"categoryField": "Text",
			"categoryAxis": {
				"gridPosition": "start",
				"fillAlpha": 0.05,
				"position": "left"
			}
		});
		if(data.others.length > 0){
			var others = data.others.split(",");
			for(var i = 0; i < others.length; i++){
				$("#o" + id).append("<span>" + others[i] + "</span>");
			}
		}
	}

	function getQuestion(id) {
		$.post({
			type: "POST",
			url: "/question",
			contentType: 'application/json',
			data: JSON.stringify({
				"id": id
			}),
		}).done(function (data, textStatus, jqXHR) {
			initializeQuestion(id, data);
			initializeGraph(id, data);
		}).fail(function (jqXHR, textStatus, errorThrown) {
			alert("failed:" + textStatus);
		});
	}
	getQuestion(1);
});


(function (factory) {
	if (typeof define === "function" && define.amd) {
		define([
			"jquery",
			"jquery-ui/widget",
			"jquery-ui/tabs"
		], factory);
	} else {
		factory(jQuery);
	}
}(function ($) {

	return $.widget("ui.tabs", $.ui.tabs, {
		options: {
			orientation: "horizontal"
		},
		_create: function () {
			this._super();
			this._handleOrientation();
		},
		_handleOrientation: function () {
			this.element.toggleClass("ui-tabs-vertical",
				this.options.orientation === "vertical");
		},
		_setOption: function (key, value) {
			this._superApply(arguments);
			if (key === "orientation") {
				this._handleOrientation();
			}
		},
		_destroy: function () {
			this._super();
			this.element.removeClass("ui-tabs-vertical");
		}
	});

}));