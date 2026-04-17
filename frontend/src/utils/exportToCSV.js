import { File, Directory, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

export const exportToCSV = async (data) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Construct CSV Header and Rows
  const header =
    "ReportID,Injured,Ill,Gender,Age,Sport,RPE,Timeloss,Consulted,InjuryOnset,InjuryCode,NewAvailability,CreatedAt";
  const rows = data.map((report) => {
    const reportId = report.report_id;
    const injured = report.injured ? "Yes" : "No";
    const ill = report.ill ? "Yes" : "No";
    const gender = report.gender || "Unknown";
    const age = report.athlete_age || "Unknown";
    const sport = report.sport || "Unknown";
    const rpe = report.rpe || 1;
    const timeloss = report.timeloss ? "Yes" : "No";
    const consulted = report.consulted ? "Yes" : "No";
    const injuryOnset = report.injury_onset || "N/A";
    const injuryCode = report.injury_code || "N/A";
    const newAvailability = report.new_availability;
    const createdAt = formatDate(report.created_at) + " " + formatTime(report.created_at);

    return `${reportId},${injured},${ill},${gender},${age},${sport},${rpe},${timeloss},${consulted},${injuryOnset},${injuryCode},${newAvailability},${createdAt}`;
  })
    .join("\n");

  const csvString = `${header}\n${rows}`;

  try {
    const file = new File(Paths.document, `report_data/${Date.now()}.csv`);
    file.create({ intermediates: true });
    file.write(csvString);

    await Sharing.shareAsync(file.uri, {
      mimeType: "text/csv",
      dialogTitle: "Download Report Data"
    });
  } catch (error) {
    console.error("Error exporting to CSV: ", error);
  }

};
