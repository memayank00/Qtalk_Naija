
/**required */
export const required = value => value ? undefined : 'This field is required';

/**EMAIL */
const _regex = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
export const emailValiadte = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
        'Invalid email address' : undefined;

/**MOBILE */
export const mobileValidate = value =>
    value && !/^\d+$/.test(value) ?
        'Invalid mobile no.' : undefined;

/**MAXLENGTH */
const maxLength = max => value =>
    value && value.length > max ? `Must be ${max} characters or less` : undefined;
export const maxLengthValidate = maxLength(10);

/**MINLENGTH */
 const  minLength = min => value =>
    value && value.length < min ? `Must be ${min} characters or more` : undefined;   
export const minLengthValidate = minLength(3);
export const minLengthPassword=minLength(6);

/**MUST BE A NUMBER */
export const number = value => value && isNaN(Number(value)) ? 'Must be a number' : undefined;

/**STRONG PASSWORD */
export const password = value => value && !_regex.test(value) ?
    `length must be greater than or equal to 8,
     contain one or more uppercase characters,
     contain one or more lowercase characters,
     contain one or more numeric values,
     contain one or more special characters(!@#$%^&*) ` : undefined;

/**IP ADDRESS */
const IPRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
export const ValidateIPaddress = ipaddress => ipaddress && !IPRegex.test(ipaddress) ? "Yor are trying to enter invalid IP Address":undefined;

/**DOB Greater Than 18 */
export const dobValidate = DOB=>{
    /**today,s date */
    let today = new Date();
    /**DOB got from redux input field */
    let birthDate = new Date(DOB);
    /**diffrence between current year and dob year*/
    let age = today.getFullYear() - birthDate.getFullYear();
    /**diffrence between months */
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (DOB && age < 18) return `Age must be greater than 18` 
    return undefined;
}
/* Searching */
const AlphabetRegex = /^[A-z0-9](?!.*[\%\/\&\?\,\'\;\:\!\-\#]{2}).*$/;
export const ValidateOnlyAlpha = value =>
  value && !AlphabetRegex.test(value)
    ? "Consecutive Special characters are not allowed"
    : undefined;

