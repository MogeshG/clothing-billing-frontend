import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

const SectionCard = ({ title, children }: SectionCardProps) => (
  <Card
    elevation={0}
    sx={{
      height: "100%",
      borderRadius: 3,
      border: "1px solid",
      borderColor: "grey.200",
      bgcolor: "#fff",
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Typography variant="h6" className="font-semibold" gutterBottom>
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

export default SectionCard;
