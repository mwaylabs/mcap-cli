// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var dependencies = ['ionic', 'starter.controllers'];
dependencies.push('todos');
//mcap:dependencies

angular.module('starter', dependencies)

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.home', {
      url: '/home',
      views: {
        'tab-home': {
          templateUrl: 'templates/tab-home.html',
          controller: 'HomeCtrl'
        }
      }
    })

    .state('tab.info', {
      url: '/info',
      views: {
        'tab-info': {
          templateUrl: 'templates/tab-info.html',
          controller: 'InfoCtrl'
        }
      }
    })

    .state('tab.todos', {
    url: '/todos',
    views: {
        'tab-home': {
            templateUrl: 'modules/todos/views/todos_list.html',
            controller: 'TodosCtrl'
        }
    }
})

.state('tab.todosNew', {
    url: '/todos/new',
    views: {
        'tab-home': {
            templateUrl: 'modules/todos/views/todos_edit.html',
            controller: 'TodosCtrlNew'
        }
    }
})

.state('tab.todosDetail', {
    url: '/todos/:todoId',
    views: {
        'tab-home': {
            templateUrl: 'modules/todos/views/todos_detail.html',
            controller: 'TodosCtrlDetail'
        }
    }
})
.state('tab.todosEdit', {
    url: '/todos/:todoId/edit',
    views: {
        'tab-home': {
            templateUrl: 'modules/todos/views/todos_edit.html',
            controller: 'TodosCtrlEdit'
        }
    }
})
    //mcap:router

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});
