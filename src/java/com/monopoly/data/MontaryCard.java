package com.monopoly.data;


//import com.monopoly.engine.GameController;
public class MontaryCard extends Card {
	private int sum;

	public MontaryCard(String cardText, int cardCode, int sum) {
		super(cardText, cardCode);
		this.sum = sum;
	}

	public String toString() {
		return String.format(this.cardText, sum);
	}

	

	public int getSum() {
		return this.sum;
	}

}
