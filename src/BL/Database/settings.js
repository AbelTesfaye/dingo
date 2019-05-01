import { database } from './database';

export class settings {
	static initialize() {
		if (this.settingsObj === undefined)
			return this.getAllSettings().then(s => {
				this.settingsObj = s;
				return this.settingsObj;
			});
		return Promise.resolve(this.settingsObj);
	}

	static getAllSettings() {
		return database.getAllSettings();
	}

	static updateAllSettings(s) {
		return database.updateAllSettings(s);
	}

	static set(key, value, returnPromise = false) {
		const s = this.getSettingByKeyValue(this.settingsObj, key);
		s.currentValue = value;
		return returnPromise ? this.updateAllSettings(this.settingsObj) : s;
	}
	static get(key, fromFile = false) {
		return fromFile
			? this.initialize().then(s => {
					return this.getSettingByKeyValue(s, key);
			  })
			: this.getSettingByKeyValue(this.settingsObj, key);
	}
	static getSettingByKeyValue(s, key_value) {
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
	}
}
