"use client"

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mockData = [
  { department: 'Sales', avgStress: 6, avgAttention: 7, avgProductivity: 8 },
  { department: 'Marketing', avgStress: 5, avgAttention: 8, avgProductivity: 7 },
  { department: 'Engineering', avgStress: 7, avgAttention: 9, avgProductivity: 9 },
  { department: 'HR', avgStress: 4, avgAttention: 7, avgProductivity: 8 },
  { department: 'Finance', avgStress: 8, avgAttention: 6, avgProductivity: 7 },
];

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-primary">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">250</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Stress Level</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">6.2 / 10</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Overall Productivity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">7.8 / 10</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Department Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Department Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgStress" fill="#8884d8" />
                  <Bar dataKey="avgAttention" fill="#82ca9d" />
                  <Bar dataKey="avgProductivity" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Add similar TabsContent for trends and reports */}
      </Tabs>
    </div>
  );
}