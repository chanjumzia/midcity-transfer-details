/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransferStatus = 'Pending' | 'Completed' | 'Cancelled';
export type DocumentStatus = 'Not Submitted' | 'Pending' | 'Verified' | 'Exempted';

export interface SellerDocs {
  gainTax236C: DocumentStatus;
  exciseNOC: DocumentStatus;
  fbrForm7E: DocumentStatus;
  ndcFee: DocumentStatus;
}

export interface BuyerDocs {
  transferFee: DocumentStatus;
  stampDuty: DocumentStatus;
  fbrTax236K: DocumentStatus;
}

export interface BuyerRepresentative {
  isRepresentative: boolean;
  name: string;
  cnic: string;
  contact: string;
}

export interface FileCollectionInfo {
  receivedDate: string;
  receivedBy: 'Self' | 'Representative';
  receiverName?: string;
  receiverCnic?: string;
  receiverContact?: string;
}

export interface LandTransfer {
  id: string;
  buyerName: string;
  buyerMcNumber: string;
  sellerName: string;
  sellerMcNumber: string;
  mclrNumber: string;
  plotNumber: string;
  block: string;
  size: string;
  transferDate: string;
  status: TransferStatus;
  sellerDocs: SellerDocs;
  buyerDocs: BuyerDocs;
  representative?: BuyerRepresentative;
  collectionInfo?: FileCollectionInfo;
  amount?: number;
  notes?: string;
  createdAt: string;
}

export interface Statistics {
  totalTransfers: number;
  completedTransfers: number;
  pendingTransfers: number;
  totalVolume?: number;
}
