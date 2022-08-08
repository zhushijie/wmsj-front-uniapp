
let app = getApp();
export function setThemeColor(){
	switch (app.globalData.theme) {
		case 'theme1':
			return '#e93323';
			break;
		case 'theme2':
			return '#FE5C2D';
			break;
		case 'theme3':
			return '#42CA4D';
			break;
		case 'theme4':
			return '#1DB0FC';
			break;
		case 'theme5':
			return '#FF448F';
			break;
	}
}
