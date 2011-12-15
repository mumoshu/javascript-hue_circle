/**
 * Created by IntelliJ IDEA.
 * User: mumoshu
 * Date: 11/12/15
 * Time: 15:12
 * To change this template use File | Settings | File Templates.
 */

/**
 * 色関係のモジュール
 */
var color = {};

(function() {
    /**
     * Converts an HSV color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
     * Assumes h, s, and v are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * Source: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
     * Copyright: Michael Jackson
     *
     * @param   Number  h       The hue
     * @param   Number  s       The saturation
     * @param   Number  v       The value
     * @return  Array           The RGB representation
     */
    function hsvToRgb(h, s, v){
        var r, g, b;

        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);

        switch(i % 6){
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }

        return [r * 255, g * 255, b * 255];
    }

    color.hsvToRgb = hsvToRgb;
})();

/**
 * 図形に関するモジュール
 */
var shape = {};

(function() {
    /**
     * 円を表すクラス
     *
     * @param opts.x 円の中心座標(x)
     * @param opts.y 円の中心座標(y)
     * @param opts.radius 円の半径
     */
    function Circle(opts) {
        this.x = opts.x;
        this.y = opts.y;
        this.radius = opts.radius;

    }

    /**
     * ある座標がこの円に含まれるか調べる。
     *
     * @param x
     * @param y
     * @return Boolean (x,y)がこの円の中であれば、<code>true</code>。
     */
    Circle.prototype.contains = function insideCircle(x,y) {
            return Math.pow((x - this.x), 2) + Math.pow((y - this.y), 2) < Math.pow(this.radius, 2);
    };

    shape.Circle = Circle;
})();

/**
 * 画面描画に関するモジュール
 */
var drawing = {};

(function() {
    function HueCircle(opts) {
        this.canvas = opts.canvas;
        this.radius = opts.radius;
        this.dependencies = {
            hsvToRgb: color.hsvToRgb,
            Circle: shape.Circle
        };
    }

    HueCircle.prototype.draw = function() {
        var canvas = this.canvas;
        var radius = this.radius;
        var hsvToRgb = this.dependencies.hsvToRgb;
        var Circle = this.dependencies.Circle;

        var context = canvas.getContext('2d');
        var width = canvas.width;
        var height = canvas.height;
        var circle = new Circle({
            x: width / 2.0,
            y: height / 2.0,
            radius: radius
        });

        for (var x=0; x<width; x++) {
            for (var y=0; y<height; y++) {
                if (circle.contains(x,y)) {
                    var h = (Math.atan2(y - circle.y, x - circle.x) + Math.PI) / (Math.PI * 2);
                    var rgb = hsvToRgb(h, 1.0, 1.0);

                    for (var i=0; i<rgb.length; i++) {
                        rgb[i] = parseInt(rgb[i]);
                    }

                    var fillStyle = "rgb(" + rgb.join(",") + ")";

                    context.fillStyle = fillStyle;
                    context.fillRect(x, y, 1, 1);
                }
            }
        }
    };

    drawing.HueCircle = HueCircle;
})();
