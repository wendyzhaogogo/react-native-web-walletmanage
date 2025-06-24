import React, { useState, useEffect } from "react";
import {
  View,
  Clipboard,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Text, Button, Card, Chip } from "react-native-paper";
import { WalletManager, WalletInfo } from "../../utils/wallet";

interface CreateWalletScreenProps {
  navigation: any;
}

export const CreateWalletScreen: React.FC<CreateWalletScreenProps> = ({
  navigation,
}) => {
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);

  const generateWallet = async () => {
    try {
      const wallet = await WalletManager.generateNewWallet();
      const mnemonicArray = wallet.mnemonic.split(" ");

      setMnemonic(mnemonicArray);
      setWalletInfo(wallet);
      setIsGenerated(true);

      // 保存钱包信息到安全存储
      await WalletManager.saveWallet(wallet);
    } catch (error: any) {
      console.log("error", error);
      Alert.alert("错误", "生成助记词失败" + error?.message);
    }
  };

  const copyMnemonic = async () => {
    try {
      await Clipboard.setString(mnemonic.join(" "));
      Alert.alert("成功", "助记词已复制到剪贴板");
    } catch (error) {
      Alert.alert("错误", "复制失败");
    }
  };

  const goToBackup = () => {
    if (mnemonic.length > 0) {
      navigation.navigate("BackupWallet", { mnemonic });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>创建钱包</Text>

        {!isGenerated ? (
          <Button
            mode="contained"
            onPress={generateWallet}
            style={styles.button}
          >
            创建钱包
          </Button>
        ) : (
          <View style={styles.content}>
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.cardTitle}>助记词</Text>
                <Text style={styles.warning}>
                  请妥善保管您的助记词，这是恢复钱包的唯一方式
                </Text>
                <View style={styles.mnemonicContainer}>
                  {mnemonic.map((word, index) => (
                    <Chip
                      key={index}
                      style={styles.chip}
                      textStyle={styles.chipText}
                    >
                      {`${index + 1}. ${word}`}
                    </Chip>
                  ))}
                </View>
                <Button
                  mode="outlined"
                  onPress={copyMnemonic}
                  style={styles.copyButton}
                >
                  复制助记词
                </Button>
              </Card.Content>
            </Card>

            {walletInfo && (
              <Card style={styles.card}>
                <Card.Content>
                  <Text style={styles.cardTitle}>钱包信息</Text>
                  <Text style={styles.addressLabel}>钱包地址：</Text>
                  <Text style={styles.address}>{walletInfo.address}</Text>
                </Card.Content>
              </Card>
            )}

            <Button mode="contained" onPress={goToBackup} style={styles.button}>
              备份助记词
            </Button>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
  },
  card: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  warning: {
    color: "#d32f2f",
    marginBottom: 15,
    fontSize: 14,
  },
  mnemonicContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  chip: {
    margin: 2,
    backgroundColor: "#e3f2fd",
  },
  chipText: {
    fontSize: 12,
  },
  copyButton: {
    marginTop: 10,
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#666",
  },
  address: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#333",
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
  },
});
