/**
 * @license
 * Copyright © 2015 Intuilab
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * The Software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability,
 * fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability,
 * whether in an action of contract, tort or otherwise, arising from, out of or in connection with the Software or the use or other dealings in the Software.
 *
 * Except as contained in this notice, the name of Intuilab shall not be used in advertising or otherwise to promote the sale,
 * use or other dealings in this Software without prior written authorization from Intuilab.
 */

/**
 * Inheritance on EventEmitter base class
 * @type {EventEmitter}
 */
DateBC.prototype = new Object();        // Here's where the inheritance occurs
DateBC.prototype.constructor = DateBC;

/**
 * @constructor
 */
function DateBC() {

}

/**
 * @method
 */
DateBC.prototype.dateOutput = function (input, format, language) {


    if ((language !== undefined) && (language !== "")){
        moment.lang(language);
    }

    if ((input !== undefined) && (input !== "")&& (input !== null) && (format  !== undefined) && (format !== "")) {

        var convertedDate = moment(new Date(input)).format(format);

        if (convertedDate == "Invalid date"){
            var regTimestamp = new RegExp("^[0-9]+$","g");
            if (regTimestamp.test(input)) {
                var inputTimestamp = parseInt(input);
                convertedDate = moment(new Date(inputTimestamp)).format(format);
            }
        }



        // Check if convertion is done
        if (convertedDate != format){
            return convertedDate;
        }
        // Convertion fail, so return the input
        else{
            return input;
        }
    }
    else if ((input !== undefined) && (input !== "")) {
        return input;
    }
    else{
        return "";
    }

};

