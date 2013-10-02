var myApp = angular.module('myApp', []);

function CsvCtrl($scope, $filter) {

    window.scope = $scope;
    //
    $scope.reverse = false;
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 9;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.items = [];

    $scope.localisations = [{
        id: 'UK',
        country: "Country",
        firstName: 'First_Name',
        lastName: 'Last_Name',
        email: 'Email',
        phone: 'Telephone_number',
        photo: 'Upload_photo'
    }, {
        id: 'NL',
        country: "Land",
        firstName: 'Voornaam',
        lastName: 'Achternaam',
        email: 'Email',
        phone: 'Telefoonnummer',
        photo: 'Upload_foto'
    }];
    $scope.localisation = null;


    $scope.setFile = function(element) {
        $scope.$apply(function() {
            $scope.theFile = element.files[0];


            var reader = new FileReader();
            reader.onload = (function(theFile) {
                return function(e) {


                    var str = e.target.result; // load file values
                    str = str.replace(/\t/g, ',');
                    var lines = str.split(/[\r\n|\n]+/); // split data by line
                    var header = str.match(/^(.*)$/m)[0];
                    header = header.replace(/[^\S\n]/gi, "_");
                    str = str.replace(/^(.*)$/m, header);

                    $scope.localisation = $scope.detectLanguage(header);
                    str = $scope.translateFile(str);


                    var jsonobject = csvjson.csv2json(str);
                    console.log(jsonobject);
                    $scope.items = jsonobject.rows;
                    $scope.search();

                    $scope.$apply();

                };
            })($scope.theFile);

            reader.readAsText($scope.theFile);

        });
    };

    $scope.detectLanguage = function(header) {

        for (var i in $scope.localisations) {

            var localisation = $scope.localisations[i];

            if (header.indexOf(localisation.country) !== -1) return localisation;

        }

        return null;
    };

    $scope.translateFile = function(str) {

        str = str.replace($scope.localisation.firstName, 'First_Name');
        str = str.replace($scope.localisation.lastName, 'Last_Name');
        str = str.replace($scope.localisation.email, 'Email');
        str = str.replace($scope.localisation.phone, 'Telephone_number');
        str = str.replace($scope.localisation.photo, 'Upload_photo');

        return str;
    };

    var searchMatch = function(haystack, needle) {
        if (!needle) {
            return true;
        }
        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    };


    $scope.search = function() {
        $scope.filteredItems = $filter('filter')($scope.items, function(item) {
            for (var attr in item) {
                if (searchMatch(item[attr].toString(), $scope.query)) return true;
            }
            return false;
        });
       
        $scope.currentPage = 0;

        $scope.groupToPages();
    };

    $scope.clearSearch = function() {
        $scope.query = "";
        $scope.search();
    };


    $scope.groupToPages = function() {
        $scope.pagedItems = [];

        for (var i = 0; i < $scope.filteredItems.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.filteredItems[i]];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
            }
        }
    };

    $scope.range = function(start, end) {
        var ret = [];
        if (!end) {
            end = start;
            start = 0;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }
        return ret;
    };

    $scope.prevPage = function() {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };

    $scope.nextPage = function() {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
    };

    $scope.setPage = function() {
        $scope.currentPage = this.n;
    };

    $scope.search();
}
CsvCtrl.$inject = ['$scope', '$filter'];