import { File, Directory, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

export const exportToCSV = async (data) => {
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB")
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const header =
    "ReportID,AthleteName,Injured,Ill,RPE,Timeloss,Consulted,InjuryOnset,InjuryCode,NewAvailability,CreatedAt";
  const rows = data.map((report) => {
      const reportId = report.report_id;
      const athleteName = report.athletes.users.name;
      const injured = report.injured ? "Yes" : "No";
      const ill = report.ill ? "Yes" : "No";
      const rpe = report.rpe || 1;
      const timeloss = report.timeloss ? "Yes" : "No";
      const consulted = report.consulted ? "Yes" : "No";
      const injuryOnset = report.injury_onset || "N/A";
      const injuryCode = report.injury_code || "N/A";
      const newAvailability = report.new_availability;
      const createdAt = formatDate(report.created_at) + " " + formatTime(report.created_at);

      return `${reportId},${athleteName},${injured},${ill},${rpe},${timeloss},${consulted},${injuryOnset},${injuryCode},${newAvailability},${createdAt}`;
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
    console.log("CSV file created and shared successfully: ", file.uri);

  } catch (error) {
    console.error("Error exporting to CSV: ", error);
  }

};
