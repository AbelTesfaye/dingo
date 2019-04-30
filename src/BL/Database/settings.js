import { database } from './database';

const getObject = (obj, k_v) => {
	var result = null;
	if (obj instanceof Array) {
		for (var i = 0; i < obj.length; i++) {
			result = getObject(obj[i], k_v);
			if (result) {
				break;
			}
		}
	} else {
		for (var prop in obj) {
			if (prop == 'setting_key' && k_v == obj['setting_key']) {
				return obj;
			}
			if (obj[prop] instanceof Object || obj[prop] instanceof Array) {
				result = getObject(obj[prop], k_v);
				if (result) {
					break;
				}
			}
		}
	}
	return result;
};

export class settings {
	static fetchAllSettings = () => {
		if (this.settingsObj === undefined)
			return this.fetchAllSettings().then(s => {
				this.settingsObj = s;
				return this.settingsObj;
			});
		return Promise.resolve(this.settingsObj);
	};

	static getAllSettings = () => database.getAllSettings();

	static updateAllSettings = s => database.updateAllSettings(s);

	static saveSetting = (key, value) => {
		getObject(this.settingsObj, key).currentValue = value;
		return this.updateAllSettings(this.settingsObj);
	};
	static getSetting = key => {
		return this.fetchAllSettings().then(s => {
			return getObject(this.settingsObj, key);
		});
	};
}
