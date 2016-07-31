/**
 * Created by i327364 on 23/07/2016.
 */

var BoardUtils = (function(){
    function boardUtils (){};
    boardUtils.prototype.SideOnBoard = {
        LEFT: "left",
        RIGHT: "right",
        TOP: "top",
        BOTTOM: "bottom"
    };

    boardUtils.prototype.CellTypes = {
        START_SQUARE: 'Start Square',
        CITY: 'CITY',
        SURPRISE: 'SURPRISE',
        WARRANT: 'WARRANT',
        TRANSPORTATION: 'TRANSPORTATION',
        UTILITY: 'UTILITY',
        GO_TO_JAIL: 'GotoJail',
        FREE_PARKING: 'Parking',
        JAIL: 'Jail'
    };

    boardUtils.prototype.CountryColors = ["#a5a5a5",
        "#ffbc9b", "#c2d17f", "#7fd1b8",
        "#7f9ad1", "#b07fd1", "#d17fb9",
        "#71a855", "#6fcec1",
        "#dd7d00", "#d8f400"];

    boardUtils.prototype.DialogType = {
        ASSET: "ASSET",
        HOUSE: "HOUSE",
        GENERAL: "GENERAL",
        SURPRISE: "SURPRISE",
        WARRANT: "WARRANT"
    };
    return new boardUtils();

}());


