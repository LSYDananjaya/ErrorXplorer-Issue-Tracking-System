"use client";

import React, { useEffect, useState } from "react";
import {
  Heading,
  Table,
  TextField,
  Button,
  Badge,
  Flex,
  Box,
  RadioCards,
  Text,
} from "@radix-ui/themes";
import {
  MagnifyingGlassIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Form from "@radix-ui/react-form";
import Link from "next/link";
import axios from "axios";
import { z } from "zod";

// Define the issue schema using Zod
const issueSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]),
  createdAt: z.string(),
});

const Issues = () => {
  const [issues, setIssues] = useState<z.infer<typeof issueSchema>[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<
    z.infer<typeof issueSchema>[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [issuesPerPage] = useState(10);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filterText, setFilterText] = useState("Filter by Status");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [selectedIssue, setSelectedIssue] = useState<z.infer<
    typeof issueSchema
  > | null>(null);

  useEffect(() => {
    const fetchUserIssues = async () => {
      try {
        const userEmail = sessionStorage.getItem("userEmail");
        if (!userEmail) {
          throw new Error(
            "User email not found in session storage. Please log in."
          );
        }

        const response = await axios.get("/api/issues/user", {
          headers: { "x-user-email": userEmail },
        });

        const validatedIssues = response.data.map((issue: any) =>
          issueSchema.parse(issue)
        );
        setIssues(validatedIssues);
        setFilteredIssues(validatedIssues);
      } catch (error) {
        console.error("Error fetching user-specific issues:", error);
      }
    };

    fetchUserIssues();
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
          return sortConfig.direction === "ascending"
            ? a[sortConfig.key].localeCompare(b[sortConfig.key])
            : b[sortConfig.key].localeCompare(a[sortConfig.key]);
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

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/issues/user?id=${id}`);
      setIssues(issues.filter((issue) => issue.id !== id));
      setFilteredIssues(filteredIssues.filter((issue) => issue.id !== id));
    } catch (error) {
      console.error("Error deleting issue:", error);
    }
  };

  const handleEdit = (issue: z.infer<typeof issueSchema>) => {
    setSelectedIssue(issue);
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedIssue) {
      try {
        await axios.put(
          `/api/issues/user?id=${selectedIssue.id}`,
          selectedIssue
        );
        setIssues(
          issues.map((issue) =>
            issue.id === selectedIssue.id ? selectedIssue : issue
          )
        );
        setFilteredIssues(
          filteredIssues.map((issue) =>
            issue.id === selectedIssue.id ? selectedIssue : issue
          )
        );
        setSelectedIssue(null);
      } catch (error) {
        console.error("Error updating issue:", error);
      }
    }
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
    <div className="container mx-auto p-4">
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
        <Button color="gray" asChild>
          <Link href="/issues/new">New Issue</Link>
        </Button>
        <div className="flex-1 mt-2 md:mt-0 md:ml-2">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="soft">{filterText}</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="z-50 bg-white bg-opacity-50 backdrop-blur-md rounded-lg p-2 shadow-lg">
              <div className="space-y-2">
                <DropdownMenu.Item asChild>
                  <button
                    className="w-full text-left p-2 hover:bg-gray-200 rounded"
                    onClick={() =>
                      handleStatusFilterChange("", "Filter by Status")
                    }
                  >
                    All Statuses
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <button
                    className="w-full text-left p-2 hover:bg-gray-200 rounded"
                    onClick={() => handleStatusFilterChange("OPEN", "Open")}
                  >
                    Open
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <button
                    className="w-full text-left p-2 hover:bg-gray-200 rounded"
                    onClick={() =>
                      handleStatusFilterChange("IN_PROGRESS", "In Progress")
                    }
                  >
                    In Progress
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <button
                    className="w-full text-left p-2 hover:bg-gray-200 rounded"
                    onClick={() => handleStatusFilterChange("CLOSED", "Closed")}
                  >
                    Closed
                  </button>
                </DropdownMenu.Item>
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
        <div className="flex-1 mt-2 md:mt-0">
          <TextField.Root placeholder="Search">
            <TextField.Slot>
              <MagnifyingGlassIcon />
            </TextField.Slot>
            <input type="text" value={filter} onChange={handleFilterChange} />
          </TextField.Root>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell onClick={() => handleSort("title")}>
                Title
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell onClick={() => handleSort("createdAt")}>
                Date
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {currentIssues.map((issue) => (
              <Table.Row key={issue.id}>
                <Table.RowHeaderCell>{issue.title}</Table.RowHeaderCell>
                <Table.Cell>{issue.description}</Table.Cell>
                <Table.Cell>
                  <Badge color={getStatusStyle(issue.status)}>
                    {issue.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  {new Date(issue.createdAt).toLocaleString()}
                </Table.Cell>
                <Table.Cell>
                  <Flex gap="2">
                    <Button
                      variant="soft"
                      color="blue"
                      onClick={() => handleEdit(issue)}
                    >
                      <Pencil1Icon />
                    </Button>

                    <AlertDialog.Root>
                      <AlertDialog.Trigger asChild>
                        <Button variant="soft" color="red">
                          <TrashIcon />
                        </Button>
                      </AlertDialog.Trigger>
                      <AlertDialog.Portal>
                        <AlertDialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                        <AlertDialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none">
                          <AlertDialog.Title className="text-lg font-semibold text-gray-900">
                            Are you absolutely sure?
                          </AlertDialog.Title>
                          <AlertDialog.Description className="mt-2 text-sm text-gray-600">
                            This action cannot be undone. This will permanently
                            delete the issue.
                          </AlertDialog.Description>
                          <div className="mt-4 flex justify-end gap-4">
                            <AlertDialog.Cancel asChild>
                              <Button variant="soft" color="gray">
                                Cancel
                              </Button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                              <Button
                                variant="soft"
                                color="red"
                                onClick={() => handleDelete(issue.id)}
                              >
                                Yes, delete issue
                              </Button>
                            </AlertDialog.Action>
                          </div>
                        </AlertDialog.Content>
                      </AlertDialog.Portal>
                    </AlertDialog.Root>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
      <div className="flex justify-center mt-4">
        {[
          ...Array.from(
            Array(Math.ceil(filteredIssues.length / issuesPerPage)).keys()
          ),
        ].map((num) => (
          <Button key={num} onClick={() => paginate(num + 1)}>
            {num + 1}
          </Button>
        ))}
      </div>
      {selectedIssue && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md mx-4">
            <Heading mb="2" size="4" align="center" color="cyan">
              Edit
            </Heading>
            <Form.Root className="w-full" onSubmit={handleEditSubmit}>
              <Form.Field className="mb-2.5 grid" name="description">
                <div className="flex items-baseline justify-between">
                  <Form.Label className="text-[15px] font-medium leading-[35px] text-black">
                    Description
                  </Form.Label>
                  <Form.Message
                    className="text-[13px] text-red-500"
                    match="valueMissing"
                  >
                    Please enter a description
                  </Form.Message>
                </div>
                <Form.Control asChild>
                  <textarea
                    className="box-border inline-flex w-full resize-none appearance-none items-center justify-center rounded bg-gray-200 p-2.5 text-[15px] leading-none text-black shadow-[0_0_0_1px] shadow-black outline-none selection:bg-gray-300 selection:text-black hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
                    required
                    value={selectedIssue.description}
                    onChange={(e) =>
                      setSelectedIssue({
                        ...selectedIssue,
                        description: e.target.value,
                      })
                    }
                  />
                </Form.Control>
              </Form.Field>
              <Form.Field className="mb-2.5 grid" name="status">
                <div className="flex items-baseline justify-between">
                  <Form.Label className="text-[15px] font-medium leading-[35px] text-black">
                    Status
                  </Form.Label>
                </div>
                <Box maxWidth="600px">
                  <RadioCards.Root
                    defaultValue={selectedIssue.status}
                    columns={{ initial: "1", sm: "1" }}
                    onValueChange={(value) => {
                      const newStatus = value as
                        | "OPEN"
                        | "IN_PROGRESS"
                        | "CLOSED";
                      setSelectedIssue((prevIssue) =>
                        prevIssue
                          ? {
                              ...prevIssue,
                              status: newStatus,
                            }
                          : null
                      );
                    }}
                  >
                    <RadioCards.Item value="OPEN">
                      <Flex
                        direction="column"
                        width="100%"
                        className="bg-teal-100 p-2 rounded text-center"
                      >
                        <Text weight="bold">Open</Text>
                      </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item value="IN_PROGRESS">
                      <Flex
                        direction="column"
                        width="100%"
                        className="bg-amber-100 p-2 rounded text-center"
                      >
                        <Text weight="bold">In Progress</Text>
                      </Flex>
                    </RadioCards.Item>
                    <RadioCards.Item value="CLOSED">
                      <Flex
                        direction="column"
                        width="100%"
                        className="bg-red-100 p-2 rounded text-center"
                      >
                        <Text weight="bold">Closed</Text>
                      </Flex>
                    </RadioCards.Item>
                  </RadioCards.Root>
                </Box>
              </Form.Field>
              <div className="flex justify-end gap-2">
                <Button
                  variant="soft"
                  color="gray"
                  onClick={() => setSelectedIssue(null)}
                >
                  Cancel
                </Button>
                <Form.Submit asChild>
                  <Button variant="soft" color="blue">
                    Save
                  </Button>
                </Form.Submit>
              </div>
            </Form.Root>
          </div>
        </div>
      )}
    </div>
  );
};

export default Issues;
