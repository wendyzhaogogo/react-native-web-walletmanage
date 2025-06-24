import * as bip39 from "bip39";
import * as SecureStore from "expo-secure-store";
import { sha256 } from "js-sha256";

export interface WalletInfo {
  mnemonic: string;
  privateKey: string;
  publicKey: string;
  address: string;
}

export class WalletManager {
  private static readonly MNEMONIC_KEY = "wallet_mnemonic";
  private static readonly PRIVATE_KEY_KEY = "wallet_private_key";
  private static readonly PUBLIC_KEY_KEY = "wallet_public_key";
  private static readonly ADDRESS_KEY = "wallet_address";

  /**
   * 从助记词生成钱包
   */
  static async generateWalletFromMnemonic(mnemonic: string): Promise<WalletInfo> {
    // 验证助记词
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error("Invalid mnemonic");
    }

    try {
      // 从助记词生成种子
      const seed = await bip39.mnemonicToSeed(mnemonic);
      
      // 将种子转换为十六进制字符串
      const seedHex = Array.from(seed)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      // 生成私钥（这里使用简化的方法，实际应用中应该使用HD钱包）
      const privateKey = sha256(seedHex);
      
      // 生成公钥（这里使用简化的方法）
      const publicKey = sha256(privateKey);
      
      // 生成地址（这里使用简化的方法）
      const address = sha256(publicKey).substring(0, 40);

      return {
        mnemonic,
        privateKey,
        publicKey,
        address: `0x${address}`,
      };
    } catch (error) {
      throw new Error("Failed to generate wallet from mnemonic");
    }
  }

  /**
   * 保存钱包信息到安全存储
   */
  static async saveWallet(wallet: WalletInfo): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.MNEMONIC_KEY, wallet.mnemonic);
      await SecureStore.setItemAsync(this.PRIVATE_KEY_KEY, wallet.privateKey);
      await SecureStore.setItemAsync(this.PUBLIC_KEY_KEY, wallet.publicKey);
      await SecureStore.setItemAsync(this.ADDRESS_KEY, wallet.address);
    } catch (error) {
      throw new Error("Failed to save wallet");
    }
  }

  /**
   * 从安全存储加载钱包信息
   */
  static async loadWallet(): Promise<WalletInfo | null> {
    try {
      const mnemonic = await SecureStore.getItemAsync(this.MNEMONIC_KEY);
      const privateKey = await SecureStore.getItemAsync(this.PRIVATE_KEY_KEY);
      const publicKey = await SecureStore.getItemAsync(this.PUBLIC_KEY_KEY);
      const address = await SecureStore.getItemAsync(this.ADDRESS_KEY);

      if (!mnemonic || !privateKey || !publicKey || !address) {
        return null;
      }

      return {
        mnemonic,
        privateKey,
        publicKey,
        address,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * 检查是否已有钱包
   */
  static async hasWallet(): Promise<boolean> {
    const wallet = await this.loadWallet();
    return wallet !== null;
  }

  /**
   * 清除钱包数据
   */
  static async clearWallet(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.MNEMONIC_KEY);
      await SecureStore.deleteItemAsync(this.PRIVATE_KEY_KEY);
      await SecureStore.deleteItemAsync(this.PUBLIC_KEY_KEY);
      await SecureStore.deleteItemAsync(this.ADDRESS_KEY);
    } catch (error) {
      throw new Error("Failed to clear wallet");
    }
  }

  /**
   * 生成新的钱包
   */
  static async generateNewWallet(): Promise<WalletInfo> {
    const mnemonic = bip39.generateMnemonic(128); // 12 words
    return await this.generateWalletFromMnemonic(mnemonic);
  }
} 