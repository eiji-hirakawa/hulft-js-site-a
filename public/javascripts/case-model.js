angular.module('CaseModel', [])
    .controller("CaseController", ($scope) => {
        $scope.accept = true;
        $scope.index = 0;
        $scope.subject = "subject ◆○△×＃＄％";
        $scope.content = "content◆○△×＃＄％\n◆○△×＃＄％◆○△×＃＄％◆○△×＃＄％◆○△×＃＄％◆○△×＃＄％◆○△×＃＄％\n◆○△×＃＄％◆○△×＃＄％◆○△×＃＄％";
        $scope.choices = [
            {
                text: "choice 1",
                checked: false
            },
            {
                text: "choice 2",
                checked: false
            },
            {
                text: "choice 3",
                checked: false
            },
        ];
        $scope.type = "checkbox"
        $scope.OtherwiseOption = false,
        $scope.multiple = false,
        $scope.submit = () => {
            console.log("submit");
            $scope.choices.forEach(_ => {
                console.log("%s: %s", _.text, _.checked);
            });
            $scope.accept = false;
        };
    });
