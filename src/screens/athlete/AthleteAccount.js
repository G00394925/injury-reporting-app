import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Touchable } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from '../../context/AuthContext';
import { Button } from '@rneui/base';
import { globalStyles } from '../../styles/globalStyles';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AthleteAccountScreen() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { userData, logout } = useAuth();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={globalStyles.container} edges={["top"]}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerText}>Your Account</Text>
      </View>
      <View style={globalStyles.contentContainer}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.accountInfoContainer}>
          <View style={styles.accountInfoCard}>
            <Text style={styles.infoTitleText}>Name</Text>
            <Text style={styles.infoDetailText}>{userData.name}</Text>
          </View>    
          <View style={styles.accountInfoCard}>
            <Text style={styles.infoTitleText}>Email</Text>
            <Text style={styles.infoDetailText}>{userData.email}</Text>
          </View>
          <View style={styles.accountInfoCard}>
            <Text style={styles.infoTitleText}>Date of Birth</Text>
            <Text style={styles.infoDetailText}>{userData.dob}</Text>
          </View>
          <View style={styles.accountInfoCard}>
            <Text style={styles.infoTitleText}>Role</Text>
            <Text style={styles.infoDetailText}>{userData.user_type}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.settingButton}>
          <View style={styles.settingIconContainer}>
            <MaterialIcons name="border-color" size={21} />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.settingText}>Update details</Text>
          </View>
          <Ionicons name="chevron-forward" size={26} color="#0000006c" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingButton}>
          <View style={styles.settingIconContainer}>
            <MaterialIcons name="password" size={21} />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.settingText}>Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={26} color="#0000006c" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.settingButton}
          onPress={() => (navigation.navigate("Report"))}
        >
          <View style={styles.settingIconContainer}>
            <MaterialIcons name="assignment" size={21} />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.settingText}>Submit Additional Report</Text>
          </View>
          <Ionicons name="chevron-forward" size={26} color="#0000006c" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.settingButton, {backgroundColor: "#ffd8d8"}]}
          onPress={() => setShowConfirmation(true)}
        >
          <View style={styles.settingIconContainer}>
            <MaterialIcons name="logout" size={21} color="red"/>
          </View>
          <View style={{flex: 1}}>
            <Text style={[styles.settingText, {color: 'red'}]}>Log Out</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingButton, {backgroundColor: "#ffd8d8"}]}>
          <View style={styles.settingIconContainer}>
            <MaterialIcons name="delete-forever" size={21} color="red" />
          </View>
          <View style={{flex: 1}}>
            <Text style={[styles.settingText, {color: "red"}]}>Delete Account</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Modal 
        visible={showConfirmation}
        animationType='fade'
        transparent={true}
        statusBarTranslucent={true}
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Are you sure you wish to logout?
              </Text>
            </View>
            <View style={styles.modalBody}>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={logout}
                >
                  <Text style={styles.modalButtonText}>Logout</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowConfirmation(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  accountInfoContainer: {
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 15
  },
  accountInfoCard: {
    flexDirection: "column",
    padding: 10,
    marginBottom: 10
  },
  settingButton: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#e4e4e4",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5
  },
  settingText: {
    fontFamily: "Rubik",
    fontSize: 16,
    fontWeight: "bold",
    color: "#303030"
  },
  infoTitleText: {
    fontFamily: "Rubik",
    fontSize: 16,
    fontWeight: "bold"
  },
  infoDetailText: {
    fontFamily: "Rubik",
    fontSize: 16,
    marginTop: 5,
    color: "#4e4e4e",
  },
  sectionTitle: {
    fontFamily: "Rubik",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  settingIconContainer: {
    marginRight: 20,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Rubik",
    color: "#333"
  },
  modalBody: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  modalConfirmButton: {
    backgroundColor: "#ff8d8d",
    padding: 15,
    borderRadius: 15,
    width: "45%",
    alignItems: "center"
  },
  modalCancelButton: {
    backgroundColor: "#cccccc",
    padding: 15,
    borderRadius: 15,
    width: "45%",
    alignItems: "center"
  },
  modalButtonText: {
    fontFamily: "Rubik",
    fontSize: 16
  }
})