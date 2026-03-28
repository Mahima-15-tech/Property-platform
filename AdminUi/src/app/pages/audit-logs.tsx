import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Search, Filter, Download } from "lucide-react";
import React from "react";

const logs = [
  { id: 1, action: "Property Created", user: "Admin", details: "Manhattan Tower Residences", timestamp: "2024-03-23 14:32", type: "create" },
  { id: 2, action: "KYC Approved", user: "Admin", details: "Sarah Johnson", timestamp: "2024-03-23 13:15", type: "approval" },
  { id: 3, action: "Transaction Processed", user: "System", details: "TX-001 - $50,000", timestamp: "2024-03-23 12:45", type: "transaction" },
  { id: 4, action: "User Suspended", user: "Admin", details: "david.kim@example.com", timestamp: "2024-03-23 11:20", type: "security" },
  { id: 5, action: "Settings Updated", user: "Admin", details: "Commission rates modified", timestamp: "2024-03-23 10:05", type: "update" },
  { id: 6, action: "Property Published", user: "Admin", details: "Bayview Apartments", timestamp: "2024-03-22 16:40", type: "create" },
  { id: 7, action: "Broker Approved", user: "Admin", details: "John Smith", timestamp: "2024-03-22 15:10", type: "approval" },
  { id: 8, action: "Payout Processed", user: "System", details: "$2,500 to Alex Turner", timestamp: "2024-03-22 14:25", type: "transaction" },
];

const typeColors = {
  create: "bg-success/10 text-success",
  approval: "bg-primary/10 text-primary",
  transaction: "bg-warning/10 text-warning",
  security: "bg-destructive/10 text-destructive",
  update: "bg-accent text-accent-foreground",
};

export function AuditLogs() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">Track all system activities and changes</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Logs
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search logs..." className="pl-10" />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell className="text-muted-foreground">{log.details}</TableCell>
                  <TableCell className="text-sm">{log.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={typeColors[log.type as keyof typeof typeColors]}>
                      {log.type}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
