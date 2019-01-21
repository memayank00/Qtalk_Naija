export const exportPath = (pathname) => pathname.split('/')[1];
export const decorateNameField = (name) => {
	let _name = name.replace(/_|-/g, ' ');
	return _name.charAt(0).toUpperCase() + _name.slice(1);
}

export const decorateTitle = (pathname)	=> decorateNameField(exportPath(pathname) === '' ? 'home': exportPath(pathname));