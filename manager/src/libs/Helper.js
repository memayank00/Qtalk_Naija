const removeAcento = value => {
	let text = value.toLowerCase();
	text = text.replace(new RegExp("[ÁÀÂÃ]", "gi"), "a");
	text = text.replace(new RegExp("[ÉÈÊ]", "gi"), "e");
	text = text.replace(new RegExp("[ÍÌÎ]", "gi"), "i");
	text = text.replace(new RegExp("[ÓÒÔÕ]", "gi"), "o");
	text = text.replace(new RegExp("[ÚÙÛ]", "gi"), "u");
	text = text.replace(new RegExp("[Ç]", "gi"), "c");
	return text;
};
const specialChars = {
	à: "a",
	ä: "a",
	á: "a",
	â: "a",
	æ: "a",
	å: "a",
	ë: "e",
	è: "e",
	é: "e",
	ê: "e",
	î: "i",
	ï: "i",
	ì: "i",
	í: "i",
	ò: "o",
	ó: "o",
	ö: "o",
	ô: "o",
	ø: "o",
	ù: "o",
	ú: "u",
	ü: "u",
	û: "u",
	ñ: "n",
	ç: "c",
	ß: "s",
	ÿ: "y",
	œ: "o",
	ŕ: "r",
	ś: "s",
	ń: "n",
	ṕ: "p",
	ẃ: "w",
	ǵ: "g",
	ǹ: "n",
	ḿ: "m",
	ǘ: "u",
	ẍ: "x",
	ź: "z",
	ḧ: "h",
	"·": "-",
	"/": "-",
	_: "-",
	",": "-",
	":": "-",
	";": "-"
};
export const slugify = value => {
	return value
		.toString()
		.toLowerCase()
		.trim()
		.replace(/./g, (target, index, str) => specialChars[target] || target) // Replace special characters using the hash map
		.replace(/\s+/g, "-") // Replace spaces with -
		.replace(/[^\w\-]+/g, "") // Remove all non-word chars
		.replace(/\-\-+/g, "-") // Replace multiple - with single -
		.replace(/^-+/, "") // Trim - from start of text
		.replace(/-+$/, ""); // Trim - from end of text
};
