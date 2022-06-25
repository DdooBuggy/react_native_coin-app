import React, { useState, useCallback, useEffect } from "react";
import { FlatList, Dimensions, RefreshControl } from "react-native";
import styled from "styled-components/native";
import colors from "../colors";
import Loader from "../components/Loader";
import { makeImgPath } from "../utils";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CoinBoxLength = SCREEN_WIDTH * 0.3;
const CoinsGapLength = (SCREEN_WIDTH * 0.1) / 4;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.backgroundColor};
  padding-top: ${CoinsGapLength};
`;
const Coin = styled.View`
  width: ${CoinBoxLength};
  height: ${CoinBoxLength};
  background-color: ${colors.backgroundColorGrey};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;
const CoinSymbol = styled.Image`
  width: 40px;
  height: 40px;
  margin-bottom: 7px;
`;
const CoinTitle = styled.Text`
  color: ${colors.textColor};
  font-weight: 600;
`;

export default function Coins() {
  const [coins, setCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const getCoins = useCallback(
    () =>
      fetch("https://api.coinpaprika.com/v1/coins")
        .then((response) => response.json())
        .then((json) => setCoins(json)),
    []
  );
  const onRefresh = async () => {
    setRefreshing(true);
    await getCoins();
    setRefreshing(false);
  };
  useEffect(() => {
    getCoins();
    setIsLoading(false);
  }, [getCoins]);
  // Use this variable to access the data
  const cleanedCoins = coins
    .filter((coin) => coin.rank !== 0)
    .filter((coin) => coin.is_active === true)
    .slice(0, 100);
  return isLoading ? (
    <Loader />
  ) : (
    <Container>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="white"
          />
        }
        data={cleanedCoins}
        keyExtractor={(item) => item.id + ""}
        columnWrapperStyle={{
          justifyContent: "space-evenly",
          marginBottom: CoinsGapLength,
        }}
        numColumns={3}
        renderItem={({ item }) => (
          <Coin>
            <CoinSymbol
              source={{ uri: makeImgPath(item.symbol.toLowerCase()) }}
            />
            <CoinTitle>{item.name}</CoinTitle>
          </Coin>
        )}
      />
    </Container>
  );
}
