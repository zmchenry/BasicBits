/**
* Function to contain all content. Thanks Paul Irish (10 Things I Learned From the jQuery Source)
*/
(function(window, document, undefined) {
   'use strict';
   var $$ = document.querySelectorAll.bind(document);
   var Model = function() {
      /**
      * @param name
      * @param {String} imagePath Where the image is located
      * @param {Boolean} (Optional) reposition Needs to be repositioned so it is centered in tile
      * @param pageLink
      * @returns {{name: *, imagePath: *, reposition: boolean, pageLink: *}}
      * @constructor
      */
      var Tile = function(name, imagePath, reposition, type, pageLink) {
         return {
            name: name,
            imagePath: imagePath,
            reposition: reposition ? reposition : false,
            type: type,
            pageLink: pageLink ? pageLink : '#'
         };
      };

      return {
         Tile: Tile
      };
   };

   var Controller = function(model) {
      var tiles =
      [new model.Tile('Angular Todo', 'images/tiles/angtodo.png', true, 'link', 'https://zmchenry.github.io/Angular-Todo'),
      new model.Tile('Imgur Front Page', 'images/tiles/imgurfrontpage.png', false, 'link', 'https://zmchenry.github.io/imgur'),
      new model.Tile('Intuit In To Eat Project', 'images/tiles/intoeat_tile.png', true, 'link', 'https://zmchenry.github.io/InToEat'),
      new model.Tile('First Internship', 'images/tiles/iri.png', false , 'post',  'iri-internship'),
      new model.Tile('New Semester Overview', 'images/tiles/new_semester_tile.png', false, 'post', 'new-semester'),
      new model.Tile('Recamans Sequence Project', 'images/tiles/recaman_tile.png', false, 'post', 'recaman'),
      new model.Tile('Crime Scene Investigation Tile', 'images/tiles/crime_scene_tile.png', false, 'post', 'crime-scene'),
      new model.Tile('Propositional Expression Evaluator', 'images/tiles/propositional_tile.png', false, 'post', 'propositional'),
      new model.Tile('Backbone Todo Project', 'images/tiles/backbonetodo_tile.png', true, 'link','https://zmchenry.github.io/BackboneTodo'),
      new model.Tile('TJU Programming Contest', 'images/tiles/tju_tile.png', false, 'post', 'tju'),
      new model.Tile('Snake Game', 'images/tiles/snake_tile.png', false, 'post', 'snake'),
      new model.Tile('LearnYouNode', 'images/tiles/learnyounode.png', false, 'post', 'learnyounode')];
      Element.prototype.on = Element.prototype.addEventListener;


      function setupPageAndListeners() {
         insertMasonryTiles();
         window.addEventListener('scroll', function() {
            var titleBar = $$('.title-bar')[0], container = $$('.container')[0];
            if(container.getBoundingClientRect().top < 0) {
               helperObj.removeClass(titleBar, 'hidden');
               helperObj.addClass(titleBar, 'fixed');
            } else {
               helperObj.removeClass(titleBar, 'fixed');
            }
         });
      }

      function insertGist(item) {
         var gists = item.find('.gist');
         if(!document._write) {
            document._write = document.write;
         }
         // Shimming out document.write to make it not evil
         document.write = function (str) {
            document.getElementsByClassName('gist')[i - 1].innerHTML += str;
         };
         for(var i = 0, len = gists.length; i < len; i++) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = $(gists[i]).data('gistsrc');
            gists[i].appendChild(script);
            console.log('script added');
         }
         return item;
      }

      function masonryClickAction(e) {
         if(e.target.parentNode.tagName === 'A'){
            return;
         }
         e.preventDefault();
         var overlay = $$('.article-overlay')[0], article = $$('.article')[0], idName = e.target.parentNode.attributes.item('data-articlelink').value;
         helperObj.addClass($$('body')[0], 'no-scroll');
         helperObj.removeClass(article, 'hidden');
         $('#' + idName).load('articles/' + idName + '.html', function() {
            insertGist($('#' + idName)).removeClass('hidden');
         });
         helperObj.removeClass(overlay, 'hidden').addEventListener('click', function() {
            helperObj.addClass(overlay, 'hidden');
            helperObj.addClass(article, 'hidden');
            helperObj.addClass($$('#' + idName)[0], 'hidden');
            helperObj.removeClass($$('body')[0], 'no-scroll');
         });
      }

      function addOverlayListener(elements) {
         for(var i = 0, len = elements.length; i < len; i++) {
            elements[i].addEventListener('click', masonryClickAction);
         }
      }

      function insertMasonryTiles() {
         var masonryContainer = $$('.masonry-container')[0], listString = '<ol>{{item}}</ol>';
         var listItems = '';
         for(var i = 0, len = tiles.length; i < len; i++) {

            var item = (tiles[i].type === 'link') ?
            '<li><a href=' + tiles[i].pageLink + '><img ' + (tiles[i].reposition ? 'class=reposition' : '') +
            ' src=' + tiles[i].imagePath +
            ' alt=' + tiles[i].name + '/></a></li>' :
            '<li data-articlelink="' + tiles[i].pageLink + '"><img ' + (tiles[i].reposition ? 'class=reposition' : '') +
            ' src=' + tiles[i].imagePath +
            ' alt=' + tiles[i].name + '/></li>';

            listItems += item;
         }
         masonryContainer.innerHTML = listString.replace('{{item}}', listItems);
         addOverlayListener($$('.masonry-container li'));
      }
      return {
         setupPageAndListeners: setupPageAndListeners
      };
   };

   var HelperFunctions = function() {
      return {
         /**
         *
         * @param el
         * @param className
         * @returns {*}
         */
         addClass: function(el, className) {
            if(el && className && !el.classList.contains(className)) {
               el.classList.add(className);
               return el;
            }
         },

         /**
         *
         * @param el
         * @param className
         * @returns {*}
         */
         removeClass: function(el, className) {
            if(el && className && el.classList.contains(className)) {
               el.classList.remove(className);
            }
            return el;
         },

         /**
         * Use so that certain actions are not called continuously but called
         * only after the wait is up.
         * @param {Function} func The function to be called
         * @param {Number} wait Amount of time in ms to ignore calls
         * @param {Boolean} immediate Call on tail end or leading end
         * @returns {Function}
         */
         debounce: function(func, wait, immediate) {
            var timeout;
            return function() {
               var context = this, args = arguments;
               var later = function() {
                  timeout = null;
                  if (!immediate) {
                     func.apply(context, args);
                  }
               };
               var callNow = immediate && !timeout;
               clearTimeout(timeout);
               timeout = setTimeout(later, wait);
               if (callNow) {
                  func.apply(context, args);
               }
            };
         },

         fadeIn: function(el) {
            el.style.opacity = 0;

            var last = +new Date();
            var tick = function() {
               el.style.opacity = + el.style.opacity + (new Date() - last) / 400;
               last = +new Date();

               if (+el.style.opacity < 1) {
                  if (window.requestAnimationFrame) {
                     requestAnimationFrame(tick);
                  } else {
                     setTimeout(tick, 500);
                  }
               }
            };

            tick();
         }

      };
   };


   var model = new Model(), helperObj = new HelperFunctions();
   var controller = new Controller(model);
   controller.setupPageAndListeners();


})(window, document, undefined);
