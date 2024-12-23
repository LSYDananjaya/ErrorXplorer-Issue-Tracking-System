import React from "react";
import { z } from "zod";
import { Box, ScrollArea, Heading, Flex, Callout } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import * as Avatar from "@radix-ui/react-avatar";

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

const getStatusColor = (status: string) => {
  switch (status) {
    case "OPEN":
      return "teal";
    case "IN_PROGRESS":
      return "amber";
    case "CLOSED":
      return "ruby";
    default:
      return "gray";
  }
};

const NewIssues = ({ issues }: { issues: z.infer<typeof issueSchema>[] }) => {
  const sortedIssues = [...issues].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const newIssues = sortedIssues.slice(0, 8); // Show the 8 most recent issues

  return (
    <div>
      <Heading
        size="4"
        mb="2"
        trim="start"
        align="center"
        style={{ backgroundColor: "transparent" }}
      >
        Latest Issues
      </Heading>

      <ScrollArea type="always" scrollbars="vertical" style={{ height: 300 }}>
        <Box p="2" pr="8">
          <Flex direction="column" gap="4">
            {newIssues.map((issue) => (
              <Callout.Root key={issue.id} color={getStatusColor(issue.status)}>
                <Flex align="center" justify="between">
                  <Flex align="center">
                    <Callout.Icon>
                      <InfoCircledIcon />
                    </Callout.Icon>
                    <Callout.Text style={{ backgroundColor: "transparent" }}>
                      <strong>{issue.title}</strong> - {issue.description}
                    </Callout.Text>
                  </Flex>
                  <Avatar.Root
                    className="inline-flex size-[45px] select-none items-center justify-center overflow-hidden rounded-full bg-blackA1 align-middle"
                    style={{ marginLeft: "54px" }} // Add gap between text and avatar
                  >
                    <Avatar.Fallback
                      className="leading-1 flex size-full items-center justify-center bg-white text-[15px] font-medium text-violet11"
                      delayMs={600}
                    >
                      {issue.userEmail.charAt(0).toUpperCase()}
                    </Avatar.Fallback>
                  </Avatar.Root>
                </Flex>
              </Callout.Root>
            ))}
          </Flex>
        </Box>
      </ScrollArea>
    </div>
  );
};

export default NewIssues;
