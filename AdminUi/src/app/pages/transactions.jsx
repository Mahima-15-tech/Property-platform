import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { StatusBadge } from "../components/status-badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Search, Filter, Download, Eye } from "lucide-react";
import React from "react";
import {getTransactions } from "../../api/transaction";
import { updateTransaction } from "../../api/transaction";



export function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);
  
  const fetchTransactions = async () => {
    const res = await getTransactions();
    setTransactions(res.data);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateTransaction(id, status);
  
      // refresh list
      fetchTransactions();
  
      // close dialog
      setSelectedTransaction(null);
  
    } catch (err) {
      console.log(err);
    }
  };

  const filteredTransactions = transactions.filter((tx) =>
    tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.investor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.property.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Transactions</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage all financial transactions</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Investor</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id} className="cursor-pointer hover:bg-accent/50">
                  <TableCell className="font-mono font-medium">{tx.id}</TableCell>
                  <TableCell>{tx.investor}</TableCell>
                  <TableCell>{tx.property}</TableCell>
                  <TableCell className="font-medium">{tx.amount}</TableCell>
                  <TableCell className="text-sm">
                    <div>{tx.date}</div>
                    <div className="text-muted-foreground">{tx.time}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{tx.method}</Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={tx.status} />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTransaction(tx)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Dialog */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="max-w-2xl">
          {selectedTransaction && (
            <>
              <DialogHeader>
                <DialogTitle>Transaction Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                    <p className="font-mono font-medium">{selectedTransaction.id}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    <StatusBadge status={selectedTransaction.status} />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Investor</p>
                    <p className="font-medium">{selectedTransaction.investor}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Property</p>
                    <p className="font-medium">{selectedTransaction.property}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Amount</p>
                    <p className="text-2xl font-semibold">{selectedTransaction.amount}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                    <Badge variant="secondary">{selectedTransaction.method}</Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date</p>
                    <p className="font-medium">{selectedTransaction.date}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Time</p>
                    <p className="font-medium">{selectedTransaction.time}</p>
                  </div>

                </div>

                {/* Timeline */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Timeline</h4>

                  <div className="space-y-4">

                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                      <div>
                        <p className="font-medium">Transaction Initiated</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedTransaction.date} at {selectedTransaction.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                      <div>
                        <p className="font-medium">Payment Verified</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedTransaction.date} at {selectedTransaction.time}
                        </p>
                      </div>
                    </div>

                    {selectedTransaction.status === "completed" && (
                      <div className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5" />
                        <div>
                          <p className="font-medium">Transaction Completed</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedTransaction.date} at {selectedTransaction.time}
                          </p>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* Actions */}
                {selectedTransaction.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
  className="flex-1"
  onClick={() =>
    handleStatusChange(selectedTransaction.mongoId, "completed")
  }
>
  Approve
</Button>

<Button
  variant="destructive"
  className="flex-1"
  onClick={() =>
    handleStatusChange(selectedTransaction.mongoId, "rejected")
  }
>
  Reject
</Button>
                  </div>
                )}

              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}