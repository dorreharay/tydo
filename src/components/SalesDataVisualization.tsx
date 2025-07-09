import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer } from '@/components/ui/chart';
import dayjs from 'dayjs';

interface SalesData {
  date: string;
  revenue: number;
  units: number;
  customers: number;
  products?: number;
  returns?: number;
  avgOrderValue?: number;
  newCustomers?: number;
  returningCustomers?: number;
}

const generateSalesData = (period: 'week' | 'month' | 'quarter', type: 'sales' | 'products' | 'customers' | 'general' = 'sales'): SalesData[] => {
  const now = dayjs();
  const data: SalesData[] = [];
  
  let days = 7;
  if (period === 'month') days = 30;
  if (period === 'quarter') days = 90;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = now.subtract(i, 'day');
    const baseRevenue = 5000 + Math.random() * 3000;
    const growthFactor = 1 + (0.12 / days) * (days - i); // 12% growth trend
    
    const units = Math.round(40 + Math.random() * 30);
    const customers = Math.round(20 + Math.random() * 15);
    
    data.push({
      date: date.format('MMM DD'),
      revenue: Math.round(baseRevenue * growthFactor),
      units,
      customers,
      products: Math.round(15 + Math.random() * 10),
      returns: Math.round(2 + Math.random() * 5),
      avgOrderValue: Math.round((baseRevenue * growthFactor) / units),
      newCustomers: Math.round(customers * 0.3),
      returningCustomers: Math.round(customers * 0.7),
    });
  }
  
  return data;
};

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "oklch(var(--chart-1))",
  },
  units: {
    label: "Units Sold",
    color: "oklch(var(--chart-2))",
  },
  customers: {
    label: "Customers",
    color: "oklch(var(--chart-3))",
  },
  products: {
    label: "Products",
    color: "oklch(var(--chart-4))",
  },
  returns: {
    label: "Returns",
    color: "oklch(var(--chart-5))",
  },
  avgOrderValue: {
    label: "Avg Order Value",
    color: "oklch(var(--chart-1))",
  },
  newCustomers: {
    label: "New Customers",
    color: "oklch(var(--chart-2))",
  },
  returningCustomers: {
    label: "Returning Customers",
    color: "oklch(var(--chart-3))",
  },
} as const;

interface SalesDataVisualizationProps {
  showTable?: boolean;
  defaultPeriod?: 'week' | 'month' | 'quarter';
  visualizationType?: 'sales' | 'products' | 'customers' | 'general';
}

export function SalesDataVisualization({ 
  showTable = true, 
  defaultPeriod = 'week',
  visualizationType = 'sales'
}: SalesDataVisualizationProps) {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>(defaultPeriod);
  const salesData = generateSalesData(period, visualizationType);
  
  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
  const totalUnits = salesData.reduce((sum, day) => sum + day.units, 0);
  const avgRevenue = Math.round(totalRevenue / salesData.length);
  const totalCustomers = salesData.reduce((sum, day) => sum + day.customers, 0);
  const totalProducts = salesData.reduce((sum, day) => sum + (day.products || 0), 0);
  const totalReturns = salesData.reduce((sum, day) => sum + (day.returns || 0), 0);
  const avgOrderValue = Math.round(salesData.reduce((sum, day) => sum + (day.avgOrderValue || 0), 0) / salesData.length);
  
  return (
    <div className="w-full space-y-4">
      <Tabs value={period} onValueChange={(value) => setPeriod(value as 'week' | 'month' | 'quarter')}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="week">Last Week</TabsTrigger>
          <TabsTrigger value="month">Last Month</TabsTrigger>
          <TabsTrigger value="quarter">Last Quarter</TabsTrigger>
        </TabsList>
        
        <TabsContent value={period} className="space-y-4">
          {/* Dynamic Charts Based on Visualization Type */}
          {(visualizationType === 'sales' || visualizationType === 'general') && (
            <>
              {/* Revenue Trend Line Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>
                    Daily revenue for the last {period === 'week' ? '7 days' : period === 'month' ? '30 days' : '90 days'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="date" 
                          className="text-xs"
                          tick={{ fill: 'currentColor' }}
                        />
                        <YAxis 
                          className="text-xs"
                          tick={{ fill: 'currentColor' }}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="var(--color-revenue)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Units and Customers Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                  <CardDescription>
                    Units sold and customer count for the last {period === 'week' ? '7 days' : period === 'month' ? '30 days' : '90 days'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="date" 
                          className="text-xs"
                          tick={{ fill: 'currentColor' }}
                        />
                        <YAxis 
                          className="text-xs"
                          tick={{ fill: 'currentColor' }}
                        />
                        <Bar
                          dataKey="units"
                          fill="var(--color-units)"
                          radius={[8, 8, 0, 0]}
                        />
                        <Bar
                          dataKey="customers"
                          fill="var(--color-customers)"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </>
          )}

          {visualizationType === 'products' && (
            <>
              {/* Product Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Performance</CardTitle>
                  <CardDescription>
                    Product sales and returns for the last {period === 'week' ? '7 days' : period === 'month' ? '30 days' : '90 days'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="date" 
                          className="text-xs"
                          tick={{ fill: 'currentColor' }}
                        />
                        <YAxis 
                          className="text-xs"
                          tick={{ fill: 'currentColor' }}
                        />
                        <Bar
                          dataKey="products"
                          fill="var(--color-products)"
                          radius={[8, 8, 0, 0]}
                        />
                        <Bar
                          dataKey="returns"
                          fill="var(--color-returns)"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Average Order Value Line Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Average Order Value</CardTitle>
                  <CardDescription>
                    Order value trends for the last {period === 'week' ? '7 days' : period === 'month' ? '30 days' : '90 days'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="date" 
                          className="text-xs"
                          tick={{ fill: 'currentColor' }}
                        />
                        <YAxis 
                          className="text-xs"
                          tick={{ fill: 'currentColor' }}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="avgOrderValue"
                          stroke="var(--color-avgOrderValue)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </>
          )}

          {visualizationType === 'customers' && (
            <>
              {/* Customer Analytics Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Analytics</CardTitle>
                  <CardDescription>
                    New vs returning customers for the last {period === 'week' ? '7 days' : period === 'month' ? '30 days' : '90 days'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="date" 
                          className="text-xs"
                          tick={{ fill: 'currentColor' }}
                        />
                        <YAxis 
                          className="text-xs"
                          tick={{ fill: 'currentColor' }}
                        />
                        <Bar
                          dataKey="newCustomers"
                          fill="var(--color-newCustomers)"
                          radius={[8, 8, 0, 0]}
                        />
                        <Bar
                          dataKey="returningCustomers"
                          fill="var(--color-returningCustomers)"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Customer Revenue Line Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue per Customer</CardTitle>
                  <CardDescription>
                    Average revenue per customer for the last {period === 'week' ? '7 days' : period === 'month' ? '30 days' : '90 days'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="date" 
                          className="text-xs"
                          tick={{ fill: 'currentColor' }}
                        />
                        <YAxis 
                          className="text-xs"
                          tick={{ fill: 'currentColor' }}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="avgOrderValue"
                          stroke="var(--color-revenue)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </>
          )}
          
          {/* Dynamic Summary Cards Based on Visualization Type */}
          <div className="grid gap-4 md:grid-cols-3">
            {(visualizationType === 'sales' || visualizationType === 'general') && (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Revenue</CardDescription>
                    <CardTitle className="text-2xl">${totalRevenue.toLocaleString()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">+12% from previous period</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Units Sold</CardDescription>
                    <CardTitle className="text-2xl">{totalUnits.toLocaleString()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">+8% from previous period</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Avg Daily Revenue</CardDescription>
                    <CardTitle className="text-2xl">${avgRevenue.toLocaleString()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">+25% conversion rate</p>
                  </CardContent>
                </Card>
              </>
            )}
            
            {visualizationType === 'products' && (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Products Sold</CardDescription>
                    <CardTitle className="text-2xl">{totalProducts.toLocaleString()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">+15% from previous period</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Return Rate</CardDescription>
                    <CardTitle className="text-2xl">{((totalReturns / totalProducts) * 100).toFixed(1)}%</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">-2% from previous period</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Avg Order Value</CardDescription>
                    <CardTitle className="text-2xl">${avgOrderValue.toLocaleString()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">+5% from previous period</p>
                  </CardContent>
                </Card>
              </>
            )}
            
            {visualizationType === 'customers' && (
              <>
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Customers</CardDescription>
                    <CardTitle className="text-2xl">{totalCustomers.toLocaleString()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">+20% from previous period</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Customer Retention</CardDescription>
                    <CardTitle className="text-2xl">68%</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">+5% from previous period</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Avg Revenue/Customer</CardDescription>
                    <CardTitle className="text-2xl">${Math.round(totalRevenue / totalCustomers).toLocaleString()}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">+10% from previous period</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          
          {showTable && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Sales Data</CardTitle>
                <CardDescription>Day-by-day breakdown of sales metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Units Sold</TableHead>
                      <TableHead className="text-right">Customers</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.slice(-7).reverse().map((day) => (
                      <TableRow key={day.date}>
                        <TableCell className="font-medium">{day.date}</TableCell>
                        <TableCell className="text-right">${day.revenue.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{day.units}</TableCell>
                        <TableCell className="text-right">{day.customers}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}