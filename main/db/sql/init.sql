CREATE TABLE IF NOT EXISTS table_position (
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  table_position_value TEXT,
  UNIQUE(table_position_value)
);

INSERT OR IGNORE INTO table_position (table_position_value) VALUES ('Dealer'), ('SmallBlind'), ('BigBlind'), ('UTG'), ('UTG1'), ('UTG2');

CREATE TABLE IF NOT EXISTS action_type (
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  action_type_value TEXT,
  UNIQUE(action_type_value)
);

INSERT OR IGNORE INTO action_type (action_type_value) VALUES ('Fold'), ('Raise'), ('Call'), ('None');

CREATE TABLE IF NOT EXISTS street (
  id INTEGER PRIMARY KEY AUTOINCREMENT, 
  street_value TEXT,
  UNIQUE(street_value)
);

INSERT OR IGNORE INTO street (street_value) VALUES ('PreFlop'), ('Flop'), ('Turn'), ('River');

CREATE TABLE IF NOT EXISTS hand_histories (
  id INTEGER PRIMARY KEY NOT NULL AUTOINCREMENT,
  date TEXT NOT NULL,
  hand_number TEXT NOT NULL UNIQUE,
  starting_stack INT(11) NOT NULL,
  position INT(11) NOT NULL,
  raise_first_in INT(11) NOT NULL,
  voluntarily_put_into_pot INT(11) NOT NULL,
  net_gain INT(11) NOT NULL,
  player_count INT(11) NOT NULL,
  flop TEXT,
  turn TEXT,
  river TEXT,
  CHECK (raise_first_in IN (0, 1)),
  CHECK (voluntarily_put_into_pot IN (0, 1)),
  FOREIGN KEY(position) REFERENCES table_position(id)
);

CREATE TABLE IF NOT EXISTS hole_cards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hand_history_id INTEGER NOT NULL,
  position INTEGER NOT NULL,
  card_value TEXT NOT NULL,
  is_me INTEGER NOT NULL,
  FOREIGN KEY(hand_history_id) REFERENCES hand_histories(id),
  FOREIGN KEY(position) REFERENCES table_position(id),
  CHECK (is_me IN (0, 1))
);

CREATE TABLE IF NOT EXISTS actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hand_history_id INTEGER NOT NULL,
  street INTEGER NOT NULL,
  action INTEGER NOT NULL,
  value INTEGER,
  pot_size INTEGER NOT NULL,
  is_me INTEGER NOT NULL,
  FOREIGN KEY(hand_history_id) REFERENCES hand_histories(id),
  FOREIGN KEY(street) REFERENCES street(id),
  FOREIGN KEY(action) REFERENCES action_type(id),
  CHECK (is_me IN (0, 1))
);