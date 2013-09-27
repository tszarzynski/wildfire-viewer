var myApp = angular.module('myApp', []);

function CsvCtrl($scope, $filter) {
    // init
    // 
    window.scope = $scope;
    //
    $scope.sortingOrder = sortingOrder;
    $scope.reverse = false;
    $scope.filteredItems = [];
    $scope.groupedItems = [];
    $scope.itemsPerPage = 9;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.items = [];


    $scope.setFile = function(element) {
        $scope.$apply(function() {
            $scope.theFile = element.files[0];


            var reader = new FileReader();
            reader.onload = (function(theFile) {
                return function(e) {


                    var str = e.target.result; // load file values
                    var lines = str.split(/[\r\n|\n]+/); // split data by line
                    var header = str.match(/^(.*)$/m)[0];
                    header = header.replace(/[^\S\n]/gi, "_");
                    str = str.replace(/^(.*)$/m, header);

                    var jsonobject = csvjson.csv2json(str);
                    console.log(jsonobject);
                    $scope.items = jsonobject.rows;
                    $scope.search();

                    $scope.$apply();



                };
            })($scope.theFile);

            // Read in the image file as a data URL.
            reader.readAsText($scope.theFile);

        });
    };


    var parseFile = function(event) {

            var files = evt.target.files;
        };

    var searchMatch = function(haystack, needle) {
            if(!needle) {
                return true;
            }
            return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        };

    // init the filtered items
    $scope.search = function() {
        $scope.filteredItems = $filter('filter')($scope.items, function(item) {
            for(var attr in item) {



                if(searchMatch(item[attr].toString(), $scope.query)) return true;
            }
            return false;
        });
        // take care of the sorting order
        if($scope.sortingOrder !== '') {
            $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
        }
        $scope.currentPage = 0;
        // now group by pages
        $scope.groupToPages();
    };

    $scope.clearSearch = function() {

    };

    // calculate page in place
    $scope.groupToPages = function() {
        $scope.pagedItems = [];

        for(var i = 0; i < $scope.filteredItems.length; i++) {
            if(i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.filteredItems[i]];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
            }
        }
    };

    $scope.range = function(start, end) {
        var ret = [];
        if(!end) {
            end = start;
            start = 0;
        }
        for(var i = start; i < end; i++) {
            ret.push(i);
        }
        return ret;
    };

    $scope.prevPage = function() {
        if($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };

    $scope.nextPage = function() {
        if($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
    };

    $scope.setPage = function() {
        $scope.currentPage = this.n;
    };

    // functions have been describe process the data for display
    $scope.search();

    // change sorting order
    $scope.sort_by = function(newSortingOrder) {
        if($scope.sortingOrder == newSortingOrder) $scope.reverse = !$scope.reverse;

        $scope.sortingOrder = newSortingOrder;

        // icon setup
        $('th i').each(function() {
            // icon reset
            $(this).removeClass().addClass('icon-sort');
        });
        if($scope.reverse) $('th.' + new_sorting_order + ' i').removeClass().addClass('icon-chevron-up');
        else $('th.' + new_sorting_order + ' i').removeClass().addClass('icon-chevron-down');
    };
};
CsvCtrl.$inject = ['$scope', '$filter'];