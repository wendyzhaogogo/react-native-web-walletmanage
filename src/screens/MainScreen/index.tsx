import React, { useState, useCallback } from "react";
import {
  View,
  Clipboard,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { WalletManager, WalletInfo } from "../../utils/wallet";
import { useFocusEffect } from '@react-navigation/native';

interface MainScreenProps {
  navigation: any;
}

export const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const [hasWallet, setHasWallet] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);

  useFocusEffect(
    useCallback(() => {
      checkWalletStatus();
    }, [])
  );

  const checkWalletStatus = async () => {
    const walletExists = await WalletManager.hasWallet();
    setHasWallet(walletExists);
    
    if (walletExists) {
      const wallet = await WalletManager.loadWallet();
      setWalletInfo(wallet);
    } else {
      setWalletInfo(null);
    }
  };

  const copyAddress = async () => {
    if (walletInfo) {
      try {
        await Clipboard.setString(walletInfo.address);
        Alert.alert("成功", "钱包地址已复制到剪贴板");
      } catch (error) {
        Alert.alert("错误", "复制失败");
      }
    }
  };

  const clearWallet = async () => {
    Alert.alert(
      "确认删除",
      "确定要删除当前钱包吗？此操作不可恢复！",
      [
        {
          text: "取消",
          style: "cancel",
        },
        {
          text: "删除",
          style: "destructive",
          onPress: async () => {
            try {
              await WalletManager.clearWallet();
              setHasWallet(false);
              setWalletInfo(null);
              Alert.alert("成功", "钱包已删除");
            } catch (error) {
              Alert.alert("错误", "删除钱包失败");
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>钱包管理</Text>
        
        {!hasWallet ? (
          <>
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.cardTitle}>欢迎使用钱包管理应用</Text>
                <Text style={styles.description}>
                  在这里您可以创建和管理您的加密货币钱包
                </Text>
              </Card.Content>
            </Card>
            
            <Button
              mode="contained"
              onPress={() => navigation.navigate("CreateWallet")}
              style={styles.button}
            >
              创建新钱包
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => navigation.navigate("ImportWallet")}
              style={styles.button}
            >
              导入现有钱包
            </Button>
          </>
        ) : (
          <>
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.cardTitle}>当前钱包</Text>
                {walletInfo && (
                  <>
                    <Text style={styles.addressLabel}>钱包地址：</Text>
                    <Text style={styles.address}>{walletInfo.address}</Text>
                    <Button
                      mode="outlined"
                      onPress={copyAddress}
                      style={styles.copyButton}
                    >
                      复制地址
                    </Button>
                  </>
                )}
              </Card.Content>
            </Card>
            
            <Button
              mode="contained"
              onPress={() => navigation.navigate("CreateWallet")}
              style={styles.button}
            >
              创建新钱包
            </Button>
            
            <Button
              mode="outlined"
              onPress={() => navigation.navigate("ImportWallet")}
              style={styles.button}
            >
              导入其他钱包
            </Button>
            
            <Button
              mode="outlined"
              onPress={clearWallet}
              style={[styles.button, styles.deleteButton]}
              textColor="#d32f2f"
            >
              删除当前钱包
            </Button>
          </>
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
  card: {
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  button: {
    marginTop: 15,
    paddingVertical: 8,
  },
  deleteButton: {
    borderColor: "#d32f2f",
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
    marginBottom: 10,
  },
  copyButton: {
    marginTop: 5,
  },
});
