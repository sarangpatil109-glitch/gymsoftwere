"use client";

import { useState } from "react";
import { 
  Plus, Search, Building2, UserCheck, PackageOpen, 
  Clock, Eye, Edit, Trash2, MoreHorizontal 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Local Demo Data
const DEMO_SUPPLIERS = [
  {
    id: "SUP-001",
    name: "Optimum Nutrition Direct",
    contactPerson: "Michael Chang",
    mobile: "+1 (555) 123-4567",
    email: "orders@on-direct.com",
    address: "142 Fitness Blvd, Chicago, IL",
    gst: "GST-ON-482910",
    products: 45,
    status: "Active",
  },
  {
    id: "SUP-002",
    name: "MuscleTech Wholesale",
    contactPerson: "Sarah Jenkins",
    mobile: "+1 (555) 987-6543",
    email: "wholesale@muscletech.com",
    address: "89 Protein Way, Austin, TX",
    gst: "GST-MT-938210",
    products: 32,
    status: "Active",
  },
  {
    id: "SUP-003",
    name: "GymGear Pro",
    contactPerson: "David Smith",
    mobile: "+1 (555) 456-7890",
    email: "sales@gymgearpro.com",
    address: "220 Weight St, Miami, FL",
    gst: "GST-GGP-112233",
    products: 150,
    status: "Inactive",
  },
  {
    id: "SUP-004",
    name: "Pure Supplements",
    contactPerson: "Emma Wilson",
    mobile: "+1 (555) 333-2222",
    email: "emma@puresupps.com",
    address: "45 Health Rd, Seattle, WA",
    gst: "GST-PS-445566",
    products: 12,
    status: "Active",
  }
];

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredSuppliers = DEMO_SUPPLIERS.filter(sup => 
    sup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sup.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sup.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSuppliers = DEMO_SUPPLIERS.length;
  const activeSuppliers = DEMO_SUPPLIERS.filter(s => s.status === "Active").length;
  const totalProducts = DEMO_SUPPLIERS.reduce((acc, curr) => acc + curr.products, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
          <p className="text-muted-foreground mt-1">Manage all product suppliers.</p>
        </div>
        <Button className="shrink-0 bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Add Supplier
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Suppliers</p>
              <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">{totalSuppliers}</h3>
            </div>
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400">
              <Building2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Active Suppliers</p>
              <h3 className="text-2xl font-bold mt-1 text-emerald-600">{activeSuppliers}</h3>
            </div>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-emerald-600">
              <UserCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Products Supplied</p>
              <h3 className="text-2xl font-bold mt-1 text-blue-600">{totalProducts}</h3>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600">
              <PackageOpen className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Orders</p>
              <h3 className="text-2xl font-bold mt-1 text-amber-600">3</h3>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search suppliers by name, contact, or email..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Supplier Name</th>
                <th className="px-6 py-4 font-medium">Contact Person</th>
                <th className="px-6 py-4 font-medium">Contact Details</th>
                <th className="px-6 py-4 font-medium">Address & GST</th>
                <th className="px-6 py-4 font-medium text-center">Products</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No suppliers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-slate-100">{supplier.name}</div>
                      <div className="text-xs text-slate-500">{supplier.id}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      {supplier.contactPerson}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900 dark:text-slate-100">{supplier.mobile}</div>
                      <div className="text-xs text-slate-500">{supplier.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]" title={supplier.address}>{supplier.address}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{supplier.gst}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {supplier.products} Items
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant="outline" className={
                        supplier.status === "Active" 
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400" 
                          : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                      }>
                        {supplier.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" /> Edit Supplier
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
