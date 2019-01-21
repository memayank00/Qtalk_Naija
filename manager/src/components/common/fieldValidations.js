import { placesServiceStatus } from "./helper";
import { geocodeByAddress } from "react-places-autocomplete";

import lodash from "lodash";
var _ = lodash;
/**required */
export const required = value => (value ? undefined : "This field is required");

/**EMAIL */
const _regex = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
export const emailValiadte = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? "Invalid email address"
        : undefined;

/**MOBILE */
export const mobileValidate = value =>
    value && !/^[0-9]\d{9}$/i.test(value)
        ? "Invalid mobile no. (must be of 10 digits)"
        : undefined;

/* Whole Number Validations */

export const sfValidation = value =>
    value && !/^\d+$/.test(value)
    ? "Invalid SF"
    : undefined;

/*COAFee validations */
export const COAFee = value =>
    value && !/^\d{1,5}$/.test(value) 
    ? "Invalid COA Fee Period"
    : undefined;

/*HOA Fee validations */
export const HOAFee = value =>
    value && !/^\d{1,5}$/.test(value)
    ? "Invalid HOA Fee Period"
    : undefined;

/**
 * String slug validation
 */
export const slugValidation = value =>
    value && !/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/i.test(value)
        ? "Invalid custom url"
        : undefined;

/**MAXLENGTH */
const maxLength = max => value =>
    value && value.length > max
        ? `Must be ${max} characters or less`
        : undefined;
export const maxLengthValidate = maxLength(10);

export const customer_titlemax=maxLength(65);
export const customer_summax=maxLength(400);
export const customer_quote=maxLength(260);
export const schoolName=maxLength(50);
export const customer_quotemax=maxLength(160);


/**MINLENGTH */
const minLength = min => value =>
    value && value.length < min
        ? `Must be ${min} characters or more`
        : undefined;
export const minLengthValidate = minLength(3);
export const customer_titlemin=minLength(35);
export const customer_summin=minLength(300);
export const customer_secmin=minLength(500);
export const customer_sec2min=minLength(300);
export const customer_quotemin=minLength(120);

/**MUST BE A NUMBER */
export const number = value =>
    value && isNaN(Number(value)) ? "Must be a number" : undefined;

/**STRONG PASSWORD */
export const password = value =>
    value && !_regex.test(value)
        ? `length must be greater than or equal to 8,
     contain one or more uppercase characters,
     contain one or more lowercase characters
     contain one or more numeric values,
     contain one or more special characters(!@#$%^&*), `
        : undefined;

/**IP ADDRESS */
const IPRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
export const ValidateIPaddress = ipaddress =>
    ipaddress && !IPRegex.test(ipaddress)
        ? "Yor are trying to enter invalid IP Address"
        : undefined;

/**Only ALphabets ,digits and space */
const AlphabetRegex = /^[A-z0-9](?!.*[\%\/\&\?\,\'\;\:\!\-\#]{2}).*$/;
export const ValidateOnlyAlpha = value =>
    value && !AlphabetRegex.test(value)
        ? "Consecutive Special characters are not allowed"
        : undefined;

        /* enter only integers */
export const faqOrder= value =>{
   return value==undefined 
        ? "Invalid Order"
        : undefined;
}


export const isValidAddress = (value, allValues, props, name) => {
    return new Promise((resolve, reject) => {
        if (!value || !name) {
            resolve();
            return;
        }
        geocodeByAddress(value[name])
            .then(result => resolve())
            .catch(error => {
                console.log("inside is Valid", error);
                let _error = _.find(placesServiceStatus, [
                        "status_code",
                        error
                    ]),
                    message =
                        "The request could not be processed due to a server error";
                if (_.has(_error, "message")) {
                    reject({ [name]: _error.message });
                } else {
                    reject({ [name]: message });
                }
            });
    });
};

/* export const fourDigit */
