package com.monopoly.data;

public class Transportation {

    private final int stayCost;
    private final String name;
    private final int cost;

    public Transportation(String name, int stayCost, int cost) {
        this.stayCost = stayCost;
        this.name = name;
        this.cost = cost;

    }

    public String getName() {
        return name;
    }

    public int getStayCost() {
        return stayCost;
    }

    public int getCost() {
        return this.cost;
    }

}
