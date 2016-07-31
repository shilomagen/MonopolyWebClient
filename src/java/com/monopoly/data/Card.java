package com.monopoly.data;




public abstract class Card {
	protected String cardText;
	protected int cardCode;

	public Card(String cardText, int cardCode) {
		this.cardText = cardText;
		this.cardCode = cardCode;
	}

	//public abstract void surpriseAction(Player currentPlayer);

	//public abstract void warrantAction(Player currentPlayer);

}
