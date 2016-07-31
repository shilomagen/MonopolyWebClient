/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.monopoly.game;

import java.util.HashMap;

/**
 *
 * @author i327364
 */
public class GamesMap {
    HashMap gamesMap;
    
    public GamesMap(){
        gamesMap = new HashMap();
    }
    
   public void addPlayer(int playerID, String gameName){
       gamesMap.put(playerID, gameName);
   }
    
}
