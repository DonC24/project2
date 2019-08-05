CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    password TEXT
);

CREATE TABLE IF NOT EXISTS medication (
    id SERIAL PRIMARY KEY,
    name TEXT,
    dose INTEGER,
    dose_category TEXT,
    start_time TIMESTAMPZ,
    time_interval INTEGER,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS confirmation (
	id SERIAL PRIMARY KEY,
	medication_id INTEGER,
	time_taken TIMESTAMPZ,
	photo TEXT,
	FOREIGN KEY (medication_id) REFERENCES medication (id)
);