import Database from 'better-sqlite3';
import { app } from 'electron'
import path from 'node:path'
import fs from 'fs';

export const getDBPath = (filename): string => {
  let base = app.getAppPath()
  if (app.isPackaged) {
    return path.join(app.getPath("userData"), "hand_histories.db")
  }
  return path.join(base, `database/${filename}.db`)
}

export const initializeDatabase = () => {
  if(app.isPackaged) {
    fs.readdir(app.getPath('userData'), (err, paths) => {
      if(!paths.includes('hand_histories.db')) {
        fs.copyFile(path.join(process.resourcesPath, 'database/hand_histories.db'), path.join(app.getPath('userData'), 'hand_histories.db'), (err) => {
          if(err) {
            console.log(err);
          }else {
            console.log('Successfully copied database file.')
          }
        })
      }
    });
  }

  return new Database(getDBPath('hand_histories'));
};

export const db = initializeDatabase();