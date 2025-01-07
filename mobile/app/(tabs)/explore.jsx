import React, { useContext, useEffect, useState } from "react";
import { Box, Button, Icon, IconButton } from "native-base";
import { View, Text, ScrollView, SafeAreaView, StyleSheet, RefreshControl, Image } from "react-native";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { Trash2, Plus, Minus } from "lucide-react-native";
import Toast from 'react-native-toast-message';
import { API_BASE_URL } from "../../constants/API";
let stompClient = null;

export default function Explore() {
  const { setselectedOrder, selectedOrder, selectedOrderCode, setselectedOrderCode } = useContext(AppContext);
  const [listOrderDetail, setlistOrderDetail] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!selectedOrderCode) return;
    onGetOrderByCode(selectedOrderCode);
  }, [selectedOrderCode]);

  useEffect(() => {
    initializeWebSocket();
    return () => stompClient && stompClient.disconnect(); // Cleanup WebSocket on unmount
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const onGetOrderByCode = async (code) => {
    if (code !== " ") {
    }
    try {
      setlistOrderDetail([]);
      const response = await axios.get(
        `${API_BASE_URL}/orders/by-code/${code}`
      );
      if (response.status === 200) {
        setselectedOrder(response.data);
        setlistOrderDetail(response.data.orderDetailResponseDTOS || []);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Không đủ số lượng sản phẩm trong kho!',
        position: 'bottom',
      });
    }
  };

  const initializeWebSocket = () => {
    const urlSocket = `${API_BASE_URL}/ws-notifications`;
    stompClient = Stomp.over(() => new SockJS(urlSocket));
    stompClient.reconnect_delay = 5000;

    stompClient.connect(
      {},
      () => {
        console.log("WebSocket connected!");
        stompClient.subscribe("/has-change/messages", (message) => {
          console.log("Received WebSocket message 1:", message.body);
          onGetOrderByCode(message.body);
        });
        stompClient.subscribe("/has-change-order-in-store-coder/messages", (message) => {
          console.log("Received WebSocket message 2:", message.body);
          setselectedOrderCode(message.body);
        });
      },
      (error) => {
        console.error("WebSocket connection error:", error);
      }
    );
  };

  const deleteOrderDetail = async (order_detail_id) => {
    try {
      await axios.delete(`${API_BASE_URL}/order-details/${order_detail_id}`);
      onGetOrderByCode(selectedOrderCode);
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      await axios.get(
        `${API_BASE_URL}/order-details/quantity/update/${itemId}?quantity=${newQuantity}`
      );
      onGetOrderByCode(selectedOrderCode);
    } catch (error) {
      console.error("Failed to update quantity", error);
    }
  };

  const calculateTotalPrice = () => {
    return listOrderDetail.reduce((total, item) => {
      const price = item.productDetailResponseDTO.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            Hóa đơn #{selectedOrderCode}
            {/* -{" "} */}
            {/* <Text style={{ color: "red" }}>
              {selectedOrder?.total?.toLocaleString('vi')} vnđ
            </Text> */}
          </Text>
        </View>

        <View style={styles.orderDetailsContainer}>
          {listOrderDetail.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: item.productDetailResponseDTO.images[0]?.url || 'https://via.placeholder.com/150',
                  }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.productDetails}>
                <Text style={styles.productCode} numberOfLines={2}>
                  {item.productDetailResponseDTO.product.name}
                </Text>
                <Text style={styles.text}>{item.productDetailResponseDTO.code}</Text>
                <Text style={styles.text}>
                  Màu sắc: {item.productDetailResponseDTO.color.name}
                </Text>
                <Text style={styles.text}>
                  Kích cỡ: {item.productDetailResponseDTO.size.name}
                </Text>
                <Text style={styles.text} color="red.500">
                  Giá: {item.productDetailResponseDTO.price}
                </Text>
                <View style={styles.quantityContainer}>
                  <View style={styles.quantityControls}>
                    <IconButton
                      icon={<Icon as={Minus} size="xs" />}
                      colorScheme="coolGray"
                      variant="outline"
                      rounded="full"
                      onPress={() =>
                        updateQuantity(item.id, Math.max(0, item.quantity - 1))
                      }
                      size="xs"
                      style={styles.iconButton}
                    />
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <IconButton
                      icon={<Icon as={Plus} size="xs" />}
                      colorScheme="coolGray"
                      variant="outline"
                      rounded="full"
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      size="xs"
                      style={styles.iconButton}
                    />
                  </View>
                  <IconButton
                    icon={<Icon as={Trash2} color="red.500" />}
                    variant="ghost"
                    colorScheme="red"
                    onPress={() => deleteOrderDetail(item.id)}
                    size="sm"
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Footer for Total Price */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Tổng số tiền:{" "}
          <Text style={{ color: "red", fontWeight: "bold" }}>
            {selectedOrder?.total?.toLocaleString('vi')} vnđ
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollViewContent: {
    paddingBottom: 80, // Add padding so the footer doesn't overlap content
  },
  header: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  orderDetailsContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  imageContainer: {
    marginRight: 15,
  },
  iconButton: {
    width: 20,
    height: 20,
    borderWidth: 1,
    padding: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  productCode: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 10,
    minWidth: 30,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});