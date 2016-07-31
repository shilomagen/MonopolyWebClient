/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.monopoly.servlets;

import com.google.gson.Gson;
import com.monopoly.utils.AppUtils;
import com.monopoly.utils.BoardInfo;
import com.monopoly.utils.ContextValues;
import com.monopoly.utils.InitiateGame;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.xml.sax.SAXException;
import ws.monopoly.MonopolyWebService;
import ws.monopoly.MonopolyWebServiceService;

/**
 *
 * @author i327364
 */
@WebServlet(name = "GetBoardXML", urlPatterns = {"/GetBoardXML"})
public class GetBoardXML extends HttpServlet {

   
    MonopolyWebServiceService monopolyService;
    MonopolyWebService monopoly;
    AppUtils appUtils;
    BoardInfo boardInfo;
    InitiateGame initiator;

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

        if (getServletContext().getAttribute(ContextValues.BOARD_INFO) == null) {
            if (getServletContext().getAttribute(ContextValues.APP_UTILS) == null) {
                appUtils = new AppUtils();
                getServletContext().setAttribute(ContextValues.APP_UTILS, appUtils);
            }
            appUtils = (AppUtils) getServletContext().getAttribute(ContextValues.APP_UTILS);
            
            if (getServletContext().getAttribute(ContextValues.MONOPOLY_WEB_SERVICE) == null) {
                appUtils.connectToServer(this);
            }
            
            monopoly = (MonopolyWebService) getServletContext().getAttribute(ContextValues.MONOPOLY_WEB_SERVICE);

            String boardXML = monopoly.getBoardXML();
            appUtils.createNewFileInResources("monopoly_config.xml", boardXML);
            if (getServletContext().getAttribute(ContextValues.INITIATE_OBJECT) == null) {
                initiator = new InitiateGame();
                getServletContext().setAttribute(ContextValues.INITIATE_OBJECT, initiator);
            }
            try {
                InitiateGame.xmlLoad();
                boardInfo = new BoardInfo(InitiateGame.getBoardData(), InitiateGame.getAssets());
                getServletContext().setAttribute(ContextValues.BOARD_INFO, boardInfo);
            } catch (SAXException ex) {
                System.out.println("error in xml load");
                Logger.getLogger(GetBoardXML.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        boardInfo = (BoardInfo) getServletContext().getAttribute(ContextValues.BOARD_INFO);
        response.setContentType("application/json");
        try (PrintWriter out = response.getWriter()) {
            out.println(new Gson().toJson(boardInfo));
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
