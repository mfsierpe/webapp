/**
 * This file is part of VertNet: https://github.com/VertNet/webapp
 * 
 * VertNet is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * VertNet is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Foobar.  If not, see: http://www.gnu.org/licenses
 */

// Defines and loads google and cartodb modules into global scope.
define([
  'jquery',
  'underscore'
], function ($, _) {
  
  var libs = [
    {
      name: 'maps',
      version: '3',
      options: { other_params: 'sensor=false' }
    },
    {
      name: 'visualization',
      version: '1',
      options: { packages: ['corechart'] }
    }
  ];

  return {

    /**
     * Loads the Google Maps API and then the CartoDB API. Fires the callback
     * after both are loaded.
     * 
     * @param cb The callback function.
     */
    init: function (cb) {

      // After each lib is loaded, get the cartodb lib.
      var done = _.after(libs.length, function () {
        require(['cartodb'], cb);
      });

      // Load the jsapi and then grab each lib.
      require(['https://www.google.com/jsapi?callback=?'
              + '&key=AIzaSyDJdVhfQhecwp0ngAGzN9zwqak8FaEkSTA'], function () {   
        _.each(libs, function (lib) {
          google.load(lib.name, lib.version,
                    _.extend(lib.options, { callback: done }));
          google.maps.visualRefresh = true;
        });
      });
    }
  }
});