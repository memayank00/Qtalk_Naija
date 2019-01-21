export const placesServiceStatus = [
	{ status_code: "ERROR", message: "There was a problem contacting the Google servers" },
	{ status_code: "INVALID_REQUEST", message: "This address was invalid" },
	{ status_code: "OVER_QUERY_LIMIT", message: "The webpage has gone over its request quota" },
	{ status_code: "NOT_FOUND", message: "The referenced location was not found in the Places database"},
	{ status_code: "REQUEST_DENIED", message: "The webpage is not allowed to use the PlacesService"},
	{ status_code: "UNKNOWN_ERROR", message: "The PlacesService request could not be processed due to a server error. The request may succeed if you try again"},
	{ status_code: "ZERO_RESULTS", message: "No result was found for this address"}
];