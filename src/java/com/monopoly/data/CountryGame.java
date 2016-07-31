package com.monopoly.data;

import java.util.LinkedList;

public class CountryGame {
	private final String name;
	private int citiesNum;
	private LinkedList<City> cities;
	
	public CountryGame(String name){
		this.name = name;
	}
	
	public LinkedList<City> getCities() {
		return cities;
	}

	public void setCities(LinkedList<City> theCities) {
		this.cities = theCities;
	}


	public int getCitiesNum() {
		return citiesNum;
	}


	public void setCitiesNum(int citiesNum) {
		this.citiesNum = citiesNum;
	}

	public String getName() {
		return name;
	}
	

}
