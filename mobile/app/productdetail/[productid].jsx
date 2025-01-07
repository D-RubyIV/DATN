import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome'; // Adjust the import based on your icon library
import { API_BASE_URL } from "../../constants/API"
import { AppContext } from "../../context/AppContext";

const { width } = Dimensions.get('window');


const defaultImage = 'https://via.placeholder.com/150'; // Define a default image URL

export default function ProductDetailScreen() {
    const { selectedOrder } = useContext(AppContext);
    const { productid } = useLocalSearchParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [listProductDetail, setListProductDetail] = useState([]);
    const [listColor, setListColor] = useState([]);
    const [listSize, setListSize] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedProductDetail, setSelectedProductDetail] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [priceRange, setPriceRange] = useState(null);
    const [salePercent, setSalePercent] = useState(0);

    console.log('Product ID:', productid);

    // useEffect(() => {
    //     const fetchProductDetails = async () => {
    //         try {
    //             if (!productid) {
    //                 console.error('No product ID provided');
    //                 setLoading(false);
    //                 return;
    //             }

    //             const response = await axios.get(
    //                 `http://192.168.1.150:8080/api/v1/productDetails/${productid}`
    //             );

    //             setProduct(response.data);
    //             setLoading(false);
    //         } catch (error) {
    //             console.error('Error fetching product details:', error);
    //             setLoading(false);
    //         }
    //     };

    //     fetchProductDetails();
    // }, [productid]);

    // if (loading) {
    //     return (
    //         <View style={styles.center}>
    //             <ActivityIndicator size="large" color="#0000ff" />
    //         </View>
    //     );
    // }

    // const onHandleAddToCart = async (product_detail_id) => {
    //     const data = {
    //         "orderId": selectedOrder.id,
    //         "quantity": quantity,
    //         "productDetailId": product_detail_id,
    //         // "averageDiscountEventPercent": 8
    //     }
    //     await axios.post(`${API_BASE_URL}/order-details`, data).then(function (response) {
    //         console.log(response)
    //     })
    // }

    useEffect(() => {
        const fetchInitialData = async () => {
            if (!productid) {
                console.error('No product ID provided');
                setLoading(false);
                return;
            }

            try {
                const productDetailResponse = await axios.get(`${API_BASE_URL}/productDetails/product-detail-of-product/${productid}`);
                setListProductDetail(productDetailResponse.data);
                setPriceRange(calculatePriceRange(productDetailResponse.data));

                const productResponse = await axios.get(`${API_BASE_URL}/product/${productid}`);
                setProduct(productResponse.data);
                if (productResponse.data.eventDTOList && productResponse.data.eventDTOList.length > 0) {
                    setSalePercent(productResponse.data.eventDTOList[0].discountPercent);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [productid]);

    useEffect(() => {
        if (listProductDetail.length > 0) {
            const uniqueColors = listProductDetail.reduce((acc, item) => {
                if (!acc.some((color) => color.code === item.color.code)) {
                    acc.push(item.color);
                }
                return acc;
            }, []);

            const uniqueSizes = listProductDetail.reduce((acc, item) => {
                if (!acc.some((size) => size.id === item.size.id)) {
                    acc.push(item.size);
                }
                return acc;
            }, []);

            setListColor(uniqueColors);
            setListSize(uniqueSizes);

            if (uniqueColors.length > 0) {
                setSelectedColor(uniqueColors[0]);
            }
            if (uniqueSizes.length > 0) {
                setSelectedSize(uniqueSizes[0]);
            }
        }
    }, [listProductDetail]);

    useEffect(() => {
        if (selectedColor && selectedSize) {
            const productDetail = listProductDetail.find(
                (item) => item.color.id === selectedColor.id && item.size.id === selectedSize.id
            );
            setSelectedProductDetail(productDetail ?? null);
        }
    }, [selectedColor, selectedSize, listProductDetail]);

    const calculatePriceRange = (details) => {
        if (details.length === 0) return null;
        const prices = details.map(detail => detail.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        setSelectedSize(null);
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const handleIncreaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = async () => {
        // Logic to add the selected product to the cart
        console.log('Add to cart functionality not implemented yet.');
        if (selectedOrder?.id) {
            const data = {
                "orderId": selectedOrder.id,
                "quantity": quantity,
                "productDetailId": productid,
            }
            await axios.post(`${API_BASE_URL}/order-details`, data).then(function (response) {
                console.log(response)
            })
        }
        else {
            console.log("Chưa có order id")
        }

    };

    const renderPriceSection = () => {
        if (selectedProductDetail) {
            return (
                <View style={styles.priceContainer}>
                    {salePercent !== 0 && (
                        <Text style={styles.discountedPrice}>
                            {formatPrice(selectedProductDetail.price / 100 * (100 - salePercent))}
                        </Text>
                    )}
                    <Text style={[styles.originalPrice, salePercent !== 0 && styles.strikethrough]}>
                        {formatPrice(selectedProductDetail.price)}
                    </Text>
                </View>
            );
        }

        if (priceRange) {
            return (
                <Text style={styles.priceRangeText}>
                    {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
                </Text>
            );
        }

        return <Text>Đang cập nhật</Text>;
    };

    const renderProductImages = () => {
        const images = selectedProductDetail?.images || [];

        return (
            <View>
                <View style={styles.mainImageContainer}>
                    {salePercent > 0 && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountBadgeText}>- {salePercent}%</Text>
                        </View>
                    )}
                    <Image
                        source={{ uri: images[currentImageIndex]?.url || defaultImage }}
                        style={styles.mainImage}
                        resizeMode="cover"
                    />
                </View>

                {images.length > 1 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.thumbnailContainer}
                    >
                        {images.map((image, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setCurrentImageIndex(index)}
                                style={[
                                    styles.thumbnailWrapper,
                                    currentImageIndex === index && styles.selectedThumbnail
                                ]}
                            >
                                <Image
                                    source={{ uri: image.url }}
                                    style={styles.thumbnailImage}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.center}>
                <Text>No product found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.mainContent}>
                {renderProductImages()}

                <View style={styles.infoCard}>
                    <Text style={styles.productName}>{product.name}</Text>
                    
                    {renderPriceSection()}

                    <View style={styles.metaGrid}>
                        {selectedProductDetail && (
                            <>
                                <View style={styles.metaItem}>
                                    <Text style={styles.metaLabel}>Mã SP</Text>
                                    <Text style={styles.metaValue}>{selectedProductDetail.code}</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <Text style={styles.metaLabel}>Thương hiệu</Text>
                                    <Text style={styles.metaValue}>{selectedProductDetail.brand?.name}</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <Text style={styles.metaLabel}>Chất liệu</Text>
                                    <Text style={styles.metaValue}>{selectedProductDetail.material?.name}</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <Text style={styles.metaLabel}>Kho</Text>
                                    <Text style={styles.metaValue}>{selectedProductDetail.quantity}</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <Text style={styles.metaLabel}>Tình trạng</Text>
                                    <Text style={[styles.metaValue, {color: selectedProductDetail.quantity > 0 ? '#00C853' : '#D32F2F'}]}>
                                        {selectedProductDetail.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}
                                    </Text>
                                </View>
                            </>
                        )}
                    </View>

                    <View style={styles.optionsContainer}>
                        <Text style={styles.optionTitle}>Màu sắc</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.optionsRow}>
                                {listColor.map((color) => (
                                    <TouchableOpacity
                                        key={color.id}
                                        style={[styles.optionChip, selectedColor?.id === color.id && styles.selectedChip]}
                                        onPress={() => handleColorSelect(color)}
                                    >
                                        <Text style={[styles.optionText, selectedColor?.id === color.id && styles.selectedOptionText]}>
                                            {color.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        <Text style={[styles.optionTitle, {marginTop: 16}]}>Size</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.optionsRow}>
                                {listSize.map((size) => (
                                    <TouchableOpacity
                                        key={size.id}
                                        style={[styles.optionChip, selectedSize?.id === size.id && styles.selectedChip]}
                                        onPress={() => handleSizeSelect(size)}
                                    >
                                        <Text style={[styles.optionText, selectedSize?.id === size.id && styles.selectedOptionText]}>
                                            {size.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    <View style={styles.quantitySection}>
                        <Text style={styles.optionTitle}>Số lượng</Text>
                        <View style={styles.quantityControls}>
                            <TouchableOpacity style={styles.quantityButton} onPress={handleDecreaseQuantity}>
                                <Icon name="minus" size={16} color="#333" />
                            </TouchableOpacity>
                            <Text style={styles.quantityDisplay}>{quantity}</Text>
                            <TouchableOpacity style={styles.quantityButton} onPress={handleIncreaseQuantity}>
                                <Icon name="plus" size={16} color="#333" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
                            <Icon name="shopping-cart" size={18} color="white" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>Thêm vào giỏ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buyButton} onPress={() => handleAddToCart()}>
                            <Icon name="bolt" size={18} color="white" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>Mua ngay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    mainContent: {
        padding: 12,
    },
    mainImageContainer: {
        width: width - 24,
        aspectRatio: 1,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: 'white',
        elevation: 4,
        marginBottom: 12,
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    discountBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#FF3D00',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    discountBadgeText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    thumbnailScroll: {
        marginTop: 8,
    },
    thumbnail: {
        width: 64,
        height: 64,
        marginRight: 8,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedThumbnail: {
        borderColor: '#1976D2',
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginTop: 12,
        elevation: 2,
    },
    productName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#212121',
        marginBottom: 12,
    },
    metaGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 16,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        padding: 12,
    },
    metaItem: {
        width: '50%',
        marginBottom: 12,
    },
    metaLabel: {
        fontSize: 13,
        color: '#757575',
        marginBottom: 4,
    },
    metaValue: {
        fontSize: 15,
        color: '#212121',
        fontWeight: '500',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    discountedPrice: {
        fontSize: 24,
        fontWeight: '700',
        color: '#F44336',
        marginRight: 8,
    },
    originalPrice: {
        fontSize: 16,
        color: '#9E9E9E',
        textDecorationLine: 'line-through',
    },
    optionsContainer: {
        marginTop: 16,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212121',
        marginBottom: 12,
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    optionChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        marginRight: 8,
        marginBottom: 8,
    },
    selectedChip: {
        backgroundColor: '#1976D2',
    },
    optionText: {
        color: '#424242',
        fontSize: 14,
    },
    selectedOptionText: {
        color: 'white',
    },
    quantitySection: {
        marginTop: 24,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 8,
    },
    quantityButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1,
    },
    quantityDisplay: {
        fontSize: 16,
        fontWeight: '600',
        marginHorizontal: 24,
    },
    actionButtons: {
        flexDirection: 'row',
        marginTop: 24,
        gap: 12,
    },
    cartButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF9800',
        padding: 16,
        borderRadius: 12,
    },
    buyButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        padding: 16,
        borderRadius: 12,
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});