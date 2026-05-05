/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LandTransfer } from '../types';

const STORAGE_KEY = 'midcity_land_transfers';

export const storageService = {
  getTransfers: (): LandTransfer[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveTransfer: (transfer: LandTransfer): void => {
    const transfers = storageService.getTransfers();
    // Check if updating existing
    const index = transfers.findIndex(t => t.id === transfer.id);
    if (index > -1) {
      transfers[index] = transfer;
    } else {
      transfers.push(transfer);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transfers));
  },

  deleteTransfer: (id: string): void => {
    const transfers = storageService.getTransfers();
    const filtered = transfers.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
