import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { FlatList, RefreshControl } from "react-native";
import styled from "styled-components/native";
import colors from "../colors";
import Loader from "../components/Loader";
import { Ionicons } from "@expo/vector-icons";
import { getNews } from "../apis";

const Container = styled.View`
  flex: 1;
  background-color: ${colors.backgroundColor};
`;
const Article = styled.View`
  margin: 7px 13px;
  justify-content: space-between;
  background-color: ${colors.backgroundColorGrey};
  border-radius: 5px;
  padding: 10px 13px;
`;
const Title = styled.Text`
  color: ${colors.textColor};
  font-weight: 600;
`;
const OthersBox = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 5px;
`;
const OthersBoxLeft = styled.View`
  flex-direction: row;
  align-items: center;
`;
const OthersBoxRight = styled(OthersBoxLeft)`
  justify-content: space-end;
`;
const Likes = styled.Text`
  color: ${colors.textColor};
  margin: 0 5px;
`;
const Comments = styled(Likes)``;
const Homepage = styled.TouchableOpacity`
  flex-direction: row;
`;
const Read = styled.Text`
  color: ${colors.readTextColor};
  margin-right: 5px;
`;

export default function News() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const { isLoading, data: news } = useQuery("news", getNews);
  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries("news");
    setRefreshing(false);
  };
  const openLink = async (url) => {
    await WebBrowser.openBrowserAsync(url);
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
        data={news.hits}
        keyExtractor={(item) => item.objectID + ""}
        renderItem={({ item }) => (
          <Article>
            <Title>{item.title}</Title>
            <OthersBox>
              <OthersBoxLeft>
                <Ionicons name="thumbs-up" size={15} color={colors.textColor} />
                <Likes>{item.points}</Likes>
                <Ionicons name="chatbox" size={15} color={colors.textColor} />
                <Comments>{item.num_comments}</Comments>
              </OthersBoxLeft>
              <OthersBoxRight>
                <Homepage onPress={() => openLink(item.url)}>
                  <Read>Read</Read>
                  <Ionicons
                    name="arrow-forward-circle-sharp"
                    size={15}
                    color={colors.readTextColor}
                  />
                </Homepage>
              </OthersBoxRight>
            </OthersBox>
          </Article>
        )}
      />
    </Container>
  );
}
