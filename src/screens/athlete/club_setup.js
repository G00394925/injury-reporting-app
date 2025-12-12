import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../config/api_config";
import axios from "axios";
import { Button } from "@rneui/base";

export default function ClubSetup() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const { uuid } = useAuth();
    const [items, setItems] = useState([]);

    // Acquire list of coaches from database
    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/coaches/${uuid}`);
                const coachOptions = response.data.coaches.map((coach) => ({
                    label: coach,
                    value: coach,
                }));

                setItems(coachOptions);
            } catch (error) {
                console.error("Error fetching coaches:", error);
            }
        };
        fetchCoaches();
    }, []);

    const handleSave = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/assign-coach/`, {
                athlete_uuid: uuid,
                coach_name: value,
            });

            console.log("Coach assigned successfully:", response.data);
        } catch (error) {
            console.error("Error assigning coach:", error);
        }
    };

    return (
        <SafeAreaView>
            <View>
                <Text>Choose coach:</Text>
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    listMode="SCROLLVIEW"
                    placeholder="Select your coach"
                />
                <Button title="Save" onPress={() => handleSave()} />
            </View>
        </SafeAreaView>
    );
}