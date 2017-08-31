// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };
}());
/*
红包雨小游戏
(c) 2016-2017 Nelson Kuang
*/
(function (root, $) {
    root.raindropType = function () {
        var ran = 100 * Math.random(),
            dataType = 'empty',
            dataVal = 0,
            dataPlus = 0;
        if (ran <= 13) {
            dataType = 'plus';
            dataVal = 1;
        } else if (ran > 13 && ran <= 25) {
            dataType = 'plus';
            dataVal = 3;
        } else if (ran > 25 && ran <= 35) {
            dataType = 'plus';
            dataVal = 5;
        } else if (ran > 35 && ran <= 43) {
            dataType = 'plus';
            dataVal = 10;
        } else if (ran > 43 && ran <= 49) {
            dataType = 'multiply';
            dataVal = 2;
            dataPlus = 1;
        } else if (ran > 49 && ran <= 53) {
            dataType = 'multiply';
            dataVal = 2;
            dataPlus = 3;
        } else if (ran > 53 && ran <= 56) {
            dataType = 'multiply';
            dataVal = 2;
            dataPlus = 5;
        } else if (ran > 56 && ran <= 57) {
            dataType = 'multiply';
            dataVal = 2;
            dataPlus = 10;
        } else if (ran > 57 && ran <= 60) {
            dataType = 'multiply';
            dataVal = 3;
            dataPlus = 1;
        } else if (ran > 60 && ran <= 62) {
            dataType = 'multiply';
            dataVal = 3;
            dataPlus = 3;
        } else if (ran > 62 && ran <= 64) {
            dataType = 'multiply';
            dataVal = 3;
            dataPlus = 5;
        } else if (ran > 64 && ran <= 65) {
            dataType = 'multiply';
            dataVal = 3;
            dataPlus = 10;
        } else if (ran > 65 && ran <= 80) {
            dataType = 'minus';
        } else if (ran > 80 && ran <= 100) {
            dataType = 'empty';
        }
        return {
            dataType: dataType,
            dataVal: dataVal,
            dataPlus: dataPlus
        };
    };
    root.raindrop = function (options) { // type:empty / multiply / plus / minus. value:0 1 2 3 5 10. track: 0 / 1 / 2 / 3 / 4
        var defaultRaindropType = new raindropType();
        var defaults = {
            id: 'raindrop' + (new Date()).getTime().toString().substr(6), // element,  default value is 'raindrop + time'.
            type: defaultRaindropType.dataType,
            value: defaultRaindropType.dataVal,
            plus: defaultRaindropType.dataPlus,
            track: Math.floor(5 * Math.random()),
        };
        options = $.extend({}, defaults, options);
        var tpls = [
            '<div class="cp empty" data-val="{dataVal}" data-track="{dataTrack}" id="{id}"><div class="wrap rotateOut animated"><div class="effect"></div></div></div>',
            '<div class="cp multiply" data-val="{dataVal}" data-plus="{dataPlus}" data-track="{dataTrack}" id="{id}"><div class="wrap zoomOut animated_x"><div class="light rotate"></div><div class="effect"></div><div class="score m{dataVal} fadeIn animated_x">x{dataVal}</div><div class="score p{dataPlus} fadeOut animated_s">+{dataPlus}</div></div></div>',
            '<div class="cp plus" data-val="{dataVal}" data-track="{dataTrack}" id="{id}"><div class="wrap zoomOut animated"><div class="effect"></div><div class="score p{dataVal}">+{dataVal}</div></div></div>',
            '<div class="cp minus" data-val="{dataVal}" data-track="{dataTrack}" id="{id}"><div class="wrap zoomOutSwing animated"><div class="effect"></div><div class="score">{dataVal}</div></div>'
        ],
        html = '',
        tpl = tpls[0];
        switch (options.type) {
            case 'empty':
                tpl = tpls[0];
                break;
            case 'multiply':
                tpl = tpls[1];
                break;
            case 'plus':
                tpl = tpls[2];
                break;
            case 'minus':
                tpl = tpls[3];
                break;
        }
        html = tpl.replace(/\{dataVal\}/g, options.value).replace(/\{dataPlus\}/g, options.plus).replace('{dataTrack}', options.track).replace('{id}', options.id);
        return {
            html: html,
            id: options.id,
            type: options.type,
            value: options.value,
            plus: options.plus
        };
    };
    root.rain = function (options) {
        var defaults = {
            container: '#rain_container', // element,  default value is '#rain_container'.
            scoreBoard: '#score_board', // element,  default value is '#score_board'.
            initScore: 0,
            genSpeed: 500,
            maxClickTimesCallback: function () { },
            maxScoreCallback: function () { },
            onWatchClick: function () { },
            maxScore: 150,
            maxClickTimes: 50,
            isWatchMode:false
        };
        options = $.extend({}, defaults, options);
        this.score = options.initScore;
        this.maxScoreCallback = options.maxScoreCallback;
        this.maxClickTimesCallback = options.maxClickTimesCallback;
        this.onWatchClick = options.onWatchClick;
        this.maxScore = options.maxScore;
        this.maxClickTimes = options.maxClickTimes;
        this.isWatchMode = options.isWatchMode;
        this.openCount = 0;
        this.genSpeed = options.genSpeed;
        this.$container = $(options.container);
        this.$scoreBoard = $(options.scoreBoard);
        this.version = '1.0.1';
        this.author = 'Nelson Kuang';
        this.created = '2017/07/24';
        this.genTimer = null;
        this.audios = {
            empty: {
                index:0,
                el: $('#sounds .empty_sound')
            },
            multiply: {
                index: 0,
                el: $('#sounds .multiply_sound')
            },
            plus: {
                index: 0,
                el: $('#sounds .plus_sound')
            },
            minus: {
                index:0,
                el: $('#sounds .minus_sound')
            }
        };
        this.init();
    };
    rain.prototype = {
        init: function () {
            this.$container.html('');
            this.$scoreBoard.find('#score').html(this.score);
            this.$scoreBoard.removeClass('hide');
        },
        start: function () {
            var _this = this;
            this.genTimer = setInterval(function () {
                var rd = new raindrop();
                _this.$container.append(rd.html);
                var This = $('#' + rd.id),
                    currentTranslatedX = 0,
                    currentTranslatedY = 0,
                    //frameTime = 1 + 1 * Math.random(),
                    animationID = 0;
                function move() {
                    currentTranslatedY += 1.5;
                    currentTranslatedX -= 1.5;
                    This.css('-webkit-transform', 'translate3d(' + currentTranslatedX + 'px, ' + currentTranslatedY + 'px, 0)');
                    animationID = requestAnimationFrame(move);
                }
                /*var intervalTimer = setInterval(function () {
                    currentTranslatedY += 0.5;
                    currentTranslatedX -= 0.5;
                    This.css('-webkit-transform', 'translate3d(' + currentTranslatedX + 'px, ' + currentTranslatedY + 'px, 0)');
                }, frameTime);*/
                move();
                setTimeout(function () {
                    /*if (intervalTimer) {
                        clearInterval(intervalTimer);
                    }*/
                    if (animationID != 0) {
                        cancelAnimationFrame(animationID);
                    }
                    This.remove();
                }, 10000);
                This.one('click', function () {
                    if (_this.isWatchMode) {
                        _this.onWatchClick();
                        return false;
                    }
                    if (_this.score >= _this.maxScore || _this.openCount > _this.maxClickTimes) {
                        if (_this.score >= _this.maxScore) {
                            _this.updateScore('set', _this.maxScore);
                            _this.maxScoreCallback();
                        } else {
                            _this.maxClickTimesCallback();
                        }
                        _this.stop();
                    } else {
                        //clearInterval(intervalTimer);
                        cancelAnimationFrame(animationID);
                        if (rd.type == 'minus') {
                            rd.value = Math.round(_this.score / 2) * (-1);
                            This.find('.score').html(rd.value); // 红包更新内部值
                        }
                        This.addClass('open');
                        _this.updateScore(rd.type, rd.value, rd.plus);
                        _this.openCount++;
                        try {
                            _this.audios[rd.type].index++;
                            if (_this.audios[rd.type].index > 4) {
                                _this.audios[rd.type].index = 0;
                            }
                            _this.audios[rd.type].el[_this.audios[rd.type].index].play();
                        } catch (e) { }
                    }
                });
            }, this.genSpeed);
        },
        stop: function () {
            if (this.genTimer) {
                clearInterval(this.genTimer);
                this.$container.html('');
            }
        },
        updateScore: function (type, value, plus) {
            switch (type) {
                case 'empty':
                    break;
                case 'multiply':
                    this.score += value * plus;
                    break;
                case 'plus':
                    this.score += value;
                    break;
                case 'minus':
                    this.score += value;
                    break;
                case 'set':
                    this.score = value;
                    break;
            }
            if (this.score > this.maxScore && type != 'set') {
                this.score = this.maxScore;
            }
            this.$scoreBoard.find('#score').html(this.score);
            var score = this.score;
            setTimeout(function () {
                var date = new Date();
                var hour = date.getHours();
                var minute = date.getMinutes();
                hour = 24 - hour - (minute / 60);
                setCookie('rain_score', score, hour.toFixed(2))
            }, 0);
        }
    };
})(this, jQuery);
(function ($) {
    /**
       倒计时countDown
       使用方式
            $('#obj').countDown({
                timeInSecond: 60 * 60,// 要倒计时的时间，秒为单位
                displayTpl: '<span class="h1">{h1}</span><span class="h2">{h2</span>:<span class="m1">{m1}</span><span class="m2">{m2}</span>:<span class="s1">{s1}</span><span class="s2">{s2}</span>', // 显示模版
                limit: 'day', // 限制默认显示到天(day)，可以设为时，分秒。若设为时(hour)的话，则超过24小时也只显示到时不转化为天。如：28小时20分20秒
                callback: function () {// 倒计时完后执行的回调函数
                    alert('倒计时结束！');
                }
            });
    */
    $.fn.extend({
        countDown: function (options) {
            var defaults = {
                timeInSecond: 60 * 60, // 要倒计时的时间，秒为单位
                displayTpl: '<span class="h1">{h1}</span><span class="h2">{h2}</span>:<span class="m1">{m1}</span><span class="m2">{m2}</span>:<span class="s1">{s1}</span><span class="s2">{s2}</span>', // 显示模版
                callback: function () { }// 倒计时完后执行的回调函数
            };
            var options = $.extend({}, defaults, options);
            this.each(function () {
                var This = $(this);
                function countDown(time, tpl) {
                    var timer = setInterval(function () {
                        if (time >= 1) {
                            time -= 1;
                            var hour = Math.floor(time / 3600),
                                minute = Math.floor((time / 60) % 60),
                                second = Math.floor(time % 60);
                            if (hour < 10) {
                                hour = '0' + hour;
                            } else {
                                hour = hour.toString();
                            }
                            if (minute < 10) {
                                minute = '0' + minute;
                            } else {
                                minute = minute.toString();
                            }
                            if (second < 10) {
                                second = '0' + second;
                            } else {
                                second = second.toString();
                            }
                            This.html(tpl.replace('{h1}', hour.charAt(0)).replace('{h2}', hour.charAt(1)).replace('{m1}', minute.charAt(0)).replace('{m2}', minute.charAt(1)).replace('{s1}', second.charAt(0)).replace('{s2}', second.charAt(1)));
                        } else {
                            This.html(tpl.replace('{h1}', 0).replace('{h2}', 0).replace('{m1}', 0).replace('{m2}', 0).replace('{s1}', 0).replace('{s2}', 0));
                            clearInterval(timer);
                            options.callback();
                            return;
                        }
                    }, 1000);
                }
                countDown(options.timeInSecond, options.displayTpl);//调用倒计时
            });
        }
    });
})(jQuery);
/**
 * 预加载图片
 *
 * @param {String|Array} urls
 */
function preLoadImages(urls) {// 可以是String Array或者String
    var argsLen = arguments.length,
        loadImage = function (url) {
            var img = new Image();
            img.src = url;
        };
    if (argsLen == 1) {
        if (typeof (urls) == "string" && (sLen = urls.length) > 1) {// 预加载一个图片
            loadImage(urls);
        }
        else if (Object.prototype.toString.call(arguments[0]) == "[object Array]" && urls.length > 0) {// 预加载多个图片
            for (var i = 0; i < urls.length; i++) {
                loadImage(urls[i]);
            }
        }
    }
}
/**
 * 设置cookie
 *
 * @param {String} name
 * @param {String} value
 * @param {Number} expireHours
 */
function setCookie(name, value, expireHours) {
    var cookieString = name + "=" + escape(value) + "; path=/";
    // 判断是否设置过期时间
    if (expireHours > 0) {
        var date = new Date();
        date.setTime(date.getTime() + expireHours * 3600 * 1000);
        cookieString = cookieString + "; expires=" + date.toGMTString();
    }
    document.cookie = cookieString;
}

/**
 * 获取cookie
 *
 * @param {String} name
 * @return {String} 
 */
function getCookie(name) {
    var strcookie = document.cookie;
    var arrcookie = strcookie.split("; ");
    for (var i = 0; i < arrcookie.length; i++) {
        var arr = arrcookie[i].split("=");
        if (arr[0] == name) return unescape(arr[1]);
    }
    return "";
}

/**
 * 删除cookie
 *
 * @param {String} name
 */
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + "; path=/;expires=" + exp.toGMTString();
}
