import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Download, Calendar, TrendingUp } from "lucide-react";

const revenueData = [
  { month: "Jan", revenue: 245000, target: 200000 },
  { month: "Feb", revenue: 289000, target: 250000 },
  { month: "Mar", revenue: 312000, target: 300000 },
  { month: "Apr", revenue: 298000, target: 300000 },
  { month: "May", revenue: 356000, target: 350000 },
  { month: "Jun", revenue: 389000, target: 380000 },
];

const fundingData = [
  { month: "Jan", funded: 3, active: 5 },
  { month: "Feb", funded: 4, active: 6 },
  { month: "Mar", funded: 5, active: 7 },
  { month: "Apr", funded: 4, active: 8 },
  { month: "May", funded: 6, active: 9 },
  { month: "Jun", funded: 7, active: 8 },
];

const growthData = [
  { month: "Jan", investors: 145, properties: 12 },
  { month: "Feb", investors: 178, properties: 14 },
  { month: "Mar", investors: 203, properties: 17 },
  { month: "Apr", investors: 234, properties: 19 },
  { month: "May", investors: 267, properties: 22 },
  { month: "Jun", investors: 298, properties: 24 },
];

export function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">Analytics and performance reports</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="6months">
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-3xl font-semibold mb-2">$1.89M</p>
            <div className="flex items-center gap-1 text-sm text-success">
              <TrendingUp className="h-4 w-4" />
              <span>+12.5%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Properties Funded</p>
            <p className="text-3xl font-semibold mb-2">29</p>
            <div className="flex items-center gap-1 text-sm text-success">
              <TrendingUp className="h-4 w-4" />
              <span>+18%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">New Investors</p>
            <p className="text-3xl font-semibold mb-2">153</p>
            <div className="flex items-center gap-1 text-sm text-success">
              <TrendingUp className="h-4 w-4" />
              <span>+25%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Avg ROI</p>
            <p className="text-3xl font-semibold mb-2">11.8%</p>
            <div className="flex items-center gap-1 text-sm text-success">
              <TrendingUp className="h-4 w-4" />
              <span>+2.1%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Target</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0A2540" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0A2540" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6E8EC" />
              <XAxis dataKey="month" stroke="#717182" />
              <YAxis stroke="#717182" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E6E8EC",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0A2540"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#FFB020"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Funding & Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Funding Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fundingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E8EC" />
                <XAxis dataKey="month" stroke="#717182" />
                <YAxis stroke="#717182" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E6E8EC",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="funded" fill="#00C48C" radius={[8, 8, 0, 0]} name="Funded" />
                <Bar dataKey="active" fill="#0A2540" radius={[8, 8, 0, 0]} name="Active" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E6E8EC" />
                <XAxis dataKey="month" stroke="#717182" />
                <YAxis stroke="#717182" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E6E8EC",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="investors"
                  stroke="#0A2540"
                  strokeWidth={2}
                  name="Investors"
                />
                <Line
                  type="monotone"
                  dataKey="properties"
                  stroke="#00C48C"
                  strokeWidth={2}
                  name="Properties"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
