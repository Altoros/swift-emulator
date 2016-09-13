angular.module('MyBlockchain', [])

// scope:
// = is for two-way binding
// @ simply reads the value (one-way binding)
// & is used to bind functions
.directive('blockchainLog', function($document){
  return {
    restrict:'E',
    replace: false,
    scope: true,
    // scope: { name:'=', id:'=' },
    template: '<div class="bc-wrapper" id="footerWrap" ng-init="ctl.init()" d-ng-click="ctl.onClick($event)">'
                +'<div id="bc-wrapper-block">'

                  +'<div id="details" ng-show="!!ctl.blockInfo" >'
                    +'<p class="blckLegend"> Block: {{ctl.blockInfo.txid}}</p>'
                    +'<hr class="line">'
                    +'<p>Created: {{ctl.blockInfo.timestamp.seconds}}</p>'
                    +'<p> TXID: {{ctl.blockInfo.txid}}</p>'
                    +'<p> Type:  {{ctl.blockInfo.type}}</p>'
                    +'<p> Confidentiality Level:  {{ctl.blockInfo.confidentialityLevel}}</p>'
                  +'</div>'


                  // +'<div class="block" style="opacity: 1; left: 36px;">016</div>'
                  // +'<div class="block" style="opacity: 1; left: 72px;">017</div>'
                  // +'<div class="block" style="opacity: 1; left: 108px;">018</div>'
                  // +'<div class="block" style="opacity: 1; left: 144px;">019</div>'
                  // +'<div class="block" style="opacity: 1; left: 180px;">020</div>'
                  // +'<div class="block" style="opacity: 1; left: 216px;">021</div>'
                  // +'<div class="block lastblock" style="opacity: 1; left: 252px;">022</div>'
                +'</div>'
              +'</div>',
    controllerAs: 'ctl',
    controller: function($scope, $element, $attrs, $transclude, $rootScope){
      var ctl = this;

      var clicked=false;
      var blockCount = 0;
      var blockWidth = 36;

      ctl.blockInfo = null;

      setInterval(function(){
        removeExtraBlocks();
      }, 2000);

      /**
       *
       */
      ctl.init = function(){
        var socket = io('ws://'+location.hostname+':8155/');
        socket.emit('hello', 'Hi from client');

        socket.on('hello', function(payload){
          console.log('server hello:', payload);
        });

        socket.on('chainblock', function(payload){
          console.log('server chainblock:', payload);
          $rootScope.$emit('chainblock', payload);
          addChainblocks(payload);
        });
      };


      // demo
      ctl.onClick = function(e){

        // demo chaincode!
        addChainblocks(responseExample);
      };





      /**
       * @param chainblock
       */
      function addChainblocks(chainblock){
        var width = $(document).width();
        var tx = chainblock && chainblock.block && chainblock.block.transactions || [];

        $element.find('#bc-wrapper-block').append( tx.map(function(item){
          var $el = _blockHtml(item).css({left: '+='+width }).animate({ left: '-='+width } );
          blockCount++;
          return $el;
        }));
      }

      function _blockHtml(tx){
        return $('<div class="block">'+tx.txid.substr(0,3)+'</div>')
                  .css({left: (blockCount * blockWidth)})
                  .click(_onBlockClick)
                  .hover(getBlockHoverIn(tx), onBlockHoverOut);
      }



      function _onBlockClick(e){
        clicked = !clicked;
        return;

        //demo animation
        var $block = $(e.target);
        var width = $(document).width();
        $block.css({left: '+='+width }).animate({ left: '-='+width } );
        e.stopPropagation();
      }

      function getBlockHoverIn(tx){
          // blockInfo
          return function(e){
            // if(!ctl.blockInfo || ctl.blockInfo.txid != tx.txid){
              ctl.blockInfo = tx;
              $scope.$digest();
              // $details.css({left : $(e.target).position().left }).stop(true).fadeIn();
            // }
          }
      }

      function onBlockHoverOut(e){
          if(!clicked){
            ctl.blockInfo = null;
            $scope.$digest();
            // $details.stop(true).fadeOut();
          }
      }

      /**
       * Remove extra blocks
       */
      function removeExtraBlocks(){
        if(blockCount > 10){
          var toRemove = blockCount - 10;
          $element.find('.block:lt('+toRemove+')').animate({opacity: 0}, 800, function(){$('.block:first').remove(); /* blocks.slice(toRemove); */ });
          $element.find('.block').animate({left: '-='+blockWidth*toRemove}, 800, function(){});
          blockCount -= toRemove;
        }
      }

    }//-controller
}})




.directive('blockchainPie', function(){

var nodes_example = {
  1: {
    loan:{ 2: {val:500} }
  },
  2: {
    loan: { 3: {val:300} }
  },
  3: {
    loan: { 1: {val:200} }
  }
};

return {
    restrict:'E',
    replace: true,
    // scope: true,
    scope: { size:'='},
    template: '<div id="drawing"></div>',
    controllerAs: 'ctl',
    controller: function($scope, $element, $attrs, $transclude, $rootScope){
      var ctrl = this;
      var size = $scope.size = $scope.size || 500;
      var bgnd_c_center = parseInt(size/2);
      var bgnd_c_radius = parseInt(0.8 * bgnd_c_center);
      var bg_border_w = 4;
      var item_border_w = 3;
      var item_r = 4;

      ctrl.draw = null;
      ctrl.nodes = {};

      $element.css({height: size, width:size});

      // create svg drawing
      ctrl.draw = SVG('drawing');
      var bgnd_circle = ctrl.draw.circle(2*bgnd_c_radius).attr({
          'fill-opacity': 0,
          'stroke-width': bg_border_w,
          'stroke':'#000'
        })
        .move(bgnd_c_center - bgnd_c_radius, bgnd_c_center - bgnd_c_radius);

      update(false);
      $element.on('click', function(){
        var targetIds = Object.keys(ctrl.nodes);
        var tid = targetIds[parseInt(Math.random()*targetIds.length)];

        var loan = {};
        loan[tid] = {val: 100 + parseInt(Math.random()*900) };

        addNode({id:parseInt(Math.random()*100), loan:loan });
        _update();
      });
      // create image
      // var image = draw.image('images/background.jpg');
      // image.size(650, 650).y(-150);

      // create text
      // var text = draw.text('SVG.JS').move(300, 0);
      // text.font({
      //   family: 'Source Sans Pro',
      //   size: 180,
      //   anchor: 'middle',
      //   leading: 1
      // });
      // // clip image with text
      // image.clipWith(text);


      function polar(i, n){
        var a;
        if(n<=1){
          a = 0;
        }else{
          a = 2*Math.PI*i/n + Math.PI/2;
        }

        return {
          x : bgnd_c_center + bgnd_c_radius * Math.sin(a),
          y : bgnd_c_center - bgnd_c_radius * Math.cos(a)
        };
      }

      function polarEntry(){
        var a = 0;
        return {
          x : bgnd_c_center + bgnd_c_radius * Math.sin(a),
          y : bgnd_c_center - bgnd_c_radius * Math.cos(a)
        };
      }

      var targetCenter = {pos:{x:bgnd_c_center, y:bgnd_c_center}};

      function getNodes(){
        // TODO: hardcoded
        return Promise.resolve(nodes_example);
      }


      function update(isAnimated){
        if(typeof isAnimated ==="undefined")
          isAnimated = true;
        return getNodes()
          .then(function(nodes){
            Object.keys(nodes).forEach(function(id){
              nodes[id].id = id;
              addNode(nodes[id]);
            });
            _update(isAnimated);
          });
      }

      /**
       *
       */
      function addNode(node){
        if( !ctrl.nodes[node.id] ){
          ctrl.nodes[node.id] = node;


          // body
          var me = ctrl.nodes[node.id];
          me.pos = polarEntry();
          me.svg = ctrl.draw.circle(2*item_r).attr({
            'stroke-width': item_border_w,
            'stroke':'#F33'
          }).move(me.pos.x-item_r, me.pos.y-item_r);

          // loans
          Object.keys(ctrl.nodes[node.id].loan).forEach(function(tid){
              var target = ctrl.nodes[tid] || targetCenter;
              // me.loan[tid].svg = ctrl.draw.path(['M', me.pos.x, me.pos.y, 'L', target.pos.x, target.pos.y].join(' '))
              me.loan[tid].svg = ctrl.draw.polyline([[me.pos.x, me.pos.y] /*, [targetCenter.pos.x, targetCenter.pos.y]*/, [target.pos.x, target.pos.y]])
                .back()
                .attr({
                  'fill-opacity': 0,
                  'stroke-width': 3,
                  'stroke':'#33F'
                });
          });

        }
      }

      // recalc elements position
      function _update(isAnimated){
          if(typeof isAnimated ==="undefined")
            isAnimated = true;

          var n = Object.keys(ctrl.nodes).length;
          Object.keys(ctrl.nodes).forEach(function(id, i){
            var me = ctrl.nodes[id];
            me.pos = polar(i, n);

            // body
            if(isAnimated)
              ctrl.nodes[id].svg.animate().move(me.pos.x-item_r, me.pos.y-item_r);
            else
              ctrl.nodes[id].svg.move(me.pos.x-item_r, me.pos.y-item_r);
          });

          Object.keys(ctrl.nodes).forEach(function(id, i){
            var me = ctrl.nodes[id];

            // loans
            Object.keys(me.loan).forEach(function(tid){
              var target = ctrl.nodes[tid] || targetCenter;
              var loan = me.loan[tid];
              if(isAnimated)
                loan.svg.animate().plot([[me.pos.x, me.pos.y] /*, [targetCenter.pos.x, targetCenter.pos.y]*/ , [target.pos.x, target.pos.y]]);
              else
                loan.svg.plot([[me.pos.x, me.pos.y] /*, [targetCenter.pos.x, targetCenter.pos.y]*/ , [target.pos.x, target.pos.y]]);
                // loan.svg.animate().plot(['M', me.pos.x, me.pos.y, 'L', target.pos.x, target.pos.y].join(' '));
            });
          });
      }



    } // -controller
  }; // -return
});
