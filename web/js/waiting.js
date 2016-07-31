/**
 * Created by i327364 on 25/07/2016.
 */
var WaitingPage = (function() {
	var waitForEventsInterval = null;

	function waitingPage() {
	};

	waitingPage.prototype.init = function init(playerName, gameName){
		GameHandler.webPlayer = new Player(playerName, playerType.HUMAN, playerStatus.JOINED);
		GameHandler.playerArr.push(GameHandler.webPlayer);
		GameHandler.gameName = gameName;
		this.startTakingEvents();
	};

	waitingPage.prototype.startTakingEvents = function startTakingEvents() {
		var that = this;
		var lastEvent = GameHandler.eventArr.length === 0 ? 0 : GameHandler.lastEventID;
		var objLastEvent = {
			lastEventID: lastEvent
		}
		waitForEventsInterval = window.setInterval(function() {
			that.getEventAjaxCall(objLastEvent);
		}, 1000);
	};

	waitingPage.prototype.getEventAjaxCall = function getEventAjaxCall(lastEvent) {
		var that = this;
		$.ajax({
			url: "GetGameEvents",
			type: "POST",
			data: lastEvent,
			success: function(e) {
				if (e.length > 0) {
					that.killWaitForEventsTimer();
					GameHandler.startGame(e);
				}
			},
			error: function(e) {
				console.log(e);
			}
		});
	};
	waitingPage.prototype.killWaitForEventsTimer = function killWaitForEventsTimer(){
		clearInterval(waitForEventsInterval);
	};
	return new waitingPage();
}());
