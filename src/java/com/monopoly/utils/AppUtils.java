/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.monopoly.utils;

import com.monopoly.game.GamesMap;
import static com.monopoly.utils.ContextValues.GAMES_MAP;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.net.URL;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import ws.monopoly.MonopolyWebService;
import ws.monopoly.MonopolyWebServiceService;

/**
 *
 * @author i327364
 */
public final class AppUtils {
    public static final int GAME_NOT_EXIST=-1;
    public static final int INVALID_PARAMATERS=-2;
    public static final String PLAYER_ID = "PlayerID";
    
    GamesMap gamesMap;

    public void createNewFileInResources(String fileName, String fileContent) {
        BufferedWriter bufferedWriter = null;
        try {
            URL url = getClass().getResource(File.separator + "com" + File.separator + "monopoly" + File.separator + "resources");
            File fileToCreate = new File(url.getPath() + File.separator + fileName);
            if (!fileToCreate.exists()) {
                fileToCreate.createNewFile();
            }
            Writer writer = new FileWriter(fileToCreate);
            bufferedWriter = new BufferedWriter(writer);
            bufferedWriter.write(fileContent);
        } catch (IOException ex) {
            System.out.println("couldnt write");
        } finally {
            try {
                if (bufferedWriter != null) {
                    bufferedWriter.close();
                }
            } catch (Exception ex) {
                System.out.println("couldnt finally");
            }
        }

    }

    public void connectToServer(HttpServlet someServlet) {
        MonopolyWebServiceService monopolyService = new MonopolyWebServiceService();
        MonopolyWebService monopoly = monopolyService.getMonopolyWebServicePort();
        someServlet.getServletContext().setAttribute(ContextValues.MONOPOLY_WEB_SERVICE, monopoly);
    }
    
    public void initGamesMap(HttpServlet someServlet){
        gamesMap = new GamesMap();
        someServlet.getServletContext().setAttribute(GAMES_MAP, gamesMap);
    }
    
    public static String getPlayerID (HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        Object sessionAttribute = session != null ? session.getAttribute(PLAYER_ID) : null;
        return sessionAttribute != null ? sessionAttribute.toString() : null;
    }

    public static void clearSession (HttpServletRequest request) {
        request.getSession().invalidate();
    }
}
