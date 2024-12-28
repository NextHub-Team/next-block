import { Injectable } from '@nestjs/common';
import {
  Fireblocks,
  BasePath,
  TransferPeerPathType,
  TransactionStateEnum,
  TransactionResponse,
  FireblocksResponse,
  EstimatedTransactionFeeResponse,
  TransactionRequest,
  TransactionRequestFeeLevelEnum,
} from '@fireblocks/ts-sdk';
import { readFileSync } from 'fs';

@Injectable()
export class FireblocksService {
  private fireblocks: Fireblocks;

  constructor() {
    const FIREBLOCKS_API_KEY = process.env.FIREBLOCKS_API_KEY_ADMIN;
    const FIREBLOCKS_API_SECRET_PATH = './fireblocks_private_key.pem';

    this.fireblocks = new Fireblocks({
      apiKey: FIREBLOCKS_API_KEY,
      basePath: BasePath.US,
      secretKey: readFileSync(FIREBLOCKS_API_SECRET_PATH, 'utf8'),
    });
  }

  // Cerate New Vault Account
  // https://developers.fireblocks.com/reference/typescript-sdk
  async createVaultAccount(name: string) {
    try {
      const vaultAccount = await this.fireblocks.vaults.createVaultAccount({
        createVaultAccountRequest: {
          name,
          hiddenOnUI: false,
          autoFuel: false,
        },
      });
      return vaultAccount.data;
    } catch (error) {
      throw new Error(`Failed to create Vault Account: ${error.message}`);
    }
  }

  // Add Asset To Exist Vault Account
  // https://developers.fireblocks.com/reference/create-vault-wallet
  async createVaultAccountAsset(vaultAccountId: string, assetId: string) {
    try {
      const vaultWallet = await this.fireblocks.vaults.createVaultAccountAsset({
        vaultAccountId,
        assetId,
      });
      return vaultWallet;
    } catch (error) {
      console.error('Error Details:', error); // Log detailed error
      throw new Error(`Failed to add asset to Vault Account: ${error.message}`);
    }
  }

  // Add New Deposit Asset To Exist Vault Account:
  //https://developers.fireblocks.com/reference/create-vault-wallet
  async createDepositAddress(
    vaultAccountId: string,
    assetId: string,
    description: string,
  ) {
    try {
      const depositAddress =
        await this.fireblocks.vaults.createVaultAccountAssetAddress({
          assetId,
          vaultAccountId,
          createAddressRequest: {
            description,
          },
        });
      return depositAddress;
    } catch (error) {
      throw new Error(`Failed to create deposit address: ${error.message}`);
    }
  }

  // Get Vault Accounts List With limitation :
  // https://developers.fireblocks.com/reference/typescript-sdk
  async getVaultPagedAccounts(limit: number) {
    try {
      const vaults = await this.fireblocks.vaults.getPagedVaultAccounts({
        limit,
      });
      return vaults.data;
    } catch (error) {
      throw new Error(`Failed to retrieve Vault Accounts: ${error.message}`);
    }
  }

  // Get Filter Vault Accounts Asset
  async getVaultAccountAsset(vaultAccountId: string, assetId: string) {
    try {
      const vaultAccount = await this.fireblocks.vaults.getVaultAccount({
        vaultAccountId,
      });

      if (!vaultAccount || !vaultAccount.data) {
        throw new Error(
          `The provided Vault Account ID is invalid: ${vaultAccountId}`,
        );
      }

      if (!Array.isArray(vaultAccount.data.assets)) {
        throw new Error('Vault account assets not found');
      }

      const asset = vaultAccount.data.assets.find((a) => a.id === assetId);

      if (!asset) {
        throw new Error(
          `Asset with ID ${assetId} not found in the Vault Account`,
        );
      }

      return {
        assetId: asset.id,
        balance: asset.total,
        availableBalance: asset.available,
        pending: asset.pending,
      };
    } catch (error) {
      console.error(
        'Error fetching specific asset from Vault Account:',
        error.response?.data || error.message,
      );

      if (error.response?.status === 400 || error.message.includes('invalid')) {
        throw new Error(
          `The provided Vault Account ID or Asset ID is invalid: ${vaultAccountId}, ${assetId}`,
        );
      }

      throw new Error(`Failed to retrieve asset details: ${error.message}`);
    }
  }

  // Get Vault Accounts Balance
  async getVaultAccountBalance(vaultAccountId: string) {
    try {
      const vaultAccount = await this.fireblocks.vaults.getVaultAccount({
        vaultAccountId,
      });

      if (!vaultAccount || !vaultAccount.data) {
        throw new Error(
          `The Provided Vault Account ID is invalid: ${vaultAccountId}`,
        );
      }

      if (!Array.isArray(vaultAccount.data.assets)) {
        throw new Error('Vault account assets not found');
      }

      return vaultAccount.data.assets.map((asset) => ({
        assetId: asset.id,
        balance: asset.total,
        availableBalance: asset.available,
      }));
    } catch (error) {
      console.error(
        'Error fetching Vault Account balance:',
        error.response?.data || error.message,
      );

      if (error.response?.status === 400 || error.message.includes('invalid')) {
        throw new Error(
          `The Provided Vault Account ID is invalid: ${vaultAccountId}`,
        );
      }

      throw new Error(
        `Failed to retrieve Vault Account balance: ${error.message}`,
      );
    }
  }

  // Create Transaction Between Vault Accounts :
  //https://developers.fireblocks.com/reference/typescript-sdk
  async createTransaction(
    assetId: string,
    amount: string,
    srcId: string,
    destId: string,
  ) {
    try {
      const transactionPayload = {
        assetId,
        amount,
        source: {
          type: TransferPeerPathType.VaultAccount,
          id: srcId,
        },
        destination: {
          type: TransferPeerPathType.VaultAccount,
          id: destId,
        },
        note: 'transaction',
      };
      const transaction = await this.fireblocks.transactions.createTransaction({
        transactionRequest: transactionPayload,
      });
      return transaction;
    } catch (error) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
  }

  // Create Transaction To External wallet
  //https://developers.fireblocks.com/reference/transaction-sources-destinations#one_time_address
  async createExternalTransaction(
    assetId: string,
    amount: string,
    srcId: string,
    destinationAddress: string,
    tag?: string,
    note: string = 'External transaction',
  ) {
    try {
      if (!destinationAddress) {
        throw new Error('Destination address is required');
      }

      const transactionPayload = {
        assetId,
        amount,
        source: {
          type: TransferPeerPathType.VaultAccount,
          id: srcId,
        },
        destination: {
          type: TransferPeerPathType.OneTimeAddress,
          oneTimeAddress: {
            address: destinationAddress,
            tag: tag || undefined,
          },
        },
        note,
      };

      const transaction = await this.fireblocks.transactions.createTransaction({
        transactionRequest: transactionPayload,
      });

      return transaction;
    } catch (error) {
      throw new Error(
        `Failed to create external transaction: ${error.message}`,
      );
    }
  }

  //Get List Of All Transaction
  //https://developers.fireblocks.com/reference/monitoring-transaction-status
  async getAllTransactions(limit: number, status?: string) {
    try {
      const params: any = { limit };
      if (status) params.status = status;
      const response =
        await this.fireblocks.transactions.getTransactions(params);
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
  }

  // Get transaction details by transactionId
  //https://developers.fireblocks.com/reference/monitoring-transaction-status
  async getTransactionDetail(txId: string): Promise<TransactionResponse> {
    try {
      let response: FireblocksResponse<TransactionResponse> =
        await this.fireblocks.transactions.getTransaction({ txId });
      let tx: TransactionResponse = response.data;

      if (!tx) {
        throw new Error('Transaction does not exist');
      }

      console.log(`Transaction ${tx.id} is currently at status - ${tx.status}`);

      while (tx.status !== TransactionStateEnum.Completed) {
        await new Promise((resolve) => setTimeout(resolve, 3000));

        response = await this.fireblocks.transactions.getTransaction({ txId });
        console.log(response);
        tx = response.data;

        switch (tx.status) {
          case TransactionStateEnum.Blocked:
          case TransactionStateEnum.Cancelled:
          case TransactionStateEnum.Failed:
          case TransactionStateEnum.Rejected:
            throw new Error(
              `Signing request failed/blocked/cancelled: Transaction ${tx.id} status is ${tx.status}`,
            );
          default:
            console.log(
              `Transaction ${tx.id} is currently at status - ${tx.status}`,
            );
            break;
        }
      }

      return tx; // Return the full transaction details
    } catch (error: any) {
      console.error('Error fetching transaction status:', error.message);
      throw new Error(
        `Failed to retrieve transaction status: ${error.message}`,
      );
    }
  }
  //Get List of Supported Assets
  //https://developers.fireblocks.com/reference/list-supported-assets
  async getSupportedAssets(): Promise<any> {
    try {
      const supportedAssets =
        await this.fireblocks.blockchainsAssets.getSupportedAssets();
      return supportedAssets;
    } catch (error) {
      throw new Error(`Failed to fetch supported assets: ${error.message}`);
    }
  }

  //Get one Supported Assets
  async checkAssetStatus(assetId: string): Promise<any> {
    const assets = await this.getSupportedAssets();

    if (Array.isArray(assets)) {
      return assets.find((asset) => asset.id === assetId) || null;
    }

    const assetList = assets.data || assets.items;
    if (Array.isArray(assetList)) {
      return assetList.find((asset) => asset.id === assetId) || null;
    }

    console.error('Unexpected response format:', assets);
    throw new Error('Unsupported response format from Fireblocks API');
  }

  // Fetch estimated transaction fee
  //https://developers.fireblocks.com/reference/estimate-transaction-fee
  async getTransactionFee(
    payload: TransactionRequest,
  ): Promise<EstimatedTransactionFeeResponse | undefined> {
    try {
      const response =
        await this.fireblocks.transactions.estimateTransactionFee({
          transactionRequest: payload,
        });
      return response.data;
    } catch (error: any) {
      console.error('Error estimating transaction fee:', error);
      throw new Error('Failed to estimate transaction fee');
    }
  }

  // Determine fee level logic
  private determineFeeLevel(
    feeEstimation: EstimatedTransactionFeeResponse,
  ): TransactionRequestFeeLevelEnum | undefined {
    const { low, high } = feeEstimation;
    // Ensure fee values are parsed as numbers for comparison
    const lowFee = parseFloat(low?.networkFee || '0');
    const highFee = parseFloat(high?.networkFee || '0');
    if (highFee > 0.01) {
      return TransactionRequestFeeLevelEnum.High;
    } else if (lowFee < 0.001) {
      return TransactionRequestFeeLevelEnum.Low;
    }

    return TransactionRequestFeeLevelEnum.Medium;
  }

  // Create transaction with fee estimation
  async createTransactionWithFeeEstimation(payload: TransactionRequest) {
    try {
      // Step 1: Estimate transaction fee
      const feeEstimation = await this.getTransactionFee(payload);
      if (!feeEstimation) {
        throw new Error('Unable to fetch transaction fee estimation');
      }

      // Step 2: Determine fee level
      const feeLevel = this.determineFeeLevel(feeEstimation);
      if (!feeLevel) {
        throw new Error('Failed to determine fee level');
      }
      payload.feeLevel = feeLevel;

      // Step 3: Create transaction
      const transaction = await this.fireblocks.transactions.createTransaction({
        transactionRequest: payload,
      });

      // Step 4: Return transaction details and fee level
      return {
        transaction: transaction.data,
        feeLevel,
      };
    } catch (error: any) {
      console.error('Error creating transaction with fee estimation:', error);
      throw new Error('Failed to create transaction with fee estimation');
    }
  }

  // Cancel a transaction by ID
  async cancelTransaction(txId: string): Promise<boolean> {
    try {
      const response = await this.fireblocks.transactions.cancelTransaction({
        txId,
      });
      if (!response?.data?.success) {
        throw new Error('Fireblocks API returned an unsuccessful response.');
      }
      return true;
    } catch (error) {
      console.error(
        `Error canceling transaction with ID ${txId}:`,
        error.response?.data || error.message,
      );
      throw new Error(`Failed to cancel transaction with ID: ${txId}`);
    }
  }
}
