import { View, Text } from "react-native";

export function CustomToast({ text1, text2 }) {
  return (
    <View
      style={{
        padding: 14,
        borderRadius: 14,
        marginHorizontal: 10,
        marginTop: 10,
        backgroundColor: "rgba(0, 255, 247, 0.15)", // neon glow base
        borderWidth: 1,
        borderColor: "#00fff7",
        shadowColor: "#00fff7",
        shadowOpacity: 0.9,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 10,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: "#00fff7",
          fontFamily: "Orbitron", // cyberpunk font
          textShadowColor: "#ff00ff",
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 8,
        }}
      >
        {text1}
      </Text>
      {text2 ? (
        <Text
          style={{
            fontSize: 13,
            color: "#f0f0f0",
            marginTop: 4,
            fontFamily: "Orbitron",
          }}
        >
          {text2}
        </Text>
      ) : null}
    </View>
  );
}
