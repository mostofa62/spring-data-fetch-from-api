package com.maestro.sectigoreseller.lib;

import java.util.Map;

public final class Utils {

	public static String formatQueryParams(Map<String, String> params) {
		return params.entrySet().stream()
			      .map(p -> p.getKey() + "=" + p.getValue())
			      .reduce((p1, p2) -> p1 + "&" + p2)
			      //.map(s -> "?" + s)
			      .map(s -> s)
			      .orElse("");
	}
	
}
