import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { z } from "zod";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define the issue schema using Zod
const issueSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]),
  createdAt: z.string(),
  updatedAt: z.string(),
  userEmail: z.string(), // Use userEmail field to link the issue to the user
});

const StatusGraph = ({ issues }: { issues: z.infer<typeof issueSchema>[] }) => {
  const statusCounts = issues.reduce(
    (acc, issue) => {
      acc[issue.status] += 1;
      return acc;
    },
    { OPEN: 0, IN_PROGRESS: 0, CLOSED: 0 }
  );

  const data = {
    labels: ["Open", "In Progress", "Closed"],
    datasets: [
      {
        label: "Issue Statuses",
        data: [
          statusCounts.OPEN,
          statusCounts.IN_PROGRESS,
          statusCounts.CLOSED,
        ],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Issue Status Distribution",
      },
    },
  };

  return (
    <div className="glass-effect">
      <Bar data={data} options={options} />
    </div>
  );
};

export default StatusGraph;
