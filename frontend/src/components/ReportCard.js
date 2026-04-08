import { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ReportCard = ({ report, isFollowUp = false }) => {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Healthy":
        return "#10b981";
      case "No competing":
        return "#f59e0b";
      case "No training or competing":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      {/* Summary Header */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.athleteName}>{report.athletes.users.name}</Text>
          <Text style={styles.date}>{formatDate(report.created_at)}</Text>
        </View>
        
        <View style={styles.headerRight}>
          <View 
            style={[
              styles.statusBadge, 
              { backgroundColor: getStatusColor(report.new_availability) }
            ]}
          >
            <Text style={styles.statusText}>
              {isFollowUp ? 'Follow-up' : 'Initial'}
            </Text>
          </View>
          <Ionicons 
            name={expanded ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="#001a79" 
          />
        </View>
      </View>

      {/* Expanded Details */}
      {expanded && (
        <View style={styles.cardDetails}>
          {!isFollowUp ? (
            <>
              <DetailRow label="Status" value={report.new_availability} />
              {report.injured && <DetailRow label="Injured" value="Yes" />}
              {report.ill && <DetailRow label="Ill" value="Yes" />}
              {report.rpe && <DetailRow label="RPE" value={`${report.rpe}/10`} />}
              {report.injury_code && <DetailRow label="Injury Code" value={report.injury_code} />}
              {report.injury_side && <DetailRow label="Side" value={report.injury_side} />}
              {report.injury_onset && <DetailRow label="Onset" value={report.injury_onset} />}
              {report.timeloss && <DetailRow label="Time Loss" value="Yes" />}
              {report.consulted && <DetailRow label="Medical Consultation" value="Yes" />}
              {report.comments && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Comments:</Text>
                  <Text style={styles.detailValue}>{report.comments}</Text>
                </View>
              )}
            </>
          ) : (
            <>
              <DetailRow label="Status" value={report.new_availability} />
              {report.recovery_progress && <DetailRow label="Progress" value={report.recovery_progress} />}
              {report.rpe && <DetailRow label="RPE" value={`${report.rpe}/10`} />}
              {report.practitioner_contact && <DetailRow label="Practitioner Contact" value="Yes" />}
              {report.comments && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Comments:</Text>
                  <Text style={styles.detailValue}>{report.comments}</Text>
                </View>
              )}
            </>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

// Helper component for detail rows
const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fcfcfc',
    marginHorizontal: 10,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
  },
  headerLeft: {
    flex: 1,
  },
  athleteName: {
    fontFamily: "Rubik",
    fontWeight: "600",
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 4,
  },
  date: {
    fontFamily: "Rubik",
    fontSize: 13,
    color: '#6b7280',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontFamily: "Rubik",
    fontWeight: "600",
    fontSize: 12,
  },
  cardDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 15,
    backgroundColor: '#fafafa',
  },
  detailRow: {
    marginBottom: 10,
  },
  detailLabel: {
    fontFamily: "Rubik",
    fontWeight: "600",
    color: '#374151',
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: "Rubik",
    color: '#6b7280',
    fontSize: 14,
  },
});

export default ReportCard;