/**
 * Created by i327364 on 25/07/2016.
 */
var GameHandler = (function() {

	var EventTypes = {
		GAME_START: 'GAME_START',
		GAME_OVER: 'GAME_OVER',
		GAME_WINNER: 'GAME_WINNER',
		PLAYER_LOST: 'PLAYER_LOST',
		DICE_ROLL: 'DICE_ROLL',
		MOVE: 'MOVE',
		PASSED_START_SQUARE: 'PASSED_START_SQUARE',
		LANDED_ON_START_SQUARE: 'LANDED_ON_START_SQUARE',
		GO_TO_JAIL: 'GO_TO_JAIL',
		PROMPT_PLAYER_TO_BUY_ASSET: 'PROPMT_PLAYER_TO_BY_ASSET',
		PROMPT_PLAYER_TO_BUY_HOUSE: 'PROPMPT_PLAYER_TO_BY_HOUSE',
		ASSET_BOUGHT: 'ASSET_BOUGHT',
		HOUSE_BOUGHT: 'HOUSE_BOUGHT',
		SURPRISE_CARD: 'SURPRISE_CARD',
		WARRANT_CARD: 'WARRANT_CARD',
		GET_OUT_OF_JAIL_CARD: 'GET_OUT_OF_JAIL_CARD',
		PAYMENT: 'PAYMENT',
		PLAYER_USED_GET_OUT_OF_JAIL_CARD: 'PLAYER_USED_GET_OUT_OF_JAIL_CARD',
		PLAYER_TURN: 'PLAYER_TURN',
		PLAYER_RESIGNED: 'PLAYER_RESIGNED'
	};


	var eventTaker,
		handleEventsInterval;

	function gameHandler() {
		this.playerArr = [];
		this.lastEventID = null;
		this.webPlayer;
		this.eventArr = [];
		this.gameName;
		this.boardInformation = [];
		this.tooltipsArr = [];
	}

	gameHandler.prototype.startGame = function(events) {
		var that = this;
		this.getPlayerDetailsFromServer(this.gameName);
		this.webPlayer.setStatus(playerStatus.ACTIVE);
		this.getBoardScheme();
		this.lastEventID = events[events.length - 1].id;
		this.concatNewEventArray(events);
		this.eventArr.shift();
		navigatePage('monopoly-page');
		this.Sleep(2000).then(function() {
			Board.initTooltips();
			that.eventTakerInterval();
			that.eventHandler();
		});


	};

	gameHandler.prototype.Sleep = function sleep(time) {
		var oDfd = jQuery.Deferred();
		setTimeout(function() {
			oDfd.resolve();
		}, time);
		return oDfd.promise();
	};

	gameHandler.prototype.getPlayerDetailsFromServer = function getPlayerDetailsFromServer(gameName) {
		var gameObj = {
			gameName: gameName
		};
		this.getPlayersDetailsAjax(gameObj);
	};

	gameHandler.prototype.getPlayersDetailsAjax = function getPlayersDetailsAjax(gameObj) {
		var that = this;
		$.ajax({
			url: 'GetPlayersDetails',
			type: 'POST',
			data: gameObj,
			success: function(e) {
				that.insertPlayersToPlayersArray(e);
			},
			error: function(e) {
				console.log(e);
			}
		});
	};

	gameHandler.prototype.insertPlayersToPlayersArray = function insertPlayersToPlayersArray(e) {
		var jsonRes = JSON.parse(e.data);
		if (e.response) {
			jsonRes.forEach(function(playerInArr) {
				if (playerInArr.name !== GameHandler.webPlayer.name) {
					var playerToInsert = new Player(playerInArr.name, playerInArr.type, playerInArr.status);
					GameHandler.playerArr.push(playerToInsert);
				}
			});
		} else {
			navigatePage('homepage');
			console.log("fail on get Player details, no such game!");
		}
	};

	gameHandler.prototype.getBoardScheme = function getBoardScheme() {
		var that = this;
		$.ajax({
			url: "GetBoardScheme",
			type: "GET",
			success: function(e) {
				console.log(e);
				console.log("success! Scheme");
				that.getBoardXML();
			},
			error: function(e) {
				console.log(e);
				console.log("error!");
			}
		});
	};

	gameHandler.prototype.getBoardXML = function getBoardXML() {
		var that = this;
		$.ajax({
			url: "GetBoardXML",
			type: "GET",
			success: function(e) {
				Board.drawFinalBoard(e);

				Board.initPlayerOnBoard();
				console.log('Board was drawn');
			},
			error: function(e) {
				console.log(e);
				console.log("error!");
			}
		});
	};

	gameHandler.prototype.eventTakerInterval = function eventTakerInterval() {
		var that = this;
		this.eventTaker = window.setInterval(function() {
			if (that.eventArr.length > 0) {
				var lastEventObj = {
					lastEventID: that.eventArr[that.eventArr.length - 1].id
				};
			} else {
				var lastEventObj = {
					lastEventID: that.lastEventID
				};
			}
			console.log("call event taker");
			$.ajax({
				url: "GetGameEvents",
				type: "POST",
				data: lastEventObj,
				success: function(e) {
					if (e.length > 0) {
						that.concatNewEventArray(e);
					}
				},
				error: function(e) {
					console.log(e);
				}
			});
		}, 4000);
	};

	gameHandler.prototype.concatNewEventArray = function concatNewEventArray(oldEventArr) {
		GameHandler.eventArr = GameHandler.eventArr.concat(oldEventArr);
	};

	gameHandler.prototype.killEventTakerInterval = function killEventTakerInterval() {
		clearInterval(this.eventTaker);
		clearTimeout(this.handleEventsInterval);
	};

	gameHandler.prototype.killHandleEventsInterval = function killHandleEventsInterval() {
		clearInterval(this.handleEventsInterval);
	};

	gameHandler.prototype.eventHandler = function eventHandler() {
		console.log("call event handler");
		var that = this;
		if (this.eventArr.length > 0) {
			this.lastEventID = this.eventArr[this.eventArr.length - 1].id;
			this.handleEvent(this.eventArr[0]).then(function() {
				that.eventArr.shift();
				that.Sleep(1000).then(function() {
					that.eventHandler(event);
				});
			}.bind(this));
		} else {
			this.handleEventsInterval = window.setTimeout(function() {
				that.eventHandler(event);
			}, 5000)
		}
	};
	gameHandler.prototype.getPlayerByName = function getPlayerByName(name) {
		return $.grep(this.playerArr, function(player) {
			return player.name === name
		});
	};

	gameHandler.prototype.handleEvent = function handleEvent(event) {
		var that = this;
		console.log(event);
		var oDfd = jQuery.Deferred();
		switch (event.type) {
			case EventTypes.GAME_OVER:
				Board.showMessage(event.eventMessage);
				this.killEventTakerInterval();
				oDfd.resolve();
				break;
			case EventTypes.GAME_WINNER:
				Board.showMessage(event.eventMessage);
				oDfd.resolve();
				break;
			case EventTypes.PLAYER_RESIGNED:
				Board.deletePromptIfExist();
				var playerRes = this.getPlayerByName(event.playerName)[0];
				playerRes.setStatus(playerStatus.RETIRED);
				playerRes.setMoney(0);
				Board.showMessage(event.eventMessage);
				Board.deletePlayerTokenFromBoard(playerRes);
				Board.updatePlayersOnBar(oDfd);

				break;
			case EventTypes.PLAYER_LOST:
				var playerLost = this.getPlayerByName(event.playerName)[0];
				playerLost.setStatus(playerStatus.RETIRED);
				playerLost.setMoney(0);
				Board.showMessage(event.eventMessage);
				Board.deletePlayerTokenFromBoard(playerLost);
				Board.updatePlayersOnBar(oDfd);
				break;
			case EventTypes.DICE_ROLL:
				Board.updateDiceResult(event.firstDiceResult, event.secondDiceResult, oDfd);
				break;
			case EventTypes.MOVE:
				var canMove = event.playerMove;
				if (canMove) {
					var placeToMove = event.nextBoardSquareID;
					Board.movePlayerToCell(this.getPlayerByName(event.playerName)[0], placeToMove);
				} else {
					Board.showMessage(event.eventMessage);
				}

				oDfd.resolve();
				break;
			case EventTypes.PASSED_START_SQUARE:

				Board.showMessage(event.eventMessage);
				oDfd.resolve();
				break;
			case EventTypes.LANDED_ON_START_SQUARE:

				Board.showMessage(event.eventMessage);
				oDfd.resolve();
				break;
			case EventTypes.GO_TO_JAIL:

				Board.showMessage(event.eventMessage);
				oDfd.resolve();
				break;
			case EventTypes.PROMPT_PLAYER_TO_BUY_ASSET:
				this.Sleep(20).then(function() {
					if (that.webPlayer.name == event.playerName) {
						Board.promptDialog(BoardUtils.DialogType.ASSET, event).then(function(val, id) {
							if (val !== undefined)
								that.sendBuyAnswerToServer(val, id, oDfd);
						});
					} else {
						oDfd.resolve();
					}
				});
				break;
			case EventTypes.PROMPT_PLAYER_TO_BUY_HOUSE:
				this.Sleep(20).then(function() {
					if (that.webPlayer.name == event.playerName) {
						Board.promptDialog(BoardUtils.DialogType.HOUSE, event).then(function(val, id) {
							if (val !== undefined)
								that.sendBuyAnswerToServer(val, id, oDfd);
						});
					} else {
						oDfd.resolve();
					}
				});
				break;
			case EventTypes.ASSET_BOUGHT:
				Board.showMessage(event.eventMessage);
				oDfd.resolve();
				break;
			case EventTypes.HOUSE_BOUGHT:
				//TODO: put house on cell
				Board.showMessage(event.eventMessage);
				oDfd.resolve();
				break;
			case EventTypes.SURPRISE_CARD:
				Board.showMessage(event.eventMessage);
				oDfd.resolve();
				break;
			case EventTypes.WARRANT_CARD:
				Board.promptDialog(BoardUtils.DialogType.WARRANT, event.eventMessage);
				oDfd.resolve();
				break;
			case EventTypes.GET_OUT_OF_JAIL_CARD:
				Board.showMessage(event.eventMessage);

				oDfd.resolve();
				break;
			case EventTypes.PAYMENT:
				var msgToShow;
				var payer, getter;
				if (event.paymemtFromUser) {
					payer = this.getPlayerByName(event.playerName)[0];
					if (event.paymentToPlayerName) {
						getter = this.getPlayerByName(event.paymentToPlayerName)[0];
						payer.setMoney(payer.money - event.paymentAmount);
						getter.setMoney(getter.money + event.paymentAmount);
					} else {
						payer.setMoney(payer.money - event.paymentAmount);
					}
				} else {
					getter = this.getPlayerByName(event.playerName)[0];
					getter.setMoney(getter.money + event.paymentAmount);
				}
				Board.showMessage(event.eventMessage);
				Board.updatePlayersOnBar(oDfd);
				break;
			case EventTypes.PLAYER_USED_GET_OUT_OF_JAIL_CARD:
				Board.showMessage(event.eventMessage);
				oDfd.resolve();
				break;
			default:
				break;
		}
		return oDfd.promise();
	};

	gameHandler.prototype.refreshPlayerDetails = function refreshPlayerDetails() {
		var that = this;
		var gameObj = {
			gameName: this.gameName
		};
		console.log("refresh players");
		$.ajax({
			url: 'GetPlayersDetails',
			type: 'POST',
			data: gameObj,
			success: function(e) {
				that.updatePlayerDetails(e);
			},
			error: function(e) {
				console.log(e);
			}
		});
	};

	gameHandler.prototype.updatePlayerDetails = function updatePlayerStatus(e) {
		var players = JSON.parse(e.data);
		for (var i = 0; i < players.length; i++) {
			this.playerArr[i].updatePlayer(players[i]);
		}
		Board.drawPlayersBar();
	};

	gameHandler.prototype.sendBuyAnswerToServer = function sendBuyAnswerToServer(val, id, oDfd) {
		var res = {
			answer: val,
			eventID: id
		};
		$.ajax({
			url: 'Buy',
			type: 'POST',
			data: res,
			success: function(e) {
				console.log("Player bought!");
				console.log(e);
				oDfd.resolve();
			},
			error: function(e) {
				console.log(e);
				oDfd.reject();
			}
		});
	};
	return new gameHandler();
}())


