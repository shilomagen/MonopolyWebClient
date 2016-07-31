/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.monopoly.utils;

import com.monopoly.data.Assets;
import com.monopoly.data.BoardData;

/**
 *
 * @author i327364
 */
public class BoardInfo {
    private BoardData boardData;
    private Assets gameAssets;
    
    
    public BoardInfo(BoardData _boardData, Assets _assets){
        this.boardData = _boardData;
        this.gameAssets = _assets;
    }
}

