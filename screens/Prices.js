import React, { useState, useCallback, useEffect } from "react";
import { Text, FlatList, RefreshControl } from "react-native";
import styled from "styled-components/native";
import colors from "../colors";
import Loader from "../components/Loader";
import { makeImgPath } from "../utils";
import { Ionicons } from "@expo/vector-icons";

const Container = styled.View`
  flex: 1;
  background-color: ${colors.backgroundColor};
`;
const Coin = styled.View`
  margin: 5px 13px;
  flex-direction: row;
  justify-content: space-between;
`;
const CoinLeftContent = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const CoinRightContent = styled.View`
  justify-content: center;
  align-items: flex-end;
`;
const CoinSymbol = styled.Image`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;
const CoinInfoText = styled.Text`
  color: ${colors.textColor};
  font-weight: 600;
`;
const CoinTitle = styled(CoinInfoText)``;
const CoinPrice = styled(CoinInfoText)``;
const CoinChange = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Separator = styled.View`
  margin: 10px 5px;
  border: 1px solid white;
  opacity: 0.1;
`;

export default function Prices() {
  const [tickers, setTickers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const getTickers = useCallback(
    () =>
      fetch("https://api.coinpaprika.com/v1/tickers")
        .then((response) => response.json())
        .then((json) => setTickers(json)),
    []
  );
  const onRefresh = async () => {
    setRefreshing(true);
    await getTickers();
    setRefreshing(false);
  };
  useEffect(() => {
    getTickers();
    setIsLoading(false);
  }, [getTickers]);
  // Use this variable to access the data
  const cleanedTickers = tickers.filter(
    (ticker) => ticker.circulating_supply !== 0
  );
  const renderItem = ({ item }) => {
    return (
      <Coin>
        <CoinLeftContent>
          <CoinSymbol
            source={{ uri: makeImgPath(item.symbol.toLowerCase()) }}
          />
          <CoinTitle>{item.name}</CoinTitle>
        </CoinLeftContent>
        <CoinRightContent>
          <CoinPrice>${item.quotes.USD.price.toFixed(2)}</CoinPrice>
          <CoinChange>
            {item.quotes.USD.percent_change_24h < 0 ? (
              <Ionicons name="caret-down" size={24} color="red" />
            ) : (
              <Ionicons name="caret-up" size={24} color="green" />
            )}
            <Text
              style={{
                color: item.quotes.USD.percent_change_24h < 0 ? "red" : "green",
              }}
            >
              {item.quotes.USD.percent_change_24h.toFixed(2)}%
            </Text>
          </CoinChange>
        </CoinRightContent>
      </Coin>
    );
  };

  return isLoading ? (
    <Loader />
  ) : (
    <Container>
      <FlatList
        disableVirtualization={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="white"
          />
        }
        data={cleanedTickers}
        keyExtractor={(item) => item.id + ""}
        ItemSeparatorComponent={Separator}
        renderItem={renderItem}
      />
    </Container>
  );
}
