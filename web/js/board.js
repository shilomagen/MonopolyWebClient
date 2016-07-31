/**
 * Created by i327364 on 02/07/2016.
 */


var Board = (function() {
	function board() {
		this.baseCell = null;
		this.$playersBar = null;
	}


	board.prototype.initPlayerOnBoard = function initPlayerOnBoard() {
		var that = this;
		this.baseCell = $("#cell0");
		this.$playersBar = $('.players-bar');
		$.each(GameHandler.playerArr, function(i, val) {
			that.$playersBar.append(val.profile.clone());
			that.baseCell.append(val.token.clone());
			console.log("Player " + val.name + " is in the base cell");
		});
	};

	board.prototype.movePlayerToCell = function movePlayerToCell(player, toCell) {
		var $playerIcon = $('img[player-name-token=' + player.name + ']');
		var $cellToMove = $('#cell' + toCell);
		$cellToMove.append($playerIcon);
		player.position = toCell;
	};


	board.prototype.deletePlayerTokenFromBoard = function deletePlayerTokenFromBoard(player) {
		var $playerToken = $('img[player-name-token=' + player.name + ']');
		$playerToken.hide(200);
		$playerToken.remove();
	};

	board.prototype.getSideOnBoardByPosition = function getSideOnBoardByPosition(place) {
		if (place >= 1 && place <= 8) {
			return BoardUtils.SideOnBoard.BOTTOM;
		} else if (place >= 10 && place <= 17) {
			return BoardUtils.SideOnBoard.LEFT;
		} else if (place >= 19 && place <= 26) {
			return BoardUtils.SideOnBoard.TOP;
		} else if (place >= 28 && place <= 35) {
			return BoardUtils.SideOnBoard.RIGHT;
		}
	};

	board.prototype.generateCityPane = function generateCityPane(place, countryName, cityName, price) {
		var side = this.getSideOnBoardByPosition(place);
		var $labelDiv = $('<div />').addClass('label-' + side);
		var $cityWrap = $('<div />').addClass('city-wrap-' + side).attr('place', place).attr('city', cityName);
		var $countryLabel = $('<div />')
			.append($('<span />').text(countryName));
		var $cityLabel = $('<div />')
			.append($('<span />').text(cityName));
		var $priceLabel = $('<div />').text(price + '$');
		$cityWrap.append($countryLabel, $cityLabel, $priceLabel);
		return {
			label: $labelDiv,
			cityWrap: $cityWrap
		}
	};

	board.prototype.generateTransUtilityPane = function generateTransUtilityPane(place, transUtilName, price, type) {
		var side = this.getSideOnBoardByPosition(place);
		var $transWrap = $('<div />').addClass('trans-util-wrap').addClass(side).attr('type', type).attr('place', place).attr('cell-name', transUtilName);
		var $transImg = $('<img />').attr('src', type === BoardUtils.CellTypes.TRANSPORTATION ? 'assets/board-icons/transportation.png' : 'assets/board-icons/utilities.png');
		var $transLabel = $('<div />').append($('<span />').text(transUtilName));
		var $priceLabel = $('<div />').append($('<span />').text(price));
		$transWrap.append($transImg, $transLabel, $priceLabel);
		return $transWrap;
	};

	board.prototype.generateCardPane = function generateCardPane(place, type) {
		var side = this.getSideOnBoardByPosition(place);
		var $cardWrap = $('<div />').addClass('card-wrap');
		$cardWrap.append($('<img />').attr('src', type === BoardUtils.CellTypes.WARRANT ? 'assets/board-icons/warrant.png' : 'assets/board-icons/surprise.png').addClass('card-cell').addClass(side));
		return $cardWrap;
	};

	board.prototype.generateStartPane = function generateStartPane() {
		return $('<div />').addClass('general-cell').addClass('start-cell').attr('type', BoardUtils.CellTypes.START_SQUARE);
	};

	board.prototype.generateGoToJailPane = function generateGoToJailPane() {
		return $('<div />').addClass('general-cell').addClass('go-to-jail-cell').attr('type', BoardUtils.CellTypes.GO_TO_JAIL);
	};

	board.prototype.generateJailPane = function generateJailPane() {
		return $('<div />').addClass('general-cell').addClass('jail-cell').attr('type', BoardUtils.CellTypes.JAIL);
	};

	board.prototype.generateFreeParkingPane = function generateFreeParkingPane() {
		return $('<div />').addClass('general-cell').addClass('free-parking-cell').attr('type', BoardUtils.CellTypes.FREE_PARKING);
	};

	board.prototype.drawFinalBoard = function drawFinalBoard(boardInfo) {
		$('#board').append($('.main-container'));
		var counter,
			countryCounter = 0,
			cityCounter = 0,
			transPlace = 0,
			utilityPlace = 0;

		var boardDataLocal = boardInfo.boardData.theBoard;
		var gameAssets = boardInfo.gameAssets;
		for (counter = 0; counter < boardDataLocal.length; counter++) {
			var cellType = boardDataLocal[counter].type;
			var $cellToInsert = $('#cell' + counter);
			switch (cellType) {
				case BoardUtils.CellTypes.START_SQUARE:
					GameHandler.boardInformation.push("StartCell");
					$cellToInsert.append(this.generateStartPane());
					break;
				case BoardUtils.CellTypes.CITY:
					if (cityCounter >= gameAssets.theCountries[countryCounter].citiesNum) {
						countryCounter++;
						cityCounter = 0;
					}
					var cityData = gameAssets.theCountries[countryCounter].cities[cityCounter];
					GameHandler.boardInformation.push(cityData);
					var cityElement = this.generateCityPane(counter, cityData.country, cityData.name, cityData.cost);
					cityElement.label.css('background-color', BoardUtils.CountryColors[countryCounter]);
					var $tooltipCell = $('<div />').addClass('cell-tooltip').attr('id', "cell" + counter + "-tooltip")
						.append($('<div />').addClass('header')
							.append($('<span />').addClass('header-country').text(cityData.country), $('<span />').addClass('header-city').text(cityData.name)))
						.append($('<div />').addClass('data')
							.append($('<span />').addClass('data-text').text('Cost: ' + cityData.cost),
								$('<span />').addClass('data-text').text('House Cost: ' + cityData.houseCost),
								$('<span />').addClass('data-text').text('Stay Cost: ' + cityData.stayCost),
								$('<span />').addClass('data-text').text('Stay Cost 1: ' + cityData.stayCost1),
								$('<span />').addClass('data-text').text('Stay Cost 2: ' + cityData.stayCost2),
								$('<span />').addClass('data-text').text('Stay Cost 3: ' + cityData.stayCost3)));
					$cellToInsert.append(cityElement.label, cityElement.cityWrap, $tooltipCell);
					$("#cell" + counter + "-tooltip").hide();
					GameHandler.tooltipsArr.push(counter);
					$cellToInsert.on("mouseover", function() {
						$("#cell" + counter + "-tooltip").show()
					});
					$cellToInsert.on("mouseout", function() {
						$("#cell" + counter + "-tooltip").hide()
					});
					cityCounter++;
					break;
				case BoardUtils.CellTypes.TRANSPORTATION:
					var transData = gameAssets.transportation[transPlace];
					GameHandler.boardInformation.push(transData);
					var $transTooltip = $('<div />').addClass('cell-tooltip').attr('id', "cell" + counter + "-tooltip")
						.append($('<div />').addClass('header')
							.append($('<span />').addClass('header-name').text(transData.name)))
						.append($('<div />').addClass('data')
							.append($('<span />').addClass('data-text').text('Cost: ' + transData.cost),
								$('<span />').addClass('data-text').text('Stay Cost: ' + transData.stayCost)));
					$cellToInsert.append(this.generateTransUtilityPane(counter, transData.name, transData.cost, BoardUtils.CellTypes.TRANSPORTATION), $transTooltip);
					$("#cell" + counter + "-tooltip").hide();
					GameHandler.tooltipsArr.push(counter);
					$cellToInsert.on("mouseover", function() {
						$("#cell" + counter + "-tooltip").show()
					});
					$cellToInsert.on("mouseout", function() {
						$("#cell" + counter + "-tooltip").hide()
					});
					transPlace++;
					break;
				case BoardUtils.CellTypes.UTILITY:
					var utilData = gameAssets.utility[utilityPlace];
					GameHandler.boardInformation.push(utilData);
					var $tooltipUtil = $('<div />').addClass('cell-tooltip').attr('id', "cell" + counter + "-tooltip")
						.append($('<div />').addClass('header')
							.append($('<span />').addClass('header-name').text(utilData.name)))
						.append($('<div />').addClass('data')
							.append($('<span />').addClass('data-text').text('Cost: ' + utilData.cost),
								$('<span />').addClass('data-text').text('Stay Cost: ' + utilData.stayCost)));
					$cellToInsert.append(this.generateTransUtilityPane(counter, utilData.name, utilData.cost, BoardUtils.CellTypes.UTILITY),$tooltipUtil);
					$("#cell" + counter + "-tooltip").hide();
					GameHandler.tooltipsArr.push(counter);
					$cellToInsert.on("mouseover", function() {
							$("#cell" + counter + "-tooltip").show()
						});
					$cellToInsert.on("mouseout", function() {
						$("#cell" + counter + "-tooltip").hide()
					});
					utilityPlace++;
					break;
				case BoardUtils.CellTypes.SURPRISE:
					GameHandler.boardInformation.push("Surprise");
					$cellToInsert.append(this.generateCardPane(counter, BoardUtils.CellTypes.SURPRISE));
					break;
				case BoardUtils.CellTypes.WARRANT:
					GameHandler.boardInformation.push("Warrant");
					$cellToInsert.append(this.generateCardPane(counter, BoardUtils.CellTypes.WARRANT));
					break;
				case BoardUtils.CellTypes.FREE_PARKING:
					GameHandler.boardInformation.push("FreeParking");
					$cellToInsert.append(this.generateFreeParkingPane());
					break;
				case BoardUtils.CellTypes.JAIL:
					GameHandler.boardInformation.push("Jail");
					$cellToInsert.append(this.generateJailPane());
					break;
				case BoardUtils.CellTypes.GO_TO_JAIL:
					GameHandler.boardInformation.push("Gotojail");
					$cellToInsert.append(this.generateGoToJailPane());
					break;
			}
		}
	};

	board.prototype.createPlayerToken = function createPlayerToken(iconNum, playerName) {
		return $("<img />").attr("src", "assets/player-token/" + iconNum + ".png").attr("player-name-token", playerName).addClass("player-token");
	};

	board.prototype.createPlayerAvatar = function createPlayerAvatar(avatarNum, playerName) {
		return $('<img />').attr('src', 'assets/player-avatar/' + avatarNum + '.png').attr('player-name-avatar', playerName);
	};

	board.prototype.createPlayerProfile = function createPlayerProfile(player) {
		var $divPlayerProfile = $('<div />').addClass('player-profile').attr('player-data', player.name);
		var $divNameRow = $('<div />').addClass('name-row');
		var $divPlayerIcon = $('<div />')
			.append(player.token.clone().removeAttr('player-name-token'))
			.addClass('player-profile-token');

		var $divPlayerName = $('<div />')
			.addClass('player-name')
			.append($('<span />')
				.text(player.name));
		var $divPlayerIsActive = $('<div />')
			.addClass('player-is-active')
			.append($('<img />')
				.attr('src', 'assets/utils/player-' + (player.status === playerStatus.ACTIVE ? 'on' : 'off') + '.jpg'));
		$divNameRow.append($divPlayerIcon, $divPlayerName, $divPlayerIsActive);

		var $divAvatarRow = $('<div />')
			.append(player.avatar)
			.addClass('img-row');

		var $divMoneyRow = $('<div />')
			.addClass('money-row')
			.append($('<span />').text(player.money))
			.append($('<img />').attr('src', 'assets/utils/money.png'));

		$divPlayerProfile.append($divNameRow, $divAvatarRow, $divMoneyRow);
		return $divPlayerProfile;
	};

	board.prototype.drawPlayersBar = function drawPlayersBar() {
		var that = this;
		GameHandler.Sleep(100).then(function() {
			that.$playersBar.empty();
			that.$playersBar = $('.players-bar');
			$.each(GameHandler.playerArr, function(i, val) {
				that.$playersBar.append(val.profile.clone());
			});
		});
	};

	board.prototype.showMessage = function showMessage(msg) {
		var $exist = $('.msgBox');
		if ($exist.length !== 0) {
			$exist.hide(10);
			$exist.remove();
		}
		var $msgDiv = $('<div />').addClass('msgBox').append($('<span />').addClass('msgText').text(msg));
		$msgDiv.hide();
		$('.main-container').append($msgDiv);
		$msgDiv.show(200);


	};

	board.prototype.makePlayerActive = function makePlayerActive(playerName, val) {
		var $playerIcon = $('div[player-data=' + playerName + ']');
		if (val) {
			$playerIcon.addClass('active-player');
		} else {
			$playerIcon.removeClass('active-player');
		}
	};

	board.prototype.updateDiceResult = function updateDiceResult(firstRes, secondRes, oDfd) {
		$('.left-dice').attr('src', 'assets/dice/dice-' + firstRes + '.png');
		$('.second-dice').attr('src', 'assets/dice/dice-' + secondRes + '.png');
		oDfd.resolve();
	};

	board.prototype.promptDialog = function promptDialog(type, event) {
		var isClient = GameHandler.webPlayer.name === event.playerName;
		var oDfd = jQuery.Deferred();
		switch (type) {
			case BoardUtils.DialogType.ASSET:
				Board.createAssetDialog(event, oDfd, isClient);
				break;
			case BoardUtils.DialogType.HOUSE:
				Board.createHouseDialog(event, oDfd, isClient);
				break;
			case BoardUtils.DialogType.SURPRISE:
			case BoardUtils.DialogType.WARRANT:
				Board.createCardDialog(type, event.eventMessage);
				oDfd.resolve();
				break;
		}
		return oDfd.promise();
	};

	board.prototype.createAssetDialog = function createAssetDialog(event, oDfd, isClient) {
		var answeredToDialog = false;
		Board.deletePromptIfExist();
		var eventMsg = event.eventMessage;
		var msgArr = eventMsg.split('_');
		var $dialogPrompt = $('<div />').addClass("prompt");
		var $dialogHeader = $('<div />').addClass('prompt-header').append($('<span />').addClass("prompt-text").text(msgArr[0]));
		var $dialogData = $('<div />').addClass('prompt-data')
			.append($('<span />').addClass("prompt-data-text-question").text("Would you like to buy"))
			.append($('<span />').addClass("prompt-data-text-answer").text(msgArr[1]))
			.append($('<span />').addClass("prompt-data-text-question").text("The price is"))
			.append($('<span />').addClass("prompt-data-text-answer").text(msgArr[2]));
		var $btnBar = $('<div />').addClass('button-bar');
		var $yesBtn = $('<button />').attr('type', 'button').addClass(('btn btn-default'))
			.text('Yes').on('click', function() {
				$('.prompt').hide(20);
				$('.prompt').remove();
				var player = GameHandler.getPlayerByName(event.playerName)[0];
				player.money -= parseInt(msgArr[2]);
				oDfd.resolve(true, event.id);
			});
		var $noBtn = $('<button />').attr('type', 'button').addClass('btn btn-default')
			.text('No').on('click', function() {
				console.log('player dont want to buy not house');
				$('.prompt').hide(20);
				$('.prompt').remove();
				oDfd.resolve(false, event.id);
			});

		setTimeout(function() {
			if (!answeredToDialog) {
				oDfd.resolve();
			}
		}, 60000)

		$btnBar.append($noBtn, $yesBtn);
		$dialogPrompt.append($dialogHeader, $dialogData, $btnBar);
		$('.main-container').append($dialogPrompt);
	};

	board.prototype.createHouseDialog = function createHouseDialog(event, oDfd, isClient) {
		var answeredToDialog = false;
		Board.deletePromptIfExist();
		var eventMsg = event.eventMessage;
		var msgArr = eventMsg.split('_');
		var $dialogPrompt = $('<div />').addClass("prompt");
		var $dialogHeader = $('<div />').addClass('prompt-header').append($('<span />').addClass("prompt-text").text("House Dialog"));
		var $dialogData = $('<div />').addClass('prompt-data')
			.append($('<span />').addClass("prompt-data-text-question").text("Would you like to buy"))
			.append($('<span />').addClass("prompt-data-text-answer").text(msgArr[0]))
			.append($('<span />').addClass("prompt-data-text-question").text("The price is"))
			.append($('<span />').addClass("prompt-data-text-answer").text(msgArr[1]));
		var $btnBar = $('<div />').addClass('button-bar');

		var $yesBtn = $('<button />').attr('type', 'button').addClass('btn btn-default')
			.text('YES').on('click', function() {
				$('.prompt').hide(20);
				$('.prompt').remove();
				var player = GameHandler.getPlayerByName(event.playerName)[0];
				player.money -= parseInt(msgArr[1]);
				oDfd.resolve(true, event.id);
			});
		var $noBtn = $('<button />').attr('type', 'button').addClass('btn btn-default')
			.text('NO').on('click', function() {
				$('.prompt').hide(20);
				$('.prompt').remove();
				oDfd.resolve(false, event.id);
			});

		setTimeout(function() {
			if (!answeredToDialog) {
				oDfd.resolve();
			}
		}, 60000)
		$btnBar.append($noBtn, $yesBtn);
		$dialogPrompt.append($dialogHeader, $dialogData, $btnBar);
		$('.main-container').append($dialogPrompt);

	};

	board.prototype.createCardDialog = function createCardDialog(type, eventMsg) {
		var that = this;
		Board.deletePromptIfExist();
		var $dialogPrompt = $('<div />').addClass("prompt");
		var $dialogHeader = $('<div />').addClass('prompt-header').append($('<span />').addClass("prompt-text").text(type === BoardUtils.DialogType.SURPRISE ? "Surprise" : "Warrant"));
		var $dialogData = $('<div />').addClass('prompt-data-card')
			.append($('<div />').addClass('card-text-container').append('<span />').addClass('card-text').text(eventMsg));
		$dialogPrompt.append($dialogHeader, $dialogData);
		$('.main-container').append($dialogPrompt);
		setTimeout(function() {
			that.deletePromptIfExist();
		}, 1000);
	};

	board.prototype.deletePromptIfExist = function deletePromptIfExist() {
		var $prompt = $('.prompt');
		if ($prompt.length > 0) {
			$prompt.remove();
		}
	};

	board.prototype.updatePlayersOnBar = function updatePlayersOnBar(oDfd) {
		var that = this;
		GameHandler.Sleep(100).then(function() {
			that.$playersBar.empty();
			that.$playersBar = $('.players-bar');
			$.each(GameHandler.playerArr, function(i, val) {
				that.$playersBar.append(Board.createPlayerProfile(val));
			});
			oDfd.resolve();
		});
	};

	board.prototype.initTooltips = function initTooltips(){
			GameHandler.tooltipsArr.forEach(function(ind){
				var $cell = $('#cell' + ind);
				$cell.on("mouseover", function() {
					$("#cell" + ind + "-tooltip").show()
				});
				$cell.on("mouseout", function() {
					$("#cell" + ind + "-tooltip").hide()
				});
			})
	};

	return new board();
}())













