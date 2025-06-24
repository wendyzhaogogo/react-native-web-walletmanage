import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Text, Button, Card, TextInput } from "react-native-paper";
import { WalletManager } from "../../utils/wallet";

interface ImportWalletScreenProps {
  navigation: any;
}

export const ImportWalletScreen: React.FC<ImportWalletScreenProps> = ({
  navigation,
}) => {
  const [mnemonic, setMnemonic] = useState("");

  const importWallet = async () => {
    const trimmedMnemonic = mnemonic.trim();
    
    if (!trimmedMnemonic) {
      Alert.alert("错误", "请输入助记词");
      return;
    }

    try {
      // 从助记词生成钱包
      const wallet = await WalletManager.generateWalletFromMnemonic(trimmedMnemonic);
      
      // 保存钱包信息到安全存储
      await WalletManager.saveWallet(wallet);
      
      Alert.alert(
        "导入成功",
        `钱包导入成功！\n地址：${wallet.address}`,
        [
          {
            text: "确定",
            onPress: () => navigation.navigate("Main"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("错误", "助记词格式不正确，请检查后重试");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>导入钱包</Text>
        
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.instruction}>
              请输入您的12个助记词，用空格分隔：
            </Text>
            
            <TextInput
              mode="outlined"
              value={mnemonic}
              onChangeText={setMnemonic}
              style={styles.input}
              placeholder="例如：abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
              multiline
              numberOfLines={3}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <Text style={styles.hint}>
              提示：助记词应该是12个英文单词，用空格分隔
            </Text>
            
            <Button
              mode="contained"
              onPress={importWallet}
              style={styles.button}
              disabled={!mnemonic.trim()}
            >
              导入钱包
            </Button>
          </Card.Content>
        </Card>
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
    marginBottom: 20,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 15,
    color: "#666",
  },
  input: {
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  hint: {
    fontSize: 12,
    color: "#999",
    marginBottom: 20,
    fontStyle: "italic",
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
}); 