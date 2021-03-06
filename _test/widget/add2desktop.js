module("widget/add2desktop", {
      setup:function(){
          $("body").append("<div id='container' ></div>");
      } ,
      teardown: function(){
        $('#container').remove();
      }
});

var canShow = !$.browser.uc && !$.browser.qq && !$.browser.chrome;

if($.os.ios && canShow){
	test("no el * no container & icon", function() {
		expect(9);
		stop();
        window.localStorage.removeItem("_gmu_adddesktop_key");
		ua.loadcss(["reset.css", "widget/add2desktop/add2desktop.css"], function(){
				var add2desktop = $.ui.add2desktop({
                    icon: upath + 'css/add2desktop/icon.png',
					init: function(){
                        equals(this._el.parent()[0].tagName.toLowerCase(), "body", "The container is right");
                        equals(this._el.attr("class"), "ui-add2desktop", "The el is right");
						ok(true, "The oninit is trigger");
					},
				    show: function(){
                        ok(true, "The onshow is trigger");
				    }
                });
            setTimeout(function(){
                equals(add2desktop._el.css("display"), "block", "The add2desktop is show");
                equals(add2desktop._el.width() , 187 , "the width is ok");
                equals(add2desktop._el.height() , 70 , "the height is ok");
                equals(add2desktop._el.offset().top, $(window).height() - 70 - 12, 'the pos is right');
                approximateEqual(add2desktop._el.offset().left, document.documentElement.clientWidth * 0.5 - 92,'the pos is right');
                addicon = $.os.version && ($.os.version).substr(0,3) > 4.1 ? 'ui-add2desktop-new': 'ui-add2desktop-old';
                if($.os.version && ($.os.version).substr(0,3) > 4.1){
                    equals($(".ui-add2desktop-icon-new").css("-webkit-background-size"), "14px 15px", "The icon is right");
                }
                else{
                    equals($(".ui-add2desktop-icon-old").css("-webkit-background-size"), "14px 15px", "The icon is right");
                }
                add2desktop.destroy();
                start();
            },20)
		});
	});

	test("el zepto has container",function() {
		expect(4);
		stop();
        window.localStorage.removeItem("_gmu_adddesktop_key");
		var add2desktop = $.ui.add2desktop($('<div class="ui-add2desktop"></div>'), {
			container : '#container'
		});
        setTimeout(function(){
            equals(add2desktop._data.container , "#container");
            equals(add2desktop._el.css("display"), "block", "The add2desktop is show");
            equals(add2desktop._el.parent().attr("id"), "container", "The container is right");
            equals(add2desktop._el.attr("class"), "ui-add2desktop", "The el is right");
            add2desktop.destroy();
            $("#container").remove();
            window.localStorage.removeItem("_gmu_adddesktop_key");
            start();
        },100);
	});

	test("el selector has container" ,function() {
		expect(3);
		stop();
        $("body").append("<div id='parentd'></div>");
        $("#parentd").append("<div class='ui-custom-add2desktop'></div>");
        window.localStorage.removeItem("_gmu_adddesktop_key");
		var add2desktop = $.ui.add2desktop(".ui-custom-add2desktop", {
			container: "#container"
		});

        setTimeout(function(){
            equals(add2desktop._el.css("display"), "block", "The add2desktop is show");
			equals(add2desktop._el.parent().attr("id"), "container", "The container is right");
			equals(add2desktop._el.attr("class"), "ui-custom-add2desktop ui-add2desktop", "The el is right");
            add2desktop.destroy();
            $("#parentd").remove();
            start();
        },100);
	});

	test('show() & hide() & key()', function(){
		expect(7);
		stop();
        window.localStorage.removeItem("_gmu_adddesktop_key");
		var add2desktop = $.ui.add2desktop();
        setTimeout(function(){
            ok(ua.isShown(add2desktop._el[0]), "The add2desktop shows");
            var height = document.documentElement.clientHeight - add2desktop._el.height()- 12;
            equals(add2desktop._el.offset().top, height, 'the pos is right');
            approximateEqual(add2desktop._el.offset().left, document.documentElement.clientWidth * 0.5 - 92,'the pos is right');
            add2desktop.hide();
            setTimeout(function(){
                 ok(!ua.isShown(add2desktop._el[0]), "The add2desktop hides");
                  add2desktop.show();
                  setTimeout(function(){
                      ok(!ua.isShown(add2desktop._el[0]), "The add2desktop hides");
                      add2desktop.key('111');
                      equals(window.localStorage.getItem(add2desktop.data('key')), 111,'the key() method is called');
                      equals(add2desktop.key(), 111,'the key() method is ok');
                      add2desktop.destroy();
                      start();
                  },100);
            },200);
        },100);
	});

    test("事件 beforeShow & ofterHide & init",function(){
        expect(5);
        stop();
        var  i =0;
        var flag = true,
            add2desktop = $.ui.add2desktop({
                init: function() {
                    ok(true, "The init is trigger");
                },
                beforeshow:function(e) {
                    flag || e.preventDefault();
                    (i++ ==0) && ok(true,"The beforeshow has trigger")
                },
                afterhide:function(){
                    (i++ == 1) && ok(true, "The afterhide is trigger");
                }
            });
        setTimeout(function(){
            ok(ua.isShown(add2desktop._el[0]), "The add2desktop shows");
            add2desktop.hide();
            setTimeout(function(){
                ok(!ua.isShown(add2desktop._el[0]), "The add2desktop hides");
                add2desktop.destroy();
                start();
            },100);
        },100);
    });

    test("useFix",function(){
        expect(6);
        stop();
        var ishow = true,
            add2desktop = $.ui.add2desktop({
                beforeshow:function(e) {
                    ishow || e.preventDefault();
                },
                position: {left:100, bottom: 20}
            });
        setTimeout(function(){
            ok(ua.isShown(add2desktop._el[0]), "The add2desktop shows");
            equals(add2desktop._el.css("display"), "block", "The add2desktop is show");
            equals(add2desktop._el.width() , 187 , "the width is ok");
            equals(add2desktop._el.height() , 70 , "the height is ok");
            equals(add2desktop._el.offset().top, $(window).height() - 70 - 20, 'the pos is right');
            approximateEqual(add2desktop._el.offset().left, 100 - add2desktop._el.width() * 0.5 +2 ,0.5,'the pos is right');
            add2desktop.destroy();
            start();
        },200);
    });

    test("基本操作，点击关闭按钮",function(){
        expect(3);
        stop();
        window.localStorage.removeItem("_gmu_adddesktop_key");
        var add2desktop = $.ui.add2desktop();
        ok(ua.isShown(add2desktop._el[0]), "The add2desktop shows");
        ua.click(add2desktop.root().find('.ui-add2desktop-close').get(0));
        setTimeout(function(){
            ok(!ua.isShown(add2desktop._el[0]), "The add2desktop hide");
            ok(add2desktop.key(),"The lcoalStorage exist") ;
            add2desktop.destroy();
            start();
        })
    });

	test('window scroll(fix)', function() {
		expect(16);
		stop();
	    var w = window.top;
        ua.loadcss(["reset.css", "widget/add2desktop/add2desktop.css"], function(){
            var s2 = w.document.createElement("script");
            s2.src = "../../../_test/fet/bin/import.php?f=core/zepto.ui,core/zepto.extend,core/zepto.fix,core/zepto.highlight,core/zepto.iscroll,core/zepto.ui,widget/button,widget/dialog,widget/navigator,widget/add2desktop";
            w.document.head.appendChild(s2);
   		    s2.onload = function(){
   		    	var html = "";
   	    		for(var i = 0; i < 80; i++){
   	    			html += "<br />";
   	    		}
   	    		w.$("body").append(html);
			    w.localStorage.removeItem("_gmu_adddesktop_key");
			    var add2desktop = w.$.ui.add2desktop({
				    hide:function () {
					ok(true, 'The hide is trigger');
				    }
			    });
			    setTimeout(function(){
			    	w.scrollTo(0, 200);
				    ta.scrollStop(w.document);
	   	            setTimeout(function(){
	                    equals(add2desktop._el.css("display"), "block", "The add2desktop is show");
	                    equals(add2desktop._el.width() , 187 , "the width is ok");
	                    equals(add2desktop._el.height() , 70 , "the height is ok");
	                    equals(add2desktop._el.offset().top - 200, w.innerHeight - 70 - 12, 'the pos is right');
	                    approximateEqual(add2desktop._el.offset().left, w.document.documentElement.clientWidth * 0.5 - 92,'the pos is right');
	                    w.scrollTo(0, 300);
	                    ta.scrollStop(w.document);
	                    setTimeout(function(){
	                        equals(add2desktop._el.css("display"), "block", "The add2desktop is show");
	                        equals(add2desktop._el.width() , 187 , "the width is ok");
	                        equals(add2desktop._el.height() , 70 , "the height is ok");
	                        ok(Math.abs(w.pageYOffset - 300) <= 1, "The pageYOffset is " + w.pageYOffset);
		                    approximateEqual(add2desktop._el.offset().top-300, w.innerHeight - 70 - 12 , 1, 'the pos is right');
	                        approximateEqual(add2desktop._el.offset().left, w.document.documentElement.clientWidth * 0.5 - 92,'the pos is right');
	                        w.scrollTo(0,0);
	                        ta.scrollStop(w.document);
	                        setTimeout(function(){
	                            equals(add2desktop._el.css("display"), "block", "The add2desktop is show");
	                            equals(add2desktop._el.width() , 187 , "the width is ok");
	                            equals(add2desktop._el.height() , 70 , "the height is ok");
	                            equals(add2desktop._el.offset().top, w.innerHeight - 70 - 12, 'the pos is right');
	                            approximateEqual(add2desktop._el.offset().left, w.document.documentElement.clientWidth * 0.5 - 92,'the pos is right');
	                            w.$("br").remove();
	                            add2desktop.destroy();
	                            $(s2).remove();
	                            start();
	                        },400);
	                    },400);
	   	            }, 400);
			    }, 10);
   	         };
        }, w);
	});


	test('window resize', function() {
		expect(10);
		stop();
		ua.frameExt(function(w, f){
            w.localStorage.removeItem("_gmu_adddesktop_key");
			ua.loadcss(["reset.css", "widget/add2desktop/add2desktop.css"], function(){
                $(f).css({border:"1px solid red"});
				var add2desktop = w.$.ui.add2desktop(w.$('<div class="ui-add2desktop"></div>'), {
					hide : function () {
						ok(true , 'The hide is trigger');
					}
				});
                equals(add2desktop._el.css("display"), "block", "The add2desktop is show");
                equals(add2desktop._el.width() , 187 , "the width is ok");
                equals(add2desktop._el.height() , 70 , "the height is ok");
                equals(add2desktop._el.offset().top, 150 - 70 - 12, 'the top is right');
                equals(add2desktop._el.offset().left, 300 * 0.5 - 92,'the left is right');
                $(f).css("position", "absolute").css("left", 0).css("top", 0).css("height",400).css("width", 300);
                $.support.orientation ? ta.orientationchange(w) : ta.resize(w);
                setTimeout(function(){
                    equals(add2desktop._el.css("display"), "block", "The add2desktop is show");
                    equals(add2desktop._el.width() , 187 , "the width is ok");
                    equals(add2desktop._el.height() , 70 , "the height is ok");
                    equals(add2desktop._el.offset().top, 400 - 70 - 12, 'the pos is right');
                    equals(add2desktop._el.offset().left, 300 * 0.5 - 92,'the pos is right');
                    add2desktop.destroy();
                    te.dom.push(f.parentNode);
                    start();
                },400);
			}, w);
		});
	});

    test("setup 创建模式" ,function() {
        expect(8);
        stop();
        $("body").append('<div id="add2" style="display: none;"><img src="../../widget/css/add2desktop/icon.png"/></div>');
        window.localStorage.removeItem("_gmu_adddesktop_key");
        var add2desktop =  $('#add2').add2desktop('this');
        setTimeout(function(){
            equals(add2desktop._el.css("display"), "block", "The add2desktop is show");
            equals(add2desktop._el.attr("class"), "ui-add2desktop", "The el is right");
            equals(add2desktop._el.width() , 187 , "the width is ok");
            equals(add2desktop._el.height() , 70 , "the height is ok");
            approximateEqual(add2desktop._el.offset().top, window.innerHeight - 70 - 12, 'the pos is right');
            approximateEqual(add2desktop._el.offset().left, document.documentElement.clientWidth * 0.5 - 92,'the pos is right');
            ua.click(add2desktop.root().find('.ui-add2desktop-close').get(0));
            setTimeout(function(){
                ok(!ua.isShown(add2desktop._el[0]), "The add2desktop hide");
                ok(add2desktop.key(),"The lcoalStorage exist") ;
                add2desktop.destroy();
                start();
            },100);
        },100);
    });

    test('destroy()', function(){
        ua.destroyTest(function(w,f){
        	var dl1 = w.dt.domLength(w);
            var el1= w.dt.eventLength();

            w.localStorage.removeItem("_gmu_adddesktop_key");
            var add2desktop = w.$.ui.add2desktop({
            	useFix: false  //fix()中dom和event都没有清干净，设置false排除fix带来的影响
            });
            add2desktop.destroy();

            var el2= w.dt.eventLength();
            var ol = w.dt.objLength(add2desktop);
            var dl2 =w.dt.domLength(w);

            equal(dl1,dl2,"The dom is ok");
            equal(w.$(".ui-add2desktop").length, 0, "The dom is ok");
            equal(el1,el2,"The event is ok");
            ok(ol==0,"The toolbar is destroy");
            this.finish();
        })
	});
}
else{
	test("test", function(){
		expect(1);
		ok(true, "Doesn't support android");
	});
}