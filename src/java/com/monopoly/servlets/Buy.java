/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.monopoly.servlets;

import com.google.gson.Gson;
import com.monopoly.utils.AppUtils;
import com.monopoly.utils.ContextValues;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.simple.JSONObject;
import ws.monopoly.GameDoesNotExists_Exception;
import ws.monopoly.InvalidParameters_Exception;
import ws.monopoly.MonopolyWebService;
import ws.monopoly.PlayerDetails;

/**
 *
 * @author i327364
 */
@WebServlet(name = "Buy", urlPatterns = {"/Buy"})
public class Buy extends HttpServlet {

    AppUtils appUtils;

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
        if (getServletContext()
                .getAttribute(ContextValues.APP_UTILS) == null) {
            appUtils = new AppUtils();
            getServletContext().setAttribute(ContextValues.APP_UTILS, appUtils);
        }
        appUtils = (AppUtils) getServletContext().getAttribute(ContextValues.APP_UTILS);

        if (getServletContext()
                .getAttribute(ContextValues.MONOPOLY_WEB_SERVICE) == null) {
            appUtils.connectToServer(this);
        }
        MonopolyWebService monopoly = (MonopolyWebService) getServletContext().getAttribute(ContextValues.MONOPOLY_WEB_SERVICE);
        String answerStr = request.getParameter("answer");
        int eventID = Integer.parseInt(request.getParameter("eventID"));
        boolean answer;
        if (answerStr.equals("true")) {
            answer = true;
        } else {
            answer = false;
        }
        JSONObject jsonObj = new JSONObject();
        int playerID = Integer.parseInt(appUtils.getPlayerID(request));
        try {
            monopoly.buy(playerID, eventID, answer);
            jsonObj.put("result", true);
        } catch (InvalidParameters_Exception ex) {
            jsonObj.put("result",false);
            jsonObj.put("message", "Invalid Paramaters");
        }
        response.setContentType("application/json");
        try (PrintWriter out = response.getWriter()) {
            out.println(jsonObj.toString());
            out.flush();
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
