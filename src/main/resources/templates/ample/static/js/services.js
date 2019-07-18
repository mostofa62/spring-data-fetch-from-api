(function() {
  // 'use strict';
var hotelComponent;

hotelComponent = angular.module('HotelComponent', []);
/* Feature Selection Service */

hotelComponent.factory('FeatureDataService',['$http' ,function($http) {
  return ({
    hotelFeatures: function(id) {
      return $http.get(appEndPoint+'features/'+id);  //1. this returns promise
    },

    allFeatures: function() {
    	
    	return $http.get(appEndPoint+'features');
    },
	
	selectedFeatures:function(id, data){
		
		return $http({
			method : "POST",
			url : appEndPoint+'features/'+id,
			data : angular.toJson(data),
			headers : {
				'Content-Type' : 'application/json'
			}
		});
	}

  });
}]);

/* Room Selection Service */
hotelComponent.factory('RoomDataService',['$http' , function($http) {
  
  return ({
  	hotelRoomType:function(id){
  		return $http.get(appEndPoint+'roomtypes/'+id);
  	},
  	hotelRoomTypeRoom:function(id){
  		return $http.get(appEndPoint+'roomtypes/rooms/'+id);
  	}

  });

}]);

/* Home Data Service */



/* hotel service */
hotelComponent.factory('HotelDataService',['$http','calendar' ,function($http,calendar) {
  return ({
    roomtypedata: function(id) {
      return $http.get(appEndPoint+'roomtypes/'+id);  //1. this returns promise
    },

    searchbookdata: function(sdate, edate, rmtypeid) {
    	
    	calendar.fromto(sdate, edate);
    },
    
    bookingSave : function(hoteId, fromDate, toDate, roomIds){
    	var data = {fromDate: fromDate, toDate: toDate, hotelId:hotelId, rooms: roomIds};    	
    	//data[_csrf_param_name] = _csrf_token;
    	return $http({
			method : "POST",
			url : appEndPoint+'reservation/booking',
			data : data,
			headers : {
				'Content-Type' : 'application/json'
			}
		});
    	
    }
    

  });
}]);

/* hotel cart */
hotelComponent.factory('Cart',['$http',function($http) {
	return ({
		
		bookingCartStepOne: function(hoteId, fromDate, toDate, roomIds){
			var data = {fromDate: fromDate, toDate: toDate, hotelId:hotelId, rooms: roomIds};
			
			return $http({
				method : "POST",
				url : appEndPoint+'cart',
				data : data,
				headers : {
					'Content-Type' : 'application/json'
				}
			});
		},
		
		searchCustomer:function(customerName){
			return $http.get(appEndPoint+'customers/search?qc='+customerName);
		},
		
		saveNewCustomer:function(data){
			
			return $http({
				method : "POST",
				url : appEndPoint+'customers/new',
				data : data,
				/*
				headers : {
					'Content-Type' : 'application/json'
				}*/
			});
		},
		
		saveExistingCustomerReservation:function(data){
			return $http({
				method : "POST",
				url : appEndPoint+'customers/existing',
				data : data,
				/*
				headers : {
					'Content-Type' : 'application/json'
				}*/
			});
		}
		
	});
}]);

/* Order  */

hotelComponent.factory('Order',['$http',function($http) {
	return ({

		createOrder:function(data){
			
			return $http({
				method : "POST",
				url : appEndPoint+'order/create',
				data : data,
				/*
				headers : {
					'Content-Type' : 'application/json'
				}*/
			});
			
		},
		
	});
}]);


/* Shared Data */
hotelComponent.factory('Data', function(){
	var data =
    {
        ReservationId: null,
        /* Reset Data */
        startDate:null,
        endDate:null,
        rooms:[],
    };
	
	return {
        getReservationId: function () {
            return data.ReservationId;
        },
        setReservationId: function (ReservationId) {
            data.ReservationId = ReservationId;
        },
        /* Reset Data */
        getStartDate: function () {
            return data.startDate;
        },
        setStartDate: function (startDate) {
            data.startDate = startDate;
        },
        
        getEndDate: function () {
            return data.startDate;
        },
        setEndDate: function (endDate) {
            data.endDate = endDate;
        },
        getRooms: function () {
            return data.rooms;
        },
        setRooms: function (rooms) {
            data.rooms = rooms;
        },
        
    };
	
});

/* Calender Service */
hotelComponent.service('calendar', function() {
	var c = $('#calendar');
	var options = {
		//selectable: true,
		height: 350,
		aspectRatio: 1,
		defaultView: 'month',
		header: {
			left: 'title', 
			right: 'prev,next today'
		},
		views: {
			month:{
				titleFormat: 'MMM D, Y',
				titleRangeSeparator: ' to ',
			}
		},
		viewRender: function( view, element ) {
			console.log('new date range start : '+ view.start+ 'new date range end : '+view.end);
		},
		viewDisplay: function(view){
	        $('.fc-day').filter(
	          function(index){
	          return moment( $(this).data('date') ).isBefore(moment(),'day') 
	        }).addClass('fc-other-month');
		},
		selectAllow: function(select) {
      		return moment().diff(select.start) <= 0
   		} 


	};

	return ({
		fromto:function(sdate, edate){
			
			
			enddate = moment(edate).add(1, 'days').format('YYYY-MM-DD');
			c.fullCalendar('select',sdate, enddate);
			//c.fullCalendar('renderEvent',{sdate, enddate},true);
			//c.fullCalendar('option','visibleRange',{start: sdate, end: enddate});
		},
		render:function(){

			c.fullCalendar(options);
		}

	});

});

/* Select Customer  */
hotelComponent.directive('customerSelect2', function() {
	 return {
		 
		 restrict: 'A',
		 //scope : false,
		 link: function (scope, element, attrs) {
			 
			 
			 
			 element.select2({
				 //resultsAdapter: $.fn.select2.amd.require("CustomResultProcess"),
				 placeholder: "Search for a customer",
				 allowClear: true,
				 /*matcher:function(params, data){
					 console.log(params);
					 return null;
				 },*/
				 minimumInputLength: 3,
				 ajax: {
					 url : appEndPoint+'customers/search',
					 dataType: 'json',
					 delay: 250,
					 data: function (params) {
					      var query = {
					    	qc: params.term					        
					      }

					      // Query parameters will be ?search=[term]&type=public
					      return query;
				    },
				    
				    processResults: function (data) {
				    	/*var myResults = [];
				    	$.each(data, function (index, item) {
				    		
				    		myResults.push({
		                        'id': item.id,
		                        'text': item.title+" "+item.firstName+" "+item.lastName,
		                        'data':item
		                    });
				    	});
				    	return {results: myResults};*/
				    	/*var data = $.map(data, function (obj) {
				            obj.id = obj.id;//some id you don't have right now
				            obj.text = obj.firstName;
				            return obj;
				        });*/
			            return {results: data};
			        }
				   
			 		
				 },
				 escapeMarkup: function (markup) { return markup; },
				 templateResult: function(data){
					 if (data.loading) {
						 return data.text;
					 }
					 
					 if(!data.id){
						 return data.text;
					 }
					 //console.log(items);
					 //data =items.data; 
					 var markup = "<table class='table table-bordered'><tr>";
					 markup += "<th>"+data.title+" "+data.firstName+" "+data.lastName+"</th>";
					 markup += "</tr></table>";
					 return markup;
				 },
				 templateSelection:function(data){
					 if (!data.id) {
						 return data.text;
					 }
					 var $state = $("<span class='badge badge-info'>"+data.title+" "+data.firstName+" "+data.lastName+"</span>");
					 return $state;
					 
				 },
				 /*tags:true,
				 createTag: function (params) {
			         console.log(params);   
					 //return false;
					 return params.term;
		         },*/
				 language: {
					 	inputTooShort: function () {
						    return "You must enter more characters...";
						},
					    noResults: function () {
					    	//console.log(element.data('select2').results.lastParams.term);
					    	term = element.data('select2').results.lastParams.term;
					    	len = term.length;
					    	if(len >=3){
					    		scope.$apply(function() {
									 scope.showForm = false;
									 scope.customer.name = term;
									 scope.customerObj = null;
								 });
					    	}
					    	return '<span class="label label-warning">'+term+' : result not found!</span>'
					    },
					    /*searching: function (params) {
					    	if(params.term != undefined && params.term.length >=3){
					    		console.log(params); 
					    	}
					    }*/
				  }
				
				 /*formatNoMatches: function() {
					 //console.log(term);
					 return "No Results Found <a href='#' class='btn btn-danger'>Use it anyway</a>";
				 }*/
				 
			 });
			 
			 
			 element.on('select2:select', function (e) {
				 
				 var data = e.params.data;
				 //console.log(scope);
				/* scope.$watch(function () { return scope.customer.name; }
						 , function (value) {
							 //scope.customerObj = data;
							 scope.customer.name = data.firstName;
				 });*/
				 scope.$apply(function() {
					 scope.customerObj = data;
					 scope.customer.name = data.firstName;
				 });
				 
				 /*scope.$watch('customer.name', function(newVal, oldVal){
					 scope.customer.name = newVal;
	             });*/
			 });
			 
			 element.on('select2:unselect', function (e) {
				 
				 //var data = e.params.data;
				 //console.log(scope);
				/* scope.$watch(function () { return scope.customer.name; }
						 , function (value) {
							 //scope.customerObj = data;
							 scope.customer.name = data.firstName;
				 });*/
				 scope.$apply(function() {
					 scope.customerObj = null;
					 scope.customer.name = '';
				 });
				 
				 /*scope.$watch('customer.name', function(newVal, oldVal){
					 scope.customer.name = newVal;
	             });*/
			 });
			 
			 /*element.on("select2-highlight", function(e) {
				 console.log("highlighted val=" + e.val + " choice=" + e.choice.text);
			 });*/
			
		 }
		 
	 };

});




}).call(this);