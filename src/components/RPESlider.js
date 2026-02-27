import Slider from "@react-native-community/slider";
import { MaterialIcons } from "@expo/vector-icons";
import { View, StyleSheet, Dimensions, Text } from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const CONTAINER_WIDTH = screenWidth * 0.9;
const SLIDER_WIDTH = CONTAINER_WIDTH - 60;

export default function RpeSlider({ value, onValueChange }) {
    const getColor = () => {
        // Calculate RGB value relative to slider value
        const interpolate = (start, end) => {
            let k = value / 10;
            return Math.ceil((1 - k) * start + k * end) % 256;
        };

        let r = interpolate(0, 255);
        let g = interpolate(200, 0);
        let b = 0;
        return `rgb(${r}, ${g}, ${b})`;
    };

    const getIcon = () => {
        if (value <= 2) return "sentiment-very-satisfied";
        if (value <= 4) return "sentiment-satisfied";
        if (value <= 6) return "sentiment-neutral";
        if (value <= 8) return "sentiment-dissatisfied";
        return "sentiment-very-dissatisfied";
    };

    const getLabel = () => {
        if (value <= 2) return "Very Light / None";
        if (value <= 4) return "Light";
        if (value <= 6) return "Moderate";
        if (value <= 8) return "Intense";
        return "Very Intense";
    };

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <MaterialIcons name={getIcon()} size={120} color={getColor()} />
            </View>
            <View style={styles.sliderContainer}>
                <Text style={styles.sliderHeading}>
                    Rate your perceived pain level
                </Text>
                <Slider
                    style={{ width: SLIDER_WIDTH, height: 40 }}
                    minimumValue={1}
                    maximumValue={10}
                    step={1}
                    value={value}
                    onValueChange={onValueChange}
                    minimumTrackTintColor={"black"}
                    maximumTrackTintColor="#afafafff"
                    thumbTintColor={getColor()}
                />
                <View style={styles.labelsContainer}>
                    <Text style={styles.labelText}>1</Text>
                    <Text style={styles.labelText}>10</Text>
                </View>
                <Text style={[styles.rpe_label, { color: getColor() }]}>
                    {getLabel()}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
        paddingVertical: 20
    },
    iconContainer: {
        marginBottom: 45
    },
    sliderContainer: {
        padding: 30,
        backgroundColor: "#dadadaff",
        alignContent: "center",
        width: CONTAINER_WIDTH,
        borderRadius: 10,
        alignItems: "center"
    },
    sliderHeading: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 10,
        fontFamily: "Rubik"
    },
    valueText: {
        fontSize: 32,
        fontWeight: "bold",
        fontFamily: "Rubik",
        marginBottom: 10
    },
    labelsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: SLIDER_WIDTH,
        paddingHorizontal: 5
    },
    labelText: {
        fontSize: 12,
        color: "#555",
        fontFamily: "Rubik"
    },
    rpe_label: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
        fontFamily: "Rubik",
        textAlign: "center"
    }
});
