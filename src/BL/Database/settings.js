import { database } from './database';

export class settings {
	static initialize() {
		if (this.settingsObj === undefined)
			return this.getAll(true).then(s => {
				this.settingsObj = s;
				return this.settingsObj;
			});
		return Promise.resolve(this.settingsObj);
	}

	static getAll(fromFile = false) {
		return fromFile ? database.getAllSettings() : this.settingsObj;
	}

	static updateAll(s, returnPromise = false) {
		this.settingsObj = s;
		return returnPromise ? database.updateAllSettings(s) : this.settingsObj;
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
			: this.getSettingByKeyValue(this.settingsObj, key).currentValue;
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
