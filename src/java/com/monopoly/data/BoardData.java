package com.monopoly.data;

import java.util.LinkedList;

public class BoardData {
	public LinkedList<CellData> theBoard;

	public BoardData(){
		theBoard = new LinkedList<>();
	}

	public LinkedList<CellData> getTheBoard() {
		return theBoard;
	}

	public void setTheBoard(LinkedList<CellData> linkedList) {
		this.theBoard = linkedList;
	}
}	
