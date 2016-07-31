/**
 * Created by i327364 on 02/07/2016.
 */


var playerStatus = {
    RETIRED: "RETIRED",
    JOINED: "JOINED",
    ACTIVE: "ACTIVE"
};

var playerType = {
    HUMAN:'human',
    COMPUTER:'computer'
};

function Player(name, _type, _status) {
    this.boardID = GameHandler.playerArr.length+1;
    this.name = name;
    this.money = 1500;
    this.avatar = Board.createPlayerAvatar(this.boardID, this.name);
    this.token = Board.createPlayerToken(this.boardID, this.name);
    this.position = 0;
    this.type = _type;
    this.status= _status;
    this.profile = Board.createPlayerProfile(this);
}

Player.prototype.updatePlayer = function updatePlayer(player){
    this.money = player.money;
    this.status = player.status;
    this.avatar = Board.createPlayerAvatar(this.boardID, this.name);
    this.profile = Board.createPlayerProfile(this);

    if (this.status != playerStatus.ACTIVE){
        Board.deletePlayerTokenFromBoard(this);
    }
};

Player.prototype.setMoney = function setMoney(money){
    this.money = money;
};

Player.prototype.setStatus = function setStatus(stat){
    this.status = stat;
};














