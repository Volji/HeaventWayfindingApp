/**
 * Created by Sebastien Meunier on 17/12/2014.
 */


WeatherIconBC.prototype = new Object();        // Here's where the inheritance occurs
WeatherIconBC.prototype.constructor = WeatherIconBC;


function WeatherIconBC() {
    this.packages = {};
    this.serverURL = "http://data.intuilab.com/DesignAccelerators/WeatherIcons/";

}


WeatherIconBC.prototype.codeToIcon = function (input, iconPackage) {

    if ((iconPackage == undefined) || (iconPackage == ""))
        iconPackage = "Minimalist-White";


        var url = this.serverURL + iconPackage + "/" + input + ".png";

    return url;
};