import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Text, Button, Card, TextInput } from "react-native-paper";

interface BackupWalletScreenProps {
  navigation: any;
  route: any;
}

export const BackupWalletScreen: React.FC<BackupWalletScreenProps> = ({
  navigation,
  route,
}) => {
  const { mnemonic } = route.params;
  const [verificationWords, setVerificationWords] = useState<number[]>([]);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // 随机选择3个位置进行验证（第3、7、11个词）
    setVerificationWords([2, 6, 10]); // 数组索引从0开始
    setUserInputs(new Array(3).fill(""));
  }, []);

  const handleInputChange = (text: string, index: number) => {
    const newInputs = [...userInputs];
    newInputs[index] = text;
    setUserInputs(newInputs);
  };

  const verifyBackup = () => {
    const isCorrect = verificationWords.every((wordIndex, index) => {
      return userInputs[index].toLowerCase().trim() === mnemonic[wordIndex].toLowerCase();
    });

    if (isCorrect) {
      Alert.alert(
        "备份成功",
        "您的助记词备份验证成功！",
        [
          {
            text: "确定",
            onPress: () => navigation.navigate("Main"),
          },
        ]
      );
    } else {
      Alert.alert("验证失败", "请检查您输入的助记词是否正确");
    }
  };

  const getWordPosition = (index: number) => {
    return verificationWords[index] + 1; // 显示给用户的位置从1开始
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>备份验证</Text>
        
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.instruction}>
              请输入以下位置的助记词以完成备份验证：
            </Text>
            
            {verificationWords.map((wordIndex, index) => (
              <View key={index} style={styles.inputContainer}>
                <Text style={styles.wordLabel}>
                  第 {getWordPosition(index)} 个助记词：
                </Text>
                <TextInput
                  mode="outlined"
                  value={userInputs[index]}
                  onChangeText={(text) => handleInputChange(text, index)}
                  style={styles.input}
                  placeholder="请输入助记词"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            ))}
            
            <Button
              mode="contained"
              onPress={verifyBackup}
              style={styles.button}
              disabled={userInputs.some(input => !input.trim())}
            >
              验证备份
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
    marginBottom: 20,
    color: "#666",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  wordLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  },
}); 