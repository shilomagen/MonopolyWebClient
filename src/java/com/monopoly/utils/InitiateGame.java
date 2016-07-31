/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.monopoly.utils;

import com.monopoly.data.Assets;
import com.monopoly.data.BoardData;
import com.monopoly.data.Card;
import com.monopoly.data.CellData;
import com.monopoly.data.City;
import com.monopoly.data.CountryGame;
import com.monopoly.data.GetOutOfJailCard;
import com.monopoly.data.GoToCard;
import com.monopoly.data.MontaryCard;
import com.monopoly.data.Transportation;
import com.monopoly.data.Utility;
import com.monopoly.scheme.CardBase;
import com.monopoly.scheme.CityType;
import com.monopoly.scheme.GotoCard;
import com.monopoly.scheme.MonetaryCard;
import com.monopoly.scheme.Monopoly;
import com.monopoly.scheme.SimpleAssetType;
import com.monopoly.scheme.SquareBase;
import com.monopoly.scheme.SquareType;
import java.io.File;
import java.io.InputStream;
import java.net.URL;
import java.util.LinkedList;
import java.util.List;
import javax.xml.XMLConstants;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import org.xml.sax.SAXException;



/**
 *
 * @author i327364
 */
public class InitiateGame {

	private static Monopoly monopoly;
	private static Assets gameAssets;
	private static LinkedList<CountryGame> theCountries;
	private static LinkedList<Transportation> transportation;
	private static BoardData board;
	private static LinkedList<Utility> utility;
	private static LinkedList<Card> supriseCards;
	private static LinkedList<Card> warrantCards;



	public static void xmlLoad() throws SAXException {
		URL csdURL = InitiateGame.class.getResource(File.separator + "com" +File.separator + "monopoly" + File.separator +"resources"+File.separator + "monopoly_config.xsd");
		SchemaFactory schemaFactory = SchemaFactory.newInstance(XMLConstants.W3C_XML_SCHEMA_NS_URI);
		Schema schema = schemaFactory.newSchema(csdURL);

		// get the XML content
		InputStream xmlInputStream = InitiateGame.class
				.getResourceAsStream(File.separator + "com" +File.separator + "monopoly" + File.separator +"resources"+File.separator + "monopoly_config.xml");

		try {
			JAXBContext context = JAXBContext.newInstance(Monopoly.class);
			Unmarshaller unmarshaller = context.createUnmarshaller();
			unmarshaller.setSchema(schema);

			monopoly = (Monopoly) unmarshaller.unmarshal(xmlInputStream);
			gameAssets = new Assets((int) monopoly.getAssets().getUtilities().getStayCost(),
					(int) monopoly.getAssets().getTransportations().getStayCost());

			theCountries = createCountries(monopoly);
			transportation = createTransportation(monopoly);
			utility = createUtility(monopoly);
			gameAssets.setAssets(theCountries, transportation, utility);
			board = new BoardData();
			board.setTheBoard(getMonopolyBoard(monopoly));
			supriseCards = createSupriseCards(monopoly);
			warrantCards = createWarrantCards(monopoly);	
			
		} catch (JAXBException exception) {
			exception.printStackTrace();
		}
	}

	public static LinkedList<CellData> getMonopolyBoard(Monopoly monopoly) {
		LinkedList<CellData> theBoard = new LinkedList<>();
		List<JAXBElement<? extends SquareBase>> monoBoard = monopoly.getBoard().getContent();
		for (JAXBElement<? extends SquareBase> tempSquare : monoBoard) {
			String className = tempSquare.getValue().getClass().getName();
			if (className.contains("StartSquareType")) {
				CellData tempCell = new CellData("Start Square");
				theBoard.add(tempCell);
			} else if (className == "com.monopoly.scheme.SquareType") {
				SquareType realOne = (SquareType) tempSquare.getValue();
				CellData tempCell = new CellData(realOne.getType());
				theBoard.add(tempCell);
			} else if (className == "com.monopoly.scheme.GotoJailSquareType") {
				CellData tempCell = new CellData("GotoJail");
				theBoard.add(tempCell);
			} else if (className == "com.monopoly.scheme.JailSlashFreeSpaceSquareType") {
				CellData tempCell = new CellData("Jail");
				theBoard.add(tempCell);
			} else if (className == "com.monopoly.scheme.ParkingSquareType") {
				CellData tempCell = new CellData("Parking");
				theBoard.add(tempCell);
			}
		}
		return theBoard;

	}

	public static LinkedList<Card> createSupriseCards(Monopoly monopoly) {
		LinkedList<Card> supriseCard = new LinkedList<>();
		List<CardBase> supCard = monopoly.getSurprise().getSurpriseCards();
		for (CardBase tempCard : supCard) {
			Card newCard;
			if (tempCard != null) {
				String className = tempCard.getClass().getName();
				if (className.contains("MonetaryCard")) {
					newCard = new MontaryCard(((MonetaryCard) tempCard).getText(),
							(int) ((MonetaryCard) tempCard).getNum(), (int) ((MonetaryCard) tempCard).getSum());
					supriseCard.add(newCard);
				} else if (className.contains("GotoCard")) {
					newCard = new GoToCard(((GotoCard) tempCard).getText(), (int) ((GotoCard) tempCard).getNum(),
							((GotoCard) tempCard).getTo());
					supriseCard.add(newCard);
				} else if (className.contains("GetOutOfJailCard")) {
					newCard = new GetOutOfJailCard(tempCard.getText(), (int) tempCard.getNum());
					supriseCard.add(newCard);
				}
			}
		}

		return supriseCard;
	}

	public static LinkedList<Card> createWarrantCards(Monopoly monopoly) {
		LinkedList<Card> warrantCard = new LinkedList<>();
		List<CardBase> warCards = monopoly.getWarrant().getWarrantCards();
		for (CardBase tempCard : warCards) {
			Card newCard;
			if (tempCard != null) {
				String className = tempCard.getClass().getName();
				if (className.contains("MonetaryCard")) {
					newCard = new MontaryCard(((MonetaryCard) tempCard).getText(),
							(int) ((MonetaryCard) tempCard).getNum(), (int) ((MonetaryCard) tempCard).getSum());
					warrantCard.add(newCard);
				} else if (className.contains("GotoCard")) {
					newCard = new GoToCard(((GotoCard) tempCard).getText(), (int) ((GotoCard) tempCard).getNum(),
							((GotoCard) tempCard).getTo());
					warrantCard.add(newCard);
				}
			}
		}
		return warrantCard;
	}

	public static LinkedList<CountryGame> createCountries(Monopoly monopoly) {
		LinkedList<CountryGame> theCountries = new LinkedList<>();

		List<Monopoly.Assets.Countries.Country> countries = monopoly.getAssets().getCountries().getCountry();
		for (Monopoly.Assets.Countries.Country country : countries) {
			if (country != null) {
				CountryGame theCountry = new CountryGame(country.getName());
				LinkedList<City> theCities;
				theCities = createCities(country);
				theCountry.setCities(theCities);
				theCountry.setCitiesNum(theCities.size());
				theCountries.add(theCountry);
			}
		}
		return theCountries;

	}

	public static LinkedList<City> createCities(Monopoly.Assets.Countries.Country country) {
		LinkedList<City> theCities = new LinkedList<>();
		List<CityType> cityList = country.getCity();
		for (CityType tempCity : cityList) {
			if (tempCity != null) {
				City newCity = new City(country.getName(), tempCity.getName(), (int) tempCity.getCost(),
						(int) tempCity.getHouseCost(), (int) tempCity.getStayCost(), (int) tempCity.getStayCost1(),
						(int) tempCity.getStayCost2(), (int) tempCity.getStayCost3());
				theCities.add(newCity);
			}

		}
		return theCities;
	}

	public static LinkedList<Transportation> createTransportation(Monopoly monopoly) {
		LinkedList<Transportation> transportation = new LinkedList<>();
		List<SimpleAssetType> trans = monopoly.getAssets().getTransportations().getTransportation();
		for (SimpleAssetType tempAsset : trans) {
			if (tempAsset != null) {
				Transportation tempTrans = new Transportation(tempAsset.getName(), (int) tempAsset.getStayCost(),
						(int) tempAsset.getCost());
				transportation.add(tempTrans);
			}
		}
		return transportation;

	}

	public static LinkedList<Utility> createUtility(Monopoly monopoly) {
		LinkedList<Utility> utility = new LinkedList<>();
		List<SimpleAssetType> util = monopoly.getAssets().getUtilities().getUtility();
		for (SimpleAssetType tempAsset : util) {
			if (tempAsset != null) {
				Utility tempUtil = new Utility(tempAsset.getName(), (int) tempAsset.getStayCost(),
						(int) tempAsset.getCost());
				utility.add(tempUtil);
			}
		}
		return utility;
	}

	public static Assets getAssets() {
		return gameAssets;
	}

	public static BoardData getBoardData() {
		return board;
	}

	public static LinkedList<Card> getSupriseCards() {
		return supriseCards;
	}

	public static LinkedList<Card> getWarrantCards() {
		return warrantCards;
	}

}

