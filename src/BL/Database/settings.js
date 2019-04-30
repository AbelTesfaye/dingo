import { database } from './database';

export class settings {
	static getSettingByKeyValue = (s, key_value) => {
		var result = null;
		if (s instanceof Array) {
			for (var i = 0; i < s.length; i++) {
				result = this.getSettingByKeyValue(s[i], key_value);
				if (result) {
					break;
				}
			}
		} else {
			for (var prop in s) {
				if (prop == 'setting_key' && key_value == s['setting_key']) {
					return s;
				}
				if (s[prop] instanceof Object || s[prop] instanceof Array) {
					result = this.getSettingByKeyValue(s[prop], key_value);
					if (result) {
						break;
					}
				}
			}
		}
		return result;
	};

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
		this.getSettingByKeyValue(this.settingsObj, key).currentValue = value;
		return this.updateAllSettings(this.settingsObj);
	};
	static getSetting = key => {
		return this.fetchAllSettings().then(s => {
			return this.getSettingByKeyValue(this.settingsObj, key);
		});
	};
}
