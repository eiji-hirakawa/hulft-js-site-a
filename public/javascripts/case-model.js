
var socket = io("localhost:3100");
// var socket = io("-a.herokuapp.com:3100");

angular.module('CaseModel', [])
    .controller("CaseController", ($scope) => {
        $scope.accept = true;
        $scope.id = 0;
        $scope.index = 0;
        $scope.subject = "";
        $scope.content = "";
        $scope.choices = [];
        $scope.type = "checkbox";
        $scope.OtherwiseOption = false;
        $scope.multiple = false;
        $scope.submit = () => {
            socket.emit('chat message', "case-model submit");
            console.log("submit");
            $scope.choices.forEach(_ => {
                console.log("%s: %s", _.text, _.checked);
            });
            $scope.accept = false;
        };
        socket.on("admin2client", function(rows) {
            console.log(rows);
            if(rows.length > 0)
            {
                var row = rows[0];
                $scope.index = row.Index;
            }
        });
    });
