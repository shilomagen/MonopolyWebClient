/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.monopoly.servlets;

import com.monopoly.utils.AppUtils;
import com.monopoly.utils.ContextValues;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.simple.JSONObject;
import ws.monopoly.DuplicateGameName_Exception;
import ws.monopoly.InvalidParameters_Exception;
import ws.monopoly.MonopolyWebService;
import ws.monopoly.MonopolyWebServiceService;

/**
 *
 * @author i327364
 */
@WebServlet(name = "CreateGame", urlPatterns = {"/CreateGame"})
public class CreateGame extends HttpServlet {

    MonopolyWebServiceService monopolyService;
    MonopolyWebService monopoly;
    AppUtils appUtils;
    boolean wasCreated;

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
        if (getServletContext().getAttribute(ContextValues.APP_UTILS) == null) {
            appUtils = new AppUtils();
            getServletContext().setAttribute(ContextValues.APP_UTILS, appUtils);
        }
        appUtils = (AppUtils) getServletContext().getAttribute(ContextValues.APP_UTILS);
        if (getServletContext().getAttribute(ContextValues.MONOPOLY_WEB_SERVICE) == null) {
            appUtils.connectToServer(this);
        }
        monopoly = (MonopolyWebService) getServletContext().getAttribute(ContextValues.MONOPOLY_WEB_SERVICE);

        JSONObject obj = this.createGame(request);
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            out.println(obj.toString());
            out.flush();

        }
    }

    private JSONObject createGame(HttpServletRequest request) {
        String pcPlayers = request.getParameter("pcPlayers");
        String humanPlayers = request.getParameter("humanPlayers");
        String gameName = request.getParameter("gameName");
        JSONObject json = new JSONObject();
        try {
            monopoly.createGame(Integer.parseInt(pcPlayers), Integer.parseInt(humanPlayers), gameName);
            json.put("res", true);
            json.put("msg", "Game " + gameName + " was created on server!");
        } catch (DuplicateGameName_Exception | InvalidParameters_Exception ex) {
            json.put("res", false);
            json.put("msg", "Game " + gameName + " is already exist!");
        }
        return json;
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
