import React, { useRef, useState } from "react";
import {
  View,
  Animated,
  PanResponder,
  ActivityIndicator,
  Easing,
} from "react-native";
import { useQuery } from "react-query";
import styled from "styled-components/native";
import { useAssets } from "expo-asset";
import { getCoins } from "../fetchers";

const BLACK_COLOR = "#1e272e";
const GREY = "#485460";
const GREEN = "#2ecc71";
const RED = "#e74c3c";

const Container = styled.View`
  flex: 1;
  background-color: ${BLACK_COLOR};
`;
const Edge = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const WordContainer = styled(Animated.createAnimatedComponent(View))`
  width: 100px;
  height: 100px;
  justify-content: center;
  align-items: center;
  background-color: ${GREY};
  border-radius: 50px;
`;
const Word = styled.Text`
  font-size: 38px;
  font-weight: 500;
  color: ${(props) => props.color};
`;
const Center = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;
const IconCard = styled(Animated.createAnimatedComponent(View))`
  background-color: transparent;
  align-items: center;
`;
const CoinIcon = styled.Image`
  width: 170px;
  height: 170px;
  border-radius: 20px;
`;
const CoinTitle = styled.Text`
  font-size: 30px;
  font-weight: 400;
  color: white;
`;

export default function Discover() {
  const { data, refetch } = useQuery("coins", getCoins);
  const cleanedList = data
    ?.filter((coin) => coin.rank !== 0)
    .filter((coin) => coin.is_active === true)
    .slice(0, 100);
  const [assets] = useAssets(
    cleanedList?.map(
      (item) =>
        `https://coinicons-api.vercel.app/api/icon/${item.symbol.toLowerCase()}`
    )
  );
  // values
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scaleUpside = position.y.interpolate({
    inputRange: [-300, -80],
    outputRange: [2, 1],
    extrapolate: "clamp",
  });
  const scaleDownside = position.y.interpolate({
    inputRange: [80, 300],
    outputRange: [1, 2],
    extrapolate: "clamp",
  });
  // animations
  const onPressIn = Animated.spring(scale, {
    toValue: 0.9,
    useNativeDriver: true,
  });
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const goCenter = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });
  const onDropScale = Animated.timing(scale, {
    toValue: 0,
    duration: 100,
    easing: Easing.linear,
    useNativeDriver: true,
  });
  const onDropOpacity = Animated.timing(opacity, {
    toValue: 0,
    duration: 100,
    easing: Easing.linear,
    useNativeDriver: true,
  });
  // pan responders
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dx, dy }) => {
        position.setValue({ x: dx, y: dy });
      },
      onPanResponderGrant: () => {
        onPressIn.start();
      },
      onPanResponderRelease: (_, { dy }) => {
        if (dy < -250 || dy > 250) {
          Animated.sequence([
            Animated.parallel([onDropScale, onDropOpacity]),
            Animated.timing(position, {
              toValue: 0,
              duration: 100,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
          ]).start(nextIcon);
        } else {
          Animated.parallel([onPressOut, goCenter]).start();
        }
      },
    })
  ).current;
  // State
  const [cardIndex, setCardIndex] = useState(0);
  const nextIcon = () => {
    setCardIndex((prev) => prev + 1);
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.spring(opacity, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };

  if (!assets) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#1e272e",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }
  return (
    <Container>
      <Edge>
        <WordContainer style={{ transform: [{ scale: scaleUpside }] }}>
          <Word color={GREEN}>사다</Word>
        </WordContainer>
      </Edge>
      <Center>
        <IconCard
          {...panResponder.panHandlers}
          style={{
            opacity,
            transform: [...position.getTranslateTransform(), { scale }],
          }}
        >
          <CoinIcon
            key={cardIndex}
            source={{
              uri: assets[cardIndex].localUri,
            }}
          />
          <CoinTitle>{cleanedList[cardIndex].name}</CoinTitle>
        </IconCard>
      </Center>
      <Edge>
        <WordContainer style={{ transform: [{ scale: scaleDownside }] }}>
          <Word color={RED}>팔다</Word>
        </WordContainer>
      </Edge>
    </Container>
  );
}
