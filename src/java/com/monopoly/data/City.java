package com.monopoly.data;



public class City {
	private String country;
	private String name;
	private int cost;
	private int houseCost;
	private int stayCost;
	private int stayCost1; 
	private int stayCost2;
	private int stayCost3;
	
	
	
	public City(String country, String name, int cost, int houseCost,int stayCost, int stayCost1, int stayCost2, int stayCost3){
		this.setCountry(country);
		this.setName(name);
		this.cost = cost;
		this.houseCost = houseCost;
		this.stayCost = stayCost;
		this.stayCost1 = stayCost1;
		this.stayCost2 = stayCost2;
		this.stayCost3 = stayCost3;
		
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getCost() {
		return cost;
	}

	public void setCost(int cost) {
		this.cost = cost;
	}

	public int getHouseCost() {
		return houseCost;
	}

	public void setHouseCost(int houseCost) {
		this.houseCost = houseCost;
	}

	public int getStayCost() {
		return stayCost;
	}

	public void setStayCost(int stayCost) {
		this.stayCost = stayCost;
	}

	public int getStayCost1() {
		return stayCost1;
	}

	public void setStayCost1(int stayCost1) {
		this.stayCost1 = stayCost1;
	}

	public int getStayCost2() {
		return stayCost2;
	}

	public void setStayCost2(int stayCost2) {
		this.stayCost2 = stayCost2;
	}

	public int getStayCost3() {
		return stayCost3;
	}

	public void setStayCost3(int stayCost3) {
		this.stayCost3 = stayCost3;
	}

	
}
