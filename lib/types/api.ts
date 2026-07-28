export type StorageNetwork = "private" | "public";

export type BlockchainErrorKind =
  | "CHAIN_MISMATCH"
  | "CONTRACT_REVERT"
  | "NOT_FOUND"
  | "RPC_UNAVAILABLE"
  | "TIMEOUT"
  | "UNKNOWN";

export type IntentOperation = "REGISTER" | "REVOKE" | "SUPERSEDE";

export type IntentStatus =
  | "PREPARED"
  | "SIGNED"
  | "SOURCE_PENDING"
  | "SOURCE_CONFIRMED"
  | "FAILED_RETRYABLE"
  | "FAILED_TERMINAL";

export type DocumentStatus = "ACTIVE" | "REVOKED" | "SUPERSEDED";

export type ConfirmationStatus =
  | "CONFIRMED"
  | "MISMATCH"
  | "UNAVAILABLE"
  | "UNINDEXED";

export type DispatchStatus =
  | "DESTINATION_CONFIRMED"
  | "DESTINATION_IGNORED"
  | "PENDING"
  | "RECOVERY_REQUIRED"
  | "SOURCE_ACCEPTED";

export type EffectiveStatus =
  | "DESTINATION_CONFIRMED"
  | "DESTINATION_IGNORED"
  | "EVIDENCE_MISMATCH"
  | "EVIDENCE_UNAVAILABLE"
  | "PENDING"
  | "RECOVERY_REQUIRED"
  | "SOURCE_ACCEPTED";

export type StorageAvailabilityStatus =
  | "AVAILABLE"
  | "NOT_FOUND"
  | "UNAVAILABLE";

// Auth
export interface RequestNonce {
  address: string;
}

export interface NonceChallenge {
  address: string;
  expiresAt: string;
  message: string;
  nonce: string;
}

export interface VerifyAuth {
  message: string;
  signature: string;
}

export interface LoginResponse {
  accessToken: string;
  address: string;
  expiresInSeconds: number;
}

// Intent Requests
export interface RegisterIntentFields {
  issuer: string;
  idempotencyKey: string;
  storageNetwork: StorageNetwork;
  documentType?: string;
}

export interface RevokeIntentRequest {
  issuer: string;
  idempotencyKey: string;
  documentId: string;
}

export interface SupersedeIntentFields {
  issuer: string;
  idempotencyKey: string;
  storageNetwork: StorageNetwork;
  oldDocumentId: string;
  documentType?: string;
}

export interface SubmitIntentSignature {
  signature: string;
}

export interface Failure {
  code: string;
  detail: string | null;
}

export interface Intent {
  id: string;
  idempotencyKey: string;
  operation: IntentOperation;
  status: IntentStatus;
  issuer: string;
  documentId: string | null;
  oldDocumentId: string | null;
  chainNonce: string;
  deadline: string;
  typedData: Record<string, unknown>;
  typedDataDigest: string;
  failure: Failure | null;
  createdAt: string;
  updatedAt: string;
}

// Verification & Canonical Document
export interface CanonicalDocument {
  cid: string;
  cidCodec: number;
  cidDigest: string;
  contentDigest: string;
  documentId: string;
  issuer: string;
  metadataCommitment: string;
  registeredAt: string;
  schemaVersion: number;
  sourceChainId: string;
  status: DocumentStatus;
  supersededBy: string | null;
  supersedes: string | null;
  updatedAt: string;
  version: string;
}

export interface DocumentIntegrity {
  active: boolean;
  contentMatches: boolean;
  issuerMatches: boolean;
  matches: boolean;
}

export interface SourceEvidence {
  chainId: number;
  chainSelector: string;
  confirmationDepth: number;
  contractAddress: string;
  confirmationStatus: ConfirmationStatus;
  confirmations?: string;
  canonical?: boolean;
  projectionMatches?: boolean;
  errorKind?: BlockchainErrorKind;
  transactionHash: string | null;
  blockNumber: string | null;
  blockHash: string | null;
}

export interface StorageAvailability {
  status: StorageAvailabilityStatus;
  available: boolean;
  checkedAt: string;
  authenticity: "NOT_INFERRED_FROM_AVAILABILITY";
}

export interface DispatchFee {
  amount: string | null;
  gasLimit: number;
  token: string | null;
}

export interface DispatchSourceEvidence {
  blockHash: string | null;
  blockNumber: string | null;
  transactionHash: string | null;
}

export interface DispatchDestinationEvidence {
  blockHash: string | null;
  blockNumber: string | null;
  confirmedAt: string | null;
  transactionHash: string | null;
}

export interface ReceiverNotSubmitted {
  readStatus: "NOT_SUBMITTED";
}

export interface ReceiverAvailable {
  readStatus: "AVAILABLE";
  active: boolean;
  integrityMatches: boolean;
  processed: boolean;
  provenanceMatches: boolean;
  receiptStatus: number;
  replicated: boolean;
  version: string;
}

export interface ReceiverUnavailable {
  readStatus: "UNAVAILABLE";
  errorKind: BlockchainErrorKind;
}

export type ReceiverState =
  | ReceiverNotSubmitted
  | ReceiverAvailable
  | ReceiverUnavailable;

export interface DestinationEvidence {
  chainId: number;
  chainSelector: string;
  contractAddress: string;
  status: DispatchStatus;
  effectiveStatus: EffectiveStatus;
  version: string;
  messageId: string | null;
  failure: Failure | null;
  fee: DispatchFee;
  sourceEvidence: DispatchSourceEvidence;
  destinationEvidence: DispatchDestinationEvidence;
  receiver: ReceiverState;
}

export interface DocumentVerification {
  canonicalSource: true;
  document: CanonicalDocument;
  integrity: DocumentIntegrity;
  source: SourceEvidence;
  storage: StorageAvailability;
  destinations: DestinationEvidence[];
}

export interface SearchByDocumentId {
  documentId: string;
  issuer?: string;
}

export interface CreateGroupRequest {
  groupName: string;
  network: StorageNetwork;
}

export interface PinataFileItem {
  id: string;
  name: string;
  cid: string;
  size: number;
  number_of_files?: number;
  mime_type: string;
  group_id: string | null;
  keyvalues?: Record<string, unknown>;
  created_at: string;
}

export interface PinataMetadata {
  data?: {
    files: PinataFileItem[];
    next_page_token?: string | null;
  };
  files?: PinataFileItem[];
  [key: string]: unknown;
}

export interface ErrorResponse {
  statusCode?: number;
  message: string | string[];
  error?: string;
  kind?: string;
}
