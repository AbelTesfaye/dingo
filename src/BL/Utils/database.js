import SQLite from 'react-native-sqlite-storage';
export class database {
	constructor() {
		this.database;
	}

	// Open the connection to the database
	static open() {
		this.databaseName = 'sqlite.db';

		SQLite.enablePromise(true);

		return SQLite.openDatabase({ name: this.databaseName, createFromLocation: '~sqlite.db' }).then(db => {
			console.log('[db] Database open!');
			this.database = db;
			return db;
		});
	}

	// Close the connection to the database
	static close() {
		if (this.database === undefined) {
			return Promise.reject('[db] Database was not open; unable to close.');
		}
		return this.database.close().then(status => {
			console.log('[db] Database closed.');
			this.database = undefined;
		});
	}

	static insertRecentTrack(timestamp, title, artist, image) {
		return this.getDatabase()
			.then(db =>
				db.executeSql('INSERT INTO recent (timestamp,trackName, artistName, image) VALUES (?,?,?,?)', [
					timestamp,
					title,
					artist,
					image,
				])
			)
			.then(([results]) => {
				console.log(`[db] Added track with title: "${title}"`);
			});
	}

	static getRecentTracks() {
		console.log('[db] Fetching tracks from the db...');
		return this.getDatabase()
			.then(db =>
				// Get all the tracks, ordered by newest first
				db.executeSql('SELECT * FROM recent ORDER BY timestamp DESC limit 100')
			)
			.then(([results]) => {
				if (results === undefined) {
					return [];
				}
				recentTracks = [];

				var len = results.rows.length;
				for (let i = 0; i < len; i++) {
					let row = results.rows.item(i);

					recentTracks.push({
						id: row.timestamp,
						name: row.trackName,
						artistName: row.artistName,
						images: [row.image || ''],
					});
				}

				return recentTracks;
			});
	}

	static getSettings() {
		console.log('[db] Fetching settings from the db...');
		return this.getDatabase()
			.then(db =>
				// Get all the tracks, ordered by newest first
				db.executeSql('SELECT * FROM settings')
			)
			.then(([results]) => {
				if (results === undefined) {
					return [];
				}

				let row = results.rows.item(0);

				return JSON.parse(row.settings);
			});
	}
	static updateSettings(settingsObj) {
		const settings = JSON.stringify(settingsObj);
		return this.getDatabase()
			.then(db => db.executeSql('UPDATE settings SET settings = ?', [settings]))
			.then(([results]) => {
				console.log(`[db] updated settings: "${settings}"`);
			});
	}
	static insertSearchHistory(timestamp, query) {
		return this.getDatabase()
			.then(db =>
				db.executeSql('INSERT INTO search_history (timestamp,search_text) VALUES (?,?)', [timestamp, query])
			)
			.then(([results]) => {
				console.log(`[db] inserted into search_history: "${query}"`);
			});
	}

	static getSearchHistory() {
		console.log('[db] Fetching search history from the db...');
		return this.getDatabase()
			.then(db => db.executeSql('SELECT * FROM search_history ORDER BY timestamp DESC limit 5'))
			.then(([results]) => {
				if (results === undefined) {
					return [];
				}
				searchHistory = [];

				console.log('Read from search_history successfully');

				var len = results.rows.length;
				for (let i = 0; i < len; i++) {
					let row = results.rows.item(i);

					searchHistory.push({
						timestamp: row.timestamp,
						search_text: row.search_text,
					});
				}
console.log(JSON.stringify(searchHistory))
				return searchHistory;
			});
	}

	static getDatabase() {
		if (this.database !== undefined) {
			return Promise.resolve(this.database);
		}
		return this.open();
	}
}
