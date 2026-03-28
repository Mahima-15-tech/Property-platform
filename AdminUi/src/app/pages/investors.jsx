import { useState, useEffect } from "react";
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
import { Card } from "../components/ui/card";
import { StatusBadge } from "../components/status-badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet";
import { Search, Filter, Download, Eye, Check, X } from "lucide-react";
import React from "react";
import { getInvestors, getInvestorDetails, updateKyc, exportInvestors } from "../../api/user";
import { toast } from "sonner";


export function Investors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [kycFilter, setKycFilter] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);


const filteredInvestors = investors.filter((investor) => {
  const matchSearch =
    investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    investor.email.toLowerCase().includes(searchQuery.toLowerCase());

  const matchKyc = kycFilter
    ? investor.kycStatus === kycFilter
    : true;

  return matchSearch && matchKyc;
});

const currentInvestors = filteredInvestors;

const paginate = (pageNumber) => setPage(pageNumber);

useEffect(() => {
  fetchInvestors();
}, [page]);
  
  const fetchInvestors = async () => {
    const res = await getInvestors(page);
    setInvestors(
      res.data.data.sort(
        (a, b) => new Date(b.joinDate) - new Date(a.joinDate)
      )
    );
    setTotalPages(res.data.totalPages);
  };


  const handleView = async (id) => {
    try {
      const res = await getInvestorDetails(id);
      setSelectedInvestor(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleKyc = async (id, status) => {
    try {
      await updateKyc(id, status);
      toast.success(`KYC ${status}`);
      fetchInvestors();
    } catch {
      toast.error("Failed");
    }
  };

  const handleExport = async () => {
    try {
      const res = await exportInvestors();
  
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
  
      link.href = url;
      link.setAttribute("download", "investors.pdf");
  
      document.body.appendChild(link);
      link.click();
  
    } catch (err) {
      console.log(err);
      toast.error("Export failed");
    }
  };
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Investors</h1>
          <p className="text-muted-foreground mt-1">
            Manage investor accounts and KYC verification
          </p>
        </div>

        <Button onClick={handleExport} className="gap-2">
  <Download className="h-4 w-4" />
  Export PDF
</Button>
      </div>

      {/* FILTERS */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search investors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

    
            <Filter className="h-8 w-4" />
            <select
  className="border rounded-lg px-3 py-2 text-sm bg-background"
  onChange={(e) => setKycFilter(e.target.value)}
>
  <option value="">All</option>
  <option value="approved">Approved</option>
  <option value="pending">Pending</option>
  <option value="rejected">Rejected</option>
</select>
          
        </div>
      </Card>

      {/* TABLE */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total Invested</TableHead>
                <TableHead>Properties</TableHead>
                <TableHead>Avg ROI</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentInvestors.map((investor) => (
                <TableRow key={investor._id}  className="hover:bg-muted/50 transition-all duration-200">
                  <TableCell className="font-medium">{investor.name}</TableCell>
                  <TableCell>{investor.email}</TableCell>
                  <TableCell className="font-semibold text-primary">
  {investor.totalInvested}
</TableCell>
                  <TableCell>{investor.properties}</TableCell>
                  <TableCell className="text-green-600 font-medium">
  {investor.avgROI}
</TableCell>
                  <TableCell>
                  <StatusBadge status={investor.kycStatus} className="shadow-sm" />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                  {new Date(investor.joinDate).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(investor._id)}
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

      {/* SIDE PANEL */}
      <Sheet open={!!selectedInvestor} onOpenChange={() => setSelectedInvestor(null)}>
  <SheetContent className="w-full sm:max-w-lg p-4 overflow-y-auto bg-background">

    {selectedInvestor && (
      <>
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">
            Investor Details
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">

          {/* PROFILE */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border shadow-sm">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-white text-xl font-semibold shadow">
              {selectedInvestor.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                {selectedInvestor.user.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedInvestor.user.email}
              </p>
            </div>
          </div>

          {/* INFO GRID */}
          <div className="grid grid-cols-2 gap-4">

            <div className="p-4 rounded-xl bg-muted/40 border shadow-sm">
              <p className="text-xs text-muted-foreground">Total Invested</p>
              <p className="text-xl font-bold text-primary">
                {selectedInvestor.user.totalInvested}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border shadow-sm">
              <p className="text-xs text-muted-foreground">Properties</p>
              <p className="text-lg font-semibold">
                {selectedInvestor.user.properties}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border shadow-sm">
              <p className="text-xs text-muted-foreground">ROI</p>
              <p className="text-green-600 font-semibold">
                {selectedInvestor.user.avgROI}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border shadow-sm">
              <p className="text-xs text-muted-foreground">KYC</p>
              <StatusBadge status={selectedInvestor.user.kycStatus} />
            </div>

          </div>

          {/* PHONE */}
          <div className="p-4 rounded-xl bg-muted/40 border shadow-sm">
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="font-medium">{selectedInvestor.user.phone}</p>
          </div>

          {/* INVESTMENTS */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Recent Investments</h4>

            <div className="space-y-3">

              {selectedInvestor.investments.map((inv, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border bg-muted/30 hover:bg-muted/50 transition-all duration-200 shadow-sm"
                >
                  <div className="flex justify-between items-center">

                    {/* LEFT */}
                    <div>
                      <p className="font-medium text-sm">
                        {inv.propertyId?.name || "Property"}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Invested Amount
                      </p>
                    </div>

                    {/* RIGHT */}
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        ₹ {inv.amount}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* ACTION BUTTONS */}
          {selectedInvestor.user.kycStatus === "pending" && (
            <div className="flex gap-3 pt-4 border-t">

              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() =>
                  handleKyc(selectedInvestor.user._id, "approved")
                }
              >
                Approve
              </Button>

              <Button
                variant="destructive"
                className="flex-1"
                onClick={() =>
                  handleKyc(selectedInvestor.user._id, "rejected")
                }
              >
                Reject
              </Button>

            </div>
          )}

        </div>
      </>
    )}
  </SheetContent>
</Sheet>

<div className="flex items-center justify-between mt-6 flex-wrap gap-4">

  {/* LEFT INFO */}
  <div className="text-sm text-muted-foreground">
  Page {page} of {totalPages}
</div>

  {/* PAGINATION */}
  <div className="flex items-center gap-2">

    {/* PREV */}
    <button
      onClick={() => paginate(page - 1)}
      disabled={page === 1}
      className={`px-3 py-1 rounded-lg border text-sm transition
        ${page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-muted"}`}
    >
      ←
    </button>

    {/* PAGE NUMBERS */}
    {[...Array(totalPages)].map((_, i) => {
      const p = i + 1;
      return (
        <button
          key={p}
          onClick={() => paginate(p)}
          className={`px-3 py-1 rounded-lg text-sm transition
            ${
              page === p
                ? "bg-primary text-white shadow-md"
                : "hover:bg-muted border"
            }`}
        >
          {p}
        </button>
      );
    })}

    {/* NEXT */}
    <button
      onClick={() => paginate(page + 1)}
      disabled={page === totalPages}
      className={`px-3 py-1 rounded-lg border text-sm transition
        ${page === totalPages
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-muted"}`}
    >
      →
    </button>

  </div>
</div>
    </div>
  );
}