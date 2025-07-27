import type { IStorage } from '$libs';
import type { SaveData } from '../entities';
import { SaveManager, SessionManager } from '../managers';

export function initManagers({ storage }: { storage?: IStorage<SaveData> } = {}) {
  const saveManager = new SaveManager(storage);
  const sessionManager = new SessionManager();

  return {
    SaveManager: saveManager,
    SessionManager: sessionManager,
  };
}

export type Managers = ReturnType<typeof initManagers>;

export function getManagers(): Managers {
  const managers = g.game.vars.managers;
  if (!managers) {
    throw new Error('Managers have not been initialized. Please call initManagers() first.');
  }

  return managers;
}
