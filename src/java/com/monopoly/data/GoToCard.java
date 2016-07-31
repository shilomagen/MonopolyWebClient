package com.monopoly.data;

public class GoToCard extends Card {
	String cellToGo;

	public GoToCard(String cardText, int cardCode, String cellToGo) {
		super(cardText, cardCode);
		this.cellToGo = cellToGo;
	}

	

	public String toString() {
		return String.format(this.cardText, this.cellToGo);
	}

}
