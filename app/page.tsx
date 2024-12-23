"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TextField,
  Button,
  Badge,
  Flex,
  Box,
  Container,
} from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import axios from "axios";
import { z } from "zod";
import classNames from "classnames";
import StatusGraph from "./StatusGraph"; // Import the StatusGraph component
import NewIssues from "./NewIssues"; // Import the NewIssues component

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

const Page = () => {
  const [issues, setIssues] = useState<z.infer<typeof issueSchema>[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<
    z.infer<typeof issueSchema>[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [issuesPerPage] = useState(6); // Set issues per page to 6
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // Added state for status filter
  const [filterText, setFilterText] = useState("Filter by Status"); // Added state for filter text
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get("/api/issues");
        console.log("Fetched issues:", response.data); // Debugging fetched issues
        const validatedIssues = response.data.map((issue: any) =>
          issueSchema.parse(issue)
        );
        console.log("Validated issues:", validatedIssues); // Debugging validated issues
        setIssues(validatedIssues);
        setFilteredIssues(validatedIssues);
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };

    fetchIssues();
  }, []);

  useEffect(() => {
    let filteredData = issues;

    // Apply text filter
    if (filter) {
      filteredData = filteredData.filter((issue) =>
        Object.values(issue).some((value) =>
          value.toString().toLowerCase().includes(filter.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (statusFilter) {
      filteredData = filteredData.filter(
        (issue) => issue.status === statusFilter.toUpperCase()
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        if (sortConfig.key === "title") {
          if (
            a[sortConfig.key].toLowerCase() < b[sortConfig.key].toLowerCase()
          ) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (
            a[sortConfig.key].toLowerCase() > b[sortConfig.key].toLowerCase()
          ) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          return 0;
        } else if (sortConfig.key === "createdAt") {
          const dateA = new Date(a[sortConfig.key]);
          const dateB = new Date(b[sortConfig.key]);
          return sortConfig.direction === "ascending"
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        }
        return 0;
      });
    }

    console.log("Filtered issues:", filteredData); // Debugging filtered issues
    setFilteredIssues(filteredData);
  }, [filter, statusFilter, sortConfig, issues]);

  const handleSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const handleStatusFilterChange = (status: string, text: string) => {
    setStatusFilter(status);
    setFilterText(text);
  };

  const indexOfLastIssue = currentPage * issuesPerPage;
  const indexOfFirstIssue = indexOfLastIssue - issuesPerPage;
  const currentIssues = filteredIssues.slice(
    indexOfFirstIssue,
    indexOfLastIssue
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "OPEN":
        return "teal";
      case "IN_PROGRESS":
        return "amber";
      case "CLOSED":
        return "ruby";
      default:
        return undefined;
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="w-full max-w-4xl mb-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Container
            size="1"
            style={{
              height: "350px", // Increased height
              border: "1px solid #ccc", // Add border
              borderRadius: "var(--radius-3)", // Add border radius
              padding: "16px", // Add padding
            }}
          >
            <StatusGraph issues={issues} /> {/* Add StatusGraph component */}
          </Container>

          <Container
            size="1"
            style={{
              height: "350px", // Increased height
              border: "1px solid #ccc", // Add border
              borderRadius: "var(--radius-3)", // Add border radius
              padding: "16px", // Add padding
            }}
          >
            <NewIssues issues={issues} /> {/* Add NewIssues component */}
          </Container>
        </div>
      </div>
      <div className="w-full max-w-4xl">
        <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex-1 mb-2 md:mb-0 md:ml-2">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button variant="soft" className="w-full md:w-auto">
                  {filterText}
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="z-50 bg-white bg-opacity-50 backdrop-blur-md rounded-lg p-2">
                <DropdownMenu.Item asChild>
                  <button
                    className="w-full text-left p-2 hover:bg-gray-200"
                    onClick={() =>
                      handleStatusFilterChange("", "Filter by Status")
                    }
                  >
                    All Statuses
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <button
                    className="w-full text-left p-2 hover:bg-gray-200"
                    onClick={() => handleStatusFilterChange("OPEN", "Open")}
                  >
                    Open
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <button
                    className="w-full text-left p-2 hover:bg-gray-200"
                    onClick={() =>
                      handleStatusFilterChange("IN_PROGRESS", "In Progress")
                    }
                  >
                    In Progress
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <button
                    className="w-full text-left p-2 hover:bg-gray-200"
                    onClick={() => handleStatusFilterChange("CLOSED", "Closed")}
                  >
                    Closed
                  </button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
          <div className="flex-1 md:mr-2 w-full md:w-auto">
            <TextField.Root placeholder="Search" className="w-full">
              <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
              <input
                type="text"
                value={filter}
                onChange={handleFilterChange}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </TextField.Root>
          </div>
        </div>
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <Table.Root variant="surface" className="min-w-full bg-white">
            <Table.Header>
              <Table.Row className="bg-gray-200">
                <Table.ColumnHeaderCell
                  className="py-3 px-4 border-b border-r cursor-pointer font-semibold text-gray-700 text-center"
                  onClick={() => handleSort("title")}
                >
                  Title
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell
                  className="py-3 px-4 border-b border-r cursor-pointer font-semibold text-gray-700 text-center"
                  onClick={() => handleSort("description")}
                >
                  Description
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell
                  className="py-3 px-4 border-b border-r cursor-pointer font-semibold text-gray-700 text-center"
                  onClick={() => handleSort("status")}
                >
                  Status
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell
                  className="py-3 px-4 border-b border-r cursor-pointer font-semibold text-gray-700 text-center"
                  onClick={() => handleSort("createdAt")}
                >
                  Date
                </Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell
                  className="py-3 px-4 border-b cursor-pointer font-semibold text-gray-700 text-center"
                  onClick={() => handleSort("userEmail")}
                >
                  Submitted By
                </Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {currentIssues.map((issue) => (
                <Table.Row key={issue.id} className="hover:bg-gray-100">
                  <Table.RowHeaderCell className="py-3 px-4 border-b border-r text-center font-medium">
                    {issue.title}
                  </Table.RowHeaderCell>
                  <Table.Cell className="py-3 px-4 border-b border-r text-center font-medium">
                    {issue.description}
                  </Table.Cell>
                  <Table.Cell className="py-3 px-4 border-b border-r font-medium rounded text-center">
                    <Flex gap="2" justify="center">
                      <Badge color={getStatusStyle(issue.status)}>
                        {issue.status}
                      </Badge>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell className="py-3 px-4 border-b text-center font-medium">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className="py-3 px-4 border-b text-center font-medium">
                    {issue.userEmail}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </div>
        <div className="mt-4 flex justify-center">
          <nav>
            <ul className="flex list-none">
              {Array.from(
                { length: Math.ceil(filteredIssues.length / issuesPerPage) },
                (_, index) => (
                  <li key={index} className="mx-1">
                    <button
                      onClick={() => paginate(index + 1)}
                      className={classNames("px-3 py-1 border rounded", {
                        "bg-gray-300": currentPage === index + 1,
                        "bg-white": currentPage !== index + 1,
                      })}
                    >
                      {index + 1}
                    </button>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Page;
