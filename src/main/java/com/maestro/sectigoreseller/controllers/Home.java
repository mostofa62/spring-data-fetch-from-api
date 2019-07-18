package com.maestro.sectigoreseller.controllers;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.maestro.sectigoreseller.lib.Utils;



@Controller
@RequestMapping("/")
public class Home {

	private final String USER_AGENT = "Mozilla/5.0";
	
	@GetMapping("")
	public String index(Model model, @RequestParam("querydate") String querydate) {
		
		String url="https://secure.comodo.net/products/!WebHostReport";
		try {
			URL obj = new URL(url);
			HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();
			
			Date date=new SimpleDateFormat("yyyy-MM-dd").parse(querydate); 
			//add reuqest header
			con.setRequestMethod("POST");	
			con.setRequestProperty("User-Agent", USER_AGENT);
			con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");
			//params 
			Map<String, String> params = new HashMap<String, String>();
			params.put("loginName", "mostofa");
			params.put("loginPassword", "Mos#123456");
			//params.put("notBefore", String.valueOf(date.getTime()));
			params.put("firstResultNo", "1");
			params.put("lastResultNo", "3");
			String urlParameters = Utils.formatQueryParams(params);
			
			// Send post request
			con.setDoOutput(true);
			DataOutputStream wr = new DataOutputStream(con.getOutputStream());
			wr.writeBytes(urlParameters);
			wr.flush();
			wr.close();

			int responseCode = con.getResponseCode();
			System.out.println("\nSending 'POST' request to URL : " + url);
			System.out.println("Post parameters : " + urlParameters);
			System.out.println("Response Code : " + responseCode);

			BufferedReader in = new BufferedReader(
			        new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuffer response = new StringBuffer();

			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
				//System.out.println(inputLine);
			}
			in.close();
			
			//print result
			System.out.println(response.toString());
			
		}catch (Exception e) {
			System.out.println("Exception: "+e.toString());
		}
		return "home/index";
	}
}
