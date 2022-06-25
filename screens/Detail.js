import React, { useEffect, useState } from "react";
import {
  Share,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  Text,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import styled from "styled-components/native";
import { useQuery } from "react-query";
import colors from "../colors";
import { getDetail } from "../fetchers";
import { FontAwesome5 } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: ${colors.backgroundColor};
`;
const DetailBox = styled.View`
  margin-bottom: 30px;
`;
const DetailTitle = styled.Text`
  color: white;
  font-size: 25px;
  margin-bottom: 5px;
`;
const DetailContent = styled.Text`
  color: white;
  font-size: 15px;
`;
const LinkBox = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  margin: 15px 0;
`;
const LinksTitle = styled.Text`
  color: white;
  font-size: 25px;
`;
const LinkName = styled.Text`
  color: white;
  font-size: 15px;
`;

const Detail = ({ navigation: { setOptions }, route: { params } }) => {
  const [extendText, setExtendText] = useState(false);
  const coin = params.item;
  const { isLoading, data } = useQuery("detail", () => getDetail(coin.id));
  const makeHeader = () => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.backgroundColor,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          height: 50,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.backgroundColor,
        }}
      >
        <Image
          style={{
            width: 25,
            height: 25,
            borderRadius: 20,
          }}
          source={{
            uri: `https://coinicons-api.vercel.app//api/icon/${coin.symbol.toLowerCase()}`,
          }}
        />
        <Text
          style={{
            color: "white",
            fontSize: 25,
            fontWeight: "600",
            marginLeft: 10,
          }}
        >
          {coin.name}
        </Text>
      </View>
      <TouchableOpacity
        style={{ position: "absolute", right: 20 }}
        onPress={shareMedia}
      >
        <FontAwesome5 name="share" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
  const shareMedia = async () => {
    const isAndroid = Platform.OS === "android";
    const homepage = data.links.website[0];
    if (isAndroid) {
      await Share.share({
        message: homepage,
        title: data.name,
      });
    } else {
      await Share.share({
        url: homepage,
        title: data.name,
      });
    }
  };
  useEffect(() => {
    setOptions({
      header: makeHeader,
    });
  }, [data]);
  if (isLoading) {
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
  const goToLink = async (url) => {
    await WebBrowser.openBrowserAsync(url);
  };
  const switchExtend = () => setExtendText((prev) => !prev);
  const LongDescription = (description) => (
    <TouchableWithoutFeedback onPress={switchExtend}>
      <DetailContent>
        {extendText ? description : `${description.slice(0, 300)}...▼`}
      </DetailContent>
    </TouchableWithoutFeedback>
  );
  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <DetailBox>
          <DetailTitle>About {data.name}</DetailTitle>
          {data.description.length > 300 ? (
            LongDescription(data.description)
          ) : (
            <DetailContent>{data.description}</DetailContent>
          )}
        </DetailBox>
        <LinksTitle>Links</LinksTitle>
        {data?.links_extended?.map((link) => (
          <LinkBox onPress={() => goToLink(link.url)} key={link.url}>
            <LinkName>{link.type.replace("_", " ")}</LinkName>
            <FontAwesome5 name="external-link-alt" size={15} color="white" />
          </LinkBox>
        ))}
      </ScrollView>
    </Container>
  );
};

export default Detail;
