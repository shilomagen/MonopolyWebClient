var HomePage = (function() {
	function homePage() {
	}

	homePage.prototype.init = function init() {
		this.createGameContainer = $(".create-game");
		this.joinGameContainer = $(".join-game");
		this.showWaitingContainer = $('#waitingGames');
		this.joinGameContainer.hide();
		this.showWaitingContainer.hide();
	}
	homePage.prototype.showJoinGame = function showJoinGame() {
		this.createGameContainer.hide(200);
		this.showWaitingContainer.hide();
		this.joinGameContainer.show(200);
		$("#createGameNav").removeClass("active");
		$("#waitingGameNav").removeClass("active");
		$("#joinGameNav").addClass("active");
		var $selectBox = $('#gameSelect');
		var that = this;
		$.ajax({
			url: 'GetWaitingGames',
			type: 'GET',
			success: function(waitingGames) {
				var waitingArr = JSON.parse(waitingGames);
				that.fillTheSelectBox($selectBox, waitingArr, waitingArr.length);
				console.log("Waiting list success");
			},
			error: function(e) {
				console.log('error');
			}
		});
	}

	homePage.prototype.showCreateGame = function showCreateGame(e) {
		this.createGameContainer.show(200);
		this.joinGameContainer.hide(200);
		this.showWaitingContainer.hide(200);
		$("#joinGameNav").removeClass("active");
		$("#waitingGameNav").removeClass("active");
		$("#createGameNav").addClass("active");

	}
	homePage.prototype.fillTheSelectBox = function fillTheSelectBox($selectBox, waitingGameArr, size) {
		var $noGamesLabel = $('#noGamesAvailable');
		$selectBox.empty();
		if (size === 0) {
			$selectBox.hide();
			$noGamesLabel.show();
			return;
		}
		$noGamesLabel.hide();
		$selectBox.show();
		waitingGameArr.forEach(function(gameName) {
			var $option = $('<option />').attr('value', gameName).text(gameName);
			$selectBox.append($option);
		});
	}

	homePage.prototype.showWaitingGame = function showWaitingGame() {
		var that = this;
		this.showWaitingContainer.show(200);
		this.joinGameContainer.hide(200);
		this.createGameContainer.hide(200);
		$("#joinGameNav").removeClass("active");
		$("#createGameNav").removeClass("active");
		$("#waitingGameNav").addClass("active");
		var $listToUpdate = $('#waitingList').find('ul');
		$.ajax({
			url: 'GetWaitingGames',
			type: 'GET',
			success: function(waitingGames) {
				var waitingArr = JSON.parse(waitingGames);
				that.fillWaitingList($listToUpdate, waitingArr, waitingArr.length);
				console.log("Waiting list success");
			},
			error: function(e) {
				console.log('error');
			}
		});
	}

	homePage.prototype.fillWaitingList = function fillWaitingList(listToUpdate, waitingGameArr, size) {
		listToUpdate.empty();
		waitingGameArr.forEach(function(gameName) {
			var $li = $('<li />').addClass('list-group-item')
				.append($('<div />').addClass('row').append($('<div />').addClass('col-md-6 waiting-game-name').text(gameName)
					.append($('<div />').addClass('col-md-2 waiting-signal').text('Waiting...')))
				);
			listToUpdate.append($li);
		});
		if (size === 0) {
			var $li = $('<li />').addClass('list-group-item').css('background-color', '#217DD2')
				.append($('<div />').addClass('row').append($('<div />').addClass('col-md-12').text("There is no games!").css('text-align', 'center')));
			listToUpdate.append($li);
		}
	}

	homePage.prototype.onCreateGame = function onCreateGame() {
		var createGameData = {
			gameName: $('#gameName').val(),
			pcPlayers: parseInt($('#PcPlayers').val()),
			humanPlayers: parseInt($('#HumanPlayers').val())
		};
		var that = this;
		var isPlayersValid = this.checkIsValidPlayers(createGameData);
		if (isPlayersValid.val) {
			$.ajax({
				url: "CreateGame",
				type: "POST",
				data: createGameData,
				success: function(e) {
					var result = JSON.parse(e);
					if (result.res){
						console.log(result.msg);
						that.showJoinGame();
					} else {
						that.showErrorMessage(result.msg);
					}

				},
				error: function(e) {
					that.showErrorMessage(e);
					console.log("Couldn't create game!");
				}
			});
		}
		else {
			showErrorMessage(isPlayersValid.err)
		}
	}

	homePage.prototype.onJoinGame = function onJoinGame() {
		var that = this;
		var joinGameData = {
			gameName: $('#gameSelect').val(),
			playerName: $('#playerName').val()
		};
		$.ajax({
			url: "JoinGame",
			type: "POST",
			data: joinGameData,
			success: function(e) {
				console.log(e);
				that.joinGameHandle(e, joinGameData);
			},
			error: function(e) {
				that.showErrorMessage(e);

			}
		});
	};

	homePage.prototype.joinGameHandle = function joinGameHandle(response, joinGameData) {
		if (response.result) {
			navigatePage("waiting-page");
			WaitingPage.init(joinGameData.playerName, joinGameData.gameName);
		} else {
			this.showErrorMessage(response.message);
		}
	};

	homePage.prototype.checkIsValidPlayers = function checkIsValidPlayers(createGameData) {
		var retObj = {val: true};
		if (createGameData.humanPlayers < 0 || createGameData.pcPlayers < 0) {
			retObj.val = false;
			retObj.err = "You cant enter negative players";
		}
		else if (createGameData.humanPlayers < 1) {
			retObj.val = false;
			retObj.err = "There must be at least one human Player";
		}
		else if (createGameData.humanPlayers + createGameData.pcPlayers > 6) {
			retObj.val = false;
			retObj.err = "Max 6 players, sorry!";
		}
		return retObj;
	}

	homePage.prototype.showErrorMessage = function showErrorMessage(err) {
		$(".error-message-create-game > .error-message-value").text(err);
		$(".error-message-create-game").css('display', 'block');
	}
	return new homePage();
}());

HomePage.init();


