package com.monopoly.data;

import java.util.LinkedList;

public class Assets {
    private LinkedList<CountryGame> theCountries;
    private LinkedList<Transportation> transportation;
    private LinkedList<Utility> utility;
    
    private final int utilityStayCost;
    private final int transportationStayCost;
    
    public Assets(int utilStayCost, int transStayCost){
    	this.utilityStayCost = utilStayCost;
    	this.transportationStayCost = transStayCost;
    };
    public void setAssets(LinkedList<CountryGame> countries, LinkedList<Transportation> trans, LinkedList<Utility> util){
    	this.setTheCountries(countries);
    	this.setTransportation(trans);
    	this.setUtility(util);
    }
	public LinkedList<CountryGame> getTheCountries() {
		return theCountries;
	}
	public void setTheCountries(LinkedList<CountryGame> theCountries) {
		this.theCountries = theCountries;
	}
	public LinkedList<Transportation> getTransportation() {
		return transportation;
	}
	public void setTransportation(LinkedList<Transportation> transportation) {
		this.transportation = transportation;
	}
	public LinkedList<Utility> getUtility() {
		return utility;
	}
	public void setUtility(LinkedList<Utility> utility) {
		this.utility = utility;
	}
	public int getUtilityStayCost() {
		return utilityStayCost;
	}
	public int getTransportationStayCost() {
		return transportationStayCost;
	}
}
