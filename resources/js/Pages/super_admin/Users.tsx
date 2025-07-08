import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import DataTable from "@/Components/ui/datatable";
import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import DataTableColumnHeader from "@/Components/ui/datatableheader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { MoreHorizontal, Trash, Mail, Phone, User, BriefcaseBusiness, Home, Plus, Edit2, CheckCircle, CircleOff } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table"
import axios from 'axios';
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { Toaster, toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Switch } from "@/Components/ui/switch";

interface UserProps extends PageProps {
  users: User[]
}
interface User {
  id: number;
  name: string;
  role: string,
  is_active: boolean;
}
interface DetailedUser {
  id: number;
  fullname: string;
  role: string;
  email: string;
  is_active: boolean;
  Manager?: {
    id: number;
    name: string;
    email: string;
  }
}

export default function UsersPage({ auth, users: initialUsers }: UserProps) {
  const [users, setUsers] = useState<User[]>(initialUsers || []);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailedUser, setDetailedUser] = useState<DetailedUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'admin',
    password: '',
    password_confirmation: ''
  });

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Full Name" />
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => {
        const role = row.original.role;
        let badgeVariant: "default" | "secondary" | "outline" = "default";

        switch (role) {
          case "super_admin":
            badgeVariant = "default";
            break;
          case "admin":
            badgeVariant = "secondary";
            break;
          case "userr":
            badgeVariant = "outline";
            break;
        }

        return (
          <Badge variant={badgeVariant} className="capitalize">
            {role.replace('_', ' ')}
          </Badge>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const isActive = row.original.is_active;
        return (
          <Badge variant={isActive ? "default" : "secondary"} className="capitalize">
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row }) => {
        const user = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedUser(user);
                    setIsEditDialogOpen(true);
                  }}
                  disabled={isLoading}
                >
                  <Edit2 className="h-4 w-4" />
                  {isLoading ? "Updating..." : "Update User"}
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button variant="destructive" onClick={() => handleDeleteUser(user.id)} disabled={isLoading}>
                  <Trash className="h-4 w-4" />
                  {isLoading ? "Deleting..." : "Delete User"}
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ];

  const fetchUserDetails = async (userId: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`/user/${userId}`);
      setDetailedUser(response.data.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'admin',
      password: '',
      password_confirmation: ''
    });
  };

  const handleAddUser = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/user/add', {
        ...formData,
      });

      if (response.data) {
        const newUser: User = {
          id: response.data.data.id,
          name: response.data.data.name,
          role: response.data.data.role,
          is_active: response.data.is_active
        };

        setUsers(prev => [...prev, newUser]);
        setIsAddDialogOpen(false);
        resetForm();
        toast.success(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 422) {
          const validationErrors = error.response.data.errors;
          let errorMessage = "Validation failed:";

          Object.keys(validationErrors).forEach(field => {
            errorMessage += `\n- ${validationErrors[field][0]}`;
          });

          toast.error(errorMessage);
        } else {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`/user/delete/${userId}`);

      setUsers(prev => prev.filter(user => user.id !== userId));

      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(null);
        setDetailedUser(null);
      }

      toast.success(response.data?.message);

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Handle authorization error
        if (error.response.status === 403) {
          toast.error(error.response.data?.message || "You don't have permission to delete this user");
        } else {
          toast.error(
            error.response.data?.message
          );
        }
      } else {
        toast.error("An unexpected error occurred while deleting the user");
        console.error("Delete user error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserStatusToggle = async (userId: number, currentStatus: boolean) => {
    setIsUpdatingStatus(true);
    try {
      const response = await axios.patch(`/user/${userId}/update`, {
        is_active: !currentStatus
      });

      setUsers(prev => prev.map(user =>
        user.id === userId
          ? { ...user, is_active: !currentStatus }
          : user
      ));

      // Update selected user if it's the same user
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(prev => prev ? { ...prev, is_active: !currentStatus } : null);
      }

      toast.success(response.data?.message || `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      setIsEditDialogOpen(false);

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 403) {
          toast.error(error.response.data?.message || "You don't have permission to update this user");
        } else {
          toast.error(error.response.data?.message || "Failed to update user status");
        }
      } else {
        toast.error("An unexpected error occurred while updating user status");
        console.error("Update user status error:", error);
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchUserDetails(selectedUser.id);
    }
  }, [selectedUser]);

  // reset the form when dialog closes
  useEffect(() => {
    if (isAddDialogOpen === false) {
      const timer = setTimeout(() => {
        resetForm();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isAddDialogOpen]);

  return (
    <AuthenticatedLayout
      user={{
        id: auth.user.id,
        name: auth.user.name,
        role: auth.user.role,
        email: auth.user.email,
        avatar: auth.user.avatar
      }}
    >
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[70%] border rounded-lg md:max-w-[70%] lg:max-w-[60%] xl:max-w-[40%] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
                <DialogDescription>
                  Enter the details for the new Admin. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="e.g., john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                    <Input
                      id="password_confirmation"
                      name="password_confirmation"
                      type="password"
                      placeholder="Confirm password"
                      value={formData.password_confirmation}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Add Admin"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  Click on a user to view their details in the side panel.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={columns}
                  data={users}
                  onRowClick={(row) => setSelectedUser(row.original)}
                  searchKey="name"
                />
              </CardContent>
            </Card>
          </div>

          <div className="w-full lg:w-1/3">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>User Details</CardTitle>
                <CardDescription>
                  {selectedUser ? `Information about ${selectedUser.name}` : 'Select a user to view details'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedUser ? (
                  loading ? (
                    <div className="flex justify-center items-center h-[300px]">
                      <div className="animate-pulse text-gray-500">Loading details...</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center mb-4">
                        <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-10 w-10 text-gray-500" />
                        </div>
                      </div>

                      <div className="text-center mb-2">
                        <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                        <Badge variant="outline" className="mt-1 capitalize">
                          {selectedUser.role.replace('_', ' ')}
                        </Badge>
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{detailedUser?.email || 'Email not available'}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {detailedUser?.is_active ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <CircleOff className="h-4 w-4 text-red-600" />
                          )}
                          <span
                            className={
                              detailedUser?.is_active
                                ? "text-sm text-green-600 font-semibold"
                                : "text-sm text-red-600 font-semibold"
                            }
                          >
                            {detailedUser?.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>

                        {detailedUser?.Manager && (
                          <div className="flex items-center gap-2">
                            <BriefcaseBusiness className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">
                              {detailedUser.Manager.name}
                            </span>
                          </div>
                        )}

                        {detailedUser?.Manager && (
                          <div className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-700">Unit: {detailedUser.Manager.email}</span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <div className="pt-2">
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <User className="h-16 w-16 text-gray-300 mb-4" />
                    <p className="text-gray-500">Select a user from the table to view their details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedUser?.is_active ? 'Deactivate' : 'Activate'} User
                </DialogTitle>
                <DialogDescription>
                  Toggle the switch to {selectedUser?.is_active ? 'deactivate' : 'activate'} this user account.
                </DialogDescription>
              </DialogHeader>

              <div className="py-6">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="user-status" className="text-sm font-medium">
                      User Status
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedUser?.is_active ? 'User is currently active' : 'User is currently inactive'}
                    </p>
                  </div>
                  <Switch
                    id="user-status"
                    checked={selectedUser?.is_active || false}
                    onCheckedChange={(checked) => {
                      if (selectedUser) {
                        handleUserStatusToggle(selectedUser.id, selectedUser.is_active);
                      }
                    }}
                    disabled={isUpdatingStatus}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}