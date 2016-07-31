package com.monopoly.data;

public class Utility {

    private final int stayCost;
    private final String name;
    private final int cost;

    public Utility(String name, int stayCost, int cost) {
        this.stayCost = stayCost;
        this.name = name;
        this.cost = cost;

    }

    public int getStayCost() {
        return stayCost;
    }

    public String getName() {
        return name;
    }

    public int getCost() {
        return this.cost;
    }

}
