/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.monopoly.servlets;

import com.monopoly.game.GamesMap;
import com.monopoly.utils.AppUtils;
import static com.monopoly.utils.AppUtils.GAME_NOT_EXIST;
import static com.monopoly.utils.AppUtils.INVALID_PARAMATERS;
import static com.monopoly.utils.AppUtils.PLAYER_ID;
import com.monopoly.utils.ContextValues;
import static com.monopoly.utils.ContextValues.GAMES_MAP;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.simple.JSONObject;
import ws.monopoly.GameDoesNotExists_Exception;
import ws.monopoly.InvalidParameters_Exception;
import ws.monopoly.MonopolyWebService;

/**
 *
 * @author i327364
 */
@WebServlet(name = "JoinGame", urlPatterns = {"/JoinGame"})
public class JoinGame extends HttpServlet {

    MonopolyWebService monopoly;

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        AppUtils appUtils;
        if (getServletContext().getAttribute(ContextValues.APP_UTILS) == null) {
            appUtils = new AppUtils();
            getServletContext().setAttribute(ContextValues.APP_UTILS, appUtils);
        }
        appUtils = (AppUtils) getServletContext().getAttribute(ContextValues.APP_UTILS);
        if (getServletContext().getAttribute(ContextValues.MONOPOLY_WEB_SERVICE) == null) {
            appUtils.connectToServer(this);
        }
        String gameName = request.getParameter("gameName");
        String playerName = request.getParameter("playerName");
        String errorString = null;
        monopoly = (MonopolyWebService) getServletContext().getAttribute(ContextValues.MONOPOLY_WEB_SERVICE);
        int playerID = this.playerJoinExistingGame(monopoly, gameName, playerName);

        if (playerID == GAME_NOT_EXIST) {
            errorString = "Game doesnot exist";
        } else if (playerID == INVALID_PARAMATERS) {
            errorString = "Invalid Paramaters";
        }

        response.setContentType("application/json");
        try (PrintWriter out = response.getWriter()) {
            JSONObject jsonObject = new JSONObject();
            if (errorString != null) {
                jsonObject.put("result", false);
                jsonObject.put("message", errorString);
            } else {

                jsonObject.put("result", true);
                jsonObject.put("message", playerID);
                if (getServletContext().getAttribute(GAMES_MAP) == null) {
                    appUtils.initGamesMap(this);
                }
                request.getSession(true).setAttribute(PLAYER_ID, playerID);
                GamesMap gamesMap = (GamesMap) getServletContext().getAttribute(GAMES_MAP);
                gamesMap.addPlayer(playerID, gameName);
            }
            out.print(jsonObject.toString());
        }
    }

    private int playerJoinExistingGame(MonopolyWebService monopoly, String gameName, String playerName) {
        try {
            return monopoly.joinGame(gameName, playerName);
        } catch (GameDoesNotExists_Exception ex) {
            return GAME_NOT_EXIST;
        } catch (InvalidParameters_Exception ex) {
            return INVALID_PARAMATERS;
        }

    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
